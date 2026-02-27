import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "假文生成器 - Lorem Ipsum 中英文假文",
  description: "免费在线假文生成工具，支持中文和英文Lorem Ipsum，按段落、句子、字数生成。适合设计师和开发者。",
  keywords: ["Lorem Ipsum", "假文生成", "占位文本", "设计填充文字", "中文假文"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
