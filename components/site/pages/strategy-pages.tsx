import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeroPanel, MetricTile, PrimaryLink, Section } from "@/components/site/page-shell";
import { StrategyFilter } from "@/components/site/strategy-filter";
import { findStrategy, strategies, strategyStatusCounts, tradingViewData } from "@/lib/site-data";

export function StrategyCasesPage() {
  return (
    <div>
      <HeroPanel
        eyebrow="TradingView 策略案例庫"
        title="先審核，再學代碼"
        body="所有案例都放在本地資料包。PF、勝率同回撤只係歷史線索，仲要一齊睇設定、成本、樣本期同源碼授權。"
        imageKey="tv"
        actions={<PrimaryLink href="/tv-strategies">睇回測審核方法</PrimaryLink>}
      />
      <Section title="案例狀態" body={tradingViewData.metricFramingZh}>
        <div className="metric-grid">
          {strategyStatusCounts().map((item) => (
            <MetricTile key={item.name} label={statusLabel(item.name)} value={item.count} tone={statusTone(item.name)} />
          ))}
          <MetricTile label="本地 Pine 範本" value={tradingViewData.stats.localTemplateCases} tone="warn" />
          <MetricTile label="不展示代碼" value={tradingViewData.stats.blockedCodeCases} tone="info" />
        </div>
      </Section>
      <Section title="本地策略案例" body="篩選只會切換本地案例，不會跳去外部網站。source URL 只留在內部審核資料。">
        <StrategyFilter items={strategies} />
      </Section>
    </div>
  );
}

export function TradingViewTeachingPage() {
  return (
    <div>
      <HeroPanel
        eyebrow="Strategy Tester 審核"
        title="高 PF，不代表可以實盤"
        body="TradingView Strategy Report 可以幫你測試想法，但唔可以只睇漂亮數字。要先核對 Properties、Inputs、交易次數、成本、滑價同 OOS。"
        imageKey="tv"
        actions={<PrimaryLink href="/strategy-cases">睇本地案例</PrimaryLink>}
      />
      <Section title="合格案例最低門檻">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rules.map((item) => (
            <Card key={item.title}>
              <CardHeader>
                <Badge variant={item.tone} className="w-fit">
                  {item.badge}
                </Badge>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-6 text-[var(--muted)]">{item.body}</CardContent>
            </Card>
          ))}
        </div>
      </Section>
      <Section title="為何暫時仍是 support-only" body="網站已補詳細設定同本地教學代碼，但要計入 accepted，仍要有可重建的 Strategy Report、交易設定同源碼授權證據。">
        <table className="data-table">
          <tbody>
            <Row label="原始 leads" value={tradingViewData.stats.rawLeadsCollected} />
            <Row label="正式案例" value={tradingViewData.stats.totalCases} />
            <Row label="Accepted" value={tradingViewData.stats.acceptedCases} />
            <Row label="Support-only" value={tradingViewData.stats.supportOnlyCases} />
            <Row label="Rejected" value={tradingViewData.stats.rejectedCases} />
            <Row label="OOS 缺口" value={tradingViewData.stats.missingOosCount} />
          </tbody>
        </table>
      </Section>
    </div>
  );
}

export function StrategyDetailPage({ slug }: { readonly slug: string }) {
  const item = findStrategy(slug);
  if (!item) {
    return (
      <Section title="找不到策略案例" body="這個 slug 未有納入本地 TradingView 策略資料包。">
        <PrimaryLink href="/strategy-cases">返回策略案例庫</PrimaryLink>
      </Section>
    );
  }
  const canShowCode = Boolean(item.pineScript.code);
  return (
    <div>
      <HeroPanel
        eyebrow={`${statusLabel(item.includeStatus)} · ${item.timeframe}`}
        title={item.shortTitle || item.title}
        body={item.displayCaveat}
        imageKey="tv"
        actions={<PrimaryLink href="/strategy-cases" variant="secondary">返回案例庫</PrimaryLink>}
      />
      <Section title="策略摘要">
        <div className="metric-grid">
          <MetricTile label="PF" value={metricText(item.pfNumeric)} tone={item.pfNumeric ? "warn" : "info"} />
          <MetricTile label="勝率" value={metricText(item.winRate)} tone="info" />
          <MetricTile label="交易數" value={metricText(item.trades)} tone="bad" />
          <MetricTile label="設定完整度" value={`${item.settingsAudit.completenessPercent ?? 0}%`} tone="warn" />
        </div>
      </Section>
      <Section title="TradingView Properties">
        <table className="data-table">
          <tbody>
            <Row label="初始資金" value={item.strategyProperties.initialCapital} />
            <Row label="基礎貨幣" value={item.strategyProperties.baseCurrency} />
            <Row label="下單大小" value={item.strategyProperties.orderSize} />
            <Row label="加倉設定" value={item.strategyProperties.pyramiding} />
            <Row label="手續費" value={item.strategyProperties.commission} />
            <Row label="滑價" value={item.strategyProperties.slippage} />
            <Row label="成交假設" value={item.strategyProperties.fillAssumptions} />
            <Row label="重算設定" value={item.strategyProperties.recalculation} />
          </tbody>
        </table>
      </Section>
      <Section title="Inputs 與參數">
        <div className="grid gap-3">
          {item.inputParameters.map((param) => (
            <Card key={`${param.name}-${param.value}`}>
              <CardHeader>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="info">{param.role}</Badge>
                  <Badge variant={param.status === "blocked-source" ? "bad" : "warn"}>{param.status}</Badge>
                </div>
                <CardTitle>{param.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-6 text-[var(--muted)]">
                <p>
                  <strong className="text-[var(--ink)]">{param.value}</strong>
                </p>
                <p>{param.note}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>
      <Section title="Pine Script 代碼狀態" body={item.scriptAccess.policyNoteZh ?? "未確認原作者源碼授權時，只展示本地教學範本，或者不展示代碼。"}>
        {canShowCode ? (
          <div className="code-panel">
            <pre>
              <code>{item.pineScript.code}</code>
            </pre>
          </div>
        ) : (
          <div className="rounded-[8px] border border-[#f3d7ad] bg-[#fff7ed] p-4 text-sm text-[#9a3412]">{item.pineScript.unavailableReason}</div>
        )}
      </Section>
      <Section title="審核徽章">
        <table className="data-table">
          <tbody>
            {Object.entries(item.rubricBadges).map(([label, value]) => (
              <Row key={label} label={label} value={metricText(value)} />
            ))}
          </tbody>
        </table>
      </Section>
    </div>
  );
}

const rules = [
  { badge: "資料", title: "真實 OHLCV 與標準圖", body: "如果用非標準圖、合成價格，或者無交代 corporate action，最多只可以當初步研究。", tone: "info" },
  { badge: "樣本", title: "交易次數與日期範圍", body: "PF 要連同交易次數、測試期同市況一齊睇。單一短區間好容易過度擬合。", tone: "warn" },
  { badge: "成本", title: "手續費與滑價", body: "短線策略特別要寫清楚 commission、slippage 同 fill assumptions，否則回測會太樂觀。", tone: "bad" },
  { badge: "源碼", title: "原碼授權與署名", body: "開源可見不等於可以任意重製。本站只展示已標記的本地教學範本，或者已確認授權的源碼。", tone: "info" },
] satisfies readonly { readonly badge: string; readonly title: string; readonly body: string; readonly tone: "info" | "warn" | "bad" | "good" }[];

function Row({ label, value }: { readonly label: string; readonly value: string | number | null }) {
  return (
    <tr>
      <th>{label}</th>
      <td>{metricText(value)}</td>
    </tr>
  );
}

function metricText(value: string | number | null): string {
  if (value === null) return "待補";
  if (typeof value === "number") return value.toLocaleString("zh-HK");
  return value;
}

function statusLabel(status: string): string {
  if (status === "accepted") return "已通過";
  if (status === "support-only") return "研究用";
  if (status === "rejected") return "已排除";
  return "待審";
}

function statusTone(status: string): "good" | "warn" | "bad" | "info" {
  if (status === "accepted") return "good";
  if (status === "support-only") return "warn";
  if (status === "rejected") return "bad";
  return "info";
}
