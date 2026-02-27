import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "隐私政策",
  description: "速用工具箱隐私政策，了解我们如何保护您的隐私和数据安全。",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl py-8">
      <h1 className="text-2xl font-bold sm:text-3xl">隐私政策</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">最后更新日期：2026 年 2 月 27 日</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-[var(--muted)]">
        <section>
          <h2 className="mb-3 text-lg font-semibold text-[var(--foreground)]">概述</h2>
          <p>
            速用工具箱（以下简称"本站"，网址：sutool.lifetips.com.cn）重视用户的隐私保护。
            本隐私政策说明了我们如何收集、使用和保护您的信息。使用本站即表示您同意本隐私政策的条款。
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-[var(--foreground)]">数据收集与处理</h2>
          <p className="mb-2">本站的所有工具均在您的浏览器中本地运行，我们<strong className="text-[var(--foreground)]">不会收集、上传或存储</strong>您使用工具时输入的任何数据，包括但不限于：</p>
          <ul className="ml-4 list-disc space-y-1">
            <li>您输入的文本、JSON 数据、URL 等内容</li>
            <li>您上传的图片文件</li>
            <li>您生成的二维码、密码等内容</li>
          </ul>
          <p className="mt-2">所有数据处理均在您的设备上完成，关闭页面后数据即被清除。</p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-[var(--foreground)]">Cookie 与分析</h2>
          <p className="mb-2">本站可能使用以下第三方服务来改善用户体验：</p>
          <ul className="ml-4 list-disc space-y-1">
            <li><strong className="text-[var(--foreground)]">Google Analytics</strong>：用于分析网站流量和用户行为，帮助我们了解哪些工具最受欢迎。Google Analytics 会使用 Cookie 收集匿名的访问数据。</li>
            <li><strong className="text-[var(--foreground)]">百度统计</strong>：与 Google Analytics 类似，用于分析来自中国大陆的流量数据。</li>
            <li><strong className="text-[var(--foreground)]">Google AdSense</strong>：用于展示广告。Google AdSense 可能会使用 Cookie 来展示与您兴趣相关的广告。</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-[var(--foreground)]">第三方广告</h2>
          <p>
            本站使用 Google AdSense 展示广告。Google 及其合作伙伴可能会使用 Cookie 根据用户之前访问本站或其他网站的情况来投放广告。
            您可以访问 <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline">Google 广告设置</a> 来管理广告个性化偏好，
            或访问 <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline">aboutads.info</a> 选择退出第三方广告 Cookie。
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-[var(--foreground)]">信息安全</h2>
          <p>
            本站通过 HTTPS 加密传输保护您与网站之间的通信安全。由于所有工具均在浏览器本地运行，
            您的数据不会经过我们的服务器，从根本上保障了数据安全。
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-[var(--foreground)]">未成年人保护</h2>
          <p>
            本站的服务面向所有年龄段的用户。我们不会有意收集未成年人的个人信息。
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-[var(--foreground)]">政策变更</h2>
          <p>
            我们可能会不时更新本隐私政策。更新后的政策将在本页面发布，并更新"最后更新日期"。
            建议您定期查看本页面以了解最新的隐私保护信息。
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-[var(--foreground)]">联系我们</h2>
          <p>
            如果您对本隐私政策有任何疑问，请通过 GitHub 与我们联系：
            <a href="https://github.com/peterAndzeze/toolbox" target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline">github.com/peterAndzeze/toolbox</a>
          </p>
        </section>
      </div>
    </div>
  );
}
