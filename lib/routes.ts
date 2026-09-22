import { indicators, strategies } from "@/lib/site-data";
import { articles, blogCategories } from "@/lib/blog";
import { notFound } from "next/navigation";
import { isTrustRoute, trustRoutePaths } from "@/lib/trust-content";
import type { TrustRoutePath } from "@/lib/trust-content";

export type SiteRoute =
  | { readonly kind: "home" }
  | { readonly kind: "blog"; readonly categorySlug?: string }
  | { readonly kind: "article"; readonly slug: string }
  | { readonly kind: "indicators" }
  | { readonly kind: "indicator"; readonly slug: string }
  | { readonly kind: "strategyCases" }
  | { readonly kind: "strategyCase"; readonly slug: string }
  | { readonly kind: "tvStrategies" }
  | { readonly kind: "trust"; readonly path: TrustRoutePath }
  | { readonly kind: "simple"; readonly slug: SimpleRouteSlug };

export type SimpleRouteSlug =
  | "sitemap"
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
  "sitemap",
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
  if (first === "blog") {
    if (parts.length === 1) return { kind: "blog" };
    if (second === "category" && parts.length === 3 && blogCategories.some(c => c.slug === parts[2])) return { kind: "blog", categorySlug: parts[2]! };
    if (parts.length === 2 && articles.some(a => a.slug === second)) return { kind: "article", slug: second! };
    return notFound();
  }
  if (parts.length > 2) return notFound();
  if (first === "indicators" && second && !indicators.some(i => i.siteSlug === second)) return notFound();
  if (first === "strategy-cases" && second && !strategies.some(i => i.slug === second)) return notFound();
  if (first === "indicators" && second) return { kind: "indicator", slug: second };
  if (first === "indicators") return { kind: "indicators" };
  if (first === "strategy-cases" && second) return { kind: "strategyCase", slug: second };
  if (first === "strategy-cases") return { kind: "strategyCases" };
  if (first === "tv-strategies" && parts.length === 1) return { kind: "tvStrategies" };
  const joined = parts.join("/");
  if (isTrustRoute(joined)) return { kind: "trust", path: joined };
  if (isSimpleRoute(first) && parts.length === 1) return { kind: "simple", slug: first };
  return notFound();
}

export function staticRouteParams(): readonly { readonly slug: readonly string[] }[] {
  const base = [
    { slug: [] },
    { slug: ["indicators"] },
    { slug: ["strategy-cases"] },
    { slug: ["tv-strategies"] },
    { slug: ["blog"] },
    ...articles.map(a => ({ slug: ["blog", a.slug] })),
    ...blogCategories.map(c => ({ slug: ["blog", "category", c.slug] })),
    ...simpleRoutes.map((slug) => ({ slug: [slug] })),
    ...trustRoutePaths.map((path) => ({ slug: path.split("/") })),
  ];
  const indicatorRoutes = indicators.map((item) => ({ slug: ["indicators", item.siteSlug] }));
  const strategyRoutes = strategies.map((item) => ({ slug: ["strategy-cases", item.slug] }));
  return [...base, ...indicatorRoutes, ...strategyRoutes];
}

function isSimpleRoute(value: string): value is SimpleRouteSlug {
  return simpleRoutes.some((route) => route === value);
}
