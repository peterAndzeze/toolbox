"use client";

import { useState, useCallback } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

type Algorithm = "RSA-2048" | "RSA-4096" | "ECDSA-P256" | "ECDSA-P384";
type Format = "pem" | "jwk";

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function toPem(buffer: ArrayBuffer, type: "private" | "public"): string {
  const b64 = arrayBufferToBase64(buffer);
  const lines: string[] = [];
  for (let i = 0; i < b64.length; i += 64) {
    lines.push(b64.slice(i, i + 64));
  }
  const header = type === "private" ? "-----BEGIN PRIVATE KEY-----" : "-----BEGIN PUBLIC KEY-----";
  const footer = type === "private" ? "-----END PRIVATE KEY-----" : "-----END PUBLIC KEY-----";
  return [header, ...lines, footer].join("\n");
}

async function exportKeyPem(key: CryptoKey, type: "private" | "public"): Promise<string> {
  const format = type === "private" ? "pkcs8" : "spki";
  const buffer = await crypto.subtle.exportKey(format, key);
  return toPem(buffer, type);
}

async function exportKeyJwk(key: CryptoKey): Promise<string> {
  const jwk = await crypto.subtle.exportKey("jwk", key);
  return JSON.stringify(jwk, null, 2);
}

export default function KeypairGeneratorPage() {
  const [algorithm, setAlgorithm] = useState<Algorithm>("RSA-2048");
  const [format, setFormat] = useState<Format>("pem");
  const [publicKey, setPublicKey] = useState<CryptoKey | null>(null);
  const [privateKey, setPrivateKey] = useState<CryptoKey | null>(null);
  const [publicKeyText, setPublicKeyText] = useState("");
  const [privateKeyText, setPrivateKeyText] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState("");
  const [signInput, setSignInput] = useState("");
  const [signature, setSignature] = useState("");
  const [verifyResult, setVerifyResult] = useState<boolean | null>(null);

  const generate = useCallback(async () => {
    setLoading(true);
    setPublicKey(null);
    setPrivateKey(null);
    setPublicKeyText("");
    setPrivateKeyText("");
    setSignature("");
    setVerifyResult(null);

    try {
      let keyPair: CryptoKeyPair;

      if (algorithm.startsWith("RSA")) {
        const modulusLength = algorithm === "RSA-2048" ? 2048 : 4096;
        keyPair = await crypto.subtle.generateKey(
          {
            name: "RSASSA-PKCS1-v1_5",
            modulusLength,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256",
          },
          true,
          ["sign", "verify"]
        );
      } else {
        const curve = algorithm === "ECDSA-P256" ? "P-256" : "P-384";
        keyPair = await crypto.subtle.generateKey(
          {
            name: "ECDSA",
            namedCurve: curve,
          },
          true,
          ["sign", "verify"]
        );
      }

      setPublicKey(keyPair.publicKey);
      setPrivateKey(keyPair.privateKey);

      if (format === "pem") {
        setPublicKeyText(await exportKeyPem(keyPair.publicKey, "public"));
        setPrivateKeyText(await exportKeyPem(keyPair.privateKey, "private"));
      } else {
        setPublicKeyText(await exportKeyJwk(keyPair.publicKey));
        setPrivateKeyText(await exportKeyJwk(keyPair.privateKey));
      }
    } finally {
      setLoading(false);
    }
  }, [algorithm, format]);

  const copy = useCallback((text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 1500);
  }, []);

  const signAndVerify = useCallback(async () => {
    if (!privateKey || !publicKey || !signInput.trim()) return;

    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(signInput);
      const sigBuffer = await crypto.subtle.sign(
        algorithm.startsWith("RSA")
          ? { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }
          : { name: "ECDSA", hash: "SHA-256" },
        privateKey,
        data
      );
      const sigB64 = arrayBufferToBase64(sigBuffer);
      setSignature(sigB64);

      const valid = await crypto.subtle.verify(
        algorithm.startsWith("RSA")
          ? { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }
          : { name: "ECDSA", hash: "SHA-256" },
        publicKey,
        sigBuffer,
        data
      );
      setVerifyResult(valid);
    } catch {
      setVerifyResult(false);
    }
  }, [privateKey, publicKey, signInput, algorithm]);

  return (
    <ToolPageWrapper>
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">公私钥生成器</h1>
        <p className="mt-2 text-[var(--muted)]">
          在线生成 RSA 和 ECDSA 密钥对，支持 PEM 和 JWK 格式，浏览器本地处理，保护隐私安全
        </p>
      </div>

      <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
        <div className="flex flex-wrap gap-6">
          <div>
            <label className="mb-2 block text-sm font-medium">算法</label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value as Algorithm)}
              className="rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-4 py-2 text-sm focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
            >
              <option value="RSA-2048">RSA-2048</option>
              <option value="RSA-4096">RSA-4096</option>
              <option value="ECDSA-P256">ECDSA P-256</option>
              <option value="ECDSA-P384">ECDSA P-384</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">格式</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as Format)}
              className="rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-4 py-2 text-sm focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
            >
              <option value="pem">PEM</option>
              <option value="jwk">JWK</option>
            </select>
          </div>
        </div>

        <button
          onClick={generate}
          disabled={loading}
          className="btn-primary mt-6 rounded-lg px-6 py-2.5 text-sm font-medium disabled:opacity-60"
        >
          {loading ? "生成中..." : "生成密钥对"}
        </button>
      </div>

      {(publicKeyText || privateKeyText) && (
        <div className="mt-6 space-y-4">
          <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold">公钥</span>
              <button
                onClick={() => copy(publicKeyText, "public")}
                className="text-xs text-[var(--primary)] hover:underline"
              >
                {copied === "public" ? "已复制 ✓" : "复制"}
              </button>
            </div>
            <textarea
              readOnly
              value={publicKeyText}
              className="textarea-tool h-40 w-full resize-none rounded-lg p-4 font-mono text-sm"
            />
          </div>
          <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold">私钥</span>
              <button
                onClick={() => copy(privateKeyText, "private")}
                className="text-xs text-[var(--primary)] hover:underline"
              >
                {copied === "private" ? "已复制 ✓" : "复制"}
              </button>
            </div>
            <textarea
              readOnly
              value={privateKeyText}
              className="textarea-tool h-40 w-full resize-none rounded-lg p-4 font-mono text-sm"
            />
          </div>
        </div>
      )}

      {privateKey && publicKey && (
        <div className="mt-8 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
          <h2 className="mb-4 text-lg font-semibold">签名验证测试</h2>
          <div>
            <label className="mb-2 block text-sm font-medium">输入文本</label>
            <textarea
              value={signInput}
              onChange={(e) => setSignInput(e.target.value)}
              placeholder="输入要签名的文本..."
              className="textarea-tool h-24 w-full rounded-lg p-4 font-mono text-sm"
              spellCheck={false}
            />
          </div>
          <button
            onClick={signAndVerify}
            disabled={!signInput.trim()}
            className="btn-primary mt-3 rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-60"
          >
            签名并验证
          </button>
          {signature && (
            <div className="mt-4 space-y-3">
              <div>
                <span className="mb-1 block text-sm font-medium">签名 (Base64)</span>
                <p className="break-all rounded-lg border border-[var(--card-border)] bg-[var(--background)] p-3 font-mono text-xs">
                  {signature}
                </p>
              </div>
              {verifyResult !== null && (
                <div
                  className={`rounded-lg p-3 text-sm font-medium ${
                    verifyResult
                      ? "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                  }`}
                >
                  {verifyResult ? "✓ 验证成功" : "✗ 验证失败"}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="mt-12 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
        <h2 className="mb-3 text-lg font-semibold">关于本工具</h2>
        <p className="text-sm leading-relaxed text-[var(--muted)]">
          本工具使用浏览器内置的 Web Crypto API 在本地生成密钥对，私钥不会上传到任何服务器。
          RSA 适用于通用场景，ECDSA 密钥更短、性能更好。PEM 格式兼容 OpenSSL，JWK 适用于 JavaScript 和 JWT。
        </p>
      </div>
    </ToolPageWrapper>
  );
}
