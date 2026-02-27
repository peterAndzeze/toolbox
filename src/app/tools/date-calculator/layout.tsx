import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "年龄计算器 - 日期间隔在线计算",
  description:
    "免费在线年龄计算器，精确计算年龄、日期间隔和日期推算，显示生肖、星座等信息。",
  keywords: ["年龄计算器", "日期计算", "日期间隔", "生日计算", "天数计算"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
