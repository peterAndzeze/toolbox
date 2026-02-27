"use client";

import { useState, useCallback } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

type TargetFormat = "png" | "jpeg" | "webp" | "bmp" | "gif";

interface ConvertedFile {
  original: File;
  originalUrl: string;
  convertedBlob: Blob;
  convertedUrl: string;
  originalSize: number;
  convertedSize: number;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function convertImage(
  file: File,
  targetFormat: TargetFormat,
  quality: number
): Promise<ConvertedFile> {
  const originalUrl = URL.createObjectURL(file);
  const img = await loadImage(originalUrl);

  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0);
  URL.revokeObjectURL(originalUrl);

  const mimeMap: Record<TargetFormat, string> = {
    png: "image/png",
    jpeg: "image/jpeg",
    webp: "image/webp",
    bmp: "image/bmp",
    gif: "image/gif",
  };

  const mime = mimeMap[targetFormat];
  const supportsQuality = targetFormat === "jpeg" || targetFormat === "webp";

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("转换失败"))),
      mime,
      supportsQuality ? quality : 1
    );
  });

  return {
    original: file,
    originalUrl: URL.createObjectURL(file),
    convertedBlob: blob,
    convertedUrl: URL.createObjectURL(blob),
    originalSize: file.size,
    convertedSize: blob.size,
  };
}

export default function ImageConverterPage() {
  const [files, setFiles] = useState<ConvertedFile[]>([]);
  const [targetFormat, setTargetFormat] = useState<TargetFormat>("png");
  const [quality, setQuality] = useState(0.85);
  const [processing, setProcessing] = useState(false);

  const handleFiles = useCallback(
    async (inputFiles: FileList) => {
      const imageFiles = Array.from(inputFiles).filter((f) =>
        f.type.startsWith("image/")
      );
      if (imageFiles.length === 0) return;

      setProcessing(true);
      const results: ConvertedFile[] = [];
      for (const file of imageFiles) {
        try {
          const result = await convertImage(file, targetFormat, quality);
          results.push(result);
        } catch (e) {
          console.error("Convert failed:", e);
        }
      }
      setFiles((prev) => [...prev, ...results]);
      setProcessing(false);
    },
    [targetFormat, quality]
  );

  const download = (item: ConvertedFile) => {
    const ext = targetFormat === "jpeg" ? "jpg" : targetFormat;
    const base = item.original.name.replace(/\.[^.]+$/, "");
    const link = document.createElement("a");
    link.href = item.convertedUrl;
    link.download = `${base}_converted.${ext}`;
    link.click();
  };

  const supportsQuality = targetFormat === "jpeg" || targetFormat === "webp";

  return (
    <ToolPageWrapper>
      <h1 className="page-title">图片格式转换</h1>
      <p className="page-subtitle">
        PNG、JPG、WebP、BMP、GIF 格式互转，支持批量处理
      </p>

      <div className="card mt-6 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
        <div className="mb-4 flex flex-wrap gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--muted)]">
              目标格式
            </label>
            <select
              value={targetFormat}
              onChange={(e) =>
                setTargetFormat(e.target.value as TargetFormat)
              }
              className="input rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-2 text-sm"
            >
              <option value="png">PNG</option>
              <option value="jpeg">JPG</option>
              <option value="webp">WebP</option>
              <option value="bmp">BMP</option>
              <option value="gif">GIF</option>
            </select>
          </div>
          {supportsQuality && (
            <div className="flex-1 min-w-[200px]">
              <label className="mb-1 block text-xs font-medium text-[var(--muted)]">
                质量: {Math.round(quality * 100)}%
              </label>
              <input
                type="range"
                min={0.1}
                max={1}
                step={0.05}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-[var(--primary)]"
              />
            </div>
          )}
        </div>

        <label
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--card-border)] bg-[var(--card-bg)] p-12 transition-colors hover:border-[var(--primary)]"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
          }}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
          <span className="text-4xl">🖼</span>
          <p className="mt-3 text-sm font-medium">
            {processing ? "转换中..." : "点击或拖拽图片到这里"}
          </p>
          <p className="mt-1 text-xs text-[var(--muted)]">
            支持 PNG、JPG、WebP、BMP、GIF，可多选
          </p>
        </label>

        {files.length > 0 && (
          <div className="mt-8 space-y-6">
            <h2 className="text-lg font-semibold">转换结果</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {files.map((item, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] overflow-hidden"
                >
                  <div className="grid grid-cols-2 gap-2 p-3">
                    <div>
                      <p className="text-xs text-[var(--muted)]">原图</p>
                      <img
                        src={item.originalUrl}
                        alt=""
                        className="mt-1 h-20 w-full rounded object-cover"
                      />
                      <p className="mt-1 text-xs">
                        {formatSize(item.originalSize)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--muted)]">转换后</p>
                      <img
                        src={item.convertedUrl}
                        alt=""
                        className="mt-1 h-20 w-full rounded object-cover"
                      />
                      <p className="mt-1 text-xs">
                        {formatSize(item.convertedSize)}
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-[var(--card-border)] p-3">
                    <p className="truncate text-sm font-medium">
                      {item.original.name}
                    </p>
                    <button
                      onClick={() => download(item)}
                      className="btn-primary mt-2 w-full rounded-lg py-2 text-sm font-medium"
                    >
                      下载
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                files.forEach((f) => {
                  URL.revokeObjectURL(f.originalUrl);
                  URL.revokeObjectURL(f.convertedUrl);
                });
                setFiles([]);
              }}
              className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-2 text-sm font-medium"
            >
              清空
            </button>
          </div>
        )}
      </div>
    </ToolPageWrapper>
  );
}
