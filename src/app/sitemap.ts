import type { MetadataRoute } from "next";

const BASE_URL = process.env.SITE_URL || "http://sutool.lifetips.com.cn";

export default function sitemap(): MetadataRoute.Sitemap {
  const tools = [
    "/tools/json-formatter",
    "/tools/qrcode-generator",
    "/tools/image-compressor",
    "/tools/text-counter",
    "/tools/color-converter",
    "/tools/base64",
    "/tools/markdown-editor",
    "/tools/password-generator",
    "/tools/url-codec",
    "/tools/timestamp",
  ];

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...tools.map((path) => ({
      url: `${BASE_URL}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
