import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "URL 编解码 - 在线 URL 编码解码工具",
  description:
    "免费在线URL编解码工具，支持URL编码和解码，处理中文和特殊字符。开发必备工具。",
  keywords: ["URL编码", "URL解码", "URL编解码", "encodeURIComponent"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
