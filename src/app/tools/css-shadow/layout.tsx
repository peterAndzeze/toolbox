import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSS Box Shadow 生成器 - 在线阴影可视化工具",
  description:
    "免费在线 CSS Box Shadow 生成器，可视化调节阴影参数，支持多层阴影和内阴影，一键复制代码。",
  keywords: ["CSS阴影", "box-shadow生成器", "CSS阴影生成", "在线阴影工具"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
