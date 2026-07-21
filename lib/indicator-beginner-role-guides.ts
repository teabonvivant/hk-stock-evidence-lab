import { contextGuideFactories } from "@/lib/indicator-beginner-context-guides";
import { marketGuideFactories } from "@/lib/indicator-beginner-market-guides";
import type { IndicatorBeginnerGuide, IndicatorGuideRole } from "@/lib/indicator-beginner-types";
import type { Indicator } from "@/lib/site-data";

export function guideForRole(item: Indicator, role: IndicatorGuideRole): IndicatorBeginnerGuide {
  const factory = marketGuideFactories[role] ?? contextGuideFactories[role];
  if (!factory) throw new Error(`Missing beginner guide factory for role: ${role}`);
  return factory(item);
}
