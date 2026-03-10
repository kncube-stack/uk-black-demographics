"use client";

import dynamic from "next/dynamic";
import type { EconomicsOccupationRow } from "@/lib/economics-summary";

const EconomicsOccupationChart = dynamic(
  () =>
    import("@/components/economics-occupation-chart").then(
      (module) => module.EconomicsOccupationChart
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[420px] min-w-0 w-full rounded-[24px] bg-[rgba(54,91,69,0.06)]" />
    ),
  }
);

type Props = {
  data: EconomicsOccupationRow[];
};

export function EconomicsOccupationChartShell({ data }: Props) {
  return <EconomicsOccupationChart data={data} />;
}
