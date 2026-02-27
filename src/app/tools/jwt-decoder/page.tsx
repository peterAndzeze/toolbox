"use client";

import { useState, useMemo } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

function decodeJwt(token: string) {
  const parts = token.trim().split(".");
  if (parts.length !== 3) throw new Error("JWT 格式错误：需要 3 个部分（header.payload.signature）");

  const decode = (str: string) => {
    const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  };

  const header = decode(parts[0]);
  const payload = decode(parts[1]);

  let expiryInfo = "";
  if (payload.exp) {
    const expDate = new Date(payload.exp * 1000);
    const now = new Date();
    expiryInfo = expDate > now
      ? `有效期至 ${expDate.toLocaleString()}（还剩 ${Math.round((expDate.getTime() - now.getTime()) / 3600000)} 小时）`
      : `已过期于 ${expDate.toLocaleString()}`;
  }

  return { header, payload, signature: parts[2], expiryInfo };
}

const SAMPLE = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IuW8oOS4iSIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxOTAwMDAwMDAwfQ.GmGHs5T5gKxmCVr7tqVGvVTbqE9xMnNjj5a0XcfpVUk";

export default function JwtDecoderPage() {
  const [token, setToken] = useState("");
  const [copied, setCopied] = useState("");

  const result = useMemo(() => {
    if (!token.trim()) return null;
    try { return { ...decodeJwt(token), error: "" }; }
    catch (e) { return { header: null, payload: null, signature: "", expiryInfo: "", error: (e as Error).message }; }
  }, [token]);

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 1500);
  };

  return (
    <ToolPageWrapper>
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">JWT 解码器</h1>
        <p className="mt-2 text-[var(--muted)]">解析 JSON Web Token，查看 Header、Payload 和过期时间</p>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium">JWT Token</label>
          <button onClick={() => setToken(SAMPLE)} className="text-xs text-[var(--primary)] hover:underline">加载示例</button>
        </div>
        <textarea value={token} onChange={(e) => setToken(e.target.value)} placeholder="粘贴 JWT Token..." className="textarea-tool h-32 w-full rounded-lg p-4 font-mono text-sm" spellCheck={false} />
      </div>

      {result?.error && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">{result.error}</div>
      )}

      {result?.header && (
        <div className="mt-6 space-y-4">
          {result.expiryInfo && (
            <div className={`rounded-lg p-3 text-sm font-medium ${result.expiryInfo.includes("已过期") ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400" : "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"}`}>
              {result.expiryInfo}
            </div>
          )}
          {[{ label: "Header", data: result.header }, { label: "Payload", data: result.payload }].map(({ label, data }) => (
            <div key={label} className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold">{label}</span>
                <button onClick={() => copy(JSON.stringify(data, null, 2), label)} className="text-xs text-[var(--primary)] hover:underline">{copied === label ? "已复制 ✓" : "复制"}</button>
              </div>
              <pre className="overflow-auto font-mono text-sm text-[var(--muted)]">{JSON.stringify(data, null, 2)}</pre>
            </div>
          ))}
          <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
            <span className="text-sm font-semibold">Signature</span>
            <p className="mt-2 break-all font-mono text-xs text-[var(--muted)]">{result.signature}</p>
          </div>
        </div>
      )}

      <div className="mt-12 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
        <h2 className="mb-3 text-lg font-semibold">什么是 JWT？</h2>
        <p className="text-sm leading-relaxed text-[var(--muted)]">
          JSON Web Token (JWT) 是一种开放标准，用于在各方之间安全地传输 JSON 信息。JWT 由三部分组成：Header（算法信息）、Payload（数据）和 Signature（签名）。
          常用于身份认证和授权。注意：本工具仅解码 Token，不验证签名。
        </p>
      </div>
    </ToolPageWrapper>
  );
}
