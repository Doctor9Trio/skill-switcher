# Live Agent Session Token & Cost Telemetry (INR & USD) Implementation Plan

> **For Claude / Antigravity:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a zero-overhead, real-time Live Agent Session Token & Cost Telemetry engine in Skill Switcher that monitors incoming/outgoing tokens, tool usage breakdown, and live estimated session cost in Indian Rupees (₹ INR) and US Dollars ($ USD) across local Antigravity IDE and agent sessions.

**Architecture:** 
1. **Backend Engine (`skill-gui-server.ps1`)**: Add `GET /session-telemetry` and `GET /sessions-list` endpoints that discover the active/recent Antigravity IDE trajectory transcripts (`~/.gemini/antigravity-ide/brain/<session-id>/.system_generated/logs/transcript.jsonl`), parse steps with subword BPE tokenization, aggregate input/output tokens, step counts, tool call types, and calculate costs using provider pricing models with INR conversion rate (1 USD = ₹86.50).
2. **Frontend UI Dashboard (`index.html` & `skill-gui.html`)**: Add a dedicated "Agent Live Telemetry" tab / drawer in the GitHub Primer UI featuring real-time incoming/outgoing token gauges, turn counter, tool usage breakdown badges, model rate selector (Gemini 3.7/3.8 Flash, Pro, Claude 3.5 Sonnet, GPT-4o), and live cost in ₹ INR with secondary $ USD display.
3. **Auto-Polling & Live Refresh**: Implement smooth 4-second reactive polling with pause/resume and zero UI freezing.

**Tech Stack:** PowerShell 5.1+ / Core, Vanilla JavaScript (ES6+), HTML5, Primer CSS design tokens, Native BPE Tokenizer heuristic, Antigravity IDE Transcript JSONL.

---

### Task 1: Backend Session Discovery & Telemetry API in `skill-gui-server.ps1`

**Files:**
- Modify: `skill-gui-server.ps1`
- Test: `scratch/test_telemetry_api.ps1`

**Step 1: Write the test script for session discovery and telemetry calculation**
- Verify that `skill-gui-server.ps1` detects `~/.gemini/antigravity-ide/brain/` session trajectories.
- Verify `GET /session-telemetry` returns `ok: true`, `session_id`, `input_tokens`, `output_tokens`, `total_tokens`, `steps_count`, `tools_breakdown`, `cost_inr`, `cost_usd`, and `currency: "INR"`.

**Step 2: Run test to verify failure before implementation**
- Run test against running server or mock script to confirm endpoint does not exist yet.

**Step 3: Implement `Find-ActiveSession` and `Get-SessionTelemetry` in `skill-gui-server.ps1`**
- Scan `~/.gemini/antigravity-ide/brain/*/system_generated/logs/transcript.jsonl` sorted by `LastWriteTime` descending.
- Read and parse steps:
  - User prompts + tool outputs -> `input_tokens`
  - Agent thought + text + tool call arguments -> `output_tokens`
  - Count breakdown: `run_command`, `view_file`, `replace_file_content`, `grep_search`, `list_dir`, etc.
- Calculate cost for Gemini Flash ($0.15/1M in, $0.60/1M out), Gemini Pro ($1.25/$5.00), Claude Sonnet ($3.00/$15.00), Claude Haiku ($0.80/$4.00), GPT-4o ($2.50/$10.00).
- Convert to INR using ₹86.50/USD rate.
- Add `GET /session-telemetry` (with optional `?sessionId=...` and `?model=...`) and `GET /sessions-list`.

**Step 4: Run test to verify passes**
- Execute test script and verify accurate token counts, step counts, and formatted INR currency.

---

### Task 2: Design and Build Live Telemetry Primer Component in `index.html` & `skill-gui.html`

**Files:**
- Modify: `index.html`
- Modify: `skill-gui.html`

**Step 1: Add Telemetry Navigation Tab & Header Live Metric Pill**
- In the top header bar, add a live status pill: `Live Agent: ₹X.XX (XXk tokens)` with a pulsating live dot.
- Clicking opens the full **Live Session Telemetry & Cost Dashboard Modal**.

**Step 2: Implement the Telemetry Modal UI Structure**
- Header: GitHub Primer modal head with Session ID badge, status indicator ("Active Session"), and close button.
- 4 Primary Stat Cards:
  1. 💰 **Estimated Session Cost**: Large font in **₹ INR** (e.g. `₹3.42`), with secondary `($0.0395 USD)` subtitle.
  2. 📥 **Incoming (Input) Tokens**: e.g. `~18,420 tokens` (Prompts, file contents, command outputs).
  3. 📤 **Outgoing (Output) Tokens**: e.g. `~64,150 tokens` (Agent thoughts, answers, code edits).
  4. ⚡ **Total Session Tokens**: e.g. `~82,570 tokens` across `XX` turns.
- Model Pricing Selector:
  - Dropdown to select model:
    - `Gemini 3.7 / 3.8 Flash (Active IDE default)`
    - `Gemini 1.5 / 2.5 Pro`
    - `Claude 3.5 Sonnet`
    - `Claude 3.5 Haiku`
    - `GPT-4o`
- Currency Display Toggle: Primary in **₹ INR** (default), with USD toggle.
- Tools Execution Breakdown Table:
  - Tool Name (`view_file`, `run_command`, `replace_file_content`, `grep_search`, etc.)
  - Count of invocations
  - Status badge (All successful)
- Recent Conversation Steps Feed:
  - Last 5 turns showing step index, type, preview text, and token count.

---

### Task 3: Client-side Polling & Reactive State Management

**Files:**
- Modify: `index.html`
- Modify: `skill-gui.html`

**Step 1: Implement `fetchSessionTelemetry(isSilent)`**
- Fetch `/session-telemetry` from backend.
- Update header live pill and modal stat cards smoothly without DOM flickering.
- Auto-detect if session is active or idle.

**Step 2: Reactive Polling Lifecycle**
- Start 4-second polling timer when modal is open or when page is focused.
- Automatically slow down polling when tab is blurred or modal is closed (conserving CPU/battery).
- Include manual "Refresh Now" button with spin animation.

---

### Task 4: End-to-End Validation & Edge Case Handling

**Files:**
- Test all edge cases:
  1. Session directory does not exist or IDE not yet launched -> Displays friendly "Waiting for agent session..." empty state without throwing exceptions.
  2. Large transcript files (10MB+) -> Handled with buffered stream reading and non-blocking background parsing.
  3. Custom session switching -> User can pick past sessions from a dropdown.
  4. Currency accuracy -> Verify INR formatting with `₹` symbol and commas (e.g. `₹1,245.50` or `₹3.28`).
