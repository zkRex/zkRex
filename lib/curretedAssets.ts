// Optional curated token list via env (JSON array of {address,name,symbol,decimals})
export function getCuratedTokens(): { address: string; name?: string; symbol?: string; decimals?: number }[] {
  try {
    const raw = process.env.NEXT_PUBLIC_TOKENS;
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}

// Central place for curated/native asset metadata used across the app
// Sapphire Testnet native token metadata
export function getNativeAssetMeta(): { name: string; symbol: string } {
  return {
    name: "ROSE (Testnet)",
    symbol: "ROSEt",
  };
}