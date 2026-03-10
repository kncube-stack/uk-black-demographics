#!/usr/bin/env tsx

import fs from "fs/promises";
import path from "path";
import { getEthnicityLabel } from "../src/lib/ethnicity";
import { formatNumber, formatPercent } from "../src/lib/format";
import type { DataObservation, Dataset, EthnicGroup } from "../src/lib/types";
import { fetchText } from "./utils/api-client";
import {
  fetchLastModifiedDate,
  getLatestTimePeriod,
  normaliseLabel,
  parseCsv,
  parseNumber,
  type CsvRow,
} from "./utils/source-utils";

const PAGE_URL =
  "https://www.ethnicity-facts-figures.service.gov.uk/housing/owning-and-renting/home-ownership/latest/";
const CSV_URL = `${PAGE_URL}downloads/home-ownership-data.csv`;
const OUTPUT_PATH = path.join(
  process.cwd(),
  "data",
  "fetched",
  "eff",
  "households",
  "home-ownership-national.json"
);
const CURRENT_DATE = new Date().toISOString().slice(0, 10);

const ETHNICITY_TO_GROUP: Record<string, EthnicGroup> = {
  "all": "all_ethnicities",
  "black african": "black_african",
  "black caribbean": "black_caribbean",
  "any other black background": "other_black",
  "mixed white and black african": "mixed_white_black_african",
  "mixed white and black caribbean": "mixed_white_black_caribbean",
};

async function main() {
  const [csv, datePublished] = await Promise.all([
    fetchText(CSV_URL),
    fetchLastModifiedDate(PAGE_URL),
  ]);
  const rows = parseCsv(csv, "home ownership");
  const latestTime = getLatestTimePeriod(
    rows
      .filter((row) => row.measure === "Percentage of households that owned their own home")
      .map((row) => row.time)
  );

  if (!latestTime) {
    throw new Error("Unable to determine the latest home ownership time period.");
  }

  const filteredRows = rows.filter(
    (row) =>
      row.measure === "Percentage of households that owned their own home" &&
      row.time === latestTime &&
      row.geography === "England" &&
      row.nssec === "All" &&
      row.income_band === "All" &&
      row.region === "All" &&
      row.age_group === "All" &&
      ETHNICITY_TO_GROUP[normaliseLabel(row.ethnicity)] !== undefined
  );

  const observations = createObservations(filteredRows);
  const dataset: Dataset = {
    id: "eff-home-ownership-national",
    title: "Home ownership by ethnicity",
    description:
      "Percentage of households that own their home in England, with Black subgroup detail and derived Black aggregates.",
    siteCategory: "households",
    siteSubcategory: "housing",
    metadata: {
      id: "eff-home-ownership",
      name: "Ethnicity Facts and Figures: Home ownership",
      publisher: "Race Disparity Unit / Cabinet Office",
      url: PAGE_URL,
      apiEndpoint: CSV_URL,
      datePublished,
      dateAccessed: CURRENT_DATE,
      referenceDate: latestTime,
      referencePeriod: latestTime,
      geographicCoverage: "England",
      methodology:
        "Fetched from the official Ethnicity Facts and Figures home ownership download. This implementation uses the latest England-wide rows with all other dimensions set to All, then derives Black aggregates from published subgroup numerators and denominators.",
      qualityFlags: ["official_statistic"],
      caveats: [
        "The live households slice currently covers England only because that is how this published breakdown is released.",
        "The latest official release combines two survey years, so values should be read as pooled estimates rather than a single-year snapshot.",
        "Derived all-Black aggregates are recomputed from published subgroup counts to avoid mixing incompatible percentage averages.",
      ],
      license: "Open Government Licence v3.0",
      fetchMethod: "csv_download",
    },
    dimensions: ["ethnic_group", "measure", "time"],
    observations,
  };

  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(dataset, null, 2)}\n`, "utf8");
  console.log(`Wrote ${path.relative(process.cwd(), OUTPUT_PATH)} (${observations.length} observations)`);
}

function createObservations(rows: CsvRow[]): DataObservation[] {
  const observations: DataObservation[] = [];
  const aggregateBuckets = new Map<
    "all_black" | "all_black_including_mixed",
    { numerator: number; denominator: number }
  >([
    ["all_black", { numerator: 0, denominator: 0 }],
    ["all_black_including_mixed", { numerator: 0, denominator: 0 }],
  ]);

  for (const row of rows) {
    const group = ETHNICITY_TO_GROUP[normaliseLabel(row.ethnicity)];
    const rate = parseNumber(row.value);
    const numerator = parseNumber(row.numerator);
    const denominator = parseNumber(row.denominator);

    if (!group || rate === null || numerator === null || denominator === null) {
      continue;
    }

    observations.push(
      createObservation(group, row.time, "rate", {
        value: rate,
        unit: "percentage",
        formatted: formatPercent(rate, 1),
      })
    );
    observations.push(
      createObservation(group, row.time, "homeowners", {
        value: numerator * 1_000,
        unit: "count",
        formatted: formatNumber(numerator * 1_000),
      })
    );
    observations.push(
      createObservation(group, row.time, "households", {
        value: denominator * 1_000,
        unit: "count",
        formatted: formatNumber(denominator * 1_000),
      })
    );

    if (group === "black_african" || group === "black_caribbean" || group === "other_black") {
      aggregateBuckets.get("all_black")!.numerator += numerator;
      aggregateBuckets.get("all_black")!.denominator += denominator;
      aggregateBuckets.get("all_black_including_mixed")!.numerator += numerator;
      aggregateBuckets.get("all_black_including_mixed")!.denominator += denominator;
    }

    if (
      group === "mixed_white_black_african" ||
      group === "mixed_white_black_caribbean"
    ) {
      aggregateBuckets.get("all_black_including_mixed")!.numerator += numerator;
      aggregateBuckets.get("all_black_including_mixed")!.denominator += denominator;
    }
  }

  for (const [group, bucket] of aggregateBuckets) {
    if (!bucket.denominator) {
      continue;
    }

    const rate = (bucket.numerator / bucket.denominator) * 100;
    observations.push(
      createObservation(group, rows[0]?.time ?? "", "rate", {
        value: rate,
        unit: "percentage",
        formatted: formatPercent(rate, 1),
      })
    );
    observations.push(
      createObservation(group, rows[0]?.time ?? "", "homeowners", {
        value: bucket.numerator * 1_000,
        unit: "count",
        formatted: formatNumber(bucket.numerator * 1_000),
      })
    );
    observations.push(
      createObservation(group, rows[0]?.time ?? "", "households", {
        value: bucket.denominator * 1_000,
        unit: "count",
        formatted: formatNumber(bucket.denominator * 1_000),
      })
    );
  }

  return observations;
}

function createObservation(
  ethnicGroup: EthnicGroup,
  timePeriod: string,
  measure: string,
  value: DataObservation["value"]
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
    },
  };
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
