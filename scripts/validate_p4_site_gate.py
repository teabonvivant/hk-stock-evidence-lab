# /// script
# requires-python = ">=3.11"
# ///
# ----- How to run -----------------------------------------------------------
# python scripts/validate_p4_site_gate.py
# ---------------------------------------------------------------------------
from __future__ import annotations

import csv
import json
import re
import sys
from collections import Counter
from dataclasses import asdict, dataclass
from datetime import UTC, datetime
from pathlib import Path
from typing import Final, TypeAlias

ROOT: Final = Path(__file__).resolve().parents[1]
SITE_DIR: Final = ROOT / "data" / "site"
REPORT_JSON: Final = SITE_DIR / "validation_report.json"
REPORT_MD: Final = SITE_DIR / "validation_report.md"
TV_STRATEGY_REPORT_JSON: Final = SITE_DIR / "tradingview_strategy_validation_report.json"
TV_STRATEGY_JSON: Final = SITE_DIR / "tradingview_strategy_cases.json"
TV_STRATEGY_JS: Final = SITE_DIR / "tradingview_strategy_cases.js"
TV_STRATEGY_VALIDATOR: Final = ROOT / "scripts" / "validate_tradingview_strategy_cases.py"

SITE_JSON: Final = SITE_DIR / "technical_indicators_site_data.json"
SITE_JS: Final = SITE_DIR / "technical_indicators_site_data.js"
READINESS_JSON: Final = SITE_DIR / "site_readiness_overlay.json"
READINESS_JS: Final = SITE_DIR / "site_readiness_overlay.js"
SITE_CSV: Final = SITE_DIR / "technical_indicators_site_data.csv"
BRIDGE_CSV: Final = SITE_DIR / "indicator_slug_bridge.csv"
EVIDENCE_CSV: Final = SITE_DIR / "evidence_review_flags.csv"
INDEX_HTML: Final = ROOT / "index.html"
APP_JS: Final = ROOT / "app.js"
MARKET_JSON: Final = ROOT / "data" / "market_cases_yahoo.json"
MARKET_JS: Final = ROOT / "data" / "market_cases_yahoo.js"
INDICATOR_PROFILES: Final = ROOT / "data" / "technical_analysis_complete_indicator_profiles.csv"
WINNERS_CSV: Final = ROOT / "data" / "technical_analysis_indicator_winners.csv"
COMPARISONS_CSV: Final = ROOT / "data" / "technical_analysis_indicator_expert_comparisons.csv"
MATERIALS_CSV: Final = ROOT / "data" / "technical_analysis_research_materials_bilingual.csv"

JsonValue: TypeAlias = str | int | float | bool | None | list["JsonValue"] | dict[str, "JsonValue"]
JsonMap: TypeAlias = dict[str, JsonValue]
CsvRow: TypeAlias = dict[str, str]
CountCheck: TypeAlias = tuple[str, int, int]


@dataclass(frozen=True, slots=True)
class Gate:
    name: str
    passed: bool
    severity: str
    detail: str


class ValidationInputError(Exception):
    pass


def read_text(path: Path) -> str:
    if not path.exists():
        raise ValidationInputError(f"missing required file: {path.relative_to(ROOT)}")
    return path.read_text(encoding="utf-8-sig")


def read_json(path: Path) -> JsonMap:
    data = json.loads(read_text(path))
    if not isinstance(data, dict):
        raise ValidationInputError(f"expected JSON object: {path.relative_to(ROOT)}")
    return data


def read_csv(path: Path) -> list[CsvRow]:
    with path.open(encoding="utf-8-sig", newline="") as handle:
        return list(csv.DictReader(handle))


def rows_set(rows: list[CsvRow], key: str) -> set[str]:
    return {row.get(key, "").strip() for row in rows if row.get(key, "").strip()}


def map_list(value: JsonValue) -> list[JsonMap]:
    return [item for item in value if isinstance(item, dict)] if isinstance(value, list) else []


def json_map(value: JsonValue) -> JsonMap:
    return value if isinstance(value, dict) else {}


def rel(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def split_slugs(value: str) -> list[str]:
    return [item.strip() for item in value.split(";") if item.strip()]


def add_count_gate(gates: list[Gate], check: CountCheck) -> None:
    name, actual, expected = check
    gates.append(Gate(name, actual == expected, "error", f"{actual} found; expected {expected}"))


def validate_counts(gates: list[Gate], site: JsonMap, csvs: dict[str, list[CsvRow]]) -> None:
    indicators = map_list(site.get("indicators"))
    families = map_list(site.get("families"))
    experts = map_list(site.get("experts"))
    comparisons = map_list(site.get("comparisons"))
    market_cases = map_list(site.get("marketCases"))
    taxonomy = json_map(site.get("taxonomy"))
    mappings = map_list(taxonomy.get("mappings"))
    stats = json_map(site.get("stats"))

    for check in (("site_json_indicator_count_82", len(indicators), 82), ("site_csv_indicator_count_82", len(csvs["site"]), 82), ("bridge_mapping_count_82", len(csvs["bridge"]), 82), ("taxonomy_mapping_count_82", len(mappings), 82), ("research_concept_count_72", len(csvs["profiles"]), 72), ("expert_count_100", len(experts), 100), ("family_count_18", len(families), 18), ("material_count_311", len(csvs["materials"]), 311), ("comparison_count_261", len(csvs["comparisons"]), 261), ("winner_count_72", len(csvs["winners"]), 72), ("market_case_count_5", len(market_cases), 5)):
        add_count_gate(gates, check)
    expected_stats = {"siteIndicators": len(indicators), "researchConcepts": len(csvs["profiles"]), "experts": len(experts), "methodFamilies": len(families), "researchMaterials": len(csvs["materials"]), "expertComparisonRows": len(csvs["comparisons"]), "indicatorWinnerRows": len(csvs["winners"]), "marketCaseCount": len(market_cases)}
    mismatches = [key for key, value in expected_stats.items() if stats.get(key) != value]
    gates.append(Gate("site_stats_match_source_counts", not mismatches, "error", f"mismatches: {mismatches}"))


def validate_joins(gates: list[Gate], site: JsonMap, csvs: dict[str, list[CsvRow]]) -> None:
    site_slugs = rows_set(csvs["site"], "site_slug")
    bridge_slugs = rows_set(csvs["bridge"], "site_slug")
    json_slugs = {str(item.get("siteSlug")) for item in map_list(site.get("indicators")) if item.get("siteSlug")}
    concept_slugs = rows_set(csvs["profiles"], "concept_slug")
    winner_slugs = rows_set(csvs["winners"], "concept_slug")
    comparison_slugs = rows_set(csvs["comparisons"], "concept_slug")

    gates.append(Gate("site_csv_matches_json_slugs", site_slugs == json_slugs, "error", f"csv={len(site_slugs)} json={len(json_slugs)}"))
    gates.append(Gate("bridge_covers_all_site_slugs", bridge_slugs == site_slugs, "error", f"bridge={len(bridge_slugs)} site={len(site_slugs)}"))
    bridge_by_slug = {row["site_slug"]: row for row in csvs["bridge"]}
    mismatched = [row["site_slug"] for row in csvs["site"] if bridge_by_slug.get(row["site_slug"], {}).get("concept_slug") != row["concept_slug"]]
    gates.append(Gate("site_csv_primary_concepts_match_bridge", not mismatched, "error", f"mismatches={mismatched[:8]}"))
    primary_missing = sorted(rows_set(csvs["bridge"], "concept_slug") - concept_slugs)
    all_bridge_slugs = {slug for row in csvs["bridge"] for slug in split_slugs(row.get("all_concept_slugs", ""))}
    all_missing = sorted(all_bridge_slugs - concept_slugs)
    gates.append(Gate("bridge_primary_concepts_exist", not primary_missing, "error", f"missing={primary_missing[:8]}"))
    gates.append(Gate("bridge_all_concepts_exist", not all_missing, "error", f"missing={all_missing[:8]}"))
    gates.append(Gate("winner_rows_cover_research_concepts", concept_slugs == winner_slugs, "error", f"profiles={len(concept_slugs)} winners={len(winner_slugs)}"))
    gates.append(Gate("comparison_rows_cover_research_concepts", concept_slugs <= comparison_slugs, "error", f"missing={sorted(concept_slugs - comparison_slugs)[:8]}"))
    missing_formula = sorted(row.get("site_slug", "") for row in csvs["site"] if not next((item for item in map_list(site.get("indicators")) if item.get("siteSlug") == row.get("site_slug") and item.get("formula")), None))
    gates.append(Gate("indicator_formula_fields_present", not missing_formula, "error", f"missing={missing_formula[:8]}"))


def validate_taxonomy(gates: list[Gate], site: JsonMap) -> None:
    taxonomy = json_map(site.get("taxonomy"))
    mappings = map_list(taxonomy.get("mappings"))
    frontend_slugs = [str(item.get("frontendSlug", "")) for item in mappings]
    primary_slugs = [str(item.get("primaryConceptSlug", "")) for item in mappings]
    relation_counts = Counter(str(item.get("relation", "")) for item in mappings)
    confidence_counts = Counter(str(item.get("confidence", "")) for item in mappings)
    stats = json_map(site.get("stats"))
    expected_relations = json_map(stats.get("taxonomyRelationCounts"))
    evidence_review = json_map(site.get("evidenceReview"))
    gates.append(Gate("taxonomy_frontend_slugs_unique", len(frontend_slugs) == len(set(frontend_slugs)), "error", "frontend slug uniqueness checked"))
    gates.append(Gate("taxonomy_primary_concepts_populated", all(primary_slugs), "error", f"blank={primary_slugs.count('')}"))
    gates.append(Gate("taxonomy_relation_counts_match_stats", dict(relation_counts) == expected_relations, "error", f"actual={dict(relation_counts)} stats={expected_relations}"))
    review_count = relation_counts.get("merge", 0) + relation_counts.get("split", 0) + confidence_counts.get("medium", 0)
    gates.append(Gate("taxonomy_review_items_tracked", evidence_review.get("taxonomyReviewMarkers") == review_count, "error", f"{review_count} merge/split/medium-confidence review markers accepted"))


def validate_evidence(gates: list[Gate], site: JsonMap, csvs: dict[str, list[CsvRow]]) -> None:
    stats = json_map(site.get("stats"))
    expected_levels = json_map(stats.get("evidenceLevels"))
    material_levels = Counter(row.get("evidence_level", "") for row in csvs["materials"] if row.get("evidence_level"))
    evidence_review = json_map(site.get("evidenceReview"))
    flag_count = evidence_review.get("flagCount")
    low_review = sum(1 for row in csvs["evidence"] if row.get("proposed_review_state") == "low_review")
    blank_flags = [row.get("row", "") for row in csvs["evidence"] if not row.get("flags", "").strip()]
    gates.append(Gate("evidence_stats_match_materials", dict(material_levels) == expected_levels, "error", f"actual={dict(material_levels)} stats={expected_levels}"))
    gates.append(Gate("evidence_review_flags_count_match", len(csvs["evidence"]) == flag_count, "error", f"csv={len(csvs['evidence'])} json={flag_count}"))
    gates.append(Gate("evidence_review_flags_described", not blank_flags, "error", f"blank flag rows={blank_flags[:8]}"))
    low_review_accepted = evidence_review.get("lowReviewRows") == low_review and bool(evidence_review.get("lowReviewPolicy"))
    gates.append(Gate("evidence_low_review_rows_accepted", low_review_accepted, "error", f"{low_review} low-review evidence rows accepted as support-only"))


def validate_runner_ups(gates: list[Gate], csvs: dict[str, list[CsvRow]]) -> None:
    missing_site = [row["site_slug"] for row in csvs["site"] if not row.get("runner_up_en", "").strip()]
    missing_common = [row["concept_slug"] for row in csvs["winners"] if row.get("has_common_research") == "yes" and not row.get("runner_up_en", "").strip()]
    gates.append(Gate("site_runner_up_warning_markers", not missing_site, "warning", f"{len(missing_site)} site rows lack runner-up text/status"))
    gates.append(Gate("multi_expert_runner_up_warnings", not missing_common, "warning", f"{len(missing_common)} multi-expert concepts lack runner-up text/status: {missing_common[:8]}"))


def validate_market_cases(gates: list[Gate], site: JsonMap, market: JsonMap) -> None:
    raw_cases = json_map(market.get("cases"))
    site_cases = {str(item.get("caseName")): item for item in map_list(site.get("marketCases"))}
    bad_bars = []
    bad_ranges = []
    for name, raw_value in raw_cases.items():
        raw = json_map(raw_value)
        bars = map_list(raw.get("bars"))
        dates = [str(bar.get("date", "")) for bar in bars]
        if len(bars) < 50 or any(key not in bars[0] for key in ("open", "high", "low", "close", "volume")):
            bad_bars.append(name)
        if dates != sorted(dates) or site_cases.get(name, {}).get("bars") != len(bars):
            bad_ranges.append(name)
    markets = {json_map(value).get("market") for value in raw_cases.values()}
    gates.append(Gate("market_case_sets_match_site_summary", set(raw_cases) == set(site_cases), "error", f"raw={len(raw_cases)} site={len(site_cases)}"))
    gates.append(Gate("market_cases_have_usable_bars", not bad_bars, "error", f"bad={bad_bars[:8]}"))
    gates.append(Gate("market_case_dates_and_counts_match", not bad_ranges, "error", f"bad={bad_ranges[:8]}"))
    gates.append(Gate("market_cases_cover_us_and_hk", {"US", "HK"} <= markets, "error", f"markets={sorted(str(item) for item in markets)}"))
    gates.append(Gate("market_js_wrapper_shape", read_text(MARKET_JS).lstrip().startswith("window.__MARKET_CASES__ ="), "error", "window.__MARKET_CASES__ assignment checked"))


def validate_readiness_overlay(gates: list[Gate], readiness: JsonMap) -> None:
    market = json_map(readiness.get("marketData"))
    policy = json_map(readiness.get("indicatorPolicy"))
    raw_fields = readiness.get("readinessFields")
    fields = set(str(item) for item in raw_fields) if isinstance(raw_fields, list) else set()
    required = {"formulaReadiness", "sourceReadiness", "quantCaveat", "tradePlaybookReadiness", "failureConditionReadiness", "marketDataStatus"}
    unused_keys = market.get("unusedMarketCaseKeys")
    unused = set(str(item) for item in unused_keys) if isinstance(unused_keys, list) else set()
    gates.append(Gate("readiness_overlay_policy_fields", required <= fields and required - set(policy) == {"marketDataStatus"}, "error", f"fields={sorted(fields)}"))
    gates.append(Gate("readiness_overlay_market_caveats", market.get("marketCaseCount") == 5 and market.get("usedMarketCaseCount") == 4 and "momentumBreakout" in unused, "error", f"unused={sorted(unused)}"))


def validate_static_site(gates: list[Gate]) -> None:
    index_html = read_text(INDEX_HTML)
    app_js = read_text(APP_JS)
    site_js = read_text(SITE_JS)
    readiness_js = read_text(READINESS_JS)
    scripts = re.findall(r'<script\s+src="([^"]+)"', index_html)
    positions = {name: next((idx for idx, src in enumerate(scripts) if name in src), -1) for name in ("data/market_cases_yahoo.js", "data/site/technical_indicators_site_data.js", "data/site/site_readiness_overlay.js", "app.js")}
    order_ok = -1 not in positions.values() and positions["data/market_cases_yahoo.js"] < positions["data/site/technical_indicators_site_data.js"] < positions["data/site/site_readiness_overlay.js"] < positions["app.js"]
    fallback_terms = (
        "readSiteData",
        "hasUsableSiteDataShape",
        "siteIndicatorDataFor",
        "generateSeries(caseName, fallbackCount)",
        "marketSeriesForCase",
        "isSynthetic",
        "教學用生成序列",
        "marketDataStatusLabel",
        'hasRealData ? "真實案例" : "教學序列"',
        'playgroundMarket.isSynthetic ? "教學序列與指標圖層" : "真實價格折線與指標圖層"',
    )
    shape_terms = ("Number(data.schemaVersion) >= 1", "indicators.length > 0", "Object.keys(safeRecord(data.stats)).length > 0", "const loaded = hasUsableSiteDataShape(source, data, indicators)")
    readiness_terms = ("readSiteReadiness", "window.__TI_READINESS__", "siteReadinessMarketSummary", "專業化狀態")
    missing_terms = [term for term in fallback_terms if term not in app_js]
    shape_ok = all(term in app_js for term in shape_terms) and 'loaded: Boolean(source && typeof source === "object")' not in app_js
    gates.append(Gate("site_js_wrapper_shape", site_js.lstrip().startswith("window.__TI_DATA__ ="), "error", "window.__TI_DATA__ assignment checked"))
    gates.append(Gate("readiness_js_wrapper_shape", readiness_js.lstrip().startswith("window.__TI_READINESS__ ="), "error", "window.__TI_READINESS__ assignment checked"))
    gates.append(Gate("script_load_order_market_site_readiness_app", order_ok, "error", f"positions={positions}"))
    gates.append(Gate("app_reads_site_bundle_conditionally", "readSiteData(typeof window === \"object\" ? window.__TI_DATA__ : null)" in app_js, "error", "conditional site data read checked"))
    gates.append(Gate("static_fallback_paths_present", not missing_terms, "error", f"missing={missing_terms}"))
    gates.append(
        Gate(
            "no_static_yahoo_fallback_copy",
            "Yahoo Finance 本地快照" not in app_js,
            "error",
            "a missing market snapshot cannot leave a static Yahoo Finance label behind",
        )
    )
    gates.append(Gate("app_rejects_malformed_site_bundle", shape_ok, "error", "site bundle requires schema, indicators, and stats before loaded=true"))
    gates.append(Gate("app_reads_readiness_overlay", all(term in app_js for term in readiness_terms), "error", "readiness overlay drives P2/market caveat copy"))


def validate_tradingview_strategy_report(gates: list[Gate]) -> None:
    if not TV_STRATEGY_REPORT_JSON.exists():
        gates.append(Gate("tradingview_strategy_validation_status", False, "error", f"missing {rel(TV_STRATEGY_REPORT_JSON)}"))
        return
    dependencies = [TV_STRATEGY_JSON, TV_STRATEGY_JS, TV_STRATEGY_VALIDATOR, INDEX_HTML, APP_JS]
    stale_dependencies = [
        rel(path)
        for path in dependencies
        if path.exists() and path.stat().st_mtime > TV_STRATEGY_REPORT_JSON.stat().st_mtime
    ]
    report = read_json(TV_STRATEGY_REPORT_JSON)
    checks = {
        str(item.get("name")): str(item.get("status"))
        for item in map_list(report.get("checks"))
        if item.get("name")
    }
    errors = report.get("errors")
    status = str(report.get("status", "fail"))
    report_ok = status in {"pass", "pass_with_warnings"} and errors == 0
    required = {
        "settings_audit_present",
        "script_code_audit_present",
        "script_code_provenance_safe",
        "json_js_bundle_parity",
        "source_urls_audit_only",
        "no_tradingview_widget",
    }
    missing = sorted(name for name in required if checks.get(name) != "pass")
    gates.append(Gate("tradingview_strategy_validation_status", report_ok, "error", f"status={status}; errors={errors}"))
    gates.append(
        Gate(
            "tradingview_strategy_validation_report_fresh",
            not stale_dependencies and bool(report.get("generatedAt")),
            "error",
            f"generatedAt={report.get('generatedAt', '')}; stale_dependencies={stale_dependencies}",
        ),
    )
    gates.append(Gate("tradingview_strategy_policy_checks", not missing, "error", f"missing/failing={missing}"))


def status_for(gates: list[Gate]) -> str:
    if any(not gate.passed and gate.severity == "error" for gate in gates):
        return "fail"
    if any(not gate.passed and gate.severity == "warning" for gate in gates):
        return "pass_with_warnings"
    return "pass"


def write_reports(gates: list[Gate]) -> None:
    generated_at = datetime.now(UTC).isoformat()
    report = {
        "schemaVersion": 2,
        "generatedAt": generated_at,
        "status": status_for(gates),
        "scope": "P4 data/site validation gate",
        "gates": [asdict(gate) for gate in gates],
        "warnings": [asdict(gate) for gate in gates if not gate.passed and gate.severity == "warning"],
        "errors": [asdict(gate) for gate in gates if not gate.passed and gate.severity == "error"],
        "outputs": {"json": rel(REPORT_JSON), "markdown": rel(REPORT_MD)},
    }
    REPORT_JSON.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    lines = [
        "# P4 Site Data Validation Report",
        "",
        f"Generated: {generated_at}",
        "",
        f"Status: `{report['status']}`",
        "",
        "| Gate | Status | Severity | Detail |",
        "|---|---|---|---|",
    ]
    for gate in gates:
        state = "PASS" if gate.passed else "FAIL"
        lines.append(f"| `{gate.name}` | {state} | {gate.severity} | {gate.detail} |")
    lines.extend(["", "Outputs:", f"- json: `{rel(REPORT_JSON)}`", f"- markdown: `{rel(REPORT_MD)}`", ""])
    REPORT_MD.write_text("\n".join(lines), encoding="utf-8")


def run() -> int:
    site = read_json(SITE_JSON)
    readiness = read_json(READINESS_JSON)
    market = read_json(MARKET_JSON)
    csvs = {
        "site": read_csv(SITE_CSV),
        "bridge": read_csv(BRIDGE_CSV),
        "evidence": read_csv(EVIDENCE_CSV),
        "profiles": read_csv(INDICATOR_PROFILES),
        "winners": read_csv(WINNERS_CSV),
        "comparisons": read_csv(COMPARISONS_CSV),
        "materials": read_csv(MATERIALS_CSV),
    }
    gates: list[Gate] = []
    validate_counts(gates, site, csvs)
    validate_joins(gates, site, csvs)
    validate_taxonomy(gates, site)
    validate_evidence(gates, site, csvs)
    validate_runner_ups(gates, csvs)
    validate_market_cases(gates, site, market)
    validate_readiness_overlay(gates, readiness)
    validate_static_site(gates)
    validate_tradingview_strategy_report(gates)
    write_reports(gates)
    summary = Counter("errors" if not gate.passed and gate.severity == "error" else "warnings" if not gate.passed else "passed" for gate in gates)
    print(f"status={status_for(gates)}")
    print(f"passed={summary['passed']} warnings={summary['warnings']} errors={summary['errors']}")
    print(f"report_json={rel(REPORT_JSON)}")
    print(f"report_markdown={rel(REPORT_MD)}")
    return 1 if status_for(gates) == "fail" else 0


if __name__ == "__main__":
    sys.exit(run())
