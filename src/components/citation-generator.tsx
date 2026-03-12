"use client";

import { useState } from "react";
import type { SourceMetadata } from "@/lib/types";

type Props = {
  pageTitle: string;
  pagePath: string;
  metadata: SourceMetadata;
};

type Style = "apa" | "mla" | "chicago";

export function CitationGenerator({ pageTitle, pagePath, metadata }: Props) {
  const [style, setStyle] = useState<Style>("apa");
  const [copied, setCopied] = useState(false);

  const year = new Date(metadata.datePublished).getFullYear() || new Date().getFullYear();
  const accessedDate = new Date(metadata.dateAccessed);
  const formattedAccessed = accessedDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const url = `https://ukblackdemographics.co.uk${pagePath}`;

  const citations: Record<Style, string> = {
    apa: `UK Black Demographics. (${year}). ${pageTitle}. ${url}`,
    mla: `"${pageTitle}." UK Black Demographics, ${metadata.publisher}, ${year}, ${url}.`,
    chicago: `"${pageTitle}." UK Black Demographics. Accessed ${formattedAccessed}. ${url}.`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(citations[style]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy citation:", err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 border-b border-[var(--border)] pb-1">
        {(["apa", "mla", "chicago"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStyle(s)}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
              style === s
                ? "border-b-2 border-[var(--accent)] text-[var(--accent)]"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="relative group">
        <div className="rounded-[18px] border border-[var(--border)] bg-[var(--surface-strong)] p-4 pr-12 text-sm leading-relaxed text-[var(--foreground)] select-all italic font-[family-name:var(--font-newsreader)]">
          {citations[style]}
        </div>
        <button
          onClick={copyToClipboard}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 border border-[var(--border)] shadow-sm transition-all hover:scale-105 active:scale-95"
          title="Copy to clipboard"
        >
          {copied ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--muted)]">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          )}
        </button>
      </div>

      <p className="text-[10px] text-[var(--muted)] uppercase tracking-widest font-bold">
        Academic & Journalistic reference standards applied
      </p>
    </div>
  );
}
