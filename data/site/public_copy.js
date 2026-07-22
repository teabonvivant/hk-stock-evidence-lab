window.__PUBLIC_COPY__ = {
  "metadata": {
    "version": "1.0.0",
    "schemaVersion": 1,
    "contentVersion": "2026-07-13",
    "locale": "zh-Hant-HK",
    "generatedWrapper": "data/site/public_copy.js"
  },
  "global": {
    "siteName": "技術指標研究室",
    "tagline": "先看圖表證據，再選合適指標",
    "riskDisclaimer": "本站內容只作教育及研究用途，不構成投資建議；任何交易決定及風險均由使用者自行承擔。",
    "dataDisclaimer": "圖表示範使用本站保存的歷史開市、最高、最低、收市及成交量資料，不提供即時行情。",
    "navigation": {
      "home": "總覽",
      "learn": "學習",
      "indicators": "指標庫",
      "playground": "練習場",
      "toolbox": "工具箱",
      "pineScript": "Pine Script"
    }
  },
  "pages": {
    "home": {
      "title": "技術指標研究室",
      "copy": {}
    },
    "learn": {
      "title": "學習路線",
      "copy": {}
    },
    "indicators": {
      "title": "全部技術指標",
      "copy": {}
    },
    "indicatorDetail": {
      "title": "技術指標詳情",
      "copy": {}
    },
    "toolbox": {
      "title": "工具箱",
      "copy": {}
    },
    "candlesticks": {
      "title": "陰陽燭教學專區",
      "copy": {}
    },
    "compare": {
      "title": "指標比較",
      "copy": {}
    },
    "playground": {
      "title": "練習場",
      "copy": {}
    },
    "casebook": {
      "title": "歷史型市況案例庫",
      "copy": {}
    },
    "glossary": {
      "title": "技術分析詞彙",
      "copy": {}
    },
    "journal": {
      "title": "交易日誌",
      "copy": {}
    },
    "combo": {
      "title": "指標組合",
      "copy": {}
    },
    "localData": {
      "title": "本地學習資料",
      "copy": {}
    },
    "notFound": {
      "title": "找不到頁面",
      "copy": {}
    },
    "strategyLibrary": {
      "title": "TradingView 策略研究",
      "copy": {}
    },
    "strategyDetail": {
      "title": "策略研究詳情",
      "copy": {}
    },
    "tradingView": {
      "title": "TradingView 教學",
      "copy": {}
    },
    "pineScript": {
      "title": "Pine Script",
      "copy": {}
    },
    "demo": {
      "title": "腳本示範",
      "copy": {}
    },
    "trial": {
      "title": "試用準備",
      "copy": {}
    }
  },
  "indicators": [
    {
      "slug": "accumulation-distribution",
      "siteSlug": "accumulation-distribution",
      "nameZh": "累積派發線",
      "summary": "A/D 線根據收市價在當日高低區間的位置，判斷成交量較偏向累積還是派發。",
      "signals": [
        "A/D 線上升但價格橫行，代表可能有隱性吸納。",
        "價格創高但 A/D 未確認，代表量價背離。"
      ],
      "mistakes": [
        "忽略缺口會令日內高低區間解讀失真。"
      ],
      "limitations": [
        "與 OBV 一樣會受成交量異常影響。"
      ],
      "judgmentZh": "研究累積派發線時，可先讀理查・威科夫的量價與供求框架；約瑟夫・格蘭維爾及巴夫・多米爾則分別補足累積成交量和較現代的量價研究。"
    },
    {
      "slug": "advance-decline-line",
      "siteSlug": "advance-decline-line",
      "nameZh": "漲跌家數線",
      "summary": "A/D Line 衡量市場參與廣度，常用來確認指數升跌是否由多數股票支持。",
      "signals": [
        "指數創高而 A/D Line 未創高，代表升勢廣度不足。",
        "A/D Line 率先回升，可能提示市場內部改善。"
      ],
      "mistakes": [
        "用個股資料解讀市場寬度指標。"
      ],
      "limitations": [
        "需要完整市場成份資料。"
      ],
      "judgmentZh": "漲跌家數線屬市場廣度工具，內德・戴維斯的市場指標研究最切題；拉瑞・威廉斯及拉爾夫・文斯可補充獎項研究和新低數方法。"
    },
    {
      "slug": "adx",
      "siteSlug": "adx",
      "nameZh": "平均趨向指數",
      "summary": "ADX 衡量趨勢強度，不直接表示方向，常用來判斷市場是否值得採用趨勢策略。",
      "signals": [
        "ADX 高於 25，通常代表趨勢強度較明顯。",
        "+DI 高於 -DI 且 ADX 上升，代表多方趨勢較強。",
        "ADX 下降代表趨勢動能減弱或進入盤整。"
      ],
      "mistakes": [
        "把 ADX 上升解讀成一定會上升，忽略它不代表方向。",
        "用固定門檻套所有股票與週期。"
      ],
      "limitations": [
        "ADX 反應慢，適合做市況濾網而非精準進出點。"
      ],
      "judgmentZh": "ADX 與 DMI 都應由威爾斯・威爾德的原始方法讀起。本站暫未收錄同樣直接的第二位核心作者，因此公式及平滑口徑宜以原著為準。"
    },
    {
      "slug": "aroon",
      "siteSlug": "aroon",
      "nameZh": "阿隆指標",
      "summary": "Aroon 根據近期高位和低位相隔的時間判斷趨勢是否活躍，重點在新高與新低出現的節奏。",
      "signals": [
        "Aroon Up 接近 100 且 Down 低，代表上升趨勢活躍。",
        "兩線交叉可提示趨勢主導權改變。"
      ],
      "mistakes": [
        "忽略價格幅度，只看高低點出現時間。"
      ],
      "limitations": [
        "對創高創低敏感，但不衡量突破力度。"
      ],
      "judgmentZh": "圖沙・昌德是本站 Aroon 研究的直接來源。現有資料未有同等貼近的補充作者，閱讀時應先核對其原始定義，再比較平台實作。"
    },
    {
      "slug": "atr",
      "siteSlug": "atr",
      "nameZh": "平均真實波幅",
      "summary": "ATR 衡量價格波動幅度，不判斷方向，常用於止蝕距離、倉位控制與波動濾網。",
      "signals": [
        "ATR 上升代表波動擴大，風險和機會同時提高。",
        "ATR 下降代表波動收縮，可能進入盤整或等待突破。",
        "以 ATR 設止蝕，可讓風險距離貼近個股波動特性。"
      ],
      "mistakes": [
        "把 ATR 上升解讀成看漲或看跌，它只代表波動。",
        "不按 ATR 調整倉位，導致高波動股票風險過大。"
      ],
      "limitations": [
        "事件跳空可能令 ATR 滯後調整。"
      ],
      "judgmentZh": "ATR 的公式、真實波幅定義及平滑方法以威爾斯・威爾德為主要依據；奧利維耶・塞班的資料較適合延伸至 ATR 通道和趨勢應用。"
    },
    {
      "slug": "awesome-oscillator",
      "siteSlug": "awesome-oscillator",
      "nameZh": "動量震盪器",
      "summary": "AO 比較短長週期中位價平均，用柱狀圖觀察市場動能方向。",
      "signals": [
        "AO 由負轉正，代表短期動能相對長期改善。",
        "連續柱狀體縮短，可提示動能減弱。"
      ],
      "mistakes": [
        "只看顏色轉變而忽略零軸位置。"
      ],
      "limitations": [
        "橫行市柱狀體會頻繁翻轉。"
      ],
      "judgmentZh": "本站現有比較只涵蓋短線動量及指標教材，拉瑞・威廉斯、羅伯特・科爾比和馬丁・普林格可作背景閱讀，但不足以代替 Awesome Oscillator 的指標專屬源流考證。"
    },
    {
      "slug": "beta",
      "siteSlug": "beta",
      "nameZh": "貝塔係數",
      "summary": "Beta 衡量個股相對市場的波動敏感度，常用於理解組合風險。",
      "signals": [
        "Beta 高於 1，代表波動通常大於市場。",
        "Beta 低於 1，代表相對市場波動較低。"
      ],
      "mistakes": [
        "把歷史 Beta 當成未來固定特性。"
      ],
      "limitations": [
        "不同計算期間會得到不同結果。"
      ],
      "judgmentZh": "現有專家配對集中於下行風險研究，不能直接證明 Beta 的統計學源流。彼得・馬丁及拜倫・麥肯適合用來比較風險觀念，Beta 本身仍需另補專屬來源。"
    },
    {
      "slug": "bollinger-bands",
      "siteSlug": "bollinger-bands",
      "nameZh": "布林帶",
      "summary": "布林帶以平均線和標準差描述價格波動區間，可用來觀察壓縮、擴張、突破與回歸。",
      "signals": [
        "帶寬收窄代表波動壓縮，可能準備進入新方向。",
        "價格沿上軌推進，常代表強勢趨勢而非單純超買。",
        "價格跌破下軌後收回，可觀察短線回歸機會。"
      ],
      "mistakes": [
        "看到碰上軌就做空，忽略趨勢市可沿軌運行。",
        "把帶寬收窄當成方向預測，而不是波動提示。"
      ],
      "limitations": [
        "標準差根據過去波動計算，不能預知事件風險。"
      ],
      "judgmentZh": "布林帶應先讀約翰・布林格對平均線、標準差及帶寬的原始說明；傑瑞米・杜普萊西斯的角色是補充點數圖與指標結合的應用。"
    },
    {
      "slug": "bollinger-bandwidth",
      "siteSlug": "bollinger-bandwidth",
      "nameZh": "布林帶寬度",
      "summary": "布林帶寬度量化布林帶收窄與擴張，特別適合觀察波動壓縮。",
      "signals": [
        "BBW 處於低位代表波動壓縮。",
        "BBW 由低位快速上升代表波動擴張。",
        "需配合價格突破方向判斷後續情境。"
      ],
      "mistakes": [
        "把帶寬收窄直接解讀成必然上升。"
      ],
      "limitations": [
        "只提示波動狀態，不提示方向。"
      ],
      "judgmentZh": "布林帶寬度直接承接約翰・布林格的波幅框架，原作者資料最適合核對定義；傑瑞米・杜普萊西斯可作跨圖表方法的補充閱讀。"
    },
    {
      "slug": "bullish-percent-index",
      "siteSlug": "bullish-percent-index",
      "nameZh": "看漲百分比指數",
      "summary": "BPI 衡量市場內有多少股票處於看漲狀態，是市場寬度與情緒的綜合觀察。",
      "signals": [
        "BPI 高位回落，代表市場廣度轉弱。",
        "BPI 低位回升，代表內部改善。"
      ],
      "mistakes": [
        "用單一門檻判斷所有市場。"
      ],
      "limitations": [
        "依賴點數圖訊號定義。"
      ],
      "judgmentZh": "看漲百分比指數屬市場內部強弱研究。內德・戴維斯的市場指標資料可作主要背景，拉瑞・威廉斯及拉爾夫・文斯則提供廣度與新低數的旁證。"
    },
    {
      "slug": "cci",
      "siteSlug": "cci",
      "nameZh": "商品通道指數",
      "summary": "CCI 衡量價格偏離平均的程度，可用於辨識強勢突破、超買超賣與週期性轉折。",
      "signals": [
        "CCI 突破 +100，代表價格動能明顯轉強。",
        "CCI 跌破 -100，代表弱勢或恐慌加深。",
        "回到零軸附近時，代表動能可能回歸均衡。"
      ],
      "mistakes": [
        "只把 +100/-100 視為反轉點，忽略突破也可能延續。"
      ],
      "limitations": [
        "不同股票波動特性不同，固定閾值不一定適用。"
      ],
      "judgmentZh": "CCI 的常數、典型價格及平均偏差定義，應以唐納德・蘭伯特的原始資料為準。本站暫未有同等直接的補充作者。"
    },
    {
      "slug": "chaikin-money-flow",
      "siteSlug": "chaikin-money-flow",
      "nameZh": "蔡金資金流量",
      "summary": "CMF 觀察收盤價在日內高低區間的位置並結合成交量，評估累積或派發壓力。",
      "signals": [
        "CMF 高於零，代表資金流入傾向較明顯。",
        "CMF 轉負而價格仍高位，需留意承接不足。"
      ],
      "mistakes": [
        "忽略跳空和高低價異常對指標的影響。"
      ],
      "limitations": [
        "需要可靠的高低價與成交量資料。"
      ],
      "judgmentZh": "蔡金資金流量與馬克・柴金的指標設計直接相關，公式及解讀應先核對其原始說明；一般量價理論只宜作背景，不能取代指標定義。"
    },
    {
      "slug": "chaikin-oscillator",
      "siteSlug": "chaikin-oscillator",
      "nameZh": "蔡金震盪器",
      "summary": "Chaikin Oscillator 用 A/D 線的快慢 EMA 差值觀察資金流動能變化。",
      "signals": [
        "震盪器上穿零軸代表資金流動能改善。",
        "價格創高但震盪器走弱，可能出現量價背離。",
        "配合 CMF 可同時觀察資金流方向與動能。"
      ],
      "mistakes": [
        "忽略 A/D 線本身受高低收位置影響。"
      ],
      "limitations": [
        "需要可靠的高低價和成交量資料。"
      ],
      "judgmentZh": "現有比較可用威科夫、格蘭維爾及多米爾理解量價背景，卻未直接覆蓋 Chaikin Oscillator 的創始資料；此條目的來源仍需補強。"
    },
    {
      "slug": "chande-momentum-oscillator",
      "siteSlug": "chande-momentum-oscillator",
      "nameZh": "錢德動量震盪器",
      "summary": "CMO 與 RSI 類似，但直接比較上升與下跌動量總和，讀數介於 -100 至 +100。",
      "signals": [
        "CMO 高於 +50 代表上升動量明顯。",
        "CMO 低於 -50 代表下跌動量明顯。",
        "背離可用作動能衰退預警。"
      ],
      "mistakes": [
        "把固定高低門檻套用在所有股票和市況。"
      ],
      "limitations": [
        "強趨勢中可長時間維持極端值。"
      ],
      "judgmentZh": "錢德動量震盪器應先讀圖沙・昌德的原始設計，尤其要核對升跌動量加總及正負 100 的縮放方法；本站暫未有同等直接的第二來源。"
    },
    {
      "slug": "chandelier-exit",
      "siteSlug": "chandelier-exit",
      "nameZh": "吊燈止蝕",
      "summary": "Chandelier Exit 用近期高點與 ATR 建立追蹤止蝕，適合趨勢交易中的風險管理。",
      "signals": [
        "止蝕線隨新高上移，幫助鎖定趨勢利潤。",
        "價格跌破止蝕線，代表趨勢保護被觸發。"
      ],
      "mistakes": [
        "把止蝕線當作預測線，而非風險規則。"
      ],
      "limitations": [
        "倍數設定會影響出場速度。"
      ],
      "judgmentZh": "威爾斯・威爾德可解釋 ATR 基礎，奧利維耶・塞班可補充 ATR 通道應用；兩者都未足以單獨證明吊燈止蝕的完整源流，原始出市規則仍須另行核對。"
    },
    {
      "slug": "coppock-curve",
      "siteSlug": "coppock-curve",
      "nameZh": "科波克曲線",
      "summary": "Coppock Curve 常用於長週期市場底部觀察，結合多個 ROC 週期平滑後判斷動能回升。",
      "signals": [
        "曲線在低位轉上，可能提示長週期動能改善。",
        "適合月線或週線，不適合日內交易。"
      ],
      "mistakes": [
        "把長線指標用於短線進出。"
      ],
      "limitations": [
        "訊號少且慢。"
      ],
      "judgmentZh": "科波克曲線的長週期動量設計應以艾德溫・科波克的資料為起點。現有資料未有同樣直接的補充作者，不宜把一般 ROC 教材當成原始定義。"
    },
    {
      "slug": "correlation",
      "siteSlug": "correlation",
      "nameZh": "相關係數",
      "summary": "相關係數衡量兩個資產走勢同步程度，適合用於分散風險與組合檢查。",
      "signals": [
        "接近 +1 代表同向性高，分散效果較低。",
        "接近 0 代表關係較弱。"
      ],
      "mistakes": [
        "以為低相關會永久維持，危機時相關性可能上升。"
      ],
      "limitations": [
        "相關不代表因果。"
      ],
      "judgmentZh": "本站現有配對來自下行風險研究，只能協助解釋資產共同下跌時的組合問題；相關係數的統計定義及估算方法仍需另以統計學來源核對。"
    },
    {
      "slug": "demarker",
      "siteSlug": "demarker",
      "nameZh": "DeMarker 指標",
      "summary": "DeMarker 比較相鄰時段的高低價變化，量度買賣壓力，常用來觀察潛在超買或超賣區。",
      "signals": [
        "高於 0.7 代表偏熱，低於 0.3 代表偏冷。",
        "背離可提示趨勢動能變化。"
      ],
      "mistakes": [
        "忽略趨勢市可長時間維持極端值。"
      ],
      "limitations": [
        "不如 RSI 普及，需先理解平台算法。"
      ],
      "judgmentZh": "DeMarker 指標與湯姆・迪馬克的研究直接相關，參數及高低價比較規則應先看原作者資料；其他超買超賣指標只能作功能比較。"
    },
    {
      "slug": "dmi",
      "siteSlug": "dmi",
      "nameZh": "趨向指標",
      "summary": "DMI 用 +DI、-DI 與 ADX 觀察多空方向與趨勢強度，是趨勢濾網常用工具。",
      "signals": [
        "+DI 高於 -DI，代表多方方向性較強。",
        "搭配 ADX 上升時，訊號可靠性較高。"
      ],
      "mistakes": [
        "只看 DI 交叉，不看 ADX 是否顯示有趨勢。"
      ],
      "limitations": [
        "短線圖上容易有雜訊。"
      ],
      "judgmentZh": "DMI 的 +DI、-DI、TR 及平滑次序均源自威爾斯・威爾德的方法。沒有原著口徑作基準，平台之間的數值差異很難正確解釋。"
    },
    {
      "slug": "donchian-channel",
      "siteSlug": "donchian-channel",
      "nameZh": "唐奇安通道",
      "summary": "Donchian Channel 用近期最高與最低價定義通道，常見於突破與趨勢跟隨策略。",
      "signals": [
        "價格突破上軌，代表創 N 期新高。",
        "通道寬度擴大代表波動或趨勢空間增加。"
      ],
      "mistakes": [
        "在震盪市追逐每次通道突破。"
      ],
      "limitations": [
        "不衡量突破後動能，需要成交量或趨勢濾網。"
      ],
      "judgmentZh": "唐奇安通道應以理查・唐奇安的趨勢跟隨研究為主線，先理解 N 期高低位突破，再討論其他通道變體。"
    },
    {
      "slug": "dpo",
      "siteSlug": "dpo",
      "nameZh": "去趨勢價格震盪器",
      "summary": "DPO 移除較長期趨勢影響，重點觀察價格相對週期平均的短中期波動。",
      "signals": [
        "DPO 高於零代表價格高於去趨勢後平均水平。",
        "DPO 由低位回升可提示週期性反彈。",
        "震盪市中比強趨勢市更容易解讀。"
      ],
      "mistakes": [
        "在明顯單邊趨勢中用 DPO 逆勢找頂底。"
      ],
      "limitations": [
        "不適合判斷長期趨勢方向。"
      ],
      "judgmentZh": "去趨勢價格震盪器在本站被放進週期分析家族。約翰・艾勒斯、江恩及艾略特的資料可解釋週期觀念，但不能直接代替 DPO 的指標專屬來源。"
    },
    {
      "slug": "ease-of-movement",
      "siteSlug": "ease-of-movement",
      "nameZh": "簡易波動指標",
      "summary": "EOM 同時考慮價格變動與成交量，可看出價格推進是否需要較大的成交支持。",
      "signals": [
        "EOM 上升代表價格上行相對順暢。",
        "EOM 接近零代表價格推進效率低。"
      ],
      "mistakes": [
        "在低流動性股票中過度相信數值。"
      ],
      "limitations": [
        "對成交量與波幅異常敏感。"
      ],
      "judgmentZh": "威科夫、格蘭維爾及多米爾可提供量價與供求背景，但現有比較沒有直接處理 Ease of Movement 的原始公式；此處只可視為概念參考。"
    },
    {
      "slug": "elder-ray",
      "siteSlug": "elder-ray",
      "nameZh": "艾達透視指標",
      "summary": "Elder Ray 比較高低價與 EMA 的距離，觀察買方和賣方力量是否轉變。",
      "signals": [
        "Bull Power 上升代表多方推高能力增強。",
        "Bear Power 由負轉升，代表賣方壓力減弱。"
      ],
      "mistakes": [
        "沒有先判斷主趨勢就解讀牛熊力量。"
      ],
      "limitations": [
        "適合搭配 EMA 趨勢背景。"
      ],
      "judgmentZh": "艾達透視指標應先讀亞歷山大・艾爾德的原始說明，重點是 Bull Power、Bear Power 與 EMA 的關係；一般動能教材不應取代這個定義。"
    },
    {
      "slug": "ema",
      "siteSlug": "ema",
      "nameZh": "指數移動平均線",
      "summary": "EMA 對近期價格反應較快，適合觀察趨勢轉折與短中線節奏，是 MACD 等指標的基礎。",
      "signals": [
        "短期 EMA 持續高於長期 EMA，代表短線動能仍佔優。",
        "價格回踩 EMA 後重新轉強，可作為趨勢延續觀察點。",
        "多條 EMA 呈現順序排列時，趨勢結構較清晰。"
      ],
      "mistakes": [
        "以為 EMA 越短越準，忽略短週期會帶來更多雜訊。",
        "在缺乏趨勢的區間內過度交易穿越訊號。"
      ],
      "limitations": [
        "EMA 比 SMA 快，但仍然是落後價格的平滑工具。",
        "週期設定差異會明顯改變訊號數量。"
      ],
      "judgmentZh": "傑拉德・阿佩爾的資料有助理解 EMA 在動量均線及 MACD 中的應用，約翰・墨菲和羅伯特・科爾比則適合查閱通用解說；這個排序不等於 EMA 源流結論。"
    },
    {
      "slug": "fibonacci-retracement",
      "siteSlug": "fibonacci-retracement",
      "nameZh": "斐波那契回調",
      "summary": "斐波那契回調用關鍵比例估算趨勢回調區域，常與前高低點、成交量一起使用。",
      "signals": [
        "回調到 38.2% 或 61.8% 附近企穩，可觀察趨勢延續。",
        "多個支撐阻力重疊的比例區更值得留意。"
      ],
      "mistakes": [
        "任意選高低點畫線，容易得到想看的結果。"
      ],
      "limitations": [
        "比例本身不是保證，需要價格行為確認。"
      ],
      "judgmentZh": "喬・迪納波利的資料最適合研究比例位如何落到實際交易框架；卡洛琳・波羅登及羅伯特・邁納可補充時間與價格的匯聚分析。"
    },
    {
      "slug": "fisher-transform",
      "siteSlug": "fisher-transform",
      "nameZh": "費雪轉換",
      "summary": "Fisher Transform 嘗試把價格分布轉成更接近常態的形狀，使極端轉折更容易辨識。",
      "signals": [
        "Fisher 線上穿觸發線可提示短線轉強。",
        "極端讀數後反向交叉，常被用於觀察轉折。",
        "震盪市中的訊號通常較清楚。"
      ],
      "mistakes": [
        "把數學轉換後的極端值視為必然反轉。"
      ],
      "limitations": [
        "對參數和價格標準化方式敏感。"
      ],
      "judgmentZh": "費雪轉換的交易指標版本應先核對約翰・艾勒斯的濾波及轉換方法，尤其要分清統計轉換、價格正規化和訊號線三個步驟。"
    },
    {
      "slug": "force-index",
      "siteSlug": "force-index",
      "nameZh": "強力指數",
      "summary": "強力指數把價格變化與成交量相乘，用來觀察推動價格的力道。",
      "signals": [
        "FI 由負轉正，代表短線買盤力道改善。",
        "價格創高但 FI 下降，代表上攻力道減弱。"
      ],
      "mistakes": [
        "忽略高成交量日會讓數值大幅跳動。"
      ],
      "limitations": [
        "需平滑處理才能降低雜訊。"
      ],
      "judgmentZh": "強力指數與亞歷山大・艾爾德的量價研究直接相關。原作者資料最適合核對價格變化乘以成交量的設計及平滑方式。"
    },
    {
      "slug": "heikin-ashi",
      "siteSlug": "heikin-ashi",
      "nameZh": "平均 K 線",
      "summary": "Heikin Ashi 平滑 K 線雜訊，讓趨勢連續性更清楚，但價格不是原始成交價。",
      "signals": [
        "連續實體同色代表趨勢較順。",
        "上下影線變長，代表趨勢猶豫增加。"
      ],
      "mistakes": [
        "用 HA 價格當真實買賣成交價。"
      ],
      "limitations": [
        "不適合需要精確價格的下單決策。"
      ],
      "judgmentZh": "史蒂夫・尼森、本間宗久及湯瑪斯・布考斯基的資料可補充陰陽燭歷史與形態統計，但未直接解決平均 K 線的計算源流；公式仍需指標專屬來源。"
    },
    {
      "slug": "historical-volatility",
      "siteSlug": "historical-volatility",
      "nameZh": "歷史波動率",
      "summary": "Historical Volatility 衡量過去價格收益率的波動程度，常用於風險和期權背景分析。",
      "signals": [
        "HV 上升代表歷史價格波動變大。",
        "HV 下降代表價格變動較平穩。",
        "與 ATR 一起看，可同時理解百分比和價格距離風險。"
      ],
      "mistakes": [
        "以為歷史波動率可直接預測未來波動。"
      ],
      "limitations": [
        "重大事件前後，歷史數值可能低估未來風險。"
      ],
      "judgmentZh": "約翰・布林格、安德魯・思拉舍及亞歷克斯・斯皮羅格魯可說明波幅在交易上的應用；歷史波動率的收益率口徑和年化方法仍應另以統計來源核對。"
    },
    {
      "slug": "hma",
      "siteSlug": "hma",
      "nameZh": "赫爾移動平均線",
      "summary": "HMA 結合加權平均及週期平方根，以減少均線延遲；線條較平滑，對價格轉變的反應亦較快。",
      "signals": [
        "HMA 由下彎轉上彎，代表短線節奏可能改善。",
        "價格沿 HMA 推進時，可用來追蹤趨勢節奏。"
      ],
      "mistakes": [
        "把線條轉向當成單獨買賣訊號，忽略市場結構。"
      ],
      "limitations": [
        "計算較複雜，與常見平台設定可能略有差異。"
      ],
      "judgmentZh": "赫爾移動平均線應以艾倫・霍爾的原始設計為準，特別要核對加權平均、半週期及平方根週期的運算次序。"
    },
    {
      "slug": "ichimoku",
      "siteSlug": "ichimoku",
      "nameZh": "一目均衡表",
      "summary": "一目均衡表把趨勢、支撐壓力與動能位置放在同一張圖，適合先看大方向，再看價格站在哪裡。",
      "signals": [
        "價格在雲層上方，整體趨勢偏多。",
        "轉換線上穿基準線，代表中短期動能改善。",
        "雲層厚度可反映支撐壓力區的寬度。"
      ],
      "mistakes": [
        "線條多但沒有判斷順序，容易過度解讀。"
      ],
      "limitations": [
        "對初學者視覺負擔較高，需要分層學習。"
      ],
      "judgmentZh": "一目均衡表的五條線、時間位移及原始參數，應先讀細田悟一的完整方法。只抽取雲層或交叉訊號，會失去整套系統的時間結構。"
    },
    {
      "slug": "kama",
      "siteSlug": "kama",
      "nameZh": "考夫曼自適應均線",
      "summary": "KAMA 會根據價格效率調整反應速度，趨勢清楚時較靈敏，雜訊較多時較平滑。",
      "signals": [
        "KAMA 明顯轉向並拉開價格距離，代表趨勢效率提高。",
        "KAMA 走平時，代表價格可能缺乏方向。"
      ],
      "mistakes": [
        "期待它完全過濾震盪，實際上仍需搭配市況判斷。"
      ],
      "limitations": [
        "參數較多，初學者不宜過度調校。"
      ],
      "judgmentZh": "考夫曼自適應均線應由佩里・考夫曼的效率比率及平滑常數讀起；平台若省略種子值或預熱期，數值未必可以直接比較。"
    },
    {
      "slug": "kdj",
      "siteSlug": "kdj",
      "nameZh": "KDJ 指標",
      "summary": "KDJ 在 KD 基礎上加入 J 線，讓短線超買超賣與轉折提示更敏感。",
      "signals": [
        "J 線快速上穿低位，代表短線反彈力度增加。",
        "高位 J 線急跌，代表短線轉弱。"
      ],
      "mistakes": [
        "過度依賴 J 線，忽略它最容易出現雜訊。"
      ],
      "limitations": [
        "更適合短線輔助，需配合趨勢方向。"
      ],
      "judgmentZh": "喬治・藍恩的資料可作隨機指標基礎，但 KDJ 多出的 J 線屬後續變體。本站現有來源未充分交代這項延伸，兩者不應混作同一原始版本。"
    },
    {
      "slug": "keltner-channel",
      "siteSlug": "keltner-channel",
      "nameZh": "肯特納通道",
      "summary": "Keltner Channel 使用 ATR 建立波動通道，比布林帶對極端標準差波動較不敏感。",
      "signals": [
        "價格突破上軌且通道上行，代表趨勢動能較強。",
        "通道變窄代表波動下降。"
      ],
      "mistakes": [
        "直接把通道邊界當固定壓力支撐。"
      ],
      "limitations": [
        "ATR 倍數需要配合股票波動特性。"
      ],
      "judgmentZh": "本站現有波幅比較偏重布林帶及標準化動量，未直接覆蓋肯特納通道的原始設計。約翰・布林格等人的資料只宜用來比較通道功能。"
    },
    {
      "slug": "kst",
      "siteSlug": "kst",
      "nameZh": "確知指標",
      "summary": "KST 結合多個不同週期的 ROC，嘗試用多週期動能確認趨勢轉折。",
      "signals": [
        "KST 上穿訊號線表示多週期動能改善。",
        "KST 與價格背離可提示趨勢力度不足。",
        "零軸附近的交叉通常比極端位置更需要價格確認。"
      ],
      "mistakes": [
        "把複雜指標視為更準確，忽略它仍由價格變化衍生。"
      ],
      "limitations": [
        "參數較多，容易被過度最佳化。"
      ],
      "judgmentZh": "現有排序把短線動量研究放在前面，但 KST 應優先核對馬丁・普林格的指標專屬材料；拉瑞・威廉斯及羅伯特・科爾比只適合作動量背景。"
    },
    {
      "slug": "linear-regression-slope",
      "siteSlug": "linear-regression-slope",
      "nameZh": "線性回歸斜率",
      "summary": "線性回歸斜率用統計方式衡量趨勢方向與陡峭程度，適合比較趨勢效率。",
      "signals": [
        "斜率由負轉正代表回歸趨勢方向改善。",
        "斜率持續上升代表上升趨勢加速。",
        "斜率走平代表趨勢效率下降。"
      ],
      "mistakes": [
        "把回歸斜率當成未來路徑預測。"
      ],
      "limitations": [
        "對觀察期間和異常值敏感。"
      ],
      "judgmentZh": "唐奇安、漢密爾頓及古比的資料有助理解趨勢判讀，卻不能代替線性回歸的統計定義。斜率估算、時間單位及異常值處理仍需專屬來源。"
    },
    {
      "slug": "ma-ribbon",
      "siteSlug": "ma-ribbon",
      "nameZh": "均線帶",
      "summary": "均線帶把多條週期均線放在同一圖表，幫助觀察趨勢排列、收斂與擴散。",
      "signals": [
        "均線帶向上發散，代表多週期趨勢共振。",
        "均線帶收斂纏繞，代表方向不明或準備變盤。"
      ],
      "mistakes": [
        "均線太多反而看不出重點，應先定義核心週期。"
      ],
      "limitations": [
        "訊號仍然落後價格，不能單獨預測突破方向。"
      ],
      "judgmentZh": "均線帶屬多週期均線的應用框架。傑拉德・阿佩爾可提供動量均線背景，約翰・墨菲及羅伯特・科爾比適合補充通用判讀，但不應被寫成單一創始來源。"
    },
    {
      "slug": "macd",
      "siteSlug": "macd",
      "nameZh": "指數平滑異同移動平均線",
      "summary": "MACD 結合趨勢與動能，以快、慢 EMA 的差距觀察趨勢強弱、交叉訊號及背離。",
      "signals": [
        "MACD 線上穿 Signal 線，代表短期動能改善。",
        "柱狀體由負轉正，通常表示多方動能開始佔優。",
        "價格創新高但 MACD 未創新高，可能出現動能背離。"
      ],
      "mistakes": [
        "在低波動橫行市頻繁追逐金叉死叉。",
        "只看柱狀體顏色，不看它相對零軸的位置。"
      ],
      "limitations": [
        "MACD 源自均線，轉折初期仍會延遲。",
        "背離可以維持很久，不等於立即反轉。"
      ],
      "judgmentZh": "MACD 的快慢 EMA、訊號線及柱狀圖應先讀傑拉德・阿佩爾的原始方法；亞歷克斯・斯皮羅格魯的 MACD-V 適合用來比較波幅標準化變體。"
    },
    {
      "slug": "mass-index",
      "siteSlug": "mass-index",
      "nameZh": "質量指數",
      "summary": "Mass Index 觀察高低價區間擴張與收縮，主要用於提示可能的趨勢反轉。",
      "signals": [
        "Mass Index 高位回落可能提示波幅結構轉變。",
        "需搭配趨勢方向指標確認反轉方向。"
      ],
      "mistakes": [
        "以為它能指出上升或下跌方向。"
      ],
      "limitations": [
        "只提示波動結構，不提示方向。"
      ],
      "judgmentZh": "本站現有比較來自波幅通道家族，未直接處理 Mass Index 的創始資料。布林格、思拉舍及斯皮羅格魯只能提供波幅背景，不能代替原始公式考證。"
    },
    {
      "slug": "mcclellan-oscillator",
      "siteSlug": "mcclellan-oscillator",
      "nameZh": "麥克連震盪器",
      "summary": "McClellan Oscillator 用市場漲跌家數差的快慢 EMA 衡量市場廣度動能。",
      "signals": [
        "震盪器上穿零軸代表市場內部動能改善。",
        "指數創高但震盪器背離，代表廣度不足。",
        "極端低位回升可提示市場恐慌舒緩。"
      ],
      "mistakes": [
        "用它判斷單一股票走勢。"
      ],
      "limitations": [
        "資料來源、成份範圍和市場結構會影響解讀。"
      ],
      "judgmentZh": "麥克連震盪器由謝爾曼・麥克萊倫與瑪麗安・麥克萊倫共同建立，兩人的資料應並讀；漲跌家數差及兩組 EMA 參數都要按原始口徑核對。"
    },
    {
      "slug": "mfi",
      "siteSlug": "mfi",
      "nameZh": "資金流量指標",
      "summary": "MFI 類似加入成交量的 RSI，衡量價格與成交量共同形成的資金流向。",
      "signals": [
        "MFI 高於 80 代表資金流入偏熱，需要看趨勢背景。",
        "價格創低但 MFI 背離，可提示賣壓減弱。"
      ],
      "mistakes": [
        "把 MFI 超買超賣當成即時反轉。"
      ],
      "limitations": [
        "成交量異常日會影響讀數。"
      ],
      "judgmentZh": "資金流量指標的共同創始資料來自金・匡與阿夫魯姆・蘇達克，兩者應一併查閱；典型價格、正負資金流和成交量缺一不可。"
    },
    {
      "slug": "momentum",
      "siteSlug": "momentum",
      "nameZh": "動量指標",
      "summary": "Momentum 用價格差衡量加速或減速，是理解動能類指標的基礎。",
      "signals": [
        "動量由負轉正，代表短期價格結構改善。",
        "動量下降但價格仍創高，可能形成背離。"
      ],
      "mistakes": [
        "忽略不同股價水平下，絕對差值不容易直接比較。"
      ],
      "limitations": [
        "比率化不足，跨股票比較時不如 ROC 直觀。"
      ],
      "judgmentZh": "拉瑞・威廉斯可提供短線動量的實務角度，馬丁・普林格及羅伯特・科爾比則較適合整理週期與通用定義；三者屬互補閱讀，並非單一創始結論。"
    },
    {
      "slug": "moving-average-envelope",
      "siteSlug": "moving-average-envelope",
      "nameZh": "移動平均包絡線",
      "summary": "MA Envelope 在均線上下加入固定百分比通道，用於觀察價格偏離平均的程度。",
      "signals": [
        "價格接近上軌代表相對均線偏強或偏熱。",
        "價格接近下軌代表相對均線偏弱或偏冷。",
        "通道斜率可輔助判斷趨勢方向。"
      ],
      "mistakes": [
        "固定百分比不會自動適應不同股票的波動率。"
      ],
      "limitations": [
        "高波動股票需要較寬通道，低波動股票需要較窄通道。"
      ],
      "judgmentZh": "移動平均包絡線屬均線應用，而非單一固定算法。阿佩爾、墨菲及科爾比可提供判讀框架，百分比、均線類型及週期仍要由使用者明確列出。"
    },
    {
      "slug": "natr",
      "siteSlug": "natr",
      "nameZh": "標準化平均真實波幅",
      "summary": "NATR 把 ATR 百分比化，方便比較不同股價水平股票的波動幅度。",
      "signals": [
        "NATR 高代表相對價格的波動較大。",
        "NATR 低代表相對價格的波動較小。",
        "適合用於篩選波動過高或過低的股票。"
      ],
      "mistakes": [
        "把低 NATR 視為安全，忽略流動性和事件風險。"
      ],
      "limitations": [
        "仍然是歷史波動描述，不預測方向。"
      ],
      "judgmentZh": "NATR 先要以威爾斯・威爾德的 ATR 定義為基礎，再核對百分比化分母；奧利維耶・塞班的資料較適合補充波幅通道應用。"
    },
    {
      "slug": "new-high-new-low",
      "siteSlug": "new-high-new-low",
      "nameZh": "新高新低數",
      "summary": "新高新低數觀察市場內部有多少股票創出重要高低位，用於判斷整體健康度。",
      "signals": [
        "新高家數擴大，代表升勢參與度提高。",
        "指數高位但新低數增加，需留意內部轉弱。"
      ],
      "mistakes": [
        "忽略不同市場上市股票質量差異。"
      ],
      "limitations": [
        "資料來源與成份範圍需一致。"
      ],
      "judgmentZh": "新高新低數應放在市場廣度框架內閱讀。內德・戴維斯提供整體市場指標背景，拉瑞・威廉斯及拉爾夫・文斯則補充獎項研究與新低數方法。"
    },
    {
      "slug": "nvi",
      "siteSlug": "nvi",
      "nameZh": "負成交量指標",
      "summary": "NVI 側重低成交量日的價格變化，常被用來觀察較安靜交易日的資金傾向。",
      "signals": [
        "NVI 上升代表低量日價格仍有承接。",
        "NVI 跌破其長期均線可提示市場內部轉弱。",
        "與 PVI 比較可觀察高低量日行為差異。"
      ],
      "mistakes": [
        "把低成交量日解讀成必然是聰明資金行為。"
      ],
      "limitations": [
        "理論假設較強，需搭配價格和市場背景。"
      ],
      "judgmentZh": "NVI 可借用威科夫、格蘭維爾及多米爾的量價框架理解低成交日，但現有比較未直接證明其原始來源；累積規則及起始值仍需專屬資料。"
    },
    {
      "slug": "obv",
      "siteSlug": "obv",
      "nameZh": "能量潮",
      "summary": "OBV 把成交量按漲跌方向累加，用來觀察資金流向是否支持價格趨勢。",
      "signals": [
        "價格創高且 OBV 同步創高，代表成交量確認較完整。",
        "價格上升但 OBV 未跟上，可能代表推升力量不足。",
        "OBV 領先突破可提示資金先行變化。"
      ],
      "mistakes": [
        "忽略單日巨量會扭曲累積線。",
        "只看 OBV 方向，不看價格是否突破關鍵位置。"
      ],
      "limitations": [
        "不同市場成交量統計口徑可能影響解讀。"
      ],
      "judgmentZh": "OBV 應以約瑟夫・格蘭維爾的原始量價方法為主要來源。研究時要重視累積方向及背離，不能跨資產比較絕對數值。"
    },
    {
      "slug": "percent-b",
      "siteSlug": "percent-b",
      "nameZh": "布林百分比",
      "summary": "%B 顯示價格在布林帶上下軌之間的位置，方便量化碰軌、突破和回歸。",
      "signals": [
        "%B 高於 1 代表價格突破上軌。",
        "%B 低於 0 代表價格跌破下軌。",
        "%B 回到 0.5 附近代表價格回到中軌附近。"
      ],
      "mistakes": [
        "把 %B 超過 1 視為必然回落，忽略趨勢可沿上軌延續。"
      ],
      "limitations": [
        "依賴布林帶參數，與標準差假設相關。"
      ],
      "judgmentZh": "布林百分比直接來自約翰・布林格的帶內位置框架，原作者資料最適合核對 0、0.5 及 1 的含義；其他圖表方法只作延伸。"
    },
    {
      "slug": "pivot-points",
      "siteSlug": "pivot-points",
      "nameZh": "樞軸點",
      "summary": "Pivot Points 根據前一交易日高低收計算日內支撐阻力，常用於短線觀察。",
      "signals": [
        "價格站上 Pivot，代表日內偏強。",
        "R1/R2 可作為上方壓力參考，S1/S2 可作為下方支撐參考。"
      ],
      "mistakes": [
        "把樞軸線當成必然反轉點，忽略趨勢與成交量。"
      ],
      "limitations": [
        "更適合短線，不宜直接套用長線投資決策。"
      ],
      "judgmentZh": "愛德華茲、麥基、江恩及史戴梅爾可補充價格水平與市場結構，但現有資料未直接交代樞軸點公式的歷史來源；交易時段口徑尤其要另行核對。"
    },
    {
      "slug": "ppo",
      "siteSlug": "ppo",
      "nameZh": "百分比價格震盪器",
      "summary": "PPO 是百分比化的 MACD，方便比較不同股價水平的動能變化。",
      "signals": [
        "PPO 上穿訊號線代表短期動能改善。",
        "PPO 高於零軸代表短期 EMA 高於長期 EMA。",
        "不同股票之間可用 PPO 比較相對動能幅度。"
      ],
      "mistakes": [
        "把 PPO 與 MACD 同時當成兩個獨立證據，實際上兩者高度相關。"
      ],
      "limitations": [
        "仍然源自均線，趨勢轉折初期會有延遲。"
      ],
      "judgmentZh": "PPO 延續傑拉德・阿佩爾的 MACD 思路，差別在於把快慢 EMA 差距百分比化；亞歷克斯・斯皮羅格魯的資料可用來比較其他標準化方法。"
    },
    {
      "slug": "price-channel",
      "siteSlug": "price-channel",
      "nameZh": "價格通道",
      "summary": "價格通道用上軌與下軌呈現趨勢或震盪範圍，適合觀察突破與回落位置。",
      "signals": [
        "價格沿上升通道上移，代表趨勢仍有結構。",
        "跌破下軌，代表原有節奏被破壞。"
      ],
      "mistakes": [
        "忽略通道會隨新高低點需要重畫。"
      ],
      "limitations": [
        "畫線具有主觀性。"
      ],
      "judgmentZh": "價格通道的趨勢跟隨脈絡以理查・唐奇安最具直接參考價值；漢密爾頓及古比可補充趨勢結構，但通道週期仍須明確定義。"
    },
    {
      "slug": "psar",
      "siteSlug": "psar",
      "nameZh": "拋物線轉向指標",
      "summary": "PSAR 以點狀標記追蹤趨勢方向，常被用作趨勢跟隨與移動止蝕參考。",
      "signals": [
        "點位由價格上方轉到下方，代表趨勢狀態轉多。",
        "點位越貼近價格，代表止蝕空間越收窄。"
      ],
      "mistakes": [
        "在盤整市使用 PSAR，容易連續反向訊號。"
      ],
      "limitations": [
        "適合趨勢市，不適合低波動橫行。"
      ],
      "judgmentZh": "拋物線轉向指標應先讀威爾斯・威爾德的遞迴算法，特別是極值、加速因子及反轉重設規則；只看圖上圓點不足以重現計算。"
    },
    {
      "slug": "put-call-ratio",
      "siteSlug": "put-call-ratio",
      "nameZh": "認沽認購比率",
      "summary": "Put/Call Ratio 用期權市場的認沽與認購活動觀察市場情緒，常作反向或風險背景指標。",
      "signals": [
        "PCR 偏高代表避險或看淡需求較強。",
        "PCR 偏低代表看好或投機情緒較熱。",
        "極端讀數需與價格和波動率一起判斷。"
      ],
      "mistakes": [
        "把 PCR 高低直接等同大市必然反向。"
      ],
      "limitations": [
        "期權市場結構和對沖需求會令讀數難以單純解讀。"
      ],
      "judgmentZh": "傑森・戈普弗特、內德・戴維斯及艾德森・古爾德可提供情緒指標的現代判讀框架；這組資料適合研究應用，並不構成比率源流的單一結論。"
    },
    {
      "slug": "pvi",
      "siteSlug": "pvi",
      "nameZh": "正成交量指標",
      "summary": "PVI 側重高成交量日的價格變化，用於觀察市場活躍交易日的方向。",
      "signals": [
        "PVI 上升代表放量日價格偏強。",
        "PVI 下跌代表活躍交易日賣壓較重。",
        "與 NVI 互相比較可分辨高量與低量日的主導方向。"
      ],
      "mistakes": [
        "把放量日全部視為好訊號，忽略高位放量滯漲。"
      ],
      "limitations": [
        "容易受消息日和異常成交影響。"
      ],
      "judgmentZh": "本站現有資料以威科夫、格蘭維爾及多米爾的量價研究為背景，未直接覆蓋 PVI 的原始累積規則；高成交日定義及起始基準仍需補證。"
    },
    {
      "slug": "pvt",
      "siteSlug": "pvt",
      "nameZh": "價量趨勢指標",
      "summary": "PVT 把成交量按價格變化百分比加權累積，比 OBV 更重視漲跌幅大小。",
      "signals": [
        "PVT 上升代表量價趨勢偏向累積。",
        "價格創高但 PVT 未確認，可能代表成交量不足。",
        "PVT 率先轉強可作為資金流改善提示。"
      ],
      "mistakes": [
        "忽略低流動性股票的成交量可能失真。"
      ],
      "limitations": [
        "累積型指標容易受異常成交日影響。"
      ],
      "judgmentZh": "價量趨勢指標可放在威科夫、格蘭維爾及多米爾的量價框架中比較，但價格變化百分比的加權公式仍需要指標專屬來源支持。"
    },
    {
      "slug": "relative-strength-comparative",
      "siteSlug": "relative-strength-comparative",
      "nameZh": "相對強弱比較",
      "summary": "RSC 比較個股與大市指數或同業的表現，用來找出相對強勢或弱勢的資產。",
      "signals": [
        "RSC 上升代表個股跑贏比較基準。",
        "價格橫行但 RSC 上升，可能代表相對承接較佳。"
      ],
      "mistakes": [
        "只看相對強，忽略絕對趨勢仍可能下跌。"
      ],
      "limitations": [
        "比較基準選擇會直接影響結論。"
      ],
      "judgmentZh": "威廉・歐尼爾的資料適合研究強勢股篩選；查爾斯・柯克派翠克二世和蓋瑞・安東納奇則補充研究方法與相對動量。三者應按用途分開閱讀。"
    },
    {
      "slug": "relative-vigor-index",
      "siteSlug": "relative-vigor-index",
      "nameZh": "相對活力指數",
      "summary": "RVI 假設強勢市場傾向收在開盤價之上，弱勢市場傾向收在開盤價之下。",
      "signals": [
        "RVI 上穿訊號線代表收盤動能改善。",
        "RVI 與價格背離可提示趨勢疲弱。",
        "配合趨勢濾網使用比單獨使用更穩健。"
      ],
      "mistakes": [
        "忽略缺口開盤會影響開收價關係。"
      ],
      "limitations": [
        "對日內結構和開收盤位置較敏感。"
      ],
      "judgmentZh": "現有資料只提供一般短線動量及教材背景，未直接覆蓋 RVI 的原始設計。拉瑞・威廉斯、科爾比及普林格不應被寫成此指標的創始來源。"
    },
    {
      "slug": "renko",
      "siteSlug": "renko",
      "nameZh": "磚形圖",
      "summary": "Renko 以固定價格幅度畫圖，過濾時間因素與小波動，適合觀察趨勢結構。",
      "signals": [
        "連續同向磚塊代表趨勢延續。",
        "反向磚塊出現代表短線結構改變。"
      ],
      "mistakes": [
        "忽略磚塊大小會決定訊號靈敏度。"
      ],
      "limitations": [
        "不反映時間與成交量節奏。"
      ],
      "judgmentZh": "湯瑪斯・布考斯基的統計研究可用來檢視形態表現，茱莉・達爾奎斯特及愛德華茲提供教材與經典脈絡；磚形圖的歷史源流仍宜另作考證。"
    },
    {
      "slug": "roc",
      "siteSlug": "roc",
      "nameZh": "變動率",
      "summary": "ROC 直接比較現在與過去價格差距，用來衡量價格變化速度。",
      "signals": [
        "ROC 高於零軸代表價格高於 N 期前。",
        "ROC 持續擴大代表動能加速。"
      ],
      "mistakes": [
        "只看 ROC 數值大小，不看價格所在趨勢。"
      ],
      "limitations": [
        "對週期起點敏感，可能因單日異常價而失真。"
      ],
      "judgmentZh": "ROC 是基礎動量量度。拉瑞・威廉斯提供短線應用，馬丁・普林格較着重週期與動量理論，羅伯特・科爾比則適合查閱通用定義。"
    },
    {
      "slug": "rsi",
      "siteSlug": "rsi",
      "nameZh": "相對強弱指數",
      "summary": "RSI 衡量近期上升與下跌力度，常用來觀察超買超賣、背離與動能節奏。",
      "signals": [
        "RSI 高於 70 代表強勢或過熱，需配合趨勢判斷。",
        "RSI 低於 30 代表弱勢或超賣，不等於一定反彈。",
        "RSI 背離可提醒趨勢動能變弱。"
      ],
      "mistakes": [
        "在強趨勢中，只因 RSI 超買便逆勢做空。",
        "忽略 RSI 區間會隨牛熊市改變。"
      ],
      "limitations": [
        "RSI 可以長時間停留在高低區域。",
        "不同週期 RSI 可能給出相反訊號。"
      ],
      "judgmentZh": "RSI 的升跌幅拆分、Wilder 平滑及 0 至 100 轉換，應以威爾斯・威爾德為準；拉倫斯・康納斯和康斯坦絲・布朗可補充短線變體與進階區間解讀。"
    },
    {
      "slug": "sma",
      "siteSlug": "sma",
      "nameZh": "簡單移動平均線",
      "summary": "SMA 用固定期間的平均收盤價平滑短期雜訊，常用來判斷趨勢方向與中長線支撐壓力。",
      "signals": [
        "價格站上中長期 SMA，通常代表趨勢環境轉強。",
        "短期 SMA 上穿長期 SMA，可視為趨勢改善的確認訊號。",
        "SMA 斜率比單次穿越更重要，斜率向上代表買盤延續性較好。"
      ],
      "mistakes": [
        "在橫行市把均線穿越當成強訊號，容易反覆被假突破干擾。",
        "只看一條均線，不看成交量與大市環境。"
      ],
      "limitations": [
        "SMA 是落後指標，轉勢初期會慢半拍。",
        "遇到急升急跌時，平均值可能低估短線風險。"
      ],
      "judgmentZh": "簡單移動平均線沒有必要硬套單一創始者。阿佩爾可補充動量均線應用，墨菲及科爾比則提供通用教材；計算仍以固定期數等權平均為準。"
    },
    {
      "slug": "standard-deviation",
      "siteSlug": "standard-deviation",
      "nameZh": "標準差",
      "summary": "標準差衡量價格分散程度，是布林帶等波動指標的核心組件。",
      "signals": [
        "標準差上升代表價格離散度增加。",
        "長時間低標準差後，需留意波動擴張。"
      ],
      "mistakes": [
        "把低波動當成低風險，忽略突破可能。"
      ],
      "limitations": [
        "對極端值敏感。"
      ],
      "judgmentZh": "布林格、思拉舍及斯皮羅格魯可說明標準差在波幅工具中的用途，但樣本或母體分母等統計口徑，仍須由統計學來源確認。"
    },
    {
      "slug": "stochastic",
      "siteSlug": "stochastic",
      "nameZh": "隨機指標",
      "summary": "KD 觀察收盤價在近期高低區間中的位置，對區間震盪和短線轉折較敏感。",
      "signals": [
        "%K 上穿 %D 且位於低位，代表短線反彈機會增加。",
        "指標高位鈍化時，可能代表趨勢很強而非立即反轉。",
        "KD 背離可用來輔助判斷動能衰退。"
      ],
      "mistakes": [
        "在單邊趨勢中反覆逆勢交易高低位訊號。",
        "忽略高低位訊號需要配合價格結構確認。"
      ],
      "limitations": [
        "KD 反應快，雜訊也較多。"
      ],
      "judgmentZh": "隨機指標應先讀喬治・藍恩的原始方法，分清 Fast、Slow 及 Full 版本；高於 80 或低於 20 只表示區間位置，不等於必然反轉。"
    },
    {
      "slug": "stochastic-rsi",
      "siteSlug": "stochastic-rsi",
      "nameZh": "隨機 RSI",
      "summary": "StochRSI 把 Stochastic 套用在 RSI 上，訊號更敏感，適合觀察短線動能極端值。",
      "signals": [
        "從低位回升可提示短線動能改善。",
        "高位反覆鈍化時，代表趨勢仍可能延續。"
      ],
      "mistakes": [
        "把每次高低位交叉都當成交易訊號，容易過度交易。"
      ],
      "limitations": [
        "比 RSI 更敏感，需要更強的價格確認。"
      ],
      "judgmentZh": "隨機 RSI 應並讀圖沙・昌德及史丹利・克羅爾的共同創始資料。先計 RSI、再套隨機公式的兩層運算不可混為一次平滑。"
    },
    {
      "slug": "supertrend",
      "siteSlug": "supertrend",
      "nameZh": "超級趨勢線",
      "summary": "Supertrend 用 ATR 建立動態趨勢線，常用來追蹤趨勢方向與移動止蝕位置。",
      "signals": [
        "價格站上 Supertrend 線，趨勢狀態轉多。",
        "線位跟隨價格上移，可作為風險管理參考。"
      ],
      "mistakes": [
        "在震盪市把每次翻轉都當成新趨勢。"
      ],
      "limitations": [
        "ATR 倍數會直接影響訊號靈敏度。"
      ],
      "judgmentZh": "本站把奧利維耶・塞班列作 Supertrend 的直接來源。研究時要核對 ATR 方法及最終上下軌的遞迴規則，不能只用 HL2 加減倍數代替。"
    },
    {
      "slug": "support-resistance",
      "siteSlug": "support-resistance",
      "nameZh": "支撐與阻力",
      "summary": "支撐與阻力是價格多次反應的區域，不是一條精確直線，常用於規劃進出與風險距離。",
      "signals": [
        "突破阻力後回踩不跌破，該區可能轉為支撐。",
        "跌穿支撐後反彈受壓，該區可能轉為阻力。",
        "成交量配合突破，訊號通常更完整。"
      ],
      "mistakes": [
        "把支撐阻力畫得過細，忽略市場實際是區域反應。",
        "只看單一時間週期。"
      ],
      "limitations": [
        "重大消息或大市風險可直接穿透技術區域。"
      ],
      "judgmentZh": "支撐與阻力屬經典價格結構。愛德華茲與麥基的型態分析宜並讀，江恩及史戴梅爾則補充價位與市場結構；重點是區域反應，不是精確單線。"
    },
    {
      "slug": "trendline",
      "siteSlug": "trendline",
      "nameZh": "趨勢線",
      "summary": "趨勢線協助視覺化市場節奏，常用於判斷趨勢是否保持或被破壞。",
      "signals": [
        "上升趨勢線被有效跌破，代表趨勢風險提高。",
        "突破下降趨勢線，代表壓力結構可能改變。"
      ],
      "mistakes": [
        "為了配合觀點而任意移動趨勢線。"
      ],
      "limitations": [
        "主觀性高，需搭配成交量與水平支撐阻力。"
      ],
      "judgmentZh": "趨勢線宜先以愛德華茲與麥基的經典型態框架理解，江恩和史戴梅爾可補充角度及市場結構。錨點與失效規則必須事前固定。"
    },
    {
      "slug": "trin",
      "siteSlug": "trin",
      "nameZh": "阿姆斯指數",
      "summary": "TRIN 結合漲跌家數與成交量，常用於觀察大市內部買賣壓力。",
      "signals": [
        "TRIN 高於 1 通常代表下跌成交壓力較重。",
        "TRIN 低於 1 通常代表上升成交較佔優。",
        "極端讀數可用作市場情緒過熱或恐慌參考。"
      ],
      "mistakes": [
        "把單日 TRIN 極端值直接當成反轉訊號。"
      ],
      "limitations": [
        "需要完整市場寬度資料，不適用單一股票。"
      ],
      "judgmentZh": "TRIN 與理查・阿姆斯的市場廣度研究直接相關，公式中的漲跌家數及成交量比率應以原作者資料核對；不同市場的成份口徑不可混用。"
    },
    {
      "slug": "trix",
      "siteSlug": "trix",
      "nameZh": "三重指數平滑平均",
      "summary": "TRIX 經三重指數平滑減少雜訊，適合觀察中期動能是否轉向。",
      "signals": [
        "TRIX 上穿訊號線，代表平滑後動能改善。",
        "TRIX 遠離零軸，代表趨勢動能較明確。"
      ],
      "mistakes": [
        "用它追很短線，會因平滑造成延遲。"
      ],
      "limitations": [
        "訊號較慢，適合搭配更快的價格確認。"
      ],
      "judgmentZh": "TRIX 的三重指數平滑及變動率設計應以傑克・哈特森的資料為起點。預熱期不足時，早段數值很容易受種子值影響。"
    },
    {
      "slug": "tsi",
      "siteSlug": "tsi",
      "nameZh": "真實強弱指數",
      "summary": "TSI 用平滑後的動量比例衡量趨勢強度，常搭配訊號線觀察轉折。",
      "signals": [
        "TSI 上穿訊號線表示動能轉強。",
        "TSI 與價格背離可提示趨勢疲弱。"
      ],
      "mistakes": [
        "忽略訊號平滑帶來的延遲。"
      ],
      "limitations": [
        "參數較多，不宜為了貼合歷史而過度最佳化。"
      ],
      "judgmentZh": "就 TSI 而言，本站目前只有一般短線動量和教材資料，未直接交代雙重平滑的來源；拉瑞・威廉斯、科爾比及普林格只可作背景閱讀。"
    },
    {
      "slug": "ulcer-index",
      "siteSlug": "ulcer-index",
      "nameZh": "潰瘍指數",
      "summary": "Ulcer Index 專注下行回撤壓力，比一般波動率更貼近持有者承受的痛感。",
      "signals": [
        "UI 上升代表回撤壓力增加。",
        "同樣收益下 UI 較低的標的，持有體驗通常較平穩。"
      ],
      "mistakes": [
        "只看回撤壓力，不看流動性和基本面風險。"
      ],
      "limitations": [
        "不衡量上行波動。"
      ],
      "judgmentZh": "潰瘍指數由彼得・馬丁與拜倫・麥肯共同建立，兩人的資料應一併閱讀。這個指標專注下行回撤，不應與對稱波動率混為一談。"
    },
    {
      "slug": "ultimate-oscillator",
      "siteSlug": "ultimate-oscillator",
      "nameZh": "終極震盪指標",
      "summary": "UO 同時結合短中長週期動能，目標是降低單一週期震盪指標的假訊號。",
      "signals": [
        "低位背離後回升，可觀察反彈機會。",
        "突破中線代表多週期買壓改善。"
      ],
      "mistakes": [
        "忽略它仍是震盪指標，不適合單獨追突破。"
      ],
      "limitations": [
        "解讀比 RSI 複雜，需先理解多週期概念。"
      ],
      "judgmentZh": "終極震盪指標應以拉瑞・威廉斯的多週期設計為主要來源，先核對買壓、真實波幅及三組權重，再研究背離訊號。"
    },
    {
      "slug": "volatility-stop",
      "siteSlug": "volatility-stop",
      "nameZh": "波動止蝕",
      "summary": "波動止蝕用波幅決定移動止蝕距離，避免用固定價格距離套用所有股票。",
      "signals": [
        "止蝕線隨趨勢上移，可用作保護利潤。",
        "價格跌破止蝕線，代表原趨勢風險上升。"
      ],
      "mistakes": [
        "倍數設太小，正常波動也會被掃出。"
      ],
      "limitations": [
        "止蝕規則需配合交易週期。"
      ],
      "judgmentZh": "研究波動止蝕時，可用布林格、思拉舍及斯皮羅格魯的資料補充波幅和風險背景；現有比較未能證明單一創始來源，週期、倍數及移動規則必須逐項列明。"
    },
    {
      "slug": "volume",
      "siteSlug": "volume",
      "nameZh": "成交量",
      "summary": "成交量是技術分析的基礎，用來確認價格變化背後是否有足夠參與度。",
      "signals": [
        "放量突破比縮量突破更值得留意。",
        "價跌量縮可能代表賣壓減弱，但需配合支撐位觀察。",
        "高位爆量後滯漲，需要留意派發風險。"
      ],
      "mistakes": [
        "只看成交股數，不看成交額和流通性。"
      ],
      "limitations": [
        "港股半日市、停牌復牌與特殊事件會影響成交量比較。"
      ],
      "judgmentZh": "成交量研究可由威科夫的供求框架入手，再以格蘭維爾的累積成交量方法及多米爾的現代量價研究交叉核對。三者着眼點不同，不宜排成單一勝負。"
    },
    {
      "slug": "volume-ma",
      "siteSlug": "volume-ma",
      "nameZh": "成交量均線",
      "summary": "成交量均線把當日成交量與近期平均比較，幫助判斷放量或縮量是否明顯。",
      "signals": [
        "成交量高於 20 日均量，代表參與度高於近期水平。",
        "突破時成交量同步高於均量，訊號較完整。"
      ],
      "mistakes": [
        "忽略財報、配股、除權等事件造成的異常量。"
      ],
      "limitations": [
        "只反映相對近期，不能直接比較不同股票。"
      ],
      "judgmentZh": "成交量均線是量價分析的實用基準。威科夫、格蘭維爾及多米爾可提供解讀脈絡，但均線週期和異常成交處理仍須由使用者清楚交代。"
    },
    {
      "slug": "volume-oscillator",
      "siteSlug": "volume-oscillator",
      "nameZh": "成交量震盪器",
      "summary": "Volume Oscillator 比較短期與長期成交量均線，用來判斷成交活動正在擴張還是收縮。",
      "signals": [
        "VO 高於零代表短期成交量高於長期平均。",
        "VO 上升代表成交量擴張。",
        "突破時 VO 同步轉正，訊號較完整。"
      ],
      "mistakes": [
        "只看成交量擴張，不看價格突破是否有效。"
      ],
      "limitations": [
        "成交量放大可能來自好消息，也可能來自恐慌賣出。"
      ],
      "judgmentZh": "成交量震盪器可借用威科夫、格蘭維爾及多米爾的量價框架理解，但快慢成交量均線的專屬參數及源流仍需另行核對。"
    },
    {
      "slug": "volume-profile",
      "siteSlug": "volume-profile",
      "nameZh": "成交量分佈",
      "summary": "Volume Profile 顯示不同價格區間的成交量，幫助辨識成交密集區、價值區與可能支撐阻力。",
      "signals": [
        "高成交量節點常是市場記憶區。",
        "低成交量區被突破後，價格可能移動較快。"
      ],
      "mistakes": [
        "把成交密集區當成必然反轉點。"
      ],
      "limitations": [
        "需要較細的成交資料，平台計算方式可能不同。"
      ],
      "judgmentZh": "成交量分佈應先讀彼得・史戴梅爾的市場輪廓與價格時間分佈框架；詹姆斯・道爾頓的著作適合補充拍賣市場及價值區的實務判讀。"
    },
    {
      "slug": "vortex-indicator",
      "siteSlug": "vortex-indicator",
      "nameZh": "漩渦指標",
      "summary": "Vortex Indicator 用正負方向移動距離觀察趨勢方向變化，概念上接近 DMI。",
      "signals": [
        "VI+ 上穿 VI- 代表上升方向性增強。",
        "VI- 上穿 VI+ 代表下跌方向性增強。",
        "交叉後若 ADX 或成交量同步確認，訊號較完整。"
      ],
      "mistakes": [
        "在橫行市追逐每次 VI 交叉。"
      ],
      "limitations": [
        "方向交叉不代表趨勢強度足夠，需要濾網確認。"
      ],
      "judgmentZh": "漩渦指標由艾蒂安・博特斯與道格拉斯・西普曼共同建立，兩人的資料應並列為原始來源；正負移動距離及 TR 加總口徑要一併核對。"
    },
    {
      "slug": "vwap",
      "siteSlug": "vwap",
      "nameZh": "成交量加權平均價",
      "summary": "VWAP 以成交量加權計算平均成交價，常用於日內觀察機構成本區和價格強弱。",
      "signals": [
        "價格位於 VWAP 上方，代表日內平均買方較有優勢。",
        "回踩 VWAP 後反彈，可作為日內支撐觀察。",
        "錨定 VWAP 可從事件日、突破日或低點開始計算成本區。"
      ],
      "mistakes": [
        "把日內 VWAP 用成長線指標，忽略它的計算週期。"
      ],
      "limitations": [
        "日內資料品質和成交口徑會影響準確度。"
      ],
      "judgmentZh": "布萊恩・香農的資料最適合研究錨定 VWAP 的實務用法，但這不等於一般日內 VWAP 的創始考證；交易時段、重設點及典型價格仍須分開說明。"
    },
    {
      "slug": "williams-r",
      "siteSlug": "williams-r",
      "nameZh": "威廉指標",
      "summary": "Williams %R 與 KD 概念相近，用負值表示收盤價相對高低區間的位置。",
      "signals": [
        "從 -80 以下回升，代表短線賣壓可能舒緩。",
        "高位鈍化時，代表強勢趨勢仍可能延續。"
      ],
      "mistakes": [
        "把進入超買超賣區視為立即反轉。"
      ],
      "limitations": [
        "震盪市較有用，趨勢市需搭配趨勢濾網。"
      ],
      "judgmentZh": "Williams %R 應先讀拉瑞・威廉斯的原始設計。它與隨機指標位置相近但刻度方向不同，不能只改符號便忽略平台口徑。"
    },
    {
      "slug": "wma",
      "siteSlug": "wma",
      "nameZh": "加權移動平均線",
      "summary": "WMA 給近期價格更高權重，比 SMA 靈敏，適合需要較快反應但仍想保留平均概念的情境。",
      "signals": [
        "WMA 向上且價格回落不跌破，代表短線趨勢仍有承接。",
        "WMA 與 SMA 距離拉開，表示近期價格加速。"
      ],
      "mistakes": [
        "用太短週期追逐每次波動，容易增加錯誤訊號。"
      ],
      "limitations": [
        "對近期價格敏感，盤整時容易來回翻轉。"
      ],
      "judgmentZh": "加權移動平均線屬通用平滑方法。阿佩爾可補充動量均線應用，墨菲及科爾比提供教材整理；真正需要核對的是權重序列及正規化方式。"
    },
    {
      "slug": "zig-zag",
      "siteSlug": "zig-zag",
      "nameZh": "Zig Zag 指標",
      "summary": "Zig Zag 過濾小波動，幫助辨識主要波段高低點與型態結構。",
      "signals": [
        "可用來輔助觀察高低點是否抬高或下移。",
        "配合斐波那契可標示波段回調。"
      ],
      "mistakes": [
        "忽略 Zig Zag 會隨新價格重畫。"
      ],
      "limitations": [
        "不適合作為即時訊號。"
      ],
      "judgmentZh": "本間宗久、艾倫・安德魯斯及傑克・施瓦格可補充市場心理、擺動點與交易經驗，但現有資料未直接覆蓋 Zig Zag 的算法源流；轉向百分比仍需專屬來源。"
    }
  ],
  "terms": {
    "PF": {
      "firstUse": "盈利因子（Profit Factor，PF）",
      "short": "PF",
      "guidance": "總盈利除以總虧損的比率；不得當作未來回報或策略可信度的單一證明。"
    },
    "OOS": {
      "firstUse": "樣本外測試（Out-of-sample testing，OOS）",
      "short": "OOS",
      "guidance": "沒有 OOS 時要寫明未完成樣本外驗證，不得用「穩健」代替。"
    },
    "RMA": {
      "firstUse": "威爾德移動平均（Wilder's Moving Average，RMA）",
      "short": "RMA",
      "guidance": "交代它是平滑方法；若平台命名或算法有差異，標明所採口徑。"
    },
    "ATR": {
      "firstUse": "平均真實波幅（Average True Range，ATR）",
      "short": "ATR",
      "guidance": "量度波幅而非方向，不能把 ATR 上升寫成看升或看跌。"
    },
    "EMA": {
      "firstUse": "指數移動平均線（Exponential Moving Average，EMA）",
      "short": "EMA",
      "guidance": "首次要說明較近期價格權重較高；不得暗示必然領先價格。"
    },
    "Strategy Report": {
      "firstUse": "策略測試報告（Strategy Report）",
      "short": "策略測試報告",
      "guidance": "中文名稱先行；結果依賴資料、期間、成本、滑價和設定。"
    },
    "Properties": {
      "firstUse": "策略屬性設定（Properties）",
      "short": "策略屬性",
      "guidance": "中文名稱先行；用來指初始資金、下單大小、加倉、成本、滑價等設定。"
    }
  },
  "strategy": {
    "statuses": {
      "accepted": {
        "label": "已完成全部核對",
        "shortLabel": "已核對",
        "guidance": "已符合目前公開的審核項目；不代表保證獲利或適合實盤。"
      },
      "support-only": {
        "label": "待完成核對",
        "shortLabel": "待核對",
        "guidance": "可作教學或補充研究，但關鍵證據未齊，不得包裝成已通過。"
      },
      "rejected": {
        "label": "不採用",
        "shortLabel": "不採用",
        "guidance": "不納入正式案例；如展示原因，要具體指出哪項證據或條件不合格。"
      }
    },
    "disclosurePhrases": {
      "incompleteEvidence": "關鍵回測資料未齊，暫不判定策略是否可靠。",
      "educationOnly": "只作教育研究，不構成投資建議。",
      "localReconstruction": "本站教學重建，不代表原作者程式碼。"
    }
  }
};
