"use client";

import { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

export default function QRCodeGeneratorPage() {
  const [text, setText] = useState("https://example.com");
  const [size, setSize] = useState(256);
  const [color, setColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!text || !canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, text, {
      width: size,
      margin: 2,
      color: { dark: color, light: bgColor },
    }).catch(console.error);
  }, [text, size, color, bgColor]);

  const download = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  return (
    <ToolPageWrapper>
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">二维码生成器</h1>
        <p className="mt-2 text-[var(--muted)]">
          输入文字或链接，即时生成二维码，支持自定义颜色和大小
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">内容</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="输入文字或链接..."
              className="textarea-tool h-28 w-full rounded-lg p-3 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                大小: {size}px
              </label>
              <input
                type="range"
                min={128}
                max={512}
                step={32}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full accent-[var(--primary)]"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-2 block text-sm font-medium">前景色</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="h-8 w-8 cursor-pointer rounded border-0"
                  />
                  <span className="text-xs text-[var(--muted)]">{color}</span>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">背景色</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="h-8 w-8 cursor-pointer rounded border-0"
                  />
                  <span className="text-xs text-[var(--muted)]">{bgColor}</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={download}
            className="btn-primary w-full rounded-lg px-4 py-3 text-sm font-medium"
          >
            下载二维码 PNG
          </button>
        </div>

        <div className="flex flex-col items-center justify-center rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-8">
          <canvas ref={canvasRef} />
          <p className="mt-4 text-xs text-[var(--muted)]">
            扫描预览或点击下载
          </p>
        </div>
      </div>

      <div className="mt-12 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6">
        <h2 className="text-lg font-semibold mb-3">关于二维码</h2>
        <p className="text-sm text-[var(--muted)] leading-relaxed">
          二维码 (QR Code) 是一种矩阵式条码，可以存储文本、URL、联系方式等信息。
          使用本工具可以快速生成二维码，支持自定义颜色和大小，生成的二维码可以下载为 PNG 格式。
          所有生成操作都在浏览器本地完成，你的数据不会被上传。
        </p>
      </div>
    </ToolPageWrapper>
  );
}
