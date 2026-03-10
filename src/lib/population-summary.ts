import { loadDataset, loadHeadlineStats } from "./data-loader";
import { ETHNIC_BREAKDOWN } from "./ethnicity";
import type {
  Dataset,
  HeadlineStat,
  Sex,
  SourceMetadata,
} from "./types";

const TOTAL_DATASET_PATH =
  "fetched/nomis/population/census-2021-population-total.json";
const REGIONAL_DATASET_PATH =
  "fetched/nomis/population/census-2021-population-by-region.json";
const LOCAL_AUTHORITY_DATASET_PATH =
  "fetched/nomis/population/census-2021-population-by-local-authority.json";
const AGE_SEX_DATASET_PATH =
  "fetched/nomis/population/census-2021-population-age-sex.json";

export const AGE_GROUPS = [
  { key: "24-and-under", label: "24 and under" },
  { key: "25-34", label: "25 to 34" },
  { key: "35-49", label: "35 to 49" },
  { key: "50-64", label: "50 to 64" },
  { key: "65-plus", label: "65 and over" },
] as const;

export type PopulationBreakdownKey = (typeof ETHNIC_BREAKDOWN)[number]["key"];
export type PopulationTrackedGroup =
  | PopulationBreakdownKey
  | "all_black"
  | "all_black_including_mixed"
  | "all_ethnicities";
export type PopulationAgeGroup = "all" | (typeof AGE_GROUPS)[number]["key"];

export interface PopulationBreakdownItem {
  key: PopulationBreakdownKey;
  label: string;
  value: number;
  share: number;
}

export interface GeographyPopulationSummary {
  code: string;
  name: string;
  allBlack: number;
  allBlackIncludingMixed: number;
  totalPopulation: number;
  coreShare: number;
  inclusiveShare: number;
}

export interface PopulationHomepageData {
  headlineStats: HeadlineStat[];
  englandAndWales: GeographyPopulationSummary;
  nationalBreakdown: PopulationBreakdownItem[];
  regionalRows: GeographyPopulationSummary[];
  topLocalAuthorities: GeographyPopulationSummary[];
  source: SourceMetadata;
}

export interface PopulationSexRow {
  key: PopulationTrackedGroup;
  label: string;
  female: number;
  male: number;
  total: number;
  femaleShare: number;
  maleShare: number;
}

export interface PopulationAgeProfileRow {
  key: (typeof AGE_GROUPS)[number]["key"];
  label: string;
  coreBlackCount: number;
  inclusiveBlackCount: number;
  allPopulationCount: number;
  coreBlackShare: number;
  inclusiveBlackShare: number;
  allPopulationShare: number;
}

export interface PopulationSubgroupProfile {
  key: PopulationBreakdownKey;
  label: string;
  total: number;
  femaleShare: number;
  under25Share: number;
}

export interface PopulationPageData {
  overall: GeographyPopulationSummary;
  sexRows: PopulationSexRow[];
  ageProfileRows: PopulationAgeProfileRow[];
  subgroupProfiles: PopulationSubgroupProfile[];
  source: SourceMetadata;
}

export async function loadPopulationHomepageData(): Promise<PopulationHomepageData> {
  const [headlineStats, totalDataset, regionalDataset, localAuthorityDataset] =
    await Promise.all([
      loadHeadlineStats(),
      loadDataset(TOTAL_DATASET_PATH),
      loadDataset(REGIONAL_DATASET_PATH),
      loadDataset(LOCAL_AUTHORITY_DATASET_PATH),
    ]);

  const englandAndWales = summariseGeography(totalDataset, "K04000001");

  return {
    headlineStats,
    englandAndWales,
    nationalBreakdown: ETHNIC_BREAKDOWN.map(({ key, label }) => {
      const value = getValue(totalDataset, "K04000001", key);
      return {
        key,
        label,
        value,
        share: getPercentage(value, englandAndWales.totalPopulation),
      };
    }),
    regionalRows: summariseDataset(regionalDataset).sort(
      (left, right) => right.allBlack - left.allBlack
    ),
    topLocalAuthorities: summariseDataset(localAuthorityDataset)
      .sort((left, right) => right.allBlack - left.allBlack)
      .slice(0, 12),
    source: totalDataset.metadata,
  };
}

export async function loadPopulationPageData(): Promise<PopulationPageData> {
  const ageSexDataset = await loadDataset(AGE_SEX_DATASET_PATH);

  const geographyCode = "K04000001";
  const overall: GeographyPopulationSummary = {
    code: geographyCode,
    name: "England and Wales",
    allBlack: getAgeSexValue(ageSexDataset, geographyCode, "all_black", "all", "all"),
    allBlackIncludingMixed: getAgeSexValue(
      ageSexDataset,
      geographyCode,
      "all_black_including_mixed",
      "all",
      "all"
    ),
    totalPopulation: getAgeSexValue(
      ageSexDataset,
      geographyCode,
      "all_ethnicities",
      "all",
      "all"
    ),
    coreShare: getPercentage(
      getAgeSexValue(ageSexDataset, geographyCode, "all_black", "all", "all"),
      getAgeSexValue(ageSexDataset, geographyCode, "all_ethnicities", "all", "all")
    ),
    inclusiveShare: getPercentage(
      getAgeSexValue(
        ageSexDataset,
        geographyCode,
        "all_black_including_mixed",
        "all",
        "all"
      ),
      getAgeSexValue(ageSexDataset, geographyCode, "all_ethnicities", "all", "all")
    ),
  };

  const sexRows: PopulationSexRow[] = [
    ...ETHNIC_BREAKDOWN.map(({ key, label }) =>
      createSexRow(ageSexDataset, geographyCode, key, label)
    ),
    createSexRow(ageSexDataset, geographyCode, "all_black", "All Black"),
    createSexRow(
      ageSexDataset,
      geographyCode,
      "all_black_including_mixed",
      "All Black incl. mixed"
    ),
  ];

  const ageProfileRows: PopulationAgeProfileRow[] = AGE_GROUPS.map(
    ({ key, label }) => {
      const coreBlackCount = getAgeSexValue(
        ageSexDataset,
        geographyCode,
        "all_black",
        key,
        "all"
      );
      const inclusiveBlackCount = getAgeSexValue(
        ageSexDataset,
        geographyCode,
        "all_black_including_mixed",
        key,
        "all"
      );
      const allPopulationCount = getAgeSexValue(
        ageSexDataset,
        geographyCode,
        "all_ethnicities",
        key,
        "all"
      );

      return {
        key,
        label,
        coreBlackCount,
        inclusiveBlackCount,
        allPopulationCount,
        coreBlackShare: getPercentage(coreBlackCount, overall.allBlack),
        inclusiveBlackShare: getPercentage(
          inclusiveBlackCount,
          overall.allBlackIncludingMixed
        ),
        allPopulationShare: getPercentage(allPopulationCount, overall.totalPopulation),
      };
    }
  );

  const subgroupProfiles: PopulationSubgroupProfile[] = ETHNIC_BREAKDOWN.map(
    ({ key, label }) => {
      const total = getAgeSexValue(ageSexDataset, geographyCode, key, "all", "all");
      const female = getAgeSexValue(
        ageSexDataset,
        geographyCode,
        key,
        "all",
        "female"
      );
      const under25 = getAgeSexValue(
        ageSexDataset,
        geographyCode,
        key,
        "24-and-under",
        "all"
      );

      return {
        key,
        label,
        total,
        femaleShare: getPercentage(female, total),
        under25Share: getPercentage(under25, total),
      };
    }
  );

  return {
    overall,
    sexRows,
    ageProfileRows,
    subgroupProfiles,
    source: ageSexDataset.metadata,
  };
}

function summariseDataset(dataset: Dataset): GeographyPopulationSummary[] {
  const codes = Array.from(
    new Set(dataset.observations.map((observation) => observation.geography.code))
  );

  return codes.map((code) => summariseGeography(dataset, code));
}

function summariseGeography(
  dataset: Dataset,
  geographyCode: string
): GeographyPopulationSummary {
  const sampleObservation = dataset.observations.find(
    (observation) => observation.geography.code === geographyCode
  );

  if (!sampleObservation) {
    throw new Error(`Missing geography ${geographyCode} in dataset ${dataset.id}`);
  }

  const totalPopulation = getValue(dataset, geographyCode, "all_ethnicities");
  const allBlack = getValue(dataset, geographyCode, "all_black");
  const allBlackIncludingMixed = getValue(
    dataset,
    geographyCode,
    "all_black_including_mixed"
  );

  return {
    code: geographyCode,
    name: sampleObservation.geography.name,
    allBlack,
    allBlackIncludingMixed,
    totalPopulation,
    coreShare: getPercentage(allBlack, totalPopulation),
    inclusiveShare: getPercentage(allBlackIncludingMixed, totalPopulation),
  };
}

function getValue(
  dataset: Dataset,
  geographyCode: string,
  ethnicGroup: PopulationTrackedGroup
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

function createSexRow(
  dataset: Dataset,
  geographyCode: string,
  ethnicGroup: PopulationTrackedGroup,
  label: string
): PopulationSexRow {
  const female = getAgeSexValue(dataset, geographyCode, ethnicGroup, "all", "female");
  const male = getAgeSexValue(dataset, geographyCode, ethnicGroup, "all", "male");
  const total = getAgeSexValue(dataset, geographyCode, ethnicGroup, "all", "all");

  return {
    key: ethnicGroup,
    label,
    female,
    male,
    total,
    femaleShare: getPercentage(female, total),
    maleShare: getPercentage(male, total),
  };
}

function getAgeSexValue(
  dataset: Dataset,
  geographyCode: string,
  ethnicGroup: PopulationTrackedGroup,
  ageGroup: PopulationAgeGroup,
  sex: Sex
): number {
  const observation = dataset.observations.find(
    (candidate) =>
      candidate.geography.code === geographyCode &&
      candidate.ethnicGroup === ethnicGroup &&
      candidate.ageGroup === ageGroup &&
      candidate.sex === sex
  );

  if (!observation) {
    throw new Error(
      `Missing age/sex observation for ${geographyCode} / ${ethnicGroup} / ${ageGroup} / ${sex} in ${dataset.id}`
    );
  }

  return observation.value.value;
}

function getPercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return (value / total) * 100;
}
