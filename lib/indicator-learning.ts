import learningBundle from "@/data/site/core_indicator_learning.json";
import type { MarketCaseKey } from "@/lib/indicator-chart-model";

export type CoreIndicatorLearning = (typeof learningBundle.items)[number];

export const coreIndicatorLearning = learningBundle.items;

export function findCoreIndicatorLearning(slug: string): CoreIndicatorLearning | undefined {
  return coreIndicatorLearning.find((item) => item.slug === slug);
}

export function formulaTypeLabel(type: string): string {
  switch (type) {
    case "exact":
      return "可重現公式";
    case "algorithm":
      return "多步算法";
    case "chartMethod":
      return "圖表方法";
    default:
      return "概念摘要";
  }
}

export function parseMarketCaseKey(value: string): MarketCaseKey | undefined {
  switch (value) {
    case "uptrend":
    case "range":
    case "reversal":
    case "breakout":
    case "momentumBreakout":
      return value;
    default:
      return undefined;
  }
}
