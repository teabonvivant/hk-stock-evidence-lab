"use client";

import { RotateCcw, Search, X } from "lucide-react";
import { useEffect, useMemo, useReducer } from "react";

import { IndicatorCard } from "@/components/site/indicator-card";
import { Button } from "@/components/ui/button";
import { indicatorLearningGoals } from "@/lib/indicator-beginner-guide";
import type { IndicatorLearningGoal } from "@/lib/indicator-beginner-guide";
import { matchesIndicatorSearch } from "@/lib/indicator-search";
import type { IndicatorSummary } from "@/lib/site-data";

const difficultyOrder = new Map([
  ["入門", 0],
  ["中階", 1],
  ["進階", 2],
]);

type LibraryState = {
  readonly query: string;
  readonly category: string;
  readonly difficulty: string;
  readonly coreOnly: boolean;
  readonly sort: string;
  readonly goal: IndicatorLearningGoal | undefined;
};

type LibraryAction =
  | { readonly kind: "hydrate"; readonly value: LibraryState }
  | { readonly kind: "query"; readonly value: string }
  | { readonly kind: "category"; readonly value: string }
  | { readonly kind: "difficulty"; readonly value: string }
  | { readonly kind: "coreOnly"; readonly value: boolean }
  | { readonly kind: "sort"; readonly value: string }
  | { readonly kind: "goal"; readonly value: IndicatorLearningGoal | undefined }
  | { readonly kind: "reset" };

const initialLibraryState: LibraryState = {
  query: "",
  category: "全部分類",
  difficulty: "全部難度",
  coreOnly: false,
  sort: "core",
  goal: undefined,
};

export function IndicatorLibrary({
  items,
  categories,
}: {
  readonly items: readonly IndicatorSummary[];
  readonly categories: readonly string[];
}) {
  const [{ query, category, difficulty, coreOnly, sort, goal }, dispatch] = useReducer(libraryReducer, initialLibraryState);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedCategory = params.get("category") ?? "";
    const requestedDifficulty = params.get("difficulty") ?? "";
    const requestedSort = params.get("sort") ?? "";
    dispatch({ kind: "hydrate", value: {
      query: params.get("q") ?? "",
      category: categories.includes(requestedCategory) ? requestedCategory : "全部分類",
      difficulty: ["入門", "中階", "進階"].includes(requestedDifficulty) ? requestedDifficulty : "全部難度",
      coreOnly: params.get("core") === "1",
      sort: ["core", "beginner", "name"].includes(requestedSort) ? requestedSort : "core",
      goal: indicatorLearningGoals.find(item => item.id === params.get("goal")),
    } });
  }, [categories]);
  const goalUses = useMemo(() => new Set(goal?.uses ?? []), [goal]);

  const filtered = useMemo(() => {
    return [...items]
      .filter((item) => {
        return matchesIndicatorSearch(query, [item.nameZh, item.nameEn, item.abbr, item.category, item.summary, ...item.uses])
          && (category === "全部分類" || item.category === category)
          && (difficulty === "全部難度" || item.difficulty === difficulty)
          && (!coreOnly || item.core)
          && (goalUses.size === 0 || item.uses.some((use) => goalUses.has(use)));
      })
      .sort((left, right) => compareIndicators(left, right, sort));
  }, [category, coreOnly, difficulty, goalUses, items, query, sort]);

  const hasFilters = Boolean(query) || category !== "全部分類" || difficulty !== "全部難度" || coreOnly || Boolean(goal) || sort !== "core";
  const changeFilter = (action: LibraryAction, name: string, value: string | null) => {
    dispatch(action);
    const url = new URL(window.location.href);
    if (value) url.searchParams.set(name, value);
    else url.searchParams.delete(name);
    window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
  };
  const reset = () => {
    dispatch({ kind: "reset" });
    const url = new URL(window.location.href);
    for (const name of ["q", "category", "difficulty", "sort", "core", "goal"]) url.searchParams.delete(name);
    window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
  };

  return (
    <div className="indicator-browser indicator-discovery">
      <label className="library-field library-search indicator-search">
        <span>搜尋指標</span>
        <span className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--muted)]" aria-hidden="true" />
          <input
            name="q"
            type="search"
            autoComplete="off"
            value={query}
            onChange={(event) => changeFilter({ kind: "query", value: event.target.value }, "q", event.target.value)}
            placeholder="搜尋 RSI、保歷加通道、成交量或用途…"
            className="library-input pl-10"
          />
        </span>
      </label>

      <fieldset className="indicator-purpose">
        <legend>按用途快速查找</legend>
        <div className="indicator-purpose-options">
          {indicatorLearningGoals.map((item) => (
            <Button
              key={item.id}
              type="button"
              size="sm"
              variant={goal?.id === item.id ? "default" : "secondary"}
              aria-pressed={goal?.id === item.id}
              onClick={() => changeFilter({ kind: "goal", value: goal?.id === item.id ? undefined : item }, "goal", goal?.id === item.id ? null : item.id)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </fieldset>

      <section className="indicator-results-intro" aria-labelledby="indicator-results-heading">
        <div className="indicator-results-header">
          <h2 id="indicator-results-heading">指標結果</h2>
          <p className="result-count" role="status" aria-live="polite">共 {items.length} 個指標，現顯示 {filtered.length} 個</p>
        </div>
        {hasFilters ? <Button type="button" variant="ghost" size="sm" onClick={reset}><RotateCcw className="size-4" aria-hidden="true" />清除篩選</Button> : null}
      </section>

      {hasFilters ? <div className="indicator-active-filters" aria-label="已套用篩選">
        {query ? <button type="button" onClick={() => changeFilter({ kind: "query", value: "" }, "q", null)}>搜尋：{query}<X size={14} aria-hidden="true" /></button> : null}
        {goal ? <button type="button" onClick={() => changeFilter({ kind: "goal", value: undefined }, "goal", null)}>{goal.label}<X size={14} aria-hidden="true" /></button> : null}
        {category !== "全部分類" ? <button type="button" onClick={() => changeFilter({ kind: "category", value: "全部分類" }, "category", null)}>{category}<X size={14} aria-hidden="true" /></button> : null}
        {difficulty !== "全部難度" ? <button type="button" onClick={() => changeFilter({ kind: "difficulty", value: "全部難度" }, "difficulty", null)}>{difficulty}<X size={14} aria-hidden="true" /></button> : null}
        {coreOnly ? <button type="button" onClick={() => changeFilter({ kind: "coreOnly", value: false }, "core", null)}>核心 20 指標<X size={14} aria-hidden="true" /></button> : null}
        {sort !== "core" ? <button type="button" onClick={() => changeFilter({ kind: "sort", value: "core" }, "sort", null)}>排序：{sort === "beginner" ? "入門優先" : "中文名稱"}<X size={14} aria-hidden="true" /></button> : null}
      </div> : null}

      <details className="indicator-advanced-filters">
        <summary>更多篩選</summary>
        <div className="library-controls">
          <label className="library-field">
            <span>分類</span>
            <select name="category" value={category} onChange={(event) => changeFilter({ kind: "category", value: event.target.value }, "category", event.target.value === "全部分類" ? null : event.target.value)} className="library-input">
              <option>全部分類</option>
              {categories.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="library-field">
            <span>難度</span>
            <select name="difficulty" value={difficulty} onChange={(event) => changeFilter({ kind: "difficulty", value: event.target.value }, "difficulty", event.target.value === "全部難度" ? null : event.target.value)} className="library-input">
              <option>全部難度</option>
              <option>入門</option>
              <option>中階</option>
              <option>進階</option>
            </select>
          </label>
          <label className="library-field">
            <span>排序</span>
            <select name="sort" value={sort} onChange={(event) => changeFilter({ kind: "sort", value: event.target.value }, "sort", event.target.value === "core" ? null : event.target.value)} className="library-input">
              <option value="core">核心 20 優先</option>
              <option value="beginner">入門優先</option>
              <option value="name">中文名稱</option>
            </select>
          </label>
          <label className="indicator-core-filter">
            <input name="core" type="checkbox" checked={coreOnly} onChange={(event) => changeFilter({ kind: "coreOnly", value: event.target.checked }, "core", event.target.checked ? "1" : null)} />
            只顯示 20 個核心指標
          </label>
        </div>
      </details>

      {filtered.length > 0 ? (
        <div id="indicator-results-list" className="indicator-results indicator-result-list">
          {filtered.map((item) => <IndicatorCard key={item.siteSlug} item={item} />)}
        </div>
      ) : (
        <div id="indicator-results-list" className="empty-state indicator-results indicator-empty-state" role="region" aria-labelledby="indicator-results-heading">
          <strong>找不到相符指標</strong>
          <p>請先清除篩選條件，再按一項用途搜尋，例如判斷方向、確認成交或管理風險。</p>
          <Button type="button" variant="secondary" onClick={reset}><RotateCcw className="size-4" aria-hidden="true" />重設指標庫</Button>
        </div>
      )}
    </div>
  );
}

function libraryReducer(state: LibraryState, action: LibraryAction): LibraryState {
  switch (action.kind) {
    case "hydrate":
      return action.value;
    case "query":
      return { ...state, query: action.value };
    case "category":
      return { ...state, category: action.value };
    case "difficulty":
      return { ...state, difficulty: action.value };
    case "coreOnly":
      return { ...state, coreOnly: action.value };
    case "sort":
      return { ...state, sort: action.value };
    case "goal":
      return { ...state, goal: action.value };
    case "reset":
      return initialLibraryState;
    default: {
      const exhaustiveAction: never = action;
      return exhaustiveAction;
    }
  }
}

function compareIndicators(left: IndicatorSummary, right: IndicatorSummary, sort: string): number {
  if (sort === "beginner") {
    const result = (difficultyOrder.get(left.difficulty) ?? 9) - (difficultyOrder.get(right.difficulty) ?? 9);
    if (result !== 0) return result;
  }
  if (sort === "core") {
    if (left.core !== right.core) return left.core ? -1 : 1;
    const difficulty = (difficultyOrder.get(left.difficulty) ?? 9) - (difficultyOrder.get(right.difficulty) ?? 9);
    if (difficulty !== 0) return difficulty;
  }
  return left.nameZh.localeCompare(right.nameZh, "zh-Hant-HK");
}
