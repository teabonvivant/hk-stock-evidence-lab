# 技術分析專家資料庫完成度稽核

稽核日期：2026-06-21

## 需求對照

- 100 位專家：已由 `experts` 表驗證。
- 依技術指標/方法對應專家：已由 `expert_concepts` 與 `indicator_expert_research` 檢視提供。
- 搜集研究資料：已由 `research_materials` 表、CSV 與 Markdown 索引提供。
- 本地記錄：SQLite、CSV、JSON、Markdown 均存於 `data/`。

## 數量摘要

- 專家數：100
- 研究材料數：311
- 無至少 2 筆研究材料的人物數：0
- 無至少 2 個不同來源的人物數：0

## 指標/方法覆蓋抽樣

| 指標/方法 | Expert | Relation | Materials |
|---|---|---|---:|
| ACD 開盤區間法 | 馬克・費雪 / Mark B. Fisher | 創始者 | 3 |
| ADX / DMI | 威爾斯・威爾德 / J. Welles Wilder Jr. | 創始者 | 3 |
| ATR 平均真實波幅 | 威爾斯・威爾德 / J. Welles Wilder Jr. | 創始者 | 3 |
| ATR 平均真實波幅 | 奧利維耶・塞班 / Olivier Seban | ATR 通道應用 | 3 |
| Aroon 指標 | 圖沙・昌德 / Tushar S. Chande | 創始者 | 4 |
| CAN SLIM | 威廉・歐尼爾 / William J. O'Neil | 創始者 | 3 |
| CCI 商品通道指標 | 唐納德・蘭伯特 / Donald R. Lambert | 創始者 | 2 |
| Chaikin 資金流 | 馬克・柴金 / Marc Chaikin | 創始者 | 3 |
| Chande 動量震盪器 | 圖沙・昌德 / Tushar S. Chande | 創始者 | 4 |
| Connors RSI | 拉倫斯・康納斯 / Laurence A. Connors | 創始者 | 5 |
| Coppock 曲線 | 艾德溫・科波克 / Edwin S. Coppock | 創始者 | 4 |
| DEMA / TEMA | 派翠克・馬洛伊 / Patrick G. Mulloy | 創始者 | 3 |
| DeMark 指標 | 湯姆・迪馬克 / Tom DeMark | 創始者 | 4 |
| Ehlers 濾波器 | 約翰・艾勒斯 / John F. Ehlers | 濾波器 | 3 |
| Elder-Ray | 亞歷山大・艾爾德 / Alexander Elder | 創始者 | 2 |
| Force Index | 亞歷山大・艾爾德 / Alexander Elder | 創始者 | 2 |
| Guppy 多重移動平均 | 達利・古比 / Daryl Guppy | 創始者 | 2 |
| Hull 移動平均 | 艾倫・霍爾 / Alan Hull | 創始者 | 3 |
| K 線 / 蠟燭圖 | 史蒂夫・尼森 / Steve Nison | 西方推廣者 | 4 |
| K 線 / 蠟燭圖 | 本間宗久 / Munehisa Homma | 歷史源流 | 4 |
| K 線 / 蠟燭圖 | 湯瑪斯・布考斯基 / Thomas N. Bulkowski | 型態統計 | 3 |
| KAMA 考夫曼自適應均線 | 佩里・考夫曼 / Perry J. Kaufman | 創始者 | 3 |
| MACD | 傑拉德・阿佩爾 / Gerald Appel | 創始者 | 4 |
| MACD | 亞歷克斯・斯皮羅格魯 / Alex Spiroglou | MACD-V | 2 |
| MFI 資金流量指標 | 金・匡 / Gene Quong | 共同創始者 | 4 |
| MFI 資金流量指標 | 阿夫魯姆・蘇達克 / Avrum Soudack | 共同創始者 | 4 |
| Market Profile | 彼得・史戴梅爾 / J. Peter Steidlmayer | 創始者 | 3 |
| Market Profile | 詹姆斯・道爾頓 / James F. Dalton | 推廣者/作者 | 3 |
| McClellan Oscillator | 謝爾曼・麥克萊倫 / Sherman McClellan | 共同創始者 | 3 |
| McClellan Oscillator | 瑪麗安・麥克萊倫 / Marian McClellan | 共同創始者 | 3 |
| McGinley Dynamic | 約翰・麥金利 / John R. McGinley | 創始者 | 4 |
| OBV 能量潮 | 約瑟夫・格蘭維爾 / Joseph Granville | 創始者 | 4 |
| Parabolic SAR | 威爾斯・威爾德 / J. Welles Wilder Jr. | 創始者 | 3 |
| RSI 相對強弱指數 | 威爾斯・威爾德 / J. Welles Wilder Jr. | 創始者 | 3 |
| RSI 相對強弱指數 | 拉倫斯・康納斯 / Laurence A. Connors | 短線改良 | 5 |
| RSI 相對強弱指數 | 安德魯・卡德威爾 / Andrew Cardwell | 進階詮釋者 | 3 |
| RSI 相對強弱指數 | 康斯坦絲・布朗 / Constance Brown | 進階詮釋者 | 3 |
| RSI 相對強弱指數 | 傑瑞米・杜普萊西斯 / Jeremy du Plessis | P&F 結合指標 | 3 |
| SuperTrend | 奧利維耶・塞班 / Olivier Seban | 創始者 | 3 |
| TRIN / Arms Index | 理查・阿姆斯 / Richard W. Arms Jr. | 創始者 | 3 |
| TRIX | 傑克・哈特森 / Jack K. Hutson | 創始者 | 2 |
| Ulcer Index | 彼得・馬丁 / Peter G. Martin | 共同創始者 | 2 |
| Ulcer Index | 拜倫・麥肯 / Byron McCann | 共同創始者 | 2 |
| VCP 波動收縮形態 | 馬克・米勒維尼 / Mark Minervini | 創始/推廣者 | 3 |
| VIDYA 動態平均 | 圖沙・昌德 / Tushar S. Chande | 創始者 | 4 |
| VIDYA 動態平均 | 史丹利・克羅爾 / Stanley Kroll | 共同作者 | 3 |
| VSA 量價差分析 | 湯姆・威廉斯 / Tom Williams | 創始/推廣者 | 3 |
| VWAP / Anchored VWAP | 布萊恩・香農 / Brian Shannon | Anchored VWAP 推廣者 | 3 |
| Vortex 指標 | 艾蒂安・博特斯 / Etienne Botes | 共同創始者 | 3 |
| Vortex 指標 | 道格拉斯・西普曼 / Douglas Siepman | 共同創始者 | 3 |
| Williams %R | 拉瑞・威廉斯 / Larry Williams | 創始者 | 4 |
| 一目均衡表 | 細田悟一 / Goichi Hosoda | 創始者 | 3 |
| 交易系統 | 傑克・施瓦格 / Jack D. Schwager | 交易方法整理 | 4 |
| 交易系統 | 佩里・考夫曼 / Perry J. Kaufman | 系統交易作者 | 3 |
| 交易系統 | 史丹利・克羅爾 / Stanley Kroll | 交易系統 | 3 |
| 交易系統 | 亞歷山大・艾爾德 / Alexander Elder | Triple Screen | 2 |
| 交易系統 | 格倫・尼利 / Glenn Neely | 波浪規則 | 4 |
| 交易系統 | 琳達・布拉德福德・拉什克 / Linda Bradford Raschke | 高勝率策略 | 3 |
| 交易系統 | 拉倫斯・康納斯 / Laurence A. Connors | 短線均值回歸 | 5 |
| 交易系統 | 約翰・艾勒斯 / John F. Ehlers | 自適應指標 | 3 |
| 交易系統 | 穆雷・魯傑羅 / Murray A. Ruggiero Jr. | 交易系統 | 2 |
| 交易系統 | 羅伯特・帕多 / Robert Pardo | 交易系統 | 2 |
| 交易系統 | 霍華德・班迪 / Howard Bandy | 交易系統 | 3 |
| 交易系統 | 湯瑪斯・史翠茲曼 / Thomas Stridsman | 交易系統 | 2 |
| 交易系統 | 漢克・普魯登 / Hank Pruden | 三大交易技能 | 3 |
| 交易系統 | 拉爾夫・文斯 / Ralph Vince | 資金管理 | 3 |
| 交易系統 | 大衛・阿隆森 / David Aronson | 客觀規則 | 3 |
| 價格行為 | 傑西・李佛摩 / Jesse Livermore | 價格行為 | 2 |
| 價格行為 | 傑克・施瓦格 / Jack D. Schwager | 交易者訪談 | 4 |
| 價格行為 | 本間宗久 / Munehisa Homma | 市場心理 | 4 |
| 價格行為 | 布萊恩・香農 / Brian Shannon | 多週期分析 | 3 |
| 價格行為 | 琳達・布拉德福德・拉什克 / Linda Bradford Raschke | 短線交易 | 3 |
| 價格行為 | 大衛・韋斯 / David Weis | 價格量能 | 3 |
| 價格行為 | 詹姆斯・道爾頓 / James F. Dalton | 拍賣市場邏輯 | 3 |
| 價格行為 | 托比・克拉貝爾 / Toby Crabel | Narrow Range 型態 | 2 |
| 價格行為 | 維克多・斯佩蘭迪奧 / Victor Sperandeo | 2B 型態 | 2 |
| 價格行為 | 艾倫・安德魯斯 / Alan Andrews | 擺動點 | 3 |
| 價格行為 | 漢弗萊・尼爾 / Humphrey B. Neill | 市場心理 | 3 |
| 動量 | 馬丁・普林格 / Martin J. Pring | 指標與教材作者 | 3 |
| 動量 | 史蒂文・阿契利斯 / Steven B. Achelis | 百科作者 | 2 |
| 動量 | 羅伯特・科爾比 / Robert W. Colby | 百科作者 | 4 |
| 動量 | 喬治・藍恩 / George C. Lane | 動量先行觀念 | 3 |
| 動量 | 拉瑞・威廉斯 / Larry Williams | 短線動量 | 4 |
| 動量 | 艾德溫・科波克 / Edwin S. Coppock | 長期動量 | 4 |
| 動量 | 安德魯・卡德威爾 / Andrew Cardwell | 正/負反轉與區間規則 | 3 |
| 動量 | 康斯坦絲・布朗 / Constance Brown | Composite Index | 3 |
| 動量 | 傑克・哈特森 / Jack K. Hutson | 三重平滑動量 | 2 |
| 動量 | 羅伯特・邁納 / Robert C. Miner | 多週期動量 | 4 |
| 動量 | 亞歷克斯・斯皮羅格魯 / Alex Spiroglou | 動量研究 | 2 |
| 動量 | 蓋瑞・安東納奇 / Gary Antonacci | 雙動量 | 3 |
| 唐奇安通道 | 理查・唐奇安 / Richard Donchian | 創始者 | 3 |
| 四階段分析 | 史坦・溫斯坦 / Stan Weinstein | 創始/推廣者 | 3 |
| 回測與系統驗證 | 茱莉・達爾奎斯特 / Julie R. Dahlquist | 缺口策略研究 | 3 |
| 回測與系統驗證 | 湯瑪斯・布考斯基 / Thomas N. Bulkowski | 歷史樣本統計 | 3 |
| 回測與系統驗證 | 穆雷・魯傑羅 / Murray A. Ruggiero Jr. | 策略測試 | 2 |
| 回測與系統驗證 | 羅伯特・帕多 / Robert Pardo | 系統測試 | 2 |
| 回測與系統驗證 | 霍華德・班迪 / Howard Bandy | 策略驗證 | 3 |
| 回測與系統驗證 | 湯瑪斯・史翠茲曼 / Thomas Stridsman | 策略測試 | 2 |
| 回測與系統驗證 | 亞瑟・梅里爾 / Arthur A. Merrill | 型態統計 | 5 |
| 回測與系統驗證 | 安德魯・羅 / Andrew W. Lo | 統計推論 | 4 |
| 回測與系統驗證 | 大衛・阿隆森 / David Aronson | 資料探勘校正 | 3 |
| 圖表型態 | 理查・沙巴克 / Richard W. Schabacker | 早期系統化作者 | 3 |
| 圖表型態 | 羅伯特・愛德華茲 / Robert D. Edwards | 經典教材作者 | 3 |
| 圖表型態 | 約翰・麥基 / John Magee | 經典教材作者 | 3 |
| 圖表型態 | 約翰・墨菲 / John J. Murphy | 教材作者 | 3 |
| 圖表型態 | 傑克・施瓦格 / Jack D. Schwager | 教材作者 | 4 |
| 圖表型態 | 茱莉・達爾奎斯特 / Julie R. Dahlquist | 教材作者 | 3 |
| 圖表型態 | 史蒂夫・尼森 / Steve Nison | K 線型態 | 4 |
| 圖表型態 | 湯瑪斯・布考斯基 / Thomas N. Bulkowski | 統計研究者 | 3 |
| 圖表型態 | 拉爾夫・阿坎波拉 / Ralph Acampora | 教育者 | 2 |
| 圖表型態 | 尼古拉斯・達瓦斯 / Nicolas Darvas | 箱型理論 | 2 |
| 圖表型態 | 亞瑟・梅里爾 / Arthur A. Merrill | M/W 型態 | 5 |
| 圖表型態 | 安德魯・羅 / Andrew W. Lo | 計算型型態識別 | 4 |
| 威科夫方法 | 理查・威科夫 / Richard D. Wyckoff | 創始者 | 3 |
| 威科夫方法 | 漢克・普魯登 / Hank Pruden | 教育者 | 3 |
| 威科夫方法 | 大衛・韋斯 / David Weis | 現代改編者 | 3 |
| 威科夫方法 | 湯姆・威廉斯 / Tom Williams | 威科夫衍生 | 3 |
| 安德魯分叉線 | 艾倫・安德魯斯 / Alan Andrews | 創始者 | 3 |
| 實證技術分析 | 茱莉・達爾奎斯特 / Julie R. Dahlquist | 研究者 | 3 |
| 實證技術分析 | 羅伯特・科爾比 / Robert W. Colby | 指標彙整 | 4 |
