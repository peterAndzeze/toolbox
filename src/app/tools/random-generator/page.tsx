"use client";

import { useState, useCallback } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

type Mode = "integer" | "decimal" | "lottery" | "dice" | "coin";
type SortOption = "none" | "asc" | "desc";

function secureRandom(): number {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0]! / (0xffffffff + 1);
}

function secureRandomInt(min: number, max: number): number {
  const range = max - min + 1;
  return min + Math.floor(secureRandom() * range);
}

export default function RandomGeneratorPage() {
  const [mode, setMode] = useState<Mode>("integer");
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(10);
  const [decimals, setDecimals] = useState(2);
  const [allowDuplicates, setAllowDuplicates] = useState(true);
  const [sortOrder, setSortOrder] = useState<SortOption>("none");
  const [lotteryPick, setLotteryPick] = useState(6);
  const [diceCount, setDiceCount] = useState(2);
  const [coinCount, setCoinCount] = useState(5);
  const [results, setResults] = useState<string[]>([]);
  const [history, setHistory] = useState<string[][]>([]);
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    let output: string[] = [];

    try {
      if (mode === "integer") {
        const nums: number[] = [];
        if (allowDuplicates) {
          for (let i = 0; i < count; i++) {
            nums.push(secureRandomInt(min, max));
          }
        } else {
          const range = max - min + 1;
          if (count > range) {
            setResults([`错误：不重复时数量不能超过范围大小 (${range})`]);
            return;
          }
          const pool = Array.from({ length: range }, (_, i) => min + i);
          for (let i = 0; i < count; i++) {
            const idx = Math.floor(secureRandom() * pool.length);
            nums.push(pool.splice(idx, 1)[0]!);
          }
        }
        if (sortOrder === "asc") nums.sort((a, b) => a - b);
        else if (sortOrder === "desc") nums.sort((a, b) => b - a);
        output = nums.map(String);
      } else if (mode === "decimal") {
        const nums: number[] = [];
        const factor = Math.pow(10, decimals);
        if (allowDuplicates) {
          for (let i = 0; i < count; i++) {
            const val = min + secureRandom() * (max - min);
            nums.push(Math.round(val * factor) / factor);
          }
        } else {
          const seen = new Set<string>();
          let attempts = 0;
          const maxAttempts = count * 100;
          while (nums.length < count && attempts < maxAttempts) {
            attempts++;
            const val = min + secureRandom() * (max - min);
            const rounded = Math.round(val * factor) / factor;
            const key = rounded.toFixed(decimals);
            if (!seen.has(key)) {
              seen.add(key);
              nums.push(rounded);
            }
          }
          if (nums.length < count) {
            setResults([`警告：不重复模式下仅生成 ${nums.length} 个结果`]);
            return;
          }
        }
        if (sortOrder === "asc") nums.sort((a, b) => a - b);
        else if (sortOrder === "desc") nums.sort((a, b) => b - a);
        output = nums.map((n) => n.toFixed(decimals));
      } else if (mode === "lottery") {
        const range = max - min + 1;
        if (lotteryPick > range) {
          setResults([`错误：抽取数量不能超过范围大小 (${range})`]);
          return;
        }
        const pool = Array.from({ length: range }, (_, i) => min + i);
        const picked: number[] = [];
        for (let i = 0; i < lotteryPick; i++) {
          const idx = Math.floor(secureRandom() * pool.length);
          picked.push(pool.splice(idx, 1)[0]!);
        }
        picked.sort((a, b) => a - b);
        output = picked.map(String);
      } else if (mode === "dice") {
        const dice: number[] = [];
        for (let i = 0; i < diceCount; i++) {
          dice.push(secureRandomInt(1, 6));
        }
        const sum = dice.reduce((a, b) => a + b, 0);
        output = [`骰子: ${dice.join(", ")}`, `合计: ${sum}`];
      } else if (mode === "coin") {
        const sides = ["正面", "反面"];
        const flips: string[] = [];
        for (let i = 0; i < coinCount; i++) {
          flips.push(sides[secureRandom() < 0.5 ? 0 : 1]!);
        }
        const heads = flips.filter((f) => f === "正面").length;
        output = [`结果: ${flips.join(", ")}`, `正面: ${heads} / 反面: ${coinCount - heads}`];
      }

      setResults(output);
      setHistory((h) => [[...output], ...h.slice(0, 9)]);
    } catch (err) {
      setResults([`生成失败: ${err instanceof Error ? err.message : String(err)}`]);
    }
  }, [
    mode,
    min,
    max,
    count,
    decimals,
    allowDuplicates,
    sortOrder,
    lotteryPick,
    diceCount,
    coinCount,
  ]);

  const copyResults = () => {
    if (results.length === 0) return;
    navigator.clipboard.writeText(results.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const modes: { value: Mode; label: string }[] = [
    { value: "integer", label: "整数" },
    { value: "decimal", label: "小数" },
    { value: "lottery", label: "抽奖" },
    { value: "dice", label: "骰子" },
    { value: "coin", label: "抛硬币" },
  ];

  return (
    <ToolPageWrapper>
      <h1 className="page-title">随机数生成器</h1>
      <p className="page-subtitle">
        使用密码学安全随机数 (crypto.getRandomValues)，支持整数、小数、抽奖、骰子、抛硬币
      </p>

      <div className="card mt-6 rounded-xl p-6">
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">模式</label>
          <div className="flex flex-wrap gap-2">
            {modes.map((m) => (
              <button
                key={m.value}
                onClick={() => setMode(m.value)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  mode === m.value ? "btn-primary" : "border border-[var(--card-border)] hover:border-[var(--primary)]"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {(mode === "integer" || mode === "decimal") && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-1 block text-sm font-medium">最小值</label>
                <input
                  type="number"
                  value={min}
                  onChange={(e) => setMin(Number(e.target.value))}
                  className="input w-full rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">最大值</label>
                <input
                  type="number"
                  value={max}
                  onChange={(e) => setMax(Number(e.target.value))}
                  className="input w-full rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">数量 (1-100)</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={count}
                  onChange={(e) => setCount(Math.min(100, Math.max(1, Number(e.target.value))))}
                  className="input w-full rounded-lg px-3 py-2"
                />
              </div>
              {mode === "decimal" && (
                <div>
                  <label className="mb-1 block text-sm font-medium">小数位</label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={decimals}
                    onChange={(e) => setDecimals(Math.min(10, Math.max(0, Number(e.target.value))))}
                    className="input w-full rounded-lg px-3 py-2"
                  />
                </div>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-4">
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={allowDuplicates}
                  onChange={(e) => setAllowDuplicates(e.target.checked)}
                  className="h-4 w-4 rounded accent-[var(--primary)]"
                />
                允许重复
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm">排序:</span>
                {(["none", "asc", "desc"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSortOrder(s)}
                    className={`rounded px-2 py-1 text-xs ${
                      sortOrder === s ? "btn-primary" : "border border-[var(--card-border)]"
                    }`}
                  >
                    {s === "none" ? "无" : s === "asc" ? "升序" : "降序"}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {mode === "lottery" && (
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium">范围最小值</label>
              <input
                type="number"
                value={min}
                onChange={(e) => setMin(Number(e.target.value))}
                className="input w-full rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">范围最大值</label>
              <input
                type="number"
                value={max}
                onChange={(e) => setMax(Number(e.target.value))}
                className="input w-full rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">抽取数量</label>
              <input
                type="number"
                min={1}
                value={lotteryPick}
                onChange={(e) => setLotteryPick(Math.max(1, Number(e.target.value)))}
                className="input w-full rounded-lg px-3 py-2"
              />
            </div>
          </div>
        )}

        {mode === "dice" && (
          <div>
            <label className="mb-2 block text-sm font-medium">骰子数量: {diceCount}</label>
            <input
              type="range"
              min={1}
              max={10}
              value={diceCount}
              onChange={(e) => setDiceCount(Number(e.target.value))}
              className="w-full accent-[var(--primary)]"
            />
            <div className="mt-1 flex justify-between text-xs text-[var(--muted)]">
              <span>1</span>
              <span>10</span>
            </div>
          </div>
        )}

        {mode === "coin" && (
          <div>
            <label className="mb-2 block text-sm font-medium">抛掷次数: {coinCount}</label>
            <input
              type="range"
              min={1}
              max={50}
              value={coinCount}
              onChange={(e) => setCoinCount(Number(e.target.value))}
              className="w-full accent-[var(--primary)]"
            />
            <div className="mt-1 flex justify-between text-xs text-[var(--muted)]">
              <span>1</span>
              <span>50</span>
            </div>
          </div>
        )}

        <button onClick={generate} className="btn-primary mt-6 w-full rounded-lg py-3 text-sm font-medium">
          {mode === "lottery" ? `抽 ${lotteryPick} 个不重复号码` : mode === "dice" ? "掷骰子" : mode === "coin" ? "抛硬币" : "生成"}
        </button>
      </div>

      {results.length > 0 && (
        <div className="card mt-6 rounded-xl p-6">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium">生成结果</span>
            <button
              onClick={copyResults}
              className="text-sm text-[var(--primary)] hover:underline"
            >
              {copied ? "已复制 ✓" : "复制结果"}
            </button>
          </div>
          <div className="rounded-lg border border-[var(--card-border)] bg-[var(--background)] p-4">
            <pre className="whitespace-pre-wrap break-all font-mono text-sm">{results.join("\n")}</pre>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="card mt-6 rounded-xl p-6">
          <h2 className="mb-3 text-lg font-semibold">历史记录</h2>
          <div className="space-y-2">
            {history.map((entry, i) => (
              <div
                key={i}
                className="rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm"
              >
                <pre className="whitespace-pre-wrap break-all font-mono text-xs">{entry.join("\n")}</pre>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card mt-8 rounded-xl p-6">
        <h2 className="mb-3 text-lg font-semibold">关于随机性</h2>
        <p className="text-sm leading-relaxed text-[var(--muted)]">
          本工具使用 <code className="rounded bg-[var(--card-border)] px-1 py-0.5">crypto.getRandomValues</code> 生成密码学安全的随机数，适用于抽奖、游戏、测试数据等场景。所有计算均在浏览器本地完成，数据不会上传。
        </p>
      </div>
    </ToolPageWrapper>
  );
}
