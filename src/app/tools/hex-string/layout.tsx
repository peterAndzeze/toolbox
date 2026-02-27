import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Hex 字符串互转 - 十六进制与文本在线转换",
  description: "免费在线 Hex 字符串转换工具，支持文本与十六进制互转，UTF-8 编码，多种分隔格式。",
  keywords: ["Hex转换", "十六进制转文本", "文本转十六进制", "Hex字符串", "在线Hex"],
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
