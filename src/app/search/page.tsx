import { SearchPageClient } from "@/components/search-page-client";
import { getSearchIndex } from "@/lib/search-index";

export default function SearchPage() {
  const entries = getSearchIndex();

  return (
    <main className="px-5 py-6 sm:px-8 lg:px-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="rounded-[32px] border border-[var(--border)] bg-[var(--surface)] px-6 py-7 shadow-[0_24px_80px_rgba(19,31,22,0.08)] sm:px-8 lg:px-10 lg:py-10">
          <div className="inline-flex w-fit items-center rounded-full border border-[var(--border)] bg-white/65 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
            Search
          </div>
          <div className="mt-5 max-w-3xl space-y-4">
            <h1 className="font-[family-name:var(--font-newsreader)] text-5xl leading-none tracking-[-0.04em] text-[var(--foreground)] sm:text-6xl">
              Find the stat or topic without navigating the whole taxonomy.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
              Search works across sections, topic pages, and key reference pages so
              someone looking for a specific question can get straight to it.
            </p>
          </div>
        </section>

        <SearchPageClient entries={entries} />
      </div>
    </main>
  );
}
