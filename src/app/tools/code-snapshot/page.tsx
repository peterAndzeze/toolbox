"use client";

import { useState, useCallback, useEffect } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

const LANGUAGES = [
  { id: "javascript", name: "JavaScript" },
  { id: "typescript", name: "TypeScript" },
  { id: "python", name: "Python" },
  { id: "java", name: "Java" },
  { id: "go", name: "Go" },
  { id: "rust", name: "Rust" },
  { id: "cpp", name: "C++" },
  { id: "sql", name: "SQL" },
  { id: "html", name: "HTML" },
  { id: "css", name: "CSS" },
  { id: "shell", name: "Shell" },
  { id: "json", name: "JSON" },
  { id: "yaml", name: "YAML" },
] as const;

type ThemeId = "dark" | "light" | "monokai" | "dracula";

const THEMES: { id: ThemeId; name: string; bg: string; fg: string; keyword: string; string: string; comment: string; number: string }[] = [
  { id: "dark", name: "深色", bg: "#1e1e2e", fg: "#cdd6f4", keyword: "#cba6f7", string: "#a6e3a1", comment: "#6c7086", number: "#fab387" },
  { id: "light", name: "浅色", bg: "#fafafa", fg: "#383a42", keyword: "#a626a4", string: "#50a14f", comment: "#a0a1a7", number: "#986801" },
  { id: "monokai", name: "Monokai", bg: "#272822", fg: "#f8f8f2", keyword: "#f92672", string: "#e6db74", comment: "#75715e", number: "#ae81ff" },
  { id: "dracula", name: "Dracula", bg: "#282a36", fg: "#f8f8f2", keyword: "#ff79c6", string: "#f1fa8c", comment: "#6272a4", number: "#bd93f9" },
];

const KEYWORDS: Record<string, string[]> = {
  javascript: ["const", "let", "var", "function", "return", "if", "else", "for", "while", "class", "extends", "import", "export", "default", "async", "await", "try", "catch", "throw", "new", "this", "typeof", "instanceof", "true", "false", "null", "undefined"],
  typescript: ["const", "let", "var", "function", "return", "if", "else", "for", "while", "class", "extends", "import", "export", "default", "async", "await", "try", "catch", "throw", "new", "this", "typeof", "instanceof", "true", "false", "null", "undefined", "interface", "type", "enum", "as", "string", "number", "boolean", "void", "any"],
  python: ["def", "class", "if", "elif", "else", "for", "while", "return", "import", "from", "as", "try", "except", "finally", "with", "lambda", "yield", "and", "or", "not", "in", "is", "None", "True", "False", "async", "await"],
  java: ["public", "private", "protected", "class", "interface", "extends", "implements", "void", "return", "if", "else", "for", "while", "try", "catch", "throw", "new", "this", "super", "static", "final", "import", "package", "true", "false", "null"],
  go: ["func", "package", "import", "return", "var", "const", "if", "else", "for", "range", "switch", "case", "default", "struct", "type", "interface", "nil", "true", "false", "chan", "go", "defer"],
  rust: ["fn", "let", "mut", "pub", "struct", "enum", "impl", "trait", "if", "else", "for", "while", "loop", "match", "return", "use", "mod", "self", "true", "false", "Some", "None", "Ok", "Err", "async", "await"],
  cpp: ["int", "void", "char", "float", "double", "bool", "class", "struct", "if", "else", "for", "while", "return", "public", "private", "protected", "namespace", "using", "include", "true", "false", "nullptr", "auto", "const", "static"],
  sql: ["SELECT", "FROM", "WHERE", "INSERT", "INTO", "VALUES", "UPDATE", "SET", "DELETE", "JOIN", "LEFT", "RIGHT", "INNER", "OUTER", "ON", "AND", "OR", "NOT", "ORDER", "BY", "GROUP", "HAVING", "LIMIT", "CREATE", "TABLE", "DROP", "ALTER", "AS", "NULL"],
  html: ["html", "head", "body", "div", "span", "p", "a", "img", "script", "style", "link", "meta", "title", "h1", "h2", "h3", "ul", "ol", "li", "form", "input", "button", "class", "id"],
  css: ["@media", "@keyframes", "@import", "url", "var", "!important", "px", "em", "rem", "vh", "vw", "flex", "grid", "block", "inline", "none", "absolute", "relative", "fixed", "sticky"],
  shell: ["if", "then", "else", "fi", "for", "while", "do", "done", "case", "esac", "echo", "export", "source", "cd", "ls", "cat", "grep", "sed", "awk", "exit", "return"],
  json: [],
  yaml: ["true", "false", "null", "yes", "no"],
};

function highlightLine(line: string, lang: string, theme: (typeof THEMES)[0]): { text: string; color: string }[] {
  const parts: { text: string; color: string }[] = [];
  const keywords = KEYWORDS[lang] ?? [];
  const kwSet = new Set(keywords.map((k) => k.toLowerCase()));

  let i = 0;
  const rest = () => line.slice(i);

  while (i < line.length) {
    const r = rest();

    const dq = r.match(/^"([^"\\]|\\.)*"/);
    const sq = r.match(/^'([^'\\]|\\.)*'/);
    const bq = r.match(/^`[^`]*`/);
    if (dq) {
      parts.push({ text: dq[0], color: theme.string });
      i += dq[0].length;
      continue;
    }
    if (sq) {
      parts.push({ text: sq[0], color: theme.string });
      i += sq[0].length;
      continue;
    }
    if (bq) {
      parts.push({ text: bq[0], color: theme.string });
      i += bq[0].length;
      continue;
    }

    const slComment = r.match(/^(\/\/|#).*/);
    const mlStart = r.match(/^\/\*/);
    if (slComment) {
      parts.push({ text: slComment[0], color: theme.comment });
      i += slComment[0].length;
      continue;
    }
    if (mlStart) {
      const end = r.indexOf("*/");
      const chunk = end >= 0 ? r.slice(0, end + 2) : r;
      parts.push({ text: chunk, color: theme.comment });
      i += chunk.length;
      continue;
    }

    const num = r.match(/^\d+\.?\d*([eE][+-]?\d+)?/);
    if (num) {
      parts.push({ text: num[0], color: theme.number });
      i += num[0].length;
      continue;
    }

    const word = r.match(/^[a-zA-Z_][a-zA-Z0-9_]*/);
    if (word) {
      const w = word[0];
      const color = kwSet.has(w.toLowerCase()) ? theme.keyword : theme.fg;
      parts.push({ text: w, color });
      i += w.length;
      continue;
    }

    parts.push({ text: r[0] ?? "", color: theme.fg });
    i += 1;
  }

  return parts;
}

export default function CodeSnapshotPage() {
  const [code, setCode] = useState(`function greet(name) {
  return "Hello, " + name + "!";
}

console.log(greet("World"));`);
  const [language, setLanguage] = useState("javascript");
  const [themeId, setThemeId] = useState<ThemeId>("dark");
  useEffect(() => {
    const t = THEMES.find((x) => x.id === themeId);
    if (t) setBgColor(t.bg);
  }, [themeId]);
  const [padding, setPadding] = useState(24);
  const [radius, setRadius] = useState(12);
  const [bgColor, setBgColor] = useState("#1e1e2e");
  const [fontSize, setFontSize] = useState(14);
  const [showControls, setShowControls] = useState(true);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [filename, setFilename] = useState("example.js");
  const theme = THEMES.find((t) => t.id === themeId) ?? THEMES[0];
  const lines = code.split("\n");

  const exportPng = useCallback(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const lineHeight = fontSize * 1.5;
    const controlH = showControls ? 40 : 0;
    const titleH = showControls ? 0 : 20;
    const headerH = controlH || titleH || 0;
    const numWidth = showLineNumbers ? Math.max(3, String(lines.length).length) * fontSize * 0.6 + 24 : 0;
    const codeWidth = 600;
    const totalW = padding * 2 + numWidth + codeWidth;
    const totalH = padding * 2 + headerH + lines.length * lineHeight;

    canvas.width = totalW;
    canvas.height = totalH;

    ctx.fillStyle = bgColor;
    ctx.beginPath();
    if (typeof ctx.roundRect === "function") {
      ctx.roundRect(0, 0, totalW, totalH, radius);
    } else {
      ctx.rect(0, 0, totalW, totalH);
    }
    ctx.fill();

    let y = padding;

    if (showControls) {
      const dotR = 6;
      const dotY = padding + 20;
      ["#ff5f56", "#ffbd2e", "#27c93f"].forEach((c, i) => {
        ctx.fillStyle = c;
        ctx.beginPath();
        ctx.arc(24 + i * 20, dotY, dotR, 0, Math.PI * 2);
        ctx.fill();
      });
      const nameX = 24 + 3 * 20 + 24;
      ctx.fillStyle = theme.fg;
      ctx.font = `${fontSize}px monospace`;
      ctx.fillText(filename, nameX, dotY + 4);
      y = padding + 40;
    }

    lines.forEach((line, idx) => {
      const lineY = y + idx * lineHeight + fontSize;

      if (showLineNumbers) {
        ctx.fillStyle = theme.comment;
        ctx.font = `${fontSize}px monospace`;
        ctx.textAlign = "right";
        ctx.fillText(String(idx + 1), padding + numWidth - 8, lineY);
        ctx.textAlign = "left";
      }

      const parts = highlightLine(line, language, theme);
      let x = padding + numWidth;
      parts.forEach(({ text, color }) => {
        ctx.fillStyle = color;
        ctx.font = `${fontSize}px monospace`;
        ctx.fillText(text, x, lineY);
        x += ctx.measureText(text).width;
      });
    });

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename.replace(/\.[^.]+$/, "") + ".png";
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }, [code, language, theme, padding, radius, bgColor, fontSize, showControls, showLineNumbers, filename, lines]);

  return (
    <ToolPageWrapper>
      <h1 className="page-title">代码截图美化</h1>
      <p className="page-subtitle">支持多语言语法高亮，自定义主题和样式，生成精美代码图片分享</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="card rounded-xl p-4">
            <label className="mb-2 block text-sm font-medium">代码</label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="textarea-tool min-h-[200px] w-full rounded-lg p-4 font-mono text-sm"
              placeholder="粘贴或输入代码..."
              spellCheck={false}
            />
          </div>

          <div className="card rounded-xl p-4">
            <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium">语言</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="input w-full rounded-lg px-3 py-2"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">主题</label>
                <select
                  value={themeId}
                  onChange={(e) => setThemeId(e.target.value as ThemeId)}
                  className="input w-full rounded-lg px-3 py-2"
                >
                  {THEMES.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">文件名</label>
                <input
                  type="text"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  className="input w-full rounded-lg px-3 py-2 font-mono text-sm"
                  placeholder="example.js"
                />
              </div>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <label className="mb-2 block text-sm font-medium">内边距 ({padding}px)</label>
                <input
                  type="range"
                  min={8}
                  max={48}
                  value={padding}
                  onChange={(e) => setPadding(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">圆角 ({radius}px)</label>
                <input
                  type="range"
                  min={0}
                  max={24}
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">字号 ({fontSize}px)</label>
                <input
                  type="range"
                  min={10}
                  max={24}
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">背景色</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="h-10 w-14 cursor-pointer rounded border-0"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="input flex-1 rounded-lg px-2 py-1.5 font-mono text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showControls}
                  onChange={(e) => setShowControls(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">窗口控制按钮</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showLineNumbers}
                  onChange={(e) => setShowLineNumbers(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">行号</span>
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card rounded-xl p-4">
            <label className="mb-3 block text-sm font-medium">预览</label>
            <div
              className="overflow-hidden rounded-xl"
              style={{
                backgroundColor: bgColor,
                padding: `${padding}px`,
                borderRadius: `${radius}px`,
              }}
            >
              {showControls && (
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex gap-2">
                    <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                    <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                    <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
                  </div>
                  <span className="font-mono text-sm" style={{ color: theme.fg }}>{filename}</span>
                </div>
              )}
              <div className="font-mono" style={{ fontSize: `${fontSize}px`, lineHeight: 1.5 }}>
                {lines.map((line, idx) => (
                  <div key={idx} className="flex">
                    {showLineNumbers && (
                      <span
                        className="select-none pr-4 text-right"
                        style={{ color: theme.comment, minWidth: 36 }}
                      >
                        {idx + 1}
                      </span>
                    )}
                    <span className="flex-1">
                      {highlightLine(line, language, theme).map((p, i) => (
                        <span key={i} style={{ color: p.color }}>{p.text}</span>
                      ))}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card rounded-xl p-4">
            <button
              onClick={exportPng}
              className="btn-primary w-full rounded-lg px-4 py-3 text-sm font-medium"
            >
              下载 PNG 图片
            </button>
          </div>
        </div>
      </div>
    </ToolPageWrapper>
  );
}
