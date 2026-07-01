"use client";

import { Panel, netCashTone, TONE_TEXT, TONE_BG } from "./ui";
import { formatUSD, formatPct } from "@/lib/format";

/**
 * The headline honesty metric: net cash per combined-company share vs. the
 * deal price. Colored per spec: green ≥ $9, amber $7–9, red < $7.
 */
export function NetCashGauge({
  netCashPerShare,
  dealSharePrice,
}: {
  netCashPerShare: number;
  dealSharePrice: number;
}) {
  const tone = netCashTone(netCashPerShare);
  const toneText = TONE_TEXT[tone];
  const toneBar = TONE_BG[tone];

  const fill = dealSharePrice > 0 ? Math.max(0, Math.min(1, netCashPerShare / dealSharePrice)) : 0;
  const leak = dealSharePrice - netCashPerShare;
  const leakPct = dealSharePrice > 0 ? leak / dealSharePrice : 0;

  return (
    <Panel
      title="Net cash per share"
      info="For every share of the combined company, how much cash from this deal actually landed on the balance sheet: (remaining trust + PIPE − fees) ÷ total shares. The gap to the deal price is the real cost of going public this way."
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <span className={`num text-5xl font-semibold leading-none ${toneText}`}>
              {formatUSD(netCashPerShare)}
            </span>
            <span className="text-sm text-faint">
              / {formatUSD(dealSharePrice)} deal
            </span>
          </div>
        </div>

        {/* gauge track from $0 to the deal price */}
        <div className="flex flex-col gap-1.5">
          <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-elevated">
            <div
              className={`absolute inset-y-0 left-0 rounded-full ${toneBar} transition-all duration-300`}
              style={{ width: `${fill * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-2xs text-faint">
            <span className="num">$0</span>
            <span className="num">{formatUSD(dealSharePrice)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-3 text-xs">
          <span className="text-muted">Value leaking out vs. deal price</span>
          <span className={`num font-semibold ${toneText}`}>
            {formatUSD(leak)} <span className="text-faint">({formatPct(leakPct)})</span>
          </span>
        </div>
      </div>
    </Panel>
  );
}
