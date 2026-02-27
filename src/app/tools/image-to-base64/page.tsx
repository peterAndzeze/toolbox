"use client";

import { useState, useCallback } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

export default function ImageToBase64Page() {
  const [result, setResult] = useState("");
  const [preview, setPreview] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [copied, setCopied] = useState("");
  const [b64Input, setB64Input] = useState("");
  const [b64Preview, setB64Preview] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    setFileName(file.name);
    setFileSize(file.size);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPreview(dataUrl);
      setResult(dataUrl);
    };
    reader.readAsDataURL(file);
  }, []);

  const decodeBase64 = () => {
    try {
      const src = b64Input.trim().startsWith("data:") ? b64Input.trim() : `data:image/png;base64,${b64Input.trim()}`;
      setB64Preview(src);
    } catch { setB64Preview(""); }
  };

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <ToolPageWrapper>
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">图片 Base64 转换</h1>
        <p className="mt-2 text-[var(--muted)]">图片转 Base64 编码，或 Base64 还原为图片</p>
      </div>

      <div className="mb-4 flex gap-2">
        <button onClick={() => setMode("encode")} className={`rounded-lg px-4 py-2 text-sm font-medium ${mode === "encode" ? "btn-primary" : "border border-[var(--card-border)] bg-[var(--card-bg)]"}`}>图片 → Base64</button>
        <button onClick={() => setMode("decode")} className={`rounded-lg px-4 py-2 text-sm font-medium ${mode === "decode" ? "btn-primary" : "border border-[var(--card-border)] bg-[var(--card-bg)]"}`}>Base64 → 图片</button>
      </div>

      {mode === "encode" ? (
        <>
          <label
            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--card-border)] bg-[var(--card-bg)] p-10 hover:border-[var(--primary)]"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
          >
            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
            <span className="text-3xl">🖼</span>
            <p className="mt-2 text-sm font-medium">点击或拖拽图片到这里</p>
          </label>

          {result && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-4">
                {preview && <img src={preview} alt="preview" className="h-20 w-20 rounded-lg border border-[var(--card-border)] object-cover" />}
                <div>
                  <p className="text-sm font-medium">{fileName}</p>
                  <p className="text-xs text-[var(--muted)]">原始: {formatSize(fileSize)} → Base64: {formatSize(result.length)}</p>
                </div>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium">Data URL（含 MIME）</label>
                  <button onClick={() => copy(result, "dataurl")} className="text-xs text-[var(--primary)] hover:underline">{copied === "dataurl" ? "已复制 ✓" : "复制"}</button>
                </div>
                <textarea value={result} readOnly className="textarea-tool h-32 w-full rounded-lg p-3 font-mono text-xs" />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium">纯 Base64</label>
                  <button onClick={() => copy(result.split(",")[1] || "", "pure")} className="text-xs text-[var(--primary)] hover:underline">{copied === "pure" ? "已复制 ✓" : "复制"}</button>
                </div>
                <textarea value={result.split(",")[1] || ""} readOnly className="textarea-tool h-32 w-full rounded-lg p-3 font-mono text-xs" />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium">HTML img 标签</label>
                  <button onClick={() => copy(`<img src="${result}" alt="" />`, "html")} className="text-xs text-[var(--primary)] hover:underline">{copied === "html" ? "已复制 ✓" : "复制"}</button>
                </div>
                <textarea value={`<img src="${result}" alt="" />`} readOnly className="textarea-tool h-20 w-full rounded-lg p-3 font-mono text-xs" />
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <textarea value={b64Input} onChange={(e) => setB64Input(e.target.value)} placeholder="粘贴 Base64 字符串..." className="textarea-tool h-40 w-full rounded-lg p-4 font-mono text-xs" spellCheck={false} />
          <button onClick={decodeBase64} className="btn-primary mt-3 w-full rounded-lg py-3 text-sm font-medium">还原图片</button>
          {b64Preview && (
            <div className="mt-4 flex flex-col items-center rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
              <img src={b64Preview} alt="decoded" className="max-h-80 max-w-full rounded-lg" />
              <a href={b64Preview} download="decoded_image.png" className="mt-3 text-sm text-[var(--primary)] hover:underline">下载图片</a>
            </div>
          )}
        </>
      )}

      <div className="mt-12 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
        <h2 className="mb-3 text-lg font-semibold">图片 Base64 编码说明</h2>
        <p className="text-sm leading-relaxed text-[var(--muted)]">
          将图片转为 Base64 编码后，可以直接嵌入 HTML、CSS 或 JSON 中，减少 HTTP 请求。适合小图标和小图片。
          注意 Base64 编码后体积会增大约 33%，大图片建议使用 URL 引用。
        </p>
      </div>
    </ToolPageWrapper>
  );
}
