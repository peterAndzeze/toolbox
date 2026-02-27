"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

const PRESETS = [
  { w: 100, h: 100, label: "100×100" },
  { w: 300, h: 200, label: "300×200" },
  { w: 640, h: 480, label: "640×480" },
  { w: 800, h: 600, label: "800×600" },
  { w: 1920, h: 1080, label: "1920×1080" },
  { w: 200, h: 200, label: "200×200 头像" },
  { w: 728, h: 90, label: "728×90 横幅" },
  { w: 300, h: 250, label: "300×250 广告" },
];

type Format = "PNG" | "SVG";

export default function PlaceholderImagePage() {
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(200);
  const [bgColor, setBgColor] = useState("#CCCCCC");
  const [textColor, setTextColor] = useState("#969696");
  const [customText, setCustomText] = useState("");
  const [fontSizeMode, setFontSizeMode] = useState<"auto" | "manual">("auto");
  const [fontSize, setFontSize] = useState(24);
  const [format, setFormat] = useState<Format>("PNG");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const displayText = customText.trim() || `${width}×${height}`;

  const generatePng = useCallback(() => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = textColor;
    const fs = fontSizeMode === "auto" ? Math.min(width, height) * 0.08 : fontSize;
    ctx.font = `bold ${fs}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(displayText, width / 2, height / 2);

    return canvas.toDataURL("image/png");
  }, [width, height, bgColor, textColor, displayText, fontSizeMode, fontSize]);

  const generateSvg = useCallback(() => {
    const fs = fontSizeMode === "auto" ? Math.min(width, height) * 0.08 : fontSize;
    return `data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <rect width="100%" height="100%" fill="${bgColor}"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="${textColor}" font-size="${fs}" font-weight="bold" font-family="sans-serif">${displayText.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</text>
</svg>`
    )}`;
  }, [width, height, bgColor, textColor, displayText, fontSizeMode, fontSize]);

  useEffect(() => {
    if (format === "PNG") {
      setPreviewUrl(generatePng() || "");
    } else {
      setPreviewUrl(generateSvg());
    }
  }, [format, generatePng, generateSvg]);

  const download = useCallback(() => {
    if (format === "PNG") {
      const dataUrl = generatePng();
      if (!dataUrl) return;
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `placeholder-${width}x${height}.png`;
      a.click();
    } else {
      const dataUrl = generateSvg();
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `placeholder-${width}x${height}.svg`;
      a.click();
    }
  }, [format, generatePng, generateSvg, width, height]);

  const urlRef = `https://placeholder/${width}x${height}`;

  return (
    <ToolPageWrapper>
      <h1 className="page-title">占位图生成器</h1>
      <p className="page-subtitle">自定义尺寸、颜色和文字，生成 PNG/SVG 格式占位符图片</p>

      <div className="card mt-6 rounded-xl p-4">
        <div className="mb-4 flex flex-wrap gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--muted)]">宽度</label>
            <input
              type="number"
              min={1}
              max={4096}
              value={width}
              onChange={(e) => setWidth(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="input w-24 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--muted)]">高度</label>
            <input
              type="number"
              min={1}
              max={4096}
              value={height}
              onChange={(e) => setHeight(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="input w-24 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--muted)]">背景色</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="h-10 w-14 cursor-pointer rounded border border-[var(--card-border)] bg-transparent"
              />
              <input
                type="text"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="input w-24 rounded-lg px-2 py-1 text-sm font-mono"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--muted)]">文字颜色</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="h-10 w-14 cursor-pointer rounded border border-[var(--card-border)] bg-transparent"
              />
              <input
                type="text"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="input w-24 rounded-lg px-2 py-1 text-sm font-mono"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--muted)]">自定义文字</label>
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder={`默认: ${width}×${height}`}
              className="input w-40 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--muted)]">字号</label>
            <div className="flex gap-2">
              <label className="flex cursor-pointer items-center gap-1 text-sm">
                <input type="radio" checked={fontSizeMode === "auto"} onChange={() => setFontSizeMode("auto")} />
                自动
              </label>
              <label className="flex cursor-pointer items-center gap-1 text-sm">
                <input type="radio" checked={fontSizeMode === "manual"} onChange={() => setFontSizeMode("manual")} />
                手动
              </label>
              {fontSizeMode === "manual" && (
                <input
                  type="number"
                  min={8}
                  max={200}
                  value={fontSize}
                  onChange={(e) => setFontSize(Math.max(8, parseInt(e.target.value, 10) || 8))}
                  className="input w-16 rounded px-2 py-1 text-sm"
                />
              )}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--muted)]">格式</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as Format)}
              className="input rounded-lg px-3 py-2 text-sm"
            >
              <option value="PNG">PNG</option>
              <option value="SVG">SVG</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="mb-2 text-sm font-semibold">快捷尺寸</h3>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => {
                  setWidth(p.w);
                  setHeight(p.h);
                }}
                className="rounded border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-1 text-sm hover:border-[var(--primary)]"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row">
          <div className="flex flex-col items-center gap-2">
            <div className="overflow-hidden rounded-lg border border-[var(--card-border)] bg-white">
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="预览"
                  width={Math.min(width, 400)}
                  height={Math.min(height, 400 * (height / width))}
                  className="max-h-[300px] max-w-[400px] object-contain"
                />
              )}
            </div>
            <button onClick={download} className="btn-primary rounded-lg px-4 py-2 text-sm font-medium">
              下载
            </button>
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-[var(--muted)]">URL 参考（仅展示）</label>
            <code className="block rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-3 text-sm">
              {urlRef}
            </code>
            <button
              onClick={() => navigator.clipboard.writeText(urlRef)}
              className="mt-2 rounded border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-1 text-sm hover:border-[var(--primary)]"
            >
              复制 URL
            </button>
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
}
