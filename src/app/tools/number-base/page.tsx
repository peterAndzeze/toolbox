"use client";

import { useState, useMemo } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

const bases = [
  { label: "二进制 (2)", base: 2 },
  { label: "八进制 (8)", base: 8 },
  { label: "十进制 (10)", base: 10 },
  { label: "十六进制 (16)", base: 16 },
];

export default function NumberBasePage() {
  const [input, setInput] = useState("255");
  const [fromBase, setFromBase] = useState(10);
  const [copied, setCopied] = useState("");

  const results = useMemo(() => {
    if (!input.trim()) return { values: {} as Record<number, string>, error: "" };
    const num = parseInt(input.trim(), fromBase);
    if (isNaN(num)) return { values: {} as Record<number, string>, error: "请输入有效的数字" };
    const values: Record<number, string> = {};
    bases.forEach((b) => { values[b.base] = num.toString(b.base).toUpperCase(); });
    return { values, error: "" };
  }, [input, fromBase]);

  const convert = (base: number): string => results.values[base] || "";

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 1500);
  };

  const quickExamples = [
    { label: "255", value: "255", base: 10 },
    { label: "0xFF", value: "FF", base: 16 },
    { label: "0b1010", value: "1010", base: 2 },
    { label: "0o777", value: "777", base: 8 },
  ];

  return (
    <ToolPageWrapper>
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">进制转换器</h1>
        <p className="mt-2 text-[var(--muted)]">
          二进制、八进制、十进制、十六进制互相转换
        </p>
      </div>

      <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">输入进制</label>
          <div className="flex flex-wrap gap-2">
            {bases.map((b) => (
              <button
                key={b.base}
                onClick={() => setFromBase(b.base)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${fromBase === b.base ? "btn-primary" : "border border-[var(--card-border)] bg-[var(--background)]"}`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">输入数值</label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`输入${bases.find((b) => b.base === fromBase)?.label}数字...`}
            className="textarea-tool w-full rounded-lg px-4 py-3 font-mono text-lg"
            spellCheck={false}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {quickExamples.map((ex) => (
            <button
              key={ex.label}
              onClick={() => { setInput(ex.value); setFromBase(ex.base); }}
              className="rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-1.5 text-xs font-medium hover:border-[var(--primary)]"
            >
              {ex.label}
            </button>
          ))}
        </div>

        {results.error && (
          <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {results.error}
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {bases.map((b) => {
          const result = convert(b.base);
          return (
            <div key={b.base} className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold">{b.label}</span>
                {result && (
                  <button
                    onClick={() => copy(result, b.label)}
                    className="text-xs text-[var(--primary)] hover:underline"
                  >
                    {copied === b.label ? "已复制 ✓" : "复制"}
                  </button>
                )}
              </div>
              <p className="break-all font-mono text-lg font-bold text-[var(--primary)]">
                {result || "-"}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-12 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
        <h2 className="mb-3 text-lg font-semibold">进制说明</h2>
        <div className="grid gap-4 text-sm text-[var(--muted)] sm:grid-cols-2">
          <div>
            <strong className="text-[var(--foreground)]">二进制 (Binary)</strong>
            <p>只用 0 和 1，是计算机底层的数据表示方式。</p>
          </div>
          <div>
            <strong className="text-[var(--foreground)]">八进制 (Octal)</strong>
            <p>使用 0-7，常用于 Unix/Linux 文件权限（如 chmod 755）。</p>
          </div>
          <div>
            <strong className="text-[var(--foreground)]">十进制 (Decimal)</strong>
            <p>日常使用的数字系统，使用 0-9。</p>
          </div>
          <div>
            <strong className="text-[var(--foreground)]">十六进制 (Hex)</strong>
            <p>使用 0-9 和 A-F，常用于颜色值、内存地址。</p>
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
}
