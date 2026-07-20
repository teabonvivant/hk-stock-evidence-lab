# TradingView Strategy Case Validation

Generated: 2026-07-11T01:57:43.866799+00:00

Status: `pass_with_warnings`

| Check | Status | Detail |
| --- | --- | --- |
| file_exists:tradingview_strategy_cases.json | pass | data\site\tradingview_strategy_cases.json |
| file_exists:tradingview_strategy_cases.js | pass | data\site\tradingview_strategy_cases.js |
| file_exists:tradingview_strategy_raw_leads.csv | pass | data\site\tradingview_strategy_raw_leads.csv |
| file_exists:index.html | pass | index.html |
| file_exists:app.js | pass | app.js |
| schema_version | pass | schemaVersion >= 1 |
| target_accepted_cases | pass | targetAcceptedCases must stay 100 |
| raw_lead_target | pass | rawLeadTarget should over-collect |
| raw_leads_collected_matches_csv | pass | bundle=200; stats=200; csv=200 |
| cases_present | pass | 10 cases |
| source_evidence_present | pass | 10 evidence rows |
| json_js_bundle_parity | pass | JSON and JS bundle expose the same schema, stats, cases, and sourceEvidence |
| include_status_values | pass | invalid rows: none |
| accepted_count_matches | pass | accepted=0 |
| support_only_count_matches | pass | support-only=8 |
| rejected_count_matches | pass | rejected=2 |
| accepted_target_warning | warning | accepted=0; target=100 |
| required_case_fields | pass | missing: none |
| settings_audit_present | pass | missing: none |
| settings_profiles_present | pass | invalid rows: none |
| script_code_audit_present | pass | invalid rows: none |
| source_evidence_ids_match | pass | mismatched rows: none |
| script_code_provenance_safe | pass | blocked-source code rows: none; unlabelled code rows: none; invalid render-policy rows: none; mismatched render-policy rows: none; invalid original-code rows: none |
| accepted_requires_verified_settings_and_source | pass | invalid accepted rows: none |
| source_urls_audit_only | pass | case rows with forbidden URL fields: none |
| js_wrapper_global | pass | wrapper assigns window.__TV_STRATEGY_CASES__ |
| script_load_order | pass | strategy bundle loads before app.js |
| app_reads_bundle | pass | app has bundle reader |
| app_has_detail_renderer | pass | app has detail renderer |
| no_strategy_source_anchor | pass | legacy sourceUrl anchor removed from strategy table |
| no_tradingview_widget | pass | no TradingView widget surface |
