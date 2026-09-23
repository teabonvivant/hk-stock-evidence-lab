import type { Metadata } from "next";

import { PageShell } from "@/components/site/page-shell";
import { RoutePage } from "@/components/site/route-page";
import { findIndicator, findStrategy } from "@/lib/site-data";
import { parseRoute, staticRouteParams } from "@/lib/routes";
import type { SimpleRouteSlug, SiteRoute } from "@/lib/routes";
import { strategyCaveat } from "@/lib/strategy-copy";
import { trustContentFor } from "@/lib/trust-content";
import { findArticle, blogCategories } from "@/lib/blog";
import { strategyLessonFor } from "@/lib/strategy-lessons";
import { siteConfig, basePath } from "@/lib/site-config";

type RouteParams = { readonly slug?: readonly string[] };
type RoutePageProps = { readonly params: Promise<RouteParams> };

export function generateStaticParams() {
  return staticRouteParams().map((item) => ({ slug: [...item.slug] }));
}

export async function generateMetadata({ params }: RoutePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const route = parseRoute(resolvedParams.slug ?? []);
  const canonicalPath = canonicalPathFor(route);
  const alternates = { canonical: `${siteConfig.url}${canonicalPath}${basePath && canonicalPath !== "/" ? "/" : ""}` };
  if (route.kind === "blog") {
    const category = blogCategories.find(c => c.slug === route.categorySlug);
    return { title: `${category?.name ?? "研究札記"}｜港股證據研究室`, description: category?.description ?? "100 篇香港繁體中文研究札記，附概念圖解、計算例子與原始參考資料。", alternates };
  }
  if (route.kind === "article") {
    const a = findArticle(route.slug)!;
    return { title: `${a.title}｜港股證據研究室`, description: a.excerpt, alternates, openGraph: { title: a.title, description: a.excerpt, type: "article", url: alternates.canonical } };
  }
  if (route.kind === "indicator") {
    const item = findIndicator(route.slug);
    return {
      title: item ? `${item.nameZh}｜公式、用法、失效條件及證據狀態` : "技術指標｜港股證據研究室",
      description: item ? `${item.summary} 查閱公式、常用參數、適用市況、失效條件及研究來源。` : "查閱技術指標的公式、用法及限制。",
      alternates,
      robots: { index: true, follow: true },
    };
  }
  if (route.kind === "strategyCase") {
    const item = findStrategy(route.slug);
    return {
      title: `${strategyLessonFor(route.slug)?.title ?? "策略方法"}｜港股證據研究室`,
      description: strategyLessonFor(route.slug)?.intro ?? "拆解策略的條件、訂單時間、退出安排與測試方法。",
      alternates,
      robots: { index: true, follow: true },
    };
  }
  if (route.kind === "trust") {
    const content = trustContentFor(route.path);
    return {
      title: `${content.title}｜港股證據研究室`,
      description: content.description,
      alternates,
      robots: { index: content.indexable, follow: true },
    };
  }
  if (route.kind === "simple") return { ...simplePageMetadata[route.slug], alternates };
  return { ...routeMetadata[route.kind], alternates };
}

export default async function Page({ params }: RoutePageProps) {
  const resolvedParams = await params;
  const route = parseRoute(resolvedParams.slug ?? []);
  return (
    <PageShell>
      <RoutePage route={route} />
    </PageShell>
  );
}

const routeMetadata = {
  home: {
    title: "港股技術指標研究｜公式、港股圖表、失效條件與回測證據",
    description: "100 篇研究札記、82 個指標、歷史圖表與風險計算工具。以香港繁體中文讀懂技術分析、港股市場及 Pine Script。",
  },
  indicators: {
    title: "港股技術指標百科｜82 個指標按用途、公式與限制學習",
    description: "瀏覽 82 個技術指標，按用途、難度及分類查閱公式、參數、適用市況、常見誤解及失效條件。",
  },
  strategyCases: {
    title: "策略方法｜十種交易構思的條件與測試方法",
    description: "拆解趨勢、區間、動能、波幅與形態構思，理解訊號、訂單、退出、成本及樣本外測試。",
  },
  tvStrategies: {
    title: "TradingView 回測教學｜如何審核策略測試報告",
    description: "了解如何核對 TradingView 策略屬性、輸入參數、交易成本、滑價、樣本期及樣本外測試。",
  },
} satisfies Readonly<Record<"home" | "indicators" | "strategyCases" | "tvStrategies", Metadata>>;

const simplePageMetadata = {
  sitemap: { title: "網站導覽｜港股證據研究室", description: "完整文章、技術指標、學習路線與研究工具索引。" },
  learn: { title: "技術分析學習路線｜港股證據研究室", description: "由大市方向、訊號確認到交易前風險檢查，建立可逐項覆核的技術分析學習路線。" },
  toolbox: { title: "技術分析工具箱｜R 值、回撤及倉位", description: "整理 R 值、盈利因子、勝率、回撤及倉位等交易風險概念。" },
  candlesticks: { title: "陰陽燭形態教學｜結合趨勢及成交量判讀", description: "學習把陰陽燭形態放回趨勢、成交量、支持阻力及風險回報中判讀。" },
  compare: { title: "技術指標比較｜分清功能及重疊訊號", description: "比較技術指標的功能、研究來源及訊號重疊，避免把同類證據誤作多重確認。" },
  playground: { title: "技術指標練習場｜比較不同市場情境", description: "把同一指標放進上升、橫行、反轉及裂口情境，辨別何時有效及何時容易誤導。" },
  casebook: { title: "歷史市場案例｜真實 OHLCV 教學資料", description: "以真實歷史開市、最高、最低、收市及成交量資料練習技術分析與風險判讀。" },
  glossary: { title: "技術分析詞彙表｜香港常用交易術語", description: "查閱止蝕、成交量、裂口、倉位、R 值及樣本外測試等常用技術分析詞彙。" },
  subscribe: { title: "研究資料更新｜港股證據研究室", description: "追蹤指標資料修訂、策略審核結果及 Pine Script 教學範本更新。" },
  journal: { title: "交易日誌｜記錄入市理由、止蝕及檢討", description: "用交易日誌記錄入市理由、失效條件、止蝕、出市安排及流程偏差。" },
  combo: { title: "技術指標組合｜市況、訊號及風險分工", description: "按市況判斷、訊號確認及風險管理三種功能，建立精簡而清楚的指標組合。" },
  script: { title: "Pine Script 教學範本｜港股證據研究室", description: "查看本站重建的 Pine Script 教學範本，以及原始程式碼授權及署名原則。" },
  "script-demo": { title: "Pine Script 程式示範｜拆解交易檢查條件", description: "把市況、訊號、止蝕、倉位及出市條件分開處理，了解策略程式的基本結構。" },
  trial: { title: "策略研究自學清單｜港股證據研究室", description: "逐項整理資料、規則、成交假設、成本、樣本與研究紀錄。" },
} satisfies Readonly<Record<SimpleRouteSlug, Metadata>>;

function canonicalPathFor(route: SiteRoute): string {
  switch (route.kind) {
    case "blog":
      return route.categorySlug ? `/blog/category/${route.categorySlug}` : "/blog";
    case "article":
      return `/blog/${route.slug}`;
    case "home":
      return "/";
    case "indicators":
      return "/indicators";
    case "indicator":
      return `/indicators/${route.slug}`;
    case "strategyCases":
      return "/strategy-cases";
    case "strategyCase":
      return `/strategy-cases/${route.slug}`;
    case "tvStrategies":
      return "/tv-strategies";
    case "trust":
      return `/${route.path}`;
    case "simple":
      return `/${route.slug}`;
  }
}
