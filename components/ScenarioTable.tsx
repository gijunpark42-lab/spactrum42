"use client";

import { useMemo } from "react";
import { computeScenarioLadder } from "@/lib/spacMath";
import { formatCompact, formatUSD, formatPct, formatShares } from "@/lib/format";
import { Panel, InfoTip, netCashTone, TONE_TEXT, OWNERSHIP_COLORS } from "./ui";
import type { DealTerms } from "@/lib/types";

const LADDER_RATES = [0, 0.25, 0.5, 0.75, 0.95];

/**
 * The redemption ladder as a table. Reading top-to-bottom, sponsor ownership
 * balloons while net cash per share craters — the core dilution story.
 */
export function ScenarioTable({ deal }: { deal: DealTerms }) {
  const rows = useMemo(() => computeScenarioLadder(deal, LADDER_RATES), [deal]);

  return (
    <Panel
      title="Redemption scenario ladder"
      info="The same deal across the redemption spectrum. As public holders redeem, the sponsor promote stays fixed — so sponsor ownership rises and cash per share falls."
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-2xs uppercase tracking-wide text-faint">
              <th className="py-2 pr-3 text-left font-semibold">Redemption</th>
              <th className="px-3 py-2 text-right font-semibold">Total shares</th>
              <th className="px-3 py-2 text-right font-semibold">Pro forma equity</th>
              <th className="px-3 py-2 text-right font-semibold">
                <span className="inline-flex items-center gap-1">
                  Net cash / sh
                  <InfoTip label="(Remaining trust + PIPE − fees) ÷ total shares. The honest dilution metric." />
                </span>
              </th>
              <th className="px-3 py-2 text-right font-semibold">
                <span className="inline-flex items-center gap-1">
                  Sponsor %
                  <InfoTip label="Sponsor promote shares ÷ total shares. Fixed promote over a shrinking base = a bigger slice." />
                </span>
              </th>
              <th className="py-2 pl-3 text-right font-semibold">Cash to NewCo</th>
            </tr>
          </thead>
          <tbody className="num">
            {rows.map((r) => {
              const tone = netCashTone(r.netCashPerShare);
              return (
                <tr
                  key={r.redemptionRate}
                  className="border-b border-border/60 last:border-0 hover:bg-surface-2"
                >
                  <td className="py-2 pr-3 text-left font-semibold text-ink">
                    {formatPct(r.redemptionRate, { decimals: 0 })}
                  </td>
                  <td className="px-3 py-2 text-right text-muted">
                    {formatShares(r.totalShares)}
                  </td>
                  <td className="px-3 py-2 text-right text-muted">
                    {formatCompact(r.proFormaEquityValue)}
                  </td>
                  <td className={`px-3 py-2 text-right font-semibold ${TONE_TEXT[tone]}`}>
                    {formatUSD(r.netCashPerShare)}
                  </td>
                  <td
                    className="px-3 py-2 text-right font-semibold"
                    style={{ color: OWNERSHIP_COLORS.sponsor }}
                  >
                    {formatPct(r.ownership.sponsor)}
                  </td>
                  <td className="py-2 pl-3 text-right text-muted">
                    {formatCompact(r.cashToNewco)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
