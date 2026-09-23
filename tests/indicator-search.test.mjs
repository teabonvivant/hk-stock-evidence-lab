import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { matchesBlogSearch, matchesIndicatorSearch } from "../lib/indicator-search.js";

const bollingerSummary = ["布林帶", "Bollinger Bands", "波動率", "觀察波動", "布林帶以平均線和標準差描述價格波動區間"];

test("indicator search matches the canonical term and common Bollinger aliases without case sensitivity", () => {
  for (const query of ["保歷加通道", "保歷加", "保力加通道", "保力加", "布林帶", "布林通道", "布林", "Bollinger", "BOLL", "BB", "bOlL", "  bOlL "]) {
    assert.equal(matchesIndicatorSearch(query, bollingerSummary), true, `expected alias to match: ${query}`);
  }
});

test("the canonical indicator catalog remains searchable through both localized spellings", async () => {
  const catalog = JSON.parse(await readFile(new URL("../data/site/technical_indicators_site_data.json", import.meta.url), "utf8"));
  const bollinger = catalog.indicators.find((item) => item.siteSlug === "bollinger-bands");
  assert.ok(bollinger);
  const searchable = [bollinger.nameZh, bollinger.nameEn, bollinger.abbr, bollinger.category, bollinger.summary, ...bollinger.uses];
  for (const query of ["保歷加", "保力加", "布林帶", "BOLL", "BB"]) {
    assert.equal(matchesIndicatorSearch(query, searchable), true, `catalog alias did not match: ${query}`);
  }
});

test("indicator search includes summary and purpose while leaving unrelated terms filtered out", () => {
  assert.equal(matchesIndicatorSearch("平均線和標準差", bollingerSummary), true);
  assert.equal(matchesIndicatorSearch("觀察波動", bollingerSummary), true);
  assert.equal(matchesIndicatorSearch("成交量", bollingerSummary), false);
  assert.equal(matchesIndicatorSearch("XYZ", bollingerSummary), false);
  assert.equal(matchesIndicatorSearch("   ", bollingerSummary), true);
});

test("blog search reuses Bollinger aliases for articles that name the canonical English term", () => {
  const articleText = ["Bollinger Bandwidth", "波幅收縮", "闊度把上下軌距離除以中軌"];
  assert.equal(matchesBlogSearch("保歷加通道", articleText), true);
  assert.equal(matchesBlogSearch("bb", articleText), true);
  assert.equal(matchesBlogSearch("RSI", articleText), false);
});
