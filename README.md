# Skill Switcher

<p align="center">
  <strong>Dynamic AI Skill Orchestrator & Context Rules Manager for Antigravity IDE, Claude Code, and Gemini</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT">
  <img src="https://img.shields.io/badge/Interface-GitHub%20Primer-1f2328.svg" alt="Interface">
  <img src="https://img.shields.io/badge/Verified%20Tools-87%20Subskills-success.svg" alt="87 Verified Tools">
  <img src="https://img.shields.io/badge/Offline-100%25%20Local-success.svg" alt="Local Offline">
  <img src="https://img.shields.io/badge/Author-Doctor9Trio-0969da.svg" alt="Author">
</p>

---

## 🌟 What is Skill Switcher?

**Skill Switcher** is an offline-first, developer-grade orchestrator designed to eliminate prompt fatigue and context bloat in AI pair-programming sessions.

Modern AI coding agents (Antigravity IDE, Claude Code, Gemini CLI, Cursor, Windsurf) read custom rules and specialized instructions from rule files (`~/.gemini/config/rules/active-skills.md`) at the start of every session. **Skill Switcher** provides both a high-fidelity **GitHub Primer Web GUI** and a fully functional **interactive terminal CLI** that lets you activate, inspect, test, and swap specialized skills with one click.

```
+------------------------------------+      1-Click Apply      +-------------------------------------------+
|        Skill Switcher Suite        |  ====================>  | ~/.gemini/config/rules/active-skills.md   |
| (Web GUI, Presets, Laya Playground)|                         | (Auto-read by Antigravity every session!) |
+------------------------------------+                         +-------------------------------------------+
```

---

## ✨ Features & Architecture

- **GitHub Primer UI/UX**: Built natively with GitHub's exact design system, Geist typography, crisp SVG Octicons, and Light/Dark mode.
- **Workflow Stacks (1-Click Presets)**:
  - 🎨 **Frontend Motion** — GSAP Core, ScrollTrigger, React, Timeline, Motion Dev, Emil Kowalski Animate & Impeccable Design.
  - ⚡ **JEV DOM Loop** — Sub-second headless browser clicks & input verification loop, Drone spatial engine, Desktop agent, and Canny verifier.
  - 🧠 **System 1 Decision** — Laya non-autoregressive decision engine, Fast context compactor, Winnow noise filter, and Blink instant fixer.
  - 🛡️ **PR Review & Guard** — JEV multi-agent diff review, Canny verifier guardrails, and Semdecide semantic gates.
  - 📱 **Mobile App UX** — Appllama transit UX, Finch/Lungy pulse patterns, and Swift native styling.
  - 🌐 **Full Suite** — Balanced, battle-tested full stack development context.
  - 💾 **Custom Presets** — Save and reload custom skill combinations from localStorage with one click.
- **Interactive Full SKILL.md Reader**:
  - The Inspect modal features a dedicated **"Full SKILL.md Manual"** tab that reads the live markdown documentation directly from disk via local API and renders clean syntax-highlighted instructions, file line counts, and a copy button.
- **⚡ Live Laya System 1 Decision Playground**:
  - Integrated testing sandbox running `laya_runner.py` on your machine.
  - Test any user message or prompt with `Triage` or `Safety Guard` presets in **1–33ms with 0 token burn**.
- **Two-Way Memory Synchronization**:
  - Real-time disk status badge showing active skills in `~/.gemini/config/rules/active-skills.md`.
  - **Sync Disk**: Instantly syncs GUI checkboxes to match what is currently saved on disk.
  - **Wipe Disk**: Safely resets agent memory to clean slate with one click.
- **Dynamic Universal Path Resolution**:
  - Automatically resolves workspace and global paths across any user machine or directory structure without broken hardcoded links.
- **Token Economy Calculator**:
  - Real-time token budget visualizer showing estimated context footprint and context savings percentage (e.g. `~2,940 tokens • 92% saved vs full catalog`).
- **Local Verification Health Matrix**:
  - Modal matrix listing all 87 subskills, file paths, file sizes, and verification status.
- **100% Offline & Private**:
  - Zero telemetry, zero cloud lock-in. All credentials and configurations stay strictly on your local machine.

---

## ⚙️ Prerequisites & Requirements

| Component | Minimum Version | Notes |
|---|---|---|
| **OS** | Windows 10/11, macOS 12+, Ubuntu 20.04+ | Cross-platform |
| **Shell** | Windows PowerShell 5.1+, PowerShell 7+, or Bash | Built-in on Windows/Mac/Linux |
| **Browser** | Chrome, Edge, Firefox, Brave, Safari | Any modern web browser |
| **Python** *(Optional)* | Python 3.8+ | Only needed if running the local Laya classifier test script |
| **AI Tooling** | Antigravity IDE, Claude Code, or Gemini CLI | Automatically reads generated `active-skills.md` rules |

---

## 📦 Setup & Installation Guide

### Step 1: Clone or Download the Repository

Clone the project to your local workstation or workspace directory:

```bash
git clone https://github.com/Doctor9Trio/skill-switcher.git
cd skill-switcher
```

*(Alternatively, download the ZIP archive from GitHub and extract it into any local folder.)*

### Step 2: (Windows) Enable Script Execution Policy

On Windows, PowerShell may block local script execution by default. Open PowerShell and run this one-time command to allow local scripts to execute:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force
```

*(Note: Both `.bat` files automatically invoke PowerShell with `-ExecutionPolicy Bypass`, so double-clicking the batch files works out of the box without changing system-wide policies.)*

### Step 3: Verify the Antigravity Memory Folder

Skill Switcher writes its active rules directly to your user configuration directory at:
- **Windows**: `C:\Users\<Username>\.gemini\config\rules\active-skills.md`
- **macOS / Linux**: `~/.gemini/config/rules/active-skills.md`

The server and CLI automatically create this folder structure if it does not already exist.

---

## 🚀 How to Run

Skill Switcher offers three execution modes depending on your preferred workflow:

### Mode 1: Web GUI Server (Recommended)

The Web GUI provides a full GitHub Primer interface, live token calculation, task matcher, full markdown inspection, and 1-click Antigravity IDE memory sync.

#### On Windows:
- **Method A (Easiest)**: Double-click **`skill-gui.bat`**.
- **Method B (PowerShell)**:
  ```powershell
  powershell.exe -ExecutionPolicy Bypass -File .\skill-gui-server.ps1
  ```
  *To specify a custom port:*
  ```powershell
  powershell.exe -ExecutionPolicy Bypass -File .\skill-gui-server.ps1 -Port 7895
  ```

#### On macOS / Linux:
Make the shell script executable and run it:
```bash
chmod +x skill-gui.sh
./skill-gui.sh
```

> [!TIP]
> Once launched, the server starts at `http://localhost:7891` and automatically opens in your default browser. Press `Ctrl + C` in the terminal window to stop the server when finished.

---

### Mode 2: Interactive Terminal CLI

For keyboard-driven terminal workflows without opening a browser:

#### On Windows:
- **Method A (Easiest)**: Double-click **`skill-loader.bat`**.
- **Method B (PowerShell)**:
  ```powershell
  powershell.exe -ExecutionPolicy Bypass -File .\skill-loader.ps1
  ```

#### CLI Keybindings & Commands:
- `1` – `11`: Toggle individual skill packs (GSAP, Emil Kowalski Motion, Apple HIG, Laya, Appllama, etc.)
- `A`: **Apply** active selection directly to `active-skills.md` on disk
- `S`: **Status** check showing currently loaded skills and timestamp
- `W`: **Wipe** / reset agent memory back to clean state
- `C`: **Combo mode** — enter multiple comma-separated IDs (e.g., `1,3,9`)
- `V`: **View** file list and size breakdown of all selected skills
- `X`: **Copy** active context rules directly to clipboard
- `T`: **Test** local Laya System 1 decision engine in terminal
- `R`: **Reset** current in-memory selection
- `Q`: **Quit** the CLI

---

### Mode 3: Offline Static Mode (Zero Server Required)

If you cannot run PowerShell or Python servers, you can open the GUI directly as a local HTML document:
1. Double-click **`index.html`** or **`skill-gui.html`**.
2. Select your skills or choose a 1-click preset.
3. Click **"Copy Prompt"** to copy the generated rules to your clipboard and paste them into your session.

---

## 🔄 How It Works With Your AI Coding Assistant

1. **You select skills** in Skill Switcher (e.g. *GSAP Suite* + *Impeccable Design*).
2. **Click "Apply to Antigravity Memory"** (or press `A` in the CLI).
3. The server generates an optimized, validated markdown ruleset and saves it to:
   ```
   ~/.gemini/config/rules/active-skills.md
   ```
4. **Start or resume your AI session**: Antigravity IDE, Claude Code, and Gemini automatically ingest `active-skills.md` as active project instructions!
5. When your session task changes, simply switch presets or click **"Wipe Memory"** to clean your context window.

---

## 🔧 Troubleshooting & FAQ

<details>
<summary><strong>Q: Port 7891 is already in use by another service.</strong></summary>

The `skill-gui-server.ps1` script automatically tests up to 20 consecutive ports (`7891`–`7911`) and binds to the first available port. You can also explicitly specify a custom port:
```powershell
powershell.exe -ExecutionPolicy Bypass -File .\skill-gui-server.ps1 -Port 8080
```
</details>

<details>
<summary><strong>Q: PowerShell displays "running scripts is disabled on this system".</strong></summary>

Run the script with execution policy bypass:
```powershell
powershell.exe -NoLogo -ExecutionPolicy Bypass -File .\skill-gui-server.ps1
```
Or use the provided `skill-gui.bat` launcher, which includes the bypass flag automatically.
</details>

<details>
<summary><strong>Q: How do I know the AI agent has recognized the active skills?</strong></summary>

At session start, the rules instruct the agent to confirm active skills in one line. You can also prompt:
```
Confirm active skills currently loaded in memory.
```
The agent will report all active skills and line references from `active-skills.md`.
</details>

<details>
<summary><strong>Q: Can I add my own custom skills?</strong></summary>

Yes! Place any skill folder inside `.agents/skills/<your-skill-name>/` containing a `SKILL.md` file. Skill Switcher will automatically detect and verify it.
</details>

## 📁 Repository Structure

```
Skills-Switcher/
├── .agents/
│   └── skills/                  # 85+ Bundled, production-ready JEV, Laya, GSAP & MCP skills
│       ├── laya/                # Multilingual non-autoregressive System 1 decision engine
│       ├── jev-ultrafast/       # High-speed DOM automation loop
│       ├── fast-jev-compaction/ # Context-window token compactor
│       ├── gsap-skills-.../     # Complete GSAP animation suite
│       └── ...
│
├── css/                         # ← NEW: Modular CSS (extracted from monolith)
│   ├── primer-tokens.css        # GitHub Primer color tokens, dark/light mode variables
│   ├── layout.css               # Navbar, sidebar, three-column grid layout
│   └── components.css           # Cards, badges, modals, telemetry, animations
│
├── js/                          # ← NEW: Modular JavaScript
│   ├── data/
│   │   ├── repos-catalog.js     # All 62+ skill repository definitions + REPOS array
│   │   └── presets.js           # WORKFLOW_PRESETS & category definitions
│   ├── state/
│   │   └── store.js             # Redux-lite state engine + localStorage persistence
│   ├── services/
│   │   ├── key-vault.js         # Credential manager & API key secure storage
│   │   ├── api-client.js        # Server sync, presets, Laya, health endpoints
│   │   └── telemetry.js         # Live INR/USD cost engine & session telemetry
│   └── ui/
│       ├── render-feed.js       # Accordion feed, repo filter, skill cards renderer
│       ├── render-modals.js     # Intent Router, Inspect modal, markdown formatter
│       └── app.js               # Application entry point & keyboard shortcuts
│
├── pages/                       # ← NEW: Standalone tools pages
│   └── token-monitor.html       # Live Token Monitor dashboard
│
├── scripts/                     # ← NEW: Build & maintenance scripts
│   ├── split-to-modules.js      # Extracts monolith → modular structure (run once)
│   └── inject-nav.js            # Injects nav links into index.html
│
├── index.html                   # Lean shell (984 lines, loads modular CSS+JS)
├── skill-gui.html               # Mirror of index.html (served as default GUI)
├── index.html.bak               # Original monolith backup (8,465 lines)
├── skill-gui-server.ps1         # Local HTTP REST server (10 API endpoints)
├── skill-gui.bat                # 1-Click Windows launcher for GUI
├── skill-loader.ps1             # Interactive terminal-based skill manager
├── skill-loader.bat             # 1-Click Windows launcher for CLI
├── skills-lock.json             # Skill registry and checksum tracker
├── README.md                    # Project documentation
└── LICENSE                      # MIT License
```

---

## 🛠️ REST API Specification

The local server (`skill-gui-server.ps1`) exposes the following endpoints on port `7891`:

| Endpoint | Method | Description |
|---|---|---|
| `GET /` | `GET` | Serves the GitHub Primer Web GUI |
| `GET /status` | `GET` | Returns active skills count, active list, and file timestamp on disk |
| `GET /verify-skills` | `GET` | Scans and verifies all skills in workspace and global directories |
| `GET /get-skill-content?skill=X` | `GET` | Streams the full content of `SKILL.md` for live in-GUI inspection |
| `GET /active-rules` | `GET` | Returns the raw markdown content of `active-skills.md` |
| `GET /session-telemetry` | `GET` | Streams real-time incoming/outgoing token usage and estimated cost in **₹ INR** |
| `GET /sessions-list` | `GET` | Lists all historical and active agent trajectories detected on disk |
| `GET /token-stats?period=day\|month\|total&model=X` | `GET` | **NEW**: Aggregated token stats across all sessions for the chosen period |
| `GET /token-trends?days=7\|30\|90\|365` | `GET` | **NEW**: Day-by-day token breakdown for chart visualization |
| `POST /apply` | `POST` | Writes generated markdown rules to `~/.gemini/config/rules/active-skills.md` |
| `POST /clear` | `POST` | Wipes active skills from `active-skills.md` |
| `POST /run-laya` | `POST` | Executes `laya_runner.py` with custom text and preset, returning instant classification |

Static files under any path are served automatically (CSS, JS, pages/, etc.).

---

## ⚡ Live Token Monitor (`pages/token-monitor.html`)

A dedicated full-screen dark dashboard available at [http://localhost:7891/pages/token-monitor.html](http://localhost:7891/pages/token-monitor.html) that reads from real Antigravity IDE trajectory files.

### Features:
- **Hero token count** — Giant, real-time total token counter for Day / Month / All-time
- **₹ INR primary cost** with USD secondary (configurable via Settings ⚙)
- **Token breakdown rows**: Input Cache Hit / Cache Miss / Output tokens
- **Usage Limit progress bars**: 5-hour window & weekly window with color-coded warnings
- **30-day trend chart** — Bar chart from actual transcript data (7 / 30 / 90 / 365-day ranges)
- **Model breakdown** — Per-model token attribution (Gemini Flash, Pro, Claude Sonnet, GPT-4o)
- **Auto-refresh every 15 seconds** (configurable, or manual-only mode)
- **Settings modal** — Adjust currency, exchange rate, limits, model, refresh interval

### How Tokens are Calculated:
Tokens are estimated from `transcript.jsonl` files in `~/.gemini/antigravity-ide/brain/<session-id>/`:
- Each JSONL line is a trajectory step. `content.length / 3.8` → estimated tokens (BPE approximation)
- Steps with `source == "MODEL"` or `type == "PLANNER_RESPONSE"` → **output tokens**
- All other steps (USER_INPUT, SYSTEM, tool responses) → **input tokens**
- Cache hit ratio estimated at 86% for long sessions (>10,000 input tokens)

> [!NOTE]
> Token counts are estimates using character-based BPE approximation (chars ÷ 3.8). They are not from the LLM API billing system, but provide an accurate-enough ballpark for cost tracking purposes.

---

## ⚡ Live Agent Session Token & Cost Telemetry Engine (INR & USD)

Skill Switcher features an integrated, **zero-overhead telemetry engine** that reads the running AI agent's trajectory stream (`transcript.jsonl`) non-intrusively in real time.

### Key Capabilities:
- **Primary Currency in Indian Rupees (₹ INR)** with secondary US Dollar ($ USD) toggle (Benchmark rate: `₹86.50/USD`).
- **Zero Performance Overhead**: Reads trajectory logs lock-free via non-blocking file streams (`[System.IO.FileShare]::ReadWrite`). Zero extra LLM queries are made.
- **Full Model Pricing Matrix**: Switch between Gemini Flash, Gemini Pro, Claude 3.5 Sonnet, Claude 3.5 Haiku, and GPT-4o pricing tiers with instant recalculation.
- **Granular Token Tracking**: Separates incoming context (prompts, tool responses, file snippets) from outgoing context (agent thoughts, plans, code generation).
- **Tool Execution Breakdown**: Real-time matrix of executed CLI commands, file views, directory listings, and edits.
- **Dual UI Badges**: Live cost displays on both the top navigation bar and the right-hand "About Active Context" panel.

---

## 🤝 Contributing

Contributions are welcome!
1. Add new skill folders in `.agents/skills/<skill-name>/` with a valid `SKILL.md`.
2. Register the repository and subskills in `js/data/repos-catalog.js`.
3. Submit a Pull Request.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) &copy; 2026 **Doctor9Trio**.
