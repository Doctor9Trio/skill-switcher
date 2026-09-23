---
name: typesafe-mario
description: Real-time emulator controller where Jev makes discrete frame-level gameplay decisions from structured NES emulator RAM state.
---

# TypeSafe Mario — Game AI from Structured RAM State

## Overview
**typesafe-mario** by fhshaik is an experimental demonstration of Jev's sub-100ms decision latency. In this project, an AI plays Super Mario Bros on an NES emulator. Instead of streaming raw video frames to a multimodal vision model, the emulator extracts object-centric RAM state (Mario position, velocity, enemy distances, pits) as structured JSON, and Jev outputs controller button presses (`RUN_RIGHT`, `JUMP`, `DUCK`) in real time.

## Key Principles
- **Perception vs. Decision Separation**: Classical code parses memory and game physics; Jev provides fast tactical choices.
- **Low-Latency Loop**: Runs at game-tick frequency (~60Hz polling, ~10Hz decision gating).
- **Zero Hallucination**: Button presses are strictly bounded to valid controller inputs.

## How to Trigger
```markdown
/mario-agent "Analyze the RAM state JSON and emit the next controller action."
```

## Activation Rules
When this skill is active:
1. Always parse environment state into compact structured JSON before decision evaluation.
2. Restrict output to valid discrete controller actions.
