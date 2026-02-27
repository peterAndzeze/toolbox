import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "文本处理工具 - 去重排序大小写转换",
  description: "免费在线文本处理工具，支持文本去重、排序、大小写转换、去空行、驼峰/下划线转换等。",
  keywords: ["文本去重", "文本排序", "大小写转换", "去空行", "文本处理"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
