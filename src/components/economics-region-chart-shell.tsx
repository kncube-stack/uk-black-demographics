"use client";

import dynamic from "next/dynamic";
import type { EconomicsRegionRow } from "@/lib/economics-summary";

const EconomicsRegionChart = dynamic(
  () =>
    import("@/components/economics-region-chart").then(
      (module) => module.EconomicsRegionChart
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[420px] min-w-0 w-full rounded-[24px] bg-[rgba(54,91,69,0.06)]" />
    ),
  }
);

type Props = {
  data: EconomicsRegionRow[];
};

export function EconomicsRegionChartShell({ data }: Props) {
  return <EconomicsRegionChart data={data} />;
}
