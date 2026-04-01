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
import type { LifeExpectancyRow } from "@/lib/health-life-expectancy-summary";

type Props = {
  data: LifeExpectancyRow[];
};

export function HealthLifeExpectancyChart({ data }: Props) {
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
            domain={[70, 90]}
            tickFormatter={(value) => `${value} yr`}
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
            formatter={(value, name) => {
              const v = typeof value === "number" ? value : Number(value ?? 0);
              return [
                `${v.toFixed(1)} years`,
                name === "blackLE" ? "Black" : "All ethnicities",
              ];
            }}
          />
          <Legend
            verticalAlign="top"
            formatter={(value: string) =>
              value === "blackLE" ? "Black" : "All ethnicities"
            }
          />
          <Bar
            dataKey="blackLE"
            fill="#1B4332"
            radius={[14, 14, 0, 0]}
            maxBarSize={48}
          />
          <Bar
            dataKey="allLE"
            fill="#7A8071"
            radius={[14, 14, 0, 0]}
            maxBarSize={48}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
