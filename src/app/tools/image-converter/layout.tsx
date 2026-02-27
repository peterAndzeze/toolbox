import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "图片格式转换 - PNG/JPG/WebP 在线互转",
  description: "免费在线图片格式转换工具，支持 PNG、JPG、WebP、BMP、GIF 格式互转，可调节压缩质量。",
  keywords: ["图片格式转换", "PNG转JPG", "JPG转PNG", "WebP转换", "图片转换器"],
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
