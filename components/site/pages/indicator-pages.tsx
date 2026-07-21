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
        eyebrow="新手由 5 個角色開始"
        title="不用學齊 82 個，先學會 5 個角色"
        body="先學位置、量能、方向、力度和風險。每個角色只用一個代表指標，便可以建立第一套完整判讀流程。"
        imageKey="indicators"
        actions={
          <>
            <PrimaryLink href="/indicators/support-resistance">由第一步開始</PrimaryLink>
            <PrimaryLink href="/compare" variant="secondary">比較指標角色</PrimaryLink>
          </>
        }
      />
      <Section title="新手建議路線" body="學完這五個，你便有一套基本判讀流程：位置在哪裡、是否有成交支持、方向如何、力度怎樣，以及最多可以承受多少風險。">
        <ol className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {beginnerStarterLessons.map((lesson) => {
            const indicator = findIndicator(lesson.slug);
            return indicator ? (
              <li key={lesson.slug} className="flat-evidence-block flex min-w-0 flex-col items-start">
                <Badge variant="good">第 {lesson.step} 步 · {lesson.role}</Badge>
                <h3 className="mt-3 font-bold text-[var(--ink)]">{lesson.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-[var(--muted)]">{lesson.body}</p>
                <PrimaryLink href={`/indicators/${lesson.slug}`} variant="ghost">學 {indicator.abbr}</PrimaryLink>
              </li>
            ) : null;
          })}
        </ol>
      </Section>
      <Section title="按你的問題選指標" body="已掌握五個基本角色後，才按實際需要延伸。不要因為指標數量多，便以為每一個都要學。">
        <IndicatorLibrary items={indicatorSummaries} categories={categoryCounts().map((item) => item.name)} />
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
  return <IndicatorDetail item={item} />;
}
