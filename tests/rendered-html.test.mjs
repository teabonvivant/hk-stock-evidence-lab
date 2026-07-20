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
  assert.match(html, /技術分析，先變成檢查流程/);
  assert.match(html, /只作教育研究，不構成投資建議/);
});

test("server-renders a generated indicator route", async () => {
  const response = await render("/indicators");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /指標庫/);
  assert.match(html, /技術指標研究室/);
  assert.match(html, /搜尋名稱、縮寫或用途/);
  assert.match(html, /只看核心 20 深度頁/);
});

test("server-renders a core indicator as a reproducible learning page", async () => {
  const response = await render("/indicators/rsi");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /核心 20 深度頁/);
  assert.match(html, /真實數據教學圖/);
  assert.match(html, /WilderRMA/);
  assert.match(html, /QQQ 2022 至 2023 修復段/);
  assert.match(html, /典型失效例/);
  assert.match(html, /代表材料/);
  assert.doesNotMatch(html, /generated-pages\/indicator-detail\.png/);
});
