import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "图片水印工具 - 在线添加文字水印",
  description: "免费在线图片水印工具，支持自定义文字、字号、颜色、透明度、角度，可平铺或定点水印。",
  keywords: ["图片水印", "在线水印", "文字水印", "图片加水印", "水印工具"],
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
