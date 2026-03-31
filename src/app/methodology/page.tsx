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
        <header className="space-y-4 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center rounded-full border border-[var(--border)] bg-white/65 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
            Our approach
          </div>
          <h1 className="font-[family-name:var(--font-newsreader)] text-5xl leading-none tracking-[-0.04em] text-[var(--foreground)] sm:text-7xl">
            How we handle the data
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-[var(--muted)]">
            Every number on this site comes from an official source. Here is exactly how we select, merge, and present it.
          </p>
        </header>

        <section className="mb-4 rounded-[32px] bg-[#173022] p-8 text-[#f7f2e9] shadow-xl">
          <h2 className="font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em] mb-4">
            Plain English Summary
          </h2>
          <div className="grid gap-8 md:grid-cols-2 text-[#dce7df] text-base leading-relaxed">
            <div className="space-y-4">
              <p>
                <strong>We only use official sources.</strong> Every number on this site comes directly from the ONS, UK Government departments, or accredited agencies. We do not use third-party polls or unsourced blog figures.
              </p>
              <p>
                <strong>Transparency by default.</strong> If a number looks high or low, you can click "Open Publication" to see the original government report it was taken from.
              </p>
            </div>
            <div className="space-y-4">
              <p>
                <strong>We account for gaps.</strong> Sometimes the government doesn't collect data on ethnicity for certain topics. When that happens, we clearly mark the data as a "proxy" or acknowledge the gap rather than making guesses.
              </p>
              <p>
                <strong>Built for checking.</strong> Every chart has an "Export" button so you can take the raw numbers and verify them in your own spreadsheet.
              </p>
            </div>
          </div>
        </section>

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

          <div className="space-y-4">
            <h2 className="font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
              5. Statistical Precision & Quality
            </h2>
            <div className="prose prose-stone leading-7 text-[var(--muted)]">
              <p>
                We distinguish between "Census" (full population counts) and "Survey" (estimates) data:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li><strong>Quality Badges:</strong> We display ONS designations (National, Official, or Experimental) to indicate the level of methodological maturity.</li>
                <li><strong>Confidence Intervals (CIs):</strong> For survey data, we display a 95% confidence interval where available (e.g., ±0.4%). This represents the margin of error researchers must account for.</li>
                <li><strong>Data Quality:</strong> Census Day snapshots represent hard counts and do not carry error margins, whereas Annual Population Survey (APS) data always carries statistical uncertainty.</li>
              </ul>
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
