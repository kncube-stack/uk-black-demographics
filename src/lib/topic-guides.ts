import { CATEGORIES } from "./constants";
import type { SiteCategory } from "./types";

export type TopicStatus = "live" | "source-backed";

export interface TopicSource {
  title: string;
  publisher: string;
  url: string;
  detail: string;
}

export interface TopicGuide {
  category: SiteCategory;
  slug: string;
  title: string;
  description: string;
  status: TopicStatus;
  summary: string;
  liveRoute?: string;
  caveats?: string[];
  sources?: TopicSource[];
}

export const TOPIC_GUIDES: Record<SiteCategory, TopicGuide[]> = {
  population: [
    liveGuide("population", "total", "Total Population", "Core and inclusive Black population totals.", "/population"),
    liveGuide("population", "by-region", "By Region", "Regional population distribution across England and Wales.", "/population"),
    liveGuide("population", "by-local-authority", "By Local Authority", "Largest local-authority populations and local concentration.", "/population"),
    liveGuide("population", "male", "Male", "Male population and within-group sex composition.", "/population"),
    liveGuide("population", "female", "Female", "Female population and within-group sex composition.", "/population"),
    liveGuide("population", "age-distribution", "Age Distribution", "Age structure and relative youth of the population.", "/population"),
  ],
  households: [
    sourceGuide("households", "income", "Income", "Household income by ethnicity.", "Source-backed for now. The strongest official route is HBAI plus the current Ethnicity Facts and Figures low-income release.", [
      {
        title: "People in low-income households",
        publisher: "Race Disparity Unit / Cabinet Office",
        url: "https://www.ethnicity-facts-figures.service.gov.uk/work-pay-and-benefits/pay-and-income/people-in-low-income-households/latest/",
        detail: "Official ethnicity breakdown for low-income households.",
      },
      {
        title: "Households Below Average Income",
        publisher: "Department for Work and Pensions",
        url: "https://www.gov.uk/government/statistics/households-below-average-income-for-financial-years-ending-1995-to-2023",
        detail: "Primary poverty and low-income series with ethnicity tables.",
      },
    ]),
    sourceGuide("households", "marriage", "Marriage", "Marital and civil partnership status by ethnicity.", "Source-backed. The key limitation here is structural: UK marriage registrations do not record ethnicity directly.", [
      {
        title: "Census and APS source base",
        publisher: "Office for National Statistics",
        url: "https://www.ons.gov.uk/census",
        detail: "Census and APS are the practical official routes because registration data does not capture ethnicity.",
      },
    ], [
      "There is no official annual marriage-registration dataset by ethnicity in England and Wales.",
    ]),
    liveGuide("households", "housing", "Housing", "Home ownership and housing access.", "/households"),
    sourceGuide("households", "wealth", "Wealth", "Household wealth and assets.", "Source-backed for now. Wealth is strongest in longitudinal surveys rather than a single government administrative feed.", [
      {
        title: "Understanding Society",
        publisher: "Institute for Social and Economic Research",
        url: "https://www.understandingsociety.ac.uk/",
        detail: "Longitudinal source with ethnicity, income, housing, and wealth measures.",
      },
    ]),
    sourceGuide("households", "poverty", "Poverty", "Low income and deprivation.", "Source-backed for now, with HBAI as the main official anchor.", [
      {
        title: "Households Below Average Income",
        publisher: "Department for Work and Pensions",
        url: "https://www.gov.uk/government/statistics/households-below-average-income-for-financial-years-ending-1995-to-2023",
        detail: "Official poverty series including ethnicity breakdowns.",
      },
    ]),
  ],
  economics: [
    liveGuide("economics", "employment", "Employment", "Employment rates and occupational profile.", "/economics"),
    liveGuide("economics", "unemployment", "Unemployment", "Unemployment and inactivity rates.", "/economics"),
    sourceGuide("economics", "businesses", "Businesses", "Self-employment and Black business ownership proxies.", "Source-backed for now. There is no official UK register of business owner ethnicity, so self-employment and survey proxies remain the main route.", [
      {
        title: "Small Business Survey reports",
        publisher: "Department for Business and Trade",
        url: "https://www.gov.uk/government/collections/small-business-survey-reports",
        detail: "Survey-based evidence on minority ethnic led businesses.",
      },
    ], [
      "The UK does not maintain an official business register by owner ethnicity.",
    ]),
  ],
  education: [
    sourceGuide("education", "attainment", "Qualifications", "Highest qualification levels by ethnicity.", "Source-backed for now, with Census 2021 and Ethnicity Facts and Figures as the base.", [
      {
        title: "Census 2021 TS067",
        publisher: "Office for National Statistics",
        url: "https://www.ons.gov.uk/datasets/TS067/editions/2021/versions/3",
        detail: "Highest level of qualification by ethnicity.",
      },
    ]),
    sourceGuide("education", "gcse-a-level", "GCSE & A-Level", "School results and attainment gaps.", "Source-backed for now via DfE/EES school performance releases.", [
      {
        title: "Key stage 4 performance",
        publisher: "Department for Education",
        url: "https://explore-education-statistics.service.gov.uk/find-statistics/key-stage-4-performance-revised",
        detail: "Attainment 8, Progress 8, and key GCSE ethnicity breakdowns.",
      },
      {
        title: "A-level and other 16 to 18 results",
        publisher: "Department for Education",
        url: "https://explore-education-statistics.service.gov.uk/find-statistics/a-level-and-other-16-to-18-results",
        detail: "16 to 18 attainment by ethnicity.",
      },
    ]),
    sourceGuide("education", "university", "University", "Applications, access, attainment, and outcomes in higher education.", "Source-backed for now with UCAS, HESA, and OfS as the main live route set.", [
      {
        title: "UCAS end of cycle resources",
        publisher: "UCAS",
        url: "https://www.ucas.com/data-and-analysis/undergraduate-statistics-and-reports/ucas-undergraduate-end-cycle-data-resources",
        detail: "Applications, offers, and acceptances by ethnicity.",
      },
      {
        title: "HESA student data",
        publisher: "HESA / Jisc",
        url: "https://www.hesa.ac.uk/data-and-analysis/students",
        detail: "Official higher-education student and outcomes data.",
      },
    ]),
    liveGuide("education", "exclusions", "Exclusions", "Suspensions and permanent exclusions.", "/education"),
  ],
  health: [
    sourceGuide("health", "life-expectancy", "Life Expectancy", "Life expectancy and mortality by ethnicity.", "Source-backed for now. The main official UK gap here is that ethnicity is not recorded on death certificates.", [
      {
        title: "Ethnic differences in life expectancy and mortality",
        publisher: "Office for National Statistics",
        url: "https://www.ons.gov.uk/peoplepopulationandcommunity/birthsdeathsandmarriages/lifeexpectancies/articles/ethnicdifferencesinlifeexpectancyandmortalityfromselectedcausesinenglandandwales/2011to2014",
        detail: "The main official linked-data life expectancy source by ethnicity.",
      },
    ], [
      "There is no routine death-registration ethnicity field in England and Wales.",
    ]),
    sourceGuide("health", "obesity", "Obesity", "Adult and child obesity rates by ethnicity.", "Source-backed for now via health survey and NHS release routes.", [
      {
        title: "Health Survey for England",
        publisher: "NHS England / NHS Digital",
        url: "https://digital.nhs.uk/data-and-information/publications/statistical/health-survey-for-england",
        detail: "Primary official obesity and health-status survey route.",
      },
    ]),
    liveGuide("health", "mental-health", "Mental Health", "Detentions and mental health service inequalities.", "/health"),
    sourceGuide("health", "maternal-health", "Maternal Health", "Maternal mortality and maternity outcomes.", "Source-backed for now. The strongest route is MBRRACE-UK and related maternity surveillance.", [
      {
        title: "MBRRACE-UK reports",
        publisher: "MBRRACE-UK",
        url: "https://www.npeu.ox.ac.uk/mbrrace-uk/reports",
        detail: "UK maternal mortality surveillance with ethnicity disparities.",
      },
    ]),
    sourceGuide("health", "hiv-aids", "HIV & AIDS", "Diagnosis and care outcomes.", "Source-backed for now via UKHSA surveillance collections.", [
      {
        title: "HIV surveillance data and management",
        publisher: "UK Health Security Agency",
        url: "https://www.gov.uk/government/collections/hiv-surveillance-data-and-management",
        detail: "Official surveillance collection for HIV diagnoses and care.",
      },
    ]),
    sourceGuide("health", "covid-19", "COVID-19", "COVID-19 mortality and vaccination disparities.", "Source-backed for now via ONS and UKHSA COVID-19 analysis pages.", [
      {
        title: "Conditions and diseases analysis",
        publisher: "Office for National Statistics",
        url: "https://www.ons.gov.uk/peoplepopulationandcommunity/healthandsocialcare/conditionsanddiseases",
        detail: "Official health conditions hub covering COVID-related ethnicity analysis.",
      },
    ]),
  ],
  "culture-geography": [
    sourceGuide("culture-geography", "politics", "Politics", "Political representation and elected office.", "Source-backed, but with a major official-data gap. The UK does not maintain a full official machine-readable ethnicity register for elected representatives.", [], [
      "There is no single official dataset of MPs and councillors by ethnicity.",
    ]),
    sourceGuide("culture-geography", "religion", "Religion", "Religious affiliation by ethnicity.", "Source-backed for now, mainly via Census 2021 religion tables.", [
      {
        title: "Census 2021",
        publisher: "Office for National Statistics",
        url: "https://www.ons.gov.uk/census",
        detail: "Primary source for religion by ethnicity in England and Wales.",
      },
    ]),
    sourceGuide("culture-geography", "heritage-migration", "Heritage & Migration", "Country of birth, heritage, and migration patterns.", "Source-backed for now via Census 2021 and ONS migration releases.", [
      {
        title: "Long-term international migration",
        publisher: "Office for National Statistics",
        url: "https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/internationalmigration",
        detail: "Official migration release hub for long-run movement and population change.",
      },
    ]),
    sourceGuide("culture-geography", "crime", "Crime", "Crime exposure and justice-system contact.", "Source-backed for now via official crime and justice collections.", [
      {
        title: "Crime, justice and the law",
        publisher: "Race Disparity Unit / Cabinet Office",
        url: "https://www.ethnicity-facts-figures.service.gov.uk/crime-justice-and-the-law/",
        detail: "Official hub bringing together crime and justice disparities data.",
      },
    ]),
    sourceGuide("culture-geography", "incarceration", "Incarceration", "Prison population and custodial disparities.", "Source-backed for now via Ministry of Justice prison and offender statistics.", [
      {
        title: "Offender management statistics quarterly",
        publisher: "Ministry of Justice",
        url: "https://www.gov.uk/government/collections/offender-management-statistics-quarterly",
        detail: "Official prison and probation collection.",
      },
    ]),
    liveGuide("culture-geography", "stop-search", "Stop & Search", "Police stop and search rates and legislation splits.", "/culture-geography"),
  ],
};

export function getTopicGuides(category: SiteCategory) {
  return TOPIC_GUIDES[category] ?? [];
}

export function getTopicGuide(category: SiteCategory, slug: string) {
  return getTopicGuides(category).find((guide) => guide.slug === slug) ?? null;
}

export function getCategoryTitle(category: SiteCategory) {
  return CATEGORIES.find((item) => item.slug === category)?.title ?? category;
}

export function getCategoryRoute(category: SiteCategory) {
  return `/${category}`;
}

function liveGuide(
  category: SiteCategory,
  slug: string,
  title: string,
  description: string,
  liveRoute: string
): TopicGuide {
  return {
    category,
    slug,
    title,
    description,
    status: "live",
    summary:
      "This topic already has live data in the site. Use the linked section below for the current figures, caveats, and source metadata.",
    liveRoute,
  };
}

function sourceGuide(
  category: SiteCategory,
  slug: string,
  title: string,
  description: string,
  summary: string,
  sources: TopicSource[],
  caveats?: string[]
): TopicGuide {
  return {
    category,
    slug,
    title,
    description,
    status: "source-backed",
    summary,
    sources,
    caveats,
  };
}
