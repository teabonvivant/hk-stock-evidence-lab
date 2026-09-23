import Link from "@/components/site/site-link";
import { ArrowRight, Code2, ShieldAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export type StrategyCardItem = {
  readonly slug: string;
  readonly title: string;
  readonly market: string;
  readonly symbol: string;
  readonly timeframe: string;
  readonly statusLabel: string;
  readonly statusTone: "default" | "good" | "info" | "warn" | "bad";
  readonly hasCode: boolean;
  readonly caveat: string;
  readonly evidenceLabel: string;
  readonly sourceCodeLabel: string;
  readonly isPending: boolean;
  readonly isExcluded: boolean;
};

export function StrategyCard({ item }: { readonly item: StrategyCardItem }) {
  return (
    <Card className="pressable lift-hover h-full">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={item.statusTone}>{item.statusLabel}</Badge>
          <Badge variant={item.hasCode ? "warn" : "info"}>{item.hasCode ? "本站 Pine 教學範本" : "程式碼不公開"}</Badge>
        </div>
        <CardTitle>{item.title}</CardTitle>
        <CardDescription>
          {item.market} · {item.symbol} · {item.timeframe}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <strong className="text-sm text-[var(--ink)]">現有證據缺口</strong>
        <p className="text-sm leading-6 text-[var(--muted)]">{item.caveat}</p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="default">
            <ShieldAlert className="mr-1 size-3" aria-hidden="true" />
            {item.evidenceLabel}
          </Badge>
          <Badge variant="default">
            <Code2 className="mr-1 size-3" aria-hidden="true" />
            {item.sourceCodeLabel}
          </Badge>
        </div>
        <Link href={`/strategy-cases/${item.slug}`} className="inline-flex items-center gap-2 text-sm font-bold text-[var(--primary-strong)]">
          查看證據缺口與設定
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </CardContent>
    </Card>
  );
}
