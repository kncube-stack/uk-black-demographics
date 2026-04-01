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
import { formatPercent } from "@/lib/format";
import type { HeritageRow } from "@/lib/heritage-summary";

type Props = {
  data: HeritageRow[];
};

export function HeritageChart({ data }: Props) {
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
            tickFormatter={(value) => formatPercent(value, 0)}
            stroke="#586457"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={180}
            stroke="#586457"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11 }}
          />
          <Tooltip
            cursor={{ fill: "rgba(54, 91, 69, 0.08)" }}
            contentStyle={{
              borderRadius: "16px",
              border: "1px solid rgba(19, 31, 22, 0.12)",
              boxShadow: "0 16px 40px rgba(19, 31, 22, 0.12)",
            }}
            formatter={(value: number, name: string) => [
              formatPercent(value, 1),
              name === "blackShare" ? "Black" : "All ethnicities",
            ]}
          />
          <Legend
            verticalAlign="top"
            formatter={(value: string) =>
              value === "blackShare" ? "Black" : "All ethnicities"
            }
          />
          <Bar
            dataKey="blackShare"
            fill="#365b45"
            radius={[0, 14, 14, 0]}
            maxBarSize={22}
          />
          <Bar
            dataKey="allShare"
            fill="#7A8071"
            radius={[0, 14, 14, 0]}
            maxBarSize={22}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
