"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { tools, categories, getToolsByCategory, getToolByHref, type Tool } from "@/lib/tools-data";
import { getLunarDate, getSolarTermForDate, getYiJi, getChineseHoliday } from "@/lib/lunar";

const NEW_TOOLS = [
  "/tools/currency-converter",
  "/tools/calendar",
  "/tools/electricity-calculator",
  "/tools/fuel-calculator",
  "/tools/mortgage-calculator",
  "/tools/tax-calculator",
  "/tools/bmi-calculator",
  "/tools/date-calculator",
  "/tools/grid-image",
  "/tools/css-gradient",
  "/tools/css-shadow",
  "/tools/code-snapshot",
  "/tools/sql-to-java",
  "/tools/http-tester",
];

const WEEKDAY_NAMES = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

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

      {/* Dashboard: Today + Personal */}
      {isGrouped && (
        <section className="mb-8 grid gap-4 lg:grid-cols-5">
          {/* Today widget */}
          <div className="card rounded-2xl p-5 lg:col-span-3">
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
                完整万年历 →
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
                  <div>
                    <span className="font-medium text-green-600 dark:text-green-400">宜</span>
                    <span className="ml-1.5 text-[var(--muted)]">{today.yi.slice(0, 5).join(" · ")}</span>
                  </div>
                  <div>
                    <span className="font-medium text-red-500 dark:text-red-400">忌</span>
                    <span className="ml-1.5 text-[var(--muted)]">{today.ji.slice(0, 4).join(" · ")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Personal: favorites + recent */}
          <div className="card rounded-2xl p-5 lg:col-span-2">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-lg">{personalTools.some((p) => p.type === "fav") ? "❤️" : "🕐"}</span>
              <span className="font-semibold">{personalTools.some((p) => p.type === "fav") ? "收藏与最近" : "最近使用"}</span>
            </div>
            {personalTools.length > 0 ? (
              <div className="space-y-1">
                {personalTools.slice(0, 5).map(({ tool: t, type }) => (
                  <Link key={t.href} href={t.href} className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-[var(--background)]">
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gradient-to-br ${t.color} text-[10px] font-bold text-white`}>
                      {t.icon}
                    </div>
                    <span className="truncate text-sm">{t.name}</span>
                    {type === "fav" && <span className="ml-auto text-xs text-red-400">♥</span>}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex h-28 items-center justify-center text-sm text-[var(--muted)]">
                使用工具后会在这里显示
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
