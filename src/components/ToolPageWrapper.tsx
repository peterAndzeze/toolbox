"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { AdBanner } from "./AdBanner";
import { ShareBar } from "./ShareBar";
import { getToolByHref, getCategoryById, getRelatedTools } from "@/lib/tools-data";

const FAV_KEY = "toolbox_favorites";
const RECENT_KEY = "toolbox_recent";

export function ToolPageWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const tool = getToolByHref(pathname);
  const category = tool ? getCategoryById(tool.category) : null;
  const related = tool ? getRelatedTools(pathname, 4) : [];

  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    try {
      const favs: string[] = JSON.parse(localStorage.getItem(FAV_KEY) || "[]");
      setIsFav(favs.includes(pathname));

      const recent: string[] = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
      const next = [pathname, ...recent.filter((h) => h !== pathname)].slice(0, 10);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {}
  }, [pathname]);

  const toggleFav = useCallback(() => {
    try {
      const favs: string[] = JSON.parse(localStorage.getItem(FAV_KEY) || "[]");
      const next = favs.includes(pathname) ? favs.filter((h) => h !== pathname) : [...favs, pathname];
      localStorage.setItem(FAV_KEY, JSON.stringify(next));
      setIsFav(!isFav);
    } catch {}
  }, [pathname, isFav]);

  const jsonLd = tool
    ? {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: tool.name,
        description: tool.description,
        url: `https://lifetips.com.cn${tool.href}`,
        applicationCategory: "UtilityApplication",
        operatingSystem: "All",
        offers: { "@type": "Offer", price: "0", priceCurrency: "CNY" },
        provider: {
          "@type": "Organization",
          name: "速用工具箱",
          url: "https://lifetips.com.cn",
        },
      }
    : null;

  return (
    <div>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      {/* Breadcrumb */}
      {tool && category && (
        <nav className="breadcrumb mb-4 flex items-center gap-1.5 text-sm">
          <Link href="/" className="text-[var(--muted)] hover:text-[var(--primary)]">首页</Link>
          <span className="text-[var(--muted)]">/</span>
          <Link href={`/?category=${tool.category}#tools`} className="text-[var(--muted)] hover:text-[var(--primary)]">
            {category.icon} {category.name}
          </Link>
          <span className="text-[var(--muted)]">/</span>
          <span className="font-medium">{tool.name}</span>
        </nav>
      )}

      {/* Action bar */}
      {tool && (
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <button
            onClick={toggleFav}
            title={isFav ? "取消收藏" : "收藏此工具"}
            className="flex h-8 items-center gap-1.5 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-3 text-sm transition-colors hover:border-[var(--primary)]"
          >
            {isFav ? (
              <svg className="h-4 w-4 text-red-500" viewBox="0 0 24 24" fill="currentColor"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" /></svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
            )}
            <span>{isFav ? "已收藏" : "收藏"}</span>
          </button>
          <ShareBar title={tool.name} />
        </div>
      )}

      <AdBanner slot="top-banner" format="horizontal" className="mb-6" />

      {children}

      <AdBanner slot="bottom-banner" format="rectangle" className="mt-8" />

      {/* Related tools */}
      {related.length > 0 && (
        <section className="mt-12 border-t border-[var(--card-border)] pt-8">
          <h2 className="mb-4 text-lg font-semibold">相关工具</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="related-tool-card group flex items-center gap-3 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 transition-all hover:border-[var(--primary)]"
              >
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${r.color} text-sm font-bold text-white`}>
                  {r.icon}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium group-hover:text-[var(--primary)]">{r.name}</p>
                  <p className="truncate text-xs text-[var(--muted)]">{r.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
