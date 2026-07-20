# -*- coding: utf-8 -*-
"""Fuse all technical-analysis expert data into one complete database."""

from __future__ import annotations

import csv
import json
import shutil
import sqlite3
import sys
from collections import Counter, defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
SOURCE_DB = DATA_DIR / "technical_analysis_experts.sqlite"
COMPLETE_DB = DATA_DIR / "technical_analysis_complete.sqlite"
COMPLETE_EXPERTS_CSV = DATA_DIR / "technical_analysis_complete_expert_profiles.csv"
COMPLETE_INDICATORS_CSV = DATA_DIR / "technical_analysis_complete_indicator_profiles.csv"
COMPLETE_FAMILIES_CSV = DATA_DIR / "technical_analysis_complete_method_families.csv"
COMPLETE_INDEX_MD = DATA_DIR / "technical_analysis_complete_database_index.md"


REQUIRED_TABLES = {
    "experts",
    "concepts",
    "expert_concepts",
    "research_materials",
    "sources",
    "expert_research_digest_bilingual",
    "research_materials_bilingual",
    "indicator_expert_comparisons",
    "indicator_winner_judgments",
}


FAMILY_LABELS = {
    "auction_market": ("拍賣市場", "Auction Market"),
    "breadth": ("市場寬度", "Market Breadth"),
    "breakout": ("突破交易", "Breakout"),
    "charting": ("圖表分析", "Charting"),
    "cycle": ("週期分析", "Cycle Analysis"),
    "foundation": ("技術分析基礎理論", "Foundations"),
    "market_timing": ("市場時機", "Market Timing"),
    "momentum": ("動量指標", "Momentum"),
    "research": ("實證研究與回測", "Research and Backtesting"),
    "risk": ("風險與回撤", "Risk and Drawdown"),
    "sentiment": ("市場情緒", "Sentiment"),
    "stock_selection": ("股票選股", "Stock Selection"),
    "support_resistance": ("支撐阻力", "Support and Resistance"),
    "systems": ("交易系統", "Trading Systems"),
    "trend": ("趨勢分析", "Trend Analysis"),
    "uncategorized": ("其他方法", "Other Methods"),
    "volatility": ("波動率", "Volatility"),
    "volume": ("成交量與資金流", "Volume and Money Flow"),
    "wave": ("波浪理論", "Wave Analysis"),
}


FAMILY_SYNTHESIS = {
    "foundation": (
        "先建立趨勢、確認、價格與成交量的基本框架。",
        "Start with trend, confirmation, price, and volume as the core framework.",
        "用於判斷市場是否值得進一步套用指標。",
        "Use this to decide whether a market deserves further indicator analysis.",
        "不要把理論框架直接當成買賣訊號。",
        "Do not treat a theoretical framework as a direct trading signal.",
    ),
    "trend": (
        "回答市場方向是否存在，以及趨勢是否延續。",
        "Answers whether direction exists and whether the trend persists.",
        "適合中長線方向、均線、通道與趨勢跟隨。",
        "Best for medium/long-term direction, moving averages, channels, and trend following.",
        "盤整市容易產生滯後與反覆假訊號。",
        "Range-bound markets can create lag and repeated whipsaws.",
    ),
    "momentum": (
        "衡量價格推進力度、背離、超買超賣與短線節奏。",
        "Measures thrust, divergence, overbought/oversold conditions, and short-term rhythm.",
        "適合搭配趨勢方向做進出場時機判斷。",
        "Best paired with trend direction for entry/exit timing.",
        "強趨勢中超買超賣可長時間維持。",
        "Overbought/oversold states can persist in strong trends.",
    ),
    "volatility": (
        "衡量市場波動環境、通道擴張收縮與風險狀態。",
        "Measures volatility regimes, channel expansion/contraction, and risk state.",
        "適合做倉位、停損距離與波動突破判斷。",
        "Useful for position sizing, stop distance, and volatility breakouts.",
        "波動率本身不提供方向，需要與趨勢或價格結構合用。",
        "Volatility does not provide direction by itself; combine it with trend or structure.",
    ),
    "volume": (
        "用成交量、資金流與供需關係驗證價格走勢。",
        "Uses volume, money flow, and supply/demand to validate price movement.",
        "適合確認突破、派發/吸收、買賣壓力。",
        "Best for confirming breakouts, distribution/accumulation, and buying/selling pressure.",
        "不同市場的成交量資料品質差異很大。",
        "Volume data quality varies widely across markets.",
    ),
    "breadth": (
        "觀察指數背後參與股票的廣度與市場內部健康。",
        "Looks at participation and internal health behind an index.",
        "適合判斷牛熊轉折、指數背離與風險擴散。",
        "Useful for bull/bear turns, index divergence, and risk diffusion.",
        "多數廣度資料偏市場層級，不一定適用單一股票。",
        "Most breadth data is market-level and may not apply to a single stock.",
    ),
    "charting": (
        "透過價格型態、K 線與結構辨識交易情境。",
        "Identifies trading context through price patterns, candlesticks, and structure.",
        "適合視覺化支撐阻力、突破、反轉與整理。",
        "Best for visualizing support/resistance, breakouts, reversals, and consolidations.",
        "型態主觀性較高，應用統計或規則降低任意解讀。",
        "Patterns are subjective; use statistics or rules to reduce arbitrary interpretation.",
    ),
    "support_resistance": (
        "整理市場反覆反應的價位、通道與時間價格區域。",
        "Maps recurring reaction levels, channels, and time-price zones.",
        "適合規劃風險報酬、停損、目標價與觀察區。",
        "Useful for risk/reward planning, stops, targets, and observation zones.",
        "單一水平不可靠，需看成交量、趨勢和觸價反應。",
        "A single level is fragile; check volume, trend, and reaction behavior.",
    ),
    "systems": (
        "把技術規則轉為可測試、可重複的交易流程。",
        "Turns technical rules into testable and repeatable trading processes.",
        "適合建立策略、回測、風控與樣本外驗證。",
        "Best for strategy design, backtesting, risk control, and out-of-sample validation.",
        "過度最佳化會讓歷史績效失真。",
        "Over-optimization can make historical performance misleading.",
    ),
    "research": (
        "用統計與資料驗證技術分析是否真的有可重複效果。",
        "Uses statistics and data to test whether technical analysis has repeatable value.",
        "適合篩選可信方法、檢查資料探勘與建立證據標準。",
        "Best for filtering credible methods, checking data mining, and setting evidence standards.",
        "研究結論常受樣本、成本、存活者偏差與市場變化影響。",
        "Results depend on samples, costs, survivorship bias, and market changes.",
    ),
}


STUDY_SEQUENCE = [
    (1, "Foundation", "基礎理論", "Dow Theory, Wyckoff Method", "Charles H. Dow; Richard D. Wyckoff", "先理解趨勢、確認、供需與量價。", "Understand trend, confirmation, supply/demand, and price-volume logic first."),
    (2, "Chart Structure", "圖表結構", "Chart Patterns, Candlestick Charting, Support and Resistance", "Thomas N. Bulkowski; Steve Nison; Robert D. Edwards; John Magee", "再學型態、K 線、支撐阻力與價格結構。", "Then study patterns, candlesticks, support/resistance, and price structure."),
    (3, "Trend Tools", "趨勢工具", "Moving Average, Donchian Channel, KAMA, GMMA", "Richard Donchian; Perry J. Kaufman; Daryl Guppy", "建立市場方向與趨勢跟隨框架。", "Build the direction and trend-following framework."),
    (4, "Momentum Tools", "動量工具", "RSI, MACD, Stochastic, CCI, CMO", "J. Welles Wilder Jr.; Gerald Appel; George C. Lane; Tushar Chande", "用動量確認節奏、背離與進出場時機。", "Use momentum to confirm rhythm, divergence, and timing."),
    (5, "Volatility and Risk", "波動與風險", "Bollinger Bands, ATR, Ulcer Index, SuperTrend", "John Bollinger; J. Welles Wilder Jr.; Peter G. Martin; Olivier Seban", "把波動、停損距離與回撤風險納入系統。", "Add volatility, stop distance, and drawdown risk to the system."),
    (6, "Volume and Breadth", "量價與市場寬度", "OBV, Chaikin Money Flow, MFI, McClellan Oscillator, TRIN", "Joseph Granville; Marc Chaikin; Gene Quong; Sherman McClellan; Richard Arms", "用成交量、資金流與市場內部確認價格訊號。", "Use volume, money flow, and market internals to confirm price signals."),
    (7, "Specialized Structure", "專門結構方法", "Elliott Wave, Point and Figure, Market Profile, Fibonacci", "Ralph Nelson Elliott; A. W. Cohen; J. Peter Steidlmayer; Joe DiNapoli", "學進階結構工具，但避免過度主觀化。", "Study advanced structure tools while avoiding excessive subjectivity."),
    (8, "Systems and Evidence", "系統與證據", "Backtesting, Evidence-Based Technical Analysis, Trading Systems", "David Aronson; Andrew W. Lo; Perry J. Kaufman; Robert Pardo", "最後把方法轉成可驗證規則，檢查樣本外表現與風險。", "Finally convert methods into testable rules and check out-of-sample performance and risk."),
]


def configure_stdout():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")


def connect():
    conn = sqlite3.connect(COMPLETE_DB)
    conn.row_factory = sqlite3.Row
    return conn


def ensure_ready():
    if not SOURCE_DB.exists():
        raise SystemExit(f"Missing source database: {SOURCE_DB}")
    conn = sqlite3.connect(SOURCE_DB)
    tables = {row[0] for row in conn.execute("SELECT name FROM sqlite_master WHERE type='table'")}
    conn.close()
    missing = sorted(REQUIRED_TABLES - tables)
    if missing:
        raise SystemExit(f"Source database is missing required tables: {missing}")


def copy_database():
    if COMPLETE_DB.exists():
        COMPLETE_DB.unlink()
    shutil.copy2(SOURCE_DB, COMPLETE_DB)


def fetch_all(conn, query, params=()):
    return [dict(row) for row in conn.execute(query, params)]


def write_csv(path, rows):
    if not rows:
        return
    with path.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)


def split_semicolon(value):
    return [item for item in (value or "").split(";") if item]


def build_complete_experts(conn):
    experts = fetch_all(
        conn,
        """
        SELECT
            e.id AS expert_id,
            e.rank,
            e.name_zh,
            e.name_en,
            e.country_region,
            e.years,
            e.role,
            e.category,
            d.category_zh,
            d.category_en,
            e.total_score,
            d.concepts_zh,
            d.concepts_en,
            d.research_focus_zh,
            d.research_focus_en,
            d.representative_materials_zh,
            d.representative_materials_en,
            d.bilingual_research_summary_zh,
            d.bilingual_research_summary_en,
            d.material_count,
            d.source_count,
            d.high_evidence_count,
            d.book_count,
            d.paper_article_count,
            d.evidence_profile_zh,
            d.evidence_profile_en
        FROM experts e
        JOIN expert_research_digest_bilingual d ON d.expert_id = e.id
        ORDER BY e.rank
        """,
    )
    wins = fetch_all(conn, "SELECT concept_slug, concept_zh, concept_en, winner_expert_ids FROM indicator_winner_judgments")
    comparisons = fetch_all(conn, "SELECT concept_slug, verdict_zh, expert_id FROM indicator_expert_comparisons")

    winning_by_expert = defaultdict(list)
    winning_by_expert_en = defaultdict(list)
    for row in wins:
        ids = split_semicolon(row["winner_expert_ids"])
        for expert_id in ids:
            winning_by_expert[expert_id].append(row["concept_zh"])
            winning_by_expert_en[expert_id].append(row["concept_en"])

    roles_by_expert = defaultdict(Counter)
    for row in comparisons:
        roles_by_expert[row["expert_id"]][row["verdict_zh"]] += 1

    output = []
    for row in experts:
        win_count = len(winning_by_expert[row["expert_id"]])
        role_counter = roles_by_expert[row["expert_id"]]
        if win_count >= 5 or row["total_score"] >= 24:
            tier_zh, tier_en = "核心權威", "Core authority"
        elif win_count >= 2 or row["total_score"] >= 22:
            tier_zh, tier_en = "重要權威", "Major authority"
        elif win_count >= 1 or row["total_score"] >= 19:
            tier_zh, tier_en = "專題權威", "Specialized authority"
        else:
            tier_zh, tier_en = "補充研究者", "Complementary researcher"
        best_use_zh = f"優先用於：{row['research_focus_zh']}。"
        best_use_en = f"Best used for: {row['research_focus_en']}."
        output.append(
            {
                **row,
                "authority_tier_zh": tier_zh,
                "authority_tier_en": tier_en,
                "winning_concepts_zh": "；".join(winning_by_expert[row["expert_id"]]),
                "winning_concepts_en": "; ".join(winning_by_expert_en[row["expert_id"]]),
                "winning_concept_count": win_count,
                "winner_role_count": role_counter.get("優勝", 0) + role_counter.get("並列優勝", 0),
                "strong_candidate_count": role_counter.get("強力候選", 0),
                "important_complement_count": role_counter.get("重要補充", 0),
                "best_use_case_zh": best_use_zh,
                "best_use_case_en": best_use_en,
                "integrated_note_zh": f"{row['name_zh']}在完整資料庫中屬於{tier_zh}，可從其代表材料與優勝指標交叉研究。",
                "integrated_note_en": f"{row['name_en']} is a {tier_en} in the complete database; study the representative materials together with the winning indicators.",
            }
        )
    return output


def build_complete_indicators(conn):
    concepts = fetch_all(conn, "SELECT slug, name_zh, name_en, family FROM concepts ORDER BY slug")
    comparisons = fetch_all(conn, "SELECT * FROM indicator_expert_comparisons ORDER BY concept_slug, comparison_rank")
    winners = {row["concept_slug"]: row for row in fetch_all(conn, "SELECT * FROM indicator_winner_judgments")}
    materials = fetch_all(
        conn,
        """
        SELECT rm.concept_slugs, rmb.title_zh, rmb.title_en, rmb.expert_zh, rmb.expert_en, rmb.material_type_zh, rmb.material_type_en
        FROM research_materials rm
        JOIN research_materials_bilingual rmb ON rmb.material_id = rm.id
        WHERE rm.material_type != 'source'
        """,
    )

    comparison_by_concept = defaultdict(list)
    for row in comparisons:
        comparison_by_concept[row["concept_slug"]].append(row)

    material_by_concept = defaultdict(list)
    for row in materials:
        for slug in split_semicolon(row["concept_slugs"]):
            material_by_concept[slug].append(row)

    output = []
    for concept in concepts:
        slug = concept["slug"]
        comp = comparison_by_concept.get(slug, [])
        winner = winners.get(slug, {})
        top_materials = material_by_concept.get(slug, [])[:6]
        all_experts_zh = "；".join(f"{row['name_zh']}（{row['relation_zh']}）" for row in comp)
        all_experts_en = "; ".join(f"{row['name_en']} ({row['relation_en']})" for row in comp)
        material_titles_zh = "；".join(f"{row['title_zh']} - {row['expert_zh']}" for row in top_materials)
        material_titles_en = "; ".join(f"{row['title_en']} - {row['expert_en']}" for row in top_materials)
        label_zh, label_en = FAMILY_LABELS.get(concept["family"], FAMILY_LABELS["uncategorized"])
        output.append(
            {
                "concept_slug": slug,
                "concept_zh": concept["name_zh"],
                "concept_en": concept["name_en"],
                "family": concept["family"],
                "family_zh": label_zh,
                "family_en": label_en,
                "expert_count": len(comp),
                "winner_zh": winner.get("winner_zh", ""),
                "winner_en": winner.get("winner_en", ""),
                "runner_up_zh": winner.get("runner_up_zh", ""),
                "runner_up_en": winner.get("runner_up_en", ""),
                "judgment_zh": winner.get("judgment_zh", ""),
                "judgment_en": winner.get("judgment_en", ""),
                "all_experts_zh": all_experts_zh,
                "all_experts_en": all_experts_en,
                "top_materials_zh": material_titles_zh,
                "top_materials_en": material_titles_en,
                "material_count": len(material_by_concept.get(slug, [])),
                "integrated_use_zh": f"{concept['name_zh']}屬於{label_zh}，優先研究{winner.get('winner_zh', '資料庫列出的核心專家')}，再用其他專家資料交叉驗證。",
                "integrated_use_en": f"{concept['name_en']} belongs to {label_en}; start with {winner.get('winner_en', 'the listed core expert')} and use other experts for cross-checking.",
            }
        )
    return output


def build_complete_sources(conn):
    rows = fetch_all(
        conn,
        """
        SELECT
            s.url,
            s.title,
            s.source_type,
            s.reliability,
            COUNT(DISTINCT es.expert_id) AS linked_expert_count,
            COUNT(DISTINCT rm.id) AS linked_material_count,
            GROUP_CONCAT(DISTINCT e.name_zh) AS experts_zh,
            GROUP_CONCAT(DISTINCT e.name_en) AS experts_en
        FROM sources s
        LEFT JOIN expert_sources es ON es.source_url = s.url
        LEFT JOIN experts e ON e.id = es.expert_id
        LEFT JOIN research_materials rm ON rm.source_url = s.url
        GROUP BY s.url
        ORDER BY linked_expert_count DESC, linked_material_count DESC, s.source_type, s.title
        """,
    )
    return rows


def build_family_synthesis(conn, indicator_profiles):
    by_family = defaultdict(list)
    for row in indicator_profiles:
        by_family[row["family"]].append(row)

    output = []
    for family, items in sorted(by_family.items()):
        label_zh, label_en = FAMILY_LABELS.get(family, FAMILY_LABELS["uncategorized"])
        synthesis = FAMILY_SYNTHESIS.get(
            family,
            (
                f"{label_zh}用於補充主要技術分析框架。",
                f"{label_en} complements the main technical-analysis framework.",
                "依指標性質搭配趨勢、動量、量價或風險資料使用。",
                "Use it with trend, momentum, volume, or risk evidence depending on context.",
                "避免孤立使用單一工具。",
                "Avoid using any single tool in isolation.",
            ),
        )
        winner_counter = Counter()
        for item in items:
            for name in (item["winner_zh"] or "").split("、"):
                if name:
                    winner_counter[name] += 1
        leading_experts_zh = "；".join(name for name, _ in winner_counter.most_common(6))
        leading_indicators_zh = "；".join(item["concept_zh"] for item in sorted(items, key=lambda value: (-value["expert_count"], value["concept_zh"]))[:8])
        leading_indicators_en = "; ".join(item["concept_en"] for item in sorted(items, key=lambda value: (-value["expert_count"], value["concept_en"]))[:8])
        output.append(
            {
                "family": family,
                "family_zh": label_zh,
                "family_en": label_en,
                "concept_count": len(items),
                "total_expert_links": sum(item["expert_count"] for item in items),
                "leading_experts_zh": leading_experts_zh,
                "leading_indicators_zh": leading_indicators_zh,
                "leading_indicators_en": leading_indicators_en,
                "core_question_zh": synthesis[0],
                "core_question_en": synthesis[1],
                "best_use_zh": synthesis[2],
                "best_use_en": synthesis[3],
                "caution_zh": synthesis[4],
                "caution_en": synthesis[5],
            }
        )
    return output


def replace_complete_tables(conn, expert_profiles, indicator_profiles, source_profiles, family_rows):
    conn.executescript(
        """
        DROP VIEW IF EXISTS complete_search_index;
        DROP VIEW IF EXISTS complete_indicator_winner_matrix;
        DROP VIEW IF EXISTS complete_family_leaders;
        DROP TABLE IF EXISTS complete_expert_profiles;
        DROP TABLE IF EXISTS complete_indicator_profiles;
        DROP TABLE IF EXISTS complete_source_profiles;
        DROP TABLE IF EXISTS method_family_synthesis;
        DROP TABLE IF EXISTS study_sequence;
        DROP TABLE IF EXISTS complete_database_summary;

        CREATE TABLE complete_expert_profiles (
            expert_id TEXT PRIMARY KEY,
            rank INTEGER,
            name_zh TEXT,
            name_en TEXT,
            country_region TEXT,
            years TEXT,
            role TEXT,
            category TEXT,
            category_zh TEXT,
            category_en TEXT,
            total_score INTEGER,
            concepts_zh TEXT,
            concepts_en TEXT,
            research_focus_zh TEXT,
            research_focus_en TEXT,
            representative_materials_zh TEXT,
            representative_materials_en TEXT,
            bilingual_research_summary_zh TEXT,
            bilingual_research_summary_en TEXT,
            material_count INTEGER,
            source_count INTEGER,
            high_evidence_count INTEGER,
            book_count INTEGER,
            paper_article_count INTEGER,
            evidence_profile_zh TEXT,
            evidence_profile_en TEXT,
            authority_tier_zh TEXT,
            authority_tier_en TEXT,
            winning_concepts_zh TEXT,
            winning_concepts_en TEXT,
            winning_concept_count INTEGER,
            winner_role_count INTEGER,
            strong_candidate_count INTEGER,
            important_complement_count INTEGER,
            best_use_case_zh TEXT,
            best_use_case_en TEXT,
            integrated_note_zh TEXT,
            integrated_note_en TEXT
        );

        CREATE TABLE complete_indicator_profiles (
            concept_slug TEXT PRIMARY KEY,
            concept_zh TEXT,
            concept_en TEXT,
            family TEXT,
            family_zh TEXT,
            family_en TEXT,
            expert_count INTEGER,
            winner_zh TEXT,
            winner_en TEXT,
            runner_up_zh TEXT,
            runner_up_en TEXT,
            judgment_zh TEXT,
            judgment_en TEXT,
            all_experts_zh TEXT,
            all_experts_en TEXT,
            top_materials_zh TEXT,
            top_materials_en TEXT,
            material_count INTEGER,
            integrated_use_zh TEXT,
            integrated_use_en TEXT
        );

        CREATE TABLE complete_source_profiles (
            url TEXT PRIMARY KEY,
            title TEXT,
            source_type TEXT,
            reliability TEXT,
            linked_expert_count INTEGER,
            linked_material_count INTEGER,
            experts_zh TEXT,
            experts_en TEXT
        );

        CREATE TABLE method_family_synthesis (
            family TEXT PRIMARY KEY,
            family_zh TEXT,
            family_en TEXT,
            concept_count INTEGER,
            total_expert_links INTEGER,
            leading_experts_zh TEXT,
            leading_indicators_zh TEXT,
            leading_indicators_en TEXT,
            core_question_zh TEXT,
            core_question_en TEXT,
            best_use_zh TEXT,
            best_use_en TEXT,
            caution_zh TEXT,
            caution_en TEXT
        );

        CREATE TABLE study_sequence (
            step INTEGER PRIMARY KEY,
            stage_en TEXT,
            stage_zh TEXT,
            core_methods TEXT,
            core_experts TEXT,
            purpose_zh TEXT,
            purpose_en TEXT
        );

        CREATE TABLE complete_database_summary (
            key TEXT PRIMARY KEY,
            value TEXT
        );
        """
    )

    def insert_many(table, rows):
        if not rows:
            return
        columns = list(rows[0].keys())
        placeholders = ", ".join(":" + col for col in columns)
        conn.executemany(
            f"INSERT INTO {table} ({', '.join(columns)}) VALUES ({placeholders})",
            rows,
        )

    insert_many("complete_expert_profiles", expert_profiles)
    insert_many("complete_indicator_profiles", indicator_profiles)
    insert_many("complete_source_profiles", source_profiles)
    insert_many("method_family_synthesis", family_rows)
    conn.executemany(
        """
        INSERT INTO study_sequence(step, stage_en, stage_zh, core_methods, core_experts, purpose_zh, purpose_en)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        STUDY_SEQUENCE,
    )
    summary = {
        "database_name": "technical_analysis_complete",
        "created_on": "2026-06-21",
        "expert_count": str(len(expert_profiles)),
        "indicator_count": str(len(indicator_profiles)),
        "source_count": str(len(source_profiles)),
        "family_count": str(len(family_rows)),
        "research_material_count": str(conn.execute("SELECT COUNT(*) FROM research_materials_bilingual").fetchone()[0]),
        "comparison_count": str(conn.execute("SELECT COUNT(*) FROM indicator_expert_comparisons").fetchone()[0]),
        "purpose_zh": "融合技術分析專家、指標、研究材料、來源、雙語摘要與優勝判斷的完整本地資料庫。",
        "purpose_en": "A complete local database fusing technical-analysis experts, indicators, research materials, sources, bilingual digests, and winner judgments.",
    }
    conn.executemany("INSERT INTO complete_database_summary(key, value) VALUES (?, ?)", summary.items())
    conn.executescript(
        """
        CREATE VIEW complete_indicator_winner_matrix AS
        SELECT
            concept_slug,
            concept_zh,
            concept_en,
            family_zh,
            family_en,
            winner_zh,
            winner_en,
            runner_up_zh,
            runner_up_en,
            judgment_zh,
            judgment_en,
            expert_count,
            material_count
        FROM complete_indicator_profiles
        ORDER BY family, concept_zh;

        CREATE VIEW complete_family_leaders AS
        SELECT
            family_zh,
            family_en,
            concept_count,
            total_expert_links,
            leading_experts_zh,
            leading_indicators_zh,
            core_question_zh,
            best_use_zh,
            caution_zh
        FROM method_family_synthesis
        ORDER BY total_expert_links DESC, concept_count DESC;

        CREATE VIEW complete_search_index AS
        SELECT
            'expert' AS record_type,
            expert_id AS record_id,
            name_zh || ' / ' || name_en AS title,
            bilingual_research_summary_zh || ' ' || bilingual_research_summary_en AS body
        FROM complete_expert_profiles
        UNION ALL
        SELECT
            'indicator' AS record_type,
            concept_slug AS record_id,
            concept_zh || ' / ' || concept_en AS title,
            integrated_use_zh || ' ' || integrated_use_en || ' ' || all_experts_zh || ' ' || all_experts_en AS body
        FROM complete_indicator_profiles
        UNION ALL
        SELECT
            'family' AS record_type,
            family AS record_id,
            family_zh || ' / ' || family_en AS title,
            core_question_zh || ' ' || best_use_zh || ' ' || caution_zh || ' ' || core_question_en || ' ' || best_use_en AS body
        FROM method_family_synthesis
        UNION ALL
        SELECT
            'source' AS record_type,
            url AS record_id,
            title AS title,
            coalesce(experts_zh, '') || ' ' || coalesce(experts_en, '') AS body
        FROM complete_source_profiles;
        """
    )
    conn.commit()


def write_index(expert_profiles, indicator_profiles, family_rows, source_profiles):
    top_experts = sorted(expert_profiles, key=lambda row: (-row["winning_concept_count"], row["rank"]))[:20]
    top_indicators = sorted(indicator_profiles, key=lambda row: (-row["expert_count"], row["concept_zh"]))[:30]
    lines = [
        "# 技術分析完整資料庫總索引",
        "",
        "這是融合後的最終本地資料庫，整合人物、指標、研究材料、來源、雙語歸納、同指標對照與優勝判斷。",
        "",
        "## 主要檔案",
        "",
        "- `technical_analysis_complete.sqlite`：最終完整 SQLite 資料庫。",
        "- `technical_analysis_complete_expert_profiles.csv`：完整人物總表。",
        "- `technical_analysis_complete_indicator_profiles.csv`：完整指標/方法總表。",
        "- `technical_analysis_complete_method_families.csv`：方法家族融會貫通表。",
        "",
        "## 核心資料表",
        "",
        "- `complete_expert_profiles`：100 位專家完整雙語研究檔案。",
        "- `complete_indicator_profiles`：72 個指標/方法完整檔案，含優勝專家與對照者。",
        "- `complete_source_profiles`：來源檔案，含連結到的人物與材料數。",
        "- `method_family_synthesis`：按方法家族整理的用途、注意事項與核心專家。",
        "- `study_sequence`：建議研究順序。",
        "- `complete_search_index`：跨人物、指標、方法家族、來源的搜尋索引視圖。",
        "",
        "## 數量摘要",
        "",
        f"- 專家：{len(expert_profiles)}",
        f"- 指標/方法：{len(indicator_profiles)}",
        f"- 方法家族：{len(family_rows)}",
        f"- 來源：{len(source_profiles)}",
        "",
        "## 優先研究專家 Top 20",
        "",
        "| # | 專家 | 權威層級 | 優勝指標數 | 優勝指標 |",
        "|---:|---|---|---:|---|",
    ]
    for row in top_experts:
        lines.append(
            f"| {row['rank']} | {row['name_zh']} / {row['name_en']} | {row['authority_tier_zh']} / {row['authority_tier_en']} | {row['winning_concept_count']} | {row['winning_concepts_zh']} |"
        )
    lines.extend(["", "## 多專家共同研究指標 Top 30", "", "| 指標/方法 | 家族 | 專家數 | 優勝 | 判斷 |", "|---|---|---:|---|---|"])
    for row in top_indicators:
        lines.append(
            f"| {row['concept_zh']} / {row['concept_en']} | {row['family_zh']} / {row['family_en']} | {row['expert_count']} | {row['winner_zh']} / {row['winner_en']} | {row['judgment_zh']} |"
        )
    lines.extend(["", "## 方法家族", "", "| 家族 | 指標數 | 核心問題 | 最佳用途 | 注意事項 |", "|---|---:|---|---|---|"])
    for row in sorted(family_rows, key=lambda value: (-value["total_expert_links"], value["family_zh"])):
        lines.append(
            f"| {row['family_zh']} / {row['family_en']} | {row['concept_count']} | {row['core_question_zh']} | {row['best_use_zh']} | {row['caution_zh']} |"
        )
    COMPLETE_INDEX_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main():
    configure_stdout()
    ensure_ready()
    copy_database()
    conn = connect()
    expert_profiles = build_complete_experts(conn)
    indicator_profiles = build_complete_indicators(conn)
    source_profiles = build_complete_sources(conn)
    family_rows = build_family_synthesis(conn, indicator_profiles)
    replace_complete_tables(conn, expert_profiles, indicator_profiles, source_profiles, family_rows)
    conn.close()
    write_csv(COMPLETE_EXPERTS_CSV, expert_profiles)
    write_csv(COMPLETE_INDICATORS_CSV, indicator_profiles)
    write_csv(COMPLETE_FAMILIES_CSV, family_rows)
    write_index(expert_profiles, indicator_profiles, family_rows, source_profiles)
    print(f"complete_db={COMPLETE_DB}")
    print(f"experts={len(expert_profiles)}")
    print(f"indicators={len(indicator_profiles)}")
    print(f"sources={len(source_profiles)}")
    print(f"families={len(family_rows)}")
    print(f"index={COMPLETE_INDEX_MD}")


if __name__ == "__main__":
    main()
