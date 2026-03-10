#!/usr/bin/env tsx

import fs from "fs/promises";
import path from "path";
import { CATEGORIES } from "../src/lib/constants";
import { loadCulturePageData } from "../src/lib/culture-summary";
import { loadEconomicsPageData } from "../src/lib/economics-summary";
import { loadEducationPageData } from "../src/lib/education-summary";
import { formatNumber } from "../src/lib/format";
import { loadHealthPageData } from "../src/lib/health-summary";
import { loadHouseholdsPageData } from "../src/lib/households-summary";
import type { CategoryOverview, Dataset, HeadlineStat } from "../src/lib/types";

const DATA_DIR = path.join(process.cwd(), "data");
const TOTAL_DATASET_PATH = path.join(
  DATA_DIR,
  "fetched",
  "nomis",
  "population",
  "census-2021-population-total.json"
);
const REGIONAL_DATASET_PATH = path.join(
  DATA_DIR,
  "fetched",
  "nomis",
  "population",
  "census-2021-population-by-region.json"
);
const LOCAL_AUTHORITY_DATASET_PATH = path.join(
  DATA_DIR,
  "fetched",
  "nomis",
  "population",
  "census-2021-population-by-local-authority.json"
);

async function main() {
  const [totalDataset, regionalDataset, localAuthorityDataset] =
    await Promise.all([
      readJson<Dataset>(TOTAL_DATASET_PATH),
      readJson<Dataset>(REGIONAL_DATASET_PATH),
      readJson<Dataset>(LOCAL_AUTHORITY_DATASET_PATH),
    ]);
  const [householdsData, educationData, economicsData, healthData, cultureData] =
    await Promise.all([
      loadHouseholdsPageData(),
      loadEducationPageData(),
      loadEconomicsPageData(),
      loadHealthPageData(),
      loadCulturePageData(),
    ]);

  const englandAndWalesSource = {
    name: totalDataset.metadata.name,
    publisher: totalDataset.metadata.publisher,
    referenceDate: totalDataset.metadata.referenceDate,
    url: totalDataset.metadata.url,
  } as const;

  const coreBlackPopulation = getObservationValue(
    totalDataset,
    "K04000001",
    "all_black"
  );
  const inclusiveBlackPopulation = getObservationValue(
    totalDataset,
    "K04000001",
    "all_black_including_mixed"
  );
  const londonCorePopulation = getObservationValue(
    regionalDataset,
    "E12000007",
    "all_black"
  );
  const londonTotalPopulation = getObservationValue(
    regionalDataset,
    "E12000007",
    "all_ethnicities"
  );
  const topLocalAuthority = getTopLocalAuthority(localAuthorityDataset);

  const headlineStats: HeadlineStat[] = [
    {
      label: "Core Black population",
      sublabel: "England and Wales",
      value: {
        value: coreBlackPopulation,
        unit: "count",
        formatted: formatNumber(coreBlackPopulation),
      },
      source: englandAndWalesSource,
    },
    {
      label: "Including mixed White/Black groups",
      sublabel: "England and Wales",
      value: {
        value: inclusiveBlackPopulation,
        unit: "count",
        formatted: formatNumber(inclusiveBlackPopulation),
      },
      source: englandAndWalesSource,
    },
    {
      label: "Largest regional population",
      sublabel: "London",
      value: {
        value: londonCorePopulation,
        unit: "count",
        formatted: formatNumber(londonCorePopulation),
      },
      source: englandAndWalesSource,
      trend: {
        direction: "stable",
        description: `${formatPercent(
          londonCorePopulation,
          londonTotalPopulation
        )} of London's population`,
      },
    },
    {
      label: "Largest local authority",
      sublabel: topLocalAuthority.geography.name,
      value: {
        value: topLocalAuthority.value.value,
        unit: "count",
        formatted: topLocalAuthority.value.formatted ?? formatNumber(topLocalAuthority.value.value),
      },
      source: englandAndWalesSource,
    },
  ];

  const populationCategory = CATEGORIES.find(
    (category) => category.slug === "population"
  );

  if (!populationCategory) {
    throw new Error("Population category configuration is missing.");
  }

  const populationOverview: CategoryOverview = {
    category: "population",
    title: populationCategory.title,
    description: populationCategory.description,
    headlines: headlineStats.slice(0, 3),
    subcategories: populationCategory.subcategories,
  };
  const educationCategory = CATEGORIES.find(
    (category) => category.slug === "education"
  );

  if (!educationCategory) {
    throw new Error("Education category configuration is missing.");
  }

  const whiteAndBlackCaribbean = educationData.metricRows.find(
    (row) => row.key === "mixed_white_black_caribbean"
  );
  const blackCaribbean = educationData.metricRows.find(
    (row) => row.key === "black_caribbean"
  );
  const allPupils = educationData.metricRows.find(
    (row) => row.key === "all_ethnicities"
  );

  if (!whiteAndBlackCaribbean || !blackCaribbean || !allPupils) {
    throw new Error("Education overview is missing required metric rows.");
  }

  const educationHeadlines: HeadlineStat[] = [
    {
      label: "White and Black Caribbean suspension rate",
      sublabel: educationData.latestLabel,
      value: {
        value: whiteAndBlackCaribbean.suspensionRate,
        unit: "percentage",
      },
      source: {
        name: educationData.source.name,
        publisher: educationData.source.publisher,
        referenceDate: educationData.source.referenceDate,
        url: educationData.source.url,
      },
      trend:
        whiteAndBlackCaribbean.suspensionRateChange === null
          ? undefined
          : {
              direction:
                whiteAndBlackCaribbean.suspensionRateChange > 0
                  ? "up"
                  : whiteAndBlackCaribbean.suspensionRateChange < 0
                    ? "down"
                    : "stable",
              description: `${formatSignedPoints(
                whiteAndBlackCaribbean.suspensionRateChange
              )} vs ${educationData.previousLabel ?? "previous release"}`,
            },
    },
    {
      label: "Black Caribbean suspension rate",
      sublabel: educationData.latestLabel,
      value: {
        value: blackCaribbean.suspensionRate,
        unit: "percentage",
      },
      source: {
        name: educationData.source.name,
        publisher: educationData.source.publisher,
        referenceDate: educationData.source.referenceDate,
        url: educationData.source.url,
      },
    },
    {
      label: "All-pupil England baseline",
      sublabel: educationData.latestLabel,
      value: {
        value: allPupils.suspensionRate,
        unit: "percentage",
      },
      source: {
        name: educationData.source.name,
        publisher: educationData.source.publisher,
        referenceDate: educationData.source.referenceDate,
        url: educationData.source.url,
      },
    },
  ];

  const educationOverview: CategoryOverview = {
    category: "education",
    title: educationCategory.title,
    description: educationCategory.description,
    headlines: educationHeadlines,
    subcategories: educationCategory.subcategories,
  };

  const economicsCategory = CATEGORIES.find(
    (category) => category.slug === "economics"
  );

  if (!economicsCategory) {
    throw new Error("Economics category configuration is missing.");
  }

  const economicsHeadlines: HeadlineStat[] = [
    {
      label: "Black employment rate",
      sublabel: economicsData.latestLabel,
      value: {
        value: economicsData.headline.blackEmploymentRate,
        unit: "percentage",
      },
      source: {
        name: economicsData.source.name,
        publisher: economicsData.source.publisher,
        referenceDate: economicsData.source.referenceDate,
        url: economicsData.source.url,
      },
    },
    {
      label: "Black unemployment rate",
      sublabel: economicsData.latestLabel,
      value: {
        value: economicsData.headline.blackUnemploymentRate,
        unit: "percentage",
      },
      source: {
        name: economicsData.source.name,
        publisher: economicsData.source.publisher,
        referenceDate: economicsData.source.referenceDate,
        url: economicsData.source.url,
      },
    },
    {
      label: "Black inactivity rate",
      sublabel: economicsData.latestLabel,
      value: {
        value: economicsData.headline.blackInactivityRate,
        unit: "percentage",
      },
      source: {
        name: economicsData.source.name,
        publisher: economicsData.source.publisher,
        referenceDate: economicsData.source.referenceDate,
        url: economicsData.source.url,
      },
    },
  ];

  const economicsOverview: CategoryOverview = {
    category: "economics",
    title: economicsCategory.title,
    description: economicsCategory.description,
    headlines: economicsHeadlines,
    subcategories: economicsCategory.subcategories,
  };

  const householdsCategory = CATEGORIES.find(
    (category) => category.slug === "households"
  );

  if (!householdsCategory) {
    throw new Error("Households category configuration is missing.");
  }

  const blackCaribbeanHomeOwnership = householdsData.rows.find(
    (row) => row.key === "black_caribbean"
  );

  if (!blackCaribbeanHomeOwnership) {
    throw new Error("Households overview is missing Black Caribbean home ownership.");
  }

  const householdsHeadlines: HeadlineStat[] = [
    {
      label: "All Black home ownership",
      sublabel: householdsData.latestLabel,
      value: {
        value: householdsData.headline.allBlackRate,
        unit: "percentage",
      },
      source: toSourceReference(householdsData.source),
      trend: {
        direction: "down",
        description: `${formatSignedPoints(
          householdsData.headline.gapToOverall
        )} vs all ethnicities`,
      },
    },
    {
      label: "All households baseline",
      sublabel: householdsData.latestLabel,
      value: {
        value: householdsData.headline.overallRate,
        unit: "percentage",
      },
      source: toSourceReference(householdsData.source),
    },
    {
      label: "Black Caribbean home ownership",
      sublabel: householdsData.latestLabel,
      value: {
        value: blackCaribbeanHomeOwnership.rate,
        unit: "percentage",
      },
      source: toSourceReference(householdsData.source),
    },
  ];

  const householdsOverview: CategoryOverview = {
    category: "households",
    title: householdsCategory.title,
    description: householdsCategory.description,
    headlines: householdsHeadlines,
    subcategories: householdsCategory.subcategories,
  };

  const healthCategory = CATEGORIES.find((category) => category.slug === "health");

  if (!healthCategory) {
    throw new Error("Health category configuration is missing.");
  }

  const healthHeadlines: HeadlineStat[] = [
    {
      label: "All Black detention rate",
      sublabel: healthData.latestLabel,
      value: {
        value: healthData.headline.allBlackRate,
        unit: "rate_per_100000",
      },
      source: toSourceReference(healthData.source),
      trend:
        healthData.previousLabel === null
          ? undefined
          : {
              direction: "stable",
              description: `Standardised rate per 100,000 vs ${healthData.previousLabel}`,
            },
    },
    {
      label: "Black Caribbean detention rate",
      sublabel: healthData.latestLabel,
      value: {
        value: healthData.headline.blackCaribbeanRate,
        unit: "rate_per_100000",
      },
      source: toSourceReference(healthData.source),
    },
    {
      label: "Other Black detention rate",
      sublabel: healthData.latestLabel,
      value: {
        value: healthData.headline.otherBlackRate,
        unit: "rate_per_100000",
      },
      source: toSourceReference(healthData.source),
    },
  ];

  const healthOverview: CategoryOverview = {
    category: "health",
    title: healthCategory.title,
    description: healthCategory.description,
    headlines: healthHeadlines,
    subcategories: healthCategory.subcategories,
  };

  const cultureCategory = CATEGORIES.find(
    (category) => category.slug === "culture-geography"
  );

  if (!cultureCategory) {
    throw new Error("Culture & Geography category configuration is missing.");
  }

  const cultureHeadlines: HeadlineStat[] = [
    {
      label: "All Black stop and search rate",
      sublabel: cultureData.latestLabel,
      value: {
        value: cultureData.headline.allBlackRate,
        unit: "rate_per_1000",
      },
      source: toSourceReference(cultureData.source),
    },
    {
      label: "Overall stop and search rate",
      sublabel: cultureData.latestLabel,
      value: {
        value: cultureData.headline.overallRate,
        unit: "rate_per_1000",
      },
      source: toSourceReference(cultureData.source),
    },
    {
      label: "Black disproportionality ratio",
      sublabel: cultureData.latestLabel,
      value: {
        value: cultureData.headline.disproportionalityRatio,
        unit: "index",
        formatted: `${cultureData.headline.disproportionalityRatio.toFixed(1)}x`,
      },
      source: toSourceReference(cultureData.source),
    },
  ];

  const cultureOverview: CategoryOverview = {
    category: "culture-geography",
    title: cultureCategory.title,
    description: cultureCategory.description,
    headlines: cultureHeadlines,
    subcategories: cultureCategory.subcategories,
  };

  await writeJson(
    path.join(DATA_DIR, "derived", "headline-stats.json"),
    headlineStats
  );
  await writeJson(
    path.join(DATA_DIR, "derived", "category-overviews", "population.json"),
    populationOverview
  );
  await writeJson(
    path.join(DATA_DIR, "derived", "category-overviews", "education.json"),
    educationOverview
  );
  await writeJson(
    path.join(DATA_DIR, "derived", "category-overviews", "economics.json"),
    economicsOverview
  );
  await writeJson(
    path.join(DATA_DIR, "derived", "category-overviews", "households.json"),
    householdsOverview
  );
  await writeJson(
    path.join(DATA_DIR, "derived", "category-overviews", "health.json"),
    healthOverview
  );
  await writeJson(
    path.join(DATA_DIR, "derived", "category-overviews", "culture-geography.json"),
    cultureOverview
  );

  console.log("Wrote derived homepage data.");
}

async function readJson<T>(filePath: string): Promise<T> {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw) as T;
}

function getObservationValue(
  dataset: Dataset,
  geographyCode: string,
  ethnicGroup: Dataset["observations"][number]["ethnicGroup"]
): number {
  const observation = dataset.observations.find(
    (candidate) =>
      candidate.geography.code === geographyCode &&
      candidate.ethnicGroup === ethnicGroup
  );

  if (!observation) {
    throw new Error(
      `Missing observation for ${geographyCode} / ${ethnicGroup} in ${dataset.id}`
    );
  }

  return observation.value.value;
}

function getTopLocalAuthority(dataset: Dataset) {
  const candidates = dataset.observations
    .filter((observation) => observation.ethnicGroup === "all_black")
    .sort((left, right) => right.value.value - left.value.value);

  const top = candidates[0];

  if (!top) {
    throw new Error("No local authority observations found.");
  }

  return top;
}

function formatPercent(part: number, whole: number): string {
  if (whole === 0) return "0.0%";
  return `${((part / whole) * 100).toFixed(1)}%`;
}

function formatSignedPoints(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)} pts`;
}

function toSourceReference(source: Dataset["metadata"]) {
  return {
    name: source.name,
    publisher: source.publisher,
    referenceDate: source.referenceDate,
    url: source.url,
  } as const;
}

async function writeJson(filePath: string, value: unknown) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
