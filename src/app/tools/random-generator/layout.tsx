import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "随机数生成器 - 在线随机数/抽奖工具",
  description:
    "免费在线随机数生成器，支持整数、小数、抽奖模式，可指定范围和数量，使用密码学安全随机。",
  keywords: ["随机数生成器", "在线随机数", "抽奖工具", "随机抽签", "骰子模拟"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
