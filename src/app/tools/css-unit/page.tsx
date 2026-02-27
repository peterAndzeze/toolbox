"use client";

import { useState, useMemo } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

export default function CssUnitPage() {
  const [value, setValue] = useState("16");
  const [baseFontSize, setBaseFontSize] = useState(16);
  const [viewportWidth, setViewportWidth] = useState(1920);
  const [copied, setCopied] = useState("");

  const num = parseFloat(value) || 0;

  const conversions = useMemo(() => [
    { label: "px", value: num, desc: "像素" },
    { label: "rem", value: num / baseFontSize, desc: `基于根字体 ${baseFontSize}px` },
    { label: "em", value: num / baseFontSize, desc: `基于父元素 ${baseFontSize}px` },
    { label: "vw", value: (num / viewportWidth) * 100, desc: `基于视口宽 ${viewportWidth}px` },
    { label: "vh", value: (num / viewportWidth) * 100, desc: `基于视口高 ${viewportWidth}px` },
    { label: "pt", value: num * 0.75, desc: "印刷点" },
    { label: "cm", value: num / 37.7953, desc: "厘米" },
    { label: "mm", value: num / 3.77953, desc: "毫米" },
    { label: "in", value: num / 96, desc: "英寸" },
  ], [num, baseFontSize, viewportWidth]);

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 1500);
  };

  return (
    <ToolPageWrapper>
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">CSS 单位转换</h1>
        <p className="mt-2 text-[var(--muted)]">
          px、rem、em、vw、pt 等 CSS 单位互相转换
        </p>
      </div>

      <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium">像素值 (px)</label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="textarea-tool w-full rounded-lg px-3 py-2.5 font-mono text-lg"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">根字体大小 (px)</label>
            <input
              type="number"
              value={baseFontSize}
              onChange={(e) => setBaseFontSize(Number(e.target.value) || 16)}
              className="textarea-tool w-full rounded-lg px-3 py-2.5 font-mono text-sm"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">视口宽度 (px)</label>
            <input
              type="number"
              value={viewportWidth}
              onChange={(e) => setViewportWidth(Number(e.target.value) || 1920)}
              className="textarea-tool w-full rounded-lg px-3 py-2.5 font-mono text-sm"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {conversions.map((c) => {
          const display = c.value % 1 === 0 ? c.value.toString() : c.value.toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
          const full = `${display}${c.label}`;
          return (
            <div key={c.label} className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">{c.label}</span>
                <button onClick={() => copy(full, c.label)} className="text-xs text-[var(--primary)] hover:underline">
                  {copied === c.label ? "已复制 ✓" : "复制"}
                </button>
              </div>
              <p className="mt-1 font-mono text-xl font-bold text-[var(--primary)]">{display}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">{c.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-12 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
        <h2 className="mb-3 text-lg font-semibold">CSS 单位说明</h2>
        <div className="grid gap-3 text-sm text-[var(--muted)] sm:grid-cols-2">
          <div><strong className="text-[var(--foreground)]">px</strong> - 像素，最常用的绝对单位</div>
          <div><strong className="text-[var(--foreground)]">rem</strong> - 相对于根元素 (html) 字体大小</div>
          <div><strong className="text-[var(--foreground)]">em</strong> - 相对于父元素字体大小</div>
          <div><strong className="text-[var(--foreground)]">vw/vh</strong> - 视口宽度/高度的百分比</div>
          <div><strong className="text-[var(--foreground)]">pt</strong> - 印刷点，1pt = 1/72 英寸</div>
          <div><strong className="text-[var(--foreground)]">cm/mm</strong> - 厘米/毫米</div>
        </div>
      </div>
    </ToolPageWrapper>
  );
}
