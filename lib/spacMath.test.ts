import { describe, it, expect } from "vitest";
import { computeScenario, computeScenarioLadder } from "./spacMath";
import { seedDeals } from "./seedDeals";
import type { DealTerms } from "./types";

const ccxi = seedDeals[0]; // CCXI / Agility Robotics anchor deal

/** A compact synthetic deal used to exercise warrant dilution independently. */
function warrantDeal(overrides: Partial<DealTerms> = {}): DealTerms {
  return {
    id: "test-warrants",
    spacTicker: "TEST",
    spacName: "Test SPAC",
    targetName: "Test Target",
    postMergerTicker: "TST",
    announcementDate: "2026-01-01",
    targetPreMoneyEquity: 1_000_000_000,
    dealSharePrice: 10,
    spacPublicShares: 30_000_000,
    trustPerShare: 10,
    sponsorPromoteShares: 7_500_000,
    pipeAmount: 100_000_000,
    pipeSharePrice: 10,
    transactionFees: 20_000_000,
    publicWarrants: 10_000_000,
    warrantStrike: 11.5,
    warrantSharesPerWarrant: 1.0,
    currentMarketPrice: 10.0,
    estimatedFields: [],
    ...overrides,
  };
}

describe("computeScenario — 0% redemption (full trust delivered)", () => {
  const r = computeScenario(ccxi, 0);

  it("delivers the full trust: no shares redeemed, all public shares remain", () => {
    expect(r.publicSharesRemaining).toBe(42_000_000);
  });

  it("cash to NewCo matches the full trust + PIPE − fees", () => {
    // 42_000_000 * 10 + 200_000_000 − 30_000_000
    expect(r.cashToNewco).toBe(590_000_000);
  });
});

describe("golden master — CCXI / Agility at 0% redemption", () => {
  const r = computeScenario(ccxi, 0);

  it("share counts are exact", () => {
    expect(r.targetShares).toBe(250_000_000);
    expect(r.publicSharesRemaining).toBe(42_000_000);
    expect(r.sponsorPromoteShares).toBe(10_500_000);
    expect(r.pipeShares).toBe(20_000_000);
    expect(r.totalShares).toBe(322_500_000);
    expect(r.fullyDilutedShares).toBe(322_500_000); // publicWarrants = 0
  });

  it("valuation and cash figures are exact", () => {
    expect(r.proFormaEquityValue).toBe(3_225_000_000);
    expect(r.cashToNewco).toBe(590_000_000);
    expect(r.netCashPerShare).toBeCloseTo(590_000_000 / 322_500_000, 9); // ≈ $1.8295
  });

  it("ownership split matches and sums to 1.0", () => {
    expect(r.ownership.target).toBeCloseTo(250 / 322.5, 9);
    expect(r.ownership.public).toBeCloseTo(42 / 322.5, 9);
    expect(r.ownership.sponsor).toBeCloseTo(10.5 / 322.5, 9);
    expect(r.ownership.pipe).toBeCloseTo(20 / 322.5, 9);
  });

  it("market comparison figures are exact", () => {
    expect(r.navPremiumDiscount).toBeCloseTo((17.15 - 10) / 10, 9); // +71.5%
    expect(r.marketImpliedEquityValue).toBeCloseTo(17.15 * 322_500_000, 2);
    expect(r.warrantsInTheMoney).toBe(true); // 17.15 > 11.50
  });
});

describe("redemptions drain cash and shares but NOT the sponsor promote", () => {
  const r0 = computeScenario(ccxi, 0);
  const r50 = computeScenario(ccxi, 0.5);
  const r95 = computeScenario(ccxi, 0.95);

  it("public shares remaining drop with redemptions", () => {
    expect(r50.publicSharesRemaining).toBe(21_000_000);
    expect(r95.publicSharesRemaining).toBeCloseTo(2_100_000, 6);
    expect(r50.publicSharesRemaining).toBeLessThan(r0.publicSharesRemaining);
    expect(r95.publicSharesRemaining).toBeLessThan(r50.publicSharesRemaining);
  });

  it("cash to NewCo drops correctly as redemptions rise", () => {
    // 21_000_000 * 10 + 200_000_000 − 30_000_000
    expect(r50.cashToNewco).toBe(380_000_000);
    // 2_100_000 * 10 + 200_000_000 − 30_000_000
    expect(r95.cashToNewco).toBeCloseTo(191_000_000, 6);
    expect(r50.cashToNewco).toBeLessThan(r0.cashToNewco);
    expect(r95.cashToNewco).toBeLessThan(r50.cashToNewco);
  });

  it("total shares shrink as public holders redeem", () => {
    expect(r50.totalShares).toBeLessThan(r0.totalShares);
    expect(r95.totalShares).toBeLessThan(r50.totalShares);
  });

  it("sponsor promote shares are unchanged — that is the point", () => {
    expect(r0.sponsorPromoteShares).toBe(10_500_000);
    expect(r50.sponsorPromoteShares).toBe(10_500_000);
    expect(r95.sponsorPromoteShares).toBe(10_500_000);
  });

  it("sponsor OWNERSHIP % balloons as redemptions rise", () => {
    expect(r50.ownership.sponsor).toBeGreaterThan(r0.ownership.sponsor);
    expect(r95.ownership.sponsor).toBeGreaterThan(r50.ownership.sponsor);
  });
});

describe("ownership percentages always sum to 1.0", () => {
  const rates = [0, 0.1, 0.25, 0.5, 0.75, 0.95, 1];
  for (const rate of rates) {
    it(`sums to 1.0 at redemption ${rate}`, () => {
      const { ownership } = computeScenario(ccxi, rate);
      const sum =
        ownership.target + ownership.public + ownership.sponsor + ownership.pipe;
      expect(sum).toBeCloseTo(1.0, 10);
    });
  }
});

describe("warrant dilution toggles only when currentMarketPrice > warrantStrike", () => {
  it("out of the money: price below strike → no dilution", () => {
    const r = computeScenario(warrantDeal({ currentMarketPrice: 10 }), 0);
    expect(r.warrantsInTheMoney).toBe(false);
    expect(r.fullyDilutedShares).toBe(r.totalShares); // no warrant shares added
  });

  it("at the strike exactly → still out of the money (strict >)", () => {
    const r = computeScenario(warrantDeal({ currentMarketPrice: 11.5 }), 0);
    expect(r.warrantsInTheMoney).toBe(false);
    expect(r.fullyDilutedShares).toBe(r.totalShares);
  });

  it("in the money: price above strike → warrants dilute", () => {
    const r = computeScenario(warrantDeal({ currentMarketPrice: 12 }), 0);
    expect(r.warrantsInTheMoney).toBe(true);
    // 10_000_000 warrants * 1.0 shares each
    expect(r.fullyDilutedShares).toBe(r.totalShares + 10_000_000);
  });

  it("respects warrantSharesPerWarrant = 0.5", () => {
    const r = computeScenario(
      warrantDeal({ currentMarketPrice: 12, warrantSharesPerWarrant: 0.5 }),
      0,
    );
    expect(r.fullyDilutedShares).toBe(r.totalShares + 5_000_000);
  });
});

describe("netCashPerShare decreases monotonically as redemption rate rises", () => {
  it("is strictly decreasing across the full spectrum", () => {
    const rates = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.95, 1];
    const ladder = computeScenarioLadder(ccxi, rates);
    for (let i = 1; i < ladder.length; i++) {
      expect(ladder[i].netCashPerShare).toBeLessThan(ladder[i - 1].netCashPerShare);
    }
  });
});

describe("computeScenarioLadder", () => {
  it("maps each rate to a result in order", () => {
    const rates = [0, 0.25, 0.5, 0.75, 0.95];
    const ladder = computeScenarioLadder(ccxi, rates);
    expect(ladder).toHaveLength(rates.length);
    ladder.forEach((res, i) => expect(res.redemptionRate).toBe(rates[i]));
  });
});

describe("redemption rate is clamped to [0, 1]", () => {
  it("clamps values above 1 and never yields negative public shares", () => {
    const r = computeScenario(ccxi, 1.5);
    expect(r.redemptionRate).toBe(1);
    expect(r.publicSharesRemaining).toBe(0);
  });

  it("clamps negative values to 0", () => {
    const r = computeScenario(ccxi, -0.3);
    expect(r.redemptionRate).toBe(0);
    expect(r.publicSharesRemaining).toBe(ccxi.spacPublicShares);
  });
});
