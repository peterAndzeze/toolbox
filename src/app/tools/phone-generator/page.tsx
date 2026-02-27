"use client";

import { useState, useCallback } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

const CARRIERS = {
  all: "全部随机",
  cmcc: "中国移动",
  unicom: "中国联通",
  telecom: "中国电信",
} as const;

const PREFIXES = {
  cmcc: [134, 135, 136, 137, 138, 139, 147, 148, 150, 151, 152, 157, 158, 159, 165, 172, 178, 182, 183, 184, 187, 188, 195, 197, 198],
  unicom: [130, 131, 132, 145, 146, 155, 156, 166, 167, 171, 175, 176, 185, 186, 196],
  telecom: [133, 149, 153, 173, 174, 177, 180, 181, 189, 190, 191, 193, 199],
} as const;

const ALL_PREFIXES = [...PREFIXES.cmcc, ...PREFIXES.unicom, ...PREFIXES.telecom];

function randomDigit(): number {
  const arr = new Uint8Array(1);
  crypto.getRandomValues(arr);
  return arr[0] % 10;
}

function generatePhone(carrier: keyof typeof CARRIERS): string {
  const prefixes = carrier === "all" ? ALL_PREFIXES : PREFIXES[carrier];
  const idx = Math.floor((crypto.getRandomValues(new Uint32Array(1))[0] / (0xffffffff + 1)) * prefixes.length);
  const prefix = prefixes[idx];
  let num = String(prefix);
  for (let i = 0; i < 8; i++) num += randomDigit();
  return num;
}

export default function PhoneGeneratorPage() {
  const [carrier, setCarrier] = useState<keyof typeof CARRIERS>("all");
  const [count, setCount] = useState(10);
  const [phones, setPhones] = useState<string[]>([]);
  const [copied, setCopied] = useState(-1);

  const generate = useCallback(() => {
    const list: string[] = [];
    for (let i = 0; i < count; i++) list.push(generatePhone(carrier));
    setPhones(list);
  }, [carrier, count]);

  const copyOne = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(-1), 1500);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(phones.join("\n"));
    setCopied(-2);
    setTimeout(() => setCopied(-1), 1500);
  };

  return (
    <ToolPageWrapper>
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">手机号生成器</h1>
        <p className="mt-2 text-[var(--muted)]">生成符合号段规则的中国手机号码，仅供开发测试使用</p>
      </div>
      <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium">运营商</label>
            <select
              value={carrier}
              onChange={(e) => setCarrier(e.target.value as keyof typeof CARRIERS)}
              className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-4 py-2 text-sm"
            >
              {(Object.entries(CARRIERS) as [keyof typeof CARRIERS, string][]).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">数量: {count}</label>
            <input
              type="range"
              min={1}
              max={100}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full accent-[var(--primary)]"
            />
          </div>
          <div className="flex items-end">
            <button onClick={generate} className="btn-primary w-full rounded-lg py-2.5 text-sm font-medium">生成</button>
          </div>
        </div>
      </div>
      {phones.length > 0 && (
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">{phones.length} 个手机号</span>
            <button onClick={copyAll} className="text-xs text-[var(--primary)] hover:underline">{copied === -2 ? "已复制 ✓" : "复制全部"}</button>
          </div>
          <div className="space-y-1">
            {phones.map((p, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-2">
                <span className="font-mono text-sm">{p}</span>
                <button onClick={() => copyOne(p, i)} className="ml-2 text-xs text-[var(--primary)] hover:underline">{copied === i ? "✓" : "复制"}</button>
              </div>
            ))}
          </div>
        </div>
      )}
      <p className="mt-6 text-center text-xs text-[var(--muted)]">仅供开发测试使用，请勿用于非法用途</p>
    </ToolPageWrapper>
  );
}
