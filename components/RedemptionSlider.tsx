"use client";

import { InfoTip } from "./ui";
import { formatPct } from "@/lib/format";

const QUICK_SETS = [0, 0.25, 0.5, 0.75, 0.95];

/**
 * Redemption rate control: 0%→100%, recomputes everything live on drag.
 * Quick-set buttons jump to the canonical scenarios.
 */
export function RedemptionSlider({
  rate,
  onChange,
}: {
  rate: number;
  onChange: (rate: number) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-end justify-between gap-4">
        <div className="flex items-center gap-1.5">
          <span className="text-2xs font-semibold uppercase tracking-[0.14em] text-muted">
            Redemption rate
          </span>
          <InfoTip label="The share of public SPAC holders who redeem at ~$10 and exit. Higher redemptions drain trust cash and concentrate the sponsor promote — dilution gets worse." />
        </div>
        <div className="flex items-baseline gap-1">
          <span className="num text-3xl font-semibold leading-none text-accent">
            {formatPct(rate, { decimals: 0 })}
          </span>
          <span className="text-xs text-faint">redeemed</span>
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={Math.round(rate * 100)}
        onChange={(e) => onChange(Number(e.target.value) / 100)}
        aria-label="Redemption rate"
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-elevated accent-accent"
      />

      <div className="flex flex-wrap items-center gap-1.5">
        {QUICK_SETS.map((v) => {
          const active = Math.abs(rate - v) < 0.005;
          return (
            <button
              key={v}
              type="button"
              onClick={() => onChange(v)}
              className={`num rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
                active
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-border text-muted hover:border-border-strong hover:text-ink"
              }`}
            >
              {formatPct(v, { decimals: 0 })}
            </button>
          );
        })}
      </div>
    </div>
  );
}
