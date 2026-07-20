# /// script
# requires-python = ">=3.11"
# ///
# --- How to run ---
# python scripts\merge_tradingview_raw_leads.py
from __future__ import annotations

from csv import DictReader, DictWriter
from dataclasses import dataclass
from pathlib import Path
from re import search
from typing import Final, Mapping


ROOT: Final = Path(__file__).resolve().parents[1]
RAW_LEADS_CSV: Final = ROOT / "data" / "site" / "tradingview_strategy_raw_leads.csv"
BATCH_DIR: Final = ROOT / ".omo" / "evidence" / "tradingview-raw-leads-20260703"
TARGET_RAW_LEADS: Final = 200
ALLOWED_STATUSES: Final = {"raw_lead", "support_only", "metadata_only", "reject_candidate"}
COLUMNS: Final = [
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


@dataclass(frozen=True, slots=True)
class RawLead:
  lead_id: str
  title: str
  source_url: str
  apparent_type: str
  visibility_hint: str
  metric_signal: str
  preliminary_status: str
  source_checked_at: str
  notes: str

  @classmethod
  def from_mapping(cls, record: Mapping[str, str]) -> RawLead:
    return cls(
      lead_id=field(record, "lead_id"),
      title=field(record, "title"),
      source_url=field(record, "source_url"),
      apparent_type=field(record, "apparent_type"),
      visibility_hint=field(record, "visibility_hint"),
      metric_signal=field(record, "metric_signal"),
      preliminary_status=field(record, "preliminary_status"),
      source_checked_at=field(record, "source_checked_at"),
      notes=field(record, "notes"),
    )

  def with_id(self, lead_id: str) -> RawLead:
    return RawLead(
      lead_id=lead_id,
      title=self.title,
      source_url=self.source_url,
      apparent_type=self.apparent_type,
      visibility_hint=self.visibility_hint,
      metric_signal=self.metric_signal,
      preliminary_status=self.preliminary_status,
      source_checked_at=self.source_checked_at,
      notes=self.notes,
    )

  def as_row(self) -> dict[str, str]:
    return {
      "lead_id": self.lead_id,
      "title": self.title,
      "source_url": self.source_url,
      "apparent_type": self.apparent_type,
      "visibility_hint": self.visibility_hint,
      "metric_signal": self.metric_signal,
      "preliminary_status": self.preliminary_status,
      "source_checked_at": self.source_checked_at,
      "notes": self.notes,
    }


def field(record: Mapping[str, str], key: str) -> str:
  return (record.get(key) or "").strip()


def script_key(url: str) -> str:
  match = search(r"/script/([^/?#]+)/?", url)
  return match.group(1).lower() if match else url.strip().lower()


def read_leads(path: Path) -> list[RawLead]:
  if not path.exists():
    return []
  with path.open(encoding="utf-8", newline="") as handle:
    return [RawLead.from_mapping(row) for row in DictReader(handle)]


def batch_paths() -> list[Path]:
  return sorted(BATCH_DIR.glob("research-batch-*.csv")) if BATCH_DIR.exists() else []


def valid_candidate(lead: RawLead) -> bool:
  return (
    bool(lead.source_url)
    and "tradingview.com/script/" in lead.source_url
    and bool(lead.title)
    and lead.preliminary_status in ALLOWED_STATUSES
  )


def merged_leads() -> list[RawLead]:
  merged: list[RawLead] = []
  seen: set[str] = set()
  for lead in [*read_leads(RAW_LEADS_CSV), *[item for path in batch_paths() for item in read_leads(path)]]:
    key = script_key(lead.source_url)
    if key in seen or not valid_candidate(lead):
      continue
    seen.add(key)
    merged.append(lead)
    if len(merged) >= TARGET_RAW_LEADS:
      break
  return [lead.with_id(f"TVL-{index:04d}") for index, lead in enumerate(merged, start=1)]


def write_leads(leads: list[RawLead]) -> None:
  with RAW_LEADS_CSV.open("w", encoding="utf-8", newline="") as handle:
    writer = DictWriter(handle, fieldnames=COLUMNS)
    writer.writeheader()
    writer.writerows(lead.as_row() for lead in leads)


def main() -> int:
  leads = merged_leads()
  write_leads(leads)
  print(f"merged_raw_leads={len(leads)} target={TARGET_RAW_LEADS} batches={len(batch_paths())}")
  return 0 if len(leads) >= TARGET_RAW_LEADS else 1


if __name__ == "__main__":
  raise SystemExit(main())
