import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Linux 命令速查 - 常用 Linux 命令大全",
  description: "Linux 常用命令速查表：文件操作、目录管理、权限设置、进程管理、网络命令、压缩解压等，支持搜索和一键复制。",
  keywords: ["Linux命令", "Linux速查", "Linux教程", "Linux常用命令", "Shell命令", "Linux操作大全"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
