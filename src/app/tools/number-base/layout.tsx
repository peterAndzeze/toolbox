import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "进制转换器 - 二进制/八进制/十进制/十六进制互转",
  description: "免费在线进制转换工具，支持二进制、八进制、十进制、十六进制互相转换，一键复制结果。",
  keywords: ["进制转换", "二进制转十进制", "十六进制转换", "进制计算器", "在线进制转换"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
