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
import type { CovidMortalityRow } from "@/lib/health-covid-summary";

type Props = {
  data: CovidMortalityRow[];
};

export function HealthCovidChart({ data }: Props) {
  return (
    <div className="h-[280px] min-w-0 w-full">
      <ResponsiveContainer width="100%" height="100%" minWidth={280} minHeight={220}>
        <BarChart
          data={data}
          margin={{ top: 8, right: 20, bottom: 8, left: 12 }}
        >
          <CartesianGrid vertical={false} stroke="rgba(19, 31, 22, 0.10)" />
          <XAxis
            dataKey="sex"
            stroke="#586457"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tickFormatter={(value) => `${value}`}
            stroke="#586457"
            tickLine={false}
            axisLine={false}
            label={{
              value: "per 100,000",
              angle: -90,
              position: "insideLeft",
              style: { fill: "#586457", fontSize: 11 },
            }}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "16px",
              border: "1px solid rgba(19, 31, 22, 0.12)",
              boxShadow: "0 16px 40px rgba(19, 31, 22, 0.12)",
            }}
            formatter={(value: number, name: string) => [
              `${value.toFixed(1)} per 100,000`,
              name === "blackRate" ? "Black" : "All ethnicities",
            ]}
          />
          <Legend
            verticalAlign="top"
            formatter={(value: string) =>
              value === "blackRate" ? "Black" : "All ethnicities"
            }
          />
          <Bar
            dataKey="blackRate"
            fill="#1B4332"
            radius={[14, 14, 0, 0]}
            maxBarSize={48}
          />
          <Bar
            dataKey="allRate"
            fill="#7A8071"
            radius={[14, 14, 0, 0]}
            maxBarSize={48}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
