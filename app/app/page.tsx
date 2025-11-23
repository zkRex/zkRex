"use client";

import Link from "next/link";
import * as React from "react";
import {useEffect, useMemo, useState} from "react";
import {ethers} from "ethers";
import {usePrivy} from "@privy-io/react-auth";
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
import {getCuratedTokens, getNativeAssetMeta} from "@/lib/curretedAssets";

type Asset = {
  symbol: string;
  name: string;
  balance: string; // human-readable string
  address?: string; // token address for ERC20
  decimals?: number;
  type: "native" | "erc20";
};

// Minimal ERC20 ABI for balance and metadata
const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)"
];

// Sapphire (Oasis) Testnet RPC
const SAPPHIRE_TESTNET_RPC = "https://testnet.sapphire.oasis.io";


export default function DashboardPage() {
  const { user } = usePrivy();
  const address = useMemo(() => {
    // Prefer embedded wallet address if present; fall back to first wallet
    // Privy user.wallet (embedded) or user.linkedAccounts (externals)
    // @ts-ignore optional chaining for various shapes
    return (
      user?.wallet?.address ||
      // @ts-ignore
      user?.linkedAccounts?.find?.((a: any) => a.type === "wallet")?.address ||
      undefined
    ) as string | undefined;
  }, [user]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [chartData, setChartData] = useState<{ date: string; value: number }[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!address) return;
      setLoading(true);
      setError(null);
      try {
        const provider = new ethers.JsonRpcProvider(SAPPHIRE_TESTNET_RPC);

        // Native balance (ROSE on Sapphire)
        const raw = await provider.getBalance(address);
        const nativeBalance = ethers.formatEther(raw);

        const nativeMeta = getNativeAssetMeta();
        const list: Asset[] = [
          {
            type: "native",
            name: nativeMeta.name,
            symbol: nativeMeta.symbol,
            balance: nativeBalance,
          },
        ];

        // Optional curated ERC-20 list from env
        const curated = getCuratedTokens();
        for (const t of curated) {
          try {
            const erc = new ethers.Contract(t.address, ERC20_ABI, provider);
            const [rawBal, decimals, symbol, name] = await Promise.all([
              erc.balanceOf(address),
              // prefer provided decimals if present to avoid extra RPCs
              t.decimals != null ? Promise.resolve(t.decimals) : erc.decimals(),
              t.symbol ? Promise.resolve(t.symbol) : erc.symbol(),
              t.name ? Promise.resolve(t.name) : erc.name(),
            ]);
            const human = ethers.formatUnits(rawBal, Number(decimals));
            // Skip zero balances to keep UI clean
            if (human === "0.0" || human === "0") continue;
            list.push({
              type: "erc20",
              name: String(name),
              symbol: String(symbol),
              balance: human,
              address: t.address,
              decimals: Number(decimals),
            });
          } catch (e) {
            // ignore individual token errors
          }
        }

        if (!cancelled) {
          setAssets(list);
          // For now, we don’t have historical data on testnet; show a flat series for last 90 days.
          const days = 90;
          const today = new Date();
          const totalValue = Number(nativeBalance); // native units; no USD pricing
          const series: { date: string; value: number }[] = [];
          for (let i = days - 1; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            series.push({
              date: d.toISOString().slice(0, 10),
              value: totalValue,
            });
          }
          setChartData(series);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load portfolio");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [address]);

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
          {address && (
            <p className="mt-3 text-xs text-muted-foreground">
              Network: Oasis Sapphire Testnet • Address: {address}
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
                <TableHead className="text-right">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="py-10 text-center text-sm text-muted-foreground">
                    Loading your balances…
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={3} className="py-10 text-center text-sm text-rose-600">
                    {error}
                  </TableCell>
                </TableRow>
              ) : assets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="py-10">
                    <div className="flex flex-col items-center justify-center gap-3 text-center">
                      <p className="text-sm text-muted-foreground">
                        No assets detected on Sapphire Testnet.
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
                  <TableRow key={(a.address || a.symbol) + a.type}>
                    <TableCell>{a.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {a.symbol}
                    </TableCell>
                    <TableCell className="text-right">
                      {Number(a.balance).toLocaleString(undefined, { maximumFractionDigits: 6 })}
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
