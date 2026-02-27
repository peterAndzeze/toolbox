"use client";

import { useState, useCallback } from "react";
import imageCompression from "browser-image-compression";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

interface CompressedFile {
  original: File;
  compressed: Blob;
  originalSize: number;
  compressedSize: number;
  url: string;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

export default function ImageCompressorPage() {
  const [files, setFiles] = useState<CompressedFile[]>([]);
  const [quality, setQuality] = useState(0.7);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [processing, setProcessing] = useState(false);

  const handleFiles = useCallback(
    async (inputFiles: FileList) => {
      setProcessing(true);
      const results: CompressedFile[] = [];

      for (const file of Array.from(inputFiles)) {
        if (!file.type.startsWith("image/")) continue;

        try {
          const compressed = await imageCompression(file, {
            maxSizeMB: 10,
            maxWidthOrHeight: maxWidth,
            initialQuality: quality,
            useWebWorker: true,
          });

          results.push({
            original: file,
            compressed,
            originalSize: file.size,
            compressedSize: compressed.size,
            url: URL.createObjectURL(compressed),
          });
        } catch (e) {
          console.error("Compression failed:", e);
        }
      }

      setFiles((prev) => [...prev, ...results]);
      setProcessing(false);
    },
    [quality, maxWidth]
  );

  const downloadAll = () => {
    files.forEach((f) => {
      const link = document.createElement("a");
      link.href = f.url;
      link.download = `compressed_${f.original.name}`;
      link.click();
    });
  };

  const totalSaved = files.reduce(
    (acc, f) => acc + (f.originalSize - f.compressedSize),
    0
  );

  return (
    <ToolPageWrapper>
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">图片压缩</h1>
        <p className="mt-2 text-[var(--muted)]">
          在线压缩图片大小，保持清晰度，支持批量处理，隐私安全
        </p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">
            压缩质量: {Math.round(quality * 100)}%
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
          <div className="mt-1 flex justify-between text-xs text-[var(--muted)]">
            <span>更小文件</span>
            <span>更高质量</span>
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">
            最大宽度: {maxWidth}px
          </label>
          <input
            type="range"
            min={640}
            max={3840}
            step={160}
            value={maxWidth}
            onChange={(e) => setMaxWidth(Number(e.target.value))}
            className="w-full accent-[var(--primary)]"
          />
        </div>
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
        <span className="text-4xl">📁</span>
        <p className="mt-3 text-sm font-medium">
          {processing ? "压缩中..." : "点击或拖拽图片到这里"}
        </p>
        <p className="mt-1 text-xs text-[var(--muted)]">
          支持 JPG / PNG / WebP，可多选
        </p>
      </label>

      {files.length > 0 && (
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium">
              共 {files.length} 张，节省{" "}
              <span className="text-[var(--primary)]">
                {formatSize(totalSaved)}
              </span>
            </p>
            <div className="flex gap-2">
              <button
                onClick={downloadAll}
                className="btn-primary rounded-lg px-4 py-2 text-sm font-medium"
              >
                全部下载
              </button>
              <button
                onClick={() => setFiles([])}
                className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-2 text-sm font-medium"
              >
                清空
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {files.map((f, i) => {
              const ratio = (
                ((f.originalSize - f.compressedSize) / f.originalSize) *
                100
              ).toFixed(1);
              return (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {f.original.name}
                    </p>
                    <p className="text-xs text-[var(--muted)]">
                      {formatSize(f.originalSize)} → {formatSize(f.compressedSize)}{" "}
                      <span className="text-green-500">(-{ratio}%)</span>
                    </p>
                  </div>
                  <a
                    href={f.url}
                    download={`compressed_${f.original.name}`}
                    className="ml-4 text-sm font-medium text-[var(--primary)] hover:underline"
                  >
                    下载
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-12 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6">
        <h2 className="text-lg font-semibold mb-3">关于图片压缩</h2>
        <p className="text-sm text-[var(--muted)] leading-relaxed">
          图片压缩可以大幅减小图片文件大小，加快网页加载速度，节省存储空间。
          本工具使用先进的压缩算法，在保持视觉质量的同时显著缩小文件大小。
          所有压缩操作都在你的浏览器中本地完成，图片不会上传到任何服务器，完全保护你的隐私。
        </p>
      </div>
    </ToolPageWrapper>
  );
}
