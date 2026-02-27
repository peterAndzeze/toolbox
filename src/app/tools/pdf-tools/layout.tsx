import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "PDF 工具箱 - 在线合并拆分 PDF",
  description: "免费在线PDF工具，支持PDF合并、拆分、信息提取。浏览器本地处理，文件不上传服务器，保护隐私。",
  keywords: ["PDF合并", "PDF拆分", "PDF工具", "在线PDF", "PDF转换"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
