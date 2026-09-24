import Link from "@/components/site/site-link";
import { ArrowUpRight } from "lucide-react";
import type { IndicatorSummary } from "@/lib/site-data";

export function IndicatorCard({ item }: { readonly item: IndicatorSummary }) {
  const visibleUses = item.uses.filter((use) => use !== item.nameZh).slice(0, 2);
  return (
    <article className="indicator-card">
      <div className="indicator-card__heading">
        <h3><Link href={`/indicators/${item.siteSlug}`}>{item.nameZh}</Link></h3>
        <ArrowUpRight size={18} aria-hidden="true" />
      </div>
      <p className="indicator-card__english">{item.nameEn}{item.nameEn.toLowerCase() === item.abbr.toLowerCase() ? "" : ` · ${item.abbr}`}</p>
      <p className="indicator-card__summary">{item.summary}</p>
      <div className="indicator-card__footer">
        <span>{item.difficulty}</span>
        <span>{item.category}</span>
        {visibleUses.length > 0 ? <span className="indicator-card__uses">{visibleUses.join(" · ")}</span> : null}
      </div>
    </article>
  );
}
