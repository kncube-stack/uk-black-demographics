#!/usr/bin/env tsx

import fs from "fs/promises";
import path from "path";
import { getEthnicityLabel } from "../src/lib/ethnicity";
import { formatNumber, formatRate } from "../src/lib/format";
import type { DataObservation, Dataset, EthnicGroup } from "../src/lib/types";
import { fetchText } from "./utils/api-client";
import {
  compareTimePeriods,
  fetchLastModifiedDate,
  normaliseLabel,
  parseCsv,
  parseNumber,
} from "./utils/source-utils";

const PAGE_URL =
  "https://www.ethnicity-facts-figures.service.gov.uk/health/mental-health/detentions-under-the-mental-health-act/latest/";
const CSV_URL = `${PAGE_URL}downloads/detentions-under-the-mental-health-act.csv`;
const OUTPUT_PATH = path.join(
  process.cwd(),
  "data",
  "fetched",
  "eff",
  "health",
  "mental-health-act-detentions.json"
);
const CURRENT_DATE = new Date().toISOString().slice(0, 10);

const ETHNICITY_TO_GROUP: Record<string, EthnicGroup> = {
  "black or black british": "all_black",
  african: "black_african",
  caribbean: "black_caribbean",
  "any other black background": "other_black",
  "white and black african": "mixed_white_black_african",
  "white and black caribbean": "mixed_white_black_caribbean",
};

async function main() {
  const [csv, datePublished] = await Promise.all([
    fetchText(CSV_URL),
    fetchLastModifiedDate(PAGE_URL),
  ]);
  const rows = parseCsv(csv, "mental health act detentions").filter(
    (row) =>
      row.geography === "England" &&
      ETHNICITY_TO_GROUP[normaliseLabel(row.ethnicity)] !== undefined
  );
  const observations = createObservations(rows);
  const latestTime =
    [...new Set(rows.map((row) => row.time).filter(Boolean))]
      .sort(compareTimePeriods)
      .at(-1) ?? "";

  if (!latestTime || observations.length === 0) {
    throw new Error("Mental health detentions fetch did not produce any observations.");
  }

  const dataset: Dataset = {
    id: "eff-mental-health-act-detentions",
    title: "Mental Health Act detentions by ethnicity",
    description:
      "England detentions under the Mental Health Act by ethnicity, using the official Ethnicity Facts and Figures release.",
    siteCategory: "health",
    siteSubcategory: "mental-health",
    metadata: {
      id: "eff-mental-health-act-detentions",
      name: "Ethnicity Facts and Figures: Detentions under the Mental Health Act",
      publisher: "Race Disparity Unit / Cabinet Office",
      url: PAGE_URL,
      apiEndpoint: CSV_URL,
      datePublished,
      dateAccessed: CURRENT_DATE,
      referenceDate: latestTime,
      referencePeriod: latestTime,
      geographicCoverage: "England",
      methodology:
        "Fetched from the official Ethnicity Facts and Figures Mental Health Act detentions download. The live health page uses published standardised rates where available and preserves subgroup-specific confidence margins from the source file.",
      qualityFlags: ["official_statistic"],
      caveats: [
        "The live health slice currently covers England only.",
        "Detention rates are presented per 100,000 population and use published standardised rates for subgroup comparison.",
        "The source changes ethnic classification wording between aggregated and detailed rows, so the fetcher normalises labels before mapping them into the site taxonomy.",
      ],
      license: "Open Government Licence v3.0",
      fetchMethod: "csv_download",
    },
    dimensions: ["ethnic_group", "time", "measure"],
    observations,
  };

  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(dataset, null, 2)}\n`, "utf8");
  console.log(`Wrote ${path.relative(process.cwd(), OUTPUT_PATH)} (${observations.length} observations)`);
}

function createObservations(rows: Array<Record<string, string>>): DataObservation[] {
  const observations: DataObservation[] = [];

  for (const row of rows) {
    const group = ETHNICITY_TO_GROUP[normaliseLabel(row.ethnicity)];
    const standardisedRate = parseNumber(row.value_1);
    const crudeRate = parseNumber(row.value_2);
    const detentionCount = parseNumber(row.numerator);
    const population = parseNumber(row.denominator);
    const confidenceMargin = parseNumber(row.confidence_interval);

    if (!group) {
      continue;
    }

    if (standardisedRate !== null) {
      observations.push(
        createObservation(group, row.time, "standardised_rate", {
          value: standardisedRate,
          unit: "rate_per_100000",
          formatted: formatRate(standardisedRate, 100_000),
        }, confidenceMargin)
      );
    }

    if (crudeRate !== null) {
      observations.push(
        createObservation(group, row.time, "crude_rate", {
          value: crudeRate,
          unit: "rate_per_100000",
          formatted: formatRate(crudeRate, 100_000),
        })
      );
    }

    if (detentionCount !== null) {
      observations.push(
        createObservation(group, row.time, "detentions", {
          value: detentionCount,
          unit: "count",
          formatted: formatNumber(detentionCount),
        })
      );
    }

    if (population !== null) {
      observations.push(
        createObservation(group, row.time, "population", {
          value: population,
          unit: "count",
          formatted: formatNumber(population),
        })
      );
    }
  }

  return observations;
}

function createObservation(
  ethnicGroup: EthnicGroup,
  timePeriod: string,
  measure: string,
  value: DataObservation["value"],
  confidenceMargin?: number | null
): DataObservation {
  return {
    ethnicGroup,
    geography: {
      code: "E92000001",
      name: "England",
      level: "national",
    },
    timePeriod,
    value,
    attributes: {
      measure,
      label: getEthnicityLabel(ethnicGroup),
      ...(typeof confidenceMargin === "number"
        ? { confidence_margin: confidenceMargin.toFixed(1) }
        : {}),
    },
  };
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
