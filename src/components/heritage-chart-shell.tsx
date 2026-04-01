"use client";

import dynamic from "next/dynamic";
import type { HeritageRow } from "@/lib/heritage-summary";
import { DataExportButtons } from "./data-export-buttons";

const HeritageChart = dynamic(
  () =>
    import("@/components/heritage-chart").then(
      (module) => module.HeritageChart
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[420px] min-w-0 w-full rounded-[24px] bg-[rgba(54,91,69,0.06)]" />
    ),
  }
);

type Props = {
  data: HeritageRow[];
};

export function HeritageChartShell({ data }: Props) {
  return (
    <div className="space-y-4">
      <HeritageChart data={data} />
      <div className="flex justify-end">
        <DataExportButtons
          data={data}
          filename="country-of-birth-by-ethnicity"
        />
      </div>
    </div>
  );
}
