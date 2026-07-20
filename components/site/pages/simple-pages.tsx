import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeroPanel, PrimaryLink, Section } from "@/components/site/page-shell";
import { indicators, siteData, strategyCodeCases, topComparisonRows } from "@/lib/site-data";
import type { SimpleRouteSlug } from "@/lib/routes";

export function SimplePage({ slug }: { readonly slug: SimpleRouteSlug }) {
  switch (slug) {
    case "learn":
      return <LearningPage />;
    case "toolbox":
      return <ToolkitPage />;
    case "candlesticks":
      return <CandlestickPage />;
    case "compare":
      return <ComparePage />;
    case "playground":
      return <PlaygroundPage />;
    case "casebook":
      return <CasebookPage />;
    case "glossary":
      return <GlossaryPage />;
    case "subscribe":
      return <SubscribePage />;
    case "journal":
      return <JournalPage />;
    case "combo":
      return <ComboPage />;
    case "script":
      return <ScriptPage />;
    case "script-demo":
      return <ScriptDemoPage />;
    case "trial":
      return <TrialPage />;
  }
}

function LearningPage() {
  return <GenericPage imageKey="home" eyebrow="學習路線" title="由大市到入場" body="先判斷市況，再睇成交、動能、波幅同風險。每一步都要有條件可以覆核。" rows={["大市方向：移動平均、ADX、市場寬度", "訊號確認：RSI、MACD、成交量同突破質素", "交易前檢查：止蝕、R 值、倉位、退出條件"]} />;
}

function ToolkitPage() {
  return <GenericPage imageKey="playground" eyebrow="工具箱" title="將模糊想法寫成檢查表" body="工具頁整理 R 值、回撤、PF、勝率同倉位概念。入場前先問清楚風險，而不是憑感覺落注。" rows={["R 值：先定止蝕，再計合理目標", "PF：要連同交易次數同回撤一齊睇", "倉位：用可承受風險額決定大小"]} />;
}

function CandlestickPage() {
  return <GenericPage imageKey="detail" eyebrow="陰陽燭" title="形態要放回市況先有意思" body="單支 K 線不是訊號。要放回趨勢、成交量、支撐阻力同風險回報一齊判斷。" rows={["反轉形態要等確認，不是見到鎚頭就買", "裂口要分消息、成交同後續承接", "長上影可能是派發，也可能只是波幅擴大"]} />;
}

function ComparePage() {
  return (
    <div>
      <HeroPanel eyebrow="專家比較" title="不要重複看同一個訊號" body="比較頁把指標角色、核心權威同補充專家放在一起，幫你避免 RSI、隨機指標同 MACD 全部講同一件事，卻當成三重確認。" imageKey="compare" />
      <Section title="研究庫比較摘要">
        <div className="grid gap-3">
          {topComparisonRows(8).map((item) => (
            <Card key={`${item.concept_slug}-${item.expert_id}-${item.comparison_rank}`}>
              <CardHeader>
                <Badge variant={item.verdict_zh === "優勝" ? "good" : "info"} className="w-fit">
                  {item.verdict_zh}
                </Badge>
                <CardTitle>
                  {item.concept_zh} · {item.name_zh}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-6 text-[var(--muted)]">{item.difference_zh}</CardContent>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}

function PlaygroundPage() {
  return <GenericPage imageKey="playground" eyebrow="練習場" title="用情境練習，不是背答案" body="用上升、橫行、反轉、裂口等情境測試同一個指標，睇清楚它何時有效、何時會誤導。" rows={["趨勢市：滯後指標可以接受，但止蝕要跟得上", "橫行市：突破訊號容易變成假突破", "消息裂口：成交同後續承接比第一口價更重要"]} />;
}

function CasebookPage() {
  const cases = Object.keys(siteData.marketCases);
  return <GenericPage imageKey="journal" eyebrow="市場案例" title="用真實 OHLCV 練風險判讀" body={`本地資料包有 ${cases.length} 個 Yahoo 案例。圖表只作教學素材，不等於逐個指標都已被驗證。`} rows={cases} />;
}

function GlossaryPage() {
  return (
    <div>
      <HeroPanel eyebrow="詞彙表" title="先講同一套語言" body="止蝕、成交量、裂口、倉位、R 值同 OOS 這些字要講得準，策略討論先不會失焦。" imageKey="glossary" />
      <Section title="常用詞彙">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {indicators.slice(0, 18).map((item) => (
            <Card key={item.siteSlug}>
              <CardHeader>
                <Badge variant="info" className="w-fit">{item.category}</Badge>
                <CardTitle>{item.nameZh}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-6 text-[var(--muted)]">{item.summary}</CardContent>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}

function SubscribePage() {
  return <GenericPage imageKey="subscribe" eyebrow="訂閱" title="追蹤資料修訂，不追即市訊號" body="訂閱只適合接收新案例、資料修正、策略審核結果同 Pine 範本更新。不會推送買賣建議。" rows={["策略 accepted 狀態更新", "新增專家或研究材料", "Pine Script 教學範本修訂"]} />;
}

function JournalPage() {
  return <GenericPage imageKey="journal" eyebrow="交易日誌" title="把錯誤寫得具體一點" body="日誌不是記心情，而是記入場理由、失效條件、止蝕、退出，同事後有沒有違反流程。" rows={["入場前：寫下不交易的條件", "持倉中：只更新事實，不重寫故事", "出場後：分清錯誤、運氣同策略缺陷"]} />;
}

function ComboPage() {
  return <GenericPage imageKey="combo" eyebrow="組合策略" title="少即是多" body="組合指標不是堆疊確認，而是分工：一個判斷市況，一個確認訊號，一個管理風險。" rows={["市況濾網：MA 或 ADX", "訊號觸發：RSI、MACD 或突破", "風險管理：ATR、結構止蝕同 R 值"]} />;
}

function ScriptPage() {
  const rows = strategyCodeCases().map((item) => `${item.shortTitle || item.title}: ${item.pineScript.status}`);
  return <GenericPage imageKey="tv" eyebrow="Pine Script" title="先做教學範本，再談自動化" body="本站目前展示的是本地教學重建範本。原作者 TradingView 源碼只會在授權同署名確認後收錄。" rows={rows} actionHref="/strategy-cases" actionLabel="查看策略代碼" />;
}

function ScriptDemoPage() {
  return <GenericPage imageKey="playground" eyebrow="腳本示範" title="將檢查條件放到圖表旁" body="示範頁把市況、訊號、風險同退出條件拆開，不把腳本寫成單一買賣命令。" rows={["市況通過才看訊號", "訊號成熟才計止蝕", "止蝕距離決定倉位"]} />;
}

function TrialPage() {
  return <GenericPage imageKey="subscribe" eyebrow="試用流程" title="先審核用途，再開放腳本" body="試用流程保留教育用途同授權邊界。任何 invite-only script 都不承諾績效，只用來減少漏判和強化檢查。" rows={["留下 TradingView 用戶名", "確認用途是教學或研究", "收到授權後自行回測"]} />;
}

function GenericPage({
  imageKey,
  eyebrow,
  title,
  body,
  rows,
  actionHref,
  actionLabel,
}: {
  readonly imageKey: "home" | "detail" | "compare" | "playground" | "glossary" | "journal" | "combo" | "subscribe" | "tv";
  readonly eyebrow: string;
  readonly title: string;
  readonly body: string;
  readonly rows: readonly string[];
  readonly actionHref?: string | undefined;
  readonly actionLabel?: string | undefined;
}) {
  return (
    <div>
      <HeroPanel eyebrow={eyebrow} title={title} body={body} imageKey={imageKey} actions={actionHref && actionLabel ? <PrimaryLink href={actionHref}>{actionLabel}</PrimaryLink> : undefined} />
      <Section title="重點">
        <div className="grid gap-3 md:grid-cols-3">
          {rows.map((row) => (
            <Card key={row}>
              <CardContent className="p-5 text-sm leading-6 text-[var(--muted)]">{row}</CardContent>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}
