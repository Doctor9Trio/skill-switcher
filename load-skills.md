# Doctor9Trio / Skill Switcher — Master Skill Context Loader

> **Universal Context Injection Manual for Antigravity IDE, Claude Code, and Gemini AI Sessions.**

Run or reference this document when you want to inject specialized skill context into your AI assistant without launching the GUI.
Simply tell the AI in chat:
> *"Load skills for [category]"* or *"Run load-skills.md for [intent]"*

The AI will immediately read the corresponding skill files and adopt the specialist role for your session.

---

## 🧭 Available Skill Categories

| # | Pillar Category | When to Use | Primary Skills Loaded |
|---|---|---|---|
| **1** | **JEV SYSTEMS** | Fast DOM loops, token compaction, typed decision engines | `jev-ultrafast`, `fast-jev-compaction`, `jev-codex-router`, `jev-drone`, `semdecide`, `winnow`, `blink`, `agent-desktop` |
| **2** | **MCP TOOLS** | Model Context Protocol servers, typed schemas, tools | `typesafe-mcp`, `jev-mcp`, `appllama-design` |
| **3** | **FRONTEND & DESIGN** | High-end UI, GSAP animations, Motion.dev, Apple design | `gsap-core`, `motion-dev-animations`, `impeccable`, `apple-design`, `tailwind-design-system`, `emil-design-eng` |
| **4** | **DATA & MEDIA** | Generative UI (JSON Render), knowledge graphs, 3D/video | `json-render`, `neo4jev`, `seedance2`, `higgsfield-generate`, `threejs-webgl`, `rive-interactive` |
| **5** | **CODE REVIEW** | PR audits, semantic decision gates, security & diff checks | `jev-review`, `winnow`, `semdecide`, `canny-verifier`, `code-reviewer` |
| **6** | **FULL STACK** | Complete autonomous stack: JEV + MCP + UI + Review | **ALL skills bundled in repository** |

---

## ⚡ Quick Trigger Prompts (Say These in Chat)

- `"Load JEV skills"` &rarr; Injects sub-second DOM automation and context compaction rules.
- `"Load MCP skills"` &rarr; Exposes Model Context Protocol decision primitives and typed tools.
- `"Load FRONTEND skills"` &rarr; Activates GSAP, Motion.dev, and Apple/Impeccable design guidelines.
- `"Load DATA & MEDIA skills"` &rarr; Injects JSON Render Generative UI and media workflows.
- `"Load CODE REVIEW skills"` &rarr; Enforces semantic decision gates, noise filtering, and diff auditing.
- `"Load ALL skills"` &rarr; Injects the full multi-disciplinary developer stack.

---

## 📁 Skill File Location Map

### 1. JEV SYSTEMS
- `.agents/skills/jev-ultrafast/SKILL.md` (Sub-second DOM navigation loop)
- `.agents/skills/fast-jev-compaction/SKILL.md` (Context window token compactor)
- `.agents/skills/jev-codex-router/SKILL.md` (Deterministic prompt router)
- `.agents/skills/jev-drone/SKILL.md` (Autonomous multi-step execution loop)
- `.agents/skills/semdecide/SKILL.md` (Semantic choice tree evaluator)
- `.agents/skills/winnow/SKILL.md` (Context noise pruner)
- `.agents/skills/blink/SKILL.md` (Micro-turn verification loop)
- `.agents/skills/agent-desktop/SKILL.md` (Desktop automation primitives)

### 2. MCP TOOLS
- `.agents/skills/typesafe-mcp/SKILL.md` (Typed MCP client/server SDK)
- `.agents/skills/jev-mcp/SKILL.md` (Jev System One decision primitives)
- `.agents/skills/appllama-design/SKILL.md` (Appllama mobile component scaffolder)

### 3. FRONTEND & DESIGN
- `.agents/skills/motion-dev-animations-skill/SKILL.md` (Motion.dev v11+ hardware-accelerated animations)
- `~/.gemini/config/skills/gsap-skills-gsap-core/SKILL.md` (GSAP timeline, ScrollTrigger, useGSAP)
- `~/.gemini/config/skills/impeccable/SKILL.md` (Aesthetic polish, spatial hierarchy, typography)
- `~/.gemini/config/skills/emilkowalski-skills-apple-design/SKILL.md` (Apple HIG 8 design foundations)
- `~/.gemini/config/skills/emilkowalski-skills-emil-design-eng/SKILL.md` (Design engineering heuristics)

### 4. DATA & MEDIA
- `.agents/skills/json-render/SKILL.md` (Streaming Generative UI React component renderer)
- `.agents/skills/neo4jev/SKILL.md` (Graph-based knowledge extraction)
- `~/.gemini/config/skills/seedance2-skill/SKILL.md` (Generative video prompts & consistency)
- `~/.gemini/config/skills/claudedesignskills-threejs-webgl/SKILL.md` (3D interactive canvases)

### 5. CODE REVIEW & AUDITING
- `.agents/skills/jev-review/SKILL.md` (Automated diff review & quality gates)
- `.agents/skills/canny-verifier/SKILL.md` (Visual & logical assertions)
- `.agents/skills/semdecide/SKILL.md` (Deterministic architectural decisions)

### 6. FULL STACK (ALL SKILLS)
Reads all files across categories 1 through 5.

---

## 🤖 AI Instructions (When Triggered by User)

When the user says `"Load [CATEGORY] skills"` or asks to apply rules from `load-skills.md`:

1. **Locate and Read** every `SKILL.md` file listed under that category in `.agents/skills/`.
2. **Apply Directives**: Adopt the guidelines, constraints, and trigger syntax specified in those files.
3. **Confirm Activation** to the user with a concise confirmation summary:

#### Example Confirmation (JEV Systems):
> *JEV Systems loaded. Operating with sub-second DOM automation (`jev-ultrafast`), active context pruning (`fast-jev-compaction`), and typed decision trees (`semdecide`). Token consumption optimized by 85–90%.*

#### Example Confirmation (Frontend & Design):
> *Frontend & Design skills loaded. Operating with Motion.dev v11+ / GSAP animations, Emil Kowalski design engineering principles, and GitHub Primer / Apple HIG aesthetic standards. 60fps GPU transforms and strict design tokens active.*

---

## 🔄 Adding or Updating Skills in this Loader

1. Add your new skill folder and `SKILL.md` inside `.agents/skills/<skill-name>/`.
2. Add the skill entry to the corresponding category section in this file (`load-skills.md`).
3. If using the GUI, also register it in `skill-gui.html` inside `const REPOS = [...]`.

---

*Authored for **Doctor9Trio / Skill Switcher** • Offline-First Context Intelligence*
