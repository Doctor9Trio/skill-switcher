# Skill Switcher

<p align="center">
  <strong>Dynamic AI Skill Orchestrator & Context Rules Manager for Antigravity IDE, Claude Code, and Gemini</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT">
  <img src="https://img.shields.io/badge/Interface-GitHub%20Primer-1f2328.svg" alt="Interface">
  <img src="https://img.shields.io/badge/Offline-100%25%20Local-success.svg" alt="Local Offline">
  <img src="https://img.shields.io/badge/Author-Doctor9Trio-0969da.svg" alt="Author">
</p>

---

## 🌟 What is Skill Switcher?

**Skill Switcher** is a developer-first tool designed to eliminate prompt fatigue in AI pair-programming sessions.

Modern AI coding agents (Antigravity IDE, Claude Code, Gemini CLI) read custom rules and specialized instructions from rule files (`~/.gemini/config/rules/active-skills.md`) at the start of every session. **Skill Switcher** provides both a high-fidelity **GitHub Primer Web GUI** and an **interactive terminal CLI** that lets you activate, configure, and swap specialized skills with one click.

```
+------------------------+      Click "Apply"      +-------------------------------------------+
|  Skill Switcher GUI    |  ====================>  | ~/.gemini/config/rules/active-skills.md   |
| (JEV, MCP, UI, Review) |                         | (Auto-read by Antigravity every session!) |
+------------------------+                         +-------------------------------------------+
```

---

## ✨ Features

- **GitHub Primer UI/UX**: Built entirely to match GitHub's native design system with Light and Dark mode support, Geist fonts, and official Octicons.
- **6-Pillar Subcategory Navigation**:
  - ⚡ **JEV Systems** — Sub-second DOM automation, fast context compaction, typed decision engines.
  - 🔌 **MCP Tools** — Model Context Protocol servers, tools, and typed schema primitives.
  - 🎨 **Frontend & Design** — Modern CSS, GSAP animations, Motion Dev, Tailwind, Apple design rules.
  - 📊 **Data & Media** — Generative UI (JSON Render), vector search, 3D, and audio/video generation.
  - 🔍 **Code Review** — Multi-agent diff review, semantic decision gates, vulnerability checks.
  - 🌐 **All Repositories** — Comprehensive catalog of 30+ repositories and 85+ tools.
- **Smart 1-Click Operations**:
  - **Direct Select Checkboxes**: Activate an entire repository's toolset directly from the sidebar or header.
  - **Single Adaptive Expand/Collapse**: One smart toggle button (`∨ Expand All` / `> Collapse All`) that adapts to your view.
  - **Refined Status Indicators**: Clean, subtle blue counters (`✓ Active (N)`) and soft amber indicators for partial selection.
- **API Key Management**: Built-in credential prompts for skills requiring API keys (OpenAI, Fal.ai, Appllama) without exposing keys to git.
- **Educational Guide**: Includes a built-in "How to Use Skills & JEV" master modal explaining triggers, token savings, and workflow best practices.
- **Batteries-Included**: Bundled with 23+ production-ready open-source JEV & MCP skills inside `.agents/skills/`.

---

## 🚀 Quick Start

### Method 1: GUI Mode (Recommended)

1. Double-click **`skill-gui.bat`** (or execute `./skill-gui-server.ps1` in PowerShell).
2. The local server launches at `http://localhost:7891` and automatically opens in your default browser.
3. Select the skill packs or repositories you want.
4. Click **Apply to Antigravity Memory**.
5. Start or resume your AI coding session — your AI agent now executes using those active skills!

### Method 2: Terminal Interactive CLI

For command-line enthusiasts:
1. Double-click **`skill-loader.bat`** (or run `powershell -ExecutionPolicy Bypass -File .\skill-loader.ps1`).
2. Use keyboard number toggles to activate/deactivate skill categories.
3. Press `A` to apply directly to Antigravity memory.

---

## 📁 Repository Structure

```
skill-switcher/
├── .agents/
│   └── skills/                  # 23+ Bundled, production-ready JEV & MCP skills
│       ├── jev-ultrafast/       # High-speed DOM automation loop
│       ├── fast-jev-compaction/ # Context-window token compactor
│       ├── typesafe-mcp/        # Model Context Protocol decision primitives
│       ├── json-render/         # Generative UI React component renderer
│       ├── semdecide/           # Semantic decision tree reviewer
│       ├── winnow/              # Context filter and noise pruner
│       └── ...
│
├── skill-gui.html               # Single-page GitHub Primer application
├── skill-gui-server.ps1         # Local HTTP server (APIs: /verify-skills, /apply, /clear, /status)
├── skill-gui.bat                # 1-Click Windows launcher for GUI
├── skill-loader.ps1             # Interactive terminal-based skill selector
├── skill-loader.bat             # 1-Click Windows launcher for CLI
├── skills-lock.json             # Skill registry and checksum tracker
├── README.md                    # Project documentation
├── LICENSE                      # MIT License
└── .gitignore                   # Standard ignore rules
```

---

## 🛠️ How to Add or Update Skills

### 1. Adding a New Skill File
Place your skill's `SKILL.md` inside `.agents/skills/<skill-name>/`:

```markdown
---
name: my-new-skill
description: Brief description of what this skill does and when to invoke it
---

# Instructions & Workflows
- Define step-by-step rules and workflows for the AI agent here.
```

### 2. Registering the Skill in `skill-gui.html`
Open `skill-gui.html`, locate `const REPOS = [` around line 1650, and add the repository definition:

```javascript
{
  "id": "repo-my-skill",
  "name": "Doctor9Trio/my-skill",
  "title": "My Specialized Skill",
  "repoUrl": "https://github.com/Doctor9Trio/my-skill",
  "desc": "Short explanation of the capabilities of this skill pack.",
  "lang": "TypeScript",
  "langColor": "#3178c6",
  "stars": "500",
  "cat": "mcp", // Category: jev, mcp, frontend, data_media, review
  "hasApiKey": false,
  "subskills": [
    {
      "id": "my-skill-tool",
      "name": "My Skill Tool",
      "cat": "mcp",
      "desc": "Executes specialized workflow tasks.",
      "purpose": "Invoked whenever task X is needed.",
      "trigger": "/my-skill [options]",
      "files": [
        ".agents/skills/my-new-skill/SKILL.md"
      ],
      "act": "MY SKILL: Execute task X following the instructions in my-new-skill/SKILL.md."
    }
  ]
}
```

### 3. Updating Existing Skills
- To modify prompt behavior: edit the corresponding `.agents/skills/<skill-name>/SKILL.md` file.
- To change GUI metadata, triggers, or descriptions: edit the entry in `skill-gui.html`.
- The GUI will immediately reflect your updates upon page refresh.

---

## 🔑 API Key Support

Certain MCP tools require API credentials (e.g. OpenAI, Fal.ai, Appllama).
When a skill marked `"requiresApiKey": true` is selected:
- The GUI displays a **`🔑 API Key`** badge on the repository card.
- Click the badge or settings button to safely configure the key for your local environment.

---

## 🤝 Contributing

Contributions are always welcome! Feel free to:
1. Fork the repository.
2. Add new skill definitions in `.agents/skills/` and register them in `skill-gui.html`.
3. Submit a Pull Request.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) &copy; 2026 **Doctor9Trio**.
