import type { Metadata } from "next";

import { PageShell } from "@/components/site/page-shell";
import { RoutePage } from "@/components/site/route-page";
import { findIndicator, findStrategy } from "@/lib/site-data";
import { parseRoute, staticRouteParams } from "@/lib/routes";
import type { SimpleRouteSlug } from "@/lib/routes";
import { strategyCaveat } from "@/lib/strategy-copy";

type RouteParams = { readonly slug?: readonly string[] };
type RoutePageProps = { readonly params: Promise<RouteParams> };

export function generateStaticParams() {
  return staticRouteParams().map((item) => ({ slug: [...item.slug] }));
}

export async function generateMetadata({ params }: RoutePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const route = parseRoute(resolvedParams.slug ?? []);
  if (route.kind === "indicator") {
    const item = findIndicator(route.slug);
    return {
      title: item ? `${item.nameZh}｜公式、用法及限制` : "技術指標｜技術指標研究室",
      description: item ? `${item.summary} 查閱公式、常用參數、適用市況、失效條件及研究來源。` : "查閱技術指標的公式、用法及限制。",
    };
  }
  if (route.kind === "strategyCase") {
    const item = findStrategy(route.slug);
    return {
      title: item ? `${item.shortTitle || item.title}｜策略案例審核` : "策略案例｜技術指標研究室",
      description: item ? strategyCaveat(item.slug, item.displayCaveat) : "查閱 TradingView 策略案例的回測設定及審核結果。",
    };
  }
  if (route.kind === "simple") return simplePageMetadata[route.slug];
  return routeMetadata[route.kind];
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
    title: "技術指標研究室",
    description: "從香港投資者角度整理技術指標、TradingView 策略審核、Pine Script 教學範本及交易前風險檢查。",
  },
  indicators: {
    title: "技術指標庫｜82 個指標的公式、用法及限制",
    description: "瀏覽 82 個技術指標，按用途、難度及分類查閱公式、參數、適用市況、常見誤解及失效條件。",
  },
  strategyCases: {
    title: "TradingView 策略案例庫｜回測設定及證據審核",
    description: "查看 TradingView 策略案例的盈利因子、交易成本、測試期間、程式碼狀態及審核結果。",
  },
  tvStrategies: {
    title: "TradingView 回測教學｜如何審核策略測試報告",
    description: "了解如何核對 TradingView 策略屬性、輸入參數、交易成本、滑價、樣本期及樣本外測試。",
  },
} satisfies Readonly<Record<"home" | "indicators" | "strategyCases" | "tvStrategies", Metadata>>;

const simplePageMetadata = {
  learn: { title: "技術分析學習路線｜技術指標研究室", description: "由大市方向、訊號確認到交易前風險檢查，建立可逐項覆核的技術分析學習路線。" },
  toolbox: { title: "技術分析工具箱｜R 值、回撤及倉位", description: "整理 R 值、盈利因子、勝率、回撤及倉位等交易風險概念。" },
  candlesticks: { title: "陰陽燭形態教學｜結合趨勢及成交量判讀", description: "學習把陰陽燭形態放回趨勢、成交量、支持阻力及風險回報中判讀。" },
  compare: { title: "技術指標比較｜分清功能及重疊訊號", description: "比較技術指標的功能、研究來源及訊號重疊，避免把同類證據誤作多重確認。" },
  playground: { title: "技術指標練習場｜比較不同市場情境", description: "把同一指標放進上升、橫行、反轉及裂口情境，辨別何時有效及何時容易誤導。" },
  casebook: { title: "歷史市場案例｜真實 OHLCV 教學資料", description: "以真實歷史開市、最高、最低、收市及成交量資料練習技術分析與風險判讀。" },
  glossary: { title: "技術分析詞彙表｜香港常用交易術語", description: "查閱止蝕、成交量、裂口、倉位、R 值及樣本外測試等常用技術分析詞彙。" },
  subscribe: { title: "研究資料更新｜技術指標研究室", description: "追蹤指標資料修訂、策略審核結果及 Pine Script 教學範本更新。" },
  journal: { title: "交易日誌｜記錄入市理由、止蝕及檢討", description: "用交易日誌記錄入市理由、失效條件、止蝕、出市安排及流程偏差。" },
  combo: { title: "技術指標組合｜市況、訊號及風險分工", description: "按市況判斷、訊號確認及風險管理三種功能，建立精簡而清楚的指標組合。" },
  script: { title: "Pine Script 教學範本｜技術指標研究室", description: "查看本站重建的 Pine Script 教學範本，以及原始程式碼授權及署名原則。" },
  "script-demo": { title: "Pine Script 程式示範｜拆解交易檢查條件", description: "把市況、訊號、止蝕、倉位及出市條件分開處理，了解策略程式的基本結構。" },
  trial: { title: "Pine Script 試用準備｜用途及授權說明", description: "了解 Pine Script 試用前的教育用途、研究限制、程式碼授權及自行回測責任。" },
} satisfies Readonly<Record<SimpleRouteSlug, Metadata>>;
