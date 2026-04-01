"use client";

import { useState } from "react";

type Props = {
  data: any;
  filename: string;
  csvHref?: string;
  variant?: "ghost" | "solid" | "outline" | "soft";
};

export function DataExportButtons({ data, filename, csvHref, variant = "outline" }: Props) {
  const [exporting, setExporting] = useState(false);

  const exportJson = () => {
    setExporting(true);
    try {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export JSON:", err);
    } finally {
      setTimeout(() => setExporting(false), 500);
    }
  };

  const buttonClasses = variant === "solid"
    ? "bg-white/10 px-4 py-2 text-[#f7f2e9] hover:bg-white/16"
    : variant === "soft"
      ? "bg-[var(--accent-soft)] px-4 py-2 text-[var(--accent)] hover:opacity-90"
      : "border border-[var(--border)] px-4 py-2 text-[var(--muted)] hover:bg-white/70";

  return (
    <div className="flex flex-wrap gap-2 text-sm font-semibold">
      {csvHref ? (
        <a
          href={csvHref}
          target="_blank"
          rel="noreferrer"
          className={`rounded-full transition-colors flex items-center gap-2 ${buttonClasses}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          CSV
        </a>
      ) : null}
      <button
        onClick={exportJson}
        disabled={exporting}
        className={`rounded-full transition-colors flex items-center gap-2 ${buttonClasses} disabled:opacity-50`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        {exporting ? "Exporting..." : "JSON"}
      </button>
    </div>
  );
}
