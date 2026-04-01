"use client";

import dynamic from "next/dynamic";
import { DataExportButtons } from "./data-export-buttons";
import type { ALevelRow } from "@/lib/education-attainment-summary";

const EducationALevelChart = dynamic(
  () =>
    import("@/components/education-alevel-chart").then(
      (module) => module.EducationALevelChart,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[360px] min-w-0 w-full rounded-[24px] bg-[rgba(54,91,69,0.06)]" />
    ),
  },
);

type Props = {
  data: ALevelRow[];
};

export function EducationALevelChartShell({ data }: Props) {
  return (
    <div className="space-y-4">
      <EducationALevelChart data={data} />
      <div className="flex justify-end">
        <DataExportButtons
          data={data}
          filename="education-alevel-achievement"
        />
      </div>
    </div>
  );
}
