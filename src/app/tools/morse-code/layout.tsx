import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "摩斯密码转换器 - Morse Code 在线编解码",
  description: "免费在线摩斯密码转换工具，支持文本与摩斯密码互转，可播放摩斯音频，附完整编码对照表。",
  keywords: ["摩斯密码", "Morse Code", "摩斯密码转换", "摩斯密码在线", "摩尔斯电码"],
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
