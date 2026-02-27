import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "电费计算器 - 家用电器耗电量计算",
  description: "在线计算家用电器耗电量和电费，支持阶梯电价，常见电器功率参考。",
  keywords: ["电费计算器", "耗电量计算", "阶梯电价", "电器功率", "电费查询"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
