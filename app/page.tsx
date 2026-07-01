"use client";

import { useEffect, useMemo, useState } from "react";
import { computeScenario } from "@/lib/spacMath";
import { seedDeals, defaultDeal } from "@/lib/seedDeals";
import type { DealTerms } from "@/lib/types";
import { formatCompact } from "@/lib/format";
import { Panel } from "@/components/ui";
import { DealInputPanel } from "@/components/DealInputPanel";
import { RedemptionSlider } from "@/components/RedemptionSlider";
import { NetCashGauge } from "@/components/NetCashGauge";
import { PremiumDiscountBadge } from "@/components/PremiumDiscountBadge";
import { CapTableChart } from "@/components/CapTableChart";
import { ValuationWaterfall } from "@/components/ValuationWaterfall";
import { ScenarioTable } from "@/components/ScenarioTable";
import { SensitivityHeatmap } from "@/components/SensitivityHeatmap";

function HeaderStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-2xs uppercase tracking-wide text-faint">{label}</span>
      <span className="num text-sm font-semibold text-ink">{value}</span>
    </div>
  );
}

export default function AnalyzerPage() {
  const [deal, setDeal] = useState<DealTerms>(defaultDeal);
  const [rate, setRate] = useState(0);

  const result = useMemo(() => computeScenario(deal, rate), [deal, rate]);

  // Deal Explorer links here as /?deal=<id>. Load that deal on mount.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("deal");
    if (!id) return;
    const found = seedDeals.find((d) => d.id === id);
    if (found) {
      setDeal(found);
      setRate(0);
    }
  }, []);

  const patch = (p: Partial<DealTerms>) => setDeal((d) => ({ ...d, ...p }));
  const loadDeal = (id: string) => {
    const found = seedDeals.find((d) => d.id === id);
    if (found) {
      setDeal(found);
      setRate(0);
    }
  };

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6">
      {/* Deal header */}
      <div className="mb-5 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="num text-2xl font-semibold tracking-tight text-ink">
              {deal.spacTicker}
            </h1>
            <span className="text-faint">→</span>
            <span className="num text-2xl font-semibold tracking-tight text-accent">
              {deal.postMergerTicker}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted">
            {deal.targetName} <span className="text-faint">·</span> {deal.spacName}
          </p>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          <HeaderStat
            label="Headline pre-money"
            value={formatCompact(deal.targetPreMoneyEquity)}
          />
          <HeaderStat
            label="Pro forma equity"
            value={formatCompact(result.proFormaEquityValue)}
          />
          <HeaderStat label="Announced" value={deal.announcementDate} />
        </div>
      </div>

      {/* Analyzer grid */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
        <div className="xl:sticky xl:top-[76px] xl:max-h-[calc(100vh-92px)] xl:self-start xl:overflow-y-auto">
          <DealInputPanel
            deal={deal}
            deals={seedDeals}
            onPatch={patch}
            onLoadDeal={loadDeal}
          />
        </div>

        <div className="flex min-w-0 flex-col gap-5">
          <Panel
            title="Redemption scenario"
            info="Drag to model any redemption outcome from 0% to 100%. Every figure on this page recomputes live."
          >
            <RedemptionSlider rate={rate} onChange={setRate} />
          </Panel>

          <div className="grid gap-5 md:grid-cols-2">
            <NetCashGauge
              netCashPerShare={result.netCashPerShare}
              dealSharePrice={deal.dealSharePrice}
            />
            <PremiumDiscountBadge
              navPremiumDiscount={result.navPremiumDiscount}
              marketImpliedEquityValue={result.marketImpliedEquityValue}
              currentMarketPrice={deal.currentMarketPrice}
              trustPerShare={deal.trustPerShare}
            />
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <CapTableChart result={result} />
            <ValuationWaterfall deal={deal} result={result} />
          </div>

          <ScenarioTable deal={deal} />
          <SensitivityHeatmap deal={deal} />
        </div>
      </div>
    </div>
  );
}
