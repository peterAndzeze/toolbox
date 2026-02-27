"use client";

import { useState, useCallback, useMemo } from "react";
import { ToolPageWrapper } from "@/components/ToolPageWrapper";

interface ParsedCurl {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: string;
  auth?: { user: string; pass: string };
  cookies?: string;
  followRedirects: boolean;
  insecure: boolean;
  error?: string;
}

function tokenizeCurl(input: string): string[] {
  const tokens: string[] = [];
  let current = "";
  let inSingle = false;
  let inDouble = false;
  let i = 0;

  while (i < input.length) {
    const c = input[i];
    if (inSingle) {
      if (c === "'") {
        inSingle = false;
        tokens.push(current);
        current = "";
      } else {
        current += c;
      }
      i++;
      continue;
    }
    if (inDouble) {
      if (c === "\\" && i + 1 < input.length) {
        current += input[i + 1];
        i += 2;
        continue;
      }
      if (c === '"') {
        inDouble = false;
        tokens.push(current);
        current = "";
      } else {
        current += c;
      }
      i++;
      continue;
    }
    if (c === "'") {
      inSingle = true;
      i++;
      continue;
    }
    if (c === '"') {
      inDouble = true;
      i++;
      continue;
    }
    if (/\s/.test(c)) {
      if (current) {
        tokens.push(current);
        current = "";
      }
      i++;
      continue;
    }
    current += c;
    i++;
  }
  if (current) tokens.push(current);
  return tokens;
}

function parseCurl(input: string): ParsedCurl {
  const result: ParsedCurl = {
    url: "",
    method: "GET",
    headers: {},
    body: "",
    followRedirects: false,
    insecure: false,
  };

  const raw = input.trim();
  if (!raw) {
    result.error = "请输入 cURL 命令";
    return result;
  }

  const tokens = tokenizeCurl(raw);
  let i = 0;

  while (i < tokens.length) {
    const t = tokens[i];
    if (t === "curl" || t.startsWith("curl")) {
      if (t.length > 3) {
        const rest = t.slice(4).trim();
        if (rest) tokens.splice(i + 1, 0, rest);
      }
      i++;
      continue;
    }
    if (t === "-X" || t === "--request") {
      const method = tokens[i + 1]?.toUpperCase() || "GET";
      result.method = method;
      i += 2;
      continue;
    }
    if (t === "-H" || t === "--header") {
      const header = tokens[i + 1] || "";
      const colon = header.indexOf(":");
      if (colon > 0) {
        const key = header.slice(0, colon).trim();
        const val = header.slice(colon + 1).trim();
        result.headers[key] = val;
      }
      i += 2;
      continue;
    }
    if (t === "-d" || t === "--data" || t === "--data-raw" || t === "--data-ascii") {
      result.body = tokens[i + 1] || "";
      if (result.method === "GET") result.method = "POST";
      i += 2;
      continue;
    }
    if (t === "-u" || t === "--user") {
      const cred = tokens[i + 1] || "";
      const colon = cred.indexOf(":");
      if (colon > 0) {
        result.auth = { user: cred.slice(0, colon), pass: cred.slice(colon + 1) };
      } else {
        result.auth = { user: cred, pass: "" };
      }
      i += 2;
      continue;
    }
    if (t === "-b" || t === "--cookie") {
      result.cookies = tokens[i + 1] || "";
      i += 2;
      continue;
    }
    if (t === "-L" || t === "--location") {
      result.followRedirects = true;
      i++;
      continue;
    }
    if (t === "-k" || t === "--insecure") {
      result.insecure = true;
      i++;
      continue;
    }
    if (t.startsWith("http://") || t.startsWith("https://")) {
      result.url = t;
      i++;
      continue;
    }
    i++;
  }

  if (!result.url) result.error = "未找到 URL";
  return result;
}

const LANGUAGES = [
  { id: "python", name: "Python (requests)" },
  { id: "javascript", name: "JavaScript (fetch)" },
  { id: "java", name: "Java (HttpURLConnection)" },
  { id: "go", name: "Go (net/http)" },
  { id: "php", name: "PHP (cURL)" },
  { id: "nodejs", name: "Node.js (axios)" },
] as const;

function generateCode(parsed: ParsedCurl, lang: string): string {
  const { url, method, headers, body, auth, cookies, followRedirects, insecure } = parsed;
  const hasBody = body.length > 0;

  switch (lang) {
    case "python": {
      let code = "import requests\n\n";
      const mergedHeaders = { ...headers };
      if (cookies) mergedHeaders["Cookie"] = cookies;
      const opts: string[] = ["method='" + method + "'"];
      if (Object.keys(mergedHeaders).length) {
        code += "headers = " + JSON.stringify(mergedHeaders, null, 2) + "\n\n";
        opts.push("headers=headers");
      }
      if (auth) {
        opts.push(`auth=("${auth.user}", "${auth.pass}")`);
      }
      if (hasBody) {
        try {
          JSON.parse(body);
          opts.push("json=" + body);
        } catch {
          opts.push("data=" + JSON.stringify(body));
        }
      }
      opts.push("verify=" + (insecure ? "False" : "True"));
      opts.push("allow_redirects=" + (followRedirects ? "True" : "False"));
      code += `response = requests.request(${opts.join(", ")}, url="${url}")\n`;
      code += "print(response.text)";
      return code;
    }
    case "javascript": {
      const opts: Record<string, unknown> = { method };
      if (Object.keys(headers).length) opts.headers = headers;
      if (auth) {
        opts.headers = { ...(opts.headers as object), Authorization: "Basic " + btoa(auth.user + ":" + auth.pass) };
      }
      if (cookies) {
        opts.headers = { ...(opts.headers as object), Cookie: cookies };
      }
      if (hasBody) {
        try {
          JSON.parse(body);
          opts.body = body;
        } catch {
          opts.body = body;
        }
      }
      opts.redirect = followRedirects ? "follow" : "manual";
      let code = "const response = await fetch(\"" + url + "\", " + JSON.stringify(opts, null, 2) + ");\n";
      code += "const data = await response.text();\nconsole.log(data);";
      return code;
    }
    case "java": {
      let code = "import java.io.*;\nimport java.net.*;\nimport java.util.stream.Collectors;\n\n";
      code += "URL url = new URL(\"" + url + "\");\n";
      code += "HttpURLConnection conn = (HttpURLConnection) url.openConnection();\n";
      code += "conn.setRequestMethod(\"" + method + "\");\n";
      if (Object.keys(headers).length) {
        for (const [k, v] of Object.entries(headers)) {
          code += `conn.setRequestProperty("${k}", "${v.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}");\n`;
        }
      }
      if (auth) {
        const b64 = btoa(auth.user + ":" + auth.pass);
        code += `conn.setRequestProperty("Authorization", "Basic ${b64}");\n`;
      }
      if (cookies) {
        code += `conn.setRequestProperty("Cookie", "${cookies.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}");\n`;
      }
      if (insecure) code += "// 需要配置 SSL 忽略证书验证\n";
      if (followRedirects) code += "conn.setInstanceFollowRedirects(true);\n";
      if (hasBody && (method === "POST" || method === "PUT" || method === "PATCH")) {
        code += "conn.setDoOutput(true);\n";
        code += "try (OutputStream os = conn.getOutputStream()) {\n";
        code += "  os.write(\"" + body.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n") + "\".getBytes());\n";
        code += "}\n";
      }
      code += "int code = conn.getResponseCode();\n";
      code += "String response = new BufferedReader(new InputStreamReader(conn.getInputStream())).lines().collect(Collectors.joining(\"\\n\"));\n";
      code += "System.out.println(response);";
      return code;
    }
    case "go": {
      let code = 'import (\n  "bytes"\n  "io"\n  "net/http"\n)\n\n';
      if (hasBody) {
        const escapedBody = body.replace(/\\/g, "\\\\").replace(/`/g, "\\`");
        code += "body := []byte(`" + escapedBody + "`)\n";
        code += 'req, _ := http.NewRequest("' + method + '", "' + url + '", bytes.NewBuffer(body))\n';
      } else {
        code += 'req, _ := http.NewRequest("' + method + '", "' + url + '", nil)\n';
      }
      for (const [k, v] of Object.entries(headers)) {
        code += `req.Header.Set("${k}", "${v.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}")\n`;
      }
      if (auth) {
        code += `req.SetBasicAuth("${auth.user}", "${auth.pass}")\n`;
      }
      if (cookies) {
        code += `req.Header.Set("Cookie", "${cookies.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}")\n`;
      }
      code += "client := &http.Client{}\n";
      code += "resp, err := client.Do(req)\n";
      code += "defer resp.Body.Close()\n";
      code += "data, _ := io.ReadAll(resp.Body)\n";
      code += "println(string(data))";
      return code;
    }
    case "php": {
      let code = "<?php\n$ch = curl_init();\n";
      code += 'curl_setopt($ch, CURLOPT_URL, "' + url + '");\n';
      code += 'curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "' + method + '");\n';
      if (Object.keys(headers).length) {
        const arr = Object.entries(headers).map(([k, v]) => `"${k}: ${v}"`);
        code += "curl_setopt($ch, CURLOPT_HTTPHEADER, [" + arr.join(", ") + "]);\n";
      }
      if (auth) {
        code += `curl_setopt($ch, CURLOPT_USERPWD, "${auth.user}:${auth.pass}");\n`;
      }
      if (cookies) {
        code += `curl_setopt($ch, CURLOPT_COOKIE, "${cookies.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}");\n`;
      }
      if (hasBody) {
        code += `curl_setopt($ch, CURLOPT_POSTFIELDS, '${body.replace(/'/g, "\\'")}');\n`;
      }
      code += "curl_setopt($ch, CURLOPT_FOLLOWLOCATION, " + (followRedirects ? "true" : "false") + ");\n";
      code += "curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, " + (insecure ? "false" : "true") + ");\n";
      code += "curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);\n";
      code += "$response = curl_exec($ch);\ncurl_close($ch);\necho $response;";
      return code;
    }
    case "nodejs": {
      let code = "const axios = require('axios');\n\n";
      const opts: Record<string, unknown> = { method: method.toLowerCase() };
      if (Object.keys(headers).length) opts.headers = headers;
      if (auth) {
        opts.auth = { username: auth.user, password: auth.pass };
      }
      if (cookies) {
        opts.headers = { ...(opts.headers as object), Cookie: cookies };
      }
      if (hasBody) {
        try {
          opts.data = JSON.parse(body);
        } catch {
          opts.data = body;
        }
      }
      opts.maxRedirects = followRedirects ? 5 : 0;
      opts.httpsAgent = insecure ? "// 需配置 rejectUnauthorized: false" : undefined;
      if (opts.httpsAgent) delete opts.httpsAgent;
      code += "const response = await axios(" + JSON.stringify({ url, ...opts }, null, 2) + ");\n";
      code += "console.log(response.data);";
      return code;
    }
    default:
      return "";
  }
}

function highlightCode(code: string, lang: string): React.ReactNode {
  const lines = code.split("\n");
  return (
    <pre className="overflow-x-auto rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-4 font-mono text-sm">
      {lines.map((line, i) => (
        <div key={i} className="leading-relaxed">
          {line.split(/(\b(?:import|const|let|var|function|return|if|else|for|while|try|catch|class|def|async|await)\b|"[^"]*"|'[^']*'|\d+)/g).map((part, j) => {
            if (part.match(/^(import|const|let|var|function|return|if|else|for|while|try|catch|class|def|async|await)$/)) {
              return <span key={j} className="text-purple-600 dark:text-purple-400">{part}</span>;
            }
            if (part.match(/^"[^"]*"|'[^']*'$/)) {
              return <span key={j} className="text-green-600 dark:text-green-400">{part}</span>;
            }
            if (part.match(/^\d+$/)) {
              return <span key={j} className="text-amber-600 dark:text-amber-400">{part}</span>;
            }
            return <span key={j}>{part}</span>;
          })}
        </div>
      ))}
    </pre>
  );
}

export default function CurlConverterPage() {
  const [input, setInput] = useState("");
  const [lang, setLang] = useState<(typeof LANGUAGES)[number]["id"]>("python");
  const [copied, setCopied] = useState(false);

  const parsed = useMemo(() => parseCurl(input), [input]);
  const code = useMemo(() => (parsed.error ? "" : generateCode(parsed, lang)), [parsed, lang]);

  const copyCode = useCallback(() => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  const sampleCurl = `curl -X POST https://api.example.com/users \\
  -H "Content-Type: application/json" \\
  -d '{"name":"张三","age":25}' \\
  -u admin:secret123`;

  return (
    <ToolPageWrapper>
      <h1 className="page-title">cURL 转代码</h1>
      <p className="page-subtitle">
        将 cURL 命令转换为 Python、JavaScript、Java、Go、PHP、Node.js 代码
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--muted)]">粘贴 cURL 命令</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={sampleCurl}
            className="textarea-tool h-40 w-full rounded-lg p-4 font-mono text-sm"
            spellCheck={false}
          />
          <button
            onClick={() => setInput(sampleCurl)}
            className="mt-2 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-1.5 text-xs font-medium hover:border-[var(--primary)]"
          >
            加载示例
          </button>
        </div>

        {parsed.error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {parsed.error}
          </div>
        )}

        {!parsed.error && parsed.url && (
          <div className="card rounded-xl p-4">
            <h3 className="mb-3 text-sm font-semibold">解析结果</h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-[var(--muted)]">请求方法:</span> <span className="font-mono text-[var(--primary)]">{parsed.method}</span></p>
              <p><span className="text-[var(--muted)]">URL:</span> <span className="font-mono text-[var(--primary)] break-all">{parsed.url}</span></p>
              {Object.keys(parsed.headers).length > 0 && (
                <div>
                  <span className="text-[var(--muted)]">请求头:</span>
                  <pre className="mt-1 overflow-x-auto rounded bg-black/5 p-2 font-mono text-xs dark:bg-white/5">
                    {Object.entries(parsed.headers).map(([k, v]) => `${k}: ${v}`).join("\n")}
                  </pre>
                </div>
              )}
              {parsed.body && (
                <div>
                  <span className="text-[var(--muted)]">请求体:</span>
                  <pre className="mt-1 max-h-24 overflow-auto rounded bg-black/5 p-2 font-mono text-xs dark:bg-white/5">
                    {parsed.body}
                  </pre>
                </div>
              )}
              {parsed.auth && (
                <p><span className="text-[var(--muted)]">Basic Auth:</span> {parsed.auth.user}:****</p>
              )}
              {parsed.cookies && (
                <p><span className="text-[var(--muted)]">Cookie:</span> <span className="font-mono text-xs">{parsed.cookies}</span></p>
              )}
            </div>
          </div>
        )}

        {!parsed.error && parsed.url && (
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
              {highlightCode(code, lang)}
            </div>
          </>
        )}
      </div>
    </ToolPageWrapper>
  );
}
