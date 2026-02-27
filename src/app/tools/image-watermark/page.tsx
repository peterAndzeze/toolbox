"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

type Position =
  | "center"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "tiled";

export default function ImageWatermarkPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageKey, setImageKey] = useState(0);
  const [text, setText] = useState("水印");
  const [fontSize, setFontSize] = useState(24);
  const [color, setColor] = useState("#ffffff");
  const [opacity, setOpacity] = useState(0.6);
  const [rotation, setRotation] = useState(-15);
  const [position, setPosition] = useState<Position>("bottom-right");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const drawWatermark = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !imageUrl) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);

    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.fillStyle = color;
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const pad = 20;
    const tw = ctx.measureText(text).width;
    const th = fontSize * 1.2;

    const drawAt = (x: number, y: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.fillText(text, 0, 0);
      ctx.restore();
    };

    if (position === "tiled") {
      const spacing = Math.max(tw, th) * 2;
      for (let y = spacing / 2; y < canvas.height + spacing; y += spacing) {
        for (let x = spacing / 2; x < canvas.width + spacing; x += spacing) {
          drawAt(x, y);
        }
      }
    } else {
      let x = 0,
        y = 0;
      switch (position) {
        case "center":
          x = canvas.width / 2;
          y = canvas.height / 2;
          break;
        case "top-left":
          x = pad + tw / 2;
          y = pad + th / 2;
          break;
        case "top-right":
          x = canvas.width - pad - tw / 2;
          y = pad + th / 2;
          break;
        case "bottom-left":
          x = pad + tw / 2;
          y = canvas.height - pad - th / 2;
          break;
        case "bottom-right":
          x = canvas.width - pad - tw / 2;
          y = canvas.height - pad - th / 2;
          break;
      }
      drawAt(x, y);
    }
    ctx.restore();
  }, [imageUrl, text, fontSize, color, opacity, rotation, position]);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setImageUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
    imgRef.current = null;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imgRef.current = img;
      setImageKey((k) => k + 1);
    };
    img.src = url;
  }, []);

  useEffect(() => {
    if (imgRef.current && imageUrl) drawWatermark();
  }, [imageKey, imageUrl, text, fontSize, color, opacity, rotation, position, drawWatermark]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "watermarked.png";
    link.click();
  };

  return (
    <ToolPageWrapper>
      <h1 className="page-title">图片水印工具</h1>
      <p className="page-subtitle">
        添加文字水印，支持自定义样式与位置
      </p>

      <div className="card mt-6 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--muted)]">
              水印文字
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="input w-full rounded-lg px-3 py-2 text-sm"
              placeholder="输入水印内容"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--muted)]">
              字号: {fontSize}px
            </label>
            <input
              type="range"
              min={12}
              max={72}
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full accent-[var(--primary)]"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--muted)]">
              颜色
            </label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-10 w-full cursor-pointer rounded-lg border border-[var(--card-border)]"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--muted)]">
              透明度: {Math.round(opacity * 100)}%
            </label>
            <input
              type="range"
              min={0.1}
              max={1}
              step={0.05}
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-full accent-[var(--primary)]"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--muted)]">
              旋转角度: {rotation}°
            </label>
            <input
              type="range"
              min={-90}
              max={90}
              value={rotation}
              onChange={(e) => setRotation(Number(e.target.value))}
              className="w-full accent-[var(--primary)]"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--muted)]">
              位置
            </label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value as Position)}
              className="input w-full rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-2 text-sm"
            >
              <option value="center">居中</option>
              <option value="top-left">左上</option>
              <option value="top-right">右上</option>
              <option value="bottom-left">左下</option>
              <option value="bottom-right">右下</option>
              <option value="tiled">平铺</option>
            </select>
          </div>
        </div>

        <label
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--card-border)] bg-[var(--card-bg)] p-12 transition-colors hover:border-[var(--primary)]"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
          }}
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <span className="text-4xl">🖼</span>
          <p className="mt-3 text-sm font-medium">
            点击或拖拽图片到这里
          </p>
        </label>

        {imageUrl && (
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-medium">预览</h3>
              <button
                onClick={download}
                className="btn-primary rounded-lg px-4 py-2 text-sm font-medium"
              >
                下载水印图
              </button>
            </div>
            <div className="overflow-auto rounded-lg border border-[var(--card-border)] bg-black/5 p-4">
              <canvas
                ref={canvasRef}
                className="max-w-full"
                style={{ maxHeight: "400px" }}
              />
            </div>
          </div>
        )}
      </div>
    </ToolPageWrapper>
  );
}
