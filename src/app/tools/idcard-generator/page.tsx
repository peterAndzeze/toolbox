"use client";

import { useState, useCallback } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

const AREA_CODES = [
  { code: "110000", name: "北京市" },
  { code: "120000", name: "天津市" },
  { code: "310000", name: "上海市" },
  { code: "320100", name: "南京市" },
  { code: "320500", name: "苏州市" },
  { code: "330100", name: "杭州市" },
  { code: "370100", name: "济南市" },
  { code: "410100", name: "郑州市" },
  { code: "420100", name: "武汉市" },
  { code: "430100", name: "长沙市" },
  { code: "440100", name: "广州市" },
  { code: "440300", name: "深圳市" },
  { code: "500000", name: "重庆市" },
  { code: "510100", name: "成都市" },
  { code: "610100", name: "西安市" },
];

const WEIGHTS = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
const CHECK_CODES = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"];

function getCheckDigit(prefix17: string): string {
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    sum += parseInt(prefix17[i], 10) * WEIGHTS[i];
  }
  return CHECK_CODES[sum % 11];
}

function randomInt(min: number, max: number): number {
  const range = max - min + 1;
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return min + (array[0] % range);
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export default function IdCardGeneratorPage() {
  const currentYear = new Date().getFullYear();
  const [areaCode, setAreaCode] = useState(AREA_CODES[0].code);
  const [year, setYear] = useState(1990);
  const [month, setMonth] = useState(6);
  const [day, setDay] = useState(15);
  const [gender, setGender] = useState<"男" | "女" | "随机">("随机");
  const [count, setCount] = useState(5);
  const [ids, setIds] = useState<string[]>([]);
  const [copied, setCopied] = useState(-1);

  const maxDay = daysInMonth(year, month);
  const safeDay = Math.min(day, maxDay);

  const generate = useCallback(() => {
    const list: string[] = [];
    const used = new Set<string>();

    for (let i = 0; i < count; i++) {
      let id: string;
      let attempts = 0;
      do {
        const birthStr = `${year}${String(month).padStart(2, "0")}${String(safeDay).padStart(2, "0")}`;
        let seq: number;
        if (gender === "男") {
          seq = randomInt(0, 499) * 2 + 1;
        } else if (gender === "女") {
          seq = randomInt(1, 500) * 2;
        } else {
          seq = randomInt(1, 999);
        }
        const seqStr = String(seq).padStart(3, "0");
        const prefix17 = areaCode + birthStr + seqStr;
        const check = getCheckDigit(prefix17);
        id = prefix17 + check;
        attempts++;
      } while (used.has(id) && attempts < 100);
      used.add(id);
      list.push(id);
    }
    setIds(list);
  }, [areaCode, year, month, safeDay, gender, count]);

  const copyOne = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(-1), 1500);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(ids.join("\n"));
    setCopied(-2);
    setTimeout(() => setCopied(-1), 1500);
  };

  const years = Array.from({ length: 61 }, (_, i) => currentYear - 60 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: maxDay }, (_, i) => i + 1);

  return (
    <ToolPageWrapper>
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">身份证号生成器</h1>
        <p className="mt-2 text-[var(--muted)]">生成符合规则的测试用身份证号码，支持指定地区、出生日期和性别</p>
      </div>

      <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium">地区</label>
            <select
              value={areaCode}
              onChange={(e) => setAreaCode(e.target.value)}
              className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm"
            >
              {AREA_CODES.map((a) => (
                <option key={a.code} value={a.code}>{a.name} {a.code}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">出生日期</label>
            <div className="flex gap-2">
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="flex-1 rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-2 py-2 text-sm"
              >
                {years.map((y) => (
                  <option key={y} value={y}>{y}年</option>
                ))}
              </select>
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="flex-1 rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-2 py-2 text-sm"
              >
                {months.map((m) => (
                  <option key={m} value={m}>{m}月</option>
                ))}
              </select>
              <select
                value={safeDay}
                onChange={(e) => setDay(Number(e.target.value))}
                className="flex-1 rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-2 py-2 text-sm"
              >
                {days.map((d) => (
                  <option key={d} value={d}>{d}日</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">性别</label>
            <div className="flex gap-2">
              {(["男", "女", "随机"] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium ${gender === g ? "btn-primary" : "border border-[var(--card-border)]"}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">生成数量: {count}</label>
            <input
              type="range"
              min={1}
              max={50}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full accent-[var(--primary)]"
            />
          </div>
          <div className="flex items-end sm:col-span-2 lg:col-span-1">
            <button onClick={generate} className="btn-primary w-full rounded-lg py-2.5 text-sm font-medium">
              生成
            </button>
          </div>
        </div>
      </div>

      {ids.length > 0 && (
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">{ids.length} 个身份证号</span>
            <button
              onClick={copyAll}
              className="text-xs text-[var(--primary)] hover:underline"
            >
              {copied === -2 ? "已复制 ✓" : "复制全部"}
            </button>
          </div>
          <div className="space-y-1">
            {ids.map((id, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-2"
              >
                <span className="font-mono text-sm">{id}</span>
                <button
                  onClick={() => copyOne(id, i)}
                  className="ml-2 text-xs text-[var(--primary)] hover:underline"
                >
                  {copied === i ? "✓" : "复制"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="mt-8 text-center text-xs text-[var(--muted)]">
        仅供开发测试使用，请勿用于非法用途
      </p>
    </ToolPageWrapper>
  );
}
