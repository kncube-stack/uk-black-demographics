"use client";

import dynamic from "next/dynamic";
import type { DegreeResultRow } from "@/lib/education-university-summary";

const EducationDegreeResultsChart = dynamic(
  () =>
    import("@/components/education-degree-results-chart").then(
      (module) => module.EducationDegreeResultsChart
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[320px] min-w-0 w-full rounded-[24px] bg-[rgba(54,91,69,0.06)]" />
    ),
  }
);

type Props = {
  data: DegreeResultRow[];
};

export function EducationDegreeResultsChartShell({ data }: Props) {
  return <EducationDegreeResultsChart data={data} />;
}
