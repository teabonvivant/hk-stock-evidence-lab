"use client";

import { RotateCcw, Search } from "lucide-react";
import { useEffect, useMemo, useReducer } from "react";

import { IndicatorCard } from "@/components/site/indicator-card";
import { Button } from "@/components/ui/button";
import { indicatorLearningGoals } from "@/lib/indicator-beginner-guide";
import type { IndicatorLearningGoal } from "@/lib/indicator-beginner-guide";
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
  useEffect(() => { dispatch({ kind: "query", value: new URLSearchParams(window.location.search).get("q") ?? "" }); }, []);
  const goalUses = useMemo(() => new Set(goal?.uses ?? []), [goal]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("zh-HK");
    return [...items]
      .filter((item) => {
        const searchable = [item.nameZh, item.nameEn, item.abbr, item.category, ...item.uses].join(" ").toLocaleLowerCase("zh-HK");
        return (!needle || searchable.includes(needle))
          && (category === "全部分類" || item.category === category)
          && (difficulty === "全部難度" || item.difficulty === difficulty)
          && (!coreOnly || item.core)
          && (goalUses.size === 0 || item.uses.some((use) => goalUses.has(use)));
      })
      .sort((left, right) => compareIndicators(left, right, sort));
  }, [category, coreOnly, difficulty, goalUses, items, query, sort]);

  const hasFilters = Boolean(query) || category !== "全部分類" || difficulty !== "全部難度" || coreOnly || Boolean(goal);
  const reset = () => dispatch({ kind: "reset" });

  return (
    <div className="indicator-browser">
      <fieldset className="mb-5 rounded-[8px] border border-[var(--line)] bg-[var(--surface-soft)] p-4">
        <legend className="px-2 text-sm font-bold text-[var(--ink)]">你想用指標解決甚麼問題？</legend>
        <p className="mb-3 text-sm leading-6 text-[var(--muted)]">先選一個目的，系統只會顯示相關工具。每次先處理一個問題，會比同時堆疊多個指標更容易判讀。</p>
        <div className="flex flex-wrap gap-2">
          {indicatorLearningGoals.map((item) => (
            <Button
              key={item.id}
              type="button"
              size="sm"
              variant={goal?.id === item.id ? "default" : "secondary"}
              aria-pressed={goal?.id === item.id}
              onClick={() => dispatch({ kind: "goal", value: goal?.id === item.id ? undefined : item })}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </fieldset>
      <div className="library-controls">
        <label className="library-field library-search">
          <span>搜尋名稱、縮寫或用途</span>
          <span className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--muted)]" aria-hidden="true" />
            <input value={query} onChange={(event) => dispatch({ kind: "query", value: event.target.value })} placeholder="搜尋 RSI、保力加通道、成交量、英文縮寫或用途" className="library-input pl-10" />
          </span>
        </label>
        <label className="library-field">
          <span>分類</span>
          <select value={category} onChange={(event) => dispatch({ kind: "category", value: event.target.value })} className="library-input">
            <option>全部分類</option>
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="library-field">
          <span>難度</span>
          <select value={difficulty} onChange={(event) => dispatch({ kind: "difficulty", value: event.target.value })} className="library-input">
            <option>全部難度</option>
            <option>入門</option>
            <option>中階</option>
            <option>進階</option>
          </select>
        </label>
        <label className="library-field">
          <span>排序</span>
          <select value={sort} onChange={(event) => dispatch({ kind: "sort", value: event.target.value })} className="library-input">
            <option value="core">核心 20 優先</option>
            <option value="beginner">入門優先</option>
            <option value="name">中文名稱</option>
          </select>
        </label>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <label className="inline-flex min-h-11 cursor-pointer items-center gap-3 rounded-[8px] border border-[var(--line)] bg-[var(--surface-soft)] px-4 text-sm font-semibold text-[var(--ink)]">
          <input type="checkbox" checked={coreOnly} onChange={(event) => dispatch({ kind: "coreOnly", value: event.target.checked })} className="size-4 accent-[var(--primary)]" />
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
          <p>請先清除篩選條件，再按一項用途搜尋，例如判斷方向、確認成交或管理風險。</p>
          <Button type="button" variant="secondary" onClick={reset}><RotateCcw className="size-4" aria-hidden="true" />重設指標庫</Button>
        </div>
      )}
    </div>
  );
}

function libraryReducer(state: LibraryState, action: LibraryAction): LibraryState {
  switch (action.kind) {
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
  if (sort === "core" && left.core !== right.core) return left.core ? -1 : 1;
  return left.nameZh.localeCompare(right.nameZh, "zh-Hant-HK");
}
