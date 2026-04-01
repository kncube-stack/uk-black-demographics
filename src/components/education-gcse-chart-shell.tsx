"use client";

import dynamic from "next/dynamic";
import { DataExportButtons } from "./data-export-buttons";
import type { GcseRow } from "@/lib/education-attainment-summary";

const EducationGcseChart = dynamic(
  () =>
    import("@/components/education-gcse-chart").then(
      (module) => module.EducationGcseChart,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[360px] min-w-0 w-full rounded-[24px] bg-[rgba(54,91,69,0.06)]" />
    ),
  },
);

type Props = {
  data: GcseRow[];
};

export function EducationGcseChartShell({ data }: Props) {
  return (
    <div className="space-y-4">
      <EducationGcseChart data={data} />
      <div className="flex justify-end">
        <DataExportButtons
          data={data}
          filename="education-gcse-attainment"
        />
      </div>
    </div>
  );
}
