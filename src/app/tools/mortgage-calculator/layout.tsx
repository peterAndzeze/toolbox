import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "房贷计算器 - 等额本息/等额本金在线计算",
  description: "免费在线房贷计算器，支持等额本息和等额本金两种还款方式，查看每月还款明细和总利息。",
  keywords: ["房贷计算器", "房贷计算", "等额本息", "等额本金", "贷款计算器", "月供计算"],
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
