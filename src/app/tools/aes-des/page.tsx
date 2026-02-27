"use client";

import { useState, useCallback } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

const KEY_SIZES = [128, 192, 256] as const;
const IV_LENGTH_CBC = 16;
const IV_LENGTH_GCM = 12;

function hexToBytes(hex: string): Uint8Array {
  const clean = hex.replace(/\s/g, "");
  if (clean.length % 2 !== 0) throw new Error("Hex 长度必须为偶数");
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    const byte = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
    if (isNaN(byte)) throw new Error("无效的 Hex 字符");
    bytes[i] = byte;
  }
  return bytes;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function randomHex(length: number): string {
  const arr = new Uint8Array(length);
  crypto.getRandomValues(arr);
  return bytesToHex(arr);
}

export default function AesDesPage() {
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [algorithm, setAlgorithm] = useState<"AES-CBC" | "AES-GCM">("AES-CBC");
  const [keySize, setKeySize] = useState<128 | 192 | 256>(256);
  const [outputFormat, setOutputFormat] = useState<"Base64" | "Hex">("Base64");
  const [plaintext, setPlaintext] = useState("");
  const [key, setKey] = useState("");
  const [iv, setIv] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const keyByteLength = keySize / 8;
  const ivByteLength = algorithm === "AES-CBC" ? IV_LENGTH_CBC : IV_LENGTH_GCM;

  const generateKey = useCallback(() => {
    setKey(randomHex(keyByteLength));
    setError("");
  }, [keyByteLength]);

  const generateIv = useCallback(() => {
    setIv(randomHex(ivByteLength));
    setError("");
  }, [ivByteLength]);

  const process = useCallback(async () => {
    setError("");
    setResult("");
    try {
      const keyBytes = hexToBytes(key);

      if (keyBytes.length !== keyByteLength) {
        throw new Error(`密钥长度应为 ${keyByteLength} 字节（${keyByteLength * 2} 个 Hex 字符）`);
      }

      const ivBytes = iv.trim() ? hexToBytes(iv) : null;

      if (mode === "encrypt") {
        const ivToUse = ivBytes ?? crypto.getRandomValues(new Uint8Array(ivByteLength));
        if (!ivBytes) setIv(bytesToHex(ivToUse));

        const cryptoKey = await crypto.subtle.importKey(
          "raw",
          keyBytes.buffer.slice(0) as ArrayBuffer,
          { name: algorithm, length: keySize },
          false,
          ["encrypt"]
        );

        const encoder = new TextEncoder();
        const data = encoder.encode(plaintext);

        const algoParams =
          algorithm === "AES-CBC"
            ? { name: "AES-CBC", iv: ivToUse }
            : { name: "AES-GCM", iv: ivToUse, tagLength: 128 };

        const encrypted = await crypto.subtle.encrypt(algoParams, cryptoKey, data);

        const resultBytes = new Uint8Array(encrypted);
        setResult(
          outputFormat === "Base64"
            ? btoa(String.fromCharCode(...resultBytes))
            : bytesToHex(resultBytes)
        );
      } else {
        if (!ivBytes || ivBytes.length !== ivByteLength) {
          throw new Error(`解密需要提供 IV（${ivByteLength} 字节 = ${ivByteLength * 2} 个 Hex 字符）`);
        }

        let cipherBytes: Uint8Array;
        if (outputFormat === "Base64") {
          const binary = atob(plaintext.trim());
          cipherBytes = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) cipherBytes[i] = binary.charCodeAt(i);
        } else {
          cipherBytes = hexToBytes(plaintext.trim());
        }

        const cryptoKey = await crypto.subtle.importKey(
          "raw",
          keyBytes.buffer.slice(0) as ArrayBuffer,
          { name: algorithm, length: keySize },
          false,
          ["decrypt"]
        );

        const algoParams =
          algorithm === "AES-CBC"
            ? { name: "AES-CBC", iv: ivBytes }
            : { name: "AES-GCM", iv: ivBytes, tagLength: 128 };

        const decrypted = await crypto.subtle.decrypt(
          algoParams,
          cryptoKey,
          cipherBytes.buffer.slice(cipherBytes.byteOffset, cipherBytes.byteOffset + cipherBytes.byteLength) as ArrayBuffer
        );
        const decoder = new TextDecoder();
        setResult(decoder.decode(decrypted));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "操作失败");
    }
  }, [mode, algorithm, keySize, outputFormat, plaintext, key, iv, keyByteLength, ivByteLength]);

  const copyResult = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <ToolPageWrapper>
      <h1 className="page-title text-2xl font-bold sm:text-3xl">AES/DES 加解密</h1>
      <p className="page-subtitle mt-2 text-[var(--muted)]">
        使用 Web Crypto API 进行 AES-CBC、AES-GCM 对称加密，支持 128/192/256 位密钥
      </p>

      <div className="card mt-6 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
        <div className="mb-4 flex flex-wrap gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--muted)]">模式</label>
            <div className="flex gap-2">
              {(["encrypt", "decrypt"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setMode(m);
                    setResult("");
                    setError("");
                  }}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    mode === m ? "btn-primary" : "border border-[var(--card-border)] bg-[var(--card-bg)]"
                  }`}
                >
                  {m === "encrypt" ? "加密" : "解密"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--muted)]">算法</label>
            <select
              value={algorithm}
              onChange={(e) => {
                setAlgorithm(e.target.value as "AES-CBC" | "AES-GCM");
                setIv("");
                setResult("");
                setError("");
              }}
              className="input rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-2 text-sm"
            >
              <option value="AES-CBC">AES-CBC</option>
              <option value="AES-GCM">AES-GCM</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--muted)]">密钥长度</label>
            <select
              value={keySize}
              onChange={(e) => {
                setKeySize(Number(e.target.value) as 128 | 192 | 256);
                setKey("");
                setResult("");
                setError("");
              }}
              className="input rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-2 text-sm"
            >
              {KEY_SIZES.map((s) => (
                <option key={s} value={s}>
                  {s} 位
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--muted)]">输出格式</label>
            <select
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value as "Base64" | "Hex")}
              className="input rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-2 text-sm"
            >
              <option value="Base64">Base64</option>
              <option value="Hex">Hex</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--muted)]">
              {mode === "encrypt" ? "明文" : "密文"}
            </label>
            <textarea
              value={plaintext}
              onChange={(e) => setPlaintext(e.target.value)}
              placeholder={
                mode === "encrypt"
                  ? "输入要加密的文本..."
                  : "输入密文（Base64 或 Hex 格式）..."
              }
              className="textarea-tool h-32 w-full rounded-lg p-4 font-mono text-sm"
              spellCheck={false}
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-[var(--muted)]">
                密钥（Hex，{keyByteLength * 2} 字符）
              </label>
              <button
                onClick={generateKey}
                className="text-xs text-[var(--primary)] hover:underline"
              >
                随机生成
              </button>
            </div>
            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder={`例如 ${"00".repeat(keyByteLength)}`}
              className="input w-full rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-2 font-mono text-sm"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-[var(--muted)]">
                IV（Hex，{ivByteLength * 2} 字符，解密必填）
              </label>
              <button onClick={generateIv} className="text-xs text-[var(--primary)] hover:underline">
                随机生成
              </button>
            </div>
            <input
              type="text"
              value={iv}
              onChange={(e) => setIv(e.target.value)}
              placeholder={`例如 ${"00".repeat(ivByteLength)}`}
              className="input w-full rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-2 font-mono text-sm"
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={process} className="btn-primary rounded-lg px-6 py-2 text-sm font-medium">
            {mode === "encrypt" ? "加密" : "解密"}
          </button>
          {result && (
            <button
              onClick={copyResult}
              className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-2 text-sm font-medium hover:border-[var(--primary)]"
            >
              {copied ? "已复制 ✓" : "复制结果"}
            </button>
          )}
        </div>

        {result && (
          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-[var(--muted)]">结果</label>
            <textarea
              value={result}
              readOnly
              className="textarea-tool h-24 w-full rounded-lg p-4 font-mono text-sm"
            />
          </div>
        )}
      </div>

      <div className="mt-12 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
        <h2 className="mb-3 text-lg font-semibold">关于 AES 加密</h2>
        <p className="text-sm leading-relaxed text-[var(--muted)]">
          AES（高级加密标准）是一种对称加密算法，支持 128、192、256 位密钥。AES-CBC 需要 16 字节 IV，AES-GCM 需要 12 字节 IV 并自带认证。本工具使用浏览器 Web Crypto API，所有加解密均在本地完成，数据不会上传。
        </p>
      </div>
    </ToolPageWrapper>
  );
}
