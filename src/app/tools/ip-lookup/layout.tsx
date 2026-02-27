import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IP 地址查询 - 在线查看 IP 信息",
  description:
    "免费在线 IP 地址查询工具，显示您的公网 IP、地理位置、运营商等信息，支持手动查询任意 IP。",
  keywords: ["IP查询", "IP地址查询", "我的IP", "IP归属地", "IP地址"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
