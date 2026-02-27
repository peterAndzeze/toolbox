import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "颜色转换器 - HEX RGB HSL 互转",
  description:
    "免费在线颜色转换工具，支持HEX、RGB、HSL颜色格式互相转换，实时预览颜色，一键复制颜色值。",
  keywords: ["颜色转换", "HEX转RGB", "RGB转HSL", "颜色选择器", "在线取色"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
