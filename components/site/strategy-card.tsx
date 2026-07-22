import Link from "next/link";
import { ArrowRight, Code2, ShieldAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { StrategyCase } from "@/lib/site-data";
import {
  evidenceStatusLabel,
  sourceCodeStatusLabel,
  strategyCaveat,
  strategyDisplayValue,
  strategyStatusLabel,
  strategyStatusTone,
} from "@/lib/strategy-copy";

export function StrategyCard({ item }: { readonly item: StrategyCase }) {
  const tone = strategyStatusTone(item.includeStatus);
  const hasCode = Boolean(item.pineScript.code);
  return (
    <Card className="pressable lift-hover h-full">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={tone}>{strategyStatusLabel(item.includeStatus)}</Badge>
          <Badge variant={hasCode ? "warn" : "info"}>{hasCode ? "本站 Pine 教學範本" : "程式碼不公開"}</Badge>
        </div>
        <CardTitle>{item.shortTitle || item.title}</CardTitle>
        <CardDescription>
          {item.market} · {item.symbol} · {item.timeframe}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <Metric label="PF" value={strategyDisplayValue(item.pfNumeric)} />
          <Metric label="勝率" value={strategyDisplayValue(item.winRate)} />
          <Metric label="交易次數" value={strategyDisplayValue(item.trades)} />
          <Metric label="資料完整度" value={`${item.settingsAudit.completenessPercent ?? 0}%`} />
        </div>
        <p className="text-sm leading-6 text-[var(--muted)]">{strategyCaveat(item.slug, item.displayCaveat)}</p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="default">
            <ShieldAlert className="mr-1 size-3" aria-hidden="true" />
            {evidenceStatusLabel(item.evidenceStatus)}
          </Badge>
          <Badge variant="default">
            <Code2 className="mr-1 size-3" aria-hidden="true" />
            {sourceCodeStatusLabel(item.scriptAccess.sourceCodeStatus)}
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
