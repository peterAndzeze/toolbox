"use client";

import { useState, useCallback } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

type Unit = "px" | "%";

interface RadiusValues {
  tl: number;
  tr: number;
  br: number;
  bl: number;
}

interface AdvancedRadius {
  tlH: number;
  tlV: number;
  trH: number;
  trV: number;
  brH: number;
  brV: number;
  blH: number;
  blV: number;
}

const PRESETS: { name: string; values: RadiusValues; unit: Unit }[] = [
  { name: "直角", values: { tl: 0, tr: 0, br: 0, bl: 0 }, unit: "px" },
  { name: "圆角", values: { tl: 8, tr: 8, br: 8, bl: 8 }, unit: "px" },
  { name: "大圆角", values: { tl: 16, tr: 16, br: 16, bl: 16 }, unit: "px" },
  { name: "圆形", values: { tl: 50, tr: 50, br: 50, bl: 50 }, unit: "%" },
  { name: "药丸", values: { tl: 100, tr: 100, br: 100, bl: 100 }, unit: "px" },
  { name: "叶子", values: { tl: 80, tr: 20, br: 80, bl: 20 }, unit: "%" },
  { name: "左上", values: { tl: 24, tr: 0, br: 0, bl: 0 }, unit: "px" },
  { name: "右下", values: { tl: 0, tr: 0, br: 24, bl: 0 }, unit: "px" },
];

export default function CssRadiusPage() {
  const [unit, setUnit] = useState<Unit>("px");
  const [linked, setLinked] = useState(true);
  const [advanced, setAdvanced] = useState(false);
  const [values, setValues] = useState<RadiusValues>({ tl: 12, tr: 12, br: 12, bl: 12 });
  const [advValues, setAdvValues] = useState<AdvancedRadius>({
    tlH: 12, tlV: 12, trH: 12, trV: 12, brH: 12, brV: 12, blH: 12, blV: 12,
  });
  const [copied, setCopied] = useState(false);

  const maxVal = unit === "px" ? 100 : 50;
  const suffix = unit === "px" ? "px" : "%";

  const updateValue = useCallback(
    (corner: keyof RadiusValues, val: number) => {
      const v = Math.min(maxVal, Math.max(0, val));
      if (linked) {
        setValues({ tl: v, tr: v, br: v, bl: v });
        setAdvValues({
          tlH: v, tlV: v, trH: v, trV: v, brH: v, brV: v, blH: v, blV: v,
        });
      } else {
        setValues((prev) => ({ ...prev, [corner]: v }));
        const keyH = `${corner}H` as keyof AdvancedRadius;
        const keyV = `${corner}V` as keyof AdvancedRadius;
        setAdvValues((prev) => ({ ...prev, [keyH]: v, [keyV]: v }));
      }
    },
    [linked, maxVal]
  );

  const loadPreset = useCallback((preset: (typeof PRESETS)[0]) => {
    setValues(preset.values);
    setUnit(preset.unit);
    const v = preset.values;
    setAdvValues({
      tlH: v.tl, tlV: v.tl, trH: v.tr, trV: v.tr, brH: v.br, brV: v.br, blH: v.bl, blV: v.bl,
    });
  }, []);

  const cssValue = advanced
    ? `border-radius: ${advValues.tlH}${suffix} ${advValues.trH}${suffix} ${advValues.brH}${suffix} ${advValues.blH}${suffix} / ${advValues.tlV}${suffix} ${advValues.trV}${suffix} ${advValues.brV}${suffix} ${advValues.blV}${suffix};`
    : `border-radius: ${values.tl}${suffix} ${values.tr}${suffix} ${values.br}${suffix} ${values.bl}${suffix};`;

  const previewStyle = advanced
    ? {
        borderRadius: `${advValues.tlH}${suffix} ${advValues.trH}${suffix} ${advValues.brH}${suffix} ${advValues.blH}${suffix} / ${advValues.tlV}${suffix} ${advValues.trV}${suffix} ${advValues.brV}${suffix} ${advValues.blV}${suffix}`,
      }
    : {
        borderRadius: `${values.tl}${suffix} ${values.tr}${suffix} ${values.br}${suffix} ${values.bl}${suffix}`,
      };

  const copyCss = () => {
    navigator.clipboard.writeText(cssValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const corners: { key: keyof RadiusValues; label: string }[] = [
    { key: "tl", label: "左上" },
    { key: "tr", label: "右上" },
    { key: "br", label: "右下" },
    { key: "bl", label: "左下" },
  ];

  return (
    <ToolPageWrapper>
      <h1 className="page-title">CSS Border Radius 生成器</h1>
      <p className="page-subtitle">可视化调节四角圆角，支持高级八值语法，一键复制代码</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="card rounded-xl p-4">
            <div className="mb-4 flex items-center gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium">单位</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as Unit)}
                  className="input rounded-lg px-3 py-2"
                >
                  <option value="px">px</option>
                  <option value="%">%</option>
                </select>
              </div>
              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="linked"
                  checked={linked}
                  onChange={(e) => setLinked(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="linked" className="text-sm">四角联动</label>
              </div>
              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="advanced"
                  checked={advanced}
                  onChange={(e) => setAdvanced(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="advanced" className="text-sm">高级模式 (8值)</label>
              </div>
            </div>

            {advanced ? (
              <div className="space-y-3">
                <p className="text-xs text-[var(--muted)]">每角可设置水平/垂直半径</p>
                {corners.map(({ key, label }) => (
                  <div key={key} className="rounded-lg border border-[var(--card-border)] p-3">
                    <label className="mb-2 block text-sm font-medium">{label}</label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-xs text-[var(--muted)]">水平</span>
                        <input
                          type="range"
                          min={0}
                          max={unit === "px" ? 100 : 50}
                          value={advValues[`${key}H` as keyof AdvancedRadius]}
                          onChange={(e) => {
                            const v = Number(e.target.value);
                            if (linked) {
                              setAdvValues((p) => ({ ...p, tlH: v, trH: v, brH: v, blH: v }));
                            } else {
                              setAdvValues((p) => ({ ...p, [`${key}H`]: v }));
                            }
                          }}
                          className="w-full"
                        />
                        <span className="text-xs font-mono">{advValues[`${key}H` as keyof AdvancedRadius]}{suffix}</span>
                      </div>
                      <div>
                        <span className="text-xs text-[var(--muted)]">垂直</span>
                        <input
                          type="range"
                          min={0}
                          max={unit === "px" ? 100 : 50}
                          value={advValues[`${key}V` as keyof AdvancedRadius]}
                          onChange={(e) => {
                            const v = Number(e.target.value);
                            if (linked) {
                              setAdvValues((p) => ({ ...p, tlV: v, trV: v, brV: v, blV: v }));
                            } else {
                              setAdvValues((p) => ({ ...p, [`${key}V`]: v }));
                            }
                          }}
                          className="w-full"
                        />
                        <span className="text-xs font-mono">{advValues[`${key}V` as keyof AdvancedRadius]}{suffix}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {corners.map(({ key, label }) => (
                  <div key={key}>
                    <label className="mb-2 block text-sm font-medium">{label}</label>
                    <input
                      type="range"
                      min={0}
                      max={maxVal}
                      value={values[key]}
                      onChange={(e) => updateValue(key, Number(e.target.value))}
                      className="w-full"
                    />
                    <span className="text-sm font-mono">{values[key]}{suffix}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card rounded-xl p-4">
            <label className="mb-2 block text-sm font-medium">预设</label>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => loadPreset(p)}
                  className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-2 text-sm transition hover:border-[var(--primary)]"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card rounded-xl p-4">
            <label className="mb-3 block text-sm font-medium">实时预览</label>
            <div className="flex min-h-[200px] items-center justify-center bg-[var(--background)]/50">
              <div
                className="h-40 w-48 bg-gradient-to-br from-[var(--primary)] to-purple-600"
                style={previewStyle}
              />
            </div>
          </div>

          <div className="card rounded-xl p-4">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium">生成 CSS</label>
              <button onClick={copyCss} className="btn-primary rounded-lg px-4 py-2 text-sm">
                {copied ? "已复制 ✓" : "复制代码"}
              </button>
            </div>
            <pre className="textarea-tool max-h-32 overflow-auto rounded-lg p-4 font-mono text-sm">
              {cssValue}
            </pre>
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
}
