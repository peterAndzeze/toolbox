"use client";

import { useState, useCallback } from "react";
import type { Metadata } from "next";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

export default function JsonFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const format = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError("");
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  }, [input]);

  const compress = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError("");
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  }, [input]);

  const copyOutput = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const loadSample = () => {
    const sample = {
      name: "速用工具箱",
      version: "1.0.0",
      tools: ["JSON格式化", "二维码生成", "图片压缩"],
      settings: { theme: "dark", language: "zh-CN" },
    };
    setInput(JSON.stringify(sample));
  };

  return (
    <ToolPageWrapper>
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">JSON 格式化 / 校验</h1>
        <p className="mt-2 text-[var(--muted)]">
          粘贴 JSON 数据，一键格式化、压缩或校验，支持错误提示
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <button onClick={format} className="btn-primary rounded-lg px-4 py-2 text-sm font-medium">
          格式化
        </button>
        <button onClick={compress} className="btn-primary rounded-lg px-4 py-2 text-sm font-medium">
          压缩
        </button>
        <button
          onClick={loadSample}
          className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-2 text-sm font-medium transition-colors hover:border-[var(--primary)]"
        >
          加载示例
        </button>
        {output && (
          <button
            onClick={copyOutput}
            className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-2 text-sm font-medium transition-colors hover:border-[var(--primary)]"
          >
            {copied ? "已复制 ✓" : "复制结果"}
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          JSON 语法错误: {error}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--muted)]">
            输入 JSON
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='粘贴 JSON 数据，例如 {"key": "value"}'
            className="textarea-tool h-96 w-full rounded-lg p-4 font-mono text-sm"
            spellCheck={false}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--muted)]">
            输出结果
          </label>
          <textarea
            value={output}
            readOnly
            placeholder="格式化结果将显示在这里"
            className="textarea-tool h-96 w-full rounded-lg p-4 font-mono text-sm"
          />
        </div>
      </div>

      <div className="mt-12 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6">
        <h2 className="text-lg font-semibold mb-3">什么是 JSON？</h2>
        <p className="text-sm text-[var(--muted)] leading-relaxed">
          JSON (JavaScript Object Notation) 是一种轻量级的数据交换格式，易于人类阅读和编写，也易于机器解析和生成。
          它常用于 Web 应用中前后端之间的数据传输。本工具可以帮助你快速格式化、压缩和校验 JSON 数据，
          所有操作都在浏览器本地完成，不会上传你的数据到服务器。
        </p>
      </div>
    </ToolPageWrapper>
  );
}
