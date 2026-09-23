"use client";
import Link from "@/components/site/site-link";
import { useMemo, useState } from "react";
import { ArticleCard } from "@/components/site/article-card";
import type { ArticleSummary } from "@/lib/blog";

export function BlogIndex({ items, categories, initialCategory = "全部" }: { items: ArticleSummary[]; categories: string[]; initialCategory?: string }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [page, setPage] = useState(1);
  const filtered = useMemo(() => items.filter(a => (category === "全部" || a.category === category) && `${a.title} ${a.excerpt} ${a.category}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())), [items, category, query]);
  const pages = Math.max(1, Math.ceil(filtered.length / 12));
  const current = Math.min(page, pages);
  return <div className="blog-browser">
    <div className="blog-controls">
      <label htmlFor="article-search">搜尋文章<input id="article-search" type="search" placeholder="例如：RSI、倉位、重繪、港股…" value={query} onChange={e => { setQuery(e.target.value); setPage(1); }} /></label>
      <label htmlFor="article-category">主題<select id="article-category" value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}><option>全部</option>{categories.map(c => <option key={c}>{c}</option>)}</select></label>
    </div>
    <p className="result-count" role="status">{filtered.length} 篇文章{filtered.length > 0 ? ` · 第 ${current} / ${pages} 頁` : ""}</p>
    <div className="article-list">{filtered.slice((current - 1) * 12, current * 12).map(a => <ArticleCard key={a.slug} article={a} />)}</div>
    {filtered.length === 0 ? <div className="empty-state"><h2>沒有符合的文章</h2><p>試試較短的詞語，或查看全部主題。</p><button className="plain-button" onClick={() => { setQuery(""); setCategory("全部"); setPage(1); }}>清除搜尋條件</button></div> : null}
    {pages > 1 ? <nav aria-label="博客分頁" className="pagination"><button disabled={current === 1} onClick={() => setPage(current - 1)}>上一頁</button>{Array.from({ length: pages }, (_, i) => <button key={i} aria-current={current === i + 1 ? "page" : undefined} onClick={() => setPage(i + 1)}>{i + 1}</button>)}<button disabled={current === pages} onClick={() => setPage(current + 1)}>下一頁</button></nav> : null}
    <noscript><p>全部文章亦可從<Link href="/sitemap">網站導覽</Link>直接開啟。</p></noscript>
  </div>;
}
