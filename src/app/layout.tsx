import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { GoogleAnalytics, BaiduAnalytics } from "@/components/Analytics";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  verification: {
    google: "google70281fede3ad0afe",
    other: { "baidu-site-verification": ["codeva-HydT7lfb7h"] },
  },
  title: {
    default: "速用工具箱 - 免费在线工具集合",
    template: "%s | 速用工具箱",
  },
  description:
    "免费在线工具箱：JSON格式化、二维码生成、图片压缩、Base64编解码、SQL格式化、JWT解码等28+实用工具，无需下载，打开即用，数据不上传服务器。",
  keywords: [
    "在线工具",
    "免费工具",
    "JSON格式化",
    "二维码生成器",
    "图片压缩",
    "Base64编解码",
    "SQL格式化",
    "JWT解码",
    "密码生成器",
    "时间戳转换",
    "正则测试",
    "开发者工具",
  ],
  openGraph: {
    title: "速用工具箱 - 免费在线工具集合",
    description: "28+免费在线工具，无需下载，打开即用，数据不上传服务器",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-4JGDX4SQR4" />
        <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-4JGDX4SQR4');` }} />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2011241575786020"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <BaiduAnalytics />

        <Navbar />

        <main className="mx-auto min-h-[calc(100vh-8rem)] max-w-6xl px-4 py-8 sm:px-6">
          {children}
        </main>

        <footer className="border-t border-[var(--card-border)] bg-[var(--card-bg)]">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="flex items-center gap-2">
                <span className="text-lg">🧰</span>
                <span className="text-sm font-semibold">速用工具箱</span>
              </div>
              <div className="flex items-center gap-4">
                <Link href="/privacy" className="text-xs text-[var(--muted)] hover:text-[var(--foreground)]">
                  隐私政策
                </Link>
                <p className="text-xs text-[var(--muted)]">
                  &copy; {new Date().getFullYear()} 速用工具箱. 免费在线工具，打开即用。
                </p>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
