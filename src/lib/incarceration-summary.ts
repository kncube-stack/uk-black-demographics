import { loadDataset } from "./data-loader";
import type { SourceMetadata } from "./types";

const PRISON_PATH =
  "manual/hmpps/culture-geography/prison-population-national.json";

export interface IncarcerationData {
  blackRemandShare: number;
  blackSentencedShare: number;
  latestLabel: string;
  source: SourceMetadata;
}

export async function loadIncarcerationData(): Promise<IncarcerationData> {
  const dataset = await loadDataset(PRISON_PATH);

  function getValue(measure: string): number {
    const obs = dataset.observations.find(
      (o) =>
        o.ethnicGroup === "all_black" && o.attributes?.measure === measure
    );
    return obs?.value.value ?? 0;
  }

  return {
    blackRemandShare: getValue("remand_share"),
    blackSentencedShare: getValue("sentenced_share"),
    latestLabel: dataset.metadata.referencePeriod ?? "",
    source: dataset.metadata,
  };
}
