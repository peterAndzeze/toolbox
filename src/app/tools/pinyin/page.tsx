"use client";

import { useState, useCallback, useMemo } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { PINYIN_MAP } from "./pinyin-dict";

type OutputFormat = "pinyin" | "firstLetter";

function convertToPinyin(text: string, format: OutputFormat): string {
  const result: string[] = [];
  for (const char of text) {
    const code = char.charCodeAt(0);
    // CJK Unified Ideographs range
    if (code >= 0x4e00 && code <= 0x9fff) {
      const py = PINYIN_MAP[char];
      if (py) {
        result.push(format === "firstLetter" ? py[0]! : py);
      } else {
        result.push(char);
      }
    } else if (/[\u3000-\u303f\uff00-\uffef]/.test(char)) {
      // Punctuation, full-width - keep as-is or skip space
      if (char === "\u3000" || char === " ") {
        result.push(" ");
      } else {
        result.push(char);
      }
    } else {
      result.push(char);
    }
  }
  if (format === "pinyin") {
    return result.join(" ").replace(/\s+/g, " ").trim();
  }
  return result.join("");
}

export default function PinyinPage() {
  const [input, setInput] = useState("");
  const [format, setFormat] = useState<OutputFormat>("pinyin");
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => convertToPinyin(input, format), [input, format]);

  const copyResult = useCallback(() => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  return (
    <ToolPageWrapper>
      <h1 className="page-title">汉字转拼音</h1>
      <p className="page-subtitle">
        实时将中文转换为拼音，支持拼音首字母提取，中英混合文本中英文保持不变
      </p>

      <div className="card mt-6 rounded-xl p-6">
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">输出格式</label>
          <div className="flex gap-2">
            <button
              onClick={() => setFormat("pinyin")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                format === "pinyin" ? "btn-primary" : "border border-[var(--card-border)] hover:border-[var(--primary)]"
              }`}
            >
              拼音（无声调）
            </button>
            <button
              onClick={() => setFormat("firstLetter")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                format === "firstLetter" ? "btn-primary" : "border border-[var(--card-border)] hover:border-[var(--primary)]"
              }`}
            >
              拼音首字母
            </button>
          </div>
          <p className="mt-2 text-xs text-[var(--muted)]">
            {format === "pinyin"
              ? "例：你好世界 → ni hao shi jie"
              : "例：你好世界 → nhsj"}
          </p>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">输入中文</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入或粘贴中文，支持中英混合..."
            className="textarea-tool w-full resize-y rounded-lg px-4 py-3 font-mono text-sm"
            rows={4}
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium">转换结果</label>
            <button
              onClick={copyResult}
              disabled={!output}
              className="text-sm text-[var(--primary)] hover:underline disabled:cursor-not-allowed disabled:opacity-50"
            >
              {copied ? "已复制 ✓" : "复制结果"}
            </button>
          </div>
          <div className="min-h-[4rem] rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-4 py-3">
            <pre className="whitespace-pre-wrap break-all font-mono text-sm">
              {output || "（输入中文后将显示转换结果）"}
            </pre>
          </div>
        </div>
      </div>

      <div className="card mt-8 rounded-xl p-6">
        <h2 className="mb-3 text-lg font-semibold">使用说明</h2>
        <ul className="space-y-2 text-sm leading-relaxed text-[var(--muted)]">
          <li>• <strong>拼音（无声调）</strong>：将每个汉字转换为对应拼音，用空格分隔，适合开发、搜索等场景</li>
          <li>• <strong>拼音首字母</strong>：提取每个汉字拼音的首字母，如「你好世界」→ nhsj，常用于缩写、搜索</li>
          <li>• 英文字母、数字、标点等非汉字字符将原样保留</li>
          <li>• 本工具内置约 6000+ 常用汉字拼音，生僻字可能无法转换</li>
          <li>• 完整声调标注（如 nǐ hǎo）需要更全面的字典，当前版本提供无声调拼音</li>
        </ul>
      </div>
    </ToolPageWrapper>
  );
}
