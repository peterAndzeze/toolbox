import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "BMI 计算器 - 身体质量指数在线计算",
  description: "免费在线 BMI 计算器，输入身高体重快速计算身体质量指数，参考中国和 WHO 标准判断体重状况。",
  keywords: ["BMI计算器", "身体质量指数", "体重计算", "BMI在线计算", "健康体重"],
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
