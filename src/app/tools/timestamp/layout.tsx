import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "时间戳转换 - Unix 时间戳在线转换",
  description:
    "免费在线Unix时间戳转换工具，支持时间戳与日期时间互相转换，支持秒和毫秒。实时显示当前时间戳。",
  keywords: ["时间戳转换", "Unix时间戳", "时间戳在线转换", "timestamp"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
