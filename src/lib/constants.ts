import type { BlackEthnicGroup, EthnicGroup, SiteCategory } from "./types";

// =============================================================================
// Constants — Colours, category definitions, and site-wide configuration
// =============================================================================

// -- Ethnicity Colour Palette ------------------------------------------------

/** Primary palette for charts — distinguishable, professional */
export const ETHNICITY_COLORS: Record<BlackEthnicGroup, string> = {
  black_african: "#1B4332",
  black_caribbean: "#2D6A4F",
  other_black: "#40916C",
  mixed_white_black_caribbean: "#52B788",
  mixed_white_black_african: "#74C69D",
};

export const ETHNICITY_SERIES_COLORS: Record<EthnicGroup, string> = {
  ...ETHNICITY_COLORS,
  all_black: "#173022",
  all_black_including_mixed: "#7A7F37",
  all_ethnicities: "#7A8071",
};

/** High-contrast palette for accessibility / colorblind mode */
export const ETHNICITY_COLORS_ACCESSIBLE: Record<BlackEthnicGroup, string> = {
  black_african: "#003F5C",
  black_caribbean: "#BC5090",
  other_black: "#FF6361",
  mixed_white_black_caribbean: "#FFA600",
  mixed_white_black_african: "#58508D",
};

// -- Category Definitions ----------------------------------------------------

export interface CategoryDefinition {
  slug: SiteCategory;
  title: string;
  description: string;
  icon: string; // Emoji placeholder — replace with icons later
  subcategories: {
    slug: string;
    title: string;
    description: string;
  }[];
}

export const CATEGORIES: CategoryDefinition[] = [
  {
    slug: "population",
    title: "Population",
    description:
      "Total Black population, regional distribution, demographics by age and sex.",
    icon: "P",
    subcategories: [
      { slug: "total", title: "Total Population", description: "Total Black population of England and Wales" },
      { slug: "by-region", title: "By Region", description: "Black population across the 9 English regions and Wales" },
      { slug: "by-local-authority", title: "By Local Authority", description: "Black population in every local authority district" },
      { slug: "male", title: "Male", description: "Black male population and age distribution" },
      { slug: "female", title: "Female", description: "Black female population and age distribution" },
      { slug: "age-distribution", title: "Age Distribution", description: "Age structure of the Black population" },
    ],
  },
  {
    slug: "households",
    title: "Households",
    description:
      "Household income, marriage, housing tenure, wealth, and poverty.",
    icon: "H",
    subcategories: [
      { slug: "income", title: "Income", description: "Household income levels by ethnicity" },
      { slug: "marriage", title: "Marriage", description: "Marital and civil partnership status" },
      { slug: "housing", title: "Housing", description: "Home ownership, renting, and overcrowding" },
      { slug: "wealth", title: "Wealth", description: "Household wealth and assets" },
      { slug: "poverty", title: "Poverty", description: "Low income and material deprivation" },
    ],
  },
  {
    slug: "economics",
    title: "Economics",
    description:
      "Employment rates, unemployment, occupations, and business ownership.",
    icon: "E",
    subcategories: [
      { slug: "employment", title: "Employment", description: "Employment rates and occupational breakdown" },
      { slug: "unemployment", title: "Unemployment", description: "Unemployment and economic inactivity rates" },
      { slug: "businesses", title: "Businesses", description: "Self-employment and business ownership" },
    ],
  },
  {
    slug: "education",
    title: "Education",
    description:
      "Qualifications, school attainment, university access, and exclusions.",
    icon: "Ed",
    subcategories: [
      { slug: "attainment", title: "Qualifications", description: "Highest level of qualification by ethnicity" },
      { slug: "gcse-a-level", title: "GCSE & A-Level", description: "School-level exam results by ethnicity" },
      { slug: "university", title: "University", description: "Higher education access and the degree awarding gap" },
      { slug: "exclusions", title: "Exclusions", description: "School exclusions and suspensions" },
    ],
  },
  {
    slug: "health",
    title: "Health",
    description:
      "Life expectancy, obesity, mental health, maternal health, HIV, and COVID-19.",
    icon: "He",
    subcategories: [
      { slug: "life-expectancy", title: "Life Expectancy", description: "Health status and life expectancy" },
      { slug: "obesity", title: "Obesity", description: "Adult and child obesity rates" },
      { slug: "mental-health", title: "Mental Health", description: "Mental Health Act detentions and services" },
      { slug: "maternal-health", title: "Maternal Health", description: "Maternal mortality disparities" },
      { slug: "hiv-aids", title: "HIV & AIDS", description: "HIV diagnoses and care by ethnicity" },
      { slug: "covid-19", title: "COVID-19", description: "COVID-19 mortality and vaccination disparities" },
    ],
  },
  {
    slug: "culture-geography",
    title: "Culture & Geography",
    description:
      "Political representation, religion, heritage, migration, crime, and policing.",
    icon: "C",
    subcategories: [
      { slug: "politics", title: "Politics", description: "Black political representation" },
      { slug: "religion", title: "Religion", description: "Religious affiliation by ethnicity" },
      { slug: "heritage-migration", title: "Heritage & Migration", description: "African and Caribbean heritage, migration patterns" },
      { slug: "crime", title: "Crime", description: "Crime victimisation and offending by ethnicity" },
      { slug: "incarceration", title: "Incarceration", description: "Prison population by ethnicity" },
      { slug: "stop-search", title: "Stop & Search", description: "Stop and search rates and disproportionality" },
    ],
  },
];

// -- Formatting --------------------------------------------------------------

export const NUMBER_FORMAT = new Intl.NumberFormat("en-GB");
export const CURRENCY_FORMAT = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});
export const PERCENT_FORMAT = new Intl.NumberFormat("en-GB", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

// -- Site Metadata -----------------------------------------------------------

export const SITE_TITLE = "UK Black Demographics";
export const SITE_DESCRIPTION =
  "Official statistics on Black British populations — population, income, education, health, and more.";
export const SITE_URL = "https://ukblackdemographics.com"; // Placeholder
