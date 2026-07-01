import type { DealTerms } from "./types";

/**
 * Seed deals for SPACtrum42.
 *
 * The anchor is the CCXI / Agility Robotics deal. CONFIRMED values are from the
 * June 24, 2026 announcement; PLACEHOLDER/ESTIMATE values are listed in
 * `estimatedFields` and badged in the UI so the tool stays honest about provenance.
 *
 * The three deals after it are well-known de-SPAC transactions included so the
 * Deal Explorer isn't empty. Their headline figures (pre-money/ticker/date/PIPE)
 * are widely reported, but the cap-table internals here are ILLUSTRATIVE
 * APPROXIMATIONS for demonstration and are flagged as estimates — verify every
 * figure against the actual S-4 / proxy before relying on it.
 */
export const seedDeals: DealTerms[] = [
  {
    id: "ccxi-agility",
    spacTicker: "CCXI",
    spacName: "Churchill Capital Corp XI",
    targetName: "Agility Robotics",
    postMergerTicker: "AGLT",
    announcementDate: "2026-06-24",

    targetPreMoneyEquity: 2_500_000_000, // CONFIRMED: $2.5B pre-money equity value
    dealSharePrice: 10.0, // CONFIRMED: PIPE priced at $10/share

    spacPublicShares: 42_000_000, // PLACEHOLDER: infer from ~$420M trust / $10; verify in S-4
    trustPerShare: 10.0, // PLACEHOLDER: verify in S-4

    sponsorPromoteShares: 10_500_000, // PLACEHOLDER: ~20% of post-IPO total; verify in S-4

    pipeAmount: 200_000_000, // CONFIRMED: ~$200M PIPE
    pipeSharePrice: 10.0, // CONFIRMED: PIPE committed at $10/share

    transactionFees: 30_000_000, // ESTIMATE: adjust once proxy discloses fees

    publicWarrants: 0, // PLACEHOLDER: verify unit composition in prospectus
    warrantStrike: 11.5,
    warrantSharesPerWarrant: 1.0,

    currentMarketPrice: 17.15, // as of 2026-06-30 — wire to live quote later

    estimatedFields: [
      "spacPublicShares",
      "trustPerShare",
      "sponsorPromoteShares",
      "transactionFees",
      "publicWarrants",
    ],
  },

  {
    id: "cciv-lucid",
    spacTicker: "CCIV",
    spacName: "Churchill Capital Corp IV",
    targetName: "Lucid Motors",
    postMergerTicker: "LCID",
    announcementDate: "2021-02-22",

    targetPreMoneyEquity: 11_750_000_000, // reported ~$11.75B pre-money equity value
    dealSharePrice: 10.0,

    spacPublicShares: 207_000_000, // CCIV raised $2.07B at $10/unit (largest SPAC IPO)
    trustPerShare: 10.0,

    sponsorPromoteShares: 51_750_000, // ~20% of post-IPO total (25% of public)

    pipeAmount: 2_500_000_000, // reported $2.5B PIPE
    pipeSharePrice: 15.0, // PIPE priced at $15/share

    transactionFees: 100_000_000, // ESTIMATE

    publicWarrants: 41_400_000, // ESTIMATE: 1/5 warrant per unit
    warrantStrike: 11.5,
    warrantSharesPerWarrant: 1.0,

    currentMarketPrice: 24.0, // ILLUSTRATIVE reference price

    estimatedFields: [
      "spacPublicShares",
      "trustPerShare",
      "sponsorPromoteShares",
      "transactionFees",
      "publicWarrants",
      "currentMarketPrice",
    ],
  },

  {
    id: "ipoe-sofi",
    spacTicker: "IPOE",
    spacName: "Social Capital Hedosophia Holdings V",
    targetName: "SoFi Technologies",
    postMergerTicker: "SOFI",
    announcementDate: "2021-01-07",

    targetPreMoneyEquity: 6_500_000_000, // ~$8.65B pro forma; ~$6.5B pre-money (approx)
    dealSharePrice: 10.0,

    spacPublicShares: 80_500_000, // IPOE raised ~$805M at $10/unit
    trustPerShare: 10.0,

    sponsorPromoteShares: 20_125_000, // ~20% of post-IPO total (25% of public)

    pipeAmount: 1_200_000_000, // reported ~$1.2B PIPE
    pipeSharePrice: 10.0,

    transactionFees: 60_000_000, // ESTIMATE

    publicWarrants: 13_416_667, // ESTIMATE: 1/6 warrant per unit
    warrantStrike: 11.5,
    warrantSharesPerWarrant: 1.0,

    currentMarketPrice: 19.0, // ILLUSTRATIVE reference price

    estimatedFields: [
      "targetPreMoneyEquity",
      "spacPublicShares",
      "trustPerShare",
      "sponsorPromoteShares",
      "transactionFees",
      "publicWarrants",
      "currentMarketPrice",
    ],
  },

  {
    id: "ggpi-polestar",
    spacTicker: "GGPI",
    spacName: "Gores Guggenheim Inc",
    targetName: "Polestar",
    postMergerTicker: "PSNY",
    announcementDate: "2021-09-27",

    targetPreMoneyEquity: 20_000_000_000, // reported ~$20B equity value
    dealSharePrice: 10.0,

    spacPublicShares: 80_000_000, // GGPI raised ~$800M at $10/unit
    trustPerShare: 10.0,

    sponsorPromoteShares: 20_000_000, // ~20% of post-IPO total (25% of public)

    pipeAmount: 250_000_000, // reported ~$250M PIPE
    pipeSharePrice: 10.0,

    transactionFees: 70_000_000, // ESTIMATE

    publicWarrants: 16_000_000, // ESTIMATE: 1/5 warrant per unit
    warrantStrike: 11.5,
    warrantSharesPerWarrant: 1.0,

    currentMarketPrice: 10.3, // ILLUSTRATIVE reference price

    estimatedFields: [
      "spacPublicShares",
      "trustPerShare",
      "sponsorPromoteShares",
      "pipeAmount",
      "transactionFees",
      "publicWarrants",
      "currentMarketPrice",
    ],
  },
];

/** Convenience lookup of the anchor deal used as the default in the analyzer. */
export const defaultDeal: DealTerms = seedDeals[0];
