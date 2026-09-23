---
name: jev-review
description: Rapid pre-flight git diff reviewer scoring PRs and commits on security, secrets, breaking changes, and architectural violations.
---

# JEV Review — Pre-Flight Git Diff Reviewer

## Overview
**jev-review** by devagrawal09 is a high-speed diff audit tool. Instead of requiring a full multi-minute LLM code review cycle for every incremental commit, Jev Review scores diffs against strict security rubrics in milliseconds, flagging high-risk lines and catching regressions before commit.

## Evaluation Categories
1. **Secrets & Credentials**: Detects API keys, private tokens, passwords, and `.env` additions.
2. **Forbidden File Paths**: Flags modifications to protected core directories or frozen libraries.
3. **Sensitive Field Leakage**: Catches serialization of internal fields (e.g., telemetry internals, passwords, PII).
4. **Breaking Interface Changes**: Flags deleted API fields or modified public route signatures.

## How to Trigger
```markdown
/jev-review
"Run jev-review on the current git diff before committing changes."
```

## Activation Rules
When this skill is active:
1. Always inspect `git diff` before approving a PR or concluding an implementation phase.
2. Report findings in an actionable table formatted with exact `file:line` locations and risk levels (`HIGH`, `MEDIUM`, `LOW`).
