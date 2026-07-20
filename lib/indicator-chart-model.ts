import marketBundle from "@/data/market_cases_yahoo.json";
import { constantSeries, ema, linearRegression, rollingHigh, rollingLow, sma } from "@/lib/indicator-math-basic";
import type { NumericSeries } from "@/lib/indicator-math-basic";
import { atr, bollinger, cci, macd, mfi, obv, rsi, stochastic, volumeAverage } from "@/lib/indicator-math-oscillators";
import type { PriceBar } from "@/lib/indicator-math-oscillators";
import { adx, anchoredVwap, classicPivot, ichimoku, parabolicSar, supertrend } from "@/lib/indicator-math-trend";

export type MarketCaseKey = keyof typeof marketBundle.cases;
export type ChartAxis = "price" | "indicator";
export type ChartStyle = "line" | "bars" | "dots";
export type ChartTone = "price" | "primary" | "accent" | "blue" | "danger" | "muted";

export type ChartSeries = {
  readonly label: string;
  readonly values: NumericSeries;
  readonly axis: ChartAxis;
  readonly style: ChartStyle;
  readonly tone: ChartTone;
};

export type ChartReference = {
  readonly label: string;
  readonly value: number;
  readonly axis: ChartAxis;
  readonly tone: ChartTone;
};

export type IndicatorChartModel = {
  readonly symbol: string;
  readonly name: string;
  readonly market: string;
  readonly label: string;
  readonly sourceUrl: string;
  readonly provider: string;
  readonly downloadedAt: string;
  readonly dates: readonly string[];
  readonly series: readonly ChartSeries[];
  readonly references: readonly ChartReference[];
  readonly indicatorDomain?: readonly number[];
};

const DISPLAY_BARS = 110;

export function getIndicatorChartModel(slug: string, caseKey: MarketCaseKey): IndicatorChartModel {
  const marketCase = marketBundle.cases[caseKey];
  const bars = marketCase.bars.map(toAdjustedBar);
  const closes = bars.map((bar) => bar.close);
  const base: ChartSeries[] = [line("調整後收市價", closes, "price", "price")];
  const references: ChartReference[] = [];
  let indicatorDomain: readonly number[] | undefined;

  switch (slug) {
    case "sma":
      base.push(line("SMA 20", sma(closes, 20), "price", "primary"));
      break;
    case "ema":
      base.push(line("EMA 20", ema(closes, 20), "price", "primary"));
      break;
    case "rsi":
      base.push(line("RSI 14", rsi(closes, 14), "indicator", "primary"));
      references.push(reference("70", 70), reference("50", 50, "muted"), reference("30", 30));
      indicatorDomain = [0, 100];
      break;
    case "macd": {
      const result = macd(closes);
      base.push(line("MACD", result.macd, "indicator", "primary"));
      base.push(line("Signal", result.signal, "indicator", "accent"));
      base.push(barsSeries("Histogram", result.histogram, "indicator", "blue"));
      references.push(reference("零軸", 0, "muted"));
      break;
    }
    case "adx": {
      const result = adx(bars, 14);
      base.push(line("ADX 14", result.adx, "indicator", "primary"));
      base.push(line("+DI", result.plusDi, "indicator", "blue"));
      base.push(line("-DI", result.minusDi, "indicator", "danger"));
      references.push(reference("25", 25, "accent"));
      indicatorDomain = [0, 60];
      break;
    }
    case "atr":
      base.push(line("ATR 14", atr(bars, 14), "indicator", "accent"));
      break;
    case "bollinger-bands": {
      const bands = bollinger(closes, 20, 2);
      base.push(line("上軌", bands.upper, "price", "accent"));
      base.push(line("SMA 20", bands.middle, "price", "primary"));
      base.push(line("下軌", bands.lower, "price", "accent"));
      break;
    }
    case "cci":
      base.push(line("CCI 20", cci(bars, 20), "indicator", "primary"));
      references.push(reference("+100", 100, "accent"), reference("0", 0, "muted"), reference("-100", -100, "accent"));
      break;
    case "stochastic": {
      const result = stochastic(bars, 14, 3);
      base.push(line("%K", result.middle, "indicator", "primary"));
      base.push(line("%D", result.upper, "indicator", "accent"));
      references.push(reference("80", 80), reference("20", 20));
      indicatorDomain = [0, 100];
      break;
    }
    case "mfi":
      base.push(line("MFI 14", mfi(bars, 14), "indicator", "primary"));
      references.push(reference("80", 80), reference("50", 50, "muted"), reference("20", 20));
      indicatorDomain = [0, 100];
      break;
    case "obv":
      base.push(line("OBV", obv(bars), "indicator", "primary"));
      break;
    case "volume": {
      const result = volumeAverage(bars, 20);
      base.push(barsSeries("成交量", result.middle, "indicator", "blue"));
      base.push(line("20 日均量", result.upper, "indicator", "accent"));
      break;
    }
    case "vwap":
      base.push(line("Anchored VWAP", anchoredVwap(bars), "price", "primary"));
      break;
    case "ichimoku": {
      const result = ichimoku(bars);
      base.push(line("Tenkan", result.tenkan, "price", "blue"));
      base.push(line("Kijun", result.kijun, "price", "danger"));
      base.push(line("Span A", result.spanA, "price", "primary"));
      base.push(line("Span B", result.spanB, "price", "accent"));
      break;
    }
    case "psar":
      base.push(dots("Parabolic SAR", parabolicSar(bars), "price", "danger"));
      break;
    case "supertrend":
      base.push(line("Supertrend 10,3", supertrend(bars, 10, 3), "price", "primary"));
      break;
    case "fibonacci-retracement": {
      const high = Math.max(...bars.map((bar) => bar.high));
      const low = Math.min(...bars.map((bar) => bar.low));
      const range = high - low;
      base.push(line("38.2%", constantSeries(bars.length, high - range * 0.382), "price", "accent"));
      base.push(line("50%", constantSeries(bars.length, high - range * 0.5), "price", "muted"));
      base.push(line("61.8%", constantSeries(bars.length, high - range * 0.618), "price", "primary"));
      break;
    }
    case "pivot-points":
      base.push(line("前期 Pivot", classicPivot(bars), "price", "accent"));
      break;
    case "support-resistance":
      base.push(line("30 日阻力帶", rollingHigh(closes, 30), "price", "danger"));
      base.push(line("30 日支持帶", rollingLow(closes, 30), "price", "primary"));
      break;
    case "trendline":
      base.push(line("線性回歸趨勢", linearRegression(closes), "price", "primary"));
      break;
    default:
      break;
  }

  const start = Math.max(0, bars.length - DISPLAY_BARS);
  return {
    symbol: marketCase.symbol,
    name: marketCase.name,
    market: marketCase.market,
    label: marketCase.label,
    sourceUrl: marketCase.sourceUrl,
    provider: marketBundle.provider,
    downloadedAt: marketBundle.downloadedAt,
    dates: bars.slice(start).map((bar) => bar.date),
    series: base.map((series) => ({ ...series, values: series.values.slice(start) })),
    references,
    ...(indicatorDomain ? { indicatorDomain } : {}),
  };
}

function toAdjustedBar(bar: (typeof marketBundle.cases)[MarketCaseKey]["bars"][number]): PriceBar {
  const ratio = bar.close === 0 ? 1 : bar.adjClose / bar.close;
  return { date: bar.date, open: bar.open * ratio, high: bar.high * ratio, low: bar.low * ratio, close: bar.adjClose, volume: bar.volume };
}

function line(label: string, values: NumericSeries, axis: ChartAxis, tone: ChartTone): ChartSeries {
  return { label, values, axis, style: "line", tone };
}

function barsSeries(label: string, values: NumericSeries, axis: ChartAxis, tone: ChartTone): ChartSeries {
  return { label, values, axis, style: "bars", tone };
}

function dots(label: string, values: NumericSeries, axis: ChartAxis, tone: ChartTone): ChartSeries {
  return { label, values, axis, style: "dots", tone };
}

function reference(label: string, value: number, tone: ChartTone = "accent"): ChartReference {
  return { label, value, axis: "indicator", tone };
}
