# SPACtrum42

**What a SPAC merger *actually* values a company at — across the full redemption spectrum.**

When a SPAC announces a deal, the press release leads with a **pre-money equity value**
(e.g. Agility Robotics merging with Churchill Capital Corp XI at a **$2.5B pre-money equity
value**, future ticker **AGLT**). Retail investors read that and assume the stock's market
cap becomes $2.5B. **It doesn't.** The real post-merger economics are reshaped by three
things the headline hides:

1. **Sponsor promote** — founders got ~20% of the SPAC's shares for almost nothing; those shares dilute everyone.
2. **PIPE issuance** — new shares sold to institutions to fund the deal.
3. **Redemptions** — public SPAC holders can redeem at ~$10 and walk away, draining the trust cash that was supposed to reach the target.

SPACtrum42 takes a deal's terms and instantly computes the pro forma cap table, the true
post-money equity value, the **net cash per share** (the honest dilution metric), and
whether the current stock price trades at a premium or discount to what the deal actually
implies — from 0% to 100% redemptions.

> **The core thesis:** _headline pre-money equity value ≠ post-merger market cap._
> The gap between the $10 "deal price" and the real **net cash per share** is the cost of
> going public this way (promote + fees + redemptions) — the number the press release
> never shows.

---

## Features

- **Single-deal analyzer** (`/`)
  - Fully editable deal terms, with an amber **`est.`** badge + tooltip on any field not confirmed from a filing.
  - **Redemption slider** (0%→100%) that recomputes every visual live, with 0 / 25 / 50 / 75 / 95% quick-sets.
  - **Cap-table donut** — target / public / sponsor / PIPE ownership at the current redemption rate.
  - **Valuation waterfall** — headline pre-money vs. the cash that actually reaches the balance sheet (trust + PIPE − fees).
  - **Net-cash-per-share gauge** — the headline honesty metric, colored green ≥ $9 / amber $7–9 / red < $7.
  - **Premium / discount badge** — market price vs. $10 NAV, plus market-implied combined equity value.
- **Scenario + sensitivity**
  - **Scenario ladder table** across {0, 25, 50, 75, 95}% redemptions — watch sponsor % balloon and net cash crater.
  - **Sensitivity heatmap** — redemption rate × assumed share price ($5–$15), toggling between market-implied equity value and net cash per share.
- **Deal Explorer** (`/explore`) — a card grid of all seeded deals; click any card to load it into the analyzer.

Every derived metric carries a one-sentence info tooltip explaining its formula.

---

## Tech stack

- **Next.js 14** (App Router) + **TypeScript** (strict mode)
- **Tailwind CSS** (dark, Bloomberg-terminal-meets-fintech theme)
- **Recharts** for the donut and waterfall
- **Vitest** for the calculation-engine unit tests
- Pure, dependency-free math engine in `lib/spacMath.ts` — no React/DOM imports, so it is
  unit-testable in isolation and reusable by the optional Phase 2 backend.
- No backend required for the app; everything runs client-side.

---

## Getting started

```bash
npm install     # install dependencies
npm run dev     # start the dev server at http://localhost:3000
npm run test    # run the Vitest engine suite
npm run build   # production build (also type-checks)
```

Deploy target is **Vercel** (zero-config for Next.js).

---

## Calculation reference (`lib/spacMath.ts`)

`computeScenario(deal, redemptionRate)` with `redemptionRate ∈ [0, 1]`:

```
targetShares          = targetPreMoneyEquity / dealSharePrice
sharesRedeemed        = redemptionRate * spacPublicShares
publicSharesRemaining = (1 - redemptionRate) * spacPublicShares
pipeShares            = pipeAmount / pipeSharePrice

totalShares           = targetShares + publicSharesRemaining
                        + sponsorPromoteShares + pipeShares

proFormaEquityValue   = totalShares * dealSharePrice

cashToNewco           = publicSharesRemaining * trustPerShare
                        + pipeAmount
                        - transactionFees
netCashPerShare       = cashToNewco / totalShares

// ownership split (sums to 1.0)
ownership.target      = targetShares / totalShares
ownership.public      = publicSharesRemaining / totalShares
ownership.sponsor     = sponsorPromoteShares / totalShares
ownership.pipe        = pipeShares / totalShares

// market comparison
navPremiumDiscount        = (currentMarketPrice - trustPerShare) / trustPerShare
marketImpliedEquityValue  = currentMarketPrice * totalShares

// warrant dilution (only if in the money)
warrantsInTheMoney    = currentMarketPrice > warrantStrike
dilutiveWarrantShares = warrantsInTheMoney ? publicWarrants * warrantSharesPerWarrant : 0
fullyDilutedShares    = totalShares + dilutiveWarrantShares
```

`computeScenarioLadder(deal, rates[])` maps an array of rates to results (scenario table + heatmap).

**Why `netCashPerShare` is the metric that matters:** it answers _"for every share of the
combined company, how much cash from this deal actually landed on the balance sheet?"_ The
sponsor promote never redeems, so as public holders redeem, the promote's slice grows while
the cash shrinks — net cash per share falls **monotonically** as redemptions rise.

### Tests

`lib/spacMath.test.ts` (run with `npm run test`) covers:

- 0% redemption delivers the full trust; cash matches expected.
- 50% / 95% redemption: cash and share counts drop, **sponsor promote does not** (dilution worsens).
- Ownership percentages always sum to 1.0 (within floating-point tolerance).
- Warrant dilution toggles on only when `currentMarketPrice > warrantStrike`.
- `netCashPerShare` decreases monotonically as the redemption rate rises.
- A golden-master check on the seeded CCXI/Agility deal at 0% redemption.

---

## Seed data provenance

Deals ship in `lib/seedDeals.ts`. **Confirmed** values come from public announcements;
**placeholder/estimate** values are listed in each deal's `estimatedFields` and badged
`est.` in the UI — the whole point of the tool is honesty about SPAC economics.

**CCXI / Agility Robotics anchor** (the primary seed):

- $2.5B pre-money equity value; >$620M expected gross proceeds
- ~$420M in trust (assuming no redemptions) + ~$200M PIPE @ $10
- Post-merger ticker **AGLT**; deal announced June 24, 2026; targeted to close in 2026
- CCXI IPO'd at $10.00/unit; sponsor is Michael Klein's Churchill franchise

Its estimated fields (`spacPublicShares`, `trustPerShare`, `sponsorPromoteShares`,
`transactionFees`, `publicWarrants`) are inferences to be verified in the S-4/proxy.

The additional Explorer seeds (Lucid / CCIV, SoFi / IPOE, Polestar / GGPI) use widely
reported headline figures; their cap-table internals are **illustrative approximations**
flagged as estimates — verify every figure against the actual filing before relying on it.

---

## Project structure

```
spactrum42/
├── app/
│   ├── layout.tsx          # shell: header nav + footer disclaimer
│   ├── page.tsx            # main analyzer
│   ├── explore/page.tsx    # deal explorer
│   └── globals.css
├── components/
│   ├── DealInputPanel.tsx  RedemptionSlider.tsx  CapTableChart.tsx
│   ├── ValuationWaterfall.tsx  NetCashGauge.tsx  PremiumDiscountBadge.tsx
│   ├── ScenarioTable.tsx  SensitivityHeatmap.tsx  DealCard.tsx
│   └── ui.tsx              # shared primitives (InfoTip, EstimateBadge, Panel, tones)
├── lib/
│   ├── spacMath.ts         # calculation engine (pure TS)
│   ├── spacMath.test.ts    # Vitest unit tests
│   ├── seedDeals.ts        # example deals incl. CCXI/Agility
│   ├── format.ts           # formatUSD, formatCompact, formatPct
│   └── types.ts            # DealTerms, ScenarioResult
├── package.json  vitest.config.ts  tailwind.config.ts  tsconfig.json  README.md
```

---

## Phase 2 (optional) — SEC EDGAR deal-term parser

A future Python **FastAPI** backend can auto-populate `DealTerms` from filings: fetch the
SPAC's most recent 8-K / Form 425 / S-4 from SEC EDGAR's free API (`https://data.sec.gov/`),
send the relevant text to the **Anthropic Claude API (`claude-sonnet-4-6`)** with a strict
prompt returning only JSON matching the `DealTerms` schema (unknown fields → `null`, listed
in `estimatedFields`), and return it to prefill the input panel. The pure engine in
`lib/spacMath.ts` is intentionally framework-free so the backend can reuse it verbatim.

---

## ⚠️ Disclaimer

**Not investment advice.** SPACtrum42 is an educational modeling tool. Every figure —
especially those badged `est.` — is an estimate or approximation. Verify all deal terms
against the company's actual SEC filings (S-4, 424B, 8-K, DEFM14A) before relying on any
number here. Market prices are user inputs, **not** real-time quotes.
