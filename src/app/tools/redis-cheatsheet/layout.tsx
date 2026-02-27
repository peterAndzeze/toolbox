import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Redis 命令速查 - 常用 Redis 命令大全",
  description: "Redis 命令速查表：String、Hash、List、Set、Sorted Set、Key管理、事务、持久化等，支持搜索和一键复制。",
  keywords: ["Redis命令", "Redis速查", "Redis教程", "Redis数据类型", "Redis常用命令", "Redis操作大全"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
