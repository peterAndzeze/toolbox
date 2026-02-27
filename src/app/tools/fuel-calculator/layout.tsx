import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "油耗计算器 - 百公里油耗与油费计算",
  description: "在线计算汽车百公里油耗、加油费用、行驶成本，支持多种油品价格参考。",
  keywords: ["油耗计算器", "百公里油耗", "加油费用", "油费计算", "汽车油耗"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
