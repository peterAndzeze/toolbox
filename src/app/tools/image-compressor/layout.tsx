import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "图片压缩 - 免费在线压缩图片大小",
  description:
    "免费在线图片压缩工具，支持JPG、PNG、WebP格式，批量压缩，保持清晰度。浏览器本地处理，图片不上传服务器。",
  keywords: ["图片压缩", "在线压缩图片", "图片缩小", "压缩JPG", "压缩PNG"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
