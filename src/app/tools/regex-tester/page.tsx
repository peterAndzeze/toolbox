"use client";

import { useState, useMemo } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

interface MatchResult {
  match: string;
  index: number;
  groups: string[];
}

export default function RegexTesterPage() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testStr, setTestStr] = useState("");
  const [error, setError] = useState("");

  const results = useMemo((): MatchResult[] => {
    if (!pattern || !testStr) { setError(""); return []; }
    try {
      const regex = new RegExp(pattern, flags);
      setError("");
      const matches: MatchResult[] = [];
      let match;
      if (flags.includes("g")) {
        while ((match = regex.exec(testStr)) !== null) {
          matches.push({ match: match[0], index: match.index, groups: match.slice(1) });
          if (!match[0]) break;
        }
      } else {
        match = regex.exec(testStr);
        if (match) {
          matches.push({ match: match[0], index: match.index, groups: match.slice(1) });
        }
      }
      return matches;
    } catch (e) {
      setError((e as Error).message);
      return [];
    }
  }, [pattern, flags, testStr]);

  const highlighted = useMemo(() => {
    if (!pattern || !testStr || error) return null;
    try {
      const regex = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
      const parts: { text: string; isMatch: boolean }[] = [];
      let lastIndex = 0;
      let match;
      while ((match = regex.exec(testStr)) !== null) {
        if (match.index > lastIndex) {
          parts.push({ text: testStr.slice(lastIndex, match.index), isMatch: false });
        }
        parts.push({ text: match[0], isMatch: true });
        lastIndex = match.index + match[0].length;
        if (!match[0]) break;
      }
      if (lastIndex < testStr.length) {
        parts.push({ text: testStr.slice(lastIndex), isMatch: false });
      }
      return parts;
    } catch {
      return null;
    }
  }, [pattern, flags, testStr, error]);

  const presets = [
    { label: "邮箱", pattern: "[\\w.-]+@[\\w.-]+\\.\\w+" },
    { label: "手机号", pattern: "1[3-9]\\d{9}" },
    { label: "URL", pattern: "https?://[\\w.-]+(?:/[\\w./?%&=-]*)?" },
    { label: "IP地址", pattern: "\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}" },
    { label: "中文", pattern: "[\\u4e00-\\u9fff]+" },
  ];

  const flagOptions = [
    { flag: "g", label: "全局 (g)" },
    { flag: "i", label: "忽略大小写 (i)" },
    { flag: "m", label: "多行 (m)" },
    { flag: "s", label: "dotAll (s)" },
  ];

  return (
    <ToolPageWrapper>
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">正则表达式测试</h1>
        <p className="mt-2 text-[var(--muted)]">
          实时测试正则表达式，高亮匹配结果，支持常用预设
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium">正则表达式</label>
          <div className="flex items-center gap-2">
            <span className="text-lg text-[var(--muted)]">/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="输入正则表达式..."
              className="textarea-tool flex-1 rounded-lg px-3 py-2.5 font-mono text-sm"
              spellCheck={false}
            />
            <span className="text-lg text-[var(--muted)]">/</span>
            <input
              type="text"
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
              className="textarea-tool w-16 rounded-lg px-3 py-2.5 font-mono text-sm text-center"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {flagOptions.map((f) => (
            <label key={f.flag} className="flex cursor-pointer items-center gap-1.5 text-xs">
              <input
                type="checkbox"
                checked={flags.includes(f.flag)}
                onChange={(e) => setFlags(e.target.checked ? flags + f.flag : flags.replace(f.flag, ""))}
                className="h-3.5 w-3.5 rounded accent-[var(--primary)]"
              />
              {f.label}
            </label>
          ))}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">常用预设</label>
          <div className="flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p.label}
                onClick={() => setPattern(p.pattern)}
                className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-1.5 text-xs font-medium hover:border-[var(--primary)]"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            正则错误: {error}
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-medium">测试文本</label>
          <textarea
            value={testStr}
            onChange={(e) => setTestStr(e.target.value)}
            placeholder="输入要测试的文本..."
            className="textarea-tool h-40 w-full rounded-lg p-4 font-mono text-sm"
            spellCheck={false}
          />
        </div>

        {highlighted && highlighted.length > 0 && (
          <div>
            <label className="mb-2 block text-sm font-medium">匹配高亮</label>
            <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-4 font-mono text-sm whitespace-pre-wrap break-all">
              {highlighted.map((p, i) =>
                p.isMatch ? (
                  <mark key={i} className="rounded bg-yellow-300/60 px-0.5 dark:bg-yellow-500/30">
                    {p.text}
                  </mark>
                ) : (
                  <span key={i}>{p.text}</span>
                )
              )}
            </div>
          </div>
        )}

        {results.length > 0 && (
          <div>
            <label className="mb-2 block text-sm font-medium">
              匹配结果（{results.length} 个）
            </label>
            <div className="max-h-60 space-y-2 overflow-auto">
              {results.map((r, i) => (
                <div key={i} className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-2 text-sm">
                  <span className="font-mono text-[var(--primary)]">{r.match}</span>
                  <span className="ml-2 text-xs text-[var(--muted)]">位置: {r.index}</span>
                  {r.groups.length > 0 && (
                    <span className="ml-2 text-xs text-[var(--muted)]">
                      分组: {r.groups.map((g, j) => `$${j + 1}="${g}"`).join(", ")}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-12 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
        <h2 className="mb-3 text-lg font-semibold">正则表达式速查</h2>
        <div className="grid gap-3 text-sm text-[var(--muted)] sm:grid-cols-2 font-mono">
          <div className="space-y-1">
            <p><strong className="text-[var(--foreground)]">.</strong> 匹配任意字符</p>
            <p><strong className="text-[var(--foreground)]">\d</strong> 数字 [0-9]</p>
            <p><strong className="text-[var(--foreground)]">\w</strong> 字母数字下划线</p>
            <p><strong className="text-[var(--foreground)]">\s</strong> 空白字符</p>
            <p><strong className="text-[var(--foreground)]">^</strong> 行首 <strong className="text-[var(--foreground)]">$</strong> 行尾</p>
          </div>
          <div className="space-y-1">
            <p><strong className="text-[var(--foreground)]">*</strong> 0次或多次</p>
            <p><strong className="text-[var(--foreground)]">+</strong> 1次或多次</p>
            <p><strong className="text-[var(--foreground)]">?</strong> 0次或1次</p>
            <p><strong className="text-[var(--foreground)]">{"{n,m}"}</strong> n到m次</p>
            <p><strong className="text-[var(--foreground)]">()</strong> 分组捕获</p>
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
}
