import type { DataPoint } from "./types";

// =============================================================================
// Formatting Helpers
// =============================================================================

const enGB = "en-GB";

/** Format a number with thousands separators: 2409275 → "2,409,275" */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat(enGB).format(value);
}

/** Format as currency: 28700 → "£28,700" */
export function formatCurrency(value: number, decimals = 0): string {
  return new Intl.NumberFormat(enGB, {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: decimals,
  }).format(value);
}

/** Format as percentage: 65.8 → "65.8%" (input is already a percentage, not a fraction) */
export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/** Format a rate: 4.2 per 1,000 → "4.2 per 1,000" */
export function formatRate(value: number, per: number): string {
  return `${value.toFixed(1)} per ${formatNumber(per)}`;
}

/**
 * Format a DataPoint for display, using the pre-formatted value if available,
 * otherwise formatting based on the unit.
 */
export function formatDataPoint(point: DataPoint): string {
  if (point.suppressed) return "[suppressed]";
  if (point.formatted) return point.formatted;

  switch (point.unit) {
    case "count":
      return formatNumber(point.value);
    case "percentage":
      return formatPercent(point.value);
    case "rate_per_1000":
      return formatRate(point.value, 1_000);
    case "rate_per_100000":
      return formatRate(point.value, 100_000);
    case "gbp":
      return formatCurrency(point.value);
    case "years":
      return `${point.value.toFixed(1)} years`;
    case "index":
      return point.value.toFixed(1);
    default:
      return String(point.value);
  }
}

/** Format a confidence interval: "95% CI: 62.1 – 69.5" */
export function formatConfidenceInterval(point: DataPoint): string | null {
  if (!point.confidence) return null;
  const { lower, upper, level } = point.confidence;
  return `${level}% CI: ${lower.toFixed(1)} – ${upper.toFixed(1)}`;
}
