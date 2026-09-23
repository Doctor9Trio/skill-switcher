---
name: jev-ultrafast
description: High-speed browser automation where DOM next-actions (click, type, scroll, navigate) are decided by sub-second Jev scoring loops.
---

# JEV-Ultrafast — High-Speed Browser Automation

## Overview
**jev-ultrafast** is an open-source browser automation agent based on `browser-use/jev-ultrafast`. Rather than prompting a heavy, slow frontier LLM on every DOM step (which takes 3–8 seconds per action and consumes massive token budgets), jev-ultrafast delegates DOM interaction decisions to Jev.

## Key Capabilities
- **Sub-Second Action Loops**: Evaluates pruned DOM trees and emits typed actions (`Click(selector)`, `Type(selector, text)`, `Scroll(dir)`, `Done`) in 70–300ms.
- **Extreme Token Savings**: Reduces browser task token consumption by 85–90%.
- **Deterministic Navigation**: Eliminates creative wandering during automated tests and web scraping.

## How to Trigger
```markdown
/jev-browse "Navigate to localhost:3000, verify the login button is disabled when inputs are empty, then take a screenshot."
```

## Activation Rules
When this skill is active, browser automation tasks must:
1. Prune the DOM to interactive elements before evaluation.
2. Use typed decision loops (`Choice` over candidates) instead of open-ended conversational prompts.
3. Validate step success with binary assertion gates.
