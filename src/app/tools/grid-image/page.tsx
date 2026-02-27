"use client";

import { useState, useCallback } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

type GridPreset = "3x3" | "2x2" | "4x4" | "3x1" | "1x3";

const GRID_CONFIG: Record<GridPreset, { rows: number; cols: number }> = {
  "3x3": { rows: 3, cols: 3 },
  "2x2": { rows: 2, cols: 2 },
  "4x4": { rows: 4, cols: 4 },
  "3x1": { rows: 1, cols: 3 },
  "1x3": { rows: 3, cols: 1 },
};

interface GridPiece {
  blob: Blob;
  url: string;
  index: number;
}

export default function GridImagePage() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [gridPreset, setGridPreset] = useState<GridPreset>("3x3");
  const [pieces, setPieces] = useState<GridPiece[]>([]);
  const [dragging, setDragging] = useState(false);

  const { rows, cols } = GRID_CONFIG[gridPreset];

  const processImage = useCallback(
    (img: HTMLImageElement, preset?: GridPreset) => {
      const p = preset ?? gridPreset;
      const { rows: r, cols: c } = GRID_CONFIG[p];
      const square = r === c;
      const total = r * c;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      let drawWidth = img.width;
      let drawHeight = img.height;
      let sx = 0;
      let sy = 0;
      let sw = img.width;
      let sh = img.height;

      if (square) {
        const size = Math.min(img.width, img.height);
        sx = (img.width - size) / 2;
        sy = (img.height - size) / 2;
        sw = sh = size;
        drawWidth = drawHeight = size;
      }

      canvas.width = drawWidth;
      canvas.height = drawHeight;
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, drawWidth, drawHeight);

      const cellWidth = drawWidth / c;
      const cellHeight = drawHeight / r;
      const newPieces: GridPiece[] = [];

      for (let row = 0; row < r; row++) {
        for (let col = 0; col < c; col++) {
          const index = row * c + col + 1;
          const pieceCanvas = document.createElement("canvas");
          pieceCanvas.width = cellWidth;
          pieceCanvas.height = cellHeight;
          const pCtx = pieceCanvas.getContext("2d");
          if (!pCtx) continue;

          pCtx.drawImage(
            canvas,
            col * cellWidth,
            row * cellHeight,
            cellWidth,
            cellHeight,
            0,
            0,
            cellWidth,
            cellHeight
          );

          pieceCanvas.toBlob(
            (blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                newPieces.push({ blob, url, index });
                if (newPieces.length === total) {
                  const sorted = newPieces.sort((a, b) => a.index - b.index);
                  setPieces((prev) => {
                    prev.forEach((p) => URL.revokeObjectURL(p.url));
                    return sorted;
                  });
                }
              }
            },
            "image/png",
            1
          );
        }
      }
    },
    [gridPreset]
  );

  const loadImage = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        setImage(img);
        setImageUrl(url);
        processImage(img);
      };
      img.src = url;
    },
    [processImage]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) loadImage(file);
    },
    [loadImage]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) loadImage(file);
      e.target.value = "";
    },
    [loadImage]
  );

  const handleGridChange = useCallback(
    (preset: GridPreset) => {
      setGridPreset(preset);
      if (image) {
        processImage(image, preset);
      }
    },
    [image, processImage]
  );

  const downloadPiece = useCallback((piece: GridPiece) => {
    const link = document.createElement("a");
    link.href = piece.url;
    link.download = `grid_${piece.index}.png`;
    link.click();
  }, []);

  const downloadAll = useCallback(() => {
    pieces.forEach((piece, i) => {
      setTimeout(() => downloadPiece(piece), i * 100);
    });
  }, [pieces, downloadPiece]);

  const clearImage = useCallback(() => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    pieces.forEach((p) => URL.revokeObjectURL(p.url));
    setImage(null);
    setImageUrl("");
    setPieces([]);
  }, [imageUrl, pieces]);

  return (
    <ToolPageWrapper>
      <h1 className="page-title">九宫格切图</h1>
      <p className="page-subtitle">
        将图片切成九宫格，适用于微信朋友圈、Instagram 等社交平台发图
      </p>

      <p className="mb-6 rounded-lg bg-[var(--background)] px-4 py-3 text-sm text-[var(--muted)]">
        适用于微信朋友圈、Instagram 等社交平台九宫格发图
      </p>

      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium">网格选项</label>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(GRID_CONFIG) as GridPreset[]).map((preset) => (
            <button
              key={preset}
              onClick={() => handleGridChange(preset)}
              className={`category-tab ${gridPreset === preset ? "active" : ""}`}
            >
              {preset === "3x3" && "九宫格 (3×3)"}
              {preset === "2x2" && "2×2"}
              {preset === "4x4" && "4×4"}
              {preset === "3x1" && "3×1"}
              {preset === "1x3" && "1×3"}
            </button>
          ))}
        </div>
      </div>

      {!image ? (
        <label
          className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-16 transition-colors ${
            dragging
              ? "border-[var(--primary)] bg-[var(--primary)]/5"
              : "border-[var(--card-border)] bg-[var(--card-bg)] hover:border-[var(--primary)]"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <span className="text-5xl">📷</span>
          <p className="mt-4 text-sm font-medium">
            点击或拖拽图片到这里上传
          </p>
          <p className="mt-1 text-xs text-[var(--muted)]">
            支持 JPG、PNG、WebP 等格式
          </p>
        </label>
      ) : (
        <div className="space-y-6">
          <div className="card rounded-xl p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">预览</h2>
              <button
                onClick={clearImage}
                className="text-sm text-[var(--muted)] hover:text-[var(--primary)]"
              >
                更换图片
              </button>
            </div>
            <div
              className="grid gap-3 rounded-lg bg-[var(--background)] p-4"
              style={{
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                gridTemplateRows: `repeat(${rows}, 1fr)`,
                maxWidth: 400,
                maxHeight: 400,
                margin: "0 auto",
              }}
            >
              {pieces.map((piece) => (
                <div
                  key={piece.index}
                  className="relative group cursor-pointer"
                  onClick={() => downloadPiece(piece)}
                >
                  <img
                    src={piece.url}
                    alt={`片段 ${piece.index}`}
                    className="w-full aspect-square object-cover rounded border border-[var(--card-border)]"
                  />
                  <div className="absolute inset-0 flex items-center justify-center rounded border-2 border-[var(--primary)] bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-2xl font-bold text-white">
                      {piece.index}
                    </span>
                  </div>
                  <div className="absolute top-1 left-1 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primary)] text-xs font-bold text-white">
                    {piece.index}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-center text-xs text-[var(--muted)]">
              点击单个片段可下载，或使用下方按钮下载全部
            </p>
          </div>

          <div className="flex justify-center">
            <button
              onClick={downloadAll}
              className="btn-primary rounded-lg px-6 py-3 text-sm font-medium"
            >
              下载全部
            </button>
          </div>
        </div>
      )}
    </ToolPageWrapper>
  );
}
