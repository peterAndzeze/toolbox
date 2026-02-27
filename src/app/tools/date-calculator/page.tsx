"use client";

import { useState, useCallback } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

const ZODIAC = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];

const CONSTELLATIONS: { name: string; start: [number, number]; end: [number, number] }[] = [
  { name: "摩羯座", start: [12, 22], end: [1, 19] },
  { name: "水瓶座", start: [1, 20], end: [2, 18] },
  { name: "双鱼座", start: [2, 19], end: [3, 20] },
  { name: "白羊座", start: [3, 21], end: [4, 19] },
  { name: "金牛座", start: [4, 20], end: [5, 20] },
  { name: "双子座", start: [5, 21], end: [6, 21] },
  { name: "巨蟹座", start: [6, 22], end: [7, 22] },
  { name: "狮子座", start: [7, 23], end: [8, 22] },
  { name: "处女座", start: [8, 23], end: [9, 22] },
  { name: "天秤座", start: [9, 23], end: [10, 23] },
  { name: "天蝎座", start: [10, 24], end: [11, 22] },
  { name: "射手座", start: [11, 23], end: [12, 21] },
];

const WEEKDAYS = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

function formatDate(d: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function getZodiac(year: number): string {
  return ZODIAC[(year - 4) % 12];
}

function getConstellation(month: number, day: number): string {
  for (const c of CONSTELLATIONS) {
    const [sm, sd] = c.start;
    const [em, ed] = c.end;
    if (sm > em) {
      if ((month === sm && day >= sd) || (month === em && day <= ed)) return c.name;
    } else {
      if ((month > sm || (month === sm && day >= sd)) && (month < em || (month === em && day <= ed))) return c.name;
    }
  }
  return "摩羯座";
}

function parseDate(s: string): Date | null {
  const d = new Date(s + "T12:00:00");
  return isNaN(d.getTime()) ? null : d;
}

type Mode = "age" | "diff" | "add";

export default function DateCalculatorPage() {
  const [mode, setMode] = useState<Mode>("age");
  const [birthDate, setBirthDate] = useState("");
  const [calcFromDate, setCalcFromDate] = useState(formatDate(new Date()));
  const [useCustomFrom, setUseCustomFrom] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [baseDate, setBaseDate] = useState(formatDate(new Date()));
  const [addValue, setAddValue] = useState(0);
  const [addUnit, setAddUnit] = useState<"days" | "weeks" | "months" | "years">("days");
  const [addOp, setAddOp] = useState<"add" | "subtract">("add");

  const todayStr = formatDate(new Date());

  const computeAge = useCallback(() => {
    const birth = parseDate(birthDate);
    const from = parseDate(useCustomFrom ? calcFromDate : todayStr);
    if (!birth || !from || birth > from) return null;

    let years = from.getFullYear() - birth.getFullYear();
    let months = from.getMonth() - birth.getMonth();
    let days = from.getDate() - birth.getDate();
    if (days < 0) {
      months--;
      const prevMonth = new Date(from.getFullYear(), from.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const totalMs = from.getTime() - birth.getTime();
    const totalDays = Math.floor(totalMs / (24 * 60 * 60 * 1000));
    const totalWeeks = Math.floor(totalDays / 7);
    const weekDays = totalDays % 7;
    const totalMonths = years * 12 + months;
    const totalHours = Math.floor(totalMs / (60 * 60 * 1000));

    const nextBday = new Date(from.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday <= from) nextBday.setFullYear(nextBday.getFullYear() + 1);
    const daysToNext = Math.ceil((nextBday.getTime() - from.getTime()) / (24 * 60 * 60 * 1000));
    const nextWeekday = WEEKDAYS[nextBday.getDay()];

    const weekends = Math.floor(totalDays / 7) * 2;
    const extra = totalDays % 7;
    const extraWeekends = extra >= 6 ? 1 : extra >= 1 ? 1 : 0;
    const totalWeekends = weekends + extraWeekends;

    const avgBpm = 72;
    const heartbeats = Math.floor((totalMs / 1000 / 60) * avgBpm);

    return {
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      weekDays,
      totalMonths,
      totalHours,
      daysToNext,
      nextWeekday,
      zodiac: getZodiac(birth.getFullYear()),
      constellation: getConstellation(birth.getMonth() + 1, birth.getDate()),
      totalWeekends,
      heartbeats,
    };
  }, [birthDate, calcFromDate, useCustomFrom, todayStr]);

  const computeDiff = useCallback(() => {
    const start = parseDate(startDate);
    const end = parseDate(endDate);
    if (!start || !end) return null;
    const [from, to] = start <= end ? [start, end] : [end, start];

    let years = to.getFullYear() - from.getFullYear();
    let months = to.getMonth() - from.getMonth();
    let days = to.getDate() - from.getDate();
    if (days < 0) {
      months--;
      const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const totalMs = to.getTime() - from.getTime();
    const totalDays = Math.floor(totalMs / (24 * 60 * 60 * 1000));
    const totalWeeks = Math.floor(totalDays / 7);
    const weekDays = totalDays % 7;

    let workdays = 0;
    let d = new Date(from);
    while (d <= to) {
      const w = d.getDay();
      if (w !== 0 && w !== 6) workdays++;
      d.setDate(d.getDate() + 1);
    }

    const totalMinutes = Math.floor(totalMs / (60 * 1000));
    const totalSeconds = Math.floor(totalMs / 1000);

    return {
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      weekDays,
      workdays,
      totalHours: Math.floor(totalMs / (60 * 60 * 1000)),
      totalMinutes,
      totalSeconds,
    };
  }, [startDate, endDate]);

  const computeAdd = useCallback(() => {
    const base = parseDate(baseDate);
    if (!base) return null;

    const result = new Date(base);
    const mult = addOp === "add" ? 1 : -1;
    const n = addValue * mult;

    switch (addUnit) {
      case "days":
        result.setDate(result.getDate() + n);
        break;
      case "weeks":
        result.setDate(result.getDate() + n * 7);
        break;
      case "months":
        result.setMonth(result.getMonth() + n);
        break;
      case "years":
        result.setFullYear(result.getFullYear() + n);
        break;
    }

    return {
      date: result,
      weekday: WEEKDAYS[result.getDay()],
    };
  }, [baseDate, addValue, addUnit, addOp]);

  const ageResult = mode === "age" && birthDate ? computeAge() : null;
  const diffResult = mode === "diff" && startDate && endDate ? computeDiff() : null;
  const addResult = mode === "add" && baseDate ? computeAdd() : null;

  return (
    <ToolPageWrapper>
      <h1 className="page-title">年龄/日期计算器</h1>
      <p className="page-subtitle">精确计算年龄、日期间隔与日期推算，支持生肖、星座</p>

      <div className="mb-6 flex flex-wrap gap-2">
        {(["age", "diff", "add"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`category-tab ${mode === m ? "active" : ""}`}
          >
            {m === "age" && "年龄计算"}
            {m === "diff" && "日期间隔计算"}
            {m === "add" && "日期推算"}
          </button>
        ))}
      </div>

      {/* Mode A: 年龄计算 */}
      {mode === "age" && (
        <div className="space-y-6">
          <div className="card rounded-xl p-6">
            <h2 className="mb-4 text-lg font-semibold">输入</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">出生日期</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="input w-full rounded-lg px-3 py-2.5"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">计算基准</label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={!useCustomFrom}
                      onChange={() => setUseCustomFrom(false)}
                    />
                    今天
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={useCustomFrom}
                      onChange={() => setUseCustomFrom(true)}
                    />
                    自定义
                  </label>
                </div>
                {useCustomFrom && (
                  <input
                    type="date"
                    value={calcFromDate}
                    onChange={(e) => setCalcFromDate(e.target.value)}
                    className="input mt-2 w-full rounded-lg px-3 py-2.5"
                  />
                )}
              </div>
            </div>
          </div>

          {ageResult && (
            <div className="card rounded-xl p-6">
              <h2 className="mb-4 text-lg font-semibold">计算结果</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-lg bg-[var(--background)] p-3">
                  <p className="text-xs text-[var(--muted)]">精确年龄</p>
                  <p className="font-semibold">{ageResult.years}岁{ageResult.months}月{ageResult.days}天</p>
                </div>
                <div className="rounded-lg bg-[var(--background)] p-3">
                  <p className="text-xs text-[var(--muted)]">总天数</p>
                  <p className="font-semibold">{ageResult.totalDays} 天</p>
                </div>
                <div className="rounded-lg bg-[var(--background)] p-3">
                  <p className="text-xs text-[var(--muted)]">总周数</p>
                  <p className="font-semibold">{ageResult.totalWeeks} 周 {ageResult.weekDays} 天</p>
                </div>
                <div className="rounded-lg bg-[var(--background)] p-3">
                  <p className="text-xs text-[var(--muted)]">总月数</p>
                  <p className="font-semibold">{ageResult.totalMonths} 个月</p>
                </div>
                <div className="rounded-lg bg-[var(--background)] p-3">
                  <p className="text-xs text-[var(--muted)]">总小时数</p>
                  <p className="font-semibold">{ageResult.totalHours.toLocaleString()} 小时</p>
                </div>
                <div className="rounded-lg bg-[var(--background)] p-3">
                  <p className="text-xs text-[var(--muted)]">下次生日</p>
                  <p className="font-semibold">{ageResult.daysToNext} 天后（{ageResult.nextWeekday}）</p>
                </div>
                <div className="rounded-lg bg-[var(--background)] p-3">
                  <p className="text-xs text-[var(--muted)]">生肖</p>
                  <p className="font-semibold">{ageResult.zodiac}</p>
                </div>
                <div className="rounded-lg bg-[var(--background)] p-3">
                  <p className="text-xs text-[var(--muted)]">星座</p>
                  <p className="font-semibold">{ageResult.constellation}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-4 rounded-lg bg-[var(--background)] p-4">
                <p className="text-sm text-[var(--muted)]">
                  已经度过了 <span className="font-medium text-[var(--foreground)]">{ageResult.totalWeekends}</span> 个周末
                </p>
                <p className="text-sm text-[var(--muted)]">
                  心跳大约 <span className="font-medium text-[var(--foreground)]">{ageResult.heartbeats.toLocaleString()}</span> 次
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mode B: 日期间隔 */}
      {mode === "diff" && (
        <div className="space-y-6">
          <div className="card rounded-xl p-6">
            <h2 className="mb-4 text-lg font-semibold">输入</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">开始日期</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="input w-full rounded-lg px-3 py-2.5"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">结束日期</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="input w-full rounded-lg px-3 py-2.5"
                />
              </div>
            </div>
          </div>

          {diffResult && (
            <div className="card rounded-xl p-6">
              <h2 className="mb-4 text-lg font-semibold">计算结果</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-lg bg-[var(--background)] p-3">
                  <p className="text-xs text-[var(--muted)]">相差</p>
                  <p className="font-semibold">{diffResult.years}年{diffResult.months}月{diffResult.days}天</p>
                </div>
                <div className="rounded-lg bg-[var(--background)] p-3">
                  <p className="text-xs text-[var(--muted)]">总天数</p>
                  <p className="font-semibold">{diffResult.totalDays} 天</p>
                </div>
                <div className="rounded-lg bg-[var(--background)] p-3">
                  <p className="text-xs text-[var(--muted)]">总周数</p>
                  <p className="font-semibold">{diffResult.totalWeeks} 周 {diffResult.weekDays} 天</p>
                </div>
                <div className="rounded-lg bg-[var(--background)] p-3">
                  <p className="text-xs text-[var(--muted)]">工作日（排除周末）</p>
                  <p className="font-semibold">{diffResult.workdays} 天</p>
                </div>
                <div className="rounded-lg bg-[var(--background)] p-3">
                  <p className="text-xs text-[var(--muted)]">总小时</p>
                  <p className="font-semibold">{diffResult.totalHours.toLocaleString()} 小时</p>
                </div>
                <div className="rounded-lg bg-[var(--background)] p-3">
                  <p className="text-xs text-[var(--muted)]">总分钟</p>
                  <p className="font-semibold">{diffResult.totalMinutes.toLocaleString()} 分钟</p>
                </div>
                <div className="rounded-lg bg-[var(--background)] p-3 sm:col-span-2 lg:col-span-3">
                  <p className="text-xs text-[var(--muted)]">总秒数</p>
                  <p className="font-semibold">{diffResult.totalSeconds.toLocaleString()} 秒</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mode C: 日期推算 */}
      {mode === "add" && (
        <div className="space-y-6">
          <div className="card rounded-xl p-6">
            <h2 className="mb-4 text-lg font-semibold">输入</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-2 block text-sm font-medium">基准日期</label>
                <input
                  type="date"
                  value={baseDate}
                  onChange={(e) => setBaseDate(e.target.value)}
                  className="input w-full rounded-lg px-3 py-2.5"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">操作</label>
                <select
                  value={addOp}
                  onChange={(e) => setAddOp(e.target.value as "add" | "subtract")}
                  className="input w-full rounded-lg px-3 py-2.5"
                >
                  <option value="add">加上</option>
                  <option value="subtract">减去</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">数值</label>
                <input
                  type="number"
                  min={0}
                  value={addValue}
                  onChange={(e) => setAddValue(Math.max(0, parseInt(e.target.value) || 0))}
                  className="input w-full rounded-lg px-3 py-2.5"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">单位</label>
                <select
                  value={addUnit}
                  onChange={(e) => setAddUnit(e.target.value as typeof addUnit)}
                  className="input w-full rounded-lg px-3 py-2.5"
                >
                  <option value="days">天</option>
                  <option value="weeks">周</option>
                  <option value="months">月</option>
                  <option value="years">年</option>
                </select>
              </div>
            </div>
          </div>

          {addResult && (
            <div className="card rounded-xl p-6">
              <h2 className="mb-4 text-lg font-semibold">推算结果</h2>
              <div className="rounded-lg bg-[var(--background)] p-4">
                <p className="text-sm text-[var(--muted)]">结果日期</p>
                <p className="mt-1 text-xl font-semibold">
                  {formatDate(addResult.date)}（{addResult.weekday}）
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </ToolPageWrapper>
  );
}
