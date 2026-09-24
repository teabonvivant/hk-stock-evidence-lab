import Link from "@/components/site/site-link";
import { ArrowUpRight } from "lucide-react";
import type { ArticleSummary } from "@/lib/blog";
import { ArticlePreview } from "@/components/site/article-preview";
import { publicPath } from "@/lib/site-config";

const editorialCovers = new Set(["support-resistance-zones", "rsi-in-strong-trends", "hong-kong-trading-day", "position-size-stop-distance"]);

export function ArticleCard({ article, heading = "h2", featured = false }: { article: ArticleSummary; heading?: "h2" | "h3"; featured?: boolean }) {
  const Heading = heading;
  const hasCover = editorialCovers.has(article.slug);
  return <article className={`research-card${featured ? " research-card--featured" : ""}`}>
    <div className="research-card__body">
      <Heading><Link href={`/blog/${article.slug}`}>{article.title}</Link></Heading>
      <span className="research-card__category">{article.category}</span>
      <p>{article.excerpt}</p>
      <Link href={`/blog/${article.slug}`} className="research-card__image" tabIndex={-1} aria-hidden="true">
        {hasCover ? <span className="article-preview--cover" aria-hidden="true" style={{ backgroundImage: `url("${publicPath(`/illustrations/covers/${article.slug}.svg`)}")` }} /> : null}
        <ArticlePreview diagram={article.preview} />
      </Link>
      <div className="research-card__footer"><span>{article.minutes} 分鐘閱讀</span><time dateTime={article.date}>刊登日期 {article.date.replaceAll("-", ".")}</time><ArrowUpRight size={17} aria-hidden="true" /></div>
    </div>
  </article>;
}
