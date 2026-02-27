"use client";

import { useState, useCallback } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

function hexToRgb(hex: string): [number, number, number] | null {
  const match = hex.replace("#", "").match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!match) return null;
  return [parseInt(match[1], 16), parseInt(match[2], 16), parseInt(match[3], 16)];
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, Math.round(l * 100)];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360; s /= 100; l /= 100;
  if (s === 0) { const v = Math.round(l * 255); return [v, v, v]; }
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [
    Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    Math.round(hue2rgb(p, q, h) * 255),
    Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  ];
}

export default function ColorConverterPage() {
  const [hex, setHex] = useState("#6366f1");
  const [r, setR] = useState(99);
  const [g, setG] = useState(102);
  const [b, setB] = useState(241);
  const [h, setH] = useState(239);
  const [s, setS] = useState(84);
  const [l, setL] = useState(67);
  const [copied, setCopied] = useState("");

  const updateFromHex = useCallback((hexVal: string) => {
    setHex(hexVal);
    const rgb = hexToRgb(hexVal);
    if (!rgb) return;
    setR(rgb[0]); setG(rgb[1]); setB(rgb[2]);
    const hsl = rgbToHsl(rgb[0], rgb[1], rgb[2]);
    setH(hsl[0]); setS(hsl[1]); setL(hsl[2]);
  }, []);

  const updateFromRgb = useCallback((rv: number, gv: number, bv: number) => {
    setR(rv); setG(gv); setB(bv);
    setHex(rgbToHex(rv, gv, bv));
    const hsl = rgbToHsl(rv, gv, bv);
    setH(hsl[0]); setS(hsl[1]); setL(hsl[2]);
  }, []);

  const updateFromHsl = useCallback((hv: number, sv: number, lv: number) => {
    setH(hv); setS(sv); setL(lv);
    const rgb = hslToRgb(hv, sv, lv);
    setR(rgb[0]); setG(rgb[1]); setB(rgb[2]);
    setHex(rgbToHex(rgb[0], rgb[1], rgb[2]));
  }, []);

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 1500);
  };

  const presets = [
    "#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4",
    "#3b82f6", "#6366f1", "#8b5cf6", "#ec4899", "#000000",
  ];

  return (
    <ToolPageWrapper>
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">颜色转换器</h1>
        <p className="mt-2 text-[var(--muted)]">
          HEX、RGB、HSL 颜色格式互转，实时预览，一键复制
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          {/* Color Preview */}
          <div
            className="h-32 w-full rounded-xl border border-[var(--card-border)] shadow-inner"
            style={{ backgroundColor: hex }}
          />

          {/* Presets */}
          <div>
            <label className="mb-2 block text-sm font-medium">预设颜色</label>
            <div className="flex flex-wrap gap-2">
              {presets.map((c) => (
                <button
                  key={c}
                  onClick={() => updateFromHex(c)}
                  className="h-8 w-8 rounded-full border-2 border-[var(--card-border)] transition-transform hover:scale-110"
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
          </div>

          {/* Color Picker */}
          <div>
            <label className="mb-2 block text-sm font-medium">选色器</label>
            <input
              type="color"
              value={hex}
              onChange={(e) => updateFromHex(e.target.value)}
              className="h-12 w-full cursor-pointer rounded-lg border-0"
            />
          </div>
        </div>

        <div className="space-y-5">
          {/* HEX */}
          <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold">HEX</label>
              <button
                onClick={() => copy(hex, "hex")}
                className="text-xs text-[var(--primary)] hover:underline"
              >
                {copied === "hex" ? "已复制 ✓" : "复制"}
              </button>
            </div>
            <input
              type="text"
              value={hex}
              onChange={(e) => updateFromHex(e.target.value)}
              className="textarea-tool w-full rounded px-3 py-2 font-mono text-sm"
            />
          </div>

          {/* RGB */}
          <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold">RGB</label>
              <button
                onClick={() => copy(`rgb(${r}, ${g}, ${b})`, "rgb")}
                className="text-xs text-[var(--primary)] hover:underline"
              >
                {copied === "rgb" ? "已复制 ✓" : "复制"}
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs text-[var(--muted)]">R</label>
                <input
                  type="number"
                  min={0} max={255}
                  value={r}
                  onChange={(e) => updateFromRgb(+e.target.value, g, b)}
                  className="textarea-tool w-full rounded px-2 py-1.5 font-mono text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-[var(--muted)]">G</label>
                <input
                  type="number"
                  min={0} max={255}
                  value={g}
                  onChange={(e) => updateFromRgb(r, +e.target.value, b)}
                  className="textarea-tool w-full rounded px-2 py-1.5 font-mono text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-[var(--muted)]">B</label>
                <input
                  type="number"
                  min={0} max={255}
                  value={b}
                  onChange={(e) => updateFromRgb(r, g, +e.target.value)}
                  className="textarea-tool w-full rounded px-2 py-1.5 font-mono text-sm"
                />
              </div>
            </div>
            <p className="mt-2 text-xs font-mono text-[var(--muted)]">
              rgb({r}, {g}, {b})
            </p>
          </div>

          {/* HSL */}
          <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold">HSL</label>
              <button
                onClick={() => copy(`hsl(${h}, ${s}%, ${l}%)`, "hsl")}
                className="text-xs text-[var(--primary)] hover:underline"
              >
                {copied === "hsl" ? "已复制 ✓" : "复制"}
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs text-[var(--muted)]">H (色相)</label>
                <input
                  type="number"
                  min={0} max={360}
                  value={h}
                  onChange={(e) => updateFromHsl(+e.target.value, s, l)}
                  className="textarea-tool w-full rounded px-2 py-1.5 font-mono text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-[var(--muted)]">S (饱和)</label>
                <input
                  type="number"
                  min={0} max={100}
                  value={s}
                  onChange={(e) => updateFromHsl(h, +e.target.value, l)}
                  className="textarea-tool w-full rounded px-2 py-1.5 font-mono text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-[var(--muted)]">L (亮度)</label>
                <input
                  type="number"
                  min={0} max={100}
                  value={l}
                  onChange={(e) => updateFromHsl(h, s, +e.target.value)}
                  className="textarea-tool w-full rounded px-2 py-1.5 font-mono text-sm"
                />
              </div>
            </div>
            <p className="mt-2 text-xs font-mono text-[var(--muted)]">
              hsl({h}, {s}%, {l}%)
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6">
        <h2 className="text-lg font-semibold mb-3">颜色格式说明</h2>
        <div className="grid gap-4 text-sm text-[var(--muted)] leading-relaxed sm:grid-cols-3">
          <div>
            <strong className="text-[var(--foreground)]">HEX</strong>
            <p>十六进制颜色值，如 #FF5733，是网页开发中最常用的颜色表示方式。</p>
          </div>
          <div>
            <strong className="text-[var(--foreground)]">RGB</strong>
            <p>红绿蓝三原色模型，每个通道 0-255。如 rgb(255, 87, 51)。</p>
          </div>
          <div>
            <strong className="text-[var(--foreground)]">HSL</strong>
            <p>色相-饱和度-亮度模型，更符合人类对颜色的直觉理解。</p>
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
}
