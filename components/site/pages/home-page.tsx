import { Badge } from "@/components/ui/badge";
import { IndicatorCard } from "@/components/site/indicator-card";
import { HeroPanel, MetricTile, PrimaryLink, Section } from "@/components/site/page-shell";
import { beginnerStarterLessons } from "@/lib/indicator-beginner-guide";
import { findIndicator, siteData, tradingViewData } from "@/lib/site-data";

const beginnerIndicators = beginnerStarterLessons.flatMap((lesson) => {
  const indicator = findIndicator(lesson.slug);
  return indicator ? [indicator] : [];
});

export function HomePage() {
  return (
    <div>
      <HeroPanel
        eyebrow="技術指標 · 回測資料 · Pine Script"
        title="技術分析，先變成檢查流程"
        body="唔急住追訊號。先睇資料是否可靠，再分清指標用途、策略設定同風險位，入場前有一套可以覆核的流程。"
        imageKey="home"
        actions={
          <>
            <PrimaryLink href="/strategy-cases">睇策略案例</PrimaryLink>
            <PrimaryLink href="/indicators" variant="secondary">
              查指標庫
            </PrimaryLink>
          </>
        }
      />
      <Section title="目前資料包" body="以下數字來自本地 JSON/CSV。頁面會照讀資料包內容，不會即時拉外部網站資料。">
        <div className="metric-grid">
          <MetricTile label="教學指標" value={siteData.stats.siteIndicators} tone="good" />
          <MetricTile label="研究概念" value={siteData.stats.researchConcepts} tone="info" />
          <MetricTile label="專家資料" value={siteData.stats.experts} tone="info" />
          <MetricTile label="研究材料" value={siteData.stats.researchMaterials} tone="warn" />
          <MetricTile label="TradingView leads" value={tradingViewData.stats.rawLeadsCollected} tone="info" />
          <MetricTile label="已完整驗證策略" value={tradingViewData.stats.acceptedCases} tone="bad" />
        </div>
      </Section>
      <Section title="TradingView 策略進度" body={tradingViewData.metricFramingZh}>
        <div className="grid gap-3 md:grid-cols-3">
          <StatusBlock label="本地 Pine 範本" value={tradingViewData.stats.localTemplateCases} tone="warn" />
          <StatusBlock label="代碼不展示" value={tradingViewData.stats.blockedCodeCases} tone="info" />
          <StatusBlock label="目標 accepted" value={tradingViewData.targetAcceptedCases} tone="bad" />
        </div>
      </Section>
      <Section title="新手先學這 5 個角色" body="順序是位置、量能、方向、力度、風險。每個角色先學一個代表工具，便足夠建立基本判讀流程。">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {beginnerIndicators.map((item) => (
            <IndicatorCard key={item.siteSlug} item={item} />
          ))}
        </div>
      </Section>
    </div>
  );
}

function StatusBlock({
  label,
  value,
  tone,
}: {
  readonly label: string;
  readonly value: number;
  readonly tone: "good" | "warn" | "bad" | "info";
}) {
  return (
    <div className="metric-tile">
      <Badge variant={tone}>{label}</Badge>
      <strong className="mt-3 block text-3xl font-black">{value}</strong>
    </div>
  );
}
