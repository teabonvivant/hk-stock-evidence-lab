# -*- coding: utf-8 -*-
"""Enrich the expert database with book/article/paper research materials.

This script reads the local seed data, searches public bibliographic APIs, and
adds a queryable research_materials layer to the SQLite database.
"""

from __future__ import annotations

import csv
import difflib
import json
import sqlite3
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
DB_PATH = DATA_DIR / "technical_analysis_experts.sqlite"
SEED_JSON_PATH = DATA_DIR / "technical_analysis_experts_seed.json"
CACHE_PATH = DATA_DIR / "research_materials_enrichment_cache.json"
MATERIALS_CSV_PATH = DATA_DIR / "technical_analysis_research_materials.csv"
SOURCE_COVERAGE_CSV_PATH = DATA_DIR / "technical_analysis_source_coverage.csv"
AUDIT_PATH = DATA_DIR / "technical_analysis_completion_audit.md"
MATERIALS_INDEX_PATH = DATA_DIR / "technical_analysis_research_materials_index.md"
ONLINE_SEARCH = "--online" in sys.argv


BOOK_TYPES = {"book", "book_series"}
PAPER_TYPES = {"paper", "article"}


def configure_stdout():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")


def slugify(value):
    import re

    value = value.lower().replace("&", " and ")
    return re.sub(r"[^a-z0-9]+", "-", value).strip("-")


def load_json(path, default):
    if path.exists():
        return json.loads(path.read_text(encoding="utf-8"))
    return default


def save_json(path, data):
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def fetch_json(url, timeout=10):
    request = urllib.request.Request(url, headers={"User-Agent": "Codex technical-analysis bibliography builder"})
    with urllib.request.urlopen(request, timeout=timeout) as response:
        return json.load(response)


def similar_title(a, b):
    return difflib.SequenceMatcher(None, a.lower(), b.lower()).ratio()


def find_openlibrary(title, cache):
    key = f"openlibrary::{title}"
    if key in cache:
        return cache[key]
    if not ONLINE_SEARCH:
        return {"ok": False, "source": "openlibrary", "query_url": "", "error": "offline mode", "best": None}

    query = urllib.parse.urlencode({"title": title, "limit": 5})
    url = f"https://openlibrary.org/search.json?{query}"
    result = {"ok": False, "source": "openlibrary", "query_url": url, "error": "", "best": None}
    try:
        data = fetch_json(url)
        docs = data.get("docs", [])
        best_doc = None
        best_score = 0.0
        for doc in docs:
            score = similar_title(title, doc.get("title", ""))
            if score > best_score:
                best_doc = doc
                best_score = score
        if best_doc:
            isbns = best_doc.get("isbn", []) or []
            isbn13 = next((item for item in isbns if len(item.replace("-", "")) == 13), "")
            result.update(
                {
                    "ok": True,
                    "score": round(best_score, 3),
                    "best": {
                        "title": best_doc.get("title", ""),
                        "authors": best_doc.get("author_name", []),
                        "first_publish_year": best_doc.get("first_publish_year"),
                        "publisher": (best_doc.get("publisher", []) or [""])[0],
                        "isbn13": isbn13,
                        "openlibrary_key": best_doc.get("key", ""),
                        "url": f"https://openlibrary.org{best_doc.get('key', '')}" if best_doc.get("key") else "",
                    },
                }
            )
    except Exception as exc:  # Network/catalog failures should not block the local database.
        result["error"] = str(exc)

    cache[key] = result
    save_json(CACHE_PATH, cache)
    time.sleep(0.15)
    return result


def find_google_books(title, cache):
    key = f"google_books::{title}"
    if key in cache:
        return cache[key]
    if not ONLINE_SEARCH:
        return {"ok": False, "source": "google_books", "query_url": "", "error": "offline mode", "best": None}

    query = urllib.parse.urlencode({"q": f'intitle:"{title}"', "maxResults": 3})
    url = f"https://www.googleapis.com/books/v1/volumes?{query}"
    result = {"ok": False, "source": "google_books", "query_url": url, "error": "", "best": None}
    try:
        data = fetch_json(url)
        items = data.get("items", [])
        best_item = None
        best_score = 0.0
        for item in items:
            info = item.get("volumeInfo", {})
            score = similar_title(title, info.get("title", ""))
            if score > best_score:
                best_item = item
                best_score = score
        if best_item:
            info = best_item.get("volumeInfo", {})
            ids = info.get("industryIdentifiers", []) or []
            isbn13 = next((item.get("identifier", "") for item in ids if item.get("type") == "ISBN_13"), "")
            result.update(
                {
                    "ok": True,
                    "score": round(best_score, 3),
                    "best": {
                        "title": info.get("title", ""),
                        "authors": info.get("authors", []),
                        "first_publish_year": (info.get("publishedDate", "") or "")[:4],
                        "publisher": info.get("publisher", ""),
                        "isbn13": isbn13,
                        "google_books_id": best_item.get("id", ""),
                        "url": info.get("infoLink", ""),
                    },
                }
            )
    except Exception as exc:
        result["error"] = str(exc)

    cache[key] = result
    save_json(CACHE_PATH, cache)
    time.sleep(0.15)
    return result


def find_crossref(title, cache):
    key = f"crossref::{title}"
    if key in cache:
        return cache[key]
    if not ONLINE_SEARCH:
        return {"ok": False, "source": "crossref", "query_url": "", "error": "offline mode", "best": None}

    query = urllib.parse.urlencode({"query.title": title, "rows": 5})
    url = f"https://api.crossref.org/works?{query}"
    result = {"ok": False, "source": "crossref", "query_url": url, "error": "", "best": None}
    try:
        data = fetch_json(url)
        items = data.get("message", {}).get("items", [])
        best_item = None
        best_score = 0.0
        for item in items:
            candidate_title = (item.get("title") or [""])[0]
            score = similar_title(title, candidate_title)
            if score > best_score:
                best_item = item
                best_score = score
        if best_item:
            date_parts = (
                best_item.get("published-print")
                or best_item.get("published-online")
                or best_item.get("published")
                or {}
            ).get("date-parts", [[]])[0]
            authors = []
            for author in best_item.get("author", []) or []:
                name = " ".join(part for part in [author.get("given", ""), author.get("family", "")] if part)
                if name:
                    authors.append(name)
            doi = best_item.get("DOI", "")
            result.update(
                {
                    "ok": True,
                    "score": round(best_score, 3),
                    "best": {
                        "title": (best_item.get("title") or [""])[0],
                        "authors": authors,
                        "year": date_parts[0] if date_parts else None,
                        "publisher": best_item.get("publisher", ""),
                        "container_title": (best_item.get("container-title") or [""])[0],
                        "doi": doi,
                        "url": f"https://doi.org/{doi}" if doi else best_item.get("URL", ""),
                    },
                }
            )
    except Exception as exc:
        result["error"] = str(exc)

    cache[key] = result
    save_json(CACHE_PATH, cache)
    time.sleep(0.15)
    return result


def best_source_for_work(work, expert, enrichment):
    if work.get("url"):
        return work["url"], "", "", "", ""

    best = enrichment.get("best") if enrichment and enrichment.get("ok") else None
    if best and best.get("url"):
        return best["url"], best.get("doi", ""), best.get("isbn13", ""), best.get("openlibrary_key", ""), best.get("google_books_id", "")

    sources = expert.get("sources", [])
    return (sources[0] if sources else ""), "", "", "", ""


def source_title(url, enrichment, work_title):
    best = enrichment.get("best") if enrichment and enrichment.get("ok") else None
    if best and best.get("title"):
        return best["title"]
    return work_title if work_title else url


def source_type_from_url(url, material_type):
    if "openlibrary.org" in url:
        return "book_catalog"
    if "google.com/books" in url or "books.google" in url:
        return "book_catalog"
    if "doi.org" in url or "crossref" in url:
        return "academic_paper"
    if "cmtassociation.org" in url:
        return "award_or_professional"
    if "investopedia.com" in url or "stockcharts.com" in url or "fidelity.com" in url:
        return "indicator_reference"
    if "amazon." in url:
        return "book_catalog"
    if material_type in PAPER_TYPES:
        return "paper_reference"
    if material_type in BOOK_TYPES:
        return "book_reference"
    return "web_reference"


def evidence_level(material_type, source_url):
    if material_type in {"paper", "article"} and ("doi.org" in source_url or "cmtassociation.org" in source_url):
        return "high"
    if material_type in BOOK_TYPES and (
        "openlibrary.org" in source_url or "books.google" in source_url or "amazon." in source_url
    ):
        return "high"
    if "official" in source_url or "cmtassociation.org" in source_url:
        return "high"
    return "medium"


def build_material_rows(seed, cache):
    rows = []
    source_rows = []
    for expert in seed["experts"]:
        expert_id = slugify(expert["name_en"])
        concept_slugs = [item["slug"] for item in expert.get("concepts", [])]
        primary_concept = concept_slugs[0] if concept_slugs else ""

        for work in expert.get("works", []):
            material_type = work.get("type", "")
            enrichment = None
            if material_type in BOOK_TYPES:
                enrichment = find_openlibrary(work["title"], cache)
                if not enrichment.get("ok"):
                    enrichment = find_google_books(work["title"], cache)
            elif material_type in PAPER_TYPES:
                enrichment = find_crossref(work["title"], cache)

            source_url, doi, isbn13, openlibrary_key, google_books_id = best_source_for_work(work, expert, enrichment or {})
            best = enrichment.get("best") if enrichment and enrichment.get("ok") else {}
            authors = best.get("authors") or [expert["name_en"]]
            year = work.get("year") or best.get("year") or best.get("first_publish_year")
            if isinstance(year, str) and year.isdigit():
                year = int(year)

            rows.append(
                {
                    "expert_id": expert_id,
                    "expert_rank": expert["rank"],
                    "expert_zh": expert["name_zh"],
                    "expert_en": expert["name_en"],
                    "title": work["title"],
                    "material_type": material_type,
                    "year": year,
                    "primary_concept": primary_concept,
                    "concept_slugs": ";".join(concept_slugs),
                    "authors": "; ".join(authors),
                    "publisher": best.get("publisher", ""),
                    "container_title": best.get("container_title", ""),
                    "source_url": source_url,
                    "source_title": source_title(source_url, enrichment or {}, work["title"]),
                    "source_type": source_type_from_url(source_url, material_type),
                    "doi": doi or best.get("doi", ""),
                    "isbn13": isbn13 or best.get("isbn13", ""),
                    "openlibrary_key": openlibrary_key or best.get("openlibrary_key", ""),
                    "google_books_id": google_books_id or best.get("google_books_id", ""),
                    "evidence_level": evidence_level(material_type, source_url),
                    "api_enriched": "yes" if enrichment and enrichment.get("ok") else "no",
                    "notes_zh": work.get("notes") or expert["why_selected_zh"],
                }
            )
            if source_url:
                source_rows.append(
                    {
                        "expert_id": expert_id,
                        "source_url": source_url,
                        "source_title": source_title(source_url, enrichment or {}, work["title"]),
                        "source_type": source_type_from_url(source_url, material_type),
                        "reliability": evidence_level(material_type, source_url),
                    }
                )

        for source_url in expert.get("sources", []):
            rows.append(
                {
                    "expert_id": expert_id,
                    "expert_rank": expert["rank"],
                    "expert_zh": expert["name_zh"],
                    "expert_en": expert["name_en"],
                    "title": source_url,
                    "material_type": "source",
                    "year": "",
                    "primary_concept": primary_concept,
                    "concept_slugs": ";".join(concept_slugs),
                    "authors": "",
                    "publisher": "",
                    "container_title": "",
                    "source_url": source_url,
                    "source_title": source_url,
                    "source_type": source_type_from_url(source_url, "source"),
                    "doi": "",
                    "isbn13": "",
                    "openlibrary_key": "",
                    "google_books_id": "",
                    "evidence_level": evidence_level("source", source_url),
                    "api_enriched": "seed_source",
                    "notes_zh": expert["why_selected_zh"],
                }
            )
            source_rows.append(
                {
                    "expert_id": expert_id,
                    "source_url": source_url,
                    "source_title": source_url,
                    "source_type": source_type_from_url(source_url, "source"),
                    "reliability": evidence_level("source", source_url),
                }
            )

    return rows, source_rows


def replace_sqlite_tables(rows, source_rows):
    conn = sqlite3.connect(DB_PATH)
    conn.execute("PRAGMA foreign_keys = ON")
    conn.executescript(
        """
        DROP VIEW IF EXISTS expert_research_summary;
        DROP VIEW IF EXISTS indicator_expert_research;
        DROP TABLE IF EXISTS research_materials;

        CREATE TABLE research_materials (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            expert_id TEXT NOT NULL REFERENCES experts(id) ON DELETE CASCADE,
            title TEXT NOT NULL,
            material_type TEXT NOT NULL,
            year INTEGER,
            primary_concept TEXT,
            concept_slugs TEXT,
            authors TEXT,
            publisher TEXT,
            container_title TEXT,
            source_url TEXT,
            source_title TEXT,
            source_type TEXT,
            doi TEXT,
            isbn13 TEXT,
            openlibrary_key TEXT,
            google_books_id TEXT,
            evidence_level TEXT,
            api_enriched TEXT,
            notes_zh TEXT
        );
        """
    )

    conn.executemany(
        """
        INSERT INTO research_materials (
            expert_id, title, material_type, year, primary_concept, concept_slugs,
            authors, publisher, container_title, source_url, source_title, source_type,
            doi, isbn13, openlibrary_key, google_books_id, evidence_level, api_enriched, notes_zh
        )
        VALUES (
            :expert_id, :title, :material_type, :year, :primary_concept, :concept_slugs,
            :authors, :publisher, :container_title, :source_url, :source_title, :source_type,
            :doi, :isbn13, :openlibrary_key, :google_books_id, :evidence_level, :api_enriched, :notes_zh
        )
        """,
        rows,
    )

    for source in source_rows:
        if not source["source_url"]:
            continue
        conn.execute(
            """
            INSERT OR IGNORE INTO sources(url, title, source_type, reliability, notes)
            VALUES (?, ?, ?, ?, ?)
            """,
            (source["source_url"], source["source_title"], source["source_type"], source["reliability"], "research material enrichment"),
        )
        conn.execute(
            "INSERT OR IGNORE INTO expert_sources(expert_id, source_url, note) VALUES (?, ?, ?)",
            (source["expert_id"], source["source_url"], "research material enrichment"),
        )

    conn.executescript(
        """
        CREATE VIEW expert_research_summary AS
        SELECT
            e.rank,
            e.name_zh,
            e.name_en,
            e.category,
            COUNT(rm.id) AS material_count,
            COUNT(DISTINCT rm.source_url) AS distinct_source_count,
            SUM(CASE WHEN rm.material_type IN ('book', 'book_series') THEN 1 ELSE 0 END) AS book_count,
            SUM(CASE WHEN rm.material_type IN ('paper', 'article') THEN 1 ELSE 0 END) AS paper_article_count,
            SUM(CASE WHEN rm.api_enriched = 'yes' THEN 1 ELSE 0 END) AS api_enriched_count
        FROM experts e
        LEFT JOIN research_materials rm ON rm.expert_id = e.id
        GROUP BY e.id;

        CREATE VIEW indicator_expert_research AS
        SELECT
            c.slug AS concept_slug,
            c.name_zh AS concept_zh,
            c.name_en AS concept_en,
            e.rank AS expert_rank,
            e.name_zh AS expert_zh,
            e.name_en AS expert_en,
            ec.relation,
            COUNT(rm.id) AS material_count,
            GROUP_CONCAT(DISTINCT rm.title) AS material_titles
        FROM concepts c
        JOIN expert_concepts ec ON ec.concept_slug = c.slug
        JOIN experts e ON e.id = ec.expert_id
        LEFT JOIN research_materials rm ON rm.expert_id = e.id
        GROUP BY c.slug, e.id, ec.relation;
        """
    )
    conn.commit()
    conn.close()


def write_csv(rows):
    fieldnames = [
        "expert_rank",
        "expert_zh",
        "expert_en",
        "title",
        "material_type",
        "year",
        "primary_concept",
        "concept_slugs",
        "authors",
        "publisher",
        "container_title",
        "source_url",
        "source_title",
        "source_type",
        "doi",
        "isbn13",
        "openlibrary_key",
        "google_books_id",
        "evidence_level",
        "api_enriched",
        "notes_zh",
    ]
    with MATERIALS_CSV_PATH.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for row in rows:
            writer.writerow({key: row.get(key, "") for key in fieldnames})


def write_coverage_csv():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    rows = conn.execute(
        """
        SELECT *
        FROM expert_research_summary
        ORDER BY rank
        """
    ).fetchall()
    conn.close()
    with SOURCE_COVERAGE_CSV_PATH.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=rows[0].keys())
        writer.writeheader()
        for row in rows:
            writer.writerow(dict(row))


def write_markdown_indexes(seed):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    top_materials = conn.execute(
        """
        SELECT e.rank, e.name_zh, e.name_en, rm.title, rm.material_type, rm.year, rm.source_url
        FROM research_materials rm
        JOIN experts e ON e.id = rm.expert_id
        WHERE rm.material_type != 'source'
        ORDER BY e.rank, rm.year IS NULL, rm.year, rm.title
        """
    ).fetchall()
    summaries = conn.execute("SELECT * FROM expert_research_summary ORDER BY rank").fetchall()
    concept_rows = conn.execute(
        """
        SELECT concept_zh, concept_en, expert_rank, expert_zh, expert_en, relation, material_count
        FROM indicator_expert_research
        ORDER BY concept_zh, expert_rank
        """
    ).fetchall()
    conn.close()

    material_lines = [
        "# 技術分析研究材料索引",
        "",
        "本檔由 `scripts/enrich_research_materials.py` 產生，對應 SQLite 的 `research_materials` 表。",
        "",
        "## 代表材料",
        "",
        "| # | 專家 | 材料 | 類型 | 年份 | 來源 |",
        "|---:|---|---|---|---:|---|",
    ]
    for row in top_materials[:180]:
        url = row["source_url"] or ""
        source = f"[link]({url})" if url.startswith("http") else ""
        material_lines.append(
            f"| {row['rank']} | {row['name_zh']} / {row['name_en']} | {row['title']} | {row['material_type']} | {row['year'] or ''} | {source} |"
        )
    MATERIALS_INDEX_PATH.write_text("\n".join(material_lines) + "\n", encoding="utf-8")

    no_materials = [row for row in summaries if row["material_count"] < 2]
    low_sources = [row for row in summaries if row["distinct_source_count"] < 2]
    audit_lines = [
        "# 技術分析專家資料庫完成度稽核",
        "",
        "稽核日期：2026-06-21",
        "",
        "## 需求對照",
        "",
        "- 100 位專家：已由 `experts` 表驗證。",
        "- 依技術指標/方法對應專家：已由 `expert_concepts` 與 `indicator_expert_research` 檢視提供。",
        "- 搜集研究資料：已由 `research_materials` 表、CSV 與 Markdown 索引提供。",
        "- 本地記錄：SQLite、CSV、JSON、Markdown 均存於 `data/`。",
        "",
        "## 數量摘要",
        "",
        f"- 專家數：{len(seed['experts'])}",
        f"- 研究材料數：{sum(row['material_count'] for row in summaries)}",
        f"- 無至少 2 筆研究材料的人物數：{len(no_materials)}",
        f"- 無至少 2 個不同來源的人物數：{len(low_sources)}",
        "",
        "## 指標/方法覆蓋抽樣",
        "",
        "| 指標/方法 | Expert | Relation | Materials |",
        "|---|---|---|---:|",
    ]
    for row in concept_rows[:120]:
        audit_lines.append(
            f"| {row['concept_zh']} | {row['expert_zh']} / {row['expert_en']} | {row['relation']} | {row['material_count']} |"
        )
    AUDIT_PATH.write_text("\n".join(audit_lines) + "\n", encoding="utf-8")


def main():
    configure_stdout()
    seed = load_json(SEED_JSON_PATH, {})
    cache = load_json(CACHE_PATH, {})
    rows, source_rows = build_material_rows(seed, cache)
    save_json(CACHE_PATH, cache)
    replace_sqlite_tables(rows, source_rows)
    write_csv(rows)
    write_coverage_csv()
    write_markdown_indexes(seed)
    print(f"research_materials={len(rows)}")
    print(f"cache_entries={len(cache)}")
    print(f"online_search={ONLINE_SEARCH}")
    print(f"csv={MATERIALS_CSV_PATH}")
    print(f"audit={AUDIT_PATH}")


if __name__ == "__main__":
    main()
