"use client";

import { RotateCcw, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { IndicatorCard } from "@/components/site/indicator-card";
import { Button } from "@/components/ui/button";
import type { IndicatorSummary } from "@/lib/site-data";

const difficultyOrder = new Map([
  ["入門", 0],
  ["中階", 1],
  ["進階", 2],
]);

export function IndicatorLibrary({
  items,
  categories,
}: {
  readonly items: readonly IndicatorSummary[];
  readonly categories: readonly string[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("全部分類");
  const [difficulty, setDifficulty] = useState("全部難度");
  const [coreOnly, setCoreOnly] = useState(false);
  const [sort, setSort] = useState("core");

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("zh-HK");
    return [...items]
      .filter((item) => {
        const searchable = [item.nameZh, item.nameEn, item.abbr, item.category, ...item.uses].join(" ").toLocaleLowerCase("zh-HK");
        return (!needle || searchable.includes(needle))
          && (category === "全部分類" || item.category === category)
          && (difficulty === "全部難度" || item.difficulty === difficulty)
          && (!coreOnly || item.core);
      })
      .sort((left, right) => compareIndicators(left, right, sort));
  }, [category, coreOnly, difficulty, items, query, sort]);

  const hasFilters = Boolean(query) || category !== "全部分類" || difficulty !== "全部難度" || coreOnly;
  const reset = () => {
    setQuery("");
    setCategory("全部分類");
    setDifficulty("全部難度");
    setCoreOnly(false);
    setSort("core");
  };

  return (
    <div>
      <div className="library-controls">
        <label className="library-field library-search">
          <span>搜尋名稱、縮寫或用途</span>
          <span className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--muted)]" aria-hidden="true" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="例如 RSI、波動、止蝕" className="library-input pl-10" />
          </span>
        </label>
        <label className="library-field">
          <span>分類</span>
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="library-input">
            <option>全部分類</option>
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="library-field">
          <span>難度</span>
          <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)} className="library-input">
            <option>全部難度</option>
            <option>入門</option>
            <option>中階</option>
            <option>進階</option>
          </select>
        </label>
        <label className="library-field">
          <span>排序</span>
          <select value={sort} onChange={(event) => setSort(event.target.value)} className="library-input">
            <option value="core">核心 20 優先</option>
            <option value="beginner">入門優先</option>
            <option value="name">中文名稱</option>
          </select>
        </label>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <label className="inline-flex min-h-11 cursor-pointer items-center gap-3 rounded-[8px] border border-[var(--line)] bg-[var(--surface-soft)] px-4 text-sm font-semibold text-[var(--ink)]">
          <input type="checkbox" checked={coreOnly} onChange={(event) => setCoreOnly(event.target.checked)} className="size-4 accent-[var(--primary)]" />
          只顯示 20 個核心指標
        </label>
        <div className="flex items-center gap-3">
          <p className="text-sm font-semibold text-[var(--muted)]" aria-live="polite">共 {items.length} 個指標，現顯示 {filtered.length} 個</p>
          {hasFilters ? <Button type="button" variant="ghost" size="sm" onClick={reset}><RotateCcw className="size-4" aria-hidden="true" />清除篩選</Button> : null}
        </div>
      </div>
      {filtered.length > 0 ? (
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => <IndicatorCard key={item.siteSlug} item={item} />)}
        </div>
      ) : (
        <div className="empty-state mt-5">
          <strong>找不到相符指標</strong>
          <p>請嘗試縮短關鍵字，或清除分類及難度條件。</p>
          <Button type="button" variant="secondary" onClick={reset}><RotateCcw className="size-4" aria-hidden="true" />重設指標庫</Button>
        </div>
      )}
    </div>
  );
}

function compareIndicators(left: IndicatorSummary, right: IndicatorSummary, sort: string): number {
  if (sort === "beginner") {
    const result = (difficultyOrder.get(left.difficulty) ?? 9) - (difficultyOrder.get(right.difficulty) ?? 9);
    if (result !== 0) return result;
  }
  if (sort === "core" && left.core !== right.core) return left.core ? -1 : 1;
  return left.nameZh.localeCompare(right.nameZh, "zh-Hant-HK");
}
