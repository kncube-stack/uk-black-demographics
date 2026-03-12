import Link from "next/link";
import { PopulationRegionChartShell } from "@/components/population-region-chart-shell";
import { formatNumber } from "@/lib/format";
import { loadKeyFindings } from "@/lib/key-findings";
import { loadPopulationHomepageData } from "@/lib/population-summary";
import { loadTopicSnapshot } from "@/lib/topic-snapshots";

const FINDING_PREVIEW_IDS = [
  "home-ownership-gap",
  "employment-gap",
  "university-entry",
  "maternal-mortality",
  "stop-search-gap",
  "uk-born-share",
] as const;

const SECTION_CARD_CONFIG = [
  {
    href: "/population",
    title: "Population",
    description: "Counts, age profile, region, and local authority distribution.",
    snapshotKey: ["population", "age-distribution"] as const,
  },
  {
    href: "/households",
    title: "Households",
    description: "Housing, income pressure, poverty, marriage, and wealth context.",
    snapshotKey: ["households", "housing"] as const,
  },
  {
    href: "/economics",
    title: "Economics",
    description: "Employment, unemployment, inactivity, occupation, and pay context.",
    snapshotKey: ["economics", "employment"] as const,
  },
  {
    href: "/education",
    title: "Education",
    description: "Qualifications, school results, higher education, and exclusions.",
    snapshotKey: ["education", "university"] as const,
  },
  {
    href: "/health",
    title: "Health",
    description: "Mental health, maternal health, and the next health wave.",
    snapshotKey: ["health", "maternal-health"] as const,
  },
  {
    href: "/justice-policing",
    title: "Justice & Policing",
    description: "Stop and search, crime victimisation, and incarceration snapshots.",
    snapshotKey: ["culture-geography", "stop-search"] as const,
  },
  {
    href: "/identity-civic-life",
    title: "Identity & Civic Life",
    description: "Religion, heritage, migration, and representation.",
    snapshotKey: ["culture-geography", "heritage-migration"] as const,
  },
] as const;

export default async function Home() {
  const [population, findings, sectionCards] = await Promise.all([
    loadPopulationHomepageData(),
    loadKeyFindings(),
    Promise.all(
      SECTION_CARD_CONFIG.map(async (item) => ({
        ...item,
        snapshot: await loadTopicSnapshot(
          item.snapshotKey[0],
          item.snapshotKey[1]
        ),
      }))
    ),
  ]);

  const previewFindings = FINDING_PREVIEW_IDS.flatMap((id) => {
    const finding = findings.find((candidate) => candidate.id === id);
    return finding ? [finding] : [];
  });
  const topRegion = population.regionalRows[0];

  return (
    <main className="px-5 py-6 sm:px-8 lg:px-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="relative overflow-hidden rounded-[40px] border border-[var(--border)] bg-[var(--surface)] shadow-[0_24px_80px_rgba(19,31,22,0.08)]">
          <div className="absolute inset-x-0 top-0 h-36 bg-[radial-gradient(circle_at_top_left,rgba(54,91,69,0.18),transparent_62%)]" />
          <div className="absolute -right-10 top-10 h-40 w-40 rounded-full bg-[rgba(122,127,55,0.12)] blur-3xl" />
          <div className="grid gap-10 px-6 py-8 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:px-10 lg:py-10">
            <div className="relative flex flex-col gap-7">
              <div className="inline-flex w-fit items-center rounded-full border border-[var(--border)] bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                UK Black Demographics
              </div>

              <div className="max-w-4xl space-y-5">
                <h1 className="font-[family-name:var(--font-newsreader)] text-5xl leading-none tracking-[-0.045em] text-[var(--foreground)] sm:text-6xl lg:text-7xl">
                  The clear, comprehensive data hub for Black life in the UK.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
                  Explore official statistics and clear insights that uncover the shape,
                  strength, and realities of our communities—with the source right beside the number.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/key-findings"
                  className="inline-flex items-center rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[#f7f2e9] transition-opacity hover:opacity-90"
                >
                  Read key findings
                </Link>
                <Link
                  href="/search"
                  className="inline-flex items-center rounded-full border border-[var(--border)] bg-white/72 px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition-colors hover:bg-white"
                >
                  Search the site
                </Link>
                <Link
                  href="/methodology"
                  className="inline-flex items-center rounded-full border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition-colors hover:bg-white/70"
                >
                  See methodology
                </Link>
              </div>
            </div>

            <aside className="relative rounded-[32px] bg-[#173022] p-6 text-[#f7f2e9] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b8d3c0]">
                Census 2021
              </p>
              <p className="mt-4 font-[family-name:var(--font-newsreader)] text-5xl leading-none tracking-[-0.05em] sm:text-6xl">
                {formatNumber(population.englandAndWales.allBlackIncludingMixed)}
              </p>
              <p className="mt-4 max-w-xl text-base leading-7 text-[#dce7df]">
                people in England and Wales identified as Black or in a mixed White/Black group,
                around {population.englandAndWales.inclusiveShare.toFixed(1)}% of the population.
              </p>

              <div className="mt-8 grid gap-3">
                <article className="rounded-[24px] border border-white/10 bg-white/6 p-4">
                  <p className="text-sm font-medium text-[#dce7df]">
                    Core Black population
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                    {formatNumber(population.englandAndWales.allBlack)}
                  </p>
                  <p className="mt-2 text-sm text-[#b8d3c0]">
                    {population.englandAndWales.coreShare.toFixed(1)}% of England and Wales
                  </p>
                </article>
                <article className="rounded-[24px] border border-white/10 bg-white/6 p-4">
                  <p className="text-sm font-medium text-[#dce7df]">
                    Largest regional population
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                    {topRegion?.name ?? "London"}
                  </p>
                  <p className="mt-2 text-sm text-[#b8d3c0]">
                    {topRegion ? `${formatNumber(topRegion.allBlack)} core Black residents` : "Census 2021"}
                  </p>
                </article>
              </div>

              <p className="mt-6 text-xs leading-6 text-[#b8d3c0]">
                Source: {population.source.name}. Published {population.source.datePublished}. Reference date {population.source.referenceDate}.
              </p>
            </aside>
          </div>
        </section>

        <section className="rounded-[36px] border border-[var(--border)] bg-[var(--surface)] px-6 py-7 shadow-[0_16px_50px_rgba(19,31,22,0.06)] sm:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                Key Insights
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-4xl tracking-[-0.04em] text-[var(--foreground)]">
                The numbers shaping our communities today.
              </h2>
            </div>
            <Link href="/key-findings" className="text-sm font-semibold text-[var(--accent)]">
              View all findings
            </Link>
          </div>

          <div className="mt-8 grid gap-4 xl:grid-cols-3">
            {previewFindings.map((finding) => (
              <article
                key={finding.id}
                id={`home-${finding.id}`}
                className="rounded-[28px] border border-[var(--border)] bg-[var(--surface-strong)] p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                    {finding.eyebrow}
                  </p>
                  <a href={`/key-findings#${finding.id}`} className="text-sm font-semibold text-[var(--accent)]">
                    Permalink
                  </a>
                </div>
                <h3 className="mt-3 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em] text-[var(--foreground)]">
                  {finding.stat}
                </h3>
                <p className="mt-2 text-sm font-semibold text-[var(--accent)]">
                  {finding.comparison}
                </p>
                <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
                  {finding.title}
                </p>
                <Link
                  href={finding.href}
                  className="mt-5 inline-flex items-center text-sm font-semibold text-[var(--accent)]"
                >
                  Open topic
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[36px] border border-[var(--border)] bg-[var(--surface)] px-6 py-7 shadow-[0_16px_50px_rgba(19,31,22,0.06)] sm:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                Explore the site
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-4xl tracking-[-0.04em] text-[var(--foreground)]">
                Context matters: Every data point is grounded in reality.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-[var(--muted)]">
              The aim is to answer "compared to what?" before you have to hunt for the context.
            </p>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {sectionCards.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-[28px] border border-[var(--border)] bg-[var(--surface-strong)] p-5 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_60px_rgba(19,31,22,0.08)]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                  {item.title}
                </p>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                  {item.description}
                </p>
                {item.snapshot?.stats[0] ? (
                  <div className="mt-6 rounded-[24px] bg-white/70 p-4">
                    <p className="text-sm font-medium text-[var(--muted)]">
                      {item.snapshot.stats[0].label}
                    </p>
                    <p className="mt-2 text-4xl font-semibold tracking-[-0.05em] text-[var(--foreground)]">
                      {item.snapshot.stats[0].value}
                    </p>
                    <p className="mt-2 text-sm text-[var(--muted)]">
                      {item.snapshot.stats[0].note}
                    </p>
                  </div>
                ) : null}
                {item.snapshot?.stats[1] ? (
                  <div className="mt-4 rounded-[20px] border border-[var(--border)] bg-white/55 p-4">
                    <p className="text-sm font-medium text-[var(--foreground)]">
                      {item.snapshot.stats[1].label}
                    </p>
                    <p className="mt-2 text-lg font-semibold text-[var(--accent)]">
                      {item.snapshot.stats[1].value}
                    </p>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {item.snapshot.stats[1].note}
                    </p>
                  </div>
                ) : null}

                <div className="mt-6 flex items-center justify-between text-sm font-semibold text-[var(--accent)]">
                  <span>Open section</span>
                  <span>{item.snapshot?.downloadHref ? "CSV available" : "Source linked"}</span>
                </div>
              </Link>
            ))}
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
              <PopulationRegionChartShell data={population.regionalRows} />
            </div>
          </article>

          <article className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_50px_rgba(19,31,22,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Local authority view
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
              Largest local-authority populations
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Birmingham leads on absolute core Black population, but the full local table matters for concentration and context.
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
                  {population.topLocalAuthorities.slice(0, 10).map((row) => (
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
              Explore the local authority topic
            </Link>
          </article>
        </section>
      </div>
    </main>
  );
}
