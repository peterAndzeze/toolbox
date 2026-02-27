import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "HTTP 状态码查询 - 状态码含义大全",
  description: "HTTP 状态码完整参考：1xx信息、2xx成功、3xx重定向、4xx客户端错误、5xx服务器错误，含详细说明和使用场景。",
  keywords: ["HTTP状态码", "状态码查询", "404", "500", "301重定向", "HTTP错误码", "HTTP状态码大全"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
