import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSS Border Radius 生成器 - 在线圆角可视化工具",
  description:
    "免费在线 CSS Border Radius 生成器，可视化调节四角圆角，支持高级八值语法，一键复制代码。",
  keywords: ["CSS圆角", "border-radius生成器", "CSS圆角生成", "在线圆角工具"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
