export type ResearchStatus = "reviewed" | "partial" | "research" | "source-claim" | "rejected";

type StatusDescriptor = {
  readonly label: string;
  readonly message: string;
  readonly tone: "good" | "info" | "warn" | "bad";
};

const statusDescriptors: Readonly<Record<ResearchStatus, StatusDescriptor>> = {
  reviewed: {
    label: "已核對",
    message: "已核對｜公式、資料、圖表及文字均已由具名人員完成覆核。",
    tone: "good",
  },
  partial: {
    label: "部分核對",
    message: "部分核對｜部分證據已完成覆核，未完成項目仍不可視作結論。",
    tone: "info",
  },
  research: {
    label: "研究中",
    message: "研究中｜本頁尚未完成全部核對，不應作為交易結論。",
    tone: "warn",
  },
  "source-claim": {
    label: "來源聲稱",
    message: "來源聲稱｜以下數字來自外部來源，本站尚未獨立重現。",
    tone: "warn",
  },
  rejected: {
    label: "不採用",
    message: "不採用｜現有資料未能通過本站發布閘門，只保留作風險教材。",
    tone: "bad",
  },
};

export function researchStatusDescriptor(status: ResearchStatus): StatusDescriptor {
  return statusDescriptors[status];
}
