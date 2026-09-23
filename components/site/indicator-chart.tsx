import { ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { getIndicatorChartModel } from "@/lib/indicator-chart-model";
import type { ChartReference, ChartSeries, ChartTone, MarketCaseKey } from "@/lib/indicator-chart-model";
import "./indicator-chart.css";

type ChartLayout = {
  readonly width: number;
  readonly left: number;
  readonly right: number;
  readonly top: number;
  readonly priceHeight: number;
  readonly indicatorTop: number;
  readonly indicatorHeight: number;
  readonly height: number;
  readonly priceOnlyHeight: number;
};

const DESKTOP_LAYOUT: ChartLayout = {
  width: 920,
  left: 58,
  right: 24,
  top: 38,
  priceHeight: 216,
  indicatorTop: 302,
  indicatorHeight: 128,
  height: 470,
  priceOnlyHeight: 320,
};

const MOBILE_LAYOUT: ChartLayout = {
  width: 360,
  left: 74,
  right: 12,
  top: 38,
  priceHeight: 175,
  indicatorTop: 282,
  indicatorHeight: 126,
  height: 450,
  priceOnlyHeight: 270,
};

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
  const indicatorSeries = model.series.filter((series) => series.axis === "indicator");
  const hasIndicator = indicatorSeries.length > 0;

  return (
    <figure className="chart-shell indicator-chart">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--line)] px-4 py-3">
        <div>
          <h3 className="font-bold text-[var(--ink)]">{model.symbol} · {model.label}</h3>
          <p className="mt-1 max-w-[72ch] text-sm leading-6 text-[var(--muted)]">{chartLead}</p>
        </div>
        <Badge variant="good">真實歷史日線</Badge>
      </div>
      <div className="indicator-chart__desktop chart-scroll">
        <ChartGraphic model={model} slug={slug} layout={DESKTOP_LAYOUT} />
      </div>
      <div className="indicator-chart__mobile">
        <ChartGraphic model={model} slug={slug} layout={MOBILE_LAYOUT} />
      </div>
      <ChartObservations model={model} slug={slug} />
      <div className="indicator-chart__legend" aria-label="圖例">
        {model.series.map((series) => (
          <span key={series.label} className="indicator-chart__legend-item">
            <span className="indicator-chart__legend-swatch" style={{ background: toneColor(series.tone) }} aria-hidden="true" />
            {series.label}
          </span>
        ))}
      </div>
      <figcaption className="indicator-chart__source">
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

function ChartObservations({ model, slug }: { readonly model: ReturnType<typeof getIndicatorChartModel>; readonly slug: string }) {
  const priceSeries = model.series.find((series) => series.axis === "price" && series.label === "調整後收市價");
  const indicatorSeries = model.series.find((series) => series.axis === "indicator");
  const measuredSeries = [priceSeries, indicatorSeries].filter((series): series is ChartSeries => Boolean(series));
  if (!priceSeries || measuredSeries.length === 0 || model.dates.length === 0) return null;

  const firstIndex = model.dates.findIndex((_, index) => measuredSeries.every((series) => series.values[index] != null));
  let lastIndex = -1;
  for (let index = model.dates.length - 1; index >= 0; index -= 1) {
    if (measuredSeries.every((series) => series.values[index] != null)) {
      lastIndex = index;
      break;
    }
  }
  if (firstIndex < 0 || lastIndex < 0) return null;

  const observations = [firstIndex, lastIndex].map((index, position) => ({
    key: position === 0 ? "start" : "end",
    label: position === 0 ? "起點對照" : "終點對照",
    date: model.dates[index] ?? "",
    values: measuredSeries.map((series) => ({
      label: series.label,
      value: series.values[index] ?? 0,
      unit: observationUnit(slug, series.axis, model.market),
    })),
  }));

  return (
    <div className="indicator-chart__observations" aria-label="圖表日期觀察值">
      {observations.map((observation) => (
        <div key={observation.key} className="indicator-chart__observation">
          <span className="indicator-chart__observation-date">{observation.label} · {formatDate(observation.date)}</span>
          <span>{observation.values.map((item) => `${item.label} ${formatObservationValue(item.value)} ${item.unit}`).join("；")}</span>
        </div>
      ))}
    </div>
  );
}

function ChartGraphic({
  model,
  slug,
  layout,
}: {
  readonly model: ReturnType<typeof getIndicatorChartModel>;
  readonly slug: string;
  readonly layout: ChartLayout;
}) {
  const priceSeries = model.series.filter((series) => series.axis === "price");
  const indicatorSeries = model.series.filter((series) => series.axis === "indicator");
  const hasIndicator = indicatorSeries.length > 0;
  const priceExtent = extent(priceSeries, []);
  const indicatorExtent = extent(indicatorSeries, model.references, model.indicatorDomain);
  const plotWidth = layout.width - layout.left - layout.right;
  const plotRight = layout.width - layout.right;
  const priceUnit = pricePanelUnit(model.market);
  const indicatorUnit = indicatorPanelUnit(slug, model.market);
  const firstDate = model.dates[0] ?? "";
  const lastDate = model.dates.at(-1) ?? "";
  const chartHeight = hasIndicator ? layout.height : layout.priceOnlyHeight;
  const accessibleLabel = `${model.name} ${model.label}；${formatDate(firstDate)} 至 ${formatDate(lastDate)}，顯示調整後收市價${hasIndicator ? "及" + indicatorSeries.map((series) => series.label).join("、") : ""}。`;

  return (
    <svg
      viewBox={`0 0 ${layout.width} ${chartHeight}`}
      className="chart-viewport indicator-chart__svg"
      role="img"
      aria-label={accessibleLabel}
    >
      <title>{`${model.symbol} ${model.label} 指標教學圖`}</title>
      <rect x="0" y="0" width={layout.width} height={chartHeight} rx="8" fill="var(--surface)" />
      <text x={layout.left} y="21" className="chart-panel-label">收市價 · {priceUnit}</text>
      <Grid layout={layout} top={layout.top} height={layout.priceHeight} width={plotWidth} />
      <AxisLabels extent={priceExtent} top={layout.top} height={layout.priceHeight} left={layout.left} slug={slug} axis="price" />
      {priceSeries.map((series) => (
        <SeriesShape key={series.label} series={series} extent={priceExtent} top={layout.top} height={layout.priceHeight} count={model.dates.length} layout={layout} />
      ))}
      {hasIndicator ? (
        <>
          <line x1={layout.left} y1={layout.indicatorTop - 23} x2={plotRight} y2={layout.indicatorTop - 23} stroke="var(--line)" />
          <text x={layout.left} y={layout.indicatorTop - 7} className="chart-panel-label">指標 · {indicatorUnit}</text>
          <Grid layout={layout} top={layout.indicatorTop} height={layout.indicatorHeight} width={plotWidth} />
          <AxisLabels extent={indicatorExtent} top={layout.indicatorTop} height={layout.indicatorHeight} left={layout.left} slug={slug} axis="indicator" />
          {model.references.map((reference) => (
            <ReferenceLine key={`${reference.label}-${reference.value}`} reference={reference} extent={indicatorExtent} layout={layout} />
          ))}
          {indicatorSeries.map((series) => (
            <SeriesShape key={series.label} series={series} extent={indicatorExtent} top={layout.indicatorTop} height={layout.indicatorHeight} count={model.dates.length} layout={layout} />
          ))}
        </>
      ) : null}
      <text x={layout.left} y={chartHeight - 11} className="chart-axis-label">{formatDate(firstDate)}</text>
      <text x={plotRight} y={chartHeight - 11} textAnchor="end" className="chart-axis-label">{formatDate(lastDate)}</text>
    </svg>
  );
}

function Grid({ layout, top, height, width }: { readonly layout: ChartLayout; readonly top: number; readonly height: number; readonly width: number }) {
  return (
    <g aria-hidden="true">
      {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
        <line key={ratio} x1={layout.left} y1={top + height * ratio} x2={layout.left + width} y2={top + height * ratio} stroke="var(--line)" strokeDasharray="3 5" />
      ))}
    </g>
  );
}

function AxisLabels({
  extent: [minimum, maximum],
  top,
  height,
  left,
  slug,
  axis,
}: {
  readonly extent: readonly [number, number];
  readonly top: number;
  readonly height: number;
  readonly left: number;
  readonly slug: string;
  readonly axis: "price" | "indicator";
}) {
  return (
    <g aria-hidden="true">
      <text x={left - 8} y={top + 4} textAnchor="end" className="chart-axis-label">{formatAxisValue(maximum, slug, axis)}</text>
      <text x={left - 8} y={top + height} textAnchor="end" className="chart-axis-label">{formatAxisValue(minimum, slug, axis)}</text>
    </g>
  );
}

function ReferenceLine({ reference, extent: domain, layout }: { readonly reference: ChartReference; readonly extent: readonly [number, number]; readonly layout: ChartLayout }) {
  const y = yFor(reference.value, domain, layout.indicatorTop, layout.indicatorHeight);
  return (
    <g aria-hidden="true">
      <line x1={layout.left} y1={y} x2={layout.width - layout.right} y2={y} stroke={toneColor(reference.tone)} strokeDasharray="6 5" opacity="0.58" />
      <text x={layout.width - layout.right - 4} y={y - 4} textAnchor="end" className="chart-reference-label">{reference.label}</text>
    </g>
  );
}

function SeriesShape({
  series,
  extent: domain,
  top,
  height,
  count,
  layout,
}: {
  readonly series: ChartSeries;
  readonly extent: readonly [number, number];
  readonly top: number;
  readonly height: number;
  readonly count: number;
  readonly layout: ChartLayout;
}) {
  const color = toneColor(series.tone);
  if (series.style === "bars") {
    const baseline = yFor(Math.max(domain[0], Math.min(0, domain[1])), domain, top, height);
    const barWidth = Math.max(1.5, (layout.width - layout.left - layout.right) / Math.max(count, 1) - 1.5);
    return (
      <g aria-hidden="true">
        {series.values.map((value, index) => value === null ? null : (
          <rect key={`${series.label}-${index}`} x={xFor(index, count, layout) - barWidth / 2} y={Math.min(baseline, yFor(value, domain, top, height))} width={barWidth} height={Math.max(1, Math.abs(baseline - yFor(value, domain, top, height)))} fill={color} opacity="0.55" />
        ))}
      </g>
    );
  }
  if (series.style === "dots") {
    return (
      <g aria-hidden="true">
        {series.values.map((value, index) => value === null || index % 2 !== 0 ? null : (
          <circle key={`${series.label}-${index}`} cx={xFor(index, count, layout)} cy={yFor(value, domain, top, height)} r="2.2" fill={color} />
        ))}
      </g>
    );
  }
  return <path d={linePath(series.values, domain, top, height, layout)} fill="none" stroke={color} strokeWidth={series.tone === "price" ? 2.4 : 1.9} strokeLinejoin="round" strokeLinecap="round" aria-hidden="true" />;
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

function linePath(values: readonly (number | null)[], domain: readonly [number, number], top: number, height: number, layout: ChartLayout): string {
  let drawing = false;
  return values.map((value, index) => {
    if (value === null) {
      drawing = false;
      return "";
    }
    const command = drawing ? "L" : "M";
    drawing = true;
    return `${command}${xFor(index, values.length, layout).toFixed(2)},${yFor(value, domain, top, height).toFixed(2)}`;
  }).join(" ");
}

function xFor(index: number, count: number, layout: ChartLayout): number {
  return layout.left + (index / Math.max(count - 1, 1)) * (layout.width - layout.left - layout.right);
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

function formatAxisValue(value: number, slug: string, axis: "price" | "indicator"): string {
  if (axis === "indicator" && ["obv", "volume"].includes(slug)) {
    return new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(value / 10_000);
  }
  return formatNumber(value);
}

function formatObservationValue(value: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 4 }).format(value);
}

function formatNumber(value: number): string {
  const absolute = Math.abs(value);
  if (absolute >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (absolute >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (absolute >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toFixed(absolute >= 100 ? 0 : 1);
}

function pricePanelUnit(market: string): string {
  if (market === "HK") return "港元";
  if (market === "US") return "美元";
  return "價格";
}

function indicatorPanelUnit(slug: string, market: string): string {
  if (slug === "obv") return "萬股累積量";
  if (slug === "volume") return "萬股";
  if (["rsi", "adx", "stochastic", "mfi"].includes(slug)) return "刻度（0–100）";
  if (["atr", "macd"].includes(slug)) return `價格單位（${pricePanelUnit(market)}）`;
  if (slug === "cci") return "指標刻度";
  return "指標值";
}

function observationUnit(slug: string, axis: "price" | "indicator", market: string): string {
  if (axis === "price") return pricePanelUnit(market);
  if (["obv", "volume"].includes(slug)) return "股";
  if (["rsi", "adx", "stochastic", "mfi"].includes(slug)) return "刻度";
  if (["atr", "macd"].includes(slug)) return pricePanelUnit(market);
  return "指標值";
}

function formatDate(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return value;
  return `${Number(match[1])}年${Number(match[2])}月${Number(match[3])}日`;
}
