"use client";

import { useState, useCallback, useEffect } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

interface IpInfo {
  ip: string;
  hostname?: string;
  city?: string;
  region?: string;
  country?: string;
  loc?: string;
  org?: string;
  postal?: string;
  timezone?: string;
}

export default function IpLookupPage() {
  const [currentIp, setCurrentIp] = useState<IpInfo | null>(null);
  const [lookupIp, setLookupIp] = useState("");
  const [lookupResult, setLookupResult] = useState<IpInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [error, setError] = useState("");
  const [lookupError, setLookupError] = useState("");
  const [copied, setCopied] = useState("");

  const fetchIpInfo = useCallback(async (ip?: string): Promise<IpInfo | null> => {
    const url = ip
      ? `https://ipinfo.io/${encodeURIComponent(ip)}/json`
      : "https://ipinfo.io/json";
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`请求失败: ${res.status}`);
    }
    const data = (await res.json()) as IpInfo;
    if (data.ip === undefined) {
      throw new Error("API 返回数据异常");
    }
    return data;
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    fetchIpInfo()
      .then((data) => {
        if (!cancelled) {
          setCurrentIp(data);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError((e as Error).message);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [fetchIpInfo]);

  const handleLookup = useCallback(async () => {
    const ip = lookupIp.trim();
    if (!ip) {
      setLookupError("请输入要查询的 IP 地址");
      return;
    }
    setLookupLoading(true);
    setLookupError("");
    setLookupResult(null);
    try {
      const data = await fetchIpInfo(ip);
      setLookupResult(data);
    } catch (e) {
      setLookupError((e as Error).message);
    } finally {
      setLookupLoading(false);
    }
  }, [lookupIp, fetchIpInfo]);

  const copyIp = useCallback((ip: string, label: string) => {
    navigator.clipboard.writeText(ip);
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  }, []);

  const InfoCard = ({ data, title }: { data: IpInfo; title: string }) => (
    <div className="card rounded-xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold">{title}</h3>
        <button
          onClick={() => copyIp(data.ip, data.ip)}
          className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-1.5 text-xs font-medium hover:border-[var(--primary)]"
        >
          {copied === data.ip ? "已复制 ✓" : "复制 IP"}
        </button>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-[var(--muted)]">IP 地址</span>
          <span className="font-mono text-[var(--primary)]">{data.ip}</span>
        </div>
        {data.city && (
          <div className="flex justify-between">
            <span className="text-[var(--muted)]">城市</span>
            <span>{data.city}</span>
          </div>
        )}
        {data.region && (
          <div className="flex justify-between">
            <span className="text-[var(--muted)]">地区</span>
            <span>{data.region}</span>
          </div>
        )}
        {data.country && (
          <div className="flex justify-between">
            <span className="text-[var(--muted)]">国家</span>
            <span>{data.country}</span>
          </div>
        )}
        {data.loc && (
          <div className="flex justify-between">
            <span className="text-[var(--muted)]">经纬度</span>
            <span className="font-mono text-xs">{data.loc}</span>
          </div>
        )}
        {data.org && (
          <div className="flex justify-between">
            <span className="text-[var(--muted)]">运营商/组织</span>
            <span className="text-right">{data.org}</span>
          </div>
        )}
        {data.postal && (
          <div className="flex justify-between">
            <span className="text-[var(--muted)]">邮编</span>
            <span>{data.postal}</span>
          </div>
        )}
        {data.timezone && (
          <div className="flex justify-between">
            <span className="text-[var(--muted)]">时区</span>
            <span>{data.timezone}</span>
          </div>
        )}
        {data.hostname && (
          <div className="flex justify-between">
            <span className="text-[var(--muted)]">主机名</span>
            <span className="font-mono text-xs">{data.hostname}</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <ToolPageWrapper>
      <h1 className="page-title">IP 地址查询</h1>
      <p className="page-subtitle">
        查看您的公网 IP 地址、地理位置、运营商等信息，支持查询任意 IP
      </p>

      <div className="mt-6 space-y-6">
        <section>
          <h2 className="mb-3 text-lg font-semibold">当前 IP 信息</h2>
          {loading && (
            <div className="card flex items-center justify-center rounded-xl p-12">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
            </div>
          )}
          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}
          {!loading && !error && currentIp && (
            <InfoCard data={currentIp} title="您的公网 IP" />
          )}
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">查询其他 IP</h2>
          <div className="flex flex-wrap gap-2">
            <input
              type="text"
              value={lookupIp}
              onChange={(e) => setLookupIp(e.target.value)}
              placeholder="输入 IP 地址，如 8.8.8.8"
              className="input flex-1 min-w-[200px] rounded-lg px-4 py-2.5 font-mono"
            />
            <button
              onClick={handleLookup}
              disabled={lookupLoading}
              className="btn-primary rounded-lg px-5 py-2.5 text-sm font-medium disabled:opacity-50"
            >
              {lookupLoading ? "查询中..." : "查询"}
            </button>
          </div>
          {lookupError && (
            <div className="mt-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {lookupError}
            </div>
          )}
          {lookupResult && (
            <div className="mt-4">
              <InfoCard data={lookupResult} title="查询结果" />
            </div>
          )}
        </section>
      </div>
    </ToolPageWrapper>
  );
}
