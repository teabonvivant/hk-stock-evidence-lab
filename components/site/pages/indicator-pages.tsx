import { IndicatorDetail } from "@/components/site/indicator-detail";
import { IndicatorLibrary } from "@/components/site/indicator-library";
import { PrimaryLink, Section } from "@/components/site/page-shell";
import { beginnerStarterLessons } from "@/lib/indicator-beginner-guide";
import { categoryCounts, findIndicator, indicatorSummaries } from "@/lib/site-data";

export function IndicatorsPage() {
  return (
    <div>
      <header className="editorial-heading library-heading"><h1>指標百科</h1><p>先問價格位置、趨勢、動能、成交或風險，再按用途查找指標。</p><span>82 個技術指標 · 公式、用途與失效條件</span></header>
      <IndicatorLibrary items={indicatorSummaries} categories={categoryCounts().map((item) => item.name)} />
      <Section title="從五個問題開始" body="以下五個指標各負責一項工作。完成後，再按自己的分析需要延伸。">
        <ol className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {beginnerStarterLessons.map((lesson) => {
            const indicator = findIndicator(lesson.slug);
            return indicator ? (
              <li key={lesson.slug} className="flat-evidence-block flex min-w-0 flex-col items-start">
                <h3 className="font-bold text-[var(--ink)]">{lesson.title}</h3>
                <p className="mt-2 text-xs font-medium text-[var(--primary-strong)]">第 {lesson.step} 步 · {lesson.role}</p>
                <p className="mt-2 flex-1 text-sm leading-6 text-[var(--muted)]">{lesson.body}</p>
                <PrimaryLink href={`/indicators/${lesson.slug}`} variant="ghost">學習 {indicator.abbr}</PrimaryLink>
              </li>
            ) : null;
          })}
        </ol>
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
