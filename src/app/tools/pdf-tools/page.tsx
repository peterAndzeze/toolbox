"use client";

import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

type ToolMode = "merge" | "split" | "extract";

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

export default function PdfToolsPage() {
  const [mode, setMode] = useState<ToolMode>("merge");
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [splitRange, setSplitRange] = useState("1-3");
  const [result, setResult] = useState<{ url: string; name: string; size: number } | null>(null);
  const [pageCount, setPageCount] = useState(0);

  const handleFiles = useCallback(async (fileList: FileList) => {
    const newFiles = Array.from(fileList).filter((f) => f.type === "application/pdf");
    setFiles((prev) => (mode === "merge" ? [...prev, ...newFiles] : newFiles.slice(0, 1)));
    setResult(null);

    if (mode !== "merge" && newFiles.length > 0) {
      try {
        const bytes = await newFiles[0].arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        setPageCount(pdf.getPageCount());
      } catch { setPageCount(0); }
    }
  }, [mode]);

  const mergePdfs = async () => {
    if (files.length < 2) return;
    setProcessing(true);
    try {
      const merged = await PDFDocument.create();
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const pages = await merged.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((page) => merged.addPage(page));
      }
      const pdfBytes = await merged.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      setResult({ url: URL.createObjectURL(blob), name: "merged.pdf", size: pdfBytes.length });
    } catch (e) { console.error(e); }
    setProcessing(false);
  };

  const splitPdf = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    try {
      const bytes = await files[0].arrayBuffer();
      const srcPdf = await PDFDocument.load(bytes);
      const newPdf = await PDFDocument.create();

      const ranges = splitRange.split(",").flatMap((r) => {
        const trimmed = r.trim();
        if (trimmed.includes("-")) {
          const [start, end] = trimmed.split("-").map(Number);
          return Array.from({ length: end - start + 1 }, (_, i) => start + i - 1);
        }
        return [parseInt(trimmed) - 1];
      }).filter((i) => i >= 0 && i < srcPdf.getPageCount());

      const pages = await newPdf.copyPages(srcPdf, ranges);
      pages.forEach((page) => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      setResult({ url: URL.createObjectURL(blob), name: `pages_${splitRange.replace(/,/g, "_")}.pdf`, size: pdfBytes.length });
    } catch (e) { console.error(e); }
    setProcessing(false);
  };

  const extractText = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    try {
      const bytes = await files[0].arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const info = [
        `文件名: ${files[0].name}`,
        `页数: ${pdf.getPageCount()}`,
        `文件大小: ${formatSize(files[0].size)}`,
        `标题: ${pdf.getTitle() || "无"}`,
        `作者: ${pdf.getAuthor() || "无"}`,
        `创建者: ${pdf.getCreator() || "无"}`,
        `创建日期: ${pdf.getCreationDate()?.toLocaleString() || "无"}`,
        `修改日期: ${pdf.getModificationDate()?.toLocaleString() || "无"}`,
        "",
        "各页尺寸:",
        ...pdf.getPages().map((page, i) => {
          const { width, height } = page.getSize();
          return `  第 ${i + 1} 页: ${Math.round(width)} x ${Math.round(height)} pt (${(width / 72).toFixed(1)} x ${(height / 72).toFixed(1)} inch)`;
        }),
      ].join("\n");
      const blob = new Blob([info], { type: "text/plain" });
      setResult({ url: URL.createObjectURL(blob), name: "pdf_info.txt", size: blob.size });
    } catch (e) { console.error(e); }
    setProcessing(false);
  };

  const modes = [
    { id: "merge" as const, label: "合并 PDF", desc: "将多个 PDF 合并为一个" },
    { id: "split" as const, label: "拆分 PDF", desc: "提取指定页面" },
    { id: "extract" as const, label: "PDF 信息", desc: "查看 PDF 元数据" },
  ];

  return (
    <ToolPageWrapper>
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">PDF 工具箱</h1>
        <p className="mt-2 text-[var(--muted)]">
          PDF 合并、拆分、信息提取，浏览器本地处理，文件不上传
        </p>
      </div>

      <div className="mb-6 flex gap-2">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => { setMode(m.id); setFiles([]); setResult(null); setPageCount(0); }}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${mode === m.id ? "btn-primary" : "border border-[var(--card-border)] bg-[var(--card-bg)]"}`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <p className="mb-4 text-sm text-[var(--muted)]">{modes.find((m) => m.id === mode)?.desc}</p>

      <label
        className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--card-border)] bg-[var(--card-bg)] p-10 transition-colors hover:border-[var(--primary)]"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files); }}
      >
        <input
          type="file"
          accept=".pdf"
          multiple={mode === "merge"}
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        <span className="text-3xl">📄</span>
        <p className="mt-2 text-sm font-medium">
          {processing ? "处理中..." : `点击或拖拽 PDF 文件到这里${mode === "merge" ? "（可多选）" : ""}`}
        </p>
      </label>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-2">
              <span className="truncate text-sm">{f.name} <span className="text-[var(--muted)]">({formatSize(f.size)})</span></span>
              <button onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))} className="ml-2 text-xs text-red-500 hover:underline">移除</button>
            </div>
          ))}
          {pageCount > 0 && mode !== "merge" && (
            <p className="text-sm text-[var(--muted)]">共 {pageCount} 页</p>
          )}
        </div>
      )}

      {mode === "split" && files.length > 0 && (
        <div className="mt-4">
          <label className="mb-2 block text-sm font-medium">页码范围（如 1-3,5,7-9）</label>
          <input
            type="text"
            value={splitRange}
            onChange={(e) => setSplitRange(e.target.value)}
            className="textarea-tool w-full rounded-lg px-3 py-2.5 font-mono text-sm"
            placeholder="1-3,5,7"
          />
        </div>
      )}

      {files.length > 0 && (
        <button
          onClick={mode === "merge" ? mergePdfs : mode === "split" ? splitPdf : extractText}
          disabled={processing || (mode === "merge" && files.length < 2)}
          className="btn-primary mt-4 w-full rounded-lg py-3 text-sm font-medium disabled:opacity-50"
        >
          {processing ? "处理中..." : mode === "merge" ? "合并 PDF" : mode === "split" ? "拆分 PDF" : "提取信息"}
        </button>
      )}

      {result && (
        <div className="mt-4 rounded-lg border border-green-500/30 bg-green-50 p-4 dark:bg-green-900/10">
          <p className="text-sm font-medium text-green-700 dark:text-green-400">处理完成！({formatSize(result.size)})</p>
          <a
            href={result.url}
            download={result.name}
            className="mt-2 inline-block rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            下载 {result.name}
          </a>
        </div>
      )}

      <div className="mt-12 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
        <h2 className="mb-3 text-lg font-semibold">关于 PDF 工具</h2>
        <p className="text-sm leading-relaxed text-[var(--muted)]">
          本工具支持 PDF 文件的合并、拆分和信息提取。所有操作都在浏览器本地完成，
          你的 PDF 文件不会上传到任何服务器，完全保护你的隐私和数据安全。
        </p>
      </div>
    </ToolPageWrapper>
  );
}
