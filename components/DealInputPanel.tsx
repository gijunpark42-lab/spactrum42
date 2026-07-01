"use client";

import type { ReactNode } from "react";
import { InfoTip, EstimateBadge, Panel } from "./ui";
import { formatCompact } from "@/lib/format";
import type { DealTerms, NumericDealField } from "@/lib/types";

type FieldKind = "usd" | "price" | "count" | "num";

interface FieldDef {
  key: NumericDealField;
  label: string;
  info: string;
  kind: FieldKind;
  step: number;
}

const SECTIONS: { title: string; fields: FieldDef[] }[] = [
  {
    title: "Valuation & trust",
    fields: [
      {
        key: "targetPreMoneyEquity",
        label: "Target pre-money equity",
        info: "The agreed equity value of the target before new SPAC/PIPE money. This is the press-release headline number.",
        kind: "usd",
        step: 1_000_000,
      },
      {
        key: "dealSharePrice",
        label: "Deal share price",
        info: "Reference price the deal values shares at, almost always $10.00.",
        kind: "price",
        step: 0.05,
      },
      {
        key: "spacPublicShares",
        label: "SPAC public shares",
        info: "Public SPAC shares outstanding before any redemptions.",
        kind: "count",
        step: 100_000,
      },
      {
        key: "trustPerShare",
        label: "Trust per share",
        info: "Cash held in trust for each public share, typically $10.00–$10.30.",
        kind: "price",
        step: 0.05,
      },
    ],
  },
  {
    title: "Sponsor & PIPE",
    fields: [
      {
        key: "sponsorPromoteShares",
        label: "Sponsor promote shares",
        info: "Founder shares granted for a nominal sum (~20% of post-IPO shares). Pure dilution that never redeems.",
        kind: "count",
        step: 100_000,
      },
      {
        key: "pipeAmount",
        label: "PIPE amount",
        info: "Cash raised from a private placement of new shares to institutions to fund the deal.",
        kind: "usd",
        step: 1_000_000,
      },
      {
        key: "pipeSharePrice",
        label: "PIPE share price",
        info: "Price per share PIPE investors pay, usually $10.00.",
        kind: "price",
        step: 0.05,
      },
    ],
  },
  {
    title: "Fees & warrants",
    fields: [
      {
        key: "transactionFees",
        label: "Transaction fees",
        info: "Underwriting, advisory and other deal fees paid out of proceeds.",
        kind: "usd",
        step: 1_000_000,
      },
      {
        key: "publicWarrants",
        label: "Public warrants",
        info: "Warrants outstanding that convert to shares once in the money (price above strike).",
        kind: "count",
        step: 100_000,
      },
      {
        key: "warrantStrike",
        label: "Warrant strike",
        info: "Exercise price of the warrants, usually $11.50.",
        kind: "price",
        step: 0.05,
      },
      {
        key: "warrantSharesPerWarrant",
        label: "Shares / warrant",
        info: "Shares delivered per whole warrant — often 1.0, sometimes 0.5.",
        kind: "num",
        step: 0.5,
      },
    ],
  },
  {
    title: "Market",
    fields: [
      {
        key: "currentMarketPrice",
        label: "Current market price",
        info: "Latest SPAC share price, used for the premium/discount and market-implied value. A user input, not a live quote.",
        kind: "price",
        step: 0.05,
      },
    ],
  },
];

function fieldPreview(kind: FieldKind, value: number): string | null {
  if (kind === "usd") return formatCompact(value, { currency: true });
  if (kind === "count") return `${formatCompact(value, { currency: false })} shares`;
  return null;
}

function NumberField({
  def,
  value,
  estimated,
  onChange,
}: {
  def: FieldDef;
  value: number;
  estimated: boolean;
  onChange: (v: number) => void;
}) {
  const preview = fieldPreview(def.kind, value);
  return (
    <label className="flex flex-col gap-1">
      <span className="flex items-center gap-1.5 text-2xs font-medium text-muted">
        <span>{def.label}</span>
        <InfoTip label={def.info} />
        {estimated && <EstimateBadge />}
      </span>
      <div className="relative">
        {(def.kind === "usd" || def.kind === "price") && (
          <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-xs text-faint">
            $
          </span>
        )}
        <input
          type="number"
          inputMode="decimal"
          step={def.step}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => {
            const v = e.target.valueAsNumber;
            onChange(Number.isNaN(v) ? 0 : v);
          }}
          className={`num w-full rounded-md border border-border bg-surface-2 py-1.5 pr-2 text-right text-sm text-ink outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent ${
            def.kind === "usd" || def.kind === "price" ? "pl-5" : "pl-2"
          } ${estimated ? "border-estimate/30" : ""}`}
        />
      </div>
      {preview && <span className="num text-2xs text-faint">{preview}</span>}
    </label>
  );
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-2xs font-medium text-muted">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-border bg-surface-2 px-2 py-1.5 text-sm text-ink outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
      />
    </label>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mb-2 mt-4 border-b border-border pb-1 text-2xs font-semibold uppercase tracking-[0.14em] text-faint first:mt-0">
      {children}
    </div>
  );
}

/**
 * The editable DealTerms form. A dropdown loads any seeded deal; estimated
 * fields carry an amber "est." badge; every field has a formula/definition tip.
 */
export function DealInputPanel({
  deal,
  deals,
  onPatch,
  onLoadDeal,
}: {
  deal: DealTerms;
  deals: DealTerms[];
  onPatch: (patch: Partial<DealTerms>) => void;
  onLoadDeal: (id: string) => void;
}) {
  const estimatedCount = deal.estimatedFields.length;

  return (
    <Panel
      title="Deal terms"
      info="Every field is editable and drives the model live. Fields badged “est.” are not confirmed from a filing — verify them against the S-4/proxy."
      right={
        estimatedCount > 0 ? (
          <span className="rounded bg-estimate-soft px-1.5 py-0.5 text-2xs font-semibold text-estimate">
            {estimatedCount} est.
          </span>
        ) : null
      }
      bodyClassName="p-3"
    >
      {/* Load a seeded deal */}
      <label className="flex flex-col gap-1">
        <span className="text-2xs font-medium uppercase tracking-wide text-faint">
          Load a deal
        </span>
        <select
          value={deals.some((d) => d.id === deal.id) ? deal.id : ""}
          onChange={(e) => onLoadDeal(e.target.value)}
          className="w-full rounded-md border border-border bg-surface-2 px-2 py-1.5 text-sm text-ink outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
        >
          {!deals.some((d) => d.id === deal.id) && (
            <option value="">Custom (edited)</option>
          )}
          {deals.map((d) => (
            <option key={d.id} value={d.id}>
              {d.spacTicker} → {d.postMergerTicker} · {d.targetName}
            </option>
          ))}
        </select>
      </label>

      <SectionLabel>Identity</SectionLabel>
      <div className="grid grid-cols-2 gap-3">
        <TextField
          label="SPAC ticker"
          value={deal.spacTicker}
          onChange={(v) => onPatch({ spacTicker: v })}
        />
        <TextField
          label="Post-merger ticker"
          value={deal.postMergerTicker}
          onChange={(v) => onPatch({ postMergerTicker: v })}
        />
        <TextField
          label="SPAC name"
          value={deal.spacName}
          onChange={(v) => onPatch({ spacName: v })}
        />
        <TextField
          label="Target name"
          value={deal.targetName}
          onChange={(v) => onPatch({ targetName: v })}
        />
        <TextField
          label="Announced"
          type="date"
          value={deal.announcementDate}
          onChange={(v) => onPatch({ announcementDate: v })}
        />
      </div>

      {SECTIONS.map((section) => (
        <div key={section.title}>
          <SectionLabel>{section.title}</SectionLabel>
          <div className="grid grid-cols-2 gap-3">
            {section.fields.map((def) => (
              <NumberField
                key={def.key}
                def={def}
                value={deal[def.key]}
                estimated={deal.estimatedFields.includes(def.key)}
                onChange={(v) => onPatch({ [def.key]: v } as Partial<DealTerms>)}
              />
            ))}
          </div>
        </div>
      ))}
    </Panel>
  );
}
