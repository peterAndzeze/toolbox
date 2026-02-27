import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSS 渐变生成器 - 在线可视化渐变色工具",
  description:
    "免费在线 CSS 渐变生成器，可视化编辑线性渐变和径向渐变，实时预览，一键复制 CSS 代码。",
  keywords: ["CSS渐变", "渐变生成器", "linear-gradient", "CSS渐变色", "在线渐变"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
