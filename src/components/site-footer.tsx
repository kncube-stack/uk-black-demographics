import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[rgba(255,250,242,0.72)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 py-8 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Citation-first build
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
              Every live slice should expose source provenance, release timing,
              geographic coverage, and caveats clearly enough to be cited and
              checked.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-sm font-semibold">
            <Link href="/key-findings" className="rounded-full px-3 py-2 hover:bg-white/70">
              Findings
            </Link>
            <Link href="/search" className="rounded-full px-3 py-2 hover:bg-white/70">
              Search
            </Link>
            <Link href="/population" className="rounded-full px-3 py-2 hover:bg-white/70">
              Population
            </Link>
            <Link href="/households" className="rounded-full px-3 py-2 hover:bg-white/70">
              Households
            </Link>
            <Link href="/economics" className="rounded-full px-3 py-2 hover:bg-white/70">
              Economics
            </Link>
            <Link href="/education" className="rounded-full px-3 py-2 hover:bg-white/70">
              Education
            </Link>
            <Link href="/health" className="rounded-full px-3 py-2 hover:bg-white/70">
              Health
            </Link>
            <Link href="/justice-policing" className="rounded-full px-3 py-2 hover:bg-white/70">
              Justice
            </Link>
            <Link href="/identity-civic-life" className="rounded-full px-3 py-2 hover:bg-white/70">
              Identity
            </Link>
            <Link href="/about" className="rounded-full px-3 py-2 hover:bg-white/70">
              About
            </Link>
            <Link href="/methodology" className="rounded-full px-3 py-2 hover:bg-white/70">
              Methodology
            </Link>
            <Link href="/culture-geography" className="rounded-full px-3 py-2 hover:bg-white/70">
              Legacy culture route
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
