"use client";

import dynamic from "next/dynamic";
import type { StopSearchMetricRow } from "@/lib/culture-summary";
import { DataExportButtons } from "./data-export-buttons";

const CultureStopSearchRateChart = dynamic(
  () =>
    import("@/components/culture-stop-search-rate-chart").then(
      (module) => module.CultureStopSearchRateChart
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[420px] min-w-0 w-full rounded-[24px] bg-[rgba(54,91,69,0.06)]" />
    ),
  }
);

type Props = {
  data: StopSearchMetricRow[];
};

export function CultureStopSearchRateChartShell({ data }: Props) {
  return (
    <div className="space-y-4">
      <CultureStopSearchRateChart data={data} />
      <div className="flex justify-end">
        <DataExportButtons
          data={data}
          filename="stop-search-rates"
        />
      </div>
    </div>
  );
}
