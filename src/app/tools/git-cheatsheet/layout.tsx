import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Git 命令速查 - 常用 Git 操作大全",
  description: "Git 常用命令速查表：配置、分支管理、远程操作、撤销回退、暂存、标签等，支持搜索和一键复制。",
  keywords: ["Git命令", "Git速查", "Git教程", "Git常用命令", "Git分支", "Git操作大全"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
