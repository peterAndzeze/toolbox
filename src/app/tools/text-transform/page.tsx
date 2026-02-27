"use client";

import { useState } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

const TRANSFORMS = [
  { id: "upper", label: "全部大写", fn: (s: string) => s.toUpperCase() },
  { id: "lower", label: "全部小写", fn: (s: string) => s.toLowerCase() },
  { id: "title", label: "首字母大写", fn: (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase()) },
  { id: "sentence", label: "句首大写", fn: (s: string) => s.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase()) },
  { id: "camel", label: "camelCase", fn: (s: string) => s.toLowerCase().replace(/[^a-zA-Z0-9\u4e00-\u9fff]+(.)/g, (_, c) => c.toUpperCase()) },
  { id: "pascal", label: "PascalCase", fn: (s: string) => s.toLowerCase().replace(/(^|[^a-zA-Z0-9\u4e00-\u9fff]+)(.)/g, (_, __, c) => c.toUpperCase()) },
  { id: "snake", label: "snake_case", fn: (s: string) => s.replace(/([A-Z])/g, "_$1").replace(/[^a-zA-Z0-9\u4e00-\u9fff]+/g, "_").replace(/^_/, "").toLowerCase() },
  { id: "kebab", label: "kebab-case", fn: (s: string) => s.replace(/([A-Z])/g, "-$1").replace(/[^a-zA-Z0-9\u4e00-\u9fff]+/g, "-").replace(/^-/, "").toLowerCase() },
  { id: "reverse", label: "反转文本", fn: (s: string) => [...s].reverse().join("") },
  { id: "trim", label: "去除空白", fn: (s: string) => s.split("\n").map((l) => l.trim()).join("\n") },
  { id: "dedup_lines", label: "行去重", fn: (s: string) => [...new Set(s.split("\n"))].join("\n") },
  { id: "sort_lines", label: "行排序", fn: (s: string) => s.split("\n").sort((a, b) => a.localeCompare(b, "zh")).join("\n") },
  { id: "number_lines", label: "添加行号", fn: (s: string) => s.split("\n").map((l, i) => `${i + 1}. ${l}`).join("\n") },
  { id: "remove_empty", label: "删除空行", fn: (s: string) => s.split("\n").filter((l) => l.trim()).join("\n") },
];

export default function TextTransformPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const apply = (fn: (s: string) => string) => setOutput(fn(input));

  return (
    <ToolPageWrapper>
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">文本转换工具</h1>
        <p className="mt-2 text-[var(--muted)]">大小写转换、命名格式转换、行去重排序等文本处理</p>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {TRANSFORMS.map((t) => (
          <button key={t.id} onClick={() => apply(t.fn)} className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-1.5 text-xs font-medium hover:border-[var(--primary)] hover:text-[var(--primary)]">{t.label}</button>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--muted)]">输入文本</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="输入要转换的文本..." className="textarea-tool h-72 w-full rounded-lg p-4 font-mono text-sm" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--muted)]">转换结果</label>
          <textarea value={output} readOnly placeholder="结果..." className="textarea-tool h-72 w-full rounded-lg p-4 font-mono text-sm" />
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button onClick={() => setInput(output)} className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-2 text-sm font-medium hover:border-[var(--primary)]">结果 → 输入</button>
        {output && <button onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-2 text-sm font-medium hover:border-[var(--primary)]">{copied ? "已复制 ✓" : "复制结果"}</button>}
      </div>
      <div className="mt-12 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
        <h2 className="mb-3 text-lg font-semibold">功能说明</h2>
        <p className="text-sm leading-relaxed text-[var(--muted)]">本工具集合了常用的文本转换功能：大小写转换、编程命名格式转换（camelCase、snake_case等）、文本反转、行去重、行排序等。一键点击即可完成转换。</p>
      </div>
    </ToolPageWrapper>
  );
}
