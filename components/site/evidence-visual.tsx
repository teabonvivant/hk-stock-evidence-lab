export type EvidenceVisualVariant =
  | "home"
  | "indicators"
  | "detail"
  | "compare"
  | "playground"
  | "glossary"
  | "journal"
  | "combo"
  | "subscribe"
  | "tv";

const stages = [
  ["01", "原始數據", "來源、時區、復權"],
  ["02", "公式參數", "版本、預熱期、計算"],
  ["03", "市況分類", "趨勢、橫行、波幅"],
  ["04", "正常與失效", "同時保留反例"],
  ["05", "成本與樣本外", "避免樣本內幻覺"],
  ["06", "具名覆核", "未完成便維持研究中"],
] as const;

const variantLabels: Readonly<Record<EvidenceVisualVariant, string>> = {
  home: "證據流程",
  indicators: "先定問題，再選工具",
  detail: "量度、限制、重現",
  compare: "功能相似，不等於獨立證據",
  playground: "用不同市況壓力測試",
  glossary: "定義一致，才能核對",
  journal: "留下決定與偏差紀錄",
  combo: "每個工具只負責一項工作",
  subscribe: "只報告修訂，不發訊號",
  tv: "回測發布閘門",
};

export function EvidenceVisual({ variant }: { readonly variant: EvidenceVisualVariant }) {
  return (
    <figure className="evidence-visual">
      <figcaption>
        <span>HK STOCK EVIDENCE LEDGER</span>
        <strong>{variantLabels[variant]}</strong>
      </figcaption>
      <ol>
        {stages.map(([number, title, detail]) => (
          <li key={number}>
            <span aria-hidden="true">{number}</span>
            <div>
              <strong>{title}</strong>
              <small>{detail}</small>
            </div>
          </li>
        ))}
      </ol>
      <p>只有完成整條路徑，結果才可升級為已核對。</p>
    </figure>
  );
}
