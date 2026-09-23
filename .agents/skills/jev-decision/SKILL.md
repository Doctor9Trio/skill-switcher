---
name: jev-decision
description: System One rapid decision primitives, gating, task routing, and context compaction for AI agents working on ekaShuttle. Use when evaluating discrete options, classifying telemetry anomalies, pruning agent context, or validating feature scope.
---

# JEV System One Decision Intelligence — ekaShuttle

## What is JEV?

**JEV** is a specialized **System One decision model** from TypeSafe AI. Unlike traditional conversational Large Language Models (LLMs) that generate prose, JEV is built exclusively for **low-latency, low-cost, structured decision-making**.

It evaluates conditions and emits strictly typed outputs (`Choice`, `Score`, or `Noul` / Boolean Pass-Fail) in 70–400ms without token overhead or creative hallucinations.

```
Traditional LLM:  Prompt → [Extensive Token Generation / Thinking] → Markdown Text (~2-8 sec)
JEV System One:   Context + Criteria → [Evaluator Matrix] → Typed Enum / Score (<300 ms)
```

In the **ekaShuttle** platform, JEV primitives provide deterministic gating, rapid pre-flight security checks, context compaction, and noise filtering.

---

## The Three Core Primitives

### 1. `Gate(condition, rule) -> PASS | FAIL`
Used to enforce mandatory rules and safety boundaries before taking action.
- **Rule evaluation**: Binary gatekeeper.
- **Example in ekaShuttle**: Checking if a proposed code change touches `devices/`, `operations/`, or `users/` (Instant FAIL).

### 2. `Choice(options, criteria) -> SelectedOption`
Used for multi-option selection when deterministic algorithms need heuristic tie-breaking.
- **Example in ekaShuttle**: Given 3 candidate bus stops for an anomalous GPS point near an intersection, choose the most probable stop sequence.

### 3. `Score(target, rubrics) -> { score: 0..100, confidence: float, verdict: string }`
Multi-dimensional evaluation for risk, performance, or viability.
- **Example in ekaShuttle**: Scoring a git diff on regression risk before merging to `dev`.

---

## ekaShuttle Workflows & How to Trigger

### 1. Telematics GPS Anomaly Gating
When processing GPS coordinates from the `live_data` Redis hash, GPS drift at bus terminals can falsely trigger arrival events.
- **Trigger**: Run whenever bus speed is reported as 0 km/h but coordinates jump > 50 meters within 5 seconds.
- **JEV Evaluation Prompt**:
  ```markdown
  Task: Evaluate GPS point validity.
  Previous: Lat: 18.7952, Lon: 73.8124, Speed: 0 km/h, Time: 08:30:00
  Current:  Lat: 18.7960, Lon: 73.8118, Speed: 0 km/h, Time: 08:30:05
  Delta: 88m in 5s with speed=0.
  Criteria: Is this physical movement or stationary multipath drift?
  Decision: [NOUL: VALID_MOVEMENT | GPS_DRIFT]
  ```
- **Action**: If `GPS_DRIFT`, do NOT trigger `StopArrival` geofence logic; preserve previous position.

### 2. Context Window Compaction (`fast-jev-compaction` & `Winnow` pattern)
During extended agent pairing sessions, terminal outputs, Redis JSON blobs, and repeated file reads fill the context window.
- **Trigger**: Type `/compact` or trigger when context exceeds 50% capacity.
- **Compaction Rule**:
  - Classify each history block as `KEEP_VERBATIM`, `PRUNE`, or `COMPRESS_SUMMARY`.
  - Retain verbatim: active task requirements, modified code lines, API contracts.
  - Prune: large raw terminal logs, repeated directory listings, unchanged file reads.

### 3. Pre-Flight Diff Review (`jev-review` pattern)
Before committing or presenting code changes to the user, run a pre-flight guardrail check:
- **Trigger**: Type `/review-diff` or run before marking an implementation plan phase complete.
- **Gating Matrix**:
  1. Does any file path contain `ekaConnect/devices/`, `ekaConnect/operations/`, `ekaConnect/users/`, or `ekaConnect/redisSetup/`? → **FAIL**
  2. Does any response include `soc`, `voltage`, `cell_temp`, or CAN data? → **FAIL**
  3. Does any view serving live coordinates lack `validate_token()`? → **FAIL**
  4. Are any secrets, tokens, or connection strings hardcoded? → **FAIL**
  5. Can a single route failure crash `BusBroadcaster`? → **FAIL**

### 4. Feature Viability Scrutiny (`killmyidea` pattern)
Before adding features to the ekaShuttle backlog, run JEV multi-criteria evaluation:
- **Criteria**:
  - Zero-login constraint satisfied? (Yes/No)
  - Zero Google Maps API cost? (Uses Leaflet/OSRM) (Yes/No)
  - Zero modifications to EKA Connect core? (Yes/No)
  - Under 600ms load time for 1,500 concurrent staff? (Yes/No)
- **Verdict**:
  - All YES → `SHIP`
  - Minor conflict → `FIX` (adjust architecture)
  - Violates guardrails → `KILL`

---

## Integration with EKA Skill Switcher

When `jev-decision` is enabled via the EKA Skill Switcher:
1. Antigravity IDE activates the **System One Decision Protocol**.
2. All multi-path decisions (file pruning, model routing, code reviews) will use typed decision scoring rather than wandering text output.
3. Every completed task must pass the **Gatekeeper Verification** before sign-off.
