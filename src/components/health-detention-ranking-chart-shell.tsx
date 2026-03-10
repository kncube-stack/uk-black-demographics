"use client";

import dynamic from "next/dynamic";
import type { HealthMetricRow } from "@/lib/health-summary";

const HealthDetentionRankingChart = dynamic(
  () =>
    import("@/components/health-detention-ranking-chart").then(
      (module) => module.HealthDetentionRankingChart
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[420px] min-w-0 w-full rounded-[24px] bg-[rgba(54,91,69,0.06)]" />
    ),
  }
);

type Props = {
  data: HealthMetricRow[];
};

export function HealthDetentionRankingChartShell({ data }: Props) {
  return <HealthDetentionRankingChart data={data} />;
}
