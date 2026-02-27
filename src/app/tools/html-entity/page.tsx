"use client";

import { useState, useCallback } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

function encodeHtmlEntities(str: string): string {
  return str.replace(/[&<>"'/]/g, (c) => {
    const map: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "/": "&#47;" };
    return map[c] || c;
  });
}

function decodeHtmlEntities(str: string): string {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = str;
  return textarea.value;
}

function encodeUnicode(str: string): string {
  return Array.from(str).map((c) => {
    const code = c.codePointAt(0)!;
    return code > 127 ? `&#${code};` : c;
  }).join("");
}

const COMMON_ENTITIES = [
  { char: "&", entity: "&amp;", name: "And" },
  { char: "<", entity: "&lt;", name: "小于" },
  { char: ">", entity: "&gt;", name: "大于" },
  { char: '"', entity: "&quot;", name: "双引号" },
  { char: "'", entity: "&#39;", name: "单引号" },
  { char: " ", entity: "&nbsp;", name: "空格" },
  { char: "©", entity: "&copy;", name: "版权" },
  { char: "®", entity: "&reg;", name: "注册" },
  { char: "™", entity: "&trade;", name: "商标" },
  { char: "—", entity: "&mdash;", name: "长破折号" },
  { char: "·", entity: "&middot;", name: "中点" },
  { char: "×", entity: "&times;", name: "乘号" },
];

export default function HtmlEntityPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode" | "unicode">("encode");
  const [copied, setCopied] = useState(false);

  const convert = useCallback(() => {
    if (mode === "encode") setOutput(encodeHtmlEntities(input));
    else if (mode === "decode") setOutput(decodeHtmlEntities(input));
    else setOutput(encodeUnicode(input));
  }, [input, mode]);

  return (
    <ToolPageWrapper>
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">HTML 实体编解码</h1>
        <p className="mt-2 text-[var(--muted)]">HTML 特殊字符转义与反转义，Unicode 实体编码</p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {([["encode", "编码"], ["decode", "解码"], ["unicode", "Unicode 编码"]] as const).map(([v, l]) => (
          <button key={v} onClick={() => { setMode(v); setOutput(""); }}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${mode === v ? "btn-primary" : "border border-[var(--card-border)] bg-[var(--card-bg)]"}`}>{l}</button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--muted)]">输入</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "decode" ? '例如 &lt;div&gt;Hello&lt;/div&gt;' : '例如 <div>Hello</div>'}
            className="textarea-tool h-48 w-full rounded-lg p-4 font-mono text-sm" spellCheck={false} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--muted)]">输出</label>
          <textarea value={output} readOnly className="textarea-tool h-48 w-full rounded-lg p-4 font-mono text-sm" />
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button onClick={convert} className="btn-primary rounded-lg px-6 py-2 text-sm font-medium">转换</button>
        {output && (
          <button onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-2 text-sm font-medium hover:border-[var(--primary)]">{copied ? "已复制 ✓" : "复制"}</button>
        )}
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-sm font-semibold">常用 HTML 实体</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {COMMON_ENTITIES.map((e) => (
            <div key={e.entity} className="flex items-center justify-between rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-2 text-sm">
              <span className="font-mono text-[var(--primary)]">{e.char}</span>
              <span className="font-mono text-xs text-[var(--muted)]">{e.entity}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
        <h2 className="mb-3 text-lg font-semibold">HTML 实体说明</h2>
        <p className="text-sm leading-relaxed text-[var(--muted)]">
          HTML 实体用于在网页中显示特殊字符。例如 &lt; 和 &gt; 在 HTML 中有特殊含义，需要转义为 &amp;lt; 和 &amp;gt; 才能正确显示。
          本工具支持常见 HTML 实体和 Unicode 字符的编解码。
        </p>
      </div>
    </ToolPageWrapper>
  );
}
