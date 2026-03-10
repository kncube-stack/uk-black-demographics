import { z } from "zod";

// =============================================================================
// Zod Schemas — Runtime validation for all data files
// =============================================================================
// Every JSON file in data/fetched/ and data/manual/ is validated against these.
// Validation runs: pre-commit hook, GitHub Actions CI, and build step.
// =============================================================================

const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;

// -- Enums -------------------------------------------------------------------

export const EthnicGroupSchema = z.enum([
  "black_african",
  "black_caribbean",
  "other_black",
  "mixed_white_black_caribbean",
  "mixed_white_black_african",
  "all_black",
  "all_black_including_mixed",
  "all_ethnicities",
]);

export const GeographyLevelSchema = z.enum([
  "national",
  "regional",
  "local_authority",
  "msoa",
  "lsoa",
]);

export const DataUnitSchema = z.enum([
  "count",
  "percentage",
  "rate_per_1000",
  "rate_per_100000",
  "gbp",
  "index",
  "years",
]);

export const DataQualityFlagSchema = z.enum([
  "national_statistic",
  "official_statistic",
  "experimental_statistic",
  "management_information",
  "manual_transcription",
  "suppressed",
  "provisional",
  "revised",
]);

export const SiteCategorySchema = z.enum([
  "population",
  "households",
  "economics",
  "education",
  "health",
  "culture-geography",
]);

export const FetchMethodSchema = z.enum([
  "api_automated",
  "csv_download",
  "manual_transcription",
]);

export const SexSchema = z.enum(["male", "female", "all"]);

// -- Compound Schemas --------------------------------------------------------

export const GeographyUnitSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  level: GeographyLevelSchema,
});

export const ConfidenceIntervalSchema = z.object({
  lower: z.number(),
  upper: z.number(),
  level: z.number().min(0).max(100),
});

export const DataPointSchema = z.object({
  value: z.number(),
  formatted: z.string().optional(),
  unit: DataUnitSchema,
  confidence: ConfidenceIntervalSchema.optional(),
  suppressed: z.boolean().optional(),
  provisional: z.boolean().optional(),
});

export const DataObservationSchema = z.object({
  ethnicGroup: EthnicGroupSchema,
  geography: GeographyUnitSchema,
  timePeriod: z.string().min(1),
  sex: SexSchema.optional(),
  ageGroup: z.string().optional(),
  category: z.string().optional(),
  attributes: z.record(z.string(), z.string()).optional(),
  value: DataPointSchema,
});

export const SourceMetadataSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  publisher: z.string().min(1),
  url: z.string().url(),
  apiEndpoint: z.string().url().optional(),
  datePublished: z.string().regex(isoDateRegex, "Must be YYYY-MM-DD format"),
  dateAccessed: z.string().regex(isoDateRegex, "Must be YYYY-MM-DD format"),
  referenceDate: z.string().min(1),
  referencePeriod: z.string().optional(),
  geographicCoverage: z.string().min(1),
  methodology: z.string().min(1),
  qualityFlags: z.array(DataQualityFlagSchema).min(1),
  caveats: z.array(z.string()).optional(),
  license: z.string().min(1),
  fetchMethod: FetchMethodSchema,
});

export const DatasetSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  siteCategory: SiteCategorySchema,
  siteSubcategory: z.string().min(1),
  metadata: SourceMetadataSchema,
  dimensions: z.array(z.string()).min(1),
  observations: z.array(DataObservationSchema).min(1),
});

// -- Type exports from schemas -----------------------------------------------

export type DatasetInput = z.infer<typeof DatasetSchema>;
export type SourceMetadataInput = z.infer<typeof SourceMetadataSchema>;
export type DataObservationInput = z.infer<typeof DataObservationSchema>;
