import { IndicatorDetail } from "@/components/site/indicator-detail";
import { IndicatorLibrary } from "@/components/site/indicator-library";
import { HeroPanel, PrimaryLink, Section } from "@/components/site/page-shell";
import { beginnerStarterLessons } from "@/lib/indicator-beginner-guide";
import { categoryCounts, findIndicator, indicatorSummaries } from "@/lib/site-data";

export function IndicatorsPage() {
  return (
    <div>
      <HeroPanel
        eyebrow="82 個技術指標 · 按用途學習"
        title={<><span className="hero-phrase">先決定要回答甚麼，</span><span className="hero-phrase">再選指標</span></>}
        body="由價格位置、成交確認、趨勢方向、動能強弱和風險幅度五個問題入手。每個問題先用一個工具回答，較容易分清訊號、限制與失效條件。"
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
                <h3 className="font-bold text-[var(--ink)]">{lesson.title}</h3>
                <p className="mt-2 text-xs font-medium text-[var(--primary-strong)]">第 {lesson.step} 步 · {lesson.role}</p>
                <p className="mt-2 flex-1 text-sm leading-6 text-[var(--muted)]">{lesson.body}</p>
                <PrimaryLink href={`/indicators/${lesson.slug}`} variant="ghost">學習 {indicator.abbr}</PrimaryLink>
              </li>
            ) : null;
          })}
        </ol>
      </Section>
      <Section title="按問題搜尋完整指標百科" body="知道要回答甚麼問題，才按用途、難度或名稱搜尋。指標多，並不代表判斷更可靠。">
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
