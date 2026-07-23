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

test("server-renders the Hong Kong evidence lab homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>港股技術指標研究｜公式、港股圖表、失效條件與回測證據<\/title>/i);
  assert.match(html, /不只看訊號，更要核對證據/);
  assert.match(html, /港股技術分析研究庫/);
  assert.match(html, /你現在想判斷甚麼？/);
  assert.match(html, /一個結論，如何變成可核對證據？/);
  assert.match(html, /研究狀態公開/);
  assert.match(html, /本站不會做甚麼/);
  assert.match(html, /具名覆核完成前維持研究中/);
  assert.match(html, /href="\/methodology\/data"/);
  assert.match(html, /href="\/trust"/);
  assert.match(html, /href="#main-content"/);
  assert.match(html, /type="application\/ld\+json"/);
  assert.doesNotMatch(html, /generated-pages\/home\.png/);
  assert.doesNotMatch(html, /100 位專家|311 份材料|資料庫概況/);
  assert.doesNotMatch(html, /react-grab|react-scan/);
});

test("server-renders a generated indicator route", async () => {
  const response = await render("/indicators");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /指標百科/);
  assert.match(html, /港股證據研究室/);
  assert.match(html, /搜尋名稱、縮寫或用途/);
  assert.match(html, /只顯示 20 個核心指標/);
  assert.match(html, /<meta name="description" content="瀏覽 82 個技術指標/);
  assert.match(html, /先決定要回答甚麼，再選指標/);
  assert.match(html, /82 個技術指標 · 按用途學習/);
  assert.match(html, /從五個問題開始/);
  assert.match(html, /我想看波動或管理風險/);
  assert.match(html, /我想找區間或關鍵位置/);
  assert.match(html, /搜尋 RSI、保力加通道、成交量、英文縮寫或用途/);
  assert.doesNotMatch(html, /generated-pages\/indicators\.png/);
});

test("server-renders a core indicator as a reproducible learning page", async () => {
  const response = await render("/indicators/rsi");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /<meta name="robots" content="noindex, follow"/);
  assert.match(html, /研究中｜本頁尚未完成全部核對，不應作為交易結論/);
  assert.match(html, /具名作者：尚未公開/);
  assert.match(html, /技術覆核：尚未完成/);
  assert.match(html, /提交可重現資料/);
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

test("glossary heading keeps its key phrase together on narrow screens", async () => {
  const response = await render("/glossary");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /術語不清，<span class="whitespace-nowrap">策略也說不清<\/span>/);
});

test("strategy index leads with evidence instead of interface narration", async () => {
  const response = await render("/strategy-cases");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /回測研究庫/);
  assert.match(html, /來源聲稱，不等於本站結論/);
  assert.match(html, /目前沒有研究通過完整發布閘門/);
  assert.doesNotMatch(html, />PF<\/span>|>勝率<\/span>|>交易次數<\/span>/);
  assert.doesNotMatch(html, /篩選功能只會切換本站案例/);
});

test("server-renders strategy research in reader-facing Chinese", async () => {
  const response = await render("/strategy-cases/supertrend-ai-adaptive-btc");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /<meta name="robots" content="noindex, follow"/);
  assert.match(html, /來源聲稱｜以下數字來自外部來源，本站尚未獨立重現/);
  assert.match(html, /提交可重現資料/);
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

test("publishes the P0 trust and methodology routes", async () => {
  const expected = [
    ["/trust", "每一個結論，都要留下可核對的路徑"],
    ["/about/team", "誰撰寫、誰覆核、誰對數據負責"],
    ["/editorial-policy", "未完成核對的內容，不會包裝成答案"],
    ["/methodology/data", "先交代數據，才討論結果"],
    ["/methodology/backtesting", "回測不是預測；它只是對規則的歷史壓力測試"],
    ["/ai-disclosure", "AI 可以協助整理，不能代替最終覆核"],
    ["/corrections", "錯誤要留下紀錄，不只悄悄改掉"],
    ["/conflicts", "讀者有權知道內容背後的利益關係"],
    ["/risk-disclosure", "技術指標會失效，回測亦會過度樂觀"],
    ["/contact/report-error", "發現錯誤，請提供可重現資料"],
  ];

  for (const [pathname, heading] of expected) {
    const response = await render(pathname);
    assert.equal(response.status, 200, pathname);
    const html = await response.text();
    assert.match(html, new RegExp(heading), pathname);
    assert.match(html, /政策版本|方法版本|研究狀態/, pathname);
    assert.match(html, /提交可重現資料|報告錯誤/, pathname);
  }
});

test("serves crawler policy and an index-safe sitemap", async () => {
  const robotsResponse = await render("/robots.txt");
  assert.equal(robotsResponse.status, 200);
  const robots = await robotsResponse.text();
  assert.match(robots, /User-Agent: OAI-SearchBot[\s\S]*Allow: \//i);
  assert.match(robots, /User-Agent: ChatGPT-User[\s\S]*Allow: \//i);
  assert.match(robots, /User-Agent: GPTBot[\s\S]*Disallow: \//i);

  const sitemapResponse = await render("/sitemap.xml");
  assert.equal(sitemapResponse.status, 200);
  const sitemap = await sitemapResponse.text();
  assert.match(sitemap, /technical-indicators-hk\.teabonvivant\.chatgpt\.site\/trust/);
  assert.doesNotMatch(sitemap, /\/indicators\/rsi/);
  assert.doesNotMatch(sitemap, /\/strategy-cases\/supertrend-ai-adaptive-btc/);
});
