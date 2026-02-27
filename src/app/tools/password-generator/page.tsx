"use client";

import { useState, useCallback } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

const CHAR_SETS = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
};

const DEFAULT_SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

function generatePassword(length: number, options: Record<string, boolean>, symbols: string): string {
  let chars = "";
  if (options.lowercase) chars += CHAR_SETS.lowercase;
  if (options.uppercase) chars += CHAR_SETS.uppercase;
  if (options.numbers) chars += CHAR_SETS.numbers;
  if (options.symbols && symbols) chars += symbols;
  if (!chars) chars = CHAR_SETS.lowercase + CHAR_SETS.numbers;

  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (v) => chars[v % chars.length]).join("");
}

function getStrength(password: string): { label: string; color: string; width: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 2) return { label: "弱", color: "bg-red-500", width: "w-1/4" };
  if (score <= 3) return { label: "一般", color: "bg-yellow-500", width: "w-1/2" };
  if (score <= 4) return { label: "强", color: "bg-blue-500", width: "w-3/4" };
  return { label: "非常强", color: "bg-green-500", width: "w-full" };
}

export default function PasswordGeneratorPage() {
  const [length, setLength] = useState(16);
  const [count, setCount] = useState(5);
  const [options, setOptions] = useState({
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: true,
  });
  const [customSymbols, setCustomSymbols] = useState(DEFAULT_SYMBOLS);
  const [passwords, setPasswords] = useState<string[]>(() => {
    const opts = { lowercase: true, uppercase: true, numbers: true, symbols: true };
    return Array.from({ length: 5 }, () => generatePassword(16, opts, DEFAULT_SYMBOLS));
  });
  const [copied, setCopied] = useState(-1);

  const generate = useCallback(() => {
    const list = Array.from({ length: count }, () =>
      generatePassword(length, options, customSymbols)
    );
    setPasswords(list);
  }, [length, count, options, customSymbols]);

  const copyText = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(-1), 2000);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(passwords.join("\n"));
    setCopied(-2);
    setTimeout(() => setCopied(-1), 2000);
  };

  const strength = passwords.length > 0 ? getStrength(passwords[0]) : null;

  const optionLabels: Record<string, string> = {
    lowercase: "小写字母 (a-z)",
    uppercase: "大写字母 (A-Z)",
    numbers: "数字 (0-9)",
    symbols: "符号 (!@#$...)",
  };

  return (
    <ToolPageWrapper>
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">密码生成器</h1>
        <p className="mt-2 text-[var(--muted)]">
          批量生成安全随机密码，自定义长度和字符类型，使用加密随机数
        </p>
      </div>

      <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">
              密码长度: {length}
            </label>
            <input
              type="range"
              min={4}
              max={64}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full accent-[var(--primary)]"
            />
            <div className="mt-1 flex justify-between text-xs text-[var(--muted)]">
              <span>4</span>
              <span>64</span>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">
              生成数量: {count}
            </label>
            <input
              type="range"
              min={1}
              max={10}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full accent-[var(--primary)]"
            />
            <div className="mt-1 flex justify-between text-xs text-[var(--muted)]">
              <span>1</span>
              <span>10</span>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {Object.entries(optionLabels).map(([key, label]) => (
            <label key={key} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={options[key as keyof typeof options]}
                onChange={(e) => setOptions((o) => ({ ...o, [key]: e.target.checked }))}
                className="h-4 w-4 rounded accent-[var(--primary)]"
              />
              {label}
            </label>
          ))}
        </div>

        {options.symbols && (
          <div className="mt-3">
            <label className="mb-1.5 block text-sm font-medium">自定义符号字符</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customSymbols}
                onChange={(e) => setCustomSymbols(e.target.value)}
                placeholder="输入要包含的符号字符"
                className="flex-1 rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 font-mono text-sm outline-none focus:border-[var(--primary)]"
              />
              <button
                onClick={() => setCustomSymbols(DEFAULT_SYMBOLS)}
                className="shrink-0 rounded-lg border border-[var(--card-border)] px-3 py-2 text-xs hover:border-[var(--primary)]"
              >
                重置
              </button>
            </div>
            <p className="mt-1 text-xs text-[var(--muted)]">
              可删除不需要的符号，某些网站不接受特定符号
            </p>
          </div>
        )}

        <button
          onClick={generate}
          className="btn-primary mt-6 w-full rounded-lg py-3 text-sm font-medium"
        >
          生成 {count} 个密码
        </button>
      </div>

      {passwords.length > 0 && (
        <div className="mt-6">
          {strength && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--muted)]">密码强度</span>
                <span className="font-medium">{strength.label}</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-[var(--card-border)]">
                <div className={`h-full rounded-full transition-all ${strength.color} ${strength.width}`} />
              </div>
            </div>
          )}
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">{passwords.length} 个密码</span>
            <button
              onClick={copyAll}
              className="text-xs text-[var(--primary)] hover:underline"
            >
              {copied === -2 ? "已复制 ✓" : "复制全部"}
            </button>
          </div>
          <div className="space-y-2">
            {passwords.map((pwd, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-2.5"
              >
                <span className="flex-1 truncate font-mono text-sm tracking-wide">{pwd}</span>
                <button
                  onClick={() => copyText(pwd, i)}
                  className="ml-3 shrink-0 text-xs text-[var(--primary)] hover:underline"
                >
                  {copied === i ? "已复制 ✓" : "复制"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-12 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
        <h2 className="mb-3 text-lg font-semibold">密码安全建议</h2>
        <ul className="space-y-2 text-sm leading-relaxed text-[var(--muted)]">
          <li>• 使用至少 12 位以上的密码，包含大小写字母、数字和符号</li>
          <li>• 不同网站使用不同密码，避免一个泄露全部中招</li>
          <li>• 使用密码管理器（如 1Password、Bitwarden）来管理密码</li>
          <li>• 本工具使用浏览器加密随机数 (crypto.getRandomValues) 生成密码，安全可靠</li>
        </ul>
      </div>
    </ToolPageWrapper>
  );
}
