---
name: canny-verifier
description: Objective verification referee for AI coding agents on ekaShuttle. Evaluates git diffs, test execution logs, and modified files to verify whether claimed tasks are truly complete without hallucinated passes. Use before concluding any task, PR, or implementation phase.
---

# Canny Verifier — Objective Task & Guardrail Referee

## Purpose

**Canny** acts as an impartial **verification referee** for coding agents. AI agents frequently claim tasks are complete ("All tests pass", "Features implemented") when code has compilation errors, untested edge cases, or broken architectural constraints.

Canny eliminates false positives by requiring **hard proof** across three pillars:
1. **Source Evidence**: Inspecting the actual git diff or file content.
2. **Execution Proof**: Running automated tests or verifying clean syntax/lint.
3. **Guardrail Compliance**: Strictly validating that no forbidden paths or patterns were touched.

---

## The ekaShuttle Verification Checklist

Before marking any task complete in ekaShuttle, Canny runs through this checklist:

### 1. Guardrail Integrity Gate (Automatic Disqualification if Failed)
- [ ] **No modifications to EKA Connect core directories**:
  - `ekaConnect/devices/` MUST BE UNTOUCHED
  - `ekaConnect/operations/` MUST BE UNTOUCHED
  - `ekaConnect/users/` MUST BE UNTOUCHED
  - `ekaConnect/redisSetup/` MUST BE UNTOUCHED
  - `ekaConnect/decoderWorker/` MUST BE UNTOUCHED
- [ ] **No internal vehicle telemetry exposed**:
  - Responses contain ONLY: `lat`, `lon`, `speed_kmh`, `heading`, `timestamp`.
  - NO `soc`, `voltage`, `cell_temperature`, `dtc_codes`, `can_data`, or `vin`.
- [ ] **Token Validation Enforced**:
  - All public views serving bus location call `validate_token()`.
- [ ] **No Hardcoded Secrets**:
  - HMAC keys, Redis credentials, and VAPID keys use `os.environ` or `settings`.
- [ ] **BusBroadcaster Isolation**:
  - Broadcaster catches exceptions per-route; route failure cannot kill the worker loop.

### 2. Code Quality & Idempotency Gate
- [ ] Django ORM operations use `get_or_create` or `update_or_create` for `StopArrival`.
- [ ] Redis writes use the `shuttle:*` namespace with an explicit TTL (`setex`).
- [ ] No direct `import redis` — must use `get_redis_connection("default")`.
- [ ] All new models have database migrations generated via `makemigrations staffbus`.
- [ ] Unit tests exist for new service functions in `staffbus/services/`.

---

## How to Trigger Canny Verification

### 1. Manual Chat Trigger
You can explicitly invoke Canny by issuing:
```markdown
/verify
"Canny, verify the changes made in this turn against ekaShuttle guardrails and produce a referee report."
```

### 2. Automated Turn Gate
Antigravity automatically runs Canny verification before outputting the final `walkthrough.md` or completing an approved implementation plan.

---

## Referee Report Output Format

When Canny evaluates a task, it emits a standardized verdict:

```markdown
### 🛡️ Canny Referee Report

**Target Task:** [Task Name / Feature]
**Verdict:** [VERIFIED ✅ | REJECTED ❌ | CONDITIONAL PASS ⚠️]

#### 1. Evidence Verified
- File modified: `ekaConnect/staffbus/views.py` (Line 42: `validate_token` checked)
- Redis namespace: Uses `shuttle:route:PUNE_1:live` with TTL 60s
- Telematics fields: Only `lat`, `lon`, `speed_kmh`, `heading`, `timestamp` emitted

#### 2. Tests Executed
- `python manage.py test staffbus.tests`: Passed (4 tests, 0 failures)

#### 3. Guardrail Status
- Core app touched? NO ✅
- Secrets committed? NO ✅
- Broadcaster crash safe? YES ✅

#### 4. Action Required (if rejected)
- [List specific lines or files that must be corrected before approval]
```
