"use client";

import { useEffect, useRef } from "react";

interface AdBannerProps {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  className?: string;
}

const AD_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export function AdBanner({ slot, format = "auto", className = "" }: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!AD_CLIENT || pushed.current) return;
    try {
      ((window as unknown as Record<string, unknown[]>).adsbygoogle =
        (window as unknown as Record<string, unknown[]>).adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense not loaded
    }
  }, []);

  if (!AD_CLIENT) {
    return (
      <div className={`flex items-center justify-center rounded-lg border-2 border-dashed border-[var(--card-border)] bg-[var(--card-bg)] p-8 text-sm text-[var(--muted)] ${className}`}>
        广告位 · 设置 NEXT_PUBLIC_ADSENSE_CLIENT 环境变量后显示真实广告
      </div>
    );
  }

  return (
    <div className={className}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
