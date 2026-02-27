"use client";

import { useState, useCallback } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

async function computeHash(text: string, algorithm: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function HashGeneratorPage() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<Record<string, string>>({});
  const [uppercase, setUppercase] = useState(false);
  const [copied, setCopied] = useState("");

  const generate = useCallback(async () => {
    if (!input) return;
    const algorithms = [
      { name: "SHA-1", id: "SHA-1" },
      { name: "SHA-256", id: "SHA-256" },
      { name: "SHA-384", id: "SHA-384" },
      { name: "SHA-512", id: "SHA-512" },
    ];
    const res: Record<string, string> = {};
    for (const algo of algorithms) {
      res[algo.name] = await computeHash(input, algo.id);
    }
    setResults(res);
  }, [input]);

  const copy = (label: string, value: string) => {
    const v = uppercase ? value.toUpperCase() : value;
    navigator.clipboard.writeText(v);
    setCopied(label);
    setTimeout(() => setCopied(""), 1500);
  };

  return (
    <ToolPageWrapper>
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Hash 生成器</h1>
        <p className="mt-2 text-[var(--muted)]">
          计算文本的 SHA-1、SHA-256、SHA-384、SHA-512 哈希值
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">输入文本</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入要计算哈希的文本..."
          className="textarea-tool h-40 w-full rounded-lg p-4 font-mono text-sm"
          spellCheck={false}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button onClick={generate} className="btn-primary rounded-lg px-6 py-2 text-sm font-medium">
          生成 Hash
        </button>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={uppercase}
            onChange={(e) => setUppercase(e.target.checked)}
            className="h-4 w-4 rounded accent-[var(--primary)]"
          />
          大写输出
        </label>
      </div>

      {Object.keys(results).length > 0 && (
        <div className="mt-6 space-y-3">
          {Object.entries(results).map(([name, hash]) => (
            <div key={name} className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold">{name}</span>
                <button
                  onClick={() => copy(name, hash)}
                  className="text-xs text-[var(--primary)] hover:underline"
                >
                  {copied === name ? "已复制 ✓" : "复制"}
                </button>
              </div>
              <p className="break-all font-mono text-sm text-[var(--muted)]">
                {uppercase ? hash.toUpperCase() : hash}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
        <h2 className="mb-3 text-lg font-semibold">什么是 Hash？</h2>
        <p className="text-sm leading-relaxed text-[var(--muted)]">
          哈希（Hash）是将任意长度的数据映射为固定长度字符串的算法。常用于数据完整性校验、密码存储、数字签名等。
          同样的输入总是产生同样的输出，但无法从哈希值反推原始数据。本工具使用浏览器内置的 Web Crypto API，安全可靠。
        </p>
      </div>
    </ToolPageWrapper>
  );
}
