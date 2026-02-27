"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { tools, categories, getToolsByCategory, getToolByHref } from "@/lib/tools-data";

const HOT_TOOLS = [
  "/tools/json-formatter",
  "/tools/mortgage-calculator",
  "/tools/tax-calculator",
  "/tools/base64",
  "/tools/timestamp",
  "/tools/image-compressor",
  "/tools/password-generator",
  "/tools/bmi-calculator",
];

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

const QUICK_TAGS = ["JSON", "Base64", "加密", "图片", "计算器", "CSS", "密码", "SQL", "时间戳", "二维码"];

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

  const hotTools = useMemo(() =>
    HOT_TOOLS.map((href) => tools.find((t) => t.href === href)).filter(Boolean) as typeof tools,
    []
  );

  const favTools = useMemo(() =>
    favHrefs.map((h) => getToolByHref(h)).filter(Boolean) as typeof tools,
    [favHrefs]
  );

  const recentTools = useMemo(() =>
    recentHrefs.slice(0, 6).map((h) => getToolByHref(h)).filter(Boolean) as typeof tools,
    [recentHrefs]
  );

  return (
    <div>
      {/* Hero */}
      <section className="hero-section py-10 text-center sm:py-16">
        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
          免费在线工具箱
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-[var(--muted)] sm:text-lg">
          无需下载安装，打开浏览器即可使用。所有工具完全免费，数据不上传服务器，保护你的隐私。
        </p>

        {/* Search */}
        <div className="mx-auto mt-8 max-w-lg">
          <div className="search-box flex items-center gap-3 rounded-xl px-4 py-3">
            <svg className="h-5 w-5 shrink-0 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setActiveCategory("all"); }}
              placeholder="搜索工具，如 JSON、Base64、房贷计算器..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--muted)]"
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

        {/* Quick Tags */}
        <div className="mx-auto mt-4 flex max-w-lg flex-wrap justify-center gap-2">
          {QUICK_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => { setSearch(tag); setActiveCategory("all"); }}
              className="quick-tag rounded-full px-3 py-1 text-xs"
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-1.5 text-sm text-[var(--muted)]">
          <span className="inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          已上线 {tools.length} 个工具，持续更新中
        </div>
      </section>

      {/* Favorites */}
      {isGrouped && favTools.length > 0 && (
        <section className="mb-10">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-xl">❤️</span>
            <h2 className="text-lg font-semibold">我的收藏</h2>
            <span className="text-sm text-[var(--muted)]">({favTools.length})</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {favTools.map((t) => (
              <Link key={t.href} href={t.href} className="hot-tool-card group flex items-center gap-3 rounded-xl p-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${t.color} text-base font-bold text-white`}>
                  {t.icon}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold group-hover:text-[var(--primary)]">{t.name}</h3>
                  <p className="truncate text-xs text-[var(--muted)]">{t.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Recent tools */}
      {isGrouped && recentTools.length > 0 && (
        <section className="mb-10">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-xl">🕐</span>
            <h2 className="text-lg font-semibold">最近使用</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recentTools.map((t) => (
              <Link key={t.href} href={t.href} className="hot-tool-card group flex items-center gap-3 rounded-xl p-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${t.color} text-base font-bold text-white`}>
                  {t.icon}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold group-hover:text-[var(--primary)]">{t.name}</h3>
                  <p className="truncate text-xs text-[var(--muted)]">{t.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Hot Tools */}
      {isGrouped && (
        <section className="mb-10">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-xl">🔥</span>
            <h2 className="text-lg font-semibold">热门推荐</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {hotTools.map((tool) => (
              <Link key={tool.href} href={tool.href} className="hot-tool-card group flex items-center gap-3 rounded-xl p-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${tool.color} text-base font-bold text-white`}>
                  {tool.icon}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold group-hover:text-[var(--primary)]">{tool.name}</h3>
                  <p className="truncate text-xs text-[var(--muted)]">{tool.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Category Tabs */}
      <section className="mb-8">
        <div className="category-tabs flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => { setActiveCategory("all"); setSearch(""); }}
            className={`category-tab ${activeCategory === "all" && !search ? "active" : ""}`}
          >
            全部
            <span className="tab-count">{tools.length}</span>
          </button>
          {categories.map((cat) => {
            const count = getToolsByCategory(cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setSearch(""); }}
                className={`category-tab ${activeCategory === cat.id && !search ? "active" : ""}`}
              >
                <span>{cat.icon}</span>
                {cat.name}
                <span className="tab-count">{count}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Tools */}
      <section id="tools" className="pb-16">
        {search.trim() && (
          <p className="mb-6 text-sm text-[var(--muted)]">
            搜索「{search}」找到 {filteredTools?.length || 0} 个工具
          </p>
        )}

        {isGrouped ? (
          categories.map((cat) => {
            const catTools = getToolsByCategory(cat.id);
            if (catTools.length === 0) return null;
            return (
              <div key={cat.id} className="mb-10">
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-xl">{cat.icon}</span>
                  <h2 className="text-lg font-semibold">{cat.name}</h2>
                  <span className="text-sm text-[var(--muted)]">({catTools.length})</span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {catTools.map((tool) => (
                    <ToolCard key={tool.href} tool={tool} />
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(filteredTools || []).map((tool) => (
              <ToolCard key={tool.href} tool={tool} />
            ))}
          </div>
        )}

        {filteredTools?.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-4xl">🔍</p>
            <p className="mt-4 text-[var(--muted)]">没有找到相关工具</p>
            <button onClick={() => { setSearch(""); setActiveCategory("all"); }} className="mt-2 text-sm text-[var(--primary)] hover:underline">
              清除搜索
            </button>
          </div>
        )}
      </section>

      {/* Features */}
      <section className="border-t border-[var(--card-border)] py-16">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold">为什么选择我们？</h2>
          <p className="mt-2 text-[var(--muted)]">简单、安全、免费的在线工具集合</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="feature-card rounded-xl p-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-2xl dark:bg-green-900/30">💯</div>
            <h3 className="font-semibold">完全免费</h3>
            <p className="mt-1 text-sm text-[var(--muted)]">所有工具永久免费，无需注册登录</p>
          </div>
          <div className="feature-card rounded-xl p-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-2xl dark:bg-blue-900/30">🔒</div>
            <h3 className="font-semibold">隐私安全</h3>
            <p className="mt-1 text-sm text-[var(--muted)]">数据在浏览器本地处理，不上传服务器</p>
          </div>
          <div className="feature-card rounded-xl p-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-2xl dark:bg-purple-900/30">⚡</div>
            <h3 className="font-semibold">即开即用</h3>
            <p className="mt-1 text-sm text-[var(--muted)]">无需下载安装，打开浏览器直接使用</p>
          </div>
          <div className="feature-card rounded-xl p-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-2xl dark:bg-orange-900/30">📱</div>
            <h3 className="font-semibold">全设备适配</h3>
            <p className="mt-1 text-sm text-[var(--muted)]">电脑、平板、手机均可完美使用</p>
          </div>
        </div>
      </section>

      {/* Footer SEO */}
      <section className="border-t border-[var(--card-border)] py-10">
        <div className="text-center text-sm text-[var(--muted)]">
          <p>速用工具箱 — 开发者和日常使用的在线工具集合</p>
          <p className="mt-2">
            涵盖编码解码、格式化、文本处理、转换工具、生成器、图片处理、开发辅助、技术速查、生活实用等 {categories.length} 大类 {tools.length} 个工具
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/?category=${cat.id}#tools`} className="hover:text-[var(--primary)]">
                {cat.icon} {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function ToolCard({ tool }: { tool: (typeof tools)[number] }) {
  const isNew = NEW_TOOLS.includes(tool.href);
  return (
    <Link href={tool.href} className="tool-card group rounded-xl p-5">
      <div className="mb-3 flex items-center gap-3">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${tool.color} text-lg font-bold text-white`}>
          {tool.icon}
        </div>
        {isNew && <span className="new-badge rounded-full px-2 py-0.5 text-[10px] font-semibold">NEW</span>}
      </div>
      <h3 className="text-base font-semibold group-hover:text-[var(--primary)]">{tool.name}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted)]">{tool.description}</p>
      <div className="mt-3 flex items-center text-sm font-medium text-[var(--primary)]">
        立即使用
        <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
      </div>
    </Link>
  );
}
