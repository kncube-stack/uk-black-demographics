import { CitationCard } from "@/components/citation-card";
import { CultureStopSearchRateChartShell } from "@/components/culture-stop-search-rate-chart-shell";
import { CultureStopSearchTrendChartShell } from "@/components/culture-stop-search-trend-chart-shell";
import { SourceCard } from "@/components/source-card";
import { SubcategoryGrid } from "@/components/subcategory-grid";
import { formatNumber, formatPercent, formatRate } from "@/lib/format";
import { loadCulturePageData } from "@/lib/culture-summary";

export default async function CultureGeographyPage() {
  const {
    latestLabel,
    previousLabel,
    headline,
    metricRows,
    trendRows,
    legislationRows,
    source,
  } = await loadCulturePageData();
  const allBlackRow = metricRows.find((row) => row.key === "all_black");
  const overallRow = metricRows.find((row) => row.key === "all_ethnicities");

  if (!allBlackRow || !overallRow) {
    throw new Error("Culture summary is missing required comparison rows.");
  }

  return (
    <main className="px-5 py-6 sm:px-8 lg:px-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="overflow-hidden rounded-[32px] border border-[var(--border)] bg-[var(--surface)] shadow-[0_24px_80px_rgba(19,31,22,0.08)]">
          <div className="grid gap-8 px-6 py-7 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-10 lg:py-10">
            <div className="space-y-5">
              <div className="inline-flex w-fit items-center rounded-full border border-[var(--border)] bg-white/65 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                Culture & Geography
              </div>
              <div className="max-w-3xl space-y-4">
                <h1 className="font-[family-name:var(--font-newsreader)] text-5xl leading-none tracking-[-0.04em] text-[var(--foreground)] sm:text-6xl">
                  Stop and search, plus routes into justice and identity data.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
                  This page holds the full stop-and-search breakdown. For
                  policing and prison data see Justice &amp; Policing; for
                  religion, migration, and representation see Identity &amp;
                  Civic Life.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <article className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                  <p className="text-sm font-medium text-[var(--muted)]">
                    All Black rate
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                    {formatRate(headline.allBlackRate, 1_000)}
                  </p>
                  <p className="mt-2 text-sm text-[var(--muted)]">{latestLabel}</p>
                </article>
                <article className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                  <p className="text-sm font-medium text-[var(--muted)]">
                    Overall rate
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                    {formatRate(headline.overallRate, 1_000)}
                  </p>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    England and Wales baseline
                  </p>
                </article>
                <article className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                  <p className="text-sm font-medium text-[var(--muted)]">
                    Disproportionality
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                    {headline.disproportionalityRatio.toFixed(1)}x
                  </p>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    vs overall rate
                  </p>
                </article>
                <article className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                  <p className="text-sm font-medium text-[var(--muted)]">
                    Black Caribbean
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                    {formatRate(headline.blackCaribbeanRate, 1_000)}
                  </p>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    {previousLabel ? `Compared with ${previousLabel}` : latestLabel}
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
              Long run
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
              The Black stop-and-search rate has stayed above the overall baseline across the series
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
              The latest year remains high even after the longer post-2014 fall in
              overall stop and search volume.
            </p>
            <div className="mt-6">
              <CultureStopSearchTrendChartShell data={trendRows} />
            </div>
          </article>

          <article className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_50px_rgba(19,31,22,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Read this carefully
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
              What this page currently covers
            </h2>
            <div className="mt-5 grid gap-3 text-sm leading-7 text-[var(--muted)]">
              <p>
                The public-facing navigation now splits this material into Justice & Policing
                and Identity & Civic Life because those topics are easier to browse separately.
              </p>
              <p>
                This page keeps the national all-force England and Wales stop-and-search
                data live, including British Transport Police and legislation splits.
              </p>
              <p>
                Crime, incarceration, politics, religion, and heritage topics now open
                with sourced snapshot pages rather than empty placeholders.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
              <a
                href="/justice-policing"
                className="rounded-full bg-[var(--accent)] px-4 py-2 text-[#f7f2e9]"
              >
                Justice & Policing
              </a>
              <a
                href="/identity-civic-life"
                className="rounded-full border border-[var(--border)] px-4 py-2"
              >
                Identity & Civic Life
              </a>
            </div>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <article className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_50px_rgba(19,31,22,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Latest ranking
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
              Latest rates by group
            </h2>
            <div className="mt-6">
              <CultureStopSearchRateChartShell data={metricRows} />
            </div>
          </article>

          <CitationCard
            pageTitle="Culture and Geography"
            pagePath="/culture-geography"
            metadata={source}
            downloadHref={source.apiEndpoint}
            note="If you cite this page, note that the live policing slice uses the England and Wales all-force stop-and-search rows including British Transport Police."
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
          <article className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_50px_rgba(19,31,22,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Legislation split
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
              Black searches remain concentrated under Police and Criminal Evidence Act (PACE) section 1
            </h2>
            <div className="mt-6 grid gap-4">
              {legislationRows.map((row) => (
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
                        {formatPercent(row.blackShareOfSearches, 1)}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-[var(--accent)]">
                      Black share of all searches
                    </p>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                        Black searches
                      </p>
                      <p className="mt-1 text-lg font-semibold">
                        {formatNumber(row.blackCount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                        All searches
                      </p>
                      <p className="mt-1 text-lg font-semibold">
                        {formatNumber(row.totalCount)}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </article>

          <article className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_50px_rgba(19,31,22,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Exact figures
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
              Latest stop-and-search rates
            </h2>
            <div className="mt-6 overflow-x-auto rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)]">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-[var(--border)] text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                    <th className="px-4 py-3 font-semibold">Group</th>
                    <th className="px-4 py-3 font-semibold">Rate</th>
                    <th className="px-4 py-3 font-semibold">Searches</th>
                    <th className="px-4 py-3 font-semibold">Population</th>
                    <th className="px-4 py-3 font-semibold">Gap</th>
                    <th className="px-4 py-3 font-semibold">Times more likely</th>
                  </tr>
                </thead>
                <tbody>
                  {metricRows.map((row) => (
                    <tr
                      key={row.key}
                      className="border-b border-[var(--border)] last:border-b-0"
                    >
                      <td className="px-4 py-3 font-medium">{row.label}</td>
                      <td className="px-4 py-3">{formatRate(row.rate, 1_000)}</td>
                      <td className="px-4 py-3">{formatNumber(row.count)}</td>
                      <td className="px-4 py-3">{formatNumber(row.population)}</td>
                      <td className="px-4 py-3 text-[var(--muted)]">
                        {formatRate(row.gapToOverall, 1_000)}
                      </td>
                      <td className="px-4 py-3 text-[var(--muted)]">
                        {row.disproportionalityRatio === null
                          ? "n/a"
                          : `${row.disproportionalityRatio.toFixed(1)}x`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </section>

        <SubcategoryGrid category="culture-geography" />
      </div>
    </main>
  );
}
