# Skill Switcher

<p align="center">
  <strong>Dynamic AI Skill Orchestrator & Context Rules Manager for Antigravity IDE, Claude Code, and Gemini</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT">
  <img src="https://img.shields.io/badge/Interface-GitHub%20Primer-1f2328.svg" alt="Interface">
  <img src="https://img.shields.io/badge/Verified%20Tools-105%20Subskills-success.svg" alt="87 Verified Tools">
  <img src="https://img.shields.io/badge/The%20Shelf-27%20Discoveries-blueviolet.svg" alt="The Shelf">
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
- **📚 The Shelf (Technology Discovery Library & Inspiration Graph)**:
  - High-speed personal engineering repository and design library.
  - Zero-friction **5-second Quick Capture** directly into your Inbox.
  - **🎯 3 View Density Modes**:
    - **🎯 Focused Grid (Default)**: Breathable, high-hierarchy cards with category accents, bold titles, 1-line essences, and on-demand expandable insight drawers (`💡 Personal Context & Codebase Action`).
    - **📖 Detailed Grid**: Full context notes expanded inline with modern structured quote styling.
    - **📋 Dense List View**: High-density table layout for rapid scanning across 27+ saved resources.
  - **🔍 Distraction-Free Focus Reader Mode**:
    - Full-screen zen reading modal with keyboard navigation (`←`/`→` to cycle, `Esc` to close, `S` to star, `C` to copy markdown).
    - Eliminates repetitive boilerplates with clean typographic hierarchy, direct URL actions, and category badges.
  - **Curated Topic Collections**: Visual topic folders for *Design & Visual Identity*, *React & Animation Engines*, *Typography & Monospace Lab*, *CRO & Growth Psychology*, *AI Tools & Architectures*, and *Developer Tools*.
  - **1-Click Browser Bookmarklet**: Draggable bookmarklet button that captures any webpage or repository URL and title from any browser tab into your Shelf without leaving the page.
  - **Dual-Context Capture**: Captures both *"💭 Why I saved this"* (personal context) and *"🚀 Potential use"* (future application in active codebases).
  - **✨ Rediscover Engine**: Keeps saved resources alive by resurfacing past discoveries at the top of your feed with original notes and 1-click in-use adoption.
  - **Interactive Tag Cloud**: Expandable drawer with live tag frequencies and instant cross-cutting filtering.
  - **1-Click Markdown Citation (`📋 MD`)**: Copies formatted markdown citations and filtered list exports for PRs, notes, and RFCs.
- **Workflow Stacks (1-Click Presets)**:
  - 🎨 **Frontend Motion** — GSAP Core, ScrollTrigger, React, Timeline, Motion Dev, Animate, Impeccable, Make Interfaces Feel Better, Libraries.dev & Better Icons.
  - ⚡ **JEV DOM Loop** — Sub-second headless browser clicks & input verification loop, Drone spatial engine, Desktop agent, and Canny verifier.
  - 🧠 **System 1 Decision** — Laya non-autoregressive decision engine, Fast context compactor, Winnow noise filter, and Blink instant fixer.
  - 🛡️ **PR Review & Guard** — JEV multi-agent diff review, Canny verifier guardrails, and Semdecide semantic gates.
  - 📱 **Mobile App UX** — Appllama transit UX, Finch/Lungy pulse patterns, and Swift native styling.
  - ✍️ **Anti-Slop & Precision Writing** — Miqdad Badjuber's 38-rule corporate fluff elimination and ASD-STE100 Controlled English prompts.
  - 🔁 **Ralph Loop Autonomous Loop** — Geoffrey Huntley's self-correcting agent loop with test-driven gates.
  - 🏗️ **AI & ML Architect** — 8-stage production AI stack (Classical ML to MCP Agents & MLOps).
  - 🌐 **Full Suite** — Balanced, battle-tested full stack development context across all 105 skills.
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
  - Modal matrix listing all 105 subskills, file paths, file sizes, and verification status.
- **100% Offline & Private**:
  - Zero telemetry, zero cloud lock-in. All credentials and configurations stay strictly on your local machine.

---

## 📚 The Shelf — Personal Technology Discovery & Inspiration Graph

**The Shelf** is a high-speed personal technology discovery library integrated directly into Skill Switcher. Inspired by the visual curation of *recent.design*, the typography constraints of *constraint.systems*, and the behavioral teardowns of *growth.design*, The Shelf bridges the gap between discovering exciting open-source libraries, UI patterns, or AI models and actually applying them to your engineering projects.

```
+---------------------------------------------------------------------------------------------------------+
|                                    THE SHELF — DISCOVERY WORKFLOW                                       |
|                                                                                                         |
|  [Any Browser Tab]                                                                                      |
|         │                                                                                               |
|         ├── Drag & Click "📥 + Add to Shelf" Bookmarklet                                                |
|         │                                                                                               |
|  [The Shelf Inbox] ──────► Enrich GitHub Meta (Stars, Lang, Desc)                                       |
|         │                                                                                               |
|         ├── Assign Curated Topic Collection (Design, React, Typography, CRO, AI, Tools)                 |
|         ├── Record Dual Context: "💭 Why I saved this" & "🚀 Potential use in codebase"                 |
|         ├── Anchor to Project: (EKA Connect, FrontEnd, Skills-Switcher)                                 |
|         │                                                                                               |
|  [✨ Rediscover Engine] ──► Keep discoveries alive at top of feed                                       |
|  [📋 1-Click MD Copy]  ──► Instantly paste citations into PRs, RFCs, or agent instructions              |
+---------------------------------------------------------------------------------------------------------+
```

### 🎯 The Core Philosophy: Eliminating "Bookmark Graveyards"
Most developers save bookmarks that sit forgotten in browser folders. The Shelf solves this through four core architectural pillars:
1. **5-Second Zero-Friction Capture**: Paste any link into the top bar and press <kbd>Enter</kbd> to save directly to your **Inbox**.
2. **Dual-Context Capture**: Every discovery records not just a URL, but:
   - **💭 Why I saved this**: The specific aesthetic, mechanism, or performance win that stood out.
   - **🚀 Potential use**: Where and how this can be applied in your active codebase (e.g. *"Use in live telematics map or FrontEnd design tokens"*).
3. **Project Anchoring**: Connects discoveries directly to your active engineering projects.
4. **✨ Rediscover Engine**: Randomly resurfaces past discoveries at the top of your feed with your original notes, keeping saved resources alive and actionable.

---

### 🏷️ Curated Topic Collections & Folders
The Shelf automatically organizes discoveries into structured topic buckets:

| Collection | Theme | Focus Areas |
|---|---|---|
| 🎨 **Design & Visual Identity** | Aesthetic Reference | Masonry grids, editorial cards, dark mode palettes, visual craft |
| ⚡ **React & Animation Engines** | Motion & Physics | Framer Motion, spring physics, gesture systems, layout transitions |
| 🧪 **Typography & Monospace Lab**| Typographic Utility | Variable fonts, monospace experiments, font pairing, specimens |
| 📈 **CRO & Growth Psychology**  | Behavioral UX | A/B testing teardowns, onboarding friction reduction, psych loops |
| 🧠 **AI Tools & Architectures**  | Agentic Systems | Multi-agent coordination, memory systems, embeddings, vision models |
| 🛠️ **Developer Tools**          | Productivity | Terminal CLIs, performance monitors, debuggers, local automation |

- **Collections Overview**: Click the **"🏷️ Collections"** tab to see all topic folders, item counters, and recent sample items.
- **1-Click Card Navigation**: Click any collection tag (e.g. `🏷️ React & Animation Engines`) on any card to filter immediately to that topic.

---

### 📥 1-Click Browser Bookmarklet
Save any active web page or GitHub repo into your Shelf Inbox in 1 click without leaving the page:

1. Click the **"Bookmarklet"** button in the Shelf header to open the helper modal.
2. Drag the **`📥 + Add to Shelf`** button onto your browser's Bookmarks bar.
3. *Alternative (manual bookmark URL):*
   ```javascript
   javascript:(function(){var u=encodeURIComponent(window.location.href);var t=encodeURIComponent(document.title||'');window.open('http://localhost:7891/index.html?quickSaveUrl='+u+'&title='+t,'_blank');})();
   ```
4. **How it works**: Clicking the bookmarklet grabs the current page's URL and title, opens Skill Switcher, saves it directly to your Inbox, enriches it with GitHub metadata and favicons, and displays an instant confirmation toast.

---

### 🏷️ Interactive Tag Cloud Drawer
- Click **"Tags (N)"** in the search bar to toggle the expandable tag cloud drawer.
- Displays all topic tags ranked by frequency (e.g. `#branding (2)`, `#typography (2)`, `#animation (1)`).
- Click any tag chip to filter all discoveries across every collection in real time.
- Active filters display in a top banner with individual remove buttons and a **"Reset All Filters"** button.

---

### 📋 Markdown Export & Quick Citation
- **Single Discovery Citation (`📋 MD`)**: Click the **`📋 MD`** button on any discovery card to copy a clean markdown link with your personal notes and potential use to your clipboard:
  ```markdown
  [Recent Design](https://recent.design/) *(Project: FrontEnd)* — *Why: Pinterest-style masonry layout where cards let screenshots supply the color.* *(Potential use: EKA Connect visual feed redesign.)* #gallery #masonry #inspiration
  ```
- **Filtered List Copy (`Copy List`)**: Click **"Copy List"** on the search bar to copy all matching discoveries as an organized markdown list.
- **Full Markdown Export**: Click **"Export MD"** to download `DISCOVERY-LIBRARY.md` grouped by project anchors.
- **JSON Backup & Merge Import**: Export full JSON backups or merge JSON files without creating duplicate URLs.

---

### ⌨️ Shelf Keyboard Shortcuts

| Shortcut | Action | Scope |
|---|---|---|
| <kbd>/</kbd> | Focus search bar | Global (when no input is focused) |
| <kbd>n</kbd> or <kbd>+</kbd> | Open "+ Add Resource" modal | Global (when no input is focused) |
| <kbd>m</kbd> | Export `DISCOVERY-LIBRARY.md` | Global (when no input is focused) |
| <kbd>b</kbd> | Export JSON Backup | Global (when no input is focused) |
| <kbd>1</kbd> | Switch to Masonry Card Grid view | Global (when no input is focused) |
| <kbd>2</kbd> | Switch to Dense Table List view | Global (when no input is focused) |
| <kbd>Escape</kbd> | Clear active tag/collection/search filter or close modal | Global |
| <kbd>Ctrl</kbd> + <kbd>Enter</kbd> | Submit & save discovery in modal | Inside Add/Edit modal |

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

#### 🌐 Works on any PC / any user (no path editing needed)

Nothing in this repo is tied to the original author's machine. Every path is resolved **at runtime** for whoever runs it:

| What | How it is resolved |
|---|---|
| Your home folder | `%USERPROFILE%` → `$HOME` → OS profile folder |
| Antigravity home | `<home>/.gemini` |
| Active rules file | `<home>/.gemini/config/rules/active-skills.md` |
| Global skills | `<home>/.gemini/config/skills` |
| Session telemetry ("brain") | `<home>/.gemini/antigravity-ide/brain` (also checks `antigravity/brain`, `%LOCALAPPDATA%`, `%APPDATA%`) |
| Skill file pointers | The folder you cloned this repo into (`.agents/skills/...`), or the global skills folder if a skill is installed there |

The skill pointers written into `active-skills.md` are absolute paths to **your** clone, so Antigravity can open them from any workspace.

To see exactly what was detected on your machine, start the server and open `http://localhost:7891/env`. The startup banner prints the same info.

**Optional overrides** (set these environment variables before launching if your Antigravity setup is non-standard):

| Variable | Default |
|---|---|
| `SKILL_SWITCHER_HOME` | `<home>/.gemini` |
| `SKILL_SWITCHER_RULES_FILE` | `<SKILL_SWITCHER_HOME>/config/rules/active-skills.md` |
| `SKILL_SWITCHER_SKILLS_DIR` | `<SKILL_SWITCHER_HOME>/config/skills` |
| `SKILL_SWITCHER_BRAIN_DIR` | auto-detected |

> If you move or re-clone the repo, just click **Apply to Antigravity Memory** again so the pointers are regenerated for the new location.

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


---

## 🚀 Newly Added Skills & Community Curations

Skill Switcher now bundles **9 additional production-ready skills** and **19 new discoveries in The Shelf** extracted from real-world engineering reels, Threads, and X developer deep-dives:

| Skill | Category | Source / Creator | Core Value |
|---|---|---|---|
| **`logo-design-skill`** | Design / SVG | Kaan Kiziltug | 1,400+ SVG logos, optical overshoot, geometric grid alignment, and 16px favicon legibility test. |
| **`antislop`** | Writing / Rules | Miqdad Badjuber | 38 mandatory rules eliminating synthetic AI jargon ("delve", "tapestry", "testament") and throat-clearing fluff. |
| **`make-interfaces-feel-better`** | UI / UX | Jakub Krehel | Nested concentric border radius (R_outer = R_inner + padding), optical visual weight balance, and 120ms physics curves. |
| **`better-icons`** | DevTools / CLI | Better Icons | 200,000+ icons from 150+ icon packs (Lucide, Heroicons, Phosphor, Tabler) accessible via CLI and MCP. |
| **`libraries-dev`** | Frontend / FX | Libraries.dev | Shimmering border beams, thinking orbs, voice pulse glows, gooey blobs, and metal shader effects. |
| **`ralph-loop`** | AI / Agentic | Geoffrey Huntley | Autonomous state machine agent loop: Plan -> Execute -> Test/Lint -> Diff Check -> Auto-Remediate -> Commit. |
| **`controlled-english-ste`** | Prompting / Spec | Andrej Karpathy / STE | ASD-STE100 aerospace specification: <=20 word sentences, single-meaning vocabulary roots to eliminate LLM hallucinations. |
| **`tour-onboarding-engine`** | Frontend / Tours | Intro.js / Reactour / Onborda | Multi-framework onboarding guide with spotlight SVG masks, step persistence, and accessible keyboard navigation. |
| **`ai-engineer-roadmap`** | AI / MLOps | AI Engineering Community | 8-stage complete curriculum from Classical ML & Deep Learning to RAG, Autonomous MCP Agents, Fine-Tuning, and MLOps. |

---

## 📁 Repository Structure

```
Skills-Switcher/
├── .agents/
│   └── skills/                  # 105+ Bundled, production-ready JEV, Laya, GSAP & MCP skills
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
├── js/                          # Modular JavaScript
│   ├── data/
│   │   ├── repos-catalog.js     # All 50 skill repository definitions (105 subskills) + REPOS array
│   │   ├── presets.js           # WORKFLOW_PRESETS & category definitions
│   │   └── shelf-store.js       # The Shelf: Discovery Store, Collections & Markdown Engine
│   ├── state/
│   │   └── store.js             # Redux-lite state engine + localStorage persistence
│   ├── services/
│   │   ├── key-vault.js         # Credential manager & API key secure storage
│   │   ├── api-client.js        # Server sync, presets, Laya, health endpoints
│   │   └── telemetry.js         # Live INR/USD cost engine & session telemetry
│   └── ui/
│       ├── render-feed.js       # Accordion feed, repo filter, skill cards renderer
│       ├── render-modals.js     # Intent Router, Inspect modal, markdown formatter
│       ├── render-shelf.js      # The Shelf: Collections, Cards, Tag Cloud & Rediscover UI
│       └── app.js               # Application entry point, deep-linking & shortcuts
│
├── pages/                       # Standalone tools pages
│   └── token-monitor.html       # Live Token Monitor dashboard
│
├── scripts/                     # Build & maintenance scripts
│   ├── split-to-modules.js      # Extracts monolith → modular structure (run once)
│   └── inject-nav.js            # Injects nav links into index.html
│
├── index.html                   # Lean shell (loads modular CSS+JS)
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
| `GET /env` | `GET` | Returns the paths resolved for the **current user** (home, rules file, global skills, brain, project root) |
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

## ⚡ Live Token & Cost Telemetry Monitor (`pages/token-monitor.html`)

A dedicated full-screen telemetry command center styled with GitHub Primer tokens at [http://localhost:7891/pages/token-monitor.html](http://localhost:7891/pages/token-monitor.html) that non-intrusively streams and analyzes real Antigravity IDE trajectory sessions.

### 📊 Professional Visualization Engine (Offline Chart.js 4.4.1)
- **3 Dynamic Charting Styles**:
  - 📊 **Stacked Bars (`bar`)**: Rounded bar breakdown distinguishing Input Context vs Model Generation.
  - 📈 **Smooth Spline Gradient Area (`area`)**: Tension-smoothed Bezier curves with 2-stop linear alpha underfill gradients.
  - 🚀 **Cumulative Running Burn-up (`cumulative`)**: Continuous trajectory burn-up curve across the selected timeframe.
- **Dual Metric Toggles**: Switch between raw token volume (**Tokens**) and financial expenditure (**Cost**) in any currency.
- **Timeframe Granularity**: Instant filtering across **7D**, **14D**, **30D**, and **90D** horizons.
- **Live Stat Highlight Strip**: Real-time peak daily burn, average daily velocity, 30-day run rate projections, and prompt cache savings.
- **Interactive Tooltips & Legend**: Primer dark/light theme tooltips with formatted currency values and toggleable datasets.

### ⚙️ Deep User Customization Options
- **Multi-Currency Engine**: Support for **₹ INR** (default @ ₹86.50/USD), **$ USD**, **€ EUR**, **£ GBP**, **¥ JPY**, **C$ CAD**, and **A$ AUD** with customizable live exchange rate inputs.
- **Rolling Usage Limits & Alerts**:
  - 5-Hour rolling context limit
  - Weekly budget target
  - Monthly context budget
  - Interactive threshold warning slider (50%–95%) with color-coded alerts (Yellow/Red).
- **Custom Model Pricing Contract**:
  - Supports Gemini 3.8 Flash, Gemini 3.1 Pro, Claude Sonnet 4.6, Claude Haiku 4.5, GPT-4o, DeepSeek V3, and a **Custom Model** mode with user-defined input and output rates per 1M tokens.
- **Configurable Polling Intervals**: 5s (High Frequency), 15s (Standard), 30s (Relaxed), 60s (Low Overhead), or Manual Sync only.
- **Factory Reset Defaults**: Instant one-click restoration of all initial parameters.

### 🔮 Interactive Token & Cost Forecasting Estimator
- Accessible via the **Estimator** navbar button or deep link `?open=estimator`.
- Enter any hypothetical Prompt and Completion token volume with quick presets (`10k`, `50k`, `100k`, `250k`, `1M` input; `1k`, `4k`, `8k`, `16k`, `32k` output).
- Adjust the Prompt Cache Hit ratio slider (0%–100%) to model caching discounts.
- Generates a side-by-side cost forecast table across all 6 model tiers in your active currency.
- **1-Click Markdown Export**: Copies formatted forecast tables directly to your clipboard.

### 🔗 Deep Linking & Bidirectional Redirection
Seamlessly navigate between Skill Switcher, The Shelf, and Token Monitor with URL parameters:
- `index.html?open=shelf` — Opens The Shelf discovery library
- `index.html?quickSaveUrl=https://github.com/...&title=RepoTitle` — 1-Click quick capture to Shelf Inbox from any browser tab via bookmarklet
- `pages/token-monitor.html?currency=EUR&chart=area&metric=cost&range=14`
- `pages/token-monitor.html?open=settings`
- `pages/token-monitor.html?open=estimator`
- Return to main Skill Switcher tabs directly via subnav breadcrumbs:
  - `../index.html` (Skills & Packs)
  - `../index.html?open=shelf` (The Shelf)
  - `../index.html?open=laya` (Laya Playground)
  - `../index.html?open=keys` (API Key Vault)
  - `../index.html?open=health` (Verification Matrix)
  - `../index.html?open=telemetry` (Session Telemetry Modal)

### 💾 Data Export Utilities
- **Export JSON**: Complete telemetry snapshot including active model, exchange rates, and session metadata.
- **Export CSV**: Daily time series table for spreadsheet analysis (Excel, Google Sheets).
- **Copy Markdown**: Executive summary ready for sharing on GitHub PRs or Slack.

### How Tokens are Calculated:
Tokens are estimated from `transcript.jsonl` files in `~/.gemini/antigravity-ide/brain/<session-id>/`:
- Each JSONL line is a trajectory step. `content.length / 3.8` → estimated tokens (BPE approximation)
- Steps with `source == "MODEL"` or `type == "PLANNER_RESPONSE"` → **output tokens**
- All other steps (USER_INPUT, SYSTEM, tool responses) → **input tokens**
- Cache hit ratio estimated at 86% for long sessions (>10,000 input tokens)

> [!NOTE]
> Token counts are calculated from raw transcript trajectory files using character-based BPE approximation (chars ÷ 3.8) without invoking extra LLM APIs, ensuring zero runtime overhead.

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
