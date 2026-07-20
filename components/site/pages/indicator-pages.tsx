import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndicatorCard } from "@/components/site/indicator-card";
import { HeroPanel, PrimaryLink, Section } from "@/components/site/page-shell";
import { categoryCounts, findIndicator, indicators } from "@/lib/site-data";

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
      <Section title="完整指標庫">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {indicators.map((item) => (
            <IndicatorCard key={item.siteSlug} item={item} />
          ))}
        </div>
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
  return (
    <div>
      <HeroPanel
        eyebrow={`${item.category} · ${item.difficulty}`}
        title={item.nameZh}
        body={item.summary}
        imageKey="detail"
        actions={<PrimaryLink href="/indicators" variant="secondary">返回指標庫</PrimaryLink>}
      />
      <Section title="公式與參數">
        <table className="data-table">
          <tbody>
            <Row label="英文名稱" value={`${item.nameEn} (${item.abbr})`} />
            <Row label="常用參數" value={item.params} />
            <Row label="公式" value={item.formula} />
            <Row label="研究概念" value={`${item.research.conceptZh} / ${item.research.familyZh}`} />
            <Row label="核心權威" value={item.research.winnerZh} />
          </tbody>
        </table>
      </Section>
      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <ListCard title="有效訊號" rows={item.signals} tone="good" />
        <ListCard title="常見誤用" rows={item.mistakes} tone="warn" />
        <ListCard title="失效條件" rows={item.limitations} tone="bad" />
      </div>
      <Section title="專家比較" body={item.research.judgmentZh}>
        <div className="grid gap-3">
          {item.research.comparisonRows.slice(0, 3).map((row) => (
            <Card key={`${row.expert_id}-${row.comparison_rank}`}>
              <CardHeader>
                <Badge variant={row.verdict_zh === "優勝" ? "good" : "info"} className="w-fit">
                  {row.verdict_zh}
                </Badge>
                <CardTitle>{row.name_zh}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-6 text-[var(--muted)]">
                <p>{row.strengths_zh}</p>
                <p className="mt-2">{row.limitations_zh}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Row({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <tr>
      <th>{label}</th>
      <td>{value}</td>
    </tr>
  );
}

function ListCard({
  title,
  rows,
  tone,
}: {
  readonly title: string;
  readonly rows: readonly string[];
  readonly tone: "good" | "warn" | "bad";
}) {
  return (
    <Card>
      <CardHeader>
        <Badge variant={tone} className="w-fit">
          {title}
        </Badge>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-2 text-sm leading-6 text-[var(--muted)]">
          {rows.map((row) => (
            <li key={row}>{row}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
