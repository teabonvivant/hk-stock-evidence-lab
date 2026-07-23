import { Badge } from "@/components/ui/badge";
import { IndicatorDetail } from "@/components/site/indicator-detail";
import { IndicatorLibrary } from "@/components/site/indicator-library";
import { HeroPanel, PrimaryLink, Section } from "@/components/site/page-shell";
import { beginnerStarterLessons } from "@/lib/indicator-beginner-guide";
import { categoryCounts, findIndicator, indicatorSummaries } from "@/lib/site-data";

export function IndicatorsPage() {
  return (
    <div>
      <HeroPanel
        eyebrow="82 個教學指標"
        title="82 個指標，不必逐一背誦"
        body="由五個常見問題入手：價格位置、成交確認、趨勢方向、動能強弱和風險幅度。每個問題先選一個代表指標，較容易建立清楚框架。"
        imageKey="indicators"
        actions={
          <>
            <PrimaryLink href="/indicators/support-resistance">從價格位置開始</PrimaryLink>
            <PrimaryLink href="/compare" variant="secondary">比較指標用途</PrimaryLink>
          </>
        }
      />
      <Section title="從五個問題開始" body="以下五個指標各負責一項工作。完成後，再按自己的分析需要延伸。">
        <ol className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {beginnerStarterLessons.map((lesson) => {
            const indicator = findIndicator(lesson.slug);
            return indicator ? (
              <li key={lesson.slug} className="flat-evidence-block flex min-w-0 flex-col items-start">
                <Badge variant="good">第 {lesson.step} 步 · {lesson.role}</Badge>
                <h3 className="mt-3 font-bold text-[var(--ink)]">{lesson.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-[var(--muted)]">{lesson.body}</p>
                <PrimaryLink href={`/indicators/${lesson.slug}`} variant="ghost">學習 {indicator.abbr}</PrimaryLink>
              </li>
            ) : null;
          })}
        </ol>
      </Section>
      <Section title="有需要才向外延伸" body="知道要回答甚麼問題，才按用途、難度或名稱搜尋。指標多，並不代表判斷更可靠。">
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
