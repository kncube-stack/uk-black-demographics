import { CitationCard } from "@/components/citation-card";

export default function MethodologyPage() {
  const metadata: any = {
    id: "site-methodology",
    name: "UK Black Demographics Methodology",
    publisher: "UK Black Demographics",
    url: "https://ukblackdemographics.co.uk/methodology",
    datePublished: "2026-03-12",
    dateAccessed: new Date().toISOString(),
    referenceDate: "2026-03-12",
    referencePeriod: "2026",
    geographicCoverage: "United Kingdom",
    methodology: "Internal site standards for data aggregation and presentation.",
    qualityFlags: ["official_statistic"],
    license: "Custom",
    fetchMethod: "manual_transcription",
  };

  return (
    <main className="px-5 py-6 sm:px-8 lg:px-12">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-10">
        <header className="space-y-4">
          <div className="inline-flex items-center rounded-full border border-[var(--border)] bg-white/65 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
            Reference standards
          </div>
          <h1 className="font-[family-name:var(--font-newsreader)] text-5xl leading-none tracking-[-0.04em] text-[var(--foreground)] sm:text-7xl">
            Technical Methodology
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-[var(--muted)]">
            Our commitment to academic and journalistic rigor starts with how we handle, merge, and define official data.
          </p>
        </header>

        <section className="space-y-8">
          <div className="space-y-4">
            <h2 className="font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
              1. The "Official Source" Mandate
            </h2>
            <div className="prose prose-stone leading-7 text-[var(--muted)]">
              <p>
                To maintain status as a reliable data hub, we exclusively use data from official UK public bodies (ONS, DWP, DfE, MoJ, etc.). We do not use "gray literature," unverified research, or proprietary datasets unless they are explicitly cited as supplementary contextual material.
              </p>
              <p>
                Each topic page includes a direct link to the primary publication and, where available, the official API endpoint or raw data file used to generate our snapshots.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
              2. Defining Ethnic Subgroups
            </h2>
            <div className="prose prose-stone leading-7 text-[var(--muted)]">
              <p>
                We adhere to the ONS Harmonised Standards for ethnicity. Unless otherwise stated:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li><strong>All Black:</strong> Includes Black African, Black Caribbean, and any other Black background.</li>
                <li><strong>Mixed Heritage:</strong> Specifically refers to individuals of mixed White and Black backgrounds, unless the broad "Mixed" category is the only one provided.</li>
                <li><strong>Comparator:</strong> We typically use "White British" as the primary comparator group to measure systemic disparity against the ethnic majority.</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
              3. Geographic Coverage & Limitations
            </h2>
            <div className="prose prose-stone leading-7 text-[var(--muted)]">
              <p>
                Users should note that UK statistics are often devolved:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li><strong>Policing & Justice:</strong> Data typically covers **England and Wales** only.</li>
                <li><strong>Education:</strong> Data typically reflects the **English** school system.</li>
                <li><strong>Census:</strong> Our 2021 snapshots use the **England and Wales** release, as the Scottish census was conducted a year later (2022).</li>
              </ul>
              <p className="italic">
                Each page footer includes a geographic scope badge to ensure correct interpretation.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
              4. Handling Data Gaps & Proxies
            </h2>
            <div className="prose prose-stone leading-7 text-[var(--muted)]">
              <p>
                Where official data on Black life is structurally missing (e.g., Black-owned business counts or ethnicity on marriage certificates), we use the following hierarchy:
              </p>
              <ol className="list-decimal space-y-2 pl-5">
                <li><strong>Official Proxies:</strong> Using self-employment and "Company Director" survey data until official firm-level records exist.</li>
                <li><strong>Explicit Acknowledgment:</strong> We state the gap clearly rather than using unverified third-party estimates.</li>
              </ol>
            </div>
          </div>
        </section>

        <section className="mb-12 mt-6">
          <CitationCard
            pageTitle="Methodology"
            pagePath="/methodology"
            metadata={metadata}
            note="This methodology is subject to annual review and update in line with ONS release cycles."
          />
        </section>
      </div>
    </main>
  );
}
