export interface Tool {
  name: string;
  description: string;
  icon: string;
  href: string;
  color: string;
  category: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export const categories: Category[] = [
  { id: "encoding", name: "编码解码", icon: "🔐", color: "from-violet-500 to-purple-600" },
  { id: "formatter", name: "格式化", icon: "📝", color: "from-blue-500 to-indigo-600" },
  { id: "text", name: "文本处理", icon: "✂️", color: "from-emerald-500 to-teal-600" },
  { id: "converter", name: "转换工具", icon: "🔄", color: "from-orange-500 to-amber-600" },
  { id: "generator", name: "生成器", icon: "⚡", color: "from-pink-500 to-rose-600" },
  { id: "media", name: "图片与文件", icon: "🖼", color: "from-cyan-500 to-blue-600" },
  { id: "dev", name: "开发辅助", icon: "🛠", color: "from-slate-500 to-zinc-600" },
  { id: "cheatsheet", name: "技术速查", icon: "📖", color: "from-amber-500 to-orange-600" },
];

export const tools: Tool[] = [
  // ── 编码解码 ──
  { name: "Base64 编解码", description: "文本与 Base64 互转，支持中文 Unicode 字符", icon: "B64", href: "/tools/base64", color: "from-teal-500 to-green-600", category: "encoding" },
  { name: "URL 编解码", description: "URL 编码与解码转换，处理中文和特殊字符", icon: "%", href: "/tools/url-codec", color: "from-sky-500 to-blue-600", category: "encoding" },
  { name: "HTML 实体编解码", description: "HTML 特殊字符转义与反转义，Unicode 编码", icon: "&;", href: "/tools/html-entity", color: "from-orange-500 to-amber-600", category: "encoding" },
  { name: "JWT 解码器", description: "解析 JWT Token，查看 Header、Payload 和过期时间", icon: "🔑", href: "/tools/jwt-decoder", color: "from-amber-500 to-yellow-600", category: "encoding" },
  { name: "图片转 Base64", description: "图片转 Base64 编码，或 Base64 还原为图片", icon: "🖼", href: "/tools/image-to-base64", color: "from-teal-500 to-cyan-600", category: "encoding" },

  // ── 格式化 ──
  { name: "JSON 格式化", description: "JSON 数据格式化、压缩、校验，支持语法高亮显示", icon: "{ }", href: "/tools/json-formatter", color: "from-amber-500 to-orange-600", category: "formatter" },
  { name: "YAML 格式化", description: "YAML 格式化、校验，支持 YAML 与 JSON 互转", icon: "Y{}", href: "/tools/yaml-formatter", color: "from-yellow-500 to-amber-600", category: "formatter" },
  { name: "SQL 格式化", description: "SQL 语句格式化、压缩、关键字大写转换", icon: "DB", href: "/tools/sql-formatter", color: "from-blue-500 to-indigo-600", category: "formatter" },
  { name: "Markdown 编辑器", description: "在线 Markdown 编辑与实时预览，支持导出 HTML", icon: "M↓", href: "/tools/markdown-editor", color: "from-indigo-500 to-blue-600", category: "formatter" },

  // ── 文本处理 ──
  { name: "文本统计", description: "统计文本字数、字符数、行数、段落数，支持中英文", icon: "Aa", href: "/tools/text-counter", color: "from-purple-500 to-violet-600", category: "text" },
  { name: "文本对比 Diff", description: "逐行对比两段文本差异，高亮新增和删除内容", icon: "±", href: "/tools/text-diff", color: "from-emerald-500 to-teal-600", category: "text" },
  { name: "文本处理", description: "去重、排序、大小写转换、去空行等文本操作", icon: "T✂", href: "/tools/text-tools", color: "from-green-500 to-lime-600", category: "text" },
  { name: "假文生成器", description: "生成中英文 Lorem Ipsum 假文，用于排版测试", icon: "T", href: "/tools/lorem-generator", color: "from-lime-500 to-green-600", category: "text" },
  { name: "文本转换", description: "文本格式批量转换，驼峰、下划线、大小写等", icon: "aA", href: "/tools/text-transform", color: "from-fuchsia-500 to-pink-600", category: "text" },

  // ── 转换工具 ──
  { name: "颜色转换器", description: "HEX、RGB、HSL 颜色格式互转，实时预览颜色", icon: "🎨", href: "/tools/color-converter", color: "from-pink-500 to-rose-600", category: "converter" },
  { name: "时间戳转换", description: "Unix 时间戳与日期时间互转，支持秒和毫秒", icon: "⏱", href: "/tools/timestamp", color: "from-orange-500 to-red-600", category: "converter" },
  { name: "进制转换器", description: "二进制、八进制、十进制、十六进制互相转换", icon: "0x", href: "/tools/number-base", color: "from-cyan-500 to-blue-600", category: "converter" },
  { name: "CSS 单位转换", description: "px、rem、em、vw、pt 等 CSS 单位互转", icon: "px", href: "/tools/css-unit", color: "from-rose-500 to-pink-600", category: "converter" },
  { name: "JSON-CSV 转换", description: "JSON 与 CSV 格式互相转换", icon: "⇄", href: "/tools/json-csv", color: "from-indigo-500 to-violet-600", category: "converter" },

  // ── 生成器 ──
  { name: "二维码生成器", description: "输入文字或链接，即时生成二维码，支持下载保存", icon: "▣", href: "/tools/qrcode-generator", color: "from-green-500 to-emerald-600", category: "generator" },
  { name: "密码生成器", description: "生成安全随机密码，自定义长度和字符类型", icon: "🔐", href: "/tools/password-generator", color: "from-red-500 to-pink-600", category: "generator" },
  { name: "UUID 生成器", description: "批量生成 UUID/GUID，支持多个版本", icon: "ID", href: "/tools/uuid-generator", color: "from-violet-500 to-indigo-600", category: "generator" },
  { name: "Hash 生成器", description: "计算 SHA-1、SHA-256、SHA-512 等哈希值", icon: "#", href: "/tools/hash-generator", color: "from-slate-500 to-zinc-600", category: "generator" },
  { name: "公私钥生成器", description: "在线生成 RSA/ECDSA 密钥对，支持 PEM 和 JWK 格式", icon: "🔑", href: "/tools/keypair-generator", color: "from-indigo-500 to-violet-600", category: "generator" },
  { name: "身份证号生成器", description: "生成符合规则的测试用身份证号码，支持指定地区和性别", icon: "🪪", href: "/tools/idcard-generator", color: "from-amber-500 to-orange-600", category: "generator" },
  { name: "手机号生成器", description: "生成符合号段规则的中国手机号码，支持指定运营商", icon: "📞", href: "/tools/phone-generator", color: "from-emerald-500 to-teal-600", category: "generator" },

  // ── 图片与文件 ──
  { name: "图片压缩", description: "在线压缩图片大小，保持清晰度，支持批量处理", icon: "🗜", href: "/tools/image-compressor", color: "from-blue-500 to-cyan-600", category: "media" },
  { name: "PDF 工具箱", description: "PDF 合并、拆分、信息提取，本地处理", icon: "📄", href: "/tools/pdf-tools", color: "from-red-500 to-orange-600", category: "media" },

  // ── 开发辅助 ──
  { name: "正则表达式测试", description: "实时测试正则表达式，高亮匹配结果，内置预设", icon: ".*", href: "/tools/regex-tester", color: "from-fuchsia-500 to-purple-600", category: "dev" },
  { name: "Cron 表达式", description: "解析 Cron 表达式，查看中文说明和执行时间", icon: "⏰", href: "/tools/cron-parser", color: "from-violet-500 to-indigo-600", category: "dev" },
  { name: "设备信息检测", description: "检测屏幕分辨率、浏览器信息、硬件配置", icon: "📱", href: "/tools/device-info", color: "from-indigo-500 to-purple-600", category: "dev" },

  // ── 技术速查 ──
  { name: "MySQL 速查手册", description: "MySQL 常用语句、函数、索引、权限操作速查", icon: "🐬", href: "/tools/mysql-cheatsheet", color: "from-blue-500 to-sky-600", category: "cheatsheet" },
  { name: "Git 命令速查", description: "Git 日常开发常用命令：分支、远程、回退、暂存等", icon: "G", href: "/tools/git-cheatsheet", color: "from-orange-500 to-red-600", category: "cheatsheet" },
  { name: "Linux 命令速查", description: "Linux 文件、目录、权限、进程、网络常用命令", icon: "🐧", href: "/tools/linux-cheatsheet", color: "from-slate-600 to-zinc-700", category: "cheatsheet" },
  { name: "HTTP 状态码查询", description: "HTTP 状态码含义、使用场景和常见原因速查", icon: "🌐", href: "/tools/http-status", color: "from-green-500 to-emerald-600", category: "cheatsheet" },
  { name: "Spring Boot 配置", description: "Spring Boot 常用配置、注解、代码片段速查", icon: "🍃", href: "/tools/springboot-ref", color: "from-green-600 to-lime-600", category: "cheatsheet" },
  { name: "Docker 速查手册", description: "Docker 镜像、容器、Compose、Dockerfile 操作速查", icon: "🐳", href: "/tools/docker-cheatsheet", color: "from-blue-600 to-cyan-600", category: "cheatsheet" },
  { name: "Nginx 配置速查", description: "Nginx 反向代理、负载均衡、HTTPS、缓存、限流配置", icon: "N", href: "/tools/nginx-cheatsheet", color: "from-green-600 to-emerald-600", category: "cheatsheet" },
  { name: "Redis 命令速查", description: "Redis 数据结构、命令、事务、持久化操作速查", icon: "R", href: "/tools/redis-cheatsheet", color: "from-red-600 to-rose-600", category: "cheatsheet" },
  { name: "Spring Cloud 速查", description: "Nacos、Feign、Gateway、Sentinel 微服务组件配置", icon: "☁", href: "/tools/springcloud-cheatsheet", color: "from-emerald-500 to-green-600", category: "cheatsheet" },
  { name: "Kubernetes 命令速查", description: "kubectl 全命令速查，Pod、Deployment、Service、RBAC 等", icon: "⎈", href: "/tools/k8s-cheatsheet", color: "from-blue-500 to-indigo-600", category: "cheatsheet" },
];

export function getToolByHref(href: string): Tool | undefined {
  return tools.find((t) => t.href === href);
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function getToolsByCategory(categoryId: string): Tool[] {
  return tools.filter((t) => t.category === categoryId);
}

export function getRelatedTools(href: string, limit = 4): Tool[] {
  const current = getToolByHref(href);
  if (!current) return [];
  return tools
    .filter((t) => t.category === current.category && t.href !== href)
    .slice(0, limit);
}
