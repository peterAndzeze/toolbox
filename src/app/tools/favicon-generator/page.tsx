"use client";

import { useState, useCallback, useRef } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

const SIZES = [16, 32, 48, 64, 128, 256] as const;

type Mode = "upload" | "text";

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function FaviconGeneratorPage() {
  const [mode, setMode] = useState<Mode>("upload");
  const [text, setText] = useState("A");
  const [bgColor, setBgColor] = useState("#6366f1");
  const [previews, setPreviews] = useState<Record<number, string>>({});
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);
  const [imageKey, setImageKey] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateFromText = useCallback(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const result: Record<number, string> = {};
    for (const size of SIZES) {
      canvas.width = size;
      canvas.height = size;
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = "#ffffff";
      ctx.font = `bold ${Math.floor(size * 0.6)}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text.slice(0, 2), size / 2, size / 2);
      result[size] = canvas.toDataURL("image/png");
    }
    setPreviews(result);
  }, [text, bgColor]);

  const generateFromImage = useCallback(
    (img: HTMLImageElement) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const result: Record<number, string> = {};
      for (const size of SIZES) {
        canvas.width = size;
        canvas.height = size;
        ctx.drawImage(img, 0, 0, size, size);
        result[size] = canvas.toDataURL("image/png");
      }
      setPreviews(result);
    },
    []
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploadUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      const url = URL.createObjectURL(file);
      setUploadUrl(url);
      setImageKey((k) => k + 1);
      const img = new Image();
      img.onload = () => {
        generateFromImage(img);
      };
      img.src = url;
    },
    [generateFromImage]
  );

  const handleTextGenerate = useCallback(() => {
    generateFromText();
  }, [generateFromText]);

  const htmlSnippet = Object.keys(previews).length
    ? SIZES.filter((s) => previews[s])
        .map((s) => `<link rel="icon" type="image/png" sizes="${s}x${s}" href="/favicon-${s}x${s}.png">`)
        .join("\n")
    : "";

  return (
    <ToolPageWrapper>
      <h1 className="page-title">Favicon 生成器</h1>
      <p className="page-subtitle">上传图片或输入文字/Emoji 生成网站图标，支持多种尺寸，提供 HTML 代码</p>

      <div className="card mt-6 rounded-xl p-4">
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setMode("upload")}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${mode === "upload" ? "btn-primary" : "border border-[var(--card-border)] bg-[var(--card-bg)] hover:border-[var(--primary)]"}`}
          >
            上传图片
          </button>
          <button
            onClick={() => setMode("text")}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${mode === "text" ? "btn-primary" : "border border-[var(--card-border)] bg-[var(--card-bg)] hover:border-[var(--primary)]"}`}
          >
            文字/Emoji
          </button>
        </div>

        {mode === "upload" && (
          <div className="mb-6">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-primary rounded-lg px-4 py-2 text-sm font-medium"
            >
              选择图片
            </button>
            {uploadUrl && (
              <div className="mt-4">
                <img src={uploadUrl} alt="预览" className="max-h-32 rounded-lg border border-[var(--card-border)]" key={imageKey} />
              </div>
            )}
          </div>
        )}

        {mode === "text" && (
          <div className="mb-6 flex flex-wrap gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--muted)]">文字/Emoji</label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="1-2 个字符"
                maxLength={2}
                className="input w-24 rounded-lg px-3 py-2 text-lg"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--muted)]">背景颜色</label>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="h-10 w-20 cursor-pointer rounded border border-[var(--card-border)] bg-transparent"
              />
              <span className="ml-2 text-sm text-[var(--muted)]">{bgColor}</span>
            </div>
            <div className="flex items-end">
              <button onClick={handleTextGenerate} className="btn-primary rounded-lg px-4 py-2 text-sm font-medium">
                生成
              </button>
            </div>
          </div>
        )}

        {Object.keys(previews).length > 0 && (
          <>
            <h3 className="mb-3 text-sm font-semibold">预览与下载</h3>
            <div className="mb-6 flex flex-wrap gap-4">
              {SIZES.filter((s) => previews[s]).map((size) => (
                <div key={size} className="flex flex-col items-center gap-2">
                  <img src={previews[size]} alt={`${size}x${size}`} className="rounded border border-[var(--card-border)]" width={size} height={size} />
                  <span className="text-xs text-[var(--muted)]">{size}×{size}</span>
                  <button
                    onClick={() => {
                      fetch(previews[size])
                        .then((r) => r.blob())
                        .then((b) => downloadBlob(b, `favicon-${size}x${size}.png`));
                    }}
                    className="rounded border border-[var(--card-border)] bg-[var(--card-bg)] px-2 py-1 text-xs hover:border-[var(--primary)]"
                  >
                    下载
                  </button>
                </div>
              ))}
            </div>

            <h3 className="mb-2 text-sm font-semibold">HTML 代码</h3>
            <pre className="textarea-tool rounded-lg p-4 font-mono text-sm overflow-auto max-h-32">
              {htmlSnippet || "&lt;link rel=&quot;icon&quot; type=&quot;image/png&quot; sizes=&quot;32x32&quot; href=&quot;/favicon-32x32.png&quot;&gt;"}
            </pre>
            <button
              onClick={() => navigator.clipboard.writeText(htmlSnippet)}
              className="mt-2 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-2 text-sm font-medium hover:border-[var(--primary)]"
            >
              复制 HTML
            </button>
          </>
        )}

        <p className="mt-4 text-xs text-[var(--muted)]">
          现代浏览器均支持 PNG 格式 favicon。将生成的 PNG 文件放到网站根目录，并在 HTML 的 &lt;head&gt; 中引用上述代码即可。
        </p>
      </div>
    </ToolPageWrapper>
  );
}
