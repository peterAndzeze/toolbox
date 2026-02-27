import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Nginx 配置速查 - 常用 Nginx 配置大全",
  description: "Nginx 配置速查表：反向代理、负载均衡、HTTPS证书、缓存、限流、静态文件服务等，支持搜索和一键复制。",
  keywords: ["Nginx配置", "Nginx速查", "Nginx反向代理", "Nginx负载均衡", "Nginx HTTPS", "Nginx教程"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
