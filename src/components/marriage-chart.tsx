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
import type { MarriageRow } from "@/lib/households-marriage-summary";

type Props = {
  data: MarriageRow[];
};

export function MarriageChart({ data }: Props) {
  return (
    <div className="h-[320px] min-w-0 w-full">
      <ResponsiveContainer width="100%" height="100%" minWidth={280} minHeight={260}>
        <BarChart
          data={data}
          margin={{ top: 8, right: 20, bottom: 8, left: 12 }}
        >
          <CartesianGrid vertical={false} stroke="rgba(19, 31, 22, 0.10)" />
          <XAxis
            dataKey="label"
            stroke="#586457"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11 }}
          />
          <YAxis
            tickFormatter={(value) => formatPercent(value, 0)}
            stroke="#586457"
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
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
            fill="#1B4332"
            radius={[14, 14, 0, 0]}
            maxBarSize={40}
          />
          <Bar
            dataKey="allShare"
            fill="#7A8071"
            radius={[14, 14, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
