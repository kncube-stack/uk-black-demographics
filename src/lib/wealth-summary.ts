import { loadDataset } from "./data-loader";
import { getEthnicityLabel, getEthnicityShortLabel } from "./ethnicity";
import type { EthnicGroup, SourceMetadata } from "./types";

const WEALTH_PATH =
  "manual/ons/households/wealth-by-ethnicity-national.json";

export interface WealthRow {
  key: EthnicGroup;
  label: string;
  shortLabel: string;
  medianWealth: number;
}

export interface WealthPageData {
  rows: WealthRow[];
  latestLabel: string;
  source: SourceMetadata;
}

export async function loadWealthPageData(): Promise<WealthPageData> {
  const dataset = await loadDataset(WEALTH_PATH);

  const groups: EthnicGroup[] = Array.from(
    new Set(
      dataset.observations
        .filter((o) => o.attributes?.measure === "median_total_wealth")
        .map((o) => o.ethnicGroup)
    )
  );

  const rows: WealthRow[] = groups.map((group) => {
    const obs = dataset.observations.find(
      (o) =>
        o.ethnicGroup === group &&
        o.attributes?.measure === "median_total_wealth"
    );
    return {
      key: group,
      label: getEthnicityLabel(group),
      shortLabel: getEthnicityShortLabel(group),
      medianWealth: obs?.value.value ?? 0,
    };
  });

  rows.sort((a, b) => b.medianWealth - a.medianWealth);

  return {
    rows,
    latestLabel: dataset.metadata.referencePeriod,
    source: dataset.metadata,
  };
}
