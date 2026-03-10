"use client";

import dynamic from "next/dynamic";
import type { EducationMetricRow } from "@/lib/education-summary";

const EducationSuspensionRateChart = dynamic(
  () =>
    import("@/components/education-suspension-rate-chart").then(
      (module) => module.EducationSuspensionRateChart
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[420px] min-w-0 w-full rounded-[24px] bg-[rgba(54,91,69,0.06)]" />
    ),
  }
);

type Props = {
  data: EducationMetricRow[];
};

export function EducationSuspensionRateChartShell({ data }: Props) {
  return <EducationSuspensionRateChart data={data} />;
}
