import { ArrowLeft, BookOpen, ChartNoAxesCombined, ExternalLink, Link2, ListChecks, ShieldAlert } from "lucide-react";
import Link from "next/link";

import { AdvancedDisclosure } from "@/components/site/advanced-disclosure";
import { IndicatorTeachingChart } from "@/components/site/indicator-chart";
import { IndicatorBeginnerGuide, IndicatorBeginnerPractice } from "@/components/site/indicator-beginner-guide";
import { PrimaryLink, Section } from "@/components/site/page-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { beginnerGuideFor } from "@/lib/indicator-beginner-guide";
import { findCoreIndicatorLearning, formulaTypeLabel, parseMarketCaseKey } from "@/lib/indicator-learning";
import { findIndicator } from "@/lib/site-data";
import type { Indicator } from "@/lib/site-data";

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
    <div>
      <section className="research-panel overflow-hidden">
        <div className="grid min-w-0 gap-5 p-5 lg:grid-cols-[1.05fr_0.95fr] lg:p-6">
          <div className="flex min-w-0 flex-col justify-center gap-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant={learning ? "good" : "info"}>{learning ? "核心 20 指標詳解" : "指標研究條目"}</Badge>
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
            <OrientationRow label="量度內容" value={measures} tone="good" />
            <OrientationRow label="適用市況" value={bestRegime} tone="info" />
            <OrientationRow label="不能反映" value={boundary} tone="warn" />
          </div>
        </div>
        <nav className="detail-nav" aria-label="本頁章節">
          <a href="#beginner"><BookOpen className="size-4" aria-hidden="true" />先理解</a>
          <a href="#usage"><ShieldAlert className="size-4" aria-hidden="true" />實際用法</a>
          <a href="#chart"><ChartNoAxesCombined className="size-4" aria-hidden="true" />圖表判讀</a>
          <a href="#practice"><ListChecks className="size-4" aria-hidden="true" />動手練習</a>
        </nav>
      </section>

      <IndicatorBeginnerGuide item={item} />

      <Section id="chart" title="以真實數據練習圖表判讀" body={learning ? "按「先看市況、再看訊號、最後列明風險」的次序閱讀。圖表採用本站保存的歷史開市、最高、最低、收市及成交量（OHLCV）資料計算。" : "此指標需要專屬資料；資料未齊前，頁面不會以不相符的價格圖代替指標結果。"}>
        {learning && chartCase ? (
          <IndicatorTeachingChart slug={item.siteSlug} caseKey={chartCase} chartLead={learning.chartLead} />
        ) : (
          <div className="chart-data-requirement">
            <strong>圖表尚待覆核</strong>
            <p>目前保留公式、訊號及限制。由於尚未取得符合指標要求的資料，本站不會以一般股價走勢代替計算結果。</p>
          </div>
        )}
      </Section>

      <Section id="signals" title="讀到訊號後，應如何判斷" body="先分清可供參考的現象、常見誤用，以及哪些情況表示原來的判斷已經失效。">
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

      <IndicatorBeginnerPractice item={item} />

      <Section title="相關指標" body="比較不同指標的功能，避免把三個本質相近的指標誤作多重確認。">
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
        body={learning ? "掌握實際用法後，再查閱輸入資料、平滑方法、預熱期及例算。" : "此條目目前只提供概念公式，使用前仍須核對平台的計算方式。"}
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
            <EvidenceRow term="輸入資料" detail={learning?.inputs ?? "資料庫暫未分拆輸入欄位。"} />
            <EvidenceRow term="平滑／運算規則" detail={learning?.smoothing ?? "須按所用平台再行核對。"} />
            <EvidenceRow term="所需歷史期數" detail={learning?.warmup ?? "資料庫暫未標明。"} />
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
              <h3>計算示例</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{learning.workedExample}</p>
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
        {item.validationFlags.length > 0 ? (
          <p className="mb-4 rounded-[8px] border border-[#f3d7ad] bg-[#fff7ed] px-4 py-3 text-sm leading-6 text-[#7c3f00]">
            此條目的分類或概念配對仍在覆核。以下專家比較只供研究參考，不應視作定論。
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
              <p><strong>參考材料：</strong>{row.representative_materials_zh}</p>
              <p className="text-xs">{row.evidence_profile_zh}</p>
            </article>
          ))}
        </div>
      </AdvancedDisclosure>
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
