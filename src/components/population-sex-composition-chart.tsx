"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PopulationSexRow } from "@/lib/population-summary";

type Props = {
  data: PopulationSexRow[];
};

export function PopulationSexCompositionChart({ data }: Props) {
  const chartData = data.map((row) => ({
    ...row,
    femalePercent: Number(row.femaleShare.toFixed(1)),
    malePercent: Number(row.maleShare.toFixed(1)),
  }));

  return (
    <div className="h-[420px] min-w-0 w-full">
      <ResponsiveContainer width="100%" height="100%" minWidth={280} minHeight={320}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 8, right: 16, bottom: 8, left: 8 }}
          barSize={26}
        >
          <CartesianGrid horizontal={false} stroke="rgba(19, 31, 22, 0.10)" />
          <XAxis
            type="number"
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
            stroke="#586457"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={138}
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
            formatter={(value, name, payload) => {
              const numericValue =
                typeof value === "number" ? value : Number(value ?? 0);
              const row = payload?.payload as PopulationSexRow | undefined;
              const count =
                name === "Female" ? row?.female : row?.male;

              return [
                `${numericValue.toFixed(1)}%${typeof count === "number" ? ` (${new Intl.NumberFormat("en-GB").format(count)})` : ""}`,
                name,
              ];
            }}
          />
          <Bar dataKey="femalePercent" name="Female" stackId="sex" fill="#6e8f74" radius={[10, 0, 0, 10]}>
            <LabelList
              dataKey="femalePercent"
              position="insideLeft"
              formatter={(value) => `${toNumericValue(value).toFixed(1)}%`}
              fill="#f7f2e9"
            />
          </Bar>
          <Bar dataKey="malePercent" name="Male" stackId="sex" fill="#365b45" radius={[0, 10, 10, 0]}>
            <LabelList
              dataKey="malePercent"
              position="insideRight"
              formatter={(value) => `${toNumericValue(value).toFixed(1)}%`}
              fill="#f7f2e9"
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function toNumericValue(value: unknown): number {
  return typeof value === "number" ? value : Number(value ?? 0);
}
