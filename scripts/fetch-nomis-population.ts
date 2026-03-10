#!/usr/bin/env tsx

import fs from "fs/promises";
import path from "path";
import Papa from "papaparse";
import { formatNumber } from "../src/lib/format";
import type {
  DataObservation,
  Dataset,
  EthnicGroup,
  GeographyLevel,
  Sex,
  GeographyUnit,
} from "../src/lib/types";
import { fetchText } from "./utils/api-client";

type GeographyConfig = {
  level: GeographyLevel;
  outputPath: string;
  siteSubcategory: string;
  title: string;
  description: string;
  geographyQuery: string;
};

type CsvRow = Record<string, string>;
type SourceEthnicGroup = Exclude<
  EthnicGroup,
  "all_black" | "all_black_including_mixed"
>;
type AgeGroupKey =
  | "all"
  | "24-and-under"
  | "25-34"
  | "35-49"
  | "50-64"
  | "65-plus";

const TS021_SOURCE_URL = "https://www.nomisweb.co.uk/datasets/c2021ts021";
const TS021_API_BASE_URL =
  "https://www.nomisweb.co.uk/api/v01/dataset/nm_2041_1.bulk.csv";
const RM032_SOURCE_URL = "https://www.nomisweb.co.uk/datasets/c2021rm032";
const RM032_API_URL =
  "https://www.nomisweb.co.uk/api/v01/dataset/nm_2132_1.data.csv";
const OUTPUT_ROOT = path.join(
  process.cwd(),
  "data",
  "fetched",
  "nomis",
  "population"
);

const CURRENT_DATE = new Date().toISOString().slice(0, 10);
const REFERENCE_DATE = "2021-03-21";
const TS021_DATE_PUBLISHED = "2022-11-29";
const RM032_DATE_PUBLISHED = "2023-03-28";

const COLUMN_NAMES = {
  all_ethnicities:
    "Ethnic group: Total: All usual residents; measures: Value",
  mixed_white_black_caribbean:
    "Ethnic group: Mixed or Multiple ethnic groups: White and Black Caribbean; measures: Value",
  mixed_white_black_african:
    "Ethnic group: Mixed or Multiple ethnic groups: White and Black African; measures: Value",
  black_caribbean:
    "Ethnic group: Black, Black British, Black Welsh, Caribbean or African: Caribbean; measures: Value",
  black_african:
    "Ethnic group: Black, Black British, Black Welsh, Caribbean or African: African; measures: Value",
  other_black:
    "Ethnic group: Black, Black British, Black Welsh, Caribbean or African: Other Black; measures: Value",
} as const satisfies Record<SourceEthnicGroup, string>;

const DATASETS: GeographyConfig[] = [
  {
    level: "national",
    geographyQuery: "TYPE499",
    outputPath: "census-2021-population-total.json",
    siteSubcategory: "total",
    title: "Population by Ethnic Group, Census 2021",
    description:
      "Population counts for England and Wales, England, and Wales using the detailed Census 2021 ethnic group classification.",
  },
  {
    level: "regional",
    geographyQuery: "TYPE480",
    outputPath: "census-2021-population-by-region.json",
    siteSubcategory: "by-region",
    title: "Population by Region and Ethnic Group, Census 2021",
    description:
      "Population counts for the 9 English regions and Wales using the detailed Census 2021 ethnic group classification.",
  },
  {
    level: "local_authority",
    geographyQuery: "TYPE424",
    outputPath: "census-2021-population-by-local-authority.json",
    siteSubcategory: "by-local-authority",
    title: "Population by Local Authority and Ethnic Group, Census 2021",
    description:
      "Population counts for local authority districts and unitary authorities in England and Wales using the detailed Census 2021 ethnic group classification.",
  },
];

const RM032_AGE_GROUPS: Record<string, AgeGroupKey> = {
  "0": "all",
  "1": "24-and-under",
  "2": "25-34",
  "3": "35-49",
  "4": "50-64",
  "5": "65-plus",
};

const RM032_SEXES: Record<string, Sex> = {
  "0": "all",
  "1": "female",
  "2": "male",
};

const RM032_ETHNIC_GROUPS: Record<string, SourceEthnicGroup> = {
  "0": "all_ethnicities",
  "6": "black_african",
  "7": "black_caribbean",
  "8": "other_black",
  "10": "mixed_white_black_african",
  "11": "mixed_white_black_caribbean",
};

async function main() {
  await fs.mkdir(OUTPUT_ROOT, { recursive: true });

  for (const config of DATASETS) {
    const csv = await fetchText(buildTs021Url(config.geographyQuery));
    const parsed = Papa.parse<CsvRow>(csv, {
      header: true,
      skipEmptyLines: true,
    });

    if (parsed.errors.length > 0) {
      const firstError = parsed.errors[0];
      throw new Error(
        `Failed to parse CSV for ${config.outputPath}: ${firstError.message}`
      );
    }

    const observations = parsed.data.flatMap((row) =>
      createObservations(row, config.level)
    );

    const dataset: Dataset = {
      id: `nomis-${config.siteSubcategory}-population-census-2021`,
      title: config.title,
      description: config.description,
      siteCategory: "population",
      siteSubcategory: config.siteSubcategory,
        metadata: {
          id: "nomis-census-2021-ts021",
          name: "Census 2021: Ethnic group (TS021)",
          publisher: "Office for National Statistics via Nomis",
          url: TS021_SOURCE_URL,
          apiEndpoint: buildTs021Url(config.geographyQuery),
          datePublished: TS021_DATE_PUBLISHED,
          dateAccessed: CURRENT_DATE,
          referenceDate: REFERENCE_DATE,
          referencePeriod: "2021",
        geographicCoverage: "England and Wales",
        methodology:
          "Downloaded from the Nomis bulk CSV endpoint for Census 2021 table TS021. Counts refer to usual residents on Census Day, 21 March 2021. This project derives the all_black and all_black_including_mixed aggregates from the detailed ethnic group rows returned by Nomis.",
        qualityFlags: ["official_statistic"],
        caveats: [
          "Census 2021 outputs use statistical disclosure control, including targeted record swapping and cell key perturbation.",
          "The all_black aggregate sums Black African, Black Caribbean, and Other Black. The all_black_including_mixed aggregate additionally includes White and Black African and White and Black Caribbean.",
        ],
        license: "Open Government Licence v3.0",
        fetchMethod: "csv_download",
      },
      dimensions: ["ethnicGroup", "geography", "timePeriod"],
      observations,
    };

    const outputPath = path.join(OUTPUT_ROOT, config.outputPath);
    await writeJson(outputPath, dataset);
    console.log(
      `Wrote ${path.relative(process.cwd(), outputPath)} (${observations.length} observations)`
    );
  }

  await fetchPopulationAgeSexDataset();
}

function buildTs021Url(geographyQuery: string): string {
  const params = new URLSearchParams({
    time: "2021",
    geography: geographyQuery,
    c2021_eth_20: "0,6,7,15,16,17",
    measures: "20100",
  });

  return `${TS021_API_BASE_URL}?${params.toString()}`;
}

function createObservations(
  row: CsvRow,
  level: GeographyLevel
): DataObservation[] {
  const geography: GeographyUnit = {
    code: requiredField(row, "geography code"),
    name: requiredField(row, "geography"),
    level,
  };

  const totalPopulation = readCount(row, COLUMN_NAMES.all_ethnicities);
  const mixedWhiteBlackCaribbean = readCount(
    row,
    COLUMN_NAMES.mixed_white_black_caribbean
  );
  const mixedWhiteBlackAfrican = readCount(
    row,
    COLUMN_NAMES.mixed_white_black_african
  );
  const blackCaribbean = readCount(row, COLUMN_NAMES.black_caribbean);
  const blackAfrican = readCount(row, COLUMN_NAMES.black_african);
  const otherBlack = readCount(row, COLUMN_NAMES.other_black);

  const allBlack = blackAfrican + blackCaribbean + otherBlack;
  const allBlackIncludingMixed =
    allBlack + mixedWhiteBlackCaribbean + mixedWhiteBlackAfrican;

  return [
    createObservation("all_ethnicities", geography, totalPopulation),
    createObservation(
      "mixed_white_black_caribbean",
      geography,
      mixedWhiteBlackCaribbean
    ),
    createObservation(
      "mixed_white_black_african",
      geography,
      mixedWhiteBlackAfrican
    ),
    createObservation("black_caribbean", geography, blackCaribbean),
    createObservation("black_african", geography, blackAfrican),
    createObservation("other_black", geography, otherBlack),
    createObservation("all_black", geography, allBlack),
    createObservation(
      "all_black_including_mixed",
      geography,
      allBlackIncludingMixed
    ),
  ];
}

function createObservation(
  ethnicGroup: EthnicGroup,
  geography: GeographyUnit,
  value: number
): DataObservation {
  return {
    ethnicGroup,
    geography,
    timePeriod: "2021",
    value: {
      value,
      unit: "count",
      formatted: formatNumber(value),
    },
  };
}

function readCount(row: CsvRow, columnName: string): number {
  const value = requiredField(row, columnName);
  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid numeric value "${value}" in column "${columnName}"`);
  }

  return parsed;
}

function requiredField(row: CsvRow, fieldName: string): string {
  const value = row[fieldName];

  if (value === undefined || value === null || value === "") {
    throw new Error(`Missing required field "${fieldName}"`);
  }

  return value;
}

async function writeJson(filePath: string, value: unknown) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function fetchPopulationAgeSexDataset() {
  const csv = await fetchText(buildRm032Url());
  const parsed = Papa.parse<CsvRow>(csv, {
    header: true,
    skipEmptyLines: true,
  });

  if (parsed.errors.length > 0) {
    const firstError = parsed.errors[0];
    throw new Error(
      `Failed to parse CSV for age/sex population dataset: ${firstError.message}`
    );
  }

  const rawObservations = parsed.data.map(createAgeSexObservation);
  const aggregateObservations = deriveAggregateAgeSexObservations(rawObservations);
  const observations = [...rawObservations, ...aggregateObservations].sort(
    sortObservations
  );

  const dataset: Dataset = {
    id: "nomis-population-age-sex-census-2021",
    title: "Population by Ethnic Group, Sex, and Age, Census 2021",
    description:
      "Population counts for England and Wales, England, and Wales by ethnic group, sex, and broad age band from Census 2021 RM032.",
    siteCategory: "population",
    siteSubcategory: "age-distribution",
    metadata: {
      id: "nomis-census-2021-rm032",
      name: "Census 2021: Ethnic group by sex by age (RM032)",
      publisher: "Office for National Statistics via Nomis",
      url: RM032_SOURCE_URL,
      apiEndpoint: buildRm032Url(),
      datePublished: RM032_DATE_PUBLISHED,
      dateAccessed: CURRENT_DATE,
      referenceDate: REFERENCE_DATE,
      referencePeriod: "2021",
      geographicCoverage: "England and Wales",
      methodology:
        "Downloaded from the Nomis CSV endpoint for Census 2021 RM032. Counts refer to usual residents on Census Day, 21 March 2021. The source provides broad age bands and sex categories; this project additionally derives the all_black and all_black_including_mixed aggregates from the detailed ethnic group rows.",
      qualityFlags: ["official_statistic"],
      caveats: [
        "The live official Nomis dataset for ethnicity by sex and age is RM032.",
        "Census 2021 outputs use statistical disclosure control, including targeted record swapping and cell key perturbation.",
        "Age is grouped into broad bands in this release rather than five-year bands.",
      ],
      license: "Open Government Licence v3.0",
      fetchMethod: "csv_download",
    },
    dimensions: ["ethnicGroup", "geography", "timePeriod", "ageGroup", "sex"],
    observations,
  };

  const outputPath = path.join(
    OUTPUT_ROOT,
    "census-2021-population-age-sex.json"
  );
  await writeJson(outputPath, dataset);
  console.log(
    `Wrote ${path.relative(process.cwd(), outputPath)} (${observations.length} observations)`
  );
}

function buildRm032Url(): string {
  const params = new URLSearchParams({
    time: "2021",
    geography: "TYPE499",
    c2021_eth_20: "0,6,7,8,10,11",
    c2021_age_6: "0,1,2,3,4,5",
    c_sex: "0,1,2",
    measures: "20100",
    select:
      "geography_code,geography_name,c2021_eth_20,c2021_age_6,c_sex,obs_value",
  });

  return `${RM032_API_URL}?${params.toString()}`;
}

function createAgeSexObservation(row: CsvRow): DataObservation {
  const geography: GeographyUnit = {
    code: requiredField(row, "GEOGRAPHY_CODE"),
    name: requiredField(row, "GEOGRAPHY_NAME"),
    level: "national",
  };
  const ageGroup = RM032_AGE_GROUPS[requiredField(row, "C2021_AGE_6")];
  const sex = RM032_SEXES[requiredField(row, "C_SEX")];
  const ethnicGroup = RM032_ETHNIC_GROUPS[requiredField(row, "C2021_ETH_20")];
  const value = readCount(row, "OBS_VALUE");

  if (!ageGroup || !sex || !ethnicGroup) {
    throw new Error("Unexpected age, sex, or ethnic group code in RM032 dataset");
  }

  return createObservationWithDimensions(
    ethnicGroup,
    geography,
    value,
    ageGroup,
    sex
  );
}

function createObservationWithDimensions(
  ethnicGroup: EthnicGroup,
  geography: GeographyUnit,
  value: number,
  ageGroup: AgeGroupKey,
  sex: Sex
): DataObservation {
  return {
    ethnicGroup,
    geography,
    timePeriod: "2021",
    ageGroup,
    sex,
    value: {
      value,
      unit: "count",
      formatted: formatNumber(value),
    },
  };
}

function sortObservations(left: DataObservation, right: DataObservation): number {
  return [
    left.geography.code.localeCompare(right.geography.code),
    left.ethnicGroup.localeCompare(right.ethnicGroup),
    (left.ageGroup ?? "").localeCompare(right.ageGroup ?? ""),
    (left.sex ?? "").localeCompare(right.sex ?? ""),
  ].find((result) => result !== 0) ?? 0;
}

function deriveAggregateAgeSexObservations(
  observations: DataObservation[]
): DataObservation[] {
  const grouped = new Map<
    string,
    {
      geography: GeographyUnit;
      ageGroup: AgeGroupKey;
      sex: Sex;
      allBlack: number;
      allBlackIncludingMixed: number;
    }
  >();

  for (const observation of observations) {
    if (!observation.ageGroup || !observation.sex) continue;

    const key = [
      observation.geography.code,
      observation.ageGroup,
      observation.sex,
    ].join("|");
    const current =
      grouped.get(key) ??
      {
        geography: observation.geography,
        ageGroup: observation.ageGroup as AgeGroupKey,
        sex: observation.sex,
        allBlack: 0,
        allBlackIncludingMixed: 0,
      };

    if (
      observation.ethnicGroup === "black_african" ||
      observation.ethnicGroup === "black_caribbean" ||
      observation.ethnicGroup === "other_black"
    ) {
      current.allBlack += observation.value.value;
      current.allBlackIncludingMixed += observation.value.value;
    } else if (
      observation.ethnicGroup === "mixed_white_black_african" ||
      observation.ethnicGroup === "mixed_white_black_caribbean"
    ) {
      current.allBlackIncludingMixed += observation.value.value;
    }

    grouped.set(key, current);
  }

  return Array.from(grouped.values()).flatMap((entry) => [
    createObservationWithDimensions(
      "all_black",
      entry.geography,
      entry.allBlack,
      entry.ageGroup,
      entry.sex
    ),
    createObservationWithDimensions(
      "all_black_including_mixed",
      entry.geography,
      entry.allBlackIncludingMixed,
      entry.ageGroup,
      entry.sex
    ),
  ]);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
