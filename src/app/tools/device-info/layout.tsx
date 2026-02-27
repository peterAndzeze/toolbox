import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "设备信息检测 - 屏幕分辨率浏览器检测",
  description: "免费在线设备信息检测工具，检测屏幕分辨率、浏览器信息、硬件配置。前端开发调试必备。",
  keywords: ["屏幕分辨率检测", "浏览器信息", "设备检测", "User Agent", "屏幕大小"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
