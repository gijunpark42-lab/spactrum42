"use client";

import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  LabelList,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Panel } from "./ui";
import { formatCompact } from "@/lib/format";
import type { DealTerms, ScenarioResult } from "@/lib/types";

type Kind = "reference" | "add" | "sub" | "total";

type Row = {
  name: string;
  fullName: string;
  base: number; // transparent offset
  bar: number; // visible height
  delta: number; // signed change this step
  kind: Kind;
};

const COLORS: Record<Kind, string> = {
  reference: "#4A5A6E", // neutral slate — context, not cash
  add: "#6C8CF5", // cash coming in
  sub: "#F1707B", // cash leaving (directional red)
  total: "#37B7C3", // accent — the honest endpoint
};

/**
 * Waterfall bridging the deal's headline to the cash that actually reaches the
 * combined company. The tall "Target pre-money" reference bar next to the small
 * "Net cash to NewCo" bar is the whole point: most of the headline is not cash.
 */
export function ValuationWaterfall({
  deal,
  result,
}: {
  deal: DealTerms;
  result: ScenarioResult;
}) {
  const trustCash = result.publicSharesRemaining * deal.trustPerShare;
  const pipe = deal.pipeAmount;
  const fees = deal.transactionFees;
  const netCash = result.cashToNewco;

  // Running values along the cash bridge.
  const afterTrust = trustCash;
  const afterPipe = trustCash + pipe;
  const afterFees = afterPipe - fees; // === netCash

  const step = (
    fullName: string,
    name: string,
    start: number,
    end: number,
    kind: Kind,
  ): Row => ({
    name,
    fullName,
    base: Math.min(start, end),
    bar: Math.abs(end - start),
    delta: end - start,
    kind,
  });

  const data: Row[] = [
    step("Target pre-money equity", "Pre-money", 0, deal.targetPreMoneyEquity, "reference"),
    step("Trust cash delivered", "+ Trust", 0, afterTrust, "add"),
    step("PIPE proceeds", "+ PIPE", afterTrust, afterPipe, "add"),
    step("Transaction fees", "− Fees", afterPipe, afterFees, "sub"),
    step("Net cash to NewCo", "Net cash", 0, netCash, "total"),
  ];

  const renderLabel = (props: {
    x?: number | string;
    y?: number | string;
    width?: number | string;
    index?: number;
  }) => {
    const { x = 0, y = 0, width = 0, index = 0 } = props;
    const row = data[index];
    const px = Number(x) + Number(width) / 2;
    const py = Number(y) - 6;
    const sign = row.kind === "sub" ? "−" : row.kind === "add" ? "+" : "";
    return (
      <text
        x={px}
        y={py}
        textAnchor="middle"
        className="fill-ink font-mono"
        style={{ fontSize: 10, fontVariantNumeric: "tabular-nums" }}
      >
        {sign}
        {formatCompact(Math.abs(row.delta))}
      </text>
    );
  };

  return (
    <Panel
      title="Valuation waterfall"
      info="Bridges the headline pre-money equity to the cash that actually lands on the balance sheet: remaining trust + PIPE − fees = net cash to NewCo. The gap between the two tall-vs-short bars is the value that leaks out."
    >
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 24, right: 8, bottom: 4, left: 8 }}>
            <XAxis
              dataKey="name"
              tick={{ fill: "#8A98AB", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "#212B38" }}
              interval={0}
            />
            <YAxis
              tickFormatter={(v) => formatCompact(Number(v))}
              tick={{ fill: "#5C6B7E", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              width={52}
            />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.03)" }}
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const row = payload[0].payload as Row;
                const sign = row.kind === "sub" ? "−" : row.kind === "add" ? "+" : "";
                return (
                  <div className="rounded-md border border-border-strong bg-elevated px-3 py-2 text-xs shadow-xl">
                    <div className="font-medium text-ink">{row.fullName}</div>
                    <div className="num mt-0.5 text-muted">
                      {sign}
                      {formatCompact(Math.abs(row.delta))}
                    </div>
                  </div>
                );
              }}
            />
            <Bar dataKey="base" stackId="a" fill="transparent" isAnimationActive={false} />
            <Bar dataKey="bar" stackId="a" isAnimationActive={false} radius={[2, 2, 0, 0]}>
              {data.map((row) => (
                <Cell key={row.name} fill={COLORS[row.kind]} />
              ))}
              <LabelList content={renderLabel} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}
