/**
 * Display formatters for SPACtrum42.
 *
 * Money is shown compactly ($2.50B, $420.0M, $6.83) and consistently everywhere,
 * so figures line up in the terminal-style tables. Pure functions, no DOM.
 */

const EM_DASH = "—";

/** Precise USD with cents: 6.83 -> "$6.83", 1234.5 -> "$1,234.50". */
export function formatUSD(value: number, fractionDigits = 2): string {
  if (!Number.isFinite(value)) return EM_DASH;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

/**
 * Compact magnitude with K/M/B/T suffix.
 *   2_500_000_000 -> "$2.50B"
 *     420_000_000 -> "$420.0M"
 *            6.83 -> "$6.83"
 * Pass `currency: false` for bare counts (e.g. share totals): 250_000_000 -> "250.0M".
 */
export function formatCompact(
  value: number,
  { currency = true }: { currency?: boolean } = {},
): string {
  if (!Number.isFinite(value)) return EM_DASH;

  const prefix = currency ? "$" : "";
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);

  const tiers: Array<{ scale: number; suffix: string }> = [
    { scale: 1e12, suffix: "T" },
    { scale: 1e9, suffix: "B" },
    { scale: 1e6, suffix: "M" },
    { scale: 1e3, suffix: "K" },
    { scale: 1, suffix: "" },
  ];

  for (const { scale, suffix } of tiers) {
    if (abs >= scale) {
      const scaled = abs / scale;
      // Keep ~3 significant figures: 420.0M reads better than 420.00M; 2.50B better than 2.5B.
      const decimals = scaled >= 100 ? 1 : 2;
      return `${sign}${prefix}${scaled.toFixed(decimals)}${suffix}`;
    }
  }

  // |value| < 1
  return `${sign}${prefix}${abs.toFixed(2)}`;
}

/** Bare compact count, no currency symbol: 250_000_000 -> "250.0M shares" (suffix optional). */
export function formatShares(value: number): string {
  return formatCompact(value, { currency: false });
}

/**
 * Fraction -> percent string.
 *   0.2033 -> "20.3%"
 * With `signed: true`, non-negative values get a leading "+": 0.715 -> "+71.5%".
 */
export function formatPct(fraction: number, { decimals = 1, signed = false } = {}): string {
  if (!Number.isFinite(fraction)) return EM_DASH;
  const pct = fraction * 100;
  const lead = signed && pct >= 0 ? "+" : "";
  return `${lead}${pct.toFixed(decimals)}%`;
}
