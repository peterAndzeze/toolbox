"use client";

import { useState, useMemo } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";
import { getLunarDate, getSolarTermForDate, getYiJi, getChineseHoliday, getTerm, SOLAR_TERMS, GAN, ZHI, ZODIAC, type LunarDate } from "@/lib/lunar";

const WEEKDAYS = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

export default function CalendarPage() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth() + 1);
  const [selected, setSelected] = useState<{ year: number; month: number; day: number } | null>(null);

  const firstDay = new Date(viewYear, viewMonth - 1, 1);
  const lastDay = new Date(viewYear, viewMonth, 0);
  const startPad = (firstDay.getDay() + 6) % 7;
  const daysInMonth = lastDay.getDate();

  const calendarDays = useMemo(() => {
    const days: { date: number; isCurrent: boolean; isToday: boolean; isWeekend: boolean; isSelected: boolean }[] = [];
    for (let i = 0; i < startPad; i++) {
      days.push({ date: 0, isCurrent: false, isToday: false, isWeekend: false, isSelected: false });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dt = new Date(viewYear, viewMonth - 1, d);
      const w = dt.getDay();
      days.push({
        date: d,
        isCurrent: true,
        isToday: viewYear === today.getFullYear() && viewMonth === today.getMonth() + 1 && d === today.getDate(),
        isWeekend: w === 0 || w === 6,
        isSelected: selected !== null && selected.year === viewYear && selected.month === viewMonth && selected.day === d,
      });
    }
    return days;
  }, [viewYear, viewMonth, daysInMonth, startPad, selected, today]);

  const yearGanZhi = useMemo(() => {
    const y = viewYear;
    const ganKey = (y - 3) % 10;
    const zhiKey = (y - 3) % 12;
    return GAN[(ganKey === 0 ? 10 : ganKey) - 1] + ZHI[(zhiKey === 0 ? 12 : zhiKey) - 1];
  }, [viewYear]);

  const yearZodiac = useMemo(() => ZODIAC[(viewYear - 4) % 12], [viewYear]);

  const solarTermsInMonth = useMemo(() => {
    const t1 = getTerm(viewYear, viewMonth * 2 - 1);
    const t2 = getTerm(viewYear, viewMonth * 2);
    return [
      { day: t1, name: SOLAR_TERMS[viewMonth * 2 - 2] },
      { day: t2, name: SOLAR_TERMS[viewMonth * 2 - 1] },
    ];
  }, [viewYear, viewMonth]);

  const detail = useMemo(() => {
    if (!selected) return null;
    const lunar = getLunarDate(selected.year, selected.month, selected.day);
    const dt = new Date(selected.year, selected.month - 1, selected.day);
    const { yi, ji } = getYiJi(selected.year, selected.month, selected.day);
    const holiday = getChineseHoliday(selected.year, selected.month, selected.day);
    const solarTerm = getSolarTermForDate(selected.year, selected.month, selected.day);
    return {
      solar: `${selected.year}年${selected.month}月${selected.day}日`,
      lunar: lunar ? `${lunar.monthName}${lunar.dayName}` : "-",
      weekday: WEEKDAYS[dt.getDay()],
      zodiac: lunar?.animal ?? "-",
      ganZhi: lunar?.ganZhiYear ?? "-",
      solarTerm: solarTerm ?? (lunar?.solarTerm ?? null),
      holiday,
      yi,
      ji,
    };
  }, [selected]);

  return (
    <ToolPageWrapper>
      <h1 className="page-title">万年历 / 黄历</h1>
      <p className="page-subtitle">公历农历对照，二十四节气，老黄历宜忌查询</p>

      <div className="card mt-6 rounded-xl p-4 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (viewMonth === 1) {
                  setViewYear((y) => y - 1);
                  setViewMonth(12);
                } else setViewMonth((m) => m - 1);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] transition-colors hover:border-[var(--primary)]"
            >
              ‹
            </button>
            <span className="min-w-[140px] text-center font-semibold">
              {viewYear}年{viewMonth}月
            </span>
            <button
              onClick={() => {
                if (viewMonth === 12) {
                  setViewYear((y) => y + 1);
                  setViewMonth(1);
                } else setViewMonth((m) => m + 1);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] transition-colors hover:border-[var(--primary)]"
            >
              ›
            </button>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={viewYear}
              onChange={(e) => setViewYear(parseInt(e.target.value, 10))}
              className="input rounded-lg px-3 py-2 text-sm"
            >
              {Array.from({ length: 201 }, (_, i) => 1900 + i).map((y) => (
                <option key={y} value={y}>{y}年</option>
              ))}
            </select>
            <select
              value={viewMonth}
              onChange={(e) => setViewMonth(parseInt(e.target.value, 10))}
              className="input rounded-lg px-3 py-2 text-sm"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>{m}月</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-2 flex items-center gap-4 text-sm text-[var(--muted)]">
          <span>{yearGanZhi}年</span>
          <span>生肖：{yearZodiac}</span>
          <span>
            节气：{solarTermsInMonth[0].name}({solarTermsInMonth[0].day}日) / {solarTermsInMonth[1].name}({solarTermsInMonth[1].day}日)
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-sm">
          {["一", "二", "三", "四", "五", "六", "日"].map((d) => (
            <div key={d} className="py-2 font-medium text-[var(--muted)]">
              {d}
            </div>
          ))}
          {calendarDays.map((cell, idx) => {
            const lunar = cell.date && cell.isCurrent ? getLunarDate(viewYear, viewMonth, cell.date) : null;
            const solarTerm = cell.date && cell.isCurrent ? getSolarTermForDate(viewYear, viewMonth, cell.date) : null;
            const holiday = cell.date && cell.isCurrent ? getChineseHoliday(viewYear, viewMonth, cell.date) : null;
            return (
              <button
                key={idx}
                onClick={() => cell.isCurrent && setSelected({ year: viewYear, month: viewMonth, day: cell.date })}
                className={`min-h-[72px] rounded-lg border p-1.5 text-left transition-colors ${
                  !cell.isCurrent
                    ? "border-transparent bg-transparent text-[var(--muted)] opacity-50"
                    : cell.isSelected
                      ? "border-[var(--primary)] bg-[var(--primary)]/10"
                      : cell.isToday
                        ? "border-[var(--primary)] bg-[var(--primary)]/5"
                        : "border-transparent hover:bg-[var(--card-border)]/50"
                }`}
              >
                {cell.date > 0 && (
                  <>
                    <div className={`text-base font-medium ${cell.isWeekend && !cell.isToday && !cell.isSelected ? "text-[var(--muted)]" : ""}`}>
                      {cell.date}
                    </div>
                    <div className="mt-0.5 truncate text-[10px] text-[var(--muted)]">
                      {lunar?.dayName}
                    </div>
                    {(solarTerm || holiday) && (
                      <div className="mt-0.5 truncate text-[10px] text-amber-600 dark:text-amber-400">
                        {solarTerm || holiday}
                      </div>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {detail && (
        <div className="card mt-6 rounded-xl p-6">
          <h2 className="mb-4 text-lg font-semibold">日期详情</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <p><span className="text-[var(--muted)]">公历：</span>{detail.solar}</p>
              <p><span className="text-[var(--muted)]">农历：</span>{detail.lunar}</p>
              <p><span className="text-[var(--muted)]">星期：</span>{detail.weekday}</p>
              <p><span className="text-[var(--muted)]">生肖：</span>{detail.zodiac}</p>
              <p><span className="text-[var(--muted)]">干支：</span>{detail.ganZhi}</p>
              {detail.solarTerm && <p><span className="text-[var(--muted)]">节气：</span>{detail.solarTerm}</p>}
              {detail.holiday && <p><span className="text-[var(--muted)]">节日：</span><span className="text-amber-600 dark:text-amber-400">{detail.holiday}</span></p>}
            </div>
            <div className="space-y-2">
              <p><span className="text-[var(--muted)]">宜：</span><span className="text-green-600 dark:text-green-400">{detail.yi.join("、")}</span></p>
              <p><span className="text-[var(--muted)]">忌：</span><span className="text-red-600 dark:text-red-400">{detail.ji.join("、")}</span></p>
            </div>
          </div>
        </div>
      )}
    </ToolPageWrapper>
  );
}
