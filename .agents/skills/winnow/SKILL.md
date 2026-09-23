---
name: winnow
description: Context garbage collector for coding agents that eliminates repetitive bash traces, dead-end grep outputs, and redundant file dumps.
---

# Winnow — Agent Context Garbage Collector

## Overview
**Winnow** by Ghaleb Dweikat acts as an automatic garbage collector for an agent's working memory. During long coding sessions, outputs from `git log`, `grep`, `dir`, and compiler traces accumulate in the context window, causing prompt degradation and high latency. Winnow continuously prunes non-essential traces while keeping active state and critical code lines.

## Key Capabilities
- **Dead-End Pruning**: Detects when an exploration path (e.g. searching 5 files for a non-existent function) has concluded and prunes the irrelevant file views.
- **Deduplication**: Collapses repeated command outputs into a single reference.
- **Preservation Gates**: Automatically locks active instructions, user rules, and active diffs from being purged.

## How to Trigger
```markdown
/winnow
"Run Winnow context garbage collection: purge verbose command outputs and keep only active task checklist."
```

## Activation Rules
When this skill is active:
1. When summarizing or continuing a session, do not repeat long intermediate tool outputs.
2. Maintain a concise working memory of active state, modified files, and open blockers.
