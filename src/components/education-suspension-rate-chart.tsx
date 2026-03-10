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
import { formatNumber, formatPercent } from "@/lib/format";
import type { EducationMetricRow } from "@/lib/education-summary";

type Props = {
  data: EducationMetricRow[];
};

export function EducationSuspensionRateChart({ data }: Props) {
  const sorted = [...data].sort(
    (left, right) => right.suspensionRate - left.suspensionRate
  );

  return (
    <div className="h-[420px] min-w-0 w-full">
      <ResponsiveContainer width="100%" height="100%" minWidth={280} minHeight={320}>
        <BarChart
          data={sorted}
          layout="vertical"
          margin={{ top: 8, right: 24, bottom: 8, left: 12 }}
        >
          <CartesianGrid horizontal={false} stroke="rgba(19, 31, 22, 0.10)" />
          <XAxis
            type="number"
            tickFormatter={(value) => formatPercent(value, 1)}
            stroke="#586457"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="shortLabel"
            width={124}
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
              const row = payload?.payload as EducationMetricRow | undefined;
              const numericValue =
                typeof value === "number" ? value : Number(value ?? 0);

              if (!row) {
                return [formatPercent(numericValue, 2), "Suspension rate"];
              }

              return [formatPercent(numericValue, 2), `${row.label} suspension rate`];
            }}
            labelFormatter={(_label, payload) => {
              const row = payload?.[0]?.payload as EducationMetricRow | undefined;

              if (!row) {
                return "";
              }

              return `${formatNumber(row.suspensionCount)} suspensions across ${formatNumber(row.headcount)} pupils`;
            }}
          />
          <Bar dataKey="suspensionRate" radius={[0, 14, 14, 0]} maxBarSize={32}>
            {sorted.map((row) => (
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
