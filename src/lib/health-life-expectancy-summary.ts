import { loadDataset } from "./data-loader";
import type { SourceMetadata } from "./types";

const LE_PATH = "manual/ons/health/life-expectancy-national.json";

export interface LifeExpectancyRow {
  sex: string;
  blackLE: number;
  allLE: number;
  gap: number;
}

export interface LifeExpectancyData {
  rows: LifeExpectancyRow[];
  latestLabel: string;
  source: SourceMetadata;
}

export async function loadLifeExpectancyData(): Promise<LifeExpectancyData> {
  const dataset = await loadDataset(LE_PATH);

  function getLE(group: string, sex: string): number {
    const obs = dataset.observations.find(
      (o) =>
        o.ethnicGroup === group &&
        o.sex === sex &&
        o.attributes?.measure === "life_expectancy_at_birth"
    );
    return obs?.value.value ?? 0;
  }

  const maleBlack = getLE("all_black", "male");
  const maleAll = getLE("all_ethnicities", "male");
  const femaleBlack = getLE("all_black", "female");
  const femaleAll = getLE("all_ethnicities", "female");

  return {
    rows: [
      { sex: "Male", blackLE: maleBlack, allLE: maleAll, gap: maleBlack - maleAll },
      { sex: "Female", blackLE: femaleBlack, allLE: femaleAll, gap: femaleBlack - femaleAll },
    ],
    latestLabel: dataset.metadata.referenceDate,
    source: dataset.metadata,
  };
}
