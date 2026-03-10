#!/usr/bin/env tsx

import fs from "fs/promises";
import path from "path";
import { formatNumber, formatPercent } from "../src/lib/format";
import type { DataObservation, Dataset } from "../src/lib/types";
import { fetchText } from "./utils/api-client";
import { parseCsv, parseNumber, type CsvRow } from "./utils/source-utils";

const OUTPUT_ROOT = path.join(process.cwd(), "data", "fetched", "ons");
const CURRENT_DATE = new Date().toISOString().slice(0, 10);
const ENGLAND_AND_WALES = {
  code: "K04000001",
  name: "England and Wales",
  level: "national",
} as const;
const CENSUS_REFERENCE_DATE = "2021-03-21";

const BLACK_GROUP_LABEL =
  "Black, Black British, Black Welsh, Caribbean or African";
const ETHNICITY_COLUMN = "Ethnic group (8 categories)";
const ETHNICITY_CODE_COLUMN = "Ethnic group (8 categories) Code";

async function main() {
  await Promise.all([
    writeQualificationsDataset(),
    writeReligionDataset(),
    writeHeritageDataset(),
  ]);
}

async function writeQualificationsDataset() {
  const pageUrl = "https://www.ons.gov.uk/datasets/RM049/editions/2021/versions/1";
  const csvUrl =
    "https://download.ons.gov.uk/downloads/datasets/RM049/editions/2021/versions/1.csv";
  const csv = await fetchText(csvUrl);
  const rows = parseCsv(csv, "RM049 qualifications");
  const qualificationColumn = "Highest level of qualification (8 categories)";
  const qualificationCodeColumn = "Highest level of qualification (8 categories) Code";
  const blackCounts = aggregateByCategory(rows, {
    categoryColumn: qualificationColumn,
    categoryCodeColumn: qualificationCodeColumn,
    includeEthnicities: [BLACK_GROUP_LABEL],
  });
  const allCounts = aggregateByCategory(rows, {
    categoryColumn: qualificationColumn,
    categoryCodeColumn: qualificationCodeColumn,
    includeAllEthnicities: true,
  });
  const observations = createShareDatasetObservations({
    blackCounts,
    allCounts,
    geography: ENGLAND_AND_WALES,
    timePeriod: "2021",
  });

  await writeDataset(
    path.join(
      OUTPUT_ROOT,
      "education",
      "census-2021-qualifications-national.json"
    ),
    {
      id: "ons-census-2021-qualifications-national",
      title: "Highest qualification by broad Black group",
      description:
        "England and Wales Census 2021 highest qualification counts and shares for the broad Black group compared with the all-population baseline.",
      siteCategory: "education",
      siteSubcategory: "attainment",
      metadata: {
        id: "ons-rm049-qualifications",
        name: "Census 2021: Highest level of qualification by ethnic group (RM049)",
        publisher: "Office for National Statistics",
        url: pageUrl,
        apiEndpoint: csvUrl,
        datePublished: "2023-02-21",
        dateAccessed: CURRENT_DATE,
        referenceDate: CENSUS_REFERENCE_DATE,
        referencePeriod: "Census 2021",
        geographicCoverage: "England and Wales",
        methodology:
          "Fetched from the official ONS RM049 Census 2021 download. This implementation aggregates local-authority rows to England and Wales and keeps the broad Black group plus the all-population comparator.",
        qualityFlags: ["national_statistic"],
        caveats: [
          "This Census route currently uses the broad Black category available in RM049 rather than Black subgroup detail.",
        ],
        license: "Open Government Licence v3.0",
        fetchMethod: "csv_download",
      },
      dimensions: ["ethnic_group", "category", "measure", "time"],
      observations,
    }
  );
}

async function writeReligionDataset() {
  const pageUrl = "https://www.ons.gov.uk/datasets/RM031/editions/2021/versions/1";
  const csvUrl =
    "https://download.ons.gov.uk/downloads/datasets/RM031/editions/2021/versions/1.csv";
  const csv = await fetchText(csvUrl);
  const rows = parseCsv(csv, "RM031 religion");
  const religionColumn = "Religion (10 categories)";
  const religionCodeColumn = "Religion (10 categories) Code";
  const blackCounts = aggregateByCategory(rows, {
    categoryColumn: religionColumn,
    categoryCodeColumn: religionCodeColumn,
    includeEthnicities: [BLACK_GROUP_LABEL],
  });
  const allCounts = aggregateByCategory(rows, {
    categoryColumn: religionColumn,
    categoryCodeColumn: religionCodeColumn,
    includeAllEthnicities: true,
  });
  const observations = createShareDatasetObservations({
    blackCounts,
    allCounts,
    geography: ENGLAND_AND_WALES,
    timePeriod: "2021",
  });

  await writeDataset(
    path.join(
      OUTPUT_ROOT,
      "culture-geography",
      "census-2021-religion-national.json"
    ),
    {
      id: "ons-census-2021-religion-national",
      title: "Religion by broad Black group",
      description:
        "England and Wales Census 2021 religion counts and shares for the broad Black group compared with the all-population baseline.",
      siteCategory: "culture-geography",
      siteSubcategory: "religion",
      metadata: {
        id: "ons-rm031-religion",
        name: "Census 2021: Religion by ethnic group (RM031)",
        publisher: "Office for National Statistics",
        url: pageUrl,
        apiEndpoint: csvUrl,
        datePublished: "2022-11-29",
        dateAccessed: CURRENT_DATE,
        referenceDate: CENSUS_REFERENCE_DATE,
        referencePeriod: "Census 2021",
        geographicCoverage: "England and Wales",
        methodology:
          "Fetched from the official ONS RM031 Census 2021 download. This implementation aggregates local-authority rows to England and Wales and keeps the broad Black group plus the all-population comparator.",
        qualityFlags: ["national_statistic"],
        caveats: [
          "This Census route currently uses the broad Black category available in RM031.",
        ],
        license: "Open Government Licence v3.0",
        fetchMethod: "csv_download",
      },
      dimensions: ["ethnic_group", "category", "measure", "time"],
      observations,
    }
  );
}

async function writeHeritageDataset() {
  const pageUrl = "https://www.ons.gov.uk/datasets/RM010/editions/2021/versions/1";
  const csvUrl =
    "https://download.ons.gov.uk/downloads/datasets/RM010/editions/2021/versions/1.csv";
  const csv = await fetchText(csvUrl);
  const rows = parseCsv(csv, "RM010 country of birth");
  const birthColumn = "Country of birth (12 categories)";
  const birthCodeColumn = "Country of birth (12 categories) Code";
  const blackCounts = aggregateByCategory(rows, {
    categoryColumn: birthColumn,
    categoryCodeColumn: birthCodeColumn,
    includeEthnicities: [BLACK_GROUP_LABEL],
  });
  const allCounts = aggregateByCategory(rows, {
    categoryColumn: birthColumn,
    categoryCodeColumn: birthCodeColumn,
    includeAllEthnicities: true,
  });
  const observations = createShareDatasetObservations({
    blackCounts,
    allCounts,
    geography: ENGLAND_AND_WALES,
    timePeriod: "2021",
  });

  await writeDataset(
    path.join(
      OUTPUT_ROOT,
      "culture-geography",
      "census-2021-country-of-birth-national.json"
    ),
    {
      id: "ons-census-2021-country-of-birth-national",
      title: "Country of birth by broad Black group",
      description:
        "England and Wales Census 2021 country-of-birth distribution for the broad Black group compared with the all-population baseline.",
      siteCategory: "culture-geography",
      siteSubcategory: "heritage-migration",
      metadata: {
        id: "ons-rm010-country-of-birth",
        name: "Census 2021: Country of birth by ethnic group (RM010)",
        publisher: "Office for National Statistics",
        url: pageUrl,
        apiEndpoint: csvUrl,
        datePublished: "2022-11-29",
        dateAccessed: CURRENT_DATE,
        referenceDate: CENSUS_REFERENCE_DATE,
        referencePeriod: "Census 2021",
        geographicCoverage: "England and Wales",
        methodology:
          "Fetched from the official ONS RM010 Census 2021 download. This implementation aggregates local-authority rows to England and Wales and keeps the broad Black group plus the all-population comparator.",
        qualityFlags: ["national_statistic"],
        caveats: [
          "This Census route currently uses the broad Black category available in RM010.",
        ],
        license: "Open Government Licence v3.0",
        fetchMethod: "csv_download",
      },
      dimensions: ["ethnic_group", "category", "measure", "time"],
      observations,
    }
  );
}

function aggregateByCategory(
  rows: CsvRow[],
  options: {
    categoryColumn: string;
    categoryCodeColumn: string;
    includeEthnicities?: string[];
    includeAllEthnicities?: boolean;
  }
) {
  const totals = new Map<string, number>();

  for (const row of rows) {
    const ethnicityLabel = row[ETHNICITY_COLUMN];
    const ethnicityCode = row[ETHNICITY_CODE_COLUMN];
    const category = row[options.categoryColumn];
    const categoryCode = row[options.categoryCodeColumn];
    const value = parseNumber(row.Observation);

    if (!category || !categoryCode || value === null) {
      continue;
    }

    if (categoryCode === "-8" || ethnicityCode === "-8") {
      continue;
    }

    const include =
      options.includeAllEthnicities === true
        ? ethnicityLabel !== "Does not apply"
        : options.includeEthnicities?.includes(ethnicityLabel) ?? false;

    if (!include) {
      continue;
    }

    totals.set(category, (totals.get(category) ?? 0) + value);
  }

  return totals;
}

function createShareDatasetObservations(options: {
  blackCounts: Map<string, number>;
  allCounts: Map<string, number>;
  geography: DataObservation["geography"];
  timePeriod: string;
}) {
  const observations: DataObservation[] = [];
  const blackTotal = sumValues(options.blackCounts);
  const allTotal = sumValues(options.allCounts);
  const categories = Array.from(
    new Set([
      ...options.blackCounts.keys(),
      ...options.allCounts.keys(),
    ])
  );

  for (const category of categories) {
    const blackCount = options.blackCounts.get(category);
    const allCount = options.allCounts.get(category);

    if (blackCount !== undefined) {
      observations.push({
        ethnicGroup: "all_black",
        geography: options.geography,
        timePeriod: options.timePeriod,
        category: slugify(category),
        attributes: {
          label: category,
          measure: "count",
        },
        value: {
          value: blackCount,
          unit: "count",
          formatted: formatNumber(blackCount),
        },
      });

      if (blackTotal > 0) {
        observations.push({
          ethnicGroup: "all_black",
          geography: options.geography,
          timePeriod: options.timePeriod,
          category: slugify(category),
          attributes: {
            label: category,
            measure: "share",
          },
          value: {
            value: (blackCount / blackTotal) * 100,
            unit: "percentage",
            formatted: formatPercent((blackCount / blackTotal) * 100, 1),
          },
        });
      }
    }

    if (allCount !== undefined) {
      observations.push({
        ethnicGroup: "all_ethnicities",
        geography: options.geography,
        timePeriod: options.timePeriod,
        category: slugify(category),
        attributes: {
          label: category,
          measure: "count",
        },
        value: {
          value: allCount,
          unit: "count",
          formatted: formatNumber(allCount),
        },
      });

      if (allTotal > 0) {
        observations.push({
          ethnicGroup: "all_ethnicities",
          geography: options.geography,
          timePeriod: options.timePeriod,
          category: slugify(category),
          attributes: {
            label: category,
            measure: "share",
          },
          value: {
            value: (allCount / allTotal) * 100,
            unit: "percentage",
            formatted: formatPercent((allCount / allTotal) * 100, 1),
          },
        });
      }
    }
  }

  return observations;
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function sumValues(values: Map<string, number>) {
  let total = 0;

  for (const value of values.values()) {
    total += value;
  }

  return total;
}

async function writeDataset(filePath: string, dataset: Dataset) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(dataset, null, 2)}\n`, "utf8");
  console.log(
    `Wrote ${path.relative(process.cwd(), filePath)} (${dataset.observations.length} observations)`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
