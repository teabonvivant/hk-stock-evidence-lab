"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { StrategyCard } from "@/components/site/strategy-card";
import type { StrategyCase } from "@/lib/site-data";

type Filter = "all" | "support-only" | "rejected" | "code";

const filters: readonly { readonly value: Filter; readonly label: string }[] = [
  { value: "all", label: "全部" },
  { value: "support-only", label: "研究用" },
  { value: "rejected", label: "已排除" },
  { value: "code", label: "有 Pine 範本" },
];

export function StrategyFilter({ items }: { readonly items: readonly StrategyCase[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const visible = useMemo(() => items.filter((item) => matchesFilter(item, filter)), [filter, items]);

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-2" role="group" aria-label="篩選策略案例">
        {filters.map((item) => (
          <Button
            key={item.value}
            type="button"
            variant={filter === item.value ? "default" : "secondary"}
            size="sm"
            aria-pressed={filter === item.value}
            onClick={() => setFilter(item.value)}
          >
            {item.label}
          </Button>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((item) => (
          <StrategyCard key={item.slug} item={item} />
        ))}
      </div>
    </div>
  );
}

function matchesFilter(item: StrategyCase, filter: Filter): boolean {
  switch (filter) {
    case "all":
      return true;
    case "support-only":
      return item.includeStatus === "support-only";
    case "rejected":
      return item.includeStatus === "rejected";
    case "code":
      return Boolean(item.pineScript.code);
  }
}
