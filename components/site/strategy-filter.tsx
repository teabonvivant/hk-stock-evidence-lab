"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { StrategyCard } from "@/components/site/strategy-card";
import type { StrategyCardItem } from "@/components/site/strategy-card";

type Filter = "all" | "pending" | "excluded" | "code";

const filters: readonly { readonly value: Filter; readonly label: string }[] = [
  { value: "all", label: "全部" },
  { value: "pending", label: "待完成核對" },
  { value: "excluded", label: "不採用" },
  { value: "code", label: "有教學範本" },
];

export function StrategyFilter({ items }: { readonly items: readonly StrategyCardItem[] }) {
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

function matchesFilter(item: StrategyCardItem, filter: Filter): boolean {
  switch (filter) {
    case "all":
      return true;
    case "pending":
      return item.isPending;
    case "excluded":
      return item.isExcluded;
    case "code":
      return item.hasCode;
  }
}
