type ResearchComparisonCopy = {
  readonly name_zh: string;
  readonly relation_zh: string;
  readonly difference_zh: string;
};

const verdictLabels: Readonly<Record<string, string>> = {
  優勝: "主要來源",
  並列優勝: "共同主要來源",
  重要補充: "補充來源",
  強力候選: "重點參考",
  參考角色: "延伸參考",
};

export function comparisonVerdictLabel(verdict: string): string {
  return verdictLabels[verdict] ?? verdict;
}

export function comparisonVerdictTone(verdict: string): "good" | "info" {
  return verdict === "優勝" || verdict === "並列優勝" ? "good" : "info";
}

export function comparisonResearchFocus(row: ResearchComparisonCopy): string {
  const generatedPrefix = `${row.name_zh}的角色是「${row.relation_zh}」，重點在`;
  const focus = row.difference_zh.startsWith(generatedPrefix)
    ? row.difference_zh.slice(generatedPrefix.length)
    : row.difference_zh;

  return focus.replace(/[。；\s]+$/u, "");
}
