"use client";

import { useState, useMemo } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

function analyzeText(text: string) {
  if (!text) {
    return { chars: 0, charsNoSpace: 0, words: 0, lines: 0, paragraphs: 0, chinese: 0, english: 0, numbers: 0, punctuation: 0 };
  }

  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, "").length;
  const lines = text.split("\n").length;
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim()).length || (text.trim() ? 1 : 0);

  const chinese = (text.match(/[\u4e00-\u9fff]/g) || []).length;
  const english = (text.match(/[a-zA-Z]+/g) || []).length;
  const numbers = (text.match(/\d+/g) || []).length;
  const punctuation = (text.match(/[^\w\s\u4e00-\u9fff]/g) || []).length;

  const words = chinese + english + numbers;

  return { chars, charsNoSpace, words, lines, paragraphs, chinese, english, numbers, punctuation };
}

export default function TextCounterPage() {
  const [text, setText] = useState("");
  const stats = useMemo(() => analyzeText(text), [text]);

  const statCards = [
    { label: "总字符", value: stats.chars },
    { label: "字符(不含空格)", value: stats.charsNoSpace },
    { label: "词/字数", value: stats.words },
    { label: "行数", value: stats.lines },
    { label: "段落数", value: stats.paragraphs },
    { label: "中文字", value: stats.chinese },
    { label: "英文词", value: stats.english },
    { label: "数字", value: stats.numbers },
  ];

  const readingTime = Math.max(1, Math.ceil(stats.words / 300));

  return (
    <ToolPageWrapper>
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">文本统计</h1>
        <p className="mt-2 text-[var(--muted)]">
          统计字数、字符数、行数、段落数，支持中英文混合统计
        </p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {statCards.map((s) => (
          <div
            key={s.label}
            className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-4 text-center"
          >
            <div className="text-2xl font-bold text-[var(--primary)]">
              {s.value.toLocaleString()}
            </div>
            <div className="mt-1 text-xs text-[var(--muted)]">{s.label}</div>
          </div>
        ))}
      </div>

      {text && (
        <p className="mb-4 text-sm text-[var(--muted)]">
          预计阅读时间: <span className="font-medium text-[var(--foreground)]">{readingTime} 分钟</span>
        </p>
      )}

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="在这里粘贴或输入你的文本..."
        className="textarea-tool h-80 w-full rounded-lg p-4 text-sm"
      />

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => setText("")}
          className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-2 text-sm font-medium transition-colors hover:border-[var(--primary)]"
        >
          清空
        </button>
        <button
          onClick={async () => {
            const clip = await navigator.clipboard.readText();
            setText(clip);
          }}
          className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-2 text-sm font-medium transition-colors hover:border-[var(--primary)]"
        >
          从剪贴板粘贴
        </button>
      </div>

      <div className="mt-12 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6">
        <h2 className="text-lg font-semibold mb-3">文本统计工具说明</h2>
        <p className="text-sm text-[var(--muted)] leading-relaxed">
          本工具可以对中英文混合文本进行详细统计，包括总字符数、不含空格字符数、词/字数、行数、段落数等。
          中文按单个汉字计数，英文按单词计数。适合写作、论文、自媒体文章的字数统计需求。
          所有统计在浏览器本地完成，你的文本不会被上传到任何服务器。
        </p>
      </div>
    </ToolPageWrapper>
  );
}
