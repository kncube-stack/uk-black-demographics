#!/usr/bin/env tsx

import fs from "fs/promises";
import path from "path";
import Papa from "papaparse";
import { formatNumber } from "../src/lib/format";
import type { DataObservation, Dataset, EthnicGroup } from "../src/lib/types";
import { fetchWithRetry } from "./utils/api-client";

type CsvRow = Record<string, string>;
type TrackedEthnicGroup = Exclude<
  EthnicGroup,
  "all_black" | "all_black_including_mixed"
>;

type MeasureKey =
  | "headcount"
  | "suspension"
  | "susp_rate"
  | "perm_excl"
  | "perm_excl_rate"
  | "one_plus"
  | "one_plus_rate";

type ParsedValue = {
  suppressed?: boolean;
  value: number;
};

const PUBLICATION_URL =
  "https://explore-education-statistics.service.gov.uk/find-statistics/suspensions-and-permanent-exclusions-in-england";
const DATA_CATALOGUE_CSV_URL =
  "https://explore-education-statistics.service.gov.uk/data-catalogue/data-set/751e5c41-06b5-428e-907d-78182b05e015/csv";
const OUTPUT_PATH = path.join(
  process.cwd(),
  "data",
  "fetched",
  "dfe",
  "education",
  "suspensions-national.json"
);

const CURRENT_DATE = new Date().toISOString().slice(0, 10);
const ENGLAND_GEOGRAPHY = {
  code: "E92000001",
  name: "England",
  level: "national",
} as const;

const ETHNICITY_MAP: Record<string, TrackedEthnicGroup | undefined> = {
  African: "black_african",
  Caribbean: "black_caribbean",
  "Any other Black / African / Caribbean background": "other_black",
  "White and Black Caribbean": "mixed_white_black_caribbean",
  "White and Black African": "mixed_white_black_african",
  Total: "all_ethnicities",
};

const COUNT_MEASURES: ReadonlyArray<MeasureKey> = [
  "headcount",
  "suspension",
  "perm_excl",
  "one_plus",
];

async function main() {
  const release = await fetchLatestReleaseMetadata();
  const csvResponse = await fetchWithRetry(DATA_CATALOGUE_CSV_URL, {
    headers: {
      Accept: "text/csv, text/plain, */*",
    },
  });
  const csv = await csvResponse.text();
  const parsed = Papa.parse<CsvRow>(csv, {
    header: true,
    skipEmptyLines: true,
  });

  if (parsed.errors.length > 0) {
    const firstError = parsed.errors[0];
    throw new Error(`Failed to parse DfE exclusions CSV: ${firstError.message}`);
  }

  const sourceObservations = parsed.data.flatMap((row) =>
    createObservationsFromRow(row)
  );
  const aggregateObservations = deriveAggregateObservations(sourceObservations);
  const observations = [...sourceObservations, ...aggregateObservations].sort(
    sortObservations
  );

  const dataset: Dataset = {
    id: "dfe-education-suspensions-national",
    title: "Suspensions and Permanent Exclusions by Ethnicity",
    description:
      "National England rows from the DfE exclusions characteristic dataset, including ethnicity, education phase, FSM eligibility, counts, and published rates.",
    siteCategory: "education",
    siteSubcategory: "exclusions",
    metadata: {
      id: "dfe-suspensions-and-permanent-exclusions",
      name: `Suspensions and permanent exclusions in England (${release.title})`,
      publisher: "Department for Education via Explore Education Statistics",
      url: release.url,
      apiEndpoint: csvResponse.url,
      datePublished: release.published,
      dateAccessed: CURRENT_DATE,
      referenceDate: `${release.title}, England`,
      referencePeriod: "2023/24 to 2024/25",
      geographicCoverage: "England",
      methodology:
        "Fetched from the Explore Education Statistics data catalogue CSV for the current suspensions publication. This implementation keeps national England rows for tracked Black and mixed White/Black ethnic groups plus the all-pupils total, then derives all_black and all_black_including_mixed aggregates from the published counts. Published rate fields in this CSV are percentages of pupils in each group, not per-10,000 rates.",
      qualityFlags: ["national_statistic"],
      caveats: [
        "Current education implementation uses the national characteristic extract, not the full region/local-authority file.",
        "This slice is England only.",
        "Suspension, permanent exclusion, and one-plus-suspension rates are percentages of pupils in the group.",
        "The Mixed White and Black Caribbean group is kept separate because it has distinct outcomes in DfE education statistics.",
      ],
      license: "Open Government Licence v3.0",
      fetchMethod: "csv_download",
    },
    dimensions: [
      "ethnicGroup",
      "geography",
      "timePeriod",
      "education_phase",
      "fsm",
      "measure",
    ],
    observations,
  };

  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(dataset, null, 2)}\n`, "utf8");
  console.log(
    `Wrote ${path.relative(process.cwd(), OUTPUT_PATH)} (${observations.length} observations)`
  );
}

async function fetchLatestReleaseMetadata() {
  const response = await fetchWithRetry(PUBLICATION_URL, {
    headers: {
      Accept: "text/html,application/xhtml+xml",
    },
  });
  const html = await response.text();
  const match = html.match(
    /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/
  );

  if (!match) {
    throw new Error("Could not locate release metadata on the DfE publication page.");
  }

  const payload = JSON.parse(match[1]) as {
    props?: {
      pageProps?: {
        releaseVersion?: {
          title?: string;
          published?: string;
        };
      };
    };
  };

  const release = payload.props?.pageProps?.releaseVersion;

  if (!release?.title || !release.published) {
    throw new Error("DfE release metadata is missing title or published date.");
  }

  return {
    title: release.title,
    published: release.published.slice(0, 10),
    url: response.url,
  };
}

function createObservationsFromRow(row: CsvRow): DataObservation[] {
  if (requiredField(row, "geographic_level") !== "National") {
    return [];
  }

  const mappedGroup = ETHNICITY_MAP[requiredField(row, "ethnicity_minor")];

  if (!mappedGroup) {
    return [];
  }

  const timePeriod = formatAcademicYear(requiredField(row, "time_period"));
  const educationPhase = requiredField(row, "education_phase");
  const fsm = requiredField(row, "fsm");
  const timeIdentifier = requiredField(row, "time_identifier");

  return [
    createObservation(
      mappedGroup,
      timePeriod,
      educationPhase,
      fsm,
      timeIdentifier,
      "headcount",
      parseCount(row, "headcount"),
      "count"
    ),
    createObservation(
      mappedGroup,
      timePeriod,
      educationPhase,
      fsm,
      timeIdentifier,
      "suspension",
      parseCount(row, "suspension"),
      "count"
    ),
    createObservation(
      mappedGroup,
      timePeriod,
      educationPhase,
      fsm,
      timeIdentifier,
      "perm_excl",
      parseCount(row, "perm_excl"),
      "count"
    ),
    createObservation(
      mappedGroup,
      timePeriod,
      educationPhase,
      fsm,
      timeIdentifier,
      "one_plus",
      parseCount(row, "one_plus"),
      "count"
    ),
    createObservation(
      mappedGroup,
      timePeriod,
      educationPhase,
      fsm,
      timeIdentifier,
      "susp_rate",
      parseRate(row, "susp_rate"),
      "percentage"
    ),
    createObservation(
      mappedGroup,
      timePeriod,
      educationPhase,
      fsm,
      timeIdentifier,
      "perm_excl_rate",
      parseRate(row, "perm_excl_rate"),
      "percentage"
    ),
    createObservation(
      mappedGroup,
      timePeriod,
      educationPhase,
      fsm,
      timeIdentifier,
      "one_plus_rate",
      parseRate(row, "one_plus_rate"),
      "percentage"
    ),
  ];
}

function createObservation(
  ethnicGroup: EthnicGroup,
  timePeriod: string,
  educationPhase: string,
  fsm: string,
  timeIdentifier: string,
  measure: MeasureKey,
  parsed: number | ParsedValue,
  unit: Dataset["observations"][number]["value"]["unit"]
): DataObservation {
  const value = typeof parsed === "number" ? parsed : parsed.value;
  const suppressed = typeof parsed === "number" ? false : parsed.suppressed;

  return {
    ethnicGroup,
    geography: ENGLAND_GEOGRAPHY,
    timePeriod,
    attributes: {
      education_phase: educationPhase,
      fsm,
      measure,
      time_identifier: timeIdentifier,
    },
    value: {
      value,
      unit,
      formatted: unit === "count" ? formatNumber(value) : undefined,
      suppressed,
    },
  };
}

function deriveAggregateObservations(
  observations: DataObservation[]
): DataObservation[] {
  const aggregateGroups: Record<
    "all_black" | "all_black_including_mixed",
    EthnicGroup[]
  > = {
    all_black: ["black_african", "black_caribbean", "other_black"],
    all_black_including_mixed: [
      "black_african",
      "black_caribbean",
      "other_black",
      "mixed_white_black_caribbean",
      "mixed_white_black_african",
    ],
  };

  const results: DataObservation[] = [];

  for (const [aggregateKey, componentGroups] of Object.entries(aggregateGroups)) {
    const sums = new Map<string, number>();

    for (const observation of observations) {
      const measure = observation.attributes?.measure as MeasureKey | undefined;

      if (!measure || !COUNT_MEASURES.includes(measure)) {
        continue;
      }

      if (!componentGroups.includes(observation.ethnicGroup)) {
        continue;
      }

      const key = [
        observation.timePeriod,
        observation.attributes?.education_phase ?? "",
        observation.attributes?.fsm ?? "",
        observation.attributes?.time_identifier ?? "",
        measure,
      ].join("|");

      sums.set(key, (sums.get(key) ?? 0) + observation.value.value);
    }

    for (const [key, value] of sums) {
      const [timePeriod, educationPhase, fsm, timeIdentifier, measure] = key.split(
        "|"
      ) as [string, string, string, string, MeasureKey];

      results.push(
        createObservation(
          aggregateKey as EthnicGroup,
          timePeriod,
          educationPhase,
          fsm,
          timeIdentifier,
          measure,
          value,
          "count"
        )
      );
    }

    const groupedKeys = new Set(
      observations
        .filter((observation) =>
          componentGroups.includes(observation.ethnicGroup)
        )
        .map((observation) =>
          [
            observation.timePeriod,
            observation.attributes?.education_phase ?? "",
            observation.attributes?.fsm ?? "",
            observation.attributes?.time_identifier ?? "",
          ].join("|")
        )
    );

    for (const groupedKey of groupedKeys) {
      const [timePeriod, educationPhase, fsm, timeIdentifier] = groupedKey.split("|");
      const headcount = getAggregateCount(
        results,
        aggregateKey as EthnicGroup,
        timePeriod,
        educationPhase,
        fsm,
        "headcount"
      );

      if (headcount === 0) {
        continue;
      }

      for (const [countMeasure, rateMeasure] of [
        ["suspension", "susp_rate"],
        ["perm_excl", "perm_excl_rate"],
        ["one_plus", "one_plus_rate"],
      ] as const) {
        const count = getAggregateCount(
          results,
          aggregateKey as EthnicGroup,
          timePeriod,
          educationPhase,
          fsm,
          countMeasure
        );

        results.push(
          createObservation(
            aggregateKey as EthnicGroup,
            timePeriod,
            educationPhase,
            fsm,
            timeIdentifier,
            rateMeasure,
            (count / headcount) * 100,
            "percentage"
          )
        );
      }
    }
  }

  return results;
}

function getAggregateCount(
  observations: DataObservation[],
  ethnicGroup: EthnicGroup,
  timePeriod: string,
  educationPhase: string,
  fsm: string,
  measure: Exclude<MeasureKey, "susp_rate" | "perm_excl_rate" | "one_plus_rate">
) {
  return (
    observations.find(
      (observation) =>
        observation.ethnicGroup === ethnicGroup &&
        observation.timePeriod === timePeriod &&
        observation.attributes?.education_phase === educationPhase &&
        observation.attributes?.fsm === fsm &&
        observation.attributes?.measure === measure
    )?.value.value ?? 0
  );
}

function sortObservations(left: DataObservation, right: DataObservation): number {
  return [
    left.timePeriod.localeCompare(right.timePeriod),
    (left.attributes?.education_phase ?? "").localeCompare(
      right.attributes?.education_phase ?? ""
    ),
    (left.attributes?.fsm ?? "").localeCompare(right.attributes?.fsm ?? ""),
    left.ethnicGroup.localeCompare(right.ethnicGroup),
    (left.attributes?.measure ?? "").localeCompare(right.attributes?.measure ?? ""),
  ].find((value) => value !== 0) ?? 0;
}

function formatAcademicYear(value: string): string {
  if (!/^\d{6}$/.test(value)) {
    return value;
  }

  return `${value.slice(0, 4)}/${value.slice(4, 6)}`;
}

function parseCount(row: CsvRow, key: string): number {
  const value = Number.parseInt(requiredField(row, key), 10);

  if (!Number.isFinite(value)) {
    throw new Error(`Invalid integer value for ${key}: ${row[key]}`);
  }

  return value;
}

function parseRate(row: CsvRow, key: string): ParsedValue {
  const raw = requiredField(row, key);

  if (raw.toLowerCase() === "x") {
    return {
      value: 0,
      suppressed: true,
    };
  }

  const value = Number.parseFloat(raw);

  if (!Number.isFinite(value)) {
    throw new Error(`Invalid decimal value for ${key}: ${row[key]}`);
  }

  return { value };
}

function requiredField(row: CsvRow, key: string): string {
  const value = row[key];

  if (value === undefined || value === null || value === "") {
    throw new Error(`Missing required field "${key}"`);
  }

  return value;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
