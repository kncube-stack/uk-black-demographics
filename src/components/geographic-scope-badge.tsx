type Props = {
  scope: string;
};

export function GeographicScopeBadge({ scope }: Props) {
  return (
    <span className="inline-flex items-center rounded-full border border-[var(--border)] bg-white/65 px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-[var(--muted)]">
      {scope}
    </span>
  );
}
