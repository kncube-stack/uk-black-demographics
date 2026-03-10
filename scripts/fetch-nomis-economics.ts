#!/usr/bin/env tsx

import fs from "fs/promises";
import path from "path";
import Papa from "papaparse";
import { formatNumber, formatPercent } from "../src/lib/format";
import type { DataObservation, Dataset, EthnicGroup, Sex } from "../src/lib/types";
import { fetchJson, fetchText } from "./utils/api-client";

type CsvRow = Record<string, string>;
type NomisStructure = {
  structure?: {
    codelists?: {
      codelist?: Array<{
        code?: Array<{
          value?: string | number;
          description?: {
            value?: string;
          };
        }>;
      }>;
    };
  };
};

type VariableDefinition = {
  ethnicGroup: EthnicGroup;
  metric: EconomicsMetric;
  sex: Sex;
};

type EconomicsMetric =
  | "employment_rate"
  | "unemployment_rate"
  | "inactivity_rate"
  | "occupation_share";

type OccupationKey =
  | "managers"
  | "professional"
  | "associate_professional"
  | "administrative"
  | "skilled_trades"
  | "caring_leisure_service"
  | "sales_customer_service"
  | "process_plant_machine"
  | "elementary";

const DATASET_ID = "NM_17_5";
const DATASET_URL = `https://www.nomisweb.co.uk/api/v01/dataset/${DATASET_ID}`;
const OUTPUT_ROOT = path.join(
  process.cwd(),
  "data",
  "fetched",
  "nomis",
  "economics"
);

const CURRENT_DATE = new Date().toISOString().slice(0, 10);
const NATIONAL_GEOGRAPHY = "K02000001";

const NATIONAL_VARIABLES: Record<number, VariableDefinition> = {
  45: {
    ethnicGroup: "all_ethnicities",
    metric: "employment_rate",
    sex: "all",
  },
  83: {
    ethnicGroup: "all_ethnicities",
    metric: "unemployment_rate",
    sex: "all",
  },
  111: {
    ethnicGroup: "all_ethnicities",
    metric: "inactivity_rate",
    sex: "all",
  },
  807: {
    ethnicGroup: "all_black",
    metric: "employment_rate",
    sex: "all",
  },
  812: {
    ethnicGroup: "all_black",
    metric: "employment_rate",
    sex: "male",
  },
  817: {
    ethnicGroup: "all_black",
    metric: "employment_rate",
    sex: "female",
  },
  828: {
    ethnicGroup: "all_black",
    metric: "unemployment_rate",
    sex: "all",
  },
  833: {
    ethnicGroup: "all_black",
    metric: "unemployment_rate",
    sex: "male",
  },
  838: {
    ethnicGroup: "all_black",
    metric: "unemployment_rate",
    sex: "female",
  },
  849: {
    ethnicGroup: "all_black",
    metric: "inactivity_rate",
    sex: "all",
  },
  854: {
    ethnicGroup: "all_black",
    metric: "inactivity_rate",
    sex: "male",
  },
  859: {
    ethnicGroup: "all_black",
    metric: "inactivity_rate",
    sex: "female",
  },
};

const REGIONAL_VARIABLES: Record<number, VariableDefinition> = {
  45: {
    ethnicGroup: "all_ethnicities",
    metric: "employment_rate",
    sex: "all",
  },
  83: {
    ethnicGroup: "all_ethnicities",
    metric: "unemployment_rate",
    sex: "all",
  },
  111: {
    ethnicGroup: "all_ethnicities",
    metric: "inactivity_rate",
    sex: "all",
  },
  807: {
    ethnicGroup: "all_black",
    metric: "employment_rate",
    sex: "all",
  },
  828: {
    ethnicGroup: "all_black",
    metric: "unemployment_rate",
    sex: "all",
  },
  849: {
    ethnicGroup: "all_black",
    metric: "inactivity_rate",
    sex: "all",
  },
};

const OCCUPATION_VARIABLES: Record<number, { ethnicGroup: EthnicGroup; occupation: OccupationKey }> = {
  1054: { ethnicGroup: "all_black", occupation: "managers" },
  1055: { ethnicGroup: "all_black", occupation: "professional" },
  1056: { ethnicGroup: "all_black", occupation: "associate_professional" },
  1057: { ethnicGroup: "all_black", occupation: "administrative" },
  1058: { ethnicGroup: "all_black", occupation: "skilled_trades" },
  1059: { ethnicGroup: "all_black", occupation: "caring_leisure_service" },
  1060: { ethnicGroup: "all_black", occupation: "sales_customer_service" },
  1061: { ethnicGroup: "all_black", occupation: "process_plant_machine" },
  1062: { ethnicGroup: "all_black", occupation: "elementary" },
  1815: { ethnicGroup: "all_ethnicities", occupation: "managers" },
  1816: { ethnicGroup: "all_ethnicities", occupation: "professional" },
  1817: { ethnicGroup: "all_ethnicities", occupation: "associate_professional" },
  1818: { ethnicGroup: "all_ethnicities", occupation: "administrative" },
  1819: { ethnicGroup: "all_ethnicities", occupation: "skilled_trades" },
  1820: { ethnicGroup: "all_ethnicities", occupation: "caring_leisure_service" },
  1821: { ethnicGroup: "all_ethnicities", occupation: "sales_customer_service" },
  1822: { ethnicGroup: "all_ethnicities", occupation: "process_plant_machine" },
  1823: { ethnicGroup: "all_ethnicities", occupation: "elementary" },
};

async function main() {
  await fs.mkdir(OUTPUT_ROOT, { recursive: true });

  const [timeEntries, overview] = await Promise.all([
    fetchTimeEntries(),
    fetchOverview(),
  ]);
  const timeCodes = timeEntries.map((entry) => entry.code);
  const latestTimeCode = timeCodes[timeCodes.length - 1];

  if (!latestTimeCode) {
    throw new Error("APS dataset did not return any time codes.");
  }

  const previousComparableTimeCode =
    timeCodes.find((code) => code === `${Number.parseInt(latestTimeCode.slice(0, 4), 10) - 1}${latestTimeCode.slice(4)}`) ??
    timeCodes[timeCodes.length - 2];

  if (!previousComparableTimeCode) {
    throw new Error("APS dataset did not return a previous comparable time code.");
  }

  const latestTimeName = timeEntries.find((entry) => entry.code === latestTimeCode)?.label;
  const previousTimeName = timeEntries.find(
    (entry) => entry.code === previousComparableTimeCode
  )?.label;

  if (!latestTimeName || !previousTimeName) {
    throw new Error("Unable to resolve APS time labels for the selected slices.");
  }

  const metadata = createMetadata(
    overview,
    latestTimeName,
    latestTimeCode
  );

  await writeDataset(
    "aps-labour-market-rates-national.json",
    createNationalDataset(
      metadata,
      latestTimeCode,
      previousComparableTimeCode,
      latestTimeName,
      previousTimeName
    )
  );
  await writeDataset(
    "aps-labour-market-rates-by-region.json",
    createRegionalDataset(metadata, latestTimeCode, latestTimeName)
  );
  await writeDataset(
    "aps-occupation-profile-national.json",
    createOccupationDataset(metadata, latestTimeCode, latestTimeName)
  );
}

async function createNationalDataset(
  metadata: Dataset["metadata"],
  latestTimeCode: string,
  previousTimeCode: string,
  latestTimeName: string,
  previousTimeName: string
): Promise<Dataset> {
  const csv = await fetchText(
    buildDataUrl({
      date: [latestTimeCode, previousTimeCode],
      geography: [NATIONAL_GEOGRAPHY],
      variable: Object.keys(NATIONAL_VARIABLES).map(String),
      measures: ["20599", "21001", "21002", "21003"],
    })
  );
  const parsed = parseCsv(csv, "national labour market rates");
  const observations = parsed.flatMap((row) =>
    createLabourRateObservations(row, NATIONAL_VARIABLES, "national", {
      [latestTimeCode]: latestTimeName,
      [previousTimeCode]: previousTimeName,
    })
  );

  return {
    id: "nomis-aps-labour-market-rates-national",
    title: "Labour Market Rates by Broad Black Group",
    description:
      "Great Britain national labour-market rates from the Nomis Annual Population Survey percentages dataset, covering employment, unemployment, and economic inactivity for the broad Black or Black British group and the all-population baseline.",
    siteCategory: "economics",
    siteSubcategory: "employment",
    metadata,
    dimensions: ["ethnicGroup", "geography", "timePeriod", "sex", "metric", "measure"],
    observations,
  };
}

async function createRegionalDataset(
  metadata: Dataset["metadata"],
  latestTimeCode: string,
  latestTimeName: string
): Promise<Dataset> {
  const csv = await fetchText(
    buildDataUrl({
      date: [latestTimeCode],
      geography: ["TYPE480"],
      variable: Object.keys(REGIONAL_VARIABLES).map(String),
      measures: ["20599", "21001", "21002", "21003"],
    })
  );
  const parsed = parseCsv(csv, "regional labour market rates");
  const observations = parsed.flatMap((row) =>
    createLabourRateObservations(row, REGIONAL_VARIABLES, "regional", {
      [latestTimeCode]: latestTimeName,
    })
  );

  return {
    id: "nomis-aps-labour-market-rates-by-region",
    title: "Labour Market Rates by Region and Broad Black Group",
    description:
      "Regional labour-market rates from the Nomis Annual Population Survey percentages dataset, comparing the broad Black or Black British group with the all-population baseline across Great Britain regions and countries.",
    siteCategory: "economics",
    siteSubcategory: "employment",
    metadata,
    dimensions: ["ethnicGroup", "geography", "timePeriod", "metric", "measure"],
    observations,
  };
}

async function createOccupationDataset(
  metadata: Dataset["metadata"],
  latestTimeCode: string,
  latestTimeName: string
): Promise<Dataset> {
  const csv = await fetchText(
    buildDataUrl({
      date: [latestTimeCode],
      geography: [NATIONAL_GEOGRAPHY],
      variable: Object.keys(OCCUPATION_VARIABLES).map(String),
      measures: ["20599"],
    })
  );
  const parsed = parseCsv(csv, "national occupation profile");
  const observations = parsed.flatMap((row) => {
    const code = Number.parseInt(requiredField(row, "VARIABLE_CODE"), 10);
    const config = OCCUPATION_VARIABLES[code];

    if (!config) {
      return [];
    }

    return [
      {
        ethnicGroup: config.ethnicGroup,
        geography: {
          code: requiredField(row, "GEOGRAPHY_CODE"),
          name: requiredField(row, "GEOGRAPHY_NAME"),
          level: "national",
        },
        timePeriod: latestTimeCode,
        attributes: {
          metric: "occupation_share",
          measure: "value",
          occupation: config.occupation,
          time_label: latestTimeName,
          source_variable_code: String(code),
          source_variable_name: requiredField(row, "VARIABLE_NAME"),
          obs_status: requiredField(row, "OBS_STATUS"),
          obs_status_name: requiredField(row, "OBS_STATUS_NAME"),
        },
        value: createValuePoint(row, "percentage"),
      } satisfies DataObservation,
    ];
  });

  return {
    id: "nomis-aps-occupation-profile-national",
    title: "Occupation Profile by Broad Black Group",
    description:
      "Great Britain occupation shares from the Nomis Annual Population Survey percentages dataset, comparing the broad Black or Black British group with the all-population employed baseline using SOC2020 major groups.",
    siteCategory: "economics",
    siteSubcategory: "employment",
    metadata,
    dimensions: ["ethnicGroup", "geography", "timePeriod", "occupation"],
    observations,
  };
}

function createLabourRateObservations(
  row: CsvRow,
  definitions: Record<number, VariableDefinition>,
  geographyLevel: "national" | "regional",
  timeNames: Record<string, string>
): DataObservation[] {
  const variableCode = Number.parseInt(requiredField(row, "VARIABLE_CODE"), 10);
  const definition = definitions[variableCode];

  if (!definition) {
    return [];
  }

  const timeCode = requiredField(row, "DATE_CODE");
  const measureCode = requiredField(row, "MEASURES");

  return [
    {
      ethnicGroup: definition.ethnicGroup,
      geography: {
        code: requiredField(row, "GEOGRAPHY_CODE"),
        name: requiredField(row, "GEOGRAPHY_NAME"),
        level: geographyLevel,
      },
      timePeriod: timeCode,
      sex: definition.sex,
      attributes: {
        metric: definition.metric,
        measure: mapMeasureCode(measureCode),
        time_label: timeNames[timeCode] ?? requiredField(row, "DATE_NAME"),
        source_variable_code: String(variableCode),
        source_variable_name: requiredField(row, "VARIABLE_NAME"),
        obs_status: requiredField(row, "OBS_STATUS"),
        obs_status_name: requiredField(row, "OBS_STATUS_NAME"),
      },
      value: createValuePoint(
        row,
        measureCode === "20599" || measureCode === "21003" ? "percentage" : "count"
      ),
    },
  ];
}

function createValuePoint(
  row: CsvRow,
  unit: DataObservation["value"]["unit"]
): DataObservation["value"] {
  const raw = row["OBS_VALUE"];
  const status = requiredField(row, "OBS_STATUS");
  const statusName = requiredField(row, "OBS_STATUS_NAME");
  const unavailable = raw === undefined || raw === null || raw === "";

  if (unavailable) {
    return {
      value: 0,
      unit,
      suppressed: true,
      formatted: "[suppressed]",
      provisional: status === "P",
    };
  }

  const numericValue = Number.parseFloat(raw);

  if (!Number.isFinite(numericValue)) {
    throw new Error(`Invalid OBS_VALUE "${raw}" (${statusName})`);
  }

  return {
    value: numericValue,
    unit,
    formatted:
      unit === "count"
        ? formatNumber(numericValue)
        : unit === "percentage"
          ? formatPercent(numericValue, 1)
          : undefined,
    provisional: status === "P",
  };
}

function mapMeasureCode(code: string): string {
  switch (code) {
    case "20599":
      return "value";
    case "21001":
      return "numerator";
    case "21002":
      return "denominator";
    case "21003":
      return "confidence_margin";
    default:
      return code;
  }
}

function parseCsv(csv: string, context: string): CsvRow[] {
  const parsed = Papa.parse<CsvRow>(csv, {
    header: true,
    skipEmptyLines: true,
  });

  if (parsed.errors.length > 0) {
    throw new Error(
      `Failed to parse ${context}: ${parsed.errors[0]?.message ?? "unknown error"}`
    );
  }

  return parsed.data;
}

async function fetchTimeEntries(): Promise<Array<{ code: string; label: string }>> {
  const response = await fetchJson<NomisStructure>(
    `${DATASET_URL}/time.def.sdmx.json`
  );
  return (
    response.structure?.codelists?.codelist?.[0]?.code
      ?.map((item) => ({
        code: String(item.value),
        label: item.description?.value ?? String(item.value),
      }))
      .sort((left, right) => left.code.localeCompare(right.code)) ?? []
  );
}

async function fetchOverview(): Promise<{
  lastupdated: string;
  description: string;
  name?: string;
}> {
  const response = await fetchJson<{
    overview?: {
      lastupdated?: string;
      description?: string;
      name?: string;
    };
  }>(`${DATASET_URL}.overview.json`);

  if (!response.overview?.lastupdated || !response.overview?.description) {
    throw new Error("Missing APS overview metadata.");
  }

  return {
    lastupdated: response.overview.lastupdated,
    description: response.overview.description,
    name: response.overview.name,
  };
}

function createMetadata(
  overview: Awaited<ReturnType<typeof fetchOverview>>,
  latestTimeName: string,
  latestTimeCode: string
): Dataset["metadata"] {
  return {
    id: "nomis-aps-nm17-5",
    name: "Annual Population Survey (variables - percentages)",
    publisher: "Office for National Statistics via Nomis",
    url: "https://www.nomisweb.co.uk/datasets/apsnew",
    apiEndpoint: buildDataUrl({
      date: [latestTimeCode],
      geography: [NATIONAL_GEOGRAPHY],
      variable: ["45", "83", "111", "807", "828", "849"],
      measures: ["20599"],
    }),
    datePublished: overview.lastupdated.slice(0, 10),
    dateAccessed: CURRENT_DATE,
    referenceDate: latestTimeName,
    referencePeriod: latestTimeName,
    geographicCoverage: "United Kingdom",
    methodology:
      "Fetched from the Nomis Annual Population Survey percentages dataset (NM_17_5). APS estimates are rolling annual survey estimates. This implementation uses the current broad 'Black or Black British' variables because the live Nomis APS percentage dataset does not expose Black African, Black Caribbean, and Other Black rates separately for these labour-market measures.",
    qualityFlags: ["official_statistic"],
    caveats: [
      "The national slice uses the United Kingdom row, while the regional slice uses the UK regional and country breakdown that includes Northern Ireland.",
      "The current live APS percentage dataset exposes a broad Black or Black British group for these labour-market rates rather than separate Black African, Black Caribbean, and Other Black series.",
      "APS estimates are survey-based and confidence margins widen sharply for smaller populations and smaller geographies.",
    ],
    license: "Open Government Licence v3.0",
    fetchMethod: "csv_download",
  };
}

function buildDataUrl(params: {
  date: string[];
  geography: string[];
  variable: string[];
  measures: string[];
}) {
  const search = new URLSearchParams({
    date: params.date.join(","),
    geography: params.geography.join(","),
    variable: params.variable.join(","),
    measures: params.measures.join(","),
  });

  return `${DATASET_URL}.data.csv?${search.toString()}`;
}

async function writeDataset(filename: string, datasetPromise: Promise<Dataset>) {
  const dataset = await datasetPromise;
  const filePath = path.join(OUTPUT_ROOT, filename);
  await fs.writeFile(filePath, `${JSON.stringify(dataset, null, 2)}\n`, "utf8");
  console.log(
    `Wrote ${path.relative(process.cwd(), filePath)} (${dataset.observations.length} observations)`
  );
}

function requiredField(row: CsvRow, key: string): string {
  const value = row[key];

  if (value === undefined || value === null) {
    throw new Error(`Missing required field "${key}"`);
  }

  return value;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
