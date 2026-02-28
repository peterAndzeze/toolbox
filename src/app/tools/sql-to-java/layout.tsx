import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "SQL 转 Java 实体类 - 在线代码生成",
  description: "免费在线 SQL 建表语句转 Java 实体类，支持 Spring Boot 2/3、jakarta/javax、Lombok、JPA、MyBatis-Plus、Swagger v3 注解。",
  keywords: ["SQL转Java", "实体类生成", "Java代码生成", "Spring Boot 3", "jakarta", "MyBatis-Plus"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
