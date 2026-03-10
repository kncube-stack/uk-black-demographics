"use client";

import dynamic from "next/dynamic";
import type { PopulationAgeProfileRow } from "@/lib/population-summary";

const PopulationAgeProfileChart = dynamic(
  () =>
    import("@/components/population-age-profile-chart").then(
      (module) => module.PopulationAgeProfileChart
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[380px] min-w-0 w-full rounded-[24px] bg-[rgba(54,91,69,0.06)]" />
    ),
  }
);

type Props = {
  data: PopulationAgeProfileRow[];
};

export function PopulationAgeProfileChartShell({ data }: Props) {
  return <PopulationAgeProfileChart data={data} />;
}
