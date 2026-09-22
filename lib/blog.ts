import records from "@/data/site/blog-articles.json";

export type DiagramSpec = { kind: "flow" | "comparison" | "bars"; title: string; caption: string; items: { label: string; detail: string; value?: number }[] };
export type BlogArticle = { id: number; slug: string; title: string; category: string; excerpt: string; intro: string; sections: { heading: string; paragraphs: string[] }[]; figures: DiagramSpec[]; sources: { label: string; url: string }[] };
export const articles = records as BlogArticle[];
export const articleDate = "2026-09-22";
export const blogCategories = [
  { name: "指標與圖表", slug: "indicators", description: "從價格、成交量與波幅，看清每個指標的分工。", first: 1, last: 34 },
  { name: "港股市場", slug: "hong-kong", description: "交易時段、每手股數、公司行動與市場結構。", first: 35, last: 47 },
  { name: "風險與紀律", slug: "risk", description: "倉位、成本、回撤，以及決定之後的自我檢討。", first: 48, last: 67 },
  { name: "回測方法", slug: "backtesting", description: "由原始資料到樣本外測試，讀懂歷史結果的邊界。", first: 68, last: 83 },
  { name: "Pine Script", slug: "pine-script", description: "把分析寫成明確規則，理解計算、訊號與成交時間。", first: 84, last: 100 },
] as const;
export function findArticle(slug: string) { return articles.find(a => a.slug === slug); }
export function readingMinutes(a: BlogArticle) { return Math.max(3, Math.ceil((a.intro + a.sections.flatMap(s => s.paragraphs).join("")).length / 320)); }
export function articlesIn(category: string) { return articles.filter(a => a.category === category); }
export function figurePath(a: BlogArticle, i: number) { return `/illustrations/blog/${a.slug}-${i + 1}.svg`; }
export function articleSummary(a: BlogArticle) { return { slug: a.slug, title: a.title, category: a.category, excerpt: a.excerpt, minutes: readingMinutes(a) }; }
export type ArticleSummary = ReturnType<typeof articleSummary>;
