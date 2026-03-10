import { loadDataset } from "./data-loader";
import { loadCulturePageData } from "./culture-summary";
import { loadEconomicsPageData } from "./economics-summary";
import { loadEducationPageData } from "./education-summary";
import { formatPercent, formatRate } from "./format";
import { loadHealthPageData } from "./health-summary";
import { loadHouseholdsPageData } from "./households-summary";
import { loadPopulationHomepageData, loadPopulationPageData } from "./population-summary";
import { loadTopicSnapshot } from "./topic-snapshots";

const LOW_INCOME_DATASET_PATH =
  "fetched/eff/households/low-income-households-national.json";
const GCSE_DATASET_PATH = "fetched/eff/education/gcse-attainment-national.json";
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

export interface KeyFinding {
  id: string;
  eyebrow: string;
  title: string;
  stat: string;
  comparison: string;
  summary: string;
  href: string;
  sourceLabel: string;
}

export async function loadKeyFindings(): Promise<KeyFinding[]> {
  const [
    populationHome,
    populationPage,
    households,
    economics,
    education,
    health,
    justice,
    lowIncomeDataset,
    gcseDataset,
    universityEntryDataset,
    universityDegreeDataset,
    religionDataset,
    heritageDataset,
    crimeDataset,
    maternalSnapshot,
  ] = await Promise.all([
    loadPopulationHomepageData(),
    loadPopulationPageData(),
    loadHouseholdsPageData(),
    loadEconomicsPageData(),
    loadEducationPageData(),
    loadHealthPageData(),
    loadCulturePageData(),
    loadDataset(LOW_INCOME_DATASET_PATH),
    loadDataset(GCSE_DATASET_PATH),
    loadDataset(UNIVERSITY_ENTRY_DATASET_PATH),
    loadDataset(UNIVERSITY_DEGREE_DATASET_PATH),
    loadDataset(RELIGION_DATASET_PATH),
    loadDataset(HERITAGE_DATASET_PATH),
    loadDataset(CRIME_DATASET_PATH),
    loadTopicSnapshot("health", "maternal-health"),
  ]);

  const under25Row = populationPage.ageProfileRows.find(
    (row) => row.key === "24-and-under"
  );
  const topRegion = populationHome.regionalRows[0];
  const allPupils = education.metricRows.find((row) => row.key === "all_ethnicities");
  const wbCaribbean = education.metricRows.find(
    (row) => row.key === "mixed_white_black_caribbean"
  );
  const otherBlackHealth = health.metricRows.find((row) => row.key === "other_black");
  const blackCrimeRate = getMeasure(
    crimeDataset,
    "all_black",
    crimeDataset.metadata.referenceDate,
    "victimisation_rate"
  );
  const allCrimeRate = getMeasure(
    crimeDataset,
    "all_ethnicities",
    crimeDataset.metadata.referenceDate,
    "victimisation_rate"
  );

  if (!under25Row || !topRegion || !allPupils || !wbCaribbean || !otherBlackHealth) {
    throw new Error("Key findings are missing required comparison rows.");
  }

  const lowIncomeBlack = getMeasure(
    lowIncomeDataset,
    "all_black",
    lowIncomeDataset.metadata.referenceDate,
    "rate"
  );
  const lowIncomeAll = getMeasure(
    lowIncomeDataset,
    "all_ethnicities",
    lowIncomeDataset.metadata.referenceDate,
    "rate"
  );
  const gcseBlackAfrican = getMeasure(
    gcseDataset,
    "black_african",
    gcseDataset.metadata.referenceDate,
    "attainment_8_score"
  );
  const gcseAll = getMeasure(
    gcseDataset,
    "all_ethnicities",
    gcseDataset.metadata.referenceDate,
    "attainment_8_score"
  );
  const universityBlack = getMeasure(
    universityEntryDataset,
    "all_black",
    universityEntryDataset.metadata.referenceDate,
    "entry_rate"
  );
  const universityAll = getMeasure(
    universityEntryDataset,
    "all_ethnicities",
    universityEntryDataset.metadata.referenceDate,
    "entry_rate"
  );
  const blackGoodDegree =
    getClassShare(
      universityDegreeDataset,
      "all_black",
      universityDegreeDataset.metadata.referenceDate,
      "first class honours"
    ) +
    getClassShare(
      universityDegreeDataset,
      "all_black",
      universityDegreeDataset.metadata.referenceDate,
      "upper second class honours"
    );
  const allGoodDegree =
    getClassShare(
      universityDegreeDataset,
      "all_ethnicities",
      universityDegreeDataset.metadata.referenceDate,
      "first class honours"
    ) +
    getClassShare(
      universityDegreeDataset,
      "all_ethnicities",
      universityDegreeDataset.metadata.referenceDate,
      "upper second class honours"
    );
  const blackChristian = getCategoryMeasure(
    religionDataset,
    "all_black",
    "Christian",
    "share"
  );
  const allChristian = getCategoryMeasure(
    religionDataset,
    "all_ethnicities",
    "Christian",
    "share"
  );
  const blackUkBorn = getCategoryMeasure(
    heritageDataset,
    "all_black",
    "Europe: United Kingdom",
    "share"
  );
  const allUkBorn = getCategoryMeasure(
    heritageDataset,
    "all_ethnicities",
    "Europe: United Kingdom",
    "share"
  );

  return [
    {
      id: "population-youth",
      eyebrow: "Population",
      title: "The Black population is markedly younger than the population overall.",
      stat: formatPercent(under25Row.coreBlackShare, 1),
      comparison: `vs ${formatPercent(under25Row.allPopulationShare, 1)} across England and Wales`,
      summary:
        "That age profile shapes housing, education, labour-market, and family data across the site.",
      href: "/population/age-distribution",
      sourceLabel: `Census 2021 age profile (${populationPage.source.referenceDate})`,
    },
    {
      id: "population-london",
      eyebrow: "Population",
      title: "London still holds the largest core Black population by a wide margin.",
      stat: "1,188,370",
      comparison: `13.5% of London residents`,
      summary:
        "It remains the clearest place to start for regional concentration and local-authority scale.",
      href: "/population/by-region",
      sourceLabel: `Census 2021 regional counts (${populationHome.source.referenceDate})`,
    },
    {
      id: "home-ownership-gap",
      eyebrow: "Households",
      title: "Home ownership among Black households remains far below the England baseline.",
      stat: formatPercent(households.headline.allBlackRate, 1),
      comparison: `vs ${formatPercent(households.headline.overallRate, 1)} for all households`,
      summary:
        `The latest pooled release leaves a ${Math.abs(
          households.headline.gapToOverall
        ).toFixed(1)} point gap.`,
      href: "/households/housing",
      sourceLabel: `Ethnicity Facts and Figures home ownership (${households.latestLabel})`,
    },
    {
      id: "low-income-households",
      eyebrow: "Households",
      title: "Black households are far more likely to fall into the low-income category.",
      stat: formatPercent(lowIncomeBlack, 1),
      comparison: `vs ${formatPercent(lowIncomeAll, 1)} for all households`,
      summary:
        "This is a UK-wide after-housing-costs measure using the latest three-year official average.",
      href: "/households/income",
      sourceLabel: `Ethnicity Facts and Figures low-income households (${lowIncomeDataset.metadata.referenceDate})`,
    },
    {
      id: "employment-gap",
      eyebrow: "Economics",
      title: "Black employment is below the UK-wide employment rate, but the gap is not uniform across the labour market.",
      stat: formatPercent(economics.headline.blackEmploymentRate, 1),
      comparison: `vs ${formatPercent(economics.headline.allEmploymentRate, 1)} UK overall`,
      summary:
        `The current APS release puts the gap at ${Math.abs(
          economics.headline.employmentGap
        ).toFixed(1)} points.`,
      href: "/economics/employment",
      sourceLabel: `Annual Population Survey (${economics.latestLabel})`,
    },
    {
      id: "gcse-black-african",
      eyebrow: "Education",
      title: "Black African pupils outperform the England Attainment 8 average.",
      stat: gcseBlackAfrican.toFixed(1),
      comparison: `vs ${gcseAll.toFixed(1)} across all pupils`,
      summary:
        "That is one reason the education section now balances deficit metrics with access and attainment strengths.",
      href: "/education/gcse-a-level",
      sourceLabel: `Ethnicity Facts and Figures GCSE attainment (${gcseDataset.metadata.referenceDate})`,
    },
    {
      id: "university-entry",
      eyebrow: "Education",
      title: "Black state-school pupils enter higher education at a much higher rate than the average pupil.",
      stat: formatPercent(universityBlack, 1),
      comparison: `vs ${formatPercent(universityAll, 1)} for all pupils`,
      summary:
        `Degree outcomes remain more mixed, with first-or-2:1 results at ${formatPercent(
          blackGoodDegree,
          1
        )} against ${formatPercent(allGoodDegree, 1)} overall.`,
      href: "/education/university",
      sourceLabel: `Ethnicity Facts and Figures higher education (${universityEntryDataset.metadata.referenceDate})`,
    },
    {
      id: "school-suspensions",
      eyebrow: "Education",
      title: "The highest current suspension rate still sits with White and Black Caribbean pupils.",
      stat: formatPercent(wbCaribbean.suspensionRate, 2),
      comparison: `vs ${formatPercent(allPupils.suspensionRate, 2)} for all pupils`,
      summary:
        wbCaribbean.suspensionRateChange === null
          ? "The exclusions page carries the exact rate table and current source notes."
          : `That is ${formatSignedPoints(
              wbCaribbean.suspensionRateChange
            )} compared with the matched prior autumn term.`,
      href: "/education/exclusions",
      sourceLabel: `DfE suspensions (${education.latestLabel})`,
    },
    {
      id: "maternal-mortality",
      eyebrow: "Health",
      title: "Black maternal mortality remains one of the clearest health disparities in the UK data.",
      stat: maternalSnapshot?.stats[0]?.value ?? "35.1 per 100,000",
      comparison: maternalSnapshot?.stats[1]?.value
        ? `${maternalSnapshot.stats[1].value} compared with White women`
        : "2.9x compared with White women",
      summary:
        "The health section now opens this topic with the official MBRRACE-UK headline rather than leaving it as a stub.",
      href: "/health/maternal-health",
      sourceLabel: "MBRRACE-UK maternal mortality data brief (2022 to 2024)",
    },
    {
      id: "mental-health-detentions",
      eyebrow: "Health",
      title: "Other Black detention rates remain far above the all-Black detention average in the published Mental Health Act series.",
      stat: formatRate(otherBlackHealth.rate, 100_000),
      comparison: `vs ${formatRate(health.headline.allBlackRate, 100_000)} for all Black groups combined`,
      summary:
        "The page keeps the sparse published time series visible instead of smoothing over unavailable subgroup history.",
      href: "/health/mental-health",
      sourceLabel: `Ethnicity Facts and Figures mental health detentions (${health.latestLabel})`,
    },
    {
      id: "stop-search-gap",
      eyebrow: "Justice & Policing",
      title: "Black stop-and-search rates remain several times higher than the overall England and Wales rate.",
      stat: formatRate(justice.headline.allBlackRate, 1_000),
      comparison: `vs ${formatRate(justice.headline.overallRate, 1_000)} overall`,
      summary:
        `The current disproportionality ratio is ${justice.headline.disproportionalityRatio.toFixed(
          1
        )}x.`,
      href: "/culture-geography/stop-search",
      sourceLabel: `Ethnicity Facts and Figures stop and search (${justice.latestLabel})`,
    },
    {
      id: "crime-victimisation",
      eyebrow: "Justice & Policing",
      title: "Black adults are not universally above the national crime-victimisation average in the latest official survey.",
      stat: formatPercent(blackCrimeRate, 1),
      comparison: `vs ${formatPercent(allCrimeRate, 1)} across all adults`,
      summary:
        "That nuance matters: the justice picture is not the same across victimisation, policing, remand, and sentencing data.",
      href: "/culture-geography/crime",
      sourceLabel: `Ethnicity Facts and Figures crime victims (${crimeDataset.metadata.referenceDate})`,
    },
    {
      id: "religion-profile",
      eyebrow: "Identity & Civic Life",
      title: "Christian affiliation is much more common within the broad Black population than in the population overall.",
      stat: formatPercent(blackChristian, 1),
      comparison: `vs ${formatPercent(allChristian, 1)} across all people`,
      summary:
        "The identity section now separates these Census profile questions from policing and crime data.",
      href: "/culture-geography/religion",
      sourceLabel: `Census 2021 religion by ethnicity (${religionDataset.metadata.referenceDate})`,
    },
    {
      id: "uk-born-share",
      eyebrow: "Identity & Civic Life",
      title: "The broad Black population is much less UK-born than the population overall, but nearly half are UK-born.",
      stat: formatPercent(blackUkBorn, 1),
      comparison: `vs ${formatPercent(allUkBorn, 1)} across all people`,
      summary:
        "This helps frame heritage and migration as demographic structure rather than shorthand assumptions.",
      href: "/culture-geography/heritage-migration",
      sourceLabel: `Census 2021 country of birth by ethnicity (${heritageDataset.metadata.referenceDate})`,
    },
  ];
}

function getMeasure(
  dataset: { observations: Array<{ ethnicGroup: string; timePeriod: string; attributes?: Record<string, string>; value: { value: number } }> },
  group: string,
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
    throw new Error(`Missing observation for ${group} / ${timePeriod} / ${measure}`);
  }

  return observation.value.value;
}

function getClassShare(
  dataset: { observations: Array<{ ethnicGroup: string; timePeriod: string; category?: string; attributes?: Record<string, string>; value: { value: number } }> },
  group: string,
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
      `Missing classification share for ${group} / ${timePeriod} / ${classification}`
    );
  }

  return observation.value.value;
}

function getCategoryMeasure(
  dataset: {
    observations: Array<{
      ethnicGroup: string;
      category?: string;
      attributes?: Record<string, string>;
      value: { value: number };
    }>;
  },
  group: string,
  category: string,
  measure: string
) {
  const observation = dataset.observations.find(
    (candidate) =>
      candidate.ethnicGroup === group &&
      (candidate.category === category ||
        candidate.category === slugify(category) ||
        candidate.attributes?.label === category) &&
      candidate.attributes?.measure === measure
  );

  if (!observation) {
    throw new Error(`Missing category observation for ${group} / ${category} / ${measure}`);
  }

  return observation.value.value;
}

function formatSignedPoints(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)} pts`;
}

function slugify(value: string) {
  return value.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-").replaceAll(/^-|-$/g, "");
}
