import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { IndicatorSummary } from "@/lib/site-data";

export function IndicatorCard({ item }: { readonly item: IndicatorSummary }) {
  return (
    <Card className="pressable lift-hover h-full">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={item.core ? "good" : "default"}>{item.difficulty}</Badge>
          <Badge variant="info">{item.category}</Badge>
        </div>
        <CardTitle>{item.nameZh}</CardTitle>
        <CardDescription>
          {item.nameEn} · {item.abbr}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <p className="text-sm leading-6 text-[var(--muted)]">{item.summary}</p>
        <div className="flex flex-wrap gap-2">
          {item.uses.map((use) => (
            <Badge key={use}>{use}</Badge>
          ))}
        </div>
        <Link href={`/indicators/${item.siteSlug}`} className="inline-flex items-center gap-2 text-sm font-bold text-[var(--primary-strong)]">
          學會實際用法
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </CardContent>
    </Card>
  );
}
