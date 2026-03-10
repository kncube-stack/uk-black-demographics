"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";
import type { SearchEntry } from "@/lib/search-index";

type Props = {
  entries: SearchEntry[];
};

export function SearchPageClient({ entries }: Props) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = deferredQuery.trim().toLowerCase();

  const results = !normalizedQuery
    ? entries
    : entries.filter((entry) => {
        const haystack = [
          entry.title,
          entry.description,
          entry.type,
          ...entry.tags,
        ]
          .join(" ")
          .toLowerCase();

        return haystack.includes(normalizedQuery);
      });

  return (
    <div className="grid gap-6">
      <section className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_50px_rgba(19,31,22,0.06)]">
        <label
          htmlFor="site-search"
          className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]"
        >
          Search the site
        </label>
        <input
          id="site-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try: Black Caribbean exclusion rate"
          className="mt-4 w-full rounded-[22px] border border-[var(--border)] bg-white/80 px-5 py-4 text-base outline-none transition-colors placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
        />
        <p className="mt-3 text-sm text-[var(--muted)]">
          {normalizedQuery
            ? `${results.length} result${results.length === 1 ? "" : "s"} for “${deferredQuery}”`
            : `${entries.length} searchable pages, sections, and topics`}
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {results.map((entry) => (
          <Link
            key={`${entry.type}:${entry.href}`}
            href={entry.href}
            className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_16px_50px_rgba(19,31,22,0.06)] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_60px_rgba(19,31,22,0.08)]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
              {entry.type}
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em] text-[var(--foreground)]">
              {entry.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              {entry.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {entry.tags.slice(0, 4).map((tag) => (
                <span
                  key={`${entry.href}:${tag}`}
                  className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold text-[var(--muted)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
