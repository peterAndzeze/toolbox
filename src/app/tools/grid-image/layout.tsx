import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "九宫格切图 - 朋友圈图片在线裁剪",
  description:
    "免费在线九宫格切图工具，一键将图片切成 3x3 九宫格，适用于微信朋友圈和 Instagram 发图。",
  keywords: ["九宫格切图", "朋友圈切图", "图片九宫格", "Instagram切图", "照片分割"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
