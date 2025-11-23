// Optional curated token list via env (JSON array of {address,name,symbol,decimals})
// Also supports a dedicated USDC env var: NEXT_PUBLIC_USDC_ADDRESS (decimals assumed 6)
export function getCuratedTokens(): { address: string; name?: string; symbol?: string; decimals?: number }[] {
  let list: { address: string; name?: string; symbol?: string; decimals?: number }[] = [];
  try {
    const raw = process.env.NEXT_PUBLIC_TOKENS;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) list = parsed;
    }
  } catch {
    // ignore parse errors and fall back to empty list
  }

  // If a dedicated USDC address is provided, ensure USDC is present in the curated list
  const usdcAddr = process.env.NEXT_PUBLIC_USDC_ADDRESS;
  if (usdcAddr && typeof usdcAddr === "string" && usdcAddr.trim()) {
    const target = usdcAddr.trim().toLowerCase();
    const hasUSDC = list.some(
      (t) => typeof t?.address === "string" && t.address.toLowerCase() === target
    );
    if (!hasUSDC) {
      list = [
        ...list,
        {
          address: usdcAddr.trim(),
          name: "USD Coin",
          symbol: "USDC",
          decimals: 6,
        },
      ];
    }
  }

  return list;
}

// Central place for curated/native asset metadata used across the app
// Sapphire Testnet native token metadata
export function getNativeAssetMeta(): { name: string; symbol: string } {
  return {
    name: "ROSE (Testnet)",
    symbol: "ROSEt",
  };
}