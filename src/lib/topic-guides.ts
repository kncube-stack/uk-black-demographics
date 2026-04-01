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
    liveGuide("households", "income", "Income", "Low-income household rates by ethnicity.", "/households"),
    liveGuide("households", "marriage", "Marriage", "Marital and civil partnership status by ethnicity.", "/households"),
    liveGuide("households", "housing", "Housing", "Home ownership and housing access.", "/households"),
    liveGuide("households", "wealth-and-class", "Wealth & Class", "Household wealth and socioeconomic distribution.", "/households"),
    liveGuide("households", "poverty", "Poverty", "Low income and deprivation.", "/households"),
  ],
  economics: [
    liveGuide("economics", "employment", "Employment", "Employment rates and occupational profile.", "/economics"),
    liveGuide("economics", "unemployment", "Unemployment", "Unemployment and inactivity rates.", "/economics"),
    snapshotGuide(
      "economics",
      "businesses",
      "Businesses",
      "Self-employment and Black business ownership proxies.",
      "This topic uses survey-based estimates of minority ethnic-led businesses from the Small Business Survey. No Black-specific dataset exists.",
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
        "These figures cover all minority ethnic groups combined, not Black-specific.",
      ]
    ),
  ],
  education: [
    liveGuide("education", "attainment", "Qualifications", "Highest qualification levels by ethnicity.", "/education"),
    liveGuide("education", "gcse-a-level", "GCSE & A-Level", "School results and attainment gaps.", "/education"),
    liveGuide("education", "university", "University", "Applications, access, attainment, and outcomes in higher education.", "/education"),
    liveGuide("education", "exclusions", "Exclusions", "Suspensions and permanent exclusions.", "/education"),
  ],
  health: [
    liveGuide("health", "life-expectancy", "Life Expectancy", "Life expectancy and mortality by ethnicity.", "/health"),
    liveGuide("health", "obesity", "Obesity", "Adult and child obesity rates by ethnicity.", "/health"),
    liveGuide("health", "mental-health", "Mental Health", "Detentions and mental health service inequalities.", "/health"),
    liveGuide("health", "maternal-health", "Maternal Health", "Maternal mortality and maternity outcomes.", "/health"),
    liveGuide("health", "hiv-aids", "HIV & AIDS", "Diagnosis and care outcomes.", "/health"),
    liveGuide("health", "covid-19", "COVID-19", "COVID-19 mortality and vaccination disparities.", "/health"),
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
    liveGuide("culture-geography", "religion", "Religion", "Religious affiliation by ethnicity.", "/culture-geography"),
    liveGuide("culture-geography", "heritage-migration", "Heritage & Migration", "Country of birth, heritage, and migration patterns.", "/culture-geography"),
    liveGuide("culture-geography", "crime", "Crime", "Crime exposure and justice-system contact.", "/culture-geography"),
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
