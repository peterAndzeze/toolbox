import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "代码截图美化 - Code Snapshot 在线工具",
  description:
    "免费在线代码截图工具，支持多语言语法高亮，自定义主题和样式，生成精美代码图片分享。",
  keywords: ["代码截图", "代码美化", "Code Snapshot", "代码图片", "Carbon替代"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
