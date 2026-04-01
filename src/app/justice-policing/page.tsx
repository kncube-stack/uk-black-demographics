import { CitationCard } from "@/components/citation-card";
import { CrimeChartShell } from "@/components/crime-chart-shell";
import { GeographicScopeBadge } from "@/components/geographic-scope-badge";
import { IncarcerationChartShell } from "@/components/incarceration-chart-shell";
import { TopicSnapshotCard } from "@/components/topic-snapshot-card";
import { loadCrimePageData } from "@/lib/crime-summary";
import { loadCulturePageData } from "@/lib/culture-summary";
import { formatPercent, formatRate } from "@/lib/format";
import { loadIncarcerationData } from "@/lib/incarceration-summary";
import { loadTopicSnapshot } from "@/lib/topic-snapshots";

export default async function JusticePolicingPage() {
  const [stopSearch, crime, incarceration, stopSearchSnapshot, crimeSnapshot, incarcerationSnapshot] =
    await Promise.all([
      loadCulturePageData(),
      loadCrimePageData(),
      loadIncarcerationData(),
      loadTopicSnapshot("culture-geography", "stop-search"),
      loadTopicSnapshot("culture-geography", "crime"),
      loadTopicSnapshot("culture-geography", "incarceration"),
    ]);

  return (
    <main className="px-5 py-6 sm:px-8 lg:px-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="overflow-hidden rounded-[32px] border border-[var(--border)] bg-[var(--surface)] shadow-[0_24px_80px_rgba(19,31,22,0.08)]">
          <div className="grid gap-8 px-6 py-7 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:px-10 lg:py-10">
            <div className="space-y-5">
              <div className="inline-flex w-fit items-center rounded-full border border-[var(--border)] bg-white/65 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                Justice & Policing
              </div>
              <div className="max-w-3xl space-y-4">
                <h1 className="font-[family-name:var(--font-newsreader)] text-5xl leading-none tracking-[-0.04em] text-[var(--foreground)] sm:text-6xl">
                  Policing, crime, and custody across Black communities.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
                  Explore stop-and-search rates, crime victimisation, and
                  prison-population data for Black communities in England
                  and Wales — each broken down by ethnic subgroup where the
                  official source allows.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <article className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                  <p className="text-sm font-medium text-[var(--muted)]">
                    Black stop and search rate
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                    {formatRate(stopSearch.headline.allBlackRate, 1_000)}
                  </p>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    {stopSearch.headline.disproportionalityRatio.toFixed(1)}x overall rate
                  </p>
                </article>
                <article className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                  <p className="text-sm font-medium text-[var(--muted)]">
                    Overall stop and search rate
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                    {formatRate(stopSearch.headline.overallRate, 1_000)}
                  </p>
                  <p className="mt-2 text-sm text-[var(--muted)]">{stopSearch.latestLabel}</p>
                </article>
                {crimeSnapshot?.stats[0] ? (
                  <article className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                    <p className="text-sm font-medium text-[var(--muted)]">
                      {crimeSnapshot.stats[0].label}
                    </p>
                    <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                      {crimeSnapshot.stats[0].value}
                    </p>
                    <p className="mt-2 text-sm text-[var(--muted)]">
                      {crimeSnapshot.stats[0].note}
                    </p>
                  </article>
                ) : null}
                {incarcerationSnapshot?.stats[0] ? (
                  <article className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                    <p className="text-sm font-medium text-[var(--muted)]">
                      {incarcerationSnapshot.stats[0].label}
                    </p>
                    <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                      {incarcerationSnapshot.stats[0].value}
                    </p>
                    <p className="mt-2 text-sm text-[var(--muted)]">
                      {incarcerationSnapshot.stats[0].note}
                    </p>
                  </article>
                ) : null}
              </div>
            </div>

            <CitationCard
              pageTitle="Justice & Policing"
              pagePath="/justice-policing"
              metadata={stopSearch.source}
              downloadHref={stopSearch.source.apiEndpoint}
              note="Use the topic cards below for the crime and incarceration snapshots. The stop-and-search route remains the full live policing view."
            />
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <TopicSnapshotCard
            eyebrow="Policing"
            title="Stop & Search"
            description="Long-run trend, disproportionality, legislation splits, and exact figures."
            href="/culture-geography/stop-search"
            snapshot={stopSearchSnapshot}
          />
          <TopicSnapshotCard
            eyebrow="Crime"
            title="Crime"
            description="Latest official victimisation snapshot from the CSEW."
            href="/culture-geography/crime"
            snapshot={crimeSnapshot}
          />
          <TopicSnapshotCard
            eyebrow="Custody"
            title="Incarceration"
            description="Official prison-population disparity snapshot while the fuller prison build is assembled."
            href="/culture-geography/incarceration"
            snapshot={incarcerationSnapshot}
          />
        </section>
        <section>
          <article className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_50px_rgba(19,31,22,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Crime victimisation <GeographicScopeBadge scope="England & Wales" />
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
              Adult victimisation rates by ethnic group, {crime.latestLabel}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
              Crime Survey for England and Wales. Rates include fraud and computer misuse. Confidence intervals are shown in tooltips.
            </p>
            <div className="mt-6 max-w-2xl">
              <CrimeChartShell data={crime.rows} />
            </div>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_50px_rgba(19,31,22,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Prison population <GeographicScopeBadge scope="England & Wales" />
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
              Black share of the prison population, {incarceration.latestLabel}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Black people make up {formatPercent(incarceration.blackRemandShare, 1)} of
              the remand population and {formatPercent(incarceration.blackSentencedShare, 1)} of
              sentenced prisoners — far above the ~4% population share.
            </p>
            <div className="mt-6">
              <IncarcerationChartShell data={incarceration} />
            </div>
          </article>

          <article className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_50px_rgba(19,31,22,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Context
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
              Understanding prison population data
            </h2>
            <div className="mt-5 grid gap-3 text-sm leading-7 text-[var(--muted)]">
              <p>
                The figures above come from the HMPPS Offender Equalities Annual Report
                and represent a snapshot at 31 March 2024.
              </p>
              <p>
                Ethnicity is self-declared by prisoners on reception. Not all prisoners
                have a recorded ethnicity, so shares are calculated from those with
                a declared ethnic group.
              </p>
              <p>
                The Black population of England and Wales is approximately 4% (Census 2021),
                making the prison overrepresentation ratio roughly 3x for both remand
                and sentenced populations.
              </p>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
