"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ETHNICITY_SERIES_COLORS } from "@/lib/constants";
import { formatPercent } from "@/lib/format";
import type { EconomicsComparisonRow } from "@/lib/economics-summary";

type Props = {
  data: EconomicsComparisonRow[];
};

export function EconomicsRateComparisonChart({ data }: Props) {
  return (
    <div className="h-[360px] min-w-0 w-full">
      <ResponsiveContainer width="100%" height="100%" minWidth={280} minHeight={320}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 8, right: 20, bottom: 8, left: 12 }}
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
            dataKey="label"
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
            formatter={(value, name) => {
              const numericValue =
                typeof value === "number" ? value : Number(value ?? 0);
              const label =
                name === "blackRate" ? "Black or Black British" : "All ethnicities";

              return [formatPercent(numericValue, 1), label];
            }}
            labelFormatter={(_label, payload) => {
              const row = payload?.[0]?.payload as EconomicsComparisonRow | undefined;

              if (!row) {
                return "";
              }

              return `${row.label} gap: ${formatSignedPoints(row.gap)}`;
            }}
          />
          <Legend
            wrapperStyle={{ paddingTop: 16 }}
            formatter={(value) =>
              value === "blackRate" ? "Black or Black British" : "All ethnicities"
            }
          />
          <Bar
            dataKey="blackRate"
            name="blackRate"
            fill={ETHNICITY_SERIES_COLORS.all_black}
            radius={[0, 12, 12, 0]}
            maxBarSize={24}
          />
          <Bar
            dataKey="overallRate"
            name="overallRate"
            fill={ETHNICITY_SERIES_COLORS.all_ethnicities}
            radius={[0, 12, 12, 0]}
            maxBarSize={24}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function formatSignedPoints(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)} percentage points`;
}
