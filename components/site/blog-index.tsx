"use client";
import Link from "@/components/site/site-link";
import { Fragment, useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { ArticleCard } from "@/components/site/article-card";
import type { ArticleSummary } from "@/lib/blog";
import { matchesBlogSearch } from "@/lib/indicator-search";

export function BlogIndex({ items, categories, initialCategory = "全部" }: { items: ArticleSummary[]; categories: { name: string; slug: string; count: number }[]; initialCategory?: string }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQuery(params.get("q") ?? "");
    const requestedPage = Number(params.get("page") ?? 1);
    setPage(Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1);
  }, []);
  const filtered = useMemo(() => items.filter(a => (initialCategory === "全部" || a.category === initialCategory) && matchesBlogSearch(query, [a.title, a.excerpt, a.category])), [items, initialCategory, query]);
  const pages = Math.max(1, Math.ceil(filtered.length / 12));
  const current = Math.min(page, pages);
  const visiblePages = Array.from({ length: pages }, (_, index) => index + 1).filter(number => number === 1 || number === pages || Math.abs(number - current) <= 1);
  const updateUrl = (nextQuery: string, nextPage: number) => {
    const url = new URL(window.location.href);
    if (nextQuery.trim()) url.searchParams.set("q", nextQuery);
    else url.searchParams.delete("q");
    if (nextPage > 1) url.searchParams.set("page", String(nextPage));
    else url.searchParams.delete("page");
    window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
  };
  const goToPage = (number: number) => {
    setPage(number);
    updateUrl(query, number);
    window.requestAnimationFrame(() => {
      const heading = document.getElementById("article-results");
      heading?.scrollIntoView({ block: "start", behavior: "instant" });
      heading?.focus({ preventScroll: true });
    });
  };
  return <div className="blog-browser blog-discovery">
    <div className="blog-controls">
      <label htmlFor="article-search">搜尋文章<input id="article-search" name="q" type="search" autoComplete="off" placeholder="例如：RSI、保歷加通道、倉位、港股…" value={query} onChange={e => { setQuery(e.target.value); setPage(1); updateUrl(e.target.value, 1); }} /></label>
    </div>
    <details className="blog-topic-disclosure">
      <summary>按主題瀏覽</summary>
      <nav className="topic-links" aria-label="文章主題">
        <Link href="/blog" aria-current={initialCategory === "全部" ? "page" : undefined}>全部主題</Link>
        {categories.map(c => <Link key={c.slug} href={`/blog/category/${c.slug}`} aria-current={initialCategory === c.name ? "page" : undefined}>{c.name}<span>{c.count}</span></Link>)}
      </nav>
    </details>
    {query ? <div className="indicator-active-filters" aria-label="已套用搜尋"><button type="button" onClick={() => { setQuery(""); setPage(1); updateUrl("", 1); }}>搜尋：{query}<X size={14} aria-hidden="true" /></button></div> : null}
    <p id="article-results" className="result-count" role="status" aria-live="polite" tabIndex={-1}>{filtered.length} 篇文章{filtered.length > 0 ? ` · 第 ${current} / ${pages} 頁` : ""}</p>
    <div className="article-list">{filtered.slice((current - 1) * 12, current * 12).map(a => <ArticleCard key={a.slug} article={a} />)}</div>
    {filtered.length === 0 ? <div className="empty-state"><h2>沒有符合的文章</h2><p>試試較短的搜尋詞，或展開主題分類。</p><button className="plain-button" onClick={() => { setQuery(""); setPage(1); updateUrl("", 1); }}>清除搜尋</button></div> : null}
    {pages > 1 ? <nav aria-label="文章分頁" className="pagination"><button disabled={current === 1} onClick={() => goToPage(current - 1)}>上一頁</button>{visiblePages.map((number, index) => <Fragment key={number}>{index > 0 && number - (visiblePages[index - 1] ?? number) > 1 ? <span aria-hidden="true">…</span> : null}<button aria-label={`第 ${number} 頁`} aria-current={current === number ? "page" : undefined} onClick={() => goToPage(number)}>{number}</button></Fragment>)}<button disabled={current === pages} onClick={() => goToPage(current + 1)}>下一頁</button></nav> : null}
    <noscript><p>全部文章亦可從<Link href="/sitemap">網站導覽</Link>直接開啟。</p></noscript>
  </div>;
}
