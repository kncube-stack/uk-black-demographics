"use client";

import dynamic from "next/dynamic";
import type { EducationPhaseRow } from "@/lib/education-summary";

const EducationPhaseChart = dynamic(
  () =>
    import("@/components/education-phase-chart").then(
      (module) => module.EducationPhaseChart
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[360px] min-w-0 w-full rounded-[24px] bg-[rgba(54,91,69,0.06)]" />
    ),
  }
);

type Props = {
  data: EducationPhaseRow[];
};

export function EducationPhaseChartShell({ data }: Props) {
  return <EducationPhaseChart data={data} />;
}
