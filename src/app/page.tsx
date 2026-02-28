"use client";

import { useState, useMemo, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { tools, categories, getToolsByCategory, getToolByHref, type Tool } from "@/lib/tools-data";
import { getLunarDate, getSolarTermForDate, getYiJi, getChineseHoliday } from "@/lib/lunar";

const NEW_TOOLS = [
  "/tools/currency-converter", "/tools/calendar", "/tools/electricity-calculator",
  "/tools/fuel-calculator", "/tools/mortgage-calculator", "/tools/tax-calculator",
  "/tools/bmi-calculator", "/tools/date-calculator", "/tools/grid-image",
  "/tools/css-gradient", "/tools/css-shadow", "/tools/code-snapshot",
  "/tools/sql-to-java", "/tools/http-tester",
];

const WEEKDAY_NAMES = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

interface StockItem { name: string; code: string; price: string; change: string; changePercent: string; isUp: boolean }
interface WeatherData { temp: string; desc: string; city: string; humidity: string; feelsLike: string }

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [favHrefs, setFavHrefs] = useState<string[]>([]);
  const [recentHrefs, setRecentHrefs] = useState<string[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [cnStocks, setCnStocks] = useState<StockItem[]>([]);
  const [usStocks, setUsStocks] = useState<StockItem[]>([]);
  const [stocksLoading, setStocksLoading] = useState(true);

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat && categories.some((c) => c.id === cat)) {
      setActiveCategory(cat);
    }
    try {
      const f = JSON.parse(localStorage.getItem("toolbox_favorites") || "[]");
      if (Array.isArray(f)) setFavHrefs(f);
      const r = JSON.parse(localStorage.getItem("toolbox_recent") || "[]");
      if (Array.isArray(r)) setRecentHrefs(r);
    } catch {}
  }, [searchParams]);

  useEffect(() => {
    fetch("/api/weather")
      .then((r) => r.json())
      .then((d) => { if (!d.error) setWeather(d); })
      .catch(() => {})
      .finally(() => setWeatherLoading(false));
  }, []);

  useEffect(() => {
    fetch("/api/stocks")
      .then((r) => r.json())
      .then((d) => { setCnStocks(d.cn || []); setUsStocks(d.us || []); })
      .catch(() => {})
      .finally(() => setStocksLoading(false));
  }, []);

  const removeFav = useCallback((href: string) => {
    setFavHrefs((prev) => {
      const next = prev.filter((h) => h !== href);
      localStorage.setItem("toolbox_favorites", JSON.stringify(next));
      return next;
    });
  }, []);

  const removeRecent = useCallback((href: string) => {
    setRecentHrefs((prev) => {
      const next = prev.filter((h) => h !== href);
      localStorage.setItem("toolbox_recent", JSON.stringify(next));
      return next;
    });
  }, []);

  const clearRecent = useCallback(() => {
    setRecentHrefs([]);
    localStorage.setItem("toolbox_recent", "[]");
  }, []);

  const filteredTools = useMemo(() => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return tools.filter(
        (t) => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
      );
    }
    if (activeCategory !== "all") {
      return getToolsByCategory(activeCategory);
    }
    return null;
  }, [search, activeCategory]);

  const isGrouped = !search.trim() && activeCategory === "all";

  const personalTools = useMemo(() => {
    const seen = new Set<string>();
    const result: { tool: Tool; type: "fav" | "recent" }[] = [];
    for (const h of favHrefs) {
      const t = getToolByHref(h);
      if (t && !seen.has(h)) { seen.add(h); result.push({ tool: t, type: "fav" }); }
    }
    for (const h of recentHrefs.slice(0, 8)) {
      const t = getToolByHref(h);
      if (t && !seen.has(h)) { seen.add(h); result.push({ tool: t, type: "recent" }); }
    }
    return result;
  }, [favHrefs, recentHrefs]);

  const today = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear(), m = now.getMonth() + 1, d = now.getDate();
    const lunar = getLunarDate(y, m, d);
    const solarTerm = getSolarTermForDate(y, m, d);
    const { yi, ji } = getYiJi(y, m, d);
    const holiday = getChineseHoliday(y, m, d);
    return { year: y, month: m, day: d, weekday: WEEKDAY_NAMES[now.getDay()], lunar, solarTerm, yi, ji, holiday };
  }, []);

  const hasStocks = cnStocks.length > 0 || usStocks.length > 0;

  return (
    <div>
      {/* Search */}
      <section className="pb-6 pt-2 sm:pt-4">
        <p className="mb-4 text-center text-sm text-[var(--muted)]">
          {tools.length} 个免费工具，打开即用，数据不上传服务器
        </p>
        <div className="mx-auto max-w-xl">
          <div className="search-box flex items-center gap-3 rounded-2xl px-5 py-3.5">
            <svg className="h-5 w-5 shrink-0 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setActiveCategory("all"); }}
              placeholder="搜索工具... JSON、房贷、时间戳、图片压缩"
              className="w-full bg-transparent outline-none placeholder:text-[var(--muted)]"
            />
            {search && (
              <button onClick={() => setSearch("")} className="shrink-0 text-[var(--muted)] hover:text-[var(--foreground)]">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Dashboard */}
      {isGrouped && (
        <section className="mb-8 grid gap-4 sm:grid-cols-2">
          {/* Today + Weather */}
          <div className="card rounded-2xl p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">📆</span>
                <span className="font-semibold">今日</span>
                {(today.holiday || today.solarTerm) && (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                    {today.holiday || today.solarTerm}
                  </span>
                )}
              </div>
              <Link href="/tools/calendar" className="text-xs text-[var(--primary)] hover:underline">
                万年历 →
              </Link>
            </div>
            <div className="flex items-start gap-5">
              <div className="shrink-0 text-center">
                <div className="text-4xl font-bold leading-none">{today.day}</div>
                <div className="mt-1 text-xs text-[var(--muted)]">{today.month}月 · {today.weekday}</div>
              </div>
              <div className="min-w-0 flex-1">
                {today.lunar && (
                  <div className="mb-2 text-sm">
                    <span className="font-medium">{today.lunar.monthName}{today.lunar.dayName}</span>
                    <span className="ml-2 text-[var(--muted)]">{today.lunar.ganZhiYear}年 · {today.lunar.animal}</span>
                  </div>
                )}
                <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs">
                  <div><span className="font-medium text-green-600 dark:text-green-400">宜</span><span className="ml-1.5 text-[var(--muted)]">{today.yi.slice(0, 4).join(" · ")}</span></div>
                  <div><span className="font-medium text-red-500 dark:text-red-400">忌</span><span className="ml-1.5 text-[var(--muted)]">{today.ji.slice(0, 3).join(" · ")}</span></div>
                </div>
              </div>
            </div>
            {/* Weather */}
            <div className="mt-3 flex items-center gap-3 border-t border-[var(--card-border)] pt-3">
              <span className="text-lg">🌤️</span>
              {weatherLoading ? (
                <span className="text-xs text-[var(--muted)]">天气加载中...</span>
              ) : weather ? (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 text-xs">
                  <span className="font-medium">{weather.city} {weather.temp}°C</span>
                  <span className="text-[var(--muted)]">{weather.desc}</span>
                  <span className="text-[var(--muted)]">体感 {weather.feelsLike}°C</span>
                  <span className="text-[var(--muted)]">湿度 {weather.humidity}%</span>
                </div>
              ) : (
                <span className="text-xs text-[var(--muted)]">天气数据暂不可用</span>
              )}
            </div>
          </div>

          {/* Personal: favorites + recent */}
          <div className="card rounded-2xl p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">{personalTools.some((p) => p.type === "fav") ? "❤️" : "🕐"}</span>
                <span className="font-semibold">{personalTools.some((p) => p.type === "fav") ? "收藏与最近" : "最近使用"}</span>
              </div>
              {recentHrefs.length > 0 && (
                <button onClick={clearRecent} className="text-[10px] text-[var(--muted)] hover:text-[var(--primary)]">清空记录</button>
              )}
            </div>
            {personalTools.length > 0 ? (
              <div className="space-y-0.5">
                {personalTools.slice(0, 5).map(({ tool: t, type }) => (
                  <div key={t.href} className="group flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-[var(--background)]">
                    <Link href={t.href} className="flex min-w-0 flex-1 items-center gap-2.5">
                      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gradient-to-br ${t.color} text-[10px] font-bold text-white`}>
                        {t.icon}
                      </div>
                      <span className="truncate text-sm">{t.name}</span>
                    </Link>
                    <button
                      onClick={(e) => { e.stopPropagation(); type === "fav" ? removeFav(t.href) : removeRecent(t.href); }}
                      title={type === "fav" ? "取消收藏" : "移除记录"}
                      className="shrink-0 rounded p-0.5 text-[var(--muted)] opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
                    >
                      {type === "fav" ? (
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" /></svg>
                      ) : (
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-20 items-center justify-center text-xs text-[var(--muted)]">
                使用工具后会在这里显示
              </div>
            )}
          </div>

          {/* Stocks */}
          <div className="card rounded-2xl p-5 sm:col-span-2">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-lg">📈</span>
              <span className="font-semibold">市场行情</span>
              {hasStocks && <span className="text-[10px] text-[var(--muted)]">点击查看详情</span>}
            </div>
            {stocksLoading ? (
              <div className="py-4 text-center text-xs text-[var(--muted)]">行情加载中...</div>
            ) : hasStocks ? (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
                {[...cnStocks, ...usStocks].map((s) => {
                  const url = `https://finance.yahoo.com/quote/${encodeURIComponent(s.code)}/`;
                  return (
                    <a key={s.code} href={url} target="_blank" rel="noopener noreferrer" className="stock-chip flex flex-col rounded-lg p-2.5">
                      <span className="text-xs font-medium">{s.name}</span>
                      <span className="mt-1 text-sm font-bold tabular-nums">{s.price}</span>
                      <span className={`mt-0.5 text-[11px] font-medium tabular-nums ${s.isUp ? "text-red-500" : "text-green-600"}`}>
                        {s.change} ({s.changePercent})
                      </span>
                    </a>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                {[
                  { name: "上证指数", url: "https://finance.sina.com.cn/realstock/company/sh000001/nc.shtml" },
                  { name: "深证成指", url: "https://finance.sina.com.cn/realstock/company/sz399001/nc.shtml" },
                  { name: "创业板指", url: "https://finance.sina.com.cn/realstock/company/sz399006/nc.shtml" },
                  { name: "纳斯达克", url: "https://finance.yahoo.com/quote/%5EIXIC/" },
                  { name: "标普500", url: "https://finance.yahoo.com/quote/%5EGSPC/" },
                  { name: "道琼斯", url: "https://finance.yahoo.com/quote/%5EDJI/" },
                ].map((idx) => (
                  <a key={idx.name} href={idx.url} target="_blank" rel="noopener noreferrer" className="stock-chip flex flex-col items-center rounded-lg p-2.5 text-center">
                    <span className="text-xs font-medium">{idx.name}</span>
                    <span className="mt-1 text-[10px] text-[var(--primary)]">查看 →</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Category chips */}
      <section className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setActiveCategory("all"); setSearch(""); }}
            className={`cat-chip ${activeCategory === "all" && !search ? "active" : ""}`}
          >
            全部
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); setSearch(""); }}
              className={`cat-chip ${activeCategory === cat.id && !search ? "active" : ""}`}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Tools */}
      <section id="tools" className="pb-12">
        {search.trim() && (
          <p className="mb-4 text-sm text-[var(--muted)]">
            搜索「{search}」找到 {filteredTools?.length || 0} 个工具
          </p>
        )}

        {isGrouped ? (
          categories.map((cat) => {
            const catTools = getToolsByCategory(cat.id);
            if (catTools.length === 0) return null;
            return (
              <div key={cat.id} className="mb-8">
                <div className="mb-3 flex items-center gap-2">
                  <span>{cat.icon}</span>
                  <h2 className="text-sm font-semibold">{cat.name}</h2>
                  <span className="text-xs text-[var(--muted)]">{catTools.length}</span>
                </div>
                <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                  {catTools.map((tool) => (
                    <ToolCard key={tool.href} tool={tool} />
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {(filteredTools || []).map((tool) => (
              <ToolCard key={tool.href} tool={tool} />
            ))}
          </div>
        )}

        {filteredTools?.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-3xl">🔍</p>
            <p className="mt-3 text-sm text-[var(--muted)]">没有找到相关工具</p>
            <button onClick={() => { setSearch(""); setActiveCategory("all"); }} className="mt-2 text-sm text-[var(--primary)] hover:underline">
              清除搜索
            </button>
          </div>
        )}
      </section>

      {/* SEO footer */}
      <section className="border-t border-[var(--card-border)] py-8 text-center text-xs text-[var(--muted)]">
        <p>速用工具箱 — {categories.length} 大类 {tools.length} 个免费在线工具，数据本地处理，隐私安全</p>
        <div className="mt-3 flex flex-wrap justify-center gap-x-3 gap-y-1">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/?category=${cat.id}#tools`} className="hover:text-[var(--primary)]">
              {cat.icon} {cat.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function ToolCard({ tool }: { tool: Tool }) {
  const isNew = NEW_TOOLS.includes(tool.href);
  return (
    <Link href={tool.href} className="tool-card group flex items-start gap-3 rounded-xl p-3.5">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${tool.color} text-sm font-bold text-white`}>
        {tool.icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-sm font-semibold group-hover:text-[var(--primary)]">{tool.name}</h3>
          {isNew && <span className="new-badge shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold leading-none">NEW</span>}
        </div>
        <p className="mt-0.5 line-clamp-1 text-xs leading-relaxed text-[var(--muted)]">{tool.description}</p>
      </div>
    </Link>
  );
}
