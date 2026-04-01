import { loadDataset } from "./data-loader";
import { getEthnicityLabel, getEthnicityShortLabel } from "./ethnicity";
import type { EthnicGroup, SourceMetadata } from "./types";

const GCSE_PATH = "fetched/eff/education/gcse-attainment-national.json";
const A_LEVEL_PATH = "fetched/eff/education/a-level-achievement-national.json";
const QUALIFICATIONS_PATH =
  "fetched/ons/education/census-2021-qualifications-national.json";

export interface GcseRow {
  key: EthnicGroup;
  label: string;
  shortLabel: string;
  attainment8Score: number;
  pupils: number;
}

export interface ALevelRow {
  key: EthnicGroup;
  label: string;
  shortLabel: string;
  timePeriod: string;
  threeARate: number;
  students: number;
}

export interface QualificationRow {
  key: EthnicGroup;
  label: string;
  shortLabel: string;
  category: string;
  categoryLabel: string;
  share: number;
  count: number;
}

export interface AttainmentPageData {
  gcseRows: GcseRow[];
  gcseSource: SourceMetadata;
  aLevelRows: ALevelRow[];
  aLevelSource: SourceMetadata;
  qualificationRows: QualificationRow[];
  qualificationsSource: SourceMetadata;
}

export async function loadAttainmentPageData(): Promise<AttainmentPageData> {
  const [gcseDataset, aLevelDataset, qualDataset] = await Promise.all([
    loadDataset(GCSE_PATH),
    loadDataset(A_LEVEL_PATH),
    loadDataset(QUALIFICATIONS_PATH),
  ]);

  // ---------------------------------------------------------------------------
  // GCSE: latest time period, attainment_8_score per group
  // ---------------------------------------------------------------------------
  const gcseGroups: EthnicGroup[] = Array.from(
    new Set(
      gcseDataset.observations
        .filter((o) => o.attributes?.measure === "attainment_8_score")
        .map((o) => o.ethnicGroup),
    ),
  );

  const gcseRows: GcseRow[] = gcseGroups.map((group) => {
    const scoreObs = gcseDataset.observations.find(
      (o) =>
        o.ethnicGroup === group &&
        o.attributes?.measure === "attainment_8_score",
    );
    const pupilObs = gcseDataset.observations.find(
      (o) =>
        o.ethnicGroup === group && o.attributes?.measure === "pupils",
    );
    return {
      key: group,
      label: getEthnicityLabel(group),
      shortLabel: getEthnicityShortLabel(group),
      attainment8Score: scoreObs?.value.value ?? 0,
      pupils: pupilObs?.value.value ?? 0,
    };
  });

  // ---------------------------------------------------------------------------
  // A-level: latest time period, three_a_rate per group
  // ---------------------------------------------------------------------------
  const aLevelTimes = Array.from(
    new Set(aLevelDataset.observations.map((o) => o.timePeriod)),
  ).sort();
  const latestALevelTime = aLevelTimes[aLevelTimes.length - 1];

  const aLevelGroups: EthnicGroup[] = Array.from(
    new Set(
      aLevelDataset.observations
        .filter(
          (o) =>
            o.timePeriod === latestALevelTime &&
            o.attributes?.measure === "three_a_rate",
        )
        .map((o) => o.ethnicGroup),
    ),
  );

  const aLevelRows: ALevelRow[] = aLevelGroups.map((group) => {
    const rateObs = aLevelDataset.observations.find(
      (o) =>
        o.ethnicGroup === group &&
        o.timePeriod === latestALevelTime &&
        o.attributes?.measure === "three_a_rate",
    );
    const studentObs = aLevelDataset.observations.find(
      (o) =>
        o.ethnicGroup === group &&
        o.timePeriod === latestALevelTime &&
        o.attributes?.measure === "students",
    );
    return {
      key: group,
      label: getEthnicityLabel(group),
      shortLabel: getEthnicityShortLabel(group),
      timePeriod: latestALevelTime,
      threeARate: rateObs?.value.value ?? 0,
      students: studentObs?.value.value ?? 0,
    };
  });

  // ---------------------------------------------------------------------------
  // Qualifications: share per group per category
  // ---------------------------------------------------------------------------
  const qualificationRows: QualificationRow[] = qualDataset.observations
    .filter((o) => o.attributes?.measure === "share")
    .map((o) => ({
      key: o.ethnicGroup,
      label: getEthnicityLabel(o.ethnicGroup),
      shortLabel: getEthnicityShortLabel(o.ethnicGroup),
      category: o.category ?? "",
      categoryLabel: o.attributes?.label ?? o.category ?? "",
      share: o.value.value,
      count: 0,
    }));

  // Attach counts
  for (const row of qualificationRows) {
    const countObs = qualDataset.observations.find(
      (o) =>
        o.ethnicGroup === row.key &&
        o.category === row.category &&
        o.attributes?.measure === "count",
    );
    if (countObs) row.count = countObs.value.value;
  }

  return {
    gcseRows,
    gcseSource: gcseDataset.metadata,
    aLevelRows,
    aLevelSource: aLevelDataset.metadata,
    qualificationRows,
    qualificationsSource: qualDataset.metadata,
  };
}
