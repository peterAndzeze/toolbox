import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "数据速率换算 - 带宽与存储单位在线转换",
  description: "免费在线数据速率换算工具，支持 bps/Kbps/Mbps/Gbps 带宽换算和 B/KB/MB/GB/TB 存储单位互转，快速计算下载时间。",
  keywords: ["数据速率换算", "带宽换算", "Mbps转换", "存储单位转换", "下载时间计算"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
