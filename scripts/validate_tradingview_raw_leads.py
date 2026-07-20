# /// script
# requires-python = ">=3.11"
# ///
# --- How to run ---
# python scripts\validate_tradingview_raw_leads.py
from __future__ import annotations

from csv import DictReader
from dataclasses import asdict, dataclass
from json import dumps
from pathlib import Path
from re import search
from typing import Final


ROOT: Final = Path(__file__).resolve().parents[1]
RAW_LEADS_CSV: Final = ROOT / "data" / "site" / "tradingview_strategy_raw_leads.csv"
REPORT_JSON: Final = ROOT / "data" / "site" / "tradingview_raw_lead_validation_report.json"
REPORT_MD: Final = ROOT / "data" / "site" / "tradingview_raw_lead_validation_report.md"
TARGET_RAW_LEADS: Final = 200
MIN_FIRST_BATCH: Final = 50


@dataclass(frozen=True, slots=True)
class Check:
  name: str
  status: str
  detail: str


def add(checks: list[Check], name: str, ok: bool, detail: str, warning: bool = False) -> None:
  status = "pass" if ok else ("warning" if warning else "error")
  checks.append(Check(name=name, status=status, detail=detail))


def read_rows() -> list[dict[str, str]]:
  with RAW_LEADS_CSV.open(encoding="utf-8", newline="") as handle:
    return list(DictReader(handle))


def validate() -> tuple[str, list[Check]]:
  checks: list[Check] = []
  add(checks, "raw_leads_csv_exists", RAW_LEADS_CSV.exists(), str(RAW_LEADS_CSV.relative_to(ROOT)))

  rows = read_rows()
  urls = [row.get("source_url", "").strip() for row in rows]
  ids = [row.get("lead_id", "").strip() for row in rows]
  statuses = {row.get("preliminary_status", "").strip() for row in rows}
  script_ids = [match.group(1) for url in urls if (match := search(r"/script/([^/?#]+)/?", url))]
  status_counts = {status: sum(1 for row in rows if row.get("preliminary_status", "").strip() == status) for status in sorted(statuses)}

  add(checks, "first_batch_size", len(rows) >= MIN_FIRST_BATCH, f"{len(rows)} rows; first batch target {MIN_FIRST_BATCH}")
  add(checks, "raw_target_warning", len(rows) >= TARGET_RAW_LEADS, f"{len(rows)} rows; full raw target {TARGET_RAW_LEADS}", warning=True)
  add(checks, "unique_source_urls", len(urls) == len(set(urls)), f"{len(urls) - len(set(urls))} duplicate urls")
  add(checks, "unique_script_ids", len(script_ids) == len(set(script_ids)), f"{len(script_ids) - len(set(script_ids))} duplicate TradingView script ids")
  add(checks, "unique_lead_ids", len(ids) == len(set(ids)), f"{len(ids) - len(set(ids))} duplicate ids")
  add(checks, "all_tradingview_urls", all("tradingview.com/script/" in url for url in urls), "all source_url values point to TradingView script pages")
  allowed_statuses = {"raw_lead", "support_only", "metadata_only", "reject_candidate"}
  add(checks, "status_values", statuses <= allowed_statuses, f"statuses: {', '.join(sorted(statuses))}")
  add(checks, "status_counts", True, ", ".join(f"{status}={count}" for status, count in status_counts.items()))

  missing_required = []
  required = [
    "lead_id",
    "title",
    "source_url",
    "apparent_type",
    "visibility_hint",
    "metric_signal",
    "preliminary_status",
    "source_checked_at",
    "notes",
  ]
  for row in rows:
    missing = [field for field in required if not row.get(field, "").strip()]
    if missing:
      missing_required.append(f"{row.get('lead_id', 'unknown')}:{'/'.join(missing)}")
  add(checks, "required_fields", not missing_required, f"missing: {', '.join(missing_required) or 'none'}")

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
  payload = {
    "status": status,
    "passed": sum(1 for check in checks if check.status == "pass"),
    "warnings": sum(1 for check in checks if check.status == "warning"),
    "errors": sum(1 for check in checks if check.status == "error"),
    "checks": [asdict(check) for check in checks],
  }
  REPORT_JSON.write_text(dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
  lines = [
    "# TradingView Raw Lead Validation",
    "",
    f"Status: `{status}`",
    "",
    "| Check | Status | Detail |",
    "| --- | --- | --- |",
  ]
  lines.extend(f"| {check.name} | {check.status} | {check.detail} |" for check in checks)
  REPORT_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> int:
  status, checks = validate()
  write_reports(status, checks)
  passed = sum(1 for check in checks if check.status == "pass")
  warnings = sum(1 for check in checks if check.status == "warning")
  errors = sum(1 for check in checks if check.status == "error")
  print(f"status={status} passed={passed} warnings={warnings} errors={errors}")
  return 1 if errors else 0


if __name__ == "__main__":
  raise SystemExit(main())
