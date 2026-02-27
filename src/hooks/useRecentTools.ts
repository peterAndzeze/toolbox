"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "toolbox_recent";
const MAX_RECENT = 10;

export function useRecentTools() {
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setRecent(JSON.parse(raw));
    } catch {}
  }, []);

  const record = useCallback((href: string) => {
    setRecent((prev) => {
      const next = [href, ...prev.filter((h) => h !== href)].slice(0, MAX_RECENT);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { recent, record };
}
