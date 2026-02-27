import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "文本对比 Diff - 在线文件内容比较工具",
  description: "免费在线文本对比工具，逐行对比两段文本差异，高亮显示新增和删除内容。适合代码审查、配置对比。",
  keywords: ["文本对比", "Diff工具", "文件比较", "代码对比", "在线Diff"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
