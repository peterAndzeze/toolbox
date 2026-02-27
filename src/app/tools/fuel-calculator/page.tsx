"use client";

import { useState, useMemo } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

type TabMode = "consumption" | "cost" | "refuel";

const FUEL_PRICES = [
  { label: "92号", price: 7.89 },
  { label: "95号", price: 8.39 },
  { label: "98号", price: 9.39 },
  { label: "0号柴油", price: 7.55 },
] as const;

const VEHICLE_PRESETS = [
  { label: "小型车", consumption: 6 },
  { label: "紧凑型", consumption: 7.5 },
  { label: "中型车", consumption: 9 },
  { label: "SUV", consumption: 10.5 },
  { label: "MPV", consumption: 11 },
] as const;

function formatMoney(v: number) {
  return v.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function FuelCalculatorPage() {
  const [mode, setMode] = useState<TabMode>("consumption");

  // Mode 1: 油耗计算
  const [distance, setDistance] = useState("");
  const [fuelUsed, setFuelUsed] = useState("");

  // Mode 2: 油费计算
  const [costDistance, setCostDistance] = useState("");
  const [consumption, setConsumption] = useState("");
  const [fuelPrice, setFuelPrice] = useState("8.39");

  // Mode 3: 加油量计算
  const [budget, setBudget] = useState("");
  const [refuelPrice, setRefuelPrice] = useState("8.39");
  const [refuelConsumption, setRefuelConsumption] = useState("8");

  // Comparison
  const [monthlyKm, setMonthlyKm] = useState("");

  const consumptionResult = useMemo(() => {
    const d = Number(distance);
    const f = Number(fuelUsed);
    if (d <= 0 || f <= 0) return null;
    const l100 = (f / d) * 100;
    return { l100 };
  }, [distance, fuelUsed]);

  const costResult = useMemo(() => {
    const d = Number(costDistance);
    const c = Number(consumption);
    const p = Number(fuelPrice);
    if (d <= 0 || c <= 0 || p <= 0) return null;
    const liters = (d / 100) * c;
    const totalCost = liters * p;
    const costPerKm = totalCost / d;
    return { liters, totalCost, costPerKm };
  }, [costDistance, consumption, fuelPrice]);

  const refuelResult = useMemo(() => {
    const b = Number(budget);
    const p = Number(refuelPrice);
    const c = Number(refuelConsumption);
    if (b <= 0 || p <= 0 || c <= 0) return null;
    const liters = b / p;
    const km = (liters / c) * 100;
    return { liters, km };
  }, [budget, refuelPrice, refuelConsumption]);

  const comparisonResult = useMemo(() => {
    const km = Number(monthlyKm);
    if (km <= 0) return null;
    const c = Number(consumption || refuelConsumption || "8");
    const p = Number(fuelPrice || refuelPrice || "8.39");
    if (c <= 0 || p <= 0) return null;
    const monthlyLiters = (km / 100) * c;
    const monthlyCost = monthlyLiters * p;
    const yearlyCost = monthlyCost * 12;
    const costPerKm = (monthlyCost / km);
    return { monthlyLiters, monthlyCost, yearlyCost, costPerKm };
  }, [monthlyKm, consumption, refuelConsumption, fuelPrice, refuelPrice]);

  const tabs = [
    { id: "consumption" as const, label: "油耗计算" },
    { id: "cost" as const, label: "油费计算" },
    { id: "refuel" as const, label: "加油量计算" },
  ];

  return (
    <ToolPageWrapper>
      <h1 className="page-title">油耗计算器</h1>
      <p className="page-subtitle">
        在线计算汽车百公里油耗、加油费用、行驶成本，支持多种油品价格参考
      </p>

      {/* Tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setMode(t.id)}
            className={`category-tab ${mode === t.id ? "active" : ""}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Mode 1: 油耗计算 */}
      {mode === "consumption" && (
        <div className="card mt-6 rounded-xl p-6">
          <h2 className="mb-4 text-lg font-semibold">油耗计算</h2>
          <p className="mb-4 text-sm text-[var(--muted)]">输入行驶里程和加油量，计算百公里油耗</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">行驶里程（km）</label>
              <input
                type="number"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="如 500"
                min={0}
                step={0.1}
                className="input w-full rounded-lg px-4 py-3"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">加油量（L）</label>
              <input
                type="number"
                value={fuelUsed}
                onChange={(e) => setFuelUsed(e.target.value)}
                placeholder="如 35"
                min={0}
                step={0.01}
                className="input w-full rounded-lg px-4 py-3"
              />
            </div>
          </div>
          {consumptionResult && (
            <div className="mt-6 rounded-lg bg-[var(--background)] p-4">
              <p className="text-sm text-[var(--muted)]">百公里油耗</p>
              <p className="mt-1 text-2xl font-bold text-[var(--primary)]">
                {consumptionResult.l100.toFixed(2)} L/100km
              </p>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: 油费计算 */}
      {mode === "cost" && (
        <div className="card mt-6 rounded-xl p-6">
          <h2 className="mb-4 text-lg font-semibold">油费计算</h2>
          <p className="mb-4 text-sm text-[var(--muted)]">输入里程、油耗和油价，计算总油费</p>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium">油耗参考（L/100km）</label>
            <div className="flex flex-wrap gap-2">
              {VEHICLE_PRESETS.map((v) => (
                <button
                  key={v.label}
                  onClick={() => setConsumption(String(v.consumption))}
                  className="quick-tag rounded-lg px-3 py-1.5 text-sm"
                >
                  {v.label} {v.consumption}L
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium">油价参考（元/L）</label>
            <div className="flex flex-wrap gap-2">
              {FUEL_PRICES.map((f) => (
                <button
                  key={f.label}
                  onClick={() => setFuelPrice(String(f.price))}
                  className="quick-tag rounded-lg px-3 py-1.5 text-sm"
                >
                  {f.label} {f.price}元
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium">行驶里程（km）</label>
              <input
                type="number"
                value={costDistance}
                onChange={(e) => setCostDistance(e.target.value)}
                placeholder="如 300"
                min={0}
                step={0.1}
                className="input w-full rounded-lg px-4 py-3"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">百公里油耗（L/100km）</label>
              <input
                type="number"
                value={consumption}
                onChange={(e) => setConsumption(e.target.value)}
                placeholder="如 8"
                min={0}
                step={0.1}
                className="input w-full rounded-lg px-4 py-3"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">油价（元/L）</label>
              <input
                type="number"
                value={fuelPrice}
                onChange={(e) => setFuelPrice(e.target.value)}
                placeholder="如 8.39"
                min={0}
                step={0.01}
                className="input w-full rounded-lg px-4 py-3"
              />
            </div>
          </div>

          {costResult && (
            <div className="mt-6 space-y-3">
              <div className="flex justify-between rounded-lg bg-[var(--background)] px-4 py-3">
                <span className="text-[var(--muted)]">需加油量</span>
                <span className="font-semibold">{costResult.liters.toFixed(2)} L</span>
              </div>
              <div className="flex justify-between rounded-lg bg-[var(--background)] px-4 py-3">
                <span className="text-[var(--muted)]">总油费</span>
                <span className="font-semibold text-[var(--primary)]">¥{formatMoney(costResult.totalCost)}</span>
              </div>
              <div className="flex justify-between rounded-lg bg-[var(--background)] px-4 py-3">
                <span className="text-[var(--muted)]">每公里成本</span>
                <span className="font-semibold">¥{costResult.costPerKm.toFixed(3)}/km</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mode 3: 加油量计算 */}
      {mode === "refuel" && (
        <div className="card mt-6 rounded-xl p-6">
          <h2 className="mb-4 text-lg font-semibold">加油量计算</h2>
          <p className="mb-4 text-sm text-[var(--muted)]">输入预算和油价，计算可加油量及预估行驶里程</p>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium">油耗参考（L/100km）</label>
            <div className="flex flex-wrap gap-2">
              {VEHICLE_PRESETS.map((v) => (
                <button
                  key={v.label}
                  onClick={() => setRefuelConsumption(String(v.consumption))}
                  className="quick-tag rounded-lg px-3 py-1.5 text-sm"
                >
                  {v.label} {v.consumption}L
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium">油价参考（元/L）</label>
            <div className="flex flex-wrap gap-2">
              {FUEL_PRICES.map((f) => (
                <button
                  key={f.label}
                  onClick={() => setRefuelPrice(String(f.price))}
                  className="quick-tag rounded-lg px-3 py-1.5 text-sm"
                >
                  {f.label} {f.price}元
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium">预算（元）</label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="如 300"
                min={0}
                step={1}
                className="input w-full rounded-lg px-4 py-3"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">油价（元/L）</label>
              <input
                type="number"
                value={refuelPrice}
                onChange={(e) => setRefuelPrice(e.target.value)}
                placeholder="如 8.39"
                min={0}
                step={0.01}
                className="input w-full rounded-lg px-4 py-3"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">百公里油耗（L/100km）</label>
              <input
                type="number"
                value={refuelConsumption}
                onChange={(e) => setRefuelConsumption(e.target.value)}
                placeholder="如 8"
                min={0}
                step={0.1}
                className="input w-full rounded-lg px-4 py-3"
              />
            </div>
          </div>

          {refuelResult && (
            <div className="mt-6 space-y-3">
              <div className="flex justify-between rounded-lg bg-[var(--background)] px-4 py-3">
                <span className="text-[var(--muted)]">可加油量</span>
                <span className="font-semibold">{refuelResult.liters.toFixed(2)} L</span>
              </div>
              <div className="flex justify-between rounded-lg bg-[var(--background)] px-4 py-3">
                <span className="text-[var(--muted)]">预估可行驶</span>
                <span className="font-semibold text-[var(--primary)]">{refuelResult.km.toFixed(0)} km</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Comparison section */}
      <div className="card mt-6 rounded-xl p-6">
        <h2 className="mb-4 text-lg font-semibold">月度/年度油费预估</h2>
        <p className="mb-4 text-sm text-[var(--muted)]">输入每月行驶里程，估算月度和年度油费</p>
        <div className="max-w-xs">
          <label className="mb-2 block text-sm font-medium">每月行驶里程（km）</label>
          <input
            type="number"
            value={monthlyKm}
            onChange={(e) => setMonthlyKm(e.target.value)}
            placeholder="如 1000"
            min={0}
            step={10}
            className="input w-full rounded-lg px-4 py-3"
          />
        </div>
        <p className="mt-2 text-xs text-[var(--muted)]">
          使用上方油费计算或加油量计算中的油耗和油价
        </p>
        {comparisonResult && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-[var(--background)] p-4">
              <p className="text-sm text-[var(--muted)]">月度油费</p>
              <p className="mt-1 text-xl font-bold text-[var(--primary)]">
                ¥{formatMoney(comparisonResult.monthlyCost)}
              </p>
              <p className="mt-1 text-xs text-[var(--muted)]">
                约 {comparisonResult.monthlyLiters.toFixed(1)} L
              </p>
            </div>
            <div className="rounded-lg bg-[var(--background)] p-4">
              <p className="text-sm text-[var(--muted)]">年度油费</p>
              <p className="mt-1 text-xl font-bold text-[var(--primary)]">
                ¥{formatMoney(comparisonResult.yearlyCost)}
              </p>
              <p className="mt-1 text-xs text-[var(--muted)]">
                每公里约 ¥{comparisonResult.costPerKm.toFixed(3)}
              </p>
            </div>
          </div>
        )}
      </div>
    </ToolPageWrapper>
  );
}
