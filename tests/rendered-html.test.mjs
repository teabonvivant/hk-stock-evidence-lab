import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const indicatorBundle = JSON.parse(
  await readFile(new URL("../data/site/technical_indicators_site_data.json", import.meta.url), "utf8"),
);

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the research lab homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>技術指標研究室<\/title>/i);
  assert.match(html, /技術分析，先看證據是否站得住/);
  assert.match(html, /本站內容只作教育及研究用途，不構成投資建議/);
  assert.doesNotMatch(html, /react-grab|react-scan/);
});

test("server-renders a generated indicator route", async () => {
  const response = await render("/indicators");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /指標庫/);
  assert.match(html, /技術指標研究室/);
  assert.match(html, /搜尋名稱、縮寫或用途/);
  assert.match(html, /只顯示 20 個核心指標/);
  assert.match(html, /<meta name="description" content="瀏覽 82 個技術指標/);
  assert.match(html, /82 個指標，不必逐一背誦/);
  assert.match(html, /從五個問題開始/);
  assert.match(html, /我想看波動或管理風險/);
  assert.match(html, /我想找區間或關鍵位置/);
  assert.match(html, /src="\/generated-pages\/indicators\.png"/);
  assert.doesNotMatch(html, /\/_vinext\/image/);
});

test("server-renders a core indicator as a reproducible learning page", async () => {
  const response = await render("/indicators/rsi");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /核心 20 指標詳解/);
  assert.match(html, /RSI 的判讀重點/);
  assert.match(html, /實際使用流程/);
  assert.match(html, /以真實數據練習圖表判讀/);
  assert.match(html, /WilderRMA/);
  assert.match(html, /QQQ 2022 至 2023 修復段/);
  assert.match(html, /常見失效情況/);
  assert.match(html, /用歷史圖表驗證理解/);
  assert.match(html, /參考材料/);
  assert.doesNotMatch(html, /generated-pages\/indicator-detail\.png/);

  assert.ok(html.indexOf("RSI 的判讀重點") < html.indexOf("以真實數據練習圖表判讀"));
  assert.ok(html.indexOf("以真實數據練習圖表判讀") < html.indexOf("進階：公式與計算口徑"));
});

test("every indicator route teaches a beginner how to use the indicator", async () => {
  assert.equal(indicatorBundle.indicators.length, 82);

  for (const item of indicatorBundle.indicators) {
    const response = await render(`/indicators/${item.siteSlug}`);
    assert.equal(response.status, 200, item.siteSlug);

    const html = await response.text();
    assert.match(html, new RegExp(`${item.abbr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} 的判讀重點`), item.siteSlug);
    assert.match(html, /實際使用流程/, item.siteSlug);
    assert.match(html, /用歷史圖表驗證理解/, item.siteSlug);
    assert.match(html, /進階：公式與計算口徑/, item.siteSlug);
  }
});

test("role-specific pages teach the right decision instead of forcing an entry signal", async () => {
  const cases = [
    ["beta", ["固定基準和期間", "決定持倉風險比重", "不會提供個別交易的入場點"]],
    ["natr", ["固定選股範圍和設定", "排序或找異常值", "篩選結果不等於入場"]],
    ["advance-decline-line", ["對齊指數和成分範圍", "調整整體風險", "不會提供單一股票的入場價"]],
    ["heikin-ashi", ["保留原始價格", "只用真實價格落盤", "轉換圖不會提供真實成交價"]],
    ["psar", ["確認趨勢背景", "預先決定退出規則", "參考線亦不代表正常波動幅度"]],
    ["mass-index", ["尋找波幅隆起", "等待價格選方向", "不是超買超賣指標"]],
    ["zig-zag", ["只讀已完成波段", "最新一段視為暫定", "最後一段和端點會隨新價格改變"]],
    ["bollinger-bands", ["判斷市況和邊界", "等待收市確認", "監察假突破"]],
  ];

  for (const [slug, phrases] of cases) {
    const response = await render(`/indicators/${slug}`);
    assert.equal(response.status, 200, slug);
    const html = await response.text();
    for (const phrase of phrases) assert.match(html, new RegExp(phrase), `${slug}: ${phrase}`);
  }

  const betaHtml = await (await render("/indicators/beta")).text();
  assert.doesNotMatch(betaHtml, /先寫失效及風險/);
});

test("research comparisons read like edited notes, not database templates", async () => {
  const response = await render("/compare");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /主要來源/);
  assert.match(html, /研究重點：/);
  assert.doesNotMatch(html, /的角色是「/);
});

test("strategy index leads with evidence instead of interface narration", async () => {
  const response = await render("/strategy-cases");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /數字只是起點，證據才是判斷基礎/);
  assert.match(html, /每宗案例只按現有證據分級/);
  assert.doesNotMatch(html, /篩選功能只會切換本站案例/);
});

test("server-renders strategy research in reader-facing Chinese", async () => {
  const response = await render("/strategy-cases/supertrend-ai-adaptive-btc");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /待完成核對/);
  assert.match(html, /須人工核對策略測試報告及策略屬性/);
  assert.match(html, /策略屬性設定（Properties）/);
  assert.match(html, /輸入參數（Inputs）/);
  assert.match(html, /10,000 美元（本站教學設定）/);
  assert.match(html, /原作者的程式碼授權尚未確認時/);
  assert.doesNotMatch(html, /needs_manual_strategy_report/);
  assert.doesNotMatch(html, /local_template_only/);
  assert.doesNotMatch(html, /teaching-baseline/);
});
