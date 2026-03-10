"use client";

import dynamic from "next/dynamic";
import type { GeographyPopulationSummary } from "@/lib/population-summary";

const PopulationRegionChart = dynamic(
  () =>
    import("@/components/population-region-chart").then(
      (module) => module.PopulationRegionChart
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[420px] min-w-0 w-full rounded-[24px] bg-[rgba(54,91,69,0.06)]" />
    ),
  }
);

type Props = {
  data: GeographyPopulationSummary[];
};

export function PopulationRegionChartShell({ data }: Props) {
  return <PopulationRegionChart data={data} />;
}
