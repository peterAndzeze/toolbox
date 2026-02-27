import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Spring Cloud 速查 - 微服务组件配置大全",
  description: "Spring Cloud Alibaba 微服务速查：Nacos注册与配置、OpenFeign远程调用、Gateway网关、Sentinel限流、Seata分布式事务。",
  keywords: ["Spring Cloud", "Spring Cloud Alibaba", "Nacos", "Feign", "Gateway", "Sentinel", "微服务", "Spring Cloud配置"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
