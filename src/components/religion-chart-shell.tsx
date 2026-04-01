"use client";

import dynamic from "next/dynamic";
import type { ReligionRow } from "@/lib/religion-summary";
import { DataExportButtons } from "./data-export-buttons";

const ReligionChart = dynamic(
  () =>
    import("@/components/religion-chart").then((module) => module.ReligionChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-[420px] min-w-0 w-full rounded-[24px] bg-[rgba(54,91,69,0.06)]" />
    ),
  }
);

type Props = {
  data: ReligionRow[];
};

export function ReligionChartShell({ data }: Props) {
  return (
    <div className="space-y-4">
      <ReligionChart data={data} />
      <div className="flex justify-end">
        <DataExportButtons data={data} filename="religion-by-ethnicity" />
      </div>
    </div>
  );
}
