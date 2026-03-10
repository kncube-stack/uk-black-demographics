import type { TopicSource } from "@/lib/topic-guides";

type Props = {
  source: TopicSource;
};

export function ResearchSourceCard({ source }: Props) {
  return (
    <article className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
        {source.publisher}
      </p>
      <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
        {source.title}
      </h3>
      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{source.detail}</p>
      <a
        href={source.url}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex rounded-full border border-[var(--border)] px-4 py-2 text-sm font-semibold transition-colors hover:bg-white/70"
      >
        Open source
      </a>
    </article>
  );
}
