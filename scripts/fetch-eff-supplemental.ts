#!/usr/bin/env tsx

import fs from "fs/promises";
import path from "path";
import { formatNumber, formatPercent } from "../src/lib/format";
import type { DataObservation, Dataset, EthnicGroup } from "../src/lib/types";
import { fetchText } from "./utils/api-client";
import {
  compareTimePeriods,
  fetchLastModifiedDate,
  normaliseLabel,
  parseCsv,
  parseNumber,
  type CsvRow,
} from "./utils/source-utils";

const OUTPUT_ROOT = path.join(process.cwd(), "data", "fetched");
const CURRENT_DATE = new Date().toISOString().slice(0, 10);
const ENGLAND = {
  code: "E92000001",
  name: "England",
  level: "national",
} as const;
const ENGLAND_AND_WALES = {
  code: "K04000001",
  name: "England and Wales",
  level: "national",
} as const;
const UNITED_KINGDOM = {
  code: "K02000001",
  name: "United Kingdom",
  level: "national",
} as const;

const BROAD_EFF_GROUPS: Record<string, EthnicGroup> = {
  all: "all_ethnicities",
  black: "all_black",
};

const DETAILED_EFF_GROUPS: Record<string, EthnicGroup> = {
  ...BROAD_EFF_GROUPS,
  "black african": "black_african",
  "black caribbean": "black_caribbean",
  "any other black background": "other_black",
  "mixed white and black african": "mixed_white_black_african",
  "mixed white and black caribbean": "mixed_white_black_caribbean",
};

async function main() {
  await Promise.all([
    writeLowIncomeDataset(),
    writeGcseDataset(),
    writeALevelDataset(),
    writeUniversityEntryDataset(),
    writeUniversityDegreeDataset(),
    writeCrimeVictimsDataset(),
  ]);
}

async function writeLowIncomeDataset() {
  const pageUrl =
    "https://www.ethnicity-facts-figures.service.gov.uk/work-pay-and-benefits/pay-and-income/people-in-low-income-households/latest/";
  const csvUrl = `${pageUrl}downloads/low-income-households-data-2008-09-to-2023-24.csv`;
  const [csv, datePublished] = await Promise.all([
    fetchText(csvUrl),
    fetchLastModifiedDate(pageUrl),
  ]);
  const rows = parseCsv(csv, "low income households").filter(
    (row) =>
      row.measure === "Low income After Housing Costs" &&
      row.geography === "United Kingdom" &&
      row.age_bracket === "All" &&
      BROAD_EFF_GROUPS[normaliseLabel(row.ethnicity)] !== undefined
  );

  const observations: DataObservation[] = rows.flatMap((row) => {
    const group = BROAD_EFF_GROUPS[normaliseLabel(row.ethnicity)];
    const value = parseNumber(row.value);

    if (!group || value === null) {
      return [];
    }

    return [
      {
        ethnicGroup: group,
        geography: UNITED_KINGDOM,
        timePeriod: row.time,
        attributes: {
          measure: "rate",
          average_type: row.time_type,
          housing_costs: "after",
        },
        value: {
          value,
          unit: "percentage",
          formatted: formatPercent(value, 1),
        },
      },
    ];
  });

  const latestTime =
    [...new Set(observations.map((observation) => observation.timePeriod))]
      .sort(compareTimePeriods)
      .at(-1) ?? "";

  await writeDataset(
    path.join(
      OUTPUT_ROOT,
      "eff",
      "households",
      "low-income-households-national.json"
    ),
    {
      id: "eff-low-income-households-national",
      title: "People in low-income households by ethnicity",
      description:
        "Percentage of people living in low-income households after housing costs in the United Kingdom, comparing the broad Black group with the all-population baseline.",
      siteCategory: "households",
      siteSubcategory: "income",
      metadata: {
        id: "eff-low-income-households",
        name: "Ethnicity Facts and Figures: People in low-income households",
        publisher: "Race Disparity Unit / Cabinet Office",
        url: pageUrl,
        apiEndpoint: csvUrl,
        datePublished,
        dateAccessed: CURRENT_DATE,
        referenceDate: latestTime,
        referencePeriod: latestTime,
        geographicCoverage: "United Kingdom",
        methodology:
          "Fetched from the official Ethnicity Facts and Figures low-income households download. This implementation keeps the after-housing-costs UK time series for the broad Black group and the all-population baseline.",
        qualityFlags: ["official_statistic"],
        caveats: [
          "The published ethnicity split for this measure is broad-group only; it does not separate Black African, Black Caribbean, and Other Black.",
          "This release uses pooled multi-year averages rather than single-year estimates.",
        ],
        license: "Open Government Licence v3.0",
        fetchMethod: "csv_download",
      },
      dimensions: ["ethnic_group", "time", "measure", "average_type"],
      observations,
    }
  );
}

async function writeGcseDataset() {
  const pageUrl =
    "https://www.ethnicity-facts-figures.service.gov.uk/education-skills-and-training/11-to-16-years-old/gcse-results-attainment-8-for-children-aged-14-to-16-key-stage-4/latest/";
  const csvUrl = `${pageUrl}downloads/gcse-results-attainment-8-2022-to-2023-national.csv`;
  const [csv, datePublished] = await Promise.all([
    fetchText(csvUrl),
    fetchLastModifiedDate(pageUrl),
  ]);
  const rows = parseCsv(csv, "gcse attainment").filter(
    (row) =>
      row.measure === "Average Attainment 8 score" &&
      row.geography === "England" &&
      row.gender === "All" &&
      row.age === "11 to 16" &&
      row.fsm === "All" &&
      row.sen_type === "All" &&
      row.sen_grouping === "All" &&
      row.admission_type === "All" &&
      row.establishment_type === "All state-funded" &&
      row.religious_denomination === "All" &&
      DETAILED_EFF_GROUPS[normaliseLabel(row.ethnicity)] !== undefined
  );

  const observations = createWeightedRateObservations(rows, {
    geography: ENGLAND,
    groupMap: DETAILED_EFF_GROUPS,
    rateField: "value",
    denominatorField: "denominator",
    numeratorField: "numerator",
    rateMeasure: "attainment_8_score",
    denominatorMeasure: "pupils",
    includeDerivedInclusive: true,
  });
  const latestTime =
    [...new Set(rows.map((row) => row.time))].sort(compareTimePeriods).at(-1) ?? "";

  await writeDataset(
    path.join(
      OUTPUT_ROOT,
      "eff",
      "education",
      "gcse-attainment-national.json"
    ),
    {
      id: "eff-gcse-attainment-national",
      title: "GCSE Attainment 8 by ethnicity",
      description:
        "Average Attainment 8 score for pupils aged 14 to 16 in England, including published Black subgroup rows and a derived all-Black-including-mixed aggregate.",
      siteCategory: "education",
      siteSubcategory: "gcse-a-level",
      metadata: {
        id: "eff-gcse-attainment",
        name: "Ethnicity Facts and Figures: GCSE results (Attainment 8)",
        publisher: "Race Disparity Unit / Cabinet Office",
        url: pageUrl,
        apiEndpoint: csvUrl,
        datePublished,
        dateAccessed: CURRENT_DATE,
        referenceDate: latestTime,
        referencePeriod: latestTime,
        geographicCoverage: "England",
        methodology:
          "Fetched from the official Ethnicity Facts and Figures GCSE Attainment 8 national download. This implementation keeps national all-pupil and Black subgroup rows, then derives all_black_including_mixed using the published weighted numerator and denominator.",
        qualityFlags: ["official_statistic"],
        caveats: [
          "This GCSE slice is England only.",
          "The published broad Black row is retained for all_black; all_black_including_mixed is derived from the subgroup rows and their weighted totals.",
        ],
        license: "Open Government Licence v3.0",
        fetchMethod: "csv_download",
      },
      dimensions: ["ethnic_group", "time", "measure"],
      observations,
    }
  );
}

async function writeALevelDataset() {
  const pageUrl =
    "https://www.ethnicity-facts-figures.service.gov.uk/education-skills-and-training/a-levels-apprenticeships-further-education/students-aged-16-to-18-achieving-3-a-grades-or-better-at-a-level/latest/";
  const csvUrl =
    `${pageUrl}downloads/students-aged-16-to-18-achieving-at-least-3-a-grades-at-a-level.csv`;
  const [csv, datePublished] = await Promise.all([
    fetchText(csvUrl),
    fetchLastModifiedDate(pageUrl),
  ]);
  const rows = parseCsv(csv, "a level achievement").filter(
    (row) =>
      row.measure === "Percentage of Students who achieved three A's at A Level, by ethnicity" &&
      row.geography === "England" &&
      row.age === "16-18" &&
      DETAILED_EFF_GROUPS[normaliseLabel(row.ethnicity)] !== undefined
  );

  const observations = createWeightedRateObservations(rows, {
    geography: ENGLAND,
    groupMap: DETAILED_EFF_GROUPS,
    rateField: "value",
    denominatorField: "denominator",
    rateMeasure: "three_a_rate",
    denominatorMeasure: "students",
    includeDerivedInclusive: true,
  });
  const latestTime =
    [...new Set(rows.map((row) => row.time))].sort(compareTimePeriods).at(-1) ?? "";

  await writeDataset(
    path.join(
      OUTPUT_ROOT,
      "eff",
      "education",
      "a-level-achievement-national.json"
    ),
    {
      id: "eff-a-level-achievement-national",
      title: "A-level high-grade attainment by ethnicity",
      description:
        "Percentage of students aged 16 to 18 in England achieving at least 3 A grades at A level, including Black subgroup rows and a derived all-Black-including-mixed aggregate.",
      siteCategory: "education",
      siteSubcategory: "gcse-a-level",
      metadata: {
        id: "eff-a-level-achievement",
        name: "Ethnicity Facts and Figures: Students achieving 3 A grades or better at A level",
        publisher: "Race Disparity Unit / Cabinet Office",
        url: pageUrl,
        apiEndpoint: csvUrl,
        datePublished,
        dateAccessed: CURRENT_DATE,
        referenceDate: latestTime,
        referencePeriod: latestTime,
        geographicCoverage: "England",
        methodology:
          "Fetched from the official Ethnicity Facts and Figures A-level achievement download. This implementation keeps national rows and derives all_black_including_mixed using the published cohort counts and weighted achievement rates.",
        qualityFlags: ["official_statistic"],
        caveats: [
          "This A-level slice is England only.",
          "The published broad Black row is retained for all_black; the inclusive aggregate is derived from subgroup rows.",
        ],
        license: "Open Government Licence v3.0",
        fetchMethod: "csv_download",
      },
      dimensions: ["ethnic_group", "time", "measure"],
      observations,
    }
  );
}

async function writeUniversityEntryDataset() {
  const pageUrl =
    "https://www.ethnicity-facts-figures.service.gov.uk/education-skills-and-training/higher-education/entry-rates-into-higher-education/latest/";
  const csvUrl = `${pageUrl}downloads/entry-rates-into-higher-education-data.csv`;
  const [csv, datePublished] = await Promise.all([
    fetchText(csvUrl),
    fetchLastModifiedDate(pageUrl),
  ]);
  const rows = parseCsv(csv, "university entry").filter(
    (row) =>
      row.measure ===
        "Percentage of 18-year-old state school pupils getting a higher education place" &&
      row.geography === "England" &&
      row.gender === "All" &&
      row.age === "18" &&
      BROAD_EFF_GROUPS[normaliseLabel(row.ethnicity)] !== undefined
  );

  const observations: DataObservation[] = rows.flatMap((row) => {
    const group = BROAD_EFF_GROUPS[normaliseLabel(row.ethnicity)];
    const rate = parseNumber(row.value);
    const numerator = parseNumber(row.numerator);
    const denominator = parseNumber(row.denominator);

    if (!group || rate === null) {
      return [];
    }

    const next: DataObservation[] = [
      {
        ethnicGroup: group,
        geography: ENGLAND,
        timePeriod: row.time,
        attributes: {
          measure: "entry_rate",
        },
        value: {
          value: rate,
          unit: "percentage",
          formatted: formatPercent(rate, 1),
        },
      },
    ];

    if (numerator !== null) {
      next.push({
        ethnicGroup: group,
        geography: ENGLAND,
        timePeriod: row.time,
        attributes: {
          measure: "placed_students",
        },
        value: {
          value: numerator,
          unit: "count",
          formatted: formatNumber(numerator),
        },
      });
    }

    if (denominator !== null) {
      next.push({
        ethnicGroup: group,
        geography: ENGLAND,
        timePeriod: row.time,
        attributes: {
          measure: "state_school_pupils",
        },
        value: {
          value: denominator,
          unit: "count",
          formatted: formatNumber(denominator),
        },
      });
    }

    return next;
  });
  const latestTime =
    [...new Set(rows.map((row) => row.time))].sort(compareTimePeriods).at(-1) ?? "";

  await writeDataset(
    path.join(
      OUTPUT_ROOT,
      "eff",
      "education",
      "university-entry-national.json"
    ),
    {
      id: "eff-university-entry-national",
      title: "University entry rates by ethnicity",
      description:
        "Percentage of 18-year-old state school pupils in England getting a higher education place, comparing the broad Black group with the all-population baseline.",
      siteCategory: "education",
      siteSubcategory: "university",
      metadata: {
        id: "eff-university-entry",
        name: "Ethnicity Facts and Figures: Entry rates into higher education",
        publisher: "Race Disparity Unit / Cabinet Office",
        url: pageUrl,
        apiEndpoint: csvUrl,
        datePublished,
        dateAccessed: CURRENT_DATE,
        referenceDate: latestTime,
        referencePeriod: "2006 to 2024",
        geographicCoverage: "England",
        methodology:
          "Fetched from the official Ethnicity Facts and Figures higher-education entry download. This implementation keeps the national broad Black and all-pupils series for state school pupils aged 18.",
        qualityFlags: ["official_statistic"],
        caveats: [
          "The published ethnicity split for this measure is broad-group only.",
          "This series covers England state school pupils aged 18, not all young people in the UK.",
        ],
        license: "Open Government Licence v3.0",
        fetchMethod: "csv_download",
      },
      dimensions: ["ethnic_group", "time", "measure"],
      observations,
    }
  );
}

async function writeUniversityDegreeDataset() {
  const pageUrl =
    "https://www.ethnicity-facts-figures.service.gov.uk/education-skills-and-training/higher-education/undergraduate-degree-results/latest/";
  const csvUrl = `${pageUrl}downloads/undergraduate-degree-results-2014-to-2022.csv`;
  const [csv, datePublished] = await Promise.all([
    fetchText(csvUrl),
    fetchLastModifiedDate(pageUrl),
  ]);
  const rows = parseCsv(csv, "undergraduate degree results").filter(
    (row) =>
      row.measure === "Percentage of ethnic group with each classification of degree" &&
      row.geography === "United Kingdom" &&
      BROAD_EFF_GROUPS[normaliseLabel(row.ethnicity)] !== undefined
  );

  const observations: DataObservation[] = rows.flatMap((row) => {
    const group = BROAD_EFF_GROUPS[normaliseLabel(row.ethnicity)];
    const value = parseNumber(row.value);
    const numerator = parseNumber(row.numerator);
    const denominator = parseNumber(row.denominator);

    if (!group || value === null) {
      return [];
    }

    const category = normaliseLabel(row.classification_of_first_degree);
    const next: DataObservation[] = [
      {
        ethnicGroup: group,
        geography: UNITED_KINGDOM,
        timePeriod: row.time,
        category,
        attributes: {
          measure: "share",
          classification: category,
        },
        value: {
          value,
          unit: "percentage",
          formatted: formatPercent(value, 1),
        },
      },
    ];

    if (numerator !== null) {
      next.push({
        ethnicGroup: group,
        geography: UNITED_KINGDOM,
        timePeriod: row.time,
        category,
        attributes: {
          measure: "count",
          classification: category,
        },
        value: {
          value: numerator,
          unit: "count",
          formatted: formatNumber(numerator),
        },
      });
    }

    if (denominator !== null) {
      next.push({
        ethnicGroup: group,
        geography: UNITED_KINGDOM,
        timePeriod: row.time,
        attributes: {
          measure: "graduates",
        },
        value: {
          value: denominator,
          unit: "count",
          formatted: formatNumber(denominator),
        },
      });
    }

    return next;
  });
  const latestTime =
    [...new Set(rows.map((row) => row.time))].sort(compareTimePeriods).at(-1) ?? "";

  await writeDataset(
    path.join(
      OUTPUT_ROOT,
      "eff",
      "education",
      "undergraduate-degree-results-national.json"
    ),
    {
      id: "eff-undergraduate-degree-results-national",
      title: "Undergraduate degree results by ethnicity",
      description:
        "Degree classification outcomes in the United Kingdom, comparing the broad Black group with the all-students baseline.",
      siteCategory: "education",
      siteSubcategory: "university",
      metadata: {
        id: "eff-undergraduate-degree-results",
        name: "Ethnicity Facts and Figures: Undergraduate degree results",
        publisher: "Race Disparity Unit / Cabinet Office",
        url: pageUrl,
        apiEndpoint: csvUrl,
        datePublished,
        dateAccessed: CURRENT_DATE,
        referenceDate: latestTime,
        referencePeriod: "2014/15 to 2021/22",
        geographicCoverage: "United Kingdom",
        methodology:
          "Fetched from the official Ethnicity Facts and Figures undergraduate degree results download. This implementation keeps the broad Black and all-students series across degree classifications.",
        qualityFlags: ["official_statistic"],
        caveats: [
          "The published ethnicity split for this measure is broad-group only.",
          "This series currently ends at academic year 2021/22 on the official page.",
        ],
        license: "Open Government Licence v3.0",
        fetchMethod: "csv_download",
      },
      dimensions: ["ethnic_group", "time", "classification", "measure"],
      observations,
    }
  );
}

async function writeCrimeVictimsDataset() {
  const pageUrl =
    "https://www.ethnicity-facts-figures.service.gov.uk/crime-justice-and-the-law/crime-and-reoffending/crime-victims/latest/";
  const csvUrl = `${pageUrl}downloads/victims-of-crime-data.csv`;
  const [csv, datePublished] = await Promise.all([
    fetchText(csvUrl),
    fetchLastModifiedDate(pageUrl),
  ]);
  const rows = parseCsv(csv, "crime victims").filter(
    (row) =>
      row.geography === "England and Wales" &&
      row.gender === "All" &&
      row.age === "16+" &&
      normaliseLabel(row.measure).includes("victims of all csew crime") &&
      DETAILED_EFF_GROUPS[normaliseLabel(row.ethnicity)] !== undefined
  );
  const latestTime =
    [...new Set(rows.map((row) => row.time))].sort(compareTimePeriods).at(-1) ?? "";

  const observations: DataObservation[] = rows
    .filter((row) => row.time === latestTime)
    .flatMap((row) => {
      const group = DETAILED_EFF_GROUPS[normaliseLabel(row.ethnicity)];
      const value = parseNumber(row.value);
      const sampleSize = parseNumber(row.sample_size);
      const lower = parseNumber(row.lower_ci);
      const upper = parseNumber(row.upper_ci);

      if (!group || value === null) {
        return [];
      }

      const next: DataObservation[] = [
        {
          ethnicGroup: group,
          geography: ENGLAND_AND_WALES,
          timePeriod: row.time,
          attributes: {
            measure: "victimisation_rate",
          },
          value: {
            value,
            unit: "percentage",
            formatted: formatPercent(value, 1),
            confidence:
              lower === null || upper === null
                ? undefined
                : {
                    lower,
                    upper,
                    level: 95,
                  },
          },
        },
      ];

      if (sampleSize !== null) {
        next.push({
          ethnicGroup: group,
          geography: ENGLAND_AND_WALES,
          timePeriod: row.time,
          attributes: {
            measure: "sample_size",
          },
          value: {
            value: sampleSize,
            unit: "count",
            formatted: formatNumber(sampleSize),
          },
        });
      }

      return next;
    });

  await writeDataset(
    path.join(
      OUTPUT_ROOT,
      "eff",
      "culture-geography",
      "crime-victims-national.json"
    ),
    {
      id: "eff-crime-victims-national",
      title: "Victims of crime by ethnicity",
      description:
        "Proportion of adults who were victims of all CSEW crime, including fraud and computer misuse, in England and Wales.",
      siteCategory: "culture-geography",
      siteSubcategory: "crime",
      metadata: {
        id: "eff-crime-victims",
        name: "Ethnicity Facts and Figures: Crime victims",
        publisher: "Race Disparity Unit / Cabinet Office",
        url: pageUrl,
        apiEndpoint: csvUrl,
        datePublished,
        dateAccessed: CURRENT_DATE,
        referenceDate: latestTime,
        referencePeriod: latestTime,
        geographicCoverage: "England and Wales",
        methodology:
          "Fetched from the official Ethnicity Facts and Figures crime victims download. This implementation keeps the latest England and Wales adult victimisation rate and confidence interval rows.",
        qualityFlags: ["official_statistic"],
        caveats: [
          "This is a survey-based measure from the Crime Survey for England and Wales.",
          "Rates are published for the latest year only in this implementation, using the all-adults national rows.",
        ],
        license: "Open Government Licence v3.0",
        fetchMethod: "csv_download",
      },
      dimensions: ["ethnic_group", "time", "measure"],
      observations,
    }
  );
}

type WeightedRateConfig = {
  geography: DataObservation["geography"];
  groupMap: Record<string, EthnicGroup>;
  rateField: string;
  denominatorField: string;
  numeratorField?: string;
  rateMeasure: string;
  denominatorMeasure: string;
  includeDerivedInclusive?: boolean;
};

function createWeightedRateObservations(
  rows: CsvRow[],
  config: WeightedRateConfig
): DataObservation[] {
  const observations: DataObservation[] = [];
  const inclusiveBucket = {
    denominator: 0,
    weightedNumerator: 0,
  };

  for (const row of rows) {
    const group = config.groupMap[normaliseLabel(row.ethnicity)];
    const rate = parseNumber(row[config.rateField]);
    const denominator = parseNumber(row[config.denominatorField]);
    const numerator =
      config.numeratorField === undefined
        ? rate !== null && denominator !== null
          ? (rate / 100) * denominator
          : null
        : parseNumber(row[config.numeratorField]);

    if (!group || rate === null) {
      continue;
    }

    observations.push({
      ethnicGroup: group,
      geography: config.geography,
      timePeriod: row.time,
      attributes: {
        measure: config.rateMeasure,
      },
      value: {
        value: rate,
        unit: "percentage",
        formatted: formatPercent(rate, 1),
      },
    });

    if (denominator !== null) {
      observations.push({
        ethnicGroup: group,
        geography: config.geography,
        timePeriod: row.time,
        attributes: {
          measure: config.denominatorMeasure,
        },
        value: {
          value: denominator,
          unit: "count",
          formatted: formatNumber(denominator),
        },
      });
    }

    if (
      config.includeDerivedInclusive &&
      numerator !== null &&
      denominator !== null &&
      [
        "black_african",
        "black_caribbean",
        "other_black",
        "mixed_white_black_african",
        "mixed_white_black_caribbean",
      ].includes(group)
    ) {
      inclusiveBucket.denominator += denominator;
      inclusiveBucket.weightedNumerator += numerator;
    }
  }

  if (config.includeDerivedInclusive && inclusiveBucket.denominator > 0) {
    const latestTime = rows.at(-1)?.time ?? rows[0]?.time ?? "";
    observations.push({
      ethnicGroup: "all_black_including_mixed",
      geography: config.geography,
      timePeriod: latestTime,
      attributes: {
        measure: config.rateMeasure,
      },
      value: {
        value: (inclusiveBucket.weightedNumerator / inclusiveBucket.denominator) * 100,
        unit: "percentage",
        formatted: formatPercent(
          (inclusiveBucket.weightedNumerator / inclusiveBucket.denominator) * 100,
          1
        ),
      },
    });
    observations.push({
      ethnicGroup: "all_black_including_mixed",
      geography: config.geography,
      timePeriod: latestTime,
      attributes: {
        measure: config.denominatorMeasure,
      },
      value: {
        value: inclusiveBucket.denominator,
        unit: "count",
        formatted: formatNumber(inclusiveBucket.denominator),
      },
    });
  }

  return observations;
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
