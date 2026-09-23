---
name: onevonejev
description: Tactical 1v1 first-person shooter game decision agent evaluating combat state ticks to choose movement, cover, aiming, and firing.
---

# OneVOneJev — 1v1 Combat Tactical Decision Agent

## Overview
**OneVOneJev** by Emrick Garrett implements an autonomous player bot in a 1v1 FPS arena. At each decision tick, the bot receives enemy distance, health differential, weapon ammo, and line-of-sight status, and Jev outputs tactical decisions (`ENGAGE`, `TAKE_COVER`, `RELOAD`, `FLANK_RIGHT`).

## Key Principles
- **State Scoring**: Evaluates risk-reward ratios based on current shield/health values.
- **Action Bounding**: Only emits executable game actions supported by the engine API.

## How to Trigger
```markdown
/1v1-agent "Evaluate combat tick: health=30, enemy_distance=12m, ammo=0. Decision?"
```

## Activation Rules
When this skill is active:
1. Normalize game state variables before decision evaluation.
2. Maintain tactical state memory across consecutive game ticks.
