"use client";

import { useState, useMemo } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

const FIELD_NAMES = ["秒", "分", "时", "日", "月", "周"];
const FIELD_RANGES = [
  { min: 0, max: 59, label: "0-59" },
  { min: 0, max: 59, label: "0-59" },
  { min: 0, max: 23, label: "0-23" },
  { min: 1, max: 31, label: "1-31" },
  { min: 1, max: 12, label: "1-12" },
  { min: 0, max: 6, label: "0-6 (日-六)" },
];

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];
const MONTHS = ["", "1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

function describeField(value: string, index: number): string {
  if (value === "*") return `每${FIELD_NAMES[index]}`;
  if (value.includes("/")) {
    const [, step] = value.split("/");
    return `每隔 ${step} ${FIELD_NAMES[index]}`;
  }
  if (value.includes(",")) return `第 ${value} ${FIELD_NAMES[index]}`;
  if (value.includes("-")) {
    const [start, end] = value.split("-");
    return `${start} 到 ${end} ${FIELD_NAMES[index]}`;
  }
  if (index === 5) return `星期${WEEKDAYS[parseInt(value)] || value}`;
  if (index === 4) return `${MONTHS[parseInt(value)] || value}`;
  return `${value} ${FIELD_NAMES[index]}`;
}

function describeCron(expr: string): string {
  const parts = expr.trim().split(/\s+/);
  if (parts.length < 5 || parts.length > 6) return "格式错误：需要 5-6 个字段";
  const hasSec = parts.length === 6;
  const fields = hasSec ? parts : ["0", ...parts];

  const descriptions: string[] = [];
  fields.forEach((f, i) => {
    if (f !== "*" || i >= 3) {
      descriptions.push(describeField(f, i));
    }
  });
  return descriptions.join("，") || "每秒执行";
}

function getNextRuns(expr: string, count: number): string[] {
  const parts = expr.trim().split(/\s+/);
  if (parts.length < 5 || parts.length > 6) return [];

  const results: string[] = [];
  const now = new Date();
  const current = new Date(now.getTime());
  current.setMilliseconds(0);

  const hasSec = parts.length === 6;
  const fields = hasSec ? parts : ["0", ...parts];

  const matchField = (value: string, current: number, range: { min: number; max: number }): boolean => {
    if (value === "*") return true;
    if (value.includes("/")) {
      const [base, step] = value.split("/");
      const start = base === "*" ? range.min : parseInt(base);
      return (current - start) % parseInt(step) === 0 && current >= start;
    }
    if (value.includes(",")) return value.split(",").map(Number).includes(current);
    if (value.includes("-")) {
      const [start, end] = value.split("-").map(Number);
      return current >= start && current <= end;
    }
    return parseInt(value) === current;
  };

  for (let i = 0; i < 525600 && results.length < count; i++) {
    current.setMinutes(current.getMinutes() + 1);
    current.setSeconds(0);

    const matches =
      matchField(fields[0], current.getSeconds(), FIELD_RANGES[0]) &&
      matchField(fields[1], current.getMinutes(), FIELD_RANGES[1]) &&
      matchField(fields[2], current.getHours(), FIELD_RANGES[2]) &&
      matchField(fields[3], current.getDate(), FIELD_RANGES[3]) &&
      matchField(fields[4], current.getMonth() + 1, FIELD_RANGES[4]) &&
      matchField(fields[5], current.getDay(), FIELD_RANGES[5]);

    if (matches) {
      const pad = (n: number) => n.toString().padStart(2, "0");
      results.push(
        `${current.getFullYear()}-${pad(current.getMonth() + 1)}-${pad(current.getDate())} ${pad(current.getHours())}:${pad(current.getMinutes())}:${pad(current.getSeconds())} 星期${WEEKDAYS[current.getDay()]}`
      );
    }
  }
  return results;
}

const PRESETS = [
  { label: "每分钟", value: "* * * * *" },
  { label: "每小时", value: "0 * * * *" },
  { label: "每天零点", value: "0 0 * * *" },
  { label: "每天早上8点", value: "0 8 * * *" },
  { label: "每周一9点", value: "0 9 * * 1" },
  { label: "每月1号", value: "0 0 1 * *" },
  { label: "工作日9点", value: "0 9 * * 1-5" },
  { label: "每5分钟", value: "*/5 * * * *" },
  { label: "每30分钟", value: "*/30 * * * *" },
];

export default function CronParserPage() {
  const [cron, setCron] = useState("0 9 * * 1-5");
  const [copied, setCopied] = useState(false);

  const description = useMemo(() => describeCron(cron), [cron]);
  const nextRuns = useMemo(() => getNextRuns(cron, 10), [cron]);

  return (
    <ToolPageWrapper>
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Cron 表达式解析</h1>
        <p className="mt-2 text-[var(--muted)]">
          解析 Cron 表达式，查看中文说明和未来执行时间
        </p>
      </div>

      <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
        <label className="mb-2 block text-sm font-medium">Cron 表达式</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={cron}
            onChange={(e) => setCron(e.target.value)}
            placeholder="* * * * *"
            className="textarea-tool flex-1 rounded-lg px-4 py-3 font-mono text-lg"
            spellCheck={false}
          />
          <button
            onClick={() => { navigator.clipboard.writeText(cron); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
            className="shrink-0 rounded-lg border border-[var(--card-border)] px-4 py-2 text-sm font-medium hover:border-[var(--primary)]"
          >
            {copied ? "已复制 ✓" : "复制"}
          </button>
        </div>

        <div className="mt-3 flex gap-1 text-center font-mono text-xs text-[var(--muted)]">
          {(cron.trim().split(/\s+/).length === 6 ? FIELD_NAMES : FIELD_NAMES.slice(1)).map((name) => (
            <div key={name} className="flex-1 rounded bg-[var(--background)] px-1 py-1">{name}</div>
          ))}
        </div>

        <div className="mt-4 rounded-lg bg-[var(--background)] p-4">
          <p className="text-sm font-medium">中文说明</p>
          <p className="mt-1 text-[var(--primary)]">{description}</p>
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-2 block text-sm font-medium">常用预设</label>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.value}
              onClick={() => setCron(p.value)}
              className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-1.5 text-xs font-medium hover:border-[var(--primary)]"
            >
              {p.label} <span className="ml-1 font-mono text-[var(--muted)]">{p.value}</span>
            </button>
          ))}
        </div>
      </div>

      {nextRuns.length > 0 && (
        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium">未来 {nextRuns.length} 次执行时间</label>
          <div className="space-y-1">
            {nextRuns.map((run, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-2">
                <span className="text-xs text-[var(--muted)]">#{i + 1}</span>
                <span className="font-mono text-sm">{run}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
        <h2 className="mb-3 text-lg font-semibold">Cron 语法参考</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--card-border)] text-left text-[var(--muted)]">
                <th className="py-2 pr-4">字段</th>
                <th className="py-2 pr-4">范围</th>
                <th className="py-2">特殊字符</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {FIELD_NAMES.slice(1).map((name, i) => (
                <tr key={name} className="border-b border-[var(--card-border)]">
                  <td className="py-2 pr-4">{name}</td>
                  <td className="py-2 pr-4 text-[var(--muted)]">{FIELD_RANGES[i + 1].label}</td>
                  <td className="py-2 text-[var(--muted)]">* , - /</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ToolPageWrapper>
  );
}
