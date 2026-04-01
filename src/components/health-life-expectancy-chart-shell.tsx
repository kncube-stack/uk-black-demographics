"use client";

import dynamic from "next/dynamic";
import type { LifeExpectancyRow } from "@/lib/health-life-expectancy-summary";
import { DataExportButtons } from "./data-export-buttons";

const HealthLifeExpectancyChart = dynamic(
  () =>
    import("@/components/health-life-expectancy-chart").then(
      (module) => module.HealthLifeExpectancyChart
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[280px] min-w-0 w-full rounded-[24px] bg-[rgba(54,91,69,0.06)]" />
    ),
  }
);

type Props = {
  data: LifeExpectancyRow[];
};

export function HealthLifeExpectancyChartShell({ data }: Props) {
  return (
    <div className="space-y-4">
      <HealthLifeExpectancyChart data={data} />
      <div className="flex justify-end">
        <DataExportButtons data={data} filename="life-expectancy" />
      </div>
    </div>
  );
}
