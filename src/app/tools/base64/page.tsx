"use client";

import { useState, useCallback } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

export default function Base64Page() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const convert = useCallback(() => {
    setError("");
    try {
      if (mode === "encode") {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input.trim()))));
      }
    } catch {
      setError(mode === "encode" ? "编码失败，请检查输入" : "解码失败，请确认是有效的 Base64 字符串");
      setOutput("");
    }
  }, [input, mode]);

  const swap = () => {
    setMode((m) => (m === "encode" ? "decode" : "encode"));
    setInput(output);
    setOutput("");
    setError("");
  };

  return (
    <ToolPageWrapper>
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Base64 编解码</h1>
        <p className="mt-2 text-[var(--muted)]">
          文本与 Base64 互相转换，支持中文，浏览器本地处理
        </p>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          onClick={() => { setMode("encode"); setOutput(""); setError(""); }}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${mode === "encode" ? "btn-primary" : "border border-[var(--card-border)] bg-[var(--card-bg)]"}`}
        >
          编码（文本 → Base64）
        </button>
        <button
          onClick={() => { setMode("decode"); setOutput(""); setError(""); }}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${mode === "decode" ? "btn-primary" : "border border-[var(--card-border)] bg-[var(--card-bg)]"}`}
        >
          解码（Base64 → 文本）
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--muted)]">
            {mode === "encode" ? "输入文本" : "输入 Base64"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? "输入要编码的文本..." : "输入要解码的 Base64 字符串..."}
            className="textarea-tool h-64 w-full rounded-lg p-4 font-mono text-sm"
            spellCheck={false}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--muted)]">
            {mode === "encode" ? "Base64 结果" : "解码文本"}
          </label>
          <textarea
            value={output}
            readOnly
            placeholder="转换结果..."
            className="textarea-tool h-64 w-full rounded-lg p-4 font-mono text-sm"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={convert} className="btn-primary rounded-lg px-6 py-2 text-sm font-medium">
          {mode === "encode" ? "编码" : "解码"}
        </button>
        <button onClick={swap} className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-2 text-sm font-medium hover:border-[var(--primary)]">
          交换输入/输出 ⇄
        </button>
        {output && (
          <button
            onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-2 text-sm font-medium hover:border-[var(--primary)]"
          >
            {copied ? "已复制 ✓" : "复制结果"}
          </button>
        )}
      </div>

      <div className="mt-12 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
        <h2 className="mb-3 text-lg font-semibold">什么是 Base64？</h2>
        <p className="text-sm leading-relaxed text-[var(--muted)]">
          Base64 是一种将二进制数据编码为 ASCII 字符串的方法，常用于在 URL、邮件、JSON 中传输二进制数据。
          编码后的字符串只包含 A-Z、a-z、0-9、+、/ 和 = 字符。本工具支持中文等 Unicode 字符的编解码。
        </p>
      </div>
    </ToolPageWrapper>
  );
}
