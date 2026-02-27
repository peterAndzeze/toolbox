import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Docker 速查手册 - 常用 Docker 命令大全",
  description: "Docker 常用命令速查：镜像管理、容器操作、网络配置、数据卷、Docker Compose、Dockerfile 编写，支持搜索和一键复制。",
  keywords: ["Docker命令", "Docker速查", "Docker教程", "Docker Compose", "Dockerfile", "Docker常用命令"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
