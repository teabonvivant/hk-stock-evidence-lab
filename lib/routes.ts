import { indicators, strategies } from "@/lib/site-data";

export type SiteRoute =
  | { readonly kind: "home" }
  | { readonly kind: "indicators" }
  | { readonly kind: "indicator"; readonly slug: string }
  | { readonly kind: "strategyCases" }
  | { readonly kind: "strategyCase"; readonly slug: string }
  | { readonly kind: "tvStrategies" }
  | { readonly kind: "simple"; readonly slug: SimpleRouteSlug };

export type SimpleRouteSlug =
  | "learn"
  | "toolbox"
  | "candlesticks"
  | "compare"
  | "playground"
  | "casebook"
  | "glossary"
  | "subscribe"
  | "journal"
  | "combo"
  | "script"
  | "script-demo"
  | "trial";

const simpleRoutes: readonly SimpleRouteSlug[] = [
  "learn",
  "toolbox",
  "candlesticks",
  "compare",
  "playground",
  "casebook",
  "glossary",
  "subscribe",
  "journal",
  "combo",
  "script",
  "script-demo",
  "trial",
];

export function parseRoute(parts: readonly string[]): SiteRoute {
  const first = parts[0];
  const second = parts[1];
  if (!first) return { kind: "home" };
  if (first === "indicators" && second) return { kind: "indicator", slug: second };
  if (first === "indicators") return { kind: "indicators" };
  if (first === "strategy-cases" && second) return { kind: "strategyCase", slug: second };
  if (first === "strategy-cases") return { kind: "strategyCases" };
  if (first === "tv-strategies") return { kind: "tvStrategies" };
  if (isSimpleRoute(first)) return { kind: "simple", slug: first };
  return { kind: "simple", slug: "learn" };
}

export function staticRouteParams(): readonly { readonly slug: readonly string[] }[] {
  const base = [
    { slug: [] },
    { slug: ["indicators"] },
    { slug: ["strategy-cases"] },
    { slug: ["tv-strategies"] },
    ...simpleRoutes.map((slug) => ({ slug: [slug] })),
  ];
  const indicatorRoutes = indicators.map((item) => ({ slug: ["indicators", item.siteSlug] }));
  const strategyRoutes = strategies.map((item) => ({ slug: ["strategy-cases", item.slug] }));
  return [...base, ...indicatorRoutes, ...strategyRoutes];
}

function isSimpleRoute(value: string): value is SimpleRouteSlug {
  return simpleRoutes.some((route) => route === value);
}
