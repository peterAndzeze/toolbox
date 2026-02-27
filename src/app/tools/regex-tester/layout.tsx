import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "正则表达式测试 - 在线 Regex 测试工具",
  description: "免费在线正则表达式测试工具，实时高亮匹配结果，支持分组捕获，内置常用正则预设。",
  keywords: ["正则表达式测试", "Regex测试", "正则在线", "正则匹配", "正则表达式工具"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
