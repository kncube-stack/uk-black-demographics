"use client";

import dynamic from "next/dynamic";
import type { MarriageRow } from "@/lib/households-marriage-summary";
import { DataExportButtons } from "./data-export-buttons";

const MarriageChart = dynamic(
  () =>
    import("@/components/marriage-chart").then(
      (module) => module.MarriageChart
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[320px] min-w-0 w-full rounded-[24px] bg-[rgba(54,91,69,0.06)]" />
    ),
  }
);

type Props = {
  data: MarriageRow[];
};

export function MarriageChartShell({ data }: Props) {
  return (
    <div className="space-y-4">
      <MarriageChart data={data} />
      <div className="flex justify-end">
        <DataExportButtons data={data} filename="marital-status" />
      </div>
    </div>
  );
}
