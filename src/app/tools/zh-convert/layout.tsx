import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "简繁体转换 - 中文简体繁体在线互转",
  description: "免费在线简繁体转换工具，支持中文简体与繁体一键互转，实时转换，准确率高。",
  keywords: ["简繁体转换", "简体转繁体", "繁体转简体", "中文转换", "简繁互转"],
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
