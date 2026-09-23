---
name: killmyidea
description: Harsh product and feature idea validator using Jev multi-criteria scoring to evaluate feasibility, user demand, and complexity, labeling ideas as KILL, FIX, or SHIP.
---

# KillMyIdea — Objective Feature & Product Validator

## Overview
**killmyidea** by monteduro is a rigorous product validation tool. When product teams or developers propose new features, natural optimism often leads to building bloated, complex features that nobody wants or that violate architectural constraints. KillMyIdea uses Jev to objectively stress-test concepts across feasibility, market urgency, operational cost, and technical debt, outputting an unvarnished verdict: `KILL`, `FIX`, or `SHIP`.

## The 4 Stress-Test Dimensions
1. **Technical Feasibility**: Can this be built within existing architecture without breaking core systems?
2. **Operational Overhead**: Does this require costly 3rd-party APIs or heavy server infrastructure?
3. **User Friction**: Does this add login screens, extra clicks, or mandatory fields?
4. **Strategic Focus**: Does this dilute the core value proposition of the product?

## How to Trigger
```markdown
/killmyidea "Feature: Add real-time passenger chat with the bus driver inside ekaShuttle."
```

## Activation Rules
When this skill is active:
1. Always evaluate proposed new features against architectural constraints before writing implementation code.
2. Label verdicts strictly as `KILL` (discard), `FIX` (redesign to fit constraints), or `SHIP` (safe to build).
