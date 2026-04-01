import { GeographicScopeBadge } from "@/components/geographic-scope-badge";
import { HeritageChartShell } from "@/components/heritage-chart-shell";
import { ReligionChartShell } from "@/components/religion-chart-shell";
import { TopicSnapshotCard } from "@/components/topic-snapshot-card";
import { loadHeritagePageData } from "@/lib/heritage-summary";
import { loadReligionPageData } from "@/lib/religion-summary";
import { loadTopicSnapshot } from "@/lib/topic-snapshots";

export default async function IdentityCivicLifePage() {
  const [politicsSnapshot, religionSnapshot, heritageSnapshot, religion, heritage] =
    await Promise.all([
      loadTopicSnapshot("culture-geography", "politics"),
      loadTopicSnapshot("culture-geography", "religion"),
      loadTopicSnapshot("culture-geography", "heritage-migration"),
      loadReligionPageData(),
      loadHeritagePageData(),
    ]);

  return (
    <main className="px-5 py-6 sm:px-8 lg:px-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="overflow-hidden rounded-[32px] border border-[var(--border)] bg-[var(--surface)] shadow-[0_24px_80px_rgba(19,31,22,0.08)]">
          <div className="grid gap-8 px-6 py-7 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:py-10">
            <div className="space-y-5">
              <div className="inline-flex w-fit items-center rounded-full border border-[var(--border)] bg-white/65 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                Identity & Civic Life
              </div>
              <div className="max-w-3xl space-y-4">
                <h1 className="font-[family-name:var(--font-newsreader)] text-5xl leading-none tracking-[-0.04em] text-[var(--foreground)] sm:text-6xl">
                  Religion, migration, and political representation in Black communities.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
                  Explore religious affiliation, country of birth, and
                  parliamentary representation for Black populations —
                  drawn from the Census 2021 and House of Commons data.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {politicsSnapshot?.stats[0] ? (
                <article className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                  <p className="text-sm font-medium text-[var(--muted)]">
                    {politicsSnapshot.stats[0].label}
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                    {politicsSnapshot.stats[0].value}
                  </p>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    {politicsSnapshot.stats[0].note}
                  </p>
                </article>
              ) : null}
              {religionSnapshot?.stats[0] ? (
                <article className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                  <p className="text-sm font-medium text-[var(--muted)]">
                    {religionSnapshot.stats[0].label}
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                    {religionSnapshot.stats[0].value}
                  </p>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    {religionSnapshot.stats[0].note}
                  </p>
                </article>
              ) : null}
              {heritageSnapshot?.stats[0] ? (
                <article className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-4 sm:col-span-2">
                  <p className="text-sm font-medium text-[var(--muted)]">
                    {heritageSnapshot.stats[0].label}
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                    {heritageSnapshot.stats[0].value}
                  </p>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    {heritageSnapshot.stats[0].note}
                  </p>
                </article>
              ) : null}
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <TopicSnapshotCard
            eyebrow="Civic life"
            title="Politics"
            description="Representation snapshot with a clear note on the official data gap."
            href="/culture-geography/politics"
            snapshot={politicsSnapshot}
          />
          <TopicSnapshotCard
            eyebrow="Belief"
            title="Religion"
            description="Census 2021 religion profile for the broad Black population."
            href="/culture-geography/religion"
            snapshot={religionSnapshot}
          />
          <TopicSnapshotCard
            eyebrow="Origin"
            title="Heritage & Migration"
            description="Country-of-birth profile for the broad Black population in England and Wales."
            href="/culture-geography/heritage-migration"
            snapshot={heritageSnapshot}
          />
        </section>
        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_50px_rgba(19,31,22,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Religion <GeographicScopeBadge scope="England & Wales" />
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
              Religious affiliation: Black vs all ethnicities
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Census 2021. Christianity is the dominant affiliation in the Black population at a much higher share than the national average.
            </p>
            <div className="mt-6">
              <ReligionChartShell data={religion.rows} />
            </div>
          </article>

          <article className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_50px_rgba(19,31,22,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Heritage & Migration <GeographicScopeBadge scope="England & Wales" />
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
              Country of birth distribution for the Black population
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Census 2021. Nearly half of the Black population were born in the United Kingdom.
            </p>
            <div className="mt-6">
              <HeritageChartShell data={heritage.rows} />
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
