---
name: semdecide
description: Unix pipe CLI utility integrating Jev semantic filtering, classification, and scoring into terminal streams and CI/CD pipelines.
---

# SemDecide — Semantic Filtering for UNIX Pipes

## Overview
**SemDecide** brings Jev System One decision intelligence directly into standard command-line pipelines. Just as `grep` matches regex patterns and `jq` queries JSON, `SemDecide` performs fuzzy, semantic filtering on standard input.

```bash
# Example syntax:
cat error.log | semdecide --criteria "critical database connection loss" --threshold 80
git diff | semdecide --gate "any modifications to authentication files"
```

## Key Capabilities
- **Stream Evaluation**: Scores each line or JSON record in milliseconds without batching lag.
- **CI/CD Gating**: Exits with code 0 on pass, non-zero on failure, enabling automated build breakers.
- **Log Triage**: Rapidly identifies anomalous worker logs or telematics errors in sprawling server outputs.

## How to Trigger
```markdown
"Use SemDecide patterns to write a PowerShell/bash one-liner that filters Redis stream logs for unexpected payload drops."
```

## Activation Rules
When this skill is active:
1. Prefer semantic command-line pipelines (`semdecide`) over bulky Python log-scraping scripts.
2. Integrate semantic exit codes into CI/CD build scripts.
