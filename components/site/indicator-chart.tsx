import { ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { getIndicatorChartModel } from "@/lib/indicator-chart-model";
import type { ChartReference, ChartSeries, ChartTone, MarketCaseKey } from "@/lib/indicator-chart-model";

const WIDTH = 920;
const LEFT = 58;
const RIGHT = 24;
const TOP = 28;
const PRICE_HEIGHT = 226;
const INDICATOR_TOP = 294;
const INDICATOR_HEIGHT = 132;
const hongKongMonthFormatter = new Intl.DateTimeFormat("zh-HK", {
  year: "numeric",
  month: "short",
  timeZone: "UTC",
});

export function IndicatorTeachingChart({
  slug,
  caseKey,
  chartLead,
}: {
  readonly slug: string;
  readonly caseKey: MarketCaseKey;
  readonly chartLead: string;
}) {
  const model = getIndicatorChartModel(slug, caseKey);
  const priceSeries = model.series.filter((series) => series.axis === "price");
  const indicatorSeries = model.series.filter((series) => series.axis === "indicator");
  const hasIndicator = indicatorSeries.length > 0;
  const height = hasIndicator ? 470 : 320;
  const priceExtent = extent(priceSeries, []);
  const indicatorExtent = extent(indicatorSeries, model.references, model.indicatorDomain);
  const plotWidth = WIDTH - LEFT - RIGHT;
  const lastDate = model.dates.at(-1) ?? "";

  return (
    <figure className="chart-shell">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--line)] px-4 py-3">
        <div>
          <h3 className="font-bold text-[var(--ink)]">{model.symbol} · {model.label}</h3>
          <p className="mt-1 max-w-[72ch] text-sm leading-6 text-[var(--muted)]">{chartLead}</p>
        </div>
        <Badge variant="good">真實歷史日線</Badge>
      </div>
      <div className="chart-scroll" tabIndex={0} aria-label="可橫向捲動查看完整教學圖">
        <svg
          viewBox={`0 0 ${WIDTH} ${height}`}
          className="chart-viewport"
          role="img"
          aria-label={`${model.name} ${model.label}，顯示調整後收市價及相關技術指標。`}
        >
          <title>{`${model.symbol} ${model.label} 指標教學圖`}</title>
          <rect x="0" y="0" width={WIDTH} height={height} rx="8" fill="var(--surface)" />
          <Grid top={TOP} height={PRICE_HEIGHT} width={plotWidth} />
          <AxisLabels extent={priceExtent} top={TOP} height={PRICE_HEIGHT} />
          {priceSeries.map((series) => (
            <SeriesShape key={series.label} series={series} extent={priceExtent} top={TOP} height={PRICE_HEIGHT} count={model.dates.length} />
          ))}
          {hasIndicator ? (
            <>
              <line x1={LEFT} y1={INDICATOR_TOP - 18} x2={WIDTH - RIGHT} y2={INDICATOR_TOP - 18} stroke="var(--line)" />
              <Grid top={INDICATOR_TOP} height={INDICATOR_HEIGHT} width={plotWidth} />
              <AxisLabels extent={indicatorExtent} top={INDICATOR_TOP} height={INDICATOR_HEIGHT} />
              {model.references.map((reference) => (
                <ReferenceLine key={`${reference.label}-${reference.value}`} reference={reference} extent={indicatorExtent} />
              ))}
              {indicatorSeries.map((series) => (
                <SeriesShape key={series.label} series={series} extent={indicatorExtent} top={INDICATOR_TOP} height={INDICATOR_HEIGHT} count={model.dates.length} />
              ))}
            </>
          ) : null}
          <text x={LEFT} y={height - 14} className="chart-axis-label">{formatDate(model.dates[0] ?? "")}</text>
          <text x={WIDTH - RIGHT} y={height - 14} textAnchor="end" className="chart-axis-label">{formatDate(lastDate)}</text>
        </svg>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-[var(--line)] px-4 py-3" aria-label="圖例">
        {model.series.map((series) => (
          <span key={series.label} className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--muted)]">
            <span className="h-0.5 w-5 rounded-full" style={{ background: toneColor(series.tone) }} aria-hidden="true" />
            {series.label}
          </span>
        ))}
      </div>
      <figcaption className="grid gap-2 border-t border-[var(--line)] bg-[var(--surface-soft)] px-4 py-3 text-xs leading-5 text-[var(--muted)] md:grid-cols-[1fr_auto] md:items-center">
        <span>
          {model.provider}，下載於 {formatDate(model.downloadedAt.slice(0, 10))}。價格使用 Adj Close，OHLC 依同日調整比例換算；非即時行情。
        </span>
        <a href={model.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-bold text-[var(--primary-strong)] hover:underline">
          查看資料請求 <ExternalLink className="size-3.5" aria-hidden="true" />
        </a>
      </figcaption>
    </figure>
  );
}

function Grid({ top, height, width }: { readonly top: number; readonly height: number; readonly width: number }) {
  return (
    <g aria-hidden="true">
      {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
        <line key={ratio} x1={LEFT} y1={top + height * ratio} x2={LEFT + width} y2={top + height * ratio} stroke="var(--line)" strokeDasharray="3 5" />
      ))}
    </g>
  );
}

function AxisLabels({ extent: [minimum, maximum], top, height }: { readonly extent: readonly [number, number]; readonly top: number; readonly height: number }) {
  return (
    <g aria-hidden="true">
      <text x={LEFT - 8} y={top + 4} textAnchor="end" className="chart-axis-label">{formatNumber(maximum)}</text>
      <text x={LEFT - 8} y={top + height} textAnchor="end" className="chart-axis-label">{formatNumber(minimum)}</text>
    </g>
  );
}

function ReferenceLine({ reference, extent: domain }: { readonly reference: ChartReference; readonly extent: readonly [number, number] }) {
  const y = yFor(reference.value, domain, INDICATOR_TOP, INDICATOR_HEIGHT);
  return (
    <g aria-hidden="true">
      <line x1={LEFT} y1={y} x2={WIDTH - RIGHT} y2={y} stroke={toneColor(reference.tone)} strokeDasharray="6 5" opacity="0.58" />
      <text x={WIDTH - RIGHT - 4} y={y - 4} textAnchor="end" className="chart-reference-label">{reference.label}</text>
    </g>
  );
}

function SeriesShape({
  series,
  extent: domain,
  top,
  height,
  count,
}: {
  readonly series: ChartSeries;
  readonly extent: readonly [number, number];
  readonly top: number;
  readonly height: number;
  readonly count: number;
}) {
  const color = toneColor(series.tone);
  if (series.style === "bars") {
    const baseline = yFor(Math.max(domain[0], Math.min(0, domain[1])), domain, top, height);
    const barWidth = Math.max(1.5, (WIDTH - LEFT - RIGHT) / Math.max(count, 1) - 1.5);
    return (
      <g aria-hidden="true">
        {series.values.map((value, index) => value === null ? null : (
          <rect key={`${series.label}-${index}`} x={xFor(index, count) - barWidth / 2} y={Math.min(baseline, yFor(value, domain, top, height))} width={barWidth} height={Math.max(1, Math.abs(baseline - yFor(value, domain, top, height)))} fill={color} opacity="0.55" />
        ))}
      </g>
    );
  }
  if (series.style === "dots") {
    return (
      <g aria-hidden="true">
        {series.values.map((value, index) => value === null || index % 2 !== 0 ? null : (
          <circle key={`${series.label}-${index}`} cx={xFor(index, count)} cy={yFor(value, domain, top, height)} r="2.2" fill={color} />
        ))}
      </g>
    );
  }
  return <path d={linePath(series.values, domain, top, height)} fill="none" stroke={color} strokeWidth={series.tone === "price" ? 2.4 : 1.9} strokeLinejoin="round" strokeLinecap="round" aria-hidden="true" />;
}

function extent(series: readonly ChartSeries[], references: readonly ChartReference[], forced?: readonly number[]): readonly [number, number] {
  const values = series.flatMap((item) => item.values.flatMap((value) => value === null ? [] : [value]));
  values.push(...references.map((reference) => reference.value));
  if (series.some((item) => item.style === "bars")) values.push(0);
  if (forced && forced.length >= 2) {
    const minimum = forced[0];
    const maximum = forced[1];
    if (minimum !== undefined && maximum !== undefined) return [minimum, maximum];
  }
  if (values.length === 0) return [0, 1];
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const padding = Math.max((maximum - minimum) * 0.08, Math.abs(maximum) * 0.01, 1);
  return [minimum - padding, maximum + padding];
}

function linePath(values: readonly (number | null)[], domain: readonly [number, number], top: number, height: number): string {
  let drawing = false;
  return values.map((value, index) => {
    if (value === null) {
      drawing = false;
      return "";
    }
    const command = drawing ? "L" : "M";
    drawing = true;
    return `${command}${xFor(index, values.length).toFixed(2)},${yFor(value, domain, top, height).toFixed(2)}`;
  }).join(" ");
}

function xFor(index: number, count: number): number {
  return LEFT + (index / Math.max(count - 1, 1)) * (WIDTH - LEFT - RIGHT);
}

function yFor(value: number, [minimum, maximum]: readonly [number, number], top: number, height: number): number {
  return top + ((maximum - value) / Math.max(maximum - minimum, Number.EPSILON)) * height;
}

function toneColor(tone: ChartTone): string {
  switch (tone) {
    case "price": return "var(--ink)";
    case "primary": return "var(--primary)";
    case "accent": return "var(--accent)";
    case "blue": return "var(--blue)";
    case "danger": return "var(--danger)";
    case "muted": return "var(--muted)";
  }
}

function formatNumber(value: number): string {
  const absolute = Math.abs(value);
  if (absolute >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (absolute >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (absolute >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toFixed(absolute >= 100 ? 0 : 1);
}

function formatDate(value: string): string {
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.valueOf()) ? value : hongKongMonthFormatter.format(date);
}
