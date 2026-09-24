export type TrustSection = { readonly title: string; readonly body: string; readonly points: readonly string[] };
export type TrustContent = { readonly eyebrow:string; readonly title:string; readonly description:string; readonly directAnswer:string; readonly versionLabel:string; readonly version:string; readonly indexable:boolean; readonly sections:readonly TrustSection[]; readonly related:readonly TrustRoutePath[]; };
export const trustRoutePaths = ["trust","about/team","editorial-policy","methodology/data","methodology/backtesting","ai-disclosure","corrections","conflicts","risk-disclosure","contact/report-error","privacy"] as const;
export type TrustRoutePath = (typeof trustRoutePaths)[number];
const contents: Readonly<Record<TrustRoutePath,TrustContent>> = {
  "trust": {
    "eyebrow": "關於本站",
    "title": "關於與方法",
    "description": "港股證據研究室是一個以香港繁體中文整理市場知識的金融教育網站。",
    "directAnswer": "從圖表和公式讀懂技術分析，再把概念放回交易機制、成本與風險。文章以原始文件、計算例子及清楚的適用範圍，支持讀者自行核對。",
    "sections": [
      {
        "title": "這裏可以讀到甚麼",
        "body": "內容涵蓋技術指標、港股市場機制、風險與紀律、回測方法及 Pine Script。研究札記以單一問題展開，百科則方便隨時查閱公式與用途。",
        "points": [
          "100 篇研究札記，每篇附兩幅解說圖",
          "82 個指標條目，按用途與難度查找",
          "歷史圖表、風險計算、日誌及判讀練習"
        ]
      },
      {
        "title": "圖表和圖解如何分工",
        "body": "歷史圖表使用已保存的市場資料，並標示期間及價格處理方式。概念圖解拆解計算、時序或比較；數字算例不代表個別證券的市場紀錄。",
        "points": [
          "來源、資料期間與公式相互對應",
          "不以生成的價格路徑冒充真實行情",
          "沒有把教學構思包裝成已證實的交易績效"
        ]
      },
      {
        "title": "如何使用本站",
        "body": "初學者可沿學習路線閱讀，再以練習及日誌記錄理解。已有經驗的讀者，可由特定公式、程式行為或回測問題直接查找。",
        "points": [
          "專業術語在正文中解釋",
          "參考資料可連到原始文件",
          "具體交易決定須考慮個人情況與實際市場條件"
        ]
      }
    ],
    "related": [
      "editorial-policy",
      "methodology/data",
      "methodology/backtesting",
      "ai-disclosure",
      "about/team"
    ],
    "versionLabel": "內容版本",
    "version": "2026.09",
    "indexable": true
  },
  "about/team": {
    "eyebrow": "網站介紹",
    "title": "關於港股證據研究室",
    "description": "以清楚的文字、可核對的公式和題目相符的圖解，整理技術分析知識。",
    "directAnswer": "本站的重點是金融教育：把難以比較的術語、圖表和研究方法拆開說明，讓讀者知道每種工具可以回答甚麼問題。",
    "sections": [
      {
        "title": "我們關心的問題",
        "body": "一個讀數是怎樣計算的？一張圖使用哪段資料？一個看似漂亮的結果，在加入成本後是否仍然一樣？這些問題決定內容如何組織。",
        "points": [
          "先解釋量度內容，再討論用途",
          "把失效情境放進教學",
          "用市場機制補充圖表觀察"
        ]
      },
      {
        "title": "內容範圍",
        "body": "港股市場是主要閱讀背景，同時保留適合教學的其他市場歷史例子。每個例子列出市場和期間，避免把不同交易環境混作一談。",
        "points": [
          "通用技術分析知識",
          "香港交易機制及資料判讀",
          "程式與回測的研究方法"
        ]
      }
    ],
    "related": [
      "trust",
      "editorial-policy",
      "risk-disclosure"
    ],
    "versionLabel": "內容版本",
    "version": "2026.09",
    "indexable": true
  },
  "editorial-policy": {
    "eyebrow": "編輯原則",
    "title": "一頁好文章，應該經得起追問。",
    "description": "說明本站如何引用原始資料、設定教學算例，並以香港繁體中文整理金融教育內容。",
    "directAnswer": "事實指向來源，算例交代假設，解讀說清適用範圍。不能支持的成效、資歷與數字，不用來填補文章。",
    "sections": [
      {
        "title": "資料如何選擇",
        "body": "市場機制優先查閱交易所及監管機構文件；平台行為以平台官方文件為依據；指標的定義則對齊明確公式及相關原始材料。",
        "points": [
          "引用連到實際支持內容的頁面",
          "易變規則附資料查閱日期",
          "不把第三方宣傳數字當成本站測試結果"
        ]
      },
      {
        "title": "文章如何寫作",
        "body": "採用香港繁體中文，保留必要的英文函數名稱及縮寫。文學性的比喻用來協助理解，不能代替計算，也不能令不確定的關係變成保證。",
        "points": [
          "不虛構交易經驗、作者資歷或讀者評價",
          "不以保證回報、倒數或恐嚇催促交易",
          "不靠重複段落或關鍵詞填充篇幅"
        ]
      },
      {
        "title": "例子如何呈示",
        "body": "教學數字清楚說明其假設；歷史案例交代證券、期間與來源。圖解中的每個標籤要與相鄰文字相符，計算單位亦保持一致。",
        "points": [
          "區分合成圖解與市場資料",
          "區分訊號產生和訂單成交",
          "修訂重要公式時同步檢查相關圖解"
        ]
      }
    ],
    "related": [
      "methodology/data",
      "ai-disclosure",
      "corrections"
    ],
    "versionLabel": "內容版本",
    "version": "2026.09",
    "indexable": true
  },
  "methodology/data": {
    "eyebrow": "數據方法",
    "title": "先對齊資料，才比較結果。",
    "description": "說明歷史圖表的來源、期間、時區、復權與指標計算口徑。",
    "directAnswer": "資料的市場、時間和價格處理方式，都是分析的一部分。相同公式套用在不同口徑上，可以得到不同圖形。",
    "sections": [
      {
        "title": "本站歷史圖表",
        "body": "歷史頁使用保存的 Yahoo Finance 日線資料。圖表列出供應商、下載日期與資料請求連結；圖上日期對應原始交易日，並非即時報價。",
        "points": [
          "收市線使用調整後收市價",
          "開高低價依同日調整後收市／原收市比例換算",
          "成交量保留資料檔所記錄的股數"
        ]
      },
      {
        "title": "看圖時要核對甚麼",
        "body": "公司行動可改變價格尺度；不同資料商的復權與修訂方式亦可不同。跨市場比較時，同一日線標籤未必代表同一時間點。",
        "points": [
          "先對齊證券、交易所及貨幣",
          "記錄日內時段、時區與缺失資料",
          "以已知的公司行動核對不尋常裂口"
        ]
      },
      {
        "title": "指標如何計算",
        "body": "指標先用完整保存期間累積計算，再截取圖中顯示的最後 110 根。移動平均及遞迴平滑會受預熱與初值影響，對照平台時應連同這些條件核對。",
        "points": [
          "EMA 以完整週期的簡單平均作起始值",
          "隨機指標使用 14 期區間、3 期 K 平滑及 3 期 D 平滑",
          "圖表方法使用專屬圖解，區分事後定位與當時可知的資料"
        ]
      },
      {
        "title": "概念圖解",
        "body": "文章圖解用於計算步驟、概念比較及教學算例。它們沒有將人造價格序列標作真實市場資料，亦不表示任何實際投資結果。",
        "points": [
          "圖題交代主題",
          "圖說補充假設與單位",
          "可開啟原圖放大閱讀"
        ]
      }
    ],
    "related": [
      "methodology/backtesting",
      "corrections",
      "risk-disclosure"
    ],
    "versionLabel": "內容版本",
    "version": "2026.09",
    "indexable": true
  },
  "methodology/backtesting": {
    "eyebrow": "回測方法",
    "title": "歷史的答案，帶着當時的條件。",
    "description": "記錄規則、成本、時間順序與測試樣本，理解回測結果。",
    "directAnswer": "回測模擬規則在指定資料上的行為。參數、費用、成交模型或樣本只要改變，結果便可能不同。",
    "sections": [
      {
        "title": "保存一份可重現的設定",
        "body": "至少保存資料來源與期間、商品與週期、入市退出條件、持倉大小、程式版本及參數。亦要寫明複利、加倉、股息和保證金的處理方式。",
        "points": [
          "計算訊號的資料必須在當時可取得",
          "價格與金額單位保持一致",
          "交易明細與匯總數字互相核對"
        ]
      },
      {
        "title": "成交不是一個理所當然的價格",
        "body": "訂單建立、觸發與成交是不同事件。同一根日線可能同時觸及兩個價位，而 OHLC 不能交代完整先後次序。",
        "points": [
          "以標準市場價格模擬成交",
          "加入佣金、價差及合理滑價情境",
          "把裂口、未成交和部分成交列作研究邊界"
        ]
      },
      {
        "title": "設計資料與檢驗資料分開",
        "body": "先用一段資料建立規則，再用未參與選擇的資料檢查。若不斷根據測試結果修訂，測試資料便逐漸參與設計。",
        "points": [
          "採用按時間排序的分割",
          "保留試過的參數與失敗結果",
          "檢查不同市況及鄰近參數"
        ]
      },
      {
        "title": "閱讀完整結果",
        "body": "總收益、回撤、交易次數、平均盈虧與成本要一起看。少數大額盈利、樣本相依或一次長趨勢，都可以左右整段結果。",
        "points": [
          "對照同期間及相同口徑的基準",
          "區分樣本內、樣本外與實時觀察",
          "本站策略頁提供研究方法，不提供成效排名"
        ]
      }
    ],
    "related": [
      "methodology/data",
      "risk-disclosure",
      "editorial-policy"
    ],
    "versionLabel": "內容版本",
    "version": "2026.09",
    "indexable": true
  },
  "ai-disclosure": {
    "eyebrow": "工具使用",
    "title": "寫作工具與資料來源，各有角色。",
    "description": "說明人工智能在本站內容整理與製作中的使用。",
    "directAnswer": "本站使用人工智能工具協助資料整理、文字撰寫、圖解設計及程式製作。金融事實的依據是所列來源，計算則以明確的公式和假設解釋。",
    "sections": [
      {
        "title": "哪些工作使用了工具",
        "body": "文章初稿、語言編輯、分類、圖解規格和網站功能均有工具協助。自然的文字風格不代表作者具有真人交易經驗或專業資格。",
        "points": [
          "不虛構人物、職銜或個人經歷",
          "不把工具輸出列作市場證據",
          "不用生成圖像冒充真實成交或策略紀錄"
        ]
      },
      {
        "title": "如何閱讀工具協助的內容",
        "body": "可從文章的參考資料追查定義，從算例核對步驟，並比較公式與圖解。清楚的出處比文字是否流暢更有判斷價值。",
        "points": [
          "市場機制以當時有效的官方文件為準",
          "平台行為以相應版本文件為準",
          "實際決定仍需考慮自身情況"
        ]
      }
    ],
    "related": [
      "editorial-policy",
      "methodology/data",
      "corrections"
    ],
    "versionLabel": "內容版本",
    "version": "2026.09",
    "indexable": true
  },
  "corrections": {
    "eyebrow": "更新與修訂",
    "title": "讓改動有跡可循。",
    "description": "按日期記錄網站文章、公式、歷史圖表及學習工具的實質修訂，方便讀者回看變更。",
    "directAnswer": "2026 年 9 月 22 日進行內容與網站架構更新，補充研究札記、圖解和學習工具，同時修正圖片與文字的對應。",
    "sections": [
      {
        "title": "2026 年 9 月 22 日：內容擴充",
        "body": "新增 100 篇研究札記與 200 幅專題圖解，涵蓋指標、港股市場、風險、回測與 Pine Script。加入分類、文章搜尋、頁碼、相關閱讀與 RSS。",
        "points": [
          "補充學習路線、詞彙、陰陽燭和指標比較",
          "策略頁改以研究方法與條件為核心",
          "刪除未核實績效數字及內部製作提示"
        ]
      },
      {
        "title": "2026 年 9 月 22 日：圖表與功能",
        "body": "隨機指標的公式、參數和圖線統一為 14、3、3；價格結構方法以對應的教學圖解呈示，避免將回歸線當作手繪趨勢線。",
        "points": [
          "風險計算納入每手股數、費用及滑價",
          "交易日誌可儲存於本機及下載",
          "未知網址顯示正確的找不到頁面狀態"
        ]
      },
      {
        "title": "修訂意見如何整理",
        "body": "保留文章網址、問題位置、相關數字及可查閱的來源，較容易指出差異究竟來自公式、資料口徑或文字。",
        "points": [
          "以最小的例子說明問題",
          "移除帳戶號碼及其他私人資料",
          "可使用修訂筆記工具製作文字檔"
        ]
      }
    ],
    "related": [
      "contact/report-error",
      "editorial-policy",
      "methodology/data"
    ],
    "versionLabel": "內容版本",
    "version": "2026.09",
    "indexable": true
  },
  "conflicts": {
    "eyebrow": "內容與利益關係",
    "title": "讓內容的依據保持清楚。",
    "description": "本站如何區分教育內容、外部參考與商業安排。",
    "directAnswer": "文章提到的市場、平台與商品，是概念的例子或資料來源；連結本身不代表推薦、合作或適合任何特定讀者。",
    "sections": [
      {
        "title": "來源與推薦的分別",
        "body": "引用交易所、平台或工具文件，是為了核對規則和計算。工具流行程度、公開回測數字或作者名氣，均不能單獨證明一項交易方法有效。",
        "points": [
          "不按宣稱回報排列策略",
          "不把外部平台當成唯一選擇",
          "不因提及商品而推斷讀者應買入"
        ]
      },
      {
        "title": "商業內容的標示原則",
        "body": "若內容涉及贊助、付費合作或可產生收入的推廣關係，相關頁面應清楚交代。商業安排不應改變公式、刪去失效情境或保證投資結果。",
        "points": [
          "合作與引用分開說明",
          "投資成效不能靠宣傳文字保證",
          "以文章中的事實與資料檢視結論"
        ]
      }
    ],
    "related": [
      "editorial-policy",
      "risk-disclosure",
      "trust"
    ],
    "versionLabel": "內容版本",
    "version": "2026.09",
    "indexable": true
  },
  "risk-disclosure": {
    "eyebrow": "使用範圍",
    "title": "閱讀市場，也理解風險。",
    "description": "理解技術指標、歷史回測及交易工具的適用範圍，以及成本、裂口和流動性帶來的風險。",
    "directAnswer": "本站提供一般金融教育內容，不構成針對個人情況的投資建議。技術分析、歷史圖表與回測都不能保證未來結果。",
    "sections": [
      {
        "title": "價格與執行",
        "body": "市場可出現急劇變動、停牌、裂口或流動性下降。指定止蝕位置未必就是實際成交價格，損失亦可超出原先計劃。",
        "points": [
          "借貸及槓桿可擴大損失",
          "費用與滑價會改變淨結果",
          "一個指標不能涵蓋所有市場風險"
        ]
      },
      {
        "title": "資料與研究",
        "body": "歷史資料可能經調整或修訂；平台的計算和成交模型亦有特定假設。看似精確的數字，仍要放回來源、期間和單位。",
        "points": [
          "過往表現不代表未來表現",
          "樣本外測試仍有模型與樣本風險",
          "教學算例並非個別證券的推薦"
        ]
      },
      {
        "title": "個人決定",
        "body": "資金需要、可承受損失、經驗及目標因人而異。需要針對自身情況的建議時，可向合資格專業人士查詢。",
        "points": [
          "先理解商品及交易機制",
          "不以網站例子代替個人財務評估",
          "不把文學比喻解讀成價格預測"
        ]
      }
    ],
    "related": [
      "methodology/backtesting",
      "methodology/data",
      "trust"
    ],
    "versionLabel": "內容版本",
    "version": "2026.09",
    "indexable": true
  },
  "contact/report-error": {
    "eyebrow": "修訂筆記",
    "title": "把問題說清楚，修正便有方向。",
    "description": "整理文章、公式或圖表的修訂意見，下載成文字檔。",
    "directAnswer": "請列出文章位置、實際內容、你認為正確的解釋與參考來源。以下工具將筆記整理為文字檔，方便保存或自行轉交。",
    "sections": [
      {
        "title": "一份有用的修訂筆記",
        "body": "指出具體句子、計算步驟或圖中標籤；若涉及程式，附上最小的輸入例子和預期結果。",
        "points": [
          "記下網址及章節",
          "交代資料來源、版本和期間",
          "只包含與問題有關的公開資料"
        ]
      }
    ],
    "related": [
      "corrections",
      "methodology/data",
      "editorial-policy"
    ],
    "versionLabel": "內容版本",
    "version": "2026.09",
    "indexable": true
  },
  "privacy": {
    "eyebrow": "私隱與本機資料",
    "title": "知道資料保存在哪裏。",
    "description": "說明網站日誌、計算工具和下載功能如何處理輸入。",
    "directAnswer": "風險計算與練習在瀏覽器中運作；交易日誌只有按下儲存時才寫入本機瀏覽器。這些功能沒有把輸入送往本站的資料庫。",
    "sections": [
      {
        "title": "日誌與儲存",
        "body": "日誌以瀏覽器本機儲存保存，屬同一裝置與瀏覽器的資料。其他使用相同瀏覽器的人可能讀取，清除網站資料後亦會移除。",
        "points": [
          "不填寫帳戶密碼或身份資料",
          "以下載文字檔保留副本",
          "更換裝置不會自動同步"
        ]
      },
      {
        "title": "計算、練習與下載",
        "body": "計算數值和練習答案保留在當前頁面狀態。日誌與修訂筆記的下載檔案，由瀏覽器產生並保存到你選擇的位置。",
        "points": [
          "下載不等於提交內容",
          "RSS 不需要在本站填寫電郵",
          "外部連結由相應網站處理其訪問資料"
        ]
      },
      {
        "title": "網站託管",
        "body": "網站由 GitHub Pages 託管。GitHub 服務的資料處理方式，請參閱 GitHub 公布的適用政策。",
        "points": [
          "本頁說明本站功能本身的資料處理",
          "不代替外部服務的政策",
          "敏感個人或交易資料不宜寫入共用裝置"
        ]
      }
    ],
    "related": [
      "trust",
      "contact/report-error",
      "risk-disclosure"
    ],
    "versionLabel": "內容版本",
    "version": "2026.09",
    "indexable": true
  }
};
export function isTrustRoute(value:string):value is TrustRoutePath { return trustRoutePaths.some(r=>r===value); }
export function trustContentFor(path:TrustRoutePath):TrustContent {return contents[path];}
