"use client";

import dynamic from "next/dynamic";
import type { HomeOwnershipRow } from "@/lib/households-summary";

const HouseholdsHomeOwnershipChart = dynamic(
  () =>
    import("@/components/households-home-ownership-chart").then(
      (module) => module.HouseholdsHomeOwnershipChart
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[420px] min-w-0 w-full rounded-[24px] bg-[rgba(54,91,69,0.06)]" />
    ),
  }
);

type Props = {
  data: HomeOwnershipRow[];
};

export function HouseholdsHomeOwnershipChartShell({ data }: Props) {
  return <HouseholdsHomeOwnershipChart data={data} />;
}
