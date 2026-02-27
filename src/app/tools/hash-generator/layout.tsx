import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Hash 生成器 - SHA-256 在线哈希计算",
  description: "免费在线Hash生成工具，支持SHA-1、SHA-256、SHA-384、SHA-512哈希计算。浏览器本地处理，安全可靠。",
  keywords: ["Hash生成器", "SHA256", "哈希计算", "SHA-1", "在线Hash"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
