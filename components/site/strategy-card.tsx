import Link from "next/link";
import { ArrowRight, Code2, ShieldAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { StrategyCase } from "@/lib/site-data";

export function StrategyCard({ item }: { readonly item: StrategyCase }) {
  const tone = statusTone(item.includeStatus);
  const hasCode = Boolean(item.pineScript.code);
  return (
    <Card className="pressable lift-hover h-full">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={tone}>{statusLabel(item.includeStatus)}</Badge>
          <Badge variant={hasCode ? "warn" : "info"}>{hasCode ? "本地 Pine 範本" : "不展示代碼"}</Badge>
        </div>
        <CardTitle>{item.shortTitle || item.title}</CardTitle>
        <CardDescription>
          {item.market} · {item.symbol} · {item.timeframe}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <Metric label="PF" value={metricText(item.pfNumeric)} />
          <Metric label="勝率" value={metricText(item.winRate)} />
          <Metric label="交易數" value={metricText(item.trades)} />
          <Metric label="設定" value={`${item.settingsAudit.completenessPercent ?? 0}%`} />
        </div>
        <p className="text-sm leading-6 text-[var(--muted)]">{item.displayCaveat}</p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="default">
            <ShieldAlert className="mr-1 size-3" aria-hidden="true" />
            {item.evidenceStatus}
          </Badge>
          <Badge variant="default">
            <Code2 className="mr-1 size-3" aria-hidden="true" />
            {item.scriptAccess.sourceCodeStatus}
          </Badge>
        </div>
        <Link href={`/strategy-cases/${item.slug}`} className="inline-flex items-center gap-2 text-sm font-bold text-[var(--primary-strong)]">
          睇設定同 Pine 範本
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

function metricText(value: string | number | null): string {
  if (value === null) return "待補";
  if (typeof value === "number") return value.toLocaleString("zh-HK");
  return value;
}

function statusLabel(status: string): string {
  if (status === "accepted") return "已通過";
  if (status === "support-only") return "研究用";
  if (status === "rejected") return "已排除";
  return "待審";
}

function statusTone(status: string): "good" | "warn" | "bad" | "info" {
  if (status === "accepted") return "good";
  if (status === "support-only") return "warn";
  if (status === "rejected") return "bad";
  return "info";
}
