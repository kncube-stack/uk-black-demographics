import { loadDataset } from "./data-loader";
import type { Dataset, EthnicGroup, Sex, SourceMetadata } from "./types";

const NATIONAL_DATASET_PATH =
  "fetched/nomis/economics/aps-labour-market-rates-national.json";
const REGIONAL_DATASET_PATH =
  "fetched/nomis/economics/aps-labour-market-rates-by-region.json";
const OCCUPATION_DATASET_PATH =
  "fetched/nomis/economics/aps-occupation-profile-national.json";

const OCCUPATION_LABELS = {
  managers: "Managers",
  professional: "Professional",
  associate_professional: "Associate professional",
  administrative: "Administrative",
  skilled_trades: "Skilled trades",
  caring_leisure_service: "Caring and leisure",
  sales_customer_service: "Sales and service",
  process_plant_machine: "Process and machine",
  elementary: "Elementary",
} as const;

type EconomicsMetric = "employment_rate" | "unemployment_rate" | "inactivity_rate";
type TimeSlice = {
  code: string;
  label: string;
};

export interface EconomicsHeadline {
  blackEmploymentRate: number;
  blackUnemploymentRate: number;
  blackInactivityRate: number;
  allEmploymentRate: number;
  employmentGap: number;
}

export interface EconomicsComparisonRow {
  key: EconomicsMetric;
  label: string;
  blackRate: number;
  overallRate: number;
  gap: number;
}

export interface EconomicsSexRow {
  key: Sex;
  label: string;
  employmentRate: number;
  unemploymentRate: number;
  inactivityRate: number;
}

export interface EconomicsRegionRow {
  code: string;
  name: string;
  blackEmploymentRate: number;
  overallEmploymentRate: number;
  employmentGap: number;
  blackUnemploymentRate: number;
  overallUnemploymentRate: number;
  blackInactivityRate: number;
  overallInactivityRate: number;
  blackEmploymentConfidenceMargin: number;
}

export interface EconomicsOccupationRow {
  key: string;
  label: string;
  blackShare: number;
  overallShare: number;
}

export interface EconomicsPageData {
  latestLabel: string;
  previousLabel: string;
  headline: EconomicsHeadline;
  comparisonRows: EconomicsComparisonRow[];
  sexRows: EconomicsSexRow[];
  regionRows: EconomicsRegionRow[];
  occupationRows: EconomicsOccupationRow[];
  source: SourceMetadata;
}

export async function loadEconomicsPageData(): Promise<EconomicsPageData> {
  const [nationalDataset, regionalDataset, occupationDataset] = await Promise.all([
    loadDataset(NATIONAL_DATASET_PATH),
    loadDataset(REGIONAL_DATASET_PATH),
    loadDataset(OCCUPATION_DATASET_PATH),
  ]);
  const [latestSlice, previousSlice] = getNationalTimeSlices(nationalDataset);

  if (!latestSlice || !previousSlice) {
    throw new Error("Economics national dataset is missing a latest or previous time slice.");
  }

  const headline: EconomicsHeadline = {
    blackEmploymentRate: getNationalMetric(
      nationalDataset,
      latestSlice,
      "all_black",
      "employment_rate",
      "all"
    ),
    blackUnemploymentRate: getNationalMetric(
      nationalDataset,
      latestSlice,
      "all_black",
      "unemployment_rate",
      "all"
    ),
    blackInactivityRate: getNationalMetric(
      nationalDataset,
      latestSlice,
      "all_black",
      "inactivity_rate",
      "all"
    ),
    allEmploymentRate: getNationalMetric(
      nationalDataset,
      latestSlice,
      "all_ethnicities",
      "employment_rate",
      "all"
    ),
    employmentGap:
      getNationalMetric(nationalDataset, latestSlice, "all_black", "employment_rate", "all") -
      getNationalMetric(
        nationalDataset,
        latestSlice,
        "all_ethnicities",
        "employment_rate",
        "all"
      ),
  };

  const comparisonRows: EconomicsComparisonRow[] = [
    {
      key: "employment_rate",
      label: "Employment",
      blackRate: headline.blackEmploymentRate,
      overallRate: headline.allEmploymentRate,
      gap: headline.employmentGap,
    },
    {
      key: "unemployment_rate",
      label: "Unemployment",
      blackRate: headline.blackUnemploymentRate,
      overallRate: getNationalMetric(
        nationalDataset,
        latestSlice,
        "all_ethnicities",
        "unemployment_rate",
        "all"
      ),
      gap:
        headline.blackUnemploymentRate -
        getNationalMetric(
          nationalDataset,
          latestSlice,
          "all_ethnicities",
          "unemployment_rate",
          "all"
        ),
    },
    {
      key: "inactivity_rate",
      label: "Inactivity",
      blackRate: headline.blackInactivityRate,
      overallRate: getNationalMetric(
        nationalDataset,
        latestSlice,
        "all_ethnicities",
        "inactivity_rate",
        "all"
      ),
      gap:
        headline.blackInactivityRate -
        getNationalMetric(
          nationalDataset,
          latestSlice,
          "all_ethnicities",
          "inactivity_rate",
          "all"
        ),
    },
  ];

  const sexRows: EconomicsSexRow[] = [
    {
      key: "female",
      label: "Black women",
      employmentRate: getNationalMetric(
        nationalDataset,
        latestSlice,
        "all_black",
        "employment_rate",
        "female"
      ),
      unemploymentRate: getNationalMetric(
        nationalDataset,
        latestSlice,
        "all_black",
        "unemployment_rate",
        "female"
      ),
      inactivityRate: getNationalMetric(
        nationalDataset,
        latestSlice,
        "all_black",
        "inactivity_rate",
        "female"
      ),
    },
    {
      key: "male",
      label: "Black men",
      employmentRate: getNationalMetric(
        nationalDataset,
        latestSlice,
        "all_black",
        "employment_rate",
        "male"
      ),
      unemploymentRate: getNationalMetric(
        nationalDataset,
        latestSlice,
        "all_black",
        "unemployment_rate",
        "male"
      ),
      inactivityRate: getNationalMetric(
        nationalDataset,
        latestSlice,
        "all_black",
        "inactivity_rate",
        "male"
      ),
    },
  ];

  const regionRows = getRegionalCodes(regionalDataset).map((code) => ({
    code,
    name: getGeographyName(regionalDataset, code),
    blackEmploymentRate: getRegionalMetric(
      regionalDataset,
      code,
      "all_black",
      "employment_rate"
    ),
    overallEmploymentRate: getRegionalMetric(
      regionalDataset,
      code,
      "all_ethnicities",
      "employment_rate"
    ),
    employmentGap:
      getRegionalMetric(regionalDataset, code, "all_black", "employment_rate") -
      getRegionalMetric(regionalDataset, code, "all_ethnicities", "employment_rate"),
    blackUnemploymentRate: getRegionalMetric(
      regionalDataset,
      code,
      "all_black",
      "unemployment_rate"
    ),
    overallUnemploymentRate: getRegionalMetric(
      regionalDataset,
      code,
      "all_ethnicities",
      "unemployment_rate"
    ),
    blackInactivityRate: getRegionalMetric(
      regionalDataset,
      code,
      "all_black",
      "inactivity_rate"
    ),
    overallInactivityRate: getRegionalMetric(
      regionalDataset,
      code,
      "all_ethnicities",
      "inactivity_rate"
    ),
    blackEmploymentConfidenceMargin: getRegionalMeasure(
      regionalDataset,
      code,
      "all_black",
      "employment_rate",
      "confidence_margin"
    ),
  }));

  const occupationRows = Object.entries(OCCUPATION_LABELS).map(([key, label]) => ({
    key,
    label,
    blackShare: getOccupationValue(occupationDataset, "all_black", key),
    overallShare: getOccupationValue(occupationDataset, "all_ethnicities", key),
  }));

  return {
    latestLabel: latestSlice.label,
    previousLabel: previousSlice.label,
    headline,
    comparisonRows,
    sexRows,
    regionRows: regionRows.sort(
      (left, right) => right.blackEmploymentRate - left.blackEmploymentRate
    ),
    occupationRows,
    source: nationalDataset.metadata,
  };
}

function getNationalTimeSlices(dataset: Dataset): TimeSlice[] {
  return Array.from(
    new Map(
      dataset.observations.map((observation) => [
        observation.timePeriod,
        {
          code: observation.timePeriod,
          label:
            observation.attributes?.time_label ??
            observation.timePeriod,
        },
      ])
    ).values()
  ).sort((left, right) => left.code.localeCompare(right.code)).reverse();
}

function getNationalMetric(
  dataset: Dataset,
  slice: TimeSlice,
  ethnicGroup: EthnicGroup,
  metric: EconomicsMetric,
  sex: Sex
) {
  return getNationalMeasure(dataset, slice, ethnicGroup, metric, sex, "value");
}

function getNationalMeasure(
  dataset: Dataset,
  slice: TimeSlice,
  ethnicGroup: EthnicGroup,
  metric: EconomicsMetric,
  sex: Sex,
  measure: string
) {
  const observation = dataset.observations.find(
    (candidate) =>
      candidate.timePeriod === slice.code &&
      candidate.ethnicGroup === ethnicGroup &&
      candidate.sex === sex &&
      candidate.attributes?.metric === metric &&
      candidate.attributes?.measure === measure
  );

  if (!observation) {
    throw new Error(
      `Missing economics national observation for ${slice.code} / ${ethnicGroup} / ${metric} / ${sex} / ${measure}`
    );
  }

  return observation.value.value;
}

function getRegionalCodes(dataset: Dataset): string[] {
  return Array.from(
    new Set(dataset.observations.map((observation) => observation.geography.code))
  );
}

function getGeographyName(dataset: Dataset, geographyCode: string): string {
  const observation = dataset.observations.find(
    (candidate) => candidate.geography.code === geographyCode
  );

  if (!observation) {
    throw new Error(`Missing geography ${geographyCode} in regional economics dataset`);
  }

  return observation.geography.name;
}

function getRegionalMetric(
  dataset: Dataset,
  geographyCode: string,
  ethnicGroup: EthnicGroup,
  metric: EconomicsMetric
) {
  return getRegionalMeasure(dataset, geographyCode, ethnicGroup, metric, "value");
}

function getRegionalMeasure(
  dataset: Dataset,
  geographyCode: string,
  ethnicGroup: EthnicGroup,
  metric: EconomicsMetric,
  measure: string
) {
  const observation = dataset.observations.find(
    (candidate) =>
      candidate.geography.code === geographyCode &&
      candidate.ethnicGroup === ethnicGroup &&
      candidate.attributes?.metric === metric &&
      candidate.attributes?.measure === measure
  );

  if (!observation) {
    throw new Error(
      `Missing economics regional observation for ${geographyCode} / ${ethnicGroup} / ${metric} / ${measure}`
    );
  }

  return observation.value.value;
}

function getOccupationValue(
  dataset: Dataset,
  ethnicGroup: EthnicGroup,
  occupation: string
) {
  const observation = dataset.observations.find(
    (candidate) =>
      candidate.ethnicGroup === ethnicGroup &&
      candidate.attributes?.occupation === occupation
  );

  if (!observation) {
    throw new Error(
      `Missing economics occupation observation for ${ethnicGroup} / ${occupation}`
    );
  }

  return observation.value.value;
}
