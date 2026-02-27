"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { tools, categories, getToolsByCategory } from "@/lib/tools-data";

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

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat && categories.some((c) => c.id === cat)) {
      setActiveCategory(cat);
    }
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

  return (
    <div>
      {/* Hero */}
      <section className="py-10 text-center sm:py-16">
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
              placeholder="搜索工具，如 JSON、Base64、密码..."
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

        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-1.5 text-sm text-[var(--muted)]">
          <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
          已上线 {tools.length} 个工具，持续更新中
        </div>
      </section>

      {/* Category Tabs */}
      <section className="mb-8">
        <div className="category-tabs flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => { setActiveCategory("all"); setSearch(""); }}
            className={`category-tab ${activeCategory === "all" && !search ? "active" : ""}`}
          >
            全部
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); setSearch(""); }}
              className={`category-tab ${activeCategory === cat.id && !search ? "active" : ""}`}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
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

      {/* Stats */}
      <section className="border-t border-[var(--card-border)] py-16">
        <div className="grid gap-8 text-center sm:grid-cols-3">
          <div>
            <div className="text-3xl font-bold text-[var(--primary)]">100%</div>
            <p className="mt-2 text-sm text-[var(--muted)]">完全免费使用</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-[var(--primary)]">0</div>
            <p className="mt-2 text-sm text-[var(--muted)]">数据不上传服务器</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-[var(--primary)]">∞</div>
            <p className="mt-2 text-sm text-[var(--muted)]">不限使用次数</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function ToolCard({ tool }: { tool: (typeof tools)[number] }) {
  return (
    <Link href={tool.href} className="tool-card group rounded-xl p-5">
      <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br ${tool.color} text-lg font-bold text-white`}>
        {tool.icon}
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
