import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "SQL 格式化 - 在线 SQL 美化工具",
  description: "免费在线SQL格式化工具，支持SQL美化、压缩、关键字大写。数据库开发者必备工具。",
  keywords: ["SQL格式化", "SQL美化", "SQL压缩", "SQL在线", "SQL工具"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
