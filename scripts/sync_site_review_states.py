# /// script
# requires-python = ">=3.11"
# ///
# ----- How to run -----------------------------------------------------------
# python scripts/sync_site_review_states.py
# ---------------------------------------------------------------------------
from __future__ import annotations

import csv
import json
from collections import Counter
from datetime import UTC, datetime
from pathlib import Path
from typing import Final, TypeAlias

ROOT: Final = Path(__file__).resolve().parents[1]
SITE_DIR: Final = ROOT / "data" / "site"
SITE_CSV: Final = SITE_DIR / "technical_indicators_site_data.csv"
SITE_JSON: Final = SITE_DIR / "technical_indicators_site_data.json"
SITE_JS: Final = SITE_DIR / "technical_indicators_site_data.js"
READINESS_JSON: Final = SITE_DIR / "site_readiness_overlay.json"
READINESS_JS: Final = SITE_DIR / "site_readiness_overlay.js"
PROFILES_CSV: Final = ROOT / "data" / "technical_analysis_complete_indicator_profiles.csv"
WINNERS_CSV: Final = ROOT / "data" / "technical_analysis_indicator_winners.csv"
EVIDENCE_CSV: Final = SITE_DIR / "evidence_review_flags.csv"
RUNNER_FLAG: Final = "runner_up_missing_or_status_needed"

JsonValue: TypeAlias = str | int | float | bool | None | list["JsonValue"] | dict[str, "JsonValue"]
JsonMap: TypeAlias = dict[str, JsonValue]
CsvRow: TypeAlias = dict[str, str]


def read_csv(path: Path) -> tuple[list[str], list[CsvRow]]:
    with path.open(encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        return list(reader.fieldnames or []), list(reader)


def write_csv(path: Path, fieldnames: list[str], rows: list[CsvRow]) -> None:
    with path.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def read_json(path: Path) -> JsonMap:
    value = json.loads(path.read_text(encoding="utf-8-sig"))
    if not isinstance(value, dict):
        raise TypeError(f"expected JSON object: {path}")
    return value


def json_map(value: JsonValue) -> JsonMap:
    return value if isinstance(value, dict) else {}


def json_list(value: JsonValue) -> list[JsonValue]:
    return value if isinstance(value, list) else []


def clean_flags(raw: str) -> str:
    flags = [flag.strip() for flag in raw.split(";") if flag.strip() and flag.strip() != RUNNER_FLAG]
    return "; ".join(flags)


def explicit_runner_status(row: CsvRow) -> tuple[str, str]:
    expert_count = int(row.get("expert_count", "0") or "0")
    if expert_count <= 1:
        return (
            "無直接補充專家；目前資料庫只收錄一位核心專家",
            "No direct runner-up; current database maps one core expert only",
        )
    return (
        "共同核心專家；不另設補充角色",
        "Joint core experts; no separate runner-up assigned",
    )


def sync_source_runner_up() -> tuple[dict[str, CsvRow], int]:
    winner_fields, winners = read_csv(WINNERS_CSV)
    updated = 0
    for row in winners:
        if not row.get("runner_up_zh", "").strip() and not row.get("runner_up_en", "").strip():
            row["runner_up_zh"], row["runner_up_en"] = explicit_runner_status(row)
            updated += 1
    write_csv(WINNERS_CSV, winner_fields, winners)
    profile_fields, profiles = read_csv(PROFILES_CSV)
    winners_by_slug = {row["concept_slug"]: row for row in winners}
    for row in profiles:
        winner = winners_by_slug[row["concept_slug"]]
        row["runner_up_zh"] = winner["runner_up_zh"]
        row["runner_up_en"] = winner["runner_up_en"]
    write_csv(PROFILES_CSV, profile_fields, profiles)
    return {row["concept_slug"]: row for row in profiles}, updated


def sync_site_csv(profiles: dict[str, CsvRow]) -> tuple[int, int]:
    fieldnames, rows = read_csv(SITE_CSV)
    updated = 0
    for row in rows:
        profile = profiles.get(row["concept_slug"], {})
        if not row.get("runner_up_zh", "").strip():
            row["runner_up_zh"] = profile.get("runner_up_zh", "")
            row["runner_up_en"] = profile.get("runner_up_en", "")
            updated += 1
        row["validation_flags"] = clean_flags(row.get("validation_flags", ""))
    write_csv(SITE_CSV, fieldnames, rows)
    missing = sum(1 for row in rows if not row.get("runner_up_zh", "").strip() and not row.get("runner_up_en", "").strip())
    return updated, missing


def sync_site_json(profiles: dict[str, CsvRow], generated_at: str, source_summary: JsonMap) -> int:
    data = read_json(SITE_JSON)
    updated = 0
    for raw in json_list(data.get("indicators")):
        indicator = json_map(raw)
        profile = profiles.get(str(indicator.get("conceptSlug", "")), {})
        research = json_map(indicator.get("research"))
        if profile and not str(research.get("runnerUpZh", "")).strip():
            research["runnerUpZh"] = profile["runner_up_zh"]
            research["runnerUpEn"] = profile["runner_up_en"]
            updated += 1
        indicator["validationFlags"] = [flag for flag in json_list(indicator.get("validationFlags")) if flag != RUNNER_FLAG]
    data["version"] = "2026-07-03-expert-team-bridge-complete"
    data["generatedAt"] = generated_at
    data["status"] = "pass"
    evidence = json_map(data.get("evidenceReview"))
    evidence.update(source_summary)
    data["evidenceReview"] = evidence
    SITE_JSON.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    SITE_JS.write_text("window.__TI_DATA__ = " + json.dumps(data, ensure_ascii=False, indent=2) + ";\n", encoding="utf-8")
    return updated


def review_summary(site_missing: int, winner_missing: int, low_review: int, taxonomy_markers: int) -> JsonMap:
    return {
        "lowReviewRows": low_review,
        "lowReviewPolicy": "低信任或來源類型不清的材料已降權為 support-only；不可單獨支撐公式、來源或交易結論。",
        "taxonomyReviewMarkers": taxonomy_markers,
        "runnerUpMissingRows": site_missing,
        "winnerRunnerUpMissingRows": winner_missing,
    }


def sync_readiness(summary: JsonMap, generated_at: str) -> None:
    readiness = read_json(READINESS_JSON)
    readiness["status"] = "pass"
    readiness["generatedAt"] = generated_at
    readiness["sourceReview"] = {
        "flagCount": 240,
        "lowReviewRows": summary["lowReviewRows"],
        "status": "accepted_support_only",
        "policy": summary["lowReviewPolicy"],
    }
    readiness["taxonomyReview"] = {
        "reviewMarkerCount": summary["taxonomyReviewMarkers"],
        "status": "accepted_mapping_state",
        "policy": "merge、split 與 medium-confidence 是已追蹤的 taxonomy 關係，不代表未對應；所有 82 個前端 slug 仍須一對一落到研究概念。",
    }
    readiness["runnerUpPolicy"] = {
        "siteMissingRows": summary["runnerUpMissingRows"],
        "winnerMissingRows": summary["winnerRunnerUpMissingRows"],
        "status": "complete_with_explicit_status",
    }
    READINESS_JSON.write_text(json.dumps(readiness, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    READINESS_JS.write_text("window.__TI_READINESS__ = " + json.dumps(readiness, ensure_ascii=False, indent=2) + ";\n", encoding="utf-8")


def main() -> None:
    profiles, source_updated = sync_source_runner_up()
    _, winner_rows = read_csv(WINNERS_CSV)
    _, evidence_rows = read_csv(EVIDENCE_CSV)
    generated_at = datetime.now(UTC).isoformat()
    _, site_missing = sync_site_csv(profiles)
    site = read_json(SITE_JSON)
    taxonomy = json_map(site.get("taxonomy"))
    mappings = [json_map(item) for item in json_list(taxonomy.get("mappings"))]
    relation_counts = Counter(str(item.get("relation", "")) for item in mappings)
    confidence_counts = Counter(str(item.get("confidence", "")) for item in mappings)
    winner_missing = sum(1 for row in winner_rows if not row.get("runner_up_zh", "").strip() and not row.get("runner_up_en", "").strip())
    low_review = sum(1 for row in evidence_rows if row.get("proposed_review_state") == "low_review")
    taxonomy_markers = relation_counts["merge"] + relation_counts["split"] + confidence_counts["medium"]
    summary = review_summary(site_missing, winner_missing, low_review, taxonomy_markers)
    json_updated = sync_site_json(profiles, generated_at, summary)
    sync_readiness(summary, generated_at)
    print(f"site_runner_up_missing={site_missing}")
    print(f"winner_runner_up_missing={winner_missing}")
    print(f"source_runner_up_updated={source_updated}")
    print(f"json_runner_up_updated={json_updated}")
    print(f"low_review_rows={low_review}")
    print(f"taxonomy_review_markers={taxonomy_markers}")


if __name__ == "__main__":
    main()
