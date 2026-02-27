"use client";

import { useState, useCallback } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

const CHINESE_SENTENCES = [
  "天地玄黄，宇宙洪荒。",
  "日月盈昃，辰宿列张。",
  "寒来暑往，秋收冬藏。",
  "闰余成岁，律吕调阳。",
  "云腾致雨，露结为霜。",
  "金生丽水，玉出昆冈。",
  "剑号巨阙，珠称夜光。",
  "果珍李柰，菜重芥姜。",
  "海咸河淡，鳞潜羽翔。",
  "龙师火帝，鸟官人皇。",
  "始制文字，乃服衣裳。",
  "推位让国，有虞陶唐。",
  "吊民伐罪，周发殷汤。",
  "坐朝问道，垂拱平章。",
  "爱育黎首，臣伏戎羌。",
  "遐迩一体，率宾归王。",
  "鸣凤在竹，白驹食场。",
  "化被草木，赖及万方。",
  "盖此身发，四大五常。",
  "恭惟鞠养，岂敢毁伤。",
];

const LOREM_SENTENCES = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.",
  "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit.",
  "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
  "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.",
  "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit.",
  "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse.",
  "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis.",
];

export default function LoremGeneratorPage() {
  const [count, setCount] = useState(3);
  const [unit, setUnit] = useState<"paragraph" | "sentence" | "word">("paragraph");
  const [lang, setLang] = useState<"zh" | "en">("zh");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    const sentences = lang === "zh" ? CHINESE_SENTENCES : LOREM_SENTENCES;
    let result = "";

    if (unit === "paragraph") {
      const paragraphs: string[] = [];
      for (let i = 0; i < count; i++) {
        const sentCount = 3 + Math.floor(Math.random() * 4);
        const para: string[] = [];
        for (let j = 0; j < sentCount; j++) {
          para.push(sentences[Math.floor(Math.random() * sentences.length)]);
        }
        paragraphs.push(para.join(lang === "zh" ? "" : " "));
      }
      result = paragraphs.join("\n\n");
    } else if (unit === "sentence") {
      const sents: string[] = [];
      for (let i = 0; i < count; i++) {
        sents.push(sentences[Math.floor(Math.random() * sentences.length)]);
      }
      result = sents.join(lang === "zh" ? "" : " ");
    } else {
      const allText = sentences.join(lang === "zh" ? "" : " ");
      const chars = lang === "zh" ? allText.replace(/[，。、]/g, "") : allText;
      const words = lang === "zh" ? chars.split("") : chars.split(/\s+/);
      const selected: string[] = [];
      for (let i = 0; i < count; i++) {
        selected.push(words[Math.floor(Math.random() * words.length)]);
      }
      result = selected.join(lang === "zh" ? "" : " ");
    }
    setOutput(result);
  }, [count, unit, lang]);

  return (
    <ToolPageWrapper>
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">假文生成器</h1>
        <p className="mt-2 text-[var(--muted)]">
          生成 Lorem Ipsum 或中文假文，用于设计稿和排版测试
        </p>
      </div>

      <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium">语言</label>
            <div className="flex gap-2">
              <button onClick={() => setLang("zh")} className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium ${lang === "zh" ? "btn-primary" : "border border-[var(--card-border)]"}`}>中文</button>
              <button onClick={() => setLang("en")} className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium ${lang === "en" ? "btn-primary" : "border border-[var(--card-border)]"}`}>English</button>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">单位</label>
            <div className="flex gap-2">
              {([["paragraph", "段落"], ["sentence", "句子"], ["word", lang === "zh" ? "字" : "词"]] as const).map(([v, l]) => (
                <button key={v} onClick={() => setUnit(v as typeof unit)} className={`flex-1 rounded-lg px-2 py-2 text-sm font-medium ${unit === v ? "btn-primary" : "border border-[var(--card-border)]"}`}>{l}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">数量: {count}</label>
            <input type="range" min={1} max={unit === "word" ? 200 : unit === "sentence" ? 30 : 10} value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-full accent-[var(--primary)]" />
          </div>
        </div>
        <button onClick={generate} className="btn-primary mt-4 w-full rounded-lg py-3 text-sm font-medium">生成假文</button>
      </div>

      {output && (
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium">生成结果</label>
            <button
              onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
              className="text-xs text-[var(--primary)] hover:underline"
            >
              {copied ? "已复制 ✓" : "复制"}
            </button>
          </div>
          <div className="whitespace-pre-wrap rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-4 text-sm leading-relaxed">
            {output}
          </div>
        </div>
      )}

      <div className="mt-12 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
        <h2 className="mb-3 text-lg font-semibold">什么是 Lorem Ipsum？</h2>
        <p className="text-sm leading-relaxed text-[var(--muted)]">
          Lorem Ipsum 是印刷和排版行业的标准假文文本，自 16 世纪以来一直被使用。
          设计师和开发者在制作网页或应用原型时，常用假文来填充内容区域，以便专注于视觉设计而非文本内容。
          本工具支持生成中文和英文假文。
        </p>
      </div>
    </ToolPageWrapper>
  );
}
