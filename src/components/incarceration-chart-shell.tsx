"use client";

import dynamic from "next/dynamic";
import type { IncarcerationData } from "@/lib/incarceration-summary";
import { DataExportButtons } from "./data-export-buttons";

const IncarcerationChart = dynamic(
  () =>
    import("@/components/incarceration-chart").then(
      (module) => module.IncarcerationChart
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[280px] min-w-0 w-full rounded-[24px] bg-[rgba(54,91,69,0.06)]" />
    ),
  }
);

type Props = {
  data: IncarcerationData;
};

export function IncarcerationChartShell({ data }: Props) {
  return (
    <div className="space-y-4">
      <IncarcerationChart data={data} />
      <div className="flex justify-end">
        <DataExportButtons
          data={[
            { type: "Remand", blackShare: data.blackRemandShare },
            { type: "Sentenced", blackShare: data.blackSentencedShare },
          ]}
          filename="prison-population-ethnicity"
        />
      </div>
    </div>
  );
}
