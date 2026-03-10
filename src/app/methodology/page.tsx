import { loadImplementedSources } from "@/lib/source-registry";

export default async function MethodologyPage() {
  const sources = await loadImplementedSources();
  const liveSectionCount = new Set(
    sources.flatMap((source) => source.categories.map((category) => category.slug))
  ).size;

  return (
    <main className="px-5 py-6 sm:px-8 lg:px-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="overflow-hidden rounded-[32px] border border-[var(--border)] bg-[var(--surface)] shadow-[0_24px_80px_rgba(19,31,22,0.08)]">
          <div className="grid gap-8 px-6 py-7 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:py-10">
            <div className="space-y-5">
              <div className="inline-flex w-fit items-center rounded-full border border-[var(--border)] bg-white/65 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                Methodology
              </div>
              <div className="max-w-3xl space-y-4">
                <h1 className="font-[family-name:var(--font-newsreader)] text-5xl leading-none tracking-[-0.04em] text-[var(--foreground)] sm:text-6xl">
                  Built to be checked, not just read.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
                  This project prioritises official UK sources, explicit caveats,
                  and reproducible transformations. Every live section should
                  make it easy to trace a number back to its publication.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <article className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                <p className="text-sm font-medium text-[var(--muted)]">Implemented sources</p>
                <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                  {sources.length}
                </p>
              </article>
              <article className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                <p className="text-sm font-medium text-[var(--muted)]">Live sections</p>
                <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                  {liveSectionCount}
                </p>
              </article>
              <article className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                <p className="text-sm font-medium text-[var(--muted)]">Primary standard</p>
                <p className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
                  Official UK data
                </p>
              </article>
              <article className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                <p className="text-sm font-medium text-[var(--muted)]">Build rule</p>
                <p className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
                  Black groups stay distinct
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {[
            "Use official UK sources first and keep the publication link visible.",
            "Preserve disaggregated Black and mixed White/Black groups whenever the source supports them.",
            "If the source only publishes a broad Black category for a measure, say that explicitly instead of inventing subgroup precision.",
            "Keep caveats attached to the dataset instead of smoothing over data gaps or suppression.",
          ].map((principle) => (
            <article
              key={principle}
              className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_50px_rgba(19,31,22,0.06)]"
            >
              <p className="text-sm leading-7 text-[var(--foreground)]">{principle}</p>
            </article>
          ))}
        </section>

        <section className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_50px_rgba(19,31,22,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
            Implemented source registry
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
            Current publications in the site
          </h2>
          <div className="mt-6 grid gap-4">
            {sources.map((source) => (
              <article
                key={source.id}
                className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-5"
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-3xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                      {source.categories.map((category) => category.title).join(" · ")}
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                      {source.metadata.name}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                      {source.metadata.publisher}. Published {source.metadata.datePublished}.{" "}
                      {source.metadata.geographicCoverage}. {source.datasetCount} dataset
                      {source.datasetCount === 1 ? "" : "s"} currently use this source.
                    </p>
                  </div>

                  <a
                    href={source.metadata.url}
                    className="inline-flex w-fit items-center rounded-full border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition-colors hover:bg-white/70"
                  >
                    Open publication
                  </a>
                </div>

                {source.metadata.caveats?.length ? (
                  <div className="mt-4 grid gap-2 text-sm leading-6 text-[var(--muted)]">
                    {source.metadata.caveats.map((caveat) => (
                      <p key={caveat}>{caveat}</p>
                    ))}
                  </div>
                ) : null}

                <div className="mt-4 flex flex-wrap gap-2">
                  {source.datasets.map((dataset) => (
                    <span
                      key={dataset.id}
                      className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)]"
                    >
                      {dataset.siteCategory}: {dataset.siteSubcategory}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
