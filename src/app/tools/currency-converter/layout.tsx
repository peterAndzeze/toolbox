import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "汇率换算 - 在线货币转换器",
  description: "实时汇率查询与转换，支持人民币、美元、欧元、日元等主流货币，数据来自公开汇率API。",
  keywords: ["汇率换算", "货币转换", "汇率查询", "人民币汇率", "美元汇率"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
