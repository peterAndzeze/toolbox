import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Unicode 编解码 - 中文与 Unicode 在线互转",
  description: "免费在线 Unicode 编解码工具，支持中文与 \\uXXXX、HTML 实体、UTF-8 Hex 格式互转。",
  keywords: ["Unicode转换", "Unicode编码", "Unicode解码", "中文转Unicode", "Unicode转中文"],
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
