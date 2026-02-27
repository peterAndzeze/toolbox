import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON 转代码 - JSON 生成类型定义",
  description:
    "免费在线 JSON 转代码工具，将 JSON 转为 TypeScript、Java、Go、C#、Python、Kotlin 类型定义。",
  keywords: ["JSON转代码", "JSON转TypeScript", "JSON转Java", "JSON转Go", "JSON转类"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
