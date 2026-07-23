import Link from "next/link";

import { DirectAnswer } from "@/components/site/direct-answer";
import { IndicatorCard } from "@/components/site/indicator-card";
import { JsonLd } from "@/components/site/json-ld";
import { HeroPanel, PrimaryLink, Section } from "@/components/site/page-shell";
import { Badge } from "@/components/ui/badge";
import { beginnerStarterLessons } from "@/lib/indicator-beginner-guide";
import { findIndicator } from "@/lib/site-data";

const starterIndicators = beginnerStarterLessons.flatMap((lesson) => {
  const indicator = findIndicator(lesson.slug);
  return indicator ? [indicator] : [];
});

const decisionPaths = [
  {
    title: "大市方向是否清楚？",
    body: "先分辨趨勢、橫行或急劇波動，再決定哪些訊號值得閱讀。",
    href: "/learn",
    label: "由市況開始",
  },
  {
    title: "突破是否有證據？",
    body: "核對價格位置、收市確認與成交量，並預先寫下假突破條件。",
    href: "/indicators/support-resistance",
    label: "核對價格位置",
  },
  {
    title: "回測結果能否重現？",
    body: "檢查資料、參數、成本、樣本期、原始碼與樣本外測試。",
    href: "/methodology/backtesting",
    label: "查看發布閘門",
  },
] as const;

const evidenceSteps = [
  ["01", "原始數據", "記錄來源、時區、週期、復權與取得日期。"],
  ["02", "公式及參數", "保存計算方法、預熱期與版本。"],
  ["03", "市況分類", "說明結論適用於哪類市場環境。"],
  ["04", "失效測試", "同時展示正常案例與反例。"],
  ["05", "成本及樣本外", "加入交易摩擦，避免只迎合既有樣本。"],
  ["06", "具名覆核", "列明作者、技術及數據責任；缺一便維持研究中。"],
] as const;

export function HomePage() {
  return (
    <div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "港股證據研究室",
          alternateName: "HK Stock Evidence Lab",
          url: "https://technical-indicators-hk.teabonvivant.chatgpt.site/",
          inLanguage: "zh-Hant-HK",
          description: "以可重現資料、公式、失效條件及回測發布閘門整理港股技術分析。",
        }}
      />
      <HeroPanel
        eyebrow="港股技術分析研究庫"
        title="不只看訊號，更要核對證據"
        body="本站把技術指標、港股圖表、失效條件與回測限制拆開記錄。未有資料版本、重現方法或具名覆核的內容，會清楚標示為研究中。"
        imageKey="home"
        actions={(
          <>
            <PrimaryLink href="/learn">建立判讀次序</PrimaryLink>
            <PrimaryLink href="/methodology/data" variant="secondary">查看數據方法</PrimaryLink>
            <PrimaryLink href="/indicators" variant="ghost">瀏覽指標百科</PrimaryLink>
          </>
        )}
      />

      <div className="trust-strip" role="note">
        <Badge variant="warn">公開責任狀態</Badge>
        <strong>具名覆核完成前維持研究中</strong>
        <span>不以漂亮數字、假圖表或 AI 整理結果冒充結論。</span>
        <Link href="/trust">查看信任中心</Link>
      </div>

      <DirectAnswer
        answer="技術訊號只是一項觀察；只有資料、公式、市況、失效條件、成本與覆核責任都可追查時，才值得升級為研究結論。"
        takeaways={[
          "先決定要回答的市場問題，再選指標。",
          "正常案例與失效案例必須同時保留。",
          "回測數字未獨立重現前，只可標示為來源聲稱。",
        ]}
      />

      <Section title="你現在想判斷甚麼？" body="先選問題，不要先堆指標。每條路徑都會交代它能回答甚麼，以及不能證明甚麼。">
        <div className="decision-grid">
          {decisionPaths.map((item) => (
            <article key={item.href} className="decision-card">
              <span>研究問題</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              <Link href={item.href}>{item.label}<span aria-hidden="true"> →</span></Link>
            </article>
          ))}
        </div>
      </Section>

      <Section title="一個結論，如何變成可核對證據？" body="六個步驟不是裝飾，而是本站的發布閘門。任何缺口都要在頁面開首交代。">
        <ol className="evidence-step-grid">
          {evidenceSteps.map(([number, title, body]) => (
            <li key={number}>
              <span>{number}</span>
              <div><h3>{title}</h3><p>{body}</p></div>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="先由 5 個核心頁開始" body="價格位置、成交確認、趨勢方向、動能強弱與風險幅度各由一個工具負責。">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {starterIndicators.map((item) => <IndicatorCard key={item.siteSlug} item={item} />)}
        </div>
      </Section>

      <Section title="最新港股研究" body="只有通過數據、方法、失效測試及具名覆核的研究才會在此發布。">
        <div className="empty-state">
          <strong>暫未有研究通過完整發布閘門</strong>
          <p>現有內容仍可用作學習，但不會被包裝成已驗證的港股交易結論。</p>
          <PrimaryLink href="/methodology/data" variant="secondary">查看缺口如何處理</PrimaryLink>
        </div>
      </Section>

      <Section title="研究狀態公開" body="狀態說明證據完成度，不代表回報高低。綠色只保留給真正完成具名人手覆核的內容。">
        <div className="status-legend">
          <Status label="已核對" body="資料、公式、圖表與文字均完成具名覆核。" tone="good" />
          <Status label="部分核對" body="已有部分證據，未完成項目仍不可視作結論。" tone="info" />
          <Status label="研究中" body="尚欠重現資料或具名責任，頁面維持 noindex。" tone="warn" />
          <Status label="不採用" body="未能通過發布閘門，只保留作錯誤與風險教材。" tone="bad" />
        </div>
      </Section>

      <Section title="本站不會做甚麼">
        <ul className="boundary-list">
          <li><strong>不發買賣訊號</strong><span>不以「必升」、「必跌」或倒數式文案催促決定。</span></li>
          <li><strong>不隱藏失效條件</strong><span>指標適用範圍、資料缺口與反例會放在可見位置。</span></li>
          <li><strong>不把 AI 當覆核人</strong><span>AI 可協助整理，不能取代具名技術、數據或法律審閱。</span></li>
        </ul>
      </Section>
    </div>
  );
}

function Status({
  label,
  body,
  tone,
}: {
  readonly label: string;
  readonly body: string;
  readonly tone: "good" | "info" | "warn" | "bad";
}) {
  return <article><Badge variant={tone}>{label}</Badge><p>{body}</p></article>;
}
