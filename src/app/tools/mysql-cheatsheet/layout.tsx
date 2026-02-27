import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "MySQL 速查手册 - 常用命令语句大全",
  description: "MySQL 常用命令速查表：建库建表、增删改查、JOIN连接、索引、聚合函数、日期函数等，支持搜索和一键复制。",
  keywords: ["MySQL命令", "MySQL速查", "MySQL语法", "SQL语句大全", "MySQL教程", "MySQL常用命令", "MySQL函数"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
