"use client";

import { useState } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

type Action = "dedupe" | "sort" | "reverse" | "shuffle" | "trim" | "upper" | "lower" | "camel" | "snake" | "addLineNum" | "removeEmpty";

const ACTIONS: { id: Action; label: string }[] = [
  { id: "dedupe", label: "去重" },
  { id: "sort", label: "排序" },
  { id: "reverse", label: "倒序" },
  { id: "shuffle", label: "打乱" },
  { id: "trim", label: "去空白" },
  { id: "removeEmpty", label: "删空行" },
  { id: "upper", label: "全大写" },
  { id: "lower", label: "全小写" },
  { id: "addLineNum", label: "加行号" },
  { id: "camel", label: "驼峰" },
  { id: "snake", label: "下划线" },
];

function process(text: string, action: Action): string {
  const lines = text.split("\n");
  switch (action) {
    case "dedupe": return [...new Set(lines)].join("\n");
    case "sort": return [...lines].sort((a, b) => a.localeCompare(b, "zh")).join("\n");
    case "reverse": return [...lines].reverse().join("\n");
    case "shuffle": return [...lines].sort(() => Math.random() - 0.5).join("\n");
    case "trim": return lines.map((l) => l.trim()).join("\n");
    case "removeEmpty": return lines.filter((l) => l.trim()).join("\n");
    case "upper": return text.toUpperCase();
    case "lower": return text.toLowerCase();
    case "addLineNum": return lines.map((l, i) => `${i + 1}. ${l}`).join("\n");
    case "camel": return text.replace(/[-_\s]+(.)/g, (_, c) => c.toUpperCase()).replace(/^(.)/, (_, c) => c.toLowerCase());
    case "snake": return text.replace(/([a-z])([A-Z])/g, "$1_$2").replace(/[\s-]+/g, "_").toLowerCase();
    default: return text;
  }
}

export default function TextToolsPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const apply = (action: Action) => setOutput(process(input, action));

  return (
    <ToolPageWrapper>
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">文本处理工具</h1>
        <p className="mt-2 text-[var(--muted)]">去重、排序、大小写转换、去空行等一站式文本处理</p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {ACTIONS.map((a) => (
          <button key={a.id} onClick={() => apply(a.id)} className="btn-primary rounded-lg px-3 py-1.5 text-sm font-medium">{a.label}</button>
        ))}
        {output && (
          <button onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-1.5 text-sm font-medium hover:border-[var(--primary)]">
            {copied ? "已复制 ✓" : "复制结果"}
          </button>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--muted)]">输入文本</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="粘贴文本，每行一个..." className="textarea-tool h-80 w-full rounded-lg p-4 font-mono text-sm" spellCheck={false} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--muted)]">处理结果</label>
          <textarea value={output} readOnly placeholder="结果..." className="textarea-tool h-80 w-full rounded-lg p-4 font-mono text-sm" />
        </div>
      </div>

      <div className="mt-12 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
        <h2 className="mb-3 text-lg font-semibold">功能说明</h2>
        <div className="grid gap-2 text-sm text-[var(--muted)] sm:grid-cols-2">
          <p><strong className="text-[var(--foreground)]">去重</strong> - 移除重复行</p>
          <p><strong className="text-[var(--foreground)]">排序</strong> - 按字母/拼音排序</p>
          <p><strong className="text-[var(--foreground)]">倒序</strong> - 反转所有行的顺序</p>
          <p><strong className="text-[var(--foreground)]">打乱</strong> - 随机打乱行顺序</p>
          <p><strong className="text-[var(--foreground)]">去空白</strong> - 去除每行首尾空格</p>
          <p><strong className="text-[var(--foreground)]">删空行</strong> - 删除所有空行</p>
          <p><strong className="text-[var(--foreground)]">驼峰/下划线</strong> - 命名格式转换</p>
          <p><strong className="text-[var(--foreground)]">加行号</strong> - 给每行添加序号</p>
        </div>
      </div>
    </ToolPageWrapper>
  );
}
