"use client";

import { useState, useMemo } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

const COMMON_CIDRS = [8, 16, 24, 25, 26, 27, 28, 30, 32];

function parseIP(ip: string): number | null {
  const parts = ip.trim().split(".");
  if (parts.length !== 4) return null;
  let n = 0;
  for (let i = 0; i < 4; i++) {
    const octet = parseInt(parts[i], 10);
    if (isNaN(octet) || octet < 0 || octet > 255) return null;
    n = (n << 8) | octet;
  }
  return n >>> 0;
}

function toDotted(n: number): string {
  return [
    (n >>> 24) & 0xff,
    (n >>> 16) & 0xff,
    (n >>> 8) & 0xff,
    n & 0xff,
  ].join(".");
}

function cidrToMask(cidr: number): number {
  return cidr >= 32 ? 0xffffffff : (0xffffffff << (32 - cidr)) >>> 0;
}

function getIPClass(firstOctet: number): string {
  if (firstOctet >= 1 && firstOctet <= 126) return "A类";
  if (firstOctet >= 128 && firstOctet <= 191) return "B类";
  if (firstOctet >= 192 && firstOctet <= 223) return "C类";
  if (firstOctet >= 224 && firstOctet <= 239) return "D类";
  return "E类";
}

function isPrivate(ip: number): boolean {
  const o1 = (ip >>> 24) & 0xff;
  const o2 = (ip >>> 16) & 0xff;
  if (o1 === 10) return true;
  if (o1 === 172 && o2 >= 16 && o2 <= 31) return true;
  if (o1 === 192 && o2 === 168) return true;
  return false;
}

export default function SubnetCalculatorPage() {
  const [ipInput, setIpInput] = useState("192.168.1.0");
  const [cidr, setCidr] = useState(24);

  const result = useMemo(() => {
    const ip = parseIP(ipInput);
    if (ip === null) return null;

    const mask = cidrToMask(cidr);
    const network = (ip & mask) >>> 0;
    const broadcast = (network | ~mask) >>> 0;
    const firstHost = cidr >= 31 ? network : network + 1;
    const lastHost = cidr >= 31 ? broadcast : broadcast - 1;
    const hostCount = cidr >= 31 ? 0 : broadcast - network - 1;

    return {
      ip,
      mask,
      network,
      broadcast,
      firstHost,
      lastHost,
      hostCount,
      ipClass: getIPClass((ip >>> 24) & 0xff),
      private: isPrivate(ip),
    };
  }, [ipInput, cidr]);

  const maskBits = useMemo(() => {
    const mask = cidrToMask(cidr);
    const bits: boolean[] = [];
    for (let i = 31; i >= 0; i--) {
      bits.push(((mask >>> i) & 1) === 1);
    }
    return bits;
  }, [cidr]);

  const isValidIP = parseIP(ipInput) !== null;

  return (
    <ToolPageWrapper>
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">子网掩码计算器</h1>
        <p className="mt-2 text-[var(--muted)]">
          输入 IP 地址和 CIDR 前缀，计算网络地址、广播地址、可用主机范围
        </p>
      </div>

      <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">IP 地址</label>
          <input
            type="text"
            value={ipInput}
            onChange={(e) => setIpInput(e.target.value)}
            placeholder="192.168.1.0"
            className={`textarea-tool w-full rounded-lg px-4 py-3 font-mono text-lg ${!isValidIP && ipInput.trim() ? "border-red-500" : ""}`}
            spellCheck={false}
          />
          {!isValidIP && ipInput.trim() && (
            <p className="mt-1 text-sm text-red-500">请输入有效的 IP 地址（4 个 0-255 的八位组）</p>
          )}
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">CIDR 前缀 / 子网掩码</label>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[var(--muted)]">/</span>
              <select
                value={cidr}
                onChange={(e) => setCidr(Number(e.target.value))}
                className="rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 font-mono text-sm"
              >
                {Array.from({ length: 32 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <span className="text-[var(--muted)]">=</span>
            <span className="font-mono text-sm font-medium">{toDotted(cidrToMask(cidr))}</span>
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">常用子网</label>
          <div className="flex flex-wrap gap-2">
            {COMMON_CIDRS.map((n) => (
              <button
                key={n}
                onClick={() => setCidr(n)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${cidr === n ? "btn-primary" : "border border-[var(--card-border)] bg-[var(--background)] hover:border-[var(--primary)]"}`}
              >
                /{n}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">子网掩码位表示</label>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-2 rounded-lg border border-[var(--card-border)] bg-[var(--background)] p-3 font-mono text-xs">
            {[0, 1, 2, 3].map((group) => (
              <div key={group} className="flex items-center gap-0.5">
                {maskBits.slice(group * 8, group * 8 + 8).map((isNetwork, i) => (
                  <span
                    key={group * 8 + i}
                    className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded ${isNetwork ? "bg-[var(--primary)] text-white" : "bg-[var(--card-border)] text-[var(--muted)]"}`}
                  >
                    {isNetwork ? 1 : 0}
                  </span>
                ))}
                {group < 3 && <span className="ml-0.5 text-[var(--muted)]">.</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {result && (
        <div className="mt-6 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
          <h2 className="mb-4 text-lg font-semibold">计算结果</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-[var(--card-border)] bg-[var(--background)] p-4">
              <p className="mb-1 text-xs text-[var(--muted)]">IP 地址</p>
              <p className="font-mono font-medium">{toDotted(result.ip)}</p>
            </div>
            <div className="rounded-lg border border-[var(--card-border)] bg-[var(--background)] p-4">
              <p className="mb-1 text-xs text-[var(--muted)]">子网掩码</p>
              <p className="font-mono font-medium">{toDotted(result.mask)}</p>
            </div>
            <div className="rounded-lg border border-[var(--card-border)] bg-[var(--background)] p-4">
              <p className="mb-1 text-xs text-[var(--muted)]">CIDR 表示</p>
              <p className="font-mono font-medium">/{cidr}</p>
            </div>
            <div className="rounded-lg border border-[var(--card-border)] bg-[var(--background)] p-4">
              <p className="mb-1 text-xs text-[var(--muted)]">网络地址</p>
              <p className="font-mono font-medium">{toDotted(result.network)}</p>
            </div>
            <div className="rounded-lg border border-[var(--card-border)] bg-[var(--background)] p-4">
              <p className="mb-1 text-xs text-[var(--muted)]">广播地址</p>
              <p className="font-mono font-medium">{toDotted(result.broadcast)}</p>
            </div>
            <div className="rounded-lg border border-[var(--card-border)] bg-[var(--background)] p-4">
              <p className="mb-1 text-xs text-[var(--muted)]">可用主机范围</p>
              <p className="font-mono font-medium">
                {cidr >= 31 ? "-" : `${toDotted(result.firstHost)} - ${toDotted(result.lastHost)}`}
              </p>
            </div>
            <div className="rounded-lg border border-[var(--card-border)] bg-[var(--background)] p-4">
              <p className="mb-1 text-xs text-[var(--muted)]">可用主机数</p>
              <p className="font-mono font-medium">{result.hostCount}</p>
            </div>
            <div className="rounded-lg border border-[var(--card-border)] bg-[var(--background)] p-4">
              <p className="mb-1 text-xs text-[var(--muted)]">IP 类型</p>
              <p className="font-medium">{result.ipClass}</p>
            </div>
            <div className="rounded-lg border border-[var(--card-border)] bg-[var(--background)] p-4">
              <p className="mb-1 text-xs text-[var(--muted)]">是否私有地址</p>
              <p className="font-medium">{result.private ? "是" : "否"}</p>
            </div>
          </div>
        </div>
      )}
    </ToolPageWrapper>
  );
}
