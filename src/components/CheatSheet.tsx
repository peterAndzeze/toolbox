"use client";

import { useState, useMemo } from "react";

export interface CheatItem {
  title: string;
  description: string;
  code: string;
  category: string;
}

interface Props {
  title: string;
  subtitle: string;
  items: CheatItem[];
  categories: string[];
}

export function CheatSheet({ title, subtitle, items, categories }: Props) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("全部");
  const [copiedIdx, setCopiedIdx] = useState(-1);

  const filtered = useMemo(() => {
    let result = items;
    if (activeCategory !== "全部") {
      result = result.filter((i) => i.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.code.toLowerCase().includes(q)
      );
    }
    return result;
  }, [items, search, activeCategory]);

  const grouped = useMemo(() => {
    if (activeCategory !== "全部" || search.trim()) return null;
    const map = new Map<string, CheatItem[]>();
    for (const cat of categories) {
      map.set(cat, items.filter((i) => i.category === cat));
    }
    return map;
  }, [items, categories, activeCategory, search]);

  const copy = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(-1), 1500);
  };

  const renderItem = (item: CheatItem, idx: number) => (
    <div key={`${item.title}-${idx}`} className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold">{item.title}</h3>
          <p className="mt-0.5 text-xs leading-relaxed text-[var(--muted)]">{item.description}</p>
        </div>
        <button
          onClick={() => copy(item.code, idx)}
          className="shrink-0 rounded-md px-2 py-1 text-xs text-[var(--primary)] hover:bg-[var(--background)]"
        >
          {copiedIdx === idx ? "已复制 ✓" : "复制"}
        </button>
      </div>
      <pre className="overflow-x-auto rounded-lg bg-[var(--background)] p-3 font-mono text-xs leading-relaxed text-[var(--foreground)]">
        <code>{item.code}</code>
      </pre>
    </div>
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
        <p className="mt-2 text-[var(--muted)]">{subtitle}</p>
      </div>

      <div className="search-box mb-4 flex items-center gap-3 rounded-xl px-4 py-3">
        <svg className="h-5 w-5 shrink-0 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索命令、关键字..."
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

      <div className="category-tabs mb-6 flex gap-2 overflow-x-auto pb-2">
        {["全部", ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`category-tab ${activeCategory === cat ? "active" : ""}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {search.trim() && (
        <p className="mb-4 text-sm text-[var(--muted)]">找到 {filtered.length} 条结果</p>
      )}

      {grouped ? (
        categories.map((cat) => {
          const catItems = grouped.get(cat) || [];
          if (catItems.length === 0) return null;
          return (
            <div key={cat} className="mb-8">
              <h2 className="mb-3 flex items-center gap-2 text-base font-semibold">
                {cat}
                <span className="text-xs font-normal text-[var(--muted)]">({catItems.length})</span>
              </h2>
              <div className="grid gap-3 lg:grid-cols-2">
                {catItems.map((item, i) => renderItem(item, items.indexOf(item)))}
              </div>
            </div>
          );
        })
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {filtered.map((item, i) => renderItem(item, items.indexOf(item)))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-3xl">🔍</p>
          <p className="mt-3 text-[var(--muted)]">没有找到相关内容</p>
        </div>
      )}
    </div>
  );
}
