"use client";

import { useState, useCallback } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

type GradientType = "linear" | "radial";

interface ColorStop {
  color: string;
  position: number;
}

const PRESETS: { name: string; type: GradientType; value: string }[] = [
  { name: "日落", type: "linear", value: "linear-gradient(90deg, #ff6b6b 0%, #feca57 50%, #ff9ff3 100%)" },
  { name: "海洋", type: "linear", value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  { name: "薄荷", type: "linear", value: "linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)" },
  { name: "火焰", type: "linear", value: "linear-gradient(45deg, #ff0844 0%, #ffb199 100%)" },
  { name: "极光", type: "linear", value: "linear-gradient(180deg, #00c6fb 0%, #005bea 100%)" },
  { name: "粉紫", type: "linear", value: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
  { name: "金色", type: "linear", value: "linear-gradient(90deg, #f6d365 0%, #fda085 100%)" },
  { name: "深蓝", type: "radial", value: "radial-gradient(circle at center, #4facfe 0%, #00f2fe 50%, #43e97b 100%)" },
  { name: "紫粉", type: "radial", value: "radial-gradient(circle at 30% 30%, #a8edea 0%, #fed6e3 100%)" },
  { name: "霓虹", type: "radial", value: "radial-gradient(ellipse at center, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)" },
];

function parseGradient(css: string): { type: GradientType; angle?: number; shape?: string; radialPos?: { x: number; y: number }; colors: ColorStop[] } | null {
  const linearMatch = css.match(/linear-gradient\(([^)]+)\)/);
  const radialMatch = css.match(/radial-gradient\(([^)]+)\)/);
  if (linearMatch) {
    const parts = linearMatch[1].split(",").map((s) => s.trim());
    let angle = 90;
    let startIdx = 0;
    const first = parts[0];
    if (first.endsWith("deg")) {
      angle = parseFloat(first) || 90;
      startIdx = 1;
    }
    const colors: ColorStop[] = [];
    for (let i = startIdx; i < parts.length; i++) {
      const m = parts[i].match(/(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|rgb\([^)]+\)|rgba\([^)]+\))\s*(\d+)?%?/);
      if (m) {
        const pos = m[2] ? parseInt(m[2], 10) : (i - startIdx) / Math.max(1, parts.length - startIdx - 1) * 100;
        colors.push({ color: m[1].trim(), position: pos });
      }
    }
    return { type: "linear", angle, colors, shape: undefined };
  }
  if (radialMatch) {
    const parts = radialMatch[1].split(",").map((s) => s.trim());
    let shape = "circle";
    let startIdx = 0;
    let radialPos: { x: number; y: number } | undefined;
    const first = parts[0];
    if (first?.startsWith("circle") || first?.startsWith("ellipse")) {
      shape = first.startsWith("ellipse") ? "ellipse" : "circle";
      const atMatch = first.match(/at\s+(\d+)%\s+(\d+)%/);
      if (atMatch) {
        radialPos = { x: parseInt(atMatch[1], 10), y: parseInt(atMatch[2], 10) };
      }
      startIdx = 1;
    }
    const colors: ColorStop[] = [];
    for (let i = startIdx; i < parts.length; i++) {
      const m = parts[i].match(/(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|rgb\([^)]+\)|rgba\([^)]+\))\s*(\d+)?%?/);
      if (m) {
        const pos = m[2] ? parseInt(m[2], 10) : (i - startIdx) / Math.max(1, parts.length - startIdx - 1) * 100;
        colors.push({ color: m[1].trim(), position: pos });
      }
    }
    return { type: "radial", shape, colors, angle: undefined, radialPos };
  }
  return null;
}

export default function CssGradientPage() {
  const [type, setType] = useState<GradientType>("linear");
  const [angle, setAngle] = useState(90);
  const [radialShape, setRadialShape] = useState<"circle" | "ellipse">("circle");
  const [radialPos, setRadialPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [stops, setStops] = useState<ColorStop[]>([
    { color: "#6366f1", position: 0 },
    { color: "#8b5cf6", position: 100 },
  ]);
  const [copied, setCopied] = useState(false);

  const addStop = useCallback(() => {
    if (stops.length >= 5) return;
    const last = stops[stops.length - 1];
    const pos = last ? (last.position + 50) / 2 : 50;
    setStops([...stops, { color: "#a855f7", position: Math.min(100, pos) }]);
  }, [stops]);

  const removeStop = useCallback((idx: number) => {
    if (stops.length <= 2) return;
    setStops(stops.filter((_, i) => i !== idx));
  }, [stops]);

  const updateStop = useCallback((idx: number, field: "color" | "position", value: string | number) => {
    setStops((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s))
    );
  }, []);

  const loadPreset = useCallback((preset: (typeof PRESETS)[0]) => {
    const parsed = parseGradient(preset.value);
    if (parsed) {
      setType(parsed.type);
      if (parsed.angle !== undefined) setAngle(parsed.angle);
      if (parsed.shape) setRadialShape(parsed.shape as "circle" | "ellipse");
      if (parsed.radialPos) setRadialPos(parsed.radialPos);
      setStops(parsed.colors);
    }
  }, []);

  const linearValue = `linear-gradient(${angle}deg, ${stops.map((s) => `${s.color} ${s.position}%`).join(", ")})`;
  const radialValue = `radial-gradient(${radialShape} at ${radialPos.x}% ${radialPos.y}%, ${stops.map((s) => `${s.color} ${s.position}%`).join(", ")})`;
  const cssValue = type === "linear" ? linearValue : radialValue;

  const copyCss = () => {
    navigator.clipboard.writeText(`background: ${cssValue};`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <ToolPageWrapper>
      <h1 className="page-title">CSS 渐变生成器</h1>
      <p className="page-subtitle">可视化编辑线性渐变和径向渐变，实时预览，一键复制 CSS 代码</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="card rounded-xl p-4">
            <div className="mb-4 flex gap-2">
              <button
                onClick={() => setType("linear")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${type === "linear" ? "btn-primary" : "border border-[var(--card-border)] bg-[var(--card-bg)]"}`}
              >
                线性渐变
              </button>
              <button
                onClick={() => setType("radial")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${type === "radial" ? "btn-primary" : "border border-[var(--card-border)] bg-[var(--card-bg)]"}`}
              >
                径向渐变
              </button>
            </div>

            {type === "linear" ? (
              <div>
                <label className="mb-2 block text-sm font-medium">角度 ({angle}°)</label>
                <input
                  type="range"
                  min={0}
                  max={360}
                  value={angle}
                  onChange={(e) => setAngle(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="mb-2 block text-sm font-medium">形状</label>
                  <select
                    value={radialShape}
                    onChange={(e) => setRadialShape(e.target.value as "circle" | "ellipse")}
                    className="input w-full rounded-lg px-3 py-2.5"
                  >
                    <option value="circle">圆形 (circle)</option>
                    <option value="ellipse">椭圆 (ellipse)</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">中心位置 X ({radialPos.x}%)</label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={radialPos.x}
                    onChange={(e) => setRadialPos((p) => ({ ...p, x: Number(e.target.value) }))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">中心位置 Y ({radialPos.y}%)</label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={radialPos.y}
                    onChange={(e) => setRadialPos((p) => ({ ...p, y: Number(e.target.value) }))}
                    className="w-full"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="card rounded-xl p-4">
            <div className="mb-3 flex items-center justify-between">
              <label className="text-sm font-medium">颜色节点</label>
              {stops.length < 5 && (
                <button onClick={addStop} className="text-sm text-[var(--primary)] hover:underline">
                  + 添加
                </button>
              )}
            </div>
            <div className="space-y-3">
              {stops.map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <input
                    type="color"
                    value={s.color}
                    onChange={(e) => updateStop(i, "color", e.target.value)}
                    className="h-10 w-20 cursor-pointer rounded border-0"
                  />
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={s.position}
                    onChange={(e) => updateStop(i, "position", Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="w-10 text-right text-sm font-mono">{s.position}%</span>
                  {stops.length > 2 && (
                    <button
                      onClick={() => removeStop(i)}
                      className="text-red-500 hover:underline"
                      aria-label="删除"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="card rounded-xl p-4">
            <label className="mb-2 block text-sm font-medium">预设渐变</label>
            <div className="grid grid-cols-5 gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => loadPreset(p)}
                  className="group flex flex-col items-center gap-1.5 text-center transition hover:opacity-90"
                  title={`点击加载：${p.name}`}
                >
                  <div
                    className="h-12 w-full rounded-lg border border-[var(--card-border)] transition group-hover:ring-2 group-hover:ring-[var(--primary)]"
                    style={{ background: p.value }}
                  />
                  <span className="text-xs text-[var(--muted)]">{p.name}</span>
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-[var(--muted)]">点击预设可加载</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card rounded-xl p-4">
            <label className="mb-3 block text-sm font-medium">实时预览</label>
            <div
              className="min-h-[200px] w-full rounded-xl"
              style={{ background: cssValue }}
            />
          </div>

          <div className="card rounded-xl p-4">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium">生成 CSS</label>
              <button
                onClick={copyCss}
                className="btn-primary rounded-lg px-4 py-2 text-sm"
              >
                {copied ? "已复制 ✓" : "复制代码"}
              </button>
            </div>
            <pre className="textarea-tool max-h-32 overflow-auto rounded-lg p-4 font-mono text-sm">
              {`background: ${cssValue};`}
            </pre>
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
}
