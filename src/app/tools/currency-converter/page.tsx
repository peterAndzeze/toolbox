"use client";

import { useState, useEffect, useMemo } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

// Hardcoded rates: CNY per 1 unit of currency (e.g. 1 USD ≈ 7.25 CNY)
const FALLBACK_RATES: Record<string, number> = {
  CNY: 1,
  USD: 7.25,
  EUR: 7.85,
  JPY: 0.0485,
  GBP: 9.18,
  KRW: 0.00528,
  HKD: 0.929,
  AUD: 4.72,
  CAD: 5.28,
  SGD: 5.38,
  THB: 0.2,
  MYR: 1.63,
  CHF: 8.12,
  NZD: 4.32,
  RUB: 0.0785,
};

const CURRENCY_LABELS: Record<string, string> = {
  CNY: "人民币",
  USD: "美元",
  EUR: "欧元",
  JPY: "日元",
  GBP: "英镑",
  KRW: "韩元",
  HKD: "港币",
  AUD: "澳元",
  CAD: "加元",
  SGD: "新加坡元",
  THB: "泰铢",
  MYR: "马来西亚林吉特",
  CHF: "瑞士法郎",
  NZD: "新西兰元",
  RUB: "俄罗斯卢布",
};

const COMMON_CURRENCIES = ["USD", "EUR", "JPY", "GBP", "HKD"];

function convert(amount: number, from: string, to: string, rates: Record<string, number>): number {
  const rFrom = rates[from] ?? 1;
  const rTo = rates[to] ?? 1;
  if (rFrom === 0) return 0;
  return (amount * rFrom) / rTo;
}

export default function CurrencyConverterPage() {
  const [amount, setAmount] = useState<string>("100");
  const [fromCurrency, setFromCurrency] = useState<string>("CNY");
  const [toCurrency, setToCurrency] = useState<string>("USD");
  const [rates, setRates] = useState<Record<string, number>>(FALLBACK_RATES);
  const [isLiveRates, setIsLiveRates] = useState(false);

  useEffect(() => {
    fetch("https://api.exchangerate-api.com/v4/latest/CNY")
      .then((res) => res.json())
      .then((data: { base: string; rates: Record<string, number> }) => {
        if (data?.rates) {
          // API returns rates as "units per 1 CNY" (e.g. 1 CNY = 0.146 USD)
          // We need "CNY per 1 unit" (e.g. 1 USD = 1/0.146 CNY)
          const cnyPerUnit: Record<string, number> = { ...FALLBACK_RATES };
          for (const [code, val] of Object.entries(data.rates)) {
            if (val !== 0) cnyPerUnit[code] = 1 / val;
          }
          setRates(cnyPerUnit);
          setIsLiveRates(true);
        }
      })
      .catch(() => {
        setRates(FALLBACK_RATES);
        setIsLiveRates(false);
      });
  }, []);

  const amountNum = useMemo(() => parseFloat(amount) || 0, [amount]);
  const converted = useMemo(
    () => convert(amountNum, fromCurrency, toCurrency, rates),
    [amountNum, fromCurrency, toCurrency, rates]
  );

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const commonConversions = useMemo(() => {
    return COMMON_CURRENCIES.map((code) => ({
      code,
      label: CURRENCY_LABELS[code] ?? code,
      value: convert(1, code, "CNY", rates),
    }));
  }, [rates]);

  const currencies = Object.keys(FALLBACK_RATES);

  return (
    <ToolPageWrapper>
      <h1 className="page-title">汇率换算</h1>
      <p className="page-subtitle">
        实时汇率查询与转换，支持人民币、美元、欧元、日元等主流货币
      </p>

      <div className="card mt-6 rounded-xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm text-[var(--muted)]">
            {isLiveRates ? "实时汇率" : "参考汇率"}
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">金额</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min={0}
              step="any"
              placeholder="输入金额"
              className="input w-full rounded-lg px-4 py-3 text-lg"
            />
          </div>

          <div className="flex flex-wrap items-end gap-4">
            <div className="min-w-0 flex-1">
              <label className="mb-2 block text-sm font-medium">从</label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="input w-full rounded-lg px-4 py-3"
              >
                {currencies.map((c) => (
                  <option key={c} value={c}>
                    {c} - {CURRENCY_LABELS[c] ?? c}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={swapCurrencies}
              className="btn-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-lg"
              title="互换货币"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
            </button>
            <div className="min-w-0 flex-1">
              <label className="mb-2 block text-sm font-medium">到</label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="input w-full rounded-lg px-4 py-3"
              >
                {currencies.map((c) => (
                  <option key={c} value={c}>
                    {c} - {CURRENCY_LABELS[c] ?? c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="rounded-lg bg-[var(--background)] p-4">
            <p className="text-sm text-[var(--muted)]">换算结果</p>
            <p className="mt-1 text-2xl font-semibold">
              {amountNum > 0
                ? `${amountNum.toLocaleString()} ${fromCurrency} = ${converted.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${toCurrency}`
                : "请输入金额"}
            </p>
          </div>
        </div>
      </div>

      <div className="card mt-6 rounded-xl p-6">
        <h2 className="mb-4 text-lg font-semibold">常用汇率（1 单位 ≈ 人民币）</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {commonConversions.map(({ code, label, value }) => (
            <div
              key={code}
              className="flex items-center justify-between rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-3"
            >
              <span className="font-medium">
                1 {code} ({label})
              </span>
              <span className="text-[var(--primary)]">
                ≈ {value.toLocaleString(undefined, { maximumFractionDigits: 4 })} 人民币
              </span>
            </div>
          ))}
        </div>
      </div>
    </ToolPageWrapper>
  );
}
