import { loadDataset } from "./data-loader";
import { getEthnicityLabel, getEthnicityShortLabel } from "./ethnicity";
import type { Dataset, EthnicGroup, SourceMetadata } from "./types";

const DATASET_PATH = "fetched/eff/households/home-ownership-national.json";

type HouseholdsMeasure = "rate" | "homeowners" | "households";

export interface HomeOwnershipRow {
  key: EthnicGroup;
  label: string;
  shortLabel: string;
  rate: number;
  homeowners: number;
  households: number;
  gapToOverall: number;
}

export interface HouseholdsHeadline {
  allBlackRate: number;
  allBlackIncludingMixedRate: number;
  overallRate: number;
  gapToOverall: number;
}

export interface HouseholdsPageData {
  latestLabel: string;
  headline: HouseholdsHeadline;
  rows: HomeOwnershipRow[];
  source: SourceMetadata;
}

export async function loadHouseholdsPageData(): Promise<HouseholdsPageData> {
  const dataset = await loadDataset(DATASET_PATH);
  const latestLabel = dataset.metadata.referenceDate;
  const overallRate = getMeasure(dataset, "all_ethnicities", latestLabel, "rate");

  const rows = getGroups(dataset).map((group) => ({
    key: group,
    label: getEthnicityLabel(group),
    shortLabel: getEthnicityShortLabel(group),
    rate: getMeasure(dataset, group, latestLabel, "rate"),
    homeowners: getMeasure(dataset, group, latestLabel, "homeowners"),
    households: getMeasure(dataset, group, latestLabel, "households"),
    gapToOverall:
      getMeasure(dataset, group, latestLabel, "rate") - overallRate,
  }));

  return {
    latestLabel,
    headline: {
      allBlackRate: getMeasure(dataset, "all_black", latestLabel, "rate"),
      allBlackIncludingMixedRate: getMeasure(
        dataset,
        "all_black_including_mixed",
        latestLabel,
        "rate"
      ),
      overallRate,
      gapToOverall: getMeasure(dataset, "all_black", latestLabel, "rate") - overallRate,
    },
    rows: rows.sort((left, right) => right.rate - left.rate),
    source: dataset.metadata,
  };
}

function getGroups(dataset: Dataset): EthnicGroup[] {
  return Array.from(
    new Set(
      dataset.observations
        .filter((observation) => observation.attributes?.measure === "rate")
        .map((observation) => observation.ethnicGroup)
    )
  );
}

function getMeasure(
  dataset: Dataset,
  ethnicGroup: EthnicGroup,
  timePeriod: string,
  measure: HouseholdsMeasure
) {
  const observation = dataset.observations.find(
    (candidate) =>
      candidate.ethnicGroup === ethnicGroup &&
      candidate.timePeriod === timePeriod &&
      candidate.attributes?.measure === measure
  );

  if (!observation) {
    throw new Error(
      `Missing households observation for ${ethnicGroup} / ${timePeriod} / ${measure}`
    );
  }

  return observation.value.value;
}
