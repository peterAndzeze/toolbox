import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "AES/DES 在线加解密 - 对称加密工具",
  description: "免费在线 AES 加解密工具，支持 AES-CBC、AES-GCM 模式，128/192/256 位密钥，Base64/Hex 输出格式。",
  keywords: ["AES加密", "AES解密", "对称加密", "AES-CBC", "AES-GCM", "在线加密"],
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
