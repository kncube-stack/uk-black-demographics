"use client";

import dynamic from "next/dynamic";
import { DataExportButtons } from "./data-export-buttons";
import type { QualificationRow } from "@/lib/education-attainment-summary";

const EducationQualificationsChart = dynamic(
  () =>
    import("@/components/education-qualifications-chart").then(
      (module) => module.EducationQualificationsChart,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[420px] min-w-0 w-full rounded-[24px] bg-[rgba(54,91,69,0.06)]" />
    ),
  },
);

type Props = {
  data: QualificationRow[];
};

export function EducationQualificationsChartShell({ data }: Props) {
  return (
    <div className="space-y-4">
      <EducationQualificationsChart data={data} />
      <div className="flex justify-end">
        <DataExportButtons
          data={data}
          filename="education-qualifications"
        />
      </div>
    </div>
  );
}
