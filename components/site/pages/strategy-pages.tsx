import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeroPanel, MetricTile, PrimaryLink, Section } from "@/components/site/page-shell";
import { StrategyFilter } from "@/components/site/strategy-filter";
import { findStrategy, strategies, strategyStatusCounts, tradingViewData } from "@/lib/site-data";
import {
  evidenceStatusLabel,
  parameterRoleLabel,
  parameterStatusLabel,
  parameterNoteLabel,
  rubricLabel,
  rubricValueLabel,
  sourceCodeStatusLabel,
  strategyDisplayValue,
  strategyCaveat,
  strategyStatusLabel,
  strategyStatusTone,
  unavailableReasonLabel,
} from "@/lib/strategy-copy";

export function StrategyCasesPage() {
  return (
    <div>
      <HeroPanel
        eyebrow="TradingView 策略案例庫"
        title="數字只是起點，證據才是判斷基礎"
        body="盈利因子（PF）、勝率和回撤只屬指定測試的結果。沒有完整參數、交易成本、樣本期和原始碼資料，漂亮數字也不能直接比較。"
        imageKey="tv"
        actions={<PrimaryLink href="/tv-strategies">了解回測審核方法</PrimaryLink>}
      />
      <Section title="案例審核狀態" body={tradingViewData.metricFramingZh}>
        <div className="metric-grid">
          {strategyStatusCounts().map((item) => (
            <MetricTile key={item.name} label={strategyStatusLabel(item.name)} value={item.count} tone={strategyStatusTone(item.name)} />
          ))}
          <MetricTile label="本站 Pine 教學範本" value={tradingViewData.stats.localTemplateCases} tone="warn" />
          <MetricTile label="原始碼不公開" value={tradingViewData.stats.blockedCodeCases} tone="info" />
        </div>
      </Section>
      <Section title="本站策略案例" body="每宗案例只按現有證據分級。來源及授權未核對的內容會清楚標示，不會當作正式結論。">
        <StrategyFilter items={strategies.map((item) => ({
          slug: item.slug,
          title: item.shortTitle || item.title,
          market: item.market,
          symbol: item.symbol,
          timeframe: item.timeframe,
          statusLabel: strategyStatusLabel(item.includeStatus),
          statusTone: strategyStatusTone(item.includeStatus),
          hasCode: Boolean(item.pineScript.code),
          pf: strategyDisplayValue(item.pfNumeric),
          winRate: strategyDisplayValue(item.winRate),
          trades: strategyDisplayValue(item.trades),
          completeness: `${item.settingsAudit.completenessPercent ?? 0}%`,
          caveat: strategyCaveat(item.slug, item.displayCaveat),
          evidenceLabel: evidenceStatusLabel(item.evidenceStatus),
          sourceCodeLabel: sourceCodeStatusLabel(item.scriptAccess.sourceCodeStatus),
          isPending: item.includeStatus === "support-only",
          isExcluded: item.includeStatus === "rejected",
        }))} />
      </Section>
    </div>
  );
}

export function TradingViewTeachingPage() {
  const rawLeadCount = tradingViewData.stats.rawLeadsCollected;
  const caseCount = tradingViewData.stats.totalCases;
  const completedCaseCount = tradingViewData.stats.acceptedCases;
  const pendingCaseCount = tradingViewData.stats.supportOnlyCases;
  const excludedCaseCount = tradingViewData.stats.rejectedCases;
  const missingOosCount = tradingViewData.stats.missingOosCount;

  return (
    <div>
      <HeroPanel
        eyebrow="策略測試報告審核"
        title="盈利因子再高，也不等於可以實盤"
        body="TradingView 的策略測試報告（Strategy Report）可以協助驗證交易構思，但不能只看最亮眼的數字。測試前後都應核對策略屬性（Properties）、輸入參數（Inputs）、交易次數、手續費、滑價及樣本外測試（OOS）。"
        imageKey="tv"
        actions={<PrimaryLink href="/strategy-cases">查看本站案例</PrimaryLink>}
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
      <Section title="為何目前仍屬「待完成核對」" body="本站已整理詳細設定及教學程式範本，但要列作正式案例，仍須取得可重建的策略測試報告、完整交易設定及原始碼授權證明。">
        <table className="data-table">
          <tbody>
            <Row label="已收集原始線索" value={rawLeadCount} />
            <Row label="已整理案例" value={caseCount} />
            <Row label="已完成核對" value={completedCaseCount} />
            <Row label="待完成核對" value={pendingCaseCount} />
            <Row label="不採用" value={excludedCaseCount} />
            <Row label="未有樣本外測試" value={missingOosCount} />
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
        eyebrow={`${strategyStatusLabel(item.includeStatus)} · ${item.timeframe}`}
        title={item.shortTitle || item.title}
        body={strategyCaveat(item.slug, item.displayCaveat)}
        imageKey="tv"
        actions={<PrimaryLink href="/strategy-cases" variant="secondary">返回案例庫</PrimaryLink>}
      />
      <Section title="回測摘要">
        <div className="metric-grid">
          <MetricTile label="盈利因子（PF）" value={strategyDisplayValue(item.pfNumeric)} tone={item.pfNumeric ? "warn" : "info"} />
          <MetricTile label="勝率" value={strategyDisplayValue(item.winRate)} tone="info" />
          <MetricTile label="交易次數" value={strategyDisplayValue(item.trades)} tone="bad" />
          <MetricTile label="設定資料完整度" value={`${item.settingsAudit.completenessPercent ?? 0}%`} tone="warn" />
        </div>
      </Section>
      <Section title="策略屬性設定（Properties）">
        <table className="data-table">
          <tbody>
            <Row label="初始資金" value={item.strategyProperties.initialCapital} />
            <Row label="基礎貨幣" value={item.strategyProperties.baseCurrency} />
            <Row label="下單數量" value={item.strategyProperties.orderSize} />
            <Row label="加倉設定" value={item.strategyProperties.pyramiding} />
            <Row label="手續費" value={item.strategyProperties.commission} />
            <Row label="滑價" value={item.strategyProperties.slippage} />
            <Row label="成交假設" value={item.strategyProperties.fillAssumptions} />
            <Row label="重算設定" value={item.strategyProperties.recalculation} />
          </tbody>
        </table>
      </Section>
      <Section title="輸入參數（Inputs）">
        <div className="grid gap-3">
          {item.inputParameters.map((param) => (
            <Card key={`${param.name}-${param.value}`}>
              <CardHeader>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="info">{parameterRoleLabel(param.role)}</Badge>
                  <Badge variant={param.status === "blocked-source" ? "bad" : "warn"}>{parameterStatusLabel(param.status)}</Badge>
                </div>
                <CardTitle>{param.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-6 text-[var(--muted)]">
                <p>
                  <strong className="text-[var(--ink)]">{strategyDisplayValue(param.value)}</strong>
                </p>
                <p>{parameterNoteLabel(param.note)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>
      <Section title="Pine Script 程式碼狀態" body={item.scriptAccess.policyNoteZh ?? "原作者的程式碼授權尚未確認時，本站只會展示教學重建範本，或不公開程式碼。"}>
        {canShowCode ? (
          <div className="code-panel">
            <pre>
              <code>{item.pineScript.code}</code>
            </pre>
          </div>
        ) : (
          <div className="rounded-[8px] border border-[#f3d7ad] bg-[#fff7ed] p-4 text-sm text-[#9a3412]">{unavailableReasonLabel(item.pineScript.unavailableReason)}</div>
        )}
      </Section>
      <Section title="審核項目">
        <table className="data-table">
          <tbody>
            {Object.entries(item.rubricBadges).map(([label, value]) => (
              <Row key={label} label={rubricLabel(label)} value={rubricValueLabel(value)} />
            ))}
          </tbody>
        </table>
      </Section>
    </div>
  );
}

const rules = [
  { badge: "資料", title: "真實 OHLCV 及標準圖表", body: "如使用非標準圖表或合成價格，又沒有交代除淨、拆股等公司行動，結果最多只可作初步研究。", tone: "info" },
  { badge: "樣本", title: "樣本期與交易次數", body: "盈利因子要連同交易次數、測試期間及當時市況一併閱讀。測試期太短，很容易出現過度擬合。", tone: "warn" },
  { badge: "成本", title: "交易成本與成交假設", body: "短線策略尤其要列明手續費、滑價及成交假設，否則回測結果往往過分樂觀。", tone: "bad" },
  { badge: "原始碼", title: "程式碼授權與署名", body: "公開可見不等於可以任意重製。本站只展示已清楚標示的教學重建範本，或已確認授權的原始程式碼。", tone: "info" },
] satisfies readonly { readonly badge: string; readonly title: string; readonly body: string; readonly tone: "info" | "warn" | "bad" | "good" }[];

function Row({ label, value }: { readonly label: string; readonly value: string | number | null }) {
  return (
    <tr>
      <th>{label}</th>
      <td>{strategyDisplayValue(value)}</td>
    </tr>
  );
}
