import Link from "next/link";
import type { SourceMetadata } from "@/lib/types";
import { DataExportButtons } from "./data-export-buttons";

type Props = {
  metadata: SourceMetadata;
  eyebrow?: string;
  downloadHref?: string;
};

export function SourceCard({
  metadata,
  eyebrow = "Source",
  downloadHref,
}: Props) {
  return (
    <article className="rounded-[28px] bg-[#173022] p-6 text-[#f7f2e9] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b8d3c0]">
        {eyebrow}
      </p>
      <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
        {metadata.name}
      </h2>
      <div className="mt-5 grid gap-3 text-sm leading-6 text-[#c8d7cb]">
        <p>
          Published {metadata.datePublished}. Accessed {metadata.dateAccessed}.
          Reference {metadata.referenceDate}. {metadata.geographicCoverage}.
        </p>
        <p>{metadata.methodology}</p>
      </div>

      {metadata.caveats?.length ? (
        <div className="mt-5 rounded-[22px] border border-white/10 bg-white/6 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b8d3c0]">
            Caveats
          </p>
          <ul className="mt-3 grid gap-2 text-sm leading-6 text-[#dce7df]">
            {metadata.caveats.slice(0, 4).map((caveat) => (
              <li key={caveat}>{caveat}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold">
        <a
          href={metadata.url}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-white/10 px-4 py-2 text-[#f7f2e9] transition-colors hover:bg-white/16"
        >
          Open publication
        </a>
        <DataExportButtons
          data={metadata}
          filename={`${metadata.name.toLowerCase().replace(/\s+/g, "-")}-source`}
          csvHref={downloadHref}
          variant="solid"
        />
        <Link
          href="/methodology"
          className="rounded-full border border-white/12 px-4 py-2 text-[#dce7df] transition-colors hover:bg-white/8"
        >
          View methodology
        </Link>
      </div>
    </article>
  );
}
