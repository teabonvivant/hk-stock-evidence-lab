import assert from "node:assert/strict";
import test from "node:test";

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
  assert.match(html, /把技術分析變成一套可覆核的流程/);
  assert.match(html, /本站內容只作教育及研究用途，不構成投資建議/);
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
});

test("server-renders a core indicator as a reproducible learning page", async () => {
  const response = await render("/indicators/rsi");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /核心 20 指標詳解/);
  assert.match(html, /以真實數據計算的教學圖表/);
  assert.match(html, /WilderRMA/);
  assert.match(html, /QQQ 2022 至 2023 修復段/);
  assert.match(html, /常見失效情況/);
  assert.match(html, /參考材料/);
  assert.doesNotMatch(html, /generated-pages\/indicator-detail\.png/);
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
