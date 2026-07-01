"use client";

import { Panel } from "./ui";
import { formatUSD, formatPct, formatCompact } from "@/lib/format";

/**
 * Current market price vs. $10 NAV. Premium is RED (you're paying up for a
 * pre-deal shell); discount is GREEN. Also surfaces the market-implied combined
 * equity value so the headline pre-money can be compared to what the tape says.
 */
export function PremiumDiscountBadge({
  navPremiumDiscount,
  marketImpliedEquityValue,
  currentMarketPrice,
  trustPerShare,
}: {
  navPremiumDiscount: number;
  marketImpliedEquityValue: number;
  currentMarketPrice: number;
  trustPerShare: number;
}) {
  const isPremium = navPremiumDiscount > 0;
  const isFlat = Math.abs(navPremiumDiscount) < 1e-9;

  const toneText = isFlat ? "text-muted" : isPremium ? "text-negative" : "text-positive";
  const label = isFlat
    ? "at NAV"
    : isPremium
      ? "premium to NAV"
      : "discount to NAV";

  return (
    <Panel
      title="Premium / discount to NAV"
      info="Where the SPAC trades versus the ~$10 cash in trust: (market price − trust per share) ÷ trust per share. A premium means you're paying above cash for a pre-deal shell; a discount means below cash."
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-baseline gap-2">
          <span className={`num text-5xl font-semibold leading-none ${toneText}`}>
            {formatPct(navPremiumDiscount, { signed: true })}
          </span>
          <span className={`text-sm font-medium ${toneText}`}>{label}</span>
        </div>

        <dl className="flex flex-col divide-y divide-border text-xs">
          <div className="flex items-center justify-between py-1.5">
            <dt className="text-muted">Market price</dt>
            <dd className="num font-medium text-ink">{formatUSD(currentMarketPrice)}</dd>
          </div>
          <div className="flex items-center justify-between py-1.5">
            <dt className="text-muted">NAV (trust / share)</dt>
            <dd className="num font-medium text-ink">{formatUSD(trustPerShare)}</dd>
          </div>
          <div className="flex items-center justify-between py-1.5">
            <dt className="flex items-center gap-1 text-muted">Market-implied equity value</dt>
            <dd className="num font-semibold text-ink">
              {formatCompact(marketImpliedEquityValue)}
            </dd>
          </div>
        </dl>
      </div>
    </Panel>
  );
}
