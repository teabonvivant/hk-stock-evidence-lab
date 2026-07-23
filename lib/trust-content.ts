export const trustRoutePaths = [
  "trust",
  "about/team",
  "editorial-policy",
  "methodology/data",
  "methodology/backtesting",
  "ai-disclosure",
  "corrections",
  "conflicts",
  "risk-disclosure",
  "contact/report-error",
] as const;

export type TrustRoutePath = (typeof trustRoutePaths)[number];

export type TrustSection = {
  readonly title: string;
  readonly body: string;
  readonly points: readonly string[];
};

export type TrustContent = {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly directAnswer: string;
  readonly versionLabel: "政策版本" | "方法版本" | "研究狀態";
  readonly version: string;
  readonly indexable: boolean;
  readonly sections: readonly TrustSection[];
  readonly related: readonly TrustRoutePath[];
};

const contents: Readonly<Record<TrustRoutePath, TrustContent>> = {
  trust: {
    eyebrow: "信任中心",
    title: "每一個結論，都要留下可核對的路徑",
    description: "集中交代本站的作者責任、編輯規則、數據與回測方法、AI 使用、修訂及風險界線。",
    directAnswer: "本站仍未公開具名作者與覆核人，因此研究條目不會標示為已核對；這個限制會在頁面開首與搜尋設定中如實反映。",
    versionLabel: "政策版本",
    version: "信任框架 v1.0（草擬）",
    indexable: true,
    sections: [
      { title: "讀者如何判斷一頁是否可信？", body: "先查看研究狀態，再追查資料、公式、圖表、失效條件與責任人。", points: ["缺少具名覆核便維持研究中", "外部績效只標示為來源聲稱", "錯誤與修訂要留下可見紀錄"] },
      { title: "目前最大的公開缺口是甚麼？", body: "本站尚未建立可公開核實的具名編輯、技術覆核與數據覆核名單。", points: ["不會用虛構姓名補位", "不會把 AI 列作覆核人", "完成責任架構前，研究詳情頁維持 noindex"] },
    ],
    related: ["about/team", "editorial-policy", "methodology/data", "methodology/backtesting", "ai-disclosure", "corrections", "conflicts", "risk-disclosure", "contact/report-error"],
  },
  "about/team": {
    eyebrow: "團隊與責任",
    title: "誰撰寫、誰覆核、誰對數據負責",
    description: "公開內容責任與目前未完成的具名角色。",
    directAnswer: "目前沒有可公開核實的具名作者、技術覆核人或數據覆核人；因此任何研究頁都不會聲稱已完成人手覆核。",
    versionLabel: "研究狀態",
    version: "責任名單待建立",
    indexable: false,
    sections: [
      { title: "目前有哪些具名角色？", body: "暫時沒有。這是發布限制，不是可由品牌名或 AI 代替的欄位。", points: ["具名作者：尚未公開", "技術覆核：尚未完成", "數據覆核：尚未完成"] },
      { title: "日後如何更新？", body: "只有在身分、職責及同意公開均可核實後，才會加入姓名與相關經驗。", points: ["每頁保留作者與覆核欄位", "角色變更要記錄日期", "利益關係要另行披露"] },
    ],
    related: ["trust", "conflicts", "corrections"],
  },
  "editorial-policy": {
    eyebrow: "編輯政策",
    title: "未完成核對的內容，不會包裝成答案",
    description: "說明研究狀態、引用、語言與發布閘門。",
    directAnswer: "內容必須分清事實、計算、外部聲稱與編輯判斷；缺少重現資料或具名覆核時，只可作研究筆記。",
    versionLabel: "政策版本",
    version: "編輯政策 v1.0（草擬）",
    indexable: true,
    sections: [
      { title: "一頁何時可以發布？", body: "教育頁可在限制清楚時發布；研究結論必須額外通過資料、方法、失效測試及具名覆核。", points: ["第一屏顯示研究狀態", "引用連到原始或權威來源", "結論旁列出適用範圍與反例"] },
      { title: "哪些寫法不會採用？", body: "不使用保證式、催促式或把相關性寫成因果的語言。", points: ["不寫必升或必跌", "不以異常績效作標題賣點", "不把指標訊號等同完整交易決定"] },
    ],
    related: ["trust", "ai-disclosure", "corrections"],
  },
  "methodology/data": {
    eyebrow: "數據方法",
    title: "先交代數據，才討論結果",
    description: "列明行情來源、時區、復權、版本與重現欄位。",
    directAnswer: "每張圖表與計算都應有機器可讀的數據清單；缺少來源、期間、復權、公式版本或校驗碼時，不可視作可重現證據。",
    versionLabel: "方法版本",
    version: "數據方法 v1.0（草擬）",
    indexable: true,
    sections: [
      { title: "數據清單必須記錄甚麼？", body: "最少包括證券、交易所、香港時區、週期、期間、復權、公司行動、供應商與取得時間。", points: ["時區固定記錄為 Asia/Hong_Kong", "公式與圖表各自保留版本", "檔案以校驗碼辨認內容"] },
      { title: "資料不足時怎樣處理？", body: "不以不相符的價圖、模擬資料或截圖填補證據空位。", points: ["頁面顯示資料要求", "結論降級為研究中", "具備來源後重新計算而非手動補數"] },
    ],
    related: ["trust", "methodology/backtesting", "contact/report-error"],
  },
  "methodology/backtesting": {
    eyebrow: "回測方法",
    title: "回測不是預測；它只是對規則的歷史壓力測試",
    description: "交代回測設定、成本、偏誤與發布閘門。",
    directAnswer: "回測結果只屬指定資料與設定；沒有完整參數、成本、交易樣本、樣本外測試及可重建程式碼，數字只可視作來源聲稱。",
    versionLabel: "方法版本",
    version: "回測方法 v1.0（草擬）",
    indexable: true,
    sections: [
      { title: "完整發布閘門包括甚麼？", body: "資料、規則、參數、成本、成交假設、樣本期與程式版本都要可重現。", points: ["測試期與交易次數一併閱讀", "加入保守手續費與滑價", "保留樣本外及失效結果"] },
      { title: "如何處理外部策略頁？", body: "先記錄原頁聲稱，再逐項核對；未重現前不作跨策略排名。", points: ["原始碼授權與績效證據分開", "非標準圖表要以標準 OHLC 重跑", "修正前後結果不可混用"] },
    ],
    related: ["trust", "methodology/data", "risk-disclosure"],
  },
  "ai-disclosure": {
    eyebrow: "AI 使用披露",
    title: "AI 可以協助整理，不能代替最終覆核",
    description: "說明 AI 可做與不可做的工作。",
    directAnswer: "AI 可協助分類、初稿、格式與測試，但不得自行成為來源、作者、技術覆核人、數據覆核人或法律意見提供者。",
    versionLabel: "政策版本",
    version: "AI 披露 v1.0（草擬）",
    indexable: true,
    sections: [
      { title: "AI 可以協助甚麼？", body: "可協助整理既有材料、找出缺欄、生成測試及統一格式。", points: ["輸出仍要追溯至來源", "計算需以程式或資料重現", "重要改動要由具名人員批准"] },
      { title: "AI 不可以代替甚麼？", body: "不可以代替事實核查、專業判斷、投資決定或合資格法律審閱。", points: ["不虛構引用與資歷", "不把流暢文字當準確證據", "發現不確定性時必須公開標示"] },
    ],
    related: ["trust", "editorial-policy", "about/team"],
  },
  corrections: {
    eyebrow: "修訂政策",
    title: "錯誤要留下紀錄，不只悄悄改掉",
    description: "說明錯誤分級、修訂與版本保留。",
    directAnswer: "影響公式、圖表、結論或風險理解的錯誤，修正後要留下日期、範圍、舊版影響與重新驗證狀態。",
    versionLabel: "政策版本",
    version: "修訂政策 v1.0（草擬）",
    indexable: true,
    sections: [
      { title: "哪些改動要留下紀錄？", body: "數據、公式、參數、圖表、結論、來源或責任人有實質變動，都應加入修訂紀錄。", points: ["小型排字修正可不另列", "會改變理解的錯誤要置頂說明", "受影響衍生頁要一併重新檢查"] },
      { title: "讀者如何報告錯誤？", body: "提供網址、問題位置、預期結果、重現步驟與可核對來源。", points: ["不要求提供交易帳戶資料", "敏感資料應先移除", "收件渠道啟用前請保留完整材料"] },
    ],
    related: ["trust", "contact/report-error", "editorial-policy"],
  },
  conflicts: {
    eyebrow: "利益衝突",
    title: "讀者有權知道內容背後的利益關係",
    description: "交代持倉、贊助、聯盟與內容獨立性。",
    directAnswer: "本站目前沒有公開贊助、聯盟銷售或作者持倉資料；未知不等於沒有，故具名團隊建立後必須逐頁補充披露。",
    versionLabel: "政策版本",
    version: "利益衝突政策 v1.0（草擬）",
    indexable: true,
    sections: [
      { title: "哪些關係需要披露？", body: "包括相關持倉、受薪關係、贊助、免費產品、聯盟收入與可影響編輯判斷的私人關係。", points: ["披露放在相關內容附近", "贊助不可改寫研究狀態", "未取得資料便明示尚未披露"] },
      { title: "如何保持內容獨立？", body: "商業安排不得決定結論、隱藏失效案例或繞過發布閘門。", points: ["績效數字不作付費排名", "合作內容要清楚標記", "利益關係變更要更新日期"] },
    ],
    related: ["trust", "about/team", "editorial-policy"],
  },
  "risk-disclosure": {
    eyebrow: "風險披露 · 草擬文件",
    title: "技術指標會失效，回測亦會過度樂觀",
    description: "說明教育內容、技術分析與回測的主要限制。",
    directAnswer: "任何技術指標、圖表案例或回測都不能保證未來結果；交易可導致部分或全部本金損失，本站內容不構成投資建議。",
    versionLabel: "政策版本",
    version: "風險披露 v1.0（待香港合資格專業人士審閱）",
    indexable: false,
    sections: [
      { title: "技術分析有哪些風險？", body: "指標會滯後、重繪或在市況轉變時失效；相似指標亦可能只是重複同一訊息。", points: ["裂口與低流動性會扭曲訊號", "交易成本可抵消表面優勢", "止蝕盤不保證按指定價格成交"] },
      { title: "回測為何可能過度樂觀？", body: "資料窺探、存活者偏誤、過度擬合與不實成交假設都會美化歷史結果。", points: ["過往表現不代表未來結果", "樣本外測試仍不能消除所有風險", "法律文字尚待香港合資格人士審閱"] },
    ],
    related: ["trust", "methodology/backtesting", "methodology/data"],
  },
  "contact/report-error": {
    eyebrow: "報告錯誤",
    title: "發現錯誤，請提供可重現資料",
    description: "列出高訊號錯誤報告所需資料與目前收件狀態。",
    directAnswer: "請保存出錯網址、畫面位置、預期與實際結果、重現步驟、來源及檔案校驗資料；本站尚未公開正式收件地址，不會假裝表單已成功送出。",
    versionLabel: "研究狀態",
    version: "正式收件渠道待建立",
    indexable: false,
    sections: [
      { title: "提交可重現資料需要甚麼？", body: "越能重現，越容易判斷問題來自資料、公式、圖表、文字或介面。", points: ["頁面網址與章節名稱", "裝置、瀏覽器及操作步驟", "可公開核對的原始來源或最小示例"] },
      { title: "目前怎樣提交？", body: "正式私隱與收件流程尚未建立，因此本頁暫不收集個人資料。", points: ["請勿提交帳戶、持倉或身份資料", "先保留報告與檔案校驗碼", "收件渠道啟用後會在本頁公布並留下版本紀錄"] },
    ],
    related: ["trust", "corrections", "methodology/data"],
  },
};

export function isTrustRoute(value: string): value is TrustRoutePath {
  return trustRoutePaths.some((route) => route === value);
}

export function trustContentFor(path: TrustRoutePath): TrustContent {
  return contents[path];
}
