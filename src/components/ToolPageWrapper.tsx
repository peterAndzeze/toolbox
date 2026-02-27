"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdBanner } from "./AdBanner";
import { getToolByHref, getCategoryById, getRelatedTools } from "@/lib/tools-data";

export function ToolPageWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const tool = getToolByHref(pathname);
  const category = tool ? getCategoryById(tool.category) : null;
  const related = tool ? getRelatedTools(pathname, 4) : [];

  return (
    <div>
      {/* Breadcrumb */}
      {tool && category && (
        <nav className="breadcrumb mb-6 flex items-center gap-1.5 text-sm">
          <Link href="/" className="text-[var(--muted)] hover:text-[var(--primary)]">首页</Link>
          <span className="text-[var(--muted)]">/</span>
          <Link href="/#tools" className="text-[var(--muted)] hover:text-[var(--primary)]">
            {category.icon} {category.name}
          </Link>
          <span className="text-[var(--muted)]">/</span>
          <span className="font-medium">{tool.name}</span>
        </nav>
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
