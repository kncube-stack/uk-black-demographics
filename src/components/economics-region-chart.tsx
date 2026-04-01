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
import { formatPercent } from "@/lib/format";
import type { EconomicsRegionRow } from "@/lib/economics-summary";

type Props = {
  data: EconomicsRegionRow[];
};

export function EconomicsRegionChart({ data }: Props) {
  return (
    <div className="h-[420px] min-w-0 w-full">
      <ResponsiveContainer width="100%" height="100%" minWidth={280} minHeight={360}>
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
            dataKey="name"
            width={140}
            tickFormatter={shortenGeography}
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
              const numericValue =
                typeof value === "number" ? value : Number(value ?? 0);

              return [formatPercent(numericValue, 1), "Black employment rate"];
            }}
            labelFormatter={(_label, payload) => {
              const row = payload?.[0]?.payload as EconomicsRegionRow | undefined;

              if (!row) {
                return "";
              }

              return `${row.name}: ${formatSignedPoints(
                row.employmentGap
              )} vs area overall`;
            }}
          />
          <Bar dataKey="blackEmploymentRate" radius={[0, 14, 14, 0]} maxBarSize={28}>
            {data.map((row) => (
              <Cell
                key={row.code}
                fill={row.employmentGap >= 0 ? "#173022" : "#365b45"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function formatSignedPoints(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)} percentage points`;
}

function shortenGeography(value: string) {
  if (value === "Yorkshire and The Humber") {
    return "Yorkshire & Humber";
  }

  return value;
}
