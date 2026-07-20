export type NumericSeries = readonly (number | null)[];

function completeWindow(values: NumericSeries, end: number, period: number): readonly number[] | undefined {
  const start = end - period + 1;
  if (start < 0) return undefined;
  const window: number[] = [];
  for (let index = start; index <= end; index += 1) {
    const value = values[index];
    if (value === undefined || value === null || !Number.isFinite(value)) return undefined;
    window.push(value);
  }
  return window;
}

function mean(values: readonly number[]): number {
  return values.reduce((total, value) => total + value, 0) / values.length;
}

export function sma(values: NumericSeries, period: number): NumericSeries {
  return values.map((_, index) => {
    const window = completeWindow(values, index, period);
    return window ? mean(window) : null;
  });
}

function recursiveAverage(values: NumericSeries, period: number, alpha: number): NumericSeries {
  const result: (number | null)[] = Array.from({ length: values.length }, () => null);
  let previous: number | undefined;
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (value === undefined || value === null) continue;
    if (previous === undefined) {
      const seed = completeWindow(values, index, period);
      if (!seed) continue;
      previous = mean(seed);
      result[index] = previous;
      continue;
    }
    previous = alpha * value + (1 - alpha) * previous;
    result[index] = previous;
  }
  return result;
}

export function ema(values: NumericSeries, period: number): NumericSeries {
  return recursiveAverage(values, period, 2 / (period + 1));
}

export function wilder(values: NumericSeries, period: number): NumericSeries {
  return recursiveAverage(values, period, 1 / period);
}

export function rollingHigh(values: NumericSeries, period: number): NumericSeries {
  return values.map((_, index) => {
    const window = completeWindow(values, index, period);
    return window ? Math.max(...window) : null;
  });
}

export function rollingLow(values: NumericSeries, period: number): NumericSeries {
  return values.map((_, index) => {
    const window = completeWindow(values, index, period);
    return window ? Math.min(...window) : null;
  });
}

export function rollingStdDev(values: NumericSeries, period: number): NumericSeries {
  return values.map((_, index) => {
    const window = completeWindow(values, index, period);
    if (!window) return null;
    const average = mean(window);
    const variance = window.reduce((total, value) => total + (value - average) ** 2, 0) / period;
    return Math.sqrt(variance);
  });
}

export function rollingMeanDeviation(values: NumericSeries, period: number): NumericSeries {
  return values.map((_, index) => {
    const window = completeWindow(values, index, period);
    if (!window) return null;
    const average = mean(window);
    return window.reduce((total, value) => total + Math.abs(value - average), 0) / period;
  });
}

export function subtract(left: NumericSeries, right: NumericSeries): NumericSeries {
  return left.map((value, index) => {
    const other = right[index];
    return value === null || other === undefined || other === null ? null : value - other;
  });
}

export function add(left: NumericSeries, right: NumericSeries): NumericSeries {
  return left.map((value, index) => {
    const other = right[index];
    return value === null || other === undefined || other === null ? null : value + other;
  });
}

export function multiply(values: NumericSeries, factor: number): NumericSeries {
  return values.map((value) => (value === null ? null : value * factor));
}

export function divide(left: NumericSeries, right: NumericSeries): NumericSeries {
  return left.map((value, index) => {
    const denominator = right[index];
    return value === null || denominator === undefined || denominator === null || denominator === 0 ? null : value / denominator;
  });
}

export function constantSeries(length: number, value: number): NumericSeries {
  return Array.from({ length }, () => value);
}

export function shiftForward(values: NumericSeries, periods: number): NumericSeries {
  const result: (number | null)[] = Array.from({ length: values.length }, () => null);
  for (let index = 0; index < values.length; index += 1) {
    const target = index + periods;
    const value = values[index];
    if (target < result.length && value !== undefined) result[target] = value;
  }
  return result;
}

export function linearRegression(values: NumericSeries): NumericSeries {
  const points = values.flatMap((value, index) => (value === null ? [] : [{ x: index, y: value }]));
  if (points.length < 2) return values.map(() => null);
  const meanX = points.reduce((total, point) => total + point.x, 0) / points.length;
  const meanY = points.reduce((total, point) => total + point.y, 0) / points.length;
  const numerator = points.reduce((total, point) => total + (point.x - meanX) * (point.y - meanY), 0);
  const denominator = points.reduce((total, point) => total + (point.x - meanX) ** 2, 0);
  const slope = denominator === 0 ? 0 : numerator / denominator;
  const intercept = meanY - slope * meanX;
  return values.map((value, index) => (value === null ? null : intercept + slope * index));
}
