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
import type { EducationPhaseRow } from "@/lib/education-summary";

type Props = {
  data: EducationPhaseRow[];
};

const SERIES = [
  { key: "allPupils", label: "All pupils", color: "#7A8071" },
  {
    key: "allBlackIncludingMixed",
    label: "All Black incl. mixed",
    color: "#7A7F37",
  },
  {
    key: "mixedWhiteBlackCaribbean",
    label: "White and Black Caribbean",
    color: "#52B788",
  },
  { key: "blackCaribbean", label: "Black Caribbean", color: "#2D6A4F" },
] as const;

export function EducationPhaseChart({ data }: Props) {
  return (
    <div className="h-[360px] min-w-0 w-full">
      <ResponsiveContainer width="100%" height="100%" minWidth={280} minHeight={280}>
        <BarChart data={data} margin={{ top: 8, right: 12, bottom: 8, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(19, 31, 22, 0.10)" />
          <XAxis
            dataKey="label"
            stroke="#586457"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tickFormatter={(value) => formatPercent(value, 1)}
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
            formatter={(value, name) => [
              formatPercent(typeof value === "number" ? value : Number(value ?? 0), 2),
              SERIES.find((series) => series.key === name)?.label ?? name,
            ]}
          />
          <Legend />
          {SERIES.map((series) => (
            <Bar
              key={series.key}
              dataKey={series.key}
              name={series.label}
              fill={series.color}
              radius={[10, 10, 0, 0]}
              maxBarSize={38}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
