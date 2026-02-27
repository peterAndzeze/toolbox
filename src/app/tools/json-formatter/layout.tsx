import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON 格式化在线工具 - 免费校验压缩",
  description:
    "免费在线JSON格式化工具，支持JSON校验、美化、压缩，语法错误提示。无需下载，浏览器本地处理，保护数据隐私。",
  keywords: ["JSON格式化", "JSON校验", "JSON美化", "JSON压缩", "在线JSON工具"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
