import Link from "next/link";
import type { TopicSnapshot } from "@/lib/topic-snapshots";

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  snapshot: TopicSnapshot | null;
};

export function TopicSnapshotCard({
  eyebrow,
  title,
  description,
  href,
  snapshot,
}: Props) {
  return (
    <Link
      href={href}
      className="group rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_16px_50px_rgba(19,31,22,0.06)] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_60px_rgba(19,31,22,0.08)]"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
        {eyebrow}
      </p>
      <h3 className="mt-3 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em] text-[var(--foreground)]">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{description}</p>

      {snapshot ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {snapshot.stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-[20px] border border-[var(--border)] bg-[var(--surface-strong)] p-4"
            >
              <p className="text-sm font-medium text-[var(--muted)]">{stat.label}</p>
              <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-[var(--muted)]">{stat.note}</p>
            </div>
          ))}
        </div>
      ) : null}

      <div className="mt-5 flex items-center justify-between text-sm font-semibold text-[var(--accent)]">
        <span>Open topic</span>
        <span>{snapshot?.downloadHref ? "CSV available" : "Source linked"}</span>
      </div>
    </Link>
  );
}
