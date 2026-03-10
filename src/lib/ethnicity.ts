import type {
  BlackEthnicAggregate,
  BlackEthnicGroup,
  EthnicGroup,
} from "./types";

export const CORE_BLACK_GROUPS = [
  "black_african",
  "black_caribbean",
  "other_black",
] as const satisfies readonly BlackEthnicGroup[];

export const TRACKED_BLACK_GROUPS = [
  "black_african",
  "black_caribbean",
  "other_black",
  "mixed_white_black_caribbean",
  "mixed_white_black_african",
] as const satisfies readonly BlackEthnicGroup[];

export const ETHNICITY_LABELS: Record<
  BlackEthnicGroup | BlackEthnicAggregate | "all_ethnicities",
  string
> = {
  black_african: "Black African",
  black_caribbean: "Black Caribbean",
  other_black: "Other Black",
  mixed_white_black_caribbean: "White and Black Caribbean",
  mixed_white_black_african: "White and Black African",
  all_black: "All Black",
  all_black_including_mixed: "All Black incl. mixed",
  all_ethnicities: "All ethnicities",
};

export const ETHNICITY_SHORT_LABELS: Record<
  BlackEthnicGroup | BlackEthnicAggregate | "all_ethnicities",
  string
> = {
  black_african: "African",
  black_caribbean: "Caribbean",
  other_black: "Other Black",
  mixed_white_black_caribbean: "White + Black Caribbean",
  mixed_white_black_african: "White + Black African",
  all_black: "All Black",
  all_black_including_mixed: "All incl. mixed",
  all_ethnicities: "All ethnicities",
};

export const ETHNIC_BREAKDOWN = TRACKED_BLACK_GROUPS.map((key) => ({
  key,
  label: ETHNICITY_LABELS[key],
}));

export function getEthnicityLabel(group: EthnicGroup): string {
  return ETHNICITY_LABELS[group];
}

export function getEthnicityShortLabel(group: EthnicGroup): string {
  return ETHNICITY_SHORT_LABELS[group];
}
