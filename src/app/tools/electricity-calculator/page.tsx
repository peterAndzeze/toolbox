"use client";

import { useState, useMemo } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

const PRESETS = [
  { name: "空调", power: 1500 },
  { name: "冰箱", power: 150 },
  { name: "洗衣机", power: 500 },
  { name: "电视", power: 100 },
  { name: "电脑", power: 300 },
  { name: "电热水器", power: 2000 },
  { name: "微波炉", power: 1000 },
  { name: "电饭煲", power: 800 },
  { name: "电风扇", power: 60 },
  { name: "吸尘器", power: 1200 },
  { name: "路由器", power: 12 },
  { name: "LED灯", power: 10 },
] as const;

const TIER1_RATE = 0.56;
const TIER2_RATE = 0.61;
const TIER3_RATE = 0.86;
const TIER1_MAX = 240;
const TIER2_MAX = 400;

function calcTieredCost(kwh: number): number {
  if (kwh <= TIER1_MAX) return kwh * TIER1_RATE;
  if (kwh <= TIER2_MAX) return TIER1_MAX * TIER1_RATE + (kwh - TIER1_MAX) * TIER2_RATE;
  return TIER1_MAX * TIER1_RATE + (TIER2_MAX - TIER1_MAX) * TIER2_RATE + (kwh - TIER2_MAX) * TIER3_RATE;
}

interface Appliance {
  id: string;
  name: string;
  power: number;
  hours: number;
}

export default function ElectricityCalculatorPage() {
  const [mode, setMode] = useState<"single" | "multi">("single");
  const [power, setPower] = useState<string>("");
  const [hours, setHours] = useState<string>("");
  const [appliances, setAppliances] = useState<Appliance[]>([
    { id: crypto.randomUUID(), name: "", power: 0, hours: 0 },
  ]);
  const [useFlatRate, setUseFlatRate] = useState(false);
  const [flatRate, setFlatRate] = useState<string>("0.56");

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    if (mode === "single") {
      setPower(String(p.power));
    } else {
      setAppliances((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        if (last && !last.name && last.power === 0 && last.hours === 0) {
          next[next.length - 1] = { ...last, name: p.name, power: p.power };
        } else {
          next.push({ id: crypto.randomUUID(), name: p.name, power: p.power, hours: 0 });
        }
        return next;
      });
    }
  };

  const addAppliance = () => {
    setAppliances((prev) => [...prev, { id: crypto.randomUUID(), name: "", power: 0, hours: 0 }]);
  };

  const removeAppliance = (id: string) => {
    setAppliances((prev) => (prev.length > 1 ? prev.filter((a) => a.id !== id) : prev));
  };

  const updateAppliance = (id: string, field: keyof Appliance, value: string | number) => {
    setAppliances((prev) =>
      prev.map((a) => (a.id === id ? { ...a, [field]: value } : a))
    );
  };

  const flatRateNum = parseFloat(flatRate) || 0;

  const singleKwh = useMemo(() => {
    const p = parseFloat(power) || 0;
    const h = parseFloat(hours) || 0;
    return (p / 1000) * h;
  }, [power, hours]);

  const multiBreakdown = useMemo(() => {
    return appliances.map((a) => {
      const p = typeof a.power === "number" ? a.power : parseFloat(String(a.power)) || 0;
      const h = typeof a.hours === "number" ? a.hours : parseFloat(String(a.hours)) || 0;
      const dailyKwh = (p / 1000) * h;
      return {
        ...a,
        dailyKwh,
        monthlyKwh: dailyKwh * 30,
        yearlyKwh: dailyKwh * 365,
      };
    });
  }, [appliances]);

  const totalMultiKwh = useMemo(() => {
    return multiBreakdown.reduce((sum, b) => sum + b.dailyKwh, 0);
  }, [multiBreakdown]);

  const dailyKwh = mode === "single" ? singleKwh : totalMultiKwh;
  const monthlyKwh = dailyKwh * 30;
  const yearlyKwh = dailyKwh * 365;

  const monthlyCost = useMemo(() => {
    if (useFlatRate && flatRateNum > 0) return monthlyKwh * flatRateNum;
    return calcTieredCost(monthlyKwh);
  }, [useFlatRate, flatRateNum, monthlyKwh]);

  const yearlyCost = useMemo(() => {
    if (useFlatRate && flatRateNum > 0) return yearlyKwh * flatRateNum;
    return calcTieredCost(monthlyKwh) * 12;
  }, [useFlatRate, flatRateNum, yearlyKwh, monthlyKwh]);

  const hasInput = mode === "single" ? (parseFloat(power) || 0) > 0 && (parseFloat(hours) || 0) > 0 : totalMultiKwh > 0;

  return (
    <ToolPageWrapper>
      <h1 className="page-title">电费计算器</h1>
      <p className="page-subtitle">
        在线计算家用电器耗电量和电费，支持阶梯电价，常见电器功率参考
      </p>

      <div className="card mt-6 rounded-xl p-6">
        <div className="mb-4 flex gap-2">
          <button
            type="button"
            onClick={() => setMode("single")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              mode === "single" ? "btn-primary" : "border border-[var(--card-border)] bg-[var(--card-bg)] hover:border-[var(--primary)]"
            }`}
          >
            单个电器
          </button>
          <button
            type="button"
            onClick={() => setMode("multi")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              mode === "multi" ? "btn-primary" : "border border-[var(--card-border)] bg-[var(--card-bg)] hover:border-[var(--primary)]"
            }`}
          >
            多个电器
          </button>
        </div>

        {/* Presets */}
        <div className="mb-6">
          <p className="mb-2 text-sm font-medium text-[var(--muted)]">常用电器（点击填充）</p>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => applyPreset(p)}
                className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-1.5 text-sm transition hover:border-[var(--primary)]"
              >
                {p.name} {p.power}W
              </button>
            ))}
          </div>
        </div>

        {mode === "single" ? (
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">功率 (W)</label>
              <input
                type="number"
                min={0}
                step={1}
                value={power}
                onChange={(e) => setPower(e.target.value)}
                placeholder="如 1500"
                className="input w-full rounded-lg px-4 py-3"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">每日使用时长 (小时)</label>
              <input
                type="number"
                min={0}
                step={0.5}
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="如 8"
                className="input w-full rounded-lg px-4 py-3"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">电器列表</span>
              <button type="button" onClick={addAppliance} className="btn-primary rounded-lg px-3 py-1.5 text-sm">
                添加电器
              </button>
            </div>
            <div className="space-y-3">
              {appliances.map((a) => (
                <div
                  key={a.id}
                  className="flex flex-wrap items-center gap-2 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-3"
                >
                  <input
                    type="text"
                    value={a.name}
                    onChange={(e) => updateAppliance(a.id, "name", e.target.value)}
                    placeholder="名称"
                    className="input w-24 rounded-lg px-3 py-2 text-sm sm:w-28"
                  />
                  <input
                    type="number"
                    min={0}
                    value={a.power || ""}
                    onChange={(e) => updateAppliance(a.id, "power", parseFloat(e.target.value) || 0)}
                    placeholder="功率 W"
                    className="input w-24 rounded-lg px-3 py-2 text-sm sm:w-28"
                  />
                  <input
                    type="number"
                    min={0}
                    step={0.5}
                    value={a.hours || ""}
                    onChange={(e) => updateAppliance(a.id, "hours", parseFloat(e.target.value) || 0)}
                    placeholder="小时/天"
                    className="input w-24 rounded-lg px-3 py-2 text-sm sm:w-28"
                  />
                  <button
                    type="button"
                    onClick={() => removeAppliance(a.id)}
                    className="rounded border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950"
                  >
                    删除
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pricing */}
        <div className="mt-6 space-y-4 border-t border-[var(--card-border)] pt-6">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="flat"
              checked={useFlatRate}
              onChange={(e) => setUseFlatRate(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="flat" className="text-sm">
              使用自定义单价（否则按阶梯电价）
            </label>
          </div>
          {useFlatRate && (
            <div>
              <label className="mb-2 block text-sm font-medium">单价 (元/kWh)</label>
              <input
                type="number"
                min={0}
                step={0.01}
                value={flatRate}
                onChange={(e) => setFlatRate(e.target.value)}
                className="input w-32 rounded-lg px-4 py-2"
              />
            </div>
          )}
          {!useFlatRate && (
            <p className="text-xs text-[var(--muted)]">
              阶梯电价：0–240 kWh 0.56 元/kWh，241–400 kWh 0.61 元/kWh，400+ kWh 0.86 元/kWh
            </p>
          )}
        </div>
      </div>

      {hasInput && (
        <div className="card mt-6 rounded-xl p-6">
          <h2 className="mb-4 text-lg font-semibold">计算结果</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
              <p className="text-sm text-[var(--muted)]">日耗电量</p>
              <p className="mt-1 text-xl font-bold">{dailyKwh.toFixed(2)} kWh</p>
            </div>
            <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
              <p className="text-sm text-[var(--muted)]">月耗电量</p>
              <p className="mt-1 text-xl font-bold">{monthlyKwh.toFixed(2)} kWh</p>
            </div>
            <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
              <p className="text-sm text-[var(--muted)]">年耗电量</p>
              <p className="mt-1 text-xl font-bold">{yearlyKwh.toFixed(2)} kWh</p>
            </div>
            <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
              <p className="text-sm text-[var(--muted)]">月电费</p>
              <p className="mt-1 text-xl font-bold text-[var(--primary)]">{monthlyCost.toFixed(2)} 元</p>
            </div>
            <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
              <p className="text-sm text-[var(--muted)]">年电费</p>
              <p className="mt-1 text-xl font-bold text-[var(--primary)]">{yearlyCost.toFixed(2)} 元</p>
            </div>
          </div>

          {mode === "multi" && multiBreakdown.some((b) => b.dailyKwh > 0) && (
            <div className="mt-6">
              <h3 className="mb-3 text-sm font-medium">各电器明细</h3>
              <div className="overflow-x-auto rounded-lg border border-[var(--card-border)]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--card-border)] bg-[var(--card-bg)]">
                      <th className="px-4 py-3 text-left font-medium">电器</th>
                      <th className="px-4 py-3 text-right font-medium">日 kWh</th>
                      <th className="px-4 py-3 text-right font-medium">月 kWh</th>
                      <th className="px-4 py-3 text-right font-medium">年 kWh</th>
                    </tr>
                  </thead>
                  <tbody>
                    {multiBreakdown
                      .filter((b) => b.dailyKwh > 0)
                      .map((b) => (
                        <tr key={b.id} className="border-b border-[var(--card-border)] last:border-0">
                          <td className="px-4 py-3">{b.name || "未命名"}</td>
                          <td className="px-4 py-3 text-right">{b.dailyKwh.toFixed(2)}</td>
                          <td className="px-4 py-3 text-right">{b.monthlyKwh.toFixed(2)}</td>
                          <td className="px-4 py-3 text-right">{b.yearlyKwh.toFixed(2)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </ToolPageWrapper>
  );
}
