import Link from "next/link";
import { loadKeyFindings } from "@/lib/key-findings";

export default async function KeyFindingsPage() {
  const findings = await loadKeyFindings();

  return (
    <main className="px-5 py-6 sm:px-8 lg:px-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="rounded-[32px] border border-[var(--border)] bg-[var(--surface)] px-6 py-7 shadow-[0_24px_80px_rgba(19,31,22,0.08)] sm:px-8 lg:px-10 lg:py-10">
          <div className="inline-flex w-fit items-center rounded-full border border-[var(--border)] bg-white/65 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
            At a glance
          </div>
          <div className="mt-5 max-w-4xl space-y-4">
            <h1 className="font-[family-name:var(--font-newsreader)] text-5xl leading-none tracking-[-0.04em] text-[var(--foreground)] sm:text-6xl">
              The fastest way to understand what the official data is actually saying.
            </h1>
            <p className="max-w-3xl text-base leading-7 text-[var(--muted)] sm:text-lg">
              These findings are written for readers who need the headline quickly,
              with a direct route into the underlying page, exact figures, and source note.
            </p>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-2">
          {findings.map((finding) => (
            <article
              key={finding.id}
              id={finding.id}
              className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_16px_50px_rgba(19,31,22,0.06)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                  {finding.eyebrow}
                </p>
                <a
                  href={`#${finding.id}`}
                  className="text-sm font-semibold text-[var(--accent)]"
                >
                  Permalink
                </a>
              </div>
              <h2 className="mt-3 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em] text-[var(--foreground)]">
                {finding.title}
              </h2>
              <div className="mt-5 rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                <p className="text-4xl font-semibold tracking-[-0.05em] text-[var(--foreground)]">
                  {finding.stat}
                </p>
                <p className="mt-2 text-sm font-medium text-[var(--accent)]">
                  {finding.comparison}
                </p>
              </div>
              <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
                {finding.summary}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3 text-sm font-semibold">
                <Link
                  href={finding.href}
                  className="rounded-full bg-[var(--accent)] px-4 py-2 text-[#f7f2e9]"
                >
                  Open topic
                </Link>
                <span className="text-[var(--muted)]">{finding.sourceLabel}</span>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
