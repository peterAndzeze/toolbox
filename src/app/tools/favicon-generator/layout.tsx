import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Favicon 生成器 - 网站图标在线制作",
  description: "免费在线 Favicon 生成器，上传图片或输入文字生成网站图标，支持多种尺寸，提供 HTML 代码。",
  keywords: ["Favicon生成", "网站图标", "ICO生成", "favicon制作", "图标生成器"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
