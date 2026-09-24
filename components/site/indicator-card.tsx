import Link from "@/components/site/site-link";
import { ArrowUpRight } from "lucide-react";
import type { IndicatorSummary } from "@/lib/site-data";

export function IndicatorCard({ item }: { readonly item: IndicatorSummary }) {
  return (
    <article className="indicator-card">
      <div className="indicator-card__heading">
        <h3><Link href={`/indicators/${item.siteSlug}`}>{item.nameZh}</Link></h3>
        <ArrowUpRight size={18} aria-hidden="true" />
      </div>
      <p className="indicator-card__english">{item.nameEn} · {item.abbr}</p>
      <p className="indicator-card__summary">{item.summary}</p>
      <div className="indicator-card__footer">
        <span>{item.difficulty}</span>
        <span>{item.category}</span>
        <span className="indicator-card__uses">{item.uses.join(" · ")}</span>
      </div>
    </article>
  );
}
