import { HomePage } from "@/components/site/pages/home-page";
import { IndicatorDetailPage, IndicatorsPage } from "@/components/site/pages/indicator-pages";
import { SimplePage } from "@/components/site/pages/simple-pages";
import { StrategyCasesPage, StrategyDetailPage, TradingViewTeachingPage } from "@/components/site/pages/strategy-pages";
import type { SiteRoute } from "@/lib/routes";

export function RoutePage({ route }: { readonly route: SiteRoute }) {
  switch (route.kind) {
    case "home":
      return <HomePage />;
    case "indicators":
      return <IndicatorsPage />;
    case "indicator":
      return <IndicatorDetailPage slug={route.slug} />;
    case "strategyCases":
      return <StrategyCasesPage />;
    case "strategyCase":
      return <StrategyDetailPage slug={route.slug} />;
    case "tvStrategies":
      return <TradingViewTeachingPage />;
    case "simple":
      return <SimplePage slug={route.slug} />;
  }
}
