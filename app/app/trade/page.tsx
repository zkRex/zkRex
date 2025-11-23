"use client";

import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import { usePrivy } from "@privy-io/react-auth";
import { getCuratedTokens, getNativeAssetMeta } from "@/lib/curretedAssets";

// Minimal ERC20 ABI for reading balance and metadata
const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
];

// Sapphire (Oasis) Testnet RPC
const SAPPHIRE_TESTNET_RPC = "https://testnet.sapphire.oasis.io";

type TokenMeta = {
  address?: string; // undefined for native token
  name: string;
  symbol: string;
  decimals: number; // 18 for native; ERC20 specific otherwise
};

type BalanceItem = TokenMeta & {
  raw: bigint; // raw on-chain units
  human: string; // formatted string for display
};

function isNonZero(bi: BalanceItem): boolean {
  try {
    return bi.raw > 0 && Number(bi.human) > 0;
  } catch {
    return bi.raw > 0;
  }
}

export default function TradePage() {
  const { user } = usePrivy();
  const address = useMemo(() => {
    // Prefer embedded wallet; fall back to first linked wallet
    // @ts-ignore varying shapes from Privy
    return (
      user?.wallet?.address ||
      // @ts-ignore
      user?.linkedAccounts?.find?.((a: any) => a.type === "wallet")?.address ||
      undefined
    ) as string | undefined;
  }, [user]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [balances, setBalances] = useState<BalanceItem[]>([]);

  const curatedList = useMemo(() => getCuratedTokens(), []);

  // Derived lists for selects
  const fromOptions = useMemo(
    () => balances.filter(isNonZero),
    [balances]
  );

  const toOptions = useMemo(() => {
    // Convert curated list into token meta; decimals may be provided by env, default to 18
    return curatedList.map((t) => ({
      address: t.address,
      name: t.name ?? t.symbol ?? "Unknown",
      symbol: t.symbol ?? t.name ?? "TKN",
      decimals: t.decimals ?? 18,
    }));
  }, [curatedList]);

  const [fromToken, setFromToken] = useState<string>(""); // key = symbol|address|native
  const [toToken, setToToken] = useState<string>("");
  const [amount, setAmount] = useState<string>("");

  // Load balances for native + curated ERC20s
  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!address) return;
      setLoading(true);
      setError(null);
      try {
        const provider = new ethers.JsonRpcProvider(SAPPHIRE_TESTNET_RPC);

        const items: BalanceItem[] = [];

        // Native token (ROSE on Sapphire)
        try {
          const nativeRaw = await provider.getBalance(address);
          const nativeMeta = getNativeAssetMeta();
          const human = ethers.formatEther(nativeRaw);
          items.push({
            address: undefined,
            name: nativeMeta.name,
            symbol: nativeMeta.symbol,
            decimals: 18,
            raw: nativeRaw,
            human,
          });
        } catch (e) {
          // ignore native fetch errors; continue with ERC20s
        }

        // Curated ERC-20 balances
        const curated = getCuratedTokens();
        for (const t of curated) {
          if (!t?.address) continue;
          try {
            const erc = new ethers.Contract(t.address, ERC20_ABI, provider);
            const [rawBal, decimals, symbol, name] = await Promise.all([
              erc.balanceOf(address),
              // prefer on-chain metadata but fall back to curated
              erc.decimals().catch(() => t.decimals ?? 18),
              erc.symbol().catch(() => t.symbol ?? "TKN"),
              erc.name().catch(() => t.name ?? t.symbol ?? "Token"),
            ]);
            const dec = Number(decimals ?? t.decimals ?? 18);
            const human = ethers.formatUnits(rawBal, dec);
            items.push({
              address: t.address,
              name,
              symbol,
              decimals: dec,
              raw: rawBal as unknown as bigint,
              human,
            });
          } catch (e) {
            // ignore single token failure; continue others
          }
        }

        if (!cancelled) {
          setBalances(items);
          // Preselect sensible defaults
          const firstWithBalance = items.find(isNonZero);
          if (firstWithBalance) setFromToken(keyFor(firstWithBalance));
          if (toOptions.length > 0) setToToken(keyForMeta(toOptions[0]));
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Failed to load balances");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [address, toOptions.length]);

  function keyFor(b: BalanceItem): string {
    return b.address ? `erc20:${b.address.toLowerCase()}` : `native`;
  }
  function keyForMeta(m: { address?: string; symbol: string }): string {
    return m.address ? `erc20:${m.address.toLowerCase()}` : `symbol:${m.symbol}`;
  }

  const selectedFrom = useMemo(() => {
    return balances.find((b) => keyFor(b) === fromToken);
  }, [balances, fromToken]);

  const selectedToMeta = useMemo(() => {
    return toOptions.find((t) => keyForMeta(t) === toToken);
  }, [toOptions, toToken]);

  const amountNum = useMemo(() => Number(amount || "0"), [amount]);
  const hasValidAmount = amountNum > 0;

  const canSwap = !!selectedFrom && !!selectedToMeta && hasValidAmount;

  function onSwapClick() {
    // Placeholder: wire up later
    // eslint-disable-next-line no-alert
    alert("Swap action will be wired up later.");
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Trade</h1>

      {!address && (
        <div className="mb-6 rounded-md border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-800">
          Connect your wallet to load balances and trade.
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="space-y-4 rounded-lg border p-4">
        {/* From token (user has balance) */}
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">From</label>
          <div className="flex gap-3">
            <select
              className="w-1/2 rounded-md border bg-background p-2 text-sm"
              value={fromToken}
              onChange={(e) => setFromToken(e.target.value)}
              disabled={!address || loading || fromOptions.length === 0}
            >
              {fromOptions.length === 0 ? (
                <option value="">{loading ? "Loading…" : "No tokens with balance"}</option>
              ) : (
                fromOptions.map((b) => (
                  <option key={keyFor(b)} value={keyFor(b)}>
                    {b.symbol}
                  </option>
                ))
              )}
            </select>
            <input
              type="number"
              inputMode="decimal"
              placeholder="0.0"
              className="w-1/2 rounded-md border bg-background p-2 text-right text-sm"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
            />
          </div>
          {selectedFrom && (
            <p className="mt-1 text-xs text-muted-foreground">
              Balance: {Number(selectedFrom.human).toLocaleString(undefined, { maximumFractionDigits: 6 })} {selectedFrom.symbol}
            </p>
          )}
        </div>

        {/* To token (curated list) */}
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">To</label>
          <select
            className="w-full rounded-md border bg-background p-2 text-sm"
            value={toToken}
            onChange={(e) => setToToken(e.target.value)}
            disabled={toOptions.length === 0}
          >
            {toOptions.length === 0 ? (
              <option value="">No curated tokens configured</option>
            ) : (
              toOptions.map((t) => (
                <option key={keyForMeta(t)} value={keyForMeta(t)}>
                  {t.symbol} {t.address ? "(ERC20)" : ""}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={onSwapClick}
            disabled={!canSwap}
            className={`inline-flex w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm ${
              canSwap ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Swap
          </button>
          {!hasValidAmount && (
            <p className="mt-2 text-center text-xs text-muted-foreground">Enter an amount to trade.</p>
          )}
        </div>
      </div>

      {loading && (
        <p className="mt-4 text-sm text-muted-foreground">Loading balances…</p>
      )}
    </div>
  );
}
