import { BookOpen, ListChecks } from "lucide-react";

import { PrimaryLink, Section } from "@/components/site/page-shell";
import { Badge } from "@/components/ui/badge";
import { beginnerGuideFor } from "@/lib/indicator-beginner-guide";
import type { Indicator } from "@/lib/site-data";

export function IndicatorBeginnerGuide({ item }: { readonly item: Indicator }) {
  const guide = beginnerGuideFor(item);

  return (
    <>
      <Section
        id="beginner"
        title={`先用三分鐘掌握 ${item.abbr}`}
        body="不必先背公式。先弄清楚指標能回答甚麼問題、圖表應從何處開始閱讀，以及最常見的誤用。"
      >
        <div className="grid gap-3 lg:grid-cols-3">
          <QuickPoint step="1" title="用一句話理解" body={guide.plain} tone="good" />
          <QuickPoint step="2" title="圖表閱讀重點" body={guide.look} tone="info" />
          <QuickPoint step="3" title="最簡單的定位" body={guide.simple} tone="warn" />
        </div>
        <div className="scenario-block is-bad mt-4">
          <Badge variant="bad">新手最容易錯</Badge>
          <p>{guide.avoid}</p>
        </div>
      </Section>

      <Section
        id="usage"
        title="實際使用流程"
        body={guide.flowLead}
      >
        <ol className="grid gap-3">
          {guide.flow.map((step, index) => (
            <FlowStep key={step.title} step={String(index + 1)} title={step.title} body={step.body} />
          ))}
        </ol>
      </Section>
    </>
  );
}

export function IndicatorBeginnerPractice({ item }: { readonly item: Indicator }) {
  const guide = beginnerGuideFor(item);

  return (
    <Section
      id="practice"
      title="新手練習"
      body={`先以歷史圖表練習 ${item.abbr}；尚未掌握判讀方法前，不宜使用實際資金驗證。`}
    >
      <ol className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {guide.practice.map((task, index) => (
          <li key={task} className="flat-evidence-block">
            <Badge variant="good">第 {index + 1} 步</Badge>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{task}</p>
          </li>
        ))}
      </ol>
      <div className="mt-4 flex flex-wrap gap-2">
        <PrimaryLink href="/playground"><ListChecks className="size-4" aria-hidden="true" />前往練習場</PrimaryLink>
        <PrimaryLink href="/glossary" variant="secondary"><BookOpen className="size-4" aria-hidden="true" />先查常用詞彙</PrimaryLink>
      </div>
    </Section>
  );
}

function QuickPoint({
  step,
  title,
  body,
  tone,
}: {
  readonly step: string;
  readonly title: string;
  readonly body: string;
  readonly tone: "good" | "info" | "warn";
}) {
  return (
    <div className={`scenario-block is-${tone}`}>
      <Badge variant={tone}>第 {step} 步</Badge>
      <h3 className="mt-3 font-bold text-[var(--ink)]">{title}</h3>
      <p>{body}</p>
    </div>
  );
}

function FlowStep({ step, title, body }: { readonly step: string; readonly title: string; readonly body: string }) {
  return (
    <li className="grid min-w-0 grid-cols-1 gap-3 rounded-[8px] border border-[var(--line)] bg-[var(--surface-soft)] p-4 sm:grid-cols-[2.5rem_minmax(0,1fr)]">
      <span className="grid size-10 place-items-center rounded-[8px] bg-[var(--primary)] font-black text-white">{step}</span>
      <div className="min-w-0">
        <h3 className="font-bold text-[var(--ink)]">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{body}</p>
      </div>
    </li>
  );
}
