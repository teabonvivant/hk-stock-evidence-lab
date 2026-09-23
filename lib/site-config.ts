export const siteConfig = {
  name: "港股證據研究室",
  englishName: "HK Stock Evidence Lab",
  url: process.env["NEXT_PUBLIC_SITE_URL"] || "https://technical-indicators-hk.teabonvivant.chatgpt.site",
  locale: "zh-Hant-HK",
  description: "從價格、成交量到回測方法，讀懂港股技術分析。82 個指標、100 篇研究札記及實用學習工具。",
} as const;

export const basePath = process.env["NEXT_PUBLIC_BASE_PATH"] || "";

/** Public files and native form actions do not receive Next Link's base path. */
export function publicPath(path: string): string {
  return `${basePath}${path}`;
}
