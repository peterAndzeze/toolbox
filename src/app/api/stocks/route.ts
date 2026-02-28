import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SYMBOLS = [
  { symbol: "000001.SS", name: "上证指数", market: "cn" },
  { symbol: "399001.SZ", name: "深证成指", market: "cn" },
  { symbol: "399006.SZ", name: "创业板指", market: "cn" },
  { symbol: "%5EIXIC", name: "纳斯达克", market: "us" },
  { symbol: "%5EGSPC", name: "标普500", market: "us" },
  { symbol: "%5EDJI", name: "道琼斯", market: "us" },
];

interface StockResult {
  name: string;
  code: string;
  market: string;
  price: string;
  change: string;
  changePercent: string;
  isUp: boolean;
}

async function fetchYahoo(symbol: string, name: string, market: string): Promise<StockResult | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; bot/1.0)" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const meta = data?.chart?.result?.[0]?.meta;
    if (!meta) return null;
    const current = meta.regularMarketPrice;
    const prevClose = meta.chartPreviousClose || meta.previousClose;
    if (!current || !prevClose) return null;
    const diff = current - prevClose;
    const pct = (diff / prevClose) * 100;
    return {
      name,
      code: symbol,
      market,
      price: current.toFixed(2),
      change: (diff >= 0 ? "+" : "") + diff.toFixed(2),
      changePercent: (pct >= 0 ? "+" : "") + pct.toFixed(2) + "%",
      isUp: diff >= 0,
    };
  } catch {
    return null;
  }
}

export async function GET() {
  const results = await Promise.all(
    SYMBOLS.map((s) => fetchYahoo(s.symbol, s.name, s.market))
  );
  const all = results.filter(Boolean) as StockResult[];
  const cn = all.filter((s) => s.market === "cn");
  const us = all.filter((s) => s.market === "us");
  return NextResponse.json(
    { cn, us, ts: Date.now() },
    { headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=60" } }
  );
}
