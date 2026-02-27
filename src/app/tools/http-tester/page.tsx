"use client";

import { useState, useCallback } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

const METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"] as const;
const BODY_TYPES = ["JSON", "Form", "Text"] as const;
const MAX_HISTORY = 5;

interface HistoryItem {
  method: string;
  url: string;
  timestamp: number;
}

export default function HttpTesterPage() {
  const [method, setMethod] = useState<(typeof METHODS)[number]>("GET");
  const [url, setUrl] = useState("https://httpbin.org/get");
  const [headers, setHeaders] = useState<{ key: string; value: string }[]>([{ key: "", value: "" }]);
  const [bodyType, setBodyType] = useState<(typeof BODY_TYPES)[number]>("JSON");
  const [body, setBody] = useState("{}");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<number | null>(null);
  const [statusText, setStatusText] = useState("");
  const [responseHeaders, setResponseHeaders] = useState<[string, string][]>([]);
  const [responseBody, setResponseBody] = useState("");
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [headersOpen, setHeadersOpen] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const addToHistory = useCallback((m: string, u: string) => {
    setHistory((prev) => [{ method: m, url: u, timestamp: Date.now() }, ...prev.filter((h) => !(h.method === m && h.url === u))].slice(0, MAX_HISTORY));
  }, []);

  const addHeader = useCallback(() => {
    setHeaders((h) => [...h, { key: "", value: "" }]);
  }, []);

  const removeHeader = useCallback((i: number) => {
    setHeaders((h) => h.filter((_, idx) => idx !== i));
  }, []);

  const updateHeader = useCallback((i: number, field: "key" | "value", val: string) => {
    setHeaders((h) => {
      const next = [...h];
      next[i] = { ...next[i], [field]: val };
      return next;
    });
  }, []);

  const send = useCallback(async () => {
    if (!url.trim()) return;
    setLoading(true);
    setStatus(null);
    setResponseBody("");
    setResponseHeaders([]);
    setResponseTime(null);

    const start = performance.now();
    const filteredHeaders = headers.filter((h) => h.key.trim());
    const headersObj: Record<string, string> = {};
    filteredHeaders.forEach((h) => {
      headersObj[h.key.trim()] = h.value.trim();
    });

    let bodyToSend: string | FormData | undefined;
    if (["POST", "PUT", "PATCH"].includes(method)) {
      if (bodyType === "JSON") {
        headersObj["Content-Type"] = headersObj["Content-Type"] || "application/json";
        bodyToSend = body;
      } else if (bodyType === "Form") {
        const form = new FormData();
        try {
          const lines = body.split("\n").filter((l) => l.trim());
          for (const line of lines) {
            const eq = line.indexOf("=");
            if (eq > 0) {
              const k = line.slice(0, eq).trim();
              const v = line.slice(eq + 1).trim();
              form.append(k, v);
            }
          }
          bodyToSend = form;
          delete headersObj["Content-Type"];
        } catch {
          bodyToSend = body;
        }
      } else {
        headersObj["Content-Type"] = headersObj["Content-Type"] || "text/plain";
        bodyToSend = body;
      }
    }

    const finalHeaders = bodyToSend instanceof FormData
      ? Object.fromEntries(Object.entries(headersObj).filter(([k]) => k.toLowerCase() !== "content-type"))
      : headersObj;

    try {
      const res = await fetch(url, {
        method,
        headers: Object.keys(finalHeaders).length ? finalHeaders : undefined,
        body: bodyToSend instanceof FormData ? bodyToSend : bodyToSend || undefined,
      });
      const end = performance.now();
      setResponseTime(Math.round(end - start));
      setStatus(res.status);
      setStatusText(res.statusText);

      const h: [string, string][] = [];
      res.headers.forEach((v, k) => h.push([k, v]));
      setResponseHeaders(h);

      const contentType = res.headers.get("content-type") || "";
      let text = "";
      if (contentType.includes("application/json")) {
        try {
          const json = await res.json();
          text = JSON.stringify(json, null, 2);
        } catch {
          text = await res.text();
        }
      } else {
        text = await res.text();
      }
      setResponseBody(text);
      addToHistory(method, url);
    } catch (err) {
      setResponseTime(null);
      setResponseBody((err as Error).message);
      setStatus(null);
    } finally {
      setLoading(false);
    }
  }, [method, url, headers, bodyType, body, addToHistory]);

  const statusColor = status != null
    ? status >= 200 && status < 300
      ? "text-green-600 dark:text-green-400"
      : status >= 300 && status < 400
        ? "text-yellow-600 dark:text-yellow-400"
        : "text-red-600 dark:text-red-400"
    : "";

  return (
    <ToolPageWrapper>
      <h1 className="page-title">HTTP 请求测试</h1>
      <p className="page-subtitle">在线发送 HTTP 请求，查看响应状态、头信息和数据。注意：部分接口因 CORS 限制无法跨域请求，建议使用支持 CORS 的 API 或本地服务测试。</p>

      <div className="card mt-6 rounded-xl p-4">
        <div className="mb-4 rounded-lg bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-400">
          <strong>关于 CORS：</strong> 浏览器会阻止跨域请求。若请求失败，可能是目标 API 未允许跨域。可尝试 httpbin.org、jsonplaceholder.typicode.com 等支持 CORS 的接口，或测试您自己的后端 API。
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as (typeof METHODS)[number])}
            className="input rounded-lg px-3 py-2 text-sm font-medium"
          >
            {METHODS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://api.example.com/endpoint"
            className="input flex-1 min-w-[200px] rounded-lg px-3 py-2 text-sm"
          />
          <button onClick={send} disabled={loading} className="btn-primary rounded-lg px-6 py-2 text-sm font-medium disabled:opacity-60">
            {loading ? "请求中..." : "发送"}
          </button>
        </div>

        <div className="mb-4">
          <button
            onClick={() => setHeadersOpen((o) => !o)}
            className="text-sm font-medium text-[var(--muted)] hover:text-[var(--primary)]"
          >
            {headersOpen ? "收起" : "展开"} 请求头
          </button>
          {headersOpen && (
            <div className="mt-2 space-y-2">
              {headers.map((h, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={h.key}
                    onChange={(e) => updateHeader(i, "key", e.target.value)}
                    placeholder="Header 名"
                    className="input flex-1 rounded-lg px-3 py-2 text-sm"
                  />
                  <input
                    value={h.value}
                    onChange={(e) => updateHeader(i, "value", e.target.value)}
                    placeholder="值"
                    className="input flex-1 rounded-lg px-3 py-2 text-sm"
                  />
                  <button onClick={() => removeHeader(i)} className="rounded border border-red-500/50 px-2 text-red-500 hover:bg-red-500/10">
                    删除
                  </button>
                </div>
              ))}
              <button onClick={addHeader} className="rounded border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-1 text-sm hover:border-[var(--primary)]">
                + 添加请求头
              </button>
            </div>
          )}
        </div>

        {["POST", "PUT", "PATCH"].includes(method) && (
          <div className="mb-4">
            <div className="mb-2 flex gap-2">
              {BODY_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setBodyType(t)}
                  className={`rounded px-3 py-1 text-sm ${bodyType === t ? "btn-primary" : "border border-[var(--card-border)] bg-[var(--card-bg)] hover:border-[var(--primary)]"}`}
                >
                  {t}
                </button>
              ))}
            </div>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={bodyType === "JSON" ? '{"key": "value"}' : bodyType === "Form" ? "key1=value1\nkey2=value2" : "请求体文本"}
              className="textarea-tool h-32 w-full rounded-lg p-4 font-mono text-sm"
              spellCheck={false}
            />
          </div>
        )}

        {status != null && (
          <div className="mb-4 rounded-lg border border-[var(--card-border)] p-4">
            <div className="mb-2 flex items-center gap-2">
              <span className={`font-mono font-bold ${statusColor}`}>{status} {statusText}</span>
              {responseTime != null && <span className="text-sm text-[var(--muted)]">{responseTime} ms</span>}
            </div>
            <details className="text-sm">
              <summary className="cursor-pointer font-medium text-[var(--muted)]">响应头</summary>
              <pre className="mt-2 overflow-auto rounded bg-[var(--card-bg)] p-3 font-mono text-xs">
                {responseHeaders.map(([k, v]) => `${k}: ${v}`).join("\n")}
              </pre>
            </details>
            <div className="mt-3">
              <label className="block text-sm font-medium text-[var(--muted)]">响应体</label>
              <pre className="textarea-tool mt-1 max-h-64 overflow-auto rounded-lg p-4 font-mono text-sm whitespace-pre-wrap">
                {responseBody}
              </pre>
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div className="mt-4">
            <h3 className="mb-2 text-sm font-semibold">最近请求</h3>
            <div className="flex flex-wrap gap-2">
              {history.map((h, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setMethod(h.method as (typeof METHODS)[number]);
                    setUrl(h.url);
                  }}
                  className="rounded border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-1 text-xs hover:border-[var(--primary)]"
                >
                  {h.method} {h.url}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolPageWrapper>
  );
}
