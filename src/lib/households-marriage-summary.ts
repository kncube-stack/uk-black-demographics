import { loadDataset } from "./data-loader";
import type { SourceMetadata } from "./types";

const MARRIAGE_PATH = "manual/ons/households/census-2021-marital-status-national.json";

export interface MarriageRow {
  category: string;
  label: string;
  blackShare: number;
  allShare: number;
}

export interface MarriagePageData {
  rows: MarriageRow[];
  latestLabel: string;
  source: SourceMetadata;
}

export async function loadMarriagePageData(): Promise<MarriagePageData> {
  const dataset = await loadDataset(MARRIAGE_PATH);

  const categories = Array.from(
    new Set(
      dataset.observations
        .filter((o) => o.ethnicGroup === "all_black" && o.attributes?.measure === "share")
        .map((o) => o.category ?? "")
    )
  );

  const rows: MarriageRow[] = categories.map((cat) => {
    const blackObs = dataset.observations.find(
      (o) =>
        o.ethnicGroup === "all_black" &&
        o.category === cat &&
        o.attributes?.measure === "share"
    );
    const allObs = dataset.observations.find(
      (o) =>
        o.ethnicGroup === "all_ethnicities" &&
        o.category === cat &&
        o.attributes?.measure === "share"
    );
    return {
      category: cat,
      label: blackObs?.attributes?.label ?? cat,
      blackShare: blackObs?.value.value ?? 0,
      allShare: allObs?.value.value ?? 0,
    };
  });

  return {
    rows: rows.sort((a, b) => b.blackShare - a.blackShare),
    latestLabel: dataset.metadata.referenceDate,
    source: dataset.metadata,
  };
}
