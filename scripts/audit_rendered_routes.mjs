import { readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = path.resolve(import.meta.dirname, "..");
const indicatorCatalog = JSON.parse(await readFile(path.join(root, "data", "site", "technical_indicators_site_data.json"), "utf8"));
const strategyCatalog = JSON.parse(await readFile(path.join(root, "data", "site", "tradingview_strategy_cases.json"), "utf8"));

const baseRoutes = [
  "/",
  "/indicators",
  "/strategy-cases",
  "/tv-strategies",
  "/learn",
  "/toolbox",
  "/candlesticks",
  "/compare",
  "/playground",
  "/casebook",
  "/glossary",
  "/subscribe",
  "/journal",
  "/combo",
  "/script",
  "/script-demo",
  "/trial",
];

const routes = [
  ...baseRoutes,
  ...indicatorCatalog.indicators.map((item) => `/indicators/${item.siteSlug}`),
  ...strategyCatalog.cases.map((item) => `/strategy-cases/${item.slug}`),
];

const forbidden = [
  "量能",
  "唔",
  "睇",
  "喺",
  "冇",
  "啲",
  "咁",
  "呢個",
  "仲要",
  "落注",
  "needs_manual_strategy_report",
  "local_template_only",
  "teaching-baseline",
  "在現今快節奏的社會中",
  "隨着時代的發展",
  "值得一提的是",
  "總括而言",
  "讓我們一起探索",
];

const workerUrl = pathToFileURL(path.join(root, "dist", "server", "index.js"));
workerUrl.searchParams.set("copy-audit", `${process.pid}-${Date.now()}`);
const { default: worker } = await import(workerUrl.href);
const failures = [];

for (const route of routes) {
  const response = await worker.fetch(
    new Request(`http://localhost${route}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
  const html = await response.text();
  const hits = forbidden.filter((term) => html.includes(term));
  if (response.status !== 200 || hits.length > 0) failures.push({ route, status: response.status, hits });
}

if (failures.length > 0) {
  console.error(JSON.stringify({ checked: routes.length, failures }, null, 2));
  process.exitCode = 1;
} else {
  console.log(`Checked ${routes.length} rendered routes; no banned public wording found.`);
}
