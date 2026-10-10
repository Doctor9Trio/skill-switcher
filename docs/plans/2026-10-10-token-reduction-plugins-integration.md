# Token Reduction Engine & Functional Plugins Management Hub Plan

> **For Claude / Antigravity:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a fully functional, production-ready Plugins & Token Reduction Hub in Skill Switcher with a dedicated page (`pages/plugins.html`), real local system integration (`skill-gui-server.ps1`), live token savings metrics, and seamless synchronization with Antigravity IDE and the Token Monitor.

**Architecture:**
1. **Local System Bridge (`skill-gui-server.ps1`)**:
   - `GET /plugins`: Discovers and reports real status (Active / Installed / Configured), capabilities, and tokens saved for all key plugins (`code-review-graph`, `ponytail`, `graphify`, `OmniRoute`, `zipai-optimizer`, `typesafe-mcp`).
   - `POST /plugins/toggle`: Atomically toggles plugins in the local machine environment (`~/.gemini/config/rules/active-skills.md`, `.agents/skills/`, and `mcp_config.json`).
   - `GET /plugins/metrics`: Attributes token savings to specific plugins and tools based on actual trajectory telemetry.
2. **Dedicated UI Hub (`pages/plugins.html`)**:
   - GitHub Primer design system, matching `pages/token-monitor.html` and `index.html`.
   - Top Metrics Strip: Active Savers, Total Tokens Saved, Efficiency Rate.
   - One-Click Presets: "⚡ Ultra-Low Token Mode", "🛡️ High Precision Mode", "🚀 Maximum Speed".
   - Rich Plugin Cards with real ON/OFF toggles, token saving percentages, live invocation counters, and expandable "How It Works & Benefit" guides.
   - MCP Server Capability Drawer showing live tool schemas (`get_minimal_context_tool`, etc.).
3. **Cross-Page Subnav Synchronization**:
   - Add `Plugins & MCP Hub` subnav tab across `index.html`, `skill-gui.html`, `pages/token-monitor.html`, and `pages/plugins.html`.
4. **Token Monitor Attribution**:
   - In `pages/token-monitor.html`, link active plugins to the live cache savings and tool telemetry cards.

---

## Technical Details: Plugin Specifications, Mechanics & Savings Calculation

| Plugin / Tool | Category | How It Works & Primary Benefit | Token Savings & Impact | Trajectory / Verification Detection |
| :--- | :--- | :--- | :--- | :--- |
| **`code-review-graph`** | ⚡ Token Saver & MCP | Provides AST dependency subgraphs via 29 specialized MCP tools (`get_minimal_context_tool`, `get_impact_radius_tool`). Instead of dumping entire 10k–30k token files into context to find a function or callers, the model fetches surgical 100–300 token AST context slices. | **Saves 70%–85% context** per code investigation (~14.9k tokens saved per minimal context query). | Trajectory matches calls to `mcp_code-review-graph_*` or `get_minimal_context_tool`. Calculated: `calls * 14,900 tokens`. |
| **`graphify`** | ⚡ Token Saver & Arch | Analyzes full codebase relations and generates a unified static `graphify-out/GRAPH_REPORT.md`. Gemini reads the report instead of performing repeated greps and multi-file reads. | **Saves 50%–65% exploration tokens** (~25,000 tokens per exploration session). | Checks if `graphify` is active in `active-skills.md` or presence of graph report. |
| **`ponytail`** | ⚡ Token Saver & Dev Mindset | Enforces extreme senior developer pragmatism ("laziness"), strict YAGNI ladder, and surgical diffs. Forbids rewriting entire files or adding redundant boilerplate. | **Saves 35%–50% output tokens** on code changes. Eliminates 2,000–5,000 superfluous output tokens per turn. | Trajectory output ratio audit + active status in `active-skills.md`. |
| **`OmniRoute`** | ⚡ Token Saver & Router | Combines lossless prompt compression (RTK / Caveman syntax) with task-based model routing (directing fast tasks to Gemini 2.5 Flash / Flash Lite). | **Saves 60%–80% prompt tokens** and up to 75% API billing cost through intelligent model tiering. | Active status in `active-skills.md` + compression factor applied to input prompts. |
| **`zipai-optimizer`** | ⚡ Token Saver & Output Filter | Adaptive token optimizer: enforces surgical output, log truncation, regex grep piping, and strict context-window frugality. | **Saves 40%–60% tool output tokens** (prevents multi-megabyte log bloat from entering conversation history). | Active status in `active-skills.md`. |
| **Prompt Caching** | ⚡ Native Engine Cache | Automatically caches static conversation history, system instructions, and skill definitions in Gemini's RAM on Google's cloud. | **86% cost discount on cached tokens** and near-instant time-to-first-token. | Directly measured via live trajectory `cache_hit_tokens` and `cache_hit_pct`. |
| **`typesafe-mcp`** | 🛡️ Reliability & Safety | Enforces strict JSON Schema type validation and parameter checks on all MCP tool invocations before execution. | **Indirect Savings: 3k–8k tokens per error loop** by eliminating failed tool retry loops, error recovery turns, and hallucinations. | Active status in `active-skills.md` / `mcp_config.json`. |
| **`impeccable`** | 🎨 UI / UX Quality | Enforces GitHub Primer and design token consistency, typography, micro-animations, and high-fidelity aesthetics. | **Quality & UX Benefit**: Ensures UI code adheres strictly to established design tokens without aesthetic drift. | Active status in workspace `.agents/skills/impeccable`. |

---

## How Users Know They Are Working (Functional Verification)

1. **Physical Filesystem Persistence**:
   - When a user clicks **Enable** on `pages/plugins.html`, the backend writes the plugin rule to `~/.gemini/config/rules/active-skills.md` and/or updates `mcp_config.json`. Antigravity IDE re-reads this file immediately on the next prompt.
   - The UI reflects live filesystem state via real-time polling (`GET /plugins` and `GET /status`).
2. **Live Trajectory Detection**:
   - The backend scans `C:\Users\1000859\.gemini\antigravity-ide\brain\` for live tool invocations (e.g. `get_minimal_context_tool`, `get_impact_radius_tool`).
   - If the tools are called, the UI displays real invocation counts (e.g., `12 invocations detected`, `~178,800 tokens saved`).
3. **Cross-Page Token Monitor Integration**:
   - `pages/token-monitor.html` receives a dedicated **Plugin Savings & Efficiency Card** that calculates exact tokens saved by active plugins in the selected time period.
   - Direct button links allow jumping between the Token Monitor and the Plugins Hub.

---

## Task Breakdown

### Task 1: Backend Plugin & Token Savings APIs in `skill-gui-server.ps1`
- **Files**: `skill-gui-server.ps1`
- **Step 1**: Add `Get-PluginRegistry` returning full metadata, installation status, active status, tool schemas, and calculated tokens saved.
- **Step 2**: Add `GET /plugins` endpoint for full catalog and savings data.
- **Step 3**: Add `POST /plugins/toggle` endpoint:
  - If a skill-based plugin (`ponytail`, `graphify`, `OmniRoute`, `zipai-optimizer`, `typesafe-mcp`): Updates `~/.gemini/config/rules/active-skills.md` and/or workspace `.agents/skills/`.
  - If an MCP-based plugin (`code-review-graph`): Checks MCP registration and enables/disables in `mcp_config.json`.
- **Step 4**: Add `POST /plugins/preset` endpoint supporting:
  - `ultra-saver`: Enables `code-review-graph`, `ponytail`, `zipai-optimizer`, `OmniRoute`.
  - `balanced`: Enables `code-review-graph`, `ponytail`, `typesafe-mcp`.
  - `all-off`: Disables non-essential plugins.
- **Step 5**: Enhance `Get-TokenStats` in `skill-gui-server.ps1` to include `plugin_savings` object with attributed tokens saved.
- **Step 6**: Test endpoints via PowerShell.

### Task 2: Build the Plugins Hub Page (`pages/plugins.html`)
- **Files**: `pages/plugins.html`
- **Step 1**: Implement GitHub Primer HTML layout with responsive header, breadcrumb navigation, and tabbed subnav.
- **Step 2**: Create Top Metrics Strip:
  - Active Token Savers count.
  - Total Estimated Tokens Saved (Formatted e.g. `1.2M tokens`).
  - Estimated Cost Saved (₹ / $).
  - Efficiency Boost (%).
- **Step 3**: Create One-Click Preset Action Bar (`⚡ Ultra-Low Token Mode`, `⚖️ Balanced Mode`, `🔄 Refresh Status`).
- **Step 4**: Create Filter Tabs (`All Plugins`, `⚡ Token Savers`, `🛠️ MCP Tool Servers`, `🛡️ Quality & Safety`).
- **Step 5**: Create Rich Interactive Plugin Cards:
  - Real toggle switch (AJAX POST to `/plugins/toggle`).
  - Active / Installed status badge.
  - "Tokens Saved" badge with percentage reduction.
  - "How It Works" expandable drawer explaining the token mechanics and benefits.
  - "View MCP Tool Schemas" modal/drawer for `code-review-graph` (showing `get_minimal_context_tool`, `get_impact_radius_tool`, etc.).
- **Step 6**: Wire up real-time client JS to communicate with `/plugins` and `/status`.

### Task 3: Cross-Page Navigation Synchronization
- **Files**: `index.html`, `skill-gui.html`, `pages/token-monitor.html`
- **Step 1**: Add `<a href="pages/plugins.html" class="subnav-tab">` to `index.html` and `skill-gui.html`.
- **Step 2**: Add `<a href="plugins.html" class="subnav-tab">` to `pages/token-monitor.html`.
- **Step 3**: Ensure active states highlight correctly on each page.

### Task 4: Integrate Token Savings Attribution in Token Monitor
- **Files**: `pages/token-monitor.html`
- **Step 1**: In the Token Monitor stats section, add a dedicated **Plugin Savings Attribution Banner**:
  - Displays tokens saved by active plugins in the current period.
  - Shows breakdown: `code-review-graph (minimal context)`, `ponytail (surgical diffs)`, `Prompt Cache (Google RAM)`.
  - Provides a 1-click button: `Manage Plugins & Token Savers →` linking to `plugins.html`.
- **Step 2**: In the Tool Telemetry table, tag tools from `code-review-graph` with a `⚡ Saves ~14.9k tok/call` badge.

### Task 5: End-to-End Verification
- **Step 1**: Test backend endpoints (`/plugins`, `/plugins/toggle`, `/plugins/preset`, `/token-stats`).
- **Step 2**: Test clicking toggles in `plugins.html` to confirm file writes to `active-skills.md`.
- **Step 3**: Test navigating between `index.html`, `token-monitor.html`, and `plugins.html`.
- **Step 4**: Verify Token Monitor displays live savings and links seamlessly to Plugins Hub.

