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

## 🚀 Quick Start

### Method 1: Web GUI Mode (Recommended)

1. Double-click **`skill-gui.bat`** (or run `powershell -ExecutionPolicy Bypass -File .\skill-gui-server.ps1`).
2. The local server launches at `http://localhost:7891` and automatically opens in your default browser.
3. Select any skill, repository, or 1-click preset.
4. Click **Apply to Antigravity Memory**.
5. Start or resume your AI coding session — your agent immediately executes with active skills!

### Method 2: Terminal Interactive CLI

For terminal users:
1. Double-click **`skill-loader.bat`** (or run `powershell -ExecutionPolicy Bypass -File .\skill-loader.ps1`).
2. Press numbers `1-11` to toggle skill packs on/off.
3. Press `A` to apply directly to `active-skills.md` on disk.
4. Press `S` to inspect disk memory status, or `W` to wipe memory.
5. Press `T` to test the Laya System 1 decision engine live in terminal.

---

## 📁 Repository Structure

```
Skills-Switcher/
├── .agents/
│   └── skills/                  # 85+ Bundled, production-ready JEV, Laya, GSAP & MCP skills
│       ├── laya/                # Multilingual non-autoregressive System 1 decision engine & runner
│       ├── jev-ultrafast/       # High-speed DOM automation loop
│       ├── fast-jev-compaction/ # Context-window token compactor
│       ├── typesafe-mcp/        # Model Context Protocol decision primitives
│       ├── json-render/         # Generative UI React component renderer
│       ├── semdecide/           # Semantic decision tree reviewer
│       ├── winnow/              # Context filter and noise pruner
│       ├── gsap-skills-.../     # Complete GSAP animation suite
│       └── ...
│
├── skill-gui.html               # Single-page GitHub Primer application
├── index.html                   # Static web entry point
├── skill-gui-server.ps1         # Local HTTP REST server (APIs: /status, /verify-skills, /get-skill-content, /apply, /clear, /run-laya)
├── skill-gui.bat                # 1-Click Windows launcher for GUI
├── skill-loader.ps1             # Interactive terminal-based skill manager with direct disk sync
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
| `POST /apply` | `POST` | Writes generated markdown rules to `~/.gemini/config/rules/active-skills.md` |
| `POST /clear` | `POST` | Wipes active skills from `active-skills.md` |
| `POST /run-laya` | `POST` | Executes `laya_runner.py` with custom text and preset, returning instant classification |

---

## 🤝 Contributing

Contributions are welcome!
1. Add new skill folders in `.agents/skills/<skill-name>/` with a valid `SKILL.md`.
2. Register the repository and subskills in `skill-gui.html` and `index.html`.
3. Submit a Pull Request.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) &copy; 2026 **Doctor9Trio**.
