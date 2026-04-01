import { loadDataset } from "./data-loader";
import type { SourceMetadata } from "./types";

const HERITAGE_PATH =
  "fetched/ons/culture-geography/census-2021-country-of-birth-national.json";

export interface HeritageRow {
  category: string;
  label: string;
  blackShare: number;
  allShare: number;
  blackCount: number;
}

export interface HeritagePageData {
  rows: HeritageRow[];
  latestLabel: string;
  source: SourceMetadata;
}

export async function loadHeritagePageData(): Promise<HeritagePageData> {
  const dataset = await loadDataset(HERITAGE_PATH);

  const categories = Array.from(
    new Set(
      dataset.observations
        .filter(
          (o) =>
            o.ethnicGroup === "all_black" && o.attributes?.measure === "share"
        )
        .map((o) => o.category!)
    )
  );

  const rows: HeritageRow[] = categories.map((cat) => {
    const blackShareObs = dataset.observations.find(
      (o) =>
        o.ethnicGroup === "all_black" &&
        o.category === cat &&
        o.attributes?.measure === "share"
    );
    const allShareObs = dataset.observations.find(
      (o) =>
        o.ethnicGroup === "all_ethnicities" &&
        o.category === cat &&
        o.attributes?.measure === "share"
    );
    const blackCountObs = dataset.observations.find(
      (o) =>
        o.ethnicGroup === "all_black" &&
        o.category === cat &&
        o.attributes?.measure === "count"
    );
    return {
      category: cat,
      label: blackShareObs?.attributes?.label ?? cat,
      blackShare: blackShareObs?.value.value ?? 0,
      allShare: allShareObs?.value.value ?? 0,
      blackCount: blackCountObs?.value.value ?? 0,
    };
  });

  rows.sort((a, b) => b.blackShare - a.blackShare);

  return {
    rows,
    latestLabel: dataset.metadata.referencePeriod,
    source: dataset.metadata,
  };
}
