import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Cron 表达式解析 - 在线 Cron 生成与测试",
  description: "免费在线Cron表达式解析工具，支持中文说明、未来执行时间预览、常用预设。适合Linux定时任务配置。",
  keywords: ["Cron表达式", "Cron解析", "定时任务", "Crontab", "Cron生成器"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
