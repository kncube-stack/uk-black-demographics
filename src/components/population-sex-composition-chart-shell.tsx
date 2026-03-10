"use client";

import dynamic from "next/dynamic";
import type { PopulationSexRow } from "@/lib/population-summary";

const PopulationSexCompositionChart = dynamic(
  () =>
    import("@/components/population-sex-composition-chart").then(
      (module) => module.PopulationSexCompositionChart
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[420px] min-w-0 w-full rounded-[24px] bg-[rgba(54,91,69,0.06)]" />
    ),
  }
);

type Props = {
  data: PopulationSexRow[];
};

export function PopulationSexCompositionChartShell({ data }: Props) {
  return <PopulationSexCompositionChart data={data} />;
}
