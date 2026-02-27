"use client";

import { useState, useCallback } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

export default function UrlCodecPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const convert = useCallback(() => {
    setError("");
    try {
      if (mode === "encode") {
        setOutput(encodeURIComponent(input));
      } else {
        setOutput(decodeURIComponent(input.trim()));
      }
    } catch {
      setError("转换失败，请检查输入内容是否正确");
      setOutput("");
    }
  }, [input, mode]);

  const swap = () => {
    setMode((m) => (m === "encode" ? "decode" : "encode"));
    setInput(output);
    setOutput("");
    setError("");
  };

  const loadSample = () => {
    if (mode === "encode") {
      setInput("https://example.com/搜索?q=在线工具&lang=中文");
    } else {
      setInput("https%3A%2F%2Fexample.com%2F%E6%90%9C%E7%B4%A2%3Fq%3D%E5%9C%A8%E7%BA%BF%E5%B7%A5%E5%85%B7%26lang%3D%E4%B8%AD%E6%96%87");
    }
  };

  return (
    <ToolPageWrapper>
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">URL 编解码</h1>
        <p className="mt-2 text-[var(--muted)]">
          URL 编码与解码转换，处理中文和特殊字符
        </p>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          onClick={() => { setMode("encode"); setOutput(""); setError(""); }}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${mode === "encode" ? "btn-primary" : "border border-[var(--card-border)] bg-[var(--card-bg)]"}`}
        >
          编码
        </button>
        <button
          onClick={() => { setMode("decode"); setOutput(""); setError(""); }}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${mode === "decode" ? "btn-primary" : "border border-[var(--card-border)] bg-[var(--card-bg)]"}`}
        >
          解码
        </button>
        <button onClick={loadSample} className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-2 text-sm font-medium hover:border-[var(--primary)]">
          加载示例
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
            {mode === "encode" ? "输入 URL/文本" : "输入编码后的 URL"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? "输入需要编码的 URL 或文本..." : "输入需要解码的 URL..."}
            className="textarea-tool h-48 w-full rounded-lg p-4 font-mono text-sm"
            spellCheck={false}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--muted)]">
            转换结果
          </label>
          <textarea
            value={output}
            readOnly
            placeholder="结果..."
            className="textarea-tool h-48 w-full rounded-lg p-4 font-mono text-sm"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={convert} className="btn-primary rounded-lg px-6 py-2 text-sm font-medium">
          转换
        </button>
        <button onClick={swap} className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-2 text-sm font-medium hover:border-[var(--primary)]">
          交换 ⇄
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
        <h2 className="mb-3 text-lg font-semibold">什么是 URL 编码？</h2>
        <p className="text-sm leading-relaxed text-[var(--muted)]">
          URL 编码（也称百分号编码）将 URL 中的特殊字符和非 ASCII 字符转换为 %XX 格式。
          例如空格变为 %20，中文字符会被转换为多个 %XX 序列。这是因为 URL 只能包含有限的 ASCII 字符集。
          在开发中，处理包含中文参数的 URL 时经常需要进行编解码操作。
        </p>
      </div>
    </ToolPageWrapper>
  );
}
