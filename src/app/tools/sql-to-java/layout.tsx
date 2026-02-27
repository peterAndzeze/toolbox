import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "SQL 转 Java 实体类 - 在线代码生成",
  description: "免费在线 SQL 建表语句转 Java 实体类，支持 Lombok、JPA、MyBatis-Plus 注解自动生成。",
  keywords: ["SQL转Java", "实体类生成", "Java代码生成", "SQL转实体", "MyBatis"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
