const strategyStatusLabels: Readonly<Record<string, string>> = {
  accepted: "已完成核對",
  "support-only": "待完成核對",
  rejected: "不採用",
};

const evidenceStatusLabels: Readonly<Record<string, string>> = {
  needs_manual_strategy_report: "待人工核對策略報告",
  metadata_only: "只有頁面資料",
  exclude_missing_pf: "缺少可核對的盈利因子",
  exclude_not_strategy: "不屬單一策略",
};

const sourceCodeStatusLabels: Readonly<Record<string, string>> = {
  local_template_only: "只展示本站教學範本",
  blocked_invite_only: "受邀腳本，程式碼不公開",
  not_applicable: "不適用",
};

const parameterRoleLabels: Readonly<Record<string, string>> = {
  confirmation: "訊號確認",
  "entry-exit": "入市及出市條件",
  "entry-filter": "入市篩選",
  "entry-mode": "入市模式",
  "execution-cost": "交易成本",
  exit: "出市規則",
  "level-filter": "價位篩選",
  "market-session": "交易時段",
  "mean-reversion": "均值回歸",
  momentum: "動能",
  "range-model": "區間模型",
  "regime-filter": "市況篩選",
  risk: "風險管理",
  "signal-smoothing": "訊號平滑",
  "test-window": "測試期間",
  "trend-filter": "趨勢篩選",
  "trend-structure": "趨勢結構",
  volatility: "波幅",
};

const parameterStatusLabels: Readonly<Record<string, string>> = {
  "teaching-baseline": "本站教學設定",
  "blocked-source": "原始設定未公開",
};

const rubricLabels: Readonly<Record<string, string>> = {
  trueData: "真實市場數據",
  periodPresent: "測試期間",
  marketTimeframePresent: "市場與時段",
  sampleSize: "交易樣本",
  drawdownPresent: "回撤資料",
  costsModeled: "交易成本",
  parametersComplete: "參數完整度",
  oosCaveat: "樣本外測試",
  pfCredible: "盈利因子可信度",
  sourceApproved: "程式碼授權",
};

const rubricValueLabels: Readonly<Record<string, string>> = {
  yes: "已具備",
  no: "未具備",
  partial: "部分具備",
  missing: "欠缺",
  unknown: "未能確認",
  suspicious: "需要覆核",
  weak: "證據不足",
  review: "待人工覆核",
  relative: "只供相對比較",
  not_applicable: "不適用",
};

const displayValueLabels: Readonly<Record<string, string>> = {
  "not applicable": "不適用",
  not_applicable: "不適用",
  "US$10,000 teaching baseline": "10,000 美元（本站教學設定）",
  "USD teaching baseline": "美元（本站教學設定）",
  "1 MNQ contract teaching baseline": "1 張 MNQ 合約（本站教學設定）",
  "1 contract or 100% equity teaching baseline": "1 張合約或全部資金（本站教學設定）",
  "100% equity teaching baseline": "全部資金（本站教學設定）",
  "blocked by invite-only source": "受邀腳本未公開，無法核對",
  "0, one position at a time": "0；同一時間只持有一個倉位",
  "0.10% percent in local template": "0.10%（本站教學範本）",
  "US$1.20 cash per contract in local template": "每張合約 1.20 美元（本站教學範本）",
  "1 tick in local template": "1 個跳動價位（本站教學範本）",
  "2 ticks in local template": "2 個跳動價位（本站教學範本）",
  "Bar-close range model; intrabar fill pending": "按每根 K 線收市價運算；K 線內成交方式仍待核對",
  "Bar-close simulation; limit-fill verification and Bar Magnifier pending": "按每根 K 線收市價模擬；限價盤成交及 Bar Magnifier 仍待核對",
  "Non-standard Heikin Ashi chart warning; standard OHLC rerun required": "採用非標準平均 K 線；須以標準開、高、低、收市價重新測試",
  "Bar close only in template; tick/order-fill recalculation pending": "教學範本只在 K 線收市時計算；逐筆報價及成交後重算仍待核對",
  "20 bars teaching placeholder": "20 根 K 線（教學暫定值）",
  "2022-01-01 to 2026-12-31 template": "2022-01-01 至 2026-12-31（本站教學設定）",
  "Breakout / Mean reversion": "突破／均值回歸",
  "fixed preset claimed, exact values unavailable": "原頁聲稱採用固定預設，實際數值未公開",
  "preset-dependent": "視乎原作者預設",
  "required in teaching checklist": "教學檢查表列為必要條件",
  "1 tick": "1 個跳動價位",
  "35 / 45 ticks": "35／45 個跳動價位",
  "40 / 60 ticks": "40／60 個跳動價位",
  "5 of 7": "7 項條件中至少符合 5 項",
};

const strategyCaveats: Readonly<Record<string, string>> = {
  "supertrend-ai-adaptive-btc": "公開頁提供盈利因子、測試期、參數及成本線索，但仍須人工核對策略測試報告及策略屬性，才能列作已完成核對的正式案例。",
  "nq-mnq-super-scalper-backtest": "盈利因子為 1.23，並非高水平。此例用來示範如何記錄開源日內策略，不應視作策略推薦。",
  "nq-mnq-ct-scalper-backtest": "公開頁提及盈利因子為 1.41。日內期貨對滑價及成交假設很敏感，尚須核對交易次數及完整報告。",
  "po3-ict-sweep-v2": "此策略為受邀腳本（invite-only）。由於原始碼及完整設定未公開，本站只把它列作概念研究，不視為可重建案例。",
  "smoothed-heikin-ashi-trend-backtest": "平均 K 線（Heikin Ashi）回測可能採用非標準成交價。未以標準開、高、低、收市價重新測試前，本例只用來說明非標準圖表的回測風險。",
  "superatr-7-step-profit": "公開頁顯示異常高的盈利因子。遇到盈利因子高於 5 的結果，須先核對交易次數、成本、樣本外測試及過度擬合風險。",
  "expected-range-strategy": "作者曾修正早期具誤導性的回測結果。本例適合用來說明回測錯誤及保留修訂紀錄的重要性。",
  "fracture-threshold-joat": "頁面對策略及參數有較完整說明，但缺少可核對的盈利因子結果，因此不會列入正式案例。",
  "simple-candle-strategy": "沒有可核對的盈利因子、測試期間及完整參數，本例不會列入正式案例。",
  "pinecoders-backtesting-engine": "這是一套回測與交易引擎教材，不是可以獨立驗證的單一策略案例。",
};

const parameterNoteLabels: Readonly<Record<string, string>> = {
  "以 SuperTrend 為趨勢引擎，公開頁只提供概念和部分設定線索。": "以 SuperTrend 作趨勢判斷；公開頁只提供概念及部分設定線索。",
  "用來調整趨勢濾網敏感度；實際數值需要在 Inputs tab 核對。": "用於調整趨勢篩選的敏感度；實際數值仍須在輸入參數（Inputs）頁籤核對。",
  "控制波幅計算，會直接影響止蝕距離和訊號延遲。": "這個週期用作 EMA 大市方向篩選；數值愈大，訊號通常愈慢。",
  "公開資料顯示使用 4H BTC，仍要核對交易所、時區和資料源。": "公開資料顯示使用 BTC 四小時圖，仍須核對交易所、時區及數據來源。",
  "成本、滑價和訂單填補假設必須在 Properties 裏逐項確認。": "手續費、滑價及成交假設必須在策略屬性（Properties）內逐項核對。",
  "日內 scalper 對 tick size、滑價和時段非常敏感。": "日內極短線策略對最小價格變動、滑價及交易時段非常敏感。",
  "快線/慢線設定會影響訊號密度和假突破比例。": "快、慢 EMA 的設定會影響訊號密度及假突破比例。",
  "ATR 或固定止蝕會改變 R 值和回撤形態。": "ATR 止蝕或固定距離止蝕，會改變 R 值及回撤形態。",
  "50 tick 這類設定必須換算成 NQ/MNQ 合約價值。": "50 個跳動價位這類設定，必須換算成 NQ 或 MNQ 的實際合約價值。",
  "交易時段濾網需要配合美股期貨流動性。": "交易時段篩選須配合美股期貨的實際流動性。",
  "佣金和滑價要用保守設定，否則 scalper PF 會被高估。": "手續費及滑價應採用保守設定，否則極短線策略的盈利因子會被高估。",
  "以 RSI 或均值回歸作反向觸發，容易在趨勢日連續止蝕。": "以 RSI 或均值回歸作反向入市條件，在單邊趨勢日可能連續止蝕。",
  "超買超賣門檻愈窄，交易次數愈多但雜訊也愈多。": "超買與超賣門檻愈窄，交易次數通常愈多，雜訊亦會增加。",
  "止盈止蝕距離必須跟 NQ/MNQ tick value 對齊。": "止賺及止蝕距離必須按 NQ 或 MNQ 每個跳動價位的合約價值換算。",
  "日內期貨策略要特別檢查滑價、開市時段和消息時段。": "日內期貨策略尤其要核對滑價、開市時段及重要消息公布時段。",
  "用來描述 accumulation / manipulation / distribution 的概念階段。": "用來描述累積、操控及派發三個概念階段。",
  "流動性掃盤和反轉判斷需要明確定義觸發條件。": "流動性掃盤及反轉判斷都需要明確的觸發條件。",
  "來源屬 invite-only 或 metadata-only，不可展示原始 Pine 代碼。": "來源屬受邀腳本，或只有頁面資料；因此不能展示原始 Pine Script 程式碼。",
  "TP/SL、時段和風險設定必須先在 Properties 裏核對。": "止賺、止蝕、交易時段及風險設定，必須先在策略屬性（Properties）內核對。",
  "以 HA close 平滑趨勢，但非標準 K 線可能美化回測。": "以平均 K 線的收市價平滑趨勢，但非標準 K 線可能令回測結果過分理想。",
  "EMA 平滑長度愈大，訊號愈慢但雜訊較少。": "EMA 平滑週期愈長，訊號通常愈慢，雜訊亦較少。",
  "反轉條件需要用標準 OHLC 再核對一次。": "反轉條件須以標準開、高、低、收市價（OHLC）重新核對。",
  "必須標明是否使用非標準圖表成交，否則只能作風險教材。": "必須說明成交價是否來自非標準圖表；資料未清楚前，本例只能作風險教材。",
  "公開描述提到 ATR SMA 12，需核對是否為原始設定。": "公開說明提到 12 期 ATR 簡單移動平均，仍須核對是否為原作者設定。",
  "ATR 倍數會同時影響止蝕距離和出場速度。": "ATR 倍數會同時影響止蝕距離及出市速度。",
  "多段止盈需要定義每段比例和剩餘倉位處理。": "多段止賺須列明每段比例，以及餘下倉位的處理方法。",
  "極高 PF 必須先檢查交易次數、成本、OOS 和曲線擬合。": "盈利因子異常偏高時，必須先檢查交易次數、成本、樣本外測試及過度擬合。",
  "7-step 出場容易過度優化，只適合用作教學拆解。": "七段式出市規則容易過度優化，只適合用作教學拆解。",
  "以預期波幅區間作交易框架，必須定義上下界來源。": "以預期波幅區間作交易框架時，必須清楚交代上下界的計算方法。",
  "ATR 長度會改變區間寬度和觸發頻率。": "ATR 週期會改變區間寬度及訊號觸發頻率。",
  "方向濾網需避免在單邊市逆勢接刀。": "方向篩選用來避免在單邊市逆勢捕捉底部。",
  "公開頁曾提及錯誤修正，適合展示回測透明度。": "公開頁記錄了錯誤修正，適合用來說明回測修訂透明度。",
  "修正前後結果不可混用，PF 要以最新可核對版本為準。": "修正前後的結果不可混用；盈利因子應以最新而可核對的版本為準。",
  "以 EMA 或 threshold 判斷結構斷裂，適合拆解風控條件。": "以 EMA 或門檻值判斷結構轉變，適合用來拆解風險控制條件。",
  "threshold 數值決定訊號敏感度，需避免只迎合樣本。": "門檻值會決定訊號敏感度，設定時要避免只迎合現有樣本。",
  "入場方向和退出條件要分開記錄。": "入市方向及出市條件應分開記錄。",
  "若沒有 Strategy Report，PF 欄位不可當作正式績效。": "沒有策略測試報告時，盈利因子不能視作正式績效數據。",
  "風險以 R 值描述，比單看勝率更有教學價值。": "以 R 值描述風險，比單看勝率更能反映每筆交易的風險回報。",
};

const unavailableReasonLabels: Readonly<Record<string, string>> = {
  invite_only_source_no_code_access: "這是受邀腳本，原始程式碼未有公開。",
  original_source_not_copied_local_template_only: "本站只提供教學重建範本，沒有複製原作者程式碼。",
  rejected_case_no_code: "此案例不符合收錄條件，因此不展示程式碼。",
  tool_reference_not_single_strategy_case: "這是回測工具參考，不是單一策略案例。",
};

export function strategyStatusLabel(status: string): string {
  return strategyStatusLabels[status] ?? "待核對";
}

export function strategyStatusTone(status: string): "good" | "warn" | "bad" | "info" {
  if (status === "accepted") return "good";
  if (status === "support-only") return "warn";
  if (status === "rejected") return "bad";
  return "info";
}

export function evidenceStatusLabel(status: string): string {
  return evidenceStatusLabels[status] ?? status;
}

export function sourceCodeStatusLabel(status: string): string {
  return sourceCodeStatusLabels[status] ?? status;
}

export function parameterRoleLabel(role: string): string {
  return parameterRoleLabels[role] ?? role;
}

export function parameterStatusLabel(status: string): string {
  return parameterStatusLabels[status] ?? status;
}

export function rubricLabel(label: string): string {
  return rubricLabels[label] ?? label;
}

export function rubricValueLabel(value: string | number | boolean | null): string {
  if (value === null) return "待補資料";
  if (typeof value === "number") return value.toLocaleString("zh-HK");
  if (typeof value === "boolean") return value ? "已具備" : "未具備";
  return rubricValueLabels[value] ?? value;
}

export function strategyDisplayValue(value: string | number | null): string {
  if (value === null) return "待補資料";
  if (typeof value === "number") return value.toLocaleString("zh-HK");
  return displayValueLabels[value] ?? value;
}

export function unavailableReasonLabel(reason: string | null): string {
  if (reason === null) return "程式碼暫未提供。";
  return unavailableReasonLabels[reason] ?? reason;
}

export function strategyCaveat(slug: string, fallback: string): string {
  return strategyCaveats[slug] ?? fallback;
}

export function parameterNoteLabel(note: string): string {
  return parameterNoteLabels[note] ?? note;
}
