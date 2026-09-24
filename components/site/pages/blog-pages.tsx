import Link from "@/components/site/site-link";
import { notFound } from "next/navigation";
import { BlogIndex } from "@/components/site/blog-index";
import { ArticleContents } from "@/components/site/article-contents";
import { JsonLd } from "@/components/site/json-ld";
import { articles, articleDate, articleSummary, blogCategories, figurePath, findArticle, readingMinutes } from "@/lib/blog";
import type { BlogArticle } from "@/lib/blog";
import { siteConfig } from "@/lib/site-config";

export function BlogPage({ categorySlug }: { categorySlug?: string }) {
  const category = blogCategories.find(c => c.slug === categorySlug);
  if (categorySlug && !category) notFound();
  const shownArticles = category ? articles.filter(article => article.category === category.name).length : articles.length;
  return <div className="editorial-index">
    <nav className="breadcrumbs" aria-label="頁面路徑"><Link href="/">首頁</Link><span>/</span>{category ? <><Link href="/blog">研究札記</Link><span>/</span><span>{category.name}</span></> : <span>研究札記</span>}</nav>
    <header className="editorial-heading"><h1>{category?.name ?? "研究札記"}</h1><p>{category?.description ?? "在價格的起落之間，練習把問題問得更準。從第一張圖表，到一段可以重現的程式，逐篇讀懂市場、方法與取捨。"}</p><span>{shownArticles} 篇文章 · 每篇附圖解</span></header>
    <BlogIndex key={categorySlug ?? "all"} items={articles.map(articleSummary)} categories={blogCategories.map(c => ({ name: c.name, slug: c.slug, count: articles.filter(a => a.category === c.name).length }))} initialCategory={category?.name ?? "全部"} />
  </div>;
}

function ArticleFigure({ article, index }: { article: BlogArticle; index: number }) {
  const figure = article.figures[index];
  if (!figure) return null;
  return <figure className="article-figure"><a href={figurePath(article, index)} target="_blank" rel="noreferrer" aria-label={`放大圖 ${index + 1}：${figure.title}`}><img src={figurePath(article, index)} width="720" height="640" loading="eager" alt={`${figure.title}。${figure.items.map(i => i.label + "：" + i.detail).join("；")}`} /></a><figcaption><strong>圖 {index + 1} · {figure.title}</strong><p>{figure.caption}</p></figcaption></figure>;
}
export function ArticlePage({ slug }: { slug: string }) {
  const article = findArticle(slug);
  if (!article) notFound();
  const category = blogCategories.find(c => c.name === article.category);
  const related = articles.filter(a => a.category === article.category && a.slug !== slug).sort((a,b) => Math.abs(a.id - article.id) - Math.abs(b.id - article.id)).slice(0,3);
  return <article className="reading-page">
    <JsonLd data={{ "@context": "https://schema.org", "@type": "BlogPosting", headline: article.title, description: article.excerpt, datePublished: articleDate, dateModified: articleDate, inLanguage: "zh-Hant-HK", mainEntityOfPage: `${siteConfig.url}/blog/${slug}`, publisher: { "@type": "Organization", name: siteConfig.name }, image: article.figures.map((_, i) => new URL(figurePath(article, i), siteConfig.url).href) }} />
    <nav className="breadcrumbs" aria-label="頁面路徑"><Link href="/">首頁</Link><span>/</span><Link href="/blog">研究札記</Link><span>/</span><Link href={`/blog/category/${category?.slug ?? "indicators"}`}>{article.category}</Link></nav>
    <header className="reading-header"><h1>{article.title}</h1><p className="article-deck">{article.excerpt}</p><div className="article-meta"><span>{article.category}</span><time dateTime={articleDate}>2026 年 9 月 22 日</time><span>{readingMinutes(article)} 分鐘閱讀</span></div></header>
    <div className="reading-layout"><ArticleContents sections={article.sections.map(s => s.heading)} />
    <div className="article-prose"><p className="article-intro">{article.intro}</p>
      {article.sections.map((s,i) => <div key={s.heading}><section id={`section-${i + 1}`}><h2>{s.heading}</h2>{s.paragraphs.map((p,j) => <p key={j}>{p}</p>)}</section>{i === 0 ? <ArticleFigure article={article} index={0} /> : null}{i === Math.max(2, article.sections.length - 2) ? <ArticleFigure article={article} index={1} /> : null}</div>)}
      <section className="article-sources"><h2>參考資料</h2><ol>{article.sources.map(s => <li key={s.url}><a href={s.url} target="_blank" rel="noreferrer">{s.label} ↗</a></li>)}</ol><p>資料查閱日期：2026 年 9 月 22 日。</p></section>
      <section className="related-reading"><h2>沿着這個問題繼續讀</h2>{related.map(a => <Link key={a.slug} href={`/blog/${a.slug}`}>{a.title}<span>→</span></Link>)}</section>
    </div></div>
  </article>;
}
