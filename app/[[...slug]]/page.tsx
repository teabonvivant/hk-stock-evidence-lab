import type { Metadata } from "next";

import { PageShell } from "@/components/site/page-shell";
import { RoutePage } from "@/components/site/route-page";
import { findIndicator, findStrategy } from "@/lib/site-data";
import { parseRoute, staticRouteParams } from "@/lib/routes";

type RouteParams = { readonly slug?: readonly string[] };
type RoutePageProps = { readonly params: Promise<RouteParams> };

export function generateStaticParams() {
  return staticRouteParams().map((item) => ({ slug: [...item.slug] }));
}

export async function generateMetadata({ params }: RoutePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const route = parseRoute(resolvedParams.slug ?? []);
  switch (route.kind) {
    case "indicator": {
      const item = findIndicator(route.slug);
      return { title: item ? `${item.nameZh}｜技術指標研究室` : "指標｜技術指標研究室" };
    }
    case "strategyCase": {
      const item = findStrategy(route.slug);
      return { title: item ? `${item.shortTitle || item.title}｜策略案例` : "策略案例｜技術指標研究室" };
    }
    default:
      return { title: pageTitle(route.kind) };
  }
}

export default async function Page({ params }: RoutePageProps) {
  const resolvedParams = await params;
  const route = parseRoute(resolvedParams.slug ?? []);
  return (
    <PageShell>
      <RoutePage route={route} />
    </PageShell>
  );
}

function pageTitle(kind: ReturnType<typeof parseRoute>["kind"]): string {
  if (kind === "home") return "技術指標研究室";
  if (kind === "indicators") return "指標庫｜技術指標研究室";
  if (kind === "strategyCases") return "策略案例｜技術指標研究室";
  if (kind === "tvStrategies") return "TradingView 回測教學｜技術指標研究室";
  return "技術指標研究室";
}
