import { loadDataset } from "./data-loader";
import type { SourceMetadata } from "./types";

const HIV_PATH = "manual/ukhsa/health/hiv-diagnoses-national.json";

export interface HivData {
  blackNewDiagnoses: number;
  allNewDiagnoses: number;
  blackDiagnosesShare: number;
  blackCareShare: number;
  latestLabel: string;
  source: SourceMetadata;
}

export async function loadHivData(): Promise<HivData> {
  const dataset = await loadDataset(HIV_PATH);

  function getValue(group: string, measure: string): number {
    const obs = dataset.observations.find(
      (o) =>
        o.ethnicGroup === group && o.attributes?.measure === measure
    );
    return obs?.value.value ?? 0;
  }

  return {
    blackNewDiagnoses: getValue("all_black", "new_diagnoses_count"),
    allNewDiagnoses: getValue("all_ethnicities", "new_diagnoses_count"),
    blackDiagnosesShare: getValue("all_black", "new_diagnoses_share"),
    blackCareShare: getValue("all_black", "people_accessing_care_share"),
    latestLabel: dataset.metadata.referenceDate,
    source: dataset.metadata,
  };
}
