"use client";

import { useState, useEffect } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

function formatDate(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export default function TimestampPage() {
  const [now, setNow] = useState(Date.now());
  const [tsInput, setTsInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [tsResult, setTsResult] = useState("");
  const [dateResult, setDateResult] = useState("");
  const [tsUnit, setTsUnit] = useState<"s" | "ms">("s");
  const [copied, setCopied] = useState("");

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const convertTimestamp = () => {
    const num = Number(tsInput);
    if (isNaN(num)) {
      setDateResult("请输入有效的时间戳");
      return;
    }
    const ms = tsUnit === "s" ? num * 1000 : num;
    const d = new Date(ms);
    if (isNaN(d.getTime())) {
      setDateResult("无效的时间戳");
      return;
    }
    setDateResult(formatDate(d));
  };

  const convertDate = () => {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) {
      setTsResult("请输入有效的日期时间格式");
      return;
    }
    setTsResult(tsUnit === "s" ? Math.floor(d.getTime() / 1000).toString() : d.getTime().toString());
  };

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 1500);
  };

  const currentSec = Math.floor(now / 1000);

  return (
    <ToolPageWrapper>
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">时间戳转换</h1>
        <p className="mt-2 text-[var(--muted)]">
          Unix 时间戳与日期时间互相转换，支持秒和毫秒
        </p>
      </div>

      {/* Current time */}
      <div className="mb-8 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
        <h2 className="mb-4 text-sm font-semibold text-[var(--muted)]">当前时间</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs text-[var(--muted)]">Unix 时间戳（秒）</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="font-mono text-xl font-bold text-[var(--primary)]">{currentSec}</span>
              <button onClick={() => copy(currentSec.toString(), "sec")} className="text-xs text-[var(--primary)] hover:underline">
                {copied === "sec" ? "✓" : "复制"}
              </button>
            </div>
          </div>
          <div>
            <p className="text-xs text-[var(--muted)]">Unix 时间戳（毫秒）</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="font-mono text-xl font-bold text-[var(--primary)]">{now}</span>
              <button onClick={() => copy(now.toString(), "ms")} className="text-xs text-[var(--primary)] hover:underline">
                {copied === "ms" ? "✓" : "复制"}
              </button>
            </div>
          </div>
          <div>
            <p className="text-xs text-[var(--muted)]">日期时间</p>
            <p className="mt-1 font-mono text-xl font-bold">{formatDate(new Date(now))}</p>
          </div>
        </div>
      </div>

      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setTsUnit("s")}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${tsUnit === "s" ? "btn-primary" : "border border-[var(--card-border)] bg-[var(--card-bg)]"}`}
        >
          秒 (s)
        </button>
        <button
          onClick={() => setTsUnit("ms")}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${tsUnit === "ms" ? "btn-primary" : "border border-[var(--card-border)] bg-[var(--card-bg)]"}`}
        >
          毫秒 (ms)
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Timestamp -> Date */}
        <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
          <h3 className="mb-4 font-semibold">时间戳 → 日期</h3>
          <input
            type="text"
            value={tsInput}
            onChange={(e) => setTsInput(e.target.value)}
            placeholder={`输入时间戳（${tsUnit === "s" ? "秒" : "毫秒"}）`}
            className="textarea-tool mb-3 w-full rounded-lg px-3 py-2.5 font-mono text-sm"
          />
          <button onClick={convertTimestamp} className="btn-primary w-full rounded-lg py-2.5 text-sm font-medium">
            转换
          </button>
          {dateResult && (
            <div className="mt-3 flex items-center justify-between rounded-lg bg-[var(--background)] p-3">
              <span className="font-mono text-sm">{dateResult}</span>
              <button onClick={() => copy(dateResult, "dr")} className="text-xs text-[var(--primary)] hover:underline">
                {copied === "dr" ? "✓" : "复制"}
              </button>
            </div>
          )}
        </div>

        {/* Date -> Timestamp */}
        <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
          <h3 className="mb-4 font-semibold">日期 → 时间戳</h3>
          <input
            type="text"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            placeholder="例如: 2025-01-15 12:30:00"
            className="textarea-tool mb-3 w-full rounded-lg px-3 py-2.5 font-mono text-sm"
          />
          <button onClick={convertDate} className="btn-primary w-full rounded-lg py-2.5 text-sm font-medium">
            转换
          </button>
          {tsResult && (
            <div className="mt-3 flex items-center justify-between rounded-lg bg-[var(--background)] p-3">
              <span className="font-mono text-sm">{tsResult}</span>
              <button onClick={() => copy(tsResult, "tr")} className="text-xs text-[var(--primary)] hover:underline">
                {copied === "tr" ? "✓" : "复制"}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-12 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
        <h2 className="mb-3 text-lg font-semibold">什么是 Unix 时间戳？</h2>
        <p className="text-sm leading-relaxed text-[var(--muted)]">
          Unix 时间戳是从 1970 年 1 月 1 日 00:00:00 UTC 到某个时间点所经过的秒数（或毫秒数）。
          它是计算机系统中最常用的时间表示方式，广泛用于数据库、API 接口、日志系统等场景。
          本工具支持秒级和毫秒级时间戳的转换。
        </p>
      </div>
    </ToolPageWrapper>
  );
}
