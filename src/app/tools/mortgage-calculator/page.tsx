"use client";

import { useState, useMemo, useCallback } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

interface ScheduleRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remaining: number;
}

function calcEqualPayment(P: number, r: number, n: number): ScheduleRow[] {
  const schedule: ScheduleRow[] = [];
  let remaining = P;
  const monthlyPayment = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);

  for (let m = 1; m <= n; m++) {
    const interest = remaining * r;
    const principal = monthlyPayment - interest;
    remaining = Math.max(0, remaining - principal);
    schedule.push({
      month: m,
      payment: monthlyPayment,
      principal,
      interest,
      remaining,
    });
  }
  return schedule;
}

function calcEqualPrincipal(P: number, r: number, n: number): ScheduleRow[] {
  const schedule: ScheduleRow[] = [];
  const monthlyPrincipal = P / n;
  let remaining = P;

  for (let m = 1; m <= n; m++) {
    const interest = remaining * r;
    const payment = monthlyPrincipal + interest;
    remaining = Math.max(0, remaining - monthlyPrincipal);
    schedule.push({
      month: m,
      payment,
      principal: monthlyPrincipal,
      interest,
      remaining,
    });
  }
  return schedule;
}

export default function MortgageCalculatorPage() {
  const [loanAmount, setLoanAmount] = useState(100);
  const [termYears, setTermYears] = useState(30);
  const [termMonths, setTermMonths] = useState(0);
  const [annualRate, setAnnualRate] = useState(3.1);
  const [useMonths, setUseMonths] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [prepayAmount, setPrepayAmount] = useState("");
  const [prepayMonth, setPrepayMonth] = useState("");

  const totalMonths = useMemo(() => {
    if (useMonths) return Math.max(1, Math.min(360, termMonths || 1));
    return Math.max(1, Math.min(30, termYears || 1)) * 12;
  }, [useMonths, termYears, termMonths]);

  const P = loanAmount * 10000;
  const r = annualRate / 100 / 12;

  const scheduleEqualPayment = useMemo(
    () => calcEqualPayment(P, r, totalMonths),
    [P, r, totalMonths]
  );
  const scheduleEqualPrincipal = useMemo(
    () => calcEqualPrincipal(P, r, totalMonths),
    [P, r, totalMonths]
  );

  const summaryEqualPayment = useMemo(() => {
    const total = scheduleEqualPayment.reduce((s, row) => s + row.payment, 0);
    const totalInterest = total - P;
    return {
      monthlyPayment: scheduleEqualPayment[0]?.payment ?? 0,
      totalPayment: total,
      totalInterest,
    };
  }, [scheduleEqualPayment, P]);

  const summaryEqualPrincipal = useMemo(() => {
    const total = scheduleEqualPrincipal.reduce((s, row) => s + row.payment, 0);
    const totalInterest = total - P;
    return {
      firstMonth: scheduleEqualPrincipal[0]?.payment ?? 0,
      lastMonth: scheduleEqualPrincipal[scheduleEqualPrincipal.length - 1]?.payment ?? 0,
      totalPayment: total,
      totalInterest,
    };
  }, [scheduleEqualPrincipal, P]);

  const displaySchedule = expanded ? scheduleEqualPayment : scheduleEqualPayment.slice(0, 12);

  const formatMoney = useCallback((v: number) => v.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }), []);

  const totalPrincipal = scheduleEqualPayment.reduce((s, r) => s + r.principal, 0);
  const totalInterestDisplay = scheduleEqualPayment.reduce((s, r) => s + r.interest, 0);
  const principalPct = totalPrincipal / (totalPrincipal + totalInterestDisplay) * 100;

  return (
    <ToolPageWrapper>
      <h1 className="page-title">房贷计算器</h1>
      <p className="page-subtitle">
        支持等额本息与等额本金两种还款方式，查看每月还款明细、总利息及提前还款影响
      </p>

      <div className="card mt-6 rounded-xl p-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-2 block text-sm font-medium">贷款金额（万元）</label>
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value) || 0)}
              min={1}
              max={10000}
              step={1}
              className="input w-full rounded-lg px-4 py-3"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">贷款期限</label>
            <div className="flex items-center gap-2">
              <label className="flex cursor-pointer items-center gap-1.5 text-sm">
                <input
                  type="radio"
                  checked={!useMonths}
                  onChange={() => setUseMonths(false)}
                  className="rounded-full"
                />
                年
              </label>
              <label className="flex cursor-pointer items-center gap-1.5 text-sm">
                <input
                  type="radio"
                  checked={useMonths}
                  onChange={() => setUseMonths(true)}
                  className="rounded-full"
                />
                月
              </label>
            </div>
            {useMonths ? (
              <input
                type="number"
                value={termMonths || ""}
                onChange={(e) => setTermMonths(Number(e.target.value) || 0)}
                placeholder="1-360"
                min={1}
                max={360}
                className="input mt-2 w-full rounded-lg px-4 py-3"
              />
            ) : (
              <input
                type="number"
                value={termYears || ""}
                onChange={(e) => setTermYears(Number(e.target.value) || 0)}
                placeholder="1-30"
                min={1}
                max={30}
                className="input mt-2 w-full rounded-lg px-4 py-3"
              />
            )}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">年利率（%）</label>
            <input
              type="number"
              value={annualRate}
              onChange={(e) => setAnnualRate(Number(e.target.value) || 0)}
              min={0.1}
              max={20}
              step={0.01}
              className="input w-full rounded-lg px-4 py-3"
            />
            <p className="mt-1 text-xs text-[var(--muted)]">2026 LPR 参考约 3.1%</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card rounded-xl p-6">
          <h2 className="mb-4 text-lg font-semibold">等额本息</h2>
          <p className="mb-4 text-sm text-[var(--muted)]">每月还款额固定，前期利息多、本金少</p>
          <div className="space-y-3">
            <div className="flex justify-between rounded-lg bg-[var(--background)] px-4 py-3">
              <span className="text-[var(--muted)]">月供</span>
              <span className="font-semibold">¥{formatMoney(summaryEqualPayment.monthlyPayment)}</span>
            </div>
            <div className="flex justify-between rounded-lg bg-[var(--background)] px-4 py-3">
              <span className="text-[var(--muted)]">还款总额</span>
              <span className="font-semibold">¥{formatMoney(summaryEqualPayment.totalPayment)}</span>
            </div>
            <div className="flex justify-between rounded-lg bg-[var(--background)] px-4 py-3">
              <span className="text-[var(--muted)]">利息总额</span>
              <span className="font-semibold text-amber-600">¥{formatMoney(summaryEqualPayment.totalInterest)}</span>
            </div>
          </div>
        </div>
        <div className="card rounded-xl p-6">
          <h2 className="mb-4 text-lg font-semibold">等额本金</h2>
          <p className="mb-4 text-sm text-[var(--muted)]">每月还本金固定，总还款额逐月递减</p>
          <div className="space-y-3">
            <div className="flex justify-between rounded-lg bg-[var(--background)] px-4 py-3">
              <span className="text-[var(--muted)]">首月还款</span>
              <span className="font-semibold">¥{formatMoney(summaryEqualPrincipal.firstMonth)}</span>
            </div>
            <div className="flex justify-between rounded-lg bg-[var(--background)] px-4 py-3">
              <span className="text-[var(--muted)]">末月还款</span>
              <span className="font-semibold">¥{formatMoney(summaryEqualPrincipal.lastMonth)}</span>
            </div>
            <div className="flex justify-between rounded-lg bg-[var(--background)] px-4 py-3">
              <span className="text-[var(--muted)]">还款总额</span>
              <span className="font-semibold">¥{formatMoney(summaryEqualPrincipal.totalPayment)}</span>
            </div>
            <div className="flex justify-between rounded-lg bg-[var(--background)] px-4 py-3">
              <span className="text-[var(--muted)]">利息总额</span>
              <span className="font-semibold text-amber-600">¥{formatMoney(summaryEqualPrincipal.totalInterest)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-6 rounded-xl p-6">
        <h2 className="mb-4 text-lg font-semibold">本息占比</h2>
        <div className="flex h-8 overflow-hidden rounded-lg">
          <div
            className="flex items-center justify-center bg-indigo-500 text-xs font-medium text-white"
            style={{ width: `${principalPct}%` }}
          >
            {principalPct >= 15 ? `本金 ${principalPct.toFixed(0)}%` : ""}
          </div>
          <div
            className="flex items-center justify-center bg-amber-500 text-xs font-medium text-white"
            style={{ width: `${100 - principalPct}%` }}
          >
            {(100 - principalPct) >= 15 ? `利息 ${(100 - principalPct).toFixed(0)}%` : ""}
          </div>
        </div>
        <div className="mt-2 flex justify-between text-xs text-[var(--muted)]">
          <span>本金 ¥{formatMoney(P)}</span>
          <span>利息 ¥{formatMoney(totalInterestDisplay)}</span>
        </div>
      </div>

      <div className="card mt-6 rounded-xl p-6">
        <h2 className="mb-4 text-lg font-semibold">还款明细</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--card-border)]">
                <th className="py-3 text-left font-medium">期数</th>
                <th className="py-3 text-right font-medium">月供</th>
                <th className="py-3 text-right font-medium">本金</th>
                <th className="py-3 text-right font-medium">利息</th>
                <th className="py-3 text-right font-medium">剩余本金</th>
              </tr>
            </thead>
            <tbody>
              {displaySchedule.map((row) => (
                <tr key={row.month} className="border-b border-[var(--card-border)] last:border-0">
                  <td className="py-2">{row.month} 期</td>
                  <td className="py-2 text-right">¥{formatMoney(row.payment)}</td>
                  <td className="py-2 text-right">¥{formatMoney(row.principal)}</td>
                  <td className="py-2 text-right text-amber-600">¥{formatMoney(row.interest)}</td>
                  <td className="py-2 text-right">¥{formatMoney(row.remaining)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {scheduleEqualPayment.length > 12 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="btn-primary mt-4 rounded-lg px-4 py-2 text-sm"
          >
            {expanded ? "收起" : `展开全部 ${totalMonths} 期`}
          </button>
        )}
      </div>

      <div className="card mt-6 rounded-xl p-6">
        <h2 className="mb-4 text-lg font-semibold">提前还款试算</h2>
        <p className="mb-4 text-sm text-[var(--muted)]">输入提前还款金额和期数，估算节省的利息（简化计算）</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">提前还款金额（元）</label>
            <input
              type="number"
              value={prepayAmount}
              onChange={(e) => setPrepayAmount(e.target.value)}
              placeholder="如 100000"
              className="input w-full rounded-lg px-4 py-3"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">还款期数（第几期）</label>
            <input
              type="number"
              value={prepayMonth}
              onChange={(e) => setPrepayMonth(e.target.value)}
              placeholder={`1-${totalMonths}`}
              min={1}
              max={totalMonths}
              className="input w-full rounded-lg px-4 py-3"
            />
          </div>
        </div>
        {prepayAmount && prepayMonth && Number(prepayAmount) > 0 && Number(prepayMonth) >= 1 && Number(prepayMonth) <= totalMonths && (
          <div className="mt-4 rounded-lg bg-[var(--background)] p-4">
            <p className="text-sm text-[var(--muted)]">
              在第 {prepayMonth} 期提前还款 ¥{Number(prepayAmount).toLocaleString()} 后，剩余本金将减少，
              后续利息会相应降低。具体节省金额需根据银行实际规则计算。
            </p>
          </div>
        )}
      </div>
    </ToolPageWrapper>
  );
}
