#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///

# ----- How to run -----
# 1. From the repository root:
#      python scripts/validate_site_bridge.py
# 2. Optional report location:
#      python scripts/validate_site_bridge.py --report-dir .omo/teams/019f1d71-704b-7021-b9de-a457638bcda2/artifacts
# 3. If uv is available, this also runs as:
#      uv run scripts/validate_site_bridge.py
# ----------------------

from __future__ import annotations

import argparse
import csv
import json
import sys
from collections import Counter
from dataclasses import asdict, dataclass
from datetime import UTC, datetime
from pathlib import Path
from typing import Final, Literal, Mapping, Sequence


ROOT: Final = Path(__file__).resolve().parents[1]
SITE_DIR: Final = ROOT / "data" / "site"
TEAM_ARTIFACTS: Final = ROOT / ".omo" / "teams" / "019f1d71-704b-7021-b9de-a457638bcda2" / "artifacts"

SITE_JSON: Final = SITE_DIR / "technical_indicators_site_data.json"
SITE_JS: Final = SITE_DIR / "technical_indicators_site_data.js"
READINESS_JSON: Final = SITE_DIR / "site_readiness_overlay.json"
READINESS_JS: Final = SITE_DIR / "site_readiness_overlay.js"
SITE_CSV: Final = SITE_DIR / "technical_indicators_site_data.csv"
BRIDGE_CSV: Final = SITE_DIR / "indicator_slug_bridge.csv"
EVIDENCE_CSV: Final = SITE_DIR / "evidence_review_flags.csv"
WINNERS_CSV: Final = ROOT / "data" / "technical_analysis_indicator_winners.csv"
MARKET_JSON: Final = ROOT / "data" / "market_cases_yahoo.json"
MARKET_JS: Final = ROOT / "data" / "market_cases_yahoo.js"
INDEX_HTML: Final = ROOT / "index.html"
APP_JS: Final = ROOT / "app.js"

EXPECTED_COUNTS: Final[Mapping[str, int]] = {
    "siteIndicators": 82,
    "researchConcepts": 72,
    "experts": 100,
    "methodFamilies": 18,
    "researchMaterials": 311,
    "expertComparisonRows": 261,
    "indicatorWinnerRows": 72,
    "marketCaseCount": 5,
    "taxonomyMappings": 82,
    "evidenceFlags": 240,
}
EXPECTED_MARKET_CASES: Final = {"uptrend", "range", "reversal", "breakout", "momentumBreakout"}
ALLOWED_RELATIONS: Final = {"exact", "alias", "merge", "split"}

JsonValue = None | bool | int | float | str | list["JsonValue"] | dict[str, "JsonValue"]
Severity = Literal["error", "warning"]


@dataclass(frozen=True, slots=True)
class Gate:
    name: str; passed: bool; severity: Severity; detail: str


@dataclass(frozen=True, slots=True)
class Report:
    schemaVersion: int; generatedAt: str; status: str; gates: Sequence[Gate]; outputs: Mapping[str, str]


def relative(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def read_json(path: Path) -> tuple[JsonValue | None, Gate]:
    try:
        parsed = json.loads(path.read_text(encoding="utf-8-sig"))
        return parsed, Gate(f"{path.stem}_parses", True, "error", f"{relative(path)} parses successfully")
    except FileNotFoundError:
        return None, Gate(f"{path.stem}_exists", False, "error", f"missing {relative(path)}")
    except json.JSONDecodeError as error:
        detail = f"{relative(path)} JSON parse error at line {error.lineno}, column {error.colno}"
        return None, Gate(f"{path.stem}_parses", False, "error", detail)


def read_csv_rows(path: Path) -> list[dict[str, str]]:
    with path.open("r", encoding="utf-8-sig", newline="") as file:
        return list(csv.DictReader(file))


def mapping(value: JsonValue | None) -> dict[str, JsonValue]:
    return value if isinstance(value, dict) else {}


def sequence(value: JsonValue | None) -> list[JsonValue]:
    return value if isinstance(value, list) else []


def text(value: JsonValue | None) -> str:
    return value if isinstance(value, str) else ""


def whole_number(value: JsonValue | None) -> int:
    return value if type(value) is int else -1


def csv_gate(path: Path, rows: Sequence[Mapping[str, str]]) -> Gate:
    return Gate(f"{path.stem}_rows_present", len(rows) > 0, "error", f"{relative(path)} has {len(rows)} data rows")


def count_gate(name: str, actual: int, expected: int) -> Gate:
    return Gate(f"{name}_{expected}", actual == expected, "error", f"{name}: expected {expected}, found {actual}")


def validate() -> Report:
    generated_at = datetime.now(UTC).isoformat()
    gates: list[Gate] = []

    for path in [SITE_JSON, SITE_JS, READINESS_JSON, READINESS_JS, SITE_CSV, BRIDGE_CSV, EVIDENCE_CSV, WINNERS_CSV, MARKET_JSON, MARKET_JS, INDEX_HTML, APP_JS]:
        gates.append(Gate(f"{path.stem}_exists", path.exists(), "error", f"{relative(path)} exists"))

    site_raw, site_parse_gate = read_json(SITE_JSON)
    readiness_raw, readiness_parse_gate = read_json(READINESS_JSON)
    market_raw, market_parse_gate = read_json(MARKET_JSON)
    gates.extend([site_parse_gate, readiness_parse_gate, market_parse_gate])

    if site_raw is None or readiness_raw is None or market_raw is None:
        return build_report(generated_at, gates)

    site = mapping(site_raw)
    readiness = mapping(readiness_raw)
    market = mapping(market_raw)
    stats = mapping(site.get("stats"))
    indicators = sequence(site.get("indicators"))
    comparisons = sequence(site.get("comparisons"))
    experts = sequence(site.get("experts"))
    families = sequence(site.get("families"))
    taxonomy = mapping(site.get("taxonomy"))
    mappings = [mapping(item) for item in sequence(taxonomy.get("mappings"))]
    evidence_review = mapping(site.get("evidenceReview"))
    site_market_cases = sequence(site.get("marketCases"))
    raw_market_cases = mapping(market.get("cases"))
    readiness_market = mapping(readiness.get("marketData"))

    bridge_rows = read_csv_rows(BRIDGE_CSV)
    evidence_rows = read_csv_rows(EVIDENCE_CSV)
    review_rows = read_csv_rows(SITE_CSV)
    winner_rows = read_csv_rows(WINNERS_CSV)
    gates.extend([csv_gate(BRIDGE_CSV, bridge_rows), csv_gate(EVIDENCE_CSV, evidence_rows), csv_gate(SITE_CSV, review_rows), csv_gate(WINNERS_CSV, winner_rows)])

    gates.extend(
        [
            count_gate("site_indicator_count", len(indicators), EXPECTED_COUNTS["siteIndicators"]),
            count_gate("research_concept_count", len(comparisons), EXPECTED_COUNTS["researchConcepts"]),
            count_gate("expert_count", len(experts), EXPECTED_COUNTS["experts"]),
            count_gate("family_count", len(families), EXPECTED_COUNTS["methodFamilies"]),
            count_gate("review_csv_indicator_count", len(review_rows), EXPECTED_COUNTS["siteIndicators"]),
            count_gate("winner_csv_count", len(winner_rows), EXPECTED_COUNTS["indicatorWinnerRows"]),
            count_gate("mapping_count", len(mappings), EXPECTED_COUNTS["taxonomyMappings"]),
            count_gate("market_case_count", len(site_market_cases), EXPECTED_COUNTS["marketCaseCount"]),
            count_gate("evidence_flag_count", len(evidence_rows), EXPECTED_COUNTS["evidenceFlags"]),
        ]
    )

    for stat_name in ("siteIndicators", "researchConcepts", "experts", "methodFamilies", "researchMaterials", "expertComparisonRows", "indicatorWinnerRows", "marketCaseCount"):
        gates.append(count_gate(f"stats_{stat_name}", whole_number(stats.get(stat_name)), EXPECTED_COUNTS[stat_name]))

    app_slugs = {text(mapping(item).get("siteSlug")) for item in indicators}
    mapped_slugs = {text(item.get("frontendSlug")) for item in mappings}
    concept_slugs = {text(mapping(item).get("conceptSlug")) for item in comparisons}
    primary_refs = {text(item.get("primaryConceptSlug")) for item in mappings}
    relation_counts = Counter(text(item.get("relation")) for item in mappings)

    gates.extend(
        [
            Gate("mapping_unique_frontend", len(mapped_slugs) == len(mappings), "error", "frontend slug mappings are unique"),
            Gate("mapping_covers_all_app_slugs", mapped_slugs == app_slugs, "error", "mapping slug set equals app indicator slug set"),
            Gate("mapping_valid_concept_refs", primary_refs <= concept_slugs, "error", f"invalid concept refs: {sorted(primary_refs - concept_slugs)}"),
            Gate("mapping_relations_allowed", set(relation_counts) <= ALLOWED_RELATIONS, "error", f"relations found: {dict(sorted(relation_counts.items()))}"),
        ]
    )

    stats_relation_counts = mapping(stats.get("taxonomyRelationCounts"))
    for relation in sorted(ALLOWED_RELATIONS):
        gates.append(count_gate(f"taxonomy_relation_{relation}", relation_counts[relation], whole_number(stats_relation_counts.get(relation))))

    flag_count = whole_number(evidence_review.get("flagCount"))
    gates.append(Gate("evidence_review_flags_match_bundle", len(evidence_rows) == flag_count, "error", f"CSV flags={len(evidence_rows)}, bundle flagCount={flag_count}"))
    gates.append(Gate("evidence_review_columns_present", {"source_url", "flags", "proposed_review_state"} <= set(evidence_rows[0]), "error", "evidence review CSV has source_url, flags, proposed_review_state"))

    runner_up_pending = [row["concept_slug"] for row in winner_rows if not row.get("runner_up_en", "").strip() and not row.get("runner_up_zh", "").strip()]
    gates.append(Gate("runner_up_completion", len(runner_up_pending) == 0, "warning", f"{len(runner_up_pending)} indicators still need runner-up or explicit status"))

    case_names = set(raw_market_cases)
    gates.extend(
        [
            Gate("market_json_required_cases", EXPECTED_MARKET_CASES <= case_names, "error", f"market cases found: {sorted(case_names)}"),
            Gate("market_json_note_caveat", "Not real-time data" in text(market.get("note")) and "not investment advice" in text(market.get("note")), "error", "market JSON says data is not real-time and not investment advice"),
            Gate("site_bundle_market_cases_embedded", len(site_market_cases) == len(raw_market_cases), "error", "site bundle embeds the raw market case count"),
            Gate("readiness_market_case_policy", whole_number(readiness_market.get("marketCaseCount")) == 5 and whole_number(readiness_market.get("usedMarketCaseCount")) == 4 and "momentumBreakout" in {text(item) for item in sequence(readiness_market.get("unusedMarketCaseKeys"))}, "error", "readiness overlay records 5 market cases, 4 used cases, and the unused momentumBreakout case"),
        ]
    )
    gates.append(validate_market_bars(raw_market_cases))

    index_text = INDEX_HTML.read_text(encoding="utf-8")
    app_text = APP_JS.read_text(encoding="utf-8")
    site_js_text = SITE_JS.read_text(encoding="utf-8")
    readiness_js_text = READINESS_JS.read_text(encoding="utf-8")
    market_js_text = MARKET_JS.read_text(encoding="utf-8-sig")
    shape_guard_ok = all(term in app_text for term in ("hasUsableSiteDataShape", "Number(data.schemaVersion) >= 1", "indicators.length > 0", "Object.keys(safeRecord(data.stats)).length > 0")) and 'loaded: Boolean(source && typeof source === "object")' not in app_text

    gates.extend(
        [
            Gate("site_js_wrapper_shape", "window.__TI_DATA__ =" in site_js_text, "error", "site JS assigns window.__TI_DATA__"),
            Gate("readiness_js_wrapper_shape", "window.__TI_READINESS__ =" in readiness_js_text, "error", "readiness JS assigns window.__TI_READINESS__"),
            Gate("market_js_wrapper_shape", "window.__MARKET_CASES__ =" in market_js_text, "error", "market JS assigns window.__MARKET_CASES__"),
            Gate("index_loads_market_cases_js", "data/market_cases_yahoo.js" in index_text, "error", "index.html loads market_cases_yahoo.js"),
            Gate("index_loads_site_data_bridge_js", "data/site/technical_indicators_site_data.js" in index_text, "warning", "index.html loads the site data bridge"),
            Gate("index_loads_readiness_overlay_js", "data/site/site_readiness_overlay.js" in index_text, "error", "index.html loads the readiness overlay"),
            Gate(
                "app_market_static_fallback",
                all(
                    term in app_text
                    for term in (
                        "marketSeriesForCase",
                        "isSynthetic",
                        "教學用生成序列",
                        "marketDataStatusLabel",
                        'hasRealData ? "真實案例" : "教學序列"',
                        'playgroundMarket.isSynthetic ? "教學序列與指標圖層" : "真實價格折線與指標圖層"',
                    )
                ),
                "error",
                "app.js carries generated-series provenance into advanced cases and the playground when market data is absent",
            ),
            Gate(
                "app_has_no_static_yahoo_fallback_copy",
                "Yahoo Finance 本地快照" not in app_text,
                "error",
                "a missing market snapshot cannot leave a static Yahoo Finance label behind",
            ),
            Gate("app_market_optional_read", "window.__MARKET_CASES__?.cases?.[caseName]" in app_text, "error", "app.js reads market data through an optional global"),
            Gate("app_ti_data_malformed_guard", shape_guard_ok, "error", "app.js rejects malformed site data before loaded=true"),
            Gate("app_readiness_overlay_read_layer", "window.__TI_READINESS__" in app_text and "siteReadinessMarketSummary" in app_text, "error", "app.js reads readiness overlay for P2 and market caveats"),
            Gate(
                "educational_not_trading_advice_copy_present",
                "只作教育研究" in index_text and "不構成投資建議" in index_text,
                "error",
                "static copy states local education/research use and not investment advice",
            ),
        ]
    )

    return build_report(generated_at, gates)


def validate_market_bars(cases: Mapping[str, JsonValue]) -> Gate:
    failures: list[str] = []
    for name, value in cases.items():
        bars = sequence(mapping(value).get("bars"))
        if len(bars) < 50:
            failures.append(f"{name}: {len(bars)} bars")
            continue
        first_bar = mapping(bars[0])
        required = {"date", "open", "high", "low", "close", "volume"}
        if not required <= set(first_bar):
            failures.append(f"{name}: first bar missing {sorted(required - set(first_bar))}")
    return Gate("market_case_bars_complete", len(failures) == 0, "error", "; ".join(failures) or "all market cases have at least 50 OHLCV bars")


def build_report(generated_at: str, gates: Sequence[Gate]) -> Report:
    status = "fail"
    error_failed = [gate for gate in gates if gate.severity == "error" and not gate.passed]
    warning_failed = [gate for gate in gates if gate.severity == "warning" and not gate.passed]
    if not error_failed:
        status = "pass_with_warnings" if warning_failed else "pass"
    return Report(
        schemaVersion=1,
        generatedAt=generated_at,
        status=status,
        gates=gates,
        outputs={
            "siteJson": relative(SITE_JSON),
            "siteJs": relative(SITE_JS),
            "reviewCsv": relative(SITE_CSV),
            "slugBridgeCsv": relative(BRIDGE_CSV),
            "evidenceFlagsCsv": relative(EVIDENCE_CSV),
            "marketCasesJson": relative(MARKET_JSON),
        },
    )


def render_markdown(report: Report) -> str:
    lines = [
        "# D Validation Automation Report",
        "",
        f"Generated: {report.generatedAt}",
        "",
        f"Status: `{report.status}`",
        "",
        "| Gate | Status | Severity | Detail |",
        "|---|---|---|---|",
    ]
    for gate in report.gates:
        status = "PASS" if gate.passed else "FAIL"
        detail = gate.detail.replace("|", "\\|")
        lines.append(f"| `{gate.name}` | {status} | {gate.severity} | {detail} |")
    lines.extend(["", "Outputs:"])
    for name, path in report.outputs.items():
        lines.append(f"- {name}: `{path}`")
    lines.append("")
    return "\n".join(lines)


def write_report(report: Report, report_dir: Path) -> tuple[Path, Path]:
    report_dir.mkdir(parents=True, exist_ok=True)
    json_path = report_dir / "D-validation-automation-report.json"
    md_path = report_dir / "D-validation-automation-report.md"
    json_payload = {
        "schemaVersion": report.schemaVersion,
        "generatedAt": report.generatedAt,
        "status": report.status,
        "gates": [asdict(gate) for gate in report.gates],
        "outputs": dict(report.outputs),
    }
    json_path.write_text(json.dumps(json_payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    md_path.write_text(render_markdown(report), encoding="utf-8")
    return json_path, md_path


def parse_args(argv: Sequence[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Validate the technical indicators site bridge artifacts.")
    parser.add_argument("--report-dir", type=Path, default=TEAM_ARTIFACTS, help="Directory for JSON and Markdown reports.")
    return parser.parse_args(argv)


def main(argv: Sequence[str] | None = None) -> int:
    args = parse_args(sys.argv[1:] if argv is None else argv)
    report = validate()
    json_path, md_path = write_report(report, args.report_dir)
    print(f"{report.status}: wrote {relative(json_path)} and {relative(md_path)}")
    return 1 if report.status == "fail" else 0


if __name__ == "__main__":
    raise SystemExit(main())
