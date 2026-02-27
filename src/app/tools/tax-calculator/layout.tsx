import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "个税计算器 - 2026 个人所得税在线计算",
  description: "免费在线个税计算器，支持五险一金和专项附加扣除，快速计算税后工资和个人所得税。",
  keywords: ["个税计算器", "个人所得税", "税后工资", "工资计算器", "五险一金"],
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
