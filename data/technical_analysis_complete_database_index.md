# 技術分析完整資料庫總索引

這是融合後的最終本地資料庫，整合人物、指標、研究材料、來源、雙語歸納、同指標對照與優勝判斷。

## 主要檔案

- `technical_analysis_complete.sqlite`：最終完整 SQLite 資料庫。
- `technical_analysis_complete_expert_profiles.csv`：完整人物總表。
- `technical_analysis_complete_indicator_profiles.csv`：完整指標/方法總表。
- `technical_analysis_complete_method_families.csv`：方法家族融會貫通表。

## 核心資料表

- `complete_expert_profiles`：100 位專家完整雙語研究檔案。
- `complete_indicator_profiles`：72 個指標/方法完整檔案，含優勝專家與對照者。
- `complete_source_profiles`：來源檔案，含連結到的人物與材料數。
- `method_family_synthesis`：按方法家族整理的用途、注意事項與核心專家。
- `study_sequence`：建議研究順序。
- `complete_search_index`：跨人物、指標、方法家族、來源的搜尋索引視圖。

## 數量摘要

- 專家：100
- 指標/方法：72
- 方法家族：18
- 來源：206

## 優先研究專家 Top 20

| # | 專家 | 權威層級 | 優勝指標數 | 優勝指標 |
|---:|---|---|---:|---|
| 19 | 威爾斯・威爾德 / J. Welles Wilder Jr. | 核心權威 / Core authority | 4 | ADX / DMI；ATR 平均真實波幅；Parabolic SAR；RSI 相對強弱指數 |
| 24 | 圖沙・昌德 / Tushar S. Chande | 核心權威 / Core authority | 4 | Aroon 指標；Chande 動量震盪器；隨機 RSI；VIDYA 動態平均 |
| 18 | 佩里・考夫曼 / Perry J. Kaufman | 重要權威 / Major authority | 3 | 自適應均線；KAMA 考夫曼自適應均線；交易系統 |
| 49 | 威廉・歐尼爾 / William J. O'Neil | 核心權威 / Core authority | 3 | CAN SLIM；杯柄形態；相對強弱 / 強勢股篩選 |
| 4 | 理查・威科夫 / Richard D. Wyckoff | 核心權威 / Core authority | 2 | 成交量分析；威科夫方法 |
| 20 | 傑拉德・阿佩爾 / Gerald Appel | 核心權威 / Core authority | 2 | MACD；移動平均 |
| 21 | 約翰・布林格 / John Bollinger | 核心權威 / Core authority | 2 | 布林通道；波動率 |
| 23 | 理查・唐奇安 / Richard Donchian | 重要權威 / Major authority | 2 | 唐奇安通道；趨勢跟隨 |
| 27 | 拉瑞・威廉斯 / Larry Williams | 核心權威 / Core authority | 2 | 動量；Williams %R |
| 34 | 湯姆・迪馬克 / Tom DeMark | 核心權威 / Core authority | 2 | DeMark 指標；市場時機 |
| 35 | 亞歷山大・艾爾德 / Alexander Elder | 核心權威 / Core authority | 2 | Elder-Ray；Force Index |
| 57 | 約翰・艾勒斯 / John F. Ehlers | 核心權威 / Core authority | 2 | 週期分析；Ehlers 濾波器 |
| 69 | 彼得・馬丁 / Peter G. Martin | 重要權威 / Major authority | 2 | 風險 / 回撤；Ulcer Index |
| 70 | 拜倫・麥肯 / Byron McCann | 重要權威 / Major authority | 2 | 風險 / 回撤；Ulcer Index |
| 100 | 大衛・阿隆森 / David Aronson | 重要權威 / Major authority | 2 | 回測與系統驗證；實證技術分析 |
| 1 | 查爾斯・道 / Charles H. Dow | 重要權威 / Major authority | 1 | 道氏理論 |
| 5 | 傑西・李佛摩 / Jesse Livermore | 專題權威 / Specialized authority | 1 | 讀帶 / 盤口判讀 |
| 6 | 威廉・江恩 / W. D. Gann | 重要權威 / Major authority | 1 | 江恩理論 |
| 7 | 拉爾夫・尼爾森・艾略特 / Ralph Nelson Elliott | 重要權威 / Major authority | 1 | 艾略特波浪 |
| 9 | 羅伯特・愛德華茲 / Robert D. Edwards | 重要權威 / Major authority | 1 | 支撐阻力 |

## 多專家共同研究指標 Top 30

| 指標/方法 | 家族 | 專家數 | 優勝 | 判斷 |
|---|---|---:|---|---|
| 趨勢跟隨 / Trend Following | 趨勢分析 / Trend Analysis | 20 | 理查・唐奇安 / Richard Donchian | 理查・唐奇安優勝，因其在原創性、專屬性與資料覆蓋上最強；主要對照者為威廉・彼得・漢密爾頓、達利・古比。 |
| 交易系統 / Trading Systems | 交易系統 / Trading Systems | 15 | 佩里・考夫曼 / Perry J. Kaufman | 佩里・考夫曼優勝，因其在原創性、專屬性與資料覆蓋上最強；主要對照者為拉倫斯・康納斯、約翰・艾勒斯。 |
| 市場寬度 / Market Breadth | 市場寬度 / Market Breadth | 14 | 內德・戴維斯 / Ned Davis | 內德・戴維斯優勝，因其在原創性、專屬性與資料覆蓋上最強；主要對照者為拉瑞・威廉斯、拉爾夫・文斯。 |
| 成交量分析 / Volume Analysis | 成交量與資金流 / Volume and Money Flow | 13 | 理查・威科夫 / Richard D. Wyckoff | 理查・威科夫優勝，因其在原創性、專屬性與資料覆蓋上最強；主要對照者為約瑟夫・格蘭維爾、巴夫・多米爾。 |
| 動量 / Momentum | 動量指標 / Momentum | 12 | 拉瑞・威廉斯 / Larry Williams | 拉瑞・威廉斯優勝，因其在原創性、專屬性與資料覆蓋上最強；主要對照者為羅伯特・科爾比、馬丁・普林格。 |
| 圖表型態 / Chart Patterns | 圖表分析 / Charting | 12 | 湯瑪斯・布考斯基 / Thomas N. Bulkowski | 湯瑪斯・布考斯基優勝，因其在原創性、專屬性與資料覆蓋上最強；主要對照者為茱莉・達爾奎斯特、羅伯特・愛德華茲。 |
| 實證技術分析 / Evidence-Based Technical Analysis | 實證研究與回測 / Research and Backtesting | 12 | 大衛・阿隆森 / David Aronson | 大衛・阿隆森優勝，因其在原創性、專屬性與資料覆蓋上最強；主要對照者為安德魯・羅、巴夫・多米爾。 |
| 支撐阻力 / Support and Resistance | 圖表分析 / Charting | 12 | 羅伯特・愛德華茲、約翰・麥基 / Robert D. Edwards / John Magee | 羅伯特・愛德華茲、約翰・麥基並列優勝；此指標/方法屬共同創作或共同權威，應並讀其資料。 |
| 價格行為 / Price Action | 圖表分析 / Charting | 11 | 本間宗久 / Munehisa Homma | 本間宗久優勝，因其在原創性、專屬性與資料覆蓋上最強；主要對照者為艾倫・安德魯斯、傑克・施瓦格。 |
| 回測與系統驗證 / Backtesting | 實證研究與回測 / Research and Backtesting | 9 | 大衛・阿隆森 / David Aronson | 大衛・阿隆森優勝，因其在原創性、專屬性與資料覆蓋上最強；主要對照者為茱莉・達爾奎斯特、湯瑪斯・布考斯基。 |
| 市場情緒 / Sentiment | 市場情緒 / Sentiment | 8 | 傑森・戈普弗特 / Jason Goepfert | 傑森・戈普弗特優勝，因其在原創性、專屬性與資料覆蓋上最強；主要對照者為內德・戴維斯、艾德森・古爾德。 |
| 相對強弱 / 強勢股篩選 / Relative Strength | 股票選股 / Stock Selection | 8 | 威廉・歐尼爾 / William J. O'Neil | 威廉・歐尼爾優勝，因其在原創性、專屬性與資料覆蓋上最強；主要對照者為查爾斯・柯克派翠克二世、蓋瑞・安東納奇。 |
| 移動平均 / Moving Average | 趨勢分析 / Trend Analysis | 8 | 傑拉德・阿佩爾 / Gerald Appel | 傑拉德・阿佩爾優勝，因其在原創性、專屬性與資料覆蓋上最強；主要對照者為約翰・墨菲、羅伯特・科爾比。 |
| 道氏理論 / Dow Theory | 技術分析基礎理論 / Foundations | 7 | 查爾斯・道 / Charles H. Dow | 查爾斯・道優勝，因其在原創性、專屬性與資料覆蓋上最強；主要對照者為威廉・彼得・漢密爾頓、羅伯特・里亞。 |
| 艾略特波浪 / Elliott Wave | 波浪理論 / Wave Analysis | 6 | 拉爾夫・尼爾森・艾略特 / Ralph Nelson Elliott | 拉爾夫・尼爾森・艾略特優勝，因其在原創性、專屬性與資料覆蓋上最強；主要對照者為羅伯特・普萊切特、A・J・佛羅斯特。 |
| 週期分析 / Cycle Analysis | 週期分析 / Cycle Analysis | 6 | 約翰・艾勒斯 / John F. Ehlers | 約翰・艾勒斯優勝，因其在原創性、專屬性與資料覆蓋上最強；主要對照者為威廉・江恩、拉爾夫・尼爾森・艾略特。 |
| RSI 相對強弱指數 / Relative Strength Index | 動量指標 / Momentum | 5 | 威爾斯・威爾德 / J. Welles Wilder Jr. | 威爾斯・威爾德優勝，因其在原創性、專屬性與資料覆蓋上最強；主要對照者為拉倫斯・康納斯、康斯坦絲・布朗。 |
| 威科夫方法 / Wyckoff Method | 成交量與資金流 / Volume and Money Flow | 4 | 理查・威科夫 / Richard D. Wyckoff | 理查・威科夫優勝，因其在原創性、專屬性與資料覆蓋上最強；主要對照者為大衛・韋斯、漢克・普魯登。 |
| 波動率 / Volatility | 波動率 / Volatility | 4 | 約翰・布林格 / John Bollinger | 約翰・布林格優勝，因其在原創性、專屬性與資料覆蓋上最強；主要對照者為安德魯・思拉舍、亞歷克斯・斯皮羅格魯。 |
| K 線 / 蠟燭圖 / Candlestick Charting | 圖表分析 / Charting | 3 | 史蒂夫・尼森 / Steve Nison | 史蒂夫・尼森優勝，因其在原創性、專屬性與資料覆蓋上最強；主要對照者為湯瑪斯・布考斯基、本間宗久。 |
| 讀帶 / 盤口判讀 / Tape Reading | 圖表分析 / Charting | 3 | 傑西・李佛摩 / Jesse Livermore | 傑西・李佛摩優勝，因其在原創性、專屬性與資料覆蓋上最強；主要對照者為理查・威科夫、漢弗萊・尼爾。 |
| 費波納契時間/價格 / Fibonacci Time and Price | 支撐阻力 / Support and Resistance | 3 | 喬・迪納波利 / Joe DiNapoli | 喬・迪納波利優勝，因其在原創性、專屬性與資料覆蓋上最強；主要對照者為卡洛琳・波羅登、羅伯特・邁納。 |
| 開盤區間突破 / Opening Range Breakout | 突破交易 / Breakout | 3 | 托比・克拉貝爾 / Toby Crabel | 托比・克拉貝爾優勝，因其在原創性、專屬性與資料覆蓋上最強；主要對照者為琳達・布拉德福德・拉什克、馬克・費雪。 |
| 點數圖 / Point and Figure | 圖表分析 / Charting | 3 | A・W・科恩 / A. W. Cohen | A・W・科恩優勝，因其在原創性、專屬性與資料覆蓋上最強；主要對照者為湯瑪斯・多爾西、傑瑞米・杜普萊西斯。 |
| ATR 平均真實波幅 / Average True Range | 波動率 / Volatility | 2 | 威爾斯・威爾德 / J. Welles Wilder Jr. | 威爾斯・威爾德優勝，因其在原創性、專屬性與資料覆蓋上最強；主要對照者為奧利維耶・塞班。 |
| MACD / Moving Average Convergence/Divergence | 動量指標 / Momentum | 2 | 傑拉德・阿佩爾 / Gerald Appel | 傑拉德・阿佩爾優勝，因其在原創性、專屬性與資料覆蓋上最強；主要對照者為亞歷克斯・斯皮羅格魯。 |
| MFI 資金流量指標 / Money Flow Index | 成交量與資金流 / Volume and Money Flow | 2 | 金・匡、阿夫魯姆・蘇達克 / Gene Quong / Avrum Soudack | 金・匡、阿夫魯姆・蘇達克並列優勝；此指標/方法屬共同創作或共同權威，應並讀其資料。 |
| Market Profile / Market Profile | 拍賣市場 / Auction Market | 2 | 彼得・史戴梅爾 / J. Peter Steidlmayer | 彼得・史戴梅爾優勝，因其在原創性、專屬性與資料覆蓋上最強；主要對照者為詹姆斯・道爾頓。 |
| McClellan Oscillator / McClellan Oscillator | 市場寬度 / Market Breadth | 2 | 謝爾曼・麥克萊倫、瑪麗安・麥克萊倫 / Sherman McClellan / Marian McClellan | 謝爾曼・麥克萊倫、瑪麗安・麥克萊倫並列優勝；此指標/方法屬共同創作或共同權威，應並讀其資料。 |
| Ulcer Index / Ulcer Index | 風險與回撤 / Risk and Drawdown | 2 | 彼得・馬丁、拜倫・麥肯 / Peter G. Martin / Byron McCann | 彼得・馬丁、拜倫・麥肯並列優勝；此指標/方法屬共同創作或共同權威，應並讀其資料。 |

## 方法家族

| 家族 | 指標數 | 核心問題 | 最佳用途 | 注意事項 |
|---|---:|---|---|---|
| 圖表分析 / Charting | 8 | 透過價格型態、K 線與結構辨識交易情境。 | 適合視覺化支撐阻力、突破、反轉與整理。 | 型態主觀性較高，應用統計或規則降低任意解讀。 |
| 趨勢分析 / Trend Analysis | 17 | 回答市場方向是否存在，以及趨勢是否延續。 | 適合中長線方向、均線、通道與趨勢跟隨。 | 盤整市容易產生滯後與反覆假訊號。 |
| 動量指標 / Momentum | 12 | 衡量價格推進力度、背離、超買超賣與短線節奏。 | 適合搭配趨勢方向做進出場時機判斷。 | 強趨勢中超買超賣可長時間維持。 |
| 成交量與資金流 / Volume and Money Flow | 8 | 用成交量、資金流與供需關係驗證價格走勢。 | 適合確認突破、派發/吸收、買賣壓力。 | 不同市場的成交量資料品質差異很大。 |
| 實證研究與回測 / Research and Backtesting | 2 | 用統計與資料驗證技術分析是否真的有可重複效果。 | 適合篩選可信方法、檢查資料探勘與建立證據標準。 | 研究結論常受樣本、成本、存活者偏差與市場變化影響。 |
| 市場寬度 / Market Breadth | 3 | 觀察指數背後參與股票的廣度與市場內部健康。 | 適合判斷牛熊轉折、指數背離與風險擴散。 | 多數廣度資料偏市場層級，不一定適用單一股票。 |
| 交易系統 / Trading Systems | 1 | 把技術規則轉為可測試、可重複的交易流程。 | 適合建立策略、回測、風控與樣本外驗證。 | 過度最佳化會讓歷史績效失真。 |
| 股票選股 / Stock Selection | 3 | 股票選股用於補充主要技術分析框架。 | 依指標性質搭配趨勢、動量、量價或風險資料使用。 | 避免孤立使用單一工具。 |
| 市場情緒 / Sentiment | 1 | 市場情緒用於補充主要技術分析框架。 | 依指標性質搭配趨勢、動量、量價或風險資料使用。 | 避免孤立使用單一工具。 |
| 波動率 / Volatility | 3 | 衡量市場波動環境、通道擴張收縮與風險狀態。 | 適合做倉位、停損距離與波動突破判斷。 | 波動率本身不提供方向，需要與趨勢或價格結構合用。 |
| 週期分析 / Cycle Analysis | 3 | 週期分析用於補充主要技術分析框架。 | 依指標性質搭配趨勢、動量、量價或風險資料使用。 | 避免孤立使用單一工具。 |
| 技術分析基礎理論 / Foundations | 1 | 先建立趨勢、確認、價格與成交量的基本框架。 | 用於判斷市場是否值得進一步套用指標。 | 不要把理論框架直接當成買賣訊號。 |
| 波浪理論 / Wave Analysis | 1 | 波浪理論用於補充主要技術分析框架。 | 依指標性質搭配趨勢、動量、量價或風險資料使用。 | 避免孤立使用單一工具。 |
| 支撐阻力 / Support and Resistance | 2 | 整理市場反覆反應的價位、通道與時間價格區域。 | 適合規劃風險報酬、停損、目標價與觀察區。 | 單一水平不可靠，需看成交量、趨勢和觸價反應。 |
| 突破交易 / Breakout | 2 | 突破交易用於補充主要技術分析框架。 | 依指標性質搭配趨勢、動量、量價或風險資料使用。 | 避免孤立使用單一工具。 |
| 風險與回撤 / Risk and Drawdown | 2 | 風險與回撤用於補充主要技術分析框架。 | 依指標性質搭配趨勢、動量、量價或風險資料使用。 | 避免孤立使用單一工具。 |
| 市場時機 / Market Timing | 2 | 市場時機用於補充主要技術分析框架。 | 依指標性質搭配趨勢、動量、量價或風險資料使用。 | 避免孤立使用單一工具。 |
| 拍賣市場 / Auction Market | 1 | 拍賣市場用於補充主要技術分析框架。 | 依指標性質搭配趨勢、動量、量價或風險資料使用。 | 避免孤立使用單一工具。 |
