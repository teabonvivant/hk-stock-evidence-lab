import {
  divide,
  ema,
  multiply,
  rollingHigh,
  rollingLow,
  rollingMeanDeviation,
  rollingStdDev,
  sma,
  subtract,
  wilder,
} from "@/lib/indicator-math-basic";
import type { NumericSeries } from "@/lib/indicator-math-basic";

export type PriceBar = {
  readonly date: string;
  readonly open: number;
  readonly high: number;
  readonly low: number;
  readonly close: number;
  readonly volume: number;
};

export type MacdResult = {
  readonly macd: NumericSeries;
  readonly signal: NumericSeries;
  readonly histogram: NumericSeries;
};

export type BandResult = {
  readonly middle: NumericSeries;
  readonly upper: NumericSeries;
  readonly lower: NumericSeries;
};

export function rsi(closes: NumericSeries, period: number): NumericSeries {
  const gains: (number | null)[] = Array.from({ length: closes.length }, () => null);
  const losses: (number | null)[] = Array.from({ length: closes.length }, () => null);
  for (let index = 1; index < closes.length; index += 1) {
    const current = closes[index];
    const previous = closes[index - 1];
    if (current === undefined || current === null || previous === undefined || previous === null) continue;
    const change = current - previous;
    gains[index] = Math.max(change, 0);
    losses[index] = Math.max(-change, 0);
  }
  const averageGains = wilder(gains, period);
  const averageLosses = wilder(losses, period);
  return averageGains.map((gain, index) => {
    const loss = averageLosses[index];
    if (gain === null || loss === undefined || loss === null) return null;
    if (loss === 0) return 100;
    const strength = gain / loss;
    return 100 - 100 / (1 + strength);
  });
}

export function macd(closes: NumericSeries, fast = 12, slow = 26, signalPeriod = 9): MacdResult {
  const line = subtract(ema(closes, fast), ema(closes, slow));
  const signal = ema(line, signalPeriod);
  return { macd: line, signal, histogram: subtract(line, signal) };
}

export function trueRange(bars: readonly PriceBar[]): NumericSeries {
  return bars.map((bar, index) => {
    const previous = bars[index - 1];
    if (!previous) return bar.high - bar.low;
    return Math.max(bar.high - bar.low, Math.abs(bar.high - previous.close), Math.abs(bar.low - previous.close));
  });
}

export function atr(bars: readonly PriceBar[], period: number): NumericSeries {
  return wilder(trueRange(bars), period);
}

export function bollinger(closes: NumericSeries, period: number, multiplier: number): BandResult {
  const middle = sma(closes, period);
  const distance = multiply(rollingStdDev(closes, period), multiplier);
  return { middle, upper: addNullable(middle, distance), lower: subtract(middle, distance) };
}

export function stochastic(bars: readonly PriceBar[], period: number, smooth: number): BandResult {
  const highs = bars.map((bar) => bar.high);
  const lows = bars.map((bar) => bar.low);
  const closes = bars.map((bar) => bar.close);
  const highest = rollingHigh(highs, period);
  const lowest = rollingLow(lows, period);
  const numerator = subtract(closes, lowest);
  const denominator = subtract(highest, lowest);
  const percentK = multiply(divide(numerator, denominator), 100);
  return { middle: percentK, upper: sma(percentK, smooth), lower: percentK.map(() => null) };
}

export function cci(bars: readonly PriceBar[], period: number): NumericSeries {
  const typical = bars.map((bar) => (bar.high + bar.low + bar.close) / 3);
  const middle = sma(typical, period);
  const deviation = rollingMeanDeviation(typical, period);
  return typical.map((value, index) => {
    const average = middle[index];
    const meanDeviation = deviation[index];
    return average === undefined || average === null || meanDeviation === undefined || meanDeviation === null || meanDeviation === 0
      ? null
      : (value - average) / (0.015 * meanDeviation);
  });
}

export function mfi(bars: readonly PriceBar[], period: number): NumericSeries {
  const typical = bars.map((bar) => (bar.high + bar.low + bar.close) / 3);
  const positive: number[] = Array.from({ length: bars.length }, () => 0);
  const negative: number[] = Array.from({ length: bars.length }, () => 0);
  for (let index = 1; index < bars.length; index += 1) {
    const current = typical[index];
    const previous = typical[index - 1];
    const bar = bars[index];
    if (current === undefined || previous === undefined || !bar) continue;
    const flow = current * bar.volume;
    if (current > previous) positive[index] = flow;
    if (current < previous) negative[index] = flow;
  }
  return bars.map((_, index) => {
    const start = index - period + 1;
    if (start < 0) return null;
    const positiveFlow = positive.slice(start, index + 1).reduce((total, value) => total + value, 0);
    const negativeFlow = negative.slice(start, index + 1).reduce((total, value) => total + value, 0);
    if (negativeFlow === 0) return 100;
    return 100 - 100 / (1 + positiveFlow / negativeFlow);
  });
}

export function obv(bars: readonly PriceBar[]): NumericSeries {
  const result: number[] = Array.from({ length: bars.length }, () => 0);
  for (let index = 1; index < bars.length; index += 1) {
    const bar = bars[index];
    const previousBar = bars[index - 1];
    const previousObv = result[index - 1] ?? 0;
    if (!bar || !previousBar) continue;
    result[index] = bar.close > previousBar.close ? previousObv + bar.volume : bar.close < previousBar.close ? previousObv - bar.volume : previousObv;
  }
  return result;
}

export function volumeAverage(bars: readonly PriceBar[], period: number): BandResult {
  const volume = bars.map((bar) => bar.volume);
  return { middle: volume, upper: sma(volume, period), lower: volume.map(() => null) };
}

function addNullable(left: NumericSeries, right: NumericSeries): NumericSeries {
  return left.map((value, index) => {
    const other = right[index];
    return value === null || other === undefined || other === null ? null : value + other;
  });
}
