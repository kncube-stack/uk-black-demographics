import Papa from "papaparse";
import { fetchWithRetry } from "./api-client";

export type CsvRow = Record<string, string>;

export function parseCsv(csv: string, label: string): CsvRow[] {
  const parsed = Papa.parse<CsvRow>(csv, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (value) => value.trim(),
  });

  if (parsed.errors.length) {
    const [firstError] = parsed.errors;
    throw new Error(`Failed to parse ${label}: ${firstError?.message ?? "unknown error"}`);
  }

  return parsed.data;
}

export function parseNumber(value: string | undefined): number | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed || ["NA", "N/A", "NULL", "?"].includes(trimmed.toUpperCase())) {
    return null;
  }

  const numericValue = Number(trimmed.replace(/,/g, ""));
  return Number.isFinite(numericValue) ? numericValue : null;
}

export async function fetchLastModifiedDate(url: string): Promise<string> {
  const response = await fetchWithRetry(url, {
    headers: {
      Accept: "text/html,application/xhtml+xml,*/*",
    },
  });
  const lastModified = response.headers.get("last-modified");

  if (!lastModified) {
    return new Date().toISOString().slice(0, 10);
  }

  return new Date(lastModified).toISOString().slice(0, 10);
}

export function getLatestTimePeriod(values: string[]): string {
  return [...new Set(values)].sort(compareTimePeriods).at(-1) ?? "";
}

export function compareTimePeriods(left: string, right: string): number {
  return extractTimeSortValue(left) - extractTimeSortValue(right);
}

function extractTimeSortValue(value: string): number {
  const matches = Array.from(value.matchAll(/\d{4}/g), (match) =>
    Number(match[0])
  );

  return matches.at(-1) ?? 0;
}

export function normaliseLabel(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}
