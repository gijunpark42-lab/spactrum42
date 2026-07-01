"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Panel, OWNERSHIP_COLORS, OWNERSHIP_LABELS } from "./ui";
import { formatPct, formatShares } from "@/lib/format";
import type { ScenarioResult } from "@/lib/types";

type Slice = { key: keyof ScenarioResult["ownership"]; value: number; shares: number };

/**
 * Donut of the pro forma ownership split (target / public / sponsor / PIPE)
 * at the current redemption rate.
 */
export function CapTableChart({ result }: { result: ScenarioResult }) {
  const slices: Slice[] = [
    { key: "target", value: result.ownership.target, shares: result.targetShares },
    { key: "public", value: result.ownership.public, shares: result.publicSharesRemaining },
    { key: "sponsor", value: result.ownership.sponsor, shares: result.sponsorPromoteShares },
    { key: "pipe", value: result.ownership.pipe, shares: result.pipeShares },
  ];

  return (
    <Panel
      title="Pro forma cap table"
      info="Who owns the combined company at this redemption rate. Shares = pre-money equity ÷ deal price (target), remaining public shares, sponsor promote, and PIPE shares. Slices sum to 100%."
    >
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
        <div className="relative h-[196px] w-[196px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={slices}
                dataKey="value"
                nameKey="key"
                cx="50%"
                cy="50%"
                innerRadius={64}
                outerRadius={92}
                startAngle={90}
                endAngle={-270}
                paddingAngle={1.5}
                stroke="#0E141D"
                strokeWidth={2}
                isAnimationActive={false}
              >
                {slices.map((s) => (
                  <Cell key={s.key} fill={OWNERSHIP_COLORS[s.key]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* center readout */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="num text-lg font-semibold leading-none text-ink">
              {formatShares(result.totalShares)}
            </span>
            <span className="mt-1 text-2xs uppercase tracking-wide text-faint">total shares</span>
          </div>
        </div>

        {/* legend */}
        <ul className="flex w-full flex-col gap-1.5">
          {slices.map((s) => (
            <li
              key={s.key}
              className="flex items-center justify-between gap-3 rounded-md px-2 py-1.5 text-xs hover:bg-surface-2"
            >
              <span className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="h-2.5 w-2.5 rounded-sm"
                  style={{ backgroundColor: OWNERSHIP_COLORS[s.key] }}
                />
                <span className="text-muted">{OWNERSHIP_LABELS[s.key]}</span>
              </span>
              <span className="flex items-baseline gap-2">
                <span className="num text-faint">{formatShares(s.shares)}</span>
                <span className="num w-12 text-right font-semibold text-ink">
                  {formatPct(s.value)}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  );
}
