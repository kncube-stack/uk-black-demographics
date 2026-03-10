import Link from "next/link";
import type { SourceMetadata } from "@/lib/types";

type Props = {
  pageTitle: string;
  pagePath: string;
  metadata: SourceMetadata;
  note?: string;
  downloadHref?: string;
};

const LONG_DATE_FORMAT = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "long",
});

export function CitationCard({
  pageTitle,
  pagePath,
  metadata,
  note,
  downloadHref,
}: Props) {
  const accessedDate = formatLongDate(metadata.dateAccessed);
  const reference = metadata.referencePeriod ?? metadata.referenceDate;
  const csvHref = downloadHref ?? metadata.apiEndpoint;

  return (
    <article className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_50px_rgba(19,31,22,0.06)]">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
        How to cite
      </p>
      <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
        Suggested citation wording
      </h2>
      <p className="mt-4 rounded-[22px] border border-[var(--border)] bg-[var(--surface-strong)] p-4 text-sm leading-7 text-[var(--foreground)]">
        UK Black Demographics. &ldquo;{pageTitle}.&rdquo; Based on{" "}
        {metadata.publisher}, <em>{metadata.name}</em>. Reference period {reference}.
        Accessed {accessedDate}. Route {pagePath}.
      </p>
      {note ? (
        <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{note}</p>
      ) : null}
      <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold">
        <a
          href={metadata.url}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-[var(--border)] px-4 py-2 transition-colors hover:bg-white/70"
        >
          Primary publication
        </a>
        {csvHref ? (
          <a
            href={csvHref}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-[var(--border)] px-4 py-2 transition-colors hover:bg-white/70"
          >
            Download CSV
          </a>
        ) : null}
        <Link
          href="/methodology"
          className="rounded-full bg-[var(--accent)] px-4 py-2 text-[#f7f2e9] transition-opacity hover:opacity-90"
        >
          Methodology
        </Link>
      </div>
    </article>
  );
}

function formatLongDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return LONG_DATE_FORMAT.format(date);
}
