import type { Metadata } from "next";
import { Manrope, Newsreader } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "@/lib/constants";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_TITLE}`,
  },
  description: SITE_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB">
      <body className={`${manrope.variable} ${newsreader.variable} antialiased`}>
        <div className="flex min-h-screen flex-col">
          <a href="#main-content" className="fixed left-4 top-4 z-50 -translate-y-24 rounded-lg bg-[var(--accent)] px-4 py-3 font-semibold text-white focus:translate-y-0">
            Skip to content
          </a>
          <SiteHeader />
          <div id="main-content" tabIndex={-1} className="flex-1">{children}</div>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
