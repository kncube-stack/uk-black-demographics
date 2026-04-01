import { loadDataset } from "./data-loader";
import type { SourceMetadata } from "./types";

const COVID_PATH = "manual/ons/health/covid-19-mortality-national.json";

export interface CovidMortalityRow {
  sex: string;
  blackRate: number;
  allRate: number;
  relativeRisk: number;
}

export interface CovidPageData {
  rows: CovidMortalityRow[];
  latestLabel: string;
  source: SourceMetadata;
}

export async function loadCovidPageData(): Promise<CovidPageData> {
  const dataset = await loadDataset(COVID_PATH);

  function getRate(group: string, sex: string): number {
    const obs = dataset.observations.find(
      (o) =>
        o.ethnicGroup === group &&
        o.sex === sex &&
        o.attributes?.measure === "age_standardised_mortality_rate"
    );
    return obs?.value.value ?? 0;
  }

  function getRisk(sex: string): number {
    const obs = dataset.observations.find(
      (o) =>
        o.ethnicGroup === "all_black" &&
        o.sex === sex &&
        o.attributes?.measure === "relative_risk"
    );
    return obs?.value.value ?? 0;
  }

  return {
    rows: [
      {
        sex: "Male",
        blackRate: getRate("all_black", "male"),
        allRate: getRate("all_ethnicities", "male"),
        relativeRisk: getRisk("male"),
      },
      {
        sex: "Female",
        blackRate: getRate("all_black", "female"),
        allRate: getRate("all_ethnicities", "female"),
        relativeRisk: getRisk("female"),
      },
    ],
    latestLabel: dataset.metadata.referenceDate,
    source: dataset.metadata,
  };
}
