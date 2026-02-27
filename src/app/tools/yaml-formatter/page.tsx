"use client";

import { useState, useCallback } from "react";
import yaml from "js-yaml";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

export default function YamlFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const format = useCallback(() => {
    try {
      const parsed = yaml.load(input);
      setOutput(yaml.dump(parsed, { indent: 2, lineWidth: 120 }));
      setError("");
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  }, [input]);

  const toJson = useCallback(() => {
    try {
      const parsed = yaml.load(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError("");
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  }, [input]);

  const fromJson = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      setOutput(yaml.dump(parsed, { indent: 2, lineWidth: 120 }));
      setError("");
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  }, [input]);

  const loadSample = () => {
    setInput(`server:
  host: localhost
  port: 8080
  ssl: true

database:
  driver: postgres
  host: db.example.com
  port: 5432
  name: myapp
  credentials:
    username: admin
    password: secret

logging:
  level: info
  outputs:
    - console
    - file

features:
  - name: auth
    enabled: true
  - name: cache
    enabled: false`);
  };

  return (
    <ToolPageWrapper>
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">YAML 格式化 / 校验</h1>
        <p className="mt-2 text-[var(--muted)]">
          YAML 格式化、校验，支持 YAML 与 JSON 互相转换
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <button onClick={format} className="btn-primary rounded-lg px-4 py-2 text-sm font-medium">
          格式化 YAML
        </button>
        <button onClick={toJson} className="btn-primary rounded-lg px-4 py-2 text-sm font-medium">
          YAML → JSON
        </button>
        <button onClick={fromJson} className="btn-primary rounded-lg px-4 py-2 text-sm font-medium">
          JSON → YAML
        </button>
        <button onClick={loadSample} className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-2 text-sm font-medium hover:border-[var(--primary)]">
          加载示例
        </button>
        {output && (
          <button
            onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-2 text-sm font-medium hover:border-[var(--primary)]"
          >
            {copied ? "已复制 ✓" : "复制结果"}
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          语法错误: {error}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--muted)]">输入</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="粘贴 YAML 或 JSON 数据..."
            className="textarea-tool h-96 w-full rounded-lg p-4 font-mono text-sm"
            spellCheck={false}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--muted)]">输出结果</label>
          <textarea value={output} readOnly placeholder="结果..." className="textarea-tool h-96 w-full rounded-lg p-4 font-mono text-sm" />
        </div>
      </div>

      <div className="mt-12 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
        <h2 className="mb-3 text-lg font-semibold">什么是 YAML？</h2>
        <p className="text-sm leading-relaxed text-[var(--muted)]">
          YAML (YAML Ain&apos;t Markup Language) 是一种人类可读的数据序列化格式，常用于配置文件（如 Docker Compose、Kubernetes、GitHub Actions 等）。
          相比 JSON，YAML 使用缩进表示层级关系，更加简洁易读。本工具支持 YAML 格式化、校验以及 YAML 与 JSON 之间的互相转换。
        </p>
      </div>
    </ToolPageWrapper>
  );
}
