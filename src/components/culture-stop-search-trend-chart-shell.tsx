"use client";

import dynamic from "next/dynamic";
import type { StopSearchTrendRow } from "@/lib/culture-summary";

const CultureStopSearchTrendChart = dynamic(
  () =>
    import("@/components/culture-stop-search-trend-chart").then(
      (module) => module.CultureStopSearchTrendChart
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[380px] min-w-0 w-full rounded-[24px] bg-[rgba(54,91,69,0.06)]" />
    ),
  }
);

type Props = {
  data: StopSearchTrendRow[];
};

export function CultureStopSearchTrendChartShell({ data }: Props) {
  return <CultureStopSearchTrendChart data={data} />;
}
