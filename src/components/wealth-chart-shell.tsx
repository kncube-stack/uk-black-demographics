"use client";

import dynamic from "next/dynamic";
import type { WealthRow } from "@/lib/wealth-summary";
import { DataExportButtons } from "./data-export-buttons";

const WealthChart = dynamic(
  () =>
    import("@/components/wealth-chart").then((module) => module.WealthChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-[360px] min-w-0 w-full rounded-[24px] bg-[rgba(54,91,69,0.06)]" />
    ),
  }
);

type Props = {
  data: WealthRow[];
};

export function WealthChartShell({ data }: Props) {
  return (
    <div className="space-y-4">
      <WealthChart data={data} />
      <div className="flex justify-end">
        <DataExportButtons data={data} filename="wealth-by-ethnicity" />
      </div>
    </div>
  );
}
