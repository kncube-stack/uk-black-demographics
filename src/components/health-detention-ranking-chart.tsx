"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ETHNICITY_SERIES_COLORS } from "@/lib/constants";
import { formatNumber, formatRate } from "@/lib/format";
import type { HealthMetricRow } from "@/lib/health-summary";

type Props = {
  data: HealthMetricRow[];
};

export function HealthDetentionRankingChart({ data }: Props) {
  return (
    <div className="h-[420px] min-w-0 w-full">
      <ResponsiveContainer width="100%" height="100%" minWidth={280} minHeight={340}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 8, right: 20, bottom: 8, left: 12 }}
        >
          <CartesianGrid horizontal={false} stroke="rgba(19, 31, 22, 0.10)" />
          <XAxis
            type="number"
            tickFormatter={(value) => formatRate(value, 100_000)}
            stroke="#586457"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="shortLabel"
            width={132}
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
            formatter={(value) => {
              const numericValue =
                typeof value === "number" ? value : Number(value ?? 0);
              return [formatRate(numericValue, 100_000), "Standardised rate"];
            }}
            labelFormatter={(_label, payload) => {
              const row = payload?.[0]?.payload as HealthMetricRow | undefined;

              if (!row) {
                return "";
              }

              return `${row.label}: ${formatNumber(row.detentions)} detentions, confidence margin ${
                row.confidenceMargin === null ? "n/a" : `${row.confidenceMargin.toFixed(1)}`
              }`;
            }}
          />
          <Bar dataKey="rate" radius={[0, 14, 14, 0]} maxBarSize={28}>
            {data.map((row) => (
              <Cell
                key={row.key}
                fill={ETHNICITY_SERIES_COLORS[row.key] ?? "#365b45"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
