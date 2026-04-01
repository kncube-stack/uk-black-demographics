"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ETHNICITY_SERIES_COLORS } from "@/lib/constants";
import { formatCurrency } from "@/lib/format";
import type { WealthRow } from "@/lib/wealth-summary";

type Props = {
  data: WealthRow[];
};

export function WealthChart({ data }: Props) {
  return (
    <div className="h-[360px] min-w-0 w-full">
      <ResponsiveContainer width="100%" height="100%" minWidth={280} minHeight={280}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 8, right: 20, bottom: 8, left: 12 }}
        >
          <CartesianGrid horizontal={false} stroke="rgba(19, 31, 22, 0.10)" />
          <XAxis
            type="number"
            tickFormatter={(value) => formatCurrency(value)}
            stroke="#586457"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="shortLabel"
            width={120}
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
            formatter={(value: number) => [
              formatCurrency(value),
              "Median total wealth",
            ]}
            labelFormatter={(_label, payload) => {
              const row = payload?.[0]?.payload as WealthRow | undefined;
              return row?.label ?? "";
            }}
          />
          <Bar dataKey="medianWealth" radius={[0, 14, 14, 0]} maxBarSize={28}>
            {data.map((row) => (
              <Cell
                key={row.key}
                fill={ETHNICITY_SERIES_COLORS[row.key] ?? "#365b45"}
              />
            ))}
            <LabelList
              dataKey="medianWealth"
              position="right"
              formatter={(value: number) => formatCurrency(value)}
              style={{ fill: "#131F16", fontWeight: 600, fontSize: 12 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
