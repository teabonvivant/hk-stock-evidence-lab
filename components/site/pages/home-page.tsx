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
  const completedStrategyCount = tradingViewData.stats.acceptedCases;
  const formalCaseTarget = tradingViewData.targetAcceptedCases;

  return (
    <div>
      <HeroPanel
        eyebrow="技術指標 · 回測審核 · Pine Script"
        title="把技術分析變成一套可覆核的流程"
        body="研究指標，不應只看何時出現訊號。資料是否可靠、訊號在哪種市況才成立，以及失效時如何處理，同樣需要逐項覆核。本站把這些問題整理成一套交易前檢查流程。"
        imageKey="home"
        actions={
          <>
            <PrimaryLink href="/strategy-cases">查看策略案例</PrimaryLink>
            <PrimaryLink href="/indicators" variant="secondary">
              瀏覽指標庫
            </PrimaryLink>
          </>
        }
      />
      <Section title="資料庫概況" body="以下統計來自本站整理的本地 JSON 及 CSV 檔案。頁面不會即時讀取外部網站或行情資料。">
        <div className="metric-grid">
          <MetricTile label="已整理指標" value={siteData.stats.siteIndicators} tone="good" />
          <MetricTile label="研究概念" value={siteData.stats.researchConcepts} tone="info" />
          <MetricTile label="專家資料" value={siteData.stats.experts} tone="info" />
          <MetricTile label="研究材料" value={siteData.stats.researchMaterials} tone="warn" />
          <MetricTile label="TradingView 原始線索" value={tradingViewData.stats.rawLeadsCollected} tone="info" />
          <MetricTile label="已完成核對的策略" value={completedStrategyCount} tone="bad" />
        </div>
      </Section>
      <Section title="TradingView 策略審核進度" body={tradingViewData.metricFramingZh}>
        <div className="grid gap-3 md:grid-cols-3">
          <StatusBlock label="本站 Pine 教學範本" value={tradingViewData.stats.localTemplateCases} tone="warn" />
          <StatusBlock label="原始碼不公開" value={tradingViewData.stats.blockedCodeCases} tone="info" />
          <StatusBlock label="正式案例目標" value={formalCaseTarget} tone="bad" />
        </div>
      </Section>
      <Section title="先以 5 種角色建立判讀框架" body="由價格位置、成交確認、趨勢方向、動能強弱到風險幅度，每種角色先掌握一個代表指標，便可建立基本判讀流程。技術指標只能提供證據，不能代替買賣決定。">
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
