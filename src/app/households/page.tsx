import { CensusCaveatBanner } from "@/components/census-caveat-banner";
import { CitationCard } from "@/components/citation-card";
import { GeographicScopeBadge } from "@/components/geographic-scope-badge";
import { HouseholdsHomeOwnershipChartShell } from "@/components/households-home-ownership-chart-shell";
import { HouseholdsLowIncomeChartShell } from "@/components/households-low-income-chart-shell";
import { MarriageChartShell } from "@/components/marriage-chart-shell";
import { SourceCard } from "@/components/source-card";
import { SubcategoryGrid } from "@/components/subcategory-grid";
import { WealthChartShell } from "@/components/wealth-chart-shell";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import { loadLowIncomeData } from "@/lib/households-income-summary";
import { loadMarriagePageData } from "@/lib/households-marriage-summary";
import { loadHouseholdsPageData } from "@/lib/households-summary";
import { loadWealthPageData } from "@/lib/wealth-summary";

export default async function HouseholdsPage() {
  const [
    { latestLabel, headline, rows, source },
    lowIncome,
    marriage,
    wealth,
  ] = await Promise.all([
    loadHouseholdsPageData(),
    loadLowIncomeData(),
    loadMarriagePageData(),
    loadWealthPageData(),
  ]);
  const blackCaribbean = rows.find((row) => row.key === "black_caribbean");
  const otherBlack = rows.find((row) => row.key === "other_black");

  if (!blackCaribbean || !otherBlack) {
    throw new Error("Households summary is missing required rows.");
  }

  return (
    <main className="px-5 py-6 sm:px-8 lg:px-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="overflow-hidden rounded-[32px] border border-[var(--border)] bg-[var(--surface)] shadow-[0_24px_80px_rgba(19,31,22,0.08)]">
          <div className="grid gap-8 px-6 py-7 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-10 lg:py-10">
            <div className="space-y-5">
              <div className="inline-flex w-fit items-center rounded-full border border-[var(--border)] bg-white/65 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                Households
              </div>
              <div className="max-w-3xl space-y-4">
                <h1 className="font-[family-name:var(--font-newsreader)] text-5xl leading-none tracking-[-0.04em] text-[var(--foreground)] sm:text-6xl">
                  Home ownership and housing for Black households.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
                  Compare home-ownership rates for Black African, Black Caribbean,
                  Other Black, and mixed White/Black households in England —
                  and see how they measure against the national baseline.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <article className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                  <p className="text-sm font-medium text-[var(--muted)]">
                    All Black home ownership
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                    {formatPercent(headline.allBlackRate, 1)}
                  </p>
                  <p className="mt-2 text-sm text-[var(--muted)]">{latestLabel}</p>
                </article>
                <article className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                  <p className="text-sm font-medium text-[var(--muted)]">
                    All Black incl. mixed
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                    {formatPercent(headline.allBlackIncludingMixedRate, 1)}
                  </p>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    {formatSignedPoints(headline.allBlackIncludingMixedRate - headline.overallRate)} vs all households
                  </p>
                </article>
                <article className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                  <p className="text-sm font-medium text-[var(--muted)]">
                    Black Caribbean
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                    {formatPercent(blackCaribbean.rate, 1)}
                  </p>
                  <p className="mt-2 text-sm text-[var(--muted)]">Highest published Black subgroup rate</p>
                </article>
                <article className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                  <p className="text-sm font-medium text-[var(--muted)]">
                    Other Black
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                    {formatPercent(otherBlack.rate, 1)}
                  </p>
                  <p className="mt-2 text-sm text-[var(--muted)]">Lowest published tracked rate</p>
                </article>
              </div>
            </div>

            <SourceCard
              metadata={source}
              eyebrow="Current release"
              downloadHref={source.apiEndpoint}
            />
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <article className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_50px_rgba(19,31,22,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Latest ranking
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
              Home ownership remains far below the England baseline for core Black groups
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
              This chart uses the latest pooled release and sorts groups from highest
              to lowest published home-ownership rate.
            </p>
            <div className="mt-6">
              <HouseholdsHomeOwnershipChartShell data={rows} />
            </div>
          </article>

          <article className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_50px_rgba(19,31,22,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Read this carefully
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
              What this households page currently covers
            </h2>
            <div className="mt-5 grid gap-3 text-sm leading-7 text-[var(--muted)]">
              <p>
                The first live households slice is housing-led because home ownership
                has a strong official ethnicity breakdown and clear subgroup detail.
              </p>
              <p>
                These values are pooled over two survey years, which improves
                stability but means they are not single-year snapshots.
              </p>
              <p>
                Income and poverty now open with official snapshot pages, while
                marriage and wealth are clearly marked as coming next because the
                UK source base is weaker and more survey-dependent there.
              </p>
            </div>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <CitationCard
            pageTitle="Households"
            pagePath="/households"
            metadata={source}
            downloadHref={source.apiEndpoint}
            note="If you cite a figure from this page, include that it comes from the pooled England home-ownership release and that all-Black aggregates are recomputed from the published subgroup counts."
          />

          <article className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_50px_rgba(19,31,22,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Exact figures
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
              Latest England home-ownership figures
            </h2>
            <div className="mt-6 overflow-x-auto rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)]">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-[var(--border)] text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                    <th className="px-4 py-3 font-semibold">Group</th>
                    <th className="px-4 py-3 font-semibold">Rate</th>
                    <th className="px-4 py-3 font-semibold">Homeowners</th>
                    <th className="px-4 py-3 font-semibold">Households</th>
                    <th className="px-4 py-3 font-semibold">Gap</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr
                      key={row.key}
                      className="border-b border-[var(--border)] last:border-b-0"
                    >
                      <td className="px-4 py-3 font-medium">{row.label}</td>
                      <td className="px-4 py-3">{formatPercent(row.rate, 1)}</td>
                      <td className="px-4 py-3">{formatNumber(row.homeowners)}</td>
                      <td className="px-4 py-3">{formatNumber(row.households)}</td>
                      <td className="px-4 py-3 text-[var(--muted)]">
                        {formatSignedPoints(row.gapToOverall)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </section>

        <CensusCaveatBanner />

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_50px_rgba(19,31,22,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Low income <GeographicScopeBadge scope="England" />
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
              Percentage of households in low income
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Gap: {formatPercent(lowIncome.gap, 1)} percentage points above the all-household baseline.
            </p>
            <div className="mt-6">
              <HouseholdsLowIncomeChartShell data={lowIncome} />
            </div>
          </article>

          <article className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_50px_rgba(19,31,22,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Marital status <GeographicScopeBadge scope="England & Wales" />
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
              Marital and civil partnership status, Census 2021
            </h2>
            <div className="mt-6">
              <MarriageChartShell data={marriage.rows} />
            </div>
          </article>
        </section>

        <section>
          <article className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_50px_rgba(19,31,22,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Wealth <GeographicScopeBadge scope="Great Britain" />
            </p>
            <div className="mt-2 inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700">
              WAS Round 7 ({wealth.latestLabel}) — oldest household dataset
            </div>
            <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
              Median total household wealth by ethnic group
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
              The median Black African household holds {formatCurrency(wealth.rows.find(r => r.key === "black_african")?.medianWealth ?? 0)} in
              total wealth, compared with {formatCurrency(wealth.rows.find(r => r.key === "all_ethnicities")?.medianWealth ?? 0)} for
              all households. Total wealth includes property, pensions, financial, and physical assets.
            </p>
            <div className="mt-6 max-w-2xl">
              <WealthChartShell data={wealth.rows} />
            </div>
          </article>
        </section>

        <SubcategoryGrid category="households" />
      </div>
    </main>
  );
}

function formatSignedPoints(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)} pts`;
}
