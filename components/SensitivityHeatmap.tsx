"use client";

import { useMemo, useState } from "react";
import { computeScenarioLadder } from "@/lib/spacMath";
import { formatCompact, formatUSD, formatPct } from "@/lib/format";
import { Panel, netCashTone, TONE_RGB } from "./ui";
import type { DealTerms } from "@/lib/types";

// x-axis: redemption rate 0→100% in 10-point steps.
const RATES = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
// y-axis: assumed share price $15 (top) down to $5 (bottom), $1 steps.
const PRICES = [15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5];

type Mode = "equity" | "netcash";

export function SensitivityHeatmap({ deal }: { deal: DealTerms }) {
  const [mode, setMode] = useState<Mode>("equity");

  const { cells, min, max } = useMemo(() => {
    const ladder = computeScenarioLadder(deal, RATES);
    // grid[row][col]
    const grid: number[][] = [];
    for (const price of PRICES) {
      const row: number[] = [];
      for (const scenario of ladder) {
        // Market-implied equity value re-prices total shares at the assumed price.
        // Net cash per share is a function of deal structure + redemptions only —
        // it does not depend on the assumed market price, so its rows are flat.
        const value =
          mode === "equity" ? price * scenario.totalShares : scenario.netCashPerShare;
        row.push(value);
      }
      grid.push(row);
    }
    let lo = Infinity;
    let hi = -Infinity;
    for (const row of grid) {
      for (const v of row) {
        if (v < lo) lo = v;
        if (v > hi) hi = v;
      }
    }
    return { cells: grid, min: lo, max: hi };
  }, [deal, mode]);

  const norm = (v: number) => (max > min ? (v - min) / (max - min) : 0.5);

  function cellBg(v: number): string {
    const t = norm(v);
    if (mode === "equity") {
      // single-hue sequential (accent teal) — magnitude, no good/bad meaning
      return `rgba(55, 183, 195, ${(0.06 + 0.62 * t).toFixed(3)})`;
    }
    // net cash: directional green/amber/red by threshold, intensity by magnitude
    const [r, g, b] = TONE_RGB[netCashTone(v)];
    return `rgba(${r}, ${g}, ${b}, ${(0.1 + 0.55 * t).toFixed(3)})`;
  }

  const fmt = (v: number) =>
    mode === "equity" ? formatCompact(v) : formatUSD(v);

  const highlightPrice = Math.max(5, Math.min(15, Math.round(deal.currentMarketPrice)));

  return (
    <Panel
      title="Sensitivity heatmap"
      info="A valuation-desk sensitivity grid: redemption rate across, assumed share price down. Cells show the market-implied combined equity value (or net cash per share)."
      right={
        <div className="flex items-center rounded-md border border-border p-0.5 text-2xs">
          <button
            type="button"
            onClick={() => setMode("equity")}
            className={`rounded px-2 py-1 font-medium transition-colors ${
              mode === "equity" ? "bg-accent-soft text-accent" : "text-muted hover:text-ink"
            }`}
          >
            Equity value
          </button>
          <button
            type="button"
            onClick={() => setMode("netcash")}
            className={`rounded px-2 py-1 font-medium transition-colors ${
              mode === "netcash" ? "bg-accent-soft text-accent" : "text-muted hover:text-ink"
            }`}
          >
            Net cash / sh
          </button>
        </div>
      }
    >
      <div className="overflow-x-auto">
        <div className="min-w-[620px]">
          {/* header row: corner + redemption-rate labels */}
          <div
            className="grid gap-px"
            style={{ gridTemplateColumns: `56px repeat(${RATES.length}, minmax(0, 1fr))` }}
          >
            <div className="flex items-end justify-start pb-1 pl-1 text-2xs text-faint">
              $ \ %
            </div>
            {RATES.map((rate) => (
              <div
                key={rate}
                className="num pb-1 text-center text-2xs text-faint"
              >
                {formatPct(rate, { decimals: 0 })}
              </div>
            ))}
          </div>

          {/* body rows */}
          <div className="flex flex-col gap-px">
            {PRICES.map((price, rIdx) => (
              <div
                key={price}
                className="grid gap-px"
                style={{ gridTemplateColumns: `56px repeat(${RATES.length}, minmax(0, 1fr))` }}
              >
                <div
                  className={`num flex items-center justify-end pr-2 text-2xs ${
                    price === highlightPrice ? "font-semibold text-accent" : "text-faint"
                  }`}
                >
                  {formatUSD(price, 0)}
                </div>
                {cells[rIdx].map((v, cIdx) => (
                  <div
                    key={cIdx}
                    title={`${formatPct(RATES[cIdx], { decimals: 0 })} redemption · $${price} → ${fmt(v)}`}
                    className="num flex h-8 items-center justify-center rounded-[3px] text-2xs text-ink"
                    style={{ backgroundColor: cellBg(v) }}
                  >
                    {fmt(v)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-2xs text-faint">
        <span>
          x: redemption rate <span className="text-border-strong">·</span> y: assumed share price
        </span>
        <span>
          {mode === "equity"
            ? "Cell = assumed price × total shares"
            : "Net cash / share is independent of price → rows are flat by design"}
        </span>
      </div>
    </Panel>
  );
}
