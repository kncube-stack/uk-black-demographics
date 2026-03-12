import { CATEGORIES } from "./constants";
import type { SiteCategory } from "./types";

export type TopicStatus = "live" | "snapshot" | "coming-next";

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
  targetDate?: string;
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
    snapshotGuide(
      "households",
      "income",
      "Income",
      "Low-income household rates by ethnicity.",
      "This topic now opens with an official low-income snapshot rather than a source placeholder.",
      [
        {
          title: "People in low-income households",
          publisher: "Race Disparity Unit / Cabinet Office",
          url: "https://www.ethnicity-facts-figures.service.gov.uk/work-pay-and-benefits/pay-and-income/people-in-low-income-households/latest/",
          detail: "Official UK low-income series with broad Black-group comparison.",
        },
      ]
    ),
    comingGuide(
      "households",
      "marriage",
      "Marriage",
      "Marital and civil partnership status by ethnicity.",
      "No official annual marriage-registration dataset records ethnicity directly, so this topic needs a survey-based build rather than a clean administrative feed.",
      "Spring 2026",
      [
        {
          title: "Census and APS source base",
          publisher: "Office for National Statistics",
          url: "https://www.ons.gov.uk/census",
          detail: "Census and APS are the practical official routes because registration data does not capture ethnicity.",
        },
      ],
      [
        "There is no official annual marriage-registration dataset by ethnicity in England and Wales.",
      ]
    ),
    liveGuide("households", "housing", "Housing", "Home ownership and housing access.", "/households"),
    snapshotGuide(
      "households",
      "wealth-and-class",
      "Wealth & Class",
      "Household wealth and socioeconomic distribution.",
      "This topic now opens with an official median-wealth snapshot from the ONS Wealth and Assets Survey while a fuller social-mobility build follows.",
      [
        {
          title: "Household wealth by ethnicity",
          publisher: "Office for National Statistics",
          url: "https://www.ons.gov.uk/peoplepopulationandcommunity/personalandhouseholdfinances/incomeandwealth/articles/householdwealthbyethnicitygreatbritain/april2016tomarch2018",
          detail: "The primary official Great Britain wealth analysis by ethnic group.",
        },
      ]
    ),
    snapshotGuide(
      "households",
      "poverty",
      "Poverty",
      "Low income and deprivation.",
      "This topic now opens with the latest official low-income snapshot, with a fuller deprivation build to follow.",
      [
        {
          title: "People in low-income households",
          publisher: "Race Disparity Unit / Cabinet Office",
          url: "https://www.ethnicity-facts-figures.service.gov.uk/work-pay-and-benefits/pay-and-income/people-in-low-income-households/latest/",
          detail: "Official UK low-income series with broad Black-group comparison.",
        },
      ]
    ),
  ],
  economics: [
    liveGuide("economics", "employment", "Employment", "Employment rates and occupational profile.", "/economics"),
    liveGuide("economics", "unemployment", "Unemployment", "Unemployment and inactivity rates.", "/economics"),
    comingGuide(
      "economics",
      "businesses",
      "Businesses",
      "Self-employment and Black business ownership proxies.",
      "There is no official UK register of business owner ethnicity, so this topic needs a survey-and-proxy build rather than a simple government feed.",
      "Spring 2026",
      [
        {
          title: "Small Business Survey reports",
          publisher: "Department for Business and Trade",
          url: "https://www.gov.uk/government/collections/small-business-survey-reports",
          detail: "Survey-based evidence on minority ethnic-led businesses.",
        },
      ],
      [
        "The UK does not maintain an official business register by owner ethnicity.",
      ]
    ),
  ],
  education: [
    snapshotGuide(
      "education",
      "attainment",
      "Qualifications",
      "Highest qualification levels by ethnicity.",
      "This topic now opens with a Census 2021 qualification snapshot instead of a stub page.",
      [
        {
          title: "Census 2021 RM049",
          publisher: "Office for National Statistics",
          url: "https://www.ons.gov.uk/datasets/RM049/editions/2021/versions/1",
          detail: "Highest level of qualification by ethnic group in England and Wales.",
        },
      ]
    ),
    snapshotGuide(
      "education",
      "gcse-a-level",
      "GCSE & A-Level",
      "School results and attainment gaps.",
      "This topic now opens with official GCSE and A-level headline figures and their all-pupils comparators.",
      [
        {
          title: "GCSE results (Attainment 8)",
          publisher: "Race Disparity Unit / Cabinet Office",
          url: "https://www.ethnicity-facts-figures.service.gov.uk/education-skills-and-training/11-to-16-years-old/gcse-results-attainment-8-for-children-aged-14-to-16-key-stage-4/latest/",
          detail: "Official GCSE attainment snapshot with subgroup detail.",
        },
        {
          title: "Students aged 16 to 18 achieving 3 A grades or better at A level",
          publisher: "Race Disparity Unit / Cabinet Office",
          url: "https://www.ethnicity-facts-figures.service.gov.uk/education-skills-and-training/a-levels-apprenticeships-further-education/students-aged-16-to-18-achieving-3-a-grades-or-better-at-a-level/latest/",
          detail: "Official A-level attainment snapshot with subgroup detail.",
        },
      ]
    ),
    snapshotGuide(
      "education",
      "university",
      "University",
      "Applications, access, attainment, and outcomes in higher education.",
      "This topic now opens with entry-rate and degree-outcome snapshots instead of a stub page.",
      [
        {
          title: "Entry rates into higher education",
          publisher: "Race Disparity Unit / Cabinet Office",
          url: "https://www.ethnicity-facts-figures.service.gov.uk/education-skills-and-training/higher-education/entry-rates-into-higher-education/latest/",
          detail: "Official entry-rate series for 18-year-old state school pupils.",
        },
        {
          title: "Undergraduate degree results",
          publisher: "Race Disparity Unit / Cabinet Office",
          url: "https://www.ethnicity-facts-figures.service.gov.uk/education-skills-and-training/higher-education/undergraduate-degree-results/latest/",
          detail: "Official degree classification outcomes by ethnicity.",
        },
      ]
    ),
    liveGuide("education", "exclusions", "Exclusions", "Suspensions and permanent exclusions.", "/education"),
  ],
  health: [
    comingGuide(
      "health",
      "life-expectancy",
      "Life Expectancy",
      "Life expectancy and mortality by ethnicity.",
      "This topic needs a linked-data build because ethnicity is not recorded on death certificates.",
      "Spring 2026",
      [
        {
          title: "Ethnic differences in life expectancy and mortality",
          publisher: "Office for National Statistics",
          url: "https://www.ons.gov.uk/peoplepopulationandcommunity/birthsdeathsandmarriages/lifeexpectancies/articles/ethnicdifferencesinlifeexpectancyandmortalityfromselectedcausesinenglandandwales/2011to2014",
          detail: "The main official linked-data life expectancy source by ethnicity.",
        },
      ],
      [
        "There is no routine death-registration ethnicity field in England and Wales.",
      ]
    ),
    comingGuide(
      "health",
      "obesity",
      "Obesity",
      "Adult and child obesity rates by ethnicity.",
      "This topic is queued for the next health-wave build from Health Survey for England and NHS data releases.",
      "Spring 2026",
      [
        {
          title: "Health Survey for England",
          publisher: "NHS England / NHS Digital",
          url: "https://digital.nhs.uk/data-and-information/publications/statistical/health-survey-for-england",
          detail: "Primary official obesity and health-status survey route.",
        },
      ]
    ),
    liveGuide("health", "mental-health", "Mental Health", "Detentions and mental health service inequalities.", "/health"),
    snapshotGuide(
      "health",
      "maternal-health",
      "Maternal Health",
      "Maternal mortality and maternity outcomes.",
      "This topic now opens with the latest official MBRRACE-UK maternal mortality disparity headline.",
      [
        {
          title: "Maternal Mortality Data Brief",
          publisher: "MBRRACE-UK",
          url: "https://www.npeu.ox.ac.uk/mbrrace-uk/reports",
          detail: "UK maternal mortality surveillance by ethnicity.",
        },
      ]
    ),
    comingGuide(
      "health",
      "hiv-aids",
      "HIV & AIDS",
      "Diagnosis and care outcomes.",
      "This topic is queued for the next health-wave build from UKHSA surveillance tables.",
      "Spring 2026",
      [
        {
          title: "HIV surveillance data and management",
          publisher: "UK Health Security Agency",
          url: "https://www.gov.uk/government/collections/hiv-surveillance-data-and-management",
          detail: "Official surveillance collection for HIV diagnoses and care.",
        },
      ]
    ),
    comingGuide(
      "health",
      "covid-19",
      "COVID-19",
      "COVID-19 mortality and vaccination disparities.",
      "This topic is queued for the next health-wave build from ONS and UKHSA COVID-19 analysis pages.",
      "Spring 2026",
      [
        {
          title: "Conditions and diseases analysis",
          publisher: "Office for National Statistics",
          url: "https://www.ons.gov.uk/peoplepopulationandcommunity/healthandsocialcare/conditionsanddiseases",
          detail: "Official health conditions hub covering COVID-related ethnicity analysis.",
        },
      ]
    ),
  ],
  "culture-geography": [
    snapshotGuide(
      "culture-geography",
      "politics",
      "Politics",
      "Political representation and elected office.",
      "This topic now opens with a parliamentary representation snapshot while the site remains explicit about the lack of a full official Black-specific elected-office dataset.",
      [
        {
          title: "Ethnic Diversity in Politics and Public Life",
          publisher: "House of Commons Library",
          url: "https://commonslibrary.parliament.uk/research-briefings/sn01156/",
          detail: "Parliamentary briefing on ethnic diversity in politics and public life.",
        },
      ],
      [
        "There is no single official dataset of MPs and councillors by ethnicity, let alone one that isolates Black representation cleanly.",
      ]
    ),
    snapshotGuide(
      "culture-geography",
      "religion",
      "Religion",
      "Religious affiliation by ethnicity.",
      "This topic now opens with a Census 2021 religion snapshot for the broad Black population.",
      [
        {
          title: "Census 2021 RM031",
          publisher: "Office for National Statistics",
          url: "https://www.ons.gov.uk/datasets/RM031/editions/2021/versions/1",
          detail: "Religion by ethnic group in England and Wales.",
        },
      ]
    ),
    snapshotGuide(
      "culture-geography",
      "heritage-migration",
      "Heritage & Migration",
      "Country of birth, heritage, and migration patterns.",
      "This topic now opens with a Census 2021 country-of-birth snapshot for the broad Black population.",
      [
        {
          title: "Census 2021 RM010",
          publisher: "Office for National Statistics",
          url: "https://www.ons.gov.uk/datasets/RM010/editions/2021/versions/1",
          detail: "Country of birth by ethnic group in England and Wales.",
        },
      ]
    ),
    snapshotGuide(
      "culture-geography",
      "crime",
      "Crime",
      "Crime exposure and justice-system contact.",
      "This topic now opens with the latest official victimisation snapshot for England and Wales.",
      [
        {
          title: "Crime victims",
          publisher: "Race Disparity Unit / Cabinet Office",
          url: "https://www.ethnicity-facts-figures.service.gov.uk/crime-justice-and-the-law/crime-and-reoffending/crime-victims/latest/",
          detail: "Official crime victimisation snapshot from the CSEW.",
        },
      ]
    ),
    snapshotGuide(
      "culture-geography",
      "incarceration",
      "Incarceration",
      "Prison population and custodial disparities.",
      "This topic now opens with the latest official prison-population disparity snapshot while a fuller prison-statistics build remains in progress.",
      [
        {
          title: "Offender Equalities Annual Report",
          publisher: "HM Prison and Probation Service / Ministry of Justice",
          url: "https://www.gov.uk/government/statistics/hm-prison-and-probation-service-offender-equalities-annual-report-2024-to-2025",
          detail: "Official equality monitoring across the prison population.",
        },
      ]
    ),
    snapshotGuide(
      "culture-geography",
      "segregation",
      "Segregation & Concentration",
      "Neighborhood concentration and deprivation indices.",
      "This topic now opens with an official neighborhood-deprivation snapshot from the Index of Multiple Deprivation while a fuller residential-segregation study follows.",
      [
        {
          title: "People living in deprived neighbourhoods",
          publisher: "Race Disparity Unit / Cabinet Office",
          url: "https://www.ethnicity-facts-figures.service.gov.uk/uk-population-by-ethnicity/demographics/people-living-in-deprived-neighbourhoods/latest/",
          detail: "Official English indices of deprivation by ethnic group.",
        },
      ]
    ),
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
      "This topic already has a full live section with charts, exact figures, source links, and caveats.",
    liveRoute,
  };
}

function snapshotGuide(
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
    status: "snapshot",
    summary,
    sources,
    caveats,
  };
}

function comingGuide(
  category: SiteCategory,
  slug: string,
  title: string,
  description: string,
  summary: string,
  targetDate: string,
  sources: TopicSource[],
  caveats?: string[]
): TopicGuide {
  return {
    category,
    slug,
    title,
    description,
    status: "coming-next",
    summary,
    targetDate,
    sources,
    caveats,
  };
}
