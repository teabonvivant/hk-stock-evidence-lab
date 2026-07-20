import { ArrowLeft, BookOpen, Calculator, ChartNoAxesCombined, ExternalLink, Link2, ShieldAlert } from "lucide-react";
import Link from "next/link";

import { IndicatorTeachingChart } from "@/components/site/indicator-chart";
import { PrimaryLink, Section } from "@/components/site/page-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { findCoreIndicatorLearning, formulaTypeLabel, parseMarketCaseKey } from "@/lib/indicator-learning";
import { findIndicator } from "@/lib/site-data";
import type { Indicator } from "@/lib/site-data";

export function IndicatorDetail({ item }: { readonly item: Indicator }) {
  const learning = findCoreIndicatorLearning(item.siteSlug);
  const chartCase = learning ? parseMarketCaseKey(learning.caseKey) : undefined;
  const related = item.related.flatMap((slug) => {
    const target = findIndicator(slug);
    return target ? [target] : [];
  });
  const measures = learning?.measures ?? item.uses.join("、");
  const bestRegime = learning?.bestRegime ?? item.signals[0] ?? "需要配合市場結構判斷。";
  const boundary = learning?.doesNotMeasure ?? item.limitations[0] ?? "不能單獨構成交易決定。";

  return (
    <div>
      <section className="research-panel overflow-hidden">
        <div className="grid min-w-0 gap-5 p-5 lg:grid-cols-[1.05fr_0.95fr] lg:p-6">
          <div className="flex min-w-0 flex-col justify-center gap-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant={learning ? "good" : "info"}>{learning ? "核心 20 深度頁" : "研究條目"}</Badge>
              <Badge>{item.category}</Badge>
              <Badge>{item.difficulty}</Badge>
            </div>
            <div className="space-y-3">
              <h1 className="hero-title max-w-[13ch] text-4xl font-black leading-[1.05] text-[var(--ink)] md:text-5xl">{item.nameZh}</h1>
              <p className="text-sm font-semibold text-[var(--primary-strong)]">{item.nameEn} · {item.abbr}</p>
              <p className="hero-copy max-w-[64ch] leading-7 text-[var(--muted)]">{item.summary}</p>
            </div>
            <PrimaryLink href="/indicators" variant="secondary"><ArrowLeft className="size-4" aria-hidden="true" />返回指標庫</PrimaryLink>
          </div>
          <div className="learning-orientation" aria-label="指標閱讀重點">
            <OrientationRow label="量度甚麼" value={measures} tone="good" />
            <OrientationRow label="較適合" value={bestRegime} tone="info" />
            <OrientationRow label="不能證明" value={boundary} tone="warn" />
          </div>
        </div>
        <nav className="detail-nav" aria-label="本頁章節">
          <a href="#chart"><ChartNoAxesCombined className="size-4" aria-hidden="true" />看圖</a>
          <a href="#calculation"><Calculator className="size-4" aria-hidden="true" />計算</a>
          <a href="#usage"><ShieldAlert className="size-4" aria-hidden="true" />用法與失效</a>
          <a href="#sources"><BookOpen className="size-4" aria-hidden="true" />來源</a>
        </nav>
      </section>

      <Section id="chart" title="真實數據教學圖" body={learning ? "圖表由本地歷史 OHLCV 快照即時計算，不以生成式假數據代替指標。" : "未完成對應資料層級前，不會用一般價格圖冒充這個指標。"}>
        {learning && chartCase ? (
          <IndicatorTeachingChart slug={item.siteSlug} caseKey={chartCase} chartLead={learning.chartLead} />
        ) : (
          <div className="chart-data-requirement">
            <strong>專屬圖表待覆核</strong>
            <p>現階段保留公式、訊號和限制，但未把不相符的單一股票走勢包裝成此指標的計算結果。</p>
          </div>
        )}
      </Section>

      <Section id="calculation" title="公式與計算口徑" body={learning ? "先固定輸入、平滑及預熱期，再比較不同平台數值。" : "目前屬概念摘要，未標示為可直接重現的完整算法。"}>
        <div className="formula-evidence-grid">
          <div className="formula-panel">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Badge variant={learning?.formulaType === "exact" ? "good" : "warn"}>{learning ? formulaTypeLabel(learning.formulaType) : "概念摘要"}</Badge>
              <span className="text-xs font-semibold text-[var(--muted)]">常用參數：{item.params}</span>
            </div>
            <pre className="formula mt-4">{learning?.formulaDetail ?? item.formula}</pre>
          </div>
          <dl className="evidence-list">
            <EvidenceRow term="輸入" detail={learning?.inputs ?? "資料庫暫未拆分輸入欄位。"} />
            <EvidenceRow term="平滑／規則" detail={learning?.smoothing ?? "需按所用平台再核對。"} />
            <EvidenceRow term="預熱期" detail={learning?.warmup ?? "資料庫暫未標明。"} />
          </dl>
        </div>
        {learning ? (
          <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr]">
            <div className="flat-evidence-block">
              <h3>逐步計算</h3>
              <ol className="mt-3 grid gap-2 text-sm leading-6 text-[var(--muted)]">
                {learning.calculationSteps.map((step, index) => <li key={step}><strong className="mr-2 text-[var(--primary-strong)]">{index + 1}.</strong>{step}</li>)}
              </ol>
            </div>
            <div className="flat-evidence-block is-info">
              <h3>例算</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{learning.workedExample}</p>
            </div>
          </div>
        ) : null}
      </Section>

      <Section id="usage" title="由訊號到風險邊界" body="訊號描述市場狀態，並不等於已定義入場、止蝕、目標和倉位。">
        {learning ? (
          <div className="scenario-grid mb-5">
            <Scenario label="較有效情境" value={learning.validCase} tone="good" />
            <Scenario label="典型失效例" value={learning.failureCase} tone="bad" />
            <Scenario label="交易邊界" value={learning.signalBoundary} tone="warn" />
          </div>
        ) : null}
        <div className="grid gap-5 lg:grid-cols-3">
          <ListCard title="有效訊號" rows={item.signals} tone="good" />
          <ListCard title="常見誤用" rows={item.mistakes} tone="warn" />
          <ListCard title="失效條件" rows={item.limitations} tone="bad" />
        </div>
      </Section>

      <Section title="相關指標" body="比較功能角色，避免用三個本質相同的指標誤當多重確認。">
        <div className="flex flex-wrap gap-2">
          {related.map((target) => (
            <Link key={target.siteSlug} href={`/indicators/${target.siteSlug}`} className="related-link">
              <Link2 className="size-4" aria-hidden="true" />{target.nameZh}<span>{target.category}</span>
            </Link>
          ))}
        </div>
      </Section>

      <Section id="sources" title="來源與研究對照" body="創始資料、現代說明和概念家族比較分開呈現；「核心權威」不等於唯一正確版本。">
        {learning ? (
          <div className="mb-5 flex flex-wrap gap-2">
            {learning.sources.map((source) => (
              <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="source-link">
                {source.label}<ExternalLink className="size-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        ) : null}
        {item.validationFlags.length > 0 ? (
          <p className="mb-4 rounded-[8px] border border-[#f3d7ad] bg-[#fff7ed] px-4 py-3 text-sm leading-6 text-[#7c3f00]">
            此條目的分類或概念配對仍在覆核中，專家比較應視作研究線索，不應視作定論。
          </p>
        ) : null}
        <div className="grid gap-3">
          {item.research.comparisonRows.slice(0, 3).map((row) => (
            <article key={`${row.expert_id}-${row.comparison_rank}`} className="research-source-row">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={row.verdict_zh === "優勝" ? "good" : "info"}>{row.verdict_zh}</Badge>
                <h3 className="font-bold text-[var(--ink)]">{row.name_zh}</h3>
                <span className="text-xs text-[var(--muted)]">{row.relation_zh}</span>
              </div>
              <p>{row.difference_zh}</p>
              <p><strong>代表材料：</strong>{row.representative_materials_zh}</p>
              <p className="text-xs">{row.evidence_profile_zh}</p>
            </article>
          ))}
        </div>
      </Section>
    </div>
  );
}

function OrientationRow({ label, value, tone }: { readonly label: string; readonly value: string; readonly tone: "good" | "info" | "warn" }) {
  return <div><Badge variant={tone}>{label}</Badge><p>{value}</p></div>;
}

function EvidenceRow({ term, detail }: { readonly term: string; readonly detail: string }) {
  return <div><dt>{term}</dt><dd>{detail}</dd></div>;
}

function Scenario({ label, value, tone }: { readonly label: string; readonly value: string; readonly tone: "good" | "warn" | "bad" }) {
  return <div className={`scenario-block is-${tone}`}><Badge variant={tone}>{label}</Badge><p>{value}</p></div>;
}

function ListCard({ title, rows, tone }: { readonly title: string; readonly rows: readonly string[]; readonly tone: "good" | "warn" | "bad" }) {
  return (
    <Card className="h-full shadow-none">
      <CardHeader><Badge variant={tone} className="w-fit">{title}</Badge><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent><ul className="grid gap-2 text-sm leading-6 text-[var(--muted)]">{rows.map((row) => <li key={row}>{row}</li>)}</ul></CardContent>
    </Card>
  );
}
