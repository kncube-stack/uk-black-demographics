"use client";

import dynamic from "next/dynamic";
import type { LowIncomeData } from "@/lib/households-income-summary";

const HouseholdsLowIncomeChart = dynamic(
  () =>
    import("@/components/households-low-income-chart").then(
      (module) => module.HouseholdsLowIncomeChart
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[280px] min-w-0 w-full rounded-[24px] bg-[rgba(54,91,69,0.06)]" />
    ),
  }
);

type Props = {
  data: LowIncomeData;
};

export function HouseholdsLowIncomeChartShell({ data }: Props) {
  return <HouseholdsLowIncomeChart data={data} />;
}
