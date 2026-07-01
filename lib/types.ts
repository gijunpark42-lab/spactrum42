/**
 * Core domain types for SPACtrum42.
 *
 * These are shared by the pure calculation engine (`spacMath.ts`), the seed
 * data, and the React UI. They are intentionally free of any framework code so
 * the same shapes can be reused by the optional Phase 2 Python/Claude backend.
 */

/** The full set of terms that define a SPAC merger, as entered or parsed from filings. */
export interface DealTerms {
  id: string;
  spacTicker: string; // e.g. "CCXI"
  spacName: string; // e.g. "Churchill Capital Corp XI"
  targetName: string; // e.g. "Agility Robotics"
  postMergerTicker: string; // e.g. "AGLT"
  announcementDate: string; // ISO date

  targetPreMoneyEquity: number; // agreed pre-money equity value of the target, e.g. 2_500_000_000
  dealSharePrice: number; // price at which the deal values shares, default 10.00

  spacPublicShares: number; // public SPAC shares outstanding BEFORE redemptions
  trustPerShare: number; // cash in trust per public share, typically ~10.00–10.30

  sponsorPromoteShares: number; // founder shares (the "promote"), typically ~20% of post-IPO total

  pipeAmount: number; // PIPE proceeds in dollars, e.g. 200_000_000
  pipeSharePrice: number; // PIPE price per share, default 10.00

  transactionFees: number; // underwriting + advisory + other deal fees, in dollars

  publicWarrants: number; // number of public warrants outstanding
  warrantStrike: number; // default 11.50
  warrantSharesPerWarrant: number; // shares per whole warrant, default 1.0 (sometimes 0.5)

  currentMarketPrice: number; // current SPAC share price (for premium/discount calc)

  // provenance flags — mark which fields are estimates vs. confirmed from filings
  estimatedFields: string[]; // e.g. ["spacPublicShares", "sponsorPromoteShares"]
}

/** The full computed picture for a single redemption scenario. */
export interface ScenarioResult {
  redemptionRate: number;
  targetShares: number;
  publicSharesRemaining: number;
  sponsorPromoteShares: number;
  pipeShares: number;
  totalShares: number;
  fullyDilutedShares: number;
  proFormaEquityValue: number;
  cashToNewco: number;
  netCashPerShare: number;
  ownership: { target: number; public: number; sponsor: number; pipe: number };
  navPremiumDiscount: number;
  marketImpliedEquityValue: number;
  warrantsInTheMoney: boolean;
}

/** Keys of DealTerms that are numeric — the fields the input panel edits and the engine consumes. */
export type NumericDealField = {
  [K in keyof DealTerms]: DealTerms[K] extends number ? K : never;
}[keyof DealTerms];
