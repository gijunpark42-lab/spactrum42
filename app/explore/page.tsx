import type { Metadata } from "next";
import { seedDeals } from "@/lib/seedDeals";
import { DealCard } from "@/components/DealCard";

export const metadata: Metadata = {
  title: "Deal Explorer — SPACtrum42",
  description: "Browse seeded SPAC deals and load any into the analyzer.",
};

export default function ExplorePage() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6">
      <header className="mb-5">
        <h1 className="text-xl font-semibold tracking-tight text-ink">Deal Explorer</h1>
        <p className="mt-1 text-sm text-muted">
          {seedDeals.length} seeded SPAC deals. Click any card to load its terms into the
          analyzer. Figures badged{" "}
          <span className="rounded bg-estimate-soft px-1 py-0.5 text-2xs font-semibold text-estimate">
            est.
          </span>{" "}
          are unconfirmed — verify against the filings.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {seedDeals.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
      </div>
    </div>
  );
}
