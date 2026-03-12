"use client";

import dynamic from "next/dynamic";
import { DataExportButtons } from "./data-export-buttons";
import type { HealthTrendRow } from "@/lib/health-summary";

const HealthDetentionTrendChart = dynamic(
  () =>
    import("@/components/health-detention-trend-chart").then(
      (module) => module.HealthDetentionTrendChart
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[380px] min-w-0 w-full rounded-[24px] bg-[rgba(54,91,69,0.06)]" />
    ),
  }
);

type Props = {
  data: HealthTrendRow[];
};

export function HealthDetentionTrendChartShell({ data }: Props) {
  return (
    <div className="space-y-4">
      <HealthDetentionTrendChart data={data} />
      <div className="flex justify-end">
        <DataExportButtons
          data={data}
          filename="mental-health-detention-trend"
        />
      </div>
    </div>
  );
}
