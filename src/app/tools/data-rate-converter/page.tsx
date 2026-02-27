"use client";

import { useState, useMemo } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

const BANDWIDTH_UNITS = ["bps", "Kbps", "Mbps", "Gbps", "Tbps", "B/s", "KB/s", "MB/s", "GB/s"] as const;
const STORAGE_UNITS = ["Bit", "Byte", "KB", "MB", "GB", "TB", "PB", "KiB", "MiB", "GiB", "TiB"] as const;
const FILE_SIZE_UNITS = ["MB", "GB", "TB"] as const;
const SPEED_UNITS = ["Kbps", "Mbps", "Gbps"] as const;

function formatNumber(n: number): string {
  if (n === 0) return "0";
  if (Math.abs(n) >= 1e15 || (Math.abs(n) < 1e-6 && n !== 0)) return n.toExponential(4);
  const s = n.toLocaleString("en-US", { maximumFractionDigits: 6, minimumFractionDigits: 0 });
  return s.replace(/\.?0+$/, "") || "0";
}

function toBaseBps(value: number, unit: (typeof BANDWIDTH_UNITS)[number]): number {
  const isBits = ["bps", "Kbps", "Mbps", "Gbps", "Tbps"].includes(unit);
  const mult = unit === "bps" || unit === "B/s" ? 1 : unit === "Kbps" || unit === "KB/s" ? 1000 : unit === "Mbps" || unit === "MB/s" ? 1e6 : unit === "Gbps" || unit === "GB/s" ? 1e9 : 1e12;
  const bps = isBits ? value * mult : value * mult * 8;
  return bps;
}

function fromBaseBps(bps: number, unit: (typeof BANDWIDTH_UNITS)[number]): number {
  const isBits = ["bps", "Kbps", "Mbps", "Gbps", "Tbps"].includes(unit);
  const mult = unit === "bps" || unit === "B/s" ? 1 : unit === "Kbps" || unit === "KB/s" ? 1000 : unit === "Mbps" || unit === "MB/s" ? 1e6 : unit === "Gbps" || unit === "GB/s" ? 1e9 : 1e12;
  return isBits ? bps / mult : bps / (mult * 8);
}

function toBaseBits(value: number, unit: (typeof STORAGE_UNITS)[number]): number {
  const si = ["Bit", "Byte", "KB", "MB", "GB", "TB", "PB"];
  const bin = ["KiB", "MiB", "GiB", "TiB"];
  if (unit === "Bit") return value;
  if (unit === "Byte") return value * 8;
  if (si.includes(unit)) {
    const idx = si.indexOf(unit);
    const mult = Math.pow(1000, idx - 1);
    return value * mult * 8;
  }
  const idx = bin.indexOf(unit);
  const mult = Math.pow(1024, idx + 1);
  return value * mult * 8;
}

function fromBaseBits(bits: number, unit: (typeof STORAGE_UNITS)[number]): number {
  const si = ["Bit", "Byte", "KB", "MB", "GB", "TB", "PB"];
  const bin = ["KiB", "MiB", "GiB", "TiB"];
  if (unit === "Bit") return bits;
  if (unit === "Byte") return bits / 8;
  if (si.includes(unit)) {
    const idx = si.indexOf(unit);
    const mult = Math.pow(1000, idx - 1);
    return bits / (mult * 8);
  }
  const idx = bin.indexOf(unit);
  const mult = Math.pow(1024, idx + 1);
  return bits / (mult * 8);
}

function fileSizeToBytes(value: number, unit: (typeof FILE_SIZE_UNITS)[number]): number {
  const mult = unit === "MB" ? 1e6 : unit === "GB" ? 1e9 : 1e12;
  return value * mult;
}

function speedToBps(value: number, unit: (typeof SPEED_UNITS)[number]): number {
  const mult = unit === "Kbps" ? 1000 : unit === "Mbps" ? 1e6 : 1e9;
  return value * mult;
}

function formatDuration(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "-";
  if (seconds < 1) return "< 1 秒";
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const parts: string[] = [];
  if (d > 0) parts.push(`${d}天`);
  if (h > 0) parts.push(`${h}小时`);
  if (m > 0) parts.push(`${m}分`);
  if (s > 0 || parts.length === 0) parts.push(`${s}秒`);
  return parts.join(" ");
}

export default function DataRateConverterPage() {
  const [bandwidthVal, setBandwidthVal] = useState("100");
  const [bandwidthUnit, setBandwidthUnit] = useState<(typeof BANDWIDTH_UNITS)[number]>("Mbps");
  const [storageVal, setStorageVal] = useState("1");
  const [storageUnit, setStorageUnit] = useState<(typeof STORAGE_UNITS)[number]>("GB");
  const [fileSizeVal, setFileSizeVal] = useState("10");
  const [fileSizeUnit, setFileSizeUnit] = useState<(typeof FILE_SIZE_UNITS)[number]>("GB");
  const [speedVal, setSpeedVal] = useState("100");
  const [speedUnit, setSpeedUnit] = useState<(typeof SPEED_UNITS)[number]>("Mbps");
  const [copied, setCopied] = useState("");

  const bandwidthResults = useMemo(() => {
    const num = parseFloat(bandwidthVal);
    if (isNaN(num) || bandwidthVal.trim() === "") return null;
    const bps = toBaseBps(num, bandwidthUnit);
    return BANDWIDTH_UNITS.map((u) => ({ unit: u, value: fromBaseBps(bps, u) }));
  }, [bandwidthVal, bandwidthUnit]);

  const storageResults = useMemo(() => {
    const num = parseFloat(storageVal);
    if (isNaN(num) || storageVal.trim() === "") return null;
    const bits = toBaseBits(num, storageUnit);
    return STORAGE_UNITS.map((u) => ({ unit: u, value: fromBaseBits(bits, u) }));
  }, [storageVal, storageUnit]);

  const downloadTime = useMemo(() => {
    const sizeNum = parseFloat(fileSizeVal);
    const speedNum = parseFloat(speedVal);
    if (isNaN(sizeNum) || isNaN(speedNum) || sizeNum <= 0 || speedNum <= 0) return null;
    const bytes = fileSizeToBytes(sizeNum, fileSizeUnit);
    const bps = speedToBps(speedNum, speedUnit);
    const bytesPerSec = bps / 8;
    return bytes / bytesPerSec;
  }, [fileSizeVal, fileSizeUnit, speedVal, speedUnit]);

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 1500);
  };

  const ResultRow = ({ unit, value, copyId }: { unit: string; value: number; copyId: string }) => (
    <tr className="border-b border-[var(--card-border)] last:border-0">
      <td className="py-2.5 pr-4 font-medium">{unit}</td>
      <td className="py-2.5 font-mono text-[var(--primary)]">{formatNumber(value)}</td>
      <td className="py-2.5 pl-2">
        <button onClick={() => copy(formatNumber(value), copyId)} className="text-xs text-[var(--primary)] hover:underline">
          {copied === copyId ? "已复制 ✓" : "复制"}
        </button>
      </td>
    </tr>
  );

  return (
    <ToolPageWrapper>
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">数据速率换算</h1>
        <p className="mt-2 text-[var(--muted)]">
          带宽速率、存储容量单位互转，下载时间估算
        </p>
      </div>

      <section className="mb-12 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
        <h2 className="mb-4 text-lg font-semibold">带宽速率换算</h2>
        <p className="mb-4 text-sm text-[var(--muted)]">1 Byte = 8 bits，1K = 1000（网络速率采用十进制）</p>
        <div className="mb-4 flex flex-wrap gap-3">
          <input
            type="number"
            value={bandwidthVal}
            onChange={(e) => setBandwidthVal(e.target.value)}
            className="textarea-tool w-40 rounded-lg px-3 py-2.5 font-mono text-lg"
          />
          <select
            value={bandwidthUnit}
            onChange={(e) => setBandwidthUnit(e.target.value as (typeof BANDWIDTH_UNITS)[number])}
            className="rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2.5 text-sm"
          >
            {BANDWIDTH_UNITS.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>
        {bandwidthResults && (
          <div className="overflow-x-auto rounded-lg border border-[var(--card-border)]">
            <table className="w-full min-w-[280px]">
              <tbody>
                {bandwidthResults.map((r) => (
                  <ResultRow key={r.unit} unit={r.unit} value={r.value} copyId={`bw-${r.unit}`} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mb-12 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
        <h2 className="mb-4 text-lg font-semibold">存储容量换算</h2>
        <p className="mb-4 text-sm text-[var(--muted)]">KB=1000B（SI 十进制），KiB=1024B（IEC 二进制）</p>
        <div className="mb-4 flex flex-wrap gap-3">
          <input
            type="number"
            value={storageVal}
            onChange={(e) => setStorageVal(e.target.value)}
            className="textarea-tool w-40 rounded-lg px-3 py-2.5 font-mono text-lg"
          />
          <select
            value={storageUnit}
            onChange={(e) => setStorageUnit(e.target.value as (typeof STORAGE_UNITS)[number])}
            className="rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2.5 text-sm"
          >
            {STORAGE_UNITS.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>
        {storageResults && (
          <div className="overflow-x-auto rounded-lg border border-[var(--card-border)]">
            <table className="w-full min-w-[280px]">
              <tbody>
                {storageResults.map((r) => (
                  <ResultRow key={r.unit} unit={r.unit} value={r.value} copyId={`st-${r.unit}`} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
        <h2 className="mb-4 text-lg font-semibold">下载时间计算</h2>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <input
            type="number"
            value={fileSizeVal}
            onChange={(e) => setFileSizeVal(e.target.value)}
            className="textarea-tool w-32 rounded-lg px-3 py-2.5 font-mono"
          />
          <select
            value={fileSizeUnit}
            onChange={(e) => setFileSizeUnit(e.target.value as (typeof FILE_SIZE_UNITS)[number])}
            className="rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2.5 text-sm"
          >
            {FILE_SIZE_UNITS.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
          <span className="text-[var(--muted)]">@</span>
          <input
            type="number"
            value={speedVal}
            onChange={(e) => setSpeedVal(e.target.value)}
            className="textarea-tool w-32 rounded-lg px-3 py-2.5 font-mono"
          />
          <select
            value={speedUnit}
            onChange={(e) => setSpeedUnit(e.target.value as (typeof SPEED_UNITS)[number])}
            className="rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2.5 text-sm"
          >
            {SPEED_UNITS.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>
        {downloadTime !== null && (
          <div className="flex items-center gap-3 rounded-lg border border-[var(--card-border)] bg-[var(--background)] p-4">
            <span className="font-mono text-xl font-bold text-[var(--primary)]">{formatDuration(downloadTime)}</span>
            <button
              onClick={() => copy(formatDuration(downloadTime), "duration")}
              className="btn-primary rounded px-3 py-1.5 text-sm"
            >
              {copied === "duration" ? "已复制 ✓" : "复制"}
            </button>
          </div>
        )}
      </section>
    </ToolPageWrapper>
  );
}
