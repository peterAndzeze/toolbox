"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { categories, getToolsByCategory } from "@/lib/tools-data";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--card-border)] bg-[var(--card-bg)]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
          <span className="text-2xl">🧰</span>
          <span className="text-lg font-bold tracking-tight">速用工具箱</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 text-sm sm:flex">
          <Link href="/#tools" className="text-[var(--muted)] transition-colors hover:text-[var(--foreground)]">
            全部工具
          </Link>

          {/* Category dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1 text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
            >
              工具分类
              <svg className={`h-4 w-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {dropdownOpen && (
              <div className="nav-dropdown absolute right-0 top-full mt-2 w-56 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-2 shadow-xl">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/?category=${cat.id}#tools`}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-[var(--background)]"
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                    <span className="ml-auto text-xs text-[var(--muted)]">{getToolsByCategory(cat.id).length}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/privacy" className="text-[var(--muted)] transition-colors hover:text-[var(--foreground)]">
            隐私政策
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-[var(--background)] sm:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="菜单"
        >
          {mobileOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-[var(--card-border)] bg-[var(--card-bg)] px-4 pb-4 sm:hidden">
          <Link href="/#tools" onClick={() => setMobileOpen(false)}
            className="block py-3 text-sm font-medium text-[var(--foreground)]">
            全部工具
          </Link>
          <div className="border-t border-[var(--card-border)] py-2">
            <p className="py-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">工具分类</p>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/?category=${cat.id}#tools`}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 py-2.5 text-sm"
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                <span className="ml-auto text-xs text-[var(--muted)]">{getToolsByCategory(cat.id).length}</span>
              </Link>
            ))}
          </div>
          <div className="border-t border-[var(--card-border)]">
            <Link href="/privacy" onClick={() => setMobileOpen(false)}
              className="block py-3 text-sm text-[var(--muted)]">
              隐私政策
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
