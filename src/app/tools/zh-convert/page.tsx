"use client";

import { useState, useCallback, useMemo } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { toTraditional, toSimplified } from "./zh-mapping";

export default function ZhConvertPage() {
  const [input, setInput] = useState("");
  const [direction, setDirection] = useState<"s2t" | "t2s">("s2t");
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => {
    if (!input) return "";
    return direction === "s2t" ? toTraditional(input) : toSimplified(input);
  }, [input, direction]);

  const charCount = useMemo(() => Array.from(output).length, [output]);

  const copyResult = useCallback(() => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [output]);

  return (
    <ToolPageWrapper>
      <h1 className="page-title">简繁体转换</h1>
      <p className="page-subtitle">
        中文简体与繁体一键互转，实时转换，支持 2000+ 常用字
      </p>

      <div className="card mt-6 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
        <div className="mb-4">
          <label className="mb-1 block text-xs font-medium text-[var(--muted)]">
            转换方向
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setDirection("s2t")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                direction === "s2t"
                  ? "btn-primary"
                  : "border border-[var(--card-border)] bg-[var(--card-bg)]"
              }`}
            >
              简体 → 繁体
            </button>
            <button
              onClick={() => setDirection("t2s")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                direction === "t2s"
                  ? "btn-primary"
                  : "border border-[var(--card-border)] bg-[var(--card-bg)]"
              }`}
            >
              繁体 → 简体
            </button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--muted)]">
              {direction === "s2t" ? "输入简体中文" : "输入繁体中文"}
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                direction === "s2t"
                  ? "输入简体中文，实时转换为繁体..."
                  : "输入繁体中文，实时转换为简体..."
              }
              className="textarea-tool h-48 w-full rounded-lg p-4 text-base"
            />
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm font-medium text-[var(--muted)]">
                {direction === "s2t" ? "繁体结果" : "简体结果"}
              </label>
              {charCount > 0 && (
                <span className="text-xs text-[var(--muted)]">
                  共 {charCount} 字
                </span>
              )}
            </div>
            <textarea
              value={output}
              readOnly
              placeholder="转换结果..."
              className="textarea-tool h-48 w-full rounded-lg p-4 text-base"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {output && (
            <button
              onClick={copyResult}
              className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-2 text-sm font-medium hover:border-[var(--primary)]"
            >
              {copied ? "已复制 ✓" : "复制结果"}
            </button>
          )}
        </div>
      </div>
    </ToolPageWrapper>
  );
}
