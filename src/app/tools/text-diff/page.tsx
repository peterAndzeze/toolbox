"use client";

import { useState, useMemo } from "react";
import { diffLines } from "diff";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

export default function TextDiffPage() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");

  const changes = useMemo(() => {
    if (!left && !right) return [];
    return diffLines(left, right);
  }, [left, right]);

  const stats = useMemo(() => {
    let added = 0, removed = 0, unchanged = 0;
    changes.forEach((c) => {
      const lines = c.value.split("\n").filter((l) => l !== "").length;
      if (c.added) added += lines;
      else if (c.removed) removed += lines;
      else unchanged += lines;
    });
    return { added, removed, unchanged };
  }, [changes]);

  const loadSample = () => {
    setLeft(`server:
  host: localhost
  port: 8080
  debug: true

database:
  host: localhost
  port: 3306
  name: myapp_dev`);
    setRight(`server:
  host: 0.0.0.0
  port: 80
  debug: false

database:
  host: db.production.com
  port: 5432
  name: myapp_prod`);
  };

  return (
    <ToolPageWrapper>
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">文本对比 Diff</h1>
        <p className="mt-2 text-[var(--muted)]">
          对比两段文本的差异，高亮显示新增、删除和修改的内容
        </p>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button onClick={loadSample} className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-2 text-sm font-medium hover:border-[var(--primary)]">
          加载示例
        </button>
        <button onClick={() => { setLeft(""); setRight(""); }} className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-2 text-sm font-medium hover:border-[var(--primary)]">
          清空
        </button>
        {changes.length > 0 && (
          <span className="ml-auto text-sm text-[var(--muted)]">
            <span className="text-green-500">+{stats.added}</span>{" "}
            <span className="text-red-500">-{stats.removed}</span>{" "}
            <span>~{stats.unchanged} 行不变</span>
          </span>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--muted)]">原始文本</label>
          <textarea
            value={left}
            onChange={(e) => setLeft(e.target.value)}
            placeholder="粘贴原始文本..."
            className="textarea-tool h-64 w-full rounded-lg p-4 font-mono text-sm"
            spellCheck={false}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--muted)]">修改后文本</label>
          <textarea
            value={right}
            onChange={(e) => setRight(e.target.value)}
            placeholder="粘贴修改后的文本..."
            className="textarea-tool h-64 w-full rounded-lg p-4 font-mono text-sm"
            spellCheck={false}
          />
        </div>
      </div>

      {changes.length > 0 && (
        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-[var(--muted)]">对比结果</label>
          <div className="overflow-auto rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-4 font-mono text-sm">
            {changes.map((part, i) => (
              <div
                key={i}
                className={`whitespace-pre-wrap ${
                  part.added
                    ? "bg-green-500/10 text-green-600 dark:text-green-400"
                    : part.removed
                      ? "bg-red-500/10 text-red-600 dark:text-red-400 line-through"
                      : "text-[var(--muted)]"
                }`}
              >
                {part.value.split("\n").filter((_, idx, arr) => idx < arr.length - 1 || _ !== "").map((line, j) => (
                  <div key={j} className="min-h-[1.5em]">
                    <span className="mr-2 inline-block w-4 text-right opacity-50">
                      {part.added ? "+" : part.removed ? "-" : " "}
                    </span>
                    {line}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-12 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
        <h2 className="mb-3 text-lg font-semibold">文本对比工具说明</h2>
        <p className="text-sm leading-relaxed text-[var(--muted)]">
          本工具可以逐行对比两段文本的差异，用颜色高亮标注新增（绿色）和删除（红色）的内容。
          适合对比配置文件修改、代码变更、文档版本差异等场景。所有对比在浏览器本地完成，你的文本不会被上传。
        </p>
      </div>
    </ToolPageWrapper>
  );
}
