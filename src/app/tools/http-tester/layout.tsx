import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "HTTP 请求测试 - 在线 API 调试工具",
  description: "免费在线 HTTP 请求测试工具，支持 GET/POST/PUT/DELETE 等方法，查看响应状态、头信息和数据。",
  keywords: ["HTTP测试", "API调试", "在线Postman", "HTTP请求", "接口测试"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
