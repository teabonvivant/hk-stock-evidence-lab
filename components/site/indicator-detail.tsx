import { publicPath } from "@/lib/site-config";
import { ArrowLeft, ChartNoAxesCombined, ExternalLink, Link2, ListChecks, ShieldAlert } from "lucide-react";
import Link from "@/components/site/site-link";

import { AdvancedDisclosure } from "@/components/site/advanced-disclosure";
import { IndicatorTeachingChart } from "@/components/site/indicator-chart";
import { IndicatorBeginnerGuide, IndicatorBeginnerPractice, IndicatorUsageFlow } from "@/components/site/indicator-beginner-guide";
import { PrimaryLink, Section } from "@/components/site/page-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { beginnerGuideFor } from "@/lib/indicator-beginner-guide";
import { findCoreIndicatorLearning, formulaTypeLabel, parseMarketCaseKey } from "@/lib/indicator-learning";
import { comparisonResearchFocus, comparisonVerdictLabel, comparisonVerdictTone } from "@/lib/research-copy";
import { findIndicator } from "@/lib/site-data";
import type { Indicator } from "@/lib/site-data";
import { IndicatorMethodDiagram } from "@/components/site/indicator-method-diagram";
import { articles } from "@/lib/blog";

export function IndicatorDetail({ item }: { readonly item: Indicator }) {
  const learning = findCoreIndicatorLearning(item.siteSlug);
  const beginnerGuide = beginnerGuideFor(item);
  const chartCase = learning ? parseMarketCaseKey(learning.caseKey) : undefined;
  const related = item.related.flatMap((slug) => {
    const target = findIndicator(slug);
    return target ? [target] : [];
  });
  const measures = learning?.measures ?? beginnerGuide.measure;
  const bestRegime = learning?.bestRegime ?? beginnerGuide.bestFor;
  const boundary = learning?.doesNotMeasure ?? beginnerGuide.boundary;

  return (
    <div className="indicator-detail-page">
      <section className="research-panel overflow-hidden">
        <div className="grid min-w-0 gap-5 p-5 lg:grid-cols-[1.05fr_0.95fr] lg:p-6">
          <div className="indicator-hero flex min-w-0 flex-col justify-center gap-4">
            <div className="indicator-kicker">
              <span className="indicator-kicker__lead">{learning ? "核心指標詳解" : "指標研究條目"}</span>
              <span>{item.category}</span>
              <span>{item.difficulty}</span>
            </div>
            <div className="space-y-3">
              <h1 className="hero-title max-w-[13ch] text-4xl font-black leading-[1.05] text-[var(--ink)] md:text-5xl">
                {item.nameZh === "指數平滑異同移動平均線" ? <>指數平滑<span className="whitespace-nowrap">異同</span>移動平均線</> : item.nameZh}
              </h1>
              <p className="text-sm font-semibold text-[var(--primary-strong)]">{item.nameEn} · {item.abbr}</p>
              <p className="hero-copy max-w-[64ch] leading-7 text-[var(--muted)]">{item.summary}</p>
            </div>
            <PrimaryLink href="/indicators" variant="secondary"><ArrowLeft className="size-4" aria-hidden="true" />返回指標庫</PrimaryLink>
          </div>
        </div>
        <nav className="detail-nav" aria-label="本頁章節">
          <a href="#chart"><ChartNoAxesCombined className="size-4" aria-hidden="true" />圖表判讀</a>
          <a href="#usage"><ShieldAlert className="size-4" aria-hidden="true" />實際用法</a>
          <a href="#practice"><ListChecks className="size-4" aria-hidden="true" />動手練習</a>
          <a href="#calculation">公式與計算</a>
          <a href="#sources"><ExternalLink className="size-4" aria-hidden="true" />來源</a>
        </nav>
      </section>


      <Section id="chart" title="圖解與判讀">
        {["trendline","fibonacci-retracement","support-resistance"].includes(item.siteSlug) ? <IndicatorMethodDiagram slug={item.siteSlug} /> : learning && chartCase ? (
          <IndicatorTeachingChart slug={item.siteSlug} caseKey={chartCase} chartLead={learning.chartLead} />
        ) : (
          <figure className="article-figure"><a href={publicPath(`/illustrations/indicators/${item.siteSlug}.svg`)} target="_blank" rel="noreferrer"><img src={publicPath(`/illustrations/indicators/${item.siteSlug}.svg`)} width="720" height="800" loading="eager" alt={`${item.nameZh}判讀流程：${beginnerGuide.flow.map(s=>s.title).join("、")}`} /></a><figcaption>{beginnerGuide.flowLead}</figcaption></figure>
        )}
      </Section>

      <IndicatorBeginnerGuide item={item} />

      <Section id="signals" title="訊號、誤用與限制">
        <div className="learning-orientation mb-5" aria-label="指標閱讀重點">
          <OrientationRow label="量度內容" value={measures} tone="good" />
          <OrientationRow label="適用市況" value={bestRegime} tone="info" />
          <OrientationRow label="不能反映" value={boundary} tone="warn" />
        </div>
        {learning ? (
          <div className="scenario-grid mb-5">
            <Scenario label="訊號較可靠的情況" value={learning.validCase} tone="good" />
            <Scenario label="常見失效情況" value={learning.failureCase} tone="bad" />
            <Scenario label="使用限制" value={learning.signalBoundary} tone="warn" />
          </div>
        ) : null}
        <div className="grid gap-5 lg:grid-cols-3">
          <ListCard title="可參考訊號" rows={item.signals} tone="good" />
          <ListCard title="常見誤解" rows={item.mistakes} tone="warn" />
          <ListCard title="已知限制" rows={item.limitations} tone="bad" />
        </div>
      </Section>

      <IndicatorUsageFlow item={item} />

      <IndicatorBeginnerPractice item={item} />

      <Section title="相關指標">
        <div className="flex flex-wrap gap-2">
          {related.map((target) => (
            <Link key={target.siteSlug} href={`/indicators/${target.siteSlug}`} className="related-link">
              <Link2 className="size-4" aria-hidden="true" />{target.nameZh}<span>{target.category}</span>
            </Link>
          ))}
        </div>
      </Section>

      <AdvancedDisclosure
        id="calculation"
        title="進階：公式與計算口徑"
        body="查閱公式與參數，並對齊所用平台的計算方式。"
      >
        <div className="formula-evidence-grid">
          <div className="formula-panel">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Badge variant={learning?.formulaType === "exact" ? "good" : "warn"}>{learning ? formulaTypeLabel(learning.formulaType) : "概念摘要"}</Badge>
              <span className="text-xs font-semibold text-[var(--muted)]">常用參數：{item.params}</span>
            </div>
            <pre className="formula mt-4">{learning?.formulaDetail ?? item.formula}</pre>
          </div>
          <dl className="evidence-list">
            <EvidenceRow term={learning ? "輸入資料" : "量度內容"} detail={learning?.inputs ?? beginnerGuide.measure} />
            <EvidenceRow term={learning ? "平滑方式" : "判讀口徑"} detail={learning?.smoothing ?? beginnerGuide.look} />
            <EvidenceRow term={learning ? "起算所需資料" : "適用範圍"} detail={learning?.warmup ?? beginnerGuide.bestFor} />
          </dl>
        </div>
        {learning ? (
          <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr]">
            <div className="flat-evidence-block">
              <h3>逐步計算</h3>
              <ol className="mt-3 grid gap-2 leading-7 text-[var(--muted)]">
                {learning.calculationSteps.map((step, index) => <li key={step}><strong className="mr-2 text-[var(--primary-strong)]">{index + 1}.</strong>{step}</li>)}
              </ol>
            </div>
            <div className="flat-evidence-block is-info">
              <h3>計算示例</h3>
              <p className="mt-3 leading-7 text-[var(--muted)]">{learning.workedExample}</p>
            </div>
          </div>
        ) : null}
      </AdvancedDisclosure>

      <AdvancedDisclosure
        id="sources"
        title="進階：來源與研究對照"
        body="如要追查概念源流或比較不同專家的觀點，可展開查閱；權威來源並不等於唯一正確版本。"
      >
        {learning ? (
          <div className="mb-5 flex flex-wrap gap-2">
            {learning.sources.map((source) => (
              <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="source-link">
                {source.label}<ExternalLink className="size-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        ) : null}
        <div className="grid gap-3">
          {item.research.comparisonRows.filter(() => item.validationFlags.length === 0).slice(0, 2).map((row) => (
            <article key={`${row.expert_id}-${row.comparison_rank}`} className="research-source-row">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={comparisonVerdictTone(row.verdict_zh)}>{comparisonVerdictLabel(row.verdict_zh)}</Badge>
                <h3 className="font-bold text-[var(--ink)]">{row.name_zh}</h3>
                <span className="text-xs text-[var(--muted)]">{row.relation_zh}</span>
              </div>
              <p><strong>研究重點：</strong>{comparisonResearchFocus(row)}</p>
              <p><strong>參考材料：</strong>{row.representative_materials_zh}</p>
            </article>
          ))}
        </div>
      </AdvancedDisclosure>
      <Section title="相關研究札記"><div className="link-index">{articles.filter(a => (a.title+" "+a.excerpt).toLowerCase().includes(item.abbr.toLowerCase())).slice(0,4).map(a=><Link key={a.slug} href={`/blog/${a.slug}`}>{a.title}</Link>)}<Link href="/blog/category/indicators">閱讀指標與圖表專題 →</Link></div></Section>
    </div>
  );
}

function OrientationRow({ label, value, tone }: { readonly label: string; readonly value: string; readonly tone: "good" | "info" | "warn" }) {
  return <div data-tone={tone}><h3>{label}</h3><p>{value}</p></div>;
}

function EvidenceRow({ term, detail }: { readonly term: string; readonly detail: string }) {
  return <div><dt>{term}</dt><dd>{detail}</dd></div>;
}

function Scenario({ label, value, tone }: { readonly label: string; readonly value: string; readonly tone: "good" | "warn" | "bad" }) {
  return <div className={`scenario-block is-${tone}`}><h3>{label}</h3><p>{value}</p></div>;
}

function ListCard({ title, rows, tone }: { readonly title: string; readonly rows: readonly string[]; readonly tone: "good" | "warn" | "bad" }) {
  return (
    <Card className={`indicator-evidence-card is-${tone} h-full shadow-none`}>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent><ul className="grid gap-2 leading-7 text-[var(--muted)]">{rows.map((row) => <li key={row}>{row}</li>)}</ul></CardContent>
    </Card>
  );
}
