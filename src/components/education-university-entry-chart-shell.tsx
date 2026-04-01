"use client";

import dynamic from "next/dynamic";
import type { UniversityEntryRow } from "@/lib/education-university-summary";

const EducationUniversityEntryChart = dynamic(
  () =>
    import("@/components/education-university-entry-chart").then(
      (module) => module.EducationUniversityEntryChart
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[360px] min-w-0 w-full rounded-[24px] bg-[rgba(54,91,69,0.06)]" />
    ),
  }
);

type Props = {
  data: UniversityEntryRow[];
};

export function EducationUniversityEntryChartShell({ data }: Props) {
  return <EducationUniversityEntryChart data={data} />;
}
