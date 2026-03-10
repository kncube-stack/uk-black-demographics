"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatNumber } from "@/lib/format";
import type { GeographyPopulationSummary } from "@/lib/population-summary";

type Props = {
  data: GeographyPopulationSummary[];
};

export function PopulationRegionChart({ data }: Props) {
  return (
    <div className="h-[420px] min-w-0 w-full">
      <ResponsiveContainer width="100%" height="100%" minWidth={280} minHeight={320}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 8, right: 20, bottom: 8, left: 12 }}
        >
          <CartesianGrid horizontal={false} stroke="rgba(19, 31, 22, 0.10)" />
          <XAxis
            type="number"
            tickFormatter={(value) => formatCompact(value)}
            stroke="#586457"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={108}
            stroke="#586457"
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            cursor={{ fill: "rgba(54, 91, 69, 0.08)" }}
            contentStyle={{
              borderRadius: "16px",
              border: "1px solid rgba(19, 31, 22, 0.12)",
              boxShadow: "0 16px 40px rgba(19, 31, 22, 0.12)",
            }}
            formatter={(value, _name, payload) => {
              const numericValue =
                typeof value === "number" ? value : Number(value ?? 0);

              return [
                formatNumber(numericValue),
                `${payload?.payload.name ?? "Regional"} core Black population`,
              ];
            }}
            labelFormatter={(_label, payload) => {
              const row = payload?.[0]?.payload as GeographyPopulationSummary | undefined;
              if (!row) return "";
              return `${row.inclusiveShare.toFixed(1)}% incl. mixed White/Black groups`;
            }}
          />
          <Bar
            dataKey="allBlack"
            fill="#365b45"
            radius={[0, 14, 14, 0]}
            maxBarSize={32}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function formatCompact(value: number): string {
  return new Intl.NumberFormat("en-GB", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}
