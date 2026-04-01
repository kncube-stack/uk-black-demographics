import { loadDataset } from "./data-loader";
import type { SourceMetadata } from "./types";

const LOW_INCOME_PATH =
  "fetched/eff/households/low-income-households-national.json";

export interface LowIncomeData {
  blackRate: number;
  allRate: number;
  gap: number;
  latestLabel: string;
  source: SourceMetadata;
}

export async function loadLowIncomeData(): Promise<LowIncomeData> {
  const dataset = await loadDataset(LOW_INCOME_PATH);
  const latestLabel = dataset.metadata.referenceDate;

  const blackObs = dataset.observations.find(
    (o) =>
      o.ethnicGroup === "all_black" && o.attributes?.measure === "rate"
  );
  const allObs = dataset.observations.find(
    (o) =>
      o.ethnicGroup === "all_ethnicities" && o.attributes?.measure === "rate"
  );

  const blackRate = blackObs?.value.value ?? 0;
  const allRate = allObs?.value.value ?? 0;

  return {
    blackRate,
    allRate,
    gap: blackRate - allRate,
    latestLabel,
    source: dataset.metadata,
  };
}
