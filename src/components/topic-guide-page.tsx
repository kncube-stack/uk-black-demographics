import Link from "next/link";
import { ResearchSourceCard } from "@/components/research-source-card";
import { SourceCard } from "@/components/source-card";
import {
  getCategoryRoute,
  getCategoryTitle,
  type TopicGuide,
} from "@/lib/topic-guides";
import type { TopicSnapshot } from "@/lib/topic-snapshots";

type Props = {
  guide: TopicGuide;
  snapshot: TopicSnapshot | null;
};

export function TopicGuidePage({ guide, snapshot }: Props) {
  const statusLabel =
    guide.status === "live"
      ? "Live data"
      : guide.status === "snapshot"
        ? "Data snapshot"
        : "Coming next";

  return (
    <main className="px-5 py-6 sm:px-8 lg:px-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="overflow-hidden rounded-[32px] border border-[var(--border)] bg-[var(--surface)] shadow-[0_24px_80px_rgba(19,31,22,0.08)]">
          <div className="grid gap-8 px-6 py-7 sm:px-8 lg:grid-cols-[1.16fr_0.84fr] lg:px-10 lg:py-10">
            <div className="space-y-5">
              <div className="flex flex-wrap gap-3">
                <Link
                  href={getCategoryRoute(guide.category)}
                  className="inline-flex items-center rounded-full border border-[var(--border)] bg-white/65 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]"
                >
                  {getCategoryTitle(guide.category)}
                </Link>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] ${
                    guide.status === "live"
                      ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                      : guide.status === "snapshot"
                        ? "bg-[#f1e5be] text-[#5d4c14]"
                        : "border border-[var(--border)] text-[var(--muted)]"
                  }`}
                >
                  {statusLabel}
                </span>
              </div>
              <div className="max-w-3xl space-y-4">
                <h1 className="font-[family-name:var(--font-newsreader)] text-5xl leading-none tracking-[-0.04em] text-[var(--foreground)] sm:text-6xl">
                  {guide.title}
                </h1>
                <p className="max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
                  {guide.summary}
                </p>
              </div>

              {snapshot ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {snapshot.stats.map((stat) => (
                    <article
                      key={stat.label}
                      className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-4"
                    >
                      <p className="text-sm font-medium text-[var(--muted)]">
                        {stat.label}
                      </p>
                      <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                        {stat.value}
                      </p>
                      <p className="mt-2 text-sm text-[var(--muted)]">{stat.note}</p>
                    </article>
                  ))}
                </div>
              ) : null}

              {guide.liveRoute ? (
                <Link
                  href={guide.liveRoute}
                  className="inline-flex w-fit rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[#f7f2e9] transition-opacity hover:opacity-90"
                >
                  Open live section
                </Link>
              ) : null}
            </div>

            {snapshot?.source ? (
              <SourceCard
                metadata={snapshot.source}
                eyebrow={guide.status === "snapshot" ? "Current snapshot" : "Current source"}
                downloadHref={snapshot.downloadHref}
              />
            ) : (
              <article className="rounded-[28px] bg-[#173022] p-6 text-[#f7f2e9] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b8d3c0]">
                  Current status
                </p>
                <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
                  {guide.targetDate
                    ? `Next build target: ${guide.targetDate}`
                    : "Official source base mapped"}
                </h2>
                <div className="mt-5 grid gap-3 text-sm leading-6 text-[#c8d7cb]">
                  <p>{guide.description}</p>
                  <p>{guide.summary}</p>
                </div>
              </article>
            )}
          </div>
        </section>

        {guide.caveats?.length ? (
          <section className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_50px_rgba(19,31,22,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Caveats
            </p>
            <div className="mt-4 grid gap-3 text-sm leading-7 text-[var(--muted)]">
              {guide.caveats.map((caveat) => (
                <p key={caveat}>{caveat}</p>
              ))}
            </div>
          </section>
        ) : null}

        {guide.sources?.length ? (
          <section className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_50px_rgba(19,31,22,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Source base
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
              Official sources mapped for this topic
            </h2>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {guide.sources.map((source) => (
                <ResearchSourceCard
                  key={`${source.publisher}-${source.title}`}
                  source={source}
                />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
