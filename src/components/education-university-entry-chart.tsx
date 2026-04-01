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
import { formatPercent } from "@/lib/format";
import type { UniversityEntryRow } from "@/lib/education-university-summary";

type Props = {
  data: UniversityEntryRow[];
};

export function EducationUniversityEntryChart({ data }: Props) {
  return (
    <div className="h-[360px] min-w-0 w-full">
      <ResponsiveContainer width="100%" height="100%" minWidth={280} minHeight={300}>
        <LineChart
          data={data}
          margin={{ top: 8, right: 20, bottom: 8, left: 12 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(19, 31, 22, 0.10)" />
          <XAxis
            dataKey="timePeriod"
            stroke="#586457"
            tickLine={false}
            axisLine={false}
            interval={2}
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
            formatter={(value, name) => {
              const v = typeof value === "number" ? value : Number(value ?? 0);
              return [
                formatPercent(v, 1),
                name === "blackEntryRate" ? "Black" : "All ethnicities",
              ];
            }}
            labelFormatter={(label) => `Year: ${label}`}
          />
          <Legend
            verticalAlign="top"
            formatter={(value: string) =>
              value === "blackEntryRate" ? "Black" : "All ethnicities"
            }
          />
          <Line
            type="monotone"
            dataKey="blackEntryRate"
            stroke="#1B4332"
            strokeWidth={2}
            dot={{ r: 3, fill: "#1B4332" }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="allEntryRate"
            stroke="#7A8071"
            strokeWidth={2}
            dot={{ r: 3, fill: "#7A8071" }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
