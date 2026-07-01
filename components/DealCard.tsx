import Link from "next/link";
import { formatCompact, formatPct, formatUSD } from "@/lib/format";
import type { DealTerms } from "@/lib/types";

/**
 * A single deal in the Explorer grid. Clicking loads it into the analyzer via
 * the `?deal=<id>` query param. Premium is red, discount is green (as in the
 * PremiumDiscountBadge).
 */
export function DealCard({ deal }: { deal: DealTerms }) {
  const premium = (deal.currentMarketPrice - deal.trustPerShare) / deal.trustPerShare;
  const isFlat = Math.abs(premium) < 1e-9;
  const toneText = isFlat ? "text-muted" : premium > 0 ? "text-negative" : "text-positive";
  const toneLabel = isFlat ? "at NAV" : premium > 0 ? "premium" : "discount";
  const estCount = deal.estimatedFields.length;

  return (
    <Link
      href={`/?deal=${deal.id}`}
      className="group flex flex-col justify-between gap-4 rounded-lg border border-border bg-surface p-4 shadow-panel transition-colors hover:border-accent/60 hover:bg-elevated"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="num text-base font-semibold text-ink">{deal.spacTicker}</span>
            <span className="text-faint">→</span>
            <span className="num text-base font-semibold text-accent">
              {deal.postMergerTicker}
            </span>
          </div>
          <p className="mt-1 truncate text-sm text-ink">{deal.targetName}</p>
          <p className="truncate text-2xs text-faint">{deal.spacName}</p>
        </div>
        <div className="flex flex-col items-end">
          <span className={`num text-sm font-semibold ${toneText}`}>
            {formatPct(premium, { signed: true })}
          </span>
          <span className={`text-2xs ${toneText}`}>{toneLabel}</span>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-x-3 gap-y-2 border-t border-border pt-3 text-xs">
        <div className="flex flex-col">
          <dt className="text-2xs uppercase tracking-wide text-faint">Pre-money</dt>
          <dd className="num font-semibold text-ink">
            {formatCompact(deal.targetPreMoneyEquity)}
          </dd>
        </div>
        <div className="flex flex-col text-right">
          <dt className="text-2xs uppercase tracking-wide text-faint">Market price</dt>
          <dd className="num font-semibold text-ink">{formatUSD(deal.currentMarketPrice)}</dd>
        </div>
        <div className="flex flex-col">
          <dt className="text-2xs uppercase tracking-wide text-faint">Announced</dt>
          <dd className="num text-muted">{deal.announcementDate}</dd>
        </div>
        <div className="flex flex-col text-right">
          <dt className="text-2xs uppercase tracking-wide text-faint">Provenance</dt>
          <dd>
            {estCount > 0 ? (
              <span className="rounded bg-estimate-soft px-1.5 py-0.5 text-2xs font-semibold text-estimate">
                {estCount} est.
              </span>
            ) : (
              <span className="text-2xs text-muted">confirmed</span>
            )}
          </dd>
        </div>
      </dl>

      <span className="text-2xs font-medium text-muted transition-colors group-hover:text-accent">
        Open in analyzer →
      </span>
    </Link>
  );
}
