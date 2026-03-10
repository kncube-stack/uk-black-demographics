"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/key-findings", label: "Findings" },
  { href: "/search", label: "Search" },
  { href: "/population", label: "Population" },
  { href: "/households", label: "Households" },
  { href: "/economics", label: "Economics" },
  { href: "/education", label: "Education" },
  { href: "/health", label: "Health" },
  { href: "/justice-policing", label: "Justice" },
  { href: "/identity-civic-life", label: "Identity" },
  { href: "/about", label: "About" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[rgba(247,242,233,0.84)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-12">
        <Link href="/" className="flex min-w-0 flex-col">
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
            UK Black Demographics
          </span>
          <span className="font-[family-name:var(--font-newsreader)] text-xl tracking-[-0.03em] text-[var(--foreground)]">
            Official data, clearly sourced
          </span>
        </Link>

        <nav className="flex flex-wrap items-center justify-end gap-2">
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === "/"
                ? pathname === item.href
                : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-[var(--accent)] text-[#f7f2e9]"
                    : "text-[var(--foreground)] hover:bg-white/70"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
