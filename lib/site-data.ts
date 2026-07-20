import indicatorBundle from "@/data/site/technical_indicators_site_data.json";
import strategyBundle from "@/data/site/tradingview_strategy_cases.json";

export type Indicator = (typeof indicatorBundle.indicators)[number];
export type IndicatorSummary = Pick<
  Indicator,
  "siteSlug" | "nameZh" | "nameEn" | "abbr" | "category" | "difficulty" | "summary" | "uses" | "core"
>;
export type StrategyCase = (typeof strategyBundle.cases)[number];
export type Comparison = (typeof indicatorBundle.comparisons)[number];
export type ComparisonRow = (typeof indicatorBundle.comparisons)[number]["rows"][number];

export const siteData = indicatorBundle;
export const tradingViewData = strategyBundle;
export const indicators = indicatorBundle.indicators;
export const indicatorSummaries: readonly IndicatorSummary[] = indicators.map((item) => ({
  siteSlug: item.siteSlug,
  nameZh: item.nameZh,
  nameEn: item.nameEn,
  abbr: item.abbr,
  category: item.category,
  difficulty: item.difficulty,
  summary: item.summary,
  uses: item.uses,
  core: item.core,
}));
export const comparisons = indicatorBundle.comparisons;
export const strategies = strategyBundle.cases;

export function findIndicator(slug: string): Indicator | undefined {
  return indicators.find((item) => item.siteSlug === slug);
}

export function findStrategy(slug: string): StrategyCase | undefined {
  return strategies.find((item) => item.slug === slug);
}

export function categoryCounts(): readonly { readonly name: string; readonly count: number }[] {
  const counts = new Map<string, number>();
  for (const item of indicators) {
    counts.set(item.category, (counts.get(item.category) ?? 0) + 1);
  }
  return Array.from(counts, ([name, count]) => ({ name, count })).sort((left, right) => right.count - left.count);
}

export function strategyStatusCounts(): readonly { readonly name: string; readonly count: number }[] {
  const counts = new Map<string, number>();
  for (const item of strategies) {
    counts.set(item.includeStatus, (counts.get(item.includeStatus) ?? 0) + 1);
  }
  return Array.from(counts, ([name, count]) => ({ name, count })).sort((left, right) => right.count - left.count);
}

export function topComparisons(limit: number): readonly Comparison[] {
  return comparisons.slice(0, limit);
}

export function topComparisonRows(limit: number): readonly ComparisonRow[] {
  return comparisons.flatMap((item) => item.rows).slice(0, limit);
}

export function topIndicators(limit: number): readonly Indicator[] {
  return indicators.slice(0, limit);
}

export function strategyCodeCases(): readonly StrategyCase[] {
  return strategies.filter((item) => Boolean(item.pineScript.code));
}
