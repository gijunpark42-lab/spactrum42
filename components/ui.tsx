import type { ReactNode } from "react";

/**
 * Shared, presentational primitives used across the feature components.
 * Kept together so the "every metric gets an info tooltip" requirement (§6)
 * stays DRY. No hooks, no state — pure markup.
 */

/** A hoverable/focusable "i" that reveals a one-sentence formula explanation. */
export function InfoTip({ label, className = "" }: { label: string; className?: string }) {
  return (
    <span className={`group/tip relative inline-flex align-middle ${className}`}>
      <span
        tabIndex={0}
        role="note"
        aria-label={label}
        className="inline-flex h-3.5 w-3.5 cursor-help select-none items-center justify-center rounded-full border border-border-strong text-[9px] font-bold leading-none text-faint transition-colors hover:border-accent hover:text-accent focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
      >
        i
      </span>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 rounded-md border border-border-strong bg-elevated px-3 py-2 text-xs font-normal normal-case leading-relaxed tracking-normal text-ink opacity-0 shadow-xl transition-opacity duration-150 group-hover/tip:opacity-100 group-focus-within/tip:opacity-100"
      >
        {label}
      </span>
    </span>
  );
}

/** Amber "est." badge for fields not confirmed from a filing (§10 honesty mandate). */
export function EstimateBadge({ className = "" }: { className?: string }) {
  return (
    <span className={`group/tip relative inline-flex align-middle ${className}`}>
      <span
        tabIndex={0}
        aria-label="Estimated — verify against the S-4/proxy."
        className="cursor-help select-none rounded bg-estimate-soft px-1 py-0.5 text-[9px] font-semibold uppercase leading-none tracking-wide text-estimate focus:outline-none focus-visible:ring-1 focus-visible:ring-estimate"
      >
        est.
      </span>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-52 -translate-x-1/2 rounded-md border border-border-strong bg-elevated px-3 py-2 text-xs font-normal normal-case leading-relaxed tracking-normal text-ink opacity-0 shadow-xl transition-opacity duration-150 group-hover/tip:opacity-100 group-focus-within/tip:opacity-100"
      >
        Estimated — verify against the S-4/proxy.
      </span>
    </span>
  );
}

/** A titled card. `info` renders an InfoTip next to the title; `right` is a header slot. */
export function Panel({
  title,
  info,
  right,
  children,
  className = "",
  bodyClassName = "",
}: {
  title?: ReactNode;
  info?: string;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section
      className={`flex flex-col rounded-lg border border-border bg-surface shadow-panel ${className}`}
    >
      {(title || right) && (
        <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            {title && (
              <h2 className="text-2xs font-semibold uppercase tracking-[0.14em] text-muted">
                {title}
              </h2>
            )}
            {info && <InfoTip label={info} />}
          </div>
          {right}
        </header>
      )}
      <div className={`p-4 ${bodyClassName}`}>{children}</div>
    </section>
  );
}

/** Ownership-slice colors, reused by the donut, its legend, and the scenario table. */
export const OWNERSHIP_COLORS = {
  target: "#37B7C3", // teal (accent family)
  public: "#6C8CF5", // indigo-blue
  sponsor: "#C084FC", // violet — the promote
  pipe: "#E8A03D", // amber-orange
} as const;

export const OWNERSHIP_LABELS = {
  target: "Target",
  public: "Public",
  sponsor: "Sponsor",
  pipe: "PIPE",
} as const;

/** Net-cash-per-share thresholds (§5): green ≥ $9, amber $7–9, red < $7. */
export type Tone = "positive" | "estimate" | "negative";

export function netCashTone(value: number): Tone {
  if (value >= 9) return "positive";
  if (value >= 7) return "estimate";
  return "negative";
}

export const TONE_TEXT: Record<Tone, string> = {
  positive: "text-positive",
  estimate: "text-estimate",
  negative: "text-negative",
};

export const TONE_BG: Record<Tone, string> = {
  positive: "bg-positive",
  estimate: "bg-estimate",
  negative: "bg-negative",
};

/** RGB triples for the tone colors, for alpha-blended heatmap cells. */
export const TONE_RGB: Record<Tone, [number, number, number]> = {
  positive: [61, 214, 140],
  estimate: [229, 185, 92],
  negative: [241, 112, 123],
};
