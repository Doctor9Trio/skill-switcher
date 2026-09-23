---
name: typesafe-mcp
description: Official Model Context Protocol (MCP) server providing Jev System One decision primitives (Choice, Score, Noul) directly as tool calls to AI agents.
---

# TypeSafe MCP — Model Context Protocol Bridge for JEV

## Overview
**typesafe-mcp** exposes Jev decision primitives through the standardized Model Context Protocol. It allows AI coding assistants (Antigravity, Claude, Cursor) to invoke fast, discrete judgment co-processors rather than relying on heavy generative prompts for simple decisions.

## Available Tools & Primitives
- `jev_gate(condition, rule)`: Emits a binary boolean (`PASS` / `FAIL`) against an explicit constraint.
- `jev_choose(options, criteria)`: Returns the highest-scoring candidate item from a discrete list.
- `jev_score(target, rubrics)`: Returns a normalized integer score (0–100) and confidence level.

## How to Trigger
```markdown
"Use typesafe-mcp tool jev_gate to verify if this pull request contains any hardcoded secrets."
```

## Activation Rules
When this skill is active:
1. Always prefer discrete MCP tool calls (`jev_gate`, `jev_choose`, `jev_score`) over text generation when resolving binary gates or ranking options.
2. Structure tool arguments with explicit criteria and schemas.
