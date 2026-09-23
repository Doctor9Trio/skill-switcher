---
name: jev-curate
description: High-throughput dataset quality filter scoring JSONL and Parquet data rows for training data and telemetry pipelines.
---

# JEV Curate — High-Throughput Dataset Quality Filter

## Overview
**jev-curate** by Akash Priyadarshi is a high-speed data cleaning and filtering utility. When building dataset pipelines (JSONL, Parquet, CSV), training models, or ingesting millions of telemetry records, traditional LLMs are far too slow and expensive to evaluate every single row. jev-curate streams rows through Jev to evaluate quality, relevance, and toxicity at hundreds of records per second.

## Key Capabilities
- **High-Throughput Scoring**: Evaluates individual rows in sub-50ms batches.
- **Rule-Based Categorization**: Labels data rows with discrete quality grades (`EXCELLENT`, `ADEQUATE`, `DROP`).
- **Telemetry Sanitization**: Strips out malformed GPS pings or corrupted sensor fields before database ingestion.

## How to Trigger
```markdown
/curate-data "Filter telemetry records: drop entries with impossible acceleration deltas or corrupted checksums."
```

## Activation Rules
When this skill is active:
1. Define explicit pass/fail schemas before filtering streaming data rows.
2. Structure data pipelines with deterministic discard gates.
