import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "cURL 转代码 - cURL 命令在线转换",
  description:
    "免费在线 cURL 转代码工具，支持转换为 Python、JavaScript、Java、Go、PHP、Node.js 代码。",
  keywords: ["cURL转代码", "cURL转Python", "cURL转JavaScript", "cURL转Java", "cURL转Go"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
