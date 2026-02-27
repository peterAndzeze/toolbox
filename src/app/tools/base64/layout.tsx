import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Base64 编解码 - 在线 Base64 转换工具",
  description:
    "免费在线Base64编解码工具，支持文本与Base64互相转换，支持中文Unicode字符。浏览器本地处理，保护隐私。",
  keywords: ["Base64编码", "Base64解码", "Base64转换", "在线Base64"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
