import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
const indicatorBundle=JSON.parse(await readFile(new URL("../data/site/technical_indicators_site_data.json",import.meta.url),"utf8"));
const articles=JSON.parse(await readFile(new URL("../data/site/blog-articles.json",import.meta.url),"utf8"));
const {default:worker}=await import("../dist/server/index.js");
async function render(pathname="/"){
 return worker.fetch(new Request("http://localhost"+pathname,{headers:{accept:"text/html"}}),{ASSETS:{fetch:async()=>new Response("Not found",{status:404})}},{waitUntil(){},passThroughOnException(){}});
}
test("homepage exposes complete reading and learning paths",async()=>{
 const r=await render(),html=await r.text();assert.equal(r.status,200);
 for(const term of ["讀懂價格","100 篇研究札記","從觀察走向理解","把基礎放穩",'href="/blog"','href="/sitemap"','href="#main-content"','type="application/ld+json"']) assert.ok(html.includes(term),term);
 assert.doesNotMatch(html,/具名覆核完成前|尚未完成全部核對|react-grab|react-scan|generated-pages\/home\.png/);
});
test("indicator library remains searchable and indexable",async()=>{
 const r=await render("/indicators"),html=await r.text();assert.equal(r.status,200);
 for(const term of ["82 個技術指標","搜尋名稱、縮寫或用途","只顯示 20 個核心指標","我想看波動或管理風險"])assert.ok(html.includes(term),term);
});
test("core indicator aligns its lesson and historical chart",async()=>{
 const r=await render("/indicators/rsi"),html=await r.text();assert.equal(r.status,200);
 assert.match(html,/<meta name="robots" content="index, follow"/);
 for(const term of ["RSI 的判讀重點","圖解與判讀","WilderRMA","QQQ 2022 至 2023 修復段","常見失效情況","參考材料"])assert.ok(html.includes(term),term);
 assert.doesNotMatch(html,/尚未公開|技術覆核：尚未完成|研究中｜/);
 assert.ok(html.indexOf("RSI 的判讀重點")<html.indexOf("圖解與判讀"));
 assert.ok(html.indexOf("圖解與判讀")<html.indexOf("進階：公式與計算口徑"));
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
test("article includes its text, two matching figures and source links",async()=>{
 const a=articles[0],r=await render("/blog/"+a.slug),html=await r.text();assert.equal(r.status,200);
 assert.ok(html.includes(a.title));
 assert.equal([...html.matchAll(/<img\b[^>]+src="\/illustrations\/blog\//g)].length,2);
 assert.ok(html.includes("BlogPosting"));
 for(const s of a.sections) assert.ok(html.includes(s.heading),s.heading);
 for(const s of a.sources) assert.ok(html.includes(s.url.replaceAll("&","&amp;")),s.url);
 assert.ok(html.includes('href="https://technical-indicators-hk.teabonvivant.chatgpt.site/blog/'+a.slug+'"'));
});
test("strategy methods teach conditions without unverified performance claims",async()=>{
 for(const route of ["/strategy-cases","/strategy-cases/supertrend-ai-adaptive-btc"]){
  const r=await render(route),html=await r.text();assert.equal(r.status,200);
  assert.doesNotMatch(html,/待完成核對|來源聲稱｜|needs_manual_strategy_report|local_template_only|teaching-baseline/);
 }
 const html=await(await render("/strategy-cases/supertrend-ai-adaptive-btc")).text();
 for(const term of ["Supertrend","失效","退出","TradingView"])assert.ok(html.includes(term),term);
});
test("public policies contain substantive information and no draft labels",async()=>{
 for(const p of ["trust","about/team","editorial-policy","methodology/data","methodology/backtesting","ai-disclosure","corrections","conflicts","risk-disclosure","contact/report-error","privacy"]){
  const r=await render("/"+p),html=await r.text();assert.equal(r.status,200,p);
  assert.ok(html.includes("2026.09"),p);
  assert.doesNotMatch(html,/具名覆核完成前|作者：尚未公開|技術覆核：尚未完成/);
 }
});
test("unknown and malformed routes return a genuine 404",async()=>{
 for(const route of ["/missing-page","/blog/missing-article","/indicators/missing","/learn/extra","/indicators/rsi/extra","/blog/category/unknown"]){
  const r=await render(route);assert.equal(r.status,404,route);const html=await r.text();assert.match(html,/404|找不到/);
 }
});
test("crawler policy and sitemap expose all completed educational pages",async()=>{
 const robotsR=await render("/robots.txt");assert.equal(robotsR.status,200);const robots=await robotsR.text();
 assert.match(robots,/User-Agent: OAI-SearchBot[\s\S]*Allow: \//i);
 assert.match(robots,/User-Agent: ChatGPT-User[\s\S]*Allow: \//i);
 assert.match(robots,/User-Agent: GPTBot[\s\S]*Disallow: \//i);
 const r=await render("/sitemap.xml");assert.equal(r.status,200);const xml=await r.text();
 for(const route of ["/trust","/indicators/rsi","/strategy-cases/supertrend-ai-adaptive-btc",...articles.map(a=>"/blog/"+a.slug)])assert.ok(xml.includes(route),route);
});
