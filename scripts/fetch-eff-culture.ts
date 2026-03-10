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
  "https://www.ethnicity-facts-figures.service.gov.uk/crime-justice-and-the-law/policing/stop-and-search/latest/";
const CSV_URL = `${PAGE_URL}downloads/stop-and-search-2006-2023.csv`;
const OUTPUT_PATH = path.join(
  process.cwd(),
  "data",
  "fetched",
  "eff",
  "culture-geography",
  "stop-and-search-national.json"
);
const CURRENT_DATE = new Date().toISOString().slice(0, 10);

const ETHNICITY_TO_GROUP: Record<string, EthnicGroup> = {
  all: "all_ethnicities",
  black: "all_black",
  "black african": "black_african",
  "black caribbean": "black_caribbean",
  "black other": "other_black",
  "mixed white and black african": "mixed_white_black_african",
  "mixed white and black caribbean": "mixed_white_black_caribbean",
};

async function main() {
  const [csv, datePublished] = await Promise.all([
    fetchText(CSV_URL),
    fetchLastModifiedDate(PAGE_URL),
  ]);
  const rows = parseCsv(csv, "stop and search").filter(
    (row) =>
      row.measure ===
        "Number of stops and searches carried out (excluding vehicle only searches)" &&
      row.geography === "All - including BTP" &&
      ETHNICITY_TO_GROUP[normaliseLabel(row.ethnicity)] !== undefined
  );
  const latestTime =
    [...new Set(rows.map((row) => row.time).filter(Boolean))]
      .sort(compareTimePeriods)
      .at(-1) ?? "";
  const observations = createObservations(rows);

  if (!latestTime || observations.length === 0) {
    throw new Error("Stop and search fetch did not produce any observations.");
  }

  const dataset: Dataset = {
    id: "eff-stop-and-search-national",
    title: "Stop and search by ethnicity",
    description:
      "England and Wales stop and search rates by ethnicity, using the official Ethnicity Facts and Figures release.",
    siteCategory: "culture-geography",
    siteSubcategory: "stop-search",
    metadata: {
      id: "eff-stop-and-search",
      name: "Ethnicity Facts and Figures: Stop and search",
      publisher: "Race Disparity Unit / Cabinet Office",
      url: PAGE_URL,
      apiEndpoint: CSV_URL,
      datePublished,
      dateAccessed: CURRENT_DATE,
      referenceDate: latestTime,
      referencePeriod: latestTime,
      geographicCoverage: "England and Wales",
      methodology:
        "Fetched from the official Ethnicity Facts and Figures stop and search download. The live culture and geography page uses the England and Wales all-force rows, including BTP, and retains legislation splits for the latest published year.",
      qualityFlags: ["official_statistic"],
      caveats: [
        "The live culture and geography slice uses the all-force England and Wales rows including BTP to match the current published headline view.",
        "The source file also contains force-area rows and legislation splits; this first live implementation keeps national trend and legislation views only.",
        "Rates are per 1,000 population and exclude cases where ethnicity was unreported from the ethnicity-specific baseline.",
      ],
      license: "Open Government Licence v3.0",
      fetchMethod: "csv_download",
    },
    dimensions: ["ethnic_group", "time", "measure", "legislation_type"],
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
    const rate = parseNumber(row.rate_per_1_000_population_by_ethnicity);
    const count = parseNumber(row.number_of_stop_and_searches);
    const population = parseNumber(row.population_by_ethnicity);
    const share = parseNumber(
      row.proportion_of_total_stop_and_searches_of_this_ethnicity_in_the_financial_year_excludes_unreported
    );

    if (!group) {
      continue;
    }

    const baseAttributes = {
      legislation_type: row.legislation_type,
      label: getEthnicityLabel(group),
    };

    if (rate !== null) {
      observations.push({
        ethnicGroup: group,
        geography: {
          code: "K04000001",
          name: "England and Wales",
          level: "national",
        },
        timePeriod: row.time,
        value: {
          value: rate,
          unit: "rate_per_1000",
          formatted: formatRate(rate, 1_000),
        },
        attributes: {
          ...baseAttributes,
          measure: "rate",
        },
      });
    }

    if (count !== null) {
      observations.push({
        ethnicGroup: group,
        geography: {
          code: "K04000001",
          name: "England and Wales",
          level: "national",
        },
        timePeriod: row.time,
        value: {
          value: count,
          unit: "count",
          formatted: formatNumber(count),
        },
        attributes: {
          ...baseAttributes,
          measure: "count",
        },
      });
    }

    if (population !== null) {
      observations.push({
        ethnicGroup: group,
        geography: {
          code: "K04000001",
          name: "England and Wales",
          level: "national",
        },
        timePeriod: row.time,
        value: {
          value: population,
          unit: "count",
          formatted: formatNumber(population),
        },
        attributes: {
          ...baseAttributes,
          measure: "population",
        },
      });
    }

    if (share !== null) {
      observations.push({
        ethnicGroup: group,
        geography: {
          code: "K04000001",
          name: "England and Wales",
          level: "national",
        },
        timePeriod: row.time,
        value: {
          value: share,
          unit: "percentage",
          formatted: `${share.toFixed(1)}%`,
        },
        attributes: {
          ...baseAttributes,
          measure: "share_of_searches",
        },
      });
    }
  }

  return observations;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
