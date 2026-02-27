import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "图片转 Base64 - 在线图片编码工具",
  description: "免费在线图片转Base64工具，支持图片转Data URL、Base64还原图片。前端开发嵌入图片必备。",
  keywords: ["图片转Base64", "Base64转图片", "Data URL", "图片编码", "在线图片Base64"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
