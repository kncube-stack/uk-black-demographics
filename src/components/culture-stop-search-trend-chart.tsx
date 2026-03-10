"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ETHNICITY_SERIES_COLORS } from "@/lib/constants";
import { formatRate } from "@/lib/format";
import type { StopSearchTrendRow } from "@/lib/culture-summary";

type Props = {
  data: StopSearchTrendRow[];
};

export function CultureStopSearchTrendChart({ data }: Props) {
  return (
    <div className="h-[380px] min-w-0 w-full">
      <ResponsiveContainer width="100%" height="100%" minWidth={280} minHeight={320}>
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 8, left: 4 }}>
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
            tickFormatter={(value) => formatRate(value, 1_000)}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "16px",
              border: "1px solid rgba(19, 31, 22, 0.12)",
              boxShadow: "0 16px 40px rgba(19, 31, 22, 0.12)",
            }}
            formatter={(value, name) => {
              const numericValue =
                typeof value === "number" ? value : Number(value ?? 0);
              return [formatRate(numericValue, 1_000), name];
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="allEthnicitiesRate"
            name="All ethnicities"
            stroke={ETHNICITY_SERIES_COLORS.all_ethnicities}
            strokeWidth={2.5}
            dot={{ r: 2.5 }}
          />
          <Line
            type="monotone"
            dataKey="allBlackRate"
            name="All Black"
            stroke={ETHNICITY_SERIES_COLORS.all_black}
            strokeWidth={3}
            dot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="blackAfricanRate"
            name="Black African"
            stroke={ETHNICITY_SERIES_COLORS.black_african}
            strokeWidth={2.5}
            dot={{ r: 2.5 }}
          />
          <Line
            type="monotone"
            dataKey="blackCaribbeanRate"
            name="Black Caribbean"
            stroke={ETHNICITY_SERIES_COLORS.black_caribbean}
            strokeWidth={2.5}
            dot={{ r: 2.5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
