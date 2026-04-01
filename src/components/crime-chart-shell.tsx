"use client";

import dynamic from "next/dynamic";
import type { CrimeRow } from "@/lib/crime-summary";
import { DataExportButtons } from "./data-export-buttons";

const CrimeChart = dynamic(
  () => import("@/components/crime-chart").then((module) => module.CrimeChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-[360px] min-w-0 w-full rounded-[24px] bg-[rgba(54,91,69,0.06)]" />
    ),
  }
);

type Props = {
  data: CrimeRow[];
};

export function CrimeChartShell({ data }: Props) {
  return (
    <div className="space-y-4">
      <CrimeChart data={data} />
      <div className="flex justify-end">
        <DataExportButtons data={data} filename="crime-victimisation-rates" />
      </div>
    </div>
  );
}
