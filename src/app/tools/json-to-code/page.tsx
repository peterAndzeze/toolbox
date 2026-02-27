"use client";

import { useState, useCallback, useMemo } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

type JsonType = "string" | "number" | "int" | "float" | "boolean" | "null" | "object" | "array";

interface InferredType {
  type: JsonType;
  elementType?: InferredType;
  fields?: Record<string, InferredType>;
}

function inferType(value: unknown): InferredType {
  if (value === null) return { type: "null" };
  if (typeof value === "string") return { type: "string" };
  if (typeof value === "boolean") return { type: "boolean" };
  if (typeof value === "number") {
    return Number.isInteger(value) ? { type: "int" } : { type: "float" };
  }
  if (Array.isArray(value)) {
    const first = value[0];
    return {
      type: "array",
      elementType: first !== undefined ? inferType(first) : { type: "unknown" as JsonType },
    };
  }
  if (typeof value === "object" && value !== null) {
    const fields: Record<string, InferredType> = {};
    for (const [k, v] of Object.entries(value)) {
      fields[k] = inferType(v);
    }
    return { type: "object", fields };
  }
  return { type: "string" };
}

function toPascalCase(str: string): string {
  return str.replace(/(?:^|_|-)([a-z])/gi, (_, c) => c.toUpperCase()).replace(/[^a-zA-Z0-9]/g, "");
}

function toCamelCase(str: string): string {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

const LANGUAGES = [
  { id: "typescript", name: "TypeScript" },
  { id: "java", name: "Java" },
  { id: "go", name: "Go" },
  { id: "csharp", name: "C#" },
  { id: "python", name: "Python" },
  { id: "kotlin", name: "Kotlin" },
] as const;

function typeToTs(t: InferredType, optional: boolean): string {
  const opt = optional ? "?" : "";
  switch (t.type) {
    case "string": return `string${opt}`;
    case "number":
    case "int":
    case "float": return `number${opt}`;
    case "boolean": return `boolean${opt}`;
    case "null": return `null${opt}`;
    case "array":
      const elem = t.elementType ? typeToTs(t.elementType, false) : "unknown";
      return `${elem}[]${opt}`;
    case "object": return `object${opt}`;
    default: return `unknown${opt}`;
  }
}

function typeToJava(t: InferredType, nullable: boolean): string {
  const box = nullable ? "?" : "";
  switch (t.type) {
    case "string": return `String${box}`;
    case "int": return `Integer${box}`;
    case "float":
    case "number": return `Double${box}`;
    case "boolean": return `Boolean${box}`;
    case "null": return "Object?";
    case "array":
      const elem = t.elementType ? typeToJava(t.elementType, false) : "Object";
      return `List<${elem}>${box}`;
    case "object": return `Object${box}`;
    default: return `Object${box}`;
  }
}

function typeToGo(t: InferredType, structName?: string): string {
  switch (t.type) {
    case "string": return "*string";
    case "int": return "*int64";
    case "float":
    case "number": return "*float64";
    case "boolean": return "*bool";
    case "null": return "interface{}";
    case "array":
      const elem = t.elementType ? typeToGo(t.elementType) : "interface{}";
      return `[]${elem}`;
    case "object": return `*${structName || "interface{}"}`;
    default: return "interface{}";
  }
}

function typeToCSharp(t: InferredType, nullable: boolean): string {
  const q = nullable ? "?" : "";
  switch (t.type) {
    case "string": return `string${q}`;
    case "int": return `int${q}`;
    case "float":
    case "number": return `double${q}`;
    case "boolean": return `bool${q}`;
    case "null": return "object?";
    case "array":
      const elem = t.elementType ? typeToCSharp(t.elementType, false) : "object";
      return `List<${elem}>${q}`;
    case "object": return `object${q}`;
    default: return `object${q}`;
  }
}

function typeToPython(t: InferredType): string {
  switch (t.type) {
    case "string": return "str";
    case "int": return "int";
    case "float":
    case "number": return "float";
    case "boolean": return "bool";
    case "null": return "None";
    case "array":
      const elem = t.elementType ? typeToPython(t.elementType) : "Any";
      return `list[${elem}]`;
    case "object": return "dict";
    default: return "Any";
  }
}

function typeToKotlin(t: InferredType, nullable: boolean): string {
  const q = nullable ? "?" : "";
  switch (t.type) {
    case "string": return `String${q}`;
    case "int": return `Int${q}`;
    case "float":
    case "number": return `Double${q}`;
    case "boolean": return `Boolean${q}`;
    case "null": return "Any?";
    case "array":
      const elem = t.elementType ? typeToKotlin(t.elementType, false) : "Any";
      return `List<${elem}>${q}`;
    case "object": return `Any${q}`;
    default: return `Any${q}`;
  }
}

function generateCode(
  data: unknown,
  rootName: string,
  lang: string
): string {
  const root = inferType(data);
  if (root.type !== "object" || !root.fields) {
    return `// 根节点必须是对象`;
  }

  const usedNames = new Set<string>();

  function genStructName(key: string): string {
    let name = toPascalCase(key) || "Item";
    if (usedNames.has(name)) {
      let i = 1;
      while (usedNames.has(name + i)) i++;
      name = name + i;
    }
    usedNames.add(name);
    return name;
  }

  function genTsInterface(t: InferredType, name: string): string {
    if (t.type !== "object" || !t.fields) return "";
    const lines: string[] = [];
    for (const [k, v] of Object.entries(t.fields)) {
      const optional = v.type === "null";
      const fieldName = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(k) ? k : `"${k}"`;
      if (v.type === "object" && v.fields) {
        const subName = genStructName(k);
        lines.push(`  ${fieldName}${optional ? "?" : ""}: ${subName};`);
      } else if (v.type === "array" && v.elementType?.type === "object" && v.elementType.fields) {
        const subName = genStructName(k);
        lines.push(`  ${fieldName}${optional ? "?" : ""}: ${subName}[];`);
      } else {
        lines.push(`  ${fieldName}${optional ? "?" : ""}: ${typeToTs(v, optional)};`);
      }
    }
    return `interface ${name} {\n${lines.join("\n")}\n`;
  }

  function genJavaClass(t: InferredType, name: string): string {
    if (t.type !== "object" || !t.fields) return "";
    const lines: string[] = [];
    for (const [k, v] of Object.entries(t.fields)) {
      const nullable = v.type === "null";
      const fieldName = toCamelCase(k);
      if (v.type === "object" && v.fields) {
        const subName = genStructName(k);
        lines.push(`    private ${subName}${nullable ? "?" : ""} ${fieldName};`);
      } else if (v.type === "array" && v.elementType?.type === "object" && v.elementType.fields) {
        const subName = genStructName(k);
        lines.push(`    private List<${subName}>${nullable ? "?" : ""} ${fieldName};`);
      } else {
        lines.push(`    private ${typeToJava(v, nullable)} ${fieldName};`);
      }
    }
    const getters: string[] = [];
    for (const [k, v] of Object.entries(t.fields)) {
      const fieldName = toCamelCase(k);
      const retType = v.type === "object" && v.fields
        ? genStructName(k)
        : v.type === "array" && v.elementType?.type === "object" && v.elementType.fields
          ? `List<${genStructName(k)}>`
          : typeToJava(v, false);
      getters.push(`    public ${retType} get${toPascalCase(k)}() { return ${fieldName}; }`);
      getters.push(`    public void set${toPascalCase(k)}(${retType} val) { this.${fieldName} = val; }`);
    }
    return `public class ${name} {\n${lines.join("\n")}\n${getters.join("\n")}\n}\n`;
  }

  function genGoStruct(t: InferredType, name: string): string {
    if (t.type !== "object" || !t.fields) return "";
    const lines: string[] = [];
    for (const [k, v] of Object.entries(t.fields)) {
      const goKey = toPascalCase(k);
      if (v.type === "object" && v.fields) {
        const subName = genStructName(k);
        lines.push(`    ${goKey} *${subName} \`json:"${k}"\``);
      } else if (v.type === "array" && v.elementType?.type === "object" && v.elementType.fields) {
        const subName = genStructName(k);
        lines.push(`    ${goKey} []*${subName} \`json:"${k}"\``);
      } else {
        const tStr = typeToGo(v);
        lines.push(`    ${goKey} ${tStr} \`json:"${k}"\``);
      }
    }
    return `type ${name} struct {\n${lines.join("\n")}\n}\n`;
  }

  function genCSharpClass(t: InferredType, name: string): string {
    if (t.type !== "object" || !t.fields) return "";
    const lines: string[] = [];
    for (const [k, v] of Object.entries(t.fields)) {
      const nullable = v.type === "null";
      const propName = toPascalCase(k);
      if (v.type === "object" && v.fields) {
        const subName = genStructName(k);
        lines.push(`    public ${subName}${nullable ? "?" : ""} ${propName} { get; set; }`);
      } else if (v.type === "array" && v.elementType?.type === "object" && v.elementType.fields) {
        const subName = genStructName(k);
        lines.push(`    public List<${subName}>${nullable ? "?" : ""} ${propName} { get; set; }`);
      } else {
        lines.push(`    public ${typeToCSharp(v, nullable)} ${propName} { get; set; }`);
      }
    }
    return `public class ${name}\n{\n${lines.join("\n")}\n}\n`;
  }

  function genPythonDataclass(t: InferredType, name: string): string {
    if (t.type !== "object" || !t.fields) return "";
    const lines: string[] = [];
    for (const [k, v] of Object.entries(t.fields)) {
      const pyKey = k.replace(/-/g, "_").replace(/ /g, "_");
      if (v.type === "object" && v.fields) {
        const subName = genStructName(k);
        lines.push(`    ${pyKey}: ${subName} | None = None`);
      } else if (v.type === "array" && v.elementType?.type === "object" && v.elementType.fields) {
        const subName = genStructName(k);
        lines.push(`    ${pyKey}: list[${subName}] | None = None`);
      } else {
        lines.push(`    ${pyKey}: ${typeToPython(v)} | None = None`);
      }
    }
    return `@dataclass\nclass ${name}:\n${lines.join("\n")}\n`;
  }

  function genKotlinDataClass(t: InferredType, name: string): string {
    if (t.type !== "object" || !t.fields) return "";
    const lines: string[] = [];
    for (const [k, v] of Object.entries(t.fields)) {
      const nullable = v.type === "null";
      const propName = toCamelCase(k);
      const kName = (propName === "object" || propName === "class") ? `\`${propName}\`` : propName;
      if (v.type === "object" && v.fields) {
        const subName = genStructName(k);
        lines.push(`    val ${kName}: ${subName}${nullable ? "?" : ""}`);
      } else if (v.type === "array" && v.elementType?.type === "object" && v.elementType.fields) {
        const subName = genStructName(k);
        lines.push(`    val ${kName}: List<${subName}>${nullable ? "?" : ""}`);
      } else {
        lines.push(`    val ${kName}: ${typeToKotlin(v, nullable)}`);
      }
    }
    return `data class ${name}(\n${lines.join(",\n")}\n)\n`;
  }

  // Collect all nested structs first
  const allStructs: { t: InferredType; name: string }[] = [];
  function collectStructs(t: InferredType, name: string) {
    if (t.type !== "object" || !t.fields) return;
    for (const [k, v] of Object.entries(t.fields)) {
      if (v.type === "object" && v.fields) {
        const subName = genStructName(k);
        allStructs.push({ t: v, name: subName });
        collectStructs(v, subName);
      }
      if (v.type === "array" && v.elementType?.type === "object" && v.elementType.fields) {
        const subName = genStructName(k);
        allStructs.push({ t: v.elementType, name: subName });
        collectStructs(v.elementType, subName);
      }
    }
  }
  collectStructs(root, rootName);

  switch (lang) {
    case "typescript": {
      const parts: string[] = [];
      for (const { t, name } of allStructs.reverse()) {
        parts.push(genTsInterface(t, name));
      }
      parts.push(genTsInterface(root, rootName));
      return parts.join("\n");
    }
    case "java": {
      const parts: string[] = [];
      for (const { t, name } of allStructs.reverse()) {
        parts.push(genJavaClass(t, name));
      }
      parts.push(genJavaClass(root, rootName));
      return parts.join("\n");
    }
    case "go": {
      const parts: string[] = [];
      for (const { t, name } of allStructs.reverse()) {
        parts.push(genGoStruct(t, name));
      }
      parts.push(genGoStruct(root, rootName));
      return parts.join("\n");
    }
    case "csharp": {
      const parts: string[] = [];
      for (const { t, name } of allStructs.reverse()) {
        parts.push(genCSharpClass(t, name));
      }
      parts.push(genCSharpClass(root, rootName));
      return parts.join("\n");
    }
    case "python": {
      let code = "from dataclasses import dataclass\n\n";
      for (const { t, name } of allStructs.reverse()) {
        code += genPythonDataclass(t, name) + "\n";
      }
      code += genPythonDataclass(root, rootName);
      return code;
    }
    case "kotlin": {
      const parts: string[] = [];
      for (const { t, name } of allStructs.reverse()) {
        parts.push(genKotlinDataClass(t, name));
      }
      parts.push(genKotlinDataClass(root, rootName));
      return parts.join("\n");
    }
    default:
      return "";
  }
}

function highlightCode(code: string): React.ReactNode {
  const lines = code.split("\n");
  return (
    <pre className="overflow-x-auto rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-4 font-mono text-sm">
      {lines.map((line, i) => (
        <div key={i} className="leading-relaxed">
          {line.split(/(\b(?:interface|type|class|def|data class|public|private|val|var|import|from)\b|"[^"]*"|'[^']*')/g).map((part, j) => {
            if (part.match(/^(interface|type|class|def|data class|public|private|val|var|import|from)$/)) {
              return <span key={j} className="text-purple-600 dark:text-purple-400">{part}</span>;
            }
            if (part.match(/^"[^"]*"|'[^']*'$/)) {
              return <span key={j} className="text-green-600 dark:text-green-400">{part}</span>;
            }
            return <span key={j}>{part}</span>;
          })}
        </div>
      ))}
    </pre>
  );
}

export default function JsonToCodePage() {
  const [input, setInput] = useState("");
  const [rootName, setRootName] = useState("Root");
  const [lang, setLang] = useState<(typeof LANGUAGES)[number]["id"]>("typescript");
  const [copied, setCopied] = useState(false);

  const parsed = useMemo(() => {
    if (!input.trim()) return null;
    try {
      return JSON.parse(input) as unknown;
    } catch {
      return null;
    }
  }, [input]);

  const code = useMemo(() => {
    if (!parsed || typeof parsed !== "object") return "";
    return generateCode(parsed, rootName, lang);
  }, [parsed, rootName, lang]);

  const copyCode = useCallback(() => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  const loadSample = () => {
    const sample = {
      name: "张三",
      age: 25,
      active: true,
      tags: ["开发者", "工具"],
      address: { city: "北京", zip: "100000" },
    };
    setInput(JSON.stringify(sample, null, 2));
  };

  return (
    <ToolPageWrapper>
      <h1 className="page-title">JSON 转代码</h1>
      <p className="page-subtitle">
        将 JSON 数据转换为 TypeScript、Java、Go、C#、Python、Kotlin 类型定义
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--muted)]">输入 JSON</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"name": "示例", "age": 18}'
            className="textarea-tool h-48 w-full rounded-lg p-4 font-mono text-sm"
            spellCheck={false}
          />
          <div className="mt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={loadSample}
              className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-1.5 text-xs font-medium hover:border-[var(--primary)]"
            >
              加载示例
            </button>
            <div className="flex items-center gap-2">
              <label className="text-sm text-[var(--muted)]">根类型名:</label>
              <input
                type="text"
                value={rootName}
                onChange={(e) => setRootName(e.target.value || "Root")}
                className="input w-32 rounded-lg px-3 py-1.5 text-sm font-mono"
              />
            </div>
          </div>
        </div>

        {input.trim() && !parsed && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            JSON 格式错误，请检查语法
          </div>
        )}

        {parsed != null && typeof parsed === "object" ? (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-[var(--muted)]">目标语言:</span>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setLang(l.id)}
                    className={`category-tab ${lang === l.id ? "active" : ""}`}
                  >
                    {l.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-[var(--muted)]">生成代码</label>
                {code && (
                  <button
                    onClick={copyCode}
                    className="btn-primary rounded-lg px-3 py-1.5 text-xs font-medium"
                  >
                    {copied ? "已复制 ✓" : "复制代码"}
                  </button>
                )}
              </div>
              {code ? highlightCode(code) : (
                <p className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-4 text-sm text-[var(--muted)]">
                  根节点必须是 JSON 对象
                </p>
              )}
            </div>
          </>
        ) : null}
      </div>
    </ToolPageWrapper>
  );
}
