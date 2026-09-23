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
        title={`${item.abbr} 的判讀重點`}
        body={guide.plain}
      >
        <ul className="indicator-takeaways">
          <li><strong>圖上看甚麼</strong><span>{guide.look}</span></li>
          <li><strong>如何配合價格</strong><span>{guide.simple}</span></li>
          <li><strong>容易誤判之處</strong><span>{guide.avoid}</span></li>
        </ul>
      </Section>
    </>
  );
}

export function IndicatorUsageFlow({ item }: { readonly item: Indicator }) {
  const guide = beginnerGuideFor(item);
  return (
    <Section id="usage" title="實際使用流程" body={guide.flowLead}>
      <ol className="grid gap-3">
        {guide.flow.map((step, index) => (
          <FlowStep key={step.title} step={String(index + 1)} title={step.title} body={step.body} />
        ))}
      </ol>
    </Section>
  );
}

export function IndicatorBeginnerPractice({ item }: { readonly item: Indicator }) {
  const guide = beginnerGuideFor(item);

  return (
    <Section
      id="practice"
      title="用歷史圖表驗證理解"
      body={`練習 ${item.abbr} 時，只記錄訊號、價格確認和失效條件；尚未掌握判讀方法，不宜以實際資金測試。`}
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
