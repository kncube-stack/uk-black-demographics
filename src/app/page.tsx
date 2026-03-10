import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";
import { formatDataPoint, formatNumber } from "@/lib/format";
import { loadPopulationHomepageData } from "@/lib/population-summary";
import { PopulationRegionChartShell } from "@/components/population-region-chart-shell";

const STATUS_COPY = {
  population: "Live data",
  households: "Live + guides",
  economics: "Live data",
  education: "Live data",
  health: "Live + guides",
  "culture-geography": "Live + guides",
} as const;

export default async function Home() {
  const {
    headlineStats,
    englandAndWales,
    nationalBreakdown,
    regionalRows,
    topLocalAuthorities,
    source,
  } = await loadPopulationHomepageData();

  return (
    <main className="px-5 py-6 sm:px-8 lg:px-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="overflow-hidden rounded-[32px] border border-[var(--border)] bg-[var(--surface)] shadow-[0_24px_80px_rgba(19,31,22,0.08)] backdrop-blur">
          <div className="grid gap-10 px-6 py-7 sm:px-8 lg:grid-cols-[1.35fr_0.9fr] lg:px-10 lg:py-10">
            <div className="flex flex-col gap-6">
              <div className="inline-flex w-fit items-center rounded-full border border-[var(--border)] bg-white/65 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                UK Black Demographics
              </div>
              <div className="max-w-3xl space-y-4">
                <h1 className="font-[family-name:var(--font-newsreader)] text-5xl leading-none tracking-[-0.04em] text-[var(--foreground)] sm:text-6xl lg:text-7xl">
                  Official UK Black demographic data, built for citation rather
                  than vibes.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
                  All six categories are now live. The strongest current
                  official slices are charted directly, and every remaining
                  subcategory has a source-backed briefing page with official
                  links, caveats, and build guidance so the site stays useful
                  before coverage is fully saturated.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {headlineStats.map((stat) => (
                  <article
                    key={stat.label}
                    className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-4 shadow-[0_14px_40px_rgba(19,31,22,0.05)]"
                  >
                    <p className="text-sm font-medium text-[var(--muted)]">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">
                      {formatDataPoint(stat.value)}
                    </p>
                    <p className="mt-2 text-sm text-[var(--muted)]">
                      {stat.sublabel}
                    </p>
                    <p className="mt-3 text-xs uppercase tracking-[0.16em] text-[var(--accent)]">
                      {stat.source.publisher}
                    </p>
                  </article>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                {CATEGORIES.map((category, index) => (
                  <Link
                    key={category.slug}
                    href={`/${category.slug}`}
                    className={
                      index === 0
                        ? "inline-flex items-center rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[#f7f2e9] transition-opacity hover:opacity-90"
                        : "inline-flex items-center rounded-full border border-[var(--border)] bg-white/70 px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition-colors hover:bg-white"
                    }
                  >
                    Explore {category.title.toLowerCase()}
                  </Link>
                ))}
                <Link
                  href="/methodology"
                  className="inline-flex items-center rounded-full border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition-colors hover:bg-white/70"
                >
                  Read methodology
                </Link>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-4 rounded-[28px] bg-[#173022] p-6 text-[#f7f2e9] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b8d3c0]">
                  Current scope
                </p>
                <div>
                  <p className="text-sm text-[#c8d7cb]">
                    Core Black population
                  </p>
                  <p className="mt-1 text-4xl font-semibold tracking-[-0.05em]">
                    {formatNumber(englandAndWales.allBlack)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#c8d7cb]">
                    Including mixed White/Black groups
                  </p>
                  <p className="mt-1 text-4xl font-semibold tracking-[-0.05em]">
                    {formatNumber(englandAndWales.allBlackIncludingMixed)}
                  </p>
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/6 p-4">
                <p className="text-sm font-medium text-[#dce7df]">
                  Why the breakdown matters
                </p>
                <p className="mt-2 text-sm leading-6 text-[#c8d7cb]">
                  This project does not collapse UK Black demographics into one
                  undifferentiated category. Black African, Black Caribbean,
                  Other Black, and the two mixed White/Black groups remain
                  distinct whenever the underlying source allows it.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_50px_rgba(19,31,22,0.06)]">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                  Regional view
                </p>
                <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
                  Core Black population by region
                </h2>
              </div>
              <p className="text-sm text-[var(--muted)]">
                Census 2021 counts, sorted largest to smallest
              </p>
            </div>
            <div className="mt-6">
              <PopulationRegionChartShell data={regionalRows} />
            </div>
          </article>

          <article className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_50px_rgba(19,31,22,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              England and Wales mix
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
              National breakdown
            </h2>
            <div className="mt-6 grid gap-3">
              {nationalBreakdown.map((item) => (
                <div
                  key={item.key}
                  className="rounded-[22px] border border-[var(--border)] bg-[var(--surface-strong)] p-4"
                >
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-[var(--muted)]">
                        {item.label}
                      </p>
                      <p className="mt-1 text-2xl font-semibold tracking-[-0.04em]">
                        {formatNumber(item.value)}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-[var(--accent)]">
                      {item.share.toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <article className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_50px_rgba(19,31,22,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Local authorities
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
              Largest local-authority populations
            </h2>
            <div className="mt-6 overflow-hidden rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)]">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-[var(--border)] text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                    <th className="px-4 py-3 font-semibold">Area</th>
                    <th className="px-4 py-3 font-semibold">Core Black</th>
                    <th className="px-4 py-3 font-semibold">Share</th>
                  </tr>
                </thead>
                <tbody>
                  {topLocalAuthorities.map((row) => (
                    <tr
                      key={row.code}
                      className="border-b border-[var(--border)] last:border-b-0"
                    >
                      <td className="px-4 py-3 font-medium">{row.name}</td>
                      <td className="px-4 py-3">{formatNumber(row.allBlack)}</td>
                      <td className="px-4 py-3 text-[var(--muted)]">
                        {row.coreShare.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <div className="grid gap-6">
            <article
              id="coverage"
              className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_50px_rgba(19,31,22,0.06)]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                Coverage
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
                Sections and subcategory guides
              </h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {CATEGORIES.map((category) => (
                  <article
                    key={category.slug}
                    className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-lg font-semibold">{category.title}</h3>
                      <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
                        {STATUS_COPY[category.slug]}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                      {category.description}
                    </p>
                    <Link
                      href={`/${category.slug}`}
                      className="mt-4 inline-flex items-center text-sm font-semibold text-[var(--accent)]"
                    >
                      Open section
                    </Link>
                  </article>
                ))}
              </div>
              <p className="mt-6 text-sm leading-6 text-[var(--muted)]">
                Every category route is now live. Where a subcategory does not
                yet have a fully charted dataset, the route still exposes
                official source links, known data gaps, and the next best build
                path.
              </p>
            </article>

            <article className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_50px_rgba(19,31,22,0.06)]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                Source discipline
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
                What this build is optimising for
              </h2>
              <ul className="mt-6 space-y-3 text-sm leading-6 text-[var(--muted)]">
                <li>Official, citation-quality UK data before narrative polish.</li>
                <li>Explicit provenance on every dataset, including method and caveats.</li>
                <li>Disaggregated ethnic groups instead of a single undifferentiated Black category.</li>
                <li>Clear handling of structural UK data gaps where the state does not collect ethnicity directly.</li>
              </ul>
              <div className="mt-6 rounded-[22px] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                <p className="text-sm font-medium text-[var(--foreground)]">
                  Current source
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  {source.name}. Published {source.datePublished}. Coverage:{" "}
                  {source.geographicCoverage}. Reference date:{" "}
                  {source.referenceDate}.
                </p>
              </div>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
