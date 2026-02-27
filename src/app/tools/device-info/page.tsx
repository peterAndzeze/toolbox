"use client";

import { useState, useEffect } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

interface DeviceData {
  label: string;
  value: string;
}

export default function DeviceInfoPage() {
  const [info, setInfo] = useState<DeviceData[]>([]);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    const data: DeviceData[] = [
      { label: "屏幕分辨率", value: `${screen.width} × ${screen.height}` },
      { label: "浏览器窗口大小", value: `${window.innerWidth} × ${window.innerHeight}` },
      { label: "设备像素比", value: `${window.devicePixelRatio}x` },
      { label: "物理分辨率", value: `${Math.round(screen.width * window.devicePixelRatio)} × ${Math.round(screen.height * window.devicePixelRatio)}` },
      { label: "色彩深度", value: `${screen.colorDepth} bit` },
      { label: "User Agent", value: navigator.userAgent },
      { label: "浏览器语言", value: navigator.language },
      { label: "平台", value: navigator.platform },
      { label: "CPU 核心数", value: `${navigator.hardwareConcurrency || "未知"}` },
      { label: "内存", value: (navigator as unknown as Record<string, number>).deviceMemory ? `${(navigator as unknown as Record<string, number>).deviceMemory} GB` : "未知" },
      { label: "在线状态", value: navigator.onLine ? "在线" : "离线" },
      { label: "触摸支持", value: "ontouchstart" in window ? "是" : "否" },
      { label: "Cookie 启用", value: navigator.cookieEnabled ? "是" : "否" },
      { label: "时区", value: Intl.DateTimeFormat().resolvedOptions().timeZone },
      { label: "当前时间", value: new Date().toLocaleString() },
    ];
    setInfo(data);
  }, []);

  const copy = (value: string, label: string) => {
    navigator.clipboard.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(""), 1500);
  };

  const copyAll = () => {
    const text = info.map((i) => `${i.label}: ${i.value}`).join("\n");
    navigator.clipboard.writeText(text);
    setCopied("all");
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <ToolPageWrapper>
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">设备信息检测</h1>
        <p className="mt-2 text-[var(--muted)]">检测屏幕分辨率、浏览器信息、硬件配置等</p>
      </div>

      <div className="mb-4">
        <button onClick={copyAll} className="btn-primary rounded-lg px-4 py-2 text-sm font-medium">
          {copied === "all" ? "已复制全部 ✓" : "复制全部信息"}
        </button>
      </div>

      <div className="space-y-2">
        {info.map((item) => (
          <div key={item.label} className="flex items-center justify-between rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{item.label}</p>
              <p className="mt-0.5 truncate font-mono text-sm text-[var(--primary)]">{item.value}</p>
            </div>
            <button onClick={() => copy(item.value, item.label)} className="ml-3 shrink-0 text-xs text-[var(--muted)] hover:text-[var(--primary)]">
              {copied === item.label ? "✓" : "复制"}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
        <h2 className="mb-3 text-lg font-semibold">设备信息说明</h2>
        <p className="text-sm leading-relaxed text-[var(--muted)]">
          本工具检测你当前设备和浏览器的详细信息，包括屏幕分辨率、设备像素比、浏览器版本、硬件配置等。
          这些信息对前端开发调试、响应式设计测试非常有用。所有检测在浏览器本地完成，不会发送到服务器。
        </p>
      </div>
    </ToolPageWrapper>
  );
}
