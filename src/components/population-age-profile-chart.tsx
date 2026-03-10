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
import type { PopulationAgeProfileRow } from "@/lib/population-summary";

type Props = {
  data: PopulationAgeProfileRow[];
};

export function PopulationAgeProfileChart({ data }: Props) {
  return (
    <div className="h-[380px] min-w-0 w-full">
      <ResponsiveContainer width="100%" height="100%" minWidth={280} minHeight={300}>
        <BarChart
          data={data}
          margin={{ top: 8, right: 12, bottom: 8, left: 4 }}
          barGap={10}
        >
          <CartesianGrid vertical={false} stroke="rgba(19, 31, 22, 0.10)" />
          <XAxis
            dataKey="label"
            stroke="#586457"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#586457"
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "16px",
              border: "1px solid rgba(19, 31, 22, 0.12)",
              boxShadow: "0 16px 40px rgba(19, 31, 22, 0.12)",
            }}
            formatter={(value, name, payload) => {
              const numericValue =
                typeof value === "number" ? value : Number(value ?? 0);
              const row = payload?.payload as PopulationAgeProfileRow | undefined;
              const countLabel =
                name === "All population"
                  ? row?.allPopulationCount
                  : name === "All Black incl. mixed"
                    ? row?.inclusiveBlackCount
                    : row?.coreBlackCount;

              return [
                `${numericValue.toFixed(1)}%${typeof countLabel === "number" ? ` (${new Intl.NumberFormat("en-GB").format(countLabel)})` : ""}`,
                name,
              ];
            }}
          />
          <Legend />
          <Bar dataKey="allPopulationShare" name="All population" fill="#c8cfbf" radius={[10, 10, 0, 0]} />
          <Bar dataKey="coreBlackShare" name="All Black" fill="#365b45" radius={[10, 10, 0, 0]} />
          <Bar
            dataKey="inclusiveBlackShare"
            name="All Black incl. mixed"
            fill="#8ca68a"
            radius={[10, 10, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
