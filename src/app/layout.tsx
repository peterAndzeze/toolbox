import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { GoogleAnalytics, BaiduAnalytics } from "@/components/Analytics";
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
    "免费在线工具箱：JSON格式化、二维码生成、图片压缩、Markdown编辑器、密码生成器等10+实用工具，无需下载，打开即用。",
  keywords: [
    "在线工具",
    "JSON格式化",
    "二维码生成器",
    "图片压缩",
    "Markdown编辑器",
    "密码生成器",
    "Base64编解码",
    "时间戳转换",
    "免费工具",
  ],
  openGraph: {
    title: "速用工具箱 - 免费在线工具集合",
    description: "10+免费在线工具，无需下载，打开即用",
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
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <GoogleAnalytics />
        <BaiduAnalytics />

        <nav className="sticky top-0 z-50 border-b border-[var(--card-border)] bg-[var(--card-bg)]/80 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🧰</span>
              <span className="text-lg font-bold tracking-tight">
                速用工具箱
              </span>
            </Link>
            <div className="hidden items-center gap-6 text-sm sm:flex">
              <Link
                href="/#tools"
                className="text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
              >
                全部工具
              </Link>
              <Link
                href="/privacy"
                className="text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
              >
                隐私政策
              </Link>
            </div>
          </div>
        </nav>

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
