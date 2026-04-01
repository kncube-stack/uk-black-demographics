import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import Link from "next/link";

export const metadata = {
  title: "Developer API & Data Explorer | UK Black Demographics",
  description: "Programmatic access to the UK Black Demographics data library.",
};

export default function DataExplorerPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fcfaf7] text-[#1a1a1a]">
      <SiteHeader />

      <main className="flex-grow container mx-auto px-6 py-16 max-w-4xl">
        <header className="mb-12">
          <h1 className="font-[family-name:var(--font-newsreader)] text-5xl tracking-[-0.04em] mb-4">
            Data Explorer & API
          </h1>
          <p className="text-xl text-[var(--muted)] leading-relaxed">
            Programmatic access to our curated datasets for researchers, journalists, and developers.
          </p>
        </header>

        <section className="space-y-12">
          <div className="space-y-4">
            <h2 className="font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
              1. The Data Manifest
            </h2>
            <div className="prose prose-stone leading-7 text-[var(--muted)]">
              <p>
                To explore all available datasets programmatically, fetch our central manifest. This file is updated every time the platform is built.
              </p>
              <pre className="bg-[#173022] text-[#f7f2e9] p-4 rounded-xl overflow-x-auto text-sm mt-4">
                <code>GET /api/datasets.json</code>
              </pre>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
              2. Fetching Raw JSON
            </h2>
            <div className="prose prose-stone leading-7 text-[var(--muted)]">
              <p>
                Each dataset in the manifest includes a <code>rawPath</code>. You can fetch these files directly from our repository to get the full, cleaned data structures.
              </p>
              <div className="bg-[#173022] text-[#f7f2e9] p-6 rounded-2xl space-y-4 mt-6">
                <p className="text-xs uppercase tracking-widest text-[#b8d3c0] font-bold">Example Fetch (JavaScript)</p>
                <pre className="text-sm overflow-x-auto">
{`const response = await fetch('https://ukblackdemographics.co.uk/api/datasets.json');
const { datasets } = await response.json();

// Find and fetch the employment data
const employmentData = datasets.find(d => d.id === 'ons-employment-by-ethnicity');
const rawResponse = await fetch(\`https://ukblackdemographics.co.uk\${employmentData.rawPath}\`);
const data = await rawResponse.json();`}
                </pre>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
              3. Local Persistence
            </h2>
            <div className="prose prose-stone leading-7 text-[var(--muted)]">
              <p>
                Our data lives in the <code>/data</code> directory of our open-source repository. If you are conducting large-scale analysis, we recommend cloning the repository to access the full data processing pipeline and raw JSON assets.
              </p>
              <div className="flex gap-4 mt-6">
                <a 
                  href="https://github.com/kncube-stack/uk-black-demographics" 
                  target="_blank"
                  className="inline-flex items-center rounded-full bg-[#173022] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1a3a2a]"
                >
                  GitHub Repository
                </a>
                <Link 
                  href="/api/datasets.json"
                  className="inline-flex items-center rounded-full border border-[#173022]/10 px-6 py-3 text-sm font-semibold transition-colors hover:bg-black/5"
                >
                  View Manifest (JSON)
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
