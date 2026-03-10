import { loadDataset } from "./data-loader";
import { getEthnicityLabel, getEthnicityShortLabel } from "./ethnicity";
import type { Dataset, EthnicGroup, SourceMetadata } from "./types";

const EDUCATION_DATASET_PATH = "fetched/dfe/education/suspensions-national.json";

export const EDUCATION_OVERVIEW_GROUPS = [
  "all_ethnicities",
  "all_black",
  "all_black_including_mixed",
  "mixed_white_black_caribbean",
  "black_caribbean",
  "mixed_white_black_african",
  "black_african",
  "other_black",
] as const satisfies readonly EthnicGroup[];

const PHASE_ORDER = [
  "Total",
  "State-funded primary",
  "State-funded secondary",
  "Special",
] as const;

const FSM_ORDER = ["Total", "FSM Eligible", "FSM Not eligible"] as const;
const TERM_ORDER: Record<string, number> = {
  "Autumn term": 1,
  "Spring term": 2,
  "Summer term": 3,
};

type EducationMeasure =
  | "headcount"
  | "suspension"
  | "susp_rate"
  | "perm_excl"
  | "perm_excl_rate"
  | "one_plus"
  | "one_plus_rate";

export interface EducationMetricRow {
  key: EthnicGroup;
  label: string;
  shortLabel: string;
  headcount: number;
  suspensionCount: number;
  suspensionRate: number;
  permanentExclusionCount: number;
  permanentExclusionRate: number;
  onePlusCount: number;
  onePlusRate: number;
  suspensionRateChange: number | null;
}

export interface EducationPhaseRow {
  key: string;
  label: string;
  allPupils: number;
  allBlackIncludingMixed: number;
  mixedWhiteBlackCaribbean: number;
  blackCaribbean: number;
}

export interface EducationFsmRow {
  key: string;
  label: string;
  allPupils: number;
  allBlackIncludingMixed: number;
  mixedWhiteBlackCaribbean: number;
  blackCaribbean: number;
}

export interface EducationPageData {
  latestLabel: string;
  previousLabel: string | null;
  metricRows: EducationMetricRow[];
  phaseRows: EducationPhaseRow[];
  fsmRows: EducationFsmRow[];
  source: SourceMetadata;
}

type TimeSlice = {
  label: string;
  sortKey: number;
  timeIdentifier: string;
  timePeriod: string;
};

export async function loadEducationPageData(): Promise<EducationPageData> {
  const dataset = await loadDataset(EDUCATION_DATASET_PATH);
  const [latestSlice] = getSortedTimeSlices(dataset);

  if (!latestSlice) {
    throw new Error("Education exclusions dataset does not contain any time slices.");
  }

  const previousSlice = getComparableTimeSlice(dataset, latestSlice);

  const metricRows = EDUCATION_OVERVIEW_GROUPS.map((group) =>
    createMetricRow(dataset, group, latestSlice, previousSlice ?? null)
  );

  const phaseRows = PHASE_ORDER.map((phase) => ({
    key: phase.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-"),
    label: phase === "Total" ? "All state-funded schools" : phase.replace("State-funded ", ""),
    allPupils: getMetric(dataset, "all_ethnicities", latestSlice, phase, "Total", "susp_rate"),
    allBlackIncludingMixed: getMetric(
      dataset,
      "all_black_including_mixed",
      latestSlice,
      phase,
      "Total",
      "susp_rate"
    ),
    mixedWhiteBlackCaribbean: getMetric(
      dataset,
      "mixed_white_black_caribbean",
      latestSlice,
      phase,
      "Total",
      "susp_rate"
    ),
    blackCaribbean: getMetric(
      dataset,
      "black_caribbean",
      latestSlice,
      phase,
      "Total",
      "susp_rate"
    ),
  }));

  const fsmRows = FSM_ORDER.map((fsm) => ({
    key: fsm.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-"),
    label: fsm === "Total" ? "All pupils" : fsm.replace("FSM ", ""),
    allPupils: getMetric(
      dataset,
      "all_ethnicities",
      latestSlice,
      "Total",
      fsm,
      "susp_rate"
    ),
    allBlackIncludingMixed: getMetric(
      dataset,
      "all_black_including_mixed",
      latestSlice,
      "Total",
      fsm,
      "susp_rate"
    ),
    mixedWhiteBlackCaribbean: getMetric(
      dataset,
      "mixed_white_black_caribbean",
      latestSlice,
      "Total",
      fsm,
      "susp_rate"
    ),
    blackCaribbean: getMetric(
      dataset,
      "black_caribbean",
      latestSlice,
      "Total",
      fsm,
      "susp_rate"
    ),
  }));

  return {
    latestLabel: latestSlice.label,
    previousLabel: previousSlice?.label ?? null,
    metricRows,
    phaseRows,
    fsmRows,
    source: dataset.metadata,
  };
}

function createMetricRow(
  dataset: Dataset,
  group: EthnicGroup,
  latestSlice: TimeSlice,
  previousSlice: TimeSlice | null
): EducationMetricRow {
  const suspensionRate = getMetric(
    dataset,
    group,
    latestSlice,
    "Total",
    "Total",
    "susp_rate"
  );
  const previousSuspensionRate = previousSlice
    ? getMetric(dataset, group, previousSlice, "Total", "Total", "susp_rate")
    : null;

  return {
    key: group,
    label: getEthnicityLabel(group),
    shortLabel: getEthnicityShortLabel(group),
    headcount: getMetric(dataset, group, latestSlice, "Total", "Total", "headcount"),
    suspensionCount: getMetric(
      dataset,
      group,
      latestSlice,
      "Total",
      "Total",
      "suspension"
    ),
    suspensionRate,
    permanentExclusionCount: getMetric(
      dataset,
      group,
      latestSlice,
      "Total",
      "Total",
      "perm_excl"
    ),
    permanentExclusionRate: getMetric(
      dataset,
      group,
      latestSlice,
      "Total",
      "Total",
      "perm_excl_rate"
    ),
    onePlusCount: getMetric(dataset, group, latestSlice, "Total", "Total", "one_plus"),
    onePlusRate: getMetric(
      dataset,
      group,
      latestSlice,
      "Total",
      "Total",
      "one_plus_rate"
    ),
    suspensionRateChange:
      previousSuspensionRate === null
        ? null
        : suspensionRate - previousSuspensionRate,
  };
}

function getSortedTimeSlices(dataset: Dataset): TimeSlice[] {
  return Array.from(
    new Map(
      dataset.observations.map((observation) => {
        const timeIdentifier = observation.attributes?.time_identifier ?? "";
        const slice: TimeSlice = {
          label: `${timeIdentifier} ${observation.timePeriod}`.trim(),
          sortKey: toAcademicYearSortKey(observation.timePeriod, timeIdentifier),
          timeIdentifier,
          timePeriod: observation.timePeriod,
        };

        return [slice.label, slice];
      })
    ).values()
  ).sort((left, right) => right.sortKey - left.sortKey);
}

function getComparableTimeSlice(
  dataset: Dataset,
  latestSlice: TimeSlice
): TimeSlice | null {
  return (
    getSortedTimeSlices(dataset).find(
      (slice) =>
        slice.timeIdentifier === latestSlice.timeIdentifier &&
        slice.timePeriod !== latestSlice.timePeriod
    ) ?? null
  );
}

function toAcademicYearSortKey(timePeriod: string, timeIdentifier: string): number {
  const [startYear] = timePeriod.split("/");
  const year = Number.parseInt(startYear, 10);
  const termOrder = TERM_ORDER[timeIdentifier] ?? 0;
  return year * 10 + termOrder;
}

function getMetric(
  dataset: Dataset,
  group: EthnicGroup,
  slice: TimeSlice,
  educationPhase: string,
  fsm: string,
  measure: EducationMeasure
): number {
  const observation = dataset.observations.find(
    (candidate) =>
      candidate.ethnicGroup === group &&
      candidate.timePeriod === slice.timePeriod &&
      candidate.attributes?.time_identifier === slice.timeIdentifier &&
      candidate.attributes?.education_phase === educationPhase &&
      candidate.attributes?.fsm === fsm &&
      candidate.attributes?.measure === measure
  );

  if (!observation) {
    throw new Error(
      `Missing education observation for ${group} / ${slice.label} / ${educationPhase} / ${fsm} / ${measure}`
    );
  }

  return observation.value.value;
}
