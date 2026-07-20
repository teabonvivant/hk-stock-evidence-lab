import { add, divide, multiply, rollingHigh, rollingLow, shiftForward, subtract, wilder } from "@/lib/indicator-math-basic";
import type { NumericSeries } from "@/lib/indicator-math-basic";
import { atr, trueRange } from "@/lib/indicator-math-oscillators";
import type { PriceBar } from "@/lib/indicator-math-oscillators";

export type DirectionalResult = {
  readonly adx: NumericSeries;
  readonly plusDi: NumericSeries;
  readonly minusDi: NumericSeries;
};

export type IchimokuResult = {
  readonly tenkan: NumericSeries;
  readonly kijun: NumericSeries;
  readonly spanA: NumericSeries;
  readonly spanB: NumericSeries;
};

export function adx(bars: readonly PriceBar[], period: number): DirectionalResult {
  const plusDm: number[] = Array.from({ length: bars.length }, () => 0);
  const minusDm: number[] = Array.from({ length: bars.length }, () => 0);
  for (let index = 1; index < bars.length; index += 1) {
    const bar = bars[index];
    const previous = bars[index - 1];
    if (!bar || !previous) continue;
    const upMove = bar.high - previous.high;
    const downMove = previous.low - bar.low;
    plusDm[index] = upMove > downMove && upMove > 0 ? upMove : 0;
    minusDm[index] = downMove > upMove && downMove > 0 ? downMove : 0;
  }
  const smoothedRange = wilder(trueRange(bars), period);
  const plusDi = multiply(divide(wilder(plusDm, period), smoothedRange), 100);
  const minusDi = multiply(divide(wilder(minusDm, period), smoothedRange), 100);
  const difference = plusDi.map((value, index) => {
    const other = minusDi[index];
    return value === null || other === undefined || other === null ? null : Math.abs(value - other);
  });
  const dx = multiply(divide(difference, add(plusDi, minusDi)), 100);
  return { adx: wilder(dx, period), plusDi, minusDi };
}

export function parabolicSar(bars: readonly PriceBar[], step = 0.02, maximum = 0.2): NumericSeries {
  const result: (number | null)[] = Array.from({ length: bars.length }, () => null);
  const first = bars[0];
  const second = bars[1];
  if (!first || !second) return result;
  let rising = second.close >= first.close;
  let sar = rising ? Math.min(first.low, second.low) : Math.max(first.high, second.high);
  let extreme = rising ? Math.max(first.high, second.high) : Math.min(first.low, second.low);
  let acceleration = step;
  result[1] = sar;
  for (let index = 2; index < bars.length; index += 1) {
    const bar = bars[index];
    const previous = bars[index - 1];
    const prior = bars[index - 2];
    if (!bar || !previous || !prior) continue;
    let next = sar + acceleration * (extreme - sar);
    next = rising ? Math.min(next, previous.low, prior.low) : Math.max(next, previous.high, prior.high);
    if (rising && bar.low < next) {
      rising = false;
      next = extreme;
      extreme = bar.low;
      acceleration = step;
    } else if (!rising && bar.high > next) {
      rising = true;
      next = extreme;
      extreme = bar.high;
      acceleration = step;
    } else if (rising && bar.high > extreme) {
      extreme = bar.high;
      acceleration = Math.min(maximum, acceleration + step);
    } else if (!rising && bar.low < extreme) {
      extreme = bar.low;
      acceleration = Math.min(maximum, acceleration + step);
    }
    sar = next;
    result[index] = sar;
  }
  return result;
}

export function supertrend(bars: readonly PriceBar[], period: number, multiplier: number): NumericSeries {
  const ranges = atr(bars, period);
  const upper: (number | null)[] = Array.from({ length: bars.length }, () => null);
  const lower: (number | null)[] = Array.from({ length: bars.length }, () => null);
  const result: (number | null)[] = Array.from({ length: bars.length }, () => null);
  let rising = true;
  for (let index = 0; index < bars.length; index += 1) {
    const bar = bars[index];
    const range = ranges[index];
    if (!bar || range === undefined || range === null) continue;
    const midpoint = (bar.high + bar.low) / 2;
    const basicUpper = midpoint + multiplier * range;
    const basicLower = midpoint - multiplier * range;
    const previous = bars[index - 1];
    const previousUpper = upper[index - 1];
    const previousLower = lower[index - 1];
    upper[index] = previous && previousUpper !== undefined && previousUpper !== null && previous.close <= previousUpper
      ? Math.min(basicUpper, previousUpper)
      : basicUpper;
    lower[index] = previous && previousLower !== undefined && previousLower !== null && previous.close >= previousLower
      ? Math.max(basicLower, previousLower)
      : basicLower;
    if (previousUpper !== undefined && previousUpper !== null && bar.close > previousUpper) rising = true;
    if (previousLower !== undefined && previousLower !== null && bar.close < previousLower) rising = false;
    result[index] = (rising ? lower[index] : upper[index]) ?? null;
  }
  return result;
}

export function ichimoku(bars: readonly PriceBar[]): IchimokuResult {
  const highs = bars.map((bar) => bar.high);
  const lows = bars.map((bar) => bar.low);
  const midpoint = (period: number): NumericSeries => {
    const high = rollingHigh(highs, period);
    const low = rollingLow(lows, period);
    return high.map((value, index) => {
      const other = low[index];
      return value === null || other === undefined || other === null ? null : (value + other) / 2;
    });
  };
  const tenkan = midpoint(9);
  const kijun = midpoint(26);
  return {
    tenkan,
    kijun,
    spanA: shiftForward(multiply(add(tenkan, kijun), 0.5), 26),
    spanB: shiftForward(midpoint(52), 26),
  };
}

export function anchoredVwap(bars: readonly PriceBar[]): NumericSeries {
  let cumulativeValue = 0;
  let cumulativeVolume = 0;
  return bars.map((bar) => {
    const typical = (bar.high + bar.low + bar.close) / 3;
    cumulativeValue += typical * bar.volume;
    cumulativeVolume += bar.volume;
    return cumulativeVolume === 0 ? null : cumulativeValue / cumulativeVolume;
  });
}

export function classicPivot(bars: readonly PriceBar[]): NumericSeries {
  return bars.map((_, index) => {
    const previous = bars[index - 1];
    return previous ? (previous.high + previous.low + previous.close) / 3 : null;
  });
}
