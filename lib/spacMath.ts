/**
 * SPACtrum42 — calculation engine.
 *
 * Pure, dependency-free TypeScript. No React, no DOM, no I/O. Everything here is
 * a deterministic function of its inputs so it can be unit-tested in isolation
 * and reused verbatim by the optional Phase 2 backend.
 *
 * The formulas below are implemented exactly as specified in the product spec
 * (§3.2). A quant user will check them, so precision matters more than cleverness.
 */

import type { DealTerms, ScenarioResult } from "./types";

/** Redemption rate is a precondition-checked fraction in [0, 1]. Guard against
 *  out-of-range input (e.g. from an untrusted filing parse) so we never produce
 *  negative share counts. In-range values are unaffected. */
function clamp01(x: number): number {
  if (Number.isNaN(x)) return 0;
  return Math.min(1, Math.max(0, x));
}

/**
 * Compute the full pro forma picture for one redemption scenario.
 *
 * @param deal            the deal terms
 * @param redemptionRate  fraction of public SPAC shares redeemed, in [0, 1]
 */
export function computeScenario(deal: DealTerms, redemptionRate: number): ScenarioResult {
  const r = clamp01(redemptionRate);

  // --- share counts ---------------------------------------------------------
  const targetShares = deal.targetPreMoneyEquity / deal.dealSharePrice;
  const publicSharesRemaining = (1 - r) * deal.spacPublicShares;
  const pipeShares = deal.pipeAmount / deal.pipeSharePrice;
  // Sponsor promote is FIXED — it does not shrink when public holders redeem.
  // That is precisely why redemptions make dilution worse for everyone else.
  const sponsorPromoteShares = deal.sponsorPromoteShares;

  const totalShares =
    targetShares + publicSharesRemaining + sponsorPromoteShares + pipeShares;

  const proFormaEquityValue = totalShares * deal.dealSharePrice;

  // --- cash actually reaching the combined company --------------------------
  const cashToNewco =
    publicSharesRemaining * deal.trustPerShare + deal.pipeAmount - deal.transactionFees;
  // The honest dilution metric: cash from this deal per combined-company share.
  const netCashPerShare = cashToNewco / totalShares;

  // --- ownership split (sums to 1.0) ----------------------------------------
  const ownership = {
    target: targetShares / totalShares,
    public: publicSharesRemaining / totalShares,
    sponsor: sponsorPromoteShares / totalShares,
    pipe: pipeShares / totalShares,
  };

  // --- market comparison ----------------------------------------------------
  const navPremiumDiscount =
    (deal.currentMarketPrice - deal.trustPerShare) / deal.trustPerShare;
  const marketImpliedEquityValue = deal.currentMarketPrice * totalShares;

  // --- warrant dilution (only if in the money) ------------------------------
  const warrantsInTheMoney = deal.currentMarketPrice > deal.warrantStrike;
  const dilutiveWarrantShares = warrantsInTheMoney
    ? deal.publicWarrants * deal.warrantSharesPerWarrant
    : 0;
  const fullyDilutedShares = totalShares + dilutiveWarrantShares;

  return {
    redemptionRate: r,
    targetShares,
    publicSharesRemaining,
    sponsorPromoteShares,
    pipeShares,
    totalShares,
    fullyDilutedShares,
    proFormaEquityValue,
    cashToNewco,
    netCashPerShare,
    ownership,
    navPremiumDiscount,
    marketImpliedEquityValue,
    warrantsInTheMoney,
  };
}

/**
 * Map an array of redemption rates to their scenario results.
 * Used by the scenario table and the sensitivity heatmap.
 */
export function computeScenarioLadder(deal: DealTerms, rates: number[]): ScenarioResult[] {
  const results: ScenarioResult[] = [];
  for (const rate of rates) {
    results.push(computeScenario(deal, rate));
  }
  return results;
}
