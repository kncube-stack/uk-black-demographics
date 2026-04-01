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
import { formatPercent } from "@/lib/format";
import type { ObesityData } from "@/lib/health-obesity-summary";

type Props = {
  data: ObesityData;
};

interface ChartRow {
  label: string;
  rate: number;
  fill: string;
}

export function HealthObesityChart({ data }: Props) {
  const chartData: ChartRow[] = [
    { label: "Black", rate: data.blackObesityRate, fill: "#1B4332" },
    { label: "All", rate: data.allObesityRate, fill: "#7A8071" },
  ];

  return (
    <div className="h-[280px] min-w-0 w-full">
      <ResponsiveContainer width="100%" height="100%" minWidth={280} minHeight={220}>
        <BarChart
          data={chartData}
          margin={{ top: 24, right: 20, bottom: 8, left: 12 }}
        >
          <CartesianGrid vertical={false} stroke="rgba(19, 31, 22, 0.10)" />
          <XAxis
            dataKey="label"
            stroke="#586457"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tickFormatter={(value) => formatPercent(value, 0)}
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
              const v = typeof value === "number" ? value : Number(value ?? 0);
              return [formatPercent(v, 1), "Obesity rate"];
            }}
          />
          <Bar dataKey="rate" radius={[14, 14, 0, 0]} maxBarSize={64}>
            {chartData.map((row) => (
              <Cell key={row.label} fill={row.fill} />
            ))}
            <LabelList
              dataKey="rate"
              position="top"
              formatter={(value: unknown) => formatPercent(Number(value ?? 0), 1)}
              style={{ fill: "#131F16", fontWeight: 600, fontSize: 14 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
