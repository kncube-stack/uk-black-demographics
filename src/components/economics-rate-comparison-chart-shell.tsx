"use client";

import dynamic from "next/dynamic";
import type { EconomicsComparisonRow } from "@/lib/economics-summary";

const EconomicsRateComparisonChart = dynamic(
  () =>
    import("@/components/economics-rate-comparison-chart").then(
      (module) => module.EconomicsRateComparisonChart
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[360px] min-w-0 w-full rounded-[24px] bg-[rgba(54,91,69,0.06)]" />
    ),
  }
);

type Props = {
  data: EconomicsComparisonRow[];
};

export function EconomicsRateComparisonChartShell({ data }: Props) {
  return <EconomicsRateComparisonChart data={data} />;
}
