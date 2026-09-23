import Link from "@/components/site/site-link";
import { ArrowUpRight } from "lucide-react";
import type { ArticleSummary } from "@/lib/blog";
import { ArticlePreview } from "@/components/site/article-preview";

export function ArticleCard({ article, heading = "h2" }: { article: ArticleSummary; heading?: "h2" | "h3" }) {
  const Heading = heading;
  return <article className="research-card">
    <Link href={`/blog/${article.slug}`} className="research-card__image" tabIndex={-1} aria-hidden="true">
      <ArticlePreview diagram={article.preview} />
    </Link>
    <div className="research-card__body">
      <Heading><Link href={`/blog/${article.slug}`}>{article.title}</Link></Heading>
      <span className="research-card__category">{article.category}</span>
      <p>{article.excerpt}</p>
      <div className="research-card__footer"><span>{article.minutes} 分鐘閱讀</span><time dateTime={article.date}>{article.date.replaceAll("-", ".")}</time><ArrowUpRight size={17} aria-hidden="true" /></div>
    </div>
  </article>;
}
