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
        title="不必一次學齊 82 個：先掌握 5 種角色"
        body="由價格位置、成交確認、趨勢方向、動能強弱及風險幅度入手。每種角色先掌握一個代表指標，便可建立第一套完整判讀流程。"
        imageKey="indicators"
        actions={
          <>
            <PrimaryLink href="/indicators/support-resistance">由第一步開始</PrimaryLink>
            <PrimaryLink href="/compare" variant="secondary">比較指標用途</PrimaryLink>
          </>
        }
      />
      <Section title="新手建議路線" body="完成以下五步，便能有條理地判斷價格位置、成交支持、趨勢方向、動能強弱，以及可承受的風險幅度。">
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
      <Section title="按實際問題選擇指標" body="掌握五種基本角色後，再按用途及難度逐步延伸。搜尋範圍包括中英文名稱、縮寫及用途。">
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
