import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="px-5 py-6 sm:px-8 lg:px-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <section className="rounded-[32px] border border-[var(--border)] bg-[var(--surface)] px-6 py-7 shadow-[0_24px_80px_rgba(19,31,22,0.08)] sm:px-8 lg:px-10 lg:py-10">
          <div className="inline-flex w-fit items-center rounded-full border border-[var(--border)] bg-white/65 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
            About
          </div>
          <div className="mt-5 max-w-4xl space-y-4">
            <h1 className="font-[family-name:var(--font-newsreader)] text-5xl leading-none tracking-[-0.04em] text-[var(--foreground)] sm:text-6xl">
              A citation-first reference site for Black life in the UK.
            </h1>
            <p className="max-w-3xl text-base leading-7 text-[var(--muted)] sm:text-lg">
              This project exists to make official UK data on Black populations easier
              to find, compare, and cite without flattening important subgroup differences
              or pretending the statistical system is more complete than it is.
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_50px_rgba(19,31,22,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Editorial stance
            </p>
            <div className="mt-4 grid gap-3 text-sm leading-7 text-[var(--muted)]">
              <p>
                The site prefers official and citation-grade sources first: ONS, Nomis,
                Department for Education, Race Disparity Unit, Ministry of Justice,
                UKHSA, and other public statistical bodies.
              </p>
              <p>
                It keeps Black African, Black Caribbean, Other Black, and mixed
                White/Black groups separate whenever the source allows. When an official
                dataset collapses those groups into a broad Black category, the site says so plainly.
              </p>
              <p>
                Where the UK data system has structural gaps, the site does not fill them
                with guesswork. It either shows a sourced snapshot with caveats or labels
                the topic as coming next.
              </p>
            </div>
          </article>

          <article className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_50px_rgba(19,31,22,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              How to use it
            </p>
            <div className="mt-4 grid gap-3 text-sm leading-7 text-[var(--muted)]">
              <p>
                If you need the quickest overview, start on{" "}
                <Link href="/key-findings" className="font-semibold text-[var(--accent)]">
                  Key Findings
                </Link>
                .
              </p>
              <p>
                If you need a specific stat, use{" "}
                <Link href="/search" className="font-semibold text-[var(--accent)]">
                  Search
                </Link>
                .
              </p>
              <p>
                If you need to cite a figure publicly, open the relevant topic page and
                use the source block and citation card on that route.
              </p>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
