import { loadDataset } from "./data-loader";
import { getEthnicityLabel, getEthnicityShortLabel } from "./ethnicity";
import type { Dataset, EthnicGroup, SourceMetadata } from "./types";

const DATASET_PATH = "fetched/eff/health/mental-health-act-detentions.json";
const TREND_GROUPS: EthnicGroup[] = [
  "all_black",
  "black_african",
  "black_caribbean",
  "other_black",
];

type HealthMeasure = "standardised_rate" | "crude_rate" | "detentions" | "population";

export interface HealthMetricRow {
  key: EthnicGroup;
  label: string;
  shortLabel: string;
  rate: number;
  detentions: number;
  population: number | null;
  confidenceMargin: number | null;
  change: number | null;
}

export interface HealthTrendRow {
  timePeriod: string;
  label: string;
  allBlackRate: number | null;
  blackAfricanRate: number | null;
  blackCaribbeanRate: number | null;
  otherBlackRate: number | null;
}

export interface HealthHeadline {
  allBlackRate: number;
  blackCaribbeanRate: number;
  blackAfricanRate: number;
  otherBlackRate: number;
}

export interface HealthPageData {
  latestLabel: string;
  previousLabel: string | null;
  headline: HealthHeadline;
  metricRows: HealthMetricRow[];
  trendRows: HealthTrendRow[];
  source: SourceMetadata;
}

export async function loadHealthPageData(): Promise<HealthPageData> {
  const dataset = await loadDataset(DATASET_PATH);
  const timePeriods = getTimePeriods(dataset);
  const latest = timePeriods.at(-1);
  const previous = timePeriods.at(-2) ?? null;

  if (!latest) {
    throw new Error("Health dataset is missing a latest time period.");
  }

  const metricRows = getMetricGroups(dataset, latest).map((group) => ({
    key: group,
    label: getEthnicityLabel(group),
    shortLabel: getEthnicityShortLabel(group),
    rate: getMeasure(dataset, group, latest, "standardised_rate"),
    detentions: getMeasure(dataset, group, latest, "detentions"),
    population: getOptionalMeasure(dataset, group, latest, "population"),
    confidenceMargin: getConfidenceMargin(dataset, group, latest),
    change: getChange(dataset, group, latest, previous),
  }));

  const trendRows = timePeriods.map((timePeriod) => ({
    timePeriod,
    label: timePeriod,
    allBlackRate: getOptionalMeasure(
      dataset,
      "all_black",
      timePeriod,
      "standardised_rate"
    ),
    blackAfricanRate: getOptionalMeasure(
      dataset,
      "black_african",
      timePeriod,
      "standardised_rate"
    ),
    blackCaribbeanRate: getOptionalMeasure(
      dataset,
      "black_caribbean",
      timePeriod,
      "standardised_rate"
    ),
    otherBlackRate: getOptionalMeasure(
      dataset,
      "other_black",
      timePeriod,
      "standardised_rate"
    ),
  }));

  return {
    latestLabel: latest,
    previousLabel: previous,
    headline: {
      allBlackRate: getMeasure(dataset, "all_black", latest, "standardised_rate"),
      blackCaribbeanRate: getMeasure(
        dataset,
        "black_caribbean",
        latest,
        "standardised_rate"
      ),
      blackAfricanRate: getMeasure(
        dataset,
        "black_african",
        latest,
        "standardised_rate"
      ),
      otherBlackRate: getMeasure(dataset, "other_black", latest, "standardised_rate"),
    },
    metricRows: metricRows.sort((left, right) => right.rate - left.rate),
    trendRows,
    source: dataset.metadata,
  };
}

function getMetricGroups(dataset: Dataset, timePeriod: string): EthnicGroup[] {
  return Array.from(
    new Set(
      dataset.observations
        .filter(
          (observation) =>
            observation.timePeriod === timePeriod &&
            observation.attributes?.measure === "standardised_rate"
        )
        .map((observation) => observation.ethnicGroup)
    )
  );
}

function getTimePeriods(dataset: Dataset) {
  return Array.from(
    new Set(dataset.observations.map((observation) => observation.timePeriod))
  ).sort((left, right) => left.localeCompare(right, "en-GB", { numeric: true }));
}

function getMeasure(
  dataset: Dataset,
  ethnicGroup: EthnicGroup,
  timePeriod: string,
  measure: HealthMeasure
) {
  const observation = dataset.observations.find(
    (candidate) =>
      candidate.ethnicGroup === ethnicGroup &&
      candidate.timePeriod === timePeriod &&
      candidate.attributes?.measure === measure
  );

  if (!observation) {
    throw new Error(
      `Missing health observation for ${ethnicGroup} / ${timePeriod} / ${measure}`
    );
  }

  return observation.value.value;
}

function getOptionalMeasure(
  dataset: Dataset,
  ethnicGroup: EthnicGroup,
  timePeriod: string,
  measure: HealthMeasure
) {
  const observation = dataset.observations.find(
    (candidate) =>
      candidate.ethnicGroup === ethnicGroup &&
      candidate.timePeriod === timePeriod &&
      candidate.attributes?.measure === measure
  );

  return observation ? observation.value.value : null;
}

function getConfidenceMargin(
  dataset: Dataset,
  ethnicGroup: EthnicGroup,
  timePeriod: string
) {
  const observation = dataset.observations.find(
    (candidate) =>
      candidate.ethnicGroup === ethnicGroup &&
      candidate.timePeriod === timePeriod &&
      candidate.attributes?.measure === "standardised_rate"
  );

  const rawValue = observation?.attributes?.confidence_margin;
  return rawValue ? Number(rawValue) : null;
}

export function getHealthTrendGroups() {
  return TREND_GROUPS;
}

function getChange(
  dataset: Dataset,
  ethnicGroup: EthnicGroup,
  latest: string,
  previous: string | null
) {
  if (previous === null) {
    return null;
  }

  const latestValue = getOptionalMeasure(
    dataset,
    ethnicGroup,
    latest,
    "standardised_rate"
  );
  const previousValue = getOptionalMeasure(
    dataset,
    ethnicGroup,
    previous,
    "standardised_rate"
  );

  if (latestValue === null || previousValue === null) {
    return null;
  }

  return latestValue - previousValue;
}
