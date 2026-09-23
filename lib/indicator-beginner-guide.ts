import { guideForRole } from "@/lib/indicator-beginner-role-guides";
import { indicatorRoleBySlug } from "@/lib/indicator-beginner-role-map";
import { plainLanguageBySlug } from "@/lib/indicator-beginner-specific-guides";
import type { IndicatorBeginnerGuide, IndicatorLearningGoal, StarterLesson } from "@/lib/indicator-beginner-types";
import type { Indicator } from "@/lib/site-data";

export type {
  BeginnerFlowStep,
  BeginnerPlainLanguage,
  IndicatorBeginnerGuide,
  IndicatorGuideRole,
  IndicatorLearningGoal,
  StarterLesson,
} from "@/lib/indicator-beginner-types";

export const beginnerStarterLessons: readonly StarterLesson[] = [
  { step: "1", slug: "support-resistance", role: "位置", title: "先找關鍵位置", body: "先分清支持位、阻力位和區間中段，判斷訊號出現於哪個位置。" },
  { step: "2", slug: "volume", role: "成交", title: "再看市場參與程度", body: "用成交量確認突破、跌破或反彈是否得到市場參與。" },
  { step: "3", slug: "ema", role: "方向", title: "判斷大方向", body: "用一條 EMA 看趨勢和節奏，不要同時堆疊多條均線。" },
  { step: "4", slug: "rsi", role: "力度", title: "檢查升跌力度", body: "用 RSI 看力度是否過熱、過弱或背馳，但不要把數字當買賣指令。" },
  { step: "5", slug: "atr", role: "風險", title: "最後量度風險", body: "用 ATR 估算合理止蝕距離，再按可承受虧損調整倉位。" },
];

export const indicatorLearningGoals: readonly IndicatorLearningGoal[] = [
  { id: "direction", label: "我想看方向", uses: ["看趨勢"] },
  { id: "momentum", label: "我想找力度或轉折", uses: ["追蹤強弱", "找轉折"] },
  { id: "volume", label: "我想確認成交", uses: ["確認成交量"] },
  { id: "risk", label: "我想看波動或管理風險", uses: ["管理風險", "觀察波動"] },
  { id: "levels", label: "我想找區間或關鍵位置", uses: ["支持位與阻力位", "判斷盤整"] },
];

export function beginnerGuideFor(item: Indicator): IndicatorBeginnerGuide {
  const role = indicatorRoleBySlug[item.siteSlug];
  if (!role) throw new Error(`Missing beginner role for indicator: ${item.siteSlug}`);
  const roleGuide = guideForRole(item, role);
  const specificGuide = plainLanguageBySlug[item.siteSlug];
  return specificGuide ? { ...roleGuide, ...specificGuide } : roleGuide;
}
