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
        title="技術分析，先看證據是否站得住"
        body="一個訊號是否值得參考，要看資料、市況和失效條件。本站把公式、圖表例子、回測設定和研究來源放在一起，方便逐項核對。"
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
      <Section title="資料庫概況" body="數字來自本站整理的 JSON 及 CSV 檔案，並非即時行情。">
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
      <Section title="初學者先回答五個問題" body="價格在哪裏？成交是否配合？趨勢朝哪個方向？力度有沒有轉弱？風險距離多大？每個問題先用一個指標回答，已足夠建立基本框架。技術指標提供證據，不會代替買賣決定。">
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
