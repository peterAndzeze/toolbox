import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "YAML 格式化 - 在线 YAML 校验与 JSON 转换",
  description: "免费在线YAML格式化工具，支持YAML校验、美化，YAML与JSON互相转换。适合DevOps和开发者。",
  keywords: ["YAML格式化", "YAML校验", "YAML转JSON", "JSON转YAML", "在线YAML"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
