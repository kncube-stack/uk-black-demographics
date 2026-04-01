import { loadDataset } from "./data-loader";
import { getEthnicityLabel, getEthnicityShortLabel } from "./ethnicity";
import type { EthnicGroup, SourceMetadata } from "./types";

const CRIME_PATH = "fetched/eff/culture-geography/crime-victims-national.json";

export interface CrimeRow {
  key: EthnicGroup;
  label: string;
  shortLabel: string;
  victimisationRate: number;
  sampleSize: number;
  confidenceLower: number | null;
  confidenceUpper: number | null;
}

export interface CrimePageData {
  rows: CrimeRow[];
  latestLabel: string;
  source: SourceMetadata;
}

export async function loadCrimePageData(): Promise<CrimePageData> {
  const dataset = await loadDataset(CRIME_PATH);

  const groups: EthnicGroup[] = Array.from(
    new Set(
      dataset.observations
        .filter((o) => o.attributes?.measure === "victimisation_rate")
        .map((o) => o.ethnicGroup)
    )
  );

  const rows: CrimeRow[] = groups.map((group) => {
    const rateObs = dataset.observations.find(
      (o) =>
        o.ethnicGroup === group &&
        o.attributes?.measure === "victimisation_rate"
    );
    const sampleObs = dataset.observations.find(
      (o) =>
        o.ethnicGroup === group && o.attributes?.measure === "sample_size"
    );
    return {
      key: group,
      label: getEthnicityLabel(group),
      shortLabel: getEthnicityShortLabel(group),
      victimisationRate: rateObs?.value.value ?? 0,
      sampleSize: sampleObs?.value.value ?? 0,
      confidenceLower: rateObs?.value.confidence?.lower ?? null,
      confidenceUpper: rateObs?.value.confidence?.upper ?? null,
    };
  });

  rows.sort((a, b) => b.victimisationRate - a.victimisationRate);

  return {
    rows,
    latestLabel: dataset.metadata.referencePeriod ?? "",
    source: dataset.metadata,
  };
}
