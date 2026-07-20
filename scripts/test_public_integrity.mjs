import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const root = new URL("../", import.meta.url);
const appSource = await readFile(new URL("app.js", root), "utf8");
const cssSource = await readFile(new URL("styles.css", root), "utf8");
const p4ValidatorSource = await readFile(new URL("scripts/validate_p4_site_gate.py", root), "utf8");
const bridgeValidatorSource = await readFile(new URL("scripts/validate_site_bridge.py", root), "utf8");

test("public pages distinguish local market snapshots from generated teaching series", () => {
  assert.match(appSource, /function marketSeriesForCase\(/);
  assert.match(appSource, /isSynthetic/);
  assert.match(appSource, /教學用生成序列/);
  assert.match(appSource, /market\.isSynthetic \? "教學序列" : "歷史案例"/);
  assert.match(appSource, /function marketDataStatusLabel\(market\)/);
  assert.match(appSource, /market\.isSynthetic \? "教學用生成序列 · 非市場快照" : "真實歷史資料 · 本地快照"/);
  assert.match(appSource, /hasRealData \? "真實案例" : "教學序列"/);
  assert.match(appSource, /playgroundMarket\.isSynthetic \? "教學序列與指標圖層" : "真實價格折線與指標圖層"/);
  assert.doesNotMatch(appSource, /Yahoo Finance 本地快照/);
});

test("P4 gate recognises the provenance-aware market fallback contract", () => {
  assert.match(p4ValidatorSource, /marketSeriesForCase/);
  assert.doesNotMatch(p4ValidatorSource, /if \(!realCase\) return fallback/);
});

test("site bridge gate recognises the provenance-aware fallback and local education disclaimer", () => {
  assert.match(bridgeValidatorSource, /marketSeriesForCase/);
  assert.match(bridgeValidatorSource, /只作教育研究/);
  assert.doesNotMatch(bridgeValidatorSource, /return generateSeries\(caseName, fallbackCount\)/);
});

test("market breadth and options indicators do not present a single-stock chart as their own data", () => {
  assert.match(appSource, /function teachingChartContext\(/);
  assert.match(appSource, /市場寬度資料/);
  assert.match(appSource, /期權資料/);
});

test("strategy library tells the current review truth in Hong Kong Chinese", () => {
  assert.match(appSource, /<h1 class="tv-strategy-title">策略案例研究庫<\/h1>/);
  assert.match(appSource, /只作輔助研究/);
  assert.doesNotMatch(appSource, /raw leads 已入隊/);
  assert.doesNotMatch(appSource, /先收 \$\{formatCount\(tvStrategyData\.rawLeadTarget\)\} 個 raw leads/);
});

test("formula and material cards disclose their evidence type instead of implying completeness", () => {
  assert.match(appSource, /const formulaDetails = \{/);
  assert.match(appSource, /function renderIndicatorFormula\(/);
  assert.match(appSource, /研究庫材料/);
  assert.match(appSource, /直接引用已接入/);
});

test("public routes and media have clear fallback and mobile-safe contracts", () => {
  assert.match(appSource, /function renderNotFound\(/);
  assert.match(appSource, /loading="eager"/);
  assert.match(appSource, /fetchpriority="high"/);
  assert.match(cssSource, /\.site-data-grid\s*\{\s*grid-template-columns:\s*1fr;/);
  assert.match(cssSource, /\.nav-links\s*\{\s*width:\s*100%;\s*display:\s*grid;/);
});
