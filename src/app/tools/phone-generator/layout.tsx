import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "手机号生成器 - 在线生成测试用手机号",
  description: "免费在线手机号生成器，生成符合号段规则的中国手机号码，支持指定运营商。仅供开发测试使用。",
  keywords: ["手机号生成器", "手机号码", "测试数据", "开发工具"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
