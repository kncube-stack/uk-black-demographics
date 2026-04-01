import { loadDataset } from "./data-loader";
import type { SourceMetadata } from "./types";

const OBESITY_PATH = "manual/nhs/health/obesity-national.json";

export interface ObesityData {
  blackObesityRate: number;
  allObesityRate: number;
  blackOverweightRate: number;
  allOverweightRate: number;
  latestLabel: string;
  source: SourceMetadata;
}

export async function loadObesityData(): Promise<ObesityData> {
  const dataset = await loadDataset(OBESITY_PATH);

  function getRate(group: string, measure: string): number {
    const obs = dataset.observations.find(
      (o) =>
        o.ethnicGroup === group && o.attributes?.measure === measure
    );
    return obs?.value.value ?? 0;
  }

  return {
    blackObesityRate: getRate("all_black", "adult_obesity_rate"),
    allObesityRate: getRate("all_ethnicities", "adult_obesity_rate"),
    blackOverweightRate: getRate("all_black", "adult_overweight_or_obese_rate"),
    allOverweightRate: getRate("all_ethnicities", "adult_overweight_or_obese_rate"),
    latestLabel: dataset.metadata.referenceDate,
    source: dataset.metadata,
  };
}
