"use client";

import { useState, useCallback, useMemo } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

type Direction = "text2hex" | "hex2text";
type Separator = "space" | "none" | "0x";

function textToHex(text: string, separator: Separator): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(text);
  const hexArr = Array.from(bytes).map((b) =>
    b.toString(16).toUpperCase().padStart(2, "0")
  );
  if (separator === "space") return hexArr.join(" ");
  if (separator === "0x") return hexArr.map((h) => `0x${h}`).join(" ");
  return hexArr.join("");
}

function hexToText(hex: string): string {
  const cleaned = hex.replace(/0x|0X|\s/g, "");
  if (cleaned.length % 2 !== 0) throw new Error("Hex 字符串长度必须为偶数");
  const bytes = new Uint8Array(cleaned.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    const byte = parseInt(cleaned.slice(i * 2, i * 2 + 2), 16);
    if (isNaN(byte)) throw new Error("包含无效的十六进制字符");
    bytes[i] = byte;
  }
  return new TextDecoder("utf-8").decode(bytes);
}

export default function HexStringPage() {
  const [input, setInput] = useState("");
  const [direction, setDirection] = useState<Direction>("text2hex");
  const [separator, setSeparator] = useState<Separator>("space");
  const [copied, setCopied] = useState(false);

  const { output, byteCount, error } = useMemo(() => {
    if (!input.trim()) return { output: "", byteCount: 0, error: "" };
    try {
      if (direction === "text2hex") {
        const encoder = new TextEncoder();
        const bytes = encoder.encode(input);
        return {
          output: textToHex(input, separator),
          byteCount: bytes.length,
          error: "",
        };
      } else {
        const result = hexToText(input);
        const encoder = new TextEncoder();
        return {
          output: result,
          byteCount: encoder.encode(result).length,
          error: "",
        };
      }
    } catch (e) {
      return {
        output: "",
        byteCount: 0,
        error: e instanceof Error ? e.message : "转换失败",
      };
    }
  }, [input, direction, separator]);

  const copyResult = useCallback(() => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [output]);

  return (
    <ToolPageWrapper>
      <h1 className="page-title">Hex 字符串互转</h1>
      <p className="page-subtitle">
        文本与十六进制互转，支持 UTF-8 编码，多种分隔格式
      </p>

      <div className="card mt-6 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
        <div className="mb-4 flex flex-wrap gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--muted)]">
              转换方向
            </label>
            <div className="flex gap-2">
              {(["text2hex", "hex2text"] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDirection(d)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    direction === d
                      ? "btn-primary"
                      : "border border-[var(--card-border)] bg-[var(--card-bg)]"
                  }`}
                >
                  {d === "text2hex" ? "文本 → Hex" : "Hex → 文本"}
                </button>
              ))}
            </div>
          </div>
          {direction === "text2hex" && (
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--muted)]">
                分隔符
              </label>
              <select
                value={separator}
                onChange={(e) => setSeparator(e.target.value as Separator)}
                className="input rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-2 text-sm"
              >
                <option value="space">空格分隔</option>
                <option value="none">无分隔</option>
                <option value="0x">0x 前缀</option>
              </select>
            </div>
          )}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--muted)]">
              {direction === "text2hex" ? "输入文本" : "输入 Hex"}
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                direction === "text2hex"
                  ? "输入文本，支持中文 UTF-8..."
                  : "输入十六进制字符串，如 48 65 6C 6C 6F 或 48656C6C6F..."
              }
              className="textarea-tool h-48 w-full rounded-lg p-4 font-mono text-sm"
              spellCheck={false}
            />
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm font-medium text-[var(--muted)]">
                {direction === "text2hex" ? "Hex 结果" : "解码文本"}
              </label>
              {byteCount > 0 && (
                <span className="text-xs text-[var(--muted)]">
                  共 {byteCount} 字节
                </span>
              )}
            </div>
            <textarea
              value={output}
              readOnly
              placeholder="转换结果..."
              className="textarea-tool h-48 w-full rounded-lg p-4 font-mono text-sm"
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

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

      <div className="mt-8 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
        <h2 className="mb-3 text-lg font-semibold">格式说明</h2>
        <ul className="space-y-2 text-sm text-[var(--muted)]">
          <li>
            <strong className="text-[var(--foreground)]">空格分隔：</strong>
            如 48 65 6C 6C 6F，便于阅读
          </li>
          <li>
            <strong className="text-[var(--foreground)]">无分隔：</strong>
            如 48656C6C6F，紧凑格式
          </li>
          <li>
            <strong className="text-[var(--foreground)]">0x 前缀：</strong>
            如 0x48 0x65 0x6C，编程常用
          </li>
          <li>
            解码时自动忽略空格和 0x 前缀，支持混合输入
          </li>
        </ul>
      </div>
    </ToolPageWrapper>
  );
}
