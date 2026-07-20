from __future__ import annotations

from csv import DictReader
from dataclasses import asdict, dataclass
from datetime import UTC, datetime
from json import JSONDecodeError, dumps, loads
from pathlib import Path
from typing import Final


ROOT: Final = Path(__file__).resolve().parents[1]
DATA_JSON: Final = ROOT / "data" / "site" / "tradingview_strategy_cases.json"
DATA_JS: Final = ROOT / "data" / "site" / "tradingview_strategy_cases.js"
RAW_LEADS_CSV: Final = ROOT / "data" / "site" / "tradingview_strategy_raw_leads.csv"
INDEX_HTML: Final = ROOT / "index.html"
APP_JS: Final = ROOT / "app.js"
REPORT_JSON: Final = ROOT / "data" / "site" / "tradingview_strategy_validation_report.json"
REPORT_MD: Final = ROOT / "data" / "site" / "tradingview_strategy_validation_report.md"

JsonScalar = str | int | float | bool | None
JsonValue = JsonScalar | list["JsonValue"] | dict[str, "JsonValue"]


@dataclass(frozen=True, slots=True)
class Check:
  name: str
  status: str
  detail: str


def as_record(value: JsonValue) -> dict[str, JsonValue]:
  return value if isinstance(value, dict) else {}


def as_list(value: JsonValue) -> list[JsonValue]:
  return value if isinstance(value, list) else []


def as_text(value: JsonValue) -> str:
  return value if isinstance(value, str) else ""


def read_text(path: Path) -> str:
  return path.read_text(encoding="utf-8")


def read_json(path: Path) -> dict[str, JsonValue]:
  return as_record(loads(read_text(path)))


def read_js_bundle(path: Path) -> dict[str, JsonValue]:
  prefix = "window.__TV_STRATEGY_CASES__ = "
  text = read_text(path).strip()
  if not text.startswith(prefix):
    return {}
  body = text[len(prefix) :].removesuffix(";")
  return as_record(loads(body))


def read_csv_row_count(path: Path) -> int:
  if not path.exists():
    return 0
  with path.open(encoding="utf-8", newline="") as handle:
    return sum(1 for _ in DictReader(handle))


def add(checks: list[Check], name: str, ok: bool, detail: str, warning: bool = False) -> None:
  status = "pass" if ok else ("warning" if warning else "error")
  checks.append(Check(name=name, status=status, detail=detail))


def count_status(cases: list[JsonValue], status: str) -> int:
  return sum(1 for item in cases if as_record(item).get("includeStatus") == status)


def int_field(record: dict[str, JsonValue], key: str, fallback: int = -1) -> int:
  value = record.get(key)
  if isinstance(value, int):
    return value
  if isinstance(value, float):
    return int(value)
  if isinstance(value, str) and value.strip().isdigit():
    return int(value)
  return fallback


def validate() -> tuple[str, list[Check]]:
  checks: list[Check] = []

  for path in [DATA_JSON, DATA_JS, RAW_LEADS_CSV, INDEX_HTML, APP_JS]:
    add(checks, f"file_exists:{path.name}", path.exists(), str(path.relative_to(ROOT)))

  data = read_json(DATA_JSON)
  js_bundle = read_js_bundle(DATA_JS)
  cases = as_list(data.get("cases"))
  stats = as_record(data.get("stats"))
  evidence = as_list(data.get("sourceEvidence"))

  add(checks, "schema_version", int(data.get("schemaVersion") or 0) >= 1, "schemaVersion >= 1")
  add(checks, "target_accepted_cases", data.get("targetAcceptedCases") == 100, "targetAcceptedCases must stay 100")
  add(checks, "raw_lead_target", int(data.get("rawLeadTarget") or 0) >= 150, "rawLeadTarget should over-collect")
  raw_lead_count = read_csv_row_count(RAW_LEADS_CSV)
  raw_leads_collected = int(data.get("rawLeadsCollected") or -1)
  add(
    checks,
    "raw_leads_collected_matches_csv",
    raw_leads_collected == raw_lead_count and int_field(stats, "rawLeadsCollected") == raw_lead_count,
    f"bundle={raw_leads_collected}; stats={int_field(stats, 'rawLeadsCollected')}; csv={raw_lead_count}",
  )
  add(checks, "cases_present", len(cases) > 0, f"{len(cases)} cases")
  add(checks, "source_evidence_present", len(evidence) >= len(cases), f"{len(evidence)} evidence rows")
  add(
    checks,
    "json_js_bundle_parity",
    data.get("schemaVersion") == js_bundle.get("schemaVersion")
    and data.get("stats") == js_bundle.get("stats")
    and data.get("cases") == js_bundle.get("cases")
    and data.get("sourceEvidence") == js_bundle.get("sourceEvidence"),
    "JSON and JS bundle expose the same schema, stats, cases, and sourceEvidence",
  )

  allowed = {"accepted", "rejected", "support-only"}
  invalid_statuses = [
    as_text(as_record(item).get("slug")) for item in cases if as_record(item).get("includeStatus") not in allowed
  ]
  add(checks, "include_status_values", not invalid_statuses, f"invalid rows: {', '.join(invalid_statuses) or 'none'}")

  accepted = count_status(cases, "accepted")
  support_only = count_status(cases, "support-only")
  rejected = count_status(cases, "rejected")
  add(checks, "accepted_count_matches", int_field(stats, "acceptedCases") == accepted, f"accepted={accepted}")
  add(checks, "support_only_count_matches", int_field(stats, "supportOnlyCases") == support_only, f"support-only={support_only}")
  add(checks, "rejected_count_matches", int_field(stats, "rejectedCases") == rejected, f"rejected={rejected}")
  add(checks, "accepted_target_warning", accepted >= 100, f"accepted={accepted}; target=100", warning=True)

  required_case_fields = {
    "slug",
    "title",
    "shortTitle",
    "author",
    "sourceName",
    "sourceEvidenceId",
    "strategyType",
    "market",
    "symbol",
    "timeframe",
    "includeStatus",
    "evidenceStatus",
    "verifierStatus",
    "displayCaveat",
  }
  missing_fields = []
  missing_enrichment_fields = []
  invalid_settings_profiles = []
  invalid_script_profiles = []
  mismatched_source_ids = []
  blocked_source_code_rows = []
  unlabelled_local_code_rows = []
  invalid_render_policy_rows = []
  mismatched_render_policy_rows = []
  invalid_original_code_rows = []
  accepted_without_verified_source = []
  forbidden_case_url_fields = []
  for item in cases:
    record = as_record(item)
    slug = as_text(record.get("slug")) or "unknown"
    missing = sorted(field for field in required_case_fields if field not in record)
    if missing:
      missing_fields.append(f"{slug}:{'/'.join(missing)}")
    if "sourceUrl" in record or "externalUrl" in record:
      forbidden_case_url_fields.append(slug)
    enrichment_missing = sorted(
      field
      for field in {"settingsAudit", "strategyProperties", "inputParameters", "scriptAccess", "pineScript", "scriptCodeAudit"}
      if field not in record
    )
    if enrichment_missing:
      missing_enrichment_fields.append(f"{slug}:{'/'.join(enrichment_missing)}")
    settings = as_record(record.get("settingsAudit"))
    properties = as_record(record.get("strategyProperties"))
    inputs = as_list(record.get("inputParameters"))
    script_access = as_record(record.get("scriptAccess"))
    pine_script = as_record(record.get("pineScript"))
    script_code_audit = as_record(record.get("scriptCodeAudit"))
    source_id = record.get("sourceEvidenceId")
    if (
      settings.get("sourceEvidenceId") != source_id
      or script_access.get("sourceEvidenceId") != source_id
      or script_code_audit.get("sourceEvidenceId") != source_id
    ):
      mismatched_source_ids.append(slug)
    if record.get("includeStatus") != "rejected" and (not settings or not properties or not inputs):
      invalid_settings_profiles.append(slug)
    if not script_access or not pine_script or not script_code_audit:
      invalid_script_profiles.append(slug)
    visibility = as_text(script_access.get("visibility"))
    code = as_text(pine_script.get("code"))
    original_code = as_text(script_code_audit.get("originalCode"))
    render_policy = as_text(script_access.get("renderPolicy"))
    audit_render_policy = as_text(script_code_audit.get("renderPolicy"))
    include_original_code = script_code_audit.get("includeOriginalCode")
    if render_policy != audit_render_policy:
      mismatched_render_policy_rows.append(slug)
    if visibility in {"protected", "invite-only"} and (code or original_code):
      blocked_source_code_rows.append(slug)
    if code and pine_script.get("isOriginalTradingViewSource") is not False:
      unlabelled_local_code_rows.append(slug)
    if code and render_policy not in {"render_local_template_with_warning", "render_verified_original_source"}:
      invalid_render_policy_rows.append(slug)
    if code and include_original_code is not False and render_policy != "render_verified_original_source":
      invalid_render_policy_rows.append(slug)
    if original_code:
      original_source_allowed = (
        visibility == "open"
        and script_access.get("sourceCodeStatus") in {"included_original_open_source", "permissioned_original_source"}
        and render_policy == "render_verified_original_source"
        and include_original_code is True
        and bool(as_text(script_access.get("licenseStatus")))
        and as_text(script_access.get("licenseStatus")) != "unknown"
        and bool(as_text(script_access.get("attribution")))
      )
      if not original_source_allowed:
        invalid_original_code_rows.append(slug)
    if record.get("includeStatus") == "accepted" and (
      settings.get("completeness") != "verified"
      or script_access.get("sourceCodeStatus")
      not in {"included_original_open_source", "permissioned_original_source"}
    ):
      accepted_without_verified_source.append(slug)
  add(checks, "required_case_fields", not missing_fields, f"missing: {', '.join(missing_fields) or 'none'}")
  add(
    checks,
    "settings_audit_present",
    not missing_enrichment_fields,
    f"missing: {', '.join(missing_enrichment_fields) or 'none'}",
  )
  add(
    checks,
    "settings_profiles_present",
    not invalid_settings_profiles,
    f"invalid rows: {', '.join(invalid_settings_profiles) or 'none'}",
  )
  add(
    checks,
    "script_code_audit_present",
    not invalid_script_profiles,
    f"invalid rows: {', '.join(invalid_script_profiles) or 'none'}",
  )
  add(
    checks,
    "source_evidence_ids_match",
    not mismatched_source_ids,
    f"mismatched rows: {', '.join(mismatched_source_ids) or 'none'}",
  )
  add(
    checks,
    "script_code_provenance_safe",
    not blocked_source_code_rows
    and not unlabelled_local_code_rows
    and not invalid_render_policy_rows
    and not mismatched_render_policy_rows
    and not invalid_original_code_rows,
    (
      f"blocked-source code rows: {', '.join(blocked_source_code_rows) or 'none'}; "
      f"unlabelled code rows: {', '.join(unlabelled_local_code_rows) or 'none'}; "
      f"invalid render-policy rows: {', '.join(sorted(set(invalid_render_policy_rows))) or 'none'}; "
      f"mismatched render-policy rows: {', '.join(sorted(set(mismatched_render_policy_rows))) or 'none'}; "
      f"invalid original-code rows: {', '.join(sorted(set(invalid_original_code_rows))) or 'none'}"
    ),
  )
  add(
    checks,
    "accepted_requires_verified_settings_and_source",
    not accepted_without_verified_source,
    f"invalid accepted rows: {', '.join(accepted_without_verified_source) or 'none'}",
  )
  add(
    checks,
    "source_urls_audit_only",
    not forbidden_case_url_fields,
    f"case rows with forbidden URL fields: {', '.join(forbidden_case_url_fields) or 'none'}",
  )

  js_text = read_text(DATA_JS)
  add(checks, "js_wrapper_global", "window.__TV_STRATEGY_CASES__" in js_text, "wrapper assigns window.__TV_STRATEGY_CASES__")

  index_text = read_text(INDEX_HTML)
  tv_script_pos = index_text.find("data/site/tradingview_strategy_cases.js")
  app_script_pos = index_text.find("app.js")
  add(
    checks,
    "script_load_order",
    tv_script_pos >= 0 and app_script_pos >= 0 and tv_script_pos < app_script_pos,
    "strategy bundle loads before app.js",
  )

  app_text = read_text(APP_JS)
  add(checks, "app_reads_bundle", "readTradingViewStrategyData" in app_text, "app has bundle reader")
  add(checks, "app_has_detail_renderer", "renderTradingViewStrategyCaseDetail" in app_text, "app has detail renderer")
  add(
    checks,
    "no_strategy_source_anchor",
    'href="${escapeHtml(item.sourceUrl)}"' not in app_text,
    "legacy sourceUrl anchor removed from strategy table",
  )
  add(checks, "no_tradingview_widget", "tradingview-widget" not in app_text.lower(), "no TradingView widget surface")

  errors = sum(1 for check in checks if check.status == "error")
  warnings = sum(1 for check in checks if check.status == "warning")
  if errors:
    status = "fail"
  elif warnings:
    status = "pass_with_warnings"
  else:
    status = "pass"
  return status, checks


def write_reports(status: str, checks: list[Check]) -> None:
  generated_at = datetime.now(UTC).isoformat()
  payload = {
    "schemaVersion": 2,
    "generatedAt": generated_at,
    "status": status,
    "passed": sum(1 for check in checks if check.status == "pass"),
    "warnings": sum(1 for check in checks if check.status == "warning"),
    "errors": sum(1 for check in checks if check.status == "error"),
    "checks": [asdict(check) for check in checks],
    "outputs": {"json": str(REPORT_JSON.relative_to(ROOT)), "markdown": str(REPORT_MD.relative_to(ROOT))},
  }
  REPORT_JSON.write_text(dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
  rows = [
    "# TradingView Strategy Case Validation",
    "",
    f"Generated: {generated_at}",
    "",
    f"Status: `{status}`",
    "",
    "| Check | Status | Detail |",
    "| --- | --- | --- |",
  ]
  rows.extend(f"| {check.name} | {check.status} | {check.detail} |" for check in checks)
  REPORT_MD.write_text("\n".join(rows) + "\n", encoding="utf-8")


def main() -> int:
  try:
    status, checks = validate()
    write_reports(status, checks)
  except (OSError, JSONDecodeError) as exc:
    print(f"status=fail error={exc}")
    return 1
  errors = sum(1 for check in checks if check.status == "error")
  warnings = sum(1 for check in checks if check.status == "warning")
  passed = sum(1 for check in checks if check.status == "pass")
  print(f"status={status} passed={passed} warnings={warnings} errors={errors}")
  print(f"report_json={REPORT_JSON.relative_to(ROOT)}")
  print(f"report_markdown={REPORT_MD.relative_to(ROOT)}")
  return 1 if errors else 0


if __name__ == "__main__":
  raise SystemExit(main())
