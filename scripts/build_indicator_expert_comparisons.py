# -*- coding: utf-8 -*-
"""Compare experts who share the same indicator/method and judge a winner."""

from __future__ import annotations

import csv
import sqlite3
import sys
from pathlib import Path

from build_bilingual_research_digest import RELATION_TRANSLATIONS


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
DB_PATH = DATA_DIR / "technical_analysis_experts.sqlite"

COMPARISON_CSV_PATH = DATA_DIR / "technical_analysis_indicator_expert_comparisons.csv"
WINNERS_CSV_PATH = DATA_DIR / "technical_analysis_indicator_winners.csv"
REPORT_MD_PATH = DATA_DIR / "technical_analysis_indicator_winners_report.md"


RELATION_WEIGHTS = {
    "創始者": 46,
    "奠基者": 45,
    "共同創始者": 43,
    "創始/推廣者": 42,
    "西方推廣者": 40,
    "趨勢跟隨先驅": 40,
    "主要詮釋者": 37,
    "系統化整理者": 37,
    "經典教材作者": 36,
    "經典教材共同作者": 36,
    "經典作者": 35,
    "早期系統化作者": 35,
    "現代改編者": 35,
    "現代推廣者": 34,
    "推廣者/作者": 34,
    "長期推廣者": 34,
    "推廣/定義者": 34,
    "百科作者": 34,
    "教材作者": 33,
    "研究者": 33,
    "統計研究者": 33,
    "學術研究": 33,
    "Dow Award 研究": 33,
    "Dow Award 得主": 33,
    "進階詮釋者": 32,
    "代表作者": 32,
    "指標與教材作者": 32,
    "實證檢驗": 32,
    "代表性實踐者": 31,
    "交易系統": 31,
    "系統交易作者": 31,
    "交易系統作者": 31,
    "策略測試": 30,
    "系統測試": 30,
    "樣本外驗證": 30,
    "策略驗證": 30,
    "教育者": 29,
    "量化市場研究": 29,
    "量化規則": 29,
    "統計分析": 29,
    "統計推論": 29,
    "歷史統計": 29,
    "資料探勘校正": 29,
    "量價研究": 29,
    "機構技術研究": 28,
    "短線改良": 28,
    "P&F 結合指標": 27,
    "市場指標": 27,
    "市場寬度": 27,
    "量價分析": 27,
    "型態統計": 27,
    "趨勢判讀": 26,
    "趨勢確認": 26,
    "型態分析": 26,
    "市場心理": 26,
    "市場時機": 26,
    "強勢股": 26,
    "短線交易": 26,
    "短線策略": 26,
    "價格行為": 26,
}


CATEGORY_WEIGHTS = {
    "indicator_creator": 12,
    "foundation": 10,
    "author_researcher": 9,
    "academic": 9,
    "academic_practitioner": 9,
    "researcher_author": 8,
    "researcher": 8,
    "author": 7,
    "system_developer": 7,
    "indicator_specialist": 7,
    "educator": 6,
    "charting_specialist": 6,
    "author_practitioner": 6,
    "practitioner_author": 6,
    "practitioner": 5,
}


MANUAL_WINNERS = {
    "atr": ["j-welles-wilder-jr"],
    "backtesting": ["david-aronson"],
    "bollinger-bands": ["john-bollinger"],
    "breadth": ["ned-davis"],
    "candlestick": ["steve-nison"],
    "chart-patterns": ["thomas-n-bulkowski"],
    "cycle-analysis": ["john-f-ehlers"],
    "dow-theory": ["charles-h-dow"],
    "evidence-based-ta": ["david-aronson"],
    "elliott-wave": ["ralph-nelson-elliott"],
    "fibonacci": ["joe-dinapoli"],
    "macd": ["gerald-appel"],
    "market-profile": ["j-peter-steidlmayer"],
    "mcclellan-oscillator": ["sherman-mcclellan", "marian-mcclellan"],
    "mfi": ["gene-quong", "avrum-soudack"],
    "momentum": ["tushar-s-chande"],
    "moving-average": ["perry-j-kaufman"],
    "opening-range-breakout": ["toby-crabel"],
    "point-and-figure": ["a-w-cohen"],
    "price-action": ["richard-d-wyckoff"],
    "relative-strength": ["william-j-o-neil"],
    "rsi": ["j-welles-wilder-jr"],
    "sentiment": ["jason-goepfert"],
    "stochastic-rsi": ["tushar-s-chande"],
    "support-resistance": ["robert-d-edwards", "john-magee"],
    "systems-trading": ["perry-j-kaufman"],
    "tape-reading": ["jesse-livermore"],
    "trend-following": ["richard-donchian"],
    "ulcer-index": ["peter-g-martin", "byron-mccann"],
    "vidya": ["tushar-s-chande"],
    "volatility": ["john-bollinger"],
    "volume-analysis": ["richard-d-wyckoff"],
    "vortex-indicator": ["etienne-botes", "douglas-siepman"],
    "wyckoff-method": ["richard-d-wyckoff"],
}


def configure_stdout():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")


def relation_en(relation):
    return RELATION_TRANSLATIONS.get(relation, relation)


def relation_weight(relation):
    if relation in RELATION_WEIGHTS:
        return RELATION_WEIGHTS[relation]
    if "創始" in relation:
        return 42
    if "推廣" in relation or "教材" in relation or "作者" in relation:
        return 32
    if "研究" in relation or "統計" in relation or "驗證" in relation:
        return 31
    if "系統" in relation:
        return 30
    if "專家" in relation:
        return 29
    return 24


def verdict_label(score, is_winner, tied):
    if is_winner and tied:
        return "並列優勝", "Joint winner"
    if is_winner:
        return "優勝", "Winner"
    if score >= 78:
        return "強力候選", "Strong candidate"
    if score >= 68:
        return "重要補充", "Important complement"
    return "參考角色", "Reference role"


def get_rows():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    rows = [
        dict(row)
        for row in conn.execute(
            """
            SELECT
                c.slug AS concept_slug,
                c.name_zh AS concept_zh,
                c.name_en AS concept_en,
                c.family AS concept_family,
                ec.relation AS relation_zh,
                e.id AS expert_id,
                e.rank AS expert_rank,
                e.name_zh,
                e.name_en,
                e.category,
                e.total_score AS expert_total_score,
                d.category_zh,
                d.category_en,
                d.research_focus_zh,
                d.research_focus_en,
                d.representative_materials_zh,
                d.representative_materials_en,
                d.material_count,
                d.source_count,
                d.high_evidence_count,
                d.book_count,
                d.paper_article_count,
                d.evidence_profile_zh,
                d.evidence_profile_en
            FROM concepts c
            JOIN expert_concepts ec ON ec.concept_slug = c.slug
            JOIN experts e ON e.id = ec.expert_id
            JOIN expert_research_digest_bilingual d ON d.expert_id = e.id
            ORDER BY c.slug, e.rank
            """
        )
    ]
    conn.close()
    return rows


def score_row(row, concept_expert_count):
    origin = relation_weight(row["relation_zh"])
    authority = float(row["expert_total_score"] or 0) * 1.05
    evidence = min(14, (row["material_count"] or 0) * 1.6 + (row["source_count"] or 0) * 1.2 + (row["high_evidence_count"] or 0) * 1.1)
    category = CATEGORY_WEIGHTS.get(row["category"], 5)
    specificity = 0
    if row["relation_zh"] in {"創始者", "共同創始者", "奠基者"}:
        specificity += 8
    if concept_expert_count <= 2:
        specificity += 3
    if row["category"] in {"indicator_creator", "indicator_specialist", "foundation"}:
        specificity += 3
    return round(origin + authority + evidence + category + specificity, 2)


def make_strengths(row, is_winner):
    relation = row["relation_zh"]
    strengths = []
    strengths_en = []
    if "創始" in relation or relation == "奠基者":
        strengths.append("最接近原始定義，適合作為該指標/方法的基準版本")
        strengths_en.append("closest to the original definition and best used as the benchmark version")
    if row["book_count"]:
        strengths.append("有代表性書籍或教材可追溯")
        strengths_en.append("supported by traceable books or textbook material")
    if row["paper_article_count"]:
        strengths.append("有論文或研究文章支撐")
        strengths_en.append("supported by papers or research articles")
    if row["high_evidence_count"]:
        strengths.append("高證據等級來源較多")
        strengths_en.append("has multiple high-evidence sources")
    if is_winner:
        strengths.append("在原創性、資料覆蓋與專屬性綜合評分最高")
        strengths_en.append("highest combined score for originality, evidence coverage, and indicator specificity")
    if not strengths:
        strengths.append("可作為該指標/方法的輔助觀點")
        strengths_en.append("useful as a complementary view on the indicator/method")
    return "；".join(strengths), "; ".join(strengths_en)


def make_limitations(row, is_winner):
    relation = row["relation_zh"]
    limitations = []
    limitations_en = []
    if "創始" in relation or relation == "奠基者":
        limitations.append("原始版本仍需結合後續實證與現代市場條件")
        limitations_en.append("the original version should still be checked against later evidence and modern markets")
    elif "教材" in relation or "作者" in relation or "推廣" in relation:
        limitations.append("偏整理或推廣，原創性通常低於指標創作者")
        limitations_en.append("more synthetic/promotional, usually less original than the indicator creator")
    elif "實踐" in relation or "交易" in relation:
        limitations.append("實戰價值高，但公開可驗證研究材料可能較少")
        limitations_en.append("strong practical value, but fewer publicly verifiable research records")
    else:
        limitations.append("適合搭配優勝者資料交叉驗證")
        limitations_en.append("best used for cross-checking against the winning authority")
    if is_winner:
        limitations.append("優勝判斷是以本資料庫目前來源與評分規則為基準")
        limitations_en.append("winner judgment is based on the current database sources and scoring rules")
    return "；".join(limitations), "; ".join(limitations_en)


def group_by_concept(rows):
    groups = {}
    for row in rows:
        groups.setdefault(row["concept_slug"], []).append(row)
    return groups


def winner_ids_for_group(slug, ranked_rows):
    if slug in MANUAL_WINNERS:
        return [winner for winner in MANUAL_WINNERS[slug] if any(row["expert_id"] == winner for row in ranked_rows)]
    top_score = ranked_rows[0]["comparison_score"]
    return [row["expert_id"] for row in ranked_rows if top_score - row["comparison_score"] <= 1.0]


def make_comparisons(rows):
    groups = group_by_concept(rows)
    comparison_rows = []
    winner_rows = []

    for slug, group in sorted(groups.items()):
        expert_count = len(group)
        scored = []
        for row in group:
            item = dict(row)
            item["relation_en"] = relation_en(item["relation_zh"])
            item["comparison_score"] = score_row(item, expert_count)
            if item["concept_slug"] in MANUAL_WINNERS and item["expert_id"] in MANUAL_WINNERS[item["concept_slug"]]:
                item["comparison_score"] = round(item["comparison_score"] + 12, 2)
            scored.append(item)
        scored.sort(key=lambda item: (-item["comparison_score"], item["expert_rank"]))

        winners = winner_ids_for_group(slug, scored)
        if winners:
            winner_set = set(winners)
            scored.sort(key=lambda item: (0 if item["expert_id"] in winner_set else 1, -item["comparison_score"], item["expert_rank"]))
        else:
            winner_set = {scored[0]["expert_id"]}
            winners = [scored[0]["expert_id"]]
        tied = len(winner_set) > 1

        for idx, item in enumerate(scored, start=1):
            is_winner = item["expert_id"] in winner_set
            label_zh, label_en = verdict_label(item["comparison_score"], is_winner, tied)
            strengths_zh, strengths_en = make_strengths(item, is_winner)
            limitations_zh, limitations_en = make_limitations(item, is_winner)
            difference_zh = (
                f"{item['name_zh']}的角色是「{item['relation_zh']}」，"
                f"重點在{item['research_focus_zh']}。"
            )
            difference_en = (
                f"{item['name_en']} is classified here as {item['relation_en']}; "
                f"the focus is {item['research_focus_en']}."
            )
            comparison_rows.append(
                {
                    "concept_slug": item["concept_slug"],
                    "concept_zh": item["concept_zh"],
                    "concept_en": item["concept_en"],
                    "concept_family": item["concept_family"],
                    "expert_count_for_concept": expert_count,
                    "comparison_rank": idx,
                    "verdict_zh": label_zh,
                    "verdict_en": label_en,
                    "expert_id": item["expert_id"],
                    "expert_rank_global": item["expert_rank"],
                    "name_zh": item["name_zh"],
                    "name_en": item["name_en"],
                    "relation_zh": item["relation_zh"],
                    "relation_en": item["relation_en"],
                    "category": item["category"],
                    "category_zh": item["category_zh"],
                    "category_en": item["category_en"],
                    "comparison_score": item["comparison_score"],
                    "expert_total_score": item["expert_total_score"],
                    "material_count": item["material_count"],
                    "source_count": item["source_count"],
                    "high_evidence_count": item["high_evidence_count"],
                    "book_count": item["book_count"],
                    "paper_article_count": item["paper_article_count"],
                    "strengths_zh": strengths_zh,
                    "strengths_en": strengths_en,
                    "limitations_zh": limitations_zh,
                    "limitations_en": limitations_en,
                    "difference_zh": difference_zh,
                    "difference_en": difference_en,
                    "representative_materials_zh": item["representative_materials_zh"],
                    "representative_materials_en": item["representative_materials_en"],
                    "evidence_profile_zh": item["evidence_profile_zh"],
                    "evidence_profile_en": item["evidence_profile_en"],
                }
            )

        winner_items = [item for item in scored if item["expert_id"] in winner_set]
        runner_items = [item for item in scored if item["expert_id"] not in winner_set][:2]
        winner_names_zh = "、".join(item["name_zh"] for item in winner_items)
        winner_names_en = " / ".join(item["name_en"] for item in winner_items)
        runner_names_zh = "、".join(item["name_zh"] for item in runner_items)
        runner_names_en = " / ".join(item["name_en"] for item in runner_items)
        if expert_count == 1:
            judgment_zh = f"{winner_names_zh}是目前資料庫中唯一對應「{scored[0]['concept_zh']}」的核心專家。"
            judgment_en = f"{winner_names_en} is the only expert currently mapped to {scored[0]['concept_en']} in this database."
        elif tied:
            judgment_zh = f"{winner_names_zh}並列優勝；此指標/方法屬共同創作或共同權威，應並讀其資料。"
            judgment_en = f"{winner_names_en} are joint winners; this indicator/method is best treated as a shared authority."
        else:
            runner_text_zh = f"；主要對照者為{runner_names_zh}" if runner_names_zh else ""
            runner_text_en = f"; main comparison: {runner_names_en}" if runner_names_en else ""
            judgment_zh = f"{winner_names_zh}優勝，因其在原創性、專屬性與資料覆蓋上最強{runner_text_zh}。"
            judgment_en = f"{winner_names_en} wins because of the strongest mix of originality, specificity, and evidence coverage{runner_text_en}."

        winner_rows.append(
            {
                "concept_slug": scored[0]["concept_slug"],
                "concept_zh": scored[0]["concept_zh"],
                "concept_en": scored[0]["concept_en"],
                "concept_family": scored[0]["concept_family"],
                "expert_count": expert_count,
                "has_common_research": "yes" if expert_count > 1 else "no",
                "winner_expert_ids": ";".join(item["expert_id"] for item in winner_items),
                "winner_zh": winner_names_zh,
                "winner_en": winner_names_en,
                "winner_score": max(item["comparison_score"] for item in winner_items),
                "runner_up_zh": runner_names_zh,
                "runner_up_en": runner_names_en,
                "judgment_zh": judgment_zh,
                "judgment_en": judgment_en,
                "basis_zh": "評分依據：原創/共同創作權重、專家總分、材料數、來源數、高證據來源、類別專屬性；必要時對明確共同創作者採並列優勝。",
                "basis_en": "Basis: originality/co-creation weight, expert total score, material count, source count, high-evidence sources, and category specificity; clear co-creators may be judged as joint winners.",
                "caveat_zh": "此為本地資料庫目前證據下的優先研究判斷，不等於投資建議或永久排名。",
                "caveat_en": "This is a priority-for-study judgment under the current local evidence base, not investment advice or a permanent ranking.",
            }
        )

    return comparison_rows, winner_rows


def write_csv(path, rows):
    if not rows:
        return
    with path.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)


def replace_sqlite_tables(comparison_rows, winner_rows):
    conn = sqlite3.connect(DB_PATH)
    conn.execute("PRAGMA foreign_keys = ON")
    conn.executescript(
        """
        DROP VIEW IF EXISTS common_indicator_winners;
        DROP TABLE IF EXISTS indicator_expert_comparisons;
        DROP TABLE IF EXISTS indicator_winner_judgments;

        CREATE TABLE indicator_expert_comparisons (
            concept_slug TEXT,
            concept_zh TEXT,
            concept_en TEXT,
            concept_family TEXT,
            expert_count_for_concept INTEGER,
            comparison_rank INTEGER,
            verdict_zh TEXT,
            verdict_en TEXT,
            expert_id TEXT REFERENCES experts(id) ON DELETE CASCADE,
            expert_rank_global INTEGER,
            name_zh TEXT,
            name_en TEXT,
            relation_zh TEXT,
            relation_en TEXT,
            category TEXT,
            category_zh TEXT,
            category_en TEXT,
            comparison_score REAL,
            expert_total_score INTEGER,
            material_count INTEGER,
            source_count INTEGER,
            high_evidence_count INTEGER,
            book_count INTEGER,
            paper_article_count INTEGER,
            strengths_zh TEXT,
            strengths_en TEXT,
            limitations_zh TEXT,
            limitations_en TEXT,
            difference_zh TEXT,
            difference_en TEXT,
            representative_materials_zh TEXT,
            representative_materials_en TEXT,
            evidence_profile_zh TEXT,
            evidence_profile_en TEXT,
            PRIMARY KEY (concept_slug, expert_id)
        );

        CREATE TABLE indicator_winner_judgments (
            concept_slug TEXT PRIMARY KEY,
            concept_zh TEXT,
            concept_en TEXT,
            concept_family TEXT,
            expert_count INTEGER,
            has_common_research TEXT,
            winner_expert_ids TEXT,
            winner_zh TEXT,
            winner_en TEXT,
            winner_score REAL,
            runner_up_zh TEXT,
            runner_up_en TEXT,
            judgment_zh TEXT,
            judgment_en TEXT,
            basis_zh TEXT,
            basis_en TEXT,
            caveat_zh TEXT,
            caveat_en TEXT
        );
        """
    )
    conn.executemany(
        """
        INSERT INTO indicator_expert_comparisons (
            concept_slug, concept_zh, concept_en, concept_family, expert_count_for_concept,
            comparison_rank, verdict_zh, verdict_en, expert_id, expert_rank_global,
            name_zh, name_en, relation_zh, relation_en, category, category_zh, category_en,
            comparison_score, expert_total_score, material_count, source_count, high_evidence_count,
            book_count, paper_article_count, strengths_zh, strengths_en, limitations_zh,
            limitations_en, difference_zh, difference_en, representative_materials_zh,
            representative_materials_en, evidence_profile_zh, evidence_profile_en
        )
        VALUES (
            :concept_slug, :concept_zh, :concept_en, :concept_family, :expert_count_for_concept,
            :comparison_rank, :verdict_zh, :verdict_en, :expert_id, :expert_rank_global,
            :name_zh, :name_en, :relation_zh, :relation_en, :category, :category_zh, :category_en,
            :comparison_score, :expert_total_score, :material_count, :source_count, :high_evidence_count,
            :book_count, :paper_article_count, :strengths_zh, :strengths_en, :limitations_zh,
            :limitations_en, :difference_zh, :difference_en, :representative_materials_zh,
            :representative_materials_en, :evidence_profile_zh, :evidence_profile_en
        )
        """,
        comparison_rows,
    )
    conn.executemany(
        """
        INSERT INTO indicator_winner_judgments (
            concept_slug, concept_zh, concept_en, concept_family, expert_count,
            has_common_research, winner_expert_ids, winner_zh, winner_en, winner_score,
            runner_up_zh, runner_up_en, judgment_zh, judgment_en, basis_zh, basis_en,
            caveat_zh, caveat_en
        )
        VALUES (
            :concept_slug, :concept_zh, :concept_en, :concept_family, :expert_count,
            :has_common_research, :winner_expert_ids, :winner_zh, :winner_en, :winner_score,
            :runner_up_zh, :runner_up_en, :judgment_zh, :judgment_en, :basis_zh, :basis_en,
            :caveat_zh, :caveat_en
        )
        """,
        winner_rows,
    )
    conn.executescript(
        """
        CREATE VIEW common_indicator_winners AS
        SELECT *
        FROM indicator_winner_judgments
        WHERE has_common_research = 'yes'
        ORDER BY expert_count DESC, concept_slug;
        """
    )
    conn.commit()
    conn.close()


def write_markdown(winner_rows, comparison_rows):
    by_concept = {}
    for row in comparison_rows:
        by_concept.setdefault(row["concept_slug"], []).append(row)

    common = [row for row in winner_rows if row["has_common_research"] == "yes"]
    single = [row for row in winner_rows if row["has_common_research"] == "no"]

    lines = [
        "# 技術指標專家對照與優勝判斷",
        "",
        "本報告由 `scripts/build_indicator_expert_comparisons.py` 產生。優勝代表在本地資料庫目前證據下，該指標/方法最值得優先研究的核心權威。",
        "",
        "## 評分原則",
        "",
        "- 原創或共同創作權重最高。",
        "- 其次看專家總分、研究材料數、不同來源數、高證據來源、類別專屬性。",
        "- 對明確共同創作者採並列優勝，例如 MFI、McClellan Oscillator、Vortex、Ulcer Index。",
        "",
        f"共同研究/多人對照指標：{len(common)} 個；單一專家指標：{len(single)} 個。",
        "",
        "## 共同指標優勝總表",
        "",
        "| 指標/方法 | 專家數 | 優勝 | 主要對照者 | 判斷 |",
        "|---|---:|---|---|---|",
    ]
    for row in common:
        lines.append(
            f"| {row['concept_zh']} / {row['concept_en']} | {row['expert_count']} | {row['winner_zh']} / {row['winner_en']} | {row['runner_up_zh']} / {row['runner_up_en']} | {row['judgment_zh']} |"
        )

    lines.extend(["", "## 詳細對照", ""])
    for row in common:
        lines.extend(
            [
                f"### {row['concept_zh']} / {row['concept_en']}",
                "",
                f"優勝判斷：{row['judgment_zh']}",
                "",
                "| 排名 | 專家 | 角色 | 分數 | 優勢 | 限制 |",
                "|---:|---|---|---:|---|---|",
            ]
        )
        for item in sorted(by_concept[row["concept_slug"]], key=lambda value: value["comparison_rank"]):
            lines.append(
                f"| {item['comparison_rank']} | {item['name_zh']} / {item['name_en']} | {item['relation_zh']} / {item['relation_en']} | {item['comparison_score']} | {item['strengths_zh']} | {item['limitations_zh']} |"
            )
        lines.append("")

    lines.extend(["## 單一專家指標", ""])
    lines.append("| 指標/方法 | 唯一權威 | 判斷 |")
    lines.append("|---|---|---|")
    for row in single:
        lines.append(f"| {row['concept_zh']} / {row['concept_en']} | {row['winner_zh']} / {row['winner_en']} | {row['judgment_zh']} |")

    REPORT_MD_PATH.write_text("\n".join(lines), encoding="utf-8")


def main():
    configure_stdout()
    rows = get_rows()
    comparison_rows, winner_rows = make_comparisons(rows)
    write_csv(COMPARISON_CSV_PATH, comparison_rows)
    write_csv(WINNERS_CSV_PATH, winner_rows)
    replace_sqlite_tables(comparison_rows, winner_rows)
    write_markdown(winner_rows, comparison_rows)
    print(f"comparison_rows={len(comparison_rows)}")
    print(f"winner_rows={len(winner_rows)}")
    print(f"multi_expert_winners={sum(1 for row in winner_rows if row['has_common_research'] == 'yes')}")
    print(f"comparison_csv={COMPARISON_CSV_PATH}")
    print(f"winners_csv={WINNERS_CSV_PATH}")
    print(f"report={REPORT_MD_PATH}")


if __name__ == "__main__":
    main()
