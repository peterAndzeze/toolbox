"use client";

import { useState, useMemo, useCallback } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

const TAX_BRACKETS = [
  { min: 0, max: 3000, rate: 0.03, deduction: 0 },
  { min: 3000, max: 12000, rate: 0.1, deduction: 210 },
  { min: 12000, max: 25000, rate: 0.2, deduction: 1410 },
  { min: 25000, max: 35000, rate: 0.25, deduction: 2660 },
  { min: 35000, max: 55000, rate: 0.3, deduction: 4410 },
  { min: 55000, max: 80000, rate: 0.35, deduction: 7160 },
  { min: 80000, max: Infinity, rate: 0.45, deduction: 15160 },
];

const DEDUCTION_QUICK = [
  { label: "子女教育", amount: 2000 },
  { label: "继续教育", amount: 400 },
  { label: "住房贷款", amount: 1000 },
  { label: "住房租金", amount: 1500 },
  { label: "赡养老人", amount: 3000 },
];

const THRESHOLD = 5000;

export default function TaxCalculatorPage() {
  const [salary, setSalary] = useState(15000);
  const [socialMode, setSocialMode] = useState<"total" | "ratio">("ratio");
  const [socialTotal, setSocialTotal] = useState("");
  const [pension, setPension] = useState(8);
  const [medical, setMedical] = useState(2);
  const [unemployment, setUnemployment] = useState(0.5);
  const [housing, setHousing] = useState(12);
  const [specialDeduction, setSpecialDeduction] = useState(0);

  const socialInsurance = useMemo(() => {
    if (socialMode === "total" && socialTotal) return Number(socialTotal);
    const ratio = (pension + medical + unemployment + housing) / 100;
    return salary * ratio;
  }, [socialMode, socialTotal, salary, pension, medical, unemployment, housing]);

  const taxableIncome = useMemo(() => {
    const afterSocial = salary - socialInsurance;
    const afterThreshold = afterSocial - THRESHOLD;
    const afterSpecial = afterThreshold - specialDeduction;
    return Math.max(0, afterSpecial);
  }, [salary, socialInsurance, specialDeduction]);

  const { tax, bracket } = useMemo(() => {
    const b = TAX_BRACKETS.find((x) => taxableIncome >= x.min && taxableIncome < x.max) ?? TAX_BRACKETS[TAX_BRACKETS.length - 1];
    const taxAmount = taxableIncome * b.rate - b.deduction;
    return { tax: Math.max(0, taxAmount), bracket: b };
  }, [taxableIncome]);

  const afterTax = salary - socialInsurance - tax;

  const formatMoney = useCallback((v: number) => v.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }), []);

  const bracketProgress = (taxableIncome - bracket.min) / (bracket.max === Infinity ? 80000 : bracket.max - bracket.min);
  const bracketIndex = TAX_BRACKETS.findIndex((x) => x === bracket);

  return (
    <ToolPageWrapper>
      <h1 className="page-title">个税计算器</h1>
      <p className="page-subtitle">
        2026 年个人所得税计算，支持五险一金和专项附加扣除，快速计算税后工资
      </p>

      <div className="card mt-6 rounded-xl p-6">
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">税前月薪（元）</label>
          <input
            type="number"
            value={salary}
            onChange={(e) => setSalary(Number(e.target.value) || 0)}
            min={0}
            className="input w-full rounded-lg px-4 py-3 text-lg"
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">五险一金</label>
          <div className="flex gap-4">
            <label className="flex cursor-pointer items-center gap-1.5 text-sm">
              <input
                type="radio"
                checked={socialMode === "ratio"}
                onChange={() => setSocialMode("ratio")}
              />
              按比例计算
            </label>
            <label className="flex cursor-pointer items-center gap-1.5 text-sm">
              <input
                type="radio"
                checked={socialMode === "total"}
                onChange={() => setSocialMode("total")}
              />
              直接输入总额
            </label>
          </div>
          {socialMode === "ratio" ? (
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div>
                <label className="mb-1 block text-xs text-[var(--muted)]">养老保险 %</label>
                <input
                  type="number"
                  value={pension}
                  onChange={(e) => setPension(Number(e.target.value) || 0)}
                  min={0}
                  max={100}
                  step={0.5}
                  className="input w-full rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-[var(--muted)]">医疗保险 %</label>
                <input
                  type="number"
                  value={medical}
                  onChange={(e) => setMedical(Number(e.target.value) || 0)}
                  min={0}
                  max={100}
                  step={0.5}
                  className="input w-full rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-[var(--muted)]">失业保险 %</label>
                <input
                  type="number"
                  value={unemployment}
                  onChange={(e) => setUnemployment(Number(e.target.value) || 0)}
                  min={0}
                  max={100}
                  step={0.5}
                  className="input w-full rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-[var(--muted)]">住房公积金 %</label>
                <input
                  type="number"
                  value={housing}
                  onChange={(e) => setHousing(Number(e.target.value) || 0)}
                  min={0}
                  max={100}
                  step={0.5}
                  className="input w-full rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>
          ) : (
            <div className="mt-3">
              <input
                type="number"
                value={socialTotal}
                onChange={(e) => setSocialTotal(e.target.value)}
                placeholder="五险一金总额"
                min={0}
                className="input w-full rounded-lg px-4 py-3"
              />
            </div>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">专项附加扣除（元/月）</label>
          <input
            type="number"
            value={specialDeduction || ""}
            onChange={(e) => setSpecialDeduction(Number(e.target.value) || 0)}
            placeholder="0"
            min={0}
            className="input mb-3 w-full rounded-lg px-4 py-3"
          />
          <div className="flex flex-wrap gap-2">
            {DEDUCTION_QUICK.map((x) => (
              <button
                key={x.label}
                onClick={() => setSpecialDeduction((prev) => (prev === x.amount ? 0 : x.amount))}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${specialDeduction === x.amount ? "btn-primary" : "border border-[var(--card-border)] bg-[var(--background)] hover:border-[var(--primary)]"}`}
              >
                {x.label} ¥{x.amount}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card rounded-xl p-4">
          <p className="mb-1 text-xs text-[var(--muted)]">应纳税所得额</p>
          <p className="text-lg font-semibold">¥{formatMoney(taxableIncome)}</p>
        </div>
        <div className="card rounded-xl p-4">
          <p className="mb-1 text-xs text-[var(--muted)]">个人所得税</p>
          <p className="text-lg font-semibold text-amber-600">¥{formatMoney(tax)}</p>
        </div>
        <div className="card rounded-xl p-4">
          <p className="mb-1 text-xs text-[var(--muted)]">税后月薪</p>
          <p className="text-lg font-semibold text-green-600">¥{formatMoney(afterTax)}</p>
        </div>
        <div className="card rounded-xl p-4">
          <p className="mb-1 text-xs text-[var(--muted)]">五险一金</p>
          <p className="text-lg font-semibold">¥{formatMoney(socialInsurance)}</p>
        </div>
      </div>

      <div className="card mt-6 rounded-xl p-6">
        <h2 className="mb-4 text-lg font-semibold">年度汇总</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-[var(--background)] p-4">
            <p className="text-xs text-[var(--muted)]">年度税前收入</p>
            <p className="mt-1 font-semibold">¥{formatMoney(salary * 12)}</p>
          </div>
          <div className="rounded-lg bg-[var(--background)] p-4">
            <p className="text-xs text-[var(--muted)]">年度个税</p>
            <p className="mt-1 font-semibold text-amber-600">¥{formatMoney(tax * 12)}</p>
          </div>
          <div className="rounded-lg bg-[var(--background)] p-4">
            <p className="text-xs text-[var(--muted)]">年度税后收入</p>
            <p className="mt-1 font-semibold text-green-600">¥{formatMoney(afterTax * 12)}</p>
          </div>
        </div>
      </div>

      <div className="card mt-6 rounded-xl p-6">
        <h2 className="mb-4 text-lg font-semibold">适用税率</h2>
        <p className="mb-3 text-sm text-[var(--muted)]">
          当前税率：¥{bracket.min.toLocaleString()} - ¥{bracket.max === Infinity ? "∞" : bracket.max.toLocaleString()}，税率 {bracket.rate * 100}%
        </p>
        <div className="grid grid-cols-7 gap-1 sm:grid-cols-7">
          {TAX_BRACKETS.map((b, i) => (
            <div
              key={i}
              className={`h-2 rounded ${i === bracketIndex ? "bg-[var(--primary)]" : "bg-[var(--card-border)]"}`}
              style={{
                width: b.max === Infinity ? "auto" : "100%",
                flex: b.max === Infinity ? 1 : undefined,
              }}
              title={`${b.min}-${b.max === Infinity ? "∞" : b.max}，${b.rate * 100}%`}
            />
          ))}
        </div>
        <div className="mt-2 flex justify-between text-xs text-[var(--muted)]">
          <span>0</span>
          <span>3千</span>
          <span>1.2万</span>
          <span>2.5万</span>
          <span>3.5万</span>
          <span>5.5万</span>
          <span>8万+</span>
        </div>
      </div>
    </ToolPageWrapper>
  );
}
