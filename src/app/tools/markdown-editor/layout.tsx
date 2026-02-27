import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Markdown 编辑器 - 在线实时预览",
  description:
    "免费在线Markdown编辑器，支持实时预览、语法高亮、导出HTML。无需安装，打开即用。",
  keywords: ["Markdown编辑器", "Markdown预览", "在线Markdown", "Markdown转HTML"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
