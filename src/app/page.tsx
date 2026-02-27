import Link from "next/link";

const tools = [
  {
    name: "JSON 格式化",
    description: "JSON 数据格式化、压缩、校验，支持语法高亮显示",
    icon: "{ }",
    href: "/tools/json-formatter",
    color: "from-amber-500 to-orange-600",
  },
  {
    name: "二维码生成器",
    description: "输入文字或链接，即时生成二维码，支持下载保存",
    icon: "▣",
    href: "/tools/qrcode-generator",
    color: "from-green-500 to-emerald-600",
  },
  {
    name: "图片压缩",
    description: "在线压缩图片大小，保持清晰度，支持批量处理",
    icon: "🖼",
    href: "/tools/image-compressor",
    color: "from-blue-500 to-cyan-600",
  },
  {
    name: "Markdown 编辑器",
    description: "在线 Markdown 编辑与实时预览，支持导出 HTML",
    icon: "M↓",
    href: "/tools/markdown-editor",
    color: "from-indigo-500 to-blue-600",
  },
  {
    name: "密码生成器",
    description: "生成安全随机密码，自定义长度和字符类型",
    icon: "🔐",
    href: "/tools/password-generator",
    color: "from-red-500 to-pink-600",
  },
  {
    name: "文本统计",
    description: "统计文本字数、字符数、行数、段落数，支持中英文",
    icon: "Aa",
    href: "/tools/text-counter",
    color: "from-purple-500 to-violet-600",
  },
  {
    name: "颜色转换器",
    description: "HEX、RGB、HSL 颜色格式互转，实时预览颜色",
    icon: "🎨",
    href: "/tools/color-converter",
    color: "from-pink-500 to-rose-600",
  },
  {
    name: "Base64 编解码",
    description: "文本与 Base64 互转，支持中文 Unicode 字符",
    icon: "B64",
    href: "/tools/base64",
    color: "from-teal-500 to-green-600",
  },
  {
    name: "URL 编解码",
    description: "URL 编码与解码转换，处理中文和特殊字符",
    icon: "%",
    href: "/tools/url-codec",
    color: "from-sky-500 to-blue-600",
  },
  {
    name: "时间戳转换",
    description: "Unix 时间戳与日期时间互转，支持秒和毫秒",
    icon: "⏱",
    href: "/tools/timestamp",
    color: "from-orange-500 to-red-600",
  },
  {
    name: "YAML 格式化",
    description: "YAML 格式化、校验，支持 YAML 与 JSON 互转",
    icon: "Y{}",
    href: "/tools/yaml-formatter",
    color: "from-yellow-500 to-amber-600",
  },
  {
    name: "文本对比 Diff",
    description: "逐行对比两段文本差异，高亮新增和删除内容",
    icon: "±",
    href: "/tools/text-diff",
    color: "from-emerald-500 to-teal-600",
  },
  {
    name: "Hash 生成器",
    description: "计算 SHA-1、SHA-256、SHA-512 等哈希值",
    icon: "#",
    href: "/tools/hash-generator",
    color: "from-slate-500 to-zinc-600",
  },
  {
    name: "正则表达式测试",
    description: "实时测试正则表达式，高亮匹配结果，内置预设",
    icon: ".*",
    href: "/tools/regex-tester",
    color: "from-fuchsia-500 to-purple-600",
  },
  {
    name: "进制转换器",
    description: "二进制、八进制、十进制、十六进制互相转换",
    icon: "0x",
    href: "/tools/number-base",
    color: "from-cyan-500 to-blue-600",
  },
];

export default function Home() {
  return (
    <div>
      <section className="py-12 text-center sm:py-20">
        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
          免费在线工具箱
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-[var(--muted)] sm:text-lg">
          无需下载安装，打开浏览器即可使用。所有工具完全免费，数据不上传服务器，保护你的隐私。
        </p>
        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-2 text-sm text-[var(--muted)]">
          <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
          已上线 {tools.length} 个工具，持续更新中
        </div>
      </section>

      <section id="tools" className="pb-16">
        <h2 className="mb-8 text-xl font-semibold">全部工具</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link key={tool.href} href={tool.href} className="tool-card group rounded-xl p-6">
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${tool.color} text-xl font-bold text-white`}
              >
                {tool.icon}
              </div>
              <h3 className="text-lg font-semibold group-hover:text-[var(--primary)]">
                {tool.name}
              </h3>
              <p className="mt-2 text-sm text-[var(--muted)]">
                {tool.description}
              </p>
              <div className="mt-4 flex items-center text-sm font-medium text-[var(--primary)]">
                立即使用
                <span className="ml-1 transition-transform group-hover:translate-x-1">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-[var(--card-border)] py-16">
        <div className="grid gap-8 text-center sm:grid-cols-3">
          <div>
            <div className="text-3xl font-bold text-[var(--primary)]">100%</div>
            <p className="mt-2 text-sm text-[var(--muted)]">完全免费使用</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-[var(--primary)]">0</div>
            <p className="mt-2 text-sm text-[var(--muted)]">数据不上传服务器</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-[var(--primary)]">∞</div>
            <p className="mt-2 text-sm text-[var(--muted)]">不限使用次数</p>
          </div>
        </div>
      </section>
    </div>
  );
}
