"use client";

import { useState, useMemo } from "react";
import { marked } from "marked";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

const SAMPLE = `# Markdown 编辑器

## 功能特点

- **实时预览**：左边写，右边看
- *斜体* 和 **粗体** 支持
- 支持 [链接](https://example.com)

## 代码示例

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

## 表格

| 功能 | 状态 |
|------|------|
| 实时预览 | ✅ |
| 语法高亮 | ✅ |

> 这是一段引用文字

1. 有序列表第一项
2. 有序列表第二项
3. 有序列表第三项
`;

export default function MarkdownEditorPage() {
  const [text, setText] = useState(SAMPLE);
  const [view, setView] = useState<"split" | "edit" | "preview">("split");
  const [copied, setCopied] = useState(false);

  const html = useMemo(() => {
    try {
      return marked(text, { breaks: true }) as string;
    } catch {
      return "<p>渲染错误</p>";
    }
  }, [text]);

  const copyHtml = () => {
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolPageWrapper>
      <div className="mb-6">
        <h1 className="text-2xl font-bold sm:text-3xl">Markdown 编辑器</h1>
        <p className="mt-2 text-[var(--muted)]">
          在线 Markdown 编辑与实时预览，支持导出 HTML
        </p>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-1 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-1">
          {(["split", "edit", "preview"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${view === v ? "bg-[var(--primary)] text-white" : "hover:bg-[var(--card-border)]"}`}
            >
              {v === "split" ? "分屏" : v === "edit" ? "编辑" : "预览"}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={copyHtml} className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-1.5 text-xs font-medium hover:border-[var(--primary)]">
            {copied ? "已复制 ✓" : "复制 HTML"}
          </button>
          <button
            onClick={() => setText("")}
            className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-1.5 text-xs font-medium hover:border-[var(--primary)]"
          >
            清空
          </button>
        </div>
      </div>

      <div className={`grid gap-4 ${view === "split" ? "lg:grid-cols-2" : ""}`}>
        {view !== "preview" && (
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--muted)]">Markdown</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="textarea-tool h-[500px] w-full rounded-lg p-4 font-mono text-sm"
              spellCheck={false}
              placeholder="在这里编写 Markdown..."
            />
          </div>
        )}
        {view !== "edit" && (
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--muted)]">预览</label>
            <div
              className="prose prose-sm dark:prose-invert h-[500px] w-full overflow-auto rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-4"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        )}
      </div>

      <div className="mt-12 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
        <h2 className="mb-3 text-lg font-semibold">Markdown 语法参考</h2>
        <div className="grid gap-4 text-sm text-[var(--muted)] sm:grid-cols-2">
          <div className="space-y-1 font-mono">
            <p># 一级标题</p>
            <p>## 二级标题</p>
            <p>**粗体** *斜体*</p>
            <p>[链接文字](URL)</p>
            <p>![图片描述](URL)</p>
          </div>
          <div className="space-y-1 font-mono">
            <p>- 无序列表</p>
            <p>1. 有序列表</p>
            <p>&gt; 引用</p>
            <p>`行内代码`</p>
            <p>```代码块```</p>
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
}
