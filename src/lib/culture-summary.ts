import { loadDataset } from "./data-loader";
import { getEthnicityLabel, getEthnicityShortLabel } from "./ethnicity";
import type { Dataset, EthnicGroup, SourceMetadata } from "./types";

const DATASET_PATH = "fetched/eff/culture-geography/stop-and-search-national.json";

type CultureMeasure = "rate" | "count" | "population" | "share_of_searches";

export interface StopSearchMetricRow {
  key: EthnicGroup;
  label: string;
  shortLabel: string;
  rate: number;
  count: number;
  population: number;
  gapToOverall: number;
  disproportionalityRatio: number | null;
}

export interface StopSearchTrendRow {
  timePeriod: string;
  label: string;
  allEthnicitiesRate: number;
  allBlackRate: number;
  blackAfricanRate: number;
  blackCaribbeanRate: number;
}

export interface StopSearchLegislationRow {
  key: string;
  label: string;
  totalCount: number;
  blackCount: number;
  blackShareOfSearches: number;
}

export interface CultureHeadline {
  allBlackRate: number;
  overallRate: number;
  disproportionalityRatio: number;
  blackCaribbeanRate: number;
}

export interface CulturePageData {
  latestLabel: string;
  previousLabel: string | null;
  headline: CultureHeadline;
  metricRows: StopSearchMetricRow[];
  trendRows: StopSearchTrendRow[];
  legislationRows: StopSearchLegislationRow[];
  source: SourceMetadata;
}

export async function loadCulturePageData(): Promise<CulturePageData> {
  const dataset = await loadDataset(DATASET_PATH);
  const timePeriods = getTimePeriods(dataset);
  const latest = timePeriods.at(-1);
  const previous = timePeriods.at(-2) ?? null;

  if (!latest) {
    throw new Error("Stop and search dataset is missing a latest time period.");
  }

  const overallRate = getMeasure(
    dataset,
    "all_ethnicities",
    latest,
    "All",
    "rate"
  );
  const allBlackRate = getMeasure(dataset, "all_black", latest, "All", "rate");

  const metricRows = getMetricGroups(dataset, latest).map((group) => {
    const rate = getMeasure(dataset, group, latest, "All", "rate");
    return {
      key: group,
      label: getEthnicityLabel(group),
      shortLabel: getEthnicityShortLabel(group),
      rate,
      count: getMeasure(dataset, group, latest, "All", "count"),
      population: getMeasure(dataset, group, latest, "All", "population"),
      gapToOverall: rate - overallRate,
      disproportionalityRatio: overallRate ? rate / overallRate : null,
    };
  });

  const trendRows = timePeriods.map((timePeriod) => ({
    timePeriod,
    label: timePeriod,
    allEthnicitiesRate: getMeasure(
      dataset,
      "all_ethnicities",
      timePeriod,
      "All",
      "rate"
    ),
    allBlackRate: getMeasure(dataset, "all_black", timePeriod, "All", "rate"),
    blackAfricanRate: getMeasure(
      dataset,
      "black_african",
      timePeriod,
      "All",
      "rate"
    ),
    blackCaribbeanRate: getMeasure(
      dataset,
      "black_caribbean",
      timePeriod,
      "All",
      "rate"
    ),
  }));

  const legislationRows = ["Section 1 (PACE)", "Section 60 (CJPOA)"]
    .map((legislation) => ({
      key: legislation,
      label: legislation,
      totalCount: getMeasure(
        dataset,
        "all_ethnicities",
        latest,
        legislation,
        "count"
      ),
      blackCount: getMeasure(dataset, "all_black", latest, legislation, "count"),
      blackShareOfSearches:
        (getMeasure(dataset, "all_black", latest, legislation, "count") /
          getMeasure(dataset, "all_ethnicities", latest, legislation, "count")) *
        100,
    }))
    .filter((row) => Number.isFinite(row.totalCount));

  return {
    latestLabel: latest,
    previousLabel: previous,
    headline: {
      allBlackRate,
      overallRate,
      disproportionalityRatio: overallRate ? allBlackRate / overallRate : 0,
      blackCaribbeanRate: getMeasure(
        dataset,
        "black_caribbean",
        latest,
        "All",
        "rate"
      ),
    },
    metricRows: metricRows.sort((left, right) => right.rate - left.rate),
    trendRows,
    legislationRows,
    source: dataset.metadata,
  };
}

function getTimePeriods(dataset: Dataset) {
  return Array.from(
    new Set(dataset.observations.map((observation) => observation.timePeriod))
  ).sort((left, right) => left.localeCompare(right, "en-GB", { numeric: true }));
}

function getMetricGroups(dataset: Dataset, timePeriod: string): EthnicGroup[] {
  return Array.from(
    new Set(
      dataset.observations
        .filter(
          (observation) =>
            observation.timePeriod === timePeriod &&
            observation.attributes?.measure === "rate" &&
            observation.attributes?.legislation_type === "All"
        )
        .map((observation) => observation.ethnicGroup)
    )
  );
}

function getMeasure(
  dataset: Dataset,
  ethnicGroup: EthnicGroup,
  timePeriod: string,
  legislationType: string,
  measure: CultureMeasure
) {
  const observation = dataset.observations.find(
    (candidate) =>
      candidate.ethnicGroup === ethnicGroup &&
      candidate.timePeriod === timePeriod &&
      candidate.attributes?.legislation_type === legislationType &&
      candidate.attributes?.measure === measure
  );

  if (!observation) {
    throw new Error(
      `Missing culture observation for ${ethnicGroup} / ${timePeriod} / ${legislationType} / ${measure}`
    );
  }

  return observation.value.value;
}
