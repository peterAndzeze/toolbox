"use client";

import { useState, useMemo, useCallback } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

const CN_STANDARD = [
  { max: 18.5, label: "偏瘦", color: "bg-sky-400" },
  { max: 24, label: "正常", color: "bg-emerald-500" },
  { max: 28, label: "偏胖", color: "bg-amber-500" },
  { max: Infinity, label: "肥胖", color: "bg-red-500" },
];

const WHO_STANDARD = [
  { max: 18.5, label: "Underweight" },
  { max: 25, label: "Normal" },
  { max: 30, label: "Overweight" },
  { max: Infinity, label: "Obese" },
];

function getCnCategory(bmi: number) {
  return CN_STANDARD.find((x) => bmi < x.max) ?? CN_STANDARD[CN_STANDARD.length - 1];
}

function getWhoCategory(bmi: number) {
  return WHO_STANDARD.find((x) => bmi < x.max) ?? WHO_STANDARD[WHO_STANDARD.length - 1];
}

function getTips(bmi: number, cnLabel: string): string[] {
  const tips: string[] = [];
  if (bmi < 18.5) {
    tips.push("偏瘦人群建议适当增加营养摄入，保证优质蛋白和碳水化合物的摄入。");
    tips.push("可进行适度力量训练，增加肌肉量，提升基础代谢。");
    tips.push("避免过度节食，保证每日热量摄入满足身体需求。");
  } else if (bmi < 24) {
    tips.push("体重在正常范围内，请继续保持健康的生活习惯。");
    tips.push("建议每周进行 150 分钟以上中等强度有氧运动。");
    tips.push("均衡饮食，多吃蔬菜水果，适量摄入优质蛋白。");
  } else if (bmi < 28) {
    tips.push("体重略高，建议控制饮食热量，减少高糖高脂食物摄入。");
    tips.push("增加运动量，如快走、游泳、骑行等有氧运动。");
    tips.push("避免久坐，每 1-2 小时起身活动 5-10 分钟。");
  } else {
    tips.push("建议咨询医生或营养师，制定科学的减重计划。");
    tips.push("控制总热量摄入，选择低热量、高饱腹感的食物。");
    tips.push("循序渐进增加运动，避免剧烈运动造成损伤。");
  }
  return tips;
}

export default function BMICalculatorPage() {
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(65);

  const bmi = useMemo(() => {
    if (height <= 0 || weight <= 0) return 0;
    const h = height / 100;
    return weight / (h * h);
  }, [height, weight]);

  const cnCat = useMemo(() => getCnCategory(bmi), [bmi]);
  const whoCat = useMemo(() => getWhoCategory(bmi), [bmi]);
  const tips = useMemo(() => getTips(bmi, cnCat.label), [bmi, cnCat.label]);

  const healthyRange = useMemo(() => {
    if (height <= 0) return { min: 0, max: 0 };
    const h = height / 100;
    const min = 18.5 * h * h;
    const max = 23.9 * h * h;
    return { min, max };
  }, [height]);

  const idealWeight = useMemo(() => {
    if (height <= 0) return 0;
    const h = height / 100;
    return 22 * h * h;
  }, [height]);

  const scalePosition = useMemo(() => {
    const clamped = Math.min(Math.max(bmi, 15), 40);
    return ((clamped - 15) / 25) * 100;
  }, [bmi]);

  const formatNum = useCallback((v: number) => v.toFixed(1), []);

  return (
    <ToolPageWrapper>
      <h1 className="page-title">BMI 计算器</h1>
      <p className="page-subtitle">
        输入身高体重，快速计算身体质量指数，参考中国和 WHO 标准判断体重状况
      </p>

      <div className="card mt-6 rounded-xl p-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">身高（cm）</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value) || 0)}
              min={50}
              max={250}
              className="input w-full rounded-lg px-4 py-3 text-lg"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">体重（kg）</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value) || 0)}
              min={20}
              max={300}
              step={0.1}
              className="input w-full rounded-lg px-4 py-3 text-lg"
            />
          </div>
        </div>
      </div>

      {height > 0 && weight > 0 && (
        <>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="card rounded-xl p-6">
              <h2 className="mb-4 text-lg font-semibold">BMI 结果</h2>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">{formatNum(bmi)}</span>
                <span className="text-[var(--muted)]">kg/m²</span>
              </div>
              <div className="mt-4 flex gap-3">
                <div className="rounded-lg bg-[var(--background)] px-4 py-2">
                  <p className="text-xs text-[var(--muted)]">中国标准</p>
                  <p className={`font-semibold ${cnCat.label === "正常" ? "text-green-600" : cnCat.label === "偏瘦" ? "text-sky-600" : cnCat.label === "偏胖" ? "text-amber-600" : "text-red-600"}`}>
                    {cnCat.label}
                  </p>
                </div>
                <div className="rounded-lg bg-[var(--background)] px-4 py-2">
                  <p className="text-xs text-[var(--muted)]">WHO 标准</p>
                  <p className="font-semibold">{whoCat.label}</p>
                </div>
              </div>
            </div>
            <div className="card rounded-xl p-6">
              <h2 className="mb-4 text-lg font-semibold">健康参考</h2>
              <div className="space-y-3">
                <div className="flex justify-between rounded-lg bg-[var(--background)] px-4 py-3">
                  <span className="text-[var(--muted)]">健康体重范围</span>
                  <span className="font-semibold">{formatNum(healthyRange.min)} - {formatNum(healthyRange.max)} kg</span>
                </div>
                <div className="flex justify-between rounded-lg bg-[var(--background)] px-4 py-3">
                  <span className="text-[var(--muted)]">理想体重 (BMI 22)</span>
                  <span className="font-semibold">{formatNum(idealWeight)} kg</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card mt-6 rounded-xl p-6">
            <h2 className="mb-4 text-lg font-semibold">BMI 刻度尺</h2>
            <div className="relative h-10 w-full overflow-hidden rounded-lg">
              <div className="absolute inset-0 flex">
                <div className="h-full flex-1 bg-sky-400" style={{ minWidth: "20%" }} />
                <div className="h-full flex-1 bg-emerald-500" style={{ minWidth: "20%" }} />
                <div className="h-full flex-1 bg-amber-500" style={{ minWidth: "20%" }} />
                <div className="h-full flex-1 bg-red-500" style={{ minWidth: "20%" }} />
              </div>
              <div
                className="absolute top-0 h-full w-1 -translate-x-1/2 bg-gray-900 shadow-lg"
                style={{ left: `${scalePosition}%` }}
              />
              <div
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs font-medium text-white"
                style={{ left: `${scalePosition}%` }}
              >
                {formatNum(bmi)}
              </div>
            </div>
            <div className="mt-10 flex justify-between text-xs text-[var(--muted)]">
              <span>15</span>
              <span>18.5</span>
              <span>24</span>
              <span>28</span>
              <span>40+</span>
            </div>
            <div className="mt-1 flex justify-between text-xs">
              <span className="text-sky-600">偏瘦</span>
              <span className="text-emerald-600">正常</span>
              <span className="text-amber-600">偏胖</span>
              <span className="text-red-600">肥胖</span>
            </div>
          </div>

          <div className="card mt-6 rounded-xl p-6">
            <h2 className="mb-4 text-lg font-semibold">健康建议</h2>
            <ul className="space-y-2">
              {tips.map((tip, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <span className="text-[var(--primary)]">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card mt-6 rounded-xl p-6">
            <h2 className="mb-4 text-lg font-semibold">参考说明</h2>
            <div className="space-y-4 text-sm text-[var(--muted)]">
              <div>
                <p className="mb-1 font-medium text-foreground">中国标准（成人）</p>
                <p>偏瘦 &lt; 18.5 | 正常 18.5-23.9 | 偏胖 24.0-27.9 | 肥胖 ≥ 28.0</p>
              </div>
              <div>
                <p className="mb-1 font-medium text-foreground">WHO 标准</p>
                <p>Underweight &lt; 18.5 | Normal 18.5-24.9 | Overweight 25.0-29.9 | Obese ≥ 30</p>
              </div>
              <div>
                <p className="mb-1 font-medium text-foreground">理想体重公式</p>
                <p>理想体重 = 22 × 身高(m)²，BMI 22 通常被认为是较理想的健康体重指数。</p>
              </div>
            </div>
          </div>
        </>
      )}
    </ToolPageWrapper>
  );
}
