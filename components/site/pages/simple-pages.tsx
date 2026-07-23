import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeroPanel, PrimaryLink, Section } from "@/components/site/page-shell";
import { comparisonResearchFocus, comparisonVerdictLabel, comparisonVerdictTone } from "@/lib/research-copy";
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
  return <GenericPage imageKey="home" eyebrow="學習路線" title="技術分析要有先後次序" body="市況決定哪些訊號值得理會；成交量、動能和波幅只負責補充證據。每一步都要寫明條件，免得事後遷就結果。" rows={["大市方向：移動平均線、ADX 及市場廣度", "訊號確認：RSI、MACD、成交量及突破質素", "交易前檢查：止蝕、R 值、倉位及出市條件"]} />;
}

function ToolkitPage() {
  return <GenericPage imageKey="playground" eyebrow="工具箱" title="交易前，把風險計清楚" body="R 值、回撤、盈利因子（PF）、勝率和倉位各有不同用途。數字要放回交易次數、止蝕距離和可承受虧損之中閱讀。" rows={["R 值：定下止蝕後，才計算合理目標", "盈利因子：須連同交易次數及回撤一併閱讀", "倉位：按每筆交易可承受的風險金額決定"]} />;
}

function CandlestickPage() {
  return <GenericPage imageKey="detail" eyebrow="陰陽燭" title="離開市況，形態便失去意義" body="單一陰陽燭不足以構成交易訊號。判讀時要同時考慮趨勢、成交量、支持阻力及風險回報。" rows={["反轉形態須等待確認，不能看見錘頭便立即買入", "裂口要分辨消息影響、成交量及其後承接", "長上影可能反映派發，也可能只是波幅擴大"]} />;
}

function ComparePage() {
  return (
    <div>
      <HeroPanel eyebrow="專家比較" title="訊號相似，不等於多一重確認" body="RSI、隨機指標和 MACD 都涉及價格動能，證據難免重疊。這裏並列指標功能、主要來源和補充研究，方便分清各自用途。" imageKey="compare" />
      <Section title="研究庫比較摘要">
        <div className="grid gap-3">
          {topComparisonRows(8).map((item) => (
            <Card key={`${item.concept_slug}-${item.expert_id}-${item.comparison_rank}`}>
              <CardHeader>
                <Badge variant={comparisonVerdictTone(item.verdict_zh)} className="w-fit">
                  {comparisonVerdictLabel(item.verdict_zh)}
                </Badge>
                <CardTitle>
                  {item.concept_zh} · {item.name_zh}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-6 text-[var(--muted)]">
                <strong className="text-[var(--ink)]">研究重點：</strong>
                {comparisonResearchFocus(item)}
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}

function PlaygroundPage() {
  return <GenericPage imageKey="playground" eyebrow="練習場" title="用市場情境練習，不靠背誦答案" body="把同一個指標放進上升、橫行、反轉及裂口等情境，便能看清它在甚麼時候較有參考價值，又在甚麼時候容易誤導。" rows={["趨勢市：可以接受指標滯後，但止蝕必須跟上", "橫行市：突破訊號較容易演變成假突破", "消息裂口：成交量及其後承接往往比開市第一口價更重要"]} />;
}

function CasebookPage() {
  const cases = Object.keys(siteData.marketCases);
  return <GenericPage imageKey="journal" eyebrow="市場案例" title="用真實 OHLCV 資料練習風險判讀" body={`本站資料庫收錄 ${cases.length} 個 Yahoo Finance 歷史案例。圖表只作教學用途，不代表每個指標都已在這些案例中完成驗證。`} rows={cases} />;
}

function GlossaryPage() {
  return (
    <div>
      <HeroPanel eyebrow="詞彙表" title="術語不清，策略也說不清" body="止蝕、成交量、裂口、倉位、R 值和樣本外測試（OOS）都有特定含義。用詞一致，才可以核對策略條件。" imageKey="glossary" />
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
  return <GenericPage imageKey="subscribe" eyebrow="訂閱" title="只報告資料更新，不發買賣訊號" body="訂閱內容包括新案例、資料修正、策略審核結果和 Pine Script 範本更新，不會推送買賣建議。" rows={["策略審核狀態更新", "新增專家資料或研究材料", "Pine Script 教學範本修訂"]} />;
}

function JournalPage() {
  return <GenericPage imageKey="journal" eyebrow="交易日誌" title="日誌要記理由，也要記偏差" body="除了入市理由，還要寫下失效條件、止蝕和出市安排。交易完成後再核對一次：執行有沒有偏離原定規則。" rows={["入市前：寫下哪些情況出現時不會交易", "持倉期間：只按新事實更新判斷，不任意改寫理由", "出市後：分清執行錯誤、運氣成分及策略缺陷"]} />;
}

function ComboPage() {
  return <GenericPage imageKey="combo" eyebrow="指標組合" title="指標不必多，分工必須清楚" body="組合指標的目的不是堆疊確認，而是分工：一個判斷市況，一個確認訊號，另一個管理風險。" rows={["市況篩選：移動平均線或 ADX", "訊號觸發：RSI、MACD 或價格突破", "風險管理：ATR、結構止蝕及 R 值"]} />;
}

function ScriptPage() {
  const rows = strategyCodeCases().map((item) => `${item.shortTitle || item.title}: ${item.pineScript.status}`);
  return <GenericPage imageKey="tv" eyebrow="Pine Script" title="教學範本與原作者程式必須分開" body="本站展示自行重建的教學範本。原作者的 TradingView 程式碼，只有在授權、署名和來源均完成核對後才會收錄。" rows={rows} actionHref="/strategy-cases" actionLabel="查看策略程式" />;
}

function ScriptDemoPage() {
  return <GenericPage imageKey="playground" eyebrow="程式示範" title="程式只執行已寫清楚的規則" body="市況、訊號、風險和出市條件會分開處理。單一買賣命令不足以交代整套判斷。" rows={["市況符合要求後才查看訊號", "訊號成立後才計算止蝕", "按止蝕距離決定倉位"]} />;
}

function TrialPage() {
  return <GenericPage imageKey="subscribe" eyebrow="試用流程" title="腳本權限不等於績效保證" body="試用安排只限教育及研究用途，並須遵守程式碼授權。受邀腳本（invite-only script）同樣要自行回測和評估風險。" rows={["提供 TradingView 用戶名稱", "確認用途為教學或研究", "取得授權後自行進行回測"]} />;
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
      <Section title="閱讀重點">
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
