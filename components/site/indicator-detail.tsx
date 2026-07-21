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
            <OrientationRow label="它幫你看甚麼" value={measures} tone="good" />
            <OrientationRow label="較適合何時用" value={bestRegime} tone="info" />
            <OrientationRow label="它不能告訴你" value={boundary} tone="warn" />
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

      <Section id="chart" title="用圖表練習判讀" body={learning ? "按「先看市況、再看訊號、最後寫風險」的次序閱讀。圖表由本地歷史 OHLCV 快照計算。" : "這個指標需要專屬資料；資料未齊前，頁面不會用不相符的價格圖冒充結果。"}>
        {learning && chartCase ? (
          <IndicatorTeachingChart slug={item.siteSlug} caseKey={chartCase} chartLead={learning.chartLead} />
        ) : (
          <div className="chart-data-requirement">
            <strong>專屬圖表待覆核</strong>
            <p>現階段保留公式、訊號和限制，但未把不相符的單一股票走勢包裝成此指標的計算結果。</p>
          </div>
        )}
      </Section>

      <Section id="signals" title="看見讀數後，先這樣判斷" body="先分清哪些是可留意的現象、哪些是常見誤用，以及甚麼情況代表原來判斷已失效。">
        {learning ? (
          <div className="scenario-grid mb-5">
            <Scenario label="較有用的情境" value={learning.validCase} tone="good" />
            <Scenario label="容易失效的情境" value={learning.failureCase} tone="bad" />
            <Scenario label="使用界線" value={learning.signalBoundary} tone="warn" />
          </div>
        ) : null}
        <div className="grid gap-5 lg:grid-cols-3">
          <ListCard title="可以留意" rows={item.signals} tone="good" />
          <ListCard title="新手常見錯誤" rows={item.mistakes} tone="warn" />
          <ListCard title="要停下來重看" rows={item.limitations} tone="bad" />
        </div>
      </Section>

      <IndicatorBeginnerPractice item={item} />

      <Section title="相關指標" body="比較功能角色，避免用三個本質相同的指標誤當多重確認。">
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
        body={learning ? "已理解實際用法後，再查看輸入、平滑、預熱期和例算。" : "這個條目目前提供概念公式；使用前仍要核對平台計算方式。"}
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
      </AdvancedDisclosure>

      <AdvancedDisclosure
        id="sources"
        title="進階：來源與研究對照"
        body="想追查概念源流或不同專家的觀點時再展開；權威來源不等於唯一正確版本。"
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
