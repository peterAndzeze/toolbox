import type { MetadataRoute } from "next";

const BASE_URL = process.env.SITE_URL || "https://sutool.lifetips.com.cn";

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
    "/tools/yaml-formatter",
    "/tools/text-diff",
    "/tools/hash-generator",
    "/tools/regex-tester",
    "/tools/number-base",
    "/tools/cron-parser",
    "/tools/pdf-tools",
    "/tools/lorem-generator",
    "/tools/css-unit",
    "/tools/jwt-decoder",
    "/tools/image-to-base64",
    "/tools/sql-formatter",
    "/tools/text-tools",
    "/tools/html-entity",
    "/tools/device-info",
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
