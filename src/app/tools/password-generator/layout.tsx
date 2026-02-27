import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "密码生成器 - 在线生成安全随机密码",
  description:
    "免费在线密码生成器，使用加密随机数生成安全密码，支持自定义长度和字符类型。浏览器本地生成，保护隐私。",
  keywords: ["密码生成器", "随机密码", "安全密码", "密码生成"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
