"use client";

import dynamic from "next/dynamic";
import type { ObesityData } from "@/lib/health-obesity-summary";
import { DataExportButtons } from "./data-export-buttons";

const HealthObesityChart = dynamic(
  () =>
    import("@/components/health-obesity-chart").then(
      (module) => module.HealthObesityChart
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[280px] min-w-0 w-full rounded-[24px] bg-[rgba(54,91,69,0.06)]" />
    ),
  }
);

type Props = {
  data: ObesityData;
};

export function HealthObesityChartShell({ data }: Props) {
  return (
    <div className="space-y-4">
      <HealthObesityChart data={data} />
      <div className="flex justify-end">
        <DataExportButtons
          data={[
            { group: "Black", rate: data.blackObesityRate },
            { group: "All", rate: data.allObesityRate },
          ]}
          filename="obesity-rates"
        />
      </div>
    </div>
  );
}
