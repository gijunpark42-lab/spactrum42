import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "SPACtrum42 — what a SPAC merger actually values",
  description:
    "See a SPAC deal's true post-merger economics across the full redemption spectrum: pro forma cap table, net cash per share, and premium/discount to NAV.",
};

function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <span
            aria-hidden
            className="h-5 w-1.5 rounded-full bg-gradient-to-b from-accent via-estimate to-negative"
          />
          <span className="flex flex-col leading-none">
            <span className="text-sm font-semibold tracking-tight text-ink">
              SPACtrum<span className="text-accent">42</span>
            </span>
            <span className="mt-0.5 text-2xs uppercase tracking-[0.18em] text-faint">
              SPAC dilution, decoded
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 text-xs">
          <Link
            href="/"
            className="rounded-md px-3 py-1.5 font-medium text-muted transition-colors hover:bg-surface hover:text-ink"
          >
            Analyzer
          </Link>
          <Link
            href="/explore"
            className="rounded-md px-3 py-1.5 font-medium text-muted transition-colors hover:bg-surface hover:text-ink"
          >
            Deal Explorer
          </Link>
        </nav>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="mt-10 border-t border-border">
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6">
        <p className="text-2xs leading-relaxed text-faint">
          <span className="font-semibold uppercase tracking-wide text-muted">
            Not investment advice.
          </span>{" "}
          SPACtrum42 is an educational modeling tool. Every figure — especially those
          badged{" "}
          <span className="rounded bg-estimate-soft px-1 py-0.5 font-semibold text-estimate">
            est.
          </span>{" "}
          — is an estimate or approximation. Verify all deal terms against the company&apos;s
          actual SEC filings (S-4, 424B, 8-K, DEFM14A) before relying on any number here.
          Live market prices are user inputs, not real-time quotes.
        </p>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
