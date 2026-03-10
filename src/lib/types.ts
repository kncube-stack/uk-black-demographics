// =============================================================================
// Core Type System — UK Black Demographics Platform
// =============================================================================
// Every dataset, component, and page depends on these types.
// Changes here ripple everywhere — keep stable.
// =============================================================================

// -----------------------------------------------------------------------------
// Ethnicity
// -----------------------------------------------------------------------------

/** The five Black ethnic subgroups tracked throughout the platform */
export type BlackEthnicGroup =
  | "black_african"
  | "black_caribbean"
  | "other_black"
  | "mixed_white_black_caribbean"
  | "mixed_white_black_african";

/** Aggregation levels */
export type BlackEthnicAggregate =
  | "all_black" // Black African + Black Caribbean + Other Black
  | "all_black_including_mixed"; // All five groups

/** All ethnicity values that can appear in a dataset */
export type EthnicGroup =
  | BlackEthnicGroup
  | BlackEthnicAggregate
  | "all_ethnicities"; // For comparison with total population

// -----------------------------------------------------------------------------
// Geography
// -----------------------------------------------------------------------------

export type GeographyLevel =
  | "national" // England, Wales, England & Wales, Scotland, UK
  | "regional" // 9 English regions + Wales
  | "local_authority" // 331 LAs in England & Wales
  | "msoa"
  | "lsoa";

export interface GeographyUnit {
  /** ONS geography code, e.g. "E92000001" for England */
  code: string;
  /** Human-readable name, e.g. "London" */
  name: string;
  level: GeographyLevel;
}

// -----------------------------------------------------------------------------
// Data Quality
// -----------------------------------------------------------------------------

/** Following Government Statistical Service (GSS) classification */
export type DataQualityFlag =
  | "national_statistic" // Highest: UK Statistics Authority accredited
  | "official_statistic" // Published by a government body
  | "experimental_statistic" // New or evolving methodology
  | "management_information" // Operational data, not formal statistics
  | "manual_transcription" // Manually transcribed from PDF/report
  | "suppressed" // Small number suppression applied by source
  | "provisional" // Subject to revision
  | "revised"; // Updated from a previous release

// -----------------------------------------------------------------------------
// Data Points
// -----------------------------------------------------------------------------

export type DataUnit =
  | "count"
  | "percentage"
  | "rate_per_1000"
  | "rate_per_100000"
  | "gbp" // British pounds
  | "index"
  | "years"; // For life expectancy

export interface ConfidenceInterval {
  lower: number;
  upper: number;
  /** Confidence level, e.g. 95 for 95% CI */
  level: number;
}

/** A single data value with its context */
export interface DataPoint {
  value: number;
  /** Pre-formatted display string, e.g. "2,409,275" or "£28,700" */
  formatted?: string;
  unit: DataUnit;
  confidence?: ConfidenceInterval;
  /** True if the source suppressed this value for statistical disclosure */
  suppressed?: boolean;
  /** True if this value is provisional and may be revised */
  provisional?: boolean;
}

// -----------------------------------------------------------------------------
// Observations
// -----------------------------------------------------------------------------

export type Sex = "male" | "female" | "all";

/** A single row/observation in a dataset */
export interface DataObservation {
  ethnicGroup: EthnicGroup;
  geography: GeographyUnit;
  /** Time period: "2021", "2023-Q1", "2022/23", "2019-2021" */
  timePeriod: string;
  sex?: Sex;
  /** Age group: "0-4", "16-24", "65+", "all", etc. */
  ageGroup?: string;
  /** Dataset-specific subcategory, e.g. "owner_occupied", "christianity", "grade_5_plus" */
  category?: string;
  /** Additional dataset-specific dimensions, e.g. { education_phase, fsm, measure } */
  attributes?: Record<string, string>;
  value: DataPoint;
}

// -----------------------------------------------------------------------------
// Source Metadata
// -----------------------------------------------------------------------------

export type FetchMethod = "api_automated" | "csv_download" | "manual_transcription";

/** Attached to every dataset — provides full provenance */
export interface SourceMetadata {
  /** Unique source identifier, e.g. "nomis-ts021" */
  id: string;
  /** Full source name, e.g. "Census 2021: Ethnic Group (TS021)" */
  name: string;
  /** Publishing body, e.g. "Office for National Statistics" */
  publisher: string;
  /** Direct URL to the source page or dataset */
  url: string;
  /** API endpoint used to fetch this data (if automated) */
  apiEndpoint?: string;
  /** When the source organisation published this data (ISO 8601) */
  datePublished: string;
  /** When we last fetched or entered this data (ISO 8601) */
  dateAccessed: string;
  /** What point in time the data represents, e.g. "2021-03-21" for Census Day */
  referenceDate: string;
  /** Period covered, e.g. "2021", "2020-Q4", "April 2016 to March 2018" */
  referencePeriod?: string;
  /** Geographic scope, e.g. "England and Wales" */
  geographicCoverage: string;
  /** Methodology notes (markdown) */
  methodology: string;
  qualityFlags: DataQualityFlag[];
  /** Specific caveats for this dataset */
  caveats?: string[];
  /** Data license, e.g. "Open Government Licence v3.0" */
  license: string;
  /** How this data was obtained */
  fetchMethod: FetchMethod;
}

// -----------------------------------------------------------------------------
// Dataset
// -----------------------------------------------------------------------------

export type SiteCategory =
  | "population"
  | "households"
  | "economics"
  | "education"
  | "health"
  | "culture-geography";

/** A complete dataset — the fundamental unit of data in the platform */
export interface Dataset {
  /** Unique identifier, e.g. "census-2021-population-by-ethnicity" */
  id: string;
  /** Display title, e.g. "Population by Ethnic Group, Census 2021" */
  title: string;
  /** Brief description of what this dataset shows */
  description: string;
  /** Which site section this belongs to */
  siteCategory: SiteCategory;
  /** Subcategory slug, e.g. "total", "by-region", "income" */
  siteSubcategory: string;
  /** Full source provenance */
  metadata: SourceMetadata;
  /** Which dimensions vary in this dataset */
  dimensions: string[];
  /** The actual data */
  observations: DataObservation[];
}

// -----------------------------------------------------------------------------
// Derived / Summary Types (for homepage and category pages)
// -----------------------------------------------------------------------------

export interface HeadlineStat {
  label: string;
  sublabel?: string;
  value: DataPoint;
  source: Pick<SourceMetadata, "name" | "publisher" | "referenceDate" | "url">;
  trend?: {
    direction: "up" | "down" | "stable";
    /** e.g. "+38% since 2011" */
    description: string;
  };
}

export interface CategoryOverview {
  category: SiteCategory;
  title: string;
  description: string;
  /** 3-5 headline stats for the category card */
  headlines: HeadlineStat[];
  subcategories: {
    slug: string;
    title: string;
    description: string;
  }[];
}

// -----------------------------------------------------------------------------
// Page Component Props
// -----------------------------------------------------------------------------

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export type ChartType = "bar" | "stacked-bar" | "line" | "pie" | "regional-map";

export interface ChartConfig {
  type: ChartType;
  /** Which dataset to visualise */
  datasetId: string;
  /** X-axis label or dimension */
  xAxis?: string;
  /** Y-axis label */
  yAxis?: string;
  /** Title above the chart */
  title?: string;
}

export interface SubcategoryPageConfig {
  title: string;
  description: string;
  breadcrumbs: BreadcrumbItem[];
  datasets: Dataset[];
  primaryChart: ChartConfig;
  secondaryChart?: ChartConfig;
  filters?: {
    showEthnicitySelector?: boolean;
    showGeographySelector?: boolean;
    showTimePeriodSelector?: boolean;
  };
  /** Key takeaways displayed beside the primary chart */
  keyFindings?: string[];
}
