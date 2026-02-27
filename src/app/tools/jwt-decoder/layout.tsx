import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "JWT 解码器 - 在线解析 JSON Web Token",
  description: "免费在线JWT解码工具，解析Header、Payload，查看Token过期时间。开发者调试必备。",
  keywords: ["JWT解码", "JWT解析", "JSON Web Token", "Token解码", "JWT调试"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
