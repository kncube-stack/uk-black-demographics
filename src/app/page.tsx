import Link from "next/link";
import { loadAllCategoryOverviews } from "@/lib/data-loader";
import { formatDataPoint, formatNumber } from "@/lib/format";
import { loadPopulationHomepageData } from "@/lib/population-summary";
import { getCategoryTitle, getTopicGuide } from "@/lib/topic-guides";
import { loadTopicSnapshot } from "@/lib/topic-snapshots";
import type { SiteCategory } from "@/lib/types";
import { PopulationRegionChartShell } from "@/components/population-region-chart-shell";

const FEATURED_TOPICS = [
  { category: "population", slug: "by-region" },
  { category: "households", slug: "housing" },
  { category: "economics", slug: "employment" },
  { category: "education", slug: "exclusions" },
  { category: "health", slug: "mental-health" },
  { category: "culture-geography", slug: "stop-search" },
] as const satisfies Array<{
  category: SiteCategory;
  slug: string;
}>;

export default async function Home() {
  const [
    {
      headlineStats,
      englandAndWales,
      nationalBreakdown,
      regionalRows,
      topLocalAuthorities,
      source,
    },
    categoryOverviews,
    featuredTopicResults,
  ] = await Promise.all([
    loadPopulationHomepageData(),
    loadAllCategoryOverviews(),
    Promise.all(
      FEATURED_TOPICS.map(async ({ category, slug }) => {
        const guide = getTopicGuide(category, slug);
        const snapshot = await loadTopicSnapshot(category, slug);

        if (!guide || !snapshot) {
          return null;
        }

        return {
          category,
          slug,
          categoryTitle: getCategoryTitle(category),
          guide,
          snapshot,
        };
      })
    ),
  ]);

  const featuredTopics = featuredTopicResults.flatMap((item) =>
    item === null ? [] : [item]
  );
  const breakdownRows = [...nationalBreakdown].sort(
    (left, right) => right.value - left.value
  );
  const quickFacts = headlineStats.slice(0, 3);
  const topRegion = regionalRows[0];

  return (
    <main className="px-5 py-6 sm:px-8 lg:px-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="relative overflow-hidden rounded-[40px] border border-[var(--border)] bg-[var(--surface)] shadow-[0_24px_80px_rgba(19,31,22,0.08)]">
          <div className="absolute inset-x-0 top-0 h-36 bg-[radial-gradient(circle_at_top_left,rgba(54,91,69,0.18),transparent_62%)]" />
          <div className="absolute -right-10 top-10 h-40 w-40 rounded-full bg-[rgba(122,127,55,0.12)] blur-3xl" />
          <div className="grid gap-10 px-6 py-8 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:px-10 lg:py-10">
            <div className="relative flex flex-col gap-7">
              <div className="inline-flex w-fit items-center rounded-full border border-[var(--border)] bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                Black Britain, by the numbers
              </div>

              <div className="max-w-4xl space-y-5">
                <h1 className="font-[family-name:var(--font-newsreader)] text-5xl leading-none tracking-[-0.045em] text-[var(--foreground)] sm:text-6xl lg:text-7xl">
                  Understand Black life in the UK through official data.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
                  Population, housing, work, education, health, and policing,
                  drawn from Census, Nomis, Department for Education, and
                  official government releases. Start with the big picture, then
                  drill into the topic that brought you here.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/population"
                  className="inline-flex items-center rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[#f7f2e9] transition-opacity hover:opacity-90"
                >
                  Start with population
                </Link>
                <a
                  href="#snapshots"
                  className="inline-flex items-center rounded-full border border-[var(--border)] bg-white/72 px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition-colors hover:bg-white"
                >
                  Browse data snapshots
                </a>
                <Link
                  href="/methodology"
                  className="inline-flex items-center rounded-full border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition-colors hover:bg-white/70"
                >
                  How to cite this site
                </Link>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {quickFacts.map((stat) => (
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
                  </article>
                ))}
              </div>
            </div>

            <aside className="relative rounded-[32px] bg-[#173022] p-6 text-[#f7f2e9] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b8d3c0]">
                Census 2021
              </p>
              <p className="mt-4 font-[family-name:var(--font-newsreader)] text-5xl leading-none tracking-[-0.05em] sm:text-6xl">
                {formatNumber(englandAndWales.allBlackIncludingMixed)}
              </p>
              <p className="mt-4 max-w-xl text-base leading-7 text-[#dce7df]">
                people in England and Wales identified as Black or in a mixed
                White/Black group, about {englandAndWales.inclusiveShare.toFixed(1)}
                % of the population.
              </p>

              <div className="mt-8 space-y-3 rounded-[24px] border border-white/10 bg-white/6 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-[#dce7df]">
                    Population mix
                  </p>
                  <p className="text-xs uppercase tracking-[0.16em] text-[#b8d3c0]">
                    England and Wales
                  </p>
                </div>
                {breakdownRows.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-end justify-between gap-4 border-t border-white/10 pt-3 first:border-t-0 first:pt-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-[#f7f2e9]">
                        {item.label}
                      </p>
                      <p className="text-sm text-[#b8d3c0]">
                        {formatNumber(item.value)}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-[#f1d389]">
                      {item.share.toFixed(1)}%
                    </p>
                  </div>
                ))}
              </div>

              <p className="mt-6 text-xs leading-6 text-[#b8d3c0]">
                Source: {source.name}. Published {source.datePublished}. Reference
                date {source.referenceDate}.
              </p>
            </aside>
          </div>
        </section>

        <section
          id="snapshots"
          className="rounded-[36px] border border-[var(--border)] bg-[var(--surface)] px-6 py-7 shadow-[0_16px_50px_rgba(19,31,22,0.06)] sm:px-8"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                Latest official snapshots
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-4xl tracking-[-0.04em] text-[var(--foreground)]">
                Start with the subject, not the source file
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-[var(--muted)]">
              Each section opens with charts, exact figures, and the official
              publication behind the numbers.
            </p>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {categoryOverviews.map((overview) => {
              const primary = overview.headlines[0];
              const secondary = overview.headlines.slice(1, 3);

              return (
                <Link
                  key={overview.category}
                  href={`/${overview.category}`}
                  className="group rounded-[28px] border border-[var(--border)] bg-[var(--surface-strong)] p-5 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_60px_rgba(19,31,22,0.08)]"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                    {overview.title}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                    {overview.description}
                  </p>

                  {primary ? (
                    <div className="mt-6 rounded-[24px] bg-white/70 p-4">
                      <p className="text-sm font-medium text-[var(--muted)]">
                        {primary.label}
                      </p>
                      <p className="mt-2 text-4xl font-semibold tracking-[-0.05em] text-[var(--foreground)]">
                        {formatDataPoint(primary.value)}
                      </p>
                      <p className="mt-2 text-sm text-[var(--muted)]">
                        {primary.sublabel}
                      </p>
                    </div>
                  ) : null}

                  <div className="mt-4 grid gap-3">
                    {secondary.map((stat) => (
                      <div
                        key={stat.label}
                        className="flex items-end justify-between gap-4 rounded-[20px] border border-[var(--border)] bg-white/55 p-4"
                      >
                        <div>
                          <p className="text-sm font-medium text-[var(--foreground)]">
                            {stat.label}
                          </p>
                          <p className="mt-1 text-sm text-[var(--muted)]">
                            {stat.sublabel}
                          </p>
                        </div>
                        <p className="text-base font-semibold text-[var(--accent)]">
                          {formatDataPoint(stat.value)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center justify-between text-sm font-semibold text-[var(--accent)]">
                    <span>Explore section</span>
                    <span>{overview.subcategories.length} topics</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
          <article className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_50px_rgba(19,31,22,0.06)]">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                  Geography
                </p>
                <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
                  Where Black populations are largest
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
              Places to start
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
              Largest local-authority populations
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              {topRegion
                ? `${topRegion.name} has the largest regional core Black population, while these local authorities hold the largest absolute counts.`
                : "These local authorities hold the largest absolute counts."}
            </p>

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
                  {topLocalAuthorities.slice(0, 10).map((row) => (
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

            <Link
              href="/population/by-local-authority"
              className="mt-5 inline-flex items-center text-sm font-semibold text-[var(--accent)]"
            >
              Explore the population topic
            </Link>
          </article>
        </section>

        <section className="rounded-[36px] border border-[var(--border)] bg-[var(--surface)] px-6 py-7 shadow-[0_16px_50px_rgba(19,31,22,0.06)] sm:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                Popular entry points
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-4xl tracking-[-0.04em] text-[var(--foreground)]">
                Start with the question people actually ask
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-[var(--muted)]">
              These topic pages are built to help a reader get oriented fast,
              then move into the underlying section for more detail.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featuredTopics.map((item) => (
              <Link
                key={`${item.category}:${item.slug}`}
                href={`/${item.category}/${item.slug}`}
                className="group rounded-[28px] border border-[var(--border)] bg-[var(--surface-strong)] p-5 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_60px_rgba(19,31,22,0.08)]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                  {item.categoryTitle}
                </p>
                <h3 className="mt-3 text-2xl font-[family-name:var(--font-newsreader)] tracking-[-0.04em] text-[var(--foreground)]">
                  {item.guide.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  {item.guide.description}
                </p>

                <div className="mt-5 grid gap-3">
                  {item.snapshot.stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-[20px] border border-[var(--border)] bg-white/60 p-4"
                    >
                      <p className="text-sm font-medium text-[var(--muted)]">
                        {stat.label}
                      </p>
                      <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">
                        {stat.value}
                      </p>
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        {stat.note}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between text-sm font-semibold text-[var(--accent)]">
                  <span>Open topic page</span>
                  <span>Official source linked</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
          <article className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_50px_rgba(19,31,22,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Why people use this site
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
              Made for readers who need numbers they can repeat with confidence
            </h2>
            <div className="mt-6 grid gap-3 text-sm leading-7 text-[var(--muted)]">
              <p>
                Journalists, students, campaigners, researchers, teachers, and
                community organisations often need one thing from demographic
                data: a number that is real, legible, and easy to trace.
              </p>
              <p>
                This homepage is meant to help people start quickly, while each
                section page keeps the exact figures, caveats, and official source
                links close to the chart.
              </p>
              <p>
                Where the UK statistical system has gaps, the site says so
                plainly instead of pretending the data is more complete than it
                is.
              </p>
            </div>
          </article>

          <article className="rounded-[30px] bg-[#173022] p-6 text-[#f7f2e9] shadow-[0_16px_50px_rgba(19,31,22,0.10)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b8d3c0]">
              Citation ready
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em] text-[#f7f2e9]">
              Every figure should be easy to check
            </h2>
            <div className="mt-5 grid gap-3 text-sm leading-7 text-[#dce7df]">
              <p>Every live route pairs charts with exact figures and a source block.</p>
              <p>
                Methodology pages are public because the provenance matters just
                as much as the headline number.
              </p>
              <p>
                Black African, Black Caribbean, Other Black, and the mixed
                White/Black groups stay distinct whenever the source supports it.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/methodology"
                className="inline-flex items-center rounded-full bg-[#f7f2e9] px-5 py-3 text-sm font-semibold text-[#173022] transition-opacity hover:opacity-90"
              >
                Read the methodology
              </Link>
              <Link
                href="/education"
                className="inline-flex items-center rounded-full border border-white/14 px-5 py-3 text-sm font-semibold text-[#f7f2e9] transition-colors hover:bg-white/8"
              >
                See a live section
              </Link>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
