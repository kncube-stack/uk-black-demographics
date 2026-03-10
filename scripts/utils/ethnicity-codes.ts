import type { BlackEthnicGroup, BlackEthnicAggregate } from "@/lib/types";

// =============================================================================
// Ethnicity Code Mappings
// =============================================================================
// Maps between different official coding systems and our canonical codes.
// Each data source (Nomis, DfE, DWP, etc.) uses different identifiers
// for the same ethnic groups. This file is the single source of truth.
// =============================================================================

export interface EthnicityCodeMapping {
  canonical: BlackEthnicGroup;
  label: string;
  shortLabel: string;
  /** Census 2021 (England & Wales) ethnic group classification code */
  census2021Code: string;
  /** Label as it appears in Census 2021 outputs */
  census2021Label: string;
  /** Label as it appears in ONS publications */
  onsLabel: string;
  /** DfE extended ethnicity code used in education statistics */
  dfeCode?: string;
  /** DfE label */
  dfeLabel?: string;
  /** DWP Stat-Xplore dimension value */
  dwpCode?: string;
  /** Nomis API ethnicity parameter value for Census 2021 queries */
  nomisCensus2021Value?: string;
}

export const ETHNICITY_MAPPINGS: EthnicityCodeMapping[] = [
  {
    canonical: "black_african",
    label: "Black African",
    shortLabel: "African",
    census2021Code: "L15",
    census2021Label: "African",
    onsLabel: "Black African",
    dfeCode: "BAFR",
    dfeLabel: "Black African",
    dwpCode: "Black or Black British",
    nomisCensus2021Value: "5",
  },
  {
    canonical: "black_caribbean",
    label: "Black Caribbean",
    shortLabel: "Caribbean",
    census2021Code: "L14",
    census2021Label: "Caribbean",
    onsLabel: "Black Caribbean",
    dfeCode: "BCRB",
    dfeLabel: "Black Caribbean",
    dwpCode: "Black or Black British",
    nomisCensus2021Value: "4",
  },
  {
    canonical: "other_black",
    label: "Other Black",
    shortLabel: "Other Black",
    census2021Code: "L16",
    census2021Label:
      "Any other Black, Black British, or Caribbean background",
    onsLabel: "Other Black",
    dfeCode: "BOTH",
    dfeLabel: "Any other Black background",
    dwpCode: "Black or Black British",
    nomisCensus2021Value: "6",
  },
  {
    canonical: "mixed_white_black_caribbean",
    label: "Mixed White & Black Caribbean",
    shortLabel: "Mixed W&BC",
    census2021Code: "L6",
    census2021Label: "White and Black Caribbean",
    onsLabel: "Mixed White and Black Caribbean",
    dfeCode: "MWBC",
    dfeLabel: "White and Black Caribbean",
    dwpCode: "Mixed or Multiple ethnic groups",
    nomisCensus2021Value: "7",
  },
  {
    canonical: "mixed_white_black_african",
    label: "Mixed White & Black African",
    shortLabel: "Mixed W&BA",
    census2021Code: "L7",
    census2021Label: "White and Black African",
    onsLabel: "Mixed White and Black African",
    dfeCode: "MWBA",
    dfeLabel: "White and Black African",
    dwpCode: "Mixed or Multiple ethnic groups",
    nomisCensus2021Value: "8",
  },
];

// -- Lookup helpers -----------------------------------------------------------

const byCensus2021Code = new Map(
  ETHNICITY_MAPPINGS.map((m) => [m.census2021Code, m])
);
const byCensus2021Label = new Map(
  ETHNICITY_MAPPINGS.map((m) => [m.census2021Label.toLowerCase(), m])
);
const byDfeCode = new Map(
  ETHNICITY_MAPPINGS.filter((m) => m.dfeCode).map((m) => [m.dfeCode!, m])
);
const byCanonical = new Map(
  ETHNICITY_MAPPINGS.map((m) => [m.canonical, m])
);

/** Look up canonical ethnicity from Census 2021 code */
export function fromCensus2021Code(
  code: string
): BlackEthnicGroup | undefined {
  return byCensus2021Code.get(code)?.canonical;
}

/** Look up canonical ethnicity from Census 2021 label (case-insensitive) */
export function fromCensus2021Label(
  label: string
): BlackEthnicGroup | undefined {
  return byCensus2021Label.get(label.toLowerCase())?.canonical;
}

/** Look up canonical ethnicity from DfE code */
export function fromDfeCode(code: string): BlackEthnicGroup | undefined {
  return byDfeCode.get(code)?.canonical;
}

/** Get display label for a canonical ethnicity */
export function getLabel(
  group: BlackEthnicGroup | BlackEthnicAggregate
): string {
  if (group === "all_black") return "All Black";
  if (group === "all_black_including_mixed") return "All Black (incl. Mixed)";
  return byCanonical.get(group as BlackEthnicGroup)?.label ?? group;
}

/** Get short label for charts with limited space */
export function getShortLabel(
  group: BlackEthnicGroup | BlackEthnicAggregate
): string {
  if (group === "all_black") return "All Black";
  if (group === "all_black_including_mixed") return "All (incl. Mixed)";
  return byCanonical.get(group as BlackEthnicGroup)?.shortLabel ?? group;
}

/** The three core Black ethnic groups (excluding Mixed) */
export const CORE_BLACK_GROUPS: BlackEthnicGroup[] = [
  "black_african",
  "black_caribbean",
  "other_black",
];

/** All five tracked groups including Mixed */
export const ALL_BLACK_GROUPS: BlackEthnicGroup[] = [
  "black_african",
  "black_caribbean",
  "other_black",
  "mixed_white_black_caribbean",
  "mixed_white_black_african",
];

/**
 * Check if a Census label refers to a Black ethnic group.
 * Useful when filtering rows from a full Census dataset.
 */
export function isBlackEthnicity(censusLabel: string): boolean {
  return byCensus2021Label.has(censusLabel.toLowerCase());
}
