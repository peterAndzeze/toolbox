"use client";

import { useState, useCallback } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

interface ShadowLayer {
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  color: string;
  inset: boolean;
}

const PRESETS: { name: string; layers: ShadowLayer[] }[] = [
  { name: "轻微", layers: [{ offsetX: 0, offsetY: 1, blur: 3, spread: 0, color: "rgba(0,0,0,0.12)", inset: false }] },
  { name: "柔和", layers: [{ offsetX: 0, offsetY: 4, blur: 12, spread: 0, color: "rgba(0,0,0,0.15)", inset: false }] },
  { name: "中等", layers: [{ offsetX: 0, offsetY: 10, blur: 25, spread: -5, color: "rgba(0,0,0,0.2)", inset: false }] },
  { name: "强烈", layers: [{ offsetX: 0, offsetY: 20, blur: 40, spread: -10, color: "rgba(0,0,0,0.25)", inset: false }] },
  { name: "内阴影", layers: [{ offsetX: 0, offsetY: 2, blur: 4, spread: 0, color: "rgba(0,0,0,0.2)", inset: true }] },
  { name: "多层", layers: [
    { offsetX: 0, offsetY: 2, blur: 4, spread: 0, color: "rgba(0,0,0,0.1)", inset: false },
    { offsetX: 0, offsetY: 8, blur: 16, spread: 0, color: "rgba(0,0,0,0.1)", inset: false },
  ]},
  { name: "彩色", layers: [{ offsetX: 0, offsetY: 10, blur: 30, spread: 0, color: "rgba(99,102,241,0.4)", inset: false }] },
  { name: "悬浮", layers: [{ offsetX: 0, offsetY: 12, blur: 24, spread: 4, color: "rgba(0,0,0,0.15)", inset: false }] },
];

function shadowToCss(layers: ShadowLayer[]): string {
  return layers
    .map((l) => {
      const parts = [l.inset ? "inset" : "", `${l.offsetX}px`, `${l.offsetY}px`, `${l.blur}px`, `${l.spread}px`, l.color];
      return parts.filter(Boolean).join(" ");
    })
    .join(", ");
}

export default function CssShadowPage() {
  const [layers, setLayers] = useState<ShadowLayer[]>([
    { offsetX: 0, offsetY: 10, blur: 20, spread: 0, color: "rgba(0,0,0,0.2)", inset: false },
  ]);
  const [activeLayer, setActiveLayer] = useState(0);
  const [copied, setCopied] = useState(false);

  const updateLayer = useCallback((idx: number, field: keyof ShadowLayer, value: number | string | boolean) => {
    setLayers((prev) =>
      prev.map((l, i) => (i === idx ? { ...l, [field]: value } : l))
    );
  }, []);

  const addLayer = useCallback(() => {
    setLayers((prev) => [
      ...prev,
      { offsetX: 0, offsetY: 4, blur: 8, spread: 0, color: "rgba(0,0,0,0.15)", inset: false },
    ]);
    setActiveLayer(layers.length);
  }, [layers.length]);

  const removeLayer = useCallback((idx: number) => {
    if (layers.length <= 1) return;
    setLayers((prev) => prev.filter((_, i) => i !== idx));
    setActiveLayer((a) => (a >= idx && a > 0 ? a - 1 : a));
  }, [layers.length]);

  const loadPreset = useCallback((preset: (typeof PRESETS)[0]) => {
    setLayers(preset.layers.map((l) => ({ ...l })));
    setActiveLayer(0);
  }, []);

  const cssValue = `box-shadow: ${shadowToCss(layers)};`;

  const copyCss = () => {
    navigator.clipboard.writeText(cssValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const current = layers[activeLayer] ?? layers[0];

  return (
    <ToolPageWrapper>
      <h1 className="page-title">CSS Box Shadow 生成器</h1>
      <p className="page-subtitle">可视化调节阴影参数，支持多层阴影和内阴影，一键复制代码</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="card rounded-xl p-4">
            <div className="mb-4 flex items-center justify-between">
              <label className="text-sm font-medium">阴影层</label>
              <button onClick={addLayer} className="text-sm text-[var(--primary)] hover:underline">
                + 添加图层
              </button>
            </div>
            <div className="mb-4 flex flex-wrap gap-2">
              {layers.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveLayer(i)}
                  className={`rounded-lg px-3 py-1.5 text-sm ${activeLayer === i ? "btn-primary" : "border border-[var(--card-border)] bg-[var(--card-bg)]"}`}
                >
                  层 {i + 1}
                </button>
              ))}
            </div>

            {current && (
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm">水平偏移 ({current.offsetX}px)</label>
                  <input
                    type="range"
                    min={-50}
                    max={50}
                    value={current.offsetX}
                    onChange={(e) => updateLayer(activeLayer, "offsetX", Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm">垂直偏移 ({current.offsetY}px)</label>
                  <input
                    type="range"
                    min={-50}
                    max={50}
                    value={current.offsetY}
                    onChange={(e) => updateLayer(activeLayer, "offsetY", Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm">模糊 ({current.blur}px)</label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={current.blur}
                    onChange={(e) => updateLayer(activeLayer, "blur", Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm">扩散 ({current.spread}px)</label>
                  <input
                    type="range"
                    min={0}
                    max={50}
                    value={current.spread}
                    onChange={(e) => updateLayer(activeLayer, "spread", Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm">颜色</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={current.color.startsWith("rgba") ? "#000000" : current.color}
                      onChange={(e) => {
                        const hex = e.target.value;
                        const r = parseInt(hex.slice(1, 3), 16);
                        const g = parseInt(hex.slice(3, 5), 16);
                        const b = parseInt(hex.slice(5, 7), 16);
                        const aMatch = current.color.match(/[\d.]+\)$/);
                        const a = aMatch ? parseFloat(aMatch[0]) : 0.2;
                        updateLayer(activeLayer, "color", `rgba(${r},${g},${b},${a})`);
                      }}
                      className="h-10 w-14 cursor-pointer rounded border-0"
                    />
                    <input
                      type="text"
                      value={current.color}
                      onChange={(e) => updateLayer(activeLayer, "color", e.target.value)}
                      className="input flex-1 rounded-lg px-3 py-2 font-mono text-sm"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="inset"
                    checked={current.inset}
                    onChange={(e) => updateLayer(activeLayer, "inset", e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="inset" className="text-sm">内阴影 (inset)</label>
                </div>
                {layers.length > 1 && (
                  <button
                    onClick={() => removeLayer(activeLayer)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    删除此图层
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="card rounded-xl p-4">
            <label className="mb-2 block text-sm font-medium">预设样式</label>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => loadPreset(p)}
                  className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-2 text-sm transition hover:border-[var(--primary)]"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card rounded-xl p-4">
            <label className="mb-3 block text-sm font-medium">实时预览</label>
            <div className="flex min-h-[200px] items-center justify-center bg-[var(--background)]/50">
              <div
                className="h-32 w-64 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)]"
                style={{ boxShadow: shadowToCss(layers) }}
              />
            </div>
          </div>

          <div className="card rounded-xl p-4">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium">生成 CSS</label>
              <button onClick={copyCss} className="btn-primary rounded-lg px-4 py-2 text-sm">
                {copied ? "已复制 ✓" : "复制代码"}
              </button>
            </div>
            <pre className="textarea-tool max-h-32 overflow-auto rounded-lg p-4 font-mono text-sm">
              {cssValue}
            </pre>
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
}
