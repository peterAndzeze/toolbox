import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "文本统计 - 在线字数统计工具",
  description:
    "免费在线文本统计工具，统计字数、字符数、行数、段落数，支持中英文混合文本。适合写作、论文字数统计。",
  keywords: ["字数统计", "文本统计", "字符计数", "在线字数", "文章字数统计"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
