"use client";

import dynamic from "next/dynamic";
import type { EducationFsmRow } from "@/lib/education-summary";

const EducationFsmChart = dynamic(
  () =>
    import("@/components/education-fsm-chart").then(
      (module) => module.EducationFsmChart
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[360px] min-w-0 w-full rounded-[24px] bg-[rgba(54,91,69,0.06)]" />
    ),
  }
);

type Props = {
  data: EducationFsmRow[];
};

export function EducationFsmChartShell({ data }: Props) {
  return <EducationFsmChart data={data} />;
}
