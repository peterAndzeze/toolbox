"use client";

import { useState, useCallback } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

function jsonToCsv(jsonStr: string): string {
  const data = JSON.parse(jsonStr);
  const arr = Array.isArray(data) ? data : [data];
  if (arr.length === 0) return "";
  const headers = [...new Set(arr.flatMap((obj) => Object.keys(obj)))];
  const escape = (v: unknown) => {
    const s = v === null || v === undefined ? "" : String(v);
    return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [headers.join(","), ...arr.map((obj) => headers.map((h) => escape(obj[h])).join(","))].join("\n");
}

function csvToJson(csv: string): string {
  const lines = csv.trim().split("\n");
  if (lines.length < 2) return "[]";
  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
  const result = lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => { obj[h] = values[i] || ""; });
    return obj;
  });
  return JSON.stringify(result, null, 2);
}

export default function JsonCsvPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"json2csv" | "csv2json">("json2csv");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const convert = useCallback(() => {
    setError("");
    try {
      setOutput(mode === "json2csv" ? jsonToCsv(input) : csvToJson(input));
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  }, [input, mode]);

  const loadSample = () => {
    if (mode === "json2csv") {
      setInput(JSON.stringify([
        { name: "张三", age: 28, city: "北京", email: "zhang@example.com" },
        { name: "李四", age: 32, city: "上海", email: "li@example.com" },
        { name: "王五", age: 25, city: "广州", email: "wang@example.com" },
      ], null, 2));
    } else {
      setInput("name,age,city,email\n张三,28,北京,zhang@example.com\n李四,32,上海,li@example.com\n王五,25,广州,wang@example.com");
    }
  };

  return (
    <ToolPageWrapper>
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">JSON ↔ CSV 转换</h1>
        <p className="mt-2 text-[var(--muted)]">JSON 数组与 CSV 格式互相转换，支持中文</p>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        <button onClick={() => { setMode("json2csv"); setOutput(""); setError(""); }} className={`rounded-lg px-4 py-2 text-sm font-medium ${mode === "json2csv" ? "btn-primary" : "border border-[var(--card-border)] bg-[var(--card-bg)]"}`}>JSON → CSV</button>
        <button onClick={() => { setMode("csv2json"); setOutput(""); setError(""); }} className={`rounded-lg px-4 py-2 text-sm font-medium ${mode === "csv2json" ? "btn-primary" : "border border-[var(--card-border)] bg-[var(--card-bg)]"}`}>CSV → JSON</button>
        <button onClick={loadSample} className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-2 text-sm font-medium hover:border-[var(--primary)]">加载示例</button>
      </div>
      {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">{error}</div>}
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--muted)]">{mode === "json2csv" ? "输入 JSON" : "输入 CSV"}</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={mode === "json2csv" ? "粘贴 JSON 数组..." : "粘贴 CSV 数据..."} className="textarea-tool h-72 w-full rounded-lg p-4 font-mono text-sm" spellCheck={false} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--muted)]">{mode === "json2csv" ? "CSV 结果" : "JSON 结果"}</label>
          <textarea value={output} readOnly placeholder="结果..." className="textarea-tool h-72 w-full rounded-lg p-4 font-mono text-sm" />
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button onClick={convert} className="btn-primary rounded-lg px-6 py-2 text-sm font-medium">转换</button>
        {output && <button onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-2 text-sm font-medium hover:border-[var(--primary)]">{copied ? "已复制 ✓" : "复制结果"}</button>}
      </div>
      <div className="mt-12 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
        <h2 className="mb-3 text-lg font-semibold">JSON 与 CSV</h2>
        <p className="text-sm leading-relaxed text-[var(--muted)]">JSON 是 Web 开发中最常用的数据格式，CSV 则是 Excel 和数据分析的通用格式。本工具可以在两种格式间快速转换，方便数据导入导出。</p>
      </div>
    </ToolPageWrapper>
  );
}
