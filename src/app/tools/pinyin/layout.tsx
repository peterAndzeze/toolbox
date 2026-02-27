import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "汉字转拼音 - 中文拼音在线转换",
  description:
    "免费在线汉字转拼音工具，支持声调标注、拼音首字母提取，实时转换中文为拼音。",
  keywords: ["汉字转拼音", "中文转拼音", "拼音转换", "拼音首字母", "在线拼音"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
