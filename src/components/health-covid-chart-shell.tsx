"use client";

import dynamic from "next/dynamic";
import type { CovidMortalityRow } from "@/lib/health-covid-summary";
import { DataExportButtons } from "./data-export-buttons";

const HealthCovidChart = dynamic(
  () =>
    import("@/components/health-covid-chart").then(
      (module) => module.HealthCovidChart
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[280px] min-w-0 w-full rounded-[24px] bg-[rgba(54,91,69,0.06)]" />
    ),
  }
);

type Props = {
  data: CovidMortalityRow[];
};

export function HealthCovidChartShell({ data }: Props) {
  return (
    <div className="space-y-4">
      <HealthCovidChart data={data} />
      <div className="flex justify-end">
        <DataExportButtons data={data} filename="covid-19-mortality" />
      </div>
    </div>
  );
}
