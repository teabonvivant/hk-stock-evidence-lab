const publicCopyFallback = Object.freeze({
  metadata: Object.freeze({ schemaVersion: 1, locale: "zh-Hant-HK" }),
  global: Object.freeze({}),
  pages: Object.freeze({}),
  indicators: Object.freeze([]),
  terms: Object.freeze({}),
  strategy: Object.freeze({
    statuses: Object.freeze({
      accepted: Object.freeze({
        label: "已完成全部核對",
        shortLabel: "已核對",
      }),
      "support-only": Object.freeze({
        label: "待完成核對",
        shortLabel: "待核對",
      }),
      rejected: Object.freeze({
        label: "不採用",
        shortLabel: "不採用",
      }),
    }),
    disclosurePhrases: Object.freeze({}),
  }),
});

function readPublicCopy(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return publicCopyFallback;
  }
  if (
    !value.metadata ||
    typeof value.metadata !== "object" ||
    !value.global ||
    typeof value.global !== "object" ||
    !value.pages ||
    typeof value.pages !== "object" ||
    !Array.isArray(value.indicators) ||
    !value.terms ||
    typeof value.terms !== "object" ||
    !value.strategy ||
    typeof value.strategy !== "object"
  ) {
    return publicCopyFallback;
  }
  return value;
}

const publicCopy = readPublicCopy(window.__PUBLIC_COPY__);

const indicatorInput = [
  {
    slug: "sma",
    name: "簡單移動平均線",
    en: "Simple Moving Average",
    abbr: "SMA",
    category: "趨勢",
    uses: ["看趨勢", "支撐阻力"],
    difficulty: "入門",
    params: "20、50、200 期",
    formula: "SMA = N 期收市價總和 / N",
    summary:
      "SMA 用固定期間的平均收市價平滑短期雜訊，常用來判斷趨勢方向與中長線支撐壓力。",
    signals: [
      "價格站上中長期 SMA，通常代表趨勢環境轉強。",
      "短期 SMA 升穿長期 SMA，可視為趨勢改善的確認訊號。",
      "SMA 斜率比單次穿越更重要，斜率向上代表買盤延續性較好。",
    ],
    mistakes: [
      "在橫行市把均線穿越當成強訊號，容易反覆被假突破干擾。",
      "只看一條均線，不看成交量與大市環境。",
    ],
    limitations: [
      "SMA 是落後指標，轉勢初期會慢半拍。",
      "遇到急升急跌時，平均值可能低估短線風險。",
    ],
    related: ["ema", "ma-ribbon", "macd", "support-resistance"],
    core: true,
  },
  {
    slug: "ema",
    name: "指數移動平均線",
    en: "Exponential Moving Average",
    abbr: "EMA",
    category: "趨勢",
    uses: ["看趨勢", "找轉折"],
    difficulty: "入門",
    params: "12、20、26、50 期",
    formula: "EMA = 今日收市價 x 平滑係數 + 昨日 EMA x (1 - 平滑係數)",
    summary:
      "EMA 對近期價格反應較快，適合觀察趨勢轉折與短中線節奏，是 MACD 等指標的基礎。",
    signals: [
      "短期 EMA 持續高於長期 EMA，代表短線動能仍佔優。",
      "價格回踩 EMA 後重新轉強，可作為趨勢延續觀察點。",
      "多條 EMA 呈現順序排列時，趨勢結構較清晰。",
    ],
    mistakes: [
      "以為 EMA 越短越準，忽略短週期會帶來更多雜訊。",
      "在缺乏趨勢的區間內過度交易穿越訊號。",
    ],
    limitations: [
      "EMA 比 SMA 快，但仍然是落後價格的平滑工具。",
      "週期設定差異會明顯改變訊號數量。",
    ],
    related: ["sma", "macd", "supertrend", "ma-ribbon"],
    core: true,
  },
  {
    slug: "wma",
    name: "加權移動平均線",
    en: "Weighted Moving Average",
    abbr: "WMA",
    category: "趨勢",
    uses: ["看趨勢", "找轉折"],
    difficulty: "中階",
    params: "10、20、30 期",
    formula: "WMA = 加權價格總和 / 權重總和",
    summary:
      "WMA 給近期價格更高權重，比 SMA 靈敏，適合需要較快反應但仍想保留平均概念的情境。",
    signals: [
      "WMA 向上且價格回落不跌破，代表短線趨勢仍有承接。",
      "WMA 與 SMA 距離拉開，表示近期價格加速。",
    ],
    mistakes: ["用太短週期追逐每次波動，容易增加錯誤訊號。"],
    limitations: ["對近期價格敏感，盤整時容易來回翻轉。"],
    related: ["sma", "ema", "hma"],
  },
  {
    slug: "hma",
    name: "赫爾移動平均線",
    en: "Hull Moving Average",
    abbr: "HMA",
    category: "趨勢",
    uses: ["看趨勢", "找轉折"],
    difficulty: "進階",
    params: "16、21、55 期",
    formula: "HMA = WMA(2 x WMA(N/2) - WMA(N), sqrt(N))",
    summary:
      "HMA 透過加權與平方根週期降低延遲，常被用來觀察較平滑但反應較快的趨勢變化。",
    signals: [
      "HMA 由下彎轉上彎，代表短線節奏可能改善。",
      "價格沿 HMA 推進時，可用來追蹤趨勢節奏。",
    ],
    mistakes: ["把線條轉向當成單獨買賣訊號，忽略市場結構。"],
    limitations: ["計算較複雜，與常見平台設定可能略有差異。"],
    related: ["wma", "ema", "supertrend"],
  },
  {
    slug: "kama",
    name: "考夫曼自適應均線",
    en: "Kaufman Adaptive Moving Average",
    abbr: "KAMA",
    category: "趨勢",
    uses: ["看趨勢", "判斷盤整"],
    difficulty: "進階",
    params: "10 期效率比、2/30 平滑",
    formula: "KAMA 依效率比調整平滑係數",
    summary:
      "KAMA 會根據價格效率調整反應速度，趨勢清楚時較靈敏，雜訊較多時較平滑。",
    signals: [
      "KAMA 明顯轉向並拉開價格距離，代表趨勢效率提高。",
      "KAMA 走平時，代表價格可能缺乏方向。",
    ],
    mistakes: ["期待它完全過濾震盪，實際上仍需搭配市況判斷。"],
    limitations: ["參數較多，初學者不宜過度調校。"],
    related: ["ema", "adx", "atr"],
  },
  {
    slug: "ma-ribbon",
    name: "均線帶",
    en: "Moving Average Ribbon",
    abbr: "MA Ribbon",
    category: "趨勢",
    uses: ["看趨勢", "判斷盤整"],
    difficulty: "中階",
    params: "5 至 60 期多條均線",
    formula: "同時繪製多條不同週期均線",
    summary:
      "均線帶把多條週期均線放在同一圖表，幫助觀察趨勢排列、收斂與擴散。",
    signals: [
      "均線帶向上發散，代表多週期趨勢共振。",
      "均線帶收斂纏繞，代表方向不明或準備變盤。",
    ],
    mistakes: ["均線太多反而看不出重點，應先定義核心週期。"],
    limitations: ["訊號仍然落後價格，不能單獨預測突破方向。"],
    related: ["sma", "ema", "macd"],
  },
  {
    slug: "macd",
    name: "指數平滑異同移動平均線",
    en: "Moving Average Convergence Divergence",
    abbr: "MACD",
    category: "動能",
    uses: ["找轉折", "看趨勢"],
    difficulty: "入門",
    params: "12、26、9",
    formula: "MACD = EMA12 - EMA26；Signal = MACD 的 9 期 EMA",
    summary:
      "MACD 結合趨勢與動能，透過快慢 EMA 差值觀察趨勢強弱、金叉死叉與背離。",
    signals: [
      "MACD 線升穿 Signal 線，代表短期動能改善。",
      "柱狀體由負轉正，通常表示多方動能開始佔優。",
      "價格創新高但 MACD 未創新高，可能出現動能背離。",
    ],
    mistakes: [
      "在低波動橫行市頻繁追逐金叉死叉。",
      "只看柱狀體顏色，不看它相對零軸的位置。",
    ],
    limitations: [
      "MACD 源自均線，轉折初期仍會延遲。",
      "背離可以維持很久，不等於立即反轉。",
    ],
    related: ["ema", "rsi", "adx", "trix"],
    core: true,
  },
  {
    slug: "rsi",
    name: "相對強弱指數",
    en: "Relative Strength Index",
    abbr: "RSI",
    category: "動能",
    uses: ["找轉折", "追蹤強弱"],
    difficulty: "入門",
    params: "14 期，常用 30/70 或 20/80 區間",
    formula: "RSI = 100 - 100 / (1 + 平均升幅 / 平均跌幅)",
    summary:
      "RSI 衡量近期上升與下跌力度，常用來觀察超買超賣、背離與動能節奏。",
    signals: [
      "RSI 高於 70 代表強勢或過熱，需配合趨勢判斷。",
      "RSI 低於 30 代表弱勢或超賣，不等於一定反彈。",
      "RSI 背離可提醒趨勢動能變弱。",
    ],
    mistakes: [
      "在強趨勢中，只因 RSI 超買便逆勢做空。",
      "忽略 RSI 區間會隨牛熊市改變。",
    ],
    limitations: [
      "RSI 可以長時間停留在高低區域。",
      "不同週期 RSI 可能給出相反訊號。",
    ],
    related: ["stochastic", "macd", "stochastic-rsi", "mfi"],
    core: true,
  },
  {
    slug: "stochastic",
    name: "隨機指標",
    en: "Stochastic Oscillator",
    abbr: "KD",
    category: "動能",
    uses: ["找轉折", "判斷盤整"],
    difficulty: "入門",
    params: "14、3、3",
    formula: "%K = (收市價 - N 期最低價) / (N 期最高價 - N 期最低價) x 100",
    summary:
      "KD 觀察收市價在近期高低區間中的位置，對區間震盪和短線轉折較敏感。",
    signals: [
      "%K 升穿 %D 且位於低位，代表短線反彈機會增加。",
      "指標高位鈍化時，可能代表趨勢很強而非立即反轉。",
      "KD 背離可用來輔助判斷動能衰退。",
    ],
    mistakes: [
      "在單邊趨勢中反覆逆勢交易高低位訊號。",
      "忽略高低位訊號需要配合價格結構確認。",
    ],
    limitations: ["KD 反應快，雜訊也較多。"],
    related: ["rsi", "stochastic-rsi", "williams-r", "kdj"],
    core: true,
  },
  {
    slug: "stochastic-rsi",
    name: "隨機 RSI",
    en: "Stochastic RSI",
    abbr: "StochRSI",
    category: "動能",
    uses: ["找轉折", "追蹤強弱"],
    difficulty: "中階",
    params: "RSI 14、Stochastic 14",
    formula: "StochRSI = (RSI - N 期 RSI 最低值) / (N 期 RSI 最高值 - 最低值)",
    summary:
      "StochRSI 把 Stochastic 套用在 RSI 上，訊號更敏感，適合觀察短線動能極端值。",
    signals: [
      "從低位回升可提示短線動能改善。",
      "高位反覆鈍化時，代表趨勢仍可能延續。",
    ],
    mistakes: ["把每次高低位交叉都當成交易訊號，容易過度交易。"],
    limitations: ["比 RSI 更敏感，需要更強的價格確認。"],
    related: ["rsi", "stochastic", "williams-r"],
  },
  {
    slug: "cci",
    name: "商品通道指數",
    en: "Commodity Channel Index",
    abbr: "CCI",
    category: "動能",
    uses: ["找轉折", "追蹤強弱"],
    difficulty: "中階",
    params: "20 期，常看 +100 / -100",
    formula: "CCI = (典型價格 - SMA) / (0.015 x 平均偏差)",
    summary:
      "CCI 衡量價格偏離平均的程度，可用於辨識強勢突破、超買超賣與週期性轉折。",
    signals: [
      "CCI 突破 +100，代表價格動能明顯轉強。",
      "CCI 跌破 -100，代表弱勢或恐慌加深。",
      "回到零軸附近時，代表動能可能回歸均衡。",
    ],
    mistakes: ["只把 +100/-100 視為反轉點，忽略突破也可能延續。"],
    limitations: ["不同股票波動特性不同，固定閾值不一定適用。"],
    related: ["rsi", "roc", "williams-r"],
    core: true,
  },
  {
    slug: "roc",
    name: "變動率",
    en: "Rate of Change",
    abbr: "ROC",
    category: "動能",
    uses: ["追蹤強弱", "找轉折"],
    difficulty: "入門",
    params: "12、20、25 期",
    formula: "ROC = (今日收市價 - N 期前收市價) / N 期前收市價 x 100",
    summary:
      "ROC 直接比較現在與過去價格差距，用來衡量價格變化速度。",
    signals: [
      "ROC 高於零軸代表價格高於 N 期前。",
      "ROC 持續擴大代表動能加速。",
    ],
    mistakes: ["只看 ROC 數值大小，不看價格所在趨勢。"],
    limitations: ["對週期起點敏感，可能因單日異常價而失真。"],
    related: ["momentum", "rsi", "cci"],
  },
  {
    slug: "momentum",
    name: "動量指標",
    en: "Momentum",
    abbr: "MOM",
    category: "動能",
    uses: ["追蹤強弱", "找轉折"],
    difficulty: "入門",
    params: "10、20 期",
    formula: "Momentum = 今日收市價 - N 期前收市價",
    summary:
      "Momentum 用價格差衡量加速或減速，是理解動能類指標的基礎。",
    signals: [
      "動量由負轉正，代表短期價格結構改善。",
      "動量下降但價格仍創高，可能形成背離。",
    ],
    mistakes: ["忽略不同股價水平下，絕對差值不容易直接比較。"],
    limitations: ["比率化不足，跨股票比較時不如 ROC 直觀。"],
    related: ["roc", "macd", "rsi"],
  },
  {
    slug: "williams-r",
    name: "威廉指標",
    en: "Williams %R",
    abbr: "%R",
    category: "動能",
    uses: ["找轉折", "判斷盤整"],
    difficulty: "中階",
    params: "14 期，常看 -20 / -80",
    formula: "%R = (N 期最高價 - 收市價) / (N 期最高價 - N 期最低價) x -100",
    summary:
      "Williams %R 與 KD 概念相近，用負值表示收市價相對高低區間的位置。",
    signals: [
      "從 -80 以下回升，代表短線賣壓可能舒緩。",
      "高位鈍化時，代表強勢趨勢仍可能延續。",
    ],
    mistakes: ["把進入超買超賣區視為立即反轉。"],
    limitations: ["震盪市較有用，趨勢市需搭配趨勢濾網。"],
    related: ["stochastic", "rsi", "cci"],
  },
  {
    slug: "trix",
    name: "三重指數平滑平均",
    en: "Triple Exponential Average",
    abbr: "TRIX",
    category: "動能",
    uses: ["看趨勢", "找轉折"],
    difficulty: "進階",
    params: "15 期、9 期訊號線",
    formula: "TRIX = 三重 EMA 的一日變化率",
    summary:
      "TRIX 透過三重平滑降低雜訊，適合觀察較乾淨的中期動能轉向。",
    signals: [
      "TRIX 升穿訊號線，代表平滑後動能改善。",
      "TRIX 遠離零軸，代表趨勢動能較明確。",
    ],
    mistakes: ["用它追很短線，會因平滑造成延遲。"],
    limitations: ["訊號較慢，適合搭配更快的價格確認。"],
    related: ["macd", "ema", "roc"],
  },
  {
    slug: "ultimate-oscillator",
    name: "終極震盪指標",
    en: "Ultimate Oscillator",
    abbr: "UO",
    category: "動能",
    uses: ["找轉折", "追蹤強弱"],
    difficulty: "進階",
    params: "7、14、28 期",
    formula: "UO = 多週期買壓 / 真實波幅的加權組合",
    summary:
      "UO 同時結合短中長週期動能，目標是降低單一週期震盪指標的假訊號。",
    signals: [
      "低位背離後回升，可觀察反彈機會。",
      "突破中線代表多週期買壓改善。",
    ],
    mistakes: ["忽略它仍是震盪指標，不適合單獨追突破。"],
    limitations: ["解讀比 RSI 複雜，需先理解多週期概念。"],
    related: ["rsi", "stochastic", "mfi"],
  },
  {
    slug: "tsi",
    name: "真實強弱指數",
    en: "True Strength Index",
    abbr: "TSI",
    category: "動能",
    uses: ["追蹤強弱", "找轉折"],
    difficulty: "進階",
    params: "25、13、7",
    formula: "TSI = 雙重平滑動量 / 雙重平滑絕對動量 x 100",
    summary:
      "TSI 用平滑後的動量比例衡量趨勢強度，常搭配訊號線觀察轉折。",
    signals: [
      "TSI 升穿訊號線表示動能轉強。",
      "TSI 與價格背離可提示趨勢疲弱。",
    ],
    mistakes: ["忽略訊號平滑帶來的延遲。"],
    limitations: ["參數較多，不宜為了貼合歷史而過度最佳化。"],
    related: ["macd", "trix", "rsi"],
  },
  {
    slug: "awesome-oscillator",
    name: "動量震盪器",
    en: "Awesome Oscillator",
    abbr: "AO",
    category: "動能",
    uses: ["追蹤強弱", "看趨勢"],
    difficulty: "中階",
    params: "5 與 34 期中位價 SMA",
    formula: "AO = SMA5(中位價) - SMA34(中位價)",
    summary:
      "AO 比較短長週期中位價平均，用柱狀圖觀察市場動能方向。",
    signals: [
      "AO 由負轉正，代表短期動能相對長期改善。",
      "連續柱狀體縮短，可提示動能減弱。",
    ],
    mistakes: ["只看顏色轉變而忽略零軸位置。"],
    limitations: ["橫行市柱狀體會頻繁翻轉。"],
    related: ["macd", "momentum", "roc"],
  },
  {
    slug: "adx",
    name: "平均趨向指數",
    en: "Average Directional Index",
    abbr: "ADX",
    category: "趨勢",
    uses: ["看趨勢", "判斷盤整"],
    difficulty: "中階",
    params: "14 期，常看 20 / 25",
    formula: "ADX 由 +DI 與 -DI 的差距平滑而成",
    summary:
      "ADX 衡量趨勢強度，不直接表示方向，常用來判斷市場是否值得採用趨勢策略。",
    signals: [
      "ADX 高於 25，通常代表趨勢強度較明顯。",
      "+DI 高於 -DI 且 ADX 上升，代表多方趨勢較強。",
      "ADX 下降代表趨勢動能減弱或進入盤整。",
    ],
    mistakes: [
      "把 ADX 上升解讀成一定會上升，忽略它不代表方向。",
      "用固定門檻套所有股票與週期。",
    ],
    limitations: ["ADX 反應慢，適合做市況濾網而非精準進出點。"],
    related: ["dmi", "supertrend", "atr", "macd"],
    core: true,
  },
  {
    slug: "aroon",
    name: "阿隆指標",
    en: "Aroon",
    abbr: "Aroon",
    category: "趨勢",
    uses: ["看趨勢", "找轉折"],
    difficulty: "中階",
    params: "25 期",
    formula: "Aroon Up/Down = 距離近期高低點的時間比例",
    summary:
      "Aroon 透過近期高低點出現時間判斷趨勢是否活躍，適合觀察新高新低節奏。",
    signals: [
      "Aroon Up 接近 100 且 Down 低，代表上升趨勢活躍。",
      "兩線交叉可提示趨勢主導權改變。",
    ],
    mistakes: ["忽略價格幅度，只看高低點出現時間。"],
    limitations: ["對創高創低敏感，但不衡量突破力度。"],
    related: ["adx", "donchian-channel", "roc"],
  },
  {
    slug: "supertrend",
    name: "超級趨勢線",
    en: "Supertrend",
    abbr: "Supertrend",
    category: "趨勢",
    uses: ["看趨勢", "管理風險"],
    difficulty: "中階",
    params: "ATR 10，倍數 3",
    formula: "Supertrend = 中位價 +/- ATR 倍數並依趨勢切換",
    summary:
      "Supertrend 用 ATR 建立動態趨勢線，常用來追蹤趨勢方向與移動止蝕位置。",
    signals: [
      "價格站上 Supertrend 線，趨勢狀態轉多。",
      "線位跟隨價格上移，可作為風險管理參考。",
    ],
    mistakes: ["在震盪市把每次翻轉都當成新趨勢。"],
    limitations: ["ATR 倍數會直接影響訊號靈敏度。"],
    related: ["atr", "adx", "psar", "ema"],
    core: true,
  },
  {
    slug: "psar",
    name: "拋物線轉向指標",
    en: "Parabolic SAR",
    abbr: "PSAR",
    category: "趨勢",
    uses: ["看趨勢", "管理風險"],
    difficulty: "中階",
    params: "加速因子 0.02，最大 0.2",
    formula: "SAR 依極值點與加速因子逐步移動",
    summary:
      "PSAR 以點狀標記追蹤趨勢方向，常被用作趨勢跟隨與移動止蝕參考。",
    signals: [
      "點位由價格上方轉到下方，代表趨勢狀態轉多。",
      "點位越貼近價格，代表止蝕空間越收窄。",
    ],
    mistakes: ["在盤整市使用 PSAR，容易連續反向訊號。"],
    limitations: ["適合趨勢市，不適合低波動橫行。"],
    related: ["supertrend", "atr", "adx"],
    core: true,
  },
  {
    slug: "ichimoku",
    name: "一目均衡表",
    en: "Ichimoku Cloud",
    abbr: "Ichimoku",
    category: "趨勢",
    uses: ["看趨勢", "支撐阻力"],
    difficulty: "進階",
    params: "9、26、52",
    formula: "轉換線、基準線、先行 span A/B 與遲行線組合",
    summary:
      "一目均衡表把趨勢、支撐壓力與動能位置放在同一張圖，適合先看大方向，再看價格站在哪裡。",
    signals: [
      "價格在雲層上方，整體趨勢偏多。",
      "轉換線升穿基準線，代表中短期動能改善。",
      "雲層厚度可反映支撐壓力區的寬度。",
    ],
    mistakes: ["線條多但沒有判斷順序，容易過度解讀。"],
    limitations: ["對初學者視覺負擔較高，需要分層學習。"],
    related: ["sma", "adx", "donchian-channel"],
    core: true,
  },
  {
    slug: "dmi",
    name: "趨向指標",
    en: "Directional Movement Index",
    abbr: "DMI",
    category: "趨勢",
    uses: ["看趨勢", "追蹤強弱"],
    difficulty: "中階",
    params: "14 期",
    formula: "+DI 與 -DI 由方向性移動量除以真實波幅而成",
    summary:
      "DMI 用 +DI、-DI 與 ADX 觀察多空方向與趨勢強度，是趨勢濾網常用工具。",
    signals: [
      "+DI 高於 -DI，代表多方方向性較強。",
      "搭配 ADX 上升時，訊號可靠性較高。",
    ],
    mistakes: ["只看 DI 交叉，不看 ADX 是否顯示有趨勢。"],
    limitations: ["短線圖上容易有雜訊。"],
    related: ["adx", "atr", "supertrend"],
  },
  {
    slug: "bollinger-bands",
    name: "布林帶",
    en: "Bollinger Bands",
    abbr: "BB",
    category: "波動率",
    uses: ["觀察波動", "判斷盤整"],
    difficulty: "入門",
    params: "20 期 SMA，2 倍標準差",
    formula: "上軌/下軌 = SMA +/- K x 標準差",
    summary:
      "布林帶以平均線和標準差描述價格波動區間，可用來觀察壓縮、擴張、突破與回歸。",
    signals: [
      "帶寬收窄代表波動壓縮，可能準備進入新方向。",
      "價格沿上軌推進，常代表強勢趨勢而非單純超買。",
      "價格跌破下軌後收回，可觀察短線回歸機會。",
    ],
    mistakes: [
      "看到碰上軌就做空，忽略趨勢市可沿軌運行。",
      "把帶寬收窄當成方向預測，而不是波動提示。",
    ],
    limitations: ["標準差根據過去波動計算，不能預知事件風險。"],
    related: ["sma", "standard-deviation", "keltner-channel", "atr"],
    core: true,
  },
  {
    slug: "keltner-channel",
    name: "肯特納通道",
    en: "Keltner Channel",
    abbr: "KC",
    category: "波動率",
    uses: ["觀察波動", "看趨勢"],
    difficulty: "中階",
    params: "EMA 20，ATR 2 倍",
    formula: "上軌/下軌 = EMA +/- ATR 倍數",
    summary:
      "Keltner Channel 使用 ATR 建立波動通道，比布林帶對極端標準差波動較不敏感。",
    signals: [
      "價格突破上軌且通道上行，代表趨勢動能較強。",
      "通道變窄代表波動下降。",
    ],
    mistakes: ["直接把通道邊界當固定壓力支撐。"],
    limitations: ["ATR 倍數需要配合股票波動特性。"],
    related: ["bollinger-bands", "atr", "ema", "donchian-channel"],
  },
  {
    slug: "donchian-channel",
    name: "唐奇安通道",
    en: "Donchian Channel",
    abbr: "DC",
    category: "通道/型態",
    uses: ["看趨勢", "支撐阻力"],
    difficulty: "中階",
    params: "20、55 期",
    formula: "上軌 = N 期最高價；下軌 = N 期最低價",
    summary:
      "Donchian Channel 用近期最高與最低價定義通道，常見於突破與趨勢跟隨策略。",
    signals: [
      "價格突破上軌，代表創 N 期新高。",
      "通道寬度擴大代表波動或趨勢空間增加。",
    ],
    mistakes: ["在震盪市追逐每次通道突破。"],
    limitations: ["不衡量突破後動能，需要成交量或趨勢濾網。"],
    related: ["aroon", "atr", "price-channel"],
  },
  {
    slug: "atr",
    name: "平均真實波幅",
    en: "Average True Range",
    abbr: "ATR",
    category: "波動率",
    uses: ["管理風險", "觀察波動"],
    difficulty: "入門",
    params: "14 期",
    formula: "ATR = 真實波幅 TR 的 N 期平均",
    summary:
      "ATR 衡量價格波動幅度，不判斷方向，常用於止蝕距離、倉位控制與波動濾網。",
    signals: [
      "ATR 上升代表波動擴大，風險和機會同時提高。",
      "ATR 下降代表波動收縮，可能進入盤整或等待突破。",
      "以 ATR 設止蝕，可讓風險距離貼近個股波動特性。",
    ],
    mistakes: [
      "把 ATR 上升解讀成看漲或看跌，它只代表波動。",
      "不按 ATR 調整倉位，導致高波動股票風險過大。",
    ],
    limitations: ["事件裂口可能令 ATR 滯後調整。"],
    related: ["supertrend", "keltner-channel", "chandelier-exit", "adx"],
    core: true,
  },
  {
    slug: "standard-deviation",
    name: "標準差",
    en: "Standard Deviation",
    abbr: "SD",
    category: "波動率",
    uses: ["觀察波動", "判斷盤整"],
    difficulty: "中階",
    params: "20 期",
    formula: "標準差 = 價格偏離平均值的平方平均後開方",
    summary:
      "標準差衡量價格分散程度，是布林帶等波動指標的核心組件。",
    signals: [
      "標準差上升代表價格離散度增加。",
      "長時間低標準差後，需留意波動擴張。",
    ],
    mistakes: ["把低波動當成低風險，忽略突破可能。"],
    limitations: ["對極端值敏感。"],
    related: ["bollinger-bands", "atr", "ulcer-index"],
  },
  {
    slug: "volatility-stop",
    name: "波動止蝕",
    en: "Volatility Stop",
    abbr: "VStop",
    category: "波動率",
    uses: ["管理風險", "看趨勢"],
    difficulty: "中階",
    params: "ATR 20，倍數 2 至 3",
    formula: "止蝕線依價格趨勢與 ATR 倍數移動",
    summary:
      "波動止蝕用波幅決定移動止蝕距離，避免用固定價格距離套用所有股票。",
    signals: [
      "止蝕線隨趨勢上移，可用作保護利潤。",
      "價格跌破止蝕線，代表原趨勢風險上升。",
    ],
    mistakes: ["倍數設太小，正常波動也會被掃出。"],
    limitations: ["止蝕規則需配合交易週期。"],
    related: ["atr", "supertrend", "chandelier-exit"],
  },
  {
    slug: "obv",
    name: "能量潮",
    en: "On Balance Volume",
    abbr: "OBV",
    category: "成交量",
    uses: ["確認成交量", "追蹤強弱"],
    difficulty: "入門",
    params: "累積成交量",
    formula: "上漲日加成交量，下跌日減成交量",
    summary:
      "OBV 把成交量按漲跌方向累加，用來觀察資金流向是否支持價格趨勢。",
    signals: [
      "價格創高且 OBV 同步創高，代表成交量確認較完整。",
      "價格上升但 OBV 未跟上，可能代表推升力量不足。",
      "OBV 領先突破可提示資金先行變化。",
    ],
    mistakes: [
      "忽略單日巨量會扭曲累積線。",
      "只看 OBV 方向，不看價格是否突破關鍵位置。",
    ],
    limitations: ["不同市場成交量統計口徑可能影響解讀。"],
    related: ["volume", "mfi", "chaikin-money-flow", "accumulation-distribution"],
    core: true,
  },
  {
    slug: "volume",
    name: "成交量",
    en: "Volume",
    abbr: "Volume",
    category: "成交量",
    uses: ["確認成交量", "看趨勢"],
    difficulty: "入門",
    params: "日成交量、成交額、量比",
    formula: "成交量 = 指定期間內成交股數或成交合約數",
    summary:
      "成交量是技術分析的基礎，用來確認價格變化背後是否有足夠參與度。",
    signals: [
      "放量突破比縮量突破更值得留意。",
      "價跌量縮可能代表賣壓減弱，但需配合支撐位觀察。",
      "高位爆量後滯漲，需要留意派發風險。",
    ],
    mistakes: ["只看成交股數，不看成交額和流通性。"],
    limitations: ["港股半日市、停牌復牌與特殊事件會影響成交量比較。"],
    related: ["volume-ma", "obv", "vwap", "mfi"],
    core: true,
  },
  {
    slug: "volume-ma",
    name: "成交量均線",
    en: "Volume Moving Average",
    abbr: "Vol MA",
    category: "成交量",
    uses: ["確認成交量", "篩選股票"],
    difficulty: "入門",
    params: "20、50 期",
    formula: "Volume MA = N 期成交量平均",
    summary:
      "成交量均線把當日成交量與近期平均比較，幫助判斷放量或縮量是否明顯。",
    signals: [
      "成交量高於 20 日均量，代表參與度高於近期水平。",
      "突破時成交量同步高於均量，訊號較完整。",
    ],
    mistakes: ["忽略財報、配股、除權等事件造成的異常量。"],
    limitations: ["只反映相對近期，不能直接比較不同股票。"],
    related: ["volume", "obv", "force-index"],
  },
  {
    slug: "vwap",
    name: "成交量加權平均價",
    en: "Volume Weighted Average Price",
    abbr: "VWAP",
    category: "成交量",
    uses: ["確認成交量", "支撐阻力"],
    difficulty: "中階",
    params: "日內 VWAP、錨定 VWAP",
    formula: "VWAP = 成交額總和 / 成交量總和",
    summary:
      "VWAP 以成交量加權計算平均成交價，常用於日內觀察機構成本區和價格強弱。",
    signals: [
      "價格位於 VWAP 上方，代表日內平均買方較有優勢。",
      "回踩 VWAP 後反彈，可作為日內支撐觀察。",
      "錨定 VWAP 可從事件日、突破日或低點開始計算成本區。",
    ],
    mistakes: ["把日內 VWAP 用成長線指標，忽略它的計算週期。"],
    limitations: ["日內資料品質和成交口徑會影響準確度。"],
    related: ["volume", "obv", "support-resistance"],
    core: true,
  },
  {
    slug: "mfi",
    name: "資金流量指標",
    en: "Money Flow Index",
    abbr: "MFI",
    category: "成交量",
    uses: ["確認成交量", "找轉折"],
    difficulty: "中階",
    params: "14 期，常看 20 / 80",
    formula: "MFI = 100 - 100 / (1 + 正資金流 / 負資金流)",
    summary:
      "MFI 類似加入成交量的 RSI，衡量價格與成交量共同形成的資金流向。",
    signals: [
      "MFI 高於 80 代表資金流入偏熱，需要看趨勢背景。",
      "價格創低但 MFI 背離，可提示賣壓減弱。",
    ],
    mistakes: ["把 MFI 超買超賣當成即時反轉。"],
    limitations: ["成交量異常日會影響讀數。"],
    related: ["rsi", "obv", "chaikin-money-flow"],
    core: true,
  },
  {
    slug: "chaikin-money-flow",
    name: "蔡金資金流量",
    en: "Chaikin Money Flow",
    abbr: "CMF",
    category: "成交量",
    uses: ["確認成交量", "追蹤強弱"],
    difficulty: "中階",
    params: "20 或 21 期",
    formula: "CMF = 資金流量成交量總和 / 成交量總和",
    summary:
      "CMF 觀察收市價在日內高低區間的位置並結合成交量，評估累積或派發壓力。",
    signals: [
      "CMF 高於零，代表資金流入傾向較明顯。",
      "CMF 轉負而價格仍高位，需留意承接不足。",
    ],
    mistakes: ["忽略裂口和高低價異常對指標的影響。"],
    limitations: ["需要可靠的高低價與成交量資料。"],
    related: ["mfi", "obv", "accumulation-distribution"],
  },
  {
    slug: "accumulation-distribution",
    name: "累積派發線",
    en: "Accumulation Distribution Line",
    abbr: "A/D",
    category: "成交量",
    uses: ["確認成交量", "追蹤強弱"],
    difficulty: "中階",
    params: "累積計算",
    formula: "A/D = 前值 + 資金流量乘數 x 成交量",
    summary:
      "A/D 線透過收市價在高低區間的位置判斷成交量是偏向累積還是派發。",
    signals: [
      "A/D 線上升但價格橫行，代表可能有隱性吸納。",
      "價格創高但 A/D 未確認，代表量價背離。",
    ],
    mistakes: ["忽略缺口會令日內高低區間解讀失真。"],
    limitations: ["與 OBV 一樣會受成交量異常影響。"],
    related: ["obv", "chaikin-money-flow", "mfi"],
  },
  {
    slug: "force-index",
    name: "強力指數",
    en: "Force Index",
    abbr: "FI",
    category: "成交量",
    uses: ["確認成交量", "找轉折"],
    difficulty: "中階",
    params: "13 期 EMA",
    formula: "Force Index = (今日收盤 - 昨日收盤) x 成交量",
    summary:
      "強力指數把價格變化與成交量相乘，用來觀察推動價格的力道。",
    signals: [
      "FI 由負轉正，代表短線買盤力道改善。",
      "價格創高但 FI 下降，代表上攻力道減弱。",
    ],
    mistakes: ["忽略高成交量日會讓數值大幅跳動。"],
    limitations: ["需平滑處理才能降低雜訊。"],
    related: ["volume", "volume-ma", "elder-ray"],
  },
  {
    slug: "ease-of-movement",
    name: "簡易波動指標",
    en: "Ease of Movement",
    abbr: "EOM",
    category: "成交量",
    uses: ["確認成交量", "追蹤強弱"],
    difficulty: "進階",
    params: "14 期",
    formula: "EOM 結合價格中點移動、成交量與高低差",
    summary:
      "EOM 衡量價格移動是否需要大量成交量，協助觀察升跌是否輕鬆。",
    signals: [
      "EOM 上升代表價格上行相對順暢。",
      "EOM 接近零代表價格推進效率低。",
    ],
    mistakes: ["在低流動性股票中過度相信數值。"],
    limitations: ["對成交量與波幅異常敏感。"],
    related: ["volume", "force-index", "mfi"],
  },
  {
    slug: "pivot-points",
    name: "樞軸點",
    en: "Pivot Points",
    abbr: "Pivot",
    category: "支撐阻力",
    uses: ["支撐阻力", "管理風險"],
    difficulty: "入門",
    params: "前一日高低收",
    formula: "P = (高 + 低 + 收) / 3；R/S 由 P 延伸",
    summary:
      "Pivot Points 根據前一交易日高低收計算日內支撐阻力，常用於短線觀察。",
    signals: [
      "價格站上 Pivot，代表日內偏強。",
      "R1/R2 可作為上方壓力參考，S1/S2 可作為下方支撐參考。",
    ],
    mistakes: ["把樞軸線當成必然反轉點，忽略趨勢與成交量。"],
    limitations: ["更適合短線，不宜直接套用長線投資決策。"],
    related: ["support-resistance", "vwap", "fibonacci-retracement"],
    core: true,
  },
  {
    slug: "fibonacci-retracement",
    name: "斐波那契回調",
    en: "Fibonacci Retracement",
    abbr: "Fib",
    category: "支撐阻力",
    uses: ["支撐阻力", "找轉折"],
    difficulty: "中階",
    params: "23.6%、38.2%、50%、61.8%、78.6%",
    formula: "以一段高低點距離乘以斐波那契比例",
    summary:
      "斐波那契回調用關鍵比例估算趨勢回調區域，常與前高低點、成交量一起使用。",
    signals: [
      "回調到 38.2% 或 61.8% 附近企穩，可觀察趨勢延續。",
      "多個支撐阻力重疊的比例區更值得留意。",
    ],
    mistakes: ["任意選高低點畫線，容易得到想看的結果。"],
    limitations: ["比例本身不是保證，需要價格行為確認。"],
    related: ["support-resistance", "trendline", "pivot-points"],
    core: true,
  },
  {
    slug: "support-resistance",
    name: "支撐與阻力",
    en: "Support and Resistance",
    abbr: "S/R",
    category: "支撐阻力",
    uses: ["支撐阻力", "管理風險"],
    difficulty: "入門",
    params: "前高、前低、成交密集區、整數關口",
    formula: "以市場反覆反應的價格區域定義",
    summary:
      "支撐與阻力是價格多次反應的區域，不是一條精確直線，常用於規劃進出與風險距離。",
    signals: [
      "突破阻力後回踩不跌破，該區可能轉為支撐。",
      "跌穿支撐後反彈受壓，該區可能轉為阻力。",
      "成交量配合突破，訊號通常更完整。",
    ],
    mistakes: [
      "把支撐阻力畫得過細，忽略市場實際是區域反應。",
      "只看單一時間週期。",
    ],
    limitations: ["重大消息或大市風險可直接穿透技術區域。"],
    related: ["pivot-points", "fibonacci-retracement", "vwap", "volume-profile"],
    core: true,
  },
  {
    slug: "price-channel",
    name: "價格通道",
    en: "Price Channel",
    abbr: "Channel",
    category: "通道/型態",
    uses: ["看趨勢", "支撐阻力"],
    difficulty: "入門",
    params: "近期高低點或平行趨勢線",
    formula: "由上軌與下軌包住價格運行區間",
    summary:
      "價格通道用上軌與下軌呈現趨勢或震盪範圍，適合觀察突破與回落位置。",
    signals: [
      "價格沿上升通道上移，代表趨勢仍有結構。",
      "跌破下軌，代表原有節奏被破壞。",
    ],
    mistakes: ["忽略通道會隨新高低點需要重畫。"],
    limitations: ["畫線具有主觀性。"],
    related: ["trendline", "donchian-channel", "support-resistance"],
  },
  {
    slug: "trendline",
    name: "趨勢線",
    en: "Trendline",
    abbr: "TL",
    category: "支撐阻力",
    uses: ["看趨勢", "支撐阻力"],
    difficulty: "入門",
    params: "連接兩個以上關鍵高點或低點",
    formula: "以價格高低點連線描述趨勢斜率",
    summary:
      "趨勢線協助視覺化市場節奏，常用於判斷趨勢是否保持或被破壞。",
    signals: [
      "上升趨勢線被有效跌破，代表趨勢風險提高。",
      "突破下降趨勢線，代表壓力結構可能改變。",
    ],
    mistakes: ["為了配合觀點而任意移動趨勢線。"],
    limitations: ["主觀性高，需搭配成交量與水平支撐阻力。"],
    related: ["support-resistance", "price-channel", "fibonacci-retracement"],
    core: true,
  },
  {
    slug: "chandelier-exit",
    name: "吊燈止蝕",
    en: "Chandelier Exit",
    abbr: "CE",
    category: "波動率",
    uses: ["管理風險", "看趨勢"],
    difficulty: "中階",
    params: "22 期高點，ATR 3 倍",
    formula: "多頭止蝕 = N 期最高價 - ATR 倍數",
    summary:
      "Chandelier Exit 用近期高點與 ATR 建立追蹤止蝕，適合趨勢交易中的風險管理。",
    signals: [
      "止蝕線隨新高上移，幫助鎖定趨勢利潤。",
      "價格跌破止蝕線，代表趨勢保護被觸發。",
    ],
    mistakes: ["把止蝕線當作預測線，而非風險規則。"],
    limitations: ["倍數設定會影響出場速度。"],
    related: ["atr", "supertrend", "volatility-stop"],
  },
  {
    slug: "elder-ray",
    name: "艾達透視指標",
    en: "Elder Ray",
    abbr: "Elder Ray",
    category: "動能",
    uses: ["追蹤強弱", "找轉折"],
    difficulty: "進階",
    params: "13 期 EMA",
    formula: "Bull Power = 高價 - EMA；Bear Power = 低價 - EMA",
    summary:
      "Elder Ray 比較高低價與 EMA 的距離，觀察買方和賣方力量是否轉變。",
    signals: [
      "Bull Power 上升代表多方推高能力增強。",
      "Bear Power 由負轉升，代表賣方壓力減弱。",
    ],
    mistakes: ["沒有先判斷主趨勢就解讀牛熊力量。"],
    limitations: ["適合搭配 EMA 趨勢背景。"],
    related: ["ema", "force-index", "macd"],
  },
  {
    slug: "relative-strength-comparative",
    name: "相對強弱比較",
    en: "Relative Strength Comparative",
    abbr: "RSC",
    category: "綜合",
    uses: ["篩選股票", "追蹤強弱"],
    difficulty: "中階",
    params: "個股價格 / 基準指數",
    formula: "RSC = 個股價格 / 比較基準價格",
    summary:
      "RSC 用個股與指數或同業比較，找出相對強勢或弱勢標的。",
    signals: [
      "RSC 上升代表個股跑贏比較基準。",
      "價格橫行但 RSC 上升，可能代表相對承接較佳。",
    ],
    mistakes: ["只看相對強，忽略絕對趨勢仍可能下跌。"],
    limitations: ["比較基準選擇會直接影響結論。"],
    related: ["roc", "beta", "correlation"],
  },
  {
    slug: "beta",
    name: "貝塔係數",
    en: "Beta",
    abbr: "Beta",
    category: "綜合",
    uses: ["管理風險", "篩選股票"],
    difficulty: "中階",
    params: "相對基準指數",
    formula: "Beta = 個股與市場共變異數 / 市場變異數",
    summary:
      "Beta 衡量個股相對市場的波動敏感度，常用於理解組合風險。",
    signals: [
      "Beta 高於 1，代表波動通常大於市場。",
      "Beta 低於 1，代表相對市場波動較低。",
    ],
    mistakes: ["把歷史 Beta 當成未來固定特性。"],
    limitations: ["不同計算期間會得到不同結果。"],
    related: ["correlation", "atr", "relative-strength-comparative"],
  },
  {
    slug: "correlation",
    name: "相關係數",
    en: "Correlation",
    abbr: "Corr",
    category: "綜合",
    uses: ["管理風險", "篩選股票"],
    difficulty: "中階",
    params: "20、60、120 期",
    formula: "相關係數介於 -1 至 +1",
    summary:
      "相關係數衡量兩個資產走勢同步程度，適合用於分散風險與組合檢查。",
    signals: [
      "接近 +1 代表同向性高，分散效果較低。",
      "接近 0 代表關係較弱。",
    ],
    mistakes: ["以為低相關會永久維持，危機時相關性可能上升。"],
    limitations: ["相關不代表因果。"],
    related: ["beta", "relative-strength-comparative", "standard-deviation"],
  },
  {
    slug: "advance-decline-line",
    name: "漲跌家數線",
    en: "Advance Decline Line",
    abbr: "A/D Line",
    category: "市場寬度",
    uses: ["確認成交量", "看趨勢"],
    difficulty: "中階",
    params: "上升家數 - 下跌家數累積",
    formula: "A/D Line = 前值 + 上升家數 - 下跌家數",
    summary:
      "A/D Line 衡量市場參與廣度，常用來確認指數升跌是否由多數股票支持。",
    signals: [
      "指數創高而 A/D Line 未創高，代表升勢廣度不足。",
      "A/D Line 率先回升，可能提示市場內部改善。",
    ],
    mistakes: ["用個股資料解讀市場寬度指標。"],
    limitations: ["需要完整市場成份資料。"],
    related: ["new-high-new-low", "bullish-percent-index", "volume"],
  },
  {
    slug: "new-high-new-low",
    name: "新高新低數",
    en: "New High New Low",
    abbr: "NH-NL",
    category: "市場寬度",
    uses: ["看趨勢", "確認成交量"],
    difficulty: "中階",
    params: "52 週新高與新低",
    formula: "NH-NL = 新高家數 - 新低家數",
    summary:
      "新高新低數觀察市場內部有多少股票創出重要高低位，用於判斷整體健康度。",
    signals: [
      "新高家數擴大，代表升勢參與度提高。",
      "指數高位但新低數增加，需留意內部轉弱。",
    ],
    mistakes: ["忽略不同市場上市股票質量差異。"],
    limitations: ["資料來源與成份範圍需一致。"],
    related: ["advance-decline-line", "bullish-percent-index"],
  },
  {
    slug: "bullish-percent-index",
    name: "看漲百分比指數",
    en: "Bullish Percent Index",
    abbr: "BPI",
    category: "市場寬度",
    uses: ["看趨勢", "追蹤強弱"],
    difficulty: "進階",
    params: "點數圖買入訊號比例",
    formula: "BPI = 有買入訊號股票數 / 股票總數 x 100",
    summary:
      "BPI 衡量市場內有多少股票處於看漲狀態，是市場寬度與情緒的綜合觀察。",
    signals: [
      "BPI 高位回落，代表市場廣度轉弱。",
      "BPI 低位回升，代表內部改善。",
    ],
    mistakes: ["用單一門檻判斷所有市場。"],
    limitations: ["依賴點數圖訊號定義。"],
    related: ["advance-decline-line", "new-high-new-low"],
  },
  {
    slug: "coppock-curve",
    name: "科波克曲線",
    en: "Coppock Curve",
    abbr: "Coppock",
    category: "動能",
    uses: ["找轉折", "看趨勢"],
    difficulty: "進階",
    params: "ROC 11、14，加權平均 10",
    formula: "Coppock = WMA10(ROC11 + ROC14)",
    summary:
      "Coppock Curve 常用於長週期市場底部觀察，結合多個 ROC 週期平滑後判斷動能回升。",
    signals: [
      "曲線在低位轉上，可能提示長週期動能改善。",
      "適合月線或週線，不適合日內交易。",
    ],
    mistakes: ["把長線指標用於短線進出。"],
    limitations: ["訊號少且慢。"],
    related: ["roc", "momentum", "macd"],
  },
  {
    slug: "zig-zag",
    name: "Zig Zag 指標",
    en: "Zig Zag",
    abbr: "Zig Zag",
    category: "通道/型態",
    uses: ["看趨勢", "找轉折"],
    difficulty: "中階",
    params: "5%、8%、10% 轉折幅度",
    formula: "只標示超過指定百分比的高低轉折",
    summary:
      "Zig Zag 過濾小波動，幫助辨識主要波段高低點與型態結構。",
    signals: [
      "可用來輔助觀察高低點是否抬高或下移。",
      "配合斐波那契可標示波段回調。",
    ],
    mistakes: ["忽略 Zig Zag 會隨新價格重畫。"],
    limitations: ["不適合作為即時訊號。"],
    related: ["fibonacci-retracement", "trendline", "price-channel"],
  },
  {
    slug: "heikin-ashi",
    name: "平均 K 線",
    en: "Heikin Ashi",
    abbr: "HA",
    category: "通道/型態",
    uses: ["看趨勢", "判斷盤整"],
    difficulty: "中階",
    params: "改良開高低收計算",
    formula: "HA Close = (開 + 高 + 低 + 收) / 4",
    summary:
      "Heikin Ashi 平滑 K 線雜訊，讓趨勢連續性更清楚，但價格不是原始成交價。",
    signals: [
      "連續實體同色代表趨勢較順。",
      "上下影線變長，代表趨勢猶豫增加。",
    ],
    mistakes: ["用 HA 價格當真實買賣成交價。"],
    limitations: ["不適合需要精確價格的下單決策。"],
    related: ["sma", "supertrend", "renko"],
  },
  {
    slug: "renko",
    name: "磚形圖",
    en: "Renko",
    abbr: "Renko",
    category: "通道/型態",
    uses: ["看趨勢", "判斷盤整"],
    difficulty: "進階",
    params: "固定磚塊大小或 ATR 磚",
    formula: "價格移動超過指定幅度才新增磚塊",
    summary:
      "Renko 以固定價格幅度畫圖，過濾時間因素與小波動，適合觀察趨勢結構。",
    signals: [
      "連續同向磚塊代表趨勢延續。",
      "反向磚塊出現代表短線結構改變。",
    ],
    mistakes: ["忽略磚塊大小會決定訊號靈敏度。"],
    limitations: ["不反映時間與成交量節奏。"],
    related: ["heikin-ashi", "atr", "zig-zag"],
  },
  {
    slug: "volume-profile",
    name: "成交量分佈",
    en: "Volume Profile",
    abbr: "VP",
    category: "成交量",
    uses: ["支撐阻力", "確認成交量"],
    difficulty: "進階",
    params: "可見範圍、固定區間",
    formula: "按價格區間累計成交量",
    summary:
      "Volume Profile 顯示不同價格區間的成交量，幫助辨識成交密集區、價值區與可能支撐阻力。",
    signals: [
      "高成交量節點常是市場記憶區。",
      "低成交量區被突破後，價格可能移動較快。",
    ],
    mistakes: ["把成交密集區當成必然反轉點。"],
    limitations: ["需要較細的成交資料，平台計算方式可能不同。"],
    related: ["support-resistance", "vwap", "volume"],
  },
  {
    slug: "kdj",
    name: "KDJ 指標",
    en: "KDJ Indicator",
    abbr: "KDJ",
    category: "動能",
    uses: ["找轉折", "判斷盤整"],
    difficulty: "中階",
    params: "9、3、3",
    formula: "J = 3K - 2D",
    summary:
      "KDJ 在 KD 基礎上加入 J 線，讓短線超買超賣與轉折提示更敏感。",
    signals: [
      "J 線快速升穿低位，代表短線反彈力度增加。",
      "高位 J 線急跌，代表短線轉弱。",
    ],
    mistakes: ["過度依賴 J 線，忽略它最容易出現雜訊。"],
    limitations: ["更適合短線輔助，需配合趨勢方向。"],
    related: ["stochastic", "rsi", "williams-r"],
  },
  {
    slug: "demarker",
    name: "DeMarker 指標",
    en: "DeMarker",
    abbr: "DeM",
    category: "動能",
    uses: ["找轉折", "追蹤強弱"],
    difficulty: "進階",
    params: "14 期",
    formula: "比較當前高低價與前期高低價變化",
    summary:
      "DeMarker 透過高低價變化衡量需求壓力，常用於尋找潛在超買超賣區。",
    signals: [
      "高於 0.7 代表偏熱，低於 0.3 代表偏冷。",
      "背離可提示趨勢動能變化。",
    ],
    mistakes: ["忽略趨勢市可長時間維持極端值。"],
    limitations: ["不如 RSI 普及，需先理解平台算法。"],
    related: ["rsi", "stochastic", "ultimate-oscillator"],
  },
  {
    slug: "mass-index",
    name: "質量指數",
    en: "Mass Index",
    abbr: "MI",
    category: "波動率",
    uses: ["找轉折", "觀察波動"],
    difficulty: "進階",
    params: "9、25 期",
    formula: "以高低價區間的 EMA 比率累計",
    summary:
      "Mass Index 觀察高低價區間擴張與收縮，主要用於提示可能的趨勢反轉。",
    signals: [
      "Mass Index 高位回落可能提示波幅結構轉變。",
      "需搭配趨勢方向指標確認反轉方向。",
    ],
    mistakes: ["以為它能指出上升或下跌方向。"],
    limitations: ["只提示波動結構，不提示方向。"],
    related: ["atr", "standard-deviation", "adx"],
  },
  {
    slug: "ulcer-index",
    name: "潰瘍指數",
    en: "Ulcer Index",
    abbr: "UI",
    category: "波動率",
    uses: ["管理風險", "篩選股票"],
    difficulty: "進階",
    params: "14 或 30 期",
    formula: "衡量從近期高點回撤幅度的平方平均",
    summary:
      "Ulcer Index 專注下行回撤壓力，比一般波動率更貼近持有者承受的痛感。",
    signals: [
      "UI 上升代表回撤壓力增加。",
      "同樣收益下 UI 較低的標的，持有體驗通常較平穩。",
    ],
    mistakes: ["只看回撤壓力，不看流動性和基本面風險。"],
    limitations: ["不衡量上行波動。"],
    related: ["standard-deviation", "atr", "beta"],
  },
  {
    slug: "ppo",
    name: "百分比價格震盪器",
    en: "Percentage Price Oscillator",
    abbr: "PPO",
    category: "動能",
    uses: ["追蹤強弱", "看趨勢"],
    difficulty: "中階",
    params: "12、26、9",
    formula: "PPO = (EMA12 - EMA26) / EMA26 x 100",
    summary:
      "PPO 是百分比化的 MACD，方便比較不同股價水平的動能變化。",
    signals: [
      "PPO 升穿訊號線代表短期動能改善。",
      "PPO 高於零軸代表短期 EMA 高於長期 EMA。",
      "不同股票之間可用 PPO 比較相對動能幅度。",
    ],
    mistakes: ["把 PPO 與 MACD 同時當成兩個獨立證據，實際上兩者高度相關。"],
    limitations: ["仍然源自均線，趨勢轉折初期會有延遲。"],
    related: ["macd", "ema", "roc"],
  },
  {
    slug: "kst",
    name: "確知指標",
    en: "Know Sure Thing",
    abbr: "KST",
    category: "動能",
    uses: ["追蹤強弱", "找轉折"],
    difficulty: "進階",
    params: "多組 ROC 平滑加權",
    formula: "KST = 多個平滑 ROC 的加權總和",
    summary:
      "KST 結合多個不同週期的 ROC，嘗試用多週期動能確認趨勢轉折。",
    signals: [
      "KST 升穿訊號線表示多週期動能改善。",
      "KST 與價格背離可提示趨勢力度不足。",
      "零軸附近的交叉通常比極端位置更需要價格確認。",
    ],
    mistakes: ["把複雜指標視為更準確，忽略它仍由價格變化衍生。"],
    limitations: ["參數較多，容易被過度最佳化。"],
    related: ["roc", "momentum", "macd"],
  },
  {
    slug: "dpo",
    name: "去趨勢價格震盪器",
    en: "Detrended Price Oscillator",
    abbr: "DPO",
    category: "動能",
    uses: ["判斷盤整", "找轉折"],
    difficulty: "中階",
    params: "20 期",
    formula: "DPO = 收市價 - 位移後的 SMA",
    summary:
      "DPO 移除較長期趨勢影響，重點觀察價格相對週期平均的短中期波動。",
    signals: [
      "DPO 高於零代表價格高於去趨勢後平均水平。",
      "DPO 由低位回升可提示週期性反彈。",
      "震盪市中比強趨勢市更容易解讀。",
    ],
    mistakes: ["在明顯單邊趨勢中用 DPO 逆勢找頂底。"],
    limitations: ["不適合判斷長期趨勢方向。"],
    related: ["sma", "cci", "roc"],
  },
  {
    slug: "chande-momentum-oscillator",
    name: "錢德動量震盪器",
    en: "Chande Momentum Oscillator",
    abbr: "CMO",
    category: "動能",
    uses: ["追蹤強弱", "找轉折"],
    difficulty: "中階",
    params: "14 或 20 期",
    formula: "CMO = (上升總和 - 下跌總和) / (上升總和 + 下跌總和) x 100",
    summary:
      "CMO 與 RSI 類似，但直接比較上升與下跌動量總和，讀數介於 -100 至 +100。",
    signals: [
      "CMO 高於 +50 代表上升動量明顯。",
      "CMO 低於 -50 代表下跌動量明顯。",
      "背離可用作動能衰退預警。",
    ],
    mistakes: ["把固定高低門檻套用在所有股票和市況。"],
    limitations: ["強趨勢中可長時間維持極端值。"],
    related: ["rsi", "momentum", "roc"],
  },
  {
    slug: "relative-vigor-index",
    name: "相對活力指數",
    en: "Relative Vigor Index",
    abbr: "RVI",
    category: "動能",
    uses: ["追蹤強弱", "找轉折"],
    difficulty: "進階",
    params: "10 或 14 期",
    formula: "RVI 比較收市價相對開盤價的力度並以高低區間標準化",
    summary:
      "RVI 假設強勢市場傾向收在開盤價之上，弱勢市場傾向收在開盤價之下。",
    signals: [
      "RVI 升穿訊號線代表收盤動能改善。",
      "RVI 與價格背離可提示趨勢疲弱。",
      "配合趨勢濾網使用比單獨使用更穩健。",
    ],
    mistakes: ["忽略缺口開盤會影響開收價關係。"],
    limitations: ["對日內結構和開收盤位置較敏感。"],
    related: ["rsi", "stochastic", "macd"],
  },
  {
    slug: "fisher-transform",
    name: "費雪轉換",
    en: "Fisher Transform",
    abbr: "Fisher",
    category: "動能",
    uses: ["找轉折", "判斷盤整"],
    difficulty: "進階",
    params: "9 或 10 期",
    formula: "將價格位置標準化後套用 Fisher 轉換",
    summary:
      "Fisher Transform 嘗試把價格分布轉成更接近常態的形狀，使極端轉折更容易辨識。",
    signals: [
      "Fisher 線升穿觸發線可提示短線轉強。",
      "極端讀數後反向交叉，常被用於觀察轉折。",
      "震盪市中的訊號通常較清楚。",
    ],
    mistakes: ["把數學轉換後的極端值視為必然反轉。"],
    limitations: ["對參數和價格標準化方式敏感。"],
    related: ["stochastic", "demarker", "cci"],
  },
  {
    slug: "vortex-indicator",
    name: "漩渦指標",
    en: "Vortex Indicator",
    abbr: "VI",
    category: "趨勢",
    uses: ["看趨勢", "找轉折"],
    difficulty: "中階",
    params: "14 期",
    formula: "VI+ / VI- 由相鄰高低點距離除以真實波幅累計而成",
    summary:
      "Vortex Indicator 用正負方向移動距離觀察趨勢方向變化，概念上接近 DMI。",
    signals: [
      "VI+ 升穿 VI- 代表上升方向性增強。",
      "VI- 升穿 VI+ 代表下跌方向性增強。",
      "交叉後若 ADX 或成交量同步確認，訊號較完整。",
    ],
    mistakes: ["在橫行市追逐每次 VI 交叉。"],
    limitations: ["方向交叉不代表趨勢強度足夠，需要濾網確認。"],
    related: ["dmi", "adx", "atr"],
  },
  {
    slug: "linear-regression-slope",
    name: "線性回歸斜率",
    en: "Linear Regression Slope",
    abbr: "LRS",
    category: "趨勢",
    uses: ["看趨勢", "追蹤強弱"],
    difficulty: "進階",
    params: "20、50、100 期",
    formula: "以線性回歸線斜率衡量價格趨勢角度",
    summary:
      "線性回歸斜率用統計方式衡量趨勢方向與陡峭程度，適合比較趨勢效率。",
    signals: [
      "斜率由負轉正代表回歸趨勢方向改善。",
      "斜率持續上升代表上升趨勢加速。",
      "斜率走平代表趨勢效率下降。",
    ],
    mistakes: ["把回歸斜率當成未來路徑預測。"],
    limitations: ["對觀察期間和異常值敏感。"],
    related: ["sma", "kama", "relative-strength-comparative"],
  },
  {
    slug: "moving-average-envelope",
    name: "移動平均包絡線",
    en: "Moving Average Envelope",
    abbr: "MA Envelope",
    category: "通道/型態",
    uses: ["支撐阻力", "觀察波動"],
    difficulty: "中階",
    params: "20 期均線，上下 2% 至 5%",
    formula: "上軌/下軌 = MA x (1 +/- 百分比)",
    summary:
      "MA Envelope 在均線上下加入固定百分比通道，用於觀察價格偏離平均的程度。",
    signals: [
      "價格接近上軌代表相對均線偏強或偏熱。",
      "價格接近下軌代表相對均線偏弱或偏冷。",
      "通道斜率可輔助判斷趨勢方向。",
    ],
    mistakes: ["固定百分比不會自動適應不同股票的波動率。"],
    limitations: ["高波動股票需要較寬通道，低波動股票需要較窄通道。"],
    related: ["sma", "bollinger-bands", "keltner-channel"],
  },
  {
    slug: "bollinger-bandwidth",
    name: "布林帶寬度",
    en: "Bollinger Bandwidth",
    abbr: "BBW",
    category: "波動率",
    uses: ["觀察波動", "判斷盤整"],
    difficulty: "中階",
    params: "20 期，2 倍標準差",
    formula: "BBW = (上軌 - 下軌) / 中軌",
    summary:
      "布林帶寬度量化布林帶收窄與擴張，特別適合觀察波動壓縮。",
    signals: [
      "BBW 處於低位代表波動壓縮。",
      "BBW 由低位快速上升代表波動擴張。",
      "需配合價格突破方向判斷後續情境。",
    ],
    mistakes: ["把帶寬收窄直接解讀成必然上升。"],
    limitations: ["只提示波動狀態，不提示方向。"],
    related: ["bollinger-bands", "standard-deviation", "atr"],
  },
  {
    slug: "percent-b",
    name: "布林百分比",
    en: "Bollinger %B",
    abbr: "%B",
    category: "波動率",
    uses: ["觀察波動", "找轉折"],
    difficulty: "中階",
    params: "20 期，2 倍標準差",
    formula: "%B = (價格 - 下軌) / (上軌 - 下軌)",
    summary:
      "%B 顯示價格在布林帶上下軌之間的位置，方便量化碰軌、突破和回歸。",
    signals: [
      "%B 高於 1 代表價格突破上軌。",
      "%B 低於 0 代表價格跌破下軌。",
      "%B 回到 0.5 附近代表價格回到中軌附近。",
    ],
    mistakes: ["把 %B 超過 1 視為必然回落，忽略趨勢可沿上軌延續。"],
    limitations: ["依賴布林帶參數，與標準差假設相關。"],
    related: ["bollinger-bands", "bollinger-bandwidth", "rsi"],
  },
  {
    slug: "historical-volatility",
    name: "歷史波動率",
    en: "Historical Volatility",
    abbr: "HV",
    category: "波動率",
    uses: ["觀察波動", "管理風險"],
    difficulty: "中階",
    params: "20、60、252 期",
    formula: "以收益率標準差年化計算歷史波動率",
    summary:
      "Historical Volatility 衡量過去價格收益率的波動程度，常用於風險和期權背景分析。",
    signals: [
      "HV 上升代表歷史價格波動變大。",
      "HV 下降代表價格變動較平穩。",
      "與 ATR 一起看，可同時理解百分比和價格距離風險。",
    ],
    mistakes: ["以為歷史波動率可直接預測未來波動。"],
    limitations: ["重大事件前後，歷史數值可能低估未來風險。"],
    related: ["standard-deviation", "atr", "natr"],
  },
  {
    slug: "natr",
    name: "標準化平均真實波幅",
    en: "Normalized Average True Range",
    abbr: "NATR",
    category: "波動率",
    uses: ["管理風險", "篩選股票"],
    difficulty: "中階",
    params: "14 期",
    formula: "NATR = ATR / 收市價 x 100",
    summary:
      "NATR 把 ATR 百分比化，方便比較不同股價水平股票的波動幅度。",
    signals: [
      "NATR 高代表相對價格的波動較大。",
      "NATR 低代表相對價格的波動較小。",
      "適合用於篩選波動過高或過低的股票。",
    ],
    mistakes: ["把低 NATR 視為安全，忽略流動性和事件風險。"],
    limitations: ["仍然是歷史波動描述，不預測方向。"],
    related: ["atr", "historical-volatility", "ulcer-index"],
  },
  {
    slug: "pvt",
    name: "價量趨勢指標",
    en: "Price Volume Trend",
    abbr: "PVT",
    category: "成交量",
    uses: ["確認成交量", "追蹤強弱"],
    difficulty: "中階",
    params: "累積計算",
    formula: "PVT = 前值 + 成交量 x 價格變化率",
    summary:
      "PVT 把成交量按價格變化百分比加權累積，比 OBV 更重視漲跌幅大小。",
    signals: [
      "PVT 上升代表量價趨勢偏向累積。",
      "價格創高但 PVT 未確認，可能代表成交量不足。",
      "PVT 率先轉強可作為資金流改善提示。",
    ],
    mistakes: ["忽略低流動性股票的成交量可能失真。"],
    limitations: ["累積型指標容易受異常成交日影響。"],
    related: ["obv", "accumulation-distribution", "volume"],
  },
  {
    slug: "nvi",
    name: "負成交量指標",
    en: "Negative Volume Index",
    abbr: "NVI",
    category: "成交量",
    uses: ["確認成交量", "追蹤強弱"],
    difficulty: "進階",
    params: "只在成交量低於前日時計算",
    formula: "成交量下降日按價格變化率更新 NVI",
    summary:
      "NVI 側重低成交量日的價格變化，常被用來觀察較安靜交易日的資金傾向。",
    signals: [
      "NVI 上升代表低量日價格仍有承接。",
      "NVI 跌破其長期均線可提示市場內部轉弱。",
      "與 PVI 比較可觀察高低量日行為差異。",
    ],
    mistakes: ["把低成交量日解讀成必然是聰明資金行為。"],
    limitations: ["理論假設較強，需搭配價格和市場背景。"],
    related: ["pvi", "obv", "volume"],
  },
  {
    slug: "pvi",
    name: "正成交量指標",
    en: "Positive Volume Index",
    abbr: "PVI",
    category: "成交量",
    uses: ["確認成交量", "追蹤強弱"],
    difficulty: "進階",
    params: "只在成交量高於前日時計算",
    formula: "成交量上升日按價格變化率更新 PVI",
    summary:
      "PVI 側重高成交量日的價格變化，用於觀察市場活躍交易日的方向。",
    signals: [
      "PVI 上升代表放量日價格偏強。",
      "PVI 下跌代表活躍交易日賣壓較重。",
      "與 NVI 互相比較可分辨高量與低量日的主導方向。",
    ],
    mistakes: ["把放量日全部視為好訊號，忽略高位放量滯漲。"],
    limitations: ["容易受消息日和異常成交影響。"],
    related: ["nvi", "volume-ma", "obv"],
  },
  {
    slug: "chaikin-oscillator",
    name: "蔡金震盪器",
    en: "Chaikin Oscillator",
    abbr: "Chaikin Osc",
    category: "成交量",
    uses: ["確認成交量", "找轉折"],
    difficulty: "進階",
    params: "A/D 線 3 日 EMA 與 10 日 EMA",
    formula: "Chaikin Oscillator = EMA3(A/D) - EMA10(A/D)",
    summary:
      "Chaikin Oscillator 用 A/D 線的快慢 EMA 差值觀察資金流動能變化。",
    signals: [
      "震盪器升穿零軸代表資金流動能改善。",
      "價格創高但震盪器走弱，可能出現量價背離。",
      "配合 CMF 可同時觀察資金流方向與動能。",
    ],
    mistakes: ["忽略 A/D 線本身受高低收位置影響。"],
    limitations: ["需要可靠的高低價和成交量資料。"],
    related: ["accumulation-distribution", "chaikin-money-flow", "obv"],
  },
  {
    slug: "volume-oscillator",
    name: "成交量震盪器",
    en: "Volume Oscillator",
    abbr: "VO",
    category: "成交量",
    uses: ["確認成交量", "觀察波動"],
    difficulty: "中階",
    params: "短期量均線與長期量均線",
    formula: "VO = 短期成交量均線 - 長期成交量均線",
    summary:
      "Volume Oscillator 比較短長期成交量均線，幫助辨識成交量是否正在擴張。",
    signals: [
      "VO 高於零代表短期成交量高於長期平均。",
      "VO 上升代表成交量擴張。",
      "突破時 VO 同步轉正，訊號較完整。",
    ],
    mistakes: ["只看成交量擴張，不看價格突破是否有效。"],
    limitations: ["成交量放大可能來自好消息，也可能來自恐慌賣出。"],
    related: ["volume-ma", "volume", "obv"],
  },
  {
    slug: "trin",
    name: "阿姆斯指數",
    en: "Arms Index",
    abbr: "TRIN",
    category: "市場寬度",
    uses: ["確認成交量", "看趨勢"],
    difficulty: "進階",
    params: "上升/下跌家數與成交量比率",
    formula: "TRIN = (上升家數 / 下跌家數) / (上升成交量 / 下跌成交量)",
    summary:
      "TRIN 結合漲跌家數與成交量，常用於觀察大市內部買賣壓力。",
    signals: [
      "TRIN 高於 1 通常代表下跌成交壓力較重。",
      "TRIN 低於 1 通常代表上升成交較佔優。",
      "極端讀數可用作市場情緒過熱或恐慌參考。",
    ],
    mistakes: ["把單日 TRIN 極端值直接當成反轉訊號。"],
    limitations: ["需要完整市場寬度資料，不適用單一股票。"],
    related: ["advance-decline-line", "new-high-new-low", "bullish-percent-index"],
  },
  {
    slug: "mcclellan-oscillator",
    name: "麥克連震盪器",
    en: "McClellan Oscillator",
    abbr: "McClellan",
    category: "市場寬度",
    uses: ["看趨勢", "找轉折"],
    difficulty: "進階",
    params: "漲跌家數差的 19 日與 39 日 EMA",
    formula: "McClellan Oscillator = EMA19(漲跌差) - EMA39(漲跌差)",
    summary:
      "McClellan Oscillator 用市場漲跌家數差的快慢 EMA 衡量市場廣度動能。",
    signals: [
      "震盪器升穿零軸代表市場內部動能改善。",
      "指數創高但震盪器背離，代表廣度不足。",
      "極端低位回升可提示市場恐慌舒緩。",
    ],
    mistakes: ["用它判斷單一股票走勢。"],
    limitations: ["資料來源、成份範圍和市場結構會影響解讀。"],
    related: ["advance-decline-line", "trin", "new-high-new-low"],
  },
  {
    slug: "put-call-ratio",
    name: "認沽認購比率",
    en: "Put Call Ratio",
    abbr: "PCR",
    category: "綜合",
    uses: ["追蹤強弱", "管理風險"],
    difficulty: "進階",
    params: "成交量或未平倉合約 PCR",
    formula: "PCR = Put 成交量 / Call 成交量",
    summary:
      "Put/Call Ratio 用期權市場的認沽與認購活動觀察市場情緒，常作反向或風險背景指標。",
    signals: [
      "PCR 偏高代表避險或看淡需求較強。",
      "PCR 偏低代表看好或投機情緒較熱。",
      "極端讀數需與價格和波動率一起判斷。",
    ],
    mistakes: ["把 PCR 高低直接等同大市必然反向。"],
    limitations: ["期權市場結構和對沖需求會令讀數難以單純解讀。"],
    related: ["historical-volatility", "trin", "relative-strength-comparative"],
  },
];

const formulaDetails = {
  kama: {
    type: "algorithm",
    formula:
      "ER_t = |C_t - C_(t-n)| / Σ|C_i - C_(i-1)|\nSC_t = [ER_t × (2/(fast+1) - 2/(slow+1)) + 2/(slow+1)]²\nKAMA_t = KAMA_(t-1) + SC_t × [C_t - KAMA_(t-1)]",
    note: "常見設定為 n=10、fast=2、slow=30；首值和暖機期會令不同平台首段數值略有差異。",
  },
  "ma-ribbon": {
    type: "algorithm",
    formula: "Ribbon_t = { MA(C, n) | n 屬於預先選定的週期集合 }",
    note: "均線帶不是單一指標公式；必須先寫明採用 SMA 或 EMA，以及每條均線的週期。",
  },
  psar: {
    type: "algorithm",
    formula: "SAR_(t+1) = SAR_t + AF_t × (EP_t - SAR_t)",
    note: "EP 是目前趨勢的極值點；AF 常由 0.02 起按創新極值遞增至上限 0.20。反轉時，EP、AF 和 SAR 的重設規則須一併指定。",
  },
  "volatility-stop": {
    type: "algorithm",
    formula: "長倉止蝕_t = 近期最高基準價 - m × ATR_t；短倉止蝕_t = 近期最低基準價 + m × ATR_t",
    note: "不同平台對基準價、回看期與是否只向有利方向移動有不同版本；使用前要在平台設定中核對。",
  },
  obv: {
    type: "exact",
    formula: "OBV_t = OBV_(t-1) + V_t（C_t > C_(t-1)）\nOBV_t = OBV_(t-1) - V_t（C_t < C_(t-1)）\nOBV_t = OBV_(t-1)（C_t = C_(t-1)）",
    note: "OBV 的起始值可以任意，重點是累積線的方向、斜率和與價格是否背離。",
  },
  "ease-of-movement": {
    type: "algorithm",
    formula: "MidMove_t = (H_t + L_t)/2 - (H_(t-1) + L_(t-1))/2\nBoxRatio_t = V_t / (H_t - L_t)\nEOM_t = MidMove_t / BoxRatio_t",
    note: "通常再對 EOM 做 n 期平均；成交量縮放與 Box Ratio 定義在平台之間可能不同。",
  },
  "fibonacci-retracement": {
    type: "chartMethod",
    formula: "上升波段回調位_r = H - r × (H - L)；下降波段反彈位_r = L + r × (H - L)",
    note: "r 常取 0.236、0.382、0.500、0.618、0.786。關鍵不是比例本身，而是先用一致規則界定有效波段的 H 和 L。",
  },
  "support-resistance": {
    type: "chartMethod",
    formula: "沒有唯一公式；以曾出現明顯供求反應的價格區域作候選支撐或阻力。",
    note: "必須寫明區域如何產生，例如前高前低、成交密集區、樞紐點或整數關口，否則無法重現。",
  },
  "price-channel": {
    type: "algorithm",
    formula: "Upper_t = max(H, n)；Lower_t = min(L, n)；Mid_t = (Upper_t + Lower_t)/2",
    note: "這是最高低價通道的可重現版本；若採平行趨勢線，應改標為圖表方法並說明選點規則。",
  },
  trendline: {
    type: "chartMethod",
    formula: "斜率 m = (P_2 - P_1) / (t_2 - t_1)；趨勢線 P_t = P_1 + m × (t - t_1)",
    note: "公式只描述直線。可否成為趨勢線，取決於高低點的選取、接觸次數與是否被有效跌穿或升穿。",
  },
  "zig-zag": {
    type: "algorithm",
    formula: "當價格自最後確認轉折反向移動至少 z% 或 m × ATR 時，才確認新的轉折點。",
    note: "Zig Zag 會隨後續價格更新最後一個轉折，屬事後整理工具，不應把未確認的末端轉折當即時訊號。",
  },
  renko: {
    type: "chartMethod",
    formula: "磚塊大小 = B；價格相對上一磚收市每跨越 B，才新增一磚。",
    note: "B 可固定或以 ATR 設定；價格來源、磚塊確認時間和歷史重建方式會影響結果，回測必須核對平台版本。",
  },
  "volume-profile": {
    type: "algorithm",
    formula: "V(p_k) = Σ volume_i，其中第 i 根 K 線的成交量按規則分配至價格桶 p_k。",
    note: "價格桶寬度、K 線內成交量分配和可見範圍由平台決定；沒有逐筆成交資料時，它是近似分配而非逐筆成交真相。",
  },
  demarker: {
    type: "exact",
    formula: "DeMax_t = max(H_t - H_(t-1), 0)；DeMin_t = max(L_(t-1) - L_t, 0)\nDeM_t = SMA(DeMax, n) / [SMA(DeMax, n) + SMA(DeMin, n)]",
    note: "常用 n=14；有些平台使用不同平滑方法，讀數閾值不可跨平台直接比較。",
  },
  "mass-index": {
    type: "exact",
    formula: "Range_t = H_t - L_t；EMA1_t = EMA(Range, 9)；EMA2_t = EMA(EMA1, 9)\nMass Index_t = Σ_(25 期) (EMA1_t / EMA2_t)",
    note: "常見用法會觀察 25/26.5 的波段反轉條件；它提示波幅結構改變，不提供方向。",
  },
  "ulcer-index": {
    type: "exact",
    formula: "R_t = 100 × [C_t / max(C, n) - 1]\nUI_t = √(平均值(R_t², n))",
    note: "UI 只量度由高位向下的回撤壓力；採收市價、總回報或不同回看期會得到不同結果。",
  },
  "relative-vigor-index": {
    type: "algorithm",
    formula: "RVI_t = SMA_n[(a + 2b + 2c + d) / (e + 2f + 2g + h)]\na..d 為最近四期 C-O；e..h 為最近四期 H-L。",
    note: "常見版本再以 RVI 的四期加權平均產生訊號線；平台的平滑期和訊號線設定要一併記錄。",
  },
  "fisher-transform": {
    type: "algorithm",
    formula: "x_t = clamp[0.33 × 2 × ((P_t - L_n)/(H_n - L_n) - 0.5) + 0.67x_(t-1), -0.999, 0.999]\nF_t = 0.5 × ln[(1 + x_t)/(1 - x_t)] + 0.5F_(t-1)",
    note: "P 常用中位價或典型價。平滑常數、截斷值和初值會改變極端讀數，必須隨平台版本一同核對。",
  },
  "linear-regression-slope": {
    type: "exact",
    formula: "m = [nΣ(xy) - ΣxΣy] / [nΣ(x²) - (Σx)²]",
    note: "x 通常是期間索引、y 是收市價。斜率單位受價格尺度影響；跨股票比較可改用百分比或標準化斜率。",
  },
  "historical-volatility": {
    type: "exact",
    formula: "r_t = ln(C_t / C_(t-1))；HV_t = stdev(r, n) × √A",
    note: "A 是年化日數，例如日線常用 252。採簡單報酬、日曆日或交易日會令數值不同。",
  },
  nvi: {
    type: "exact",
    formula: "若 V_t < V_(t-1)：NVI_t = NVI_(t-1) × [1 + (C_t - C_(t-1))/C_(t-1)]；否則 NVI_t = NVI_(t-1)。",
    note: "常以 1,000 作起始值；起始值不影響比例走勢。",
  },
  trix: {
    type: "exact",
    formula: "EMA3_t = EMA(EMA(EMA(C, n), n), n)\nTRIX_t = 100 × (EMA3_t - EMA3_(t-1)) / EMA3_(t-1)",
    note: "常再對 TRIX 加一條訊號 EMA；三重平滑帶來較少雜訊，也會令轉折確認較慢。",
  },
  "ultimate-oscillator": {
    type: "exact",
    formula: "BP_t = C_t - min(L_t, C_(t-1))；TR_t = max(H_t, C_(t-1)) - min(L_t, C_(t-1))\nUO_t = 100 × [4×Σ(BP,7)/Σ(TR,7) + 2×Σ(BP,14)/Σ(TR,14) + Σ(BP,28)/Σ(TR,28)] / 7",
    note: "7、14、28 是常見預設；若平台改變週期或權重，讀數不可與這個版本直接比較。",
  },
  tsi: {
    type: "exact",
    formula: "M_t = C_t - C_(t-1)\nTSI_t = 100 × EMA_s[EMA_l(M)] / EMA_s[EMA_l(|M|)]",
    note: "l、s 常見為 25、13；訊號線是另一條平滑線，應與主值分開記錄。",
  },
  adx: {
    type: "algorithm",
    formula: "+DM_t = max(H_t-H_(t-1), 0)；-DM_t = max(L_(t-1)-L_t, 0)（兩者只保留較大者）\n+DI = 100×RMA(+DM,n)/ATR；-DI = 100×RMA(-DM,n)/ATR\nDX = 100×|+DI-(-DI)|/(+DI+(-DI))；ADX = RMA(DX,n)",
    note: "常見版本用 Wilder RMA；若使用 SMA、EMA 或不同首值，前段讀數會不同。ADX 只量度趨勢強度，不提供方向。",
  },
  aroon: {
    type: "exact",
    formula: "Aroon Up_t = 100 × [n - 距離最近 n 期最高價的期數] / n\nAroon Down_t = 100 × [n - 距離最近 n 期最低價的期數] / n",
    note: "若同一窗口有多個相同高低點，平台選取最早或最近點的規則會影響結果。",
  },
  supertrend: {
    type: "algorithm",
    formula: "Basic Upper_t = (H_t+L_t)/2 + m×ATR_t；Basic Lower_t = (H_t+L_t)/2 - m×ATR_t\nFinal bands 依前一根收市與前值只向有利方向更新；收市跨越 Final band 時切換趨勢狀態。",
    note: "ATR 平滑、最終帶更新和同棒反轉處理會因平台而異；設定 ATR 期數、倍數與版本後才可重現。",
  },
  ichimoku: {
    type: "exact",
    formula: "Tenkan = [HH(9)+LL(9)]/2；Kijun = [HH(26)+LL(26)]/2\nSpan A = (Tenkan+Kijun)/2，前移 26 期；Span B = [HH(52)+LL(52)]/2，前移 26 期\nChikou = C_t，後移 26 期",
    note: "9、26、52 是傳統設定；雲層的前移與遲行線的後移是顯示規則，回測時要避免把未完成 K 線或未來資料當成當下可見資料。",
  },
  dmi: {
    type: "exact",
    formula: "+DM_t = max(H_t-H_(t-1), 0)；-DM_t = max(L_(t-1)-L_t, 0)（兩者只保留較大者）\n+DI_t = 100×RMA(+DM,n)/ATR_t；-DI_t = 100×RMA(-DM,n)/ATR_t",
    note: "DMI 是方向部分；ADX 是以 +DI 與 -DI 再計算的趨勢強度。兩者應分開解讀。",
  },
  kst: {
    type: "algorithm",
    formula: "KST_t = w1×RCMA(ROC(r1),s1) + w2×RCMA(ROC(r2),s2) + w3×RCMA(ROC(r3),s3) + w4×RCMA(ROC(r4),s4)",
    note: "KST 由四組 ROC、平滑期和權重組成；未寫明 r、s、w 的版本不具可重現性。",
  },
  dpo: {
    type: "algorithm",
    formula: "DPO_t = C_(t-[n/2+1]) - SMA_n(C)_t",
    note: "位移規則常取 floor(n/2)+1；有些平台把均線或價格向相反方向繪製，先核對圖上的時間對齊。",
  },
  "vortex-indicator": {
    type: "exact",
    formula: "VM+_t = |H_t - L_(t-1)|；VM-_t = |L_t - H_(t-1)|\nVI+_t = Σ(VM+,n)/Σ(TR,n)；VI-_t = Σ(VM-,n)/Σ(TR,n)",
    note: "常用 n=14。TR 的定義和窗口對齊要與平台一致，否則交叉位置可能不同。",
  },
  pvt: {
    type: "exact",
    formula: "PVT_t = PVT_(t-1) + V_t × (C_t - C_(t-1)) / C_(t-1)",
    note: "PVT 是累積指標；起始值本身不重要，重點是斜率、轉折和量價是否同步。",
  },
  "volume-oscillator": {
    type: "algorithm",
    formula: "VO_t = 100 × [MA_short(V)_t - MA_long(V)_t] / MA_long(V)_t",
    note: "部分平台只顯示兩條量均線的差值而不百分比化；必須標示短長週期及輸出版本。",
  },
  pvi: {
    type: "exact",
    formula: "若 V_t > V_(t-1)：PVI_t = PVI_(t-1) × [1 + (C_t - C_(t-1))/C_(t-1)]；否則 PVI_t = PVI_(t-1)。",
    note: "常以 1,000 作起始值；它描述高成交量日的價格變化，並非資金流量的直接量度。",
  },
};

const formulaTypeLabels = {
  exact: "可重現公式",
  algorithm: "可重現算法",
  chartMethod: "圖表方法，不是單一公式",
};

function formulaDetailFor(item) {
  return (
    formulaDetails[item.slug] || {
      type: "exact",
      formula: item.formula,
      note: "此處採用教材的常用定義；如平台採用不同平滑方法、價格來源或暖機規則，數值可能略有差異。",
    }
  );
}

function renderIndicatorFormula(item) {
  const detail = formulaDetailFor(item);
  return `
    <div class="formula">${escapeHtml(detail.formula)}</div>
    <p class="formula-meta"><strong>計算類型：</strong>${escapeHtml(formulaTypeLabels[detail.type] || formulaTypeLabels.algorithm)}。${escapeHtml(detail.note)}</p>
  `;
}

const defaultFaq = [
  {
    q: "這個指標可以單獨用來買賣嗎？",
    a: "不建議。技術指標適合用來描述趨勢、動能、成交量或風險，實際判斷仍需要結合價格結構、成交量、市況和風險管理。",
  },
  {
    q: "參數是否必須跟教材範例一樣？",
    a: "常用參數是學習起點，不是唯一答案。短線參數更敏感但雜訊較多，長線參數更穩定但反應較慢。",
  },
];

const indicatorLevels = [
  {
    value: "入門",
    label: "入門",
    title: "先學這幾個就夠用",
    desc: "先把最常見、最容易配合價格位置的指標學穩。看得懂趨勢、力度、成交量和風險，再談更多工具。",
  },
  {
    value: "中階",
    label: "中級",
    title: "有基礎後再加進來",
    desc: "這一層不是為了堆指標，而是分清各自工作：誰看方向、誰看力度、哪一個只負責提示風險。",
  },
  {
    value: "進階",
    label: "進階",
    title: "進階研究用，不作單一買賣依據",
    desc: "這些工具更適合做篩選、專題研究或策略輔助。背景和風險未看清楚前，不要單靠它們下決定。",
  },
];

const humanSummaryBySlug = {
  sma: "SMA 是最基本的趨勢尺。線慢一點不是問題，重點是看清股價究竟站在平均成本之上，還是已經跌回成本線下。",
  ema: "EMA 貼市一點，適合看短中線節奏；但越貼價，越容易被一兩支假突破牽著走。",
  wma: "WMA 把近期價格看得更重，反應會快一點。想比 SMA 靈敏、又不想完全放棄平均線邏輯，可以先看它。",
  hma: "HMA 想解決均線太慢的問題。它看起來更順，但真正能不能交易，仍要回到價格結構確認。",
  kama: "KAMA 會按市場是否順暢來調整速度。行情有方向時它跟得較快，亂震時它會盡量慢下來。",
  "ma-ribbon": "均線帶不是要你看十條線一起投票，而是看短線和長線資金有沒有站在同一邊。",
  macd: "MACD 看的是兩條 EMA 之間的動能差。金叉不是聖旨，最好先問大市有沒有趨勢、成交有沒有跟上。",
  rsi: "RSI 是量度短線力度的溫度計，不是買賣指令。讀數高於 70 或低於 30，只代表市場偏熱或偏冷，仍要配合趨勢、位置和止蝕判斷。",
  stochastic: "KD 看收市價在近期高低位中的位置。橫行市有用；強勢股高位鈍化時，逆勢做空很容易被挾。",
  "stochastic-rsi": "StochRSI 很敏感，適合抓短線情緒極端；也正因為敏感，假訊號會比普通 RSI 多。",
  cci: "CCI 看價格偏離平均有多遠。它可以提醒突破加速，也可以提醒過熱，但不能單獨當反轉按鈕。",
  roc: "ROC 直接問一句：現在比 N 期前升了多少、跌了多少。簡單，但很容易受單日急升急跌影響。",
  momentum: "Momentum 是最直接的動能概念。它不修飾價格，只告訴你速度正在加快還是慢下來。",
  "williams-r": "Williams %R 跟 KD 很近，都是看收盤位置。它適合短線觀察，不適合在主升或主跌中硬猜頂底。",
  trix: "TRIX 把價格平滑好幾層後才看動能。訊號乾淨一點，但代價是慢，轉折初期不會很敏捷。",
  "ultimate-oscillator": "UO 同時看短、中、長週期，想減少單一週期的誤判。它適合做輔助，不適合作唯一觸發。",
  tsi: "TSI 把動量再平滑，讀起來比普通 momentum 穩。想看中期力度變化時，它比短線震盪器安靜。",
  "awesome-oscillator": "AO 用柱狀圖看短長週期的動能差。它直觀，但不要因為柱子變色就立刻下單。",
  adx: "ADX 只回答一件事：現在有沒有趨勢性。方向要看價格和 DI，不要把 ADX 上升解讀成一定看升。",
  aroon: "Aroon 看新高新低出現得有多近。它能提醒趨勢是否還活躍，但交叉本身不是入場理由。",
  supertrend: "Supertrend 把 ATR 轉化為趨勢跟隨線。順勢時好用，橫行市容易頻繁反手，因此不要一轉色就重倉追入。",
  psar: "PSAR 像一串移動止蝕點。它適合跟著趨勢走，不適合在窄幅震盪裡每次轉點都追。",
  ichimoku: "一目均衡表資訊多，不必急於全套背熟。先看股價在雲上還是雲下，再看轉換線、基準線是否配合。",
  dmi: "DMI 把多方和空方的方向性拆開看。若 ADX 不支持，單看 +DI/-DI 交叉很容易被震走。",
  "bollinger-bands": "布林帶不是碰上軌就賣出、碰下軌就買入。真正要看的是波幅收窄後，價格有沒有帶成交突破。",
  "keltner-channel": "肯特納通道用 ATR 畫波動範圍，比布林帶少一點極端值干擾；適合看趨勢裡的正常回調。",
  "donchian-channel": "唐奇安通道很直接：近期高點和低點就是邊界。突破交易會用它，但也要接受假突破成本。",
  atr: "ATR 不判斷方向，只量度波幅。交易前先用它計算止蝕距離和倉位，避免一次正常波動已足以打亂節奏。",
  "standard-deviation": "標準差看價格分散程度。它是很多波動工具的底層材料，但單獨看時不要把波動當方向。",
  "volatility-stop": "波動止蝕把市場波幅納入止蝕距離。股價越會震，止蝕就不能貼得像安靜股票一樣近。",
  obv: "OBV 把成交量按升跌方向累加。它想回答的是：股價上去時，究竟有沒有資金肯跟。",
  volume: "成交量是市場是否願意認同該價格的證據。無量突破可以觀察，但不要急於重倉追價。",
  "volume-ma": "成交量均線只是基準線。真正要看的是今天的量，跟平常相比到底算不算異常。",
  vwap: "VWAP 可視為日內平均成交成本。價格在其上方還是下方，反映市場成本位置，不是一條魔法線。",
  mfi: "MFI 可以看成加入成交量的 RSI。它比純價格震盪器多一層成交量，但仍要回到趨勢背景。",
  "chaikin-money-flow": "CMF 把收盤位置和成交量合在一起，看資金偏向累積還是派發。短期讀數不要過度放大。",
  "accumulation-distribution": "A/D 線看收盤落在日內區間哪裡，再配成交量。它適合觀察暗中吸納或派發的跡象。",
  "force-index": "Force Index 把價格變化和成交量乘在一起。它問的是這一下推動，到底有沒有力度。",
  "ease-of-movement": "EOM 看價格移動是否費力。少量就能推高，和大量也推不動，兩者意思完全不同。",
  "pivot-points": "Pivot Points 用昨天的高低收估算今天的短線位置。它可作日內參考，不宜直接套用到長線決策。",
  "fibonacci-retracement": "斐波那契回調只是候選區，不是神奇比例。它要和前高低、成交量、支撐阻力重疊，才值得提高權重。",
  "support-resistance": "支撐阻力是一個區域，不是一條神線。跌穿就要認錯，別把短線交易講成長線投資。",
  "price-channel": "價格通道把波段邊界畫出來。靠近邊界才有討論價值，在通道中間追入通常很尷尬。",
  trendline: "趨勢線是整理市場節奏的方法，不是用來證明自己一定對。線一改再改，通常代表結構未夠清楚。",
  "chandelier-exit": "Chandelier Exit 用 ATR 跟在趨勢後面。它比較像保護利潤的規則，不是預測頂底的工具。",
  "elder-ray": "Elder Ray 把買方和賣方力量分開看。它要配合 EMA 背景，單看柱子很容易過度解讀。",
  "relative-strength-comparative": "RSC 問的是：這隻股票有沒有跑贏基準。跑贏不等於一定升，只代表相對表現較強。",
  beta: "Beta 看一隻股票相對大市有多敏感。它是風險背景，不是買入或賣出的理由。",
  correlation: "相關係數看兩個資產是否常一起走。平時低相關，不代表危機時一定能分散風險。",
  "advance-decline-line": "漲跌家數線看大市是否由多數股票支持。指數升、廣度不升，就要小心升勢太窄。",
  "new-high-new-low": "新高新低數看市場內部健康。真正強的市況，通常不會只靠少數股票撐住指數。",
  "bullish-percent-index": "BPI 看市場裡有多少股票處於偏強狀態。它是大市溫度，不是單一股票入場點。",
  "coppock-curve": "Coppock Curve 偏長線，用來看市場是否從低迷中修復。它不適合短線追進追出。",
  "zig-zag": "Zig Zag 會把小波動過濾掉，方便事後看波段。因為會重畫，不要把它當即時訊號。",
  "heikin-ashi": "Heikin Ashi 讓趨勢看起來更順，但它不是原始成交價。下單和回測時要回到真實 OHLC。",
  renko: "Renko 把時間拿走，只留下固定幅度的價格變化。看結構可以，拿來當真實成交要很小心。",
  "volume-profile": "Volume Profile 會話你哪些價位成交最密。那是市場記憶，不是方向預言；要等價格在該區有反應。",
  kdj: "KDJ 比普通 KD 更敏感，短線轉折提示更快；但快的代價，就是更容易被雜訊騙。",
  demarker: "DeMarker 看高低價變化中的需求壓力。它可提醒過熱或過冷，但仍要等價格確認。",
  "mass-index": "Mass Index 看高低價區間是否異常擴張。它提醒可能有轉折，但不告訴你轉向哪邊。",
  "ulcer-index": "Ulcer Index 關心的是下跌回撤帶來的痛感。對持倉者來說，它比普通波動率更貼身。",
  ppo: "PPO 是百分比版 MACD。跨不同股價比較動能時，它比直接看 MACD 更公平。",
  kst: "KST 把多個 ROC 週期合在一起看。它想抓較大的動能轉折，不適合盯著小波動反覆交易。",
  dpo: "DPO 先把長期趨勢拿走，再看短中期週期波動。用它找長線方向，方向會放錯。",
  "chande-momentum-oscillator": "CMO 直接比較上升和下跌動量。讀數很清楚，但仍要先知道自己是在趨勢市還是震盪市。",
  "relative-vigor-index": "RVI 看收盤相對開盤的位置。它比較適合輔助判斷力度，不適合作為單一觸發。",
  "fisher-transform": "Fisher Transform 會把價格變化拉成較容易看極端的位置。看起來乾淨，但極端不等於立刻反轉。",
  "vortex-indicator": "Vortex 和 DMI 思路接近，都是看方向性移動。交叉後最好再找 ADX 或成交量確認。",
  "linear-regression-slope": "線性回歸斜率用統計方法量趨勢角度。它適合比較效率，不適合單靠一個轉正就追入。",
  "moving-average-envelope": "MA Envelope 在均線上下加固定百分比。它適合看偏離平均的程度，但固定通道不會照顧不同波動環境。",
  "bollinger-bandwidth": "布林帶寬度專看波動是否收窄或打開。它提醒風暴可能來了，但方向仍要等價格表態。",
  "percent-b": "%B 把價格在布林帶中的位置變成數字。它方便量化碰軌和突破，但不要把超過 1 當成必跌。",
  "historical-volatility": "Historical Volatility 看過去價格有多會動。它是風險背景，遇到重大消息時可能低估未來波動。",
  natr: "NATR 把 ATR 轉成百分比，跨股票比較會更公平。高低本身不是方向，只是風險尺度不同。",
  pvt: "PVT 比 OBV 多看漲跌幅大小。它適合觀察量價是否同步累積，但仍要配合價格位置。",
  nvi: "NVI 專看低成交量日的價格變化。安靜日仍有人承接，往往比熱鬧日更值得留意。",
  pvi: "PVI 專看高成交量日。它能反映活躍資金的方向，但熱鬧不代表一定健康。",
  "chaikin-oscillator": "Chaikin Oscillator 把 A/D 線做成快慢差。它看資金流動能，最好和 CMF 或價格結構一起讀。",
  "volume-oscillator": "Volume Oscillator 看短期成交量是否高過長期。它說的是參與度正在變化，不是價格一定要升跌。",
  trin: "TRIN 把漲跌家數和成交量放在一起看。它是大市壓力計，極端值只代表情緒緊，不等於馬上反轉。",
  "mcclellan-oscillator": "McClellan Oscillator 看市場廣度動能。它適合判斷大市內部是否修復，不適合直接替個股產生買賣指令。",
  "put-call-ratio": "Put/Call Ratio 看期權市場偏向避險還是投機。它是情緒背景，不能離開大市和價格結構單獨使用。",
};

function difficultyLabel(value) {
  return indicatorLevels.find((level) => level.value === value)?.label || value;
}

const indicators = indicatorInput.map((item) => {
  const summary = humanSummaryBySlug[item.slug] || item.summary;
  return {
  ...item,
  summary,
  searchText: [
    item.name,
    item.en,
    item.abbr,
    item.category,
    item.difficulty,
    difficultyLabel(item.difficulty),
    item.params,
    summary,
    item.formula,
    ...item.uses,
    ...item.signals,
    ...item.mistakes,
    ...item.limitations,
  ]
    .join(" ")
    .toLowerCase(),
  faqs: item.faqs || defaultFaq,
  };
});

const comparisons = [
  {
    title: "SMA vs EMA",
    left: "sma",
    right: "ema",
    bestFor: "SMA 適合看中長線結構，EMA 適合看較快的轉折與節奏。",
    caution: "兩者都是均線，盤整市都會出現反覆穿越。",
  },
  {
    title: "RSI vs KD",
    left: "rsi",
    right: "stochastic",
    bestFor: "RSI 更適合看動能區間和背離，KD 對短線高低位更敏感。",
    caution: "強趨勢中，高低位鈍化比單次交叉更重要。",
  },
  {
    title: "MACD vs RSI",
    left: "macd",
    right: "rsi",
    bestFor: "MACD 偏趨勢動能，RSI 偏強弱與超買超賣。",
    caution: "MACD 較慢，RSI 較敏感，兩者衝突時先看市場是否有趨勢。",
  },
  {
    title: "布林帶 vs Keltner Channel",
    left: "bollinger-bands",
    right: "keltner-channel",
    bestFor: "布林帶重標準差波動，Keltner Channel 重 ATR 波幅。",
    caution: "通道突破不等於必然追入，需要成交量和趨勢確認。",
  },
  {
    title: "OBV vs MFI",
    left: "obv",
    right: "mfi",
    bestFor: "OBV 看累積成交量方向，MFI 把價格位置和成交量合併成震盪指標。",
    caution: "成交量異常日會同時影響兩者。",
  },
  {
    title: "ATR vs 布林帶",
    left: "atr",
    right: "bollinger-bands",
    bestFor: "ATR 適合做風險距離，布林帶適合看價格在波動區間中的位置。",
    caution: "兩者都描述波動，不直接判斷方向。",
  },
  {
    title: "MACD vs PPO",
    left: "macd",
    right: "ppo",
    bestFor: "MACD 適合看單一股票的均線動能，PPO 百分比化後更適合跨股票比較。",
    caution: "兩者計算邏輯接近，不應當成兩個互相獨立的訊號。",
  },
  {
    title: "ATR vs NATR",
    left: "atr",
    right: "natr",
    bestFor: "ATR 適合設定價格距離，NATR 適合比較不同股價水平的相對波動。",
    caution: "兩者都衡量歷史波動，不預測方向。",
  },
  {
    title: "OBV vs PVT",
    left: "obv",
    right: "pvt",
    bestFor: "OBV 只按漲跌方向累積成交量，PVT 會把價格變化率納入權重。",
    caution: "兩者都是累積型量價指標，異常成交日會造成長期影響。",
  },
  {
    title: "TRIN vs McClellan Oscillator",
    left: "trin",
    right: "mcclellan-oscillator",
    bestFor: "TRIN 偏短線觀察漲跌家數與成交量壓力，McClellan 偏市場廣度動能。",
    caution: "兩者屬市場寬度工具，不適合直接判斷單一股票買賣點。",
  },
];

const glossary = [
  ["價格", "股票在市場成交的價位；技術分析所有圖表與指標，最底層都離不開價格。"],
  ["K 線", "一段時間內的開盤、最高、最低、收盤，用來看這段時間多空攻防。"],
  ["趨勢", "價格高低點持續向同一方向移動，例如一浪高於一浪或一浪低於一浪。"],
  ["成交量", "某段時間有多少股票成交，用來判斷價格變化背後有沒有足夠參與。"],
  ["確認", "等待價格收盤、下一支 K 線、成交量或其他證據支持，避免只靠猜測下判斷。"],
  ["止蝕", "如果判斷錯誤，預先接受小虧離場的位置。"],
  ["R 值", "以每筆交易的預設虧損作單位；若止蝕距離是 1R，2R 代表潛在回報是風險的兩倍。"],
  ["支撐", "價格下跌時較容易出現承接的區域。"],
  ["阻力", "價格上升時較容易遇到沽壓的區域。"],
  ["背離", "價格創新高或新低，但指標未同步創高或創低，代表動能可能不一致。"],
  ["超買", "指標處於偏高區間，代表短期買盤偏熱，但不等於必然下跌。"],
  ["超賣", "指標處於偏低區間，代表短期賣壓偏重，但不等於必然反彈。"],
  ["金叉", "短週期線升穿長週期線，常被視為動能改善訊號。"],
  ["死叉", "短週期線跌穿長週期線，常被視為動能轉弱訊號。"],
  ["零軸", "動能指標的中性線，常用來區分正負動能。"],
  ["假突破", "價格短暫突破關鍵位後很快收回，代表突破未被市場接受。"],
  ["量價配合", "價格方向與成交量變化互相確認，例如放量突破。"],
  ["回踩", "突破後價格回落測試原阻力是否轉為支撐。"],
  ["鈍化", "震盪指標長時間停留在極端區，常見於強趨勢。"],
  ["波動壓縮", "價格波幅縮小，可能代表市場等待新方向。"],
  ["趨勢濾網", "用來判斷是否適合採用趨勢策略的條件，例如 ADX。"],
  ["移動止蝕", "隨價格變化調整的風險控制線。"],
  ["成交密集區", "大量交易集中發生的價格區域，常形成市場記憶。"],
  ["相對強弱", "個股相對指數、同業或其他資產的表現強弱。"],
  ["週期", "指標計算使用的資料長度，例如 14 日 RSI。"],
  ["回撤", "價格由高點下跌的幅度，是風險管理重要概念。"],
  ["市況", "市場處於趨勢、震盪、高波動或低波動等背景。"],
  ["市場寬度", "觀察市場內有多少股票參與升跌，而不是只看指數本身。"],
  ["年化波動率", "把某段期間的收益率波動換算成年化尺度，方便不同資產比較。"],
  ["參數敏感度", "檢查指標結論是否只在某一組特殊參數下成立。"],
  ["重畫", "指標或圖形會因後續價格更新而改變過去標記，使用時要特別小心。"],
  ["情緒指標", "用期權、寬度或資金流資料觀察市場風險偏好，但通常只能作背景參考。"],
  ["風險回報比", "比較可能虧損與可能回報的比例，用來判斷交易是否值得做。"],
  ["交易劇本", "交易前寫好的計劃，包括背景、觸發、止蝕、目標、倉位和失效條件。"],
  ["失效點", "證明原本分析錯誤的位置或條件，通常也是止蝕或減倉依據。"],
  ["反面教材", "刻意展示錯誤用法，幫助學習者避免常見虧損行為。"],
];

const masterLearningPath = [
  {
    step: "01",
    title: "先判斷市況",
    body: "趨勢、震盪、突破、恐慌反彈的交易規則完全不同。未定義市況前，不應急於解讀指標。",
    action: "先用週線和日線找方向，再看價格是否接近支撐、阻力或突破位。",
  },
  {
    step: "02",
    title: "再分配指標角色",
    body: "每個組合只需要一個主指標回答主要問題，其他工具只做確認，避免多個相似指標重複投票。",
    action: "用趨勢工具定方向、動能工具看力度、成交量工具看參與、ATR/R 值控風險。",
  },
  {
    step: "03",
    title: "寫下交易劇本",
    body: "一筆交易必須先有背景、觸發、止蝕、目標、倉位和失效條件，否則只是看圖後的情緒反應。",
    action: "入場前先問：錯在哪裡離場？第一目標是否至少 1.5R 至 2R？",
  },
  {
    step: "04",
    title: "用日誌修正自己",
    body: "盈利能力不靠背誦更多形態，而在於長期記錄哪些規則有效控制風險，以及哪些衝動導致虧損。",
    action: "每次交易後標記錯誤：追高、未等確認、移走止蝕、重複計票或過度交易。",
  },
];

const masterTransmissionBlueprint = [
  {
    step: "01",
    title: "先建立交易世界觀",
    pages: "首頁、15 分鐘路線、市況導航",
    lesson: "新手最先要學的不是哪個指標最準，而是價格位置、成交量、波動和風險回報如何共同決定一筆交易是否值得做。",
    habit: "先問背景：現在是趨勢、震盪、突破，還是恐慌後反彈？未定義市況前，不解讀任何訊號。",
  },
  {
    step: "02",
    title: "把指標分配角色",
    pages: "指標庫、分類、用途篩選",
    lesson: "每個指標只回答一類問題：方向、力度、成交量、波動、位置或寬度。相同角色的指標不能重複計票。",
    habit: "一個主指標配兩個不同證據來源；若三個工具都回答同一件事，刪到只剩最清楚的一個。",
  },
  {
    step: "03",
    title: "進入單一指標深教學",
    pages: "每個技術指標詳情頁",
    lesson: "每頁都會整理原理、公式、適用市況、權威來源、反面教材、真實案例、判讀方式和復盤問題。",
    habit: "把訊號分為 A 級、B 級和取消訊號；A 級才交易，B 級只觀察，取消條件出現就立即降級。",
  },
  {
    step: "04",
    title: "用案例與練習校準",
    pages: "案例庫、練習室、比較頁",
    lesson: "你可以在不同市況下比較指標優劣，知道同一訊號在不同背景下可能是機會，也可能是陷阱。",
    habit: "先寫交易劇本，再看結果；只用結果反推理由，是最危險的學習方式。",
  },
  {
    step: "05",
    title: "用日誌形成個人系統",
    pages: "交易日誌、收藏、備註、本地資料",
    lesson: "真正進步來自可追蹤的錯誤分類：追高、未等確認、移走止蝕、過度交易、重複計票。",
    habit: "每次交易後只問三件事：規則有否被遵守？虧損是否在計劃內？下次要刪掉哪個壞習慣？",
  },
];

const pageTeachingMap = [
  ["首頁", "建立學習次序與交易世界觀：指標只是證據，不是答案。"],
  ["指標庫", "用分類、用途和難度，從交易問題倒推應學哪類工具。"],
  ["指標詳情", "把單一指標拆成原理、公式、權威、實戰、失效、風險和日誌問題。"],
  ["陰陽燭", "從開高低收看多空攻防，再把形態放回位置與成交量。"],
  ["比較頁", "處理同一指標或同類工具的分工，避免把所有訊號混成一票。"],
  ["練習室", "把看圖衝動改成流程：市況、觸發、止蝕、目標、R 值和取消條件。"],
  ["案例庫", "用真實市場片段示範何時有效、何時失效，看清指標的邊界。"],
  ["TV 策略", "把指標邏輯轉成可測試規則，記住回測只是過濾，不是保證。"],
  ["日誌", "把每次交易變成可復盤資料，長期找出自己的高勝率場景和高虧損習慣。"],
  ["術語/本地資料", "把語言、證據和私隱規則整理清楚，讓學習和個人紀錄能長期保存。"],
];

const masterStandardRubric = [
  {
    area: "每頁是否夠用",
    standard: "每個指標都要講清楚定義、公式、市況、交易劇本、常見錯誤、權威來源、判讀方式和復盤問題。",
    result: "82 個技術指標頁都按同一套次序整理，方便比較和回看。",
  },
  {
    area: "資料是否有來路",
    standard: "能指出原創者、改良者和參考來源，而不是只引用單一名人。",
    result: "資料來源、權威面板和比較邏輯已接入頁面。",
  },
  {
    area: "操作可用性",
    standard: "任何訊號都要轉成 A/B 級、觸發、止蝕、第一目標、倉位、取消條件和日誌問題。",
    result: "每個指標都已加入判讀方式與風險檢查。",
  },
  {
    area: "市況判斷",
    standard: "指標必須放回趨勢、震盪、突破、恐慌反彈和波動壓縮等場景，不可孤立解讀。",
    result: "首頁、市況導航和各指標頁已把市況列為第一層判斷。",
  },
  {
    area: "風險倫理",
    standard: "內容不承諾盈利；止蝕、倉位和資料私隱要放在最前面。",
    result: "風險提示、交易日誌、本地資料和反面教材已放進同一套流程。",
  },
];

const beginnerStarterPath = [
  {
    minute: "0-3",
    title: "先懂一支 K 線",
    body: "開、高、低、收是每張圖表的最小單位。先看多空哪一方把價格推到收盤，不必急於背形態名稱。",
    action: "看陰陽燭結構",
    href: "#/candlesticks/anatomy",
  },
  {
    minute: "3-6",
    title: "再看趨勢與位置",
    body: "價格在上升、下降還是橫行，比任何指標數字更重要。先知道自己站在支撐、阻力還是區間中間。",
    action: "看入門趨勢工具",
    href: `#/indicators?difficulty=${encodeURIComponent("入門")}&use=${encodeURIComponent("看趨勢")}`,
  },
  {
    minute: "6-9",
    title: "加入成交量",
    body: "價格突破但沒有量，可信度會降低；價格急跌但成交量異常，風險也不同。成交量是新手最容易忽略的證據。",
    action: "看成交量",
    href: "#/indicators/volume",
  },
  {
    minute: "9-12",
    title: "只選一個動能指標",
    body: "先用 RSI 或 MACD 學會強弱和轉折，不要同時堆很多相似指標。指標是過濾器，不是買賣指令。",
    action: "看 RSI",
    href: "#/indicators/rsi",
  },
  {
    minute: "12-15",
    title: "最後先算風險",
    body: "能不能交易，不只看方向，還要看錯了在哪離場、第一目標有多少 R、倉位會不會太大。",
    action: "做練習",
    href: "#/playground",
  },
];

const marketRegimeGuides = [
  {
    regime: "趨勢市",
    signal: "高低點同向移動，均線有斜率，回調不破主要結構。",
    use: "順勢回踩、突破後回踩、移動止蝕。",
    tools: "SMA / EMA、MACD、ADX、ATR",
    avoid: "不要因 RSI 超買就逆勢做空；強勢市可以長時間鈍化。",
  },
  {
    regime: "震盪市",
    signal: "價格反覆回到區間中間，突破後容易收回。",
    use: "等上下沿確認，目標先看區間另一邊，不追中間位。",
    tools: "RSI、Stochastic、布林帶、支撐阻力",
    avoid: "不要把每次碰軌都當反轉；先看是否在關鍵區域。",
  },
  {
    regime: "壓縮突破",
    signal: "波幅收窄，成交變淡，價格貼近前高/前低或三角收斂。",
    use: "等收盤突破和成交量確認，止蝕放在突破失敗點。",
    tools: "布林帶、Keltner、成交量、ATR",
    avoid: "不要在未突破前猜方向；低波動不是低風險。",
  },
  {
    regime: "恐慌/消息市",
    signal: "裂口、長陰長陽、成交急增，指標短期失真。",
    use: "先降低倉位或只觀察，等待波動收斂和結構重建。",
    tools: "ATR、成交量、VWAP、陰陽燭確認",
    avoid: "不要把普通參數直接套用在異常行情；消息日滑價和裂口風險更大。",
  },
];

const practiceMissions = [
  {
    title: "趨勢回踩任務",
    task: "找一段高低點抬高的走勢，標出回踩位、入場觸發、止蝕和第一目標。",
    pass: "只有當回踩不破結構，且目標至少 2R，才算合格。",
  },
  {
    title: "假突破辨識任務",
    task: "找一段突破後收回區間的走勢，寫出哪一支 K 線令突破失效。",
    pass: "能說出失效點，並知道為何不應把虧損單改成長線持有。",
  },
  {
    title: "指標重複計票任務",
    task: "任選 4 個指標，分辨它們分別回答方向、力度、成交量還是風險。",
    pass: "如果兩個指標回答同一問題，刪掉其中一個，換成風險或成交量工具。",
  },
  {
    title: "交易後復盤任務",
    task: "用日誌記錄一筆觀察：是否等待確認、是否符合 R 值、是否遵守止蝕。",
    pass: "復盤不是寫感受，而是找出可被下次修正的行為。",
  },
];

const historicalCaseStudies = [
  {
    slug: "liquidity-shock",
    title: "2020 流動性衝擊：不要用普通超賣邏輯接刀",
    period: "2020 年全球風險資產急跌期",
    market: "美股 / 港股均出現高波動衝擊",
    regime: "恐慌/消息市",
    chartCase: "reversal",
    tools: ["ATR", "成交量", "RSI", "陰陽燭確認"],
    lesson:
      "當市場由普通回調變成流動性衝擊，RSI 超賣和長下影只代表拋售激烈，不代表立刻見底。第一任務是縮倉和保護本金。",
    trade:
      "比較穩的做法是等波動收斂、價格重新站回短線平台，並用 ATR 計算較小倉位；未出現確認前只做觀察。",
    mistake:
      "反面教材：看到 RSI 低於 30 就加倉，跌穿止蝕後改口說長線持有，結果單筆虧損遠超原計劃。",
    quiz: {
      question: "恐慌市中 RSI 超賣，第一件應做的事是？",
      answers: [
        ["buy", "立刻重倉買入，因為超賣一定反彈。"],
        ["risk", "先降低倉位，等待價格止跌和波動收斂。"],
        ["ignore", "完全不看止蝕，只看長線故事。"],
      ],
      correct: "risk",
      explain: "恐慌市的第一課是生存。超賣只能提示賣壓極端，不能代替止跌確認。",
    },
  },
  {
    slug: "growth-downtrend",
    title: "2021-2022 高估值成長股回撤：弱勢股可以長期超賣",
    period: "2021-2022 年利率預期轉向期",
    market: "美股成長股與部分港股平台股",
    regime: "趨勢下跌",
    chartCase: "range",
    tools: ["SMA", "EMA", "RSI", "相對強弱"],
    lesson:
      "下跌趨勢中，股價反覆受制於下降均線，RSI 低位鈍化是常態。用超賣買入，容易把短線反彈誤認為底部。",
    trade:
      "若要做反彈，必須先見到價格突破前一個下降小平台，且止蝕放在反彈低位下方；若只是碰到均線即回落，應放棄。",
    mistake:
      "反面教材：每次 RSI 低位就補倉，沒有承認下降趨勢，最後平均成本愈補愈高、倉位愈來愈重。",
    quiz: {
      question: "下降趨勢中 RSI 長期偏低，最合理的解讀是？",
      answers: [
        ["cheap", "股票一定便宜，可以愈跌愈買。"],
        ["weak", "弱勢可能延續，要等價格結構轉強。"],
        ["ignore", "只要成交量大就必定見底。"],
      ],
      correct: "weak",
      explain: "弱勢股可以長時間超賣。真正的轉強要由價格結構確認，不是由指標替你安慰。",
    },
  },
  {
    slug: "ai-trend",
    title: "2023-2024 大型科技主升段：超買不等於做空",
    period: "2023-2024 年 AI 與大型科技強勢期",
    market: "美股大型科技股",
    regime: "趨勢市",
    chartCase: "uptrend",
    tools: ["EMA", "MACD", "RSI", "ATR 移動止蝕"],
    lesson:
      "強趨勢中，RSI 可以長時間偏高，價格沿均線推進。真正要做的是用回踩和移動止蝕管理倉位，而不是因超買便逆勢交易。",
    trade:
      "較好的劇本是等待回踩 20EMA 或前高回踩不破，再用 1 至 1.5 倍 ATR 放止蝕；若跌破主要上升結構才降級。",
    mistake:
      "反面教材：看到 RSI 超買就做空主升股，沒有等待跌破結構，結果小虧變連續止蝕。",
    quiz: {
      question: "強趨勢中 RSI 高於 70，較穩的處理是？",
      answers: [
        ["short", "立即做空，因為超買一定下跌。"],
        ["trail", "用趨勢和移動止蝕管理，不把超買當反轉。"],
        ["allin", "因為走勢很強，所以不用止蝕並加大倉位。"],
      ],
      correct: "trail",
      explain: "超買在強趨勢中常是強勢鈍化。方向仍要由價格結構和失效點決定。",
    },
  },
  {
    slug: "hk-gap-news",
    title: "港股消息裂口：缺口不是方向，收盤接受才是證據",
    period: "港股業績、政策或大型配售消息日",
    market: "港股大型股常見消息裂口",
    regime: "高波動消息市",
    chartCase: "breakout",
    tools: ["VWAP", "成交量", "陰陽燭", "支撐阻力"],
    lesson:
      "港股消息日常見高開低收或低開高收。開市裂口本身不是交易訊號，真正重要的是收盤能否守住關鍵位。",
    trade:
      "若高開突破但全日跌回突破位下方，視為市場不接受新價格；若低開後收回支撐上方，才可進入觀察名單。",
    mistake:
      "反面教材：只因高開就追入，忽略上方阻力和全日成交分佈，最後被即日反轉套住。",
    quiz: {
      question: "消息日高開突破後，最重要的確認是？",
      answers: [
        ["open", "開市價高就已經確認。"],
        ["close", "收盤能否守住突破位，成交是否支持。"],
        ["story", "新聞標題好看就足夠。"],
      ],
      correct: "close",
      explain: "缺口只是開局，收盤才反映市場是否接受新價格。",
    },
  },
];

const glossaryExamples = {
  價格: "例：先看價格現在接近前高、前低還是區間中間，再決定指標訊號有沒有意義。",
  "K 線": "例：一支長上影線代表價格曾經衝高但收不住，要再看位置和成交量確認。",
  趨勢: "例：高點和低點都一浪高於一浪，才算較清楚的上升趨勢。",
  成交量: "例：突破前高時成交量明顯增加，比無量突破更值得觀察。",
  確認: "例：不是一碰阻力就做空，而是等收盤轉弱或下一支 K 線跟隨。",
  止蝕: "例：買入後若收盤跌回支撐下方，代表原本劇本失效，應按計劃退出。",
  支撐: "例：價格多次跌到同一區域後反彈，這裡可視為支撐區，不是一條絕對精準的線。",
  阻力: "例：價格多次升到同一區域後回落，這裡可視為阻力區，要等突破確認才追。",
  背離: "例：股價創新高，但 RSI 沒有創新高，只代表力度可能減弱，仍要等跌破小平台才算確認。",
  超買: "例：強勢股 RSI 超過 70 後仍可繼續升，不應單靠超買做空。",
  超賣: "例：弱勢股 RSI 低於 30 可以維持很久，買入前要先看到價格止跌。",
  假突破: "例：突破前高後兩日內跌回區間，原本突破劇本應降級或取消。",
  量價配合: "例：突破時成交量高於近期平均，回踩時縮量，代表市場較願意接受新價格區。",
  鈍化: "例：RSI 長時間在 70 附近不是賣出指令，可能是主升段特徵。",
  "R 值": "例：每股風險 4 元、潛在回報 8 元，就是 2R；低於 1.5R 通常不值得急於交易。",
  交易劇本: "例：若回踩 20EMA 不破並放量轉強才入場，跌破前低就離場，第一目標看 2R。",
  失效點: "例：看升突破，若收盤跌回突破位下方，原本假設已被市場否定。",
  反面教材: "例：看到金叉追入，跌穿止蝕又說長線看好，這是把分析變成藉口。",
};

const state = {
  playground: {
    caseName: "uptrend",
    period: 20,
    ma: true,
    bands: true,
    rsi: true,
    volume: true,
  },
  importPreview: null,
  trialSaved: false,
};

const contentVersion = "2026-07-03";
const app = document.querySelector("#app");
const siteData = readSiteData(typeof window === "object" ? window.__TI_DATA__ : null);
const siteReadiness = readSiteReadiness(
  typeof window === "object" ? window.__TI_READINESS__ : null,
);
const tvStrategyData = readTradingViewStrategyData(
  typeof window === "object" ? window.__TV_STRATEGY_CASES__ : null,
);

function unique(list) {
  return [...new Set(list)];
}

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function safeRecord(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function safeText(value, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function formatCount(value, fallback = "0") {
  const number = Number(value);
  return Number.isFinite(number) ? number.toLocaleString("zh-HK") : fallback;
}

function hasUsableSiteDataShape(source, data, indicators) {
  return Boolean(
    source &&
      typeof source === "object" &&
      Number(data.schemaVersion) >= 1 &&
      indicators.length > 0 &&
      Object.keys(safeRecord(data.stats)).length > 0,
  );
}

function readSiteData(source) {
  const data = safeRecord(source);
  const indicators = safeArray(data.indicators).filter((item) => safeText(item?.siteSlug));
  const marketCases = safeArray(data.marketCases).filter((item) => safeText(item?.caseName));
  const loaded = hasUsableSiteDataShape(source, data, indicators);
  return {
    loaded,
    schemaVersion: Number(data.schemaVersion) || 0,
    version: safeText(data.version, "未載入"),
    generatedAt: safeText(data.generatedAt),
    status: safeText(data.status, "unknown"),
    stats: safeRecord(data.stats),
    evidenceReview: safeRecord(data.evidenceReview),
    taxonomy: safeRecord(data.taxonomy),
    indicators,
    comparisons: safeArray(data.comparisons),
    experts: safeArray(data.experts),
    families: safeArray(data.families),
    marketCases,
    indicatorBySlug: new Map(indicators.map((item) => [item.siteSlug, item])),
    marketCaseByName: new Map(marketCases.map((item) => [item.caseName, item])),
  };
}

function readSiteReadiness(source) {
  const data = safeRecord(source);
  const indicatorPolicy = safeRecord(data.indicatorPolicy);
  const marketData = safeRecord(data.marketData);
  return {
    loaded: Boolean(
      source &&
        typeof source === "object" &&
        Number(data.schemaVersion) >= 1 &&
        Object.keys(indicatorPolicy).length > 0 &&
        Object.keys(marketData).length > 0,
    ),
    schemaVersion: Number(data.schemaVersion) || 0,
    version: safeText(data.version, "未載入"),
    generatedAt: safeText(data.generatedAt),
    status: safeText(data.status, "unknown"),
    sourceArtifacts: safeArray(data.sourceArtifacts),
    readinessFields: safeArray(data.readinessFields),
    indicatorPolicy,
    marketData,
    sourceReview: safeRecord(data.sourceReview),
    taxonomyReview: safeRecord(data.taxonomyReview),
    runnerUpPolicy: safeRecord(data.runnerUpPolicy),
  };
}

function readTradingViewStrategyData(source) {
  const data = safeRecord(source);
  const cases = safeArray(data.cases).filter((item) => safeText(item?.slug));
  const sourceEvidence = safeArray(data.sourceEvidence).filter((item) => safeText(item?.id));
  const loaded = Boolean(
    source &&
      typeof source === "object" &&
      Number(data.schemaVersion) >= 1 &&
      Object.keys(safeRecord(data.stats)).length > 0,
  );
  return {
    loaded,
    schemaVersion: Number(data.schemaVersion) || 0,
    version: safeText(data.version, "未載入"),
    generatedAt: safeText(data.generatedAt),
    status: safeText(data.status, "unknown"),
    targetAcceptedCases: Number(data.targetAcceptedCases) || 100,
    rawLeadTarget: Number(data.rawLeadTarget) || 200,
    rawLeadsCollected: Number(data.rawLeadsCollected) || Number(safeRecord(data.stats).rawLeadsCollected) || 0,
    metricFramingZh: safeText(
      data.metricFramingZh,
      "PF、勝率、回撤和回報只代表指定歷史資料、測試期間、成本、滑價和參數設定下的回測結果，不構成投資或交易建議。",
    ),
    stats: safeRecord(data.stats),
    cases,
    sourceEvidence,
    caseBySlug: new Map(cases.map((item) => [item.slug, item])),
    evidenceById: new Map(sourceEvidence.map((item) => [item.id, item])),
  };
}

function siteIndicatorDataFor(slug) {
  return siteData.indicatorBySlug.get(slug) || null;
}

function validationStatusLabel(flags) {
  const list = safeArray(flags);
  return list.length ? list.join("、") : "未見覆核旗標";
}

function matchTypeLabel(value) {
  const labels = {
    exact: "精準對應",
    merge: "合併對應",
    alias: "別名對應",
    split: "拆分對應",
  };
  return labels[value] || safeText(value, "未標示");
}

function matchConfidenceLabel(value) {
  const labels = {
    high: "高信心",
    medium: "中信心",
    low: "低信心",
  };
  return labels[value] || safeText(value, "未標示");
}

function siteDataCount(key, fallback = 0) {
  const value = Number(siteData.stats[key]);
  return Number.isFinite(value) ? value : fallback;
}

function siteDataGeneratedDate() {
  if (!siteData.generatedAt) return "未標示";
  const date = new Date(siteData.generatedAt);
  if (Number.isNaN(date.getTime())) return siteData.generatedAt.slice(0, 10);
  return date.toLocaleDateString("zh-HK", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function currentSiteReviewStatus() {
  return siteReadiness.loaded ? siteReadiness.status : siteData.status;
}

function siteReadinessPolicy(key, fallback) {
  return safeText(siteReadiness.indicatorPolicy[key], fallback);
}

function siteReadinessMarketSummary(fallbackCount) {
  if (!siteReadiness.loaded) {
    return `${formatCount(fallbackCount)} 個本地歷史 OHLCV 案例，僅供圖表教學，不代表即時行情或回測結果。`;
  }
  const market = siteReadiness.marketData;
  const total = Number(market.marketCaseCount) || fallbackCount;
  const used = Number(market.usedMarketCaseCount) || 0;
  const unusedKeys = safeArray(market.unusedMarketCaseKeys)
    .map((item) => safeText(item))
    .filter(Boolean);
  const unusedText = unusedKeys.length
    ? `；${unusedKeys.join("、")} 保留未使用，待接線或移除`
    : "";
  return `${formatCount(total)} 個本地歷史 OHLCV 案例，目前 ${formatCount(used)} 個在頁面使用${unusedText}。${safeText(market.validationStatus, "本地快照已做結構檢查")}`;
}

function siteDataStatusTone(status = currentSiteReviewStatus()) {
  if (!siteData.loaded) return "is-warn";
  if (status.includes("draft")) return "is-warn";
  if (status.includes("pass_with_warnings")) return "is-warn";
  if (status.includes("pass")) return "is-good";
  if (status.includes("fail")) return "is-bad";
  return "is-warn";
}

function siteDataStatusLabel(status = currentSiteReviewStatus()) {
  if (!siteData.loaded) return "使用內建內容";
  if (status.includes("draft")) return "草稿資料，待覆核";
  if (status.includes("pass_with_warnings")) return "已載入，有待覆核";
  if (status.includes("pass")) return "已載入";
  if (status.includes("fail")) return "需先修正";
  return "已載入，待覆核";
}

function renderSiteDataStatusPanel() {
  if (!siteData.loaded) return "";
  const stats = [
    ["網站指標", siteDataCount("siteIndicators", indicators.length), "網站目前使用的指標數"],
    ["研究概念", siteDataCount("researchConcepts"), "研究庫標準概念數量"],
    ["專家", siteDataCount("experts"), "已整理的技術分析作者與專家"],
    ["研究材料", siteDataCount("researchMaterials"), "書籍、論文、平台文章與參考來源"],
  ];
  const warningCount = Number(siteData.evidenceReview.flagCount) || 0;
  const marketCaseCount = siteData.marketCases.length || siteDataCount("marketCaseCount");
  const sourceReview = siteReadiness.loaded ? siteReadiness.sourceReview : siteData.evidenceReview;
  const classificationReview = siteReadiness.taxonomyReview;
  const runnerUpPolicy = siteReadiness.runnerUpPolicy;
  const relationCounts = safeRecord(
    siteData.taxonomy.relationCounts || siteData.stats.taxonomyRelationCounts,
  );

  return `
    <section class="site-data-panel" data-site-data-panel>
      <div class="section-head">
        <div>
          <span class="lesson-label">資料覆核摘要</span>
          <h2>本頁資料的覆核狀態</h2>
          <p>本地研究資料已載入，用來交代來源、對應和待覆核項目。資料數量不等於投資結論，這裡只作教學和研究參考。</p>
        </div>
        <span class="site-data-status ${siteDataStatusTone()}">${escapeHtml(siteDataStatusLabel())}</span>
      </div>
      <div class="site-data-grid">
        ${stats
          .map(
            ([label, value, text]) => `
              <div class="site-data-metric">
                <span class="site-data-kpi">${formatCount(value)}</span>
                <span class="site-data-label">${escapeHtml(label)}｜${escapeHtml(text)}</span>
              </div>
            `,
          )
          .join("")}
      </div>
      <ul class="site-data-list">
        <li><strong>資料版本</strong><span>${escapeHtml(siteData.version)}｜生成<span class="no-break">日期</span> ${escapeHtml(siteDataGeneratedDate())}</span></li>
        <li><strong>概念對應</strong><span>${formatCount(siteDataCount("siteIndicators", indicators.length))} 個前端指標已對應到研究概念；精準 ${formatCount(relationCounts.exact)}、別名 ${formatCount(relationCounts.alias)}、合併 ${formatCount(relationCounts.merge)}、拆分 ${formatCount(relationCounts.split)}。</span></li>
        <li><strong>來源覆核</strong><span>現有 ${formatCount(warningCount)} 項來源覆核標記；其中 ${formatCount(sourceReview.lowReviewRows)} 項低信任或待重分類來源只作輔助參考。</span></li>
        <li><strong>分類覆核</strong><span>${formatCount(classificationReview.reviewMarkerCount)} 個合併、拆分或中信心對應已保留為待覆核狀態，不會當成完全對應。</span></li>
        <li><strong>專家補充</strong><span>仍有 ${formatCount(runnerUpPolicy.siteMissingRows)} 個項目待補充第二觀點或寫明只有一位核心專家。</span></li>
        <li><strong>市場案例</strong><span>${escapeHtml(siteReadinessMarketSummary(marketCaseCount))}</span></li>
      </ul>
      <p class="site-data-note">如果資料包不存在或格式不合，網站會回到內建教學內容；任何待覆核項目都不應當成已驗證交易結論。</p>
    </section>
  `;
}

function renderSiteDataEvidenceCard() {
  if (!siteData.loaded) return "";
  const warningCount = Number(siteData.evidenceReview.flagCount) || 0;
  const status = siteData.status.includes("pass_with_warnings") ? "is-warn" : siteDataStatusTone();

  return `
    <article class="site-data-panel">
      <span class="lesson-label">資料審核</span>
      <h2>來源仍分級處理</h2>
      <p class="small">研究庫已接到網站流程，但來源質素並非全部同級。原著、學術資料、平台文章和二手整理需要分開看。</p>
      <div class="site-data-grid">
        <div class="site-data-metric">
          <span class="site-data-kpi">${formatCount(warningCount)}</span>
          <span class="site-data-label">仍待覆核的來源標記</span>
        </div>
        <div class="site-data-metric">
          <span class="site-data-kpi">${formatCount(siteDataCount("expertComparisonRows"))}</span>
          <span class="site-data-label">專家比較資料列</span>
        </div>
      </div>
      <span class="site-data-status ${status}">${escapeHtml(siteDataStatusLabel())}</span>
    </article>
  `;
}

function researchMaterialSummary(research) {
  const direct = Number(research.materialCount) || 0;
  const comparisonRows = safeArray(research.comparisonRows);
  const comparisonMaterialRecords = comparisonRows.reduce(
    (sum, row) => sum + (Number(safeRecord(row).material_count) || 0),
    0,
  );
  return {
    direct,
    comparisonMaterialRecords,
    comparisonRows: comparisonRows.length,
  };
}

function renderIndicatorResearchStatusCard(item) {
  const record = siteIndicatorDataFor(item.slug);
  if (!record) return "";
  const research = safeRecord(record.research);
  const hasRunnerUp = Boolean(safeText(research.runnerUpZh));
  const flags = safeArray(record.validationFlags);
  const tone = flags.length || !hasRunnerUp ? "is-warn" : "is-good";
  const winner = safeText(research.winnerZh, "未標示");
  const runnerUp = safeText(research.runnerUpZh, hasRunnerUp ? "" : "仍待補充專家或明確狀態");
  const expertCount = Number(research.expertCount) || 0;
  const materialSummary = researchMaterialSummary(research);
  const readinessSummary = siteReadinessPolicy(
    "quantCaveat",
    "預設參數只作教育用途；未完成成本、滑價、樣本期和風險檢查前，不視為回測結論。",
  );

  return `
    <section class="site-data-panel" data-site-indicator-status>
      <div class="section-head">
        <div>
          <span class="lesson-label">研究庫對應</span>
          <h2>${escapeHtml(item.abbr)} 的資料狀態</h2>
          <p>這張卡只說明資料庫目前如何對應與覆核<span class="no-break">這個指標</span>，不構成交易訊號。</p>
        </div>
        <span class="site-data-status ${tone}">${escapeHtml(matchTypeLabel(record.matchType))} · ${escapeHtml(matchConfidenceLabel(record.matchConfidence))}</span>
      </div>
      <div class="site-data-grid">
        <div class="site-data-metric">
          <span class="site-data-kpi">${formatCount(expertCount)}</span>
          <span class="site-data-label">相關專家/作者</span>
        </div>
        <div class="site-data-metric">
          <span class="site-data-kpi">${formatCount(materialSummary.direct)}</span>
          <span class="site-data-label">直接引用已接入；0 代表來源仍未逐筆接到此頁</span>
        </div>
        <div class="site-data-metric">
          <span class="site-data-kpi">${formatCount(materialSummary.comparisonMaterialRecords)}</span>
          <span class="site-data-label">研究庫材料記錄（按專家比較列累計，未去重）</span>
        </div>
        <div class="site-data-metric">
          <span class="site-data-kpi">${escapeHtml(safeText(research.familyZh, item.category))}</span>
          <span class="site-data-label">研究庫方法家族</span>
        </div>
      </div>
      <ul class="site-data-list">
        <li><strong>研究概念</strong><span>${escapeHtml(safeText(research.conceptZh, record.conceptSlug || item.name))}${safeText(research.conceptEn) ? `｜${escapeHtml(research.conceptEn)}` : ""}</span></li>
        <li><strong>核心專家</strong><span>${escapeHtml(winner)}</span></li>
        <li><strong>補充角色</strong><span>${escapeHtml(runnerUp)}</span></li>
        <li><strong>覆核旗標</strong><span>${escapeHtml(validationStatusLabel(flags))}</span></li>
        <li><strong>材料口徑</strong><span>直接引用 ${formatCount(materialSummary.direct)} 筆；比較列 ${formatCount(materialSummary.comparisonRows)} 行合計 ${formatCount(materialSummary.comparisonMaterialRecords)} 筆材料記錄。兩者用途不同，不能互相代替。</span></li>
        <li><strong>專業化狀態</strong><span>${escapeHtml(readinessSummary)}</span></li>
      </ul>
      ${
        safeText(research.judgmentZh)
          ? `<p class="site-data-note">${escapeHtml(research.judgmentZh)}</p>`
          : `<p class="site-data-note">比較判斷仍需配合來源等級與實戰語境閱讀。</p>`
      }
    </section>
  `;
}

function getIndicator(slug) {
  return indicators.find((item) => item.slug === slug);
}

function categories() {
  return unique(indicators.map((item) => item.category));
}

function useTags() {
  return unique(indicators.flatMap((item) => item.uses));
}

function coverageSummary() {
  return {
    total: indicators.length,
    categories: categories().length,
    uses: useTags().length,
    core: indicators.filter((item) => item.core).length,
    requiredSections: [
      "案例",
      "權威專家",
      "實戰判讀方式",
      "講解",
      "計算方法",
      "使用方法",
      "交易劇本",
      "盈利邏輯",
      "新手常見錯誤",
      "反面教材",
      "進階用法",
      "深層用法",
      "適用市況與搭配",
      "課堂檢核",
      "最後檢查",
    ],
  };
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function storageGet(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function storageSet(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function favorites() {
  return storageGet("ti-favorites", []);
}

function isFavorite(slug) {
  return favorites().includes(slug);
}

function toggleFavorite(slug) {
  const next = isFavorite(slug)
    ? favorites().filter((item) => item !== slug)
    : [...favorites(), slug];
  storageSet("ti-favorites", next);
  render();
}

function notes() {
  return storageGet("ti-notes", {});
}

function noteFor(slug) {
  return notes()[slug] || "";
}

function saveNote(slug, value) {
  const next = { ...notes(), [slug]: value };
  if (!value.trim()) delete next[slug];
  storageSet("ti-notes", next);
}

function journalEntries() {
  return storageGet("ti-journal", []);
}

function quizHistory() {
  return storageGet("ti-quiz-history", []);
}

function saveJournalEntry(data) {
  const entry = {
    id: `j-${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...data,
  };
  storageSet("ti-journal", [entry, ...journalEntries()].slice(0, 80));
}

function deleteJournalEntry(id) {
  storageSet(
    "ti-journal",
    journalEntries().filter((entry) => entry.id !== id),
  );
}

function recordQuizResult(payload) {
  const history = quizHistory();
  storageSet(
    "ti-quiz-history",
    [
      {
        id: `q-${Date.now()}`,
        createdAt: new Date().toISOString(),
        ...payload,
      },
      ...history,
    ].slice(0, 100),
  );
}

function localDataSnapshot() {
  return {
    version: contentVersion,
    exportedAt: new Date().toISOString(),
    email: storageGet("ti-email", ""),
    scriptTrial: storageGet("ti-script-trial", null),
    favorites: favorites(),
    notes: notes(),
    playground: state.playground,
    journal: journalEntries(),
    quizHistory: quizHistory(),
  };
}

function downloadLocalData() {
  const blob = new Blob([JSON.stringify(localDataSnapshot(), null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `technical-indicators-local-${contentVersion}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function summarizeImportData(data) {
  return {
    favorites: Array.isArray(data.favorites) ? data.favorites.length : 0,
    notes: data.notes && typeof data.notes === "object" ? Object.keys(data.notes).length : 0,
    journal: Array.isArray(data.journal) ? data.journal.length : 0,
    quizHistory: Array.isArray(data.quizHistory) ? data.quizHistory.length : 0,
  };
}

function mergeImportedData(data) {
  if (Array.isArray(data.favorites)) {
    storageSet("ti-favorites", unique([...favorites(), ...data.favorites]));
  }
  if (data.notes && typeof data.notes === "object") {
    const current = notes();
    const stamp = new Date().toISOString().slice(0, 10);
    Object.entries(data.notes).forEach(([slug, text]) => {
      if (!text) return;
      if (!current[slug]) current[slug] = String(text);
      else if (!current[slug].includes(String(text))) {
        current[slug] = `${current[slug]}\n\n[匯入備份 ${stamp}]\n${String(text)}`;
      }
    });
    storageSet("ti-notes", current);
  }
  if (Array.isArray(data.journal)) {
    const existing = journalEntries();
    const seen = new Set(existing.map((entry) => entry.id));
    const imported = data.journal.filter((entry) => entry && !seen.has(entry.id));
    storageSet("ti-journal", [...imported, ...existing].slice(0, 120));
  }
  if (Array.isArray(data.quizHistory)) {
    const existing = quizHistory();
    const seen = new Set(existing.map((entry) => entry.id));
    const imported = data.quizHistory.filter((entry) => entry && !seen.has(entry.id));
    storageSet("ti-quiz-history", [...imported, ...existing].slice(0, 160));
  }
  if (typeof data.email === "string" && data.email && !storageGet("ti-email", "")) {
    storageSet("ti-email", data.email);
  }
  if (data.scriptTrial && typeof data.scriptTrial === "object" && !storageGet("ti-script-trial", null)) {
    storageSet("ti-script-trial", data.scriptTrial);
  }
}

function parseRoute() {
  const raw = location.hash.replace(/^#\/?/, "");
  const [path = "", query = ""] = raw.split("?");
  return { path, params: new URLSearchParams(query) };
}

function setActiveNav() {
  const { path } = parseRoute();
  const navGroups = {
    learn: ["candlesticks", "casebook"],
    toolbox: ["compare", "combo", "journal", "glossary", "subscribe"],
    script: ["script-demo", "trial", "tv-strategies", "strategy-cases"],
  };
  document.querySelectorAll(".nav-links a").forEach((link) => {
    const route = link.getAttribute("href").replace(/^#\/?/, "");
    const groupedRoutes = navGroups[route] || [];
    const isGrouped = groupedRoutes.some((groupRoute) => path === groupRoute || path.startsWith(`${groupRoute}/`));
    link.classList.toggle(
      "active",
      path === route || (route && path.startsWith(`${route}/`)) || isGrouped,
    );
  });
}

function indicatorUrl(slug) {
  return `#/indicators/${slug}`;
}

function badge(text, color = "") {
  return `<span class="badge ${color}">${escapeHtml(text)}</span>`;
}

const categoryTeachingProfiles = {
  趨勢: {
    caseMarket:
      "股價連續多日創出較高高點與較高低點，投資者想判斷升勢是短暫反彈，還是已形成可追蹤的趨勢。",
    calculation:
      "先固定觀察週期，再用同一套價格資料連續計算；趨勢類指標最怕臨場更改週期，因為會令歷史訊號失去可比較性。",
    advanced:
      "把它作為市況濾網：只有在日線與週線方向一致時才提高訊號權重；若短週期轉弱但長週期仍向上，應視為風險升高而非立即反轉。",
    review:
      "趨勢指標的正確定位是描述方向與持續性，不是預測明天升跌。使用時要同時檢查波動、成交量和關鍵支撐阻力。",
  },
  動能: {
    caseMarket:
      "價格仍在上升，但升幅開始收窄；投資者想知道買盤力度是否正在減弱，或下跌後是否出現修復動能。",
    calculation:
      "動能類指標通常比較近期價格變化與過去變化，計算前要先確認資料頻率一致，例如日線不能混入週線或日內資料。",
    advanced:
      "用區間觀念取代單一門檻：牛市中強勢股的高位區間可能上移，熊市中弱勢股的低位區間可能下移；背離只作預警，仍需價格確認。",
    review:
      "動能指標適合回答『力度有沒有變強或變弱』，不應單獨回答『現在是否買入』。強趨勢中的超買/超賣訊號尤其容易被誤用。",
  },
  波動率: {
    caseMarket:
      "股價在窄幅區間內壓縮一段時間，或突然放大波幅；投資者想估計風險距離和突破後的波動環境。",
    calculation:
      "波動類指標重點是高低價、收市價或標準差的穩定計算；遇到除權、停牌復牌或裂口日，應理解數值可能短期扭曲。",
    advanced:
      "把波動率用於倉位和止蝕，而不是方向預測。低波動代表市場安靜，不代表風險消失；高波動代表不確定性提高，不必然代表看淡。",
    review:
      "波動率指標的價值在風險度量。若把它解讀成方向指標，容易犯概念錯誤。",
  },
  成交量: {
    caseMarket:
      "價格突破前高或跌穿支撐時，投資者想知道背後是否有足夠市場參與，而不是少量成交造成的短暫波動。",
    calculation:
      "成交量類指標依賴成交股數、成交額、高低收位置或累積成交量；不同市場資料口徑可能不同，港股尤其要留意停牌、半日市與大型配售事件。",
    advanced:
      "用量價關係做確認層：價格訊號先出現，再用成交量判斷市場是否接受該方向；若價升量弱或價跌量縮，解讀要回到支撐阻力和大市背景。",
    review:
      "成交量不是獨立訊號，而是價格訊號的可信度檢查。分析時要同時看成交量是否異常、是否可持續，以及是否與趨勢方向一致。",
  },
  支撐阻力: {
    caseMarket:
      "價格接近前高、前低、整數關口或成交密集區，投資者想規劃觀察位、風險距離和突破後的確認條件。",
    calculation:
      "支撐阻力類工具通常不是單一公式，而是把高低點、比例、成交密集區或前期價格反應轉化成區域；重點是定義一致，不是追求一條完美細線。",
    advanced:
      "把支撐阻力視為區域，並尋找多重證據重疊，例如前高、VWAP、斐波那契比例和成交量節點同時接近，訊號才值得提高權重。",
    review:
      "支撐阻力是市場記憶與交易行為的視覺化，不是保證反轉的位置。有效突破通常需要收盤、成交量和回踩確認。",
  },
  "通道/型態": {
    caseMarket:
      "價格沿著某個區間或波段結構運行，投資者想分辨目前是延續、壓縮、突破，還是原有結構被破壞。",
    calculation:
      "通道或型態工具常由高低點、指定波幅或改良 K 線計算而成；若工具會重畫，必須明白它更適合事後整理結構，而非單獨作即時訊號。",
    advanced:
      "把型態與波動狀態結合：通道收窄後的突破、主要高低點抬高或下移、以及成交量是否配合，比單一線條更有分析價值。",
    review:
      "型態類工具有較高主觀性。較可靠的用法是先定義規則，再用一致標準觀察，而不是看完結果後重畫線條配合觀點。",
  },
  綜合: {
    caseMarket:
      "投資者正在比較多隻股票或建立投資組合，需要同時理解相對表現、風險敏感度與分散效果。",
    calculation:
      "綜合類指標多涉及比較基準、統計關係或相對價格；計算前必須固定基準、期間和資料頻率，否則結論不可比較。",
    advanced:
      "把它放在選股和風險管理層，而不是單一買賣訊號層；相對強不代表絕對上升，低相關也不代表危機時一定能分散風險。",
    review:
      "綜合指標能提升框架完整度，但解釋時要分清相關、相對表現與因果關係，避免把統計描述誤讀成投資保證。",
  },
  市場寬度: {
    caseMarket:
      "大市指數看似創高或反彈，但投資者想知道升勢是否由多數股票支持，還是只靠少數權重股推動。",
    calculation:
      "市場寬度指標依賴完整市場成份資料，例如上升家數、新高新低數或買入訊號比例；資料範圍必須固定，否則歷史比較會失真。",
    advanced:
      "把市場寬度作為大市健康度檢查：當指數與寬度背離時，降低對單一價格突破的信心；當寬度先改善時，留意市場內部修復。",
    review:
      "市場寬度不適合用來分析單一股票買賣點，它主要用來判斷市場參與度和系統性風險背景。",
  },
};

const categoryDeepDiveProfiles = {
  趨勢: {
    title: "趨勢指標深層用法",
    intro:
      "趨勢指標的深層用法，是把方向、節奏和失效點拆開處理；它不是用來猜明天升跌，而是判斷是否值得順勢交易。",
    framework: [
      "先看週線或較高週期：高點和低點是否逐步抬高，主要均線是否同向，避免在大方向混亂時硬做順勢。",
      "再看日線或執行週期：價格是否站在關鍵均線、前高或趨勢線同一側，確認趨勢不是只出現一兩支 K 線。",
      "最後才看指標訊號：指標轉強只算第三層證據，必須服從價格結構和市況背景。",
    ],
    execution: [
      "入場前先定義觸發：收盤突破、回踩不破、或重新站回均線；不要只因線條交叉就立即追入。",
      "止蝕要放在結構失效位置，例如前低、突破 K 線低位或 ATR 之外，而不是剛好貼著指標線。",
      "順勢交易要預先寫分批規則：到 1R 先保護風險，到 2R 或前高再考慮減倉或移動止蝕。",
    ],
    calibration: [
      "短週期反應快但雜訊多，長週期反應慢但更穩；學習時可比較 2 至 3 組常用參數，不要一開始就追求最佳化。",
      "如果只在某一年、某隻股票、某一組參數下有效，應把它視為弱訊號，而不是可複製策略。",
      "趨勢指標遇到橫行市會頻繁失效，因此必須搭配波動、支撐阻力或 ADX 類濾網。",
    ],
    review: [
      "復盤時記錄每筆交易的趨勢背景：週線順勢、日線順勢、或逆大方向反彈，三者不能混在一起比較。",
      "統計被掃損的位置是否太貼近市場正常波幅；若經常被普通回調掃出，問題多半在止蝕距離或入場太急。",
      "把成功案例和失敗案例各截圖 10 張，檢查成功是否真的來自趨勢延續，而不是剛好遇到消息或大市推動。",
    ],
  },
  動能: {
    title: "動能指標深層用法",
    intro:
      "動能指標的深層用法，是分析力度變化，而不是把高低數值當成買賣指令；它最適合回答市場是否正在加速、放慢或背離。",
    framework: [
      "先定義價格位置：在支撐附近、阻力附近、趨勢中段或突破後，動能訊號的意義完全不同。",
      "把高低區間視為狀態，不視為命令；強勢趨勢可以長時間高位，弱勢趨勢也可以長時間低位。",
      "背離只是一個警號：需要價格跌破小平台、突破下降趨勢線或收盤確認，才變成可交易線索。",
    ],
    execution: [
      "反轉交易要等待觸發，不在指標到極端值時預先下注；入場通常應比訊號晚一步。",
      "順勢交易可用動能回落後重新轉強作加倉觀察，但前提是主要趨勢沒有破壞。",
      "止蝕以價格結構為準，不以指標數值為準；例如 RSI 回到 50 不是必然離場，跌穿支撐才是更清晰證據。",
    ],
    calibration: [
      "不同市場狀態要調整解讀區間：牛市可把強勢區提高，熊市可把弱勢區下移。",
      "短週期適合看轉折速度，長週期適合看大方向力度；同時使用時要分清誰是主訊號、誰是確認。",
      "若動能訊號與成交量、趨勢或支撐阻力互相矛盾，應降低倉位或放棄，而不是找更多相似指標支持自己。",
    ],
    review: [
      "復盤時分開統計順勢動能、逆勢背離和區間反彈，不同打法不能混成同一勝率。",
      "記錄每次背離後價格是否真的確認，很多虧損來自把未確認背離當成反轉。",
      "檢查自己是否在強趨勢中過早逆勢；如果經常逆勢摸頂摸底，代表對動能指標的角色理解仍未成熟。",
    ],
  },
  波動率: {
    title: "波動率指標深層用法",
    intro:
      "波動率指標的深層用法，是衡量風險距離、突破環境和倉位大小；它通常不直接告訴你方向。",
    framework: [
      "先分辨波動壓縮、正常波動和波動擴張；同一個突破，在不同波動環境下的風險完全不同。",
      "把波動率看成風險尺：波動越大，止蝕和倉位都要跟著調整，不能用固定金額套用所有股票。",
      "低波動不是低風險，而是市場暫時安靜；壓縮越久，突破時越需要等方向確認。",
    ],
    execution: [
      "用 ATR 或通道寬度估算止蝕距離，再反推股數，避免因止蝕太遠而超出單筆風險。",
      "突破交易要等收盤或回踩確認；波動突然放大時追入，常會買在短線過熱位置。",
      "移動止蝕應跟隨結構或波動，不應每升一點就上移，否則正常回調也會把你震走。",
    ],
    calibration: [
      "比較近期波動與過去平均，不只看絕對數值；高價股和低價股的波幅不可直接比較。",
      "遇到除權、財報、停牌復牌和重大消息日，要標記異常值，避免錯把一次性波動當成新常態。",
      "參數越短越敏感，越容易被單日巨震扭曲；檢查波動時，短期與中期都要一起看。",
    ],
    review: [
      "復盤每筆交易的止蝕是否符合當時波動；若經常未到分析失效就止蝕，代表風險尺太短。",
      "統計突破後是否有跟進波動和成交量；沒有跟進的突破容易是假突破。",
      "把虧損交易分成方向錯、止蝕太近、倉位太大三類，波動率工具主要用來修正後兩類。",
    ],
  },
  成交量: {
    title: "成交量指標深層用法",
    intro:
      "成交量指標的深層用法，是判斷市場是否接受價格變化；它不是獨立預測方向，而是價格訊號的可信度檢查。",
    framework: [
      "先有價格事件，再看成交量確認：突破、跌穿、回踩、反彈都要先在價格上出現。",
      "把成交量分成普通、縮量、放量和異常巨量；不同狀態代表不同市場參與度。",
      "同樣是放量，出現在低位止跌、高位滯漲或突破前高，解讀完全不同。",
    ],
    execution: [
      "突破時放量，回踩時縮量，再次轉強時重新放量，是較完整的量價節奏。",
      "高位爆量後價格不再上升，要降低信心，因為巨量可能是承接，也可能是派發。",
      "低流動性股票的成交量訊號容易失真，應減少倉位或提高確認門檻。",
    ],
    calibration: [
      "不要只與昨天比較成交量，應與近 20 日或 50 日平均比較，才知道是否真的異常。",
      "港股要留意半日市、停牌復牌、配售、供股和大手成交，這些事件會扭曲成交量指標。",
      "成交額有時比成交股數更有意義，尤其跨不同股價水平比較時。",
    ],
    review: [
      "復盤時標記每筆交易的成交量狀態：放量突破、縮量回踩、無量反彈或高位爆量。",
      "檢查自己是否在無量突破中追入；若這類交易勝率低，應把成交量確認列為必要條件。",
      "把成交量與價格結果分開記錄，避免只在事後把成功突破都說成成交量配合。",
    ],
  },
  支撐阻力: {
    title: "支撐阻力深層用法",
    intro:
      "支撐阻力的深層用法，是把市場記憶變成交易區域；重點不是畫一條神奇線，而是規劃反應、失效和風險回報。",
    framework: [
      "先找多次反應的區域：前高、前低、密集成交、整數關口和缺口邊緣都可列入觀察。",
      "把線改成區域，容許正常波動；越精確的線，越容易造成假突破和過早止蝕。",
      "支撐阻力要配合趨勢背景：上升趨勢中的回踩支撐，和下跌趨勢中的碰支撐，交易意義不同。",
    ],
    execution: [
      "接近支撐不等於買，必須等待止跌 K 線、收盤收回、成交量改善或小平台突破。",
      "突破阻力後若回踩不跌破，原阻力才可能轉為支撐；盤中刺穿不能單獨算確認。",
      "止蝕要放在區域之外，並留出合理波幅；貼著支撐線下方很容易被普通波動掃走。",
    ],
    calibration: [
      "重要區域通常有多重證據重疊，例如前高、成交密集區、均線和斐波那契比例接近。",
      "時間越近、反應越多、成交越集中，區域參考價值通常越高。",
      "若區域太寬導致止蝕過大，就應縮小倉位或放棄，而不是硬把區域畫窄。",
    ],
    review: [
      "復盤時記錄入場是否在區域邊緣還是中間；在區域中間交易通常風險回報較差。",
      "檢查跌穿後有沒有及時承認失效，很多大虧來自把支撐跌穿後改口成長線持有。",
      "把真突破、假突破和突破後回踩分開統計，這三種情境的規則不同。",
    ],
  },
  "通道/型態": {
    title: "通道與型態深層用法",
    intro:
      "通道與型態的進階用法，是把價格結構標準化。它可用來觀察節奏，但主觀性較高，規則必須預先定義。",
    framework: [
      "先確認型態至少有兩次以上有效觸碰或清晰邊界；沒有邊界，就不要勉強套用形態名稱。",
      "分清延續型態和反轉型態；同一個三角收斂，在不同趨勢背景下可能有完全不同意義。",
      "型態只描述結構，方向仍要等突破、跌穿、成交量或回踩確認。",
    ],
    execution: [
      "通道交易不要在中間追，應在邊界附近等待反應或突破後等待確認。",
      "若型態工具會重畫，只能作結構整理，不能把歷史完美訊號當成即時能力。",
      "止蝕通常放在型態失效點，例如通道外側、突破失敗點或最近高低點之外。",
    ],
    calibration: [
      "固定畫線規則：用收市價還是影線、看多少個高低點、是否允許假突破，都要先寫清楚。",
      "不要為了配合觀點而重畫型態；如果需要不斷調整邊界，代表結構不夠清楚。",
      "配合波動率觀察壓縮與擴張，能比單純看形狀更可靠。",
    ],
    review: [
      "復盤時保留入場前的原圖，不要事後重畫線條美化結果。",
      "統計哪些型態在你的市場和週期中最常失效，刪掉低品質形態比增加形態更重要。",
      "檢查是否在未突破前過早預判方向；型態成熟不等於方向已經確認。",
    ],
  },
  綜合: {
    title: "綜合指標深層用法",
    intro:
      "綜合指標的深層用法，是把相對表現、統計關係和組合風險分層處理；它通常服務於選股和風險管理。",
    framework: [
      "先固定比較基準，例如大市指數、行業指數或同類股票，否則相對強弱沒有意義。",
      "分清相對強、絕對上升和低相關；這些概念常被混用，但交易含義不同。",
      "綜合指標多用來排序和過濾，不應單獨成為入場按鈕。",
    ],
    execution: [
      "先用綜合指標縮小候選名單，再回到價格、成交量和風險回報找交易觸發。",
      "若股票相對強但絕對價格仍下跌，只能說它跌得較少，不代表值得買入。",
      "組合層面要限制同類風險，不要因為幾隻股票指標都好就集中在同一行業。",
    ],
    calibration: [
      "比較期間要固定，例如 20 日、60 日或 120 日，不同期間代表不同投資節奏。",
      "相關性在危機時可能突然上升，所以不能只用平靜期資料估算分散效果。",
      "統計指標要避免把相關當因果，回測時尤其要保留未參與調校的樣本。",
    ],
    review: [
      "復盤時記錄候選股票是否真的跑贏基準，以及入場後是否仍保持相對強勢。",
      "檢查虧損是否來自選股正確但入場太差；綜合指標不能替代交易觸發。",
      "把組合回撤、行業集中度和單一股票風險一起看，避免只盯單一訊號。",
    ],
  },
  市場寬度: {
    title: "市場寬度深層用法",
    intro:
      "市場寬度的深層用法，是判斷大市健康度和系統性風險；它不是單一股票買賣訊號。",
    framework: [
      "先比較指數方向與內部參與度：指數創高但上升股票減少，代表升勢可能變窄。",
      "把寬度看成大市背景濾網；寬度改善時可提高進攻意願，惡化時要降低追高。",
      "寬度訊號通常比價格慢或早一步，不應要求它每次都精準預測轉折。",
    ],
    execution: [
      "當寬度改善，回到個股頁尋找價格突破和成交量確認，而不是直接買入指數或個股。",
      "當寬度惡化，減少槓桿、降低倉位和縮短持倉，不必等到指數跌穿才防守。",
      "如果寬度與個股訊號矛盾，以風險控制優先；大市背景差時，好股票也更容易失敗。",
    ],
    calibration: [
      "寬度資料必須固定市場範圍，例如同一交易所、同一指數成份或同一股票池。",
      "新高新低數、上升家數和均線上方比例各有盲點，最好用 2 至 3 個寬度工具互相確認。",
      "重大成份股權重變化會令指數與寬度差異擴大，分析時要留意市場結構。",
    ],
    review: [
      "復盤每次大虧前的大市寬度背景，找出是否在市場內部轉弱時仍然重倉進攻。",
      "記錄寬度改善後哪些板塊先轉強，這比只看大市指數更有選股價值。",
      "檢查是否把寬度當成短線 timing 工具；它更適合決定攻守，不適合決定每個買點。",
    ],
  },
};

const indicatorDeepDiveOverrides = {
  rsi: {
    title: "RSI 深層用法",
    intro:
      "RSI 深層用法不是背 30/70，而是把強弱區間、背離和價格確認組合成一套節奏判斷。",
    framework: [
      "先判斷市況：上升趨勢中 RSI 長期守在 40 至 50 以上，通常比單次跌近 30 更重要。",
      "把 RSI 分成強勢區、弱勢區和中性區；不同股票和不同市況，常用區間會移動。",
      "背離要三步確認：價格創新高或新低、RSI 未同步、價格再跌破或突破小結構。",
    ],
    execution: [
      "順勢用法：等 RSI 回落後重新站回中線或強勢區，同時價格守住支撐，再考慮跟進。",
      "反轉用法：只在支撐阻力附近看背離，並等待價格確認；不要單靠 RSI 低於 30 入場。",
      "離場用法：若價格創高但 RSI 高點下降，同時成交量減弱，可先減倉而不是一口氣反手。",
    ],
    calibration: [
      "短線可看 7 至 9 期，中短線常用 14 期，週線可用更長週期；不要因最近一筆交易失敗就改參數。",
      "牛市強勢股的超買可以持續，熊市弱勢股的超賣也可以持續，因此 30/70 只是參考線。",
      "RSI 應與支撐阻力、成交量或 MACD 分工，不要再堆多個相似震盪指標重複計票。",
    ],
    review: [
      "復盤時把 RSI 交易分成順勢回調、背離反轉、區間震盪三類，分開計算勝率和 R 值。",
      "截圖標記入場當刻的價格位置，如果不是在支撐、阻力或明確趨勢節奏上，RSI 訊號權重要降低。",
      "若常常買在弱勢鈍化中，代表你把超賣誤解成便宜，需要重新練習價格確認。",
    ],
  },
  macd: {
    title: "MACD 深層用法",
    intro:
      "MACD 深層用法是同時看趨勢方向、動能變化和柱狀圖節奏，而不是只看金叉死叉。",
    framework: [
      "先看零軸：零軸上方的金叉和零軸下方的金叉，交易質素不同。",
      "再看柱狀圖：柱狀圖由負收窄到正，代表跌勢放慢再轉強；但仍要價格確認。",
      "最後看背離：價格創高而 MACD 未創高，是動能疲弱提示，不是立即做空理由。",
    ],
    execution: [
      "順勢入場可等待價格回踩均線後重新轉強，MACD 柱狀圖同步改善才提高信心。",
      "弱勢反彈中的金叉要打折，尤其仍在零軸下方且價格未突破前高時。",
      "離場可觀察柱狀圖連續縮短、MACD 跌回 Signal 下方和價格跌穿短期支撐是否同時出現。",
    ],
    calibration: [
      "12/26/9 是常用起點，不是唯一答案；改參數前要先說明交易週期，而不是為了貼合歷史。",
      "MACD 本質來自 EMA，會落後價格；越長週期越穩，越短週期越容易假訊號。",
      "MACD 適合趨勢和波段，低波動橫行市應降低交叉訊號權重。",
    ],
    review: [
      "復盤金叉時標記它在零軸上方、附近還是下方，三者結果應分開看。",
      "記錄柱狀圖改善後價格是否真的突破，若沒有，代表動能改善未轉成可交易結構。",
      "若虧損集中在橫行市交叉，應加入市況濾網，而不是繼續調 MACD 參數。",
    ],
  },
  sma: {
    title: "SMA 深層用法",
    intro:
      "SMA 深層用法是用平均成本理解趨勢背景、回踩質素和市場節奏，不是把碰線當成買賣點。",
    framework: [
      "先看斜率：向上的均線比單純價格在均線上方更有資訊。",
      "再看排列：短中長期均線順序排列，代表不同週期參與者成本方向較一致。",
      "最後看距離：價格離均線太遠，代表短線可能過熱；回到均線附近才適合重新評估風險回報。",
    ],
    execution: [
      "順勢回踩要等價格在均線附近止跌，再用 K 線、成交量或前低不破確認。",
      "跌穿均線不一定立即看淡，要看是否同時跌穿結構支撐和均線斜率轉弱。",
      "多均線系統只需 2 至 3 條代表不同節奏，太多均線會讓判斷變成裝飾。",
    ],
    calibration: [
      "20 日可看短中線節奏，50 日看中期，200 日看長期背景；不同週期不可混作同一訊號。",
      "均線越長越慢，越不適合短線追入；均線越短越敏感，越需要價格確認。",
      "在橫行市，均線容易互相纏繞，應降低穿越訊號權重。",
    ],
    review: [
      "復盤每次碰均線交易，檢查當時均線是上升、下降還是走平。",
      "統計回踩成功是否有成交量縮減和重新放量，單靠碰線成功率通常不足。",
      "若經常在均線走平時被來回掃損，代表你把盤整誤認成趨勢。",
    ],
  },
  ema: {
    title: "EMA 深層用法",
    intro:
      "EMA 深層用法是觀察近期價格節奏和趨勢轉折速度，適合配合 MACD、回踩和移動止蝕使用。",
    framework: [
      "先看 EMA 斜率與價格位置：價格在上升 EMA 上方，代表短中線節奏偏強。",
      "再看回踩質素：健康回踩通常靠近 EMA 後收復，而不是急跌穿越多條 EMA。",
      "最後看多 EMA 排列：短期 EMA 在長期 EMA 上方且距離穩定，趨勢較順。",
    ],
    execution: [
      "入場可等待價格回踩 EMA 後重新站上短期高點，避免在第一下碰線就買。",
      "若價格連續跌穿短中期 EMA，應視為趨勢節奏破壞，而不是盲目加倉。",
      "EMA 可作動態參考，但真正止蝕仍應放在價格結構或 ATR 外。",
    ],
    calibration: [
      "8/21、10/20、12/26 都是節奏組合；選擇前先定義交易週期，不要同時使用太多相近參數。",
      "EMA 反應快，假訊號也多；短線參數需要成交量或形態確認。",
      "與 SMA 比較時，EMA 更適合節奏，SMA 更適合背景，兩者不要混為同一角色。",
    ],
    review: [
      "復盤時標記回踩是否守住 EMA，以及守住後是否真的突破前一個小高點。",
      "統計因 EMA 反覆穿越造成的虧損，若集中在橫行市，應加入市況濾網。",
      "檢查是否因 EMA 太貼近價格而過度交易；快速工具需要更嚴格的觸發條件。",
    ],
  },
  volume: {
    title: "成交量深層用法",
    intro:
      "成交量深層用法是判斷市場參與度和接受程度；價格先給事件，成交量再回答這個事件是否可信。",
    framework: [
      "突破看成交量是否高於近期平均，回踩看是否縮量，轉強時看是否再度放量。",
      "高位爆量要問價格是否還能上升；不能上升的巨量，往往比普通放量更值得警惕。",
      "低位放量要問是否有止跌結構；只有恐慌成交而未止跌，仍可能繼續下跌。",
    ],
    execution: [
      "買入前先描述價格事件：突破前高、回踩支撐、還是假跌破收回；沒有價格事件，成交量很難單獨解讀。",
      "放量突破後若第二、三日完全沒有跟進，應降低信心或提高止蝕紀律。",
      "成交量異常日要標記原因，例如業績、配售、指數換馬或大手成交，避免錯讀。",
    ],
    calibration: [
      "用 20 日或 50 日平均量作比較，比單看今日比昨日多更可靠。",
      "成交額可輔助成交股數，尤其比較不同價格股票時。",
      "低流動性股票要提高成交量門檻，因為少量資金也能製造假突破。",
    ],
    review: [
      "復盤每次突破是否有成交量確認，並統計無量突破的失敗率。",
      "標記高位放量後 5 至 10 日價格是否續強，若不續強，未來同類情境要更保守。",
      "把成交量角色寫清楚：確認、警告、異常事件，三者不要混用。",
    ],
  },
  atr: {
    title: "ATR 深層用法",
    intro:
      "ATR 深層用法是把波動轉成止蝕、倉位和交易篩選；它不判斷方向，但能防止風險失控。",
    framework: [
      "先看 ATR 是上升、下降還是穩定；上升代表不確定性提高，下降代表市場暫時收斂。",
      "把 ATR 轉成風險距離：止蝕太近會被正常波動掃走，太遠會令倉位過小或風險過大。",
      "ATR 要與價格結構結合，不能只說 1.5 ATR 止蝕，卻完全不看前低或支撐位置。",
    ],
    execution: [
      "先定單筆可虧金額，再用入場到止蝕距離反推股數；ATR 大時自然減倉。",
      "突破後 ATR 急升，追入要更保守，因為短線波動成本已經提高。",
      "移動止蝕可參考 1 至 3 倍 ATR，但要根據持倉週期決定，不要每日隨意改。",
    ],
    calibration: [
      "14 期是常用起點，短線可更短，波段可更長；重點是與交易週期一致。",
      "裂口日和財報日會推高 ATR，需判斷是一次性事件還是新波動 regime。",
      "不同股價水平應看 ATR 百分比，單看絕對 ATR 不利於跨股票比較。",
    ],
    review: [
      "復盤每筆交易是否因止蝕太近被普通波動掃出，這是 ATR 最能修正的錯誤。",
      "記錄入場當刻的 ATR 百分比，檢查高波動時是否仍然用平常倉位。",
      "虧損可以分為方向判斷錯誤和風險距離錯誤；ATR 主要處理後者。",
    ],
  },
  "bollinger-bands": {
    title: "布林帶深層用法",
    intro:
      "布林帶深層用法是理解價格相對平均和波動範圍的位置；碰上軌不等於賣，碰下軌不等於買。",
    framework: [
      "先看帶寬：帶寬收窄代表壓縮，擴大代表波動釋放，不直接代表方向。",
      "再看價格沿軌還是回歸：強趨勢會沿上軌或下軌運行，震盪市才較常回到中軸。",
      "最後看中軸：中軸常是趨勢節奏線，跌回中軸下方比單次碰上軌更值得留意。",
    ],
    execution: [
      "壓縮突破要等收盤突破區間，並觀察成交量或趨勢濾網是否配合。",
      "回歸交易只適合明確震盪區，不適合強趨勢沿軌時逆勢摸頂摸底。",
      "若突破後帶寬擴張但價格很快收回帶內，要提高假突破警覺。",
    ],
    calibration: [
      "20 期、2 倍標準差是起點；不同股票波動特性不同，要看帶寬和假訊號頻率。",
      "標準差對極端值敏感，重大消息日後短期通道可能被拉闊。",
      "可與 ATR、成交量和支撐阻力搭配，把波動訊號轉成可執行計劃。",
    ],
    review: [
      "復盤碰上軌後的交易，分清是趨勢沿軌還是震盪回歸。",
      "統計壓縮突破後是否有成交量和帶寬擴張跟進，沒有跟進的突破要降低信心。",
      "檢查自己是否把布林帶當成反向工具；這是最常見也最昂貴的誤讀。",
    ],
  },
  adx: {
    title: "ADX 深層用法",
    intro:
      "ADX 深層用法是判斷趨勢強度，不是方向；方向要交給價格結構或 +DI/-DI。",
    framework: [
      "先分清強度和方向：ADX 上升只代表趨勢性增強，不代表一定上升。",
      "再看 +DI 和 -DI：誰在上方代表哪一方較強，但交叉仍需價格確認。",
      "最後看市況：ADX 低位代表趨勢性不足，交叉訊號容易來回失效。",
    ],
    execution: [
      "趨勢交易可用 ADX 上升作濾網，只在趨勢性改善時提高順勢訊號權重。",
      "ADX 很高後不宜盲目追，因為趨勢可能已經成熟；要看價格是否仍有合理風險回報。",
      "若 +DI/-DI 反覆交叉且 ADX 低迷，應暫停用趨勢策略。",
    ],
    calibration: [
      "14 期是常用起點；短週期會更快但假訊號更多，長週期更慢但較穩。",
      "不同市場的 ADX 常態不同，不宜把單一門檻套用到所有股票。",
      "ADX 適合搭配均線、MACD 或突破策略，負責回答『現在有沒有趨勢性』。",
    ],
    review: [
      "復盤趨勢交易時記錄 ADX 是否上升，檢查虧損是否集中在低 ADX 環境。",
      "把 +DI/-DI 交叉和價格突破分開看，避免把交叉當成入場按鈕。",
      "若在高 ADX 尾段追入經常虧損，代表需要加入風險回報和獲利保護規則。",
    ],
  },
  "support-resistance": {
    title: "支撐阻力深層用法",
    intro:
      "支撐阻力深層用法是設計交易區域、觸發、止蝕和目標；它是交易計劃的主幹。",
    framework: [
      "先畫區域，不畫一條過度精準的線；區域要包含市場多次反應和合理波幅。",
      "支撐阻力要分層：大週期區域決定背景，小週期區域決定觸發。",
      "突破、回踩和假突破是三種不同劇本，入場與止蝕不能混用。",
    ],
    execution: [
      "突破劇本：等收盤突破，回踩不跌破原阻力，再用成交量或 K 線確認。",
      "反彈劇本：等支撐附近止跌，出現更高低點或小平台突破，再考慮入場。",
      "失效劇本：跌穿支撐或突破失敗後，不要把短線交易改口成長線投資。",
    ],
    calibration: [
      "區域寬度應與 ATR 或近期波幅相符；波動大時區域自然更寬。",
      "前高前低、成交密集區、VWAP、均線和斐波那契若重疊，區域權重可提高。",
      "若止蝕到目標不足 1:2，區域再漂亮也不值得交易。",
    ],
    review: [
      "復盤入場位置是否靠近區域邊緣；越接近中間，風險回報通常越差。",
      "記錄每次假突破是否有收盤收回和成交量異常，這能建立你的反應手冊。",
      "檢查是否在跌穿後移動止蝕；這是支撐阻力學習中最需要戒掉的錯誤。",
    ],
  },
};

function deepDiveFor(item, related) {
  const base = categoryDeepDiveProfiles[item.category] || categoryDeepDiveProfiles.綜合;
  const specific = indicatorDeepDiveOverrides[item.slug] || {};
  const source = { ...base, ...specific };
  const relatedText = relatedNames(related);
  return {
    title: source.title || `${item.abbr} 深層用法`,
    intro:
      source.intro ||
      `${item.abbr} 的深層用法，是把訊號放回市況、價格結構、風險回報和復盤紀錄中判斷。`,
    framework: source.framework,
    execution: source.execution,
    calibration: source.calibration,
    review: [
      ...source.review,
      `交叉驗證只保留分工清楚的工具：${relatedText} 可以輔助確認，但不要把相似訊號重複計票。`,
    ],
    drill: [
      `找 20 張 ${item.abbr} 典型圖，把每張分成「市況、價格位置、指標訊號、觸發、失效點」五欄。`,
      `挑 5 筆成功和 5 筆失敗案例，檢查差異是否來自市況、入場太急、止蝕太近或風險回報不足。`,
      `建立一條個人規則：沒有價格確認、沒有止蝕、沒有至少 1.5R 至 2R 空間，就算 ${item.abbr} 訊號漂亮也不交易。`,
    ],
  };
}

function profileFor(item) {
  return categoryTeachingProfiles[item.category] || categoryTeachingProfiles.綜合;
}

function relatedNames(related) {
  if (!related.length) return "價格結構與成交量";
  return related
    .slice(0, 3)
    .map((relatedItem) => relatedItem.abbr || relatedItem.name)
    .join("、");
}

const categoryTradeProfiles = {
  趨勢: {
    setup: "價格先站回主要均線或突破前高，且高低點開始抬高，才把它視為候選交易。",
    trigger:
      "等收市價確認突破，或突破後回踩不跌破關鍵位再入場；不要在指標剛轉向的一刻衝入。",
    stop: "止蝕放在突破 K 線低位、最近支撐，或 1 至 1.5 倍 ATR 之外。",
    target:
      "第一目標看前高或 2R；若上方阻力太近，風險回報不夠，寧願放棄。",
    anti:
      "反面教材：均線剛金叉就追高，跌回均線又說是假跌破，最後由短線單變成長線套牢。",
  },
  動能: {
    setup:
      "先確認價格在支撐、阻力或趨勢線附近，動能指標只用來判斷力度是否正在轉變。",
    trigger:
      "等動能由極端區回到正常區，或背離後價格真正突破小平台；不要只因超賣就買。",
    stop: "止蝕放在背離低點、平台低位或最近有效支撐下方。",
    target: "第一目標看中軸、前高或 1.5R 至 2R；動能轉弱時分批保護利潤。",
    anti:
      "反面教材：RSI 低於 30 就買，結果弱勢股一路低位鈍化，越跌越補，虧損快速放大。",
  },
  波動率: {
    setup:
      "先看波動是壓縮還是擴張；低波動等待方向，高波動先降低倉位，避免被正常震盪掃出。",
    trigger:
      "壓縮後等價格收盤突破區間，並觀察成交量或趨勢濾網是否配合。",
    stop: "止蝕用 ATR、通道另一側或突破失敗點，不用隨意的固定金額。",
    target:
      "用 2R、前高/前低或通道寬度估算目標；若止蝕太遠導致倉位過大，先減倉。",
    anti:
      "反面教材：看到布林帶收窄就預設一定向上，未等突破先買，結果向下擴張時沒有退路。",
  },
  成交量: {
    setup:
      "先找到價格訊號，例如突破、回踩或跌穿；成交量用來判斷市場是否接受這個方向。",
    trigger:
      "突破時成交量高於近期平均，或回踩時縮量、再轉強時放量，訊號才較值得跟進。",
    stop: "止蝕放在突破失敗點或放量 K 線低位；若放量後滯漲，要快速降低信心。",
    target: "目標看成交密集區、前高或 2R；若上方壓力區成交很重，先分批處理。",
    anti:
      "反面教材：只見爆量就追，以為多人買一定升，卻忽略高位爆量也可能是派發。",
  },
  支撐阻力: {
    setup:
      "先畫出明顯區域，不畫一條過度精準的線；價格接近區域時才開始等待訊號。",
    trigger:
      "等假跌破收回、突破收盤確認，或回踩原阻力不破；不要在區域中間隨意入場。",
    stop: "止蝕放在支撐阻力區外，而不是剛好貼在線上，避免被普通波動掃走。",
    target: "目標看下一個阻力/支撐區；若入場點離止蝕遠、離目標近，交易不值得做。",
    anti:
      "反面教材：價格碰到支撐就重倉買入，完全不等止跌訊號，結果支撐跌穿時才發現沒有計劃。",
  },
  "通道/型態": {
    setup:
      "先確認通道或型態至少被市場測試兩次以上；沒有清晰邊界，就不要勉強套用型態。",
    trigger:
      "等突破、跌破或回到通道邊界後出現確認 K 線，再用指標輔助判斷。",
    stop: "止蝕放在型態失效位置，例如通道外側、突破失敗點或最近波段高低位。",
    target:
      "目標可用通道寬度、前高前低或 2R；若型態會重畫，只用作輔助，不當作唯一依據。",
    anti:
      "反面教材：為了支持自己的方向，不斷重畫通道線，最後不是在分析市場，而是在合理化虧損。",
  },
  綜合: {
    setup:
      "先定義比較基準，例如恒指、標普 500 或同業指數，再判斷個股是否真的有相對優勢。",
    trigger:
      "相對強弱改善後，仍要等個股價格突破或回踩確認；相對強不是獨立買入理由。",
    stop: "止蝕仍以個股價格結構為準，不以相對指標作唯一出場條件。",
    target:
      "目標用個股前高、阻力區或 2R；若大市風險升高，降低倉位而不是硬扛。",
    anti:
      "反面教材：只因股票跑贏大市就買，但大市和個股都在下跌，最後只是跌得慢，不代表能賺。",
  },
  市場寬度: {
    setup:
      "先看大市指數方向，再用市場寬度判斷升跌是否有足夠參與度。",
    trigger:
      "寬度改善時，回到個股頁找價格突破；寬度惡化時，減少追高和槓桿。",
    stop: "單一交易仍以個股止蝕為準；市場寬度只決定進攻或保守，不代替出場規則。",
    target:
      "大市寬度支持時可耐心看 2R 或前高；寬度背離時，先提高獲利保護。",
    anti:
      "反面教材：指數創高就追入所有股票，卻沒發現只有少數權重股在升，廣度早已轉弱。",
  },
};

const researchDatabaseStats = {
  experts: 100,
  indicatorMethods: 72,
  methodFamilies: 18,
  sources: 206,
};

const categoryAuthorityNotes = {
  趨勢: {
    winner: "查爾斯・道 / Charles H. Dow、理查・唐奇安 / Richard Donchian、傑拉德・阿佩爾 / Gerald Appel",
    runnerUp: "約翰・墨菲 / John J. Murphy、羅伯特・科爾比 / Robert W. Colby",
    judgment:
      "趨勢類工具的判斷標準不是最快轉向，而是能否穩定回答方向、結構和趨勢是否仍成立。",
    material: "道氏理論、唐奇安通道與移動平均研究",
    use:
      "先用價格結構定方向，再用趨勢指標做濾網；若只在單一參數下有效，應降低權重。",
  },
  動能: {
    winner: "威爾斯・威爾德 / J. Welles Wilder Jr.、拉瑞・威廉斯 / Larry Williams、馬丁・普林格 / Martin J. Pring",
    runnerUp: "羅伯特・科爾比 / Robert W. Colby、康斯坦絲・布朗 / Constance Brown",
    judgment:
      "動能類工具最容易被誤讀成買賣指令；較可靠的用法是判斷力度區間、背離和鈍化，不是單看超買超賣。",
    material: "《技術交易系統新概念》、動量與震盪指標研究",
    use:
      "把動能視為第二層證據；價格結構未確認前，背離只算預警。",
  },
  波動率: {
    winner: "約翰・布林格 / John Bollinger、威爾斯・威爾德 / J. Welles Wilder Jr.",
    runnerUp: "傑瑞米・杜普萊西斯 / Jeremy du Plessis、奧利維耶・塞班 / Olivier Seban",
    judgment:
      "波動率工具主要用來量度風險距離和波幅狀態，不是用來預測方向。",
    material: "《布林格談布林通道》與 ATR / SuperTrend 研究",
    use:
      "用於止蝕、倉位、壓縮/擴張判斷；若拿來直接看升看跌，就是概念錯配。",
  },
  成交量: {
    winner: "理查・威科夫 / Richard D. Wyckoff、約瑟夫・格蘭維爾 / Joseph Granville、馬克・柴金 / Marc Chaikin",
    runnerUp: "巴夫・多米爾 / Buff Dormeier、布萊恩・香農 / Brian Shannon",
    judgment:
      "成交量工具強在確認市場是否接受價格，而不是單獨預測方向。",
    material: "《讀帶研究》、OBV、Chaikin Money Flow 與 Anchored VWAP 研究",
    use:
      "先有價格事件，再用成交量判斷可信度；異常成交日要標記，不應機械套用。",
  },
  支撐阻力: {
    winner: "羅伯特・愛德華茲、約翰・麥基 / Robert D. Edwards / John Magee",
    runnerUp: "威廉・江恩 / W. D. Gann、彼得・史戴梅爾 / J. Peter Steidlmayer",
    judgment:
      "支撐阻力較可靠的用法，是把市場記憶轉成區域、失效點和 R 值，而不是追求一條完美線。",
    material: "《股票趨勢技術分析》與價格區域研究",
    use:
      "用區域思維處理前高前低、成交密集區和回踩；收盤確認比盤中觸碰更可靠。",
  },
  "通道/型態": {
    winner: "湯瑪斯・布考斯基 / Thomas N. Bulkowski、史蒂夫・尼森 / Steve Nison、本間宗久 / Munehisa Homma",
    runnerUp: "羅伯特・愛德華茲、約翰・麥基 / Robert D. Edwards / John Magee",
    judgment:
      "型態類工具主觀性高；代表性作者通常能把形態規則、統計觀察和交易情境分開處理。",
    material: "《圖表型態百科全書》與《日本蠟燭圖技術》",
    use:
      "形態只作情境語言，必須回到位置、成交量、確認與失效條件。",
  },
  市場寬度: {
    winner: "內德・戴維斯 / Ned Davis、謝爾曼・麥克萊倫、瑪麗安・麥克萊倫 / Sherman / Marian McClellan",
    runnerUp: "理查・阿姆斯 / Richard W. Arms Jr.、拉瑞・威廉斯 / Larry Williams",
    judgment:
      "市場寬度強在判斷指數背後的參與度與系統性風險，不適合直接代替單一股票入場。",
    material: "McClellan Oscillator、TRIN / Arms Index 與市場寬度研究",
    use:
      "用於決定進攻或保守；個股仍需自己的價格結構與止蝕。",
  },
  綜合: {
    winner: "大衛・阿隆森 / David Aronson、安德魯・羅 / Andrew W. Lo、佩里・考夫曼 / Perry J. Kaufman",
    runnerUp: "茱莉・達爾奎斯特 / Julie R. Dahlquist、湯瑪斯・布考斯基 / Thomas N. Bulkowski",
    judgment:
      "綜合與系統類工具的判斷標準是可驗證、可重複、能承認樣本外失效，而不是回測曲線漂亮。",
    material: "實證技術分析、回測與交易系統研究",
    use:
      "把它用在研究框架和風險控制層；不要把統計描述誤讀成因果保證。",
  },
};

const indicatorAuthorityNotes = {
  sma: {
    winner: "傑拉德・阿佩爾 / Gerald Appel",
    runnerUp: "約翰・墨菲、羅伯特・科爾比 / John J. Murphy / Robert W. Colby",
    judgment:
      "移動平均的判讀重點以阿佩爾為主，因其把均線動能延伸成 MACD 等可操作框架；墨菲與科爾比適合作教材與百科式對照。",
    material: "《技術分析：主動投資者的強力工具》；《金融市場技術分析》",
    use:
      "SMA 較適合判斷中長線結構和市場位置；若要反應速度，才轉用 EMA 或 MACD。",
  },
  ema: {
    winner: "傑拉德・阿佩爾 / Gerald Appel",
    runnerUp: "約翰・墨菲、羅伯特・科爾比 / John J. Murphy / Robert W. Colby",
    judgment:
      "EMA 的核心價值在更快反映近期價格，較可靠的用法是服務趨勢節奏與 MACD，而不是盲目縮短週期。",
    material: "移動平均與 MACD 研究",
    use:
      "EMA 適合作短中線節奏；在橫行市應降低穿越訊號權重。",
  },
  "ma-ribbon": {
    winner: "達利・古比 / Daryl Guppy",
    runnerUp: "傑拉德・阿佩爾 / Gerald Appel",
    judgment:
      "多重均線的判讀重點在於分辨短線交易者與長線資金是否同向，而不是把每條線都當獨立訊號。",
    material: "Guppy 多重移動平均與移動平均研究",
    use:
      "用排列、收斂與發散看趨勢質素；不要在震盪市過度解讀。",
  },
  hma: {
    winner: "艾倫・霍爾 / Alan Hull",
    runnerUp: "派翠克・馬洛伊 / Patrick G. Mulloy",
    judgment:
      "Hull MA 強在降低傳統均線滯後，但快不代表準，仍要用結構確認。",
    material: "Hull Moving Average 與快速平滑均線研究",
    use:
      "適合觀察短中線節奏；若頻繁翻轉，代表市況不適合追趨勢。",
  },
  kama: {
    winner: "佩里・考夫曼 / Perry J. Kaufman",
    runnerUp: "約翰・艾勒斯 / John F. Ehlers",
    judgment:
      "KAMA 的優勢是按市場效率調整敏感度，適合處理雜訊與趨勢切換。",
    material: "《交易系統與方法》；《更聰明的交易》",
    use:
      "用來降低盤整雜訊，但仍需配合價格結構和風險距離。",
  },
  macd: {
    winner: "傑拉德・阿佩爾 / Gerald Appel",
    runnerUp: "亞歷克斯・斯皮羅格魯 / Alex Spiroglou",
    judgment:
      "MACD 的代表人物是阿佩爾，因其原創性與專屬性最強；Spiroglou 的 MACD-V 可作波動標準化對照。",
    material: "《技術分析：主動投資者的強力工具》；MACD-V 研究",
    use:
      "MACD 較適合趨勢動能，不適合在窄幅震盪中追逐每次交叉。",
  },
  rsi: {
    winner: "威爾斯・威爾德 / J. Welles Wilder Jr.",
    runnerUp: "拉倫斯・康納斯、康斯坦絲・布朗、安德魯・卡德威爾 / Laurence Connors / Constance Brown / Andrew Cardwell",
    judgment:
      "RSI 的代表人物是威爾德，因原創性與資料覆蓋最強；Connors 偏短線均值回歸，Brown/Cardwell 偏區間與反轉詮釋。",
    material: "《技術交易系統新概念》；ConnorsRSI；Cardwell RSI Reversals；《專業交易者技術分析》",
    use:
      "先分辨趨勢與震盪；強趨勢中的 RSI 鈍化比單次超買超賣更重要。",
  },
  stochastic: {
    winner: "喬治・藍恩 / George C. Lane",
    runnerUp: "圖沙・昌德、史丹利・克羅爾 / Tushar S. Chande / Stanley Kroll",
    judgment:
      "KD 的優勢在短線高低位敏感度；較可靠的用法是配合區間邊界，而不是在強趨勢中逆勢猜頂底。",
    material: "Lane's Stochastics；《新技術交易者》",
    use:
      "適合震盪市與短線節奏；強趨勢中要先看鈍化和價格結構。",
  },
  "stochastic-rsi": {
    winner: "圖沙・昌德 / Tushar S. Chande",
    runnerUp: "史丹利・克羅爾 / Stanley Kroll",
    judgment:
      "Stochastic RSI 比 RSI 更敏感，優勢是捕捉短線動能變化，弱點是雜訊更多。",
    material: "《新技術交易者》",
    use:
      "只適合作輔助觸發；不可把它和 RSI、KD 當三個獨立投票。",
  },
  cci: {
    winner: "唐納德・蘭伯特 / Donald R. Lambert",
    runnerUp: "羅伯特・科爾比 / Robert W. Colby",
    judgment:
      "CCI 用來衡量價格偏離典型價格均值的程度；它原本源於商品市場，但也可用作多市場動能工具。",
    material: "Commodity Channel Index 研究",
    use:
      "用來看偏離與回歸，不要在單邊趨勢中機械反向。",
  },
  momentum: {
    winner: "拉瑞・威廉斯 / Larry Williams",
    runnerUp: "羅伯特・科爾比、馬丁・普林格 / Robert W. Colby / Martin J. Pring",
    judgment:
      "動量研究以威廉斯較具代表性，因其專屬動量工具與實戰研究較強；普林格與科爾比適合做框架和歷史對照。",
    material: "《技術分析詳解》；《技術市場指標百科全書》；威廉斯動量研究",
    use:
      "動量只說力度變化，不保證方向延續；價格確認仍是最後裁判。",
  },
  "williams-r": {
    winner: "拉瑞・威廉斯 / Larry Williams",
    runnerUp: "喬治・藍恩 / George C. Lane",
    judgment:
      "Williams %R 的優勢在短線極端位置判讀；和 KD 類似，最怕在強趨勢中逆勢使用。",
    material: "《我去年如何交易商品賺進一百萬美元》",
    use:
      "適合震盪區間與短線回調；趨勢市要先看價格是否真的轉弱。",
  },
  adx: {
    winner: "威爾斯・威爾德 / J. Welles Wilder Jr.",
    runnerUp: "羅伯特・科爾比 / Robert W. Colby",
    judgment:
      "ADX / DMI 的代表人物是威爾德，原創性和專屬性最強；核心用途是量度趨勢強度，不是直接判斷方向。",
    material: "《技術交易系統新概念》",
    use:
      "ADX 上升代表趨勢性增強；方向仍要由 +DI/-DI 和價格結構判斷。",
  },
  dmi: {
    winner: "威爾斯・威爾德 / J. Welles Wilder Jr.",
    runnerUp: "羅伯特・科爾比 / Robert W. Colby",
    judgment:
      "DMI 的優勢是把方向性移動拆成 +DI 和 -DI；較可靠的用法是配合 ADX 判斷趨勢是否值得跟。",
    material: "《技術交易系統新概念》",
    use:
      "DI 交叉不是獨立入場，必須有趨勢強度和價格確認。",
  },
  aroon: {
    winner: "圖沙・昌德 / Tushar S. Chande",
    runnerUp: "史丹利・克羅爾 / Stanley Kroll",
    judgment:
      "Aroon 的優勢是用新高/新低距今時間判斷趨勢是否新鮮；適合補充均線類工具。",
    material: "《新技術交易者》",
    use:
      "用於辨識趨勢啟動或老化；不要單靠交叉追入。",
  },
  supertrend: {
    winner: "奧利維耶・塞班 / Olivier Seban",
    runnerUp: "威爾斯・威爾德 / J. Welles Wilder Jr.",
    judgment:
      "SuperTrend 的價值在把 ATR 風險距離轉成趨勢跟隨線；弱點是震盪市容易翻轉。",
    material: "SuperTrend 與 ATR 研究",
    use:
      "適合趨勢跟隨和移動止蝕；若價格反覆穿越，代表市況不配合。",
  },
  psar: {
    winner: "威爾斯・威爾德 / J. Welles Wilder Jr.",
    runnerUp: "羅伯特・科爾比 / Robert W. Colby",
    judgment:
      "Parabolic SAR 的優勢是追蹤趨勢止蝕，最大弱點是盤整市連續反覆。",
    material: "《技術交易系統新概念》",
    use:
      "只在趨勢清晰時提高權重；橫行市應停用或降低倉位。",
  },
  ichimoku: {
    winner: "細田悟一 / Goichi Hosoda",
    runnerUp: "約翰・墨菲 / John J. Murphy",
    judgment:
      "一目均衡表的代表人物是細田悟一，因其完整整合趨勢、支撐阻力、時間與動能。",
    material: "《一目均衡表》",
    use:
      "不要只看雲層突破；同時檢查轉換線、基準線、遲行線和大週期位置。",
  },
  "bollinger-bands": {
    winner: "約翰・布林格 / John Bollinger",
    runnerUp: "傑瑞米・杜普萊西斯 / Jeremy du Plessis",
    judgment:
      "布林通道的代表人物是 John Bollinger；其核心不是碰上軌賣、碰下軌買，而是理解波動率與價格位置。",
    material: "《布林格談布林通道》",
    use:
      "看壓縮、擴張與相對位置；方向要由價格突破、成交量和市況確認。",
  },
  "donchian-channel": {
    winner: "理查・唐奇安 / Richard Donchian",
    runnerUp: "查爾斯・道 / Charles H. Dow",
    judgment:
      "唐奇安通道在趨勢跟隨中具代表性；較可靠的用法是用高低突破定義方向與失效。",
    material: "Commodity Trend Timing 研究",
    use:
      "適合突破與趨勢跟隨；震盪市要接受假突破成本。",
  },
  atr: {
    winner: "威爾斯・威爾德 / J. Welles Wilder Jr.",
    runnerUp: "奧利維耶・塞班 / Olivier Seban",
    judgment:
      "ATR 的代表人物是威爾德；它的主要用途是風險距離、倉位和波幅 regime，不是方向預測。",
    material: "《技術交易系統新概念》；SuperTrend 研究",
    use:
      "用 ATR 設止蝕與倉位；波動放大時先縮倉，而不是移走止蝕。",
  },
  obv: {
    winner: "約瑟夫・格蘭維爾 / Joseph Granville",
    runnerUp: "理查・威科夫 / Richard D. Wyckoff",
    judgment:
      "OBV 的代表人物是格蘭維爾；它適合看累積成交量是否支持價格，但異常成交會留下長期影響。",
    material: "《格蘭維爾股市獲利新鑰》",
    use:
      "用於確認突破或背離；不要單靠 OBV 上升就買入。",
  },
  volume: {
    winner: "理查・威科夫 / Richard D. Wyckoff",
    runnerUp: "約瑟夫・格蘭維爾、巴夫・多米爾 / Joseph Granville / Buff Dormeier",
    judgment:
      "成交量分析以威科夫較具代表性，因其把量價關係放回供求、吸籌與派發框架。",
    material: "《讀帶研究》；《我如何交易與投資股票和債券》",
    use:
      "先看價格事件，再看成交量是否確認；高位爆量可能是買盤，也可能是派發。",
  },
  "volume-ma": {
    winner: "理查・威科夫 / Richard D. Wyckoff",
    runnerUp: "約瑟夫・格蘭維爾 / Joseph Granville",
    judgment:
      "成交量均線只是基準，不是訊號本身；較可靠的用法是辨認異常參與度。",
    material: "量價分析與成交量基準研究",
    use:
      "把放量/縮量放回突破、回踩或跌穿情境中解讀。",
  },
  vwap: {
    winner: "布萊恩・香農 / Brian Shannon",
    runnerUp: "彼得・史戴梅爾 / J. Peter Steidlmayer",
    judgment:
      "VWAP / Anchored VWAP 以 Brian Shannon 為核心權威；它把價格和成交量加權後轉成市場成本區域。",
    material: "《多時間框架技術分析》；《用 Anchored VWAP 提高交易收益》",
    use:
      "適合判斷機構成本、回踩與接受區；不要把 VWAP 當固定支撐線。",
  },
  mfi: {
    winner: "金・匡、阿夫魯姆・蘇達克 / Gene Quong / Avrum Soudack",
    runnerUp: "馬克・柴金 / Marc Chaikin",
    judgment:
      "MFI 屬共同權威，優勢是把價格位置和成交量合併成震盪指標。",
    material: "Money Flow Index 研究",
    use:
      "用作量價版 RSI；異常成交日和低流動性股票要特別小心。",
  },
  "chaikin-money-flow": {
    winner: "馬克・柴金 / Marc Chaikin",
    runnerUp: "理查・威科夫 / Richard D. Wyckoff",
    judgment:
      "CMF 的代表人物是 Marc Chaikin；它把收盤位置與成交量結合，用於觀察資金流壓力。",
    material: "Chaikin Money Flow 研究",
    use:
      "適合確認突破是否有資金支持；不要把短期資金流當成長期估值結論。",
  },
  "accumulation-distribution": {
    winner: "馬克・柴金 / Marc Chaikin",
    runnerUp: "理查・威科夫 / Richard D. Wyckoff",
    judgment:
      "A/D 線承接威科夫量價思想，柴金版本把收盤位置與成交量結合得更公式化。",
    material: "Accumulation / Distribution 與 Chaikin 研究",
    use:
      "用於看吸籌/派發傾向；需要用價格結構驗證。",
  },
  "force-index": {
    winner: "亞歷山大・艾爾德 / Alexander Elder",
    runnerUp: "理查・威科夫 / Richard D. Wyckoff",
    judgment:
      "Force Index 的代表人物是 Elder，因其把價格變化、方向與成交量整合成力度讀數。",
    material: "《以交易為生》",
    use:
      "適合作短線力度確認；極端值需配合趨勢和均線判斷。",
  },
  "fibonacci-retracement": {
    winner: "喬・迪納波利 / Joe DiNapoli",
    runnerUp: "卡洛琳・波羅登、羅伯特・邁納 / Carolyn Boroden / Robert C. Miner",
    judgment:
      "費波納契工具的判讀重點在於規則一致與多重位置重疊，而不是事後找一個剛好命中的比例。",
    material: "《DiNapoli 水平》；《費波納契交易》；《動態交易》",
    use:
      "只把比例當候選區域；必須等待價格反應和風險回報合格。",
  },
  "support-resistance": {
    winner: "羅伯特・愛德華茲、約翰・麥基 / Robert D. Edwards / John Magee",
    runnerUp: "威廉・江恩、彼得・史戴梅爾 / W. D. Gann / J. Peter Steidlmayer",
    judgment:
      "支撐阻力屬共同權威，代表性作者在圖表結構教學上最完整；江恩與 Market Profile 可作補充。",
    material: "《股票趨勢技術分析》",
    use:
      "用區域、收盤和回踩確認；不要把一次觸碰當成保證反轉。",
  },
  "elder-ray": {
    winner: "亞歷山大・艾爾德 / Alexander Elder",
    runnerUp: "馬丁・普林格 / Martin J. Pring",
    judgment:
      "Elder-Ray 的代表人物是 Elder；其核心是分拆牛力與熊力，而不是單看一條震盪線。",
    material: "《以交易為生》",
    use:
      "配合 EMA 看趨勢中的買賣力量；在橫行市要降低訊號權重。",
  },
  "relative-strength-comparative": {
    winner: "威廉・歐尼爾 / William J. O'Neil",
    runnerUp: "馬克・米勒維尼 / Mark Minervini",
    judgment:
      "相對強弱強在強勢股篩選，O'Neil 的 CAN SLIM 與 Minervini 的 VCP 可互相對照。",
    material: "CAN SLIM、杯柄形態與強勢股研究",
    use:
      "相對強只代表跑贏基準，不代表絕對上升；仍要看個股價格突破。",
  },
  "advance-decline-line": {
    winner: "內德・戴維斯 / Ned Davis",
    runnerUp: "謝爾曼・麥克萊倫、瑪麗安・麥克萊倫 / Sherman / Marian McClellan",
    judgment:
      "A/D Line 的優勢是檢查指數升跌背後是否有廣泛參與。",
    material: "市場寬度研究",
    use:
      "用於大市健康度；不要直接當成個股買賣點。",
  },
  "mcclellan-oscillator": {
    winner: "謝爾曼・麥克萊倫、瑪麗安・麥克萊倫 / Sherman / Marian McClellan",
    runnerUp: "內德・戴維斯 / Ned Davis",
    judgment:
      "McClellan Oscillator 屬共同權威，適合看市場寬度動能與短中期修復。",
    material: "《獲利型態》",
    use:
      "只作大市背景，需回到個股價格結構執行。",
  },
  trin: {
    winner: "理查・阿姆斯 / Richard W. Arms Jr.",
    runnerUp: "內德・戴維斯 / Ned Davis",
    judgment:
      "TRIN / Arms Index 的代表人物是 Richard Arms；它把上升/下跌家數與成交量壓力結合。",
    material: "The Arms Index 研究",
    use:
      "適合短線市場壓力判讀；極端值不等於立刻反轉。",
  },
  "coppock-curve": {
    winner: "艾德溫・科波克 / Edwin S. Coppock",
    runnerUp: "馬丁・普林格 / Martin J. Pring",
    judgment:
      "Coppock Curve 原本偏長線轉勢與市場心理修復，優勢不在短線進出。",
    material: "Coppock Curve 研究",
    use:
      "用作長線背景，不適合日內或短線追入。",
  },
  "heikin-ashi": {
    winner: "史蒂夫・尼森 / Steve Nison",
    runnerUp: "本間宗久、湯瑪斯・布考斯基 / Munehisa Homma / Thomas N. Bulkowski",
    judgment:
      "Heikin Ashi 可平滑趨勢視覺，但非標準成交價格；回測時尤其容易誤導。",
    material: "K 線與圖表型態研究",
    use:
      "只作趨勢視覺輔助；實際入場與回測必須回到真實 OHLC 價格。",
  },
  renko: {
    winner: "史蒂夫・尼森 / Steve Nison",
    runnerUp: "湯瑪斯・布考斯基 / Thomas N. Bulkowski",
    judgment:
      "Renko 可過濾時間雜訊，但會改變價格呈現方式；較可靠的用法是輔助看結構，不替代成交。",
    material: "日本圖表方法與形態研究",
    use:
      "用作趨勢整理圖；策略回測要留意非標準價格和重畫問題。",
  },
  "volume-profile": {
    winner: "彼得・史戴梅爾 / J. Peter Steidlmayer",
    runnerUp: "詹姆斯・道爾頓 / James F. Dalton",
    judgment:
      "Volume Profile / Market Profile 的優勢是顯示成交接受區與價格分佈，而不是直接預測方向。",
    material: "Market Profile 與拍賣市場研究",
    use:
      "用於找成交密集區、接受/拒絕區；仍需價格觸發與止蝕。",
  },
};

function tradeProfileFor(item) {
  return categoryTradeProfiles[item.category] || categoryTradeProfiles.綜合;
}

function authorityForIndicator(item) {
  return indicatorAuthorityNotes[item.slug] || categoryAuthorityNotes[item.category] || categoryAuthorityNotes.綜合;
}

const categoryMasterOperatorProfiles = {
  趨勢: {
    coreQuestion: "這不是問明天升跌，而是問趨勢是否仍值得跟、回踩是否仍健康、結構是否尚未失效。",
    marketRead: [
      "先用較高週期確認大方向，只有高低點、均線斜率與主要結構同向時，才把訊號列入候選。",
      "再看執行週期是否接近回踩、突破或前高前低；遠離關鍵位置的訊號，多數只是追價衝動。",
      "最後才看指標本身是否同步，不讓指標凌駕價格結構。",
    ],
    gradeA: "價格在主要結構同側、回踩不破、指標重新轉強、上方目標至少 2R。",
    gradeB: "大方向正確但觸發仍未完成，只能觀察或小倉試單。",
    cancel: "價格跌回突破位下方、均線斜率轉平或跌穿前低，訊號立即降級。",
    execution: [
      "入場通常等收盤確認或回踩成功，不在第一下指標轉向時急追。",
      "止蝕放在結構失效點或合理 ATR 之外，避免被正常回調掃走。",
      "到 1R 先把風險降下來，到前高或 2R 再決定減倉、移動止蝕或讓利潤奔跑。",
    ],
    sizing: [
      "趨勢初段可用正常倉位；趨勢後段或遠離均線時降低倉位。",
      "加倉只能發生在新一輪回踩成功後，不因帳面盈利而任意加碼。",
      "連續兩次假突破後暫停同一方向交易，等待結構重新清晰。",
    ],
  },
  動能: {
    coreQuestion: "看動能時先問力度正在增強還是衰退，而不是把高低數值直接翻譯成買賣。",
    marketRead: [
      "先標出價格位置：支撐、阻力、趨勢中段、突破後回踩，位置不同，動能訊號價值不同。",
      "把極端讀數視為狀態，不視為命令；強勢可以長期超買，弱勢可以長期超賣。",
      "背離只算早期警號，必須等價格確認才可升級為交易訊號。",
    ],
    gradeA: "價格在關鍵位、動能轉向、價格完成突破/跌破確認，且風險回報合格。",
    gradeB: "動能改善但價格仍未突破結構，只能列入觀察名單。",
    cancel: "價格未確認、成交量不支持，或動能與大方向逆向時，訊號降級。",
    execution: [
      "逆勢反轉一定比指標晚一步入場，先等價格收盤確認。",
      "順勢回調則等動能回落後重新轉強，同時價格守住關鍵支撐。",
      "離場不只看指標回落，要看是否跌穿小平台、前低或主要節奏線。",
    ],
    sizing: [
      "背離反轉屬較高難度，先用較小倉位；順勢動能延續才可用正常倉位。",
      "若訊號只來自一個震盪指標，不加倉。",
      "連續三次極端讀數失敗後，重新檢查是否處於強趨勢鈍化。",
    ],
  },
  波動率: {
    coreQuestion: "波動率工具的好用法，是先控制活下來的風險，再談突破、回歸或跟隨。",
    marketRead: [
      "先分辨壓縮、正常波動和擴張；不同波動 regime 需要不同止蝕和倉位。",
      "低波動不是安全，只代表市場暫時安靜；高波動不是方向，只代表成本變高。",
      "把波幅與價格位置結合，單獨的波動數值不能構成方向判斷。",
    ],
    gradeA: "壓縮後收盤突破、波動開始擴張、成交量跟進，且止蝕距離仍容許至少 2R。",
    gradeB: "波動有變化但方向未確認，只適合等待，不預先猜突破方向。",
    cancel: "突破後快速收回、止蝕距離過大或倉位無法控制在風險上限內，取消交易。",
    execution: [
      "先用波動估止蝕，再反推股數，而不是先決定買多少。",
      "波動急升後不追第一下，等回踩或收盤確認降低滑價風險。",
      "移動止蝕跟隨波幅和結構，不因短線盈利就貼得太近。",
    ],
    sizing: [
      "波動高於平常時自動縮倉，波動低但方向未明時也不重倉。",
      "若止蝕距離超出平常兩倍，先減半倉位或放棄。",
      "重大消息日前後暫停用普通波動規則，先等新常態形成。",
    ],
  },
  成交量: {
    coreQuestion: "看成交量時，先問市場是否接受這個價格，而不是看到放量就興奮。",
    marketRead: [
      "先有價格事件，再讀成交量；沒有突破、跌穿、回踩或反彈，成交量很難單獨解讀。",
      "同樣放量，低位止跌、高位滯漲和突破前高的意思完全不同。",
      "成交量要和近期平均比較，也要排除配售、停牌復牌、財報和指數換馬等異常事件。",
    ],
    gradeA: "突破或回踩發生在關鍵位，成交量高於近期平均，後續價格仍能接受新區域。",
    gradeB: "成交量改善但價格沒有完成確認，只能提高觀察權重。",
    cancel: "放量後價格不升反跌、突破後沒有跟進量，或成交量來自一次性事件，訊號降級。",
    execution: [
      "放量突破後等收盤或回踩，避免盤中假突破。",
      "縮量回踩後再放量轉強，是比單日爆量更成熟的節奏。",
      "高位巨量而價格停滯時先保護利潤，不急於用故事解釋。",
    ],
    sizing: [
      "低流動性股票即使訊號漂亮也降低倉位。",
      "若成交額不足以支持正常進出，直接跳過，不用勉強做。",
      "高位異常巨量後的新倉要縮小，因為分歧和滑價風險上升。",
    ],
  },
  支撐阻力: {
    coreQuestion: "支撐阻力的好用法，是先規劃區域和失效，再等待市場在該區域給出反應。",
    marketRead: [
      "用區域取代單線，並把大週期區域和小週期觸發分開。",
      "判斷價格是在區域邊緣還是中間，區域中間通常風險回報最差。",
      "支撐阻力必須搭配收盤、成交量或 K 線反應，不是碰到就買賣。",
    ],
    gradeA: "價格到達高價值區域、出現確認反應、止蝕在區域外且目標到下一區域至少 2R。",
    gradeB: "區域重要但尚未確認，只能等待下一支或回踩。",
    cancel: "收盤跌穿/升穿失效區，或入場點離止蝕太遠、離目標太近，取消交易。",
    execution: [
      "入場在區域邊緣等待確認，不在區域中間追。",
      "止蝕放在區域外加合理波幅，不貼在線下方。",
      "目標先看下一個阻力/支撐，未到 1.5R 至 2R 不做。",
    ],
    sizing: [
      "區域越清楚、失效越近，倉位才可正常；區域越寬，倉位越小。",
      "假突破策略屬高難度，需小倉並快速承認錯誤。",
      "若價格第三次測試同一支撐仍無反彈，降低支撐有效性。",
    ],
  },
  "通道/型態": {
    coreQuestion: "型態的重點，是把結構變成可驗證規則，而不是事後替圖表起名字。",
    marketRead: [
      "先確認邊界是否清楚、觸碰是否足夠；結構模糊時，不要勉強套用型態。",
      "分清延續、反轉、壓縮和假突破，不同劇本不能混用同一入場。",
      "若工具會重畫，只能用作結構整理，不當成即時決策核心。",
    ],
    gradeA: "型態邊界清楚、突破/跌破已收盤確認、成交量或波動配合，止蝕與目標明確。",
    gradeB: "型態正在成熟但未突破，只適合預備計劃，不先下注。",
    cancel: "突破後收回型態內、邊界需要反覆重畫，或目標不足 2R，降級或取消。",
    execution: [
      "在通道中間少做，重點放在邊界反應或突破後回踩。",
      "入場前先寫出型態失效點，失效後不重畫線條合理化。",
      "型態目標可用通道寬度、前高前低或 2R，但要先扣除滑價和交易成本。",
    ],
    sizing: [
      "型態越主觀，倉位越保守。",
      "突破第一次失敗後不立刻重試，等待新結構形成。",
      "重畫型工具只作輔助，不作重倉依據。",
    ],
  },
  綜合: {
    coreQuestion: "綜合指標要把選股、比較和風險拆開，避免把統計描述誤當買賣訊號。",
    marketRead: [
      "先固定比較基準和期間，否則相對強弱和相關性沒有可比性。",
      "分清跑贏大市、絕對上升和風險下降，三者不是同一件事。",
      "綜合工具主要用來排序和過濾，交易觸發仍回到價格結構。",
    ],
    gradeA: "相對表現改善、價格結構同步突破、行業或大市背景支持，且風險集中度可控。",
    gradeB: "相對表現好但價格未確認，只列入候選名單。",
    cancel: "大市風險轉差、個股跌穿結構，或組合集中在同一風險來源，降級。",
    execution: [
      "先用綜合指標篩出候選，再用趨勢、成交量和 R 值決定是否交易。",
      "組合內同類股票不要同時重倉，避免看似分散其實同源風險。",
      "相對強轉弱時先停止加倉，再看價格是否觸發離場。",
    ],
    sizing: [
      "排名靠前不等於重倉，倉位仍由波動和止蝕距離決定。",
      "同一行業或同一因子最多設定總風險上限。",
      "相關性在危機時會上升，壓力期要主動降風險。",
    ],
  },
  市場寬度: {
    coreQuestion: "市場寬度用來決定攻守姿態，不是替每隻股票產生買賣指令。",
    marketRead: [
      "先看指數與內部參與是否一致；指數創高但寬度轉弱，代表升勢變窄。",
      "寬度改善時提高進攻意願，寬度惡化時降低追高和槓桿。",
      "寬度只做大市背景，個股仍需要自己的入場、止蝕和目標。",
    ],
    gradeA: "寬度改善、指數結構轉強、個股同步突破，三者一致才提高進攻。",
    gradeB: "寬度改善但指數未確認，先建立觀察名單。",
    cancel: "寬度惡化、指數跌穿結構或只有少數權重股撐市，降低倉位。",
    execution: [
      "寬度轉強後找領先板塊和相對強股，不直接把寬度當入場。",
      "寬度背離時，已有持倉先保護利潤，新倉要求更高 R 值。",
      "若大市背景差，單一個股訊號要縮倉或延後確認。",
    ],
    sizing: [
      "寬度支持時可用正常風險，寬度惡化時降低每筆風險。",
      "大市背離期間避免槓桿和高度相關持倉。",
      "寬度修復初期先分批，不一次投入全部倉位。",
    ],
  },
};

function masterOperatorFor(item, related) {
  const profile = categoryMasterOperatorProfiles[item.category] || categoryMasterOperatorProfiles.綜合;
  const trade = tradeProfileFor(item);
  const authority = authorityForIndicator(item);
  const relatedText = relatedNames(related);
  const comparator = authority.runnerUp || "同分類工具和本頁相關指標";
  return {
    title: `${item.abbr} 實戰判讀方式`,
    coreQuestion: profile.coreQuestion,
    decisionRows: [
      ["先問自己", `${item.abbr} 正在回答「${item.uses.join("、")}」哪一類問題？若問題不清，先不看數值。`],
      ["優先脈絡", `先讀 ${authority.winner} 的原始概念，再用 ${comparator} 作對照，不把改良用法和原始用途混在一起。`],
      ["A 級訊號", profile.gradeA],
      ["B 級訊號", profile.gradeB],
      ["取消/降級", profile.cancel],
      ["交叉驗證", `只用 ${relatedText} 檢查不同類型證據，不用相似指標重複計票。`],
    ],
    marketRead: profile.marketRead,
    execution: [
      ...profile.execution,
      `具體到 ${item.abbr}：${trade.trigger}`,
      `失效後的處理：${trade.stop}`,
    ],
    sizing: profile.sizing,
    journal: [
      `日誌第一欄寫「市況」：這次 ${item.abbr} 是用於${item.uses.join("、")}，還是被拿來支持既有偏見？`,
      "第二欄寫「觸發」：價格、指標、成交量和 R 值哪一項未完成？未完成就標為觀察，不標為交易。",
      "第三欄寫「結果」：盈利、虧損或放棄交易都要記錄，放棄交易也是訓練樣本。",
      `第四欄寫「修正」：下次遇到同類 ${item.abbr} 訊號，要提高、降低還是維持權重。`,
    ],
  };
}

function lessonFor(item, related) {
  const profile = profileFor(item);
  const trade = tradeProfileFor(item);
  const authority = authorityForIndicator(item);
  const relatedText = relatedNames(related);
  const firstUse = item.uses[0] || "技術分析";
  return {
    caseTitle: `${item.abbr} 在${firstUse}中的案例`,
    caseText: `${profile.caseMarket} 在這個案例中，${item.name}（${item.abbr}）的任務不是直接給出買賣結論，而是協助判斷「${item.uses.join("、")}」是否得到價格行為支持。真正可交易的訊號，一定要能說清楚入場、止蝕、目標和倉位。`,
    explanation: [
      item.summary,
      `${item.abbr} 應被視為分析框架的一部分：先確認市場處於趨勢、震盪、高波動或低波動，再判斷指標訊號是否符合該市況。你不是在找神奇答案，而是在找「值得下注的條件」。`,
    ],
    calculation: [
      `常用參數：${item.params}。`,
      `核心計算：${item.formula}。`,
      profile.calculation,
    ],
    usage: [
      ...item.signals,
      `實務上先看價格結構，再用 ${item.abbr} 作確認；若訊號與趨勢、成交量或支撐阻力互相矛盾，應降低訊號權重。`,
      `最簡單的用法：只交易「價格位置正確 + ${item.abbr} 確認 + 風險回報至少 1:2」的情境，其餘訊號只作觀察。`,
    ],
    mistakes: item.mistakes,
    tradePlan: [
      `1. 交易背景：${trade.setup}`,
      `2. 進場觸發：${trade.trigger}`,
      `3. 止蝕位置：${trade.stop}`,
      `4. 目標與獲利：${trade.target}`,
      `5. 倉位規則：單筆虧損先控制在帳戶可承受範圍，例如 0.5% 至 1%；若止蝕距離太大，就減少股數，而不是移走止蝕。`,
    ],
    profitRules: [
      `先算 R 值：若止蝕距離是 1R，第一目標至少要有 1.5R 至 2R，否則即使方向看對也不值得交易。`,
      `把 ${item.abbr} 當作過濾器，不當作按鈕；只有當市況、價格位置、觸發訊號和風險回報同時合格，才進入交易計劃。`,
      `能長期改善盈利的不是每次都猜中，而是小虧、少犯大錯，並讓少數好交易有足夠空間發揮。`,
    ],
    antiLesson: [
      trade.anti,
      `另一個常見錯誤是輸了一次就換參數，贏了一次就加大倉位；這會把 ${item.abbr} 變成情緒工具，而不是交易工具。`,
      `若你說不出「我錯在哪裡要離場」，這筆交易就還沒準備好。`,
    ],
    advanced: [
      profile.advanced,
      `可與 ${relatedText} 交叉驗證：一個指標負責描述主要問題，其他指標只作確認，避免把多個相近指標重複計票。`,
      `進階分析時要做參數敏感度檢查：若訊號只在某一組特殊參數下成立，應把它視為弱證據，而不是穩健規律。`,
    ],
    masterOperator: masterOperatorFor(item, related),
    deepDive: deepDiveFor(item, related),
    expertAuthority: [
      `優先研究：${authority.winner}。`,
      `主要參考來源：${authority.runnerUp}。`,
      `判讀重點：${authority.judgment}`,
      `代表材料：${authority.material}。`,
      `實戰整理：${authority.use}`,
    ],
    marketFit: [
      `${item.category}類指標較適合回答「${item.uses.join("、")}」這類問題。`,
      `港股/美股都可使用，但應留意成交量口徑、交易時段、停牌/復牌、財報日和重大消息造成的異常值。`,
      `不同週期會得到不同結論：日線適合中短線觀察，週線適合看大方向，日內圖則更容易受雜訊影響。`,
    ],
    checklist: [
      `我是否已先定義觀察週期，而不是看見訊號後才改參數？`,
      `這個訊號是否得到價格結構、成交量或相關指標支持？`,
      `若判斷錯誤，哪個價格區域或指標條件會證明原分析失效？`,
      `進場前是否已寫下入場價、止蝕價、第一目標和每股風險？`,
      `若只做到 1R 目標，我是否已有保護利潤或減倉計劃？`,
    ],
    review: [
      profile.review,
      `判讀結論：${item.abbr} 只能用來建立交易假設，不能單獨構成買賣建議。用途是預先寫清止蝕和風險回報，減少臨場衝動。`,
      `請把 ${item.abbr} 當成輔助工具，不要把它包裝成萬能答案；所有訊號都要配合風險管理和獨立判斷。`,
    ],
  };
}

const beginnerPlainLanguageBySlug = {
  rsi: {
    plain:
      "RSI 可以視為價格力度的溫度計：近期升得太急、跌得太急，或力度開始轉弱，讀數都會有所反映。",
    look:
      "先看價格在支撐、阻力還是趨勢中段，再看 RSI 是否接近 30/70，或價格創新高但 RSI 沒有跟上。",
    simple:
      "RSI 不是買賣指令。它只反映市場可能過熱、過弱，實際轉向仍要等待價格確認。",
    avoid:
      "不要看到 RSI 低於 30 就買，也不要看到高於 70 就做空；強勢股可以長時間高位，弱勢股也可以長時間低位。",
  },
  macd: {
    plain:
      "MACD 是把兩條均線的距離變成一個動能提示，用來看趨勢是否正在加速、放慢或可能轉弱。",
    look:
      "先看價格是不是已經有趨勢，再看 MACD 線、Signal 線和柱狀圖是否同時支持這個方向。",
    simple:
      "新手先把它當作趨勢確認工具：價格向上時，MACD 也改善，訊號才比較有意思。",
    avoid:
      "不要只因金叉就買、死叉就賣；如果價格位置很差，金叉也可能只是反彈雜訊。",
  },
  sma: {
    plain:
      "SMA 計算一段時間的平均價格，減少圖表雜訊，較容易看出市場大致方向。",
    look:
      "先看價格在均線上方還是下方，再看均線是向上、向下還是平坦。",
    simple:
      "新手先用它分辨背景：價格長時間在上升均線之上，代表趨勢背景較強。",
    avoid:
      "不要把每一次碰到均線都當成買點；均線平坦時，市場可能只是橫行。",
  },
  ema: {
    plain:
      "EMA 也是均線，但比較重視近期價格，所以反應比 SMA 快一點。",
    look:
      "先看 EMA 斜率，再看價格回踩後是否能重新站上或跌破。",
    simple:
      "新手先用它觀察短中線節奏，不要急於同時使用太多不同週期。",
    avoid:
      "不要因為 EMA 反應快就頻繁追買追賣；越快的工具也越容易受雜訊影響。",
  },
  volume: {
    plain:
      "成交量可以理解為市場參與度：價格變化背後有多少人或資金一起參與。",
    look:
      "先看價格突破、跌破或反彈時，成交量是否比平常明顯增加。",
    simple:
      "新手先用成交量回答一件事：這次價格變化是否有人支持。",
    avoid:
      "不要單看大成交就判斷方向；大成交可以是買盤，也可以是恐慌賣盤。",
  },
  atr: {
    plain:
      "ATR 是看價格平常跳動有多大，用來估算止蝕距離和倉位大小。",
    look:
      "先看最近波幅是否變大；波幅越大，止蝕通常不能放得太近，倉位也要縮小。",
    simple:
      "新手先把 ATR 當作風險尺，不是方向指標。",
    avoid:
      "不要用 ATR 判斷一定會升或跌；它只告訴你波動大不大。",
  },
  "bollinger-bands": {
    plain:
      "布林帶像價格的彈性範圍，可分辨波動屬於常態、正在擴張或收窄，還是已到區間邊緣。",
    look:
      "先看帶寬是收窄還是擴大，再看價格貼近上軌、下軌時是否有其他證據配合。",
    simple:
      "新手先學會：碰上軌不等於賣，碰下軌不等於買，要回到趨勢和位置判斷。",
    avoid:
      "不要在強趨勢中一直逆著布林帶做反轉；價格可以沿著上軌或下軌走很久。",
  },
  adx: {
    plain:
      "ADX 是看趨勢強不強，不是看方向向上還是向下。",
    look:
      "先看價格方向，再用 ADX 判斷這個方向是否有足夠強度。",
    simple:
      "新手先記住：ADX 高代表趨勢較強，但方向要從價格或 +DI/-DI 判斷。",
    avoid:
      "不要看到 ADX 上升就自動買入；下跌趨勢很強時 ADX 也會上升。",
  },
  "support-resistance": {
    plain:
      "支撐阻力是價格以前多次停下、反彈或受壓的位置，是新手最應該先學的地圖。",
    look:
      "先找前高、前低、密集成交區和多次反應的位置，再看價格接近時的 K 線與成交量。",
    simple:
      "新手先用它回答：我現在是在便宜位置、昂貴位置，還是區間中間。",
    avoid:
      "不要把支撐阻力當成一條絕對精準的線；它通常是一個區域。",
  },
};

const beginnerPlainLanguageByCategory = {
  趨勢: {
    plain:
      "這類指標用來判斷市場大方向：向上、向下，還是沒有明確方向。",
    look:
      "先看價格高低點是否同方向移動，再看指標線是否有斜率。",
    simple:
      "新手先用它分辨背景，不要用它預測明天一定升跌。",
    avoid:
      "不要在橫行市勉強使用趨勢指標，否則容易反覆被假訊號消耗。",
  },
  動能: {
    plain:
      "這類指標反映升跌力度正在加強還是減弱，作用近似觀察市場速度。",
    look:
      "先看價格在關鍵位置，再看動能是否配合、背離或回到正常區。",
    simple:
      "新手先用它做確認，不要把它當作立即買賣指令。",
    avoid:
      "不要單靠超買超賣交易；強者可以更強，弱者可以更弱。",
  },
  波動率: {
    plain:
      "這類指標量度價格跳動幅度，主要用於管理止蝕和倉位。",
    look:
      "先看波幅是擴大還是收窄，再決定止蝕是否要放寬、倉位是否要縮小。",
    simple:
      "新手先把它當作風險工具，不要當方向工具。",
    avoid:
      "不要因為波動低就覺得安全；低波動後可能出現劇烈突破。",
  },
  "通道/型態": {
    plain:
      "這類工具顯示價格在特定範圍、形態或邊界內如何移動。",
    look:
      "先看價格是在範圍內、邊緣位，還是真的收盤突破。",
    simple:
      "新手先學會等待確認，不要在形態未完成前猜方向。",
    avoid:
      "不要只因碰到上沿或下沿就立刻反向操作；先看趨勢和成交量。",
  },
  成交量: {
    plain:
      "這類指標用來核對價格變化背後是否有足夠市場參與。",
    look:
      "先看突破、跌破、反彈或急跌時，量是否明顯和平常不同。",
    simple:
      "新手先用它確認價格動作可信不可信。",
    avoid:
      "不要單看量大就判斷升跌；量要和價格位置一起看。",
  },
  支撐阻力: {
    plain:
      "這類工具用來找出價格較容易停下、反彈或受壓的位置。",
    look:
      "先找前高前低、反覆反應區和突破失敗的位置。",
    simple:
      "新手先用它決定交易位置是否有意義。",
    avoid:
      "不要把支撐阻力看成必定有效；跌穿或升穿後要承認失效。",
  },
  綜合: {
    plain:
      "這類工具通常綜合幾種資料來整理圖表，但新手亦較容易誤以為結果就是標準答案。",
    look:
      "先拆開看：它到底在說方向、力度、波動，還是位置。",
    simple:
      "新手先學會它回答哪一個問題，再決定要不要加入交易流程。",
    avoid:
      "不要因為工具看起來完整，就忽略止蝕、目標和倉位。",
  },
  市場寬度: {
    plain:
      "這類指標看的是整個市場有多少股票一起升跌，用來判斷大市健康度。",
    look:
      "先看指數上升時，是否有足夠多股票一起上升。",
    simple:
      "新手先把它當作大市背景，不要直接用來買賣單一股票。",
    avoid:
      "不要用市場寬度取代個股圖表；個股仍要看自己的價格、量和風險。",
  },
};

function beginnerPlainLanguageFor(item) {
  return (
    beginnerPlainLanguageBySlug[item.slug] ||
    beginnerPlainLanguageByCategory[item.category] ||
    beginnerPlainLanguageByCategory.綜合
  );
}

const beginnerCoreTerms = [
  ["價格", "股票在市場成交的價位；所有指標都只是把價格或成交量重新整理。"],
  ["K 線", "一段時間內的開盤、最高、最低、收盤，像圖表的一個字。"],
  ["趨勢", "價格高低點持續向同一方向移動，例如一浪高於一浪。"],
  ["支撐", "價格跌到某個區域時，較容易有人買入承接。"],
  ["阻力", "價格升到某個區域時，較容易有人賣出或獲利離場。"],
  ["成交量", "某段時間有多少股票成交，用來看這次價格變化有沒有參與度。"],
  ["止蝕", "如果判斷錯誤，預先接受小虧離場的位置。"],
  ["R 值", "用預設虧損作單位衡量回報；冒 1R 風險，目標 2R 才有兩倍回報空間。"],
  ["確認", "等價格收盤、下一支 K 線、成交量或其他證據支持，不靠猜。"],
];

function renderBeginnerTermPad() {
  return `
    <div class="beginner-term-pad">
      <div class="beginner-term-head">
        <strong>看不懂先查這些詞</strong>
        <span>先掌握這幾個詞，再讀任何指標頁都會容易很多。</span>
      </div>
      <div class="beginner-term-grid">
        ${beginnerCoreTerms
          .map(
            ([term, desc]) => `
              <div>
                <strong>${escapeHtml(term)}</strong>
                <span>${escapeHtml(desc)}</span>
              </div>
            `,
          )
          .join("")}
      </div>
    </div>
  `;
}

function renderBeginnerExplainer(item) {
  const plain = beginnerPlainLanguageFor(item);
  return `
    <section class="beginner-explainer page-band" data-section="beginner">
      <div class="beginner-explainer-head">
        <span class="lesson-label">新手模式</span>
        <h2>先看三句</h2>
      </div>
      ${compactStepList([
        { step: "1", title: "用人話講", body: plain.plain },
        { step: "2", title: "圖上先看哪裡", body: plain.look },
        { step: "3", title: "不要這樣用", body: plain.avoid },
      ])}
      ${renderLessonFold(
        "新手詞彙",
        "展開新手詞彙",
        "看不懂價格、K 線、趨勢、R 值時再打開。",
        renderBeginnerTermPad(),
      )}
    </section>
  `;
}

function listItems(items) {
  return items.map((text) => `<li>${escapeHtml(text)}</li>`).join("");
}

function renderResearchEvidencePanel(title = "資料從哪裡來") {
  const rows = [
    ["資料範圍", `${researchDatabaseStats.experts} 位專家、${researchDatabaseStats.indicatorMethods} 個指標/方法、${researchDatabaseStats.methodFamilies} 個方法家族、${researchDatabaseStats.sources} 個來源。`],
    ["整理方式", "專家名稱、指標名稱和材料摘要保留中英文對照；頁面用繁體中文講清楚，英文原名留給想追資料的人查證。"],
    ["先讀誰", "先看原創者和最有代表性的用法，再看後來的改良版本；不是誰名氣大就一定放第一。"],
    ["使用界線", "權威來源只代表值得先讀，不代表永遠最準；交易仍要回到市況、價格、成交量和風險回報。"],
  ];
  return `
    <section class="content-grid">
      <article class="review-panel">
        <span class="lesson-label">研究依據</span>
        <h2>${escapeHtml(title)}</h2>
        <p class="small">這裡不只整理指標定義，也會列出來源、參考資料、常見失效情境和實際判讀方式。你不用一邊查公式，一邊猜它在市場上應該怎樣使用。</p>
        <table class="score-table">
          <tbody>
            ${rows
              .map(
                ([label, text]) =>
                  `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(text)}</td></tr>`,
              )
              .join("")}
          </tbody>
        </table>
      </article>
      <aside class="stack">
        <article class="notice">
          <strong>整理原則</strong>
          <p class="small">每個指標先說清楚自己負責哪一類證據；如果兩個工具在講同一件事，就不要把它們當成兩票。</p>
        </article>
        ${renderSiteDataEvidenceCard()}
        <article class="danger-card">
          <span class="lesson-label">內容風險</span>
          <h2>不要讀錯用途</h2>
          <p class="small">網站只做教育整理，不是任何股票、期貨、外匯或加密資產的買賣建議。</p>
        </article>
      </aside>
    </section>
  `;
}

function renderMasterTransmissionBlueprint() {
  return `
    <section data-section="master-blueprint">
      <div class="section-head">
        <div>
          <h2>先建立讀圖次序</h2>
          <p>不要只記指標名字。先學會看市況、找失效條件、計算風險，再把每一次判斷寫成可以復盤的交易劇本。</p>
        </div>
      </div>
      <div class="content-grid">
        <article class="review-panel">
          <span class="lesson-label">教學地圖</span>
          <h2>從看訊號，到寫交易劇本</h2>
          <table class="score-table">
            <tbody>
              ${masterTransmissionBlueprint
                .map(
                  (item) => `
                    <tr>
                      <th>${escapeHtml(item.step)} ${escapeHtml(item.title)}</th>
                      <td>
                        <strong>${escapeHtml(item.pages)}</strong>
                        <span>${escapeHtml(item.lesson)}</span>
                        <span>${escapeHtml(item.habit)}</span>
                      </td>
                    </tr>
                  `,
                )
                .join("")}
            </tbody>
          </table>
        </article>
        <aside class="stack">
          <article class="notice">
            <strong>讀完一頁要更會判斷</strong>
            <p class="small">看完後，你應該能說清楚：現在是甚麼市況、哪些訊號不值得做、本金怎樣保護、下一筆交易要怎樣寫。</p>
          </article>
          <article class="danger-card">
            <span class="lesson-label">常見陷阱</span>
            <h2>最大問題不是資料少</h2>
            <p class="small">最大漏洞是只記住「金叉、超買、突破」這些詞，卻沒有學會在哪個市況有效、錯了在哪離場、甚麼時候應該完全不交易。</p>
          </article>
        </aside>
      </div>
      <div class="card-grid compact-grid">
        ${pageTeachingMap
          .map(
            ([page, teaching]) => `
              <article class="info-card">
                <span class="lesson-label">${escapeHtml(page)}</span>
                <p class="small">${escapeHtml(teaching)}</p>
              </article>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderMasterStandardScorecard() {
  return `
    <section data-section="master-scorecard">
      <div class="section-head">
        <div>
          <h2>好內容應該減少判斷錯誤</h2>
          <p>篇幅長不代表有用。內容要能協助判斷市況、控制風險、寫下失效點，並在判斷錯誤時及早修正。</p>
        </div>
      </div>
      <div class="audit-grid">
        <div class="audit-tile"><strong>先防錯</strong><span>內容取向</span></div>
        <div class="audit-tile"><strong>${indicators.length}</strong><span>指標深度教學</span></div>
        <div class="audit-tile"><strong>${researchDatabaseStats.experts}</strong><span>專家與來源參照</span></div>
        <div class="audit-tile"><strong>9+</strong><span>核心學習段落</span></div>
      </div>
      <div class="content-grid">
        <article class="review-panel">
          <span class="lesson-label">內容標準</span>
          <h2>我們用這幾條標準寫內容</h2>
          <table class="score-table">
            <tbody>
              ${masterStandardRubric
                .map(
                  (item) => `
                    <tr>
                      <th>${escapeHtml(item.area)}</th>
                      <td>
                        <span>${escapeHtml(item.standard)}</span>
                        <strong>${escapeHtml(item.result)}</strong>
                      </td>
                    </tr>
                  `,
                )
                .join("")}
            </tbody>
          </table>
        </article>
        <aside class="stack">
          <article class="notice">
            <strong>你可以怎樣使用</strong>
            <p class="small">這裏不是指標百科。每頁更重要的是交代何時不適用、何時要降低信心、如何保護本金，以及如何在日誌記下錯誤。</p>
          </article>
          <article class="info-card">
            <span class="lesson-label">下一步</span>
            <h3>把知識放回圖表</h3>
            <p class="small">看完指標後，可以到策略案例、練習場或交易日誌，把判斷寫成自己的交易劇本。只背公式，仍然避不開欠缺理據的交易。</p>
          </article>
        </aside>
      </div>
    </section>
  `;
}

function renderCandlestickAuthorityPanel() {
  const rows = [
    ["歷史源流", "本間宗久 / Munehisa Homma 代表早期日本米市價格行為思想，適合理解陰陽燭背後的供求與情緒。"],
    ["現代教學", "史蒂夫・尼森 / Steve Nison 把日本蠟燭圖系統化介紹到西方市場，是本站陰陽燭教學的優先參考。"],
    ["統計對照", "湯瑪斯・布考斯基 / Thomas N. Bulkowski 以圖表型態統計作補充，用來提醒形態不是保證。"],
    ["本站結論", "陰陽燭不是單獨策略；最佳用途是把位置、收盤、成交量、確認和失效點整理成交易前證據。"],
  ];
  return `
    <section class="content-grid">
      <article class="review-panel">
        <span class="lesson-label">陰陽燭權威</span>
        <h2>陰陽燭權威對照</h2>
        <table class="score-table">
          <tbody>
            ${rows
              .map(
                ([label, text]) =>
                  `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(text)}</td></tr>`,
              )
              .join("")}
          </tbody>
        </table>
      </article>
      <aside class="stack">
        <article class="notice">
          <strong>讀法建議</strong>
          <p class="small">學形態時先讀 Nison，追源流可看 Homma，想提醒自己別迷信形態，就用 Bulkowski 的統計作冷水。</p>
        </article>
        <article class="danger-card">
          <span class="lesson-label">誤用提醒</span>
          <h2>最大漏洞</h2>
          <p class="small">只背「錘頭、吞噬、十字星」名稱，卻不看位置和下一支確認，會把陰陽燭變成事後講故事。</p>
        </article>
      </aside>
    </section>
  `;
}

function renderComparisonExpertFramework() {
  const rows = [
    ["先判斷問題", "方向、力度、成交量、波動、寬度、風險，每次只選一個主問題。"],
    ["再看原創權威", "例如 RSI 先讀 Wilder，MACD 先讀 Appel，布林帶先讀 Bollinger，ATR 先讀 Wilder。"],
    ["再看現代改良", "ConnorsRSI、MACD-V、Anchored VWAP 等可作改良對照，但不能取代原始概念。"],
    ["最後看失效", "如果兩個指標都回答同一問題，刪掉其中一個；若兩者衝突，先回到價格結構和市況。"],
  ];
  return `
    <section class="content-grid">
      <article class="review-panel">
        <span class="lesson-label">專家比較</span>
        <h2>先問問題，再選指標</h2>
        <p class="small">比較頁不會選出「永遠最準」的指標。它要分清目前欠缺的是方向、力度、成交量，還是風險尺度。</p>
        <table class="score-table">
          <tbody>
            ${rows.map(([label, text]) => `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(text)}</td></tr>`).join("")}
          </tbody>
        </table>
      </article>
      <aside class="stack">
        <article class="notice">
          <strong>別把排名當答案</strong>
          <p class="small">RSI 適合看動能，不代表它能取代趨勢工具；ATR 適合量風險，也不會替你預測方向。</p>
        </article>
      </aside>
    </section>
  `;
}

function renderPlaygroundTrainingProtocol() {
  const standards = [
    ["觀察", "先說出市況和價格位置，不能先說買賣。"],
    ["觸發", "入場必須有收盤、回踩或下一支 K 線確認。"],
    ["風險", "止蝕是分析失效點，不是任意百分比。"],
    ["R 值", "第一目標低於 1.5R 時，練習答案應判為不合格。"],
    ["復盤", "每次練習都要寫下何時不用該指標。"],
  ];
  return `
    <section class="content-grid">
      <article class="review-panel">
        <span class="lesson-label">訓練流程</span>
        <h2>每次看圖的固定順序</h2>
        <p class="small">練習場不是用來把參數調到最好看，而是訓練你每次都按同一套順序讀圖。</p>
        <table class="score-table">
          <tbody>
            ${standards.map(([label, text]) => `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(text)}</td></tr>`).join("")}
          </tbody>
        </table>
      </article>
      <aside class="stack">
        <article class="danger-card">
          <span class="lesson-label">錯誤練習</span>
          <h2>練習漏洞</h2>
          <ul class="plain-list">
            <li>只把週期調到歷史圖表最漂亮，卻沒有說明為何未來仍可能有效。</li>
            <li>每次看錯都換指標，沒有修正市況判斷流程。</li>
            <li>只記錄成功案例，沒有把放棄交易也寫進日誌。</li>
          </ul>
        </article>
      </aside>
    </section>
  `;
}

function renderCasebookReviewFramework() {
  const rows = [
    ["市況", "先把案例分成趨勢、震盪、恐慌、消息市或壓縮突破。"],
    ["主要錯誤", "找出虧損不是因為指標壞，而是因為市況、位置、倉位或失效點處理錯。"],
    ["可遷移規則", "只抽取可重複的流程，不把某一年、某一隻股票的結果當永恆規律。"],
    ["反證", "每個案例都要寫出哪個價格或條件會證明原劇本錯誤。"],
  ];
  return `
    <section class="content-grid">
      <article class="review-panel">
        <span class="lesson-label">案例審查</span>
        <h2>案例怎樣拿來用</h2>
        <table class="score-table">
          <tbody>
            ${rows.map(([label, text]) => `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(text)}</td></tr>`).join("")}
          </tbody>
        </table>
      </article>
      <aside class="stack">
        <article class="notice">
          <strong>案例不是預言</strong>
          <p class="small">歷史案例只訓練流程：辨識市況、規劃風險、承認失效。它不能保證下一次相同走勢會重演。</p>
        </article>
      </aside>
    </section>
  `;
}

function renderGlossaryUseGuide() {
  const groups = [
    ["基本圖表語言", "價格、K 線、趨勢、支撐、阻力、成交量，是讀任何指標前的共同語言。"],
    ["市場狀態", "震盪、波動壓縮、市場寬度，用來描述背景。"],
    ["訊號語言", "金叉、死叉、背離、鈍化、假突破，用來描述現象。"],
    ["交易控制", "R 值、風險回報比、失效點、移動止蝕，用來決定能不能做。"],
    ["復盤語言", "反面教材、重複計票、參數敏感度，用來修正錯誤。"],
  ];
  return `
    <section class="content-grid">
      <article class="review-panel">
        <span class="lesson-label">術語方法</span>
        <h2>術語使用方法</h2>
        <p class="small">術語表不是字典遊戲。每個詞都要準確描述市場現象、交易行動或復盤錯誤。</p>
        <table class="score-table">
          <tbody>
            ${groups.map(([label, text]) => `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(text)}</td></tr>`).join("")}
          </tbody>
        </table>
      </article>
      <aside class="stack">
        <article class="danger-card">
          <span class="lesson-label">術語誤解</span>
          <h2>最常見誤解</h2>
          <p class="small">把「超買」翻譯成「必跌」、把「超賣」翻譯成「必升」、把「突破」翻譯成「立刻追」，都是術語誤用。</p>
        </article>
      </aside>
    </section>
  `;
}

function renderBacktestIntegrityFramework() {
  const rows = [
    ["資料切分", "至少保留未參與調校的樣本；如果所有資料都拿來尋找最佳參數，結果可信度會大幅下降。"],
    ["成交假設", "commission、slippage、成交延遲、pyramiding、margin 必須與實際交易接近。"],
    ["價格來源", "Heikin Ashi、Renko 等非標準圖表不可直接當真實成交價回測。"],
    ["穩健性", "相近參數、不同市場和不同年份都要能維持可接受結果。"],
    ["實盤前", "先模擬交易或極小倉前向測試，觀察滑價、漏單和心理執行。"],
  ];
  return `
    <article class="review-panel">
      <span class="lesson-label">可信度檢查</span>
      <h2>回測先查這幾件事</h2>
      <table class="score-table">
        <tbody>
          ${rows.map(([label, text]) => `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(text)}</td></tr>`).join("")}
        </tbody>
      </table>
    </article>
  `;
}

function renderJournalQualityStandard() {
  const rows = [
    ["交易前", "必須有市況、價格位置、入場觸發、止蝕、目標和倉位。"],
    ["交易中", "記錄是否按計劃執行，有沒有追價、移走止蝕或臨時加倉。"],
    ["交易後", "復盤只評估流程，不用單筆盈虧證明自己聰明或愚蠢。"],
    ["樣本數", "少於 20 筆只能看行為習慣，不能推斷策略有穩定優勢。"],
  ];
  return `
    <article class="review-panel">
      <span class="lesson-label">日誌標準</span>
      <h2>高質素日誌標準</h2>
      <table class="score-table">
        <tbody>
          ${rows.map(([label, text]) => `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(text)}</td></tr>`).join("")}
        </tbody>
      </table>
    </article>
  `;
}

function renderComboRoleModel() {
  const rows = [
    ["主指標", "回答最重要問題，例如趨勢是否成立或動能是否改善。"],
    ["確認指標", "回答不同類型證據，例如成交量是否配合或市場寬度是否支持。"],
    ["風險工具", "用 ATR、R 值、支撐阻力或通道決定止蝕和倉位。"],
    ["否決條件", "寫下何時全部訊號都失效；沒有否決條件，組合只是心理安慰。"],
  ];
  return `
    <article class="review-panel">
      <span class="lesson-label">角色分工</span>
      <h2>指標組合角色分工</h2>
      <table class="score-table">
        <tbody>
          ${rows.map(([label, text]) => `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(text)}</td></tr>`).join("")}
        </tbody>
      </table>
    </article>
  `;
}

function renderLocalDataGovernance() {
  return `
    <article class="review-panel">
      <span class="lesson-label">本地資料</span>
      <h2>你的資料留在這台瀏覽器</h2>
      <ul class="plain-list">
        <li>收藏、訂閱示範、指標備註、測驗紀錄和交易日誌只儲存在目前瀏覽器。</li>
        <li>網站不會把電郵或交易紀錄送到伺服器；換瀏覽器或清除資料前，應先匯出 JSON 備份。</li>
        <li>匯入資料採合併與預覽，不會直接清空現有內容；備註衝突會保留「匯入備份」段落。</li>
        <li>交易日誌可能包含敏感資料，匯出檔應放在你能保護的位置，不應公開分享。</li>
      </ul>
    </article>
  `;
}

function renderMasterLearningPath() {
  return `
    <section>
      <div class="section-head">
        <div>
          <h2>真正有用的學習路線</h2>
          <p>先學市況，再學分工，然後才看劇本和復盤。公式可以晚一點，風險不能晚。</p>
        </div>
      </div>
      <div class="master-path-grid">
        ${masterLearningPath
          .map(
            (item) => `
              <article class="info-card master-step-card">
          <span class="lesson-label">第 ${escapeHtml(item.step)} 步</span>
                <h3>${escapeHtml(item.title)}</h3>
                <p class="small">${escapeHtml(item.body)}</p>
                <div class="formula">${escapeHtml(item.action)}</div>
              </article>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderBeginnerStarterPath() {
  return `
    <section data-section="beginner-path">
      <div class="section-head">
        <div>
          <h2>15 分鐘零基礎路線</h2>
          <p>完全不懂股票時，先不用挑指標。照這個次序建立最小框架，再進入指標庫會容易很多。</p>
        </div>
        <a class="button secondary" href="#/glossary">查術語</a>
      </div>
      <div class="beginner-path-grid">
        ${beginnerStarterPath
          .map(
            (item) => `
              <article class="info-card beginner-step-card">
                <span class="lesson-label">${escapeHtml(item.minute)} 分鐘</span>
                <h3>${escapeHtml(item.title)}</h3>
                <p class="small">${escapeHtml(item.body)}</p>
                <a class="button secondary" href="${item.href}">${escapeHtml(item.action)}</a>
              </article>
            `,
          )
          .join("")}
      </div>
      <div class="beginner-note">
        <strong>先記住一句話</strong>
        <span>價格位置決定背景，成交量決定可信度，指標只負責確認，風險回報決定這筆交易值不值得做。</span>
      </div>
    </section>
  `;
}

function renderMarketRegimeGuide() {
  return `
    <section>
      <div class="section-head">
        <div>
          <h2>市況導航</h2>
          <p>同一個指標在不同市況下會有完全不同意思。先選市況，再選工具。</p>
        </div>
      </div>
      <div class="regime-grid">
        ${marketRegimeGuides
          .map(
            (item) => `
              <article class="trade-card regime-card">
                <span class="lesson-label">${escapeHtml(item.regime)}</span>
                <ul class="plain-list">
                  <li><strong>辨認：</strong>${escapeHtml(item.signal)}</li>
                  <li><strong>可做：</strong>${escapeHtml(item.use)}</li>
                  <li><strong>工具：</strong>${escapeHtml(item.tools)}</li>
                  <li><strong>避開：</strong>${escapeHtml(item.avoid)}</li>
                </ul>
              </article>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function practiceMissionsFor(item) {
  if (item.category === "波動率" || item.uses.includes("管理風險")) {
    return [
      {
        title: `${item.abbr} 止蝕距離任務`,
        task: `用 ${item.abbr} 或相關波幅工具，為同一個入場位設計普通止蝕和波幅止蝕。`,
        pass: "能說出哪個止蝕較符合當前波動，並把倉位調到單筆風險可控。",
      },
      {
        title: "倉位縮放任務",
        task: "找一段波幅突然擴大的走勢，計算如果止蝕變遠，倉位應如何縮小。",
        pass: "不因為看對方向而放大風險；止蝕距離變大時，股數必須下降。",
      },
      ...practiceMissions.slice(2),
    ];
  }
  if (item.category === "成交量" || item.uses.includes("確認成交量")) {
    return [
      {
        title: `${item.abbr} 成交量確認任務`,
        task: `找一段突破走勢，判斷 ${item.abbr} 是否支持市場接受新價格。`,
        pass: "能分辨有量突破、無量突破和放量失敗，不把每次放量都當好事。",
      },
      {
        title: "假突破成交量任務",
        task: "找一段突破後收回區間的走勢，寫出成交量是否支持或否定突破。",
        pass: "能說出哪一支 K 線令突破失效，並知道不應追價。",
      },
      ...practiceMissions.slice(2),
    ];
  }
  if (item.category === "動能" || item.uses.includes("找轉折")) {
    return [
      {
        title: `${item.abbr} 動能背馳任務`,
        task: `找一段價格創新高或新低、但 ${item.abbr} 未同步的走勢，判斷是否只是警號。`,
        pass: "能說出背馳只是降級提醒，不是立即反手訊號。",
      },
      {
        title: "過熱不逆勢任務",
        task: "找一段強趨勢中指標長時間高位或低位鈍化的走勢，寫下為何不應單靠過熱逆勢。",
        pass: "能把趨勢結構放在動能數值之前判斷。",
      },
      ...practiceMissions.slice(2),
    ];
  }
  return [
    {
      title: `${item.abbr} 趨勢節奏任務`,
      task: `找一段順勢走勢，用 ${item.abbr} 判斷回踩是否仍健康，以及哪一刻開始失效。`,
      pass: "能標出入場觸發、趨勢失效點和至少 1.8R 的第一目標。",
    },
    {
      title: "趨勢轉弱任務",
      task: "找一段價格跌回主要結構或均線下方的走勢，寫出何時應由交易轉為觀察。",
      pass: "能在訊號失效時保留現金，不把短線錯誤改成長線持有。",
    },
    ...practiceMissions.slice(2),
  ];
}

function renderPracticeMissions(limit = practiceMissions.length, start = 0, missions = practiceMissions) {
  const missionList = missions;
  const missionLimit = limit ?? missionList.length;
  return `
    <div class="drill-grid">
      ${missionList
        .slice(start, start + missionLimit)
        .map(
          (mission) => `
            <article class="info-card drill-card">
              <span class="lesson-label">訓練任務</span>
              <h3>${escapeHtml(mission.title)}</h3>
              <p class="small">${escapeHtml(mission.task)}</p>
              <div class="result-panel result-good"><strong>合格標準</strong><span>${escapeHtml(mission.pass)}</span></div>
            </article>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderIndicatorMasterMap(item, lesson) {
  const trade = tradeProfileFor(item);
  const relatedText = relatedNames(item.related.map(getIndicator).filter(Boolean));
  const rows = [
    ["先看", `${item.category}市況與價格位置，不先看 ${item.abbr} 數值。`],
    ["可做", `${trade.trigger} 才升級為候選交易。`],
    ["不用", `${lesson.antiLesson[0]} 結構矛盾時先保留現金。`],
  ];
  return `
    <article class="review-panel master-map-card">
      <span class="lesson-label">判讀地圖</span>
      <h2>實戰判讀地圖</h2>
      <p class="small">先判斷場景，再決定 ${escapeHtml(item.abbr)} 是否值得理會。</p>
      <table class="score-table">
        <tbody>
          ${rows
            .map(
              ([label, text]) =>
                `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(text)}</td></tr>`,
          )
          .join("")}
      </tbody>
      </table>
      <div class="notice small">
        搭配：${escapeHtml(item.abbr)} 回答「${escapeHtml(item.uses.join("、"))}」，再用 ${escapeHtml(relatedText)} 檢查不同證據。
      </div>
    </article>
  `;
}

function renderIndicatorAuthorityPanel(item, lesson) {
  const authority = authorityForIndicator(item);
  return `
    <article class="review-panel" data-section="authority">
      <span class="lesson-label">權威對照</span>
      <h2>先讀誰，怎樣用</h2>
      <table class="score-table">
        <tbody>
          <tr><th>先讀</th><td><strong>${escapeHtml(authority.winner)}</strong><span>${escapeHtml(authority.judgment)}</span></td></tr>
          <tr><th>再讀</th><td>${escapeHtml(authority.runnerUp)}</td></tr>
          <tr><th>使用判斷</th><td>${escapeHtml(authority.use)}</td></tr>
        </tbody>
      </table>
      ${renderLessonFold(
        "代表材料",
        "展開代表材料",
        "需要追溯專家脈絡時再看。",
        `<div class="formula">${escapeHtml(authority.material)}</div>`,
      )}
    </article>
  `;
}

function decisionText(operator, label) {
  return operator.decisionRows.find(([rowLabel]) => rowLabel === label)?.[1] || "";
}

function stripStepLabel(text) {
  return text.replace(/^\d+\.\s*/, "").trim();
}

function renderLessonFold(label, title, intro, content, section = "") {
  const sectionAttr = section ? ` data-section="${escapeHtml(section)}"` : "";
  return `
    <details class="lesson-fold"${sectionAttr}>
      <summary>
        <span class="lesson-label">${escapeHtml(label)}</span>
        <strong>${escapeHtml(title)}</strong>
        <small>${escapeHtml(intro)}</small>
      </summary>
      <div class="lesson-fold-body">
        ${content}
      </div>
    </details>
  `;
}

function renderIndicatorEssencePanel(item, lesson) {
  const operator = lesson.masterOperator;
  const gradeA = decisionText(operator, "A 級訊號");
  const cancel = decisionText(operator, "取消/降級");
  return `
    <section class="essence-panel page-band" data-section="essence">
      <div class="section-head">
        <div>
          <span class="lesson-label">快速精要</span>
          <h2>${escapeHtml(item.abbr)} 一頁精要</h2>
        </div>
      </div>
      ${compactStepList([
        { step: "1", title: "做甚麼", body: item.summary, max: 42 },
        { step: "2", title: "先問", body: operator.coreQuestion, max: 42 },
        { step: "3", title: "不要", body: cancel || gradeA, max: 42 },
      ])}
    </section>
  `;
}

function renderTradeDecisionCard(item, lesson) {
  const rows = [
    ["背景", stripStepLabel(lesson.tradePlan[0])],
    ["觸發", stripStepLabel(lesson.tradePlan[1])],
    ["止蝕", stripStepLabel(lesson.tradePlan[2])],
    ["目標", stripStepLabel(lesson.tradePlan[3])],
    ["風險", lesson.profitRules[0]],
  ];
  return `
    <article class="trade-card decision-card" data-section="trade">
      <span class="scroll-anchor" data-section="profit"></span>
      <span class="lesson-label">交易決策</span>
      <h2>${escapeHtml(item.abbr)} 交易決策卡</h2>
      <p class="small">這張卡只保留交易前真正要決定的五件事。</p>
      <table class="score-table">
        <tbody>
          ${rows.map(([label, text]) => `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(text)}</td></tr>`).join("")}
        </tbody>
      </table>
    </article>
  `;
}

function renderQualityChecklist(title = "交易前品質檢查") {
  const checks = [
    "市況是否明確：趨勢、震盪、突破或恐慌？",
    "價格位置是否有意義：支撐、阻力、前高前低或回踩？",
    "訊號是否已完成：收盤確認、成交量配合或下一支 K 線確認？",
    "風險回報是否合格：扣除費用後至少接近 1.5R 至 2R？",
    "失效條件是否寫清楚：錯了在哪裡離場，不用事後辯解？",
  ];
  return `
    <article class="review-panel">
      <span class="lesson-label">品質檢查</span>
      <h2>${escapeHtml(title)}</h2>
      <ul class="plain-list">${listItems(checks)}</ul>
    </article>
  `;
}

function renderDeepDiveBlock(title, items) {
  return `
    <div class="deep-dive-block">
      <h3>${escapeHtml(title)}</h3>
      <ol class="deep-dive-list">${listItems(items)}</ol>
    </div>
  `;
}

function renderMasterOperatorPanel(lesson) {
  const operator = lesson.masterOperator;
  const compactRows = [
    ["A 級訊號", decisionText(operator, "A 級訊號")],
    ["取消/降級", decisionText(operator, "取消/降級")],
    ["交叉驗證", decisionText(operator, "交叉驗證")],
  ];
  const fullContent = `
    <table class="score-table">
      <tbody>
        ${operator.decisionRows
          .map(
            ([label, text]) =>
              `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(text)}</td></tr>`,
          )
          .join("")}
      </tbody>
    </table>
    <div class="deep-dive-grid">
      ${renderDeepDiveBlock("一、讀市次序", operator.marketRead)}
      ${renderDeepDiveBlock("二、執行方式", operator.execution)}
      ${renderDeepDiveBlock("三、倉位與風險", operator.sizing)}
      ${renderDeepDiveBlock("四、日誌復盤", operator.journal)}
    </div>
  `;
  return `
    <article class="review-panel master-operator-panel" data-section="operator">
      <span class="lesson-label">操作室</span>
      <h2>${escapeHtml(operator.title)}</h2>
      <p class="small">${escapeHtml(operator.coreQuestion)}</p>
      <table class="score-table">
        <tbody>
          ${compactRows
            .map(
              ([label, text]) =>
                `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(text)}</td></tr>`,
            )
            .join("")}
        </tbody>
      </table>
      ${renderLessonFold("完整操作", "展開完整操作室", "讀市次序、執行方式、倉位與日誌放在這裡。", fullContent)}
      <div class="notice small">
        重點不是看懂更多指標，而是把訊號分級：A 級才交易，B 級只觀察，C 級直接刪掉。沒有失效點的訊號，不論多漂亮都不進場。
      </div>
    </article>
  `;
}

function renderDeepDiveTeaching(lesson) {
  const deep = lesson.deepDive;
  return `
    <article class="deep-dive-panel" data-section="deep">
      <div class="deep-dive-head">
        <span class="lesson-label">深層練習</span>
        <h2>${escapeHtml(deep.title)}</h2>
        <p>${escapeHtml(deep.intro)}</p>
      </div>
      <div class="deep-dive-grid">
        ${renderDeepDiveBlock("一、分析框架", deep.framework)}
        ${renderDeepDiveBlock("二、執行細節", deep.execution)}
        ${renderDeepDiveBlock("三、參數與校準", deep.calibration)}
        ${renderDeepDiveBlock("四、復盤方法", deep.review)}
      </div>
      <div class="deep-dive-drill">
        <strong>練到進階的作業</strong>
        <ol class="deep-dive-list">${listItems(deep.drill)}</ol>
      </div>
    </article>
  `;
}

function detailQuickNav() {
  const items = [
    ["essence", "精要"],
    ["beginner", "新手"],
    ["case", "案例"],
    ["authority", "權威"],
    ["operator", "操作"],
    ["trade", "交易劇本"],
    ["mistakes", "錯誤"],
    ["advanced", "進階"],
    ["deep", "深層"],
    ["review", "審查"],
  ];
  return `
    <nav class="quick-nav" aria-label="指標頁快速導覽">
      ${items
        .map(
          ([target, label]) =>
            `<button class="chip" type="button" data-scroll-target="${target}">${label}</button>`,
        )
        .join("")}
    </nav>
  `;
}

function preTradeChecklist(item) {
  const checks = [
    `${item.category}市況已確認，訊號不是單獨出現。`,
    "入場觸發已完成，不是因為害怕錯過而預先買入。",
    "止蝕是分析失效點，不是隨意設定的心理價位。",
    "第一目標至少接近 1.5R 至 2R，扣除費用後仍值得做。",
    "若成交後立即反向，已有減倉或退出規則。",
  ];
  return `
    <article class="info-card pretrade-card">
      <span class="lesson-label">交易前檢查</span>
      <h2>交易前檢查卡</h2>
      <p class="small">五格沒有全部勾好，就先不要把訊號變成交易。</p>
      <div class="checklist-grid">
        ${checks
          .map(
            (check, index) => `
              <label class="check-row">
                <input type="checkbox" />
                <span>${index + 1}. ${escapeHtml(check)}</span>
              </label>
            `,
          )
          .join("")}
      </div>
      <div class="card-actions">
        <button class="button secondary" type="button" data-action="print-page">列印檢查卡</button>
      </div>
    </article>
  `;
}

function indicatorNoteCard(item) {
  return `
    <article class="info-card note-card">
      <span class="lesson-label">我的備註</span>
      <h2>我的交易備註</h2>
      <p class="small">寫下你會在甚麼市況使用 ${escapeHtml(item.abbr)}，以及哪種情況一定不交易。內容只存在本機瀏覽器。</p>
      <textarea class="field note-field" data-note-slug="${escapeHtml(item.slug)}" placeholder="例：只在大市向上、價格回踩 20EMA 不破、R 值大於 2 時考慮。">${escapeHtml(noteFor(item.slug))}</textarea>
    </article>
  `;
}

function indicatorCard(item) {
  return `
    <article class="indicator-card compact-indicator-card">
      <div class="card-top">
        <a class="indicator-name" href="${indicatorUrl(item.slug)}">
          <strong>${escapeHtml(item.name)}</strong>
          <small>${escapeHtml(item.abbr)} · ${escapeHtml(item.category)} · ${escapeHtml(difficultyLabel(item.difficulty))}</small>
        </a>
        <button class="icon-button ${isFavorite(item.slug) ? "active" : ""}" data-action="favorite" data-slug="${item.slug}" title="收藏 ${escapeHtml(item.name)}" aria-label="收藏 ${escapeHtml(item.name)}">★</button>
      </div>
      <div class="card-actions">
        <a class="button secondary" href="${indicatorUrl(item.slug)}">查看</a>
      </div>
    </article>
  `;
}

function searchIndicators(query, category, use, difficulty) {
  const normalized = (query || "").trim().toLowerCase();
  return indicators.filter((item) => {
    const matchesQuery = !normalized || item.searchText.includes(normalized);
    const matchesCategory = !category || item.category === category;
    const matchesUse = !use || item.uses.includes(use);
    const matchesDifficulty = !difficulty || item.difficulty === difficulty;
    return matchesQuery && matchesCategory && matchesUse && matchesDifficulty;
  });
}

function quickFilterLink(label, value, type = "use") {
  const params = new URLSearchParams();
  params.set(type, value);
  return `<a class="chip" href="#/indicators?${params.toString()}">${escapeHtml(label)}</a>`;
}

function recommendIndicators(use = "", difficulty = "") {
  return indicators
    .filter((item) => (!use || item.uses.includes(use)) && (!difficulty || item.difficulty === difficulty))
    .sort((a, b) => Number(Boolean(b.core)) - Number(Boolean(a.core)) || a.name.localeCompare(b.name))
    .slice(0, 4);
}

function renderHelperResults(use = "", difficulty = "") {
  const results = recommendIndicators(use, difficulty);
  if (!results.length) {
    return `<div class="empty-state small">沒有完全符合條件的指標，可以放寬難度或用途再試。</div>`;
  }
  return results
    .map(
      (item) => `
        <a class="mini-result-card" href="${indicatorUrl(item.slug)}">
          <strong>${escapeHtml(item.abbr)} · ${escapeHtml(item.name)}</strong>
          <span>${escapeHtml(item.uses.join("、"))}｜${escapeHtml(difficultyLabel(item.difficulty))}</span>
          <small>${item.core ? "核心推薦" : "延伸學習"}：${escapeHtml(item.summary)}</small>
        </a>
      `,
    )
    .join("");
}

function indicatorHelper() {
  const defaultUse = "看趨勢";
  const defaultDifficulty = "入門";
  return `
    <article class="info-card helper-card" data-indicator-helper>
      <span class="lesson-label">先由這裡開始</span>
      <h3>指標選擇小助手</h3>
      <p class="small">不知道先學哪個？先由入門難度開始，再按你想解決的交易問題縮小範圍。</p>
      <div class="helper-grid">
        <label>我想
          <select class="select" data-helper="use">
            <option value="">任何用途</option>
            ${useTags()
              .map((use) => `<option value="${escapeHtml(use)}" ${use === defaultUse ? "selected" : ""}>${escapeHtml(use)}</option>`)
              .join("")}
          </select>
        </label>
        <label>程度
          <select class="select" data-helper="difficulty">
            <option value="">任何難度</option>
            ${indicatorLevels
              .map((level) => `<option value="${escapeHtml(level.value)}" ${level.value === defaultDifficulty ? "selected" : ""}>${escapeHtml(level.label)}</option>`)
              .join("")}
          </select>
        </label>
      </div>
      <div class="helper-results" data-helper-results>${renderHelperResults(defaultUse, defaultDifficulty)}</div>
    </article>
  `;
}

const pageImages = {
  home: "assets/generated-pages/home.png",
  indicators: "assets/generated-pages/indicators.png",
  detail: "assets/generated-pages/indicator-detail.png",
  compare: "assets/generated-pages/compare.png",
  playground: "assets/generated-pages/playground.png",
  glossary: "assets/generated-pages/glossary.png",
  tvStrategies: "assets/generated-pages/tv-strategies.png",
  strategyCases: "assets/generated-pages/tv-strategies.png",
  scriptSystem: "assets/generated-pages/tv-strategies.png",
  scriptDemo: "assets/generated-pages/playground.png",
  scriptTrial: "assets/generated-pages/subscribe.png",
  casebook: "assets/generated-pages/indicator-detail.png",
  journal: "assets/generated-pages/journal.png",
  combo: "assets/generated-pages/combo.png",
  subscribe: "assets/generated-pages/subscribe.png",
};

function pageVisual(key, alt) {
  const src = pageImages[key];
  if (!src) return "";
  return `
    <figure class="page-visual">
      <img src="${src}" alt="${escapeHtml(alt)}" loading="eager" fetchpriority="high" decoding="async" width="1600" height="900" />
    </figure>
  `;
}

function compactActionList(items) {
  return `
    <div class="compact-action-list">
      ${items
        .map(
          (item) => `
            <a class="compact-action" href="${item.href}">
              <span class="lesson-label">${escapeHtml(item.label)}</span>
              <strong>${escapeHtml(item.title)}</strong>
              <small>${escapeHtml(shortText(item.body, 34))}</small>
            </a>
          `,
        )
        .join("")}
    </div>
  `;
}

function shortText(text, max = 42) {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const softCuts = ["。", "；", "，", "、", "：", " "];
  for (const mark of softCuts) {
    const idx = clean.lastIndexOf(mark, max);
    if (idx >= Math.floor(max * 0.45)) return clean.slice(0, idx + 1);
  }
  return `${clean.slice(0, Math.max(1, max - 1))}…`;
}

function compactStepList(items) {
  return `
    <ol class="compact-step-list">
      ${items
        .map(
          (item) => `
            <li>
              <span>${escapeHtml(item.step)}</span>
              <div>
                <strong>${escapeHtml(item.title)}</strong>
                <small>${escapeHtml(shortText(item.body, item.max || 42))}</small>
                ${item.href ? `<a class="inline-link" href="${item.href}">${escapeHtml(item.action || "打開")}</a>` : ""}
              </div>
            </li>
          `,
        )
        .join("")}
    </ol>
  `;
}

function compactIndicatorLinks(slugs) {
  return `
    <div class="chip-row compact-chip-row">
      ${slugs
        .map(getIndicator)
        .filter(Boolean)
        .map((item) => `<a class="chip" href="${indicatorUrl(item.slug)}">${escapeHtml(item.abbr)} · ${escapeHtml(item.name)}</a>`)
        .join("")}
    </div>
  `;
}

const candlestickTabs = [
  { slug: "overview", label: "總覽", href: "#/candlesticks" },
  { slug: "anatomy", label: "結構", href: "#/candlesticks/anatomy" },
  { slug: "patterns", label: "形態庫", href: "#/candlesticks/patterns" },
  { slug: "context", label: "情境", href: "#/candlesticks/context" },
  { slug: "playbook", label: "交易劇本", href: "#/candlesticks/playbook" },
  { slug: "mistakes", label: "錯誤案例", href: "#/candlesticks/mistakes" },
];

const candlestickLevels = [
  {
    level: "入門",
    title: "入門形態",
    desc: "先學最常出現、最容易用在支撐阻力和突破判斷的形態。新手只掌握這一組，已經足夠避免很多錯誤。",
  },
  {
    level: "中級",
    title: "中級形態",
    desc: "加入雙燭、三燭、缺口和連續推進形態，重點是確認主導權是否真的換手。",
  },
  {
    level: "進階",
    title: "進階形態",
    desc: "較少見但很有教學價值，必須配合大市、成交量和關鍵位置，不適合單獨作訊號。",
  },
];

const candlestickPatterns = [
  {
    slug: "long-body",
    level: "入門",
    type: "單支",
    name: "長陽燭 / 長陰燭",
    signal: "實體很長，代表當日其中一方由開市推到收市，收盤位置比影線更重要。",
    use: "突破平台、跌穿支撐或回踩後重新收高時，可作為力度確認。",
    avoid: "不要在遠離支撐阻力、已連升多日後只因長陽燭追入；下一支若低開低收，訊號立即降級。",
  },
  {
    slug: "doji",
    level: "入門",
    type: "單支",
    name: "十字星",
    signal: "開市與收市接近，代表多空暫時拉鋸，不等於必然反轉。",
    use: "放在急升後阻力、急跌後支撐，配合下一支確認燭才有參考價值。",
    avoid: "在橫行區中每一支十字星都當反轉，會被雜訊反覆打臉。",
  },
  {
    slug: "hammer",
    level: "入門",
    type: "單支",
    name: "錘頭",
    signal: "下影線長、實體靠上，代表低位曾被壓低但收市被買盤拉回。",
    use: "較適合出現在跌勢末段、支撐區或超跌後；下一支守住錘頭低位才算有防守。",
    avoid: "上升途中看見長下影就追入，可能只是波幅放大而不是低位承接。",
  },
  {
    slug: "shooting-star",
    level: "入門",
    type: "單支",
    name: "射擊之星",
    signal: "上影線長、實體靠下，代表高位曾被推上但收市被沽壓打回。",
    use: "較適合出現在升勢末段、阻力區或突破失敗後；下一支跌穿低位才算確認。",
    avoid: "在強趨勢初段單靠上影線造淡，容易被主升段夾走。",
  },
  {
    slug: "engulfing",
    level: "入門",
    type: "雙支",
    name: "吞噬形態",
    signal: "第二支實體包住前一支實體，代表主導權可能換手。",
    use: "低位陽吞陰可觀察買盤接力；高位陰吞陽可觀察沽壓接管。",
    avoid: "若吞噬發生在窄幅橫行中間，訊號通常只是區間內波動。",
  },
  {
    slug: "harami",
    level: "中級",
    type: "雙支",
    name: "孕線",
    signal: "第二支實體縮在前一支實體內，代表大波動後市場暫停。",
    use: "適合作為等待突破方向的壓縮訊號，而不是立即交易訊號。",
    avoid: "把孕線當成必然反轉；它更常見的意思是暫停和等待。",
  },
  {
    slug: "piercing-dark-cloud",
    level: "中級",
    type: "雙支",
    name: "刺透 / 烏雲蓋頂",
    signal: "第二支深入前一支實體中段，代表反方向力量已經開始挑戰原趨勢。",
    use: "配合支撐阻力和成交量，可用來評估反彈或回落的可信度。",
    avoid: "如果第二支只是輕微收回，未越過中線，反轉力度通常不足。",
  },
  {
    slug: "morning-evening-star",
    level: "中級",
    type: "三支",
    name: "早晨之星 / 黃昏之星",
    signal: "第一支延續原方向，中間小實體猶豫，第三支反方向收回大量失地。",
    use: "適合用作主要轉向警號，但必須看第三支是否有力收盤。",
    avoid: "中間小燭不代表轉向；沒有第三支確認，只是故事未寫完。",
  },
  {
    slug: "three-soldiers-crows",
    level: "中級",
    type: "三支",
    name: "三白兵 / 三黑鴉",
    signal: "連續三支同方向實體，代表趨勢推進具連續性。",
    use: "可用來確認趨勢啟動，但較好的進場通常在回踩，而不是第三支收盤後追入。",
    avoid: "第三支才追，常常買在短線過熱點；止蝕距離也會被拉闊。",
  },
  {
    slug: "inside-outside",
    level: "入門",
    type: "結構",
    name: "內包 / 外包 K 線",
    signal: "內包代表波幅收縮，外包代表波幅擴張；兩者核心是波幅狀態，不是方向預言。",
    use: "內包可等突破，外包可檢查是否假突破或主導權轉換。",
    avoid: "沒有位置和成交量時，內包突破很容易變成假突破。",
  },
  {
    slug: "spinning-top",
    level: "入門",
    type: "單支",
    name: "紡錘線",
    signal: "實體短、上下影線都有，代表當日多空都有試探但沒有明顯勝方。",
    use: "適合用作降低追價衝動的警號，尤其在急升急跌後。",
    avoid: "不要把每一支紡錘線都當反轉；它多數只是市場暫停。",
  },
  {
    slug: "marubozu",
    level: "入門",
    type: "單支",
    name: "光頭光腳 Marubozu",
    signal: "幾乎沒有影線，代表一方由開市主導到收市。",
    use: "可用來確認強突破或恐慌跌穿，但要等回踩或下一支確認控制風險。",
    avoid: "收盤後才追入，止蝕通常被拉得很遠，R 值容易變差。",
  },
  {
    slug: "dragonfly-gravestone",
    level: "入門",
    type: "單支",
    name: "蜻蜓十字 / 墓碑十字",
    signal: "極長單邊影線配合接近開收同價，代表日內曾極端試探後被拉回。",
    use: "放在支撐或阻力附近，可作為市場拒絕某個價區的證據。",
    avoid: "若出現在消息日或高波幅日，影線可能只是情緒波動，不一定有交易價值。",
  },
  {
    slug: "inverted-hammer-hanging-man",
    level: "中級",
    type: "單支",
    name: "倒錘頭 / 吊頸線",
    signal: "形狀相似，但出現位置決定含義；跌後倒錘頭看買盤試探，升後吊頸線看低位承接是否失守。",
    use: "必須等待下一支確認，否則只是上方或下方試探。",
    avoid: "只看形狀不看位置，會把反彈訊號和見頂警號混在一起。",
  },
  {
    slug: "tweezer",
    level: "中級",
    type: "雙支",
    name: "鑷頂 / 鑷底",
    signal: "兩支或多支 K 線在相近高位或低位被拒絕，代表該價區暫時有防守。",
    use: "配合阻力或支撐，可用來收緊止賺或等待反向確認。",
    avoid: "在趨勢強烈時，鑷頂鑷底可能只是短暫停頓。",
  },
  {
    slug: "belt-hold",
    level: "中級",
    type: "單支",
    name: "捉腰帶線",
    signal: "開市接近極端位置，然後單方向推進，表示當日主導很清楚。",
    use: "若在關鍵位後出現，可作為主導權切換或延續的輔助證據。",
    avoid: "在缺口後過度追入，容易遇到即日回補。",
  },
  {
    slug: "gap",
    level: "中級",
    type: "缺口",
    name: "突破缺口 / 竭盡缺口",
    signal: "價格跳離前一交易區間；突破缺口多見於新趨勢啟動，竭盡缺口多見於尾段情緒過熱。",
    use: "看缺口後能否守住，以及成交量是否配合。",
    avoid: "所有缺口都追，會把啟動缺口和尾段缺口混淆。",
  },
  {
    slug: "three-inside-outside",
    level: "中級",
    type: "三支",
    name: "三內升跌 / 三外升跌",
    signal: "由孕線或吞噬形態延伸，多一支確認燭，可信度比單純雙燭更高。",
    use: "適合等待第三支確認後，再用第二支或整組低高位作失效線。",
    avoid: "第三支已經走太遠時，不宜追入，應等回踩。",
  },
  {
    slug: "kicker",
    level: "進階",
    type: "雙支",
    name: "Kicker 反擊形態",
    signal: "第二支以缺口或強烈反向開局，直接否定前一支方向，代表市場預期急速改變。",
    use: "常見於重大消息後，適合觀察是否出現趨勢重估。",
    avoid: "消息日滑價大，若沒有明確止蝕，不應硬追。",
  },
  {
    slug: "abandoned-baby",
    level: "進階",
    type: "三支",
    name: "棄嬰形態",
    signal: "中間十字星和前後 K 線出現缺口，代表原趨勢尾段出現強烈猶豫後反向。",
    use: "若出現在大級別支撐阻力，反轉警號較強。",
    avoid: "在流動性不足的股票上，缺口可能只是成交疏落，不能照搬。",
  },
  {
    slug: "rising-falling-three-methods",
    level: "進階",
    type: "五支",
    name: "上升三法 / 下降三法",
    signal: "強勢長燭後出現數支小回調，再由同方向長燭重新推進，代表趨勢中繼。",
    use: "適合趨勢交易者等待回調不破後續持或加倉。",
    avoid: "中間小燭跌穿第一支長燭範圍，形態失效。",
  },
  {
    slug: "tasuki-gap",
    level: "進階",
    type: "缺口",
    name: "Tasuki Gap",
    signal: "趨勢中出現缺口後，回補嘗試未完全封閉缺口，代表原方向仍有防守。",
    use: "用缺口區作失效線，觀察趨勢是否延續。",
    avoid: "缺口被完全回補時，不應再硬把它解讀成強勢延續。",
  },
  {
    slug: "mat-hold",
    level: "進階",
    type: "五支",
    name: "Mat Hold",
    signal: "強勢長燭後短暫整理，但價格不深回，最後再度同方向突破。",
    use: "比普通三法更偏強勢中繼，適合放在主升段觀察。",
    avoid: "整理期間跌穿第一支長燭中段，強勢假設要降級。",
  },
  {
    slug: "stick-sandwich",
    level: "進階",
    type: "三支",
    name: "Stick Sandwich",
    signal: "兩支陰燭夾住一支陽燭，且兩支陰燭收盤接近，代表低位可能有承接。",
    use: "只能在支撐附近作反彈觀察，需等待下一支陽燭確認。",
    avoid: "下降趨勢中段單看它買入，容易接住續跌。",
  },
  {
    slug: "ladder-bottom",
    level: "進階",
    type: "五支",
    name: "Ladder Bottom",
    signal: "連跌後出現逐步減弱，再由較強陽燭打破下降節奏。",
    use: "適合配合超跌、支撐和成交量作底部觀察。",
    avoid: "沒有強陽確認前，只是跌勢放慢，不是見底。",
  },
  {
    slug: "counterattack",
    level: "進階",
    type: "雙支",
    name: "反擊線 Counterattack",
    signal: "第二支大幅反向開市後，收盤回到前一支收盤附近，代表雙方重新拉平。",
    use: "在極端情緒後可作轉折觀察，但需要下一支打破僵局。",
    avoid: "只代表反擊，不代表已經勝出；沒有後續方向不要交易。",
  },
  {
    slug: "separating-lines",
    level: "進階",
    type: "雙支",
    name: "分離線 Separating Lines",
    signal: "兩支相反顏色 K 線開市接近，但第二支沿原趨勢方向收強，代表趨勢恢復。",
    use: "可作趨勢回調後重新啟動的證據。",
    avoid: "若第二支無法收近極端位置，延續力度不足。",
  },
  {
    slug: "meeting-lines",
    level: "進階",
    type: "雙支",
    name: "相遇線 Meeting Lines",
    signal: "兩支相反方向 K 線收盤接近，代表原方向被反向力量抵消。",
    use: "在高低位可作減速和觀察訊號，不宜單獨反手。",
    avoid: "相遇不是反轉；後續沒有跌破或升破，仍只是拉鋸。",
  },
  {
    slug: "tower",
    level: "進階",
    type: "多支",
    name: "塔形頂 / 塔形底",
    signal: "一段急升或急跌後，價格逐步鈍化，再由相反長燭確認節奏轉變。",
    use: "適合用來理解趨勢由加速到派發或收集的過程。",
    avoid: "形態形成時間較長，不應在中途未確認時預判完成。",
  },
  {
    slug: "matching-low",
    level: "進階",
    type: "雙支",
    name: "相同低位 Matching Low",
    signal: "兩支陰燭收在接近低位，代表低位暫有防守但買盤仍未真正勝出。",
    use: "只適合作為支撐觀察，下一支陽燭收高才提升價值。",
    avoid: "看到相同低位就買，可能只是跌勢短暫停頓。",
  },
];

const candlestickContextCards = [
  {
    title: "位置先於形態",
    body: "同一個錘頭，出現在支撐位和出現在半山，意義完全不同。先標支撐、阻力、前高、前低，再解讀陰陽燭。",
  },
  {
    title: "收盤先於影線",
    body: "影線告訴你日內曾經發生甚麼，收盤告訴你最後誰留下來。判讀時應優先看收盤是否守住關鍵位置。",
  },
  {
    title: "成交量是旁證",
    body: "放量突破、縮量回踩、放量跌穿，各自含義不同。成交量不是必須每天放大，但關鍵燭沒有成交量，可信度要打折。",
  },
  {
    title: "大週期定方向",
    body: "日線形態若和週線趨勢相反，只能當短線反彈或修正看待。週線順風時，同一個日線訊號的價值更高。",
  },
];

const candlestickMistakes = [
  "只背形態名稱，不看位置：在阻力位追長陽，在支撐位追長陰，都是最常見的反面教材。",
  "一支 K 線就下結論：單支燭只是一句話，不是完整故事；至少要看前面背景和下一支確認。",
  "忽略止蝕距離：形態越大，止蝕越遠；如果 R 值不夠，再漂亮的形態也不值得交易。",
  "把影線當絕對訊號：長下影不一定是見底，可能只是波動放大；長上影不一定見頂，可能只是突破前測試供應。",
  "在橫行中過度交易：區間內陰陽燭雜訊最多，除非靠近區間邊界，否則訊號價值低。",
  "不分普通日和消息日：業績、議息、重大新聞後的 K 線波幅可能失真，不能照搬平日規則。",
];

function candlestickSectionFromPath(path) {
  const section = path.split("/")[1] || "overview";
  return candlestickTabs.some((tab) => tab.slug === section) ? section : "overview";
}

function candlestickNav(active) {
  return `
    <nav class="lesson-tabs" aria-label="陰陽燭教學分頁">
      ${candlestickTabs
        .map(
          (tab) =>
            `<a class="chip ${tab.slug === active ? "active" : ""}" href="${tab.href}">${tab.label}</a>`,
        )
        .join("")}
    </nav>
  `;
}

function renderCandlestickHeroSvg() {
  return `
    <figure class="candlestick-visual" aria-label="陰陽燭教學主視覺">
      <svg viewBox="0 0 720 420" role="img" aria-label="陰陽燭、支撐阻力和交易檢查清單示意圖">
        <defs>
          <linearGradient id="candleBg" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stop-color="#f8fbfc"/>
            <stop offset="1" stop-color="#e7f4f2"/>
          </linearGradient>
        </defs>
        <rect width="720" height="420" rx="14" fill="url(#candleBg)"/>
        <g opacity="0.68" stroke="#d4e0e6">
          ${Array.from({ length: 9 }, (_, i) => `<line x1="58" x2="470" y1="${64 + i * 32}" y2="${64 + i * 32}"/>`).join("")}
          ${Array.from({ length: 10 }, (_, i) => `<line x1="${58 + i * 46}" x2="${58 + i * 46}" y1="56" y2="328"/>`).join("")}
        </g>
        <path d="M70 300 L470 300" stroke="#94a3b8" stroke-width="2" stroke-dasharray="8 8"/>
        <path d="M70 132 L470 132" stroke="#f3b267" stroke-width="2" stroke-dasharray="8 8"/>
        ${renderCandleGlyph(92, 160, 118, 150, 286, 40)}
        ${renderCandleGlyph(150, 142, 168, 135, 206, 40)}
        ${renderCandleGlyph(208, 176, 122, 112, 218, 40)}
        ${renderCandleGlyph(266, 125, 88, 78, 176, 40)}
        ${renderCandleGlyph(324, 92, 118, 86, 190, 40)}
        ${renderCandleGlyph(382, 120, 70, 58, 152, 40)}
        ${renderCandleGlyph(440, 76, 58, 46, 116, 40)}
        <rect x="515" y="72" width="148" height="224" rx="10" fill="#ffffff" stroke="#dce4ea"/>
        <text x="540" y="106" fill="#0f766e" font-size="17" font-weight="800">判讀次序</text>
        ${["位置", "收盤", "成交量", "確認", "R 值"].map((text, i) => `
          <g transform="translate(538 ${134 + i * 32})">
            <rect width="16" height="16" rx="3" fill="${i < 3 ? "#dff4ef" : "#fff7ed"}" stroke="${i < 3 ? "#0f766e" : "#d97706"}"/>
            <line x1="27" x2="94" y1="8" y2="8" stroke="#647282" stroke-width="3" stroke-linecap="round"/>
            <text x="102" y="12" fill="#334155" font-size="13">${text}</text>
          </g>
        `).join("")}
        <text x="70" y="370" fill="#17202a" font-size="24" font-weight="900">陰陽燭不是答案，是交易前的證據整理</text>
      </svg>
    </figure>
  `;
}

function renderCandleGlyph(cx, openY, closeY, highY, lowY, width = 28) {
  const up = closeY < openY;
  const color = up ? "#0f766e" : "#dc2626";
  const top = Math.min(openY, closeY);
  const height = Math.max(5, Math.abs(closeY - openY));
  return `
    <g>
      <line x1="${cx}" x2="${cx}" y1="${highY}" y2="${lowY}" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
      <rect x="${cx - width / 2}" y="${top}" width="${width}" height="${height}" rx="5" fill="${color}" opacity="0.92"/>
    </g>
  `;
}

function renderCandlestickAnatomySvg() {
  return `
    <svg class="candle-svg" viewBox="0 0 680 320" role="img" aria-label="陰陽燭結構圖">
      <rect width="680" height="320" rx="10" fill="#fbfdfe"/>
      <g stroke="#dce4ea">
        <line x1="70" x2="610" y1="70" y2="70"/>
        <line x1="70" x2="610" y1="250" y2="250"/>
      </g>
      ${renderCandleGlyph(180, 212, 110, 76, 260, 56)}
      ${renderCandleGlyph(455, 108, 218, 64, 264, 56)}
      <text x="180" y="42" text-anchor="middle" fill="#0f766e" font-size="20" font-weight="900">陽燭</text>
      <text x="455" y="42" text-anchor="middle" fill="#dc2626" font-size="20" font-weight="900">陰燭</text>
      <text x="95" y="106" fill="#334155" font-size="15">收市</text>
      <text x="92" y="218" fill="#334155" font-size="15">開市</text>
      <text x="500" y="112" fill="#334155" font-size="15">開市</text>
      <text x="500" y="224" fill="#334155" font-size="15">收市</text>
      <text x="236" y="78" fill="#647282" font-size="14">最高價</text>
      <text x="236" y="266" fill="#647282" font-size="14">最低價</text>
      <text x="305" y="154" fill="#17202a" font-size="16" font-weight="800">實體越長，當日主導越明顯</text>
      <text x="305" y="182" fill="#647282" font-size="14">影線代表日內試探，收盤代表最後結果</text>
    </svg>
  `;
}

function renderPatternMiniSvg(slug) {
  const library = {
    "long-body": [{ open: 78, close: 28, high: 22, low: 86 }],
    doji: [{ open: 55, close: 57, high: 18, low: 92 }],
    hammer: [{ open: 34, close: 28, high: 22, low: 96 }],
    "shooting-star": [{ open: 72, close: 78, high: 16, low: 86 }],
    engulfing: [
      { open: 44, close: 68, high: 36, low: 76 },
      { open: 74, close: 28, high: 22, low: 82 },
    ],
    harami: [
      { open: 24, close: 78, high: 18, low: 86 },
      { open: 58, close: 45, high: 40, low: 66 },
    ],
    "piercing-dark-cloud": [
      { open: 78, close: 32, high: 28, low: 84 },
      { open: 24, close: 56, high: 20, low: 64 },
    ],
    "morning-evening-star": [
      { open: 28, close: 72, high: 22, low: 82 },
      { open: 74, close: 70, high: 60, low: 88 },
      { open: 68, close: 30, high: 24, low: 72 },
    ],
    "three-soldiers-crows": [
      { open: 82, close: 58, high: 52, low: 88 },
      { open: 60, close: 38, high: 32, low: 66 },
      { open: 40, close: 20, high: 16, low: 48 },
    ],
    "inside-outside": [
      { open: 32, close: 78, high: 20, low: 90 },
      { open: 56, close: 48, high: 42, low: 66 },
      { open: 82, close: 28, high: 18, low: 92 },
    ],
    "spinning-top": [{ open: 52, close: 58, high: 24, low: 92 }],
    marubozu: [{ open: 86, close: 18, high: 18, low: 86 }],
    "dragonfly-gravestone": [
      { open: 34, close: 36, high: 30, low: 98 },
      { open: 78, close: 76, high: 18, low: 82 },
    ],
    "inverted-hammer-hanging-man": [
      { open: 70, close: 62, high: 18, low: 76 },
      { open: 40, close: 48, high: 16, low: 56 },
    ],
    tweezer: [
      { open: 34, close: 70, high: 22, low: 78 },
      { open: 72, close: 38, high: 22, low: 82 },
    ],
    "belt-hold": [{ open: 92, close: 24, high: 22, low: 96 }],
    gap: [
      { open: 86, close: 58, high: 52, low: 92 },
      { open: 38, close: 18, high: 14, low: 42 },
      { open: 34, close: 22, high: 18, low: 46 },
    ],
    "three-inside-outside": [
      { open: 26, close: 78, high: 20, low: 84 },
      { open: 62, close: 48, high: 42, low: 70 },
      { open: 46, close: 24, high: 20, low: 52 },
    ],
    kicker: [
      { open: 28, close: 70, high: 22, low: 78 },
      { open: 46, close: 18, high: 14, low: 52 },
    ],
    "abandoned-baby": [
      { open: 24, close: 66, high: 18, low: 74 },
      { open: 86, close: 84, high: 78, low: 96 },
      { open: 62, close: 24, high: 18, low: 66 },
    ],
    "rising-falling-three-methods": [
      { open: 92, close: 40, high: 34, low: 98 },
      { open: 48, close: 58, high: 42, low: 64 },
      { open: 56, close: 62, high: 50, low: 68 },
      { open: 60, close: 54, high: 48, low: 66 },
      { open: 58, close: 22, high: 18, low: 62 },
    ],
    "tasuki-gap": [
      { open: 86, close: 56, high: 50, low: 92 },
      { open: 38, close: 16, high: 12, low: 42 },
      { open: 20, close: 36, high: 16, low: 46 },
    ],
    "mat-hold": [
      { open: 92, close: 34, high: 28, low: 98 },
      { open: 30, close: 46, high: 24, low: 52 },
      { open: 42, close: 52, high: 36, low: 58 },
      { open: 48, close: 44, high: 38, low: 56 },
      { open: 44, close: 18, high: 14, low: 50 },
    ],
    "stick-sandwich": [
      { open: 28, close: 74, high: 22, low: 82 },
      { open: 72, close: 40, high: 34, low: 78 },
      { open: 42, close: 74, high: 36, low: 82 },
    ],
    "ladder-bottom": [
      { open: 18, close: 42, high: 14, low: 50 },
      { open: 36, close: 58, high: 30, low: 64 },
      { open: 54, close: 76, high: 48, low: 82 },
      { open: 74, close: 84, high: 68, low: 92 },
      { open: 82, close: 44, high: 38, low: 88 },
    ],
    counterattack: [
      { open: 24, close: 72, high: 18, low: 78 },
      { open: 96, close: 72, high: 100, low: 66 },
    ],
    "separating-lines": [
      { open: 32, close: 72, high: 26, low: 78 },
      { open: 34, close: 18, high: 14, low: 40 },
    ],
    "meeting-lines": [
      { open: 24, close: 66, high: 18, low: 74 },
      { open: 92, close: 66, high: 98, low: 60 },
    ],
    tower: [
      { open: 84, close: 36, high: 30, low: 90 },
      { open: 38, close: 34, high: 28, low: 48 },
      { open: 36, close: 42, high: 30, low: 50 },
      { open: 44, close: 50, high: 36, low: 58 },
      { open: 48, close: 86, high: 42, low: 92 },
    ],
    "matching-low": [
      { open: 28, close: 76, high: 22, low: 84 },
      { open: 46, close: 76, high: 40, low: 86 },
    ],
  };
  const candles = library[slug] || library["long-body"];
  const gap = candles.length <= 1 ? 0 : Math.min(68, 220 / (candles.length - 1));
  const start = 170 - ((candles.length - 1) * gap) / 2;
  return `
    <svg class="pattern-svg" viewBox="0 0 340 150" role="img" aria-label="陰陽燭形態示意圖">
      <rect width="340" height="150" rx="8" fill="#f8fbfc"/>
      <line x1="34" x2="306" y1="118" y2="118" stroke="#dce4ea"/>
      <line x1="34" x2="306" y1="46" y2="46" stroke="#dce4ea" stroke-dasharray="5 5"/>
      ${candles
        .map((candle, index) =>
          renderCandleGlyph(start + index * gap, candle.open, candle.close, candle.high, candle.low, 34),
        )
        .join("")}
    </svg>
  `;
}

function candlestickReaderResult(values) {
  let score = 0;
  const notes = [];
  if (values.location === "support" || values.location === "resistance" || values.location === "breakout") score += 2;
  else notes.push("位置不夠清楚，先不要把形態當成交易訊號。");
  if (values.volume === "rising") score += 1;
  else if (values.volume === "low") notes.push("成交量偏弱，形態可信度下降。");
  if (values.confirmation === "follow") score += 2;
  else if (values.confirmation === "fail") notes.push("下一支已經否定形態，應放棄原來劇本。");
  if (
    (values.location === "support" && ["hammer", "bullish-engulfing", "long-green"].includes(values.candle)) ||
    (values.location === "resistance" && ["shooting-star", "bearish-engulfing", "long-red"].includes(values.candle)) ||
    (values.location === "breakout" && ["long-green", "long-red", "bullish-engulfing", "bearish-engulfing"].includes(values.candle))
  ) {
    score += 2;
  } else {
    notes.push("形態與所在位置未完全配合，需要等待更多證據。");
  }
  if (values.trend === "range" && values.location === "middle") {
    score -= 2;
    notes.push("橫行中段最容易出假訊號，最好等到區間邊界。");
  }

  const title =
    score >= 6 ? "可列入交易候選" : score >= 3 ? "只適合觀察" : "暫時不要交易";
  const tone = score >= 6 ? "result-good" : score >= 3 ? "result-warn" : "result-bad";
  const action =
    score >= 6
      ? "下一步是計算入場、止蝕、目標和 R 值；若 R 值不足 1.8，仍然放棄。"
      : score >= 3
        ? "先畫好關鍵位，等待下一支 K 線確認，不要預先買賣。"
        : "把它記錄成觀察案例，不要把不完整證據變成倉位。";
  return { title, tone, action, notes };
}

function renderCandlestickReader() {
  const defaults = {
    trend: "up",
    location: "support",
    candle: "hammer",
    volume: "rising",
    confirmation: "follow",
  };
  const result = candlestickReaderResult(defaults);
  return `
    <article class="trade-card candle-reader" data-candlestick-reader>
      <span class="lesson-label">判讀助手</span>
      <h2>陰陽燭判讀器</h2>
      <p class="small">這不是買賣建議；「形態、位置、成交量、確認」會按可核對的次序排列。</p>
      <div class="candle-reader-grid">
        <label>大方向
          <select class="select" data-candle-field="trend">
            <option value="up" selected>上升趨勢</option>
            <option value="down">下降趨勢</option>
            <option value="range">橫行區間</option>
          </select>
        </label>
        <label>所在位置
          <select class="select" data-candle-field="location">
            <option value="support" selected>支撐附近</option>
            <option value="resistance">阻力附近</option>
            <option value="breakout">突破/跌破位</option>
            <option value="middle">區間中段</option>
          </select>
        </label>
        <label>主要形態
          <select class="select" data-candle-field="candle">
            <option value="hammer" selected>錘頭</option>
            <option value="shooting-star">射擊之星</option>
            <option value="bullish-engulfing">陽吞陰</option>
            <option value="bearish-engulfing">陰吞陽</option>
            <option value="long-green">長陽燭</option>
            <option value="long-red">長陰燭</option>
            <option value="doji">十字星</option>
          </select>
        </label>
        <label>成交量
          <select class="select" data-candle-field="volume">
            <option value="rising" selected>較近期放大</option>
            <option value="normal">普通</option>
            <option value="low">偏低</option>
          </select>
        </label>
        <label>下一支確認
          <select class="select" data-candle-field="confirmation">
            <option value="follow" selected>順形態方向收盤</option>
            <option value="none">未確認</option>
            <option value="fail">形態被否定</option>
          </select>
        </label>
      </div>
      <div class="result-panel ${result.tone}" data-candle-result>
        <strong>${result.title}</strong>
        <span>${result.action}</span>
        ${result.notes.map((note) => `<span>${escapeHtml(note)}</span>`).join("")}
      </div>
    </article>
  `;
}

function renderProfessorOutputGuide(label, title, items, footer = "") {
  return `
    <section class="page-band">
      <div class="section-head">
        <div>
          <span class="lesson-label">${escapeHtml(label)}</span>
          <h2>${escapeHtml(title)}</h2>
          ${footer ? `<p>${escapeHtml(footer)}</p>` : ""}
        </div>
      </div>
      <div class="card-grid">
        ${items
          .map(
            ([heading, body]) => `
              <article class="info-card">
                <h3>${escapeHtml(heading)}</h3>
                <p class="small">${escapeHtml(body)}</p>
              </article>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderHome() {
  const starterIndicators = ["support-resistance", "volume", "ema", "rsi", "atr"]
    .map(getIndicator)
    .filter(Boolean);
  const pathCards = [
    {
      label: "完全新手",
      title: "先看懂陰陽燭",
      body: "先認識價格圖的基本語言，再學用指標整理觀察。",
      href: "#/learn",
      action: "第 1 步：看懂陰陽燭",
      tone: "trade-card",
    },
    {
      label: "查一個工具",
      title: "按問題找指標",
      body: "先說清楚要觀察方向、升跌速度、成交量還是風險。",
      href: "#/indicators",
      action: "搜尋",
      tone: "info-card",
    },
    {
      label: "看圖練習",
      title: "在圖上練習",
      body: "先辨認市況，再寫下支持你看法的條件和不成立的位置。",
      href: "#/playground",
      action: "練習",
      tone: "info-card",
    },
  ];

  app.innerHTML = `
    <section class="page-band hero-grid home-hero">
      <div class="hero-copy">
        <div class="page-title">
          <span class="eyebrow">技術分析入門</span>
          <h1>由看懂一支陰陽燭開始</h1>
          <p>先看價格處於趨勢、區間還是高波動，再用指標補充觀察。訊號出現不等於要買入或賣出。</p>
        </div>
        <div class="home-path-grid">
          ${pathCards
            .map(
              (card) => `
                <article class="${card.tone} path-card">
                  <span class="lesson-label">${escapeHtml(card.label)}</span>
                  <h2>${escapeHtml(card.title)}</h2>
                  <p class="small">${escapeHtml(card.body)}</p>
                  <a class="button ${card.tone === "trade-card" ? "" : "secondary"}" href="${card.href}">${escapeHtml(card.action)}</a>
                </article>
              `,
            )
            .join("")}
        </div>
      </div>
      <aside class="stack">
        ${pageVisual("home", "香港辦公桌上的股票圖表、筆記和計算機")}
      </aside>
    </section>

    <section class="page-band start-panel">
      <div class="content-grid">
        <div>
          <span class="lesson-label">完成一張圖前</span>
          <h2>先寫下四項觀察</h2>
          <ol class="step-list">
            <li><strong>所看週期：</strong>你看的是日線、四小時圖，還是其他週期？</li>
            <li><strong>目前市況：</strong>趨勢、區間還是波動加劇？</li>
            <li><strong>支持證據：</strong>價格結構、成交量或指標之中，哪一項真正支持你的看法？</li>
            <li><strong>假設不成立：</strong>哪個價位或條件出現後，你會放棄原來的判斷？</li>
          </ol>
        </div>
        <form class="search-panel" data-action="home-search">
          <label class="lesson-label" for="homeSearch">已知道要研究甚麼？</label>
          <div class="search-box">
            <input id="homeSearch" class="field" name="q" type="search" placeholder="搜尋 RSI、MACD、轉折、止蝕、風險..." autocomplete="off" />
            <button class="button" type="submit">搜尋</button>
          </div>
          <div class="chip-row">
            ${starterIndicators
              .map((item) => `<a class="chip" href="${indicatorUrl(item.slug)}">${escapeHtml(item.abbr)} · ${escapeHtml(item.name)}</a>`)
              .join("")}
          </div>
        </form>
      </div>
    </section>

    ${renderSiteDataStatusPanel()}
  `;
}

function renderLearningPath() {
  const stages = [
    {
      step: "1",
      title: "看懂 K 線",
      body: "學習開、高、低、收，知道一支陰陽燭記錄的是一段時間內價格如何走。暫時不用背形態名稱。",
      output: "完成後，可在圖上指出實體、上影線、下影線及開收市價。",
      href: "#/candlesticks/anatomy",
      action: "學 K 線",
    },
    {
      step: "2",
      title: "判斷位置",
      body: "價格所處的位置往往比單一指標數字重要。先分清趨勢、區間、支持與阻力，避免在區間中段追逐訊號。",
      output: "完成後，可說明價格是在趨勢、區間還是接近重要位置。",
      href: "#/indicators/support-resistance",
      action: "學位置",
    },
    {
      step: "3",
      title: "看成交量",
      body: "成交量可用來觀察市場是否接受新價格；放量本身不代表看好或看淡，仍要配合價格位置。",
      output: "完成後，可比較價格變動與成交量是否互相配合。",
      href: "#/indicators/volume",
      action: "學成交量",
    },
    {
      step: "4",
      title: "選一個動能工具",
      body: "先用 RSI 或 MACD 觀察升跌是否偏急或動能是否轉弱。兩者都不是直接買賣指示，也不用同時堆疊多個相似指標。",
      output: "完成後，可用一個動能指標補充價格結構，而非取代價格判讀。",
      href: "#/indicators/rsi",
      action: "學 RSI",
    },
    {
      step: "5",
      title: "先算風險",
      body: "方向判斷正確仍可能虧損。止蝕、目標、風險回報比率和持倉規模，應在實際交易前寫清楚。",
      output: "完成後，可寫出交易假設不成立的條件，並按風險距離調整持倉規模。",
      href: "#/playground",
      action: "做練習",
    },
    {
      step: "6",
      title: "用案例復盤",
      body: "透過恐慌急跌、下降趨勢、主升浪和消息裂口，練習何時不應依賴指標，以及何時應放棄原有計劃。",
      output: "完成後，可分開寫下當時已知資料、事後結果和計劃不成立的條件。",
      href: "#/casebook",
      action: "看案例庫",
    },
  ];

  app.innerHTML = `
    <section class="page-band">
      <div class="visual-copy">
        <div class="page-title">
          <span class="eyebrow">新手學習路線</span>
          <h1>由一張圖學會有根據地判讀</h1>
          <p>先看價格結構和成交量，再用指標補充觀察，最後才處理風險。每一步都要知道自己在回答甚麼問題。</p>
        </div>
        <div class="card-actions">
          <a class="button" href="#/candlesticks/anatomy">第 1 步：認識陰陽燭</a>
          <a class="button secondary" href="#/playground">已懂結構？做認圖練習</a>
        </div>
      </div>
      ${pageVisual("home", "股票圖表、筆記和學習路線")}
    </section>

    <section class="page-band">
      <div class="section-head">
        <div>
          <h2>六步學習路線</h2>
          <p>每一步只處理一個問題。先把基本結構看清楚，才有條件比較指標和案例。</p>
        </div>
      </div>
      ${compactStepList(stages.map((stage) => ({
        step: stage.step,
        title: stage.title,
        body: stage.output,
        href: stage.href,
        action: stage.action,
      })))}
    </section>

    <section class="page-band content-grid">
      <div>
        <span class="lesson-label">完成本節後</span>
          <h2>你應能交代四件事</h2>
        <ol class="step-list">
          <li><strong>目前市況是甚麼。</strong></li>
          <li><strong>哪項資料支持你的看法。</strong></li>
          <li><strong>哪個條件會令原有判斷不成立。</strong></li>
          <li><strong>下一步應觀察、等待，還是停止跟進。</strong></li>
        </ol>
      </div>
      <div>
        <span class="lesson-label">必學工具</span>
        <h2>先學 5 個</h2>
        ${compactIndicatorLinks(["support-resistance", "volume", "ema", "rsi", "atr"])}
      </div>
    </section>
  `;
}

function renderToolbox() {
  const tools = [
    {
      label: "選工具",
      title: "指標比較",
      body: "刪掉重複訊號。",
      href: "#/compare",
      action: "比較指標",
    },
    {
      label: "查重複",
      title: "指標組合檢查器",
      body: "檢查分工是否清楚。",
      href: "#/combo",
      action: "檢查組合",
    },
    {
      label: "寫紀錄",
      title: "交易日誌",
      body: "留下復盤線索。",
      href: "#/journal",
      action: "寫日誌",
    },
    {
      label: "保存進度",
      title: "收藏/訂閱與本地資料",
      body: "管理收藏和備註。",
      href: "#/subscribe",
      action: "管理資料",
    },
    {
      label: "補語言",
      title: "術語表",
      body: "先補關鍵概念。",
      href: "#/glossary",
      action: "查術語",
    },
    {
      label: "做練習",
      title: "案例庫",
      body: "練習何時不交易。",
      href: "#/casebook",
      action: "看案例",
    },
  ];

  app.innerHTML = `
    <section class="page-band visual-band">
      <div class="visual-copy">
        <div class="page-title">
          <span class="eyebrow">交易前工具箱</span>
          <h1>入場前，只檢查真正有用的事</h1>
          <p>選工具、刪重複、寫風險、留紀錄。工具箱不是用來堆指標，是用來減少漏判。</p>
        </div>
        <div class="card-actions">
          <a class="button" href="#/combo">先檢查指標組合</a>
          <a class="button secondary" href="#/journal">寫交易日誌</a>
          <a class="button secondary" href="#/subscribe">管理收藏</a>
        </div>
      </div>
      ${pageVisual("combo", "多張指標卡片、連線圖和風險檢查便條")}
    </section>

    <section>
      <div class="section-head">
        <div>
          <h2>按任務選工具</h2>
          <p>缺甚麼，就開哪一個；不要為了看起來完整而多加工具。</p>
        </div>
      </div>
      ${compactActionList(tools)}
    </section>

    <section class="page-band">
      <div class="section-head">
        <div>
          <span class="lesson-label">交易前 5 問</span>
          <h2>工具箱最終要回答這五個問題</h2>
        </div>
      </div>
      <ol class="step-list checklist-list">
        <li><strong>市況：</strong>趨勢、震盪還是突破？</li>
        <li><strong>位置：</strong>支撐、阻力還是中段？</li>
        <li><strong>證據：</strong>工具是否各有分工？</li>
        <li><strong>風險：</strong>R 值是否值得做？</li>
        <li><strong>失效：</strong>錯了在哪裡離場？</li>
      </ol>
    </section>
  `;
}

function updateIndicatorHash(changes) {
  const { params } = parseRoute();
  Object.entries(changes).forEach(([key, value]) => {
    if (value) params.set(key, value);
    else params.delete(key);
  });
  location.hash = `#/indicators${params.toString() ? `?${params.toString()}` : ""}`;
}

function indicatorLevelChips(params, activeDifficulty) {
  const allParams = new URLSearchParams(params);
  allParams.delete("difficulty");
  const allHref = `#/indicators${allParams.toString() ? `?${allParams.toString()}` : ""}`;
  return `
    <div class="lesson-tabs" aria-label="技術指標難度分級">
      <a class="chip ${activeDifficulty ? "" : "active"}" href="${allHref}">全部級別</a>
      ${indicatorLevels
        .map((level) => {
          const next = new URLSearchParams(params);
          next.set("difficulty", level.value);
          return `<a class="chip ${activeDifficulty === level.value ? "active" : ""}" href="#/indicators?${next.toString()}">${level.label}</a>`;
        })
        .join("")}
    </div>
  `;
}

function renderIndicatorLevelSections(items) {
  return `
    <div class="indicator-levels">
      ${indicatorLevels
        .map((level) => {
          const levelItems = items.filter((item) => item.difficulty === level.value);
          if (!levelItems.length) return "";
          return `
            <section class="indicator-level-section">
              <div class="section-head">
                <div>
                  <span class="lesson-label">${escapeHtml(level.label)}</span>
                  <h2>${escapeHtml(level.title)}</h2>
                </div>
                <span class="chip active">${levelItems.length} 個指標</span>
              </div>
              <div class="card-grid">${levelItems.map(indicatorCard).join("")}</div>
            </section>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderIndicatorLibraryDecisionGuide() {
  const rows = [
    ["第一個問題", "現在是趨勢、震盪、突破、回調，還是高波動恐慌？", "先決定市況，再決定指標。"],
    ["第二個問題", "我缺的是方向、力度、成交量、波動，還是風險距離？", "每類只選一個主工具，避免重複計票。"],
    ["第三個問題", "如果訊號錯了，哪個價位或條件會否定它？", "沒有失效條件的指標，不應用來入場。"],
    ["第四個問題", "這個工具在當前週期是否太慢或太敏感？", "調參數前先問市場節奏，不要只追求貼價。"],
  ];
  return `
    <section class="content-grid">
      <article class="review-panel">
        <span class="lesson-label">選指標流程</span>
        <h2>不要由指標開始，要由交易問題開始</h2>
        <table class="comparison-table">
          <tbody>
            ${rows
              .map(
                ([step, question, action]) => `
                  <tr>
                    <th>${escapeHtml(step)}</th>
                    <td><strong>${escapeHtml(question)}</strong><span>${escapeHtml(action)}</span></td>
                  </tr>
                `,
              )
              .join("")}
          </tbody>
        </table>
      </article>
      <aside class="stack">
        <article class="danger-card">
          <span class="lesson-label">資料庫使用提醒</span>
          <h2>最常見的三種錯用</h2>
          <ul class="plain-list">
            <li>看到 82 個指標就想全部學，反而沒有一套穩定流程。</li>
            <li>用多個動能指標互相確認，其實只是同一類資料重複投票。</li>
            <li>只收藏入場工具，沒有收藏風險、波動和市場背景工具。</li>
          </ul>
        </article>
      </aside>
    </section>
  `;
}

function renderIndicatorLibraryStarter() {
  const route = [
    {
      step: "01",
      title: "先看位置",
      slug: "support-resistance",
      body: "支撐、阻力、中段，先分清。",
    },
    {
      step: "02",
      title: "再看成交量",
      slug: "volume",
      body: "突破是否有市場認同。",
    },
    {
      step: "03",
      title: "定義趨勢",
      slug: "ema",
      body: "先定方向，再談入場。",
    },
    {
      step: "04",
      title: "檢查動能",
      slug: "rsi",
      body: "看力度，不是直接買賣。",
    },
  ];

  return `
    <section class="page-band">
      <div class="section-head">
        <div>
          <span class="lesson-label">建議起點</span>
          <h2>新手只走四步</h2>
        </div>
      </div>
      ${compactStepList(route.map((item) => {
        const indicator = getIndicator(item.slug);
        return {
          step: item.step,
          title: item.title,
          body: item.body,
          href: indicator ? indicatorUrl(indicator.slug) : "#/indicators",
          action: indicator ? `學 ${indicator.abbr}` : "打開",
        };
      }))}
    </section>
  `;
}

function renderIndicators() {
  const { params } = parseRoute();
  const query = params.get("q") || "";
  const category = params.get("category") || "";
  const use = params.get("use") || "";
  const difficulty = params.get("difficulty") || "";
  const coreOnly = params.get("core") === "1";
  const results = searchIndicators(query, category, use, difficulty).filter(
    (item) => !coreOnly || item.core,
  );
  const coverage = coverageSummary();
  const hasActiveFilter = Boolean(query || category || use || difficulty || coreOnly);
  const resultContent = results.length
    ? renderIndicatorLevelSections(results)
    : `<div class="empty-state"><h2>找不到符合條件的指標</h2><p>可嘗試搜尋英文縮寫，例如 MACD、RSI、ATR；或先想清楚要觀察價格方向、升跌是否偏急、成交量是否配合，還是風險距離。</p></div>`;

  app.innerHTML = `
    <section class="page-band">
      <div class="visual-copy">
        <div class="page-title">
          <span class="eyebrow">技術指標庫</span>
          <h1>先說清楚問題，再找指標</h1>
          <p>指標不是答案庫。先決定你想觀察價格方向、升跌是否偏急、成交量是否配合，還是波幅和風險，才容易選到合適工具。</p>
        </div>
        <div class="toolbar" data-filter-toolbar>
          <input class="field" type="search" data-filter="q" value="${escapeHtml(query)}" placeholder="搜尋 RSI、成交量、突破..." />
          <select class="select" data-filter="category">
            <option value="">所有類別</option>
            ${categories()
              .map(
                (item) =>
                  `<option value="${escapeHtml(item)}" ${item === category ? "selected" : ""}>${escapeHtml(item)}</option>`,
              )
              .join("")}
          </select>
          <select class="select" data-filter="use">
            <option value="">你現在想先觀察甚麼？</option>
            ${useTags()
              .map(
                (item) =>
                  `<option value="${escapeHtml(item)}" ${item === use ? "selected" : ""}>${escapeHtml(item)}</option>`,
              )
              .join("")}
          </select>
          <select class="select" data-filter="difficulty">
            <option value="">所有程度</option>
            ${indicatorLevels
              .map(
                (item) =>
                  `<option value="${escapeHtml(item.value)}" ${item.value === difficulty ? "selected" : ""}>${escapeHtml(item.label)}</option>`,
              )
              .join("")}
          </select>
        </div>
        <div class="chip-row">
          <button class="chip ${coreOnly ? "active" : ""}" data-action="toggle-core">${coreOnly ? "顯示全部" : "只看核心"}</button>
          <a class="chip" href="#/indicators">清除篩選</a>
          <span class="chip active">${results.length} 個結果</span>
        </div>
      </div>
    </section>

    ${renderSiteDataStatusPanel()}

    ${renderLessonFold(
      "怎樣選指標",
      "查看選擇方法、不同市況和資料說明",
      "先按問題選工具；想了解原理和資料範圍時再打開。",
      `
        ${renderIndicatorLibraryDecisionGuide()}
        ${renderMarketRegimeGuide()}
        ${renderResearchEvidencePanel("指標庫整理標準")}
      `,
    )}
    ${
      hasActiveFilter
        ? resultContent
        : renderLessonFold(
            "查看全部指標",
            `查看 ${results.length} 個技術指標的用途與限制`,
            "先從自己要回答的問題開始；需要時再瀏覽完整清單。",
            resultContent,
          )
    }
  `;
}

function renderIndicatorDetail(slug) {
  const item = getIndicator(slug);
  if (!item) {
    app.innerHTML = `
      <section class="empty-state">
        <h1>找不到這個指標</h1>
        <p>可能是網址拼寫不同，回到全部指標再搜尋一次。</p>
        <a class="button" href="#/indicators">返回全部指標</a>
      </section>
    `;
    return;
  }

  const related = item.related.map(getIndicator).filter(Boolean);
  const lesson = lessonFor(item, related);
  const detailMissions = practiceMissionsFor(item);
  const chartContext = teachingChartContext(item);
  app.innerHTML = `
    <section class="page-band detail-header">
      <div class="breadcrumbs">
        <a href="#/">首頁</a><span>/</span><a href="#/indicators">全部指標</a><span>/</span><span>${escapeHtml(item.name)}</span>
      </div>
      <div class="card-top">
        <div class="page-title">
          <span class="eyebrow">${escapeHtml(item.category)} · ${escapeHtml(difficultyLabel(item.difficulty))}</span>
          <h1>${escapeHtml(item.name)}</h1>
          <p>${escapeHtml(item.en)} · ${escapeHtml(item.abbr)}</p>
        </div>
        <button class="button warning" data-action="favorite" data-slug="${item.slug}">${isFavorite(item.slug) ? "已收藏" : "收藏"}</button>
      </div>
      ${pageVisual("detail", `${item.name} 技術指標教學工作桌面`)}
      <div class="badge-row">
        ${item.uses.map((use) => badge(use, "blue")).join("")}
      </div>
    </section>

    ${renderIndicatorEssencePanel(item, lesson)}
    ${renderBeginnerExplainer(item)}

    ${renderLessonFold(
      "完整教學",
      "展開案例、圖表、公式與進階內容",
      "先讀上面的精要和新手段落；需要細讀時再展開完整資料。",
      `
    <section class="content-grid">
      <div class="stack">
        <article class="info-card" data-section="case">
          <span class="lesson-label">案例研讀</span>
          <h2>案例</h2>
          <h3>${escapeHtml(lesson.caseTitle)}</h3>
          <p>${escapeHtml(lesson.caseText)}</p>
        </article>

        ${renderIndicatorMasterMap(item, lesson)}
        ${renderIndicatorAuthorityPanel(item, lesson)}
        ${renderMasterOperatorPanel(lesson)}

        ${renderLessonFold(
          "原理公式",
          "展開原理與公式",
          `${item.abbr} 的定義、常用參數和計算方式。`,
          `
            <article class="info-card">
              <span class="lesson-label">講解</span>
              <h2>講解</h2>
              <ul class="plain-list">${listItems(lesson.explanation)}</ul>
            </article>
            <article class="info-card">
              <span class="lesson-label">公式</span>
              <h2>計算方法</h2>
              ${renderIndicatorFormula(item)}
              <ul class="plain-list">${listItems(lesson.calculation)}</ul>
            </article>
          `,
        )}

        <article class="info-card">
          <span class="lesson-label">圖表示範</span>
          <h2>圖表示範</h2>
          <div class="chart-shell">
            <div class="chart-title">
              <span>${escapeHtml(chartContext.title)}</span>
              <small>${escapeHtml(chartContext.subtitle)}</small>
            </div>
            <div class="chart-canvas">${renderTeachingChart(item)}</div>
          </div>
          ${
            chartContext.kind === "price"
              ? `${renderMarketCaseFacts(chartContext.caseName, 58)}
                <div class="notice small">
                  圖表案例：${escapeHtml(chartContext.profile.symbol)} ${escapeHtml(chartContext.profile.name)}｜${escapeHtml(chartContext.profile.period)}｜${escapeHtml(chartContext.profile.label)}。資料來源：${escapeHtml(chartContext.profile.source)}；<span class="no-break">只作教育示範</span>。
                </div>`
              : `<div class="notice small">${escapeHtml(chartContext.subtitle)}。本頁保留資料要求，避免用不相符的價格圖造成錯覺。</div>`
          }
        </article>

        <article class="info-card">
          <span class="lesson-label">使用方法</span>
          <h2>使用方法</h2>
          <ul class="plain-list">${listItems(lesson.usage)}</ul>
        </article>

        ${renderTradeDecisionCard(item, lesson)}

        <div class="two-col" data-section="mistakes">
          <article class="info-card">
            <span class="lesson-label">新手錯誤</span>
            <h2>新手常見錯誤</h2>
            <ul class="plain-list">${listItems(lesson.mistakes)}</ul>
          </article>
          <article class="info-card">
            <span class="lesson-label">失效情境</span>
            <h2>失效情境</h2>
            <ul class="plain-list">${listItems(item.limitations)}</ul>
          </article>
        </div>

        <article class="danger-card">
          <span class="lesson-label">反面教材</span>
          <h2>反面教材</h2>
          <ul class="plain-list">${listItems(lesson.antiLesson)}</ul>
        </article>

        ${renderLessonFold(
          "進階用法",
          "展開進階用法",
          lesson.advanced[0],
          `<article class="info-card"><ul class="plain-list">${listItems(lesson.advanced)}</ul></article>`,
          "advanced",
        )}

        ${renderLessonFold(
          "深層練習",
          "展開深層練習",
          "分析框架、執行細節、參數校準和復盤作業集中放在這裡。",
          renderDeepDiveTeaching(lesson),
          "deep",
        )}

        ${renderLessonFold(
          "市況脈絡",
          "展開市況、概念圖與課堂檢核",
          `${item.abbr} 適合回答「${item.uses.join("、")}」；先判斷市況，再看訊號。`,
          `
            <article class="info-card">
              <span class="lesson-label">市況適配</span>
              <h2>適用市況與搭配</h2>
              <ul class="plain-list">${listItems(lesson.marketFit)}</ul>
            </article>
            <article class="info-card">
              <span class="lesson-label">視覺模型</span>
              <h2>概念圖</h2>
              <div class="mini-chart">${renderConceptChart(item)}</div>
            </article>
            <article class="info-card">
              <span class="lesson-label">學習檢查</span>
              <h2>課堂檢核</h2>
              <ul class="plain-list">${listItems(lesson.checklist)}</ul>
            </article>
          `,
        )}

        <article class="review-panel" data-section="review">
          <span class="lesson-label">總結檢查</span>
          <h2>最後檢查</h2>
          <ul class="plain-list">${listItems([lesson.review[0], `結論：${item.abbr} 可建立交易假設，但不能單獨構成買賣建議；真正優勢來自市況、風險和復盤。`])}</ul>
          ${renderLessonFold(
            "完整復盤",
            "展開完整檢查",
            "把完整判讀、限制和教育用途放在這裡。",
            `<ul class="plain-list">${listItems(lesson.review)}</ul>`,
          )}
        </article>

        <article class="info-card faq-list">
          <h2>FAQ</h2>
          ${item.faqs
            .map(
              (faq) => `
                <details>
                  <summary>${escapeHtml(faq.q)}</summary>
                  <p>${escapeHtml(faq.a)}</p>
                </details>
              `,
            )
            .join("")}
        </article>
      </div>

      <aside class="stack">
        <article class="trade-card" data-risk-calculator>
          <span class="lesson-label">風險回報</span>
          <h2>交易計算器</h2>
          <p class="small">輸入入場、止蝕和目標，先確認風險回報是否值得交易。</p>
          <div class="calculator-grid">
            <label>入場價<input class="field" type="number" min="0" step="0.01" data-risk-field="entry" placeholder="100" /></label>
            <label>止蝕價<input class="field" type="number" min="0" step="0.01" data-risk-field="stop" placeholder="96" /></label>
            <label>目標價<input class="field" type="number" min="0" step="0.01" data-risk-field="target" placeholder="108" /></label>
            <label>帳戶金額<input class="field" type="number" min="0" step="100" data-risk-field="account" placeholder="100000" /></label>
            <label>單筆風險 %<input class="field" type="number" min="0" max="10" step="0.1" data-risk-field="riskPct" placeholder="1" /></label>
            <label>來回費用/滑價<input class="field" type="number" min="0" step="0.01" data-risk-field="cost" placeholder="0" /></label>
          </div>
          <div class="result-panel" data-risk-result>輸入數字後會顯示 R 值、勝率門檻和建議最大股數。</div>
        </article>
        ${renderLessonFold(
          "交易前檢查",
          "展開交易前檢查卡",
          "交易前再逐項勾選。",
          preTradeChecklist(item),
        )}
        ${indicatorNoteCard(item)}
        <article class="info-card">
          <h2>快速資料</h2>
          <ul class="fact-list">
            <li><span>分類</span><strong>${escapeHtml(item.category)}</strong></li>
            <li><span>用途</span><strong>${item.uses.map(escapeHtml).join("、")}</strong></li>
            <li><span>難度</span><strong>${escapeHtml(difficultyLabel(item.difficulty))}</strong></li>
            <li><span>常用參數</span><strong>${escapeHtml(item.params)}</strong></li>
            <li><span>權威專家</span><strong>${escapeHtml(authorityForIndicator(item).winner)}</strong></li>
          </ul>
        </article>
        <article class="notice">
          <strong>風險提示</strong>
          <p class="small">技術指標只描述歷史資料，不保證未來走勢；本頁只作教育用途。</p>
        </article>
        <article class="info-card">
          <h2>相關指標</h2>
          <div class="chip-row">
            ${related
              .map(
                (relatedItem) =>
                  `<a class="chip" href="${indicatorUrl(relatedItem.slug)}">${escapeHtml(relatedItem.abbr)} · ${escapeHtml(relatedItem.name)}</a>`,
              )
              .join("")}
          </div>
        </article>
        <article class="info-card">
          <h2>下一步</h2>
          <div class="card-actions">
            <a class="button" href="#/playground">到練習場</a>
            <a class="button secondary" href="#/compare">看固定比較</a>
            <a class="button secondary" href="#/journal">寫交易日誌</a>
            <a class="button secondary" href="#/combo">檢查指標組合</a>
          </div>
        </article>
      </aside>
    </section>
    <section>
      <div class="section-head">
        <div>
          <h2>實戰練習任務</h2>
          <p>先做兩個核心任務：一個練市況，一個練復盤。需要更多訓練時再展開。</p>
        </div>
      </div>
      ${renderPracticeMissions(2, 0, detailMissions)}
      ${renderLessonFold(
        "延伸練習",
        "展開全部練習任務",
        "保留完整訓練清單，但不讓它一開始佔滿頁面。",
        renderPracticeMissions(detailMissions.length - 2, 2, detailMissions),
      )}
    </section>
      `,
    )}
  `;
}

function compactListItems(items, limit = 2, max = 46) {
  return items
    .slice(0, limit)
    .map((text) => `<li>${escapeHtml(shortText(stripStepLabel(text), max))}</li>`)
    .join("");
}

function renderIndicatorQuickRead(item, lesson) {
  const plain = beginnerPlainLanguageFor(item);
  const operator = lesson.masterOperator;
  const cancel = decisionText(operator, "取消/降級") || plain.avoid;
  return `
    <section class="page-band indicator-brief" data-section="essence">
      ${compactStepList([
        { step: "1", title: "用途", body: plain.plain, max: 34 },
        { step: "2", title: "先看", body: operator.coreQuestion || plain.look, max: 34 },
        { step: "3", title: "避開", body: cancel, max: 34 },
      ])}
      <div class="card-actions">
        <a class="button" href="#/playground">做練習</a>
        <a class="button secondary" href="#/glossary">查術語</a>
      </div>
    </section>
  `;
}

function renderIndicatorVisualGuide(item, lesson) {
  const plain = beginnerPlainLanguageFor(item);
  const operator = lesson.masterOperator;
  const chartContext = teachingChartContext(item);
  const signal = item.signals?.[0] || lesson.usage?.[0] || item.summary;
  const cancel = decisionText(operator, "取消/降級") || plain.avoid || lesson.mistakes?.[0];
  return `
    <section class="page-band chart-guide" data-section="chart">
      <div class="chart-guide-head">
        <span class="lesson-label">圖表判讀</span>
        <h2>先看圖，再讀補充</h2>
        <p class="small">${escapeHtml(shortText(plain.simple || item.summary, 58))}</p>
      </div>
      <div class="chart-guide-grid">
        <div class="chart-shell">
          <div class="chart-title">
            <span>${escapeHtml(chartContext.title)}</span>
            <small>${escapeHtml(chartContext.subtitle)}</small>
          </div>
          <div class="chart-canvas">${renderTeachingChart(item)}</div>
        </div>
        <div class="chart-guide-copy">
          ${compactStepList([
            { step: "1", title: "先看位置", body: operator.coreQuestion || plain.look, max: 58 },
            { step: "2", title: "再看訊號", body: signal, max: 58 },
            { step: "3", title: "最後問風險", body: cancel, max: 58 },
          ])}
          <p class="chart-source">
            ${
              chartContext.kind === "price"
                ? `${escapeHtml(chartContext.profile.symbol)} ${escapeHtml(chartContext.profile.name)}｜${escapeHtml(chartContext.profile.period)}｜<span class="no-break">只作教育示範</span>`
                : "資料未齊前，只顯示計算所需資料，不以不相符價格圖替代。"
            }
          </p>
        </div>
      </div>
    </section>
  `;
}

function renderIndicatorCompactLesson(item, lesson, related) {
  return `
    <section class="content-grid indicator-compact-lesson">
      <article class="review-panel">
        <span class="lesson-label">判讀次序</span>
        <h2>先用 ${escapeHtml(item.abbr)} 回答一個問題</h2>
        <p class="small">${escapeHtml(item.name)} 用來補充價格判讀，不是見到某個數字便買入或賣出的指令。先看價格結構，再看這個指標是否提供額外證據。</p>
        <ol class="plain-list">
          <li><strong>觀察：</strong>先說清楚價格在趨勢、區間還是高波動環境。</li>
          <li><strong>條件：</strong>只在 ${escapeHtml(item.uses.join("、"))} 與價格位置互相配合時，才把它當作參考。</li>
          <li><strong>容易誤判：</strong>橫行市、突發消息或流動性不足時，訊號可能反覆出現。</li>
          <li><strong>下一步：</strong>等收市確認，先定交易假設不成立的條件，再計算風險回報。</li>
        </ol>
      </article>
      <article class="info-card">
        <span class="lesson-label">公式</span>
        <h2>公式與參數</h2>
        ${renderIndicatorFormula(item)}
        <ul class="fact-list">
          <li><span>常用參數</span><strong>${escapeHtml(item.params)}</strong></li>
          <li><span>用途</span><strong>${escapeHtml(item.uses.join("、"))}</strong></li>
        </ul>
      </article>
      <article class="info-card">
        <span class="lesson-label">用法</span>
        <h2>只記兩點</h2>
        <ul class="plain-list">${compactListItems(lesson.usage, 2, 50)}</ul>
      </article>
      <article class="danger-card">
        <span class="lesson-label">錯誤</span>
        <h2>最常見錯誤</h2>
        <ul class="plain-list">${compactListItems([...lesson.mistakes, ...item.limitations], 3, 48)}</ul>
      </article>
      <article class="info-card">
        <span class="lesson-label">下一步</span>
        <h2>相關指標</h2>
        <div class="chip-row">
          ${related
            .slice(0, 4)
            .map(
              (relatedItem) =>
                `<a class="chip" href="${indicatorUrl(relatedItem.slug)}">${escapeHtml(relatedItem.abbr)} · ${escapeHtml(relatedItem.name)}</a>`,
            )
            .join("")}
        </div>
      </article>
    </section>
  `;
}

function renderAdvancedCaseChart(item, market = marketSeriesForCase(marketCaseForIndicator(item), 76)) {
  const caseName = marketCaseForIndicator(item);
  const period = item.category === "動能" ? 14 : 20;
  const series = market.series;
  const profile = marketCaseDisplay(caseName, market);
  return renderPriceChart({
    series,
    period,
    showMa: true,
    showBands: item.category === "波動率" || item.slug === "bollinger-bands",
    showRsi: item.category === "動能" || item.slug === "rsi",
    showVolume: true,
    annotations: tradeAnnotationsForSeries(series, caseName),
    highlight: `${item.abbr} 進階案例`,
    meta: `${profile.symbol} ${profile.name}｜${profile.period}｜${profile.label}`,
    priceMode: "candles",
  });
}

function renderIndicatorAdvancedLesson(item, lesson) {
  const caseName = marketCaseForIndicator(item);
  const market = marketSeriesForCase(caseName, 76);
  const profile = marketCaseDisplay(caseName, market);
  const hasRealData = !market.isSynthetic;
  return `
    <section class="advanced-lesson">
      <article class="info-card advanced-case-card">
        <span class="lesson-label">${hasRealData ? "真實案例" : "教學序列"}</span>
        <h2>${hasRealData ? "用真實數據看" : "用教學序列練習"} ${escapeHtml(item.abbr)}</h2>
        <p class="small">
          ${escapeHtml(profile.symbol)} ${escapeHtml(profile.name)}｜${escapeHtml(profile.period)}｜${escapeHtml(profile.label)}
        </p>
        <div class="chart-shell">
          <div class="chart-title">
            <span>${escapeHtml(item.abbr)} 進階案例圖表</span>
            <small>${marketDataStatusLabel(market)}</small>
          </div>
          <div class="chart-canvas">${renderAdvancedCaseChart(item, market)}</div>
        </div>
        ${renderMarketCaseFacts(caseName, 76)}
        <div class="notice small">
          資料來源：${escapeHtml(profile.source)}；圖中入場、止蝕和目標只作教學標註，不是買賣建議。
        </div>
      </article>
      <article class="info-card">
        <span class="lesson-label">進階前提</span>
        <h2>先把這三點想清楚</h2>
        <ul class="plain-list">${listItems(lesson.advanced)}</ul>
      </article>
      ${renderDeepDiveTeaching(lesson)}
    </section>
  `;
}

function renderIndicatorDetailCompact(slug) {
  const item = getIndicator(slug);
  if (!item) {
    app.innerHTML = `
      <section class="empty-state">
        <h1>找不到這個指標</h1>
        <p>回到指標庫再搜尋一次。</p>
        <a class="button" href="#/indicators">返回指標庫</a>
      </section>
    `;
    return;
  }

  const related = item.related.map(getIndicator).filter(Boolean);
  const lesson = lessonFor(item, related);
  app.innerHTML = `
    <section class="page-band detail-header indicator-detail-compact">
      <div class="card-top">
        <div class="page-title">
          <span class="eyebrow">${escapeHtml(item.category)} · ${escapeHtml(difficultyLabel(item.difficulty))}</span>
          <h1>${escapeHtml(item.name)}</h1>
          <p>${escapeHtml(item.abbr)} · ${escapeHtml(shortText(item.en, 36))}</p>
        </div>
        <button class="button warning" data-action="favorite" data-slug="${item.slug}">${isFavorite(item.slug) ? "已收藏" : "收藏"}</button>
      </div>
    </section>

    ${renderIndicatorVisualGuide(item, lesson)}
    ${renderIndicatorResearchStatusCard(item)}

    ${renderLessonFold(
      "補充資料",
      "公式、用法、錯誤和相關指標",
      "需要查定義時再展開。",
      renderIndicatorCompactLesson(item, lesson, related),
    )}

    ${renderLessonFold(
      "進階用法",
      `${item.abbr} 進階用法`,
      "真實案例、數據圖表、執行和復盤方法。",
      renderIndicatorAdvancedLesson(item, lesson),
      "advanced",
    )}
  `;
}

function renderComparisonDecisionMatrix() {
  const rows = [
    ["方向", "SMA / EMA", "先看大方向。"],
    ["力度", "RSI / MACD", "確認動能。"],
    ["成交量", "Volume / OBV", "檢查真假突破。"],
    ["風險", "ATR / Bollinger", "估算止蝕距離。"],
  ];
  return `
    <section class="page-band">
      <article class="review-panel">
        <span class="lesson-label">決策矩陣</span>
        <h2>先問缺哪類證據</h2>
        <table class="score-table">
          <tbody>
            ${rows
              .map(
                ([question, tools, check]) => `
                  <tr>
                    <th>${escapeHtml(question)}</th>
                    <td><strong>${escapeHtml(tools)}</strong><span>${escapeHtml(check)}</span></td>
                  </tr>
                `,
              )
              .join("")}
          </tbody>
        </table>
      </article>
    </section>
  `;
}

function renderCaseStudyChart(study) {
  const period = study.chartCase === "liquidity-shock" ? 14 : 20;
  const market = marketSeriesForCase(study.chartCase, 64);
  const series = market.series;
  const profile = marketCaseDisplay(study.chartCase, market);
  return renderPriceChart({
    series,
    period,
    showMa: true,
    showBands: study.regime.includes("波動") || study.regime.includes("恐慌"),
    showRsi: true,
    showVolume: true,
    annotations: tradeAnnotationsForSeries(series, study.chartCase),
    meta: `${profile.symbol} ${profile.name}｜${profile.period}｜${profile.label}`,
  });
}

function marketDataStatusLabel(market) {
  return market.isSynthetic ? "教學用生成序列 · 非市場快照" : "真實歷史資料 · 本地快照";
}

function renderCaseQuiz(study) {
  return `
    <article class="info-card quiz-card" data-quiz-case="${escapeHtml(study.slug)}">
      <span class="lesson-label">案例小測</span>
      <h3>${escapeHtml(study.title)}：判斷題</h3>
      <p class="small">${escapeHtml(study.quiz.question)}</p>
      <div class="quiz-options">
        ${study.quiz.answers
          .map(
            ([value, label]) =>
              `<button class="quiz-option" type="button" data-action="quiz-answer" data-answer="${escapeHtml(value)}" data-correct="${escapeHtml(study.quiz.correct)}" data-explain="${escapeHtml(study.quiz.explain)}">${escapeHtml(label)}</button>`,
          )
          .join("")}
      </div>
      <div class="result-panel" data-quiz-result>先選答案，再看自己是否抓到這個市況的核心風險。</div>
    </article>
  `;
}

function caseTransferRule(study) {
  const rules = {
    "liquidity-shock": "恐慌市中，超賣只代表拋售極端，不代表見底；未見波動收斂和結構收復前，只降倉不加倉。",
    "growth-downtrend": "下降趨勢中，弱勢可以長期超賣；未重新站上主要結構前，反彈只當短線，不當轉勢。",
    "ai-trend": "強趨勢中，超買可以是強勢鈍化；真正要降級的是跌破上升結構，而不是 RSI 單次高於 70。",
    "hk-gap-news": "消息裂口不是方向，收盤是否接受新價格才是證據；高開低收或低開高收都要重新評估劇本。",
  };
  return rules[study.slug] || "案例只抽取可重複流程，不把某一年、某一隻股票的結果當成保證。";
}

function caseShortTitle(study) {
  const titles = {
    "liquidity-shock": "恐慌急跌",
    "growth-downtrend": "弱勢下跌",
    "ai-trend": "主升趨勢",
    "hk-gap-news": "消息裂口",
  };
  return titles[study.slug] || shortText(study.title, 16);
}

function renderCasebook() {
  app.innerHTML = `
    <section class="page-band visual-band">
      <div class="visual-copy">
        <div class="page-title">
          <span class="eyebrow">案例庫</span>
          <h1>用歷史情境練習判讀</h1>
          <p>每個案例只展示一段過去的市場結構，不能證明同一訊號在其他股票、週期或市況同樣有效。重點是分開已知資料、事後結果和不成立的條件。</p>
        </div>
        <div class="card-actions">
          <a class="button" href="#/playground">用另一張圖再練習</a>
          <a class="button secondary" href="#/journal">把觀察記入交易日誌</a>
        </div>
      </div>
      ${pageVisual("casebook", "技術分析案例研究桌面、歷史走勢、筆記和風險標籤")}
    </section>

    <section class="page-band">
      <div class="section-head">
        <div>
          <h2>先認清四種常見市況</h2>
        </div>
      </div>
      ${compactStepList(historicalCaseStudies.map((study, index) => ({
        step: String(index + 1),
        title: caseShortTitle(study),
        body: caseTransferRule(study),
        max: 34,
        href: "#/playground",
        action: "去練習",
      })))}
    </section>

    ${renderLessonFold(
      "查看案例、圖表與交易檢討問題",
      "查看資料來源、判讀步驟和交易檢討問題",
      "案例用來練習判讀，不用來推斷未來交易表現。",
      `
    ${renderCasebookReviewFramework()}
    ${renderProfessorOutputGuide(
      "案例檢核準則",
      "看完案例後，要說清楚甚麼可比較，甚麼不可直接套用",
      [
        ["相同結構", "不要記住某一年或某一隻股票，要寫出當前市況是否有相同結構。"],
        ["可比較的條件", "只把價格位置、波動、成交量和市況結構拿來比較；不要把一段歷史結果當成固定規則。"],
        ["假設不成立", "案例不是保證，必須寫出哪個價位或條件出現後，原有看法不再適用。"],
      ],
      "案例庫的用途是訓練判讀和交易檢討，不是提供可以照抄的歷史答案。",
    )}

    <section class="case-study-grid">
      ${historicalCaseStudies
        .map(
          (study) => `
            <article class="info-card case-study-card">
              <div class="card-top">
                <div>
                  <span class="lesson-label">${escapeHtml(study.regime)}</span>
                  <h2>${escapeHtml(study.title)}</h2>
                </div>
                <span class="chip active">${escapeHtml(study.period)}</span>
              </div>
              <p class="small">${escapeHtml(study.market)}</p>
              <div class="chart-shell">
                <div class="chart-title">
                  <span>${escapeHtml(study.regime)} 教學重建圖</span>
                  <small>${marketDataStatusLabel(marketSeriesForCase(study.chartCase, 64))}</small>
                </div>
                <div class="chart-canvas">${renderCaseStudyChart(study)}</div>
              </div>
              ${renderMarketCaseFacts(study.chartCase, 64)}
              <div class="two-col compact-grid">
                <div class="trade-card">
                  <span class="lesson-label">交易教訓</span>
                  <p class="small">${escapeHtml(study.lesson)}</p>
                </div>
                <div class="danger-card">
                  <span class="lesson-label">反面教材</span>
                  <p class="small">${escapeHtml(study.mistake)}</p>
                </div>
              </div>
              <ul class="plain-list">
                <li><strong>交易計劃示範：</strong>${escapeHtml(study.trade)}</li>
                <li><strong>適合工具：</strong>${study.tools.map(escapeHtml).join("、")}</li>
              </ul>
              <div class="result-panel result-good">
                <strong>可比較的市場結構</strong>
                <span>${escapeHtml(caseTransferRule(study))}</span>
              </div>
              ${renderCaseQuiz(study)}
            </article>
          `,
        )
        .join("")}
    </section>

    <section class="content-grid">
      ${renderQualityChecklist("案例轉實戰前 5 問")}
      <article class="review-panel">
        <span class="lesson-label">案例筆記</span>
        <h2>如何把案例變成自己的交易檢討</h2>
        <ul class="plain-list">
          <li>不要問「今次會不會一樣」；要問「目前市況是否真的具備相近結構」。</li>
          <li>案例只提供分析框架，不提供保證。交易前仍要檢查成本、流動性、持倉規模和風險回報。</li>
          <li>每次看完案例，都要寫出交易假設不成立的價位或條件；寫不出來，代表計劃仍未完整。</li>
        </ul>
      </article>
    </section>
      `,
    )}
  `;
}

function comparePairSummary(pair) {
  const left = getIndicator(pair.left);
  const right = getIndicator(pair.right);
  if (!left || !right) {
    return {
      tone: "result-bad",
      title: "比較資料不完整",
      lines: ["請改選另一組比較。"],
    };
  }
  const sameCategory = left.category === right.category;
  const overlapUses = left.uses.filter((use) => right.uses.includes(use));
  const lines = [
    `${left.abbr} 主要回答：${left.uses.join("、")}。`,
    `${right.abbr} 主要回答：${right.uses.join("、")}。`,
    `較適合：${pair.bestFor}`,
    `注意：${pair.caution}`,
  ];
  if (sameCategory || overlapUses.length) {
    lines.push(`重複計票提醒：兩者${sameCategory ? `同屬${left.category}` : `共同用途為${overlapUses.join("、")}`}，不要當成兩個獨立買入理由。`);
  } else {
    lines.push("分工較清楚，可一個作主訊號，另一個作確認。");
  }
  return {
    tone: sameCategory || overlapUses.length > 1 ? "result-warn" : "result-good",
    title: `${left.abbr} vs ${right.abbr}：${sameCategory ? "相近工具，要小心重複" : "可作分工比較"}`,
    lines,
  };
}

function renderCompareLab() {
  const defaultPair = comparisons[0];
  const summary = comparePairSummary(defaultPair);
  return `
    <section class="content-grid">
      <article class="trade-card" data-compare-lab>
        <span class="lesson-label">互動比較</span>
        <h2>互動比較選擇器</h2>
        <p class="small">選一組，看是否重複。</p>
        <label class="single-field">比較組合
          <select class="select" data-compare-pair>
            ${comparisons
              .map(
                (pair, index) =>
                  `<option value="${index}" ${index === 0 ? "selected" : ""}>${escapeHtml(pair.title)}</option>`,
              )
              .join("")}
          </select>
        </label>
        <div class="result-panel ${summary.tone}" data-compare-result>
          <strong>${escapeHtml(summary.title)}</strong>
          ${summary.lines.map((line) => `<span>${escapeHtml(shortText(line, 46))}</span>`).join("")}
        </div>
      </article>
    </section>
  `;
}

function renderComparisonOutputGuide() {
  const rows = [
    ["互補", "兩個指標回答不同問題，例如趨勢配成交量、動能配波幅。", "可以保留，但要指定誰是主訊號，誰只負責確認。"],
    ["重複", "兩個指標來自相近計算，例如 RSI、KD、Stoch RSI 同時出現。", "只保留最熟悉的一個，把另一個位置留給風險或成交量。"],
    ["衝突", "趨勢指標看多，但動能背離或成交量不支持。", "不要急著交易，先等價格結構或成交量給出下一步。"],
    ["缺口", "有方向和入場，但沒有止蝕、波幅或倉位工具。", "補 ATR、結構止蝕或 R 值計算，再談入場。"],
  ];
  return `
    <section class="page-band">
      <div class="section-head">
        <div>
          <h2>比較結果怎樣解讀</h2>
          <p>比較頁的輸出不是排名，而是判斷兩個工具應該互補、刪減、暫停使用，還是補上風險工具。</p>
        </div>
      </div>
      <table class="comparison-table">
        <tbody>
          ${rows
            .map(
              ([result, meaning, action]) => `
                <tr>
                  <th>${escapeHtml(result)}</th>
                  <td><strong>${escapeHtml(meaning)}</strong><span>${escapeHtml(action)}</span></td>
                </tr>
              `,
            )
            .join("")}
        </tbody>
      </table>
    </section>
  `;
}

function renderCompare() {
  app.innerHTML = `
    <section class="page-band visual-band">
      <div class="visual-copy">
        <div class="page-title">
          <span class="eyebrow">指標比較</span>
          <h1>刪掉重複訊號</h1>
          <p>比較不是鬥高低，而是分清每個指標負責回答甚麼問題。</p>
        </div>
        <div class="card-actions">
          <a class="button" href="#/combo">打開指標組合檢查器</a>
        </div>
      </div>
      ${pageVisual("compare", "兩份股票指標比較報告和顏色標籤的研究桌面")}
    </section>
    ${renderComparisonDecisionMatrix()}
    ${renderCompareLab()}
    ${renderLessonFold(
      "完整比較",
      "展開所有比較表與專家框架",
      "先用上面的互動選擇器；需要逐組細看時再展開。",
      `
        ${renderComparisonExpertFramework()}
        ${renderComparisonOutputGuide()}
        <section class="stack">
          ${comparisons
            .map((pair) => {
              const left = getIndicator(pair.left);
              const right = getIndicator(pair.right);
              return `
                <article class="comparison-card">
                  <h2>${escapeHtml(pair.title)}</h2>
                  <table class="comparison-table">
                    <thead>
                      <tr>
                        <th>項目</th>
                        <th>${escapeHtml(left.name)}</th>
                        <th>${escapeHtml(right.name)}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td>核心用途</td><td>${left.uses.map(escapeHtml).join("、")}</td><td>${right.uses.map(escapeHtml).join("、")}</td></tr>
                      <tr><td>計算重點</td><td>${escapeHtml(left.formula)}</td><td>${escapeHtml(right.formula)}</td></tr>
                      <tr><td>較適合</td><td colspan="2">${escapeHtml(pair.bestFor)}</td></tr>
                      <tr><td>注意事項</td><td colspan="2">${escapeHtml(pair.caution)}</td></tr>
                      <tr><td>何時不用</td><td colspan="2">如果兩者都在回答同一個問題，只選一個主指標；另一個位置留給價格結構、成交量或風險回報檢查。</td></tr>
                    </tbody>
                  </table>
                  <div class="card-actions">
                    <a class="button secondary" href="${indicatorUrl(left.slug)}">看 ${escapeHtml(left.abbr)}</a>
                    <a class="button secondary" href="${indicatorUrl(right.slug)}">看 ${escapeHtml(right.abbr)}</a>
                  </div>
                </article>
              `;
            })
            .join("")}
        </section>
      `,
    )}
  `;
}

function renderPlayground() {
  const playgroundMarket = marketSeriesForCase(state.playground.caseName, 58);
  app.innerHTML = `
    <section class="page-band visual-band">
      <div class="visual-copy">
        <div class="page-title">
          <span class="eyebrow">交易前練習</span>
          <h1>交易前練習場</h1>
          <p>先讀完一張圖，寫低入場、止蝕和失效，之後先談交易。</p>
        </div>
        <div class="playground-controls">
          <div class="control-box">
            <label for="caseName">示範案例</label>
            <select class="select" id="caseName" data-playground="caseName">
              ${[
                ["uptrend", "趨勢上升"],
                ["range", "區間震盪"],
                ["reversal", "急跌反彈"],
                ["breakout", "壓縮突破"],
              ]
                .map(
                  ([value, label]) =>
                    `<option value="${value}" ${state.playground.caseName === value ? "selected" : ""}>${label}</option>`,
                )
                .join("")}
            </select>
          </div>
          <div class="control-box">
            <label for="period">指標週期：<span id="periodValue">${state.playground.period}</span></label>
            <input id="period" type="range" min="5" max="60" step="1" value="${state.playground.period}" data-playground="period" />
          </div>
          <div class="control-box">
            <label>圖層</label>
            <div class="toggle-grid">
              ${["ma", "bands", "rsi", "volume"]
                .map(
                  (key) => `
                    <label class="toggle-pill">
                      <input type="checkbox" data-playground="${key}" ${state.playground[key] ? "checked" : ""} />
                      ${key === "ma" ? "MA" : key === "bands" ? "BB" : key.toUpperCase()}
                    </label>
                  `,
                )
                .join("")}
            </div>
          </div>
          <div class="control-box">
            <label>提示</label>
            <div class="notice small">先切換市況，再調週期；如果止蝕距離變大，倉位也要跟著縮小。</div>
          </div>
        </div>
      </div>
      ${pageVisual("playground", "可調參數滑桿、透明圖表卡和交易練習畫面")}
    </section>
    <section class="content-grid">
      <article class="info-card">
        <h2>第一步：先看市場結構</h2>
        <div class="chart-shell">
          <div class="chart-title">
            <span>${playgroundMarket.isSynthetic ? "教學序列與指標圖層" : "真實價格折線與指標圖層"}</span>
            <small>${marketDataStatusLabel(playgroundMarket)}</small>
          </div>
          <div class="chart-canvas" id="playgroundChart">${renderPlaygroundChart(playgroundMarket)}</div>
        </div>
        ${renderMarketCaseFacts(state.playground.caseName, 58)}
      </article>
      <aside class="stack">
        <article class="info-card">
          <h2>第二步：寫下你看見甚麼</h2>
          <ul class="plain-list">
            ${playgroundNotes().slice(0, 3).map((note) => `<li>${escapeHtml(shortText(note, 54))}</li>`).join("")}
          </ul>
        </article>
        ${playgroundQuiz()}
        ${renderLessonFold(
          "更多",
          "展開劇本、統計和延伸學習",
          "先完成上面的看圖與小測，再展開。",
          `
            ${quizStatsCard()}
            <article class="trade-card">
              <h2>把看法變成交易劇本</h2>
              <ul class="plain-list">
                <li>先標出入場觸發，不要在訊號未完成前預先下判斷。</li>
                <li>用最近支撐/阻力或 ATR 估算止蝕距離，再反推倉位。</li>
                <li>若第一目標不到 1.5R 至 2R，這筆交易即使方向對也不夠吸引。</li>
              </ul>
            </article>
            <article class="danger-card">
              <h2>練習場反面教材</h2>
              <ul class="plain-list">
                <li>看到 RSI 超賣就買，卻沒有確認價格止跌。</li>
                <li>看到突破就追，卻沒有檢查成交量和上方阻力。</li>
                <li>參數調到剛好配合歷史走勢，實戰時卻完全失效。</li>
              </ul>
            </article>
            <article class="info-card">
              <h2>延伸學習</h2>
              ${compactIndicatorLinks(["sma", "bollinger-bands", "rsi", "volume"])}
            </article>
          `,
        )}
      </aside>
    </section>
    ${renderLessonFold(
      "完整訓練",
      "展開練習流程與任務",
      "保留完整訓練清單，但不預設佔滿頁面。",
      `
        ${renderPlaygroundTrainingProtocol()}
        <section>
          <div class="section-head">
            <div>
              <h2>實戰練習任務</h2>
              <p>每個任務都有合格標準，練完後可以直接把結果寫進交易日誌。</p>
            </div>
          </div>
          ${renderPracticeMissions()}
        </section>
      `,
    )}
  `;
}

function playgroundNotes() {
  const { caseName, period, ma, bands, rsi, volume } = state.playground;
  const notes = [];
  const caseText = {
    uptrend: "趨勢上升案例適合觀察價格沿均線推進，以及 RSI 高位鈍化。",
    range: "區間震盪案例適合觀察布林帶上下軌回歸與假突破。",
    reversal: "急跌反彈案例適合觀察均線延遲與 RSI 從低位修復。",
    breakout: "壓縮突破案例適合觀察波動收縮後擴張。",
  };
  notes.push(caseText[caseName]);
  notes.push(`目前週期為 ${period}，週期越短越敏感，週期越長越平滑。`);
  if (ma) notes.push("MA 開啟時，先觀察斜率，再看價格是否反覆站上或跌破。");
  if (bands) notes.push("布林帶開啟時，留意帶寬變化，碰軌不等於立即反轉。");
  if (rsi) notes.push("RSI 開啟時，留意 30/70 區間與背離，而不是只看單次穿越。");
  if (volume) notes.push("成交量開啟時，觀察突破是否有成交量確認。");
  notes.push("把圖表轉成交易計劃前，必須先寫下入場、止蝕、第一目標和每筆最大虧損。");
  notes.push("若你需要把止蝕移遠才覺得舒服，通常代表入場太急或倉位太大。");
  return notes;
}

function playgroundQuiz() {
  const quizzes = {
    uptrend: {
      question: "趨勢上升時，RSI 長時間偏高，最合理的第一反應是？",
      answers: [
        ["sell", "立即做空，因為 RSI 超買一定會跌。"],
        ["context", "先看趨勢和支撐，RSI 高位可能是強勢鈍化。"],
        ["ignore", "完全不看風險回報，只要順勢就加倉。"],
      ],
      correct: "context",
      explain: "強趨勢中超買可以維持很久，應先確認價格結構和風險回報。"
    },
    range: {
      question: "區間震盪時，價格碰到布林帶上軌，應怎樣處理？",
      answers: [
        ["short", "立刻做空，碰上軌必定回落。"],
        ["confirm", "等價格失去動能或假突破確認，再計算止蝕與目標。"],
        ["breakout", "永遠追買，因為碰上軌代表突破。"],
      ],
      correct: "confirm",
      explain: "碰軌只是位置提示，不是交易指令；要等確認和合格 R 值。"
    },
    reversal: {
      question: "急跌後 RSI 從低位回升，最危險的錯誤是？",
      answers: [
        ["average", "越跌越補，因為 RSI 低代表便宜。"],
        ["wait", "等待價格止跌和小平台突破。"],
        ["size", "先減少倉位，避免波動太大。"],
      ],
      correct: "average",
      explain: "超賣不等於見底，越跌越補會把指標錯用成情緒安慰。"
    },
    breakout: {
      question: "波動壓縮後突破，最應該檢查甚麼？",
      answers: [
        ["volume", "收盤是否確認、成交量是否配合、上方阻力和 R 值是否合格。"],
        ["allin", "突破一出現就重倉追入，避免錯過。"],
        ["parameter", "把參數調到剛好支持突破。"],
      ],
      correct: "volume",
      explain: "突破要看確認、成交量、阻力和風險回報，不是單看一支 K 線。"
    },
  };
  const quiz = quizzes[state.playground.caseName] || quizzes.uptrend;
  return `
    <article class="info-card quiz-card">
      <span class="lesson-label">即時小測</span>
      <h2>有沒有誤讀？</h2>
      <p class="small">${escapeHtml(shortText(quiz.question, 54))}</p>
      <div class="quiz-options">
        ${quiz.answers
          .map(
            ([value, label]) =>
              `<button class="quiz-option" type="button" data-action="quiz-answer" data-answer="${value}" data-correct="${quiz.correct}" data-explain="${escapeHtml(shortText(quiz.explain, 64))}">${escapeHtml(shortText(label, 42))}</button>`,
          )
          .join("")}
      </div>
      <div class="result-panel" data-quiz-result>選一個答案。</div>
    </article>
  `;
}

function quizStatsSummary() {
  const history = quizHistory();
  const correct = history.filter((entry) => entry.correct).length;
  return {
    total: history.length,
    correct,
    accuracy: history.length ? Math.round((correct / history.length) * 100) : 0,
    latest: history[0],
  };
}

function renderQuizStatsContent() {
  const stats = quizStatsSummary();
  return `
    <ul class="fact-list">
      <li><span>答題次數</span><strong>${stats.total}</strong></li>
      <li><span>正確率</span><strong>${stats.total ? `${stats.accuracy}%` : "未開始"}</strong></li>
      <li><span>最近案例</span><strong>${escapeHtml(stats.latest?.caseName || "-")}</strong></li>
    </ul>
  `;
}

function quizStatsCard() {
  return `
    <article class="review-panel" data-quiz-stats>
      <span class="lesson-label">測驗統計</span>
      <h2>測驗成績記錄</h2>
      ${renderQuizStatsContent()}
    </article>
  `;
}

function glossaryMatches(query) {
  const normalized = (query || "").trim().toLowerCase();
  if (!normalized) return glossary;
  return glossary.filter(([term, desc]) =>
    `${term} ${desc}`.toLowerCase().includes(normalized),
  );
}

function renderGlossaryCards(items, includeExamples = false) {
  return items
    .map(
      ([term, desc]) => {
        const example = glossaryExamples[term];
        return `
        <article class="term-card">
          <h2>${escapeHtml(term)}</h2>
          <p>${escapeHtml(desc)}</p>
          ${
            includeExamples && example
              ? `<div class="term-example"><strong>交易例子</strong><span>${escapeHtml(example)}</span></div>`
              : ""
          }
        </article>
      `;
      },
    )
    .join("");
}

function glossaryLookupCard() {
  return `
    <article class="info-card glossary-lookup-card">
      <span class="lesson-label">術語查找</span>
      <h2>術語即時速查</h2>
      <input class="field" type="search" data-glossary-lookup placeholder="搜尋 價格、K 線、R 值..." />
      <div class="glossary-results" data-glossary-results>${renderGlossaryCards(glossary.slice(0, 4))}</div>
      <a class="button secondary" href="#/glossary">打開完整術語表</a>
    </article>
  `;
}

function renderGlossaryLearningGuide() {
  const groups = [
    ["先讀基礎", "價格、開盤、收盤、成交量、K 線", "先把市場正在發生甚麼講清楚。"],
    ["再讀結構", "趨勢、支撐、阻力、突破、回踩", "判斷訊號是否出現在有意義的位置。"],
    ["然後讀訊號", "金叉、死叉、背離、超買、超賣", "訊號只在合適市況中才有價值。"],
    ["最後讀風險", "止蝕、R 值、回撤、滑價、過度擬合", "決定是否值得交易，以及錯了如何退出。"],
  ];
  return `
    <section class="content-grid">
      <article class="review-panel">
        <span class="lesson-label">閱讀次序</span>
        <h2>術語要按交易流程學</h2>
        <div class="timeline-list">
          ${groups
            .map(([title, terms, action]) => `<div><strong>${escapeHtml(title)}</strong><span>${escapeHtml(terms)}。${escapeHtml(action)}</span></div>`)
            .join("")}
        </div>
      </article>
      <aside class="stack">
        <article class="danger-card">
          <span class="lesson-label">術語誤用</span>
          <h2>懂名詞不等於懂交易</h2>
          <ul class="plain-list">
            <li>說得出「背離」，但說不出失效位，仍然不算看懂。</li>
            <li>知道「超買」，但不知道強趨勢會鈍化，就容易過早離場。</li>
            <li>懂「金叉」，但不看阻力和成交量，只是把名詞當答案。</li>
          </ul>
        </article>
      </aside>
    </section>
  `;
}

function renderGlossary() {
  app.innerHTML = `
    <section class="page-band visual-band">
      <div class="visual-copy">
        <div class="page-title">
          <span class="eyebrow">術語表</span>
          <h1>術語表</h1>
          <p>先懂價格、K 線、趨勢和風險；其他名詞用到再查。</p>
        </div>
        <input class="field" type="search" data-glossary-lookup placeholder="搜尋術語，例如 價格、K 線、R 值..." />
      </div>
      ${pageVisual("glossary", "金融術語卡片、索引標籤和清晰圖表註解")}
    </section>
    <section class="page-band">
      <div class="section-head">
        <div>
          <h2>先記住四類詞</h2>
          <p>其他詞用到再查。</p>
        </div>
      </div>
      ${compactStepList([
        { step: "1", title: "價格", body: "先懂開盤、收盤、高低位。", href: "#/glossary", action: "查詞" },
        { step: "2", title: "K 線", body: "看多空攻防，不只背形態。", href: "#/candlesticks", action: "學陰陽燭" },
        { step: "3", title: "趨勢", body: "先分清上升、下降、震盪。", href: "#/indicators/support-resistance", action: "學位置" },
        { step: "4", title: "風險", body: "止蝕、R 值、回撤一定要懂。", href: "#/playground", action: "做練習" },
      ])}
    </section>
    <section class="card-grid" data-glossary-results>
      ${renderGlossaryCards(glossary.slice(0, 4))}
    </section>
    ${renderLessonFold(
      "完整術語",
      "展開完整術語表和使用方法",
      "常用詞先看上面；需要完整術語、學習次序和練習任務再展開。",
      `
        ${renderGlossaryUseGuide()}
        ${renderGlossaryLearningGuide()}
        <section class="card-grid">${renderGlossaryCards(glossary, true)}</section>
        <section class="page-band">
          <div class="section-head">
            <div>
              <h2>術語使用原則</h2>
              <p>術語不是結論，只是把市場現象命名。每個詞都要回到價格位置、確認和風險。</p>
            </div>
          </div>
          ${renderPracticeMissions(2)}
        </section>
      `,
    )}
  `;
}

function tradingViewScorecard() {
  return `
    <article class="trade-card" data-tv-scorecard>
      <span class="lesson-label">回測可信度</span>
      <h2>回測可信度評分器</h2>
      <p class="small">輸入 TradingView 策略測試器（Strategy Tester）的主要數字，檢查資料是否足以支持下一輪研究。這個結果不代表策略適合實際交易。</p>
      <div class="calculator-grid">
        <label>總交易次數<input class="field" type="number" min="0" step="1" data-tv-field="trades" placeholder="120" /></label>
        <label>Profit Factor<input class="field" type="number" min="0" step="0.01" data-tv-field="profitFactor" placeholder="1.45" /></label>
        <label>最大回撤 %<input class="field" type="number" min="0" step="0.1" data-tv-field="drawdown" placeholder="18" /></label>
        <label>勝率 %<input class="field" type="number" min="0" max="100" step="0.1" data-tv-field="winRate" placeholder="48" /></label>
        <label>測試年數<input class="field" type="number" min="0" step="0.5" data-tv-field="years" placeholder="5" /></label>
        <label>參數數量<input class="field" type="number" min="0" step="1" data-tv-field="params" placeholder="4" /></label>
      </div>
      <div class="result-panel" data-tv-score-result>輸入數字後會提示樣本數、回撤、過度擬合和是否值得進一步前向測試。</div>
    </article>
  `;
}

function renderStrategyResearchLab() {
  const stages = [
    ["策略假設", "它賺的是趨勢延續、均值回歸、突破擴張，還是市場寬度改善？如果說不出邏輯，只是曲線擬合。"],
    ["程式檢查", "確認 entry、exit、stop、position size、commission、slippage 都真的寫入策略，不要只寫入場。"],
    ["回測審查", "檢查交易次數、最大回撤、Profit Factor、平均每筆收益和最大連虧，而不是只看淨利。"],
    ["穩健測試", "把資料分成訓練樣本與未參與調校的樣本，並用相近參數測試結果是否仍能接受。"],
    ["實盤演練", "先用模擬交易或極小倉前向測試，記錄滑價、漏單、心理壓力和是否能遵守規則。"],
  ];
  return `
    <article class="review-panel">
      <span class="lesson-label">研究工作台</span>
      <h2>回測不是預測，先檢查策略是否可信</h2>
      <div class="timeline-list">
        ${stages
          .map(
            ([title, body]) =>
              `<div><strong>${escapeHtml(title)}</strong><span>${escapeHtml(body)}</span></div>`,
          )
          .join("")}
      </div>
    </article>
  `;
}

function renderOverfitRedFlags() {
  return `
    <article class="danger-card">
      <span class="lesson-label">過度擬合警號</span>
      <h2>過度擬合 8 個紅旗</h2>
      <ul class="plain-list">
        <li>參數很多，但每個參數都沒有市場邏輯。</li>
        <li>只在某一隻股票、某一年或某一組參數下漂亮。</li>
        <li>交易次數少，卻把結果說成穩定規律。</li>
        <li>沒有手續費、滑價、稅費或成交延遲。</li>
        <li>策略主要盈利來自少數幾筆異常大賺。</li>
        <li>一改參數，Profit Factor 和回撤立刻崩壞。</li>
        <li>未做樣本外測試，所有資料都被拿來調參。</li>
        <li>回測漂亮，但交易劇本說不清何時不應交易。</li>
      </ul>
    </article>
  `;
}

const strategyCaseStudies = [];
function getStrategyCase(slug) {
  return null;
}

function strategyCaseUrl(slug) {
  return `#/strategy-cases/${slug}`;
}

function strategyCaseCard(item) {
  return `
    <article class="info-card route-card compact-indicator-card">
      <span class="lesson-label">${escapeHtml(item.type)}</span>
      <h3>${escapeHtml(item.shortTitle)}</h3>
      <ul class="fact-list">
        <li><span>PF</span><strong>${escapeHtml(item.pf)}</strong></li>
        <li><span>勝率</span><strong>${escapeHtml(item.winRate)}</strong></li>
      </ul>
      <a class="button secondary" href="${strategyCaseUrl(item.slug)}">查看</a>
    </article>
  `;
}

function renderStrategyCaseTable(item) {
  return `
    <table class="comparison-table">
      <tbody>
        <tr><th>策略類型</th><td>${escapeHtml(item.type)}</td></tr>
        <tr><th>主要標的</th><td>${escapeHtml(item.market)}</td></tr>
        <tr><th>時間週期</th><td>${escapeHtml(item.timeframe)}</td></tr>
        <tr><th>公開 PF</th><td>${escapeHtml(item.pf)}</td></tr>
        <tr><th>公開勝率</th><td>${escapeHtml(item.winRate)}</td></tr>
        <tr><th>資料來源</th><td><span class="chip">${escapeHtml(item.sourceName)}</span><p class="small">來源網址只保留於內部審核資料，不在策略頁提供外部連結。</p></td></tr>
      </tbody>
    </table>
  `;
}

const strategyCaseDetailProfiles = {
  "connors-rsi2": {
    thesis:
      "這類策略說穿了，就是在牛市裡等短線恐慌。它不是預測明天一定升，而是等大方向未壞、賣壓又短時間過度集中時才出手。",
    readerTakeaways: [
      "200MA 是第一層風險閘門；跌穿長期趨勢後，不應盲目接刀。",
      "RSI(2) 不是普通超買超賣指標，而是用來量度兩三日內的恐慌程度。",
      "離場紀律是核心：這套策略通常吃短線反彈，不是買入後等大牛市。",
      "腳本負責檢查趨勢、RSI 極值、離場均線和止蝕距離，避免漏掉其中一項。",
    ],
    bestWhen: [
      "指數仍處於長期上升趨勢，價格高於 200MA。",
      "短線連續下跌，但沒有重大基本面利空破壞原本趨勢。",
      "標的是 SPY、QQQ、IWM 等流動性高、隔夜裂口相對可控的產品。",
    ],
    avoidWhen: [
      "價格跌穿 200MA 後仍然急跌，短線超賣可能只是熊市初段。",
      "FOMC、CPI、重大財報或黑天鵝消息前後，隔夜風險會放大。",
      "把 RSI 閾值調得太寬，會令策略由「極端恐慌」變成普通回調交易。",
    ],
    executionFlow: [
      ["確認標的", "只把大型指數 ETF 或高流動性期貨放入觀察清單，先避開細價股和成交薄弱產品。"],
      ["確認趨勢", "日線收市價必須高於 200MA，否則即使 RSI(2) 很低也先不交易。"],
      ["等待恐慌", "RSI(2) 或累積 RSI(2) 跌至設定閾值，代表短線賣壓已經集中釋放。"],
      ["計算倉位", "用 ATR 或固定風險金額計算股數，避免因為勝率高而過度放大倉位。"],
      ["設定離場", "收盤重新站上 5MA 或 10MA 時離場，重點是反彈完成後收工。"],
      ["記錄結果", "每次交易記錄 RSI 觸發值、距離 200MA 的位置、持倉日數和最大不利波動。"],
    ],
    tvImplementation: [
      "用 input.int 建立 RSI 週期、入場閾值、200MA 週期和離場均線週期，方便自行測試。",
      "圖上標示 Close > 200MA 的背景色，讓策略是否啟用一眼可見。",
      "當 RSI(2) 低於閾值時畫出入場箭嘴，並在離場均線被收復時畫出離場標記。",
      "在 strategy() 中加入 commission、slippage 和 pyramiding=0，避免回測數字過於理想化。",
      "加入 alertcondition，提醒在收盤前後檢查是否真的符合所有條件。",
    ],
    backtestChecklist: [
      "分別測試 1993 至今、2008、2020、2022 等不同市場環境，不要只看總體曲線。",
      "比較 RSI(2) < 5、< 10、累積 RSI 閾值等版本，觀察 PF 是否對單一參數過度敏感。",
      "加入固定止蝕、ATR 止蝕和時間止蝕三種版本，確認最大回撤是否可接受。",
      "將 SPY、QQQ、IWM、DIA 分開統計，避免某一個市場拉高整體結果。",
      "記錄平均持倉日數和連續虧損次數，這些數字比單純勝率更接近實盤感受。",
    ],
    articleAngles: [
      "先問自己：高勝率是否真的等於低風險？答案要同時看 PF、回撤和交易次數。",
      "找一筆典型交易來拆：200MA 之上、RSI(2) 極低、反彈至短均線離場。",
      "最常見錯誤，是跌穿長期趨勢後仍然接刀，或把短線反彈拿成長線倉。",
      "手動檢查最容易漏趨勢或離場條件，把這些條件放到同一個面板會清楚得多。",
    ],
    conversionBridge:
      "這類回調訊號最怕漏條件。腳本把趨勢、恐慌、止蝕和離場條件放在同一處，方便交易前逐項核對。",
  },
  "triple-rsi": {
    thesis:
      "Triple RSI 的代價是低頻。勝率高，往往是因為條件收得很窄，不是因為它每天都能找到好交易。",
    readerTakeaways: [
      "多個 RSI 條件同時成立，代表短線賣壓更集中，但交易次數會明顯減少。",
      "PF 4 至 8 的數字很吸引，但交易樣本較少，必須小心過度擬合。",
      "高勝率策略可拆成三件事：趨勢濾網、入場稀缺性、固定離場規則。",
      "腳本面板可顯示三層 RSI 是否同時通過，比肉眼逐個指標檢查更清楚。",
    ],
    bestWhen: [
      "市場處於長期多頭，但短線出現急速回調。",
      "指數 ETF 流動性充足，交易成本和滑價相對低。",
      "交易者願意接受低頻訊號，耐心等待所有 RSI 條件同時滿足。",
    ],
    avoidWhen: [
      "交易者期望每日都有交易，容易把條件放寬到失去原本優勢。",
      "市場出現系統性危機，RSI 可以長時間維持超賣。",
      "只憑公開摘要重建策略，卻沒有進行樣本外測試和壓力測試。",
    ],
    executionFlow: [
      ["建立觀察池", "先選 SPY、QQQ 或大型指數 ETF，避免小型股因單一消息造成 RSI 失真。"],
      ["加上長線濾網", "確認價格仍在 200MA 上方，確保策略只尋找多頭回調，而不是熊市反彈。"],
      ["檢查三層 RSI", "把不同週期或不同定義的 RSI 條件逐項列出，只有全部通過才進入候選。"],
      ["等待收盤確認", "日線策略應以收盤數據判定，避免盤中 RSI 瞬間跌破又收回。"],
      ["按固定規則離場", "用短均線、固定持倉日數或反彈幅度離場，不要把稀有訊號變成主觀持倉。"],
      ["評估稀缺性", "回測時把每年交易次數列出，確認這不是高頻收益來源。"],
    ],
    tvImplementation: [
      "把三個 RSI 條件拆成三個獨立布林值，面板顯示「通過 / 未通過」。",
      "用表格顯示趨勢、RSI A、RSI B、RSI C、離場狀態，讓條件是否齊全一眼可見。",
      "提供參數組合輸入，但保留預設值，避免一開始就過度優化。",
      "在回測中加入固定倉位和佣金，並顯示 market exposure，突出低頻策略特性。",
      "把訊號分成「觀察」和「正式入場」，例如兩個 RSI 通過只提示觀察，三個通過才提示入場。",
    ],
    backtestChecklist: [
      "把交易數量、平均收益、最大回撤和 market exposure 同時列出，避免只看勝率。",
      "將 1993 至今拆成年份統計，觀察是否只有少數年份貢獻大部分利潤。",
      "測試參數附近值，例如 RSI 閾值上下調整，確認 PF 不是單點尖峰。",
      "加入時間止蝕，檢查若反彈遲遲不來，策略如何退出。",
      "清楚標示完整規則未公開；此案例只適合作研究參考，不是保證可複製原策略。",
    ],
    articleAngles: [
      "90% 勝率背後通常有代價：交易次數少、等待時間長、樣本容易偏細。",
      "把 RSI 單條件、雙條件、三條件放在同一張表比較，會更容易看出取捨。",
      "低頻策略未必差，它可以是組合裡其中一個模組，而不是唯一收入來源。",
      "多條件共振面板的作用，是整理決策，不是單純多畫線。",
    ],
    conversionBridge:
      "三個 RSI、趨勢濾網和出場條件集中在同一個 TradingView 面板，會比肉眼逐個指標檢查少很多漏判。",
  },
  "turnaround-tuesday": {
    thesis:
      "Turnaround Tuesday 研究的不是星期二有魔法，而是市場情緒在某些日子容易偏向一邊。時間本身，也可以是一道濾網。",
    readerTakeaways: [
      "星期效應策略屬於季節性與均值回歸結合，不是傳統技術指標。",
      "交易窗口很重要：星期一弱勢後，星期二或之後數日才是研究核心。",
      "時間濾網可以降低交易頻率，避免每天接跌。",
      "圖表上先標出星期一弱勢、星期二反彈條件和時間止蝕，免得事後才回頭找理由。",
    ],
    bestWhen: [
      "星期一出現明顯下跌，但大市未跌穿主要趨勢支撐。",
      "市場沒有重大宏觀事件即將公布，隔夜消息風險較低。",
      "交易者用 SPY 或 QQQ 這類流動性高的指數 ETF 做短線策略。",
    ],
    avoidWhen: [
      "CPI、FOMC、非農或重大地緣事件前後，星期效應容易被消息覆蓋。",
      "星期一跌幅來自結構性壞消息，而不是短線情緒。",
      "把星期二反彈交易延長成無限期持倉，會失去策略原本的時間優勢。",
    ],
    executionFlow: [
      ["標記星期一", "用 dayofweek 找出星期一，計算當日跌幅、收盤位置和是否跌穿重要均線。"],
      ["篩選弱勢", "只關注星期一收跌或跌幅達到門檻的情況，避免所有星期二都盲目買入。"],
      ["確認星期二條件", "可用開盤不再破底、收復星期一低位或收盤強度作入場確認。"],
      ["設定時間窗口", "策略通常持有 1 至數日，必須清楚列出最遲離場日。"],
      ["加入失效點", "如果價格跌穿星期一低位或 ATR 風險距離，交易劇本失效。"],
      ["統計星期分布", "回測時列出不同星期入場的表現，證明優勢是否真的集中在星期二。"],
    ],
    tvImplementation: [
      "用背景色標示星期一和星期二，讓時間窗口更直觀。",
      "加入星期一跌幅門檻、VIX 濾網、200MA 濾網和最多持倉日數輸入。",
      "用 label 標記「星期一弱勢成立」和「星期二入場候選」，避免事後才回頭找理由。",
      "用 strategy.close 在指定持倉日數離場，避免主觀延長持倉。",
      "加入 alertcondition，在星期一收盤後提醒次日觀察。",
    ],
    backtestChecklist: [
      "分開統計星期二開盤入場、星期二收盤入場和持有不同日數的結果。",
      "比較有無 200MA 和 VIX 濾網，觀察勝率與交易數如何改變。",
      "列出重大事件週的表現，例如金融危機、疫情急跌、加息週期。",
      "檢查是否集中在少數年份有效，避免把短期季節性誤當永久規律。",
      "加入實際佣金和滑價，因為隔夜短線策略的平均收益通常不大。",
    ],
    articleAngles: [
      "先把星期一至星期五入場結果分開看，不要只相信一個平均數。",
      "時間濾網真正有沒有用，要看交易次數、平均收益和回撤有沒有一起改善。",
      "最好用一個真實圖例，拆出星期一跌、星期二企穩、數日後離場的完整流程。",
      "時間效應仍要配合濾網和止蝕，腳本只負責標記條件。",
    ],
    conversionBridge:
      "時間窗口和市況濾網可以放在一起看。星期、月份和重大事件前後的交易節奏，不應只靠人手記住。",
  },
  ibs: {
    thesis:
      "IBS 把一句很主觀的話變成數字：今天是不是收在全日低位附近。收得越接近低位，短線恐慌味道越重。",
    readerTakeaways: [
      "IBS 的公式可以量化收盤位置，也能解釋為何收盤接近日內低位可能帶來短線反彈機會。",
      "IBS 不是獨立聖杯，最好配合趨勢、波動或市場寬度濾網。",
      "低 IBS 買入、高 IBS 或反彈後離場，是這類策略的基本框架。",
      "腳本負責計算 IBS、標示極端收盤位置和設定警報。",
    ],
    bestWhen: [
      "市場短線拋售但長期趨勢未明顯轉壞。",
      "標的是指數 ETF，單日高低位有足夠代表性。",
      "日內波幅合理，High-Low 不接近零，IBS 數值不會失真。",
    ],
    avoidWhen: [
      "單日走勢受停牌、極端裂口或特殊事件主導。",
      "High-Low 太窄，IBS 會因分母太小而變得沒有意義。",
      "市場處於單邊崩跌，低 IBS 可能連續出現但價格繼續下跌。",
    ],
    executionFlow: [
      ["計算 IBS", "用 (Close - Low) / (High - Low) 得出 0 至 1 的收盤位置。"],
      ["設定極端區", "一般用 IBS < 0.2 或 < 0.3 作短線恐慌門檻。"],
      ["加入市況濾網", "可要求價格高於 200MA、VIX 未失控或市場寬度沒有全面崩壞。"],
      ["入場判定", "日線收盤時 IBS 進入低位區，並通過濾網，才列為做多候選。"],
      ["離場判定", "IBS 回到高位區、收盤反彈至短均線，或持倉達到時間上限即離場。"],
      ["對照市場", "把 SPY 和 QQQ 分開回測，確認 IBS 在不同指數上的穩定度。"],
    ],
    tvImplementation: [
      "在副圖畫出 IBS 0 至 1 區間，並用水平線標示 0.2、0.5、0.8。",
      "主圖用箭嘴標示低 IBS 入場候選，用另一種顏色標示高 IBS 離場。",
      "加入 High-Low 太小時忽略訊號的保護，避免公式在窄幅日失真。",
      "用 input.float 測試 0.2、0.3、0.8、0.9 等門檻。",
      "把 IBS 與 200MA 或 VIX 濾網放入同一個 table，方便圖文對照。",
    ],
    backtestChecklist: [
      "測試不同 IBS 閾值的勝率、PF、平均收益和交易次數。",
      "加入有無趨勢濾網的比較，說明濾網如何改變回撤。",
      "檢查隔日離場、IBS 高位離場、短均線離場三種版本。",
      "觀察連續低 IBS 出現時是否分批入場，或只允許單一持倉。",
      "加入滑價，因為部分訊號可能在恐慌收盤附近成交，價格不一定理想。",
    ],
    articleAngles: [
      "先看今天收盤到底貼近全日高位還是低位。",
      "看一張 K 線圖：收在全日低位附近，和收在高位附近，代表的短線情緒完全不同。",
      "用表格列出 IBS < 0.2、< 0.3 的交易數與 PF 差異。",
      "同時看多個 ETF 時，可把 IBS 極端值排成清單，先挑最值得檢查的標的。",
    ],
    conversionBridge:
      "IBS 很適合用掃描器檢查：多個 ETF、趨勢濾網、警報和倉位風險提示，都放在同一個工作區。",
  },
  "macd-histogram": {
    thesis:
      "很多人只看 MACD 金叉，但 Histogram 其實更早透露動能在收縮還是重新啟動。重點不是普通交叉，而是動能轉向的過程。",
    readerTakeaways: [
      "Histogram 是 MACD 線與 Signal 線的距離，不只是柱狀圖裝飾。",
      "高 PF 版本通常需要濾網，不能單靠每次柱狀圖翻正就交易。",
      "動能策略和均值回歸策略不同：它需要市場有方向延續。",
      "圖表上要標出 Histogram 由弱轉強、當時的趨勢背景，以及訊號失效位置。",
    ],
    bestWhen: [
      "QQQ 或科技股指數出現回調後重新轉強。",
      "市場有方向性，突破或回調再啟動比橫行市更清晰。",
      "Histogram 變化與價格結構配合，例如 higher low 或突破短線阻力。",
    ],
    avoidWhen: [
      "市場橫行震盪，MACD 容易反覆交叉造成假訊號。",
      "只看 Histogram 翻正，不檢查趨勢和波動。",
      "把 MACD 預設參數視為唯一正確，沒有測試其他市場和週期。",
    ],
    executionFlow: [
      ["確認市場方向", "先判斷價格是否在主要均線之上，或是否完成回調後重新走強。"],
      ["觀察 Histogram", "等待柱狀圖由負值收窄、翻正，或出現連續改善的動能訊號。"],
      ["配合價格結構", "最好同時看到收盤突破短線高位、站回均線或形成 higher low。"],
      ["定義入場", "在動能確認後入場，而不是在柱狀圖仍擴大向下時預先猜底。"],
      ["設定失效", "若 Histogram 再次轉弱或價格跌回觸發區下方，交易劇本失效。"],
      ["離場管理", "可用固定目標、ATR trailing stop 或 Histogram 轉弱作離場條件。"],
    ],
    tvImplementation: [
      "把 MACD 12/26/9 做成可調參數，同時可選擇 Histogram 翻正或連續改善作訊號。",
      "用顏色區分 Histogram 擴張、收縮、由負轉正和由正轉弱。",
      "在主圖標示入場候選，副圖保留 Histogram，方便圖文對照。",
      "加入趨勢濾網、成交量濾網或 ATR 波動濾網，避免橫行市過度交易。",
      "在策略回測中加入 trailing stop 選項，比較固定離場與動能離場。",
    ],
    backtestChecklist: [
      "比較 MACD 預設參數與較短參數，觀察 PF 是否穩定。",
      "把純 MACD 訊號與加入趨勢濾網的版本分開比較。",
      "統計在 QQQ 上的表現，同時測試 SPY 或個股，避免單一市場偏差。",
      "檢查橫行市期間的連續虧損，這是 MACD 策略最容易出問題的地方。",
      "列出平均持倉日數，動能策略若持倉太短，可能只是噪音交易。",
    ],
    articleAngles: [
      "先比較 MACD 金叉和 Histogram 轉強，看看哪一個更早提示動能變化。",
      "先看 MACD 線、Signal 線、Histogram 的關係，否則很容易只盯柱狀圖顏色。",
      "同時看一個成功例子和一個假訊號，才會知道濾網為何重要。",
      "動能模組應該看趨勢、成交量和止蝕，不應只做 MACD 金叉提醒。",
    ],
    conversionBridge:
      "動能模組把 Histogram 轉折、趨勢、成交量和止蝕條件放在一起，少一點來回切換指標。",
  },
  "williams-r": {
    thesis:
      "Williams %R 和 RSI 一樣，都是用來看短線有沒有過熱或過冷；不同的是，它更直接看收市價貼近近期高位還是低位。",
    readerTakeaways: [
      "%R 越接近極端，代表價格越貼近近期區間邊緣。",
      "%R 最好配合趨勢濾網，否則容易在強跌市中連續發出超賣訊號。",
      "%R 可以轉化成入場條件、離場條件和風險提示。",
      "把 RSI、IBS、Williams %R 放在一起比較，較容易看出短線恐慌是否共振。",
    ],
    bestWhen: [
      "QQQ 或大型 ETF 在長期趨勢中出現短線超賣。",
      "價格回到近期區間低位，但大方向未明顯轉壞。",
      "想比較 RSI 以外的短線回調指標。",
    ],
    avoidWhen: [
      "單邊急跌市中，%R 可以長時間維持超賣。",
      "只用 %R 極端值交易，沒有定義趨勢、止蝕和離場。",
      "用在成交稀疏或裂口頻繁的個股，近期高低區間可能失真。",
    ],
    executionFlow: [
      ["設定週期", "常見以 14 期開始，再測試 10 至 20 期的穩定性。"],
      ["確認趨勢", "用 200MA、ADX 或市場寬度判斷是否只做多頭回調。"],
      ["等待 %R 極端", "當 %R 進入超賣區，代表收盤接近近期區間低位。"],
      ["加入確認", "可要求價格停止創新低、IBS 偏低後回升，或下一日收盤轉強。"],
      ["計劃離場", "當 %R 回到中性區、高位區或價格收復短均線時離場。"],
      ["管理風險", "若價格繼續跌穿近期低位或 ATR 失效點，必須退出。"],
    ],
    tvImplementation: [
      "用 ta.wpr 計算 Williams %R，並把超賣、超買水平做成可調輸入。",
      "在副圖加入區間線，主圖只顯示通過濾網後的有效訊號。",
      "提供 RSI / IBS / %R 共振模式，比較不同指標是否同時指向恐慌。",
      "用背景色提示目前是否處於可做多的趨勢環境。",
      "加入策略測試選項：%R 回到中性區離場、短均線離場、固定持倉日數離場。",
    ],
    backtestChecklist: [
      "比較 10、14、20 期 %R 的 PF 和交易次數，不要只挑最佳參數。",
      "比較有無趨勢濾網時，要同時看最大回撤差異。",
      "把 QQQ 和 SPY 分開看，科技股和大市的波動特性不同。",
      "檢查超賣後繼續下跌的案例，這些是策略真正的風險來源。",
      "評估離場規則對結果的影響，震盪指標策略常常是離場決定盈虧。",
    ],
    articleAngles: [
      "先比較 Williams %R 和 RSI 的差異，再決定哪個更適合當前市場。",
      "先看公式與圖例，知道 %R 的數值如何產生，再談入場。",
      "用表格比較 %R 單獨使用與加趨勢濾網後的數據。",
      "多指標恐慌檢查可以避免只盯住單一震盪指標。",
    ],
    conversionBridge:
      "超賣共振面板同時檢查 RSI、IBS、Williams %R 和趨勢濾網，避免只因單一指標極端就入場。",
  },
  "adx-dmi": {
    thesis:
      "ADX / DMI 先回答一個很基本的問題：市場到底有沒有趨勢。沒有趨勢時，很多突破和追勢訊號都會變成噪音。",
    readerTakeaways: [
      "ADX 量度趨勢強度，+DI / -DI 則反映方向。",
      "ADX 本身不分升跌，必須配合 DMI 或價格方向。",
      "趨勢策略在橫行市會受傷，因此濾網比入場箭嘴更重要。",
      "先把市場分成趨勢、震盪、觀察三種狀態，再決定看不看入場訊號。",
    ],
    bestWhen: [
      "市場由橫行轉向方向性突破，ADX 開始上升。",
      "+DI 高於 -DI，價格同時站在主要均線之上。",
      "交易者想做順勢跟隨，而不是短線接回調。",
    ],
    avoidWhen: [
      "ADX 低位徘徊，市場缺乏方向，容易反覆假突破。",
      "只看到 ADX 高就入場，卻沒有確認 +DI / -DI 和價格方向。",
      "在趨勢已經過度延伸後追入，風險回報可能變差。",
    ],
    executionFlow: [
      ["量度趨勢強度", "先看 ADX 是否高於 20 或 25，並觀察是否正在上升。"],
      ["判斷方向", "+DI 高於 -DI 時偏多，-DI 高於 +DI 時偏空；做多版本可以先以 +DI 高於 -DI 作方向條件。"],
      ["配合價格", "確認價格站上主要均線或突破區間，避免 DMI 單獨訊號。"],
      ["等待回調或突破", "可在趨勢確認後買回調，也可在突破當日入場，兩者要分開回測。"],
      ["設置 trailing stop", "趨勢策略通常靠大波段盈利，離場可用 ATR 或均線追蹤。"],
      ["監控趨勢衰退", "ADX 轉弱、DI 交叉或跌回關鍵均線時，降低持倉或離場。"],
    ],
    tvImplementation: [
      "用 ta.dmi 計算 ADX、+DI、-DI，並把 ADX 閾值做成 input。",
      "主圖背景可顯示趨勢狀態：多頭趨勢、空頭趨勢、無趨勢。",
      "用不同圖示區分突破入場和回調入場，避免判斷時混淆。",
      "加入 ATR trailing stop，讓浮盈有明確保護規則。",
      "在 table 中顯示 ADX 數值、DI 方向、均線狀態和當前訊號級別。",
    ],
    backtestChecklist: [
      "比較 ADX > 20、> 25、ADX 上升中三種條件的交易數與 PF。",
      "把突破入場和回調入場分開測試，兩者風險特性不同。",
      "測試 SPY 和 QQQ，觀察科技股波動是否提高回撤。",
      "檢查橫行市中的連續虧損，並加入震盪濾網或市場寬度條件。",
      "列出平均盈利交易與平均虧損交易，趨勢策略通常靠少數大贏家拉高結果。",
    ],
    articleAngles: [
      "先判斷市場有沒有趨勢，再談入場點。",
      "加入 ADX 高但價格下跌的例子，提醒 ADX 不等於看升。",
      "對照 ADX 低位震盪和 ADX 上升突破，差別會很明顯。",
      "市況分類功能的作用，是先選對策略類型，再看訊號。",
    ],
    conversionBridge:
      "市況引擎先分辨趨勢或震盪，再決定看突破、看回調，還是先觀望。",
  },
  "three-down-days": {
    thesis:
      "三連跌很容易理解，也最容易被濫用。越簡單的規則，越要把入場、離場和失效條件寫死。",
    readerTakeaways: [
      "連跌三日代表短線賣壓累積，但不等於一定見底。",
      "PF 1.8 並非極高，策略需要濾網和風險控制才有實用價值。",
      "簡單價格行為也可以轉化成可測試規則。",
      "圖表先計算連跌日數、趨勢狀態和止蝕位置，就不用每天人手數 K 線。",
    ],
    bestWhen: [
      "SPY 在長期趨勢仍健康時連續下跌數日。",
      "跌勢較像短線獲利回吐，而不是重大利空造成的趨勢反轉。",
      "交易者想用簡單、可解釋的價格行為做策略研究。",
    ],
    avoidWhen: [
      "連跌發生在熊市下跌初段，反彈機率和反彈幅度都可能下降。",
      "沒有止蝕或時間止蝕，讓短線策略變成被動長線持倉。",
      "把規則搬到個股而沒有檢查財報、停牌、流動性和裂口風險。",
    ],
    executionFlow: [
      ["定義連跌", "明確寫出三日收市價是否每日低於前一日收盤，避免主觀判斷。"],
      ["檢查趨勢", "可要求價格高於 200MA 或市場寬度未全面轉弱。"],
      ["確認入場時間", "在第三日收盤、第四日開盤或第四日確認轉強入場，三者要分開測試。"],
      ["設定出場", "可用短均線、固定持倉日數或反彈至前一日高位作離場。"],
      ["設定失效", "跌穿第三日低位或 ATR 風險距離時退出。"],
      ["追蹤序列", "回測要記錄連跌四日、五日是否加倉，或只做第一次訊號。"],
    ],
    tvImplementation: [
      "用 close < close[1] 連續計數，建立 downCount 變數。",
      "把三連跌後的 K 線用顏色標示，方便圖表觀察。",
      "加入 200MA、VIX 或市場寬度濾網，讓訊號分成有效和無效。",
      "用 input 設定連跌日數，比較 2、3、4 日的效果。",
      "把時間止蝕寫入 strategy.exit 或 strategy.close，避免回測持倉失控。",
    ],
    backtestChecklist: [
      "比較第三日收盤入場與第四日開盤入場，隔夜裂口會影響真實結果。",
      "測試連跌 2、3、4、5 日，觀察最佳點是否過度擬合。",
      "分開統計牛市、熊市、震盪市，簡單均值回歸規則在熊市容易失效。",
      "加入固定止蝕和時間止蝕，觀察 PF 與最大回撤的取捨。",
      "列出最大連續虧損，確認簡單規則也會有心理壓力。",
    ],
    articleAngles: [
      "先問：連跌三日後買入，長期是否真的有優勢？",
      "補充一段反直覺提醒：越簡單的策略，越需要嚴格定義和回測。",
      "對照三連跌成立與不成立的圖形，先把定義弄清楚。",
      "價格行為掃描可以自動數連跌日數，不用每天人手數 K 線。",
    ],
    conversionBridge:
      "價格行為掃描負責找出連跌、反彈、突破和失效點，把簡單規則變成每日可檢查的清單。",
  },
  "orb-options": {
    thesis:
      "ORB 0DTE 不能只看勝率。公開數據雖然漂亮，但 PF 不算高；0DTE 又很吃成交、點差和下單速度。研究這類策略，第一步是分清楚：突破是否有質素，期權成本是否划算。",
    readerTakeaways: [
      "Opening range 指開市後 5、15、30 或 60 分鐘形成的高低位，不是第一支 K 線一突破就追。",
      "先判斷 SPY、QQQ 或 SPX 的方向，再決定是否用期權表達；方向訊號和期權工具要分開看。",
      "5 分鐘訊號多、假突破也多；60 分鐘訊號少一點，但通常較穩。",
      "實用的圖表工具應該把開市區間、VWAP、突破方向和失效位畫在同一張圖上。",
    ],
    bestWhen: [
      "開市成交活躍，價格在 opening range 後出現清晰方向。",
      "標的是 SPY、QQQ、SPX 等流動性高、期權買賣差價較窄的產品。",
      "交易者已有日內風險控制能力，能接受快速止蝕和不隔夜。",
    ],
    avoidWhen: [
      "低波動橫行日，突破後很容易回到區間內。",
      "0DTE 期權買賣差價擴大或 IV 急變，回測和實盤差異會很大。",
      "新手只看勝率，忽略 PF 1.17 至 1.44 代表容錯空間有限。",
    ],
    executionFlow: [
      ["設定區間", "開市後先等待 5、15、30 或 60 分鐘，記錄該時段高低位。"],
      ["畫出邊界", "開市區間高位和低位，是當日最早出現的一組關鍵水平。"],
      ["等待突破", "突破高位偏多，跌穿低位偏空；最好同時看 VWAP 和成交量。"],
      ["選擇工具", "ETF、期貨、期權 spread 的風險完全不同，不能只拿同一個勝率比較。"],
      ["設定失效", "價格跌回區間內、失守 VWAP，或虧損到達上限，就要離場。"],
      ["日內結束", "0DTE 不應隔夜，接近收市前要有明確平倉規則。"],
    ],
    tvImplementation: [
      "用 session 和 time 計算開市後指定分鐘數的 high / low，並在主圖延伸水平線。",
      "提供 5、15、30、60 分鐘選項，方便比較不同 ORB 版本。",
      "同時顯示 VWAP、成交量和跌回區間內的假突破提示。",
      "狀態只保留幾個清楚字眼：建立區間、等突破、突破成立、突破失敗。",
      "回測必須加入日內平倉和每筆固定風險，不讓倉位跨日。",
    ],
    backtestChecklist: [
      "把 5、15、30、60 分鐘 ORB 分開統計，不要只看最佳版本。",
      "期權策略要額外考慮 bid-ask spread、IV、成交量和滑價。",
      "比較只做多、只做空、雙向突破三種結果。",
      "分開看高波動日和低波動日，ORB 在不同環境差異很大。",
      "把最大日內回撤和最大連續虧損寫出來，日內策略心理壓力很高。",
    ],
    articleAngles: [
      "先用日內圖說清楚 opening range、突破、VWAP 和失效點。",
      "再比較 5/15/30/60 分鐘版本，讓勝率、PF 和交易次數一起看。",
      "期權部分單獨講：點差、IV、滑價和同日到期都會影響結果。",
      "最後檢查三件事：畫線是否準、方向是否清楚、假突破有沒有提醒。",
    ],
    conversionBridge:
      "ORB 這類日內規則很適合交給腳本整理：開市區間、突破方向、VWAP、失效位和警報都在圖上，少一點手動畫線，多一點紀律檢查。",
  },
  "first-trading-day": {
    thesis:
      "月初效應不是技術指標策略。它看的，是資金配置、月初買盤和市場行為在時間上的偏差。",
    readerTakeaways: [
      "月初第一個交易日可能受資金流、退休金配置或基金再平衡影響。",
      "交易頻率極低，CAGR 不高，但 market exposure 也低。",
      "日曆效應也可以寫成可測試規則，而不是靠感覺交易。",
      "圖表可標出月初交易窗口，再和其他策略分開統計。",
    ],
    bestWhen: [
      "市場流動性正常，月初沒有重大政策或宏觀事件干擾。",
      "策略作為組合中的低頻模組，而不是唯一收益來源。",
      "交易者想研究季節性、日曆效應和市場資金流。",
    ],
    avoidWhen: [
      "把低頻日曆效應當成高收益核心策略。",
      "忽略樣本數偏少，單靠 PF 3 判斷策略一定穩定。",
      "重大事件剛好落在月初，日曆效應可能被消息完全蓋過。",
    ],
    executionFlow: [
      ["標記月份", "用腳本識別每個月第一個有效交易日，而不是日曆上的 1 號。"],
      ["定義入場", "可在前一交易日收盤、第一個交易日開盤或收盤入場，需分開測試。"],
      ["加入市場濾網", "可用 200MA、VIX 或前一日走勢判斷是否啟用策略。"],
      ["設定離場", "常見做法是在同日收盤、數日後或指定條件達成後離場。"],
      ["記錄頻率", "一年最多 12 次左右，必須列出交易數和 exposure。"],
      ["組合應用", "把它視為季節性模組，可與均值回歸或趨勢策略分開統計。"],
    ],
    tvImplementation: [
      "用 month(time) 和月份變化識別第一個交易日，避免週末和假期造成錯判。",
      "在圖上用背景色標示月初窗口，讓訊號稀疏性更直觀。",
      "加入入場時間選項：前日收盤、當日開盤、當日收盤。",
      "用 strategy.close 控制固定持倉日數，突出日曆效應不是長線持倉。",
      "把每年交易次數和勝率放入表格，讓低頻特性更透明。",
    ],
    backtestChecklist: [
      "分別測試第一個交易日、最後一個交易日、月初前三日，確認優勢是否集中。",
      "列出總交易次數，低頻策略必須特別重視樣本不足問題。",
      "檢查不同十年期間的穩定性，例如 2000s、2010s、2020s。",
      "加入滑價和佣金，即使交易少，也要避免平均收益被高估。",
      "把策略和 buy-and-hold 比較時，同時列出 exposure，否則 CAGR 會被誤解。",
    ],
    articleAngles: [
      "先檢查每個月第一個交易日，是否真的比其他日子更容易上升。",
      "用日曆或圖表看清楚：一年其實只有少量交易日。",
      "特別留意樣本數陷阱：一年只有少量交易，結論語氣要保守。",
      "日曆效應模組可以標示特殊交易窗口，再和其他策略分開統計。",
    ],
    conversionBridge:
      "季節性窗口提醒器不只看技術指標，也會標出月初、月末、星期效應等特殊交易日。",
  },
  "tlt-panic": {
    thesis:
      "TLT Panic 提醒我們，恐慌和均值回歸不只出現在股票指數。債券 ETF 也會因利率預期急變，出現短線過度反應。",
    readerTakeaways: [
      "TLT 受利率預期影響，短線超賣和股票 ETF 的成因不同。",
      "債券在加息週期可長期受壓，不能只靠超賣買入。",
      "跨資產策略要重新檢查風險來源和樣本環境。",
      "把股票、債券、黃金等 ETF 的恐慌訊號分開監控，避免把不同資產混成同一套判斷。",
    ],
    bestWhen: [
      "利率消息造成短線過度拋售，但長債價格沒有進入失控下跌。",
      "交易者想用 TLT 作股票策略以外的分散模組。",
      "波動回落或價格出現止跌跡象，短線均值回歸更有基礎。",
    ],
    avoidWhen: [
      "利率進入單邊重估階段，TLT 可以長時間下跌。",
      "只把股票 ETF 的 RSI 閾值直接套到債券 ETF。",
      "忽略 FOMC、通脹數據和美債收益率變化對 TLT 的影響。",
    ],
    executionFlow: [
      ["理解標的", "先確認 TLT 是長債 ETF，價格與長端利率高度相關。"],
      ["定義恐慌", "可用 RSI、IBS、連跌日數或 ATR 跌幅量化短線過度拋售。"],
      ["加入利率背景", "觀察美債收益率、FOMC 週期或重大通脹數據，避免盲目套用股票邏輯。"],
      ["等待止跌", "可要求收盤不再創新低、IBS 回升或價格重新站回短均線。"],
      ["控制持倉", "TLT 均值回歸通常是短線修復，不應自動變成長期押注降息。"],
      ["分散統計", "把 TLT 結果和 SPY/QQQ 策略分開比較，再討論組合分散效果。"],
    ],
    tvImplementation: [
      "用獨立的 TLT 參數組，不要直接使用股票指數預設值。",
      "加入 RSI、IBS 或連跌日數作恐慌條件，並用 200MA 或收益率背景作濾網。",
      "圖上標示 FOMC 或重大通脹日期，提醒自己不要忽略事件風險。",
      "用 table 顯示 TLT 當前狀態：恐慌、反彈、趨勢受壓或觀望。",
      "回測加入固定持倉日數和 ATR 止蝕，避免利率趨勢單邊時虧損擴大。",
    ],
    backtestChecklist: [
      "分開測試低利率、加息、減息和高通脹時期，TLT 的市場環境差異很大。",
      "檢查交易次數是否足夠，公開案例樣本偏少時要降低結論語氣。",
      "比較 RSI、IBS、連跌日數三種恐慌定義，找出是否有穩定共通點。",
      "加入利率急升期間的壓力測試，這是 TLT 策略最重要的風險。",
      "評估與股票策略的相關性，說明它在組合中可能扮演的角色。",
    ],
    articleAngles: [
      "先問：債券 ETF 是否也會出現可交易的短線恐慌？",
      "先用一段解釋 TLT 與利率的關係，再進入技術策略。",
      "加入加息週期中的失敗案例，提升案例可信度。",
      "跨資產 ETF 掃描可以把股票、債券、黃金等恐慌訊號分開看。",
    ],
    conversionBridge:
      "跨資產掃描可以同時看股票、債券和其他 ETF 的恐慌訊號，視野會比只盯單一市場更完整。",
  },
};

function getStrategyCaseProfile(item) {
  return (
    strategyCaseDetailProfiles[item.slug] || {
      thesis: `${item.shortTitle} 可以作為一篇完整策略研究：先說明交易邏輯，再拆解入場、離場、風險和回測限制。`,
      readerTakeaways: [
        `${item.shortTitle} 的核心不是單一指標，而是市況、訊號和風險控制的組合。`,
        "公開數據和未公開規則必須分開理解，避免誤以為可以直接複製。",
        "圖表工具可以協助自動檢查條件。",
      ],
      bestWhen: ["標的流動性充足。", "市況與策略類型一致。", "交易者願意按固定規則執行。"],
      avoidWhen: ["重大消息前後。", "參數只在單一樣本有效。", "沒有止蝕、離場和倉位規則。"],
      executionFlow: [
        ["確認標的", `先確定 ${item.market} 是否適合這套策略。`],
        ["確認週期", `以 ${item.timeframe} 作主要判斷週期。`],
        ["等待訊號", "只在完整條件成立時交易，不用主觀感覺補訊號。"],
        ["設定風險", "入場前定義止蝕、倉位和失效條件。"],
        ["執行離場", "按預先設定的離場條件完成交易。"],
      ],
      tvImplementation: ["把每個條件拆成可開關參數。", "加入訊號標記、警報和回測。", "顯示目前狀態，方便理解。"],
      backtestChecklist: ["測試不同年份。", "比較參數敏感度。", "加入成本和滑價。", "列出最大回撤和交易次數。"],
      articleAngles: ["先弄清楚策略想捕捉哪一段行情。", "用一筆完整交易檢查入場、離場和失效點。", "把條件交給圖表自動檢查，減少人手漏判。"],
      conversionBridge: "手動檢查容易漏條件，把規則變成可視化流程會清楚得多。",
    }
  );
}

function renderStrategyBullets(items) {
  return `
    <ul class="plain-list">
      ${items.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}
    </ul>
  `;
}

function renderStrategySteps(steps) {
  return `
    <ol class="strategy-step-list">
      ${steps
        .map(
          ([title, body]) => `
            <li>
              <strong>${escapeHtml(title)}</strong>
              <span>${escapeHtml(body)}</span>
            </li>
          `,
        )
        .join("")}
    </ol>
  `;
}

function renderStrategyCaseArticleIntro(item, profile) {
  return `
    <article class="info-card strategy-article-intro">
      <span class="lesson-label">先看這裡</span>
      <h2>先別急著看勝率</h2>
      <p>${escapeHtml(profile.thesis)}</p>
      <h3>看完要記住</h3>
      ${renderStrategyBullets(profile.readerTakeaways)}
      <p class="small">把 ${escapeHtml(item.shortTitle)} 當成研究題目，不要當成必勝訊號。</p>
    </article>
  `;
}

function renderStrategyExecutionFlow(profile) {
  return `
    <article class="review-panel">
      <span class="lesson-label">執行流程</span>
      <h2>實際檢查順序</h2>
      ${renderStrategySteps(profile.executionFlow)}
    </article>
  `;
}

function renderStrategyTradingViewBuild(profile) {
  return `
    <article class="info-card">
      <span class="lesson-label">圖表設定</span>
      <h2>腳本要檢查甚麼</h2>
      ${renderStrategyBullets(profile.tvImplementation)}
    </article>
  `;
}

function renderStrategyBacktestChecklist(profile) {
  return `
    <article class="info-card">
      <span class="lesson-label">回測檢查清單</span>
      <h2>回測不要漏看的數字</h2>
      ${renderStrategyBullets(profile.backtestChecklist)}
    </article>
  `;
}

function renderStrategyMarketFit(profile) {
  return `
    <article class="trade-card strategy-fit-panel">
      <span class="lesson-label">市況判斷</span>
      <h2>甚麼時候才值得看</h2>
      <h3>比較適合</h3>
      ${renderStrategyBullets(profile.bestWhen)}
      <h3>要避開</h3>
      ${renderStrategyBullets(profile.avoidWhen)}
    </article>
  `;
}

function renderStrategyArticleOutline(profile) {
  return `
    <article class="trade-card">
      <span class="lesson-label">研究路線</span>
      <h2>寫成交易計劃時要拆開看</h2>
      ${renderStrategyBullets(profile.articleAngles)}
    </article>
  `;
}

function renderStrategyConversionBridge(profile) {
  return `
    <article class="notice strategy-conversion-note">
      <strong>腳本能幫上甚麼</strong>
      <p class="small">${escapeHtml(profile.conversionBridge)}</p>
      <div class="card-actions">
        <a class="button secondary" href="#/script">看自研腳本</a>
        <a class="button secondary" href="#/trial">申請試用</a>
      </div>
    </article>
  `;
}

function renderStrategyValidationPanel() {
  return `
    <article class="review-panel">
      <span class="lesson-label">驗證欄位</span>
      <h2>讀策略案例時必填的 6 格</h2>
      <ul class="plain-list">
        <li><strong>樣本：</strong>測試年期、交易次數、是否跨越牛市、熊市和震盪市。</li>
        <li><strong>成本：</strong>手續費、滑價、點差、成交延遲是否已反映。</li>
        <li><strong>規則：</strong>入場、出場、止蝕、加減倉是否可重建。</li>
        <li><strong>穩健：</strong>相近參數是否仍合理，而不是只有單一最佳參數能賺錢。</li>
        <li><strong>前向：</strong>是否需要先用模擬交易或極小倉觀察執行偏差。</li>
        <li><strong>降級：</strong>甚麼情況會把策略由可測試降為只作教學參考。</li>
      </ul>
      <div class="formula">研究結論模板：這個策略只在「某種市況」下值得觀察；若成本、滑價、回撤或失效條件不合格，就由交易候選降為案例研究。</div>
      <p class="small">教授級讀法不是問「它能不能賺」，而是問「它靠甚麼賺、錯時虧在哪裡、我能不能在自己的市場和週期中重建」。如果你不能用一句話說清楚策略賺的是哪種錯價或哪種市場行為，就先把它放回研究清單，不要放進交易清單。</p>
    </article>
  `;
}

function renderStrategyCaseSelectionGuide() {
  const steps = [
    ["先問市況", "策略賺的是趨勢延續、均值回歸、突破擴張、時間效應，還是恐慌後修復？如果講不出賺哪種市況，數字再漂亮也先降級。"],
    ["再看樣本", "交易次數、測試年期、市場類型和回撤幅度要一起看；少量交易配高 PF，通常只是研究線索，不是實盤結論。"],
    ["最後轉化", "把策略拆成入場、出場、失效、倉位、成本五件事。拆不出失效條件，就不應放進交易計劃。"],
  ];
  return `
    <section class="content-grid">
      <article class="review-panel">
        <span class="lesson-label">選案標準</span>
        <h2>先選值得研究的策略，不是最高勝率的策略</h2>
        <div class="timeline-list">
          ${steps
            .map(([title, body]) => `<div><strong>${escapeHtml(title)}</strong><span>${escapeHtml(body)}</span></div>`)
            .join("")}
        </div>
      </article>
      <aside class="stack">
        <article class="danger-card">
          <span class="lesson-label">過度擬合警示</span>
          <h2>看到這些特徵先扣分</h2>
          <ul class="plain-list">
            <li>只在單一年份、單一標的或單一參數組合下有效。</li>
            <li>勝率很高，但平均虧損遠大於平均盈利，或最大回撤沒有說清楚。</li>
            <li>沒有交易成本、滑價和成交限制，尤其是短線與期權策略。</li>
            <li>規則描述太模糊，無法在 TradingView 或日誌中重建。</li>
          </ul>
        </article>
      </aside>
    </section>
  `;
}

function renderStrategyReliabilityRubric() {
  const rows = [
    ["A 級研究", "規則清楚、樣本足夠、成本已計、不同市況仍能接受", "可小倉前向測試，仍需記錄滑價和執行偏差。"],
    ["B 級研究", "邏輯合理但樣本、成本或市場覆蓋不足", "只作觀察清單，先補回測條件和實盤演練。"],
    ["C 級研究", "高勝率或高 PF 主要來自少量交易、過度調參或規則不完整", "只可當教學案例，不應直接交易。"],
  ];
  return `
    <section class="page-band">
      <div class="section-head">
        <div>
          <h2>策略可信度尺規</h2>
          <p>同一個 PF 數字，放在不同樣本和成本假設下，可信度可以完全不同。先分級，再決定是否投入時間。</p>
        </div>
      </div>
      <table class="comparison-table">
        <tbody>
          ${rows
            .map(
              ([level, standard, action]) => `
                <tr>
                  <th>${escapeHtml(level)}</th>
                  <td><strong>${escapeHtml(standard)}</strong><span>${escapeHtml(action)}</span></td>
                </tr>
              `,
            )
            .join("")}
        </tbody>
      </table>
    </section>
  `;
}

function tvStrategyDataCount(key, fallback = 0) {
  const value = Number(tvStrategyData.stats[key]);
  return Number.isFinite(value) ? value : fallback;
}

function tvStrategyMetric(value, fallback = "待核對") {
  if (value === null || value === undefined || value === "") return fallback;
  if (typeof value === "number") return Number.isFinite(value) ? value.toLocaleString("zh-HK") : fallback;
  return String(value);
}

function tvStrategyPfText(item) {
  const range = safeRecord(item.pfRange);
  const low = Number(range.low);
  const high = Number(range.high);
  if (Number.isFinite(low) && Number.isFinite(high) && low !== high) return `${low} - ${high}`;
  return tvStrategyMetric(item.pfNumeric);
}

function tvStrategyStatusLabel(status) {
  const labels = {
    accepted: "已完成全部核對",
    "support-only": "待完成核對",
    rejected: "不採用",
  };
  return labels[status] || "待審";
}

function tvStrategyStatusTone(status) {
  if (status === "accepted") return "is-good";
  if (status === "rejected") return "is-bad";
  if (status === "support-only") return "is-warn";
  return "is-info";
}

function getTradingViewStrategyCase(slug) {
  return tvStrategyData.caseBySlug.get(slug) || null;
}

function tradingViewStrategyEvidenceFor(item) {
  return tvStrategyData.evidenceById.get(item.sourceEvidenceId) || {};
}

function tradingViewStrategyVisibleCases() {
  return tvStrategyData.cases.filter((item) => item.includeStatus !== "rejected");
}

function renderTradingViewStrategyDatasetPanel() {
  if (!tvStrategyData.loaded) {
    return `
      <section class="site-data-panel">
        <div class="section-head">
          <div>
            <h2>TradingView 策略資料包未載入</h2>
            <p>策略頁仍可閱讀教學內容；正式案例庫需要本地資料包。</p>
          </div>
          <span class="site-data-status is-warn">未載入</span>
        </div>
      </section>
    `;
  }
  const completedCount = tvStrategyDataCount("acceptedCases");
  const target = tvStrategyData.targetAcceptedCases;
  const rawLeadsCollected = tvStrategyData.rawLeadsCollected || tvStrategyDataCount("rawLeadsCollected");
  const pendingCount = tvStrategyDataCount("supportOnlyCases");
  const excludedCount = tvStrategyDataCount("rejectedCases");
  return `
    <section class="site-data-panel">
      <div class="section-head">
        <div>
          <h2>TradingView 策略案例審核進度</h2>
          <p>案例須通過授權、來源、回測及參數核對，才會列作正式案例；資料未齊者保留為待核對，證據不合格者則不採用。</p>
        </div>
        <span class="site-data-status ${completedCount >= target ? "is-good" : "is-warn"}">${completedCount >= target ? "目標達成" : "審核中"}</span>
      </div>
      <div class="site-data-grid">
        <div class="site-data-metric"><span class="site-data-kpi">${formatCount(rawLeadsCollected)}</span><span class="site-data-label">已收集候選策略 / 目標 ${formatCount(tvStrategyData.rawLeadTarget)}</span></div>
        <div class="site-data-metric"><span class="site-data-kpi">${formatCount(completedCount)}</span><span class="site-data-label">已完成核對 / 目標 ${formatCount(target)}</span></div>
        <div class="site-data-metric"><span class="site-data-kpi">${formatCount(pendingCount)}</span><span class="site-data-label">待完成核對，不計入正式案例</span></div>
        <div class="site-data-metric"><span class="site-data-kpi">${formatCount(excludedCount)}</span><span class="site-data-label">不採用</span></div>
      </div>
      <ul class="site-data-list">
        <li><strong>資料版本</strong><span>${escapeHtml(tvStrategyData.version)}｜${escapeHtml(tvStrategyData.generatedAt.slice(0, 10) || "未標示")}</span></li>
        <li><strong>收集方式</strong><span>先收集 ${formatCount(tvStrategyData.rawLeadTarget)} 個候選策略，再按來源、參數、回測及風險門檻分為已完成核對、待完成核對或不採用。</span></li>
        <li><strong>前台規則</strong><span>來源網址只保留在內部審核資料；策略頁不提供外部連結、iframe 或 TradingView widget。</span></li>
      </ul>
      <p class="site-data-note">${escapeHtml(tvStrategyData.metricFramingZh)}</p>
    </section>
  `;
}

function renderTradingViewStrategyCard(item) {
  const status = safeText(item.includeStatus, "support-only");
  return `
    <article class="info-card route-card compact-indicator-card">
      <span class="lesson-label">${escapeHtml(item.strategyType)} · ${escapeHtml(item.timeframe)}</span>
      <h3>${escapeHtml(item.shortTitle || item.title)}</h3>
      <p class="small">${escapeHtml(shortText(item.displayCaveat, 74))}</p>
      <ul class="fact-list">
        <li><span>PF</span><strong>${escapeHtml(tvStrategyPfText(item))}</strong></li>
        <li><span>交易次數</span><strong>${escapeHtml(tvStrategyMetric(item.trades))}</strong></li>
        <li><span>期間</span><strong>${escapeHtml(shortText(item.backtestPeriod, 34))}</strong></li>
        <li><span>設定</span><strong>${escapeHtml(tvStrategyAuditStatusLabel(safeRecord(item.settingsAudit).status))}</strong></li>
        <li><span>腳本</span><strong>${escapeHtml(tvStrategyScriptStatusLabel(safeRecord(item.pineScript).status))}</strong></li>
      </ul>
      <div class="badge-row">
        <span class="site-data-status ${tvStrategyStatusTone(status)}">${escapeHtml(tvStrategyStatusLabel(status))}</span>
        ${badge(item.market, "blue")}
      </div>
      <a class="button secondary" href="${strategyCaseUrl(item.slug)}">查看審核</a>
    </article>
  `;
}

function tvStrategyAuditStatusLabel(status) {
  const labels = {
    verified: "已核實",
    partial: "部分待核",
    "metadata-only": "只核對基本資料",
    unknown: "未核實",
    not_applicable: "不適用",
  };
  return labels[status] || "待核";
}

function tvStrategyScriptStatusLabel(status) {
  const labels = {
    local_template: "本站教學範本",
    not_available: "不收錄原始碼",
    not_applicable: "不適用",
    "verified-open-source": "已核對公開原始碼",
  };
  return labels[status] || "待核";
}

function tvStrategySourceCodeStatusLabel(status) {
  const labels = {
    local_template_only: "只顯示本站教學範本",
    blocked_invite_only: "受邀腳本，不收錄原始碼",
    blocked_protected: "受保護腳本，不收錄原始碼",
    excluded_unverified: "來源未核實，暫不收錄",
    not_applicable: "不適用",
    included_original_open_source: "已收錄獲准公開的原始碼",
    permissioned_original_source: "已獲原始碼授權",
  };
  return labels[status] || "待核";
}

function renderTradingViewStrategyLibrary() {
  const visibleCases = tradingViewStrategyVisibleCases();
  const excludedCases = tvStrategyData.cases.filter((item) => item.includeStatus === "rejected");
  const completedLibraryCount = tvStrategyDataCount("acceptedCases");
  app.innerHTML = `
    <section class="page-band visual-band">
      <div class="visual-copy">
        <div class="page-title">
          <span class="eyebrow">TradingView 策略案例庫</span>
          <h1 class="tv-strategy-title">策略案例研究庫</h1>
          <p>以下案例用來示範研究步驟，不是推薦名單。目前有 ${formatCount(completedLibraryCount)} 個案例完成來源、設定、回測及風險核對；其餘樣本只作研究示範。</p>
        </div>
        <div class="card-actions">
          <a class="button" href="#/tv-strategies">看審核方法</a>
          <a class="button secondary" href="#/script">看腳本流程</a>
        </div>
      </div>
      ${pageVisual("strategyCases", "本地 TradingView 策略審核表、PF 數字和風險旗標")}
    </section>

    ${renderTradingViewStrategyDatasetPanel()}

    <section>
      <div class="section-head">
        <div>
          <h2>目前可閱讀的審核樣本</h2>
          <p>以下樣本目前只作輔助研究，用來示範收集和審核格式；它們不代表已可交易，也不計入正式案例數。</p>
        </div>
      </div>
      ${
        visibleCases.length
          ? `<div class="card-grid">${visibleCases.map(renderTradingViewStrategyCard).join("")}</div>`
          : `<div class="empty-state"><h2>暫未有可展示樣本</h2><p>資料包已載入，但暫未有可公開展示的研究樣本。</p></div>`
      }
    </section>

    ${renderLessonFold(
      "不採用樣本",
      "展開不採用原因",
      "這些案例只保留作資料質素教材，不計入正式案例。",
      `
        <section>
          <div class="card-grid">
            ${excludedCases.map(renderTradingViewStrategyCard).join("")}
          </div>
        </section>
      `,
    )}

    ${renderLessonFold(
      "研究標準",
      "展開選案標準和可信度尺規",
      "需要判斷回測質素時再打開。",
      `
        ${renderStrategyCaseSelectionGuide()}
        ${renderStrategyReliabilityRubric()}
      `,
    )}
  `;
}

function renderTradingViewInputParameterTable(item) {
  const rows = safeArray(item.inputParameters).length ? safeArray(item.inputParameters) : safeArray(item.parameters);
  if (!rows.length) return `<p class="small">未有足夠公開參數；此列不能成為正式案例。</p>`;
  return `
    <table class="comparison-table tv-settings-table">
      <tbody>
        ${rows
          .map((param) => {
            const record = safeRecord(param);
            return `
              <tr>
                <th>${escapeHtml(safeText(record.name, "參數"))}</th>
                <td>
                  <strong>${escapeHtml(tvStrategyMetric(record.value))}</strong>
                  <span>${escapeHtml(safeText(record.role, "待分類"))}｜${escapeHtml(tvStrategyAuditStatusLabel(safeText(record.status, "partial")))}</span>
                  ${record.source ? `<em>${escapeHtml(safeText(record.source, ""))}</em>` : ""}
                </td>
              </tr>
            `;
          })
          .join("")}
      </tbody>
    </table>
  `;
}

function renderTradingViewParameterTable(parameters) {
  const rows = safeArray(parameters);
  if (!rows.length) return `<p class="small">未有足夠公開參數；此列不能成為正式案例。</p>`;
  return `
    <table class="comparison-table">
      <tbody>
        ${rows
          .map((param) => {
            const record = safeRecord(param);
            return `
              <tr>
                <th>${escapeHtml(safeText(record.name, "參數"))}</th>
                <td><strong>${escapeHtml(tvStrategyMetric(record.value))}</strong><span>${escapeHtml(safeText(record.role, "待分類"))}｜${escapeHtml(safeText(record.status, "review"))}</span></td>
              </tr>
            `;
          })
          .join("")}
      </tbody>
    </table>
  `;
}

function renderTradingViewStrategyProperties(item) {
  const settings = safeRecord(item.settingsAudit);
  const properties = safeRecord(item.strategyProperties);
  const gaps = safeArray(settings.gaps);
  const propertyLabels = {
    initialCapital: "初始資金",
    baseCurrency: "基礎貨幣",
    orderSize: "下單數量",
    pyramiding: "加倉設定",
    commission: "手續費",
    slippage: "滑價",
    fillAssumptions: "成交假設／Bar Magnifier",
    margin: "保證金設定",
    recalculation: "重新計算設定",
  };
  const rows = Object.entries(propertyLabels)
    .map(([key, label]) => ({ key, label, value: properties[key] }))
    .filter((row) => row.value !== undefined);
  if (!rows.length) {
    return `<p class="small">此案例未建立 Strategy Properties；拒收或非策略案例不會計入 100。</p>`;
  }
  return `
    <div class="tv-audit-summary">
      <span class="site-data-status is-warn">${escapeHtml(tvStrategyAuditStatusLabel(safeText(settings.status, "partial")))}</span>
      <p>${escapeHtml(safeText(settings.basis, "列作正式案例前，須核對策略屬性（Properties）、輸入參數（Inputs）及策略測試報告（Strategy Report）。"))}</p>
    </div>
    <table class="comparison-table tv-settings-table">
      <tbody>
        ${rows
          .map((row) => `
            <tr>
              <th>${escapeHtml(row.label)}</th>
              <td><strong>${escapeHtml(tvStrategyMetric(row.value))}</strong></td>
            </tr>
          `)
          .join("")}
      </tbody>
    </table>
    ${
      gaps.length
        ? `<ul class="plain-list tv-gap-list">${gaps.map((gap) => `<li>${escapeHtml(tvStrategyMetric(gap))}</li>`).join("")}</ul>`
        : ""
    }
  `;
}

function renderTradingViewScriptAudit(item) {
  const scriptAccess = safeRecord(item.scriptAccess);
  const pineScript = safeRecord(item.pineScript);
  const code = safeText(pineScript.code, "");
  const renderPolicy = safeText(scriptAccess.renderPolicy, "");
  const canRenderCode =
    Boolean(code) && ["render_local_template_with_warning", "render_verified_original_source"].includes(renderPolicy);
  return `
    <div class="tv-audit-summary">
      <span class="site-data-status ${canRenderCode ? "is-warn" : "is-info"}">${escapeHtml(tvStrategyScriptStatusLabel(safeText(pineScript.status, "not_available")))}</span>
      <p>${escapeHtml(safeText(pineScript.reviewWarningZh, "Pine Script 原碼需要授權和人工核實後才可收錄。"))}</p>
    </div>
    <ul class="site-data-list">
      <li><strong>原碼狀態</strong><span>${escapeHtml(tvStrategySourceCodeStatusLabel(safeText(scriptAccess.sourceCodeStatus, "unknown")))}</span></li>
      <li><strong>可見性</strong><span>${escapeHtml(safeText(scriptAccess.visibility, "unknown"))}</span></li>
      <li><strong>授權</strong><span>${escapeHtml(safeText(scriptAccess.licenseStatus, "unknown"))}</span></li>
      <li><strong>署名</strong><span>${escapeHtml(safeText(scriptAccess.attribution, "待補"))}</span></li>
      <li><strong>審核日期</strong><span>${escapeHtml(safeText(scriptAccess.checkedAt, "未標示"))}</span></li>
    </ul>
    ${
      canRenderCode
        ? `
          <div class="tv-code-panel">
            <div class="tv-code-head">
              <strong>本地 Pine 教學骨架</strong>
              <span>${escapeHtml(safeText(pineScript.pineVersion, "Pine"))}</span>
            </div>
            <pre><code>${escapeHtml(code)}</code></pre>
          </div>
        `
        : `<p class="site-data-note">${escapeHtml(safeText(pineScript.unavailableReason, "未有可收錄腳本。"))}</p>`
    }
  `;
}

function renderTradingViewRules(rules) {
  const rows = safeArray(rules);
  if (!rows.length) return `<p class="small">未有足夠公開規則；此列不能成為正式案例。</p>`;
  return `
    <ul class="plain-list">
      ${rows
        .map((rule) => {
          const record = safeRecord(rule);
          return `<li><strong>${escapeHtml(safeText(record.phase, "review"))}：</strong>${escapeHtml(safeText(record.text, "待補規則"))}</li>`;
        })
        .join("")}
    </ul>
  `;
}

function renderTradingViewRubricBadges(item) {
  const labels = {
    trueData: "真實數據",
    sampleSize: "樣本數",
    pfCredible: "PF 可信度",
    drawdownPresent: "回撤",
    periodPresent: "期間",
    parametersComplete: "參數",
    costsModeled: "成本",
    marketTimeframePresent: "市場/週期",
    oosCaveat: "樣本外",
    sourceApproved: "來源",
  };
  const badges = Object.entries(safeRecord(item.rubricBadges));
  if (!badges.length) return "";
  return `
    <ul class="site-data-list">
      ${badges
        .map(([key, value]) => `<li><strong>${escapeHtml(labels[key] || key)}</strong><span>${escapeHtml(tvStrategyMetric(value))}</span></li>`)
        .join("")}
    </ul>
  `;
}

function renderTradingViewStrategyCaseDetail(item) {
  const evidence = tradingViewStrategyEvidenceFor(item);
  const status = safeText(item.includeStatus, "support-only");
  app.innerHTML = `
    <section class="page-band detail-header tv-strategy-detail-header">
      <div class="breadcrumbs">
        <a href="#/">首頁</a><span>/</span><a href="#/strategy-cases">策略案例庫</a><span>/</span><span>${escapeHtml(item.shortTitle || item.title)}</span>
      </div>
      <div class="card-top">
        <div class="page-title">
          <span class="eyebrow">${escapeHtml(item.strategyType)} · ${escapeHtml(item.timeframe)}</span>
          <h1>${escapeHtml(item.title)}</h1>
          <p>${escapeHtml(item.displayCaveat)}</p>
        </div>
        <a class="button" href="#/tv-strategies">看審核方法</a>
      </div>
      <div class="badge-row">
        <span class="site-data-status ${tvStrategyStatusTone(status)}">${escapeHtml(tvStrategyStatusLabel(status))}</span>
        ${badge(`PF ${tvStrategyPfText(item)}`, "blue")}
        ${badge(item.market, "orange")}
      </div>
    </section>

    <section class="content-grid">
      <div class="stack">
        <article class="review-panel">
          <span class="lesson-label">回測框架</span>
          <h2>先把數字降回證據</h2>
          <p>${escapeHtml(tvStrategyData.metricFramingZh)}</p>
          <table class="comparison-table">
            <tbody>
              <tr><th>標的 / 週期</th><td>${escapeHtml(item.symbol)} · ${escapeHtml(item.timeframe)}</td></tr>
              <tr><th>圖表類型</th><td>${escapeHtml(item.chartType)}</td></tr>
              <tr><th>PF</th><td>${escapeHtml(tvStrategyPfText(item))}</td></tr>
              <tr><th>勝率</th><td>${escapeHtml(tvStrategyMetric(item.winRate))}</td></tr>
              <tr><th>交易次數</th><td>${escapeHtml(tvStrategyMetric(item.trades))}</td></tr>
              <tr><th>最大回撤</th><td>${escapeHtml(tvStrategyMetric(item.maxDrawdown))}</td></tr>
              <tr><th>回測期間</th><td>${escapeHtml(item.backtestPeriod)}</td></tr>
            </tbody>
          </table>
        </article>

        <article class="info-card">
          <span class="lesson-label">參數</span>
          <h2>Inputs 參數設定</h2>
          ${renderTradingViewInputParameterTable(item)}
        </article>

        <article class="info-card">
          <span class="lesson-label">Strategy Properties</span>
          <h2>回測設置與成本欄位</h2>
          ${renderTradingViewStrategyProperties(item)}
        </article>

        <article class="info-card">
          <span class="lesson-label">Pine Script</span>
          <h2>腳本收錄狀態</h2>
          ${renderTradingViewScriptAudit(item)}
        </article>

        <article class="info-card">
          <span class="lesson-label">規則</span>
          <h2>目前只可寫成審核規則</h2>
          ${renderTradingViewRules(item.rules)}
        </article>

        <article class="danger-card">
          <span class="lesson-label">審核結論</span>
          <h2>為何未必能計入 100</h2>
          <p>${escapeHtml(item.displayCaveat)}</p>
          <ul class="plain-list">
            ${safeArray(item.qualityFlags).map((flag) => `<li>${escapeHtml(flag)}</li>`).join("")}
          </ul>
        </article>
      </div>

      <aside class="stack">
        <article class="trade-card">
          <span class="lesson-label">來源證據</span>
          <h2>來源只作本地審核</h2>
          <ul class="fact-list">
            <li><span>作者</span><strong>${escapeHtml(item.author)}</strong></li>
            <li><span>來源</span><strong>${escapeHtml(item.sourceName)}</strong></li>
            <li><span>可見性</span><strong>${escapeHtml(safeText(evidence.visibility, "unknown"))}</strong></li>
            <li><span>授權狀態</span><strong>${escapeHtml(safeText(evidence.licenseStatus, "unknown"))}</strong></li>
            <li><span>檢查日期</span><strong>${escapeHtml(safeText(evidence.sourceCheckedAt, "未標示"))}</strong></li>
          </ul>
          <p class="small">來源網址保留於資料包的 audit-only 欄位；此頁不提供外部連結、不嵌入 TradingView widget，也不複製 Pine Script 全文。</p>
        </article>

        <article class="site-data-panel">
          <span class="lesson-label">Rubric badges</span>
          <h2>本地驗證旗標</h2>
          ${renderTradingViewRubricBadges(item)}
        </article>

        ${renderStrategyValidationPanel()}
      </aside>
    </section>
  `;
}

function renderStrategyCases() {
  if (tvStrategyData.loaded) {
    renderTradingViewStrategyLibrary();
    return;
  }
  app.innerHTML = `
    <section class="page-band visual-band">
      <div class="visual-copy">
        <div class="page-title">
          <span class="eyebrow">策略案例庫</span>
          <h1>先審核，再學策略</h1>
          <p>先看來源、參數、回測設定和失效條件，再決定案例是否值得研究。</p>
        </div>
        <div class="card-actions">
          <a class="button" href="#/script">看腳本</a>
          <a class="button secondary" href="#/tv-strategies">學回測檢查</a>
        </div>
      </div>
      ${pageVisual("strategyCases", "高 PF 策略研究列表、回測數據和交易規則筆記")}
    </section>

    <section class="site-data-panel">
      <div class="section-head">
        <div>
          <h2>TradingView 策略資料包未載入</h2>
          <p>正式案例庫需要本地 JSON/JS 資料包；未載入時不使用舊版外部來源清單作替代。</p>
        </div>
        <span class="site-data-status is-warn">未載入</span>
      </div>
    </section>
    ${renderLessonFold(
      "研究標準",
      "展開選案標準和可信度尺規",
      "需要判斷回測質素時再打開。",
      `
        ${renderStrategyCaseSelectionGuide()}
        ${renderStrategyReliabilityRubric()}
      `,
    )}
  `;
}

function renderStrategyCaseDetail(slug) {
  const item = getStrategyCase(slug);
  if (!item) {
    app.innerHTML = `
      <section class="empty-state">
        <h1>找不到這個策略案例</h1>
        <p>可能是網址拼寫不同，請回到策略案例庫再選一次。</p>
        <a class="button" href="#/strategy-cases">返回策略案例庫</a>
      </section>
    `;
    return;
  }
  const profile = getStrategyCaseProfile(item);

  app.innerHTML = `
    <section class="page-band detail-header">
      <div class="breadcrumbs">
        <a href="#/">首頁</a><span>/</span><a href="#/strategy-cases">策略案例庫</a><span>/</span><span>${escapeHtml(item.shortTitle)}</span>
      </div>
      <div class="card-top">
        <div class="page-title">
          <span class="eyebrow">${escapeHtml(item.type)} · ${escapeHtml(item.timeframe)}</span>
          <h1>${escapeHtml(item.title)}</h1>
          <p>${escapeHtml(item.summary)}</p>
        </div>
        <a class="button" href="#/trial">申請腳本試用</a>
      </div>
      <div class="badge-row">
        ${badge(`PF ${item.pf}`, "blue")}
        ${badge(`勝率 ${item.winRate}`, "blue")}
        ${badge(item.market, "orange")}
      </div>
    </section>

    <section class="content-grid">
      <div class="stack">
        ${renderStrategyCaseArticleIntro(item, profile)}

        <article class="info-card">
          <span class="lesson-label">交易邏輯</span>
          <h2>它想捕捉哪一段行情？</h2>
          <ul class="plain-list">
            ${item.logic.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}
          </ul>
        </article>

        <article class="review-panel">
          <span class="lesson-label">用法</span>
          <h2>放到 TradingView 的用法</h2>
          <ul class="plain-list">
            ${item.usage.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}
          </ul>
        </article>

        ${renderStrategyExecutionFlow(profile)}

        <article class="info-card">
          <span class="lesson-label">參數設定</span>
          <h2>可回測的條件</h2>
          <table class="comparison-table">
            <tbody>
              ${item.parameters
                .map(([key, value]) => `<tr><th>${escapeHtml(key)}</th><td>${escapeHtml(value)}</td></tr>`)
                .join("")}
            </tbody>
          </table>
        </article>

        <article class="info-card">
          <span class="lesson-label">測試數據</span>
          <h2>公開來源列出的數字</h2>
          <ul class="fact-list">
            ${item.stats
              .map(([key, value]) => `<li><span>${escapeHtml(key)}</span><strong>${escapeHtml(value)}</strong></li>`)
              .join("")}
          </ul>
        </article>

        ${renderStrategyBacktestChecklist(profile)}

        ${renderStrategyTradingViewBuild(profile)}
      </div>

      <aside class="stack">
        <article class="trade-card">
          <span class="lesson-label">策略快照</span>
          <h2>策略摘要</h2>
          ${renderStrategyCaseTable(item)}
        </article>
        ${renderStrategyMarketFit(profile)}
        ${renderStrategyValidationPanel()}
        <article class="danger-card">
          <span class="lesson-label">注意事項</span>
          <h2>不要只看 PF</h2>
          <ul class="plain-list">
            ${item.cautions.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}
          </ul>
        </article>
        ${renderStrategyArticleOutline(profile)}
        ${renderStrategyConversionBridge(profile)}
      </aside>
    </section>
  `;
}

function renderStrategyCaseDetailCompact(slug) {
  const tvItem = getTradingViewStrategyCase(slug);
  if (tvItem) {
    renderTradingViewStrategyCaseDetail(tvItem);
    return;
  }
  app.innerHTML = `
    <section class="empty-state">
      <h1>找不到策略案例</h1>
      <p>這個 slug 未有納入本地 TradingView 策略資料包；本站不再用舊版外部來源清單作替代。</p>
      <a class="button" href="#/strategy-cases">返回案例庫</a>
    </section>
  `;
  return;
}

function renderScriptSignalModules() {
  const modules = [
    ["市況濾網", "先判斷趨勢、震盪、突破或高波動環境，避免把同一套訊號套用到所有市況。"],
    ["多指標共振", "把均線、動能、成交量和波動分工處理，只在不同證據方向一致時提高訊號級別。"],
    ["假突破降級", "突破後若成交量不足、價格收回關鍵位或風險回報變差，訊號會由交易候選降為觀察。"],
    ["ATR 風險距離", "用波動率估算止蝕距離和倉位壓力，避免每隻股票都用同一個固定百分比。"],
    ["Alert 提醒", "把條件變成 TradingView alert，等訊號成熟，而不是長時間盯圖追價。"],
    ["交易前檢查", "入場、止蝕、目標、R 值和失效條件同時出現，才算完成一張可執行劇本。"],
  ];

  return `
    <section>
      <div class="section-head">
        <div>
          <h2>少畫無用線，多問關鍵問題</h2>
          <p>每個模組只管一件事：市況配不配合、訊號熟不熟、風險值不值得承受。</p>
        </div>
      </div>
      <div class="card-grid">
        ${modules
          .map(
            ([title, body], index) => `
              <article class="info-card route-card">
                <span class="lesson-label">模組 ${index + 1}</span>
                <h3>${escapeHtml(title)}</h3>
                <p class="small">${escapeHtml(body)}</p>
              </article>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderScriptWorkflow() {
  const steps = [
    ["讀市況", "先判斷現在適合趨勢跟隨、區間交易、突破觀察，還是應該降低交易頻率。"],
    ["讀位置", "只在支撐、阻力、回踩、突破位或波動壓縮區附近提高訊號價值。"],
    ["讀共振", "不同角色的指標同向才升級；同類指標重複同意不會被當成三票。"],
    ["讀風險", "計算止蝕距離、2R 目標和失效條件，不讓漂亮訊號蓋過風險回報。"],
    ["設提醒", "把成熟條件設成 alert，等市場觸發，而不是臨場追價。"],
  ];

  return `
    <article class="review-panel">
      <span class="lesson-label">使用流程</span>
      <h2>打開圖表後，照這個次序看</h2>
      <div class="timeline-list">
        ${steps
          .map(
            ([title, body]) =>
              `<div><strong>${escapeHtml(title)}</strong><span>${escapeHtml(body)}</span></div>`,
          )
          .join("")}
      </div>
    </article>
  `;
}

function renderScriptPineBlueprint() {
  const settings = [
    ["市場模式", "趨勢、區間、突破、高波動", "決定哪些訊號可升級，哪些只能觀察。"],
    ["趨勢濾網", "EMA / SMA / Ichimoku", "先排除逆勢追入和無結構交易。"],
    ["動能條件", "RSI / MACD / KDJ", "只看力度是否改善，不把超買超賣當命令。"],
    ["成交量確認", "Volume / OBV / VWAP", "判斷突破或回踩是否得到市場接受。"],
    ["風險距離", "ATR / 前高前低 / 結構位", "輸出止蝕、2R 目標和倉位壓力。"],
  ];
  return `
    <article class="info-card">
      <span class="lesson-label">Pine 架構</span>
      <h2>腳本應先輸出檢查結果，不是只畫買賣箭嘴</h2>
      <div class="formula">marketOK = trendFilter and regimeFilter<br />signalOK = momentumTurn and volumeConfirm<br />riskOK = rewardRisk &gt;= 2 and stopDistanceAcceptable<br />tradeCandidate = marketOK and signalOK and riskOK</div>
      <p class="small">這個架構的重點，是把交易拆成三個門檻：市況是否允許、訊號是否成熟、風險是否值得。任何一項不合格，圖表上最多只顯示觀察，不顯示交易候選。</p>
      <table class="comparison-table">
        <tbody>
          ${settings
            .map(
              ([name, input, output]) => `
                <tr>
                  <th>${escapeHtml(name)}</th>
                  <td><strong>${escapeHtml(input)}</strong><span>${escapeHtml(output)}</span></td>
                </tr>
              `,
            )
            .join("")}
        </tbody>
      </table>
    </article>
  `;
}

function renderScriptAlertChecklist() {
  return `
    <article class="review-panel">
      <span class="lesson-label">警報條件</span>
      <h2>Alert 只提醒成熟條件，不提醒情緒</h2>
      <ul class="plain-list">
        <li>候選訊號：市況、位置、動能、成交量和 R 值同時合格，才發出主要提醒。</li>
        <li>降級訊號：突破後跌回區間、成交量不足、止蝕距離過大，提醒改為觀察。</li>
        <li>取消訊號：跌穿失效位、重新收回關鍵位、風險回報低於門檻，提醒放棄原劇本。</li>
        <li>復盤訊號：交易後記錄觸發條件、執行價格、滑價和是否照規則離場。</li>
      </ul>
    </article>
  `;
}

function renderScriptDemoReviewProtocol() {
  const rows = [
    ["看到訊號", "先問它屬於趨勢、區間、突破還是反轉，不急著判斷買賣。"],
    ["檢查失效", "寫出哪個價位會證明你看錯，沒有失效位就不做。"],
    ["計算 R 值", "止蝕距離過大時，縮倉或放棄，不用找更多指標說服自己。"],
    ["交易後復盤", "記錄訊號是否成熟、是否追價、是否遵守取消條件。"],
  ];
  return `
    <section class="page-band">
      <div class="section-head">
        <div>
          <h2>示範頁閱讀流程</h2>
          <p>每個場景都要按同一套流程讀，否則你只是在挑自己想看的訊號。</p>
        </div>
      </div>
      <div class="timeline-list">
        ${rows
          .map(([title, body]) => `<div><strong>${escapeHtml(title)}</strong><span>${escapeHtml(body)}</span></div>`)
          .join("")}
      </div>
      <div class="card-grid">
        <article class="info-card">
          <span class="lesson-label">輸出標準</span>
          <h3>好提示要同時說清楚三件事</h3>
          <p class="small">第一，現在是候選、觀察、降級還是取消；第二，哪個條件令訊號升級或失效；第三，止蝕和 2R 目標是否仍合理。若三項不能同時回答，提示只算提醒，不算交易計劃。</p>
        </article>
        <article class="danger-card">
          <span class="lesson-label">錯誤示範</span>
          <h3>只畫箭嘴是不夠的</h3>
          <p class="small">箭嘴只告訴你曾經觸發條件，不能告訴你交易是否仍有風險回報。真正有用的示範，必須同時展示取消條件和放棄交易的場景，尤其要展示訊號出現但不值得交易的例子。</p>
        </article>
      </div>
    </section>
  `;
}

function renderTrialExpectationGuide() {
  return `
    <article class="review-panel">
      <span class="lesson-label">試用標準</span>
      <h2>試用期要驗證三件事</h2>
      <ul class="plain-list">
        <li>你是否真的減少追價，而不是多了一個追價理由。</li>
        <li>Alert 是否有助按紀律等待條件成熟，而非令交易變得更頻密。</li>
        <li>每次訊號取消時，你是否能接受放棄，不再臨場改規則。</li>
      </ul>
      <p class="small">試用成功的標準不是一兩筆交易賺錢，而是交易流程變得更穩定、更少衝動、更清楚知道何時不用。</p>
    </article>
  `;
}

function renderTrialReadinessGuide() {
  return `
    <section class="page-band">
      <div class="section-head">
        <div>
          <h2>申請試用前先準備</h2>
          <p>準備得越清楚，試用越能判斷腳本是否真的改善你的流程，而不是只看一兩次訊號是否賺錢。</p>
        </div>
      </div>
      <div class="card-grid">
        <article class="info-card">
          <span class="lesson-label">準備一</span>
          <h3>列出常犯錯誤</h3>
          <p class="small">例如追突破、太早止賺、止蝕太慢、指標互相矛盾。試用時只看這些錯誤是否減少。</p>
        </article>
        <article class="info-card">
          <span class="lesson-label">準備二</span>
          <h3>選定主要市場</h3>
          <p class="small">港股、美股、ETF、指數的波動和流動性不同，不要用一個市場的觀察直接套到另一個市場。</p>
        </article>
        <article class="danger-card">
          <span class="lesson-label">準備三</span>
          <h3>先定停用條件</h3>
          <p class="small">若交易變得更頻密、過度依賴訊號，連計劃也少寫，便代表試用方向有誤，應暫停並復盤。好的工具應該減少欠缺理據的交易，而非加快入市。</p>
        </article>
      </div>
    </section>
  `;
}

function renderScriptSystem() {
  app.innerHTML = `
    <section class="page-band visual-band">
      <div class="visual-copy">
        <div class="page-title">
          <span class="eyebrow">TradingView 自研腳本</span>
          <h1>把檢查流程放到圖表上</h1>
          <p>腳本只提示條件是否成熟，不替你買賣，也不保證結果。</p>
        </div>
        <div class="badge-row">
          ${badge("趨勢濾網", "blue")}
          ${badge("多指標共振", "blue")}
          ${badge("風險距離", "orange")}
          ${badge("Alert 提醒", "blue")}
          ${badge("不保證盈利", "orange")}
        </div>
        <div class="card-actions">
          <a class="button" href="#/trial">申請試用</a>
          <a class="button secondary" href="#/strategy-cases">看策略案例</a>
        </div>
      </div>
      ${pageVisual("scriptSystem", "TradingView 圖表、訊號面板和風險檢查清單")}
    </section>

    <section class="page-band">
      ${compactActionList([
        { label: "先確認", title: "它只做檢查", body: "不替你買賣，只提醒條件是否成熟。", href: "#/script-demo" },
        { label: "看案例", title: "實戰示範", body: "同一訊號在不同市況下會不同。", href: "#/script-demo" },
        { label: "想試用", title: "申請試用", body: "先確認適合你的交易流程。", href: "#/trial" },
      ])}
    </section>

    ${renderLessonFold(
      "完整介紹",
      "展開腳本流程、模組和使用邊界",
      "先看上面的三個入口；需要細讀再展開。",
      `
    <section class="content-grid">
      <div class="stack">
        ${renderScriptWorkflow()}
        <article class="info-card">
          <span class="lesson-label">為甚麼要用</span>
          <h2>指標太多時，先分工</h2>
          <p class="small">很多人不是不懂 RSI、MACD、均線和成交量，而是全部打開後，每個指標都像在講不同故事。這套腳本會先替它們分工：誰看背景、誰看力度、誰看確認、誰負責風險。</p>
          <ul class="plain-list">
            <li>不把單一金叉、超買或超賣包裝成交易指令。</li>
            <li>不鼓勵重倉追逐訊號，先確認錯了在哪裡離場。</li>
            <li>把前面的判斷框架，變成圖表上的條件提示。</li>
          </ul>
        </article>
        ${renderScriptPineBlueprint()}
        ${renderScriptAlertChecklist()}
        <article class="danger-card">
          <span class="lesson-label">誠信邊界</span>
          <h2>使用前要知道的邊界</h2>
          <ul class="plain-list">
            <li>不承諾固定勝率、固定月回報或任何保證盈利。</li>
            <li>不要把腳本說成能替代倉位管理、止蝕和交易紀律。</li>
            <li>不把歷史回測曲線直接當成未來實盤結果。</li>
          </ul>
        </article>
      </div>
      <aside class="stack">
        <article class="trade-card">
          <span class="lesson-label">適合誰</span>
          <h2>適合已懂基本指標，但經常臨場改判斷的人</h2>
          <ul class="plain-list">
            <li>會看 RSI、MACD、均線，但經常臨場改判斷。</li>
            <li>想用 TradingView alert 減少盯盤和追價。</li>
            <li>需要把入場、止蝕、目標和失效點寫清楚。</li>
          </ul>
        </article>
        <article class="info-card">
          <span class="lesson-label">購買前先問</span>
          <h2>你能不能接受它不會替你下決定？</h2>
          <p class="small">如果你想要一個按鈕直接告訴你買或賣，這套腳本不適合。它更像一張嚴格的交易前清單：市況合不合、訊號夠不夠、止蝕在哪裡，逐項檢查。</p>
          <div class="card-actions">
            <a class="button secondary" href="#/combo">先檢查指標組合</a>
            <a class="button secondary" href="#/journal">寫交易日誌</a>
          </div>
        </article>
      </aside>
    </section>

    ${renderScriptSignalModules()}
      `,
    )}
  `;
}

function renderScriptDemo() {
  const scenarios = [
    {
      title: "趨勢回踩",
      market: "價格在上升均線之上，回踩不破，成交量縮後重新轉強。",
      script: "市況濾網通過，動能重新改善，腳本把訊號列為候選，但仍要求止蝕和 2R 目標。",
      caution: "若回踩直接跌穿前低，訊號取消，不用再找其他指標安慰自己。",
    },
    {
      title: "假突破",
      market: "價格突破前高，但成交量不足，兩日內跌回原區間。",
      script: "突破訊號被降級，提醒交易者等待重新站回關鍵位，而不是追入後硬撐。",
      caution: "突破不是買入理由；被市場拒絕的新價格，要先保護本金。",
    },
    {
      title: "震盪區間",
      market: "價格在支撐阻力中間反覆來回，RSI 和 MACD 經常短線翻轉。",
      script: "市況標記為低趨勢性，降低追突破權重，提醒只在區間邊緣才有較好風險回報。",
      caution: "區間中間的訊號最容易令人來回被打。",
    },
    {
      title: "動能背離",
      market: "價格創新高，但動能沒有同步創高，成交量亦沒有跟上。",
      script: "腳本把背離列為早期警號，不直接提示做空；要等跌破小平台才確認。",
      caution: "背離只是警號，不是立即反轉的保證。",
    },
  ];

  app.innerHTML = `
    <section class="page-band visual-band">
      <div class="visual-copy">
        <div class="page-title">
          <span class="eyebrow">腳本實戰示範</span>
          <h1>同一訊號，不同結論</h1>
          <p>先看市況，再看提示。</p>
        </div>
        <div class="card-actions">
          <a class="button" href="#/trial">申請試用</a>
          <a class="button secondary" href="#/script">返回腳本介紹</a>
        </div>
      </div>
      ${pageVisual("scriptDemo", "TradingView 實戰案例圖表和訊號檢查框")}
    </section>

    <section class="page-band">
      <div class="section-head">
        <div>
          <h2>四個常見場景</h2>
        </div>
      </div>
      ${compactStepList(scenarios.map((item, index) => ({
        step: String(index + 1),
        title: item.title,
        body: item.caution,
        max: 40,
      })))}
    </section>

    ${renderLessonFold(
      "完整示範",
      "展開閱讀流程和風險邊界",
      "需要細看每個場景時再打開。",
      `
        ${renderScriptDemoReviewProtocol()}
        <section class="content-grid">
          <article class="info-card">
            <span class="lesson-label">教學延伸</span>
            <h2>指標看懂後，下一步是檢查條件</h2>
            <p class="small">以 RSI 為例，重點不是單純超買超賣，而是它出現在甚麼趨勢、甚麼位置。</p>
            <div class="card-actions">
              <a class="button secondary" href="${indicatorUrl("rsi")}">看 RSI</a>
              <a class="button secondary" href="${indicatorUrl("macd")}">看 MACD</a>
            </div>
          </article>
          <article class="danger-card">
            <span class="lesson-label">風險邊界</span>
            <h2>不能誤解</h2>
            <ul class="plain-list">
              <li>不要用單一大賺案例暗示腳本長期必勝。</li>
              <li>不要只畫入場箭嘴，要同時畫出取消訊號和失效條件。</li>
              <li>不要隱藏虧損場景；真實風險教育更能建立信任。</li>
            </ul>
          </article>
        </section>
      `,
    )}
  `;
}

function selectedAttr(current, value) {
  return current === value ? "selected" : "";
}

function renderScriptTrial() {
  const lead = storageGet("ti-script-trial", {}) || {};
  const plans = [
    ["Basic", "適合先建立交易流程", "趨勢背景、基礎共振提示、簡單 alert、安裝教學。"],
    ["Pro", "完整交易流程", "多指標共振、假突破降級、ATR 風險距離、完整 alert 條件。"],
    ["Elite", "進階支援方案", "Pro 功能加每週案例拆解、腳本設定教學和優先支援。"],
  ];

  app.innerHTML = `
    <section class="page-band visual-band">
      <div class="visual-copy">
        <div class="page-title">
          <span class="eyebrow">試用與方案</span>
          <h1>申請腳本試用</h1>
          <p>先試用，再決定是否適合。</p>
        </div>
      </div>
      ${pageVisual("scriptTrial", "TradingView 試用申請、方案卡和授權流程")}
    </section>

    <section class="content-grid">
      <form class="info-card" data-action="script-trial">
        <span class="lesson-label">申請試用</span>
        <h2>留下試用資料</h2>
        <div class="form-grid">
          <label>電郵
            <input class="field" type="email" name="email" value="${escapeHtml(lead.email || "")}" placeholder="your@email.com" required />
          </label>
          <label>TradingView 用戶名稱
            <input class="field" name="tvUser" value="${escapeHtml(lead.tvUser || "")}" placeholder="例：your_tv_name" required />
          </label>
          <label>主要市場
            <select class="select" name="market">
              <option value="港股" ${selectedAttr(lead.market, "港股")}>港股</option>
              <option value="美股" ${selectedAttr(lead.market, "美股")}>美股</option>
              <option value="ETF / 指數" ${selectedAttr(lead.market, "ETF / 指數")}>ETF / 指數</option>
              <option value="多市場" ${selectedAttr(lead.market, "多市場")}>多市場</option>
            </select>
          </label>
          <label>交易風格
            <select class="select" name="style">
              <option value="波段交易" ${selectedAttr(lead.style, "波段交易")}>波段交易</option>
              <option value="短線交易" ${selectedAttr(lead.style, "短線交易")}>短線交易</option>
              <option value="中長線" ${selectedAttr(lead.style, "中長線")}>中長線</option>
              <option value="仍在學習" ${selectedAttr(lead.style, "仍在學習")}>仍在學習</option>
            </select>
          </label>
        </div>
        <label class="single-field">最想改善的問題
          <textarea class="field note-field" name="goal" placeholder="例：經常追突破、止蝕太闊、指標互相矛盾...">${escapeHtml(lead.goal || "")}</textarea>
        </label>
        <button class="button" type="submit">儲存試用申請</button>
        ${
          state.trialSaved
            ? `<div class="result-panel result-good"><strong>已儲存</strong><span>試用資料已保存。你可以稍後再補充，或按正常流程安排試用。</span></div>`
            : lead.email
              ? `<div class="result-panel result-warn"><strong>已有申請草稿</strong><span>目前保存：${escapeHtml(lead.email)}｜${escapeHtml(lead.tvUser || "未填 TradingView 用戶名稱")}</span></div>`
              : ""
        }
      </form>

      <aside class="stack">
        <article class="notice">
          <strong>使用風險提醒</strong>
          <p class="small">腳本只是輔助工具，不承諾盈利。</p>
        </article>
      </aside>
    </section>

    ${renderLessonFold(
      "方案與流程",
      "展開試用標準、購買流程和方案比較",
      "需要了解方案時再打開。",
      `
        <section class="content-grid">
          ${renderTrialExpectationGuide()}
          <article class="trade-card">
            <span class="lesson-label">流程</span>
            <h2>由試用到啟用</h2>
            ${compactStepList([
              { step: "1", title: "申請", body: "留下電郵和 TradingView 名稱。" },
              { step: "2", title: "確認", body: "明白腳本只做輔助。" },
              { step: "3", title: "授權", body: "安排 invite-only script。" },
            ])}
          </article>
        </section>
        ${renderTrialReadinessGuide()}
        <section>
          <div class="section-head"><div><h2>方案比較</h2></div></div>
          <div class="card-grid">
            ${plans
              .map(
                ([name, label, body], index) => `
                  <article class="${index === 1 ? "trade-card" : "info-card"} route-card compact-indicator-card">
                    <span class="lesson-label">${escapeHtml(label)}</span>
                    <h3>${escapeHtml(name)}</h3>
                    <p class="small">${escapeHtml(shortText(body, 38))}</p>
                    <a class="button ${index === 1 ? "" : "secondary"}" href="#/trial">申請 ${escapeHtml(name)}</a>
                  </article>
                `,
              )
              .join("")}
          </div>
        </section>
      `,
    )}
  `;
}

function renderTradingViewStrategies() {
  app.innerHTML = `
    <section class="page-band visual-band">
      <div class="visual-copy">
        <div class="page-title">
          <span class="eyebrow">策略研究</span>
          <h1>利潤因子高，不代表適合實際交易</h1>
          <p>回測只是壓力測試。要看交易次數、成本、滑價、樣本期和參數是否講得清楚。</p>
        </div>
      </div>
      ${pageVisual("tvStrategies", "策略回測研究工作桌面、模糊程式碼畫面和回測報告")}
    </section>

    <section class="page-band">
      ${compactActionList([
        { label: "先檢查", title: "回測可信度", body: "交易次數、回撤、PF 先過關。", href: "#/tv-strategies" },
        { label: "看案例", title: "策略案例", body: "只研究有清楚邏輯的策略。", href: "#/strategy-cases" },
        { label: "下一步", title: "自研腳本", body: "把檢查流程放到圖表。", href: "#/script" },
      ])}
    </section>

    ${renderTradingViewStrategyDatasetPanel()}

    ${renderLessonFold(
      "完整研究",
      "展開回測流程、紅旗和 Pine Script 範例",
      "先看上面的三個入口；需要完整研究流程再展開。",
      `
    <section class="content-grid">
      <div class="stack">
        ${renderStrategyResearchLab()}

        <article class="info-card">
          <span class="lesson-label">研究流程</span>
          <h2>研究流程</h2>
          <ul class="plain-list">
            <li>先寫清楚策略假設：它賺的是趨勢、震盪、突破、均值回歸，還是風險溢價？</li>
            <li>再看 Pine Script 邏輯：入場、出場、止蝕、倉位和手續費是否真的寫進策略。</li>
            <li>然後查看 TradingView 策略測試器：不要只看淨利，也要看交易次數、最大回撤、利潤因子（Profit Factor，PF）、連續虧損和買入持有比較。</li>
            <li>最後保留未參與調校的樣本，或進行前向測試：不要把參數一直調到歷史曲線最漂亮。</li>
          </ul>
        </article>

        ${renderBacktestIntegrityFramework()}
        ${renderOverfitRedFlags()}

        <article class="danger-card">
          <span class="lesson-label">失真回測</span>
          <h2>最常見的反面教材</h2>
          <ul class="plain-list">
            <li>只看淨利曲線向上，就以為策略可以真實交易。</li>
            <li>用太少交易次數得出結論，例如 12 次交易就說策略穩定。</li>
            <li>沒有加入佣金和滑價，回測結果可能因忽略交易成本而過分理想。</li>
            <li>用 Heikin Ashi、Renko 等非標準圖表價格做回測，卻把結果當真實市場成交。</li>
            <li>不斷調參數，直到歷史回測完美，實盤一跑就失效。</li>
          </ul>
        </article>

        <article class="info-card">
          <span class="lesson-label">起步範例</span>
          <h2>Pine Script 起步範例</h2>
          <div class="formula">//@version=6<br />strategy("研究用策略", overlay = true, commission_type = strategy.commission.percent, commission_value = 0.1, slippage = 1)<br />longSignal = ta.crossover(ta.sma(close, 20), ta.sma(close, 50))<br />if longSignal<br />&nbsp;&nbsp;&nbsp;&nbsp;strategy.entry("Long", strategy.long)</div>
          <p class="small">這只是起步範例。真正研究時，必須補上出場、止蝕、倉位、交易成本和失效條件。</p>
        </article>

        <article class="review-panel">
          <span class="lesson-label">實盤前檢查</span>
          <h2>拿去實盤前先問</h2>
          <ul class="plain-list">
            <li>策略是否有清楚市場邏輯，而不是純粹由參數搜尋得來？</li>
            <li>回測是否跨越不同市況：牛市、熊市、震盪、高波動、低波動？</li>
            <li>最大回撤是否是你心理和帳戶都能承受的水平？</li>
            <li>交易成本、滑價、成交延遲是否已反映？</li>
            <li>把最後 20% 時間留作未參與調校的樣本，結果是否仍可接受？</li>
          </ul>
        </article>
      </div>

      <aside class="stack">
        ${tradingViewScorecard()}
        <article class="info-card">
          <h2>策略測試器先看甚麼</h2>
          <ul class="plain-list">
            <li>Overview：先看 equity、drawdown 和 buy & hold 對比。</li>
            <li>Performance Summary：再看 long/short 是否都合理，避免只靠單邊市況。</li>
            <li>List of Trades：抽查大賺大虧是否來自少數異常交易。</li>
            <li>Properties：確認初始資金、手續費、滑價、pyramiding、margin 設定。</li>
          </ul>
        </article>
        <article class="info-card">
          <h2>下一步</h2>
          <div class="card-actions">
            <a class="button" href="#/script">看自研腳本</a>
            <a class="button secondary" href="#/journal">寫研究日誌</a>
            <a class="button secondary" href="#/combo">檢查指標組合</a>
            <a class="button secondary" href="#/playground">到練習場</a>
          </div>
        </article>
        <article class="notice">
          <strong>資料來源提醒</strong>
          <p class="small">此頁根據 TradingView Pine Script 策略文件與專家審核規則整理；平台功能可能更新，正式寫策略前必須再做本地資料覆核。</p>
          <span class="chip">官方文件已作內部參考</span>
        </article>
      </aside>
    </section>
    ${renderProfessorOutputGuide(
      "回測輸出標準",
      "一份合格回測要能回答四件事",
      [
        ["策略假設", "它賺的是甚麼市場行為，而不是只展示一條漂亮曲線。"],
        ["成本壓力", "加入手續費、滑價和成交限制後，結果是否仍有研究價值。"],
        ["穩健程度", "相近參數、不同市況和未調參樣本是否仍能接受。"],
        ["前向計劃", "若回測合格，下一步也只是小倉或模擬前向測試，不是直接重倉。"],
      ],
      "回測頁的輸出不是買賣指令，而是一份是否值得繼續研究的審查表。",
    )}
      `,
    )}
  `;
}

function renderJournalEntry(entry) {
  return `
    <article class="info-card journal-entry">
      <span class="lesson-label">${escapeHtml(entry.date || entry.createdAt?.slice(0, 10) || "Journal")}</span>
      <h3>${escapeHtml(entry.symbol || "未命名交易")} · ${escapeHtml(entry.indicator || "未選指標")}</h3>
      <ul class="fact-list">
        <li><span>入場/止蝕/目標</span><strong>${escapeHtml(entry.entry || "-")} / ${escapeHtml(entry.stop || "-")} / ${escapeHtml(entry.target || "-")}</strong></li>
        <li><span>R 值</span><strong>${escapeHtml(entry.rr || "-")}</strong></li>
        <li><span>結果</span><strong>${escapeHtml(entry.result || "觀察中")}</strong></li>
        <li><span>錯誤標籤</span><strong>${escapeHtml(entry.mistake || "無")}</strong></li>
      </ul>
      <p class="small"><strong>背景：</strong>${escapeHtml(entry.background || "未填寫")}</p>
      <p class="small"><strong>復盤：</strong>${escapeHtml(entry.review || "未填寫")}</p>
      <button class="button secondary" type="button" data-action="journal-delete" data-id="${escapeHtml(entry.id)}">刪除</button>
    </article>
  `;
}

function parseRValue(value) {
  const match = String(value || "").match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function renderJournalStatsChart(entries) {
  const completed = entries.filter((entry) => entry.result && entry.result !== "觀察中");
  const wins = entries.filter((entry) => entry.result === "盈利").length;
  const losses = entries.filter((entry) => entry.result === "虧損").length;
  const abandoned = entries.filter((entry) => entry.result === "放棄交易").length;
  const rValues = entries.map((entry) => parseRValue(entry.rr)).filter((value) => Number.isFinite(value));
  const avgR = rValues.length
    ? rValues.reduce((sum, value) => sum + value, 0) / rValues.length
    : null;
  const bars = [
    ["盈利", wins, "#15803d"],
    ["虧損", losses, "#dc2626"],
    ["放棄", abandoned, "#d97706"],
  ];
  const max = Math.max(1, ...bars.map(([, value]) => value));
  const mistakeCounts = [...entries.reduce((map, entry) => {
    if (entry.mistake) map.set(entry.mistake, (map.get(entry.mistake) || 0) + 1);
    return map;
  }, new Map()).entries()].sort((a, b) => b[1] - a[1]).slice(0, 4);

  return `
    <article class="review-panel journal-stats-card">
      <span class="lesson-label">統計圖</span>
      <h2>日誌統計圖</h2>
      <p class="small">${entries.length ? "用已儲存日誌估算，不作績效承諾。" : "尚未有資料。先記錄 10 筆觀察，統計才有教學價值。"}</p>
      <div class="journal-bars" aria-label="交易結果分佈">
        ${bars
          .map(
            ([label, value, color]) => `
              <div class="journal-bar-row">
                <span>${escapeHtml(label)}</span>
                <div class="journal-bar-track"><i style="width:${(value / max) * 100}%; background:${color}"></i></div>
                <strong>${value}</strong>
              </div>
            `,
          )
          .join("")}
      </div>
      <ul class="fact-list">
        <li><span>完成樣本</span><strong>${completed.length}</strong></li>
        <li><span>平均 R</span><strong>${avgR == null ? "樣本不足" : `${avgR.toFixed(2)}R`}</strong></li>
        <li><span>勝率</span><strong>${completed.length ? `${Math.round((wins / completed.length) * 100)}%` : "樣本不足"}</strong></li>
      </ul>
      ${
        mistakeCounts.length
          ? `<div class="mistake-tags">${mistakeCounts.map(([label, count]) => `<span class="chip">${escapeHtml(label)} x${count}</span>`).join("")}</div>`
          : `<div class="notice small">暫無錯誤分佈。真正有用的日誌，至少要標記「追高、未等確認、移走止蝕、重複計票」。</div>`
      }
    </article>
  `;
}

function journalInsights(entries) {
  const completed = entries.filter((entry) => entry.result && entry.result !== "觀察中");
  const wins = entries.filter((entry) => entry.result === "盈利").length;
  const losses = entries.filter((entry) => entry.result === "虧損").length;
  const abandoned = entries.filter((entry) => entry.result === "放棄交易").length;
  const missingRisk = entries.filter((entry) => !entry.stop || !entry.target || !entry.rr).length;
  const commonMistake = mostCommonMistake(entries);
  const nextAction =
    !entries.length
      ? "先記錄 3 筆觀察，不一定要下單。"
      : missingRisk > 0
        ? "補齊入場、止蝕、目標和 R 值；沒有風險資料的交易不能復盤。"
        : losses > wins
          ? "下一週先減少交易次數，只做 2R 以上且有確認的情境。"
          : "保持日誌，開始比較盈利交易和放棄交易的共同條件。";
  return `
    <article class="review-panel">
      <span class="lesson-label">日誌教練</span>
      <h2>日誌教練洞察</h2>
      <ul class="fact-list">
        <li><span>盈利 / 虧損 / 放棄</span><strong>${wins} / ${losses} / ${abandoned}</strong></li>
        <li><span>完成復盤</span><strong>${completed.length}</strong></li>
        <li><span>缺少風險資料</span><strong>${missingRisk}</strong></li>
        <li><span>最高頻錯誤</span><strong>${escapeHtml(commonMistake)}</strong></li>
      </ul>
      <div class="result-panel ${missingRisk ? "result-warn" : entries.length ? "result-good" : ""}">
        <strong>下一步訓練</strong>
        <span>${escapeHtml(nextAction)}</span>
      </div>
    </article>
  `;
}

function renderJournalExamples() {
  return `
    <article class="review-panel">
      <span class="lesson-label">日誌範例</span>
      <h2>好日誌和差日誌的分別</h2>
      <div class="two-col compact-grid">
        <div class="danger-card">
          <h3>差日誌</h3>
          <p class="small">今日買入，感覺會升。跌了很煩，可能市場不好。</p>
          <p class="small">問題：沒有市況、沒有入場條件、沒有止蝕、沒有 R 值，也沒有可修正行為。</p>
        </div>
        <div class="trade-card">
          <h3>好日誌</h3>
          <p class="small">價格回踩 20EMA 不破，成交量縮，入場 100，止蝕 96，目標 108，R 值 2；若收盤跌穿 96，交易假設失效。</p>
          <p class="small">價值：下一次可以檢查自己是否等確認、是否按止蝕、是否只做合格 R 值。</p>
        </div>
      </div>
    </article>
  `;
}

function renderJournal() {
  const entries = journalEntries();
  app.innerHTML = `
    <section class="page-band visual-band">
      <div class="visual-copy">
        <div class="page-title">
          <span class="eyebrow">交易日誌</span>
          <h1>交易日誌模板</h1>
          <p>每筆只記四件事：理由、失效、R 值和執行。寫得短，先會長期做到。</p>
        </div>
      </div>
      ${pageVisual("journal", "交易日誌、錯誤標籤、風險回報筆記和圖表截圖")}
    </section>
    <section class="content-grid">
      <form class="info-card journal-form" data-action="journal-save">
        <span class="lesson-label">新增紀錄</span>
        <h2>新增日誌</h2>
        <div class="form-grid">
          <label>日期<input class="field" type="date" name="date" /></label>
          <label>股票/代號<input class="field" name="symbol" placeholder="例：AAPL / 0700.HK" /></label>
          <label>使用指標
            <select class="select" name="indicator">
              <option value="">未選</option>
              ${indicators.map((item) => `<option value="${escapeHtml(item.abbr)}">${escapeHtml(item.abbr)} · ${escapeHtml(item.name)}</option>`).join("")}
            </select>
          </label>
          <label>結果
            <select class="select" name="result">
              <option value="觀察中">觀察中</option>
              <option value="盈利">盈利</option>
              <option value="虧損">虧損</option>
              <option value="放棄交易">放棄交易</option>
            </select>
          </label>
          <label>入場<input class="field" name="entry" placeholder="100" /></label>
          <label>止蝕<input class="field" name="stop" placeholder="96" /></label>
          <label>目標<input class="field" name="target" placeholder="108" /></label>
          <label>R 值<input class="field" name="rr" placeholder="例：1.9R" /></label>
        </div>
        <label>交易背景<textarea class="field note-field" name="background" placeholder="市況、位置、指標訊號、入場理由..."></textarea></label>
        <label>犯錯標籤
          <select class="select" name="mistake">
            <option value="">無</option>
            <option value="追高">追高</option>
            <option value="移走止蝕">移走止蝕</option>
            <option value="過度交易">過度交易</option>
            <option value="重複計票">重複計票</option>
            <option value="未等確認">未等確認</option>
          </select>
        </label>
        <label>復盤<textarea class="field note-field" name="review" placeholder="結果如何？規則是否被遵守？下次要避免甚麼？"></textarea></label>
        <button class="button" type="submit">儲存日誌</button>
      </form>
      <aside class="stack">
        ${journalInsights(entries)}
        <article class="review-panel">
          <h2>日誌摘要</h2>
          <ul class="fact-list">
            <li><span>總記錄</span><strong>${entries.length}</strong></li>
            <li><span>已完成</span><strong>${entries.filter((entry) => entry.result && entry.result !== "觀察中").length}</strong></li>
            <li><span>常見錯誤</span><strong>${escapeHtml(mostCommonMistake(entries))}</strong></li>
          </ul>
        </article>
        <article class="notice">
          <strong>復盤提醒</strong>
          <p class="small">連續虧損時先看是否違反交易劇本，不要急於更換指標或加大倉位。</p>
        </article>
        ${renderLessonFold(
          "更多",
          "展開統計、範例和日誌標準",
          "先建立紀錄；需要復盤方法時再展開。",
          `
            ${renderJournalStatsChart(entries)}
            ${renderJournalExamples()}
            ${renderJournalQualityStandard()}
            ${renderProfessorOutputGuide(
              "日誌輸出標準",
              "每篇日誌都要產生一條可修正行為",
              [
                ["不是記結果", "盈利和虧損只是結果，真正要記的是有沒有照入場、止蝕、目標和失效條件執行。"],
                ["不是寫心情", "情緒可以記，但最後要轉成行為規則，例如等待確認、減少交易、固定止蝕。"],
                ["不是換指標", "連續虧損先檢查流程和倉位，不要立刻用新指標覆蓋舊問題。"],
              ],
              "日誌的輸出應該是一句下次會做得更好的規則。",
            )}
          `,
        )}
      </aside>
    </section>
    <section>
      <div class="section-head"><h2>最近日誌</h2></div>
      ${
        entries.length
          ? `<div class="card-grid">${entries.map(renderJournalEntry).join("")}</div>`
          : `<div class="empty-state"><p>尚未建立交易日誌。先記錄一次觀察也可以，不一定要真實下單。</p></div>`
      }
    </section>
  `;
}

function mostCommonMistake(entries) {
  const counts = entries.reduce((map, entry) => {
    if (entry.mistake) map.set(entry.mistake, (map.get(entry.mistake) || 0) + 1);
    return map;
  }, new Map());
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || "暫無";
}

function analyzeCombo(slugs) {
  const selected = slugs.map(getIndicator).filter(Boolean);
  if (selected.length < 2) {
    return { tone: "", title: "先選至少兩個指標", lines: ["組合檢查器會判斷是否重複計票，以及是否缺少風險工具。"] };
  }
  const categoryCounts = selected.reduce((map, item) => {
    map.set(item.category, (map.get(item.category) || 0) + 1);
    return map;
  }, new Map());
  const repeated = [...categoryCounts.entries()].filter(([, count]) => count > 1);
  const hasTrend = selected.some((item) => item.uses.includes("看趨勢") || item.category === "趨勢");
  const hasMomentum = selected.some((item) => item.category === "動能" || item.uses.includes("找轉折"));
  const hasRisk = selected.some((item) => item.uses.includes("管理風險") || item.category === "波動率");
  const hasVolume = selected.some((item) => item.category === "成交量");
  const hasStructure = selected.some((item) => item.category === "支撐阻力" || item.category === "通道/型態");
  const hasMarket = selected.some((item) => item.category === "市場寬度" || item.category === "綜合");
  const lines = [];
  if (repeated.length) {
    lines.push(`重複計票風險：${repeated.map(([category, count]) => `${category} x${count}`).join("、")}。相同類別只保留一個主工具。`);
  } else {
    lines.push("分類分散度良好，沒有明顯同類指標過度堆疊。");
  }
  if (!hasTrend) {
    lines.push("缺少趨勢/方向工具：建議加入 SMA、EMA、MACD 或 Ichimoku。");
  }
  if (!hasMomentum) lines.push("動能確認較弱：若交易轉折，可加入 RSI、KD 或 MACD Histogram。");
  if (!hasRisk) {
    lines.push("缺少風險工具：建議加入 ATR、布林帶或其他管理風險工具。");
  }
  if (!hasVolume) {
    lines.push("缺少成交量確認：若交易突破或反轉，可加入 OBV、MFI 或成交量。");
  }
  if (!hasStructure) lines.push("缺少價格結構：即使指標組合合格，也要人工標出支撐、阻力、前高前低或通道。");
  if (hasMarket) lines.push("已有大市/相對背景工具，適合先判斷是否進攻，再回到個股找觸發。");
  lines.push("建議分工：主指標回答主要問題，確認工具只驗證，風險工具決定倉位和是否值得做。");
  const hasCriticalGap = !hasTrend || !hasRisk;
  const tone = hasCriticalGap ? "result-bad" : repeated.length || !hasVolume ? "result-warn" : "result-good";
  const title = hasCriticalGap
    ? "先補足方向和風險工具"
    : repeated.length
      ? "組合有重複訊號，先精簡"
      : !hasVolume
        ? "組合可用，但仍欠成交量確認"
        : "組合角色清楚，可再做市況檢查";
  return {
    tone,
    title,
    lines: [`選中：${selected.map((item) => item.abbr).join("、")}。`, ...lines],
  };
}

function renderComboChecker() {
  const core = indicators.filter((item) => item.core);
  const optionHtml = indicators.map((item) => `<option value="${escapeHtml(item.slug)}">${escapeHtml(item.abbr)} · ${escapeHtml(item.name)}</option>`).join("");
  const defaults = ["sma", "rsi", "atr"];
  const analysis = analyzeCombo(defaults);
  app.innerHTML = `
    <section class="page-band visual-band">
      <div class="visual-copy">
        <div class="page-title">
          <span class="eyebrow">指標組合</span>
          <h1>比較指標是否重複</h1>
          <p>這裡只協助你分辨多個指標是否重複觀察同一件事，不能判斷策略會否賺錢或降低風險。方向、動能、成交量和風險應各有清楚用途。</p>
        </div>
      </div>
      ${pageVisual("combo", "多張指標卡片、連線圖和風險檢查便條")}
    </section>
    <section class="content-grid">
      <article class="info-card" data-combo-checker>
        <h2>選 2 至 4 個指標</h2>
        <div class="form-grid">
          ${[0, 1, 2, 3]
            .map(
              (index) => `
                <label>指標 ${index + 1}
                  <select class="select" data-combo-select>
                    <option value="">未選</option>
                    ${optionHtml.replace(`value="${defaults[index] || ""}"`, `value="${defaults[index] || ""}" selected`)}
                  </select>
                </label>
              `,
            )
            .join("")}
        </div>
        <div class="result-panel ${analysis.tone}" data-combo-result>
          <strong>${analysis.title}</strong>
          ${analysis.lines.map((line) => `<span>${escapeHtml(shortText(line, 46))}</span>`).join("")}
        </div>
      </article>
      <aside class="stack">
        <article class="trade-card">
          <h2>建議起點</h2>
          <div class="chip-row">
            ${core.slice(0, 8).map((item) => `<a class="chip" href="${indicatorUrl(item.slug)}">${escapeHtml(item.abbr)}</a>`).join("")}
          </div>
        </article>
        <article class="notice">
          <strong>用法</strong>
          <p class="small">重複回答同一件事，就刪一個。</p>
        </article>
      </aside>
    </section>
    ${renderLessonFold(
      "完整說明",
      "展開組合標準、角色分工和反面教材",
      "先用上面的檢查器；需要說明時再展開。",
      `
        ${renderProfessorOutputGuide(
          "組合輸出標準",
          "組合檢查後，要決定保留、刪除或補充",
          [
            ["保留", "如果每個指標負責不同問題，例如方向、成交量、風險，就保留並指定主次角色。"],
            ["刪除", "如果兩個指標回答同一個問題，例如多個動能工具同時看轉折，就刪掉較不熟悉的一個。"],
            ["補充", "如果組合只有入場訊號，沒有止蝕、波幅或倉位工具，就先補風險工具。"],
          ],
          "好的組合不是多，而是每個工具都有不可替代的角色。",
        )}
        <section class="content-grid">
          ${renderQualityChecklist("組合交易前 5 問")}
          ${renderComboRoleModel()}
          <article class="danger-card">
            <span class="lesson-label">錯誤組合</span>
            <h2>組合反面教材</h2>
            <ul class="plain-list">
              <li>三個動能指標一起看升，卻沒有趨勢、成交量或止蝕距離。</li>
              <li>把風險工具拿來預測方向，例如 ATR 上升就直接看淡。</li>
              <li>指標互相矛盾時，不是減少交易，而是繼續找第五個指標支持自己。</li>
            </ul>
          </article>
        </section>
      `,
    )}
  `;
}

function renderSavedDeskCoach({ favItems, noteEntries, history, accuracy }) {
  const actions = [];
  if (!favItems.length) actions.push("先收藏 3 個核心指標：SMA、RSI、ATR，建立最小工具箱。");
  if (favItems.length && noteEntries.length < favItems.length) actions.push("為每個收藏指標寫一句「何時不用」，比寫何時用更能避免虧損。");
  if (history.length < 5) actions.push("到練習場完成至少 5 次小測驗，先訓練市況判斷。");
  if (history.length >= 5 && accuracy < 70) actions.push("暫時不要研究進階指標，先重做市況、假突破和 R 值練習。");
  if (!journalEntries().length) actions.push("建立第一篇交易日誌，記錄一次觀察也可以，不必真實下單。");
  if (!actions.length) actions.push("下一步可以研究指標組合，檢查是否有重複計票和缺少風險工具。");
  return `
    <article class="trade-card">
      <span class="lesson-label">下一步建議</span>
      <h2>下一步做甚麼</h2>
      <ul class="plain-list">${listItems(actions)}</ul>
      <div class="card-actions">
        <a class="button secondary" href="#/playground">做練習</a>
        <a class="button secondary" href="#/journal">寫日誌</a>
        <a class="button secondary" href="#/combo">查組合</a>
      </div>
    </article>
  `;
}

function renderSavedDeskQualityGuide() {
  const checks = [
    ["收藏品質", "每個收藏指標都應有一句「何時不用」，否則只是書籤。"],
    ["備註品質", "備註要寫市況、入場條件、失效位，不只寫喜歡或不喜歡。"],
    ["測驗品質", "錯題要轉成規則，例如「區間中段不追突破」。"],
    ["備份品質", "匯出資料後要知道恢復流程，避免換瀏覽器時丟失學習記錄。"],
  ];
  return `
    <article class="review-panel">
      <span class="lesson-label">資料品質</span>
      <h2>收藏頁要像交易工作台，不是雜物箱</h2>
      <ul class="plain-list">
        ${checks
          .map(([title, body]) => `<li><strong>${escapeHtml(title)}：</strong>${escapeHtml(body)}</li>`)
          .join("")}
      </ul>
      <div class="formula">每週整理流程：刪掉不用的收藏，補齊每個指標的停用條件，匯出一次備份，再把一個錯誤測驗寫成交易規則。</div>
      <p class="small">這頁的價值不在於保存大量資料，而在於用學習紀錄修正交易行為。收藏決定學甚麼，備註記下用法，測驗找出盲點，日誌修正行為，備份則保留進度。</p>
    </article>
  `;
}

function renderSubscribe() {
  const favItems = favorites().map(getIndicator).filter(Boolean);
  const email = storageGet("ti-email", "");
  const noteEntries = Object.entries(notes())
    .map(([slug, text]) => ({ item: getIndicator(slug), text }))
    .filter((entry) => entry.item && entry.text.trim());
  const history = quizHistory();
  const correct = history.filter((entry) => entry.correct).length;
  const accuracy = history.length ? Math.round((correct / history.length) * 100) : 0;
  app.innerHTML = `
    <section class="page-band visual-band">
      <div class="visual-copy">
        <div class="page-title">
          <span class="eyebrow">我的學習桌面</span>
          <h1>收藏與本地資料</h1>
          <p>收藏、備註和進度只留在這部機。這頁用來整理學習，不推送買賣提示。</p>
        </div>
        <form class="subscribe-panel" data-action="subscribe">
          <input class="field" type="email" name="email" value="${escapeHtml(email)}" placeholder="your@email.com" required />
          <button class="button" type="submit">儲存到本機</button>
        </form>
        <div class="card-actions">
          <button class="button secondary" type="button" data-action="export-local-data">匯出本地資料</button>
          <label class="button secondary import-button">匯入本地資料<input type="file" accept="application/json" data-import-file /></label>
          <a class="button ghost" href="#/journal">打開交易日誌</a>
        </div>
        ${renderImportPreview()}
      </div>
      ${pageVisual("subscribe", "本地資料保險箱、收藏卡片、下載圖示和訂閱信封")}
    </section>
    <section class="card-grid">
      <article class="review-panel">
        <span class="lesson-label">學習概覽</span>
        <h2>學習概覽</h2>
        <ul class="fact-list">
          <li><span>測驗次數</span><strong>${history.length}</strong></li>
          <li><span>正確率</span><strong>${history.length ? `${accuracy}%` : "未開始"}</strong></li>
          <li><span>交易日誌</span><strong>${journalEntries().length}</strong></li>
          <li><span>備註</span><strong>${noteEntries.length}</strong></li>
        </ul>
      </article>
      ${renderSavedDeskCoach({ favItems, noteEntries, history, accuracy })}
    </section>
    ${renderLessonFold(
      "完整資料",
      "展開收藏、備註和資料品質說明",
      "日常只看概覽；整理資料時再展開。",
      `
        <section class="card-grid">
          <article class="info-card">
            <span class="lesson-label">恢復資料</span>
            <h2>本地資料與備份說明</h2>
            <p class="small">匯入採合併並預覽；不會直接覆蓋目前收藏和備註。若備註衝突，匯入內容會放在「匯入備份」段落。</p>
          </article>
          ${renderLocalDataGovernance()}
          ${renderSavedDeskQualityGuide()}
          <article class="danger-card">
            <span class="lesson-label">收藏常見錯誤</span>
            <h2>收藏頁反面教材</h2>
            <p class="small">收藏指標不是買入清單。真正值得保存的是每個指標何時可用、何時要收手、哪裡要止蝕，以及你曾經怎樣錯用它。</p>
          </article>
        </section>
        <section>
          <div class="section-head">
            <div>
              <h2>已收藏指標</h2>
              <p>${favItems.length ? `目前收藏 ${favItems.length} 個指標。` : "尚未收藏任何指標。"}</p>
            </div>
          </div>
          ${
            favItems.length
              ? `<div class="card-grid">${favItems.map(indicatorCard).join("")}</div>`
              : `<div class="empty-state"><p>到全部指標頁按下星號，就可以把常看的指標放到這裡。</p><a class="button" href="#/indicators">前往全部指標</a></div>`
          }
        </section>
        <section>
          <div class="section-head">
            <div>
              <h2>我的指標備註</h2>
              <p>${noteEntries.length ? `目前有 ${noteEntries.length} 個指標備註。` : "尚未寫下任何指標備註。"}</p>
            </div>
          </div>
          ${
            noteEntries.length
              ? `<div class="card-grid">${noteEntries
                  .map(
                    ({ item, text }) => `
                      <article class="info-card">
                        <span class="lesson-label">${escapeHtml(item.abbr)}</span>
                        <h3>${escapeHtml(item.name)}</h3>
                        <p class="small">${escapeHtml(text)}</p>
                        <a class="button secondary" href="${indicatorUrl(item.slug)}">回到指標頁</a>
                      </article>
                    `,
                  )
                  .join("")}</div>`
              : `<div class="empty-state"><p>打開任一指標頁，在「我的交易備註」寫下自己的使用條件。</p></div>`
          }
        </section>
      `,
    )}
  `;
}

function renderCandlestickPatternGrid() {
  return `
    <div class="pattern-levels">
      ${candlestickLevels
        .map((levelInfo) => {
          const levelPatterns = candlestickPatterns.filter(
            (pattern) => pattern.level === levelInfo.level,
          );
          const sectionMarkup = `
            <section class="pattern-level-section" id="candlestick-${levelInfo.level}">
              <div class="section-head">
                <div>
                  <span class="lesson-label">${escapeHtml(levelInfo.level)}</span>
                  <h2>${escapeHtml(levelInfo.title)}</h2>
                  <p>${escapeHtml(levelInfo.desc)}</p>
                </div>
                <span class="chip active">${levelPatterns.length} 個形態</span>
              </div>
              <div class="candle-pattern-grid">
                ${levelPatterns
                  .map(
                    (pattern) => `
                      <article class="info-card candle-pattern-card">
                        <div class="card-top">
                          <div>
                            <span class="lesson-label">${escapeHtml(pattern.level)} · ${escapeHtml(pattern.type)}</span>
                            <h3>${escapeHtml(pattern.name)}</h3>
                          </div>
                        </div>
                        ${renderPatternMiniSvg(pattern.slug)}
                        <ul class="plain-list">
                          <li><strong>代表甚麼：</strong>${escapeHtml(pattern.signal)}</li>
                          <li><strong>交易用法：</strong>${escapeHtml(pattern.use)}</li>
                          <li><strong>反面教材：</strong>${escapeHtml(pattern.avoid)}</li>
                        </ul>
                      </article>
                    `,
                  )
                  .join("")}
              </div>
            </section>
          `;
          if (levelInfo.level === "入門") return sectionMarkup;
          return renderLessonFold(
            levelInfo.level,
            `展開${levelInfo.title}`,
            `${levelPatterns.length} 個形態，先學完入門層再展開。`,
            sectionMarkup,
          );
        })
        .join("")}
    </div>
  `;
}

function renderCandlestickOverview() {
  return `
    <section class="page-band">
      ${compactActionList([
        { label: "1", title: "先懂結構", body: "開高低收。", href: "#/candlesticks/anatomy" },
        { label: "2", title: "再看形態", body: "只在關鍵位置讀。", href: "#/candlesticks/patterns" },
        { label: "3", title: "加入情境", body: "配合趨勢和成交量。", href: "#/candlesticks/context" },
        { label: "4", title: "寫劇本", body: "先定失效位。", href: "#/candlesticks/playbook" },
      ])}
    </section>
    ${renderLessonFold(
      "完整導覽",
      "展開學習路線、讀圖工具和檢查表",
      "需要完整陰陽燭框架時再打開。",
      `
        <section class="content-grid">
          <div class="stack">
            <article class="info-card">
              <span class="lesson-label">學習路線</span>
              <h2>30 分鐘學習路線</h2>
              <div class="timeline-list">
                <div><strong>1. 先懂結構</strong><span>開、高、低、收、實體、影線、收盤位置。</span></div>
                <div><strong>2. 再看形態</strong><span>只學最常用形態，並知道每個形態在哪些位置才有價值。</span></div>
                <div><strong>3. 加入情境</strong><span>支撐阻力、趨勢、成交量、週期一致性，比形態名稱更重要。</span></div>
                <div><strong>4. 寫成交易劇本</strong><span>入場、止蝕、目標、失效條件和不交易條件要先寫好。</span></div>
              </div>
            </article>
          </div>
          <aside class="stack">
            ${renderCandlestickReader()}
            ${renderQualityChecklist("陰陽燭交易前 5 問")}
          </aside>
        </section>
      `,
    )}
  `;
}

function renderCandlestickAnatomyDrills() {
  const drills = [
    ["長實體", "先問是否在關鍵位置突破或跌穿，再看下一支是否接受新價格。", "若止蝕距離太遠，訊號再強也不追。"],
    ["長上影", "代表高位曾被測試但未能守住，放在阻力附近才有警示價值。", "強勢主升段可連續出現上影，不等於立即見頂。"],
    ["長下影", "代表低位曾被測試後被買回，放在支撐或恐慌後更值得研究。", "下一支若跌穿低位，反彈劇本立即失效。"],
    ["細實體", "代表分歧或休息，常用來觀察壓縮、等待突破方向。", "不要在區間中段因十字星而硬猜轉向。"],
  ];
  return `
    <section class="page-band">
      <div class="section-head">
        <div>
          <h2>由單支燭到交易判斷</h2>
          <p>結構頁最重要不是背名，而是把每一支燭轉成三個問題：位置在哪、誰被拒絕、哪裡失效。</p>
        </div>
      </div>
      <div class="card-grid">
        ${drills
          .map(
            ([title, read, caution]) => `
              <article class="info-card">
                <span class="lesson-label">結構練習</span>
                <h3>${escapeHtml(title)}</h3>
                <p class="small">${escapeHtml(read)}</p>
                <div class="result-panel result-warn"><strong>扣分位</strong><span>${escapeHtml(caution)}</span></div>
              </article>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderCandlestickAnatomy() {
  return `
    <section class="content-grid">
      <div class="stack">
        <article class="info-card">
          <span class="lesson-label">結構拆解</span>
          <h2>一支陰陽燭要讀 5 件事</h2>
          ${renderCandlestickAnatomySvg()}
        </article>
        <article class="info-card">
          <h2>判讀次序</h2>
          <ul class="plain-list">
            <li><strong>方向：</strong>收市高於開市是陽燭，收市低於開市是陰燭，但方向只是第一層。</li>
            <li><strong>實體：</strong>實體越長，當日其中一方主導越明顯；細實體代表猶豫或休息。</li>
            <li><strong>影線：</strong>上影線代表高位被測試後回落，下影線代表低位被測試後拉回。</li>
            <li><strong>收盤位置：</strong>收近高位通常較強，收近低位通常較弱；收盤比日內波動更重要。</li>
            <li><strong>相對背景：</strong>同一支燭放在支撐、阻力、突破、橫行中段，意義完全不同。</li>
          </ul>
        </article>
      </div>
      <aside class="stack">
        <article class="danger-card">
          <span class="lesson-label">反面教材</span>
          <h2>不要這樣學</h2>
          <p class="small">「長下影等於見底」是錯誤簡化。真正要問的是：它出現在甚麼位置？有沒有量？下一支有沒有守住低位？止蝕放哪裡？</p>
        </article>
        <article class="trade-card">
          <h2>即用口訣</h2>
          <p class="small">先位置，後形態；先收盤，後影線；先風險，後方向。</p>
        </article>
      </aside>
    </section>
    ${renderCandlestickAnatomyDrills()}
  `;
}

function renderCandlestickPatterns() {
  return `
    <section class="page-band">
      <div class="page-title">
          <span class="eyebrow">形態庫</span>
          <h2>先掌握入門形態，中級和進階再展開</h2>
        <p>共 ${candlestickPatterns.length} 個形態，按學習難度分成三層。形態名稱只是索引，真正重要的是它在甚麼位置出現、是否有成交量、下一支是否確認，以及止蝕距離是否合理。</p>
      </div>
    </section>
    ${renderCandlestickPatternGrid()}
  `;
}

function renderCandlestickContext() {
  return `
    <section class="card-grid">
      ${candlestickContextCards
        .map(
          (card) => `
            <article class="info-card">
              <span class="lesson-label">情境</span>
              <h2>${escapeHtml(card.title)}</h2>
              <p class="small">${escapeHtml(card.body)}</p>
            </article>
          `,
        )
        .join("")}
    </section>
    <section class="content-grid">
      <article class="trade-card">
        <span class="lesson-label">檢查清單</span>
        <h2>陰陽燭交易前 7 問</h2>
        <ul class="plain-list">
          <li>這支燭是否靠近支撐、阻力、趨勢線、前高前低或突破位？</li>
          <li>收盤是否站在關鍵位之上/之下，而不是只靠影線？</li>
          <li>成交量是否支持這次突破、反彈或跌穿？</li>
          <li>上一個大週期方向是否和這個訊號一致？</li>
          <li>若訊號錯了，哪個價格會證明劇本失效？</li>
          <li>止蝕距離是否讓 R 值仍有吸引力？</li>
          <li>如果下一支 K 線相反收盤，你是否願意立即放棄？</li>
        </ul>
      </article>
      <aside class="stack">
        ${renderCandlestickReader()}
      </aside>
    </section>
  `;
}

function renderCandlestickPlaybook() {
  return `
    <section class="content-grid">
      <div class="stack">
        <article class="trade-card">
          <span class="lesson-label">劇本一</span>
          <h2>支撐反彈劇本</h2>
          <ul class="plain-list">
            <li>背景：股價回到支撐區，跌勢放慢，出現錘頭、陽吞陰或長下影收高。</li>
            <li>入場：下一支 K 線突破反彈燭高位，或回踩不破支撐後再上。</li>
            <li>止蝕：放在反彈燭最低位下方，或支撐區下方再加少量緩衝。</li>
            <li>目標：先看前高、阻力區或至少 1.8R 至 2R；不到就不做。</li>
          </ul>
        </article>
        <article class="trade-card">
          <span class="lesson-label">劇本二</span>
          <h2>突破延續劇本</h2>
          <ul class="plain-list">
            <li>背景：價格在窄幅區間壓縮，突然長陽突破，最好有成交量配合。</li>
            <li>入場：突破收盤後等回踩不破，或下一支繼續收在突破位上方。</li>
            <li>止蝕：放在突破燭低位、區間上沿下方，或 ATR 緩衝之外。</li>
            <li>反面教材：突破後即跌回區間，稱為假突破，應快速降級或放棄。</li>
          </ul>
        </article>
        <article class="danger-card">
          <span class="lesson-label">劇本三</span>
          <h2>阻力失敗劇本</h2>
          <ul class="plain-list">
            <li>背景：升勢到阻力區，出現射擊之星、陰吞陽或烏雲蓋頂。</li>
            <li>用途：可用作減倉、收緊止賺或等待回調，不一定要反手造淡。</li>
            <li>確認：下一支跌穿形態低位才算沽壓延續；若重新收高，訊號失效。</li>
            <li>風險：強勢股高位上影線可以連續出現，不要在主升段盲目逆勢。</li>
          </ul>
        </article>
      </div>
      <aside class="stack">
        <article class="info-card">
          <span class="lesson-label">交易模板</span>
          <h2>把陰陽燭寫成交易計劃</h2>
          <div class="formula">如果「位置 + 形態 + 成交量 + 確認」同時成立，才考慮交易；如果跌穿/升穿失效位，立即放棄原劇本。</div>
          <p class="small">你可以把這句放進交易日誌：我不是因為某個形態入場，而是因為形態在關鍵位置出現，並且風險回報合格。</p>
        </article>
        <article class="notice">
          <strong>實戰重點</strong>
          <p class="small">陰陽燭最適合做觸發和風險界線，不適合單獨做完整策略。最好和趨勢、成交量、支撐阻力、ATR 或移動平均線配合。</p>
        </article>
      </aside>
    </section>
  `;
}

function renderCandlestickMistakes() {
  return `
    <section class="content-grid">
      <div class="stack">
        <article class="danger-card">
          <span class="lesson-label">錯誤案例</span>
          <h2>最容易虧損的 6 種用法</h2>
          <ul class="plain-list">
            ${candlestickMistakes.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
        </article>
        <article class="info-card">
          <span class="lesson-label">修正方法</span>
          <h2>修正方法</h2>
          <ul class="plain-list">
            <li>每次只回答一個問題：這支燭是在確認突破、測試支撐，還是在提醒我減低風險？</li>
            <li>把「下一支否定條件」寫出來，例如跌穿錘頭低位、重新跌回突破區、或收不回阻力。</li>
            <li>用交易日誌記錄形態結果，分開統計支撐位、阻力位、橫行中段的表現。</li>
          </ul>
        </article>
      </div>
      <aside class="stack">
        ${renderCandlestickReader()}
        <article class="trade-card">
          <h2>最簡短的判斷</h2>
          <p class="small">看不出止蝕在哪裡，就看不懂這支陰陽燭。看不出何時失效，就不應該交易。</p>
        </article>
      </aside>
    </section>
  `;
}

function renderCandlestickSectionBrief(section) {
  const brief = {
    overview: [
      { step: "1", title: "先懂結構", body: "開、高、低、收。", href: "#/candlesticks/anatomy", action: "學結構" },
      { step: "2", title: "再看位置", body: "支撐、阻力、突破位。", href: "#/candlesticks/context", action: "看情境" },
      { step: "3", title: "最後寫失效", body: "看不出失效就不交易。", href: "#/candlesticks/playbook", action: "看劇本" },
    ],
    anatomy: [
      { step: "1", title: "方向", body: "陽燭陰燭只是第一層。" },
      { step: "2", title: "實體", body: "實體越長，主導越明顯。" },
      { step: "3", title: "影線", body: "影線是試探，不是答案。" },
    ],
    patterns: [
      { step: "1", title: "先學入門", body: "只看最常見形態。" },
      { step: "2", title: "必配位置", body: "形態在中段先降級。" },
      { step: "3", title: "等確認", body: "下一支 K 線更重要。" },
    ],
    context: [
      { step: "1", title: "先看位置", body: "支撐阻力比名稱重要。" },
      { step: "2", title: "再看成交量", body: "突破要有人參與。" },
      { step: "3", title: "最後看風險", body: "R 值不夠就放棄。" },
    ],
    playbook: [
      { step: "1", title: "條件", body: "位置、形態、確認。" },
      { step: "2", title: "止蝕", body: "失效位先寫清楚。" },
      { step: "3", title: "目標", body: "不到合格 R 值就不做。" },
    ],
    mistakes: [
      { step: "1", title: "不背名稱", body: "名字不是買賣理由。" },
      { step: "2", title: "不猜反轉", body: "先等確認。" },
      { step: "3", title: "不移止蝕", body: "錯了就認錯。" },
    ],
  };
  return `
    <section class="page-band">
      ${compactStepList(brief[section] || brief.overview)}
    </section>
  `;
}

function renderCandlesticks() {
  const { path } = parseRoute();
  const section = candlestickSectionFromPath(path);
  const heroCopyBySection = {
    overview: {
      title: "陰陽燭先看攻防，不是背名",
      desc: "先看開、高、低、收背後的攻防。",
    },
    anatomy: {
      title: "陰陽燭結構：開高低收、實體與影線",
      desc: "懂結構，才不會被形態名牽着走。",
    },
    patterns: {
      title: "陰陽燭形態庫：形態必須配合位置判斷",
      desc: "形態要配合位置，才有意義。",
    },
    context: {
      title: "陰陽燭情境判讀：位置、趨勢、成交量",
      desc: "先讀情境，再讀形態。",
    },
    playbook: {
      title: "陰陽燭交易劇本：由訊號到止蝕",
      desc: "寫不出失效位，就不應交易。",
    },
    mistakes: {
      title: "陰陽燭錯誤案例：最常見虧損用法",
      desc: "只背名稱，最容易誤用。",
    },
  };
  const heroCopy = heroCopyBySection[section] || heroCopyBySection.overview;
  const sectionMap = {
    overview: renderCandlestickOverview,
    anatomy: renderCandlestickAnatomy,
    patterns: renderCandlestickPatterns,
    context: renderCandlestickContext,
    playbook: renderCandlestickPlaybook,
    mistakes: renderCandlestickMistakes,
  };

  app.innerHTML = `
    <section class="page-band visual-band candlestick-hero">
      <div class="visual-copy">
        <div class="page-title">
          <span class="eyebrow">陰陽燭大師課</span>
          <h1>${escapeHtml(heroCopy.title)}</h1>
          <p>${escapeHtml(heroCopy.desc)}</p>
        </div>
        <div class="card-actions">
          <a class="button" href="#/candlesticks/anatomy">由結構開始</a>
          <a class="button secondary" href="#/candlesticks/patterns">查看形態庫</a>
        </div>
      </div>
      ${renderCandlestickHeroSvg()}
    </section>
    ${candlestickNav(section)}
    ${renderCandlestickSectionBrief(section)}
    ${renderLessonFold(
      "完整內容",
      "展開本頁完整教學",
      "需要細讀形態、案例和標準時再打開。",
      `
        ${sectionMap[section]()}
        ${renderProfessorOutputGuide(
          "陰陽燭輸出標準",
          "讀完本頁後，要能寫出形態交易劇本",
          [
            ["位置", "形態必須靠近支撐、阻力、突破位或回踩位；區間中段的訊號先降級。"],
            ["確認", "下一支 K 線是否接受這個方向，比形態名稱更重要。沒有確認，只能觀察。"],
            ["風險", "先寫止蝕和 R 值，再決定是否入場；看不出失效位，就不應交易。"],
          ],
          "陰陽燭的最高價值，是把市場攻防轉成可放棄、可復盤的交易條件。",
        )}
        ${renderCandlestickAuthorityPanel()}
      `,
    )}
  `;
}

function renderImportPreview() {
  const preview = state.importPreview;
  if (!preview) return "";
  if (preview.error) {
    return `<div class="result-panel result-bad"><strong>匯入失敗</strong><span>${escapeHtml(preview.error)}</span></div>`;
  }
  if (preview.done) {
    return `<div class="result-panel result-good"><strong>匯入完成</strong><span>資料已合併到目前瀏覽器。本地資料不會上傳。</span></div>`;
  }
  const s = preview.summary;
  return `
    <div class="result-panel result-warn">
      <strong>匯入預覽</strong>
      <span>收藏 ${s.favorites}｜備註 ${s.notes}｜日誌 ${s.journal}｜測驗紀錄 ${s.quizHistory}</span>
      <span>確認後會與現有本地資料合併，不會直接清空目前資料。</span>
      <button class="button" type="button" data-action="confirm-import-local-data">確認合併匯入</button>
    </div>
  `;
}

function renderNotFound() {
  app.innerHTML = `
    <section class="page-band empty-state" aria-labelledby="not-found-title">
      <span class="lesson-label">找不到頁面</span>
      <h1 id="not-found-title">這個頁面不存在，或網址已改動</h1>
      <p>你可以回到學習路徑、全部指標，或 TradingView 策略研究庫繼續閱讀。</p>
      <div class="card-actions">
        <a class="button" href="#/learn">返回學習路徑</a>
        <a class="button secondary" href="#/indicators">查看全部指標</a>
        <a class="button secondary" href="#/strategy-cases">查看策略研究庫</a>
      </div>
    </section>
  `;
}

function enhanceDataTables() {
  app.querySelectorAll("table").forEach((table, index) => {
    if (!table.querySelector("caption")) {
      const heading = table.closest("article, section")?.querySelector("h2, h3")?.textContent?.trim();
      const caption = document.createElement("caption");
      caption.className = "sr-only";
      caption.textContent = heading || `資料表 ${index + 1}`;
      table.prepend(caption);
    }
    table.querySelectorAll("thead th").forEach((cell) => cell.setAttribute("scope", "col"));
    table.querySelectorAll("tbody tr").forEach((row) => {
      const rowHeader = row.querySelector("th");
      if (rowHeader && !rowHeader.hasAttribute("scope")) rowHeader.setAttribute("scope", "row");
    });
  });
}

const hongKongEditorialReplacements = [
  ["交易劇本", "交易計劃"],
  ["復盤", "交易檢討"],
  ["實盤", "實際交易"],
  ["自研腳本", "自家開發腳本"],
  ["Strategy Tester", "策略測試器"],
  ["Alert", "提示"],
  ["成交量", "成交量"],
  ["回踩", "回試"],
  ["金叉", "黃金交叉"],
  ["死叉", "死亡交叉"],
  ["趨勢濾網", "趨勢篩選條件"],
  ["倉位", "持倉規模"],
  ["做多", "建立長倉"],
  ["做空", "建立短倉"],
  ["資料覆核摘要", "本頁資料說明"],
  ["資料覆核", "資料說明"],
  ["覆核旗標", "仍需留意的資料"],
  ["專業化狀態", "資料完整度"],
  ["候選策略", "研究中的策略"],
  ["交易候選", "可留意的情況"],
  ["降級訊號", "先作觀察"],
  ["取消訊號", "交易計劃不成立"],
  ["復盤訊號", "交易後記錄"],
  ["正式案例", "資料較完整的案例"],
  ["通過正式門檻", "資料欄位較完整"],
];

function applyHongKongEditorialPass() {
  const walker = document.createTreeWalker(app, NodeFilter.SHOW_TEXT);
  const nodes = [];
  for (let node = walker.nextNode(); node; node = walker.nextNode()) nodes.push(node);
  nodes.forEach((node) => {
    if (node.parentElement?.closest("pre, code, script, style, textarea, .formula")) return;
    let text = node.nodeValue;
    hongKongEditorialReplacements.forEach(([from, to]) => {
      text = text.replaceAll(from, to);
    });
    node.nodeValue = text;
  });
}

function render() {
  const { path } = parseRoute();
  setActiveNav();

  if (!path) renderHome();
  else if (path === "learn") renderLearningPath();
  else if (path === "toolbox") renderToolbox();
  else if (path === "indicators") renderIndicators();
  else if (path.startsWith("indicators/")) renderIndicatorDetailCompact(path.split("/")[1]);
  else if (path === "candlesticks" || path.startsWith("candlesticks/")) renderCandlesticks();
  else if (path === "compare") renderCompare();
  else if (path === "playground") renderPlayground();
  else if (path === "casebook") renderCasebook();
  else if (path === "glossary") renderGlossary();
  else if (path === "subscribe") renderSubscribe();
  else if (path === "journal") renderJournal();
  else if (path === "combo") renderComboChecker();
  else if (path === "tv-strategies") renderTradingViewStrategies();
  else if (path === "strategy-cases") renderStrategyCases();
  else if (path.startsWith("strategy-cases/")) renderStrategyCaseDetailCompact(path.split("/")[1]);
  else if (path === "script") renderScriptSystem();
  else if (path === "script-demo") renderScriptDemo();
  else if (path === "trial") renderScriptTrial();
  else renderNotFound();

  enhanceDataTables();
  applyHongKongEditorialPass();
  app.focus({ preventScroll: true });
}

function generateSeries(caseName, count = 54) {
  const series = [];
  let prevClose = 100;
  for (let i = 0; i < count; i += 1) {
    let base;
    if (caseName === "range") {
      base = 105 + Math.sin(i / 2.2) * 5.5 + Math.cos(i / 5) * 1.6;
    } else if (caseName === "reversal") {
      base = i < count * 0.48 ? 122 - i * 0.85 : 80 + (i - count * 0.48) * 1.18;
      base += Math.sin(i / 2.3) * 2.1;
    } else if (caseName === "breakout") {
      base = i < count * 0.62 ? 100 + Math.sin(i / 2.5) * 1.8 : 101 + (i - count * 0.62) * 1.35;
      base += Math.cos(i / 4) * 0.9;
    } else {
      base = 88 + i * 0.72 + Math.sin(i / 2.8) * 2.6;
    }
    const open = i === 0 ? base - 0.6 : prevClose + Math.sin(i * 1.7) * 0.75;
    const close = base + Math.sin(i * 1.13) * 0.85;
    const high = Math.max(open, close) + 1.2 + Math.abs(Math.sin(i / 3)) * 1.8;
    const low = Math.min(open, close) - 1.1 - Math.abs(Math.cos(i / 4)) * 1.5;
    const volume =
      820 +
      Math.round(Math.abs(close - open) * 120) +
      Math.round((caseName === "breakout" && i > count * 0.62 ? 480 : 0)) +
      Math.round((Math.sin(i / 4) + 1) * 120);
    series.push({ open, high, low, close, volume });
    prevClose = close;
  }
  return series;
}

function sma(values, period) {
  return values.map((_, index) => {
    if (index < period - 1) return null;
    const slice = values.slice(index - period + 1, index + 1);
    return slice.reduce((sum, value) => sum + value, 0) / period;
  });
}

function std(values, period) {
  return values.map((_, index) => {
    if (index < period - 1) return null;
    const slice = values.slice(index - period + 1, index + 1);
    const mean = slice.reduce((sum, value) => sum + value, 0) / period;
    const variance =
      slice.reduce((sum, value) => sum + (value - mean) ** 2, 0) / period;
    return Math.sqrt(variance);
  });
}

function rsi(values, period) {
  return values.map((_, index) => {
    if (index < period) return null;
    let gains = 0;
    let losses = 0;
    for (let i = index - period + 1; i <= index; i += 1) {
      const change = values[i] - values[i - 1];
      if (change >= 0) gains += change;
      else losses -= change;
    }
    if (losses === 0) return 100;
    const rs = gains / losses;
    return 100 - 100 / (1 + rs);
  });
}

function pointsForLine(values, x, y) {
  return values
    .map((value, index) => (value == null ? null : `${x(index)},${y(value)}`))
    .filter(Boolean)
    .join(" ");
}

const marketCaseProfiles = {
  uptrend: {
    symbol: "AAPL.US",
    name: "Apple Inc.",
    period: "2023 主升段",
    label: "趨勢延續案例",
    source: "Yahoo Finance chart API 本地快照",
  },
  range: {
    symbol: "SPY.US",
    name: "SPDR S&P 500 ETF",
    period: "震盪整理期",
    label: "區間震盪案例",
    source: "Yahoo Finance chart API 本地快照",
  },
  reversal: {
    symbol: "QQQ.US",
    name: "Invesco QQQ Trust",
    period: "急跌後修復",
    label: "動能修復案例",
    source: "Yahoo Finance chart API 本地快照",
  },
  breakout: {
    symbol: "0700.HK",
    name: "Tencent Holdings",
    period: "壓縮突破/消息波動",
    label: "突破與成交量案例",
    source: "Yahoo Finance chart API 本地快照",
  },
};

function marketCaseForIndicator(item) {
  if (item.category === "波動率" || item.category === "通道/型態") return "breakout";
  if (item.category === "成交量") return "breakout";
  if (item.category === "動能") return "reversal";
  if (item.category === "支撐阻力") return "range";
  if (item.category === "市場寬度" || item.category === "綜合") return "uptrend";
  return "uptrend";
}

function realMarketCase(caseName) {
  return window.__MARKET_CASES__?.cases?.[caseName] || null;
}

function marketSeriesForCase(caseName, fallbackCount = 58) {
  const realCase = realMarketCase(caseName);
  if (realCase?.bars?.length) {
    const windowSize = Math.min(realCase.bars.length, caseName === "range" ? 72 : 76);
    const offset = caseName === "uptrend" ? Math.max(0, realCase.bars.length - windowSize) : Math.max(0, Math.floor((realCase.bars.length - windowSize) * 0.55));
    return {
      series: realCase.bars.slice(offset, offset + windowSize).map((bar) => ({
        date: bar.date,
        open: Number(bar.open),
        high: Number(bar.high),
        low: Number(bar.low),
        close: Number(bar.close),
        volume: Number(bar.volume) || 0,
      })),
      isSynthetic: false,
      provenance: `${window.__MARKET_CASES__?.provider || "本地歷史 OHLCV"} 本地快照`,
      reason: "已載入本地歷史 OHLCV 快照；並非即時行情或策略回測結果。",
    };
  }
  return {
    series: generateSeries(caseName, fallbackCount),
    isSynthetic: true,
    provenance: "教學用生成序列",
    reason: "本地歷史 OHLCV 快照未載入；此圖只示範版面與計算邏輯，不能當成 Yahoo Finance 或真實市場案例。",
  };
}

function seriesFromMarketCase(caseName, fallbackCount = 58) {
  return marketSeriesForCase(caseName, fallbackCount).series;
}

function marketCaseDisplay(caseName, market = marketSeriesForCase(caseName)) {
  const fallback = marketCaseProfiles[caseName] || marketCaseProfiles.uptrend;
  const realCase = realMarketCase(caseName);
  if (market.isSynthetic || !realCase) {
    return {
      symbol: "教學序列",
      name: "非市場快照",
      period: "本地資料未載入",
      label: fallback.label,
      source: `${market.provenance}；${market.reason}`,
    };
  }
  return {
    symbol: realCase.symbol,
    name: realCase.name || fallback.name || realCase.symbol,
    period: `${realCase.start} 至 ${realCase.end}`,
    label: realCase.label || fallback.label,
    source: `${window.__MARKET_CASES__?.provider || fallback.source}，本地快照 ${window.__MARKET_CASES__?.downloadedAt || ""}`.trim(),
  };
}

function tradeAnnotationsForSeries(series, caseName) {
  const entryIndex = caseName === "range" ? 31 : caseName === "reversal" ? 32 : 34;
  const entry = series[entryIndex]?.close || series[Math.floor(series.length * 0.62)].close;
  const recent = series.slice(Math.max(0, entryIndex - 8), entryIndex + 1);
  const stop =
    caseName === "range"
      ? Math.min(...recent.map((bar) => bar.low)) * 0.995
      : Math.min(...recent.map((bar) => bar.low)) * 0.99;
  const risk = Math.max(entry - stop, entry * 0.025);
  const target = entry + risk * 2;
  const invalidIndex = Math.min(series.length - 1, entryIndex + 8);
  return [
    { type: "point", index: entryIndex, price: entry, date: series[entryIndex]?.date, label: "入場/確認", color: "#0f766e" },
    { type: "line", index: entryIndex, price: stop, date: series[entryIndex]?.date, label: "止蝕/失效", color: "#dc2626" },
    { type: "line", index: entryIndex, price: target, date: series[entryIndex]?.date, label: "2R 目標", color: "#15803d" },
    { type: "point", index: invalidIndex, price: series[invalidIndex].close, date: series[invalidIndex]?.date, label: "管理倉位", color: "#d97706" },
  ];
}

function formatPrice(value) {
  if (!Number.isFinite(value)) return "-";
  return value >= 1000 ? value.toFixed(0) : value >= 100 ? value.toFixed(2) : value.toFixed(3);
}

function renderMarketCaseFacts(caseName, count = 58) {
  const market = marketSeriesForCase(caseName, count);
  const profile = marketCaseDisplay(caseName, market);
  const series = market.series;
  const [entry, stop, target, review] = tradeAnnotationsForSeries(series, caseName);
  const rows = [
    ["資料類型", market.isSynthetic ? "教學用生成序列" : "本地歷史 OHLCV 快照"],
    ["股票 / ETF", `${profile.symbol} ${profile.name}`],
    ["時間", profile.period],
    ["入場 / 確認價", `${entry.date} · ${formatPrice(entry.price)}`],
    ["止蝕 / 失效價", `${stop.date} · ${formatPrice(stop.price)}`],
    ["2R 目標價", `${target.date} 設定 · ${formatPrice(target.price)}`],
    ["後續檢查價", `${review.date} · ${formatPrice(review.price)}`],
  ];
  return `
    <div class="case-facts" aria-label="${market.isSynthetic ? "教學序列資料" : "歷史案例資料"}">
      ${rows
        .map(
          ([label, value]) => `
            <div class="case-fact">
              <span>${escapeHtml(label)}</span>
              <strong>${escapeHtml(value)}</strong>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderPriceChart({
  series,
  period = 20,
  showMa = true,
  showBands = true,
  showRsi = true,
  showVolume = true,
  highlight = "",
  annotations = [],
  meta = "",
  priceMode = "line",
}) {
  const width = 860;
  const priceHeight = 255;
  const rsiHeight = showRsi ? 86 : 0;
  const volumeHeight = showVolume ? 70 : 0;
  const gap = 22;
  const height = priceHeight + rsiHeight + volumeHeight + gap * 2;
  const left = 48;
  const right = 18;
  const top = 18;
  const chartWidth = width - left - right;
  const prices = series.flatMap((d) => [d.high, d.low]);
  const closes = series.map((d) => d.close);
  const ma = sma(closes, period);
  const deviation = std(closes, period);
  const upper = ma.map((value, index) =>
    value == null || deviation[index] == null ? null : value + deviation[index] * 2,
  );
  const lower = ma.map((value, index) =>
    value == null || deviation[index] == null ? null : value - deviation[index] * 2,
  );
  const allPriceValues = [
    ...prices,
    ...(showMa ? ma.filter(Boolean) : []),
    ...(showBands ? upper.filter(Boolean) : []),
    ...(showBands ? lower.filter(Boolean) : []),
    ...annotations.map((item) => item.price).filter((value) => Number.isFinite(value)),
  ];
  const minPrice = Math.min(...allPriceValues) * 0.985;
  const maxPrice = Math.max(...allPriceValues) * 1.015;
  const x = (index) => left + (index / (series.length - 1)) * chartWidth;
  const y = (value) =>
    top + ((maxPrice - value) / (maxPrice - minPrice)) * priceHeight;
  const candleWidth = Math.max(4, chartWidth / series.length - 3);
  const maxVolume = Math.max(...series.map((d) => d.volume));
  const volumeTop = top + priceHeight + gap;
  const rsiTop = volumeTop + volumeHeight + (showVolume ? gap : 0);
  const rsiValues = rsi(closes, Math.min(period, 30));
  const yRsi = (value) => rsiTop + ((100 - value) / 100) * rsiHeight;
  const firstDate = series[0]?.date || "";
  const lastDate = series[series.length - 1]?.date || "";
  const closeLine = pointsForLine(closes, x, y);

  const grid = [0, 0.25, 0.5, 0.75, 1]
    .map((ratio) => {
      const lineY = top + ratio * priceHeight;
      const price = maxPrice - ratio * (maxPrice - minPrice);
      return `<line x1="${left}" x2="${width - right}" y1="${lineY}" y2="${lineY}" stroke="#e5edf2"/><text x="8" y="${lineY + 4}" fill="#647282" font-size="11">${price.toFixed(1)}</text>`;
    })
    .join("");

  const candles = series
    .map((d, index) => {
      const cx = x(index);
      const up = d.close >= d.open;
      const color = up ? "#15803d" : "#dc2626";
      const bodyY = Math.min(y(d.open), y(d.close));
      const bodyH = Math.max(2, Math.abs(y(d.open) - y(d.close)));
      return `
        <line x1="${cx}" x2="${cx}" y1="${y(d.high)}" y2="${y(d.low)}" stroke="${color}" stroke-width="${priceMode === "line" ? "0.8" : "1.4"}" opacity="${priceMode === "line" ? "0.26" : "1"}"/>
        <rect x="${cx - candleWidth / 2}" y="${bodyY}" width="${candleWidth}" height="${bodyH}" rx="1.5" fill="${color}" opacity="${priceMode === "line" ? "0.14" : "0.88"}"/>
      `;
    })
    .join("");

  const volumeBars = showVolume
    ? series
        .map((d, index) => {
          const cx = x(index);
          const h = (d.volume / maxVolume) * volumeHeight;
          const color = d.close >= d.open ? "#86cfa3" : "#f2a6a6";
          return `<rect x="${cx - candleWidth / 2}" y="${volumeTop + volumeHeight - h}" width="${candleWidth}" height="${h}" fill="${color}"/>`;
        })
        .join("")
    : "";

  const rsiLayer = showRsi
    ? `
      <line x1="${left}" x2="${width - right}" y1="${yRsi(70)}" y2="${yRsi(70)}" stroke="#f3d7ad" stroke-dasharray="5 4"/>
      <line x1="${left}" x2="${width - right}" y1="${yRsi(30)}" y2="${yRsi(30)}" stroke="#f3d7ad" stroke-dasharray="5 4"/>
      <text x="8" y="${yRsi(70) + 4}" fill="#9a3412" font-size="11">70</text>
      <text x="8" y="${yRsi(30) + 4}" fill="#9a3412" font-size="11">30</text>
      <polyline points="${pointsForLine(rsiValues, x, yRsi)}" fill="none" stroke="#d97706" stroke-width="2.2"/>
    `
    : "";

  const annotationLayer = annotations
    .map((item) => {
      const color = item.color || "#0f766e";
      const priceText = `${item.label} ${formatPrice(item.price)}`;
      const dateText = item.date || series[Math.max(0, Math.min(series.length - 1, item.index || 0))]?.date || "";
      if (item.type === "line") {
        const yy = y(item.price);
        return `
          <line x1="${left}" x2="${width - right}" y1="${yy}" y2="${yy}" stroke="${color}" stroke-width="1.4" stroke-dasharray="6 5" opacity="0.82"/>
          <rect x="${width - right - 145}" y="${yy - 18}" width="138" height="34" rx="4" fill="#ffffff" stroke="${color}" opacity="0.96"/>
          <text x="${width - right - 76}" y="${yy - 4}" fill="${color}" font-size="11" font-weight="700" text-anchor="middle">${escapeHtml(priceText)}</text>
          <text x="${width - right - 76}" y="${yy + 10}" fill="#647282" font-size="10" text-anchor="middle">${escapeHtml(dateText)}</text>
        `;
      }
      const cx = x(Math.max(0, Math.min(series.length - 1, item.index)));
      const cy = y(item.price);
      const boxX = Math.min(cx + 8, width - right - 150);
      const textX = boxX + 70;
      return `
        <circle cx="${cx}" cy="${cy}" r="6" fill="${color}" stroke="#ffffff" stroke-width="2"/>
        <rect x="${boxX}" y="${cy - 32}" width="140" height="34" rx="4" fill="#ffffff" stroke="${color}" opacity="0.96"/>
        <text x="${textX}" y="${cy - 18}" fill="${color}" font-size="11" font-weight="700" text-anchor="middle">${escapeHtml(priceText)}</text>
        <text x="${textX}" y="${cy - 4}" fill="#647282" font-size="10" text-anchor="middle">${escapeHtml(dateText)}</text>
      `;
    })
    .join("");

  return `
    <div class="chart-viewport" data-chart-viewport>
      <div class="chart-scroll">
        <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="示範 K 線圖">
      <rect width="${width}" height="${height}" fill="#ffffff"/>
      ${grid}
      ${showBands ? `<polyline points="${pointsForLine(upper, x, y)}" fill="none" stroke="#2563eb" stroke-width="1.4" opacity="0.55"/><polyline points="${pointsForLine(lower, x, y)}" fill="none" stroke="#2563eb" stroke-width="1.4" opacity="0.55"/>` : ""}
      ${candles}
      ${priceMode === "line" ? `<polyline points="${closeLine}" fill="none" stroke="#17202a" stroke-width="3.2"/><text x="${left}" y="${top + priceHeight + 15}" fill="#647282" font-size="11">收市價折線，淡色陰陽燭為真實 OHLC 輔助</text>` : ""}
      ${showMa ? `<polyline points="${pointsForLine(ma, x, y)}" fill="none" stroke="#0f766e" stroke-width="2.6"/>` : ""}
      ${annotationLayer}
      ${volumeBars}
      ${showVolume ? `<text x="${left}" y="${volumeTop - 7}" fill="#647282" font-size="12">Volume</text>` : ""}
      ${rsiLayer}
      ${showRsi ? `<text x="${left}" y="${rsiTop - 7}" fill="#647282" font-size="12">RSI</text>` : ""}
      ${highlight ? `<text x="${width - right}" y="15" fill="#0f766e" font-size="12" text-anchor="end">${escapeHtml(highlight)}</text>` : ""}
      ${meta ? `<text x="${left}" y="15" fill="#334155" font-size="12" font-weight="700">${escapeHtml(meta)}</text>` : ""}
      ${firstDate ? `<text x="${left}" y="${height - 5}" fill="#647282" font-size="11">${escapeHtml(firstDate)}</text><text x="${width - right}" y="${height - 5}" fill="#647282" font-size="11" text-anchor="end">${escapeHtml(lastDate)}</text>` : ""}
        </svg>
      </div>
      <button class="button secondary chart-expand-button" type="button" data-action="chart-expand" aria-expanded="false">放大圖表</button>
    </div>
  `;
}

function teachingChartContext(item) {
  if (item.category === "市場寬度") {
    return {
      kind: "data-required",
      title: `${item.abbr} 市場寬度資料`,
      subtitle: "需要市場寬度資料，暫不以單一股票走勢代替",
      requirement: "需要指定市場與成份範圍的上升/下跌家數、新高/新低家數或升跌成交量，並標示交易所、指數成份與日期。",
    };
  }
  if (item.slug === "put-call-ratio") {
    return {
      kind: "data-required",
      title: `${item.abbr} 期權資料`,
      subtitle: "需要期權資料，暫不以股票價格走勢代替",
      requirement: "需要認沽與認購的成交量或未平倉合約、合約範圍、到期日結構及資料日期；成交量 PCR 與未平倉 PCR 不能混用。",
    };
  }
  const caseName = marketCaseForIndicator(item);
  const market = marketSeriesForCase(caseName, 58);
  return {
    kind: "price",
    caseName,
    market,
    profile: marketCaseDisplay(caseName, market),
    title: `${item.abbr} 教學走勢`,
    subtitle: market.isSynthetic ? "教學用生成序列 · 不代表市場資料" : "本地歷史價格資料 · 非即時行情",
  };
}

function renderTeachingChartDataRequirement(context) {
  return `
    <aside class="chart-data-requirement" role="note">
      <span class="lesson-label">資料要求</span>
      <h3>${escapeHtml(context.title)}</h3>
      <p>${escapeHtml(context.requirement)}</p>
      <p class="small">現有本地資料只有價格 OHLCV，因此本頁不會把個股走勢包裝成這個指標的計算圖。資料補齊後，才會顯示可核對的數列、範圍與日期。</p>
    </aside>
  `;
}

function renderTeachingChart(item) {
  const context = teachingChartContext(item);
  if (context.kind === "data-required") return renderTeachingChartDataRequirement(context);
  const { caseName, market, profile } = context;
  const period = item.category === "動能" ? 14 : 20;
  const series = market.series;
  return renderPriceChart({
    series,
    period,
    showMa: true,
    showBands: item.category === "波動率" || item.slug === "bollinger-bands",
    showRsi: item.category === "動能" || item.slug === "rsi",
    showVolume: item.category === "成交量" || item.slug === "volume",
    annotations: tradeAnnotationsForSeries(series, caseName),
    highlight: `${item.abbr} ${market.isSynthetic ? "教學序列" : "歷史案例"}`,
    meta: `${profile.symbol} ${profile.name}｜${profile.period}｜${profile.label}`,
  });
}

function renderPlaygroundChart(market = marketSeriesForCase(state.playground.caseName, 58)) {
  const p = state.playground;
  const series = market.series;
  const profile = marketCaseDisplay(p.caseName, market);
  return renderPriceChart({
    series,
    period: Number(p.period),
    showMa: p.ma,
    showBands: p.bands,
    showRsi: p.rsi,
    showVolume: p.volume,
    annotations: tradeAnnotationsForSeries(series, p.caseName),
    highlight: market.isSynthetic ? "教學序列參數練習" : "歷史案例參數練習",
    meta: `${profile.symbol} ${profile.name}｜${profile.period}｜${profile.label}`,
  });
}

function renderConceptChart(item) {
  const isVolume = item.category === "成交量";
  const isRisk = item.uses.includes("管理風險");
  const color = isVolume ? "#d97706" : isRisk ? "#dc2626" : "#0f766e";
  return `
    <svg viewBox="0 0 620 170" role="img" aria-label="${escapeHtml(item.name)} 概念圖">
      <rect width="620" height="170" rx="8" fill="#f8fbfc"/>
      <line x1="35" x2="585" y1="126" y2="126" stroke="#dce4ea"/>
      <line x1="35" x2="35" y1="22" y2="126" stroke="#dce4ea"/>
      <path d="M40 116 C105 82, 145 142, 205 96 S315 78, 375 58 S478 95, 570 36" fill="none" stroke="#17202a" stroke-width="3"/>
      <path d="M40 119 C110 106, 170 112, 230 96 S360 74, 575 58" fill="none" stroke="${color}" stroke-width="4"/>
      ${isVolume
        ? Array.from({ length: 18 }, (_, i) => {
            const h = 18 + Math.abs(Math.sin(i / 2)) * 42;
            const x = 50 + i * 29;
            return `<rect x="${x}" y="${126 - h}" width="14" height="${h}" fill="${color}" opacity="0.45"/>`;
          }).join("")
        : ""}
      ${isRisk ? `<path d="M90 108 L180 98 L270 88 L360 76 L450 66 L550 58" fill="none" stroke="#dc2626" stroke-width="2" stroke-dasharray="6 6"/>` : ""}
      <text x="42" y="28" fill="#647282" font-size="13">價格</text>
      <text x="570" y="151" fill="#647282" font-size="13" text-anchor="end">時間</text>
      <text x="310" y="28" fill="${color}" font-size="14" font-weight="700" text-anchor="middle">${escapeHtml(item.abbr)} 如何輔助判斷</text>
    </svg>
  `;
}

document.addEventListener("submit", (event) => {
  const form = event.target.closest("form");
  if (!form) return;
  const action = form.dataset.action;
  if (!action) return;
  event.preventDefault();
  const data = new FormData(form);
  if (action === "home-search") {
    const q = String(data.get("q") || "").trim();
    location.hash = `#/indicators${q ? `?q=${encodeURIComponent(q)}` : ""}`;
  }
  if (action === "subscribe") {
    const email = String(data.get("email") || "").trim();
    storageSet("ti-email", email);
    const button = form.querySelector("button");
    if (button) {
      const original = button.textContent;
      button.textContent = "已儲存";
      setTimeout(() => {
        button.textContent = original;
      }, 1400);
    }
  }
  if (action === "script-trial") {
    storageSet("ti-script-trial", {
      email: String(data.get("email") || "").trim(),
      tvUser: String(data.get("tvUser") || "").trim(),
      market: String(data.get("market") || "").trim(),
      style: String(data.get("style") || "").trim(),
      goal: String(data.get("goal") || "").trim(),
      savedAt: new Date().toISOString(),
    });
    state.trialSaved = true;
    renderScriptTrial();
  }
  if (action === "journal-save") {
    saveJournalEntry({
      date: String(data.get("date") || "").trim(),
      symbol: String(data.get("symbol") || "").trim(),
      indicator: String(data.get("indicator") || "").trim(),
      result: String(data.get("result") || "").trim(),
      entry: String(data.get("entry") || "").trim(),
      stop: String(data.get("stop") || "").trim(),
      target: String(data.get("target") || "").trim(),
      rr: String(data.get("rr") || "").trim(),
      background: String(data.get("background") || "").trim(),
      mistake: String(data.get("mistake") || "").trim(),
      review: String(data.get("review") || "").trim(),
    });
    renderJournal();
  }
});

document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const action = target.dataset.action;
  if (action === "favorite") {
    event.preventDefault();
    toggleFavorite(target.dataset.slug);
  }
  if (action === "toggle-core") {
    const { params } = parseRoute();
    updateIndicatorHash({ core: params.get("core") === "1" ? "" : "1" });
  }
  if (action === "export-local-data") {
    event.preventDefault();
    downloadLocalData();
  }
  if (action === "print-page") {
    event.preventDefault();
    window.print();
  }
  if (action === "chart-expand") {
    event.preventDefault();
    const viewport = target.closest("[data-chart-viewport]");
    if (!viewport) return;
    const expanded = viewport.classList.toggle("is-expanded");
    document.body.classList.toggle("chart-expanded", expanded);
    target.textContent = expanded ? "收起圖表" : "放大圖表";
    target.setAttribute("aria-expanded", String(expanded));
  }
  if (action === "quiz-answer") {
    event.preventDefault();
    handleQuizAnswer(target);
  }
  if (action === "journal-delete") {
    event.preventDefault();
    deleteJournalEntry(target.dataset.id);
    renderJournal();
  }
  if (action === "confirm-import-local-data") {
    event.preventDefault();
    if (state.importPreview?.data) {
      mergeImportedData(state.importPreview.data);
      state.importPreview = {
        error: null,
        summary: summarizeImportData(state.importPreview.data),
        data: null,
        done: true,
      };
      renderSubscribe();
    }
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  const viewport = document.querySelector("[data-chart-viewport].is-expanded");
  if (!viewport) return;
  viewport.classList.remove("is-expanded");
  document.body.classList.remove("chart-expanded");
  const button = viewport.querySelector('[data-action="chart-expand"]');
  if (button) {
    button.textContent = "放大圖表";
    button.setAttribute("aria-expanded", "false");
    button.focus();
  }
});

let filterTimer = null;
document.addEventListener("input", (event) => {
  const filter = event.target.dataset.filter;
  if (filter) {
    clearTimeout(filterTimer);
    filterTimer = setTimeout(() => {
      updateIndicatorHash({ [filter]: event.target.value });
    }, 180);
  }
  const playgroundKey = event.target.dataset.playground;
  if (playgroundKey) {
    updatePlayground(event.target);
  }
  if (event.target.dataset.riskField) {
    const calculator = event.target.closest("[data-risk-calculator]");
    if (calculator) updateRiskCalculator(calculator);
  }
  if (event.target.dataset.tvField) {
    const scorecard = event.target.closest("[data-tv-scorecard]");
    if (scorecard) updateTradingViewScorecard(scorecard);
  }
  if (event.target.dataset.noteSlug) {
    saveNote(event.target.dataset.noteSlug, event.target.value);
  }
  if (event.target.dataset.glossaryLookup !== undefined) {
    updateGlossaryLookup(event.target);
  }
  if (event.target.dataset.candleField !== undefined) {
    updateCandlestickReader(event.target);
  }
});

document.addEventListener("change", (event) => {
  const filter = event.target.dataset.filter;
  if (filter) updateIndicatorHash({ [filter]: event.target.value });
  const playgroundKey = event.target.dataset.playground;
  if (playgroundKey) updatePlayground(event.target);
  if (event.target.dataset.helper) updateIndicatorHelper(event.target);
  if (event.target.dataset.comboSelect !== undefined) updateComboChecker(event.target);
  if (event.target.dataset.comparePair !== undefined) updateCompareLab(event.target);
  if (event.target.dataset.candleField !== undefined) updateCandlestickReader(event.target);
  if (event.target.dataset.importFile !== undefined) handleImportFile(event.target);
});

function updatePlayground(input) {
  const key = input.dataset.playground;
  if (input.type === "checkbox") state.playground[key] = input.checked;
  else if (key === "period") state.playground[key] = Number(input.value);
  else state.playground[key] = input.value;
  renderPlayground();
}

function updateIndicatorHelper(input) {
  const helper = input.closest("[data-indicator-helper]");
  if (!helper) return;
  const use = helper.querySelector('[data-helper="use"]')?.value || "";
  const difficulty = helper.querySelector('[data-helper="difficulty"]')?.value || "";
  const results = helper.querySelector("[data-helper-results]");
  if (results) results.innerHTML = renderHelperResults(use, difficulty);
}

function updateGlossaryLookup(input) {
  const scope = input.closest(".glossary-lookup-card") || document;
  const results = scope.querySelector("[data-glossary-results]") || document.querySelector("[data-glossary-results]");
  if (!results) return;
  const matches = glossaryMatches(input.value);
  results.innerHTML = matches.length
    ? renderGlossaryCards(matches.slice(0, scope === document ? glossary.length : 4))
    : `<div class="empty-state small">找不到相關術語。</div>`;
}

function updateComboChecker(select) {
  const checker = select.closest("[data-combo-checker]");
  if (!checker) return;
  const slugs = [...checker.querySelectorAll("[data-combo-select]")]
    .map((item) => item.value)
    .filter(Boolean);
  const result = checker.querySelector("[data-combo-result]");
  const analysis = analyzeCombo(slugs);
  if (!result) return;
  result.className = `result-panel ${analysis.tone}`;
  result.innerHTML = `
    <strong>${analysis.title}</strong>
    ${analysis.lines.map((line) => `<span>${escapeHtml(shortText(line, 46))}</span>`).join("")}
  `;
}

function updateCompareLab(select) {
  const lab = select.closest("[data-compare-lab]");
  if (!lab) return;
  const pair = comparisons[Number(select.value)] || comparisons[0];
  const result = lab.querySelector("[data-compare-result]");
  const summary = comparePairSummary(pair);
  if (!result) return;
  result.className = `result-panel ${summary.tone}`;
  result.innerHTML = `
    <strong>${escapeHtml(summary.title)}</strong>
    ${summary.lines.map((line) => `<span>${escapeHtml(shortText(line, 46))}</span>`).join("")}
  `;
}

function updateCandlestickReader(input) {
  const reader = input.closest("[data-candlestick-reader]");
  if (!reader) return;
  const values = Object.fromEntries(
    [...reader.querySelectorAll("[data-candle-field]")].map((field) => [
      field.dataset.candleField,
      field.value,
    ]),
  );
  const result = candlestickReaderResult(values);
  const panel = reader.querySelector("[data-candle-result]");
  if (!panel) return;
  panel.className = `result-panel ${result.tone}`;
  panel.innerHTML = `
    <strong>${result.title}</strong>
    <span>${result.action}</span>
    ${result.notes.map((note) => `<span>${escapeHtml(note)}</span>`).join("")}
  `;
}

async function handleImportFile(input) {
  const file = input.files?.[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    state.importPreview = {
      error: null,
      data,
      summary: summarizeImportData(data),
    };
  } catch {
    state.importPreview = {
      error: "JSON 格式無法讀取。請使用本網站匯出的本地資料檔。",
      data: null,
      summary: null,
    };
  }
  renderSubscribe();
}

function handleQuizAnswer(button) {
  const card = button.closest(".quiz-card");
  const result = card?.querySelector("[data-quiz-result]");
  if (!result) return;
  const isCorrect = button.dataset.answer === button.dataset.correct;
  card.querySelectorAll(".quiz-option").forEach((option) => {
    option.classList.toggle("selected", option === button);
  });
  result.className = `result-panel ${isCorrect ? "result-good" : "result-bad"}`;
  result.textContent = isCorrect
    ? `答對：${button.dataset.explain}`
    : `答錯：${button.dataset.explain}`;
  recordQuizResult({
    caseName: card.dataset.quizCase || state.playground.caseName,
    answer: button.dataset.answer,
    correctAnswer: button.dataset.correct,
    correct: isCorrect,
    explanation: button.dataset.explain,
  });
  const stats = document.querySelector("[data-quiz-stats]");
  if (stats) stats.innerHTML = `<span class="lesson-label">測驗統計</span><h2>測驗成績記錄</h2>${renderQuizStatsContent()}`;
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-scroll-target]");
  if (!button) return;
  const target = document.querySelector(`[data-section="${button.dataset.scrollTarget}"]`);
  if (target) {
    if (target.matches("details")) target.open = true;
    const fold = target.closest("details");
    if (fold) fold.open = true;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

function numberFromField(container, key) {
  const value = container.querySelector(`[data-risk-field="${key}"]`)?.value;
  return Number(value);
}

function numberFromTvField(container, key) {
  const value = container.querySelector(`[data-tv-field="${key}"]`)?.value;
  return Number(value);
}

function updateTradingViewScorecard(container) {
  const trades = numberFromTvField(container, "trades");
  const profitFactor = numberFromTvField(container, "profitFactor");
  const drawdown = numberFromTvField(container, "drawdown");
  const winRate = numberFromTvField(container, "winRate");
  const years = numberFromTvField(container, "years");
  const params = numberFromTvField(container, "params");
  const result = container.querySelector("[data-tv-score-result]");
  if (!result) return;
  if (![trades, profitFactor, drawdown, winRate, years, params].every((value) => Number.isFinite(value) && value >= 0)) {
    result.className = "result-panel";
    result.textContent = "輸入數字後會提示樣本數、回撤、過度擬合和是否值得進一步前向測試。";
    return;
  }

  let score = 0;
  const notes = [];
  if (trades >= 100) score += 2;
  else if (trades >= 40) score += 1;
  else notes.push("交易次數偏少，統計信心不足。");
  if (profitFactor >= 1.5) score += 2;
  else if (profitFactor >= 1.2) score += 1;
  else notes.push("Profit Factor 偏低，交易成本後可能不夠吸引。");
  if (drawdown <= 15) score += 2;
  else if (drawdown <= 30) score += 1;
  else notes.push("最大回撤偏高，實盤心理壓力可能很大。");
  if (years >= 4) score += 1;
  else notes.push("測試年份偏短，可能只適合某一段市況。");
  if (params <= 5) score += 1;
  else notes.push("參數太多，過度擬合風險上升。");
  if (winRate > 80 && profitFactor < 1.4) notes.push("勝率很高但 Profit Factor 不高，可能是小賺大虧型策略。");

  const title = score >= 7 ? "資料較完整，可進入下一輪檢查" : score >= 4 ? "部分資料仍需補充" : "現有資料不足以作進一步判斷";
  result.className = `result-panel ${score >= 7 ? "result-good" : score >= 4 ? "result-warn" : "result-bad"}`;
  result.innerHTML = `
    <strong>${title}</strong>
    <span>資料完整度：${score}/8。這只是按欄位檢查資料，不是盈利評分。下一步：${score >= 7 ? "用未參與調校的資料做前瞻測試。" : score >= 4 ? "減少參數、加入交易成本，並延長測試期間。" : "回到策略假設，重新寫清楚入市和離場規則。"}</span>
    ${notes.length ? notes.map((note) => `<span>${escapeHtml(note)}</span>`).join("") : "<span>樣本、回撤和參數數量暫時沒有明顯紅旗。</span>"}
  `;
}

function updateRiskCalculator(container) {
  const entry = numberFromField(container, "entry");
  const stop = numberFromField(container, "stop");
  const target = numberFromField(container, "target");
  const account = numberFromField(container, "account");
  const riskPct = numberFromField(container, "riskPct");
  const cost = numberFromField(container, "cost");
  const result = container.querySelector("[data-risk-result]");
  if (!result) return;

  if (![entry, stop, target, account, riskPct].every((value) => Number.isFinite(value) && value > 0)) {
    result.className = "result-panel";
    result.textContent = "輸入完整數字後會顯示扣費後 R 值、勝率門檻、建議最大股數和是否值得交易。";
    return;
  }
  if (!Number.isFinite(cost) || cost < 0) {
    result.className = "result-panel result-bad";
    result.textContent = "費用/滑價不能是負數；若不想估算成本，可先填 0。";
    return;
  }

  const grossRiskPerShare = Math.abs(entry - stop);
  const grossRewardPerShare = Math.abs(target - entry);
  if (!grossRiskPerShare || !grossRewardPerShare) {
    result.className = "result-panel result-bad";
    result.textContent = "入場、止蝕和目標不能相同；請先定義清楚的失效點和目標。";
    return;
  }

  const isLongSetup = stop < entry && target > entry;
  const isShortSetup = stop > entry && target < entry;
  if (!isLongSetup && !isShortSetup) {
    result.className = "result-panel result-bad";
    result.textContent = "方向不一致：做多時止蝕應低於入場、目標應高於入場；做空時相反。先修正交易劇本，再談 R 值。";
    return;
  }

  const riskPerShare = grossRiskPerShare + cost;
  const rewardPerShare = grossRewardPerShare - cost;
  if (rewardPerShare <= 0) {
    result.className = "result-panel result-bad";
    result.textContent = "按目前輸入，扣除費用和滑價後沒有正回報空間。這只表示未達預設風險回報條件，不是買賣建議。";
    return;
  }

  const rr = rewardPerShare / riskPerShare;
  const breakEvenWinRate = (riskPerShare / (riskPerShare + rewardPerShare)) * 100;
  const maxLoss = account * (riskPct / 100);
  const shares = Math.floor(maxLoss / riskPerShare);
  const direction = isLongSetup ? "做多" : "做空";
  const sizeNote =
    shares > 0
      ? `建議股數不超過 ${shares} 股。`
      : "以目前帳戶風險設定，連 1 股也超出單筆風險上限。";
  const riskPctNote =
    riskPct > 2
      ? "單筆風險高於 2%，新手應先降低倉位，避免少數錯誤交易傷害帳戶。"
      : "單筆風險在較可控範圍內，仍需按計劃執行止蝕。";
  const verdict =
    rr >= 2
      ? "合格：風險回報達 2R 或以上，仍需等待觸發訊號。"
      : rr >= 1.5
        ? "接近預設門檻：仍需更清楚的確認條件或較理想的入市價。"
        : "未達預設門檻：風險回報不足。結果只供計算參考，不構成交易建議。";
  result.className = `result-panel ${rr >= 2 ? "result-good" : rr >= 1.5 ? "result-warn" : "result-bad"}`;
  result.innerHTML = `
    <strong>${verdict}</strong>
    <span>方向：${direction}｜扣費後每股風險：${riskPerShare.toFixed(2)}｜扣費後每股潛在回報：${rewardPerShare.toFixed(2)}｜R 值：${rr.toFixed(2)}R</span>
    <span>打和所需勝率約 ${breakEvenWinRate.toFixed(1)}%。若帳戶 ${account.toFixed(0)}、單筆風險 ${riskPct.toFixed(1)}%，最大虧損約 ${maxLoss.toFixed(0)}，${sizeNote}</span>
    <span>${riskPctNote}</span>
  `;
}

window.addEventListener("hashchange", render);

if (!location.hash) {
  location.hash = "#/";
} else {
  render();
}
