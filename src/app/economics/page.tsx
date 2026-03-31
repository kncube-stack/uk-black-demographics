import { CitationCard } from "@/components/citation-card";
import { EconomicsOccupationChartShell } from "@/components/economics-occupation-chart-shell";
import { EconomicsRateComparisonChartShell } from "@/components/economics-rate-comparison-chart-shell";
import { EconomicsRegionChartShell } from "@/components/economics-region-chart-shell";
import { SourceCard } from "@/components/source-card";
import { SubcategoryGrid } from "@/components/subcategory-grid";
import { formatPercent } from "@/lib/format";
import { loadEconomicsPageData } from "@/lib/economics-summary";

export default async function EconomicsPage() {
  const {
    latestLabel,
    previousLabel,
    headline,
    comparisonRows,
    sexRows,
    regionRows,
    occupationRows,
    source,
  } = await loadEconomicsPageData();

  const femaleRow = sexRows.find((row) => row.key === "female");
  const maleRow = sexRows.find((row) => row.key === "male");
  const topRegion = regionRows[0];
  const professionalRow = occupationRows.find((row) => row.key === "professional");
  const caringRow = occupationRows.find((row) => row.key === "caring_leisure_service");

  if (!femaleRow || !maleRow || !topRegion || !professionalRow || !caringRow) {
    throw new Error("Economics summary is missing required rows.");
  }

  return (
    <main className="px-5 py-6 sm:px-8 lg:px-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="overflow-hidden rounded-[32px] border border-[var(--border)] bg-[var(--surface)] shadow-[0_24px_80px_rgba(19,31,22,0.08)]">
          <div className="grid gap-8 px-6 py-7 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-10 lg:py-10">
            <div className="space-y-5">
              <div className="inline-flex w-fit items-center rounded-full border border-[var(--border)] bg-white/65 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                Economics
              </div>
              <div className="max-w-3xl space-y-4">
                <h1 className="font-[family-name:var(--font-newsreader)] text-5xl leading-none tracking-[-0.04em] text-[var(--foreground)] sm:text-6xl">
                  Employment, unemployment, and occupations by ethnicity.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
                  The live economics slice starts with official APS labour-market
                  rates and occupation shares for the United Kingdom. This source
                  is current and machine-readable, but for these measures it only
                  exposes a broad Black or Black British group rather than separate
                  Black African, Black Caribbean, and Other Black series.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <article className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                  <p className="text-sm font-medium text-[var(--muted)]">
                    Black employment rate
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                    {formatPercent(headline.blackEmploymentRate, 1)}
                  </p>
                  <p className="mt-2 text-sm text-[var(--muted)]">{latestLabel}</p>
                </article>
                <article className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                  <p className="text-sm font-medium text-[var(--muted)]">
                    Black unemployment rate
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                    {formatPercent(headline.blackUnemploymentRate, 1)}
                  </p>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    {formatSignedPoints(
                      headline.blackUnemploymentRate -
                        comparisonRows.find((row) => row.key === "unemployment_rate")!.overallRate
                    )}{" "}
                    vs UK overall
                  </p>
                </article>
                <article className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                  <p className="text-sm font-medium text-[var(--muted)]">
                    Black inactivity rate
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                    {formatPercent(headline.blackInactivityRate, 1)}
                  </p>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    {formatSignedPoints(
                      headline.blackInactivityRate -
                        comparisonRows.find((row) => row.key === "inactivity_rate")!.overallRate
                    )}{" "}
                    vs UK overall
                  </p>
                </article>
                <article className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                  <p className="text-sm font-medium text-[var(--muted)]">
                    Black women employment
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                    {formatPercent(femaleRow.employmentRate, 1)}
                  </p>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    Black men: {formatPercent(maleRow.employmentRate, 1)}
                  </p>
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
              UK comparison
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
              Black labour-market rates still trail the UK employment baseline
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
              The latest comparable APS year is {latestLabel}. This page keeps the
              Black-vs-overall comparison explicit and uses {previousLabel} as the
              previous release reference point for quality checks.
            </p>
            <div className="mt-6">
              <EconomicsRateComparisonChartShell data={comparisonRows} />
            </div>
          </article>

          <article className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_50px_rgba(19,31,22,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Read this carefully
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
              What this economics page does and does not claim
            </h2>
            <div className="mt-5 grid gap-3 text-sm leading-7 text-[var(--muted)]">
              <p>
                APS figures are survey estimates, not administrative counts, so
                confidence margins matter more than they do on the Census-backed
                population pages.
              </p>
              <p>
                The current live official percentage series groups Black people as
                Black or Black British for these measures. We are not presenting
                subgroup splits that the source does not publish here.
              </p>
              <p>
                Local-authority APS estimates are not live yet because the
                published confidence margins become too wide for a robust first
                release.
              </p>
            </div>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_50px_rgba(19,31,22,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Regional view
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
              Published Black employment rates vary sharply across UK regions
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              The highest published rate in the current release is {topRegion.name} at{" "}
              {formatPercent(topRegion.blackEmploymentRate, 1)}. Tooltips show the
              area-wide baseline and the APS confidence margin so small-sample
              estimates are easy to read cautiously.
            </p>
            <div className="mt-6">
              <EconomicsRegionChartShell data={regionRows} />
            </div>
          </article>

          <article className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_50px_rgba(19,31,22,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Occupation profile
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
              Professional and caring roles carry a larger share of Black employment
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              In the latest APS release, professional roles account for{" "}
              {formatPercent(professionalRow.blackShare, 1)} of employed Black workers,
              while caring and leisure roles account for {formatPercent(caringRow.blackShare, 1)}.
            </p>
            <div className="mt-6">
              <EconomicsOccupationChartShell data={occupationRows} />
            </div>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
          <article className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_50px_rgba(19,31,22,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Sex split
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
              Men and women are close on employment, with higher female inactivity
            </h2>
            <div className="mt-6 grid gap-4">
              {[femaleRow, maleRow].map((row) => (
                <article
                  key={row.key}
                  className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-5"
                >
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-[var(--muted)]">
                        {row.label}
                      </p>
                      <p className="mt-1 text-2xl font-semibold tracking-[-0.04em]">
                        {formatPercent(row.employmentRate, 1)}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-[var(--accent)]">
                      Employment
                    </p>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                        Unemployment
                      </p>
                      <p className="mt-1 text-lg font-semibold">
                        {formatPercent(row.unemploymentRate, 1)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                        Inactivity
                      </p>
                      <p className="mt-1 text-lg font-semibold">
                        {formatPercent(row.inactivityRate, 1)}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </article>

          <CitationCard
            pageTitle="Economics"
            pagePath="/economics"
            metadata={source}
            downloadHref={source.apiEndpoint}
            note="If you cite a number from this page, include the route, the APS reference period, and the fact that the current labour-market slice uses the published broad Black or Black British series."
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
          <article className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_50px_rgba(19,31,22,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Exact figures
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
              Latest UK comparison
            </h2>
            <div className="mt-6 overflow-x-auto rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)]">
              <table className="w-full min-w-[520px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-[var(--border)] text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                    <th className="px-4 py-3 font-semibold">Metric</th>
                    <th className="px-4 py-3 font-semibold">Black</th>
                    <th className="px-4 py-3 font-semibold">All ethnicities</th>
                    <th className="px-4 py-3 font-semibold">Gap</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr
                      key={row.key}
                      className="border-b border-[var(--border)] last:border-b-0"
                    >
                      <td className="px-4 py-3 font-medium">{row.label}</td>
                      <td className="px-4 py-3">{formatPercent(row.blackRate, 1)}</td>
                      <td className="px-4 py-3">
                        {formatPercent(row.overallRate, 1)}
                      </td>
                      <td className="px-4 py-3 text-[var(--muted)]">
                        {formatSignedPoints(row.gap)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_50px_rgba(19,31,22,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Regional table
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
              Employment rates by region and country
            </h2>
            <div className="mt-6 overflow-x-auto rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)]">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-[var(--border)] text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                    <th className="px-4 py-3 font-semibold">Area</th>
                    <th className="px-4 py-3 font-semibold">Black employment</th>
                    <th className="px-4 py-3 font-semibold">Area overall</th>
                    <th className="px-4 py-3 font-semibold">Gap</th>
                    <th className="px-4 py-3 font-semibold">Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {regionRows.map((row) => (
                    <tr
                      key={row.code}
                      className="border-b border-[var(--border)] last:border-b-0"
                    >
                      <td className="px-4 py-3 font-medium">{row.name}</td>
                      <td className="px-4 py-3">
                        {formatPercent(row.blackEmploymentRate, 1)}
                      </td>
                      <td className="px-4 py-3">
                        {formatPercent(row.overallEmploymentRate, 1)}
                      </td>
                      <td className="px-4 py-3 text-[var(--muted)]">
                        {formatSignedPoints(row.employmentGap)}
                      </td>
                      <td className="px-4 py-3 text-[var(--muted)]">
                        +/-{row.blackEmploymentConfidenceMargin.toFixed(1)} pts
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </section>

        <SubcategoryGrid category="economics" />
      </div>
    </main>
  );
}

function formatSignedPoints(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)} pts`;
}
