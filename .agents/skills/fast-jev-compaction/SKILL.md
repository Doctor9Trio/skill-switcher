---
name: fast-jev-compaction
description: Token-efficient context compaction plugin that evaluates tool outputs and conversation history with Jev to prune stale context while keeping verbatim code and facts.
---

# Fast JEV Compaction — Intelligent Context Pruning

## Overview
**fast-jev-compaction** replaces traditional lossy LLM summarization with high-speed, typed evaluation. When context windows get bloated, typical LLM summarizers hallucinate or discard critical line numbers and exact code syntax. Fast Jev Compaction uses discrete scoring to classify history segments as `KEEP_VERBATIM`, `PRUNE`, or `COMPRESS_FACTS`.

## Key Capabilities
- **Verbatim Retention**: Preserves line numbers, function signatures, and file diffs without re-writing them.
- **Noise Elimination**: Strips out repeated directory scans, massive JSON dumps, and obsolete compiler traces.
- **Deterministic Token Bounds**: Ensures active context remains lean and responsive during 100+ turn agent sessions.

## How to Trigger
```markdown
/compact
"Run fast-jev-compaction on conversation history: prune stale terminal logs and retain active task objectives."
```

## Activation Rules
When this skill is active:
1. Automatically flag context blocks exceeding 800 tokens for relevance scoring.
2. Discard intermediate search/grep outputs once the target file is found.
3. Preserve active task checklists and file paths verbatim.
