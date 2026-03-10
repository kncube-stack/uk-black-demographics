import Link from "next/link";
import { getCategoryRoute, getTopicGuides } from "@/lib/topic-guides";
import type { SiteCategory } from "@/lib/types";

type Props = {
  category: SiteCategory;
};

export function SubcategoryGrid({ category }: Props) {
  const guides = getTopicGuides(category);

  return (
    <section className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_50px_rgba(19,31,22,0.06)]">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
        Topic map
      </p>
      <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
        All subcategories in this section
      </h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {guides.map((guide) => (
          <article
            key={guide.slug}
            className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold">{guide.title}</h3>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${
                  guide.status === "live"
                    ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                    : "border border-[var(--border)] text-[var(--muted)]"
                }`}
              >
                {guide.status === "live" ? "Live data" : "Source brief"}
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              {guide.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
              <Link
                href={`${getCategoryRoute(category)}/${guide.slug}`}
                className="text-[var(--accent)]"
              >
                Open topic
              </Link>
              {guide.liveRoute ? (
                <Link
                  href={guide.liveRoute}
                  className="text-[var(--muted)] underline-offset-4 hover:underline"
                >
                  Live section
                </Link>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
