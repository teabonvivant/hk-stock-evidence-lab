import { Badge } from "@/components/ui/badge";
import { IndicatorDetail } from "@/components/site/indicator-detail";
import { IndicatorLibrary } from "@/components/site/indicator-library";
import { HeroPanel, PrimaryLink, Section } from "@/components/site/page-shell";
import { categoryCounts, findIndicator, indicatorSummaries } from "@/lib/site-data";

export function IndicatorsPage() {
  return (
    <div>
      <HeroPanel
        eyebrow="82 個教學指標"
        title="先看用途，再判讀訊號"
        body="每個條目列出公式、常用參數、適用市況及失效條件。閱讀的重點不在背誦名稱，而在弄清楚指標能回答甚麼問題，又有哪些問題無法回答。"
        imageKey="indicators"
        actions={<PrimaryLink href="/compare">比較指標用途</PrimaryLink>}
      />
      <Section title="分類分佈" body="分類有助先確定所需資料：價格、成交量、波幅、市場廣度，或市場情緒。">
        <div className="metric-grid">
          {categoryCounts().map((item) => (
            <div key={item.name} className="metric-tile">
              <Badge variant="info">{item.name}</Badge>
              <strong className="mt-3 block text-3xl font-black">{item.count}</strong>
            </div>
          ))}
        </div>
      </Section>
      <Section title="完整指標庫" body="先以 20 個核心指標建立框架，再按用途及難度逐步延伸。搜尋範圍包括中英文名稱、縮寫及用途。">
        <IndicatorLibrary items={indicatorSummaries} categories={categoryCounts().map((item) => item.name)} />
      </Section>
    </div>
  );
}

export function IndicatorDetailPage({ slug }: { readonly slug: string }) {
  const item = findIndicator(slug);
  if (!item) {
    return (
      <Section title="找不到這個指標" body="網址內的指標名稱與本站資料庫不符。">
        <PrimaryLink href="/indicators">返回指標庫</PrimaryLink>
      </Section>
    );
  }
  return <IndicatorDetail item={item} />;
}
