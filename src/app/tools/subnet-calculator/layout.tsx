import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "子网掩码计算器 - IP 地址与子网在线计算",
  description: "免费在线子网掩码计算器，输入 IP 地址和掩码位数，计算网络地址、广播地址、可用主机范围和数量。支持 CIDR 表示法。",
  keywords: ["子网掩码计算器", "IP地址计算", "CIDR", "子网划分", "网络计算"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
