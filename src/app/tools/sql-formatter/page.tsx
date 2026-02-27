"use client";

import { useState, useCallback } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

const KEYWORDS = [
  "SELECT", "FROM", "WHERE", "AND", "OR", "NOT", "IN", "ON", "AS",
  "JOIN", "LEFT", "RIGHT", "INNER", "OUTER", "FULL", "CROSS",
  "INSERT", "INTO", "VALUES", "UPDATE", "SET", "DELETE",
  "CREATE", "TABLE", "ALTER", "DROP", "INDEX",
  "ORDER", "BY", "GROUP", "HAVING", "LIMIT", "OFFSET",
  "UNION", "ALL", "DISTINCT", "BETWEEN", "LIKE", "IS", "NULL",
  "EXISTS", "CASE", "WHEN", "THEN", "ELSE", "END",
  "COUNT", "SUM", "AVG", "MIN", "MAX", "ASC", "DESC",
];

const CLAUSE_KEYWORDS = [
  "SELECT", "FROM", "WHERE", "JOIN", "LEFT JOIN", "RIGHT JOIN",
  "INNER JOIN", "OUTER JOIN", "FULL JOIN", "CROSS JOIN",
  "ON", "AND", "OR", "ORDER BY", "GROUP BY", "HAVING",
  "LIMIT", "OFFSET", "UNION", "UNION ALL", "INSERT INTO",
  "VALUES", "UPDATE", "SET", "DELETE FROM", "CREATE TABLE",
];

function formatSql(sql: string): string {
  let formatted = sql.replace(/\s+/g, " ").trim();

  CLAUSE_KEYWORDS.sort((a, b) => b.length - a.length).forEach((kw) => {
    const regex = new RegExp(`\\b${kw}\\b`, "gi");
    formatted = formatted.replace(regex, `\n${kw.toUpperCase()}`);
  });

  formatted = formatted
    .replace(/,\s*/g, ",\n  ")
    .replace(/\(\s*/g, "(\n  ")
    .replace(/\s*\)/g, "\n)")
    .replace(/^\n/, "")
    .replace(/\n{2,}/g, "\n");

  const lines = formatted.split("\n");
  let indent = 0;
  const result: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed === ")") indent = Math.max(0, indent - 1);
    result.push("  ".repeat(indent) + trimmed);
    if (trimmed.endsWith("(")) indent++;
  }

  return result.join("\n");
}

function minifySql(sql: string): string {
  return sql.replace(/\s+/g, " ").replace(/\s*([(),])\s*/g, "$1").trim();
}

function uppercaseKeywords(sql: string): string {
  let result = sql;
  KEYWORDS.forEach((kw) => {
    result = result.replace(new RegExp(`\\b${kw}\\b`, "gi"), kw.toUpperCase());
  });
  return result;
}

const SAMPLE = `select u.id, u.name, u.email, count(o.id) as order_count, sum(o.total) as total_spent from users u left join orders o on u.id = o.user_id where u.status = 'active' and u.created_at > '2024-01-01' group by u.id, u.name, u.email having count(o.id) > 5 order by total_spent desc limit 10`;

export default function SqlFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const format = useCallback(() => setOutput(formatSql(input)), [input]);
  const minify = useCallback(() => setOutput(minifySql(input)), [input]);
  const upper = useCallback(() => setOutput(uppercaseKeywords(input)), [input]);

  return (
    <ToolPageWrapper>
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">SQL 格式化</h1>
        <p className="mt-2 text-[var(--muted)]">SQL 语句格式化、压缩、关键字大写转换</p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <button onClick={format} className="btn-primary rounded-lg px-4 py-2 text-sm font-medium">格式化</button>
        <button onClick={minify} className="btn-primary rounded-lg px-4 py-2 text-sm font-medium">压缩</button>
        <button onClick={upper} className="btn-primary rounded-lg px-4 py-2 text-sm font-medium">关键字大写</button>
        <button onClick={() => setInput(SAMPLE)} className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-2 text-sm font-medium hover:border-[var(--primary)]">加载示例</button>
        {output && (
          <button onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-2 text-sm font-medium hover:border-[var(--primary)]">
            {copied ? "已复制 ✓" : "复制结果"}
          </button>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--muted)]">输入 SQL</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="粘贴 SQL 语句..." className="textarea-tool h-80 w-full rounded-lg p-4 font-mono text-sm" spellCheck={false} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--muted)]">输出结果</label>
          <textarea value={output} readOnly placeholder="结果..." className="textarea-tool h-80 w-full rounded-lg p-4 font-mono text-sm" />
        </div>
      </div>

      <div className="mt-12 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
        <h2 className="mb-3 text-lg font-semibold">SQL 格式化工具说明</h2>
        <p className="text-sm leading-relaxed text-[var(--muted)]">
          本工具可以将杂乱的 SQL 语句格式化为可读性强的缩进格式，支持关键字自动大写、SQL 压缩等功能。
          适合日常数据库开发、SQL 调试和代码审查。所有处理在浏览器本地完成。
        </p>
      </div>
    </ToolPageWrapper>
  );
}
