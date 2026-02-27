import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Spring Boot 配置参考 - 常用配置注解大全",
  description: "Spring Boot 常用配置速查：数据源、JPA、MyBatis、Redis、日志、Security、缓存、Actuator 等配置和注解。",
  keywords: ["Spring Boot配置", "Spring Boot教程", "Spring Boot注解", "application.yml", "Spring Boot速查", "Spring Boot常用配置"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
