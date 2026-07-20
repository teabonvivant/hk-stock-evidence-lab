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
        title="先分用途，再睇訊號"
        body="每個指標都保留公式、常用參數、適用場景同失效位。重點唔係背名詞，而係知道它適合回答哪一類問題。"
        imageKey="indicators"
        actions={<PrimaryLink href="/compare">比較指標角色</PrimaryLink>}
      />
      <Section title="分類分佈" body="分類幫你先諗清楚需要甚麼資料：價格、成交量、波幅、市場廣度，還是情緒。">
        <div className="metric-grid">
          {categoryCounts().map((item) => (
            <div key={item.name} className="metric-tile">
              <Badge variant="info">{item.name}</Badge>
              <strong className="mt-3 block text-3xl font-black">{item.count}</strong>
            </div>
          ))}
        </div>
      </Section>
      <Section title="完整指標庫" body="先用核心 20 建立框架，再按用途和難度延伸。搜尋會同時比對中英文名稱、縮寫及用途。">
        <IndicatorLibrary items={indicatorSummaries} categories={categoryCounts().map((item) => item.name)} />
      </Section>
    </div>
  );
}

export function IndicatorDetailPage({ slug }: { readonly slug: string }) {
  const item = findIndicator(slug);
  if (!item) {
    return (
      <Section title="找不到指標" body="這個 slug 未有對應本地指標資料。">
        <PrimaryLink href="/indicators">返回指標庫</PrimaryLink>
      </Section>
    );
  }
  return <IndicatorDetail item={item} />;
}
