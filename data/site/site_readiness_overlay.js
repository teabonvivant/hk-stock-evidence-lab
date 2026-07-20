window.__TI_READINESS__ = {
  "schemaVersion": 1,
  "version": "2026-07-03-p1-p4-readiness-overlay",
  "generatedAt": "2026-07-02T17:40:13.285145+00:00",
  "status": "pass",
  "sourceArtifacts": [
    "A-domain-lead.md",
    "B-quant-research.md",
    "C-trade-risk.md",
    "D-market-data.md",
    "F-evidence-audit.md",
    "H-taxonomy.md",
    "J-data-integration.md"
  ],
  "readinessFields": [
    "formulaReadiness",
    "sourceReadiness",
    "quantCaveat",
    "tradePlaybookReadiness",
    "failureConditionReadiness",
    "marketDataStatus"
  ],
  "indicatorPolicy": {
    "formulaReadiness": "公式欄可作教學基線；進階指標仍需標示公式版本、資料需求和失效情境。",
    "sourceReadiness": "來源已分級接入；高權威、二手整理和平台文章不可混作同等證據。",
    "quantCaveat": "所有預設參數只作教育用途；未列明成本、滑價、樣本期和風險前，不視為回測結論。",
    "tradePlaybookReadiness": "交易劇本需同時交代入場、止蝕、倉位、R 值、退出和錯誤案例。",
    "failureConditionReadiness": "每個指標需補足何時有效、何時失效，以及訊號延遲或假突破風險。"
  },
  "marketData": {
    "marketCaseCount": 5,
    "usedMarketCaseCount": 4,
    "unusedMarketCaseKeys": [
      "momentumBreakout"
    ],
    "adjClosePolicy": "網站圖表目前顯示 close；adjClose 保留給公司行動與除權除息覆核。",
    "datePolicy": "Yahoo period2 可能是排除式結束日期；metadata end 可能比實際最後 K 線晚一個交易日。",
    "validationStatus": "本地快照結構已通過檢查；即時 Yahoo 漂移未完成驗證。"
  },
  "sourceReview": {
    "flagCount": 240,
    "lowReviewRows": 13,
    "status": "accepted_support_only",
    "policy": "低信任或來源類型不清的材料已降權為 support-only；不可單獨支撐公式、來源或交易結論。"
  },
  "taxonomyReview": {
    "reviewMarkerCount": 64,
    "status": "accepted_mapping_state",
    "policy": "merge、split 與 medium-confidence 是已追蹤的 taxonomy 關係，不代表未對應；所有 82 個前端 slug 仍須一對一落到研究概念。"
  },
  "runnerUpPolicy": {
    "siteMissingRows": 0,
    "winnerMissingRows": 0,
    "status": "complete_with_explicit_status"
  }
};
