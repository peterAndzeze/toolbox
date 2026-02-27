"use client";

import { useState } from "react";

interface Props {
  title: string;
  className?: string;
}

export function ShareBar({ title, className = "" }: Props) {
  const [copied, setCopied] = useState(false);

  const url = typeof window !== "undefined" ? window.location.href : "";
  const text = `${title} - 速用工具箱`;

  const shareWeibo = () => {
    window.open(
      `https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`,
      "_blank",
      "width=600,height=500"
    );
  };

  const shareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      "_blank",
      "width=600,height=500"
    );
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-xs text-[var(--muted)]">分享:</span>
      <button onClick={shareWeibo} title="分享到微博" className="share-btn flex h-7 w-7 items-center justify-center rounded-lg text-sm">
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M10.098 20c-4.404 0-8.098-2.07-8.098-5.153 0-1.612.878-3.48 2.39-5.263 2.013-2.375 4.35-3.452 5.225-2.404.39.466.279 1.28-.184 2.263-.16.334.18.292.18.292 1.752-.61 3.352-.502 3.741.487.204.516-.01 1.21-.515 1.946.283-.062.556-.1.818-.1 2.358 0 4.27 1.435 4.27 3.204 0 2.616-3.42 4.728-7.827 4.728zM9.05 12.926c-2.553.295-4.75 1.76-4.907 3.27-.158 1.51 1.78 2.63 4.332 2.335 2.553-.295 4.75-1.76 4.907-3.27.158-1.51-1.78-2.63-4.332-2.335zm.577 3.837c-.56.65-1.745.897-2.64.55-.883-.34-1.14-1.217-.58-1.852.553-.628 1.72-.87 2.608-.552.9.325 1.17 1.207.612 1.854zm1.166-1.594c-.208.253-.664.334-.997.179-.346-.158-.437-.523-.233-.77.202-.243.64-.325.984-.176.35.154.45.519.246.767zm11.018-8.926c-.375-1.866-1.844-3.31-3.734-3.724a5.205 5.205 0 00-1.087-.12 5.16 5.16 0 00-1.327.175.563.563 0 00-.39.69.569.569 0 00.698.387 4.045 4.045 0 011.024-.138c.288 0 .577.032.858.095 1.484.325 2.64 1.46 2.936 2.93a4.052 4.052 0 01-.412 2.826.564.564 0 00.22.768.573.573 0 00.775-.218 5.173 5.173 0 00.525-3.611l-.086-.06zm-2.368.96a2.81 2.81 0 00-2.073-1.84 2.817 2.817 0 00-.578-.06c-.183 0-.366.023-.546.068a.539.539 0 00-.388.66.544.544 0 00.666.384 1.72 1.72 0 011.936 1.118c.09.312.09.646 0 .958a.538.538 0 00.378.665.544.544 0 00.67-.374 2.8 2.8 0 00-.065-1.579z"/></svg>
      </button>
      <button onClick={shareTwitter} title="分享到 X/Twitter" className="share-btn flex h-7 w-7 items-center justify-center rounded-lg text-sm">
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      </button>
      <button onClick={copyLink} title="复制链接" className="share-btn flex h-7 items-center justify-center gap-1 rounded-lg px-2 text-xs">
        {copied ? (
          <>
            <svg className="h-3.5 w-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            <span className="text-green-500">已复制</span>
          </>
        ) : (
          <>
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
            <span>复制链接</span>
          </>
        )}
      </button>
    </div>
  );
}
