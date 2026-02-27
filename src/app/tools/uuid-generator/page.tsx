"use client";

import { useState, useCallback } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

export default function UuidGeneratorPage() {
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState<string[]>([]);
  const [format, setFormat] = useState<"default" | "upper" | "nodash">("default");
  const [copied, setCopied] = useState(-1);

  const generate = useCallback(() => {
    const list: string[] = [];
    for (let i = 0; i < count; i++) {
      let uuid = crypto.randomUUID();
      if (format === "upper") uuid = uuid.toUpperCase();
      else if (format === "nodash") uuid = uuid.replace(/-/g, "");
      list.push(uuid);
    }
    setUuids(list);
  }, [count, format]);

  const copyOne = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(-1), 1500);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(uuids.join("\n"));
    setCopied(-2);
    setTimeout(() => setCopied(-1), 1500);
  };

  return (
    <ToolPageWrapper>
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">UUID 生成器</h1>
        <p className="mt-2 text-[var(--muted)]">批量生成 UUID/GUID，支持多种格式</p>
      </div>
      <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium">数量: {count}</label>
            <input type="range" min={1} max={50} value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-full accent-[var(--primary)]" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">格式</label>
            <div className="flex gap-1">
              {([["default", "标准"], ["upper", "大写"], ["nodash", "无横杠"]] as const).map(([v, l]) => (
                <button key={v} onClick={() => setFormat(v as typeof format)} className={`flex-1 rounded-lg px-2 py-2 text-xs font-medium ${format === v ? "btn-primary" : "border border-[var(--card-border)]"}`}>{l}</button>
              ))}
            </div>
          </div>
          <div className="flex items-end">
            <button onClick={generate} className="btn-primary w-full rounded-lg py-2.5 text-sm font-medium">生成</button>
          </div>
        </div>
      </div>
      {uuids.length > 0 && (
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">{uuids.length} 个 UUID</span>
            <button onClick={copyAll} className="text-xs text-[var(--primary)] hover:underline">{copied === -2 ? "已复制 ✓" : "复制全部"}</button>
          </div>
          <div className="space-y-1">
            {uuids.map((u, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-2">
                <span className="font-mono text-sm">{u}</span>
                <button onClick={() => copyOne(u, i)} className="ml-2 text-xs text-[var(--primary)] hover:underline">{copied === i ? "✓" : "复制"}</button>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="mt-12 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
        <h2 className="mb-3 text-lg font-semibold">什么是 UUID？</h2>
        <p className="text-sm leading-relaxed text-[var(--muted)]">UUID (Universally Unique Identifier) 是一种 128 位的唯一标识符，广泛用于数据库主键、分布式系统、API 请求追踪等场景。本工具使用浏览器内置的 crypto.randomUUID() 生成符合 RFC 4122 v4 标准的 UUID。</p>
      </div>
    </ToolPageWrapper>
  );
}
