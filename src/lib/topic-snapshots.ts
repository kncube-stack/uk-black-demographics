import { loadDataset } from "./data-loader";
import { formatNumber, formatPercent, formatRate } from "./format";
import { loadCulturePageData } from "./culture-summary";
import { loadEconomicsPageData } from "./economics-summary";
import { loadEducationPageData } from "./education-summary";
import { loadHealthPageData } from "./health-summary";
import { loadHouseholdsPageData } from "./households-summary";
import {
  loadPopulationHomepageData,
  loadPopulationPageData,
} from "./population-summary";
import type { Dataset, EthnicGroup, SiteCategory, SourceMetadata } from "./types";

const CURRENT_DATE = "2026-03-10";
const LOW_INCOME_DATASET_PATH =
  "fetched/eff/households/low-income-households-national.json";
const QUALIFICATIONS_DATASET_PATH =
  "fetched/ons/education/census-2021-qualifications-national.json";
const GCSE_DATASET_PATH = "fetched/eff/education/gcse-attainment-national.json";
const A_LEVEL_DATASET_PATH =
  "fetched/eff/education/a-level-achievement-national.json";
const UNIVERSITY_ENTRY_DATASET_PATH =
  "fetched/eff/education/university-entry-national.json";
const UNIVERSITY_DEGREE_DATASET_PATH =
  "fetched/eff/education/undergraduate-degree-results-national.json";
const RELIGION_DATASET_PATH =
  "fetched/ons/culture-geography/census-2021-religion-national.json";
const HERITAGE_DATASET_PATH =
  "fetched/ons/culture-geography/census-2021-country-of-birth-national.json";
const CRIME_DATASET_PATH =
  "fetched/eff/culture-geography/crime-victims-national.json";

export interface TopicSnapshot {
  liveRoute: string;
  source: SourceMetadata;
  downloadHref?: string;
  stats: Array<{
    label: string;
    value: string;
    note: string;
  }>;
}

export async function loadTopicSnapshot(
  category: SiteCategory,
  slug: string
): Promise<TopicSnapshot | null> {
  switch (`${category}:${slug}`) {
    case "population:total": {
      const data = await loadPopulationPageData();
      return {
        liveRoute: "/population",
        source: data.source,
        stats: [
          {
            label: "Core Black population",
            value: formatNumber(data.overall.allBlack),
            note: "England and Wales",
          },
          {
            label: "Including mixed White/Black groups",
            value: formatNumber(data.overall.allBlackIncludingMixed),
            note: "England and Wales",
          },
        ],
      };
    }
    case "population:by-region": {
      const data = await loadPopulationHomepageData();
      const top = data.regionalRows[0];
      if (!top) return null;
      return {
        liveRoute: "/population",
        source: data.source,
        stats: [
          {
            label: "Largest regional population",
            value: top.name,
            note: formatNumber(top.allBlack),
          },
          {
            label: "Core Black share",
            value: formatPercent(top.coreShare, 1),
            note: "Within region population",
          },
        ],
      };
    }
    case "population:by-local-authority": {
      const data = await loadPopulationHomepageData();
      const top = data.topLocalAuthorities[0];
      if (!top) return null;
      return {
        liveRoute: "/population",
        source: data.source,
        stats: [
          {
            label: "Largest local authority",
            value: top.name,
            note: formatNumber(top.allBlack),
          },
          {
            label: "Core Black share",
            value: formatPercent(top.coreShare, 1),
            note: "Within authority population",
          },
        ],
      };
    }
    case "population:male":
    case "population:female": {
      const data = await loadPopulationPageData();
      const row = data.sexRows.find((candidate) => candidate.key === "all_black");
      if (!row) return null;
      const isFemale = slug === "female";
      return {
        liveRoute: "/population",
        source: data.source,
        stats: [
          {
            label: isFemale ? "Female count" : "Male count",
            value: formatNumber(isFemale ? row.female : row.male),
            note: "All Black population",
          },
          {
            label: isFemale ? "Female share" : "Male share",
            value: formatPercent(isFemale ? row.femaleShare : row.maleShare, 1),
            note: "Within all Black population",
          },
        ],
      };
    }
    case "population:age-distribution": {
      const data = await loadPopulationPageData();
      const topBand = [...data.ageProfileRows].sort(
        (left, right) => right.coreBlackCount - left.coreBlackCount
      )[0];
      if (!topBand) return null;
      return {
        liveRoute: "/population",
        source: data.source,
        stats: [
          {
            label: "Largest age band",
            value: topBand.label,
            note: formatNumber(topBand.coreBlackCount),
          },
          {
            label: "All Black share",
            value: formatPercent(topBand.coreBlackShare, 1),
            note: "Within all Black population",
          },
        ],
      };
    }
    case "economics:employment": {
      const data = await loadEconomicsPageData();
      return {
        liveRoute: "/economics",
        source: data.source,
        stats: [
          {
            label: "Black employment",
            value: formatPercent(data.headline.blackEmploymentRate, 1),
            note: `${formatSignedPoints(data.headline.employmentGap)} vs overall`,
          },
          {
            label: "Overall baseline",
            value: formatPercent(data.headline.allEmploymentRate, 1),
            note: data.latestLabel,
          },
        ],
      };
    }
    case "economics:unemployment": {
      const data = await loadEconomicsPageData();
      return {
        liveRoute: "/economics",
        source: data.source,
        stats: [
          {
            label: "Black unemployment",
            value: formatPercent(data.headline.blackUnemploymentRate, 1),
            note: data.latestLabel,
          },
          {
            label: "Black inactivity",
            value: formatPercent(data.headline.blackInactivityRate, 1),
            note: data.latestLabel,
          },
        ],
      };
    }
    case "households:housing": {
      const data = await loadHouseholdsPageData();
      return {
        liveRoute: "/households",
        source: data.source,
        downloadHref: data.source.apiEndpoint,
        stats: [
          {
            label: "All Black home ownership",
            value: formatPercent(data.headline.allBlackRate, 1),
            note: `${formatSignedPoints(data.headline.gapToOverall)} vs all households`,
          },
          {
            label: "All households",
            value: formatPercent(data.headline.overallRate, 1),
            note: data.latestLabel,
          },
        ],
      };
    }
    case "households:income":
    case "households:poverty": {
      const dataset = await loadDataset(LOW_INCOME_DATASET_PATH);
      const latestTime = dataset.metadata.referenceDate;
      const blackRate = getMeasure(dataset, "all_black", latestTime, "rate");
      const allRate = getMeasure(dataset, "all_ethnicities", latestTime, "rate");

      return {
        liveRoute: `/${category}/${slug}`,
        source: dataset.metadata,
        downloadHref: dataset.metadata.apiEndpoint,
        stats: [
          {
            label: "Black low-income rate",
            value: formatPercent(blackRate, 1),
            note: `${formatSignedPoints(blackRate - allRate)} vs UK overall`,
          },
          {
            label: "UK overall",
            value: formatPercent(allRate, 1),
            note: latestTime,
          },
        ],
      };
    }
    case "education:attainment": {
      const dataset = await loadDataset(QUALIFICATIONS_DATASET_PATH);
      const blackDegreeShare = getCategoryMeasure(
        dataset,
        "all_black",
        "Level 4 qualifications or above",
        "share"
      );
      const allDegreeShare = getCategoryMeasure(
        dataset,
        "all_ethnicities",
        "Level 4 qualifications or above",
        "share"
      );
      const blackNoQualifications = getCategoryMeasure(
        dataset,
        "all_black",
        "No qualifications",
        "share"
      );

      return {
        liveRoute: "/education/attainment",
        source: dataset.metadata,
        downloadHref: dataset.metadata.apiEndpoint,
        stats: [
          {
            label: "Level 4+ qualifications",
            value: formatPercent(blackDegreeShare, 1),
            note: `${formatSignedPoints(blackDegreeShare - allDegreeShare)} vs all adults`,
          },
          {
            label: "No qualifications",
            value: formatPercent(blackNoQualifications, 1),
            note: "Broad Black group, Census 2021",
          },
        ],
      };
    }
    case "education:gcse-a-level": {
      const [gcseDataset, aLevelDataset] = await Promise.all([
        loadDataset(GCSE_DATASET_PATH),
        loadDataset(A_LEVEL_DATASET_PATH),
      ]);
      const gcseTime = gcseDataset.metadata.referenceDate;
      const aLevelTime = aLevelDataset.metadata.referenceDate;
      const blackGcse = getMeasure(
        gcseDataset,
        "all_black",
        gcseTime,
        "attainment_8_score"
      );
      const allGcse = getMeasure(
        gcseDataset,
        "all_ethnicities",
        gcseTime,
        "attainment_8_score"
      );
      const blackALevel = getMeasure(
        aLevelDataset,
        "all_black",
        aLevelTime,
        "three_a_rate"
      );
      const allALevel = getMeasure(
        aLevelDataset,
        "all_ethnicities",
        aLevelTime,
        "three_a_rate"
      );

      return {
        liveRoute: "/education/gcse-a-level",
        source: aLevelDataset.metadata,
        downloadHref: aLevelDataset.metadata.apiEndpoint,
        stats: [
          {
            label: "Black Attainment 8 score",
            value: blackGcse.toFixed(1),
            note: `${formatSignedPoints(blackGcse - allGcse)} vs all pupils`,
          },
          {
            label: "3 A grades or better",
            value: formatPercent(blackALevel, 1),
            note: `${formatSignedPoints(blackALevel - allALevel)} vs all students`,
          },
        ],
      };
    }
    case "education:university": {
      const [entryDataset, degreeDataset] = await Promise.all([
        loadDataset(UNIVERSITY_ENTRY_DATASET_PATH),
        loadDataset(UNIVERSITY_DEGREE_DATASET_PATH),
      ]);
      const entryTime = entryDataset.metadata.referenceDate;
      const degreeTime = degreeDataset.metadata.referenceDate;
      const blackEntry = getMeasure(entryDataset, "all_black", entryTime, "entry_rate");
      const allEntry = getMeasure(
        entryDataset,
        "all_ethnicities",
        entryTime,
        "entry_rate"
      );
      const blackGoodDegree =
        getClassShare(degreeDataset, "all_black", degreeTime, "first class honours") +
        getClassShare(
          degreeDataset,
          "all_black",
          degreeTime,
          "upper second class honours"
        );
      const allGoodDegree =
        getClassShare(
          degreeDataset,
          "all_ethnicities",
          degreeTime,
          "first class honours"
        ) +
        getClassShare(
          degreeDataset,
          "all_ethnicities",
          degreeTime,
          "upper second class honours"
        );

      return {
        liveRoute: "/education/university",
        source: entryDataset.metadata,
        downloadHref: entryDataset.metadata.apiEndpoint,
        stats: [
          {
            label: "HE entry rate",
            value: formatPercent(blackEntry, 1),
            note: `${formatSignedPoints(blackEntry - allEntry)} vs all pupils`,
          },
          {
            label: "First or 2:1 degree",
            value: formatPercent(blackGoodDegree, 1),
            note: `${formatSignedPoints(blackGoodDegree - allGoodDegree)} vs all graduates`,
          },
        ],
      };
    }
    case "education:exclusions": {
      const data = await loadEducationPageData();
      const wbCaribbean = data.metricRows.find(
        (row) => row.key === "mixed_white_black_caribbean"
      );
      const blackCaribbean = data.metricRows.find(
        (row) => row.key === "black_caribbean"
      );
      const allPupils = data.metricRows.find((row) => row.key === "all_ethnicities");
      if (!wbCaribbean || !blackCaribbean || !allPupils) return null;
      return {
        liveRoute: "/education",
        source: data.source,
        downloadHref: data.source.apiEndpoint,
        stats: [
          {
            label: "White and Black Caribbean",
            value: formatPercent(wbCaribbean.suspensionRate, 2),
            note: `${formatSignedPoints(wbCaribbean.suspensionRate - allPupils.suspensionRate)} vs all pupils`,
          },
          {
            label: "Black Caribbean",
            value: formatPercent(blackCaribbean.suspensionRate, 2),
            note: data.latestLabel,
          },
        ],
      };
    }
    case "health:mental-health": {
      const data = await loadHealthPageData();
      return {
        liveRoute: "/health",
        source: data.source,
        downloadHref: data.source.apiEndpoint,
        stats: [
          {
            label: "All Black rate",
            value: formatRate(data.headline.allBlackRate, 100_000),
            note: data.latestLabel,
          },
          {
            label: "Black Caribbean",
            value: formatRate(data.headline.blackCaribbeanRate, 100_000),
            note: data.latestLabel,
          },
        ],
      };
    }
    case "health:maternal-health": {
      const source = createManualSource({
        id: "mbrrace-maternal-mortality",
        name: "MBRRACE-UK Maternal Mortality Data Brief",
        publisher: "MBRRACE-UK",
        url: "https://www.npeu.ox.ac.uk/mbrrace-uk/reports",
        datePublished: "2024-11-14",
        referenceDate: "2022 to 2024",
        referencePeriod: "2022 to 2024",
        geographicCoverage: "United Kingdom",
        methodology:
          "Manual snapshot based on the official MBRRACE-UK maternal mortality data brief for deaths between 2022 and 2024.",
        caveats: [
          "This topic currently uses a manual snapshot rather than a fetched structured dataset.",
          "The headline disparity compares Black women with White women as published by MBRRACE-UK.",
        ],
        license: "See source publication",
      });

      return {
        liveRoute: "/health/maternal-health",
        source,
        stats: [
          {
            label: "Black maternal mortality",
            value: "35.1 per 100,000",
            note: "UK maternal mortality rate, 2022 to 2024",
          },
          {
            label: "Relative risk",
            value: "2.9x",
            note: "Compared with White women",
          },
        ],
      };
    }
    case "culture-geography:stop-search": {
      const data = await loadCulturePageData();
      return {
        liveRoute: "/culture-geography",
        source: data.source,
        downloadHref: data.source.apiEndpoint,
        stats: [
          {
            label: "All Black rate",
            value: formatRate(data.headline.allBlackRate, 1_000),
            note: `${data.headline.disproportionalityRatio.toFixed(1)}x overall rate`,
          },
          {
            label: "Overall rate",
            value: formatRate(data.headline.overallRate, 1_000),
            note: data.latestLabel,
          },
        ],
      };
    }
    case "culture-geography:religion": {
      const dataset = await loadDataset(RELIGION_DATASET_PATH);
      const blackChristian = getCategoryMeasure(dataset, "all_black", "Christian", "share");
      const allChristian = getCategoryMeasure(
        dataset,
        "all_ethnicities",
        "Christian",
        "share"
      );
      const blackNoReligion = getCategoryMeasure(
        dataset,
        "all_black",
        "No religion",
        "share"
      );

      return {
        liveRoute: "/culture-geography/religion",
        source: dataset.metadata,
        downloadHref: dataset.metadata.apiEndpoint,
        stats: [
          {
            label: "Black Christian share",
            value: formatPercent(blackChristian, 1),
            note: `${formatSignedPoints(blackChristian - allChristian)} vs all people`,
          },
          {
            label: "No religion",
            value: formatPercent(blackNoReligion, 1),
            note: "Broad Black group, Census 2021",
          },
        ],
      };
    }
    case "culture-geography:heritage-migration": {
      const dataset = await loadDataset(HERITAGE_DATASET_PATH);
      const blackUkBorn = getCategoryMeasure(
        dataset,
        "all_black",
        "Europe: United Kingdom",
        "share"
      );
      const allUkBorn = getCategoryMeasure(
        dataset,
        "all_ethnicities",
        "Europe: United Kingdom",
        "share"
      );
      const blackAfricaBorn = getCategoryMeasure(dataset, "all_black", "Africa", "share");

      return {
        liveRoute: "/culture-geography/heritage-migration",
        source: dataset.metadata,
        downloadHref: dataset.metadata.apiEndpoint,
        stats: [
          {
            label: "UK-born share",
            value: formatPercent(blackUkBorn, 1),
            note: `${formatSignedPoints(blackUkBorn - allUkBorn)} vs all people`,
          },
          {
            label: "Africa-born share",
            value: formatPercent(blackAfricaBorn, 1),
            note: "Broad Black group, Census 2021",
          },
        ],
      };
    }
    case "culture-geography:crime": {
      const dataset = await loadDataset(CRIME_DATASET_PATH);
      const latestTime = dataset.metadata.referenceDate;
      const blackRate = getMeasure(dataset, "all_black", latestTime, "victimisation_rate");
      const allRate = getMeasure(
        dataset,
        "all_ethnicities",
        latestTime,
        "victimisation_rate"
      );
      const otherBlackRate = getMeasure(
        dataset,
        "other_black",
        latestTime,
        "victimisation_rate"
      );

      return {
        liveRoute: "/culture-geography/crime",
        source: dataset.metadata,
        downloadHref: dataset.metadata.apiEndpoint,
        stats: [
          {
            label: "Black victimisation rate",
            value: formatPercent(blackRate, 1),
            note: `${formatSignedPoints(blackRate - allRate)} vs all adults`,
          },
          {
            label: "Other Black rate",
            value: formatPercent(otherBlackRate, 1),
            note: latestTime,
          },
        ],
      };
    }
    case "culture-geography:incarceration": {
      const source = createManualSource({
        id: "hmpps-offender-equalities-2024-2025",
        name: "HM Prison and Probation Service Offender Equalities Annual Report 2024 to 2025",
        publisher: "HM Prison and Probation Service / Ministry of Justice",
        url: "https://www.gov.uk/government/statistics/hm-prison-and-probation-service-offender-equalities-annual-report-2024-to-2025",
        datePublished: "2025-10-30",
        referenceDate: "31 March 2024",
        referencePeriod: "2023/24",
        geographicCoverage: "England and Wales",
        methodology:
          "Manual snapshot based on the official HMPPS offender equalities annual report and recent accompanying prison-population statistics.",
        caveats: [
          "This topic currently opens with an official headline snapshot while a fuller structured prison-statistics build is in progress.",
        ],
        license: "Open Government Licence v3.0",
      });

      return {
        liveRoute: "/culture-geography/incarceration",
        source,
        stats: [
          {
            label: "Black share of remand prisoners",
            value: "12.9%",
            note: "England and Wales, 31 March 2024",
          },
          {
            label: "Black share of sentenced prisoners",
            value: "12.1%",
            note: "England and Wales, 31 March 2024",
          },
        ],
      };
    }
    case "culture-geography:politics": {
      const source = createManualSource({
        id: "commons-ethnic-diversity-politics",
        name: "Ethnic Diversity in Politics and Public Life",
        publisher: "House of Commons Library",
        url: "https://commonslibrary.parliament.uk/research-briefings/sn01156/",
        datePublished: "2025-09-17",
        referenceDate: "4 July 2024",
        referencePeriod: "2024 general election",
        geographicCoverage: "United Kingdom",
        methodology:
          "Manual snapshot based on the House of Commons Library briefing on ethnic diversity in politics and public life.",
        caveats: [
          "The official UK data gap remains: there is no complete machine-readable Black-specific dataset covering all elected officeholders.",
          "This topic therefore starts with parliamentary ethnic-minority representation rather than a Black-only administrative series.",
        ],
        license: "Open Parliament Licence v3.0",
      });

      return {
        liveRoute: "/culture-geography/politics",
        source,
        stats: [
          {
            label: "Ethnic minority MPs",
            value: "90",
            note: "House of Commons after the 2024 general election",
          },
          {
            label: "Share of MPs",
            value: "14%",
            note: "Compared with 16% of the UK population",
          },
        ],
      };
    }
    default:
      return null;
  }
}

function getMeasure(
  dataset: Dataset,
  group: EthnicGroup,
  timePeriod: string,
  measure: string
) {
  const observation = dataset.observations.find(
    (candidate) =>
      candidate.ethnicGroup === group &&
      candidate.timePeriod === timePeriod &&
      candidate.attributes?.measure === measure
  );

  if (!observation) {
    throw new Error(
      `Missing observation for ${dataset.id}: ${group} / ${timePeriod} / ${measure}`
    );
  }

  return observation.value.value;
}

function getCategoryMeasure(
  dataset: Dataset,
  group: EthnicGroup,
  labelPrefix: string,
  measure: string
) {
  const observation = dataset.observations.find(
    (candidate) =>
      candidate.ethnicGroup === group &&
      candidate.attributes?.measure === measure &&
      (candidate.attributes?.label?.startsWith(labelPrefix) ?? false)
  );

  if (!observation) {
    throw new Error(
      `Missing category observation for ${dataset.id}: ${group} / ${labelPrefix} / ${measure}`
    );
  }

  return observation.value.value;
}

function getClassShare(
  dataset: Dataset,
  group: EthnicGroup,
  timePeriod: string,
  classification: string
) {
  const observation = dataset.observations.find(
    (candidate) =>
      candidate.ethnicGroup === group &&
      candidate.timePeriod === timePeriod &&
      candidate.attributes?.measure === "share" &&
      candidate.attributes?.classification === classification
  );

  if (!observation) {
    throw new Error(
      `Missing degree classification for ${dataset.id}: ${group} / ${classification}`
    );
  }

  return observation.value.value;
}

function createManualSource(
  input: {
    id: string;
    name: string;
    publisher: string;
    url: string;
    datePublished: string;
    referenceDate: string;
    referencePeriod: string;
    geographicCoverage: string;
    methodology: string;
    caveats: string[];
    license: string;
  }
): SourceMetadata {
  return {
    ...input,
    dateAccessed: CURRENT_DATE,
    qualityFlags: ["manual_transcription"],
    fetchMethod: "manual_transcription",
  };
}

function formatSignedPoints(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)} pts`;
}
