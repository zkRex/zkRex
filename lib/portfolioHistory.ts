// lib/portfolioHistory.ts
// Lightweight client-side portfolio history using localStorage.
// Stores per-wallet daily snapshots to power the time-series chart without external APIs.
// TODO: Replace or augment with a server-backed history when a pricing/data provider is available.

export type PortfolioPoint = {
  date: string; // YYYY-MM-DD in local time
  totalUSD: number; // currently based on mock USD values
  byAsset?: Record<string, { balance: number; valueUSD: number }>; // optional per-asset breakdown
};

const NAMESPACE = "zkrex:history";
const NETWORK_KEY = "sapphire-testnet"; // Scope history per network

function getKey(address: string) {
  return `${NAMESPACE}:${NETWORK_KEY}:${address.toLowerCase()}`;
}

function safeGetStorage(): Storage | null {
  try {
    if (typeof window !== "undefined" && window.localStorage) return window.localStorage;
  } catch {}
  return null;
}

export function loadHistory(address: string): PortfolioPoint[] {
  const store = safeGetStorage();
  if (!store) return [];
  try {
    const raw = store.getItem(getKey(address));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as PortfolioPoint[];
    return [];
  } catch {
    return [];
  }
}

export function saveHistory(address: string, points: PortfolioPoint[]) {
  const store = safeGetStorage();
  if (!store) return;
  try {
    store.setItem(getKey(address), JSON.stringify(points));
  } catch {
    // ignore quota or serialization errors in client-only history
  }
}

export function upsertToday(address: string, point: PortfolioPoint) {
  const today = point.date;
  let points = loadHistory(address);
  const idx = points.findIndex((p) => p.date === today);
  if (idx >= 0) {
    points[idx] = point;
  } else {
    points.push(point);
  }
  // ensure sorted by date ascending
  points.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  saveHistory(address, points);
}

export function pruneToDays(points: PortfolioPoint[], days: number, today?: Date): PortfolioPoint[] {
  if (points.length === 0) return points;
  const end = today ? new Date(today) : new Date();
  const start = new Date(end);
  start.setDate(end.getDate() - (days - 1));
  const startStr = toDateStr(start);
  return points.filter((p) => p.date >= startStr);
}

export function fillMissingDays(points: PortfolioPoint[], days: number, today?: Date): PortfolioPoint[] {
  const end = today ? new Date(today) : new Date();
  const filled: PortfolioPoint[] = [];
  // build a quick map for lookups
  const map = new Map(points.map((p) => [p.date, p] as const));
  let lastVal = 0;
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(end);
    d.setDate(end.getDate() - i);
    const ds = toDateStr(d);
    const hit = map.get(ds);
    if (hit) {
      lastVal = hit.totalUSD;
      filled.push(hit);
    } else {
      filled.push({ date: ds, totalUSD: lastVal });
    }
  }
  return filled;
}

export function toDateStr(d: Date): string {
  // YYYY-MM-DD in local time (aligns with the chart X axis formatting already used)
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
