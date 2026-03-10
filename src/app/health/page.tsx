import { CitationCard } from "@/components/citation-card";
import { HealthDetentionRankingChartShell } from "@/components/health-detention-ranking-chart-shell";
import { HealthDetentionTrendChartShell } from "@/components/health-detention-trend-chart-shell";
import { SourceCard } from "@/components/source-card";
import { SubcategoryGrid } from "@/components/subcategory-grid";
import { formatNumber, formatRate } from "@/lib/format";
import { loadHealthPageData } from "@/lib/health-summary";

export default async function HealthPage() {
  const { latestLabel, previousLabel, headline, metricRows, trendRows, source } =
    await loadHealthPageData();
  const allBlackRow = metricRows.find((row) => row.key === "all_black");
  const blackCaribbeanRow = metricRows.find((row) => row.key === "black_caribbean");

  if (!allBlackRow || !blackCaribbeanRow) {
    throw new Error("Health summary is missing required comparison rows.");
  }

  return (
    <main className="px-5 py-6 sm:px-8 lg:px-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="overflow-hidden rounded-[32px] border border-[var(--border)] bg-[var(--surface)] shadow-[0_24px_80px_rgba(19,31,22,0.08)]">
          <div className="grid gap-8 px-6 py-7 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-10 lg:py-10">
            <div className="space-y-5">
              <div className="inline-flex w-fit items-center rounded-full border border-[var(--border)] bg-white/65 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                Health
              </div>
              <div className="max-w-3xl space-y-4">
                <h1 className="font-[family-name:var(--font-newsreader)] text-5xl leading-none tracking-[-0.04em] text-[var(--foreground)] sm:text-6xl">
                  Mental-health detentions are now live, with subgroup detail and uncertainty intact.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
                  The first live health slice uses official Mental Health Act detention
                  rates for England. It keeps Black African, Black Caribbean, Other
                  Black, and the mixed White/Black groups separate, and it keeps the
                  published confidence margins visible instead of smoothing them away.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <article className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                  <p className="text-sm font-medium text-[var(--muted)]">
                    All Black rate
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                    {formatRate(headline.allBlackRate, 100_000)}
                  </p>
                  <p className="mt-2 text-sm text-[var(--muted)]">{latestLabel}</p>
                </article>
                <article className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                  <p className="text-sm font-medium text-[var(--muted)]">
                    Black Caribbean
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                    {formatRate(headline.blackCaribbeanRate, 100_000)}
                  </p>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    {formatSignedDelta(blackCaribbeanRow.change)} vs {previousLabel ?? "previous release"}
                  </p>
                </article>
                <article className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                  <p className="text-sm font-medium text-[var(--muted)]">
                    Black African
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                    {formatRate(headline.blackAfricanRate, 100_000)}
                  </p>
                  <p className="mt-2 text-sm text-[var(--muted)]">Standardised rate</p>
                </article>
                <article className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                  <p className="text-sm font-medium text-[var(--muted)]">
                    Other Black
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                    {formatRate(headline.otherBlackRate, 100_000)}
                  </p>
                  <p className="mt-2 text-sm text-[var(--muted)]">Highest published tracked rate</p>
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
              Trend
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
              Published subgroup time series are limited, but the latest gap is still stark
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
              This chart uses only published standardised rates. The source has a
              longer run for Other Black, but most Black subgroup rows are latest-release
              only, so gaps indicate unavailable official series rather than missing processing.
            </p>
            <div className="mt-6">
              <HealthDetentionTrendChartShell data={trendRows} />
            </div>
          </article>

          <article className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_50px_rgba(19,31,22,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Read this carefully
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
              Why this page uses published standardised rates
            </h2>
            <div className="mt-5 grid gap-3 text-sm leading-7 text-[var(--muted)]">
              <p>
                Standardised rates are the right comparison field here because the
                age structure of groups differs materially.
              </p>
              <p>
                The source also publishes crude rates and counts, and both are
                still available in the exact-figures table for reference.
              </p>
              <p>
                The latest Ethnicity Facts and Figures release does not publish
                a comparable population denominator for every subgroup, so this
                page marks unpublished cells as unavailable rather than deriving
                them from rounded rates.
              </p>
              <p>
                This live route is still mental-health-specific, but maternal
                health now opens with a sourced snapshot and the remaining health
                gaps are labeled as coming next with their source base mapped.
              </p>
            </div>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <article className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_50px_rgba(19,31,22,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Latest ranking
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
              Other Black and Black Caribbean rates remain highest in the published series
            </h2>
            <div className="mt-6">
              <HealthDetentionRankingChartShell data={metricRows} />
            </div>
          </article>

          <CitationCard
            pageTitle="Health"
            pagePath="/health"
            metadata={source}
            downloadHref={source.apiEndpoint}
            note="If you cite a figure from this page, say that it is a Mental Health Act detention rate for England and specify that the chart uses the published standardised rate."
          />
        </section>

        <section className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_50px_rgba(19,31,22,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
            Exact figures
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
            Latest England detention metrics by group
          </h2>
          <div className="mt-6 overflow-x-auto rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)]">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[var(--border)] text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                  <th className="px-4 py-3 font-semibold">Group</th>
                  <th className="px-4 py-3 font-semibold">Std. rate</th>
                  <th className="px-4 py-3 font-semibold">Detentions</th>
                  <th className="px-4 py-3 font-semibold">Published population</th>
                  <th className="px-4 py-3 font-semibold">Confidence</th>
                  <th className="px-4 py-3 font-semibold">Change</th>
                </tr>
              </thead>
              <tbody>
                {metricRows.map((row) => (
                  <tr
                    key={row.key}
                    className="border-b border-[var(--border)] last:border-b-0"
                  >
                    <td className="px-4 py-3 font-medium">{row.label}</td>
                    <td className="px-4 py-3">{formatRate(row.rate, 100_000)}</td>
                    <td className="px-4 py-3">{formatNumber(row.detentions)}</td>
                    <td className="px-4 py-3">
                      {row.population === null ? "n/a" : formatNumber(row.population)}
                    </td>
                    <td className="px-4 py-3 text-[var(--muted)]">
                      {row.confidenceMargin === null ? "n/a" : `+/-${row.confidenceMargin.toFixed(1)}`}
                    </td>
                    <td className="px-4 py-3 text-[var(--muted)]">
                      {formatSignedDelta(row.change)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <SubcategoryGrid category="health" />
      </div>
    </main>
  );
}

function formatSignedDelta(value: number | null) {
  if (value === null) {
    return "n/a";
  }

  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)} pts`;
}
