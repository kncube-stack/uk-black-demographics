import { loadDataset } from "./data-loader";
import { getEthnicityLabel, getEthnicityShortLabel } from "./ethnicity";
import type { EthnicGroup, SourceMetadata } from "./types";

const ENTRY_PATH = "fetched/eff/education/university-entry-national.json";
const DEGREE_PATH =
  "fetched/eff/education/undergraduate-degree-results-national.json";

export interface UniversityEntryRow {
  timePeriod: string;
  blackEntryRate: number;
  allEntryRate: number;
}

export interface DegreeResultRow {
  classification: string;
  blackShare: number;
  allShare: number;
}

export interface UniversityPageData {
  entryRows: UniversityEntryRow[];
  degreeRows: DegreeResultRow[];
  latestEntryLabel: string;
  latestDegreeLabel: string;
  entrySource: SourceMetadata;
  degreeSource: SourceMetadata;
}

export async function loadUniversityPageData(): Promise<UniversityPageData> {
  const [entryDataset, degreeDataset] = await Promise.all([
    loadDataset(ENTRY_PATH),
    loadDataset(DEGREE_PATH),
  ]);

  // Entry rates: build time series for all_black and all_ethnicities
  const entryTimes = Array.from(
    new Set(
      entryDataset.observations
        .filter((o) => o.attributes?.measure === "entry_rate")
        .map((o) => o.timePeriod)
    )
  ).sort();

  const entryRows: UniversityEntryRow[] = entryTimes.map((time) => {
    const blackObs = entryDataset.observations.find(
      (o) =>
        o.ethnicGroup === "all_black" &&
        o.timePeriod === time &&
        o.attributes?.measure === "entry_rate"
    );
    const allObs = entryDataset.observations.find(
      (o) =>
        o.ethnicGroup === "all_ethnicities" &&
        o.timePeriod === time &&
        o.attributes?.measure === "entry_rate"
    );
    return {
      timePeriod: time,
      blackEntryRate: blackObs?.value.value ?? 0,
      allEntryRate: allObs?.value.value ?? 0,
    };
  });

  // Degree results: latest time, build by classification
  const degreeTimes = Array.from(
    new Set(degreeDataset.observations.map((o) => o.timePeriod))
  ).sort();
  const latestDegreeTime = degreeTimes[degreeTimes.length - 1];
  const classifications = [
    "first class honours",
    "upper second class honours",
    "lower second class honours",
    "third class honours",
    "other",
  ];

  const degreeRows: DegreeResultRow[] = classifications.map((cls) => {
    const blackObs = degreeDataset.observations.find(
      (o) =>
        o.ethnicGroup === "all_black" &&
        o.timePeriod === latestDegreeTime &&
        o.attributes?.measure === "share" &&
        o.attributes?.classification === cls
    );
    const allObs = degreeDataset.observations.find(
      (o) =>
        o.ethnicGroup === "all_ethnicities" &&
        o.timePeriod === latestDegreeTime &&
        o.attributes?.measure === "share" &&
        o.attributes?.classification === cls
    );
    return {
      classification: cls.replace(" honours", "").replace("class ", ""),
      blackShare: blackObs?.value.value ?? 0,
      allShare: allObs?.value.value ?? 0,
    };
  });

  return {
    entryRows,
    degreeRows,
    latestEntryLabel: entryDataset.metadata.referenceDate,
    latestDegreeLabel: degreeDataset.metadata.referenceDate,
    entrySource: entryDataset.metadata,
    degreeSource: degreeDataset.metadata,
  };
}
