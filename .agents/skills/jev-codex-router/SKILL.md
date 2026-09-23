---
name: jev-codex-router
description: Sub-100ms task complexity evaluator and model router that classifies coding turns to dynamically route between Flash/Haiku and Pro/Opus/Thinking models.
---

# JEV Codex Router — Dynamic Model Routing & Complexity Estimation

## Overview
**jev-codex-router** acts as a traffic director for AI agent workflows. Rather than sending every simple question, syntax check, or formatting command to a slow, expensive reasoning model, the router uses Jev to score task complexity in under 100ms and routes to the optimal model tier.

## Routing Matrix
| Complexity Score | Task Type | Target Model Tier |
|---|---|---|
| **0 – 30** | Formatting, typo fixes, simple grep, linting | Flash / Haiku (Sub-second) |
| **31 – 70** | Single-function refactoring, unit tests, API route edits | Standard Sonnet / Pro |
| **71 – 100** | Architectural planning, multi-file redesigns, security audits | Thinking / Opus / Reasoning |

## How to Trigger
```markdown
/route-task "Analyze user request complexity and recommend the optimal model selection."
```

## Activation Rules
When this skill is active:
1. Estimate prompt complexity before executing multi-turn plans.
2. Delegate routine terminal checks and formatting to light models to conserve reasoning token budgets.
