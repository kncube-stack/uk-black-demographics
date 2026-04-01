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
import { formatNumber } from "@/lib/format";
import type { GcseRow } from "@/lib/education-attainment-summary";

type Props = {
  data: GcseRow[];
};

export function EducationGcseChart({ data }: Props) {
  const sorted = [...data].sort(
    (left, right) => right.attainment8Score - left.attainment8Score,
  );

  return (
    <div className="h-[360px] min-w-0 w-full">
      <ResponsiveContainer width="100%" height="100%" minWidth={280} minHeight={280}>
        <BarChart
          data={sorted}
          layout="vertical"
          margin={{ top: 8, right: 24, bottom: 8, left: 12 }}
        >
          <CartesianGrid horizontal={false} stroke="rgba(19, 31, 22, 0.10)" />
          <XAxis
            type="number"
            tickFormatter={(value) => value.toFixed(1)}
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
              const row = payload?.payload as GcseRow | undefined;
              const numericValue =
                typeof value === "number" ? value : Number(value ?? 0);

              if (!row) {
                return [numericValue.toFixed(1), "Attainment 8 score"];
              }

              return [numericValue.toFixed(1), `${row.label} Attainment 8 score`];
            }}
            labelFormatter={(_label, payload) => {
              const row = payload?.[0]?.payload as GcseRow | undefined;

              if (!row) {
                return "";
              }

              return `${formatNumber(row.pupils)} pupils`;
            }}
          />
          <Bar dataKey="attainment8Score" radius={[0, 14, 14, 0]} maxBarSize={32}>
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
