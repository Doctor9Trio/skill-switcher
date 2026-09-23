---
name: blink
description: Sub-second semantic codebase navigator that scores directory trees and candidate files against a user prompt to pinpoint relevant source files.
---

# Blink — Semantic Codebase Navigator

## Overview
**Blink** by Ellipsis Dev is a fast semantic navigation engine for large mono-repos and sprawling multi-folder projects. When an agent is asked a question ("Where are websocket events handled?", "Which view renders the vehicle map?"), Blink evaluates directory trees and file names with Jev to locate the exact candidate files in under 200ms.

## Key Capabilities
- **Fast Tree Traversal**: Quickly discards irrelevant directories (`node_modules`, `.git`, `venv`, build caches).
- **Target Ranking**: Returns the top 3–5 most relevant source files ranked by confidence score.
- **Minimal Token Use**: Avoids reading hundreds of files into memory just to find where a single variable or endpoint is defined.

## How to Trigger
```markdown
/blink "Where is the Redis channel subscriber configured in this project?"
```

## Activation Rules
When this skill is active:
1. Always run semantic file pinpointing before blindly reading large files.
2. Narrow the search scope to the top 3 candidate files before initiating content replacement edits.
