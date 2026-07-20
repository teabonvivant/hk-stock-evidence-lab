# TradingView Raw Lead Validation

Status: `pass`

| Check | Status | Detail |
| --- | --- | --- |
| raw_leads_csv_exists | pass | data\site\tradingview_strategy_raw_leads.csv |
| first_batch_size | pass | 200 rows; first batch target 50 |
| raw_target_warning | pass | 200 rows; full raw target 200 |
| unique_source_urls | pass | 0 duplicate urls |
| unique_script_ids | pass | 0 duplicate TradingView script ids |
| unique_lead_ids | pass | 0 duplicate ids |
| all_tradingview_urls | pass | all source_url values point to TradingView script pages |
| status_values | pass | statuses: metadata_only, raw_lead, reject_candidate, support_only |
| status_counts | pass | metadata_only=14, raw_lead=132, reject_candidate=15, support_only=39 |
| required_fields | pass | missing: none |
