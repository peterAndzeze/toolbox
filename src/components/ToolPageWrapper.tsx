"use client";

import { AdBanner } from "./AdBanner";

export function ToolPageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <AdBanner slot="top-banner" format="horizontal" className="mb-6" />
      {children}
      <AdBanner slot="bottom-banner" format="rectangle" className="mt-8" />
    </div>
  );
}
