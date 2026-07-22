import Link from "next/link";
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
  readonly pf: string;
  readonly winRate: string;
  readonly trades: string;
  readonly completeness: string;
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
        <div className="grid grid-cols-2 gap-2 text-sm">
          <Metric label="PF" value={item.pf} />
          <Metric label="勝率" value={item.winRate} />
          <Metric label="交易次數" value={item.trades} />
          <Metric label="資料完整度" value={item.completeness} />
        </div>
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
          查看設定及 Pine Script 範本
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </CardContent>
    </Card>
  );
}

function Metric({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <div className="rounded-[8px] border border-[var(--line)] bg-[var(--surface-soft)] p-3">
      <span className="text-xs font-bold text-[var(--muted)]">{label}</span>
      <strong className="block text-lg text-[var(--ink)]">{value}</strong>
    </div>
  );
}
