import { promises as fs } from "fs";
import path from "path";

interface FreshnessEntry {
  id: string;
  title: string;
  source: string;
  lastUpdated: string;
  referencePeriod?: string;
  nextExpectedRelease: string;
  updateFrequency: string;
  ageYears: number;
  status: "current" | "aging" | "stale" | "historical";
  notes?: string;
}

interface FreshnessData {
  generatedAt: string;
  note?: string;
  datasets: FreshnessEntry[];
}

async function loadFreshnessData(): Promise<FreshnessData> {
  const filePath = path.join(process.cwd(), "data", "freshness.json");
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw) as FreshnessData;
}

const STATUS_STYLES: Record<string, string> = {
  current: "bg-emerald-100 text-emerald-800 border-emerald-200",
  aging: "bg-amber-100 text-amber-800 border-amber-200",
  stale: "bg-red-100 text-red-800 border-red-200",
  historical: "bg-slate-100 text-slate-700 border-slate-200",
};

export default async function DataFreshnessPage() {
  const data = await loadFreshnessData();
  const currentCount = data.datasets.filter((d) => d.status === "current").length;
  const agingCount = data.datasets.filter((d) => d.status === "aging").length;
  const staleCount = data.datasets.filter((d) => d.status === "stale").length;
  const historicalCount = data.datasets.filter((d) => d.status === "historical").length;

  return (
    <main className="px-5 py-6 sm:px-8 lg:px-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="overflow-hidden rounded-[32px] border border-[var(--border)] bg-[var(--surface)] shadow-[0_24px_80px_rgba(19,31,22,0.08)]">
          <div className="px-6 py-7 sm:px-8 lg:px-10 lg:py-10">
            <div className="space-y-5">
              <div className="inline-flex w-fit items-center rounded-full border border-[var(--border)] bg-white/65 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                Data freshness
              </div>
              <div className="max-w-3xl space-y-4">
                <h1 className="font-[family-name:var(--font-newsreader)] text-5xl leading-none tracking-[-0.04em] text-[var(--foreground)] sm:text-6xl">
                  How fresh is each dataset on this site?
                </h1>
                <p className="max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
                  Every dataset is tracked by the age of its reference period.
                  Green means the data covers a recent period, amber means it is
                  ageing, red means the reference period is over 4 years old, and
                  grey marks historical one-off publications with no planned update.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-4 max-w-xl">
                <article className="rounded-[24px] border border-emerald-200 bg-emerald-50 p-4 text-center">
                  <p className="text-3xl font-semibold tracking-[-0.04em] text-emerald-800">
                    {currentCount}
                  </p>
                  <p className="mt-1 text-sm font-medium text-emerald-700">Current</p>
                </article>
                <article className="rounded-[24px] border border-amber-200 bg-amber-50 p-4 text-center">
                  <p className="text-3xl font-semibold tracking-[-0.04em] text-amber-800">
                    {agingCount}
                  </p>
                  <p className="mt-1 text-sm font-medium text-amber-700">Aging</p>
                </article>
                <article className="rounded-[24px] border border-red-200 bg-red-50 p-4 text-center">
                  <p className="text-3xl font-semibold tracking-[-0.04em] text-red-800">
                    {staleCount}
                  </p>
                  <p className="mt-1 text-sm font-medium text-red-700">Stale</p>
                </article>
                <article className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 text-center">
                  <p className="text-3xl font-semibold tracking-[-0.04em] text-slate-700">
                    {historicalCount}
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-600">Historical</p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_50px_rgba(19,31,22,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
            All datasets
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
            {data.datasets.length} datasets tracked
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Last audited: {data.generatedAt}
          </p>
          <div className="mt-6 overflow-x-auto rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)]">
            <table className="w-full min-w-[1050px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[var(--border)] text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                  <th className="px-4 py-3 font-semibold">Dataset</th>
                  <th className="px-4 py-3 font-semibold">Source</th>
                  <th className="px-4 py-3 font-semibold">Published</th>
                  <th className="px-4 py-3 font-semibold">Covers</th>
                  <th className="px-4 py-3 font-semibold">Age</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Next expected</th>
                </tr>
              </thead>
              <tbody>
                {data.datasets
                  .slice()
                  .sort((a, b) => b.ageYears - a.ageYears)
                  .map((entry) => (
                    <tr
                      key={entry.id}
                      className="border-b border-[var(--border)] last:border-b-0"
                    >
                      <td className="px-4 py-3">
                        <span className="font-medium">{entry.title}</span>
                        {entry.notes ? (
                          <span className="mt-0.5 block text-xs text-[var(--muted)]">
                            {entry.notes}
                          </span>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--muted)]">
                        {entry.source}
                      </td>
                      <td className="px-4 py-3 text-sm">{entry.lastUpdated}</td>
                      <td className="px-4 py-3 text-sm text-[var(--muted)]">
                        {entry.referencePeriod ?? entry.updateFrequency}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {entry.ageYears.toFixed(1)} years
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${STATUS_STYLES[entry.status] ?? ""}`}
                        >
                          {entry.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--muted)]">
                        {entry.nextExpectedRelease}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
