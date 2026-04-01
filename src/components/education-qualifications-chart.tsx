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
import { formatNumber, formatPercent } from "@/lib/format";
import type { QualificationRow } from "@/lib/education-attainment-summary";

type Props = {
  data: QualificationRow[];
};

/** Short display labels for the long Census qualification categories */
const CATEGORY_SHORT_LABELS: Record<string, string> = {
  "no-qualifications": "No qualifications",
  "level-1-and-entry-level-qualifications-1-to-4-gcses-grade-a-to-c-any-gcses-at-other-grades-o-levels-or-cses-any-grades-1-as-level-nvq-level-1-foundation-gnvq-basic-or-essential-skills":
    "Level 1 & entry",
  "level-2-qualifications-5-or-more-gcses-a-to-c-or-9-to-4-o-levels-passes-cses-grade-1-school-certification-1-a-level-2-to-3-as-levels-vces-intermediate-or-higher-diploma-welsh-baccalaureate-intermediate-diploma-nvq-level-2-intermediate-gnvq-city-and-guilds-craft-btec-first-or-general-diploma-rsa-diploma":
    "Level 2 (5+ GCSEs)",
  apprenticeship: "Apprenticeship",
  "level-3-qualifications-2-or-more-a-levels-or-vces-4-or-more-as-levels-higher-school-certificate-progression-or-advanced-diploma-welsh-baccalaureate-advance-diploma-nvq-level-3-advanced-gnvq-city-and-guilds-advanced-craft-onc-ond-btec-national-rsa-advanced-diploma":
    "Level 3 (2+ A-levels)",
  "level-4-qualifications-or-above-degree-ba-bsc-higher-degree-ma-phd-pgce-nvq-level-4-to-5-hnc-hnd-rsa-higher-diploma-btec-higher-level-professional-qualifications-for-example-teaching-nursing-accountancy":
    "Level 4+ (Degree)",
  "other-vocational-or-work-related-qualifications-other-qualifications-achieved-in-england-or-wales-qualifications-achieved-outside-england-or-wales-equivalent-not-stated-or-unknown":
    "Other / unknown",
};

/** Desired display order for qualification categories */
const CATEGORY_ORDER = [
  "no-qualifications",
  "level-1-and-entry-level-qualifications-1-to-4-gcses-grade-a-to-c-any-gcses-at-other-grades-o-levels-or-cses-any-grades-1-as-level-nvq-level-1-foundation-gnvq-basic-or-essential-skills",
  "level-2-qualifications-5-or-more-gcses-a-to-c-or-9-to-4-o-levels-passes-cses-grade-1-school-certification-1-a-level-2-to-3-as-levels-vces-intermediate-or-higher-diploma-welsh-baccalaureate-intermediate-diploma-nvq-level-2-intermediate-gnvq-city-and-guilds-craft-btec-first-or-general-diploma-rsa-diploma",
  "apprenticeship",
  "level-3-qualifications-2-or-more-a-levels-or-vces-4-or-more-as-levels-higher-school-certificate-progression-or-advanced-diploma-welsh-baccalaureate-advance-diploma-nvq-level-3-advanced-gnvq-city-and-guilds-advanced-craft-onc-ond-btec-national-rsa-advanced-diploma",
  "level-4-qualifications-or-above-degree-ba-bsc-higher-degree-ma-phd-pgce-nvq-level-4-to-5-hnc-hnd-rsa-higher-diploma-btec-higher-level-professional-qualifications-for-example-teaching-nursing-accountancy",
  "other-vocational-or-work-related-qualifications-other-qualifications-achieved-in-england-or-wales-qualifications-achieved-outside-england-or-wales-equivalent-not-stated-or-unknown",
];

interface GroupedRow {
  categoryLabel: string;
  category: string;
  blackShare: number;
  blackCount: number;
  allShare: number;
  allCount: number;
}

export function EducationQualificationsChart({ data }: Props) {
  // Build grouped rows: one per category with Black vs All values
  const categories = Array.from(new Set(data.map((r) => r.category)));
  const ordered = [...categories].sort(
    (a, b) =>
      (CATEGORY_ORDER.indexOf(a) === -1 ? 999 : CATEGORY_ORDER.indexOf(a)) -
      (CATEGORY_ORDER.indexOf(b) === -1 ? 999 : CATEGORY_ORDER.indexOf(b)),
  );

  const grouped: GroupedRow[] = ordered.map((cat) => {
    const blackRow = data.find((r) => r.key === "all_black" && r.category === cat);
    const allRow = data.find(
      (r) => r.key === "all_ethnicities" && r.category === cat,
    );
    return {
      category: cat,
      categoryLabel: CATEGORY_SHORT_LABELS[cat] ?? cat,
      blackShare: blackRow?.share ?? 0,
      blackCount: blackRow?.count ?? 0,
      allShare: allRow?.share ?? 0,
      allCount: allRow?.count ?? 0,
    };
  });

  return (
    <div className="h-[420px] min-w-0 w-full">
      <ResponsiveContainer width="100%" height="100%" minWidth={280} minHeight={340}>
        <BarChart
          data={grouped}
          layout="vertical"
          margin={{ top: 8, right: 24, bottom: 8, left: 12 }}
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
            dataKey="categoryLabel"
            width={140}
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
            formatter={(value, name, payload) => {
              const row = payload?.payload as GroupedRow | undefined;
              const numericValue =
                typeof value === "number" ? value : Number(value ?? 0);
              const isBlack = name === "blackShare";
              const label = isBlack ? "Black" : "All ethnicities";
              const count = isBlack ? row?.blackCount : row?.allCount;
              return [
                `${formatPercent(numericValue, 1)} (${formatNumber(count ?? 0)})`,
                label,
              ];
            }}
            labelFormatter={(_label, payload) => {
              const row = payload?.[0]?.payload as GroupedRow | undefined;
              return row?.categoryLabel ?? "";
            }}
          />
          <Legend
            formatter={(value) =>
              value === "blackShare" ? "Black" : "All ethnicities"
            }
          />
          <Bar
            dataKey="blackShare"
            name="blackShare"
            fill="#365b45"
            radius={[0, 14, 14, 0]}
            maxBarSize={24}
          />
          <Bar
            dataKey="allShare"
            name="allShare"
            fill="#7A8071"
            radius={[0, 14, 14, 0]}
            maxBarSize={24}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
