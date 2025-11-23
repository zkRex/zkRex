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

  const currateTokenList = [
      {
          address: "0x97eec1c29f745dC7c267F90292AA663d997a601D",
          name: "USD Coin",
          symbol: "USDC",
          decimals: 6,
      },
      {
          address: "0x8C4aCd74Ff4385f3B7911432FA6787Aa14406f8B",
          name: "Tether",
          symbol: "USDT",
          decimals: 6,
      },
  ]

  // If a dedicated USDC address is provided, ensure USDC is present in the curated list

    for (const token of currateTokenList) {
        const target = token.address.trim().toLowerCase();
        const hasUSDC = list.some(
            (t) => typeof t?.address === "string" && t.address.toLowerCase() === target
        );
        if (!hasUSDC) {
            list = [
                ...list,
                token,
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