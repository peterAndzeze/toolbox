"use client";

import { useState, useCallback, useMemo } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

type Format = "unicode" | "html-hex" | "html-dec" | "utf8-hex" | "css";

function encodeUnicode(str: string): string {
  return Array.from(str)
    .map((c) => {
      const code = c.codePointAt(0)!;
      return code > 127 ? `\\u${code.toString(16).toUpperCase().padStart(4, "0")}` : c;
    })
    .join("");
}

function decodeUnicode(str: string): string {
  return str.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) =>
    String.fromCodePoint(parseInt(hex, 16))
  );
}

function encodeHtmlHex(str: string): string {
  return Array.from(str)
    .map((c) => {
      const code = c.codePointAt(0)!;
      return code > 127 ? `&#x${code.toString(16).toUpperCase()};` : c;
    })
    .join("");
}

function decodeHtmlHex(str: string): string {
  return str.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
    String.fromCodePoint(parseInt(hex, 16))
  );
}

function encodeHtmlDec(str: string): string {
  return Array.from(str)
    .map((c) => {
      const code = c.codePointAt(0)!;
      return code > 127 ? `&#${code};` : c;
    })
    .join("");
}

function decodeHtmlDec(str: string): string {
  return str.replace(/&#(\d+);/g, (_, dec) =>
    String.fromCodePoint(parseInt(dec, 10))
  );
}

function encodeUtf8Hex(str: string): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
  return Array.from(bytes)
    .map((b) => b.toString(16).toUpperCase().padStart(2, "0"))
    .join(" ");
}

function decodeUtf8Hex(str: string): string {
  try {
    const hexParts = str.trim().split(/\s+/);
    const bytes = new Uint8Array(hexParts.map((h) => parseInt(h, 16)));
    return new TextDecoder().decode(bytes);
  } catch {
    throw new Error("无效的 UTF-8 Hex 格式");
  }
}

function encodeCss(str: string): string {
  return Array.from(str)
    .map((c) => {
      const code = c.codePointAt(0)!;
      return code > 127 ? `\\${code.toString(16).toUpperCase().padStart(4, "0")}` : c;
    })
    .join("");
}

function decodeCss(str: string): string {
  return str.replace(/\\([0-9a-fA-F]{4})/g, (_, hex) =>
    String.fromCodePoint(parseInt(hex, 16))
  );
}

const ENCODERS: Record<Format, (s: string) => string> = {
  unicode: encodeUnicode,
  "html-hex": encodeHtmlHex,
  "html-dec": encodeHtmlDec,
  "utf8-hex": encodeUtf8Hex,
  css: encodeCss,
};

const DECODERS: Record<Format, (s: string) => string> = {
  unicode: decodeUnicode,
  "html-hex": decodeHtmlHex,
  "html-dec": decodeHtmlDec,
  "utf8-hex": decodeUtf8Hex,
  css: decodeCss,
};

const FORMAT_LABELS: Record<Format, string> = {
  unicode: "Unicode 转义 (\\uXXXX)",
  "html-hex": "HTML 实体 十六进制 (&#xXXXX;)",
  "html-dec": "HTML 实体 十进制 (&#DDDD;)",
  "utf8-hex": "UTF-8 Hex",
  css: "CSS 转义 (\\XXXX)",
};

export default function UnicodeConverterPage() {
  const [input, setInput] = useState("");
  const [direction, setDirection] = useState<"encode" | "decode">("encode");
  const [format, setFormat] = useState<Format>("unicode");
  const [copied, setCopied] = useState(false);

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: "", error: "" };
    try {
      if (direction === "encode") {
        return { output: ENCODERS[format](input), error: "" };
      } else {
        return { output: DECODERS[format](input), error: "" };
      }
    } catch (e) {
      return { output: "", error: e instanceof Error ? e.message : "转换失败" };
    }
  }, [input, direction, format]);

  const copyResult = useCallback(() => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [output]);

  return (
    <ToolPageWrapper>
      <h1 className="page-title text-2xl font-bold sm:text-3xl">Unicode 编解码</h1>
      <p className="page-subtitle mt-2 text-[var(--muted)]">
        中文与 Unicode 转义、HTML 实体、UTF-8 Hex 格式互转，实时转换
      </p>

      <div className="card mt-6 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
        <div className="mb-4 flex flex-wrap gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--muted)]">方向</label>
            <div className="flex gap-2">
              {(["encode", "decode"] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDirection(d)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    direction === d ? "btn-primary" : "border border-[var(--card-border)] bg-[var(--card-bg)]"
                  }`}
                >
                  {d === "encode" ? "编码（文本→Unicode）" : "解码（Unicode→文本）"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--muted)]">格式</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as Format)}
              className="input rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-2 text-sm"
            >
              <option value="unicode">\uXXXX</option>
              <option value="html-hex">&#xXXXX;</option>
              <option value="html-dec">&#DDDD;</option>
              <option value="utf8-hex">UTF-8 Hex</option>
              <option value="css">\XXXX (CSS)</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--muted)]">
              {direction === "encode" ? "输入文本" : "输入编码"}
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                direction === "encode"
                  ? "输入中文或 Unicode 文本..."
                  : `输入 ${FORMAT_LABELS[format]} 格式...`
              }
              className="textarea-tool h-48 w-full rounded-lg p-4 font-mono text-sm"
              spellCheck={false}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--muted)]">
              {direction === "encode" ? "编码结果" : "解码文本"}
            </label>
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
          <li><code className="rounded bg-[var(--card-border)] px-1">\uXXXX</code> — JavaScript/JSON 常用，如 \u4E2D\u6587</li>
          <li><code className="rounded bg-[var(--card-border)] px-1">&#xXXXX;</code> — HTML 十六进制实体</li>
          <li><code className="rounded bg-[var(--card-border)] px-1">&#DDDD;</code> — HTML 十进制实体</li>
          <li><code className="rounded bg-[var(--card-border)] px-1">UTF-8 Hex</code> — 字节的十六进制表示，空格分隔</li>
          <li><code className="rounded bg-[var(--card-border)] px-1">\XXXX</code> — CSS 转义格式</li>
        </ul>
      </div>

      <div className="mt-12 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
        <h2 className="mb-3 text-lg font-semibold">关于 Unicode</h2>
        <p className="text-sm leading-relaxed text-[var(--muted)]">
          Unicode 为世界上大多数文字提供统一的字符编码。本工具支持中文、英文及混合内容的实时编解码，支持多种常见格式互转，所有处理均在浏览器本地完成。
        </p>
      </div>
    </ToolPageWrapper>
  );
}
