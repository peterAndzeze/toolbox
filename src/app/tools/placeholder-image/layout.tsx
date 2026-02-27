import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "占位图生成器 - Placeholder 图片在线制作",
  description: "免费在线占位图生成器，自定义尺寸、颜色和文字，生成 PNG/SVG 格式占位符图片。",
  keywords: ["占位图", "Placeholder", "占位符图片", "测试图片", "占位图生成"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
