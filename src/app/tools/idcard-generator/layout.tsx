import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "身份证号生成器 - 在线生成测试用身份证号",
  description: "免费在线身份证号生成器，生成符合规则的测试用身份证号码，支持指定地区、出生日期和性别。仅供开发测试使用。",
  keywords: ["身份证号生成器", "身份证号码", "测试数据", "开发工具"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
