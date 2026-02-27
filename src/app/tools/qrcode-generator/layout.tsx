import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "二维码生成器 - 免费在线生成二维码",
  description:
    "免费在线二维码生成器，输入文字或链接即时生成二维码，支持自定义颜色和大小，可下载PNG。浏览器本地生成，保护隐私。",
  keywords: ["二维码生成器", "QR Code生成", "在线二维码", "免费二维码"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
