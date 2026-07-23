import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { researchStatusDescriptor } from "@/lib/research-status";
import type { ResearchStatus } from "@/lib/research-status";

export function ResearchStatusBanner({
  status,
  methodVersion,
  lastReviewed = "尚未完成",
  author = "尚未公開",
  technicalReviewer = "尚未完成",
  dataReviewer = "尚未完成",
}: {
  readonly status: ResearchStatus;
  readonly methodVersion: string;
  readonly lastReviewed?: string;
  readonly author?: string;
  readonly technicalReviewer?: string;
  readonly dataReviewer?: string;
}) {
  const descriptor = researchStatusDescriptor(status);

  return (
    <aside className={`research-status is-${descriptor.tone}`} aria-label={`研究狀態：${descriptor.label}`}>
      <div className="research-status__summary">
        <Badge variant={descriptor.tone}>{descriptor.label}</Badge>
        <strong>{descriptor.message}</strong>
      </div>
      <dl className="research-status__meta">
        <Meta label="方法版本" value={methodVersion} />
        <Meta label="最近覆核" value={lastReviewed} />
        <Meta label="具名作者" value={author} />
        <Meta label="技術覆核" value={technicalReviewer} />
        <Meta label="數據覆核" value={dataReviewer} />
      </dl>
      <Link href="/contact/report-error" className="research-status__report">
        發現公式、資料或圖表問題？提交可重現資料
      </Link>
    </aside>
  );
}

function Meta({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <div aria-label={`${label}：${value}`}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
