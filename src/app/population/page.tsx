import Link from "next/link";
import { formatNumber } from "@/lib/format";
import { SourceCard } from "@/components/source-card";
import { loadPopulationPageData } from "@/lib/population-summary";
import { PopulationAgeProfileChartShell } from "@/components/population-age-profile-chart-shell";
import { PopulationSexCompositionChartShell } from "@/components/population-sex-composition-chart-shell";
import { SubcategoryGrid } from "@/components/subcategory-grid";

export default async function PopulationPage() {
  const { overall, sexRows, ageProfileRows, subgroupProfiles, source } =
    await loadPopulationPageData();

  const allBlackRow = sexRows.find((row) => row.key === "all_black");
  const under25Row = ageProfileRows.find((row) => row.key === "24-and-under");
  const largestAgeBand =
    [...ageProfileRows].sort(
      (left, right) => right.coreBlackCount - left.coreBlackCount
    )[0] ?? ageProfileRows[0];

  return (
    <main className="px-5 py-6 sm:px-8 lg:px-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="overflow-hidden rounded-[32px] border border-[var(--border)] bg-[var(--surface)] shadow-[0_24px_80px_rgba(19,31,22,0.08)] backdrop-blur">
          <div className="grid gap-8 px-6 py-7 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-10 lg:py-10">
            <div className="space-y-5">
              <Link
                href="/"
                className="inline-flex w-fit items-center rounded-full border border-[var(--border)] bg-white/65 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]"
              >
                Back to home
              </Link>
              <div className="max-w-3xl space-y-4">
                <h1 className="font-[family-name:var(--font-newsreader)] text-5xl leading-none tracking-[-0.04em] text-[var(--foreground)] sm:text-6xl">
                  Population
                </h1>
                <p className="max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
                  Explore the age and sex profile of Black African, Black
                  Caribbean, Other Black, and mixed White/Black populations
                  in England and Wales, from the Census 2021.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <article className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                  <p className="text-sm font-medium text-[var(--muted)]">
                    Core Black population
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                    {formatNumber(overall.allBlack)}
                  </p>
                </article>
                <article className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                  <p className="text-sm font-medium text-[var(--muted)]">
                    Female share
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                    {allBlackRow?.femaleShare.toFixed(1)}%
                  </p>
                </article>
                <article className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                  <p className="text-sm font-medium text-[var(--muted)]">
                    Largest age band
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                    {largestAgeBand?.label}
                  </p>
                </article>
                <article className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                  <p className="text-sm font-medium text-[var(--muted)]">
                    Under 25 share
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                    {under25Row?.coreBlackShare.toFixed(1)}%
                  </p>
                </article>
              </div>
            </div>

            <SourceCard metadata={source} downloadHref={source.apiEndpoint} />
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <article className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_50px_rgba(19,31,22,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Age profile
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
              The Black population skews younger than the overall population
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
              Bars show the share of each population that falls into each age
              band. This lets the age structure be compared directly instead of
              comparing raw counts alone.
            </p>
            <div className="mt-6">
              <PopulationAgeProfileChartShell data={ageProfileRows} />
            </div>
          </article>

          <article className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_50px_rgba(19,31,22,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Sex composition
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
              Female and male split by subgroup
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Shares are shown within each ethnic subgroup rather than against
              the whole population.
            </p>
            <div className="mt-6">
              <PopulationSexCompositionChartShell data={sexRows} />
            </div>
          </article>
        </section>

        <section className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_50px_rgba(19,31,22,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
            Subgroup profiles
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
            Quick read on each tracked group
          </h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-3 xl:grid-cols-5">
            {subgroupProfiles.map((group) => (
              <article
                key={group.key}
                className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-4"
              >
                <h3 className="text-lg font-semibold">{group.label}</h3>
                <p className="mt-3 text-sm text-[var(--muted)]">Total population</p>
                <p className="mt-1 text-2xl font-semibold tracking-[-0.04em]">
                  {formatNumber(group.total)}
                </p>
                <div className="mt-4 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                      Female
                    </p>
                    <p className="text-lg font-semibold">
                      {group.femaleShare.toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                      Under 25
                    </p>
                    <p className="text-lg font-semibold">
                      {group.under25Share.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <SubcategoryGrid category="population" />
      </div>
    </main>
  );
}
