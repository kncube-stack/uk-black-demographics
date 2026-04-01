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
import { ETHNICITY_SERIES_COLORS } from "@/lib/constants";
import { formatPercent } from "@/lib/format";
import type { EconomicsOccupationRow } from "@/lib/economics-summary";

type Props = {
  data: EconomicsOccupationRow[];
};

export function EconomicsOccupationChart({ data }: Props) {
  const rows = [...data]
    .sort((left, right) => right.blackShare - left.blackShare)
    .map((row) => ({
      ...row,
      shortLabel: shortenOccupationLabel(row.label),
      gap: row.blackShare - row.overallShare,
    }));

  return (
    <div className="h-[420px] min-w-0 w-full">
      <ResponsiveContainer width="100%" height="100%" minWidth={280} minHeight={360}>
        <BarChart
          data={rows}
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
            dataKey="shortLabel"
            width={128}
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
            formatter={(value, name) => {
              const numericValue =
                typeof value === "number" ? value : Number(value ?? 0);
              const label =
                name === "blackShare" ? "Black or Black British" : "All employed people";

              return [formatPercent(numericValue, 1), label];
            }}
            labelFormatter={(_label, payload) => {
              const row = payload?.[0]?.payload as
                | (EconomicsOccupationRow & { gap: number })
                | undefined;

              if (!row) {
                return "";
              }

              return `${row.label}: ${formatSignedPoints(row.gap)} vs all employed people`;
            }}
          />
          <Legend
            wrapperStyle={{ paddingTop: 16 }}
            formatter={(value) =>
              value === "blackShare" ? "Black or Black British" : "All employed people"
            }
          />
          <Bar
            dataKey="blackShare"
            name="blackShare"
            fill={ETHNICITY_SERIES_COLORS.all_black}
            radius={[0, 12, 12, 0]}
            maxBarSize={18}
          />
          <Bar
            dataKey="overallShare"
            name="overallShare"
            fill={ETHNICITY_SERIES_COLORS.all_ethnicities}
            radius={[0, 12, 12, 0]}
            maxBarSize={18}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function formatSignedPoints(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)} percentage points`;
}

function shortenOccupationLabel(value: string) {
  switch (value) {
    case "Associate professional":
      return "Associate professional";
    case "Caring and leisure":
      return "Care & leisure";
    case "Sales and service":
      return "Sales & service";
    case "Process and machine":
      return "Process & machine";
    default:
      return value;
  }
}
