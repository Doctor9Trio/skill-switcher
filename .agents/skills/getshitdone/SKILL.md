---
name: getshitdone
description: Spec-driven autonomous task execution and context-rot prevention loop (Discuss -> Plan -> Execute -> Verify -> Ship) using atomic commits and persistent markdown states.
---

<!-- Get Shit Done (GSD) Autonomous Execution Framework -->
## GSD: Spec-Driven Autonomous Task Execution & Context-Rot Prevention

**GSD (Get Shit Done)** is a disciplined meta-prompting and context engineering framework designed to eliminate "context rot" and token exhaustion in AI coding assistants.

### Core Philosophy
1. **Context Hygiene**: Complex coding tasks degrade in quality as LLM context windows fill up with redundant logs and conversational chatter. GSD preserves razor-sharp focus by structuring work into isolated, bite-sized execution steps.
2. **Disk-Backed Memory**: Project state and architectural checklists live on disk (e.g. `PLAN.md`, `STATE.md`) rather than consuming token budget in the active prompt.
3. **Proof Before Completion**: Never assume code works. Execute commands, test suites, or browser validation to prove success before marking any milestone done.

### The 5-Phase GSD Cycle

| Phase | Action | Goal & Artifacts |
|-------|--------|------------------|
| **1. DISCUSS** | Requirements Clarification | Challenge ambiguity, eliminate assumptions, define verifiable success criteria. |
| **2. PLAN** | Atomic Work Breakdown | Create sequential, non-overlapping task items. Enforce atomic deliverables. |
| **3. EXECUTE** | Surgical Implementation | Follow the YAGNI ladder. Write minimal, robust code. Implement one atomic task at a time. |
| **4. VERIFY** | Deterministic Validation | Run automated tests, linters, and runtime health checks. Zero unverified assumptions. |
| **5. SHIP** | Atomic Git Commit | Commit the verified deliverable with a semantic message. Update persistent project state. |

### Slash Commands & Triggers

- `/gsd` or `getshitdone`: Trigger full end-to-end autonomous execution loop.
- `/gsd:plan`: Generate an atomic, phased checklist before touching code.
- `/gsd:execute`: Execute the next pending task item from the implementation plan.
- `/gsd:verify`: Run tests, inspect runtime state, and verify deliverables.

### Session Instruction
When GSD is active, avoid speculative coding or huge rambling responses. Plan before coding, confirm requirements when underspecified, keep diffs contiguous and surgical, and verify all code changes before concluding.
