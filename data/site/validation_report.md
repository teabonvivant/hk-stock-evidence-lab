# P4 Site Data Validation Report

Generated: 2026-07-11T01:57:58.267480+00:00

Status: `pass`

| Gate | Status | Severity | Detail |
|---|---|---|---|
| `site_json_indicator_count_82` | PASS | error | 82 found; expected 82 |
| `site_csv_indicator_count_82` | PASS | error | 82 found; expected 82 |
| `bridge_mapping_count_82` | PASS | error | 82 found; expected 82 |
| `taxonomy_mapping_count_82` | PASS | error | 82 found; expected 82 |
| `research_concept_count_72` | PASS | error | 72 found; expected 72 |
| `expert_count_100` | PASS | error | 100 found; expected 100 |
| `family_count_18` | PASS | error | 18 found; expected 18 |
| `material_count_311` | PASS | error | 311 found; expected 311 |
| `comparison_count_261` | PASS | error | 261 found; expected 261 |
| `winner_count_72` | PASS | error | 72 found; expected 72 |
| `market_case_count_5` | PASS | error | 5 found; expected 5 |
| `site_stats_match_source_counts` | PASS | error | mismatches: [] |
| `site_csv_matches_json_slugs` | PASS | error | csv=82 json=82 |
| `bridge_covers_all_site_slugs` | PASS | error | bridge=82 site=82 |
| `site_csv_primary_concepts_match_bridge` | PASS | error | mismatches=[] |
| `bridge_primary_concepts_exist` | PASS | error | missing=[] |
| `bridge_all_concepts_exist` | PASS | error | missing=[] |
| `winner_rows_cover_research_concepts` | PASS | error | profiles=72 winners=72 |
| `comparison_rows_cover_research_concepts` | PASS | error | missing=[] |
| `indicator_formula_fields_present` | PASS | error | missing=[] |
| `taxonomy_frontend_slugs_unique` | PASS | error | frontend slug uniqueness checked |
| `taxonomy_primary_concepts_populated` | PASS | error | blank=0 |
| `taxonomy_relation_counts_match_stats` | PASS | error | actual={'merge': 23, 'alias': 17, 'exact': 26, 'split': 16} stats={'merge': 23, 'alias': 17, 'exact': 26, 'split': 16} |
| `taxonomy_review_items_tracked` | PASS | error | 64 merge/split/medium-confidence review markers accepted |
| `evidence_stats_match_materials` | PASS | error | actual={'medium': 222, 'high': 89} stats={'medium': 222, 'high': 89} |
| `evidence_review_flags_count_match` | PASS | error | csv=240 json=240 |
| `evidence_review_flags_described` | PASS | error | blank flag rows=[] |
| `evidence_low_review_rows_accepted` | PASS | error | 13 low-review evidence rows accepted as support-only |
| `site_runner_up_warning_markers` | PASS | warning | 0 site rows lack runner-up text/status |
| `multi_expert_runner_up_warnings` | PASS | warning | 0 multi-expert concepts lack runner-up text/status: [] |
| `market_case_sets_match_site_summary` | PASS | error | raw=5 site=5 |
| `market_cases_have_usable_bars` | PASS | error | bad=[] |
| `market_case_dates_and_counts_match` | PASS | error | bad=[] |
| `market_cases_cover_us_and_hk` | PASS | error | markets=['HK', 'US'] |
| `market_js_wrapper_shape` | PASS | error | window.__MARKET_CASES__ assignment checked |
| `readiness_overlay_policy_fields` | PASS | error | fields=['failureConditionReadiness', 'formulaReadiness', 'marketDataStatus', 'quantCaveat', 'sourceReadiness', 'tradePlaybookReadiness'] |
| `readiness_overlay_market_caveats` | PASS | error | unused=['momentumBreakout'] |
| `site_js_wrapper_shape` | PASS | error | window.__TI_DATA__ assignment checked |
| `readiness_js_wrapper_shape` | PASS | error | window.__TI_READINESS__ assignment checked |
| `script_load_order_market_site_readiness_app` | PASS | error | positions={'data/market_cases_yahoo.js': 0, 'data/site/technical_indicators_site_data.js': 1, 'data/site/site_readiness_overlay.js': 2, 'app.js': 4} |
| `app_reads_site_bundle_conditionally` | PASS | error | conditional site data read checked |
| `static_fallback_paths_present` | PASS | error | missing=[] |
| `no_static_yahoo_fallback_copy` | PASS | error | a missing market snapshot cannot leave a static Yahoo Finance label behind |
| `app_rejects_malformed_site_bundle` | PASS | error | site bundle requires schema, indicators, and stats before loaded=true |
| `app_reads_readiness_overlay` | PASS | error | readiness overlay drives P2/market caveat copy |
| `tradingview_strategy_validation_status` | PASS | error | status=pass_with_warnings; errors=0 |
| `tradingview_strategy_validation_report_fresh` | PASS | error | generatedAt=2026-07-11T01:57:43.866799+00:00; stale_dependencies=[] |
| `tradingview_strategy_policy_checks` | PASS | error | missing/failing=[] |

Outputs:
- json: `data/site/validation_report.json`
- markdown: `data/site/validation_report.md`
