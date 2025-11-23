"use client";

import Link from "next/link";
import * as React from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

type Asset = {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
};

export default function DashboardPage() {
  // Placeholder state while wiring up real data. Defaults to empty to show the empty-state table.
  const [assets, setAssets] = React.useState<Asset[]>([]);

  // Example: placeholder chart data (could be empty to reflect no history yet)
  const [chartData] = React.useState<{ date: string; value: number }[]>([]);

  const chartConfig = {
    value: {
      label: "Portfolio Value",
      color: "hsl(var(--chart-1))",
    },
  } as const;

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="mx-auto w-full max-w-6xl px-6 py-8 sm:px-8">
        <header className="mb-8 flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Overview of your portfolio and eligible assets.
          </p>
        </header>

        {/* Chart Section */}
        <section className="mb-10 rounded-2xl border bg-card p-4 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium">Portfolio</h2>
            <Link
              href="/app/trade"
              className="inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Go to Trade
            </Link>
          </div>
          <ChartContainer config={chartConfig} className="h-[260px] w-full">
            <ResponsiveContainer>
              <LineChart data={chartData} margin={{ left: 12, right: 12 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={24}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  width={40}
                />
                <ChartTooltip
                  cursor={{ stroke: "hsl(var(--border))" }}
                  content={<ChartTooltipContent />} 
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="var(--color-value)"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
          {chartData.length === 0 && (
            <p className="mt-3 text-xs text-muted-foreground">
              No portfolio history yet.
            </p>
          )}
        </section>

        {/* Assets Section */}
        <section className="rounded-2xl border bg-card p-4 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium">Your Assets</h2>
            <Link
              href="/app/assets"
              className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground transition-colors hover:opacity-90"
            >
              Browse Assets
            </Link>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Ticker</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">24h</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-10">
                    <div className="flex flex-col items-center justify-center gap-3 text-center">
                      <p className="text-sm text-muted-foreground">
                        No assets, start trading now!
                      </p>
                      <Link
                        href="/app/assets"
                        className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground transition-colors hover:opacity-90"
                      >
                        Go to Assets
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                assets.map((a) => (
                  <TableRow key={a.symbol}>
                    <TableCell>{a.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {a.symbol}
                    </TableCell>
                    <TableCell className="text-right">
                      ${a.price.toLocaleString()}
                    </TableCell>
                    <TableCell
                      className={`text-right ${
                        a.change24h >= 0 ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {a.change24h >= 0 ? "+" : ""}
                      {a.change24h.toFixed(2)}%
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </section>
      </div>
    </div>
  );
}
