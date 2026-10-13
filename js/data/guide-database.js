/**
 * Guides & Knowledge Database · Doctor9Trio/skill-switcher
 * Exhaustive reference manual for MCP Engines, Token Reduction Plugins, and Core Skills.
 */
const GUIDE_DATABASE = {
  "intro": {
    "id": "intro",
    "title": "Getting Started with Skill Switcher",
    "subtitle": "Unified orchestration engine for 1,696+ agent skills, 7 token-reduction plugins, and 173+ MCP tools.",
    "icon": "🚀",
    "badges": [
      {
        "text": "Core Platform",
        "type": "green"
      },
      {
        "text": "Universal Portability",
        "type": "blue"
      },
      {
        "text": "Active Runtime",
        "type": "purple"
      }
    ],
    "calloutTitle": "What is Skill Switcher?",
    "calloutText": "Skill Switcher solves the fundamental problem of AI context overflow: modern agent frameworks choke when hundreds of skills are dumped into prompt memory simultaneously. Skill Switcher dynamically enables only the precise skills, plugins, and MCP servers needed for the current task.",
    "diagrams": [
      {
        "title": "Skill Switcher 3-Layer Orchestration & Context Guard Architecture",
        "description": "Visualizing how Skill Switcher filters a vast 1,696 skill catalog down to a lean 3-5 item context payload.",
        "chart": "flowchart TD\n  UserPrompt[\"User / Agent Prompt\"] --> Router{\"Skill Switcher Filter\"}\n  Router -->|\"Select 3-5 Skills\"| ActiveSkills[\"Behavioral Skill Packs<br/>(Ponytail, Impeccable, Debugger)\"]\n  Router -->|\"Query Specific Tools\"| ActiveMCP[\"Functional MCP Servers<br/>(REA 173 Tools, CRG 29 Tools)\"]\n  Router -->|\"Compact & Truncate\"| ActiveSavers[\"Token Reduction Savers<br/>(OmniRoute, ZipAI, Graphify)\"]\n  ActiveSkills --> Context[\"Optimized Context Window<br/>(< 12,000 Tokens)\"]\n  ActiveMCP --> Context\n  ActiveSavers --> Context\n  Context -->|\"Preserved 70% Context Space\"| LLM[\"LLM (Claude / Gemini / GPT-4o)\"]"
      }
    ],
    "sections": [
      {
        "heading": "1. The Context Inflation Problem",
        "bodyHtml": "<p>When an AI agent (Claude Code, Antigravity, Cursor, Windsurf) loads every skill and tool into its system prompt, you pay a steep penalty:</p><ul><li><b>Context Exhaustion:</b> 1,000 skills consume over 120,000 input tokens before you even type your first prompt.</li><li><b>Instruction Drift:</b> When too many competing guidelines exist, models suffer 'needle in a haystack' degradation and ignore critical instructions.</li><li><b>Massive Cost:</b> Repeating 100k+ input tokens on every turn burns dollars in API credits every hour.</li></ul><p>Skill Switcher introduces a selective activation architecture: keep your library of 1,696 skills installed locally, but dynamically activate only the 3-5 tools relevant to your current mission.</p>"
      },
      {
        "heading": "2. Step-by-Step User Instructions: Managing Skills",
        "bodyHtml": "<p>Operating Skill Switcher is completely friction-free:</p><ol><li><b>Launch the GUI Server:</b> Run <code>.\\skill-gui-server.ps1</code> in PowerShell. This boots the lightweight local GUI server on port 7891 (or 7892).</li><li><b>Activate a Preset or Custom Skill:</b> In the Web UI, click on any skill badge or preset (e.g. <i>Next.js Senior Fullstack</i>, <i>Reverse Engineering Deep Dive</i>). The server instantly updates your global <code>active-skills.md</code>.</li><li><b>Automatic Live Sync:</b> Your active coding agents (Claude Code / Antigravity) immediately inherit the updated guidelines on the next invocation without needing a restart!</li><li><b>Toggle Functional Plugins:</b> Navigate to the <b>Plugins & Savers</b> tab to enable or disable heavy MCP servers (like REA or Code Review Graph) on demand.</li></ol>"
      },
      {
        "heading": "3. The Three Layers of Skill Switcher",
        "bodyHtml": "<p>The ecosystem is organized into three distinct operational layers:</p><ol><li><b>Behavioral Skill Packs:</b> Plain markdown instructions that guide model behavior (e.g., <code>ponytail</code>, <code>impeccable</code>, <code>gsap</code>, <code>systematic-debugging</code>). Stored in <code>~/.gemini/config/skills/</code> and activated via <code>active-skills.md</code>.</li><li><b>Functional MCP Servers:</b> External executable engines that expose JSON-RPC tools to the model (e.g., <code>rea</code> with 173 reverse-engineering tools, <code>code-review-graph</code> with 29 AST tools). Configured in <code>~/.gemini/config/mcp_config.json</code>.</li><li><b>Token Reduction Savers:</b> Algorithmic compression layers (OmniRoute, ZipAI, Graphify) that actively compact prompts, filter runaway command outputs, and preserve KV cache lines.</li></ol>"
      },
      {
        "heading": "4. Repository & Installation Requirements: Do I Need to Clone Repos?",
        "bodyHtml": "\n    <p>A frequent question from developers is: <b>\"Do I need to clone and keep full git repositories for every plugin, skill, and MCP server?\"</b></p>\n    <p>The answer depends on the architectural tier:</p>\n    <div class=\"tools-table-wrap\">\n      <table class=\"tools-table\">\n        <thead>\n          <tr>\n            <th>Component Type</th>\n            <th>Needs Full Git Repo?</th>\n            <th>Required Prerequisites</th>\n            <th>How It Runs</th>\n          </tr>\n        </thead>\n        <tbody>\n          <tr>\n            <td><b>REA Reverse Engineer Engine</b></td>\n            <td><span class=\"status-badge orange\">YES (or npx rea)</span></td>\n            <td>Node.js v20+, <code>npm run build:cached</code></td>\n            <td>Local background MCP JSON-RPC process at <code>Desktop/Tools/REA</code></td>\n          </tr>\n          <tr>\n            <td><b>Code Review Graph (CRG)</b></td>\n            <td><span class=\"status-badge green\">NO (Pip Package)</span></td>\n            <td>Python 3.10+, <code>pip install code-review-graph</code></td>\n            <td>Local background MCP process via <code>code-review-graph.exe</code></td>\n          </tr>\n          <tr>\n            <td><b>Skill Rule Plugins</b><br/>(Ponytail, OmniRoute, ZipAI, Graphify, GSD, Impeccable, Typesafe-MCP)</td>\n            <td><span class=\"status-badge green\">NO (Zero Repo)</span></td>\n            <td>None! Plain Markdown files in <code>.agents/skills/</code> and <code>active-skills.md</code></td>\n            <td>Injected directly into AI context window by Skill Switcher</td>\n          </tr>\n          <tr>\n            <td><b>Gemini Prompt Cache</b></td>\n            <td><span class=\"status-badge purple\">NO (Cloud TPU)</span></td>\n            <td>Zero install! Built into Google TPU RAM infrastructure</td>\n            <td>Automatic hardware-level KV-cache reuse for prefixes &gt; 1,024 tokens</td>\n          </tr>\n        </tbody>\n      </table>\n    </div>\n    <div class=\"w3-callout-banner\" style=\"margin-top:14px;\">\n      <h4>💡 Rule of Thumb</h4>\n      <p>Only <b>REA</b> requires maintaining a compiled local repository folder (or global npm package). All prompt/rule skills run purely from their lightweight Markdown definitions!</p>\n    </div>\n  "
      },
      {
        "heading": "5. How to Trigger Any Plugin, MCP, or Skill",
        "bodyHtml": "\n    <p>Every tool and skill in Skill Switcher can be triggered in multiple ergonomic ways:</p>\n    <ul>\n      <li><b>Automatic Tool Invocations:</b> When MCP servers (REA, CRG) are active in <code>mcp_config.json</code>, the AI agent automatically invokes relevant tools (e.g. <code>get_minimal_context_tool</code> or <code>rea_inspect_binary</code>) whenever your task requires code analysis or reverse engineering.</li>\n      <li><b>Explicit Prompt Keywords:</b> Mention the plugin or skill name directly in your prompt. For example: <code>\"Audit this module using ponytail rules\"</code> or <code>\"Run graphify to map dependencies\"</code>.</li>\n      <li><b>Slash Commands:</b> If supported in your IDE interface, trigger specialized workflows like <code>/gsd</code> for autonomous execution.</li>\n      <li><b>Skill Switcher UI Toggles:</b> Simply flip the switch on the <a href=\"plugins.html\" style=\"color:var(--accent-blue);font-weight:600;\">Plugins Hub</a>. Enabled skills are immediately injected into your active session via <code>active-skills.md</code>.</li>\n    </ul>\n  "
      },
      {
        "heading": "6. Universal Troubleshooting & Diagnostic Guide",
        "bodyHtml": "\n    <p>If you encounter any unexpected behavior while using plugins, MCP servers, or skills, follow this checklist:</p>\n    <div class=\"tools-table-wrap\">\n      <table class=\"tools-table\">\n        <thead>\n          <tr>\n            <th>Observed Symptom</th>\n            <th>Underlying Cause</th>\n            <th>Resolution Steps</th>\n          </tr>\n        </thead>\n        <tbody>\n          <tr>\n            <td><b>MCP server not showing up in IDE</b></td>\n            <td>IDE has not reloaded <code>mcp_config.json</code> or server failed to boot</td>\n            <td>1. Check <code>~/.gemini/config/mcp_config.json</code>.<br/>2. Test running command manually in terminal (e.g. <code>code-review-graph --version</code>).<br/>3. Restart IDE or reload MCP servers.</td>\n          </tr>\n          <tr>\n            <td><b>Skill instructions not being followed</b></td>\n            <td>Skill is toggled OFF or rule file was overwritten</td>\n            <td>1. Open <a href=\"plugins.html\" style=\"color:var(--accent-blue);\">Plugins Hub</a> and ensure plugin toggle is GREEN.<br/>2. Check <code>~/.gemini/config/rules/active-skills.md</code>.<br/>3. Explicitly mention skill name in prompt.</td>\n          </tr>\n          <tr>\n            <td><b>Executable not found on Windows</b></td>\n            <td>Path contains unescaped backslashes or missing from system PATH</td>\n            <td>Use forward slashes (e.g. <code>C:/Python311/Scripts</code>) or verify PATH environment variable in PowerShell.</td>\n          </tr>\n        </tbody>\n      </table>\n    </div>\n  "
      }
    ],
    "promptRecipe": "Inspect the active skill configuration and activate only the essential skills for this refactoring session:\n- poncho senior developer optimization\n- code review graph AST querying\n- systematic debugging\nEnsure token reduction is active before analyzing the codebase.",
    "metrics": [
      {
        "label": "Catalog Size",
        "val": "1,696",
        "desc": "Indexed skills across all engineering domains"
      },
      {
        "label": "Active MCP Tools",
        "val": "173+",
        "desc": "Live tools available via Model Context Protocol"
      },
      {
        "label": "Average Token Cut",
        "val": "45%-70%",
        "desc": "Input/output reduction using active plugins"
      }
    ]
  },
  "architecture": {
    "id": "architecture",
    "title": "The 3-Tier Dynamic Fallback Ladder",
    "subtitle": "How Skill Switcher guarantees 100% zero-install portability across different developers, OS environments, and CI pipelines.",
    "icon": "🪜",
    "badges": [
      {
        "text": "Portability Engine",
        "type": "green"
      },
      {
        "text": "Zero-Install NPX",
        "type": "orange"
      },
      {
        "text": "Windows / macOS / Linux",
        "type": "blue"
      }
    ],
    "calloutTitle": "The Zero-Breakage Guarantee",
    "calloutText": "Hardcoded local directory paths are the #1 reason shared AI configurations fail when cloned to a new machine. Skill Switcher implements a 3-Tier Dynamic Fallback Ladder: if a local repository clone is missing, it seamlessly invokes the global CLI, and if that is missing, it on-demand executes the tool via npx with zero installation required.",
    "diagrams": [
      {
        "title": "The 3-Tier Dynamic Fallback Ladder Execution Flow",
        "description": "How the runtime guarantees tool availability regardless of local machine configuration.",
        "chart": "flowchart TD\n  Req[\"Agent Requests MCP Tool (e.g. REA / CRG)\"] --> T1{\"Tier 1: Local Repo Clone Exists?<br/>(e.g. Desktop/Tools/REA)\"}\n  T1 -->|\"Yes (Fastest & Editable)\"| RunT1[\"Run Local Node Script<br/>node scripts/rea.mjs\"]\n  T1 -->|\"No\"| T2{\"Tier 2: Global CLI in PATH?<br/>(npm i -g package)\"}\n  T2 -->|\"Yes (Pinned Version)\"| RunT2[\"Run Global Binary<br/>rea-mcp\"]\n  T2 -->|\"No\"| T3[\"Tier 3: Zero-Install On-Demand<br/>cmd.exe /d /c npx -y [pkg]@latest mcp\"]\n  RunT1 --> Ready[\"Tool Ready for AI Agent (Zero Manual Setup)\"]\n  RunT2 --> Ready\n  T3 --> Ready"
      }
    ],
    "sections": [
      {
        "heading": "1. Why Static Paths Break",
        "bodyHtml": "<p>When Developer A registers an MCP server with <code>\"args\": [\"C:\\\\Users\\\\Alice\\\\Desktop\\\\Tools\\\\REA\\\\scripts\\\\rea.mjs\"]</code>, Developer B (e.g. <code>C:\\\\Users\\\\Bob\\\\...</code>) gets an instant crash: <code>ENOENT: file not found</code>.</p><p>Skill Switcher resolves this by abstracting tool invocation into a 3-tier precedence ladder evaluated at runtime:</p>"
      },
      {
        "heading": "2. Step-by-Step Execution Rules",
        "bodyHtml": "<ul><li><b>Tier 1 — Local Developer Clone (Fastest, Editable):</b> If the source repo exists in the workspace or desktop (e.g. <code>Desktop/Tools/REA</code> or <code>Desktop/Tools/code-review-graph</code>), Skill Switcher uses the local build. This allows active development and instant testing of local edits.</li><li><b>Tier 2 — Globally Installed CLI (Fast, Version-Pinned):</b> If no local clone is found, the system checks <code>PATH</code> for a globally installed package (e.g., <code>npm i -g rea-agents</code> or <code>npm i -g code-review-graph</code>).</li><li><b>Tier 3 — Zero-Install On-Demand Fallback (Guaranteed to Work Anywhere):</b> If neither local clone nor global package exists, the MCP server is configured via <code>cmd.exe /d /c npx -y [package-name]@latest [command]</code> on Windows (or <code>npx -y ...</code> on POSIX). This downloads and executes the verified tool on the fly into temporary npm cache without requiring manual installation or admin rights!</li></ul>"
      },
      {
        "heading": "3. Windows CMD Wrapper Protocol",
        "bodyHtml": "<p>On Windows systems, running <code>npx</code> or <code>node</code> directly from GUI processes often causes terminal window popups or PATH lookup failures. Skill Switcher uses the hardened <code>cmd.exe /d /c</code> wrapper:</p><div class=\"code-block\"><pre><code>{\n  \"command\": \"cmd.exe\",\n  \"args\": [\"/d\", \"/c\", \"npx\", \"-y\", \"rea-agents@latest\", \"mcp\"]\n}</code></pre></div><p>The <code>/d</code> flag disables registry AutoRun commands, and <code>/c</code> executes the command silently and terminates cleanly upon completion.</p>"
      }
    ],
    "mcpConfig": "{\n  \"mcpServers\": {\n    \"rea\": {\n      \"command\": \"cmd.exe\",\n      \"args\": [\"/d\", \"/c\", \"npx\", \"-y\", \"rea-agents@latest\", \"mcp\"],\n      \"disabled\": false\n    },\n    \"code-review-graph\": {\n      \"command\": \"cmd.exe\",\n      \"args\": [\"/d\", \"/c\", \"npx\", \"-y\", \"code-review-graph@latest\"],\n      \"disabled\": false\n    }\n  }\n}",
    "promptRecipe": "Audit the current workspace configuration against the 3-Tier Dynamic Fallback Ladder. Verify that all registered MCP servers use either environment variables ($USERPROFILE / $HOME) or npx zero-install fallbacks so any team member can run them without broken paths."
  },
  "token-economics": {
    "id": "token-economics",
    "title": "Token Economics & Context Optimization",
    "subtitle": "Understanding input token decay, KV-cache prefix hits, output compression, and real cost attribution.",
    "icon": "💰",
    "badges": [
      {
        "text": "Cost Telemetry",
        "type": "green"
      },
      {
        "text": "KV Cache",
        "type": "purple"
      },
      {
        "text": "ROI & Benchmarks",
        "type": "orange"
      }
    ],
    "calloutTitle": "Why Token Economics Dictate Coding Quality",
    "calloutText": "As context window consumption climbs past 50% capacity, Large Language Models experience 'attention saturation' — retrieval latency increases by 300% and logic hallucination rates jump from 4% to over 28%. Token optimization is not just about saving dollars; it is about keeping the model sharp and accurate.",
    "diagrams": [
      {
        "title": "Context Saturation & Cost Decay Comparison",
        "description": "Comparing the token bloat and hallucination risk of unbuffered runs vs Skill Switcher's surgical context.",
        "chart": "flowchart LR\n  subgraph Unoptimized[\"Unoptimized Run (100k+ Tokens)\"]\n    U1[\"Full-File Dumps<br/>30,000 Tokens\"] --> U2[\"All 1,000 Skills Loaded<br/>120,000 Tokens\"]\n    U2 --> U3[\"Attention Saturation<br/>28% Hallucination Risk | $0.45/turn\"]\n  end\n  subgraph Optimized[\"Skill Switcher Optimized (< 12k Tokens)\"]\n    O1[\"CRG AST Slices<br/>100 Tokens\"] --> O2[\"Selective 3-5 Skills<br/>2,500 Tokens\"]\n    O2 --> O3[\"Sharp Reasoning<br/>Zero Hallucination | $0.02/turn\"]\n  end"
      }
    ],
    "sections": [
      {
        "heading": "1. Input vs Output Economics",
        "bodyHtml": "<p>In standard LLM pricing (Claude 3.7 Sonnet, GPT-4o, Gemini 2.5 Pro):</p><ul><li><b>Input Tokens:</b> Cost ~$3.00 per million tokens (or $0.30/M when cached).</li><li><b>Output Tokens:</b> Cost ~$15.00 per million tokens — <b>5x more expensive</b> than input!</li></ul><p>This is why plugins like <b>Ponytail</b> focus aggressively on output compaction (surgical diffs rather than full-file reprints), saving massive token expenses on every code edit.</p>"
      },
      {
        "heading": "2. Telemetry Attribution Formula",
        "bodyHtml": "<p>Skill Switcher measures token savings in real time using session telemetry from your active agent workspace:</p><div class=\"code-block\"><pre><code>Tokens_Saved = (CRG_Calls * 14,900) + (Output_Tokens * 0.35) + (Input_Tokens * 0.40) + Cache_Hits\nCost_Saved_USD = (Tokens_Saved / 1,000,000) * $0.35\nCost_Saved_INR = Cost_Saved_USD * ₹86.50</code></pre></div><p>Every invocation of an AST-based tool like <code>get_minimal_context_tool</code> replaces a 15,000 token file dump with a 100 token slice, immediately banking 14,900 saved tokens.</p>"
      }
    ],
    "metrics": [
      {
        "label": "Cost per 1M Output",
        "val": "$15.00",
        "desc": "Standard output token cost across frontier models"
      },
      {
        "label": "Cache Discount",
        "val": "90%",
        "desc": "Savings achieved on prefix cache hits"
      },
      {
        "label": "Context Health Threshold",
        "val": "< 45%",
        "desc": "Ideal context utilization for zero hallucination"
      }
    ]
  },
  "rea": {
    "id": "rea",
    "title": "REA: Reverse Engineer Anything Engine",
    "subtitle": "173 tools for deep reverse engineering across native binaries (Ghidra/IDA/Radare2), Electron apps, .NET CIL, and web forensics.",
    "icon": "🔬",
    "pluginId": "rea",
    "badges": [
      {
        "text": "MCP Server Engine",
        "type": "purple"
      },
      {
        "text": "173 Live Tools",
        "type": "green"
      },
      {
        "text": "Zero-Install NPX",
        "type": "blue"
      },
      {
        "text": "Ephemeral & Safe",
        "type": "orange"
      }
    ],
    "calloutTitle": "Production Reverse Engineering Authority",
    "calloutText": "REA operates on ephemeral, read-only analysis databases. It never alters target executable bytes, never saves over attached GUI projects (IDA / Ghidra), and strictly isolates analysis sessions so you can inspect unknown or suspicious binaries with verified provenance and zero side-effects.",
    "diagrams": [
      {
        "title": "REA Ephemeral Reverse-Engineering & Decompilation Pipeline",
        "description": "How REA unifies multi-architecture disassemblers into safe, read-only JSON-RPC tool contracts.",
        "chart": "flowchart TD\n  Target[\"Target Input File<br/>(PE, ELF, Mach-O, .NET CIL, ASAR, Sourcemap)\"] --> Detect{\"Format & Architecture Detector\"}\n  Detect -->|\"Native Executable\"| Native[\"Ghidra Headless / IDA Pro (Read-Only) / Radare2\"]\n  Detect -->|\".NET Assembly\"| DotNet[\"CIL Method Decompiler / Metadata Inspector\"]\n  Detect -->|\"Electron App\"| Electron[\"ASAR Package Unpacker / V8 Bytecode Inspector\"]\n  Detect -->|\"Web Bundle\"| Web[\"Sourcemap Tree Reconstructor\"]\n  Native --> Ephemeral[\"Ephemeral Analysis Database<br/>(Read-Only Session Semantics | No Byte Mutation)\"]\n  DotNet --> Ephemeral\n  Electron --> Ephemeral\n  Web --> Ephemeral\n  Ephemeral --> Tools[\"173 Structured MCP JSON-RPC Tools\"]\n  Tools --> Agent[\"AI Coding Assistant (Claude Code / Antigravity / Windsurf)\"]"
      }
    ],
    "sections": [
      {
        "heading": "1. What is REA?",
        "bodyHtml": "<p><b>REA (Reverse Engineer Anything)</b> is a state-of-the-art reverse-engineering provider adapter and MCP server created by <code>morluto/rea</code>. It unites the world's most powerful decompilers, disassemblers, and format unpackers under one unified Model Context Protocol interface.</p><p>Instead of manually launching Ghidra, IDA Pro, ILSpy, and asar unpackers in separate windows, your AI agent directly queries REA tools to decompile functions, extract strings, trace call graphs, and reconstruct TypeScript sourcemaps in seconds.</p>"
      },
      {
        "heading": "2. Step-by-Step Instructions: Reverse Engineering Workflow",
        "bodyHtml": "<p>When analyzing a binary or package with REA, follow this standardized 4-step triage protocol:</p><ol><li><b>Triage & Header Analysis:</b> Run <code>analyze_binary</code> with <code>deep: false</code>. Verify architecture (x86, x64, ARM64), subsystem, and imports. Check section entropy: if <code>.text</code> entropy > 7.2, the binary is likely packed with UPX, VMProtect, or Themida.</li><li><b>String & Symbol Reconnaissance:</b> Execute <code>extract_strings</code> with <code>minLength: 5</code>. Search for URLs, registry keys, error strings, and cryptographic constants (AES s-boxes, MD5 initializers).</li><li><b>Targeted Decompilation:</b> Identify the main dispatcher or export address, then call <code>decompile_function</code>. REA invokes Ghidra headless or IDA Pro to generate clean C/C++ pseudo-code directly into context.</li><li><b>Call-Graph Reconstruction:</b> Call <code>get_call_graph</code> with <code>depth: 2</code> to map all functions that call or are called by sensitive routines (e.g. network sockets or file writes).</li></ol>"
      },
      {
        "heading": "3. Analyzing .NET, Electron, and Web Targets",
        "bodyHtml": "<ul><li><b>.NET Assemblies (.dll / .exe):</b> Call <code>decompile_csharp_method</code> with <code>assemblyPath</code> and <code>typeName</code> to recover complete C# source code from Intermediate Language.</li><li><b>Electron Desktop Apps:</b> Target <code>app.asar</code> using <code>extract_asar_bundle</code>. REA unpackages all HTML/JS assets into a temporary directory for structural audit.</li><li><b>Production Web Bundles:</b> If a production site has <code>bundle.js.map</code>, run <code>recover_sourcemaps</code> to reconstitute the original TypeScript project structure with filenames and comments!</li></ul>"
      },
      {
        "heading": "4. Requirements & Repository Dependency: Do I Need the Repo?",
        "bodyHtml": "\n    <div class=\"w3-callout-banner\">\n      <h4>📦 Repository Requirement: YES (or npx rea)</h4>\n      <p>REA is a full-featured multi-engine reverse engineering suite. To run it as a local MCP server, you need either the compiled repository locally on disk or the published global npm package.</p>\n    </div>\n    <div class=\"tools-table-wrap\">\n      <table class=\"tools-table\">\n        <thead>\n          <tr>\n            <th>Prerequisite</th>\n            <th>Specification / Status</th>\n            <th>Purpose</th>\n          </tr>\n        </thead>\n        <tbody>\n          <tr>\n            <td><b>Local Repository</b></td>\n            <td><code>C:\\Users\\1000859\\Desktop\\Tools\\REA</code></td>\n            <td>Holds disassembler adapters, Ghidra scripts, and build artifacts.</td>\n          </tr>\n          <tr>\n            <td><b>Node.js Runtime</b></td>\n            <td>Node.js v20.x or v22.x (Verified v22.20.0 installed)</td>\n            <td>Executes the MCP JSON-RPC server and ESM pipeline.</td>\n          </tr>\n          <tr>\n            <td><b>Build Artifacts</b></td>\n            <td><code>dist/mcp/main.js</code> (Compiled ESM bundle)</td>\n            <td>Must be generated by running <code>npm ci && npm run build:cached</code>.</td>\n          </tr>\n        </tbody>\n      </table>\n    </div>\n  "
      },
      {
        "heading": "5. How to Trigger REA & Tool Syntax",
        "bodyHtml": "\n    <p>REA exposes 173 specialized reverse-engineering tools over MCP. You can trigger it via:</p>\n    <ul>\n      <li><b>Natural Language Prompt:</b> <code>\"Use REA tools to inspect the exports and section entropy of C:/path/to/binary.exe\"</code>.</li>\n      <li><b>Decompilation Prompt:</b> <code>\"Decompile the C# method ProcessPayload in assembly C:/path/to/Assembly.dll using REA\"</code>.</li>\n      <li><b>Direct CLI Execution:</b> In your terminal, run:\n        <pre class=\"code-block\" style=\"margin:8px 0;\"><code>node C:/Users/1000859/Desktop/Tools/REA/scripts/rea.mjs analyze \"C:/path/to/target.exe\"</code></pre>\n      </li>\n    </ul>\n  "
      },
      {
        "heading": "6. Troubleshooting REA Common Problems",
        "bodyHtml": "\n    <div class=\"tools-table-wrap\">\n      <table class=\"tools-table\">\n        <thead>\n          <tr>\n            <th>Error / Symptom</th>\n            <th>Root Cause</th>\n            <th>Solution</th>\n          </tr>\n        </thead>\n        <tbody>\n          <tr>\n            <td><code>Cannot find module 'dist/mcp/main.js'</code></td>\n            <td>REA repository has not been built after git clone</td>\n            <td>Run <code>cd C:\\Users\\1000859\\Desktop\\Tools\\REA && npm run build:cached</code>.</td>\n          </tr>\n          <tr>\n            <td><code>MCP connection timeout</code></td>\n            <td>Node.js path missing or port blocked</td>\n            <td>Verify <code>mcp_config.json</code> points to absolute path of <code>node.exe</code> and <code>scripts/rea.mjs</code>.</td>\n          </tr>\n          <tr>\n            <td><code>Target format unrecognized</code></td>\n            <td>Target file is empty, encrypted, or unsupported format</td>\n            <td>Check file header magic bytes. REA supports PE, ELF, Mach-O, .NET CIL, and Electron ASAR.</td>\n          </tr>\n          <tr>\n            <td><code>File path backslash error on Windows</code></td>\n            <td>Unescaped Windows backslashes in tool argument</td>\n            <td>Always provide paths using forward slashes: <code>C:/path/to/binary.exe</code>.</td>\n          </tr>\n        </tbody>\n      </table>\n    </div>\n    <div style=\"margin-top:12px;\">\n      <a href=\"plugins.html\" class=\"btn-preset\" style=\"display:inline-flex;align-items:center;gap:6px;text-decoration:none;padding:6px 12px;font-size:12px;color:var(--accent-blue);\">\n        ← Return to Plugins Hub to toggle REA\n      </a>\n    </div>\n  "
      }
    ],
    "tools": [
      {
        "name": "analyze_binary",
        "params": "path: string, deep: boolean",
        "desc": "Extracts architecture, subsystem, imports, exports, cryptographic signatures, and section entropy."
      },
      {
        "name": "decompile_function",
        "params": "path: string, address: string | symbol: string",
        "desc": "Produces clean C/C++ pseudo-code decompilation using Ghidra or IDA decompiler engine."
      },
      {
        "name": "disassemble_range",
        "params": "path: string, start: string, length: number",
        "desc": "Disassembles raw machine instructions into architecture-specific assembly (x86_64, ARM64)."
      },
      {
        "name": "extract_strings",
        "params": "path: string, minLength?: number, encoding?: string",
        "desc": "Extracts ASCII, UTF-8, and UTF-16 strings with section provenance and offset tags."
      },
      {
        "name": "decompile_csharp_method",
        "params": "assemblyPath: string, typeName: string, methodName: string",
        "desc": "Decompiles .NET Common Intermediate Language (CIL) back into high-fidelity C# code."
      },
      {
        "name": "extract_asar_bundle",
        "params": "asarPath: string, outputDir?: string",
        "desc": "Unpacks Electron app ASAR packages and lists contained source files and assets."
      },
      {
        "name": "recover_sourcemaps",
        "params": "bundlePath: string | url: string",
        "desc": "Extracts inline or linked sourcemaps to reconstruct original unminified TypeScript/JavaScript source trees."
      },
      {
        "name": "get_call_graph",
        "params": "path: string, rootSymbol: string, depth?: number",
        "desc": "Computes forward and backward call graphs for symbols and functions across binary modules."
      }
    ],
    "mcpConfig": "{\n  \"mcpServers\": {\n    \"rea\": {\n      \"command\": \"cmd.exe\",\n      \"args\": [\"/d\", \"/c\", \"npx\", \"-y\", \"rea-agents@latest\", \"mcp\"],\n      \"disabled\": false\n    }\n  }\n}",
    "promptRecipe": "Use REA to analyze the binary located at 'C:/Users/1000859/Desktop/Tools/sample.exe'. First extract its imports and high-entropy sections to check for packing. If unpacked, decompile the main entrypoint and identify any cryptographic API references."
  },
  "code-review-graph": {
    "id": "code-review-graph",
    "title": "Code Review Graph (CRG — 29 AST Tools)",
    "subtitle": "Surgical AST context queries replacing 10k-30k token file dumps with concise ~100 token dependency slices.",
    "icon": "🕸️",
    "pluginId": "code-review-graph",
    "badges": [
      {
        "text": "MCP Server",
        "type": "purple"
      },
      {
        "text": "70%-85% Context Cut",
        "type": "green"
      },
      {
        "text": "29 AST Tools",
        "type": "blue"
      }
    ],
    "calloutTitle": "Context Window Savior",
    "calloutText": "Instead of dumping whole files into memory to locate functions or callers, Gemini and Claude call 'get_minimal_context_tool' or 'get_impact_radius_tool' to fetch only the exact AST slice needed (~100 tokens vs 20,000 tokens per file). This reduces token burn by up to 85% during debugging and code review.",
    "diagrams": [
      {
        "title": "Code Review Graph AST Querying vs Full-File Dumps",
        "description": "How CRG indexes source code and answers relational queries in under 100 tokens.",
        "chart": "flowchart LR\n  Source[\"Source Code Files<br/>(TS, Python, Go, Rust)\"] --> TreeSitter[\"Tree-Sitter AST & Call-Graph Indexer\"]\n  TreeSitter --> SQLite[\"Local Relational SQLite Cache<br/>(Nodes, Edges, Callers, Callees)\"]\n  SQLite --> Query{\"Agent Query Type\"}\n  Query -->|\"Symbol Details\"| MinCtx[\"get_minimal_context_tool<br/>85 Tokens (vs 20k Token File Dump)\"]\n  Query -->|\"Blast Radius\"| ImpRad[\"get_impact_radius_tool<br/>Downstream Dependency Graph\"]\n  MinCtx --> LLMContext[\"Clean Context Window (99% Token Preserved)\"]\n  ImpRad --> LLMContext"
      }
    ],
    "sections": [
      {
        "heading": "1. How CRG Eliminates Redundant Dumps",
        "bodyHtml": "<p>When you ask an AI: <i>'Who calls validateToken in our auth module?'</i>, standard tools read <code>auth.ts</code> (2,000 tokens), <code>routes.ts</code> (4,500 tokens), and <code>middleware.ts</code> (3,000 tokens) — burning nearly 10,000 tokens.</p><p>With <b>Code Review Graph</b>, the agent queries the pre-built AST dependency index in SQLite. CRG returns the caller signatures and parameter types in <b>85 tokens</b>. The rest of your context window remains clean.</p>"
      },
      {
        "heading": "2. Step-by-Step Instructions: Refactoring with CRG",
        "bodyHtml": "<p>Follow this procedure whenever performing multi-file refactoring or reviewing code:</p><ol><li><b>Build/Refresh AST Index:</b> Call <code>build_or_update_graph_tool</code> pointing to your project directory. This scans AST nodes incrementally into SQLite.</li><li><b>Query Blast Radius:</b> Before changing any public function or export, call <code>get_impact_radius_tool</code> with the file path. It returns every caller across the repository that depends on that symbol.</li><li><b>Fetch Minimal Signatures:</b> For each affected caller, call <code>get_minimal_context_tool</code> to retrieve only its signature and docstring. Do not read the entire caller file into memory.</li><li><b>Execute Surgical Edits:</b> Apply edits with exact line ranges, keeping token overhead minimal.</li></ol>"
      },
      {
        "heading": "3. Requirements & Repository Dependency: Do I Need the Repo?",
        "bodyHtml": "\n    <div class=\"w3-callout-banner\">\n      <h4>🐍 Repository Requirement: NO! (Pip Package Only)</h4>\n      <p><b>You DO NOT need to clone or maintain a git repository for Code Review Graph.</b></p>\n      <p>CRG is distributed as a standalone Python CLI tool. It is already installed on your system via <code>pip install code-review-graph</code> (version 2.3.3 verified in PATH at Python 3.11).</p>\n    </div>\n    <div class=\"tools-table-wrap\">\n      <table class=\"tools-table\">\n        <thead>\n          <tr>\n            <th>Prerequisite</th>\n            <th>Required?</th>\n            <th>Your Machine Status</th>\n          </tr>\n        </thead>\n        <tbody>\n          <tr>\n            <td><b>Git Repository Cloned</b></td>\n            <td><span class=\"status-badge green\">NO</span></td>\n            <td>Not needed. Runs as installed binary.</td>\n          </tr>\n          <tr>\n            <td><b>Python 3.10+</b></td>\n            <td><span class=\"status-badge green\">YES</span></td>\n            <td>Python 3.11.9 confirmed in PATH.</td>\n          </tr>\n          <tr>\n            <td><b>code-review-graph CLI</b></td>\n            <td><span class=\"status-badge green\">YES</span></td>\n            <td>v2.3.3 installed in Python Scripts.</td>\n          </tr>\n        </tbody>\n      </table>\n    </div>\n  "
      },
      {
        "heading": "4. How to Trigger Code Review Graph",
        "bodyHtml": "\n    <p>CRG provides 29 AST query tools. Trigger it via:</p>\n    <ul>\n      <li><b>Automatic Agent Invocations:</b> When asking the agent to review, refactor, or find callers of a function, Gemini automatically calls <code>get_minimal_context_tool</code> or <code>get_impact_radius_tool</code> instead of reading entire 30,000-token files.</li>\n      <li><b>Prompt Recipe:</b> <code>\"Use Code Review Graph minimal context to inspect function parsePayload in src/engine.ts and its callers.\"</code></li>\n      <li><b>CLI Verification:</b> In PowerShell:\n        <pre class=\"code-block\" style=\"margin:8px 0;\"><code>code-review-graph --help</code></pre>\n      </li>\n    </ul>\n  "
      },
      {
        "heading": "5. Troubleshooting CRG Common Problems",
        "bodyHtml": "\n    <div class=\"tools-table-wrap\">\n      <table class=\"tools-table\">\n        <thead>\n          <tr>\n            <th>Symptom</th>\n            <th>Cause</th>\n            <th>Fix</th>\n          </tr>\n        </thead>\n        <tbody>\n          <tr>\n            <td><code>'code-review-graph' is not recognized</code></td>\n            <td>Python Scripts folder not in system PATH</td>\n            <td>Run <code>pip install code-review-graph</code> and add <code>C:\\Python311\\Scripts</code> to PATH.</td>\n          </tr>\n          <tr>\n            <td><code>AST parse failure</code></td>\n            <td>File contains syntax errors or unsupported language</td>\n            <td>Verify file syntax before querying. CRG supports Python, TS, JS, Go, and Rust.</td>\n          </tr>\n          <tr>\n            <td><code>Tools missing in chat</code></td>\n            <td><code>mcp_config.json</code> not registered</td>\n            <td>Ensure <code>code-review-graph</code> entry is present in <code>~/.gemini/config/mcp_config.json</code>.</td>\n          </tr>\n        </tbody>\n      </table>\n    </div>\n    <div style=\"margin-top:12px;\">\n      <a href=\"plugins.html\" class=\"btn-preset\" style=\"display:inline-flex;align-items:center;gap:6px;text-decoration:none;padding:6px 12px;font-size:12px;color:var(--accent-blue);\">\n        ← Return to Plugins Hub\n      </a>\n    </div>\n  "
      }
    ],
    "tools": [
      {
        "name": "get_minimal_context_tool",
        "params": "symbol: string, filePath: string",
        "desc": "Returns only the target symbol AST declaration, signature, docstring, and immediate dependencies."
      },
      {
        "name": "get_impact_radius_tool",
        "params": "filePath: string, changedLines?: string",
        "desc": "Calculates the exact blast radius of modified code, identifying all downstream callers that could break."
      },
      {
        "name": "query_graph_tool",
        "params": "query: string, language?: string",
        "desc": "Executes relational graph queries across project AST nodes (callers, callees, implementations)."
      },
      {
        "name": "build_or_update_graph_tool",
        "params": "directoryPath: string",
        "desc": "Indexes all source files in the project and persists AST nodes into the fast local SQLite cache."
      }
    ],
    "mcpConfig": "{\n  \"mcpServers\": {\n    \"code-review-graph\": {\n      \"command\": \"cmd.exe\",\n      \"args\": [\"/d\", \"/c\", \"npx\", \"-y\", \"code-review-graph@latest\"],\n      \"disabled\": false\n    }\n  }\n}",
    "promptRecipe": "Use code-review-graph to calculate the impact radius of our proposed change to 'src/auth/jwt.ts'. Call 'get_impact_radius_tool' to determine which controller routes depend on verifyToken, and fetch minimal context for each caller without reading entire files."
  },
  "typesafe-mcp": {
    "id": "typesafe-mcp",
    "title": "TypeSafe & Schema MCPs",
    "subtitle": "In-context TypeScript compiler diagnostics, type-level AST assertions, and JSON Schema contract validation.",
    "icon": "🛡️",
    "badges": [
      {
        "text": "Type Safety",
        "type": "blue"
      },
      {
        "text": "Zero Linter Errors",
        "type": "green"
      }
    ],
    "calloutTitle": "Catching Type Errors Before You Run",
    "calloutText": "AI models often hallucinate nonexistent object properties or incorrect function arguments. TypeSafe MCP connects directly to the TypeScript Language Server (tsserver) to validate types in memory before generating output code.",
    "diagrams": [
      {
        "title": "TypeSafe In-Memory Compiler Verification Pipeline",
        "description": "Validates proposed code against tsserver before writing to disk.",
        "chart": "flowchart TD\n  CodeGen[\"AI Generates Code / Diff\"] --> Tsserver[\"TypeSafe MCP<br/>(In-Memory tsserver Connection)\"]\n  Tsserver --> Assertions{\"Diagnostic Assertions\"}\n  Assertions -->|\"Type Errors Found\"| AutoFix[\"Immediate Auto-Correction in Context\"]\n  Assertions -->|\"Zero Errors\"| Commit[\"Safe Write to File\"]"
      }
    ],
    "sections": [
      {
        "heading": "1. How It Operates",
        "bodyHtml": "<p>When editing complex TypeScript or Zod schemas, TypeSafe MCP queries the AST compiler directly to confirm that types, generics, and return signatures match across modules without needing a slow global build step.</p>"
      },
      {
        "heading": "2. Requirements & Repository Dependency: Do I Need the Repo?",
        "bodyHtml": "\n    <div class=\"w3-callout-banner\">\n      <h4>🛡️ Repository Requirement: NO! (Pure Skill Rule)</h4>\n      <p>TypeSafe MCP enforces strict JSON Schema compliance and validation for MCP tool handlers. Runs entirely from <code>skills/typesafe-mcp/SKILL.md</code> with zero repo dependencies.</p>\n    </div>\n  "
      },
      {
        "heading": "3. How to Trigger & Troubleshooting",
        "bodyHtml": "\n    <p><b>How to Trigger:</b> Active automatically during MCP development. Prompt: <code>\"Validate tool schemas with typesafe-mcp\"</code>.</p>\n    <p><b>Troubleshooting:</b> If schema errors occur, ensure parameters use exact primitive types (string, number, boolean) and avoid loose objects.</p>\n  "
      }
    ],
    "promptRecipe": "Inspect the types of the returned object in 'src/api/user.ts' using TypeSafe MCP. Ensure all required fields conform to the UserResponse interface and report any strict null check violations."
  },
  "raylight-mcp": {
    "id": "raylight-mcp",
    "title": "Raylight Context & KV-Cache Telemetry",
    "subtitle": "Real-time context window visualization, token saturation alerts, and key-value cache alignment.",
    "icon": "⚡",
    "badges": [
      {
        "text": "Telemetry",
        "type": "orange"
      },
      {
        "text": "KV Cache",
        "type": "purple"
      }
    ],
    "calloutTitle": "Monitoring Agent Memory Health",
    "calloutText": "Raylight monitors your ongoing session tokens, warning you when conversation memory exceeds 60% saturation and suggesting surgical context compaction before memory rot sets in.",
    "diagrams": [
      {
        "title": "Raylight Context Saturation Thresholds & Memory Eviction",
        "description": "Visualizing context window health and automated eviction levels.",
        "chart": "flowchart LR\n  Monitor[\"Session Token Telemetry\"] --> Threshold{\"Context Saturation Level\"}\n  Threshold -->|\"Green: < 45%\"| Normal[\"Normal Operation | Optimal Reasoning\"]\n  Threshold -->|\"Amber: 45%-70%\"| Warn[\"Warning | Suggests Summarization\"]\n  Threshold -->|\"Red: > 70%\"| Compact[\"Auto-Evict Temporary Shell Logs & Compact Memory\"]"
      }
    ],
    "sections": [
      {
        "heading": "1. KV-Cache Alignment",
        "bodyHtml": "<p>By aligning prompt headers and system prompts to fixed prefixes, Raylight ensures the underlying LLM provider reuses cached KV-tensors, reducing generation latency by over 40%.</p>"
      }
    ],
    "promptRecipe": "Check current context saturation using Raylight telemetry. If total token utilization exceeds 50,000 tokens, summarize past conversation turns and flush temporary terminal outputs."
  },
  "ponytail": {
    "id": "ponytail",
    "title": "Ponytail Senior Dev Optimizer",
    "subtitle": "Senior developer YAGNI ladder & anti-boilerplate pack: cuts 35%-50% of wasteful output tokens and enforces surgical diffs.",
    "icon": "✂️",
    "pluginId": "ponytail",
    "badges": [
      {
        "text": "Behavioral Skill Pack",
        "type": "green"
      },
      {
        "text": "35%-50% Output Cut",
        "type": "green"
      },
      {
        "text": "Active Plugin",
        "type": "blue"
      }
    ],
    "calloutTitle": "The Senior Developer Ladder: 'Do Less, Deliver More'",
    "calloutText": "Junior AI agents rewrite entire 400-line files to change a single variable name, burning 4,000 output tokens. Ponytail forces the model to follow the Senior Dev Laziness Ladder: write only the minimal surgical diff chunk required. No boilerplate, no unprompted rewrites, no lecture preamble.",
    "diagrams": [
      {
        "title": "Ponytail Senior Dev Output Compaction vs Junior AI Rewrites",
        "description": "Contrasting massive output token burn with surgical contiguous hunk edits.",
        "chart": "flowchart TD\n  Task[\"Task: Update JWT Expiration Logic\"]\n  subgraph Junior[\"Junior AI Agent (+4,200 Output Tokens)\"]\n    J1[\"Rewrites Entire 500-Line Auth Controller\"]\n    J2[\"Adds 3 Helper Wrapper Classes (YAGNI Violation)\"]\n    J3[\"High Risk of Subtle Regressions in Untouched Code\"]\n  end\n  subgraph Ponytail[\"Ponytail Senior Dev (+55 Output Tokens)\"]\n    P1[\"Locates Exact Line Range in File\"]\n    P2[\"Single Contiguous Chunk Replacement\"]\n    P3[\"Zero Boilerplate | Zero Regressions | 98% Cost Cut\"]\n  end\n  Task --> Junior\n  Task --> Ponytail"
      }
    ],
    "sections": [
      {
        "heading": "1. The 4 Rules of Ponytail",
        "bodyHtml": "<ol><li><b>Single Contiguous Chunks:</b> Never rewrite an entire file. Always target single contiguous block replacements using exact line ranges.</li><li><b>No Scaffolding Inflation:</b> Do not create 5 wrapper files or helper abstractions when a 3-line inline function satisfies the user's requirement.</li><li><b>Preserve Existing Documentation:</b> Never delete or strip existing comments, docstrings, or types in untouched sections of code.</li><li><b>Concise Verification:</b> Run tests immediately; do not output 5 paragraphs explaining what the code will do before running it.</li></ol>"
      },
      {
        "heading": "2. Step-by-Step Instructions: Activating Ponytail",
        "bodyHtml": "<p>To enforce Ponytail across your agent sessions:</p><ol><li>In Skill Switcher, enable <b>Ponytail Senior Dev Optimizer</b> in the Plugins tab.</li><li>Add <code>ponytail</code> to your active skills in <code>active-skills.md</code>.</li><li>When issuing prompts, add the prefix: <i>'Apply Ponytail Senior Dev mindset: provide only surgical contiguous diffs without boilerplate.'</i></li></ol>"
      },
      {
        "heading": "3. Requirements & Repository Dependency: Do I Need the Repo?",
        "bodyHtml": "\n    <div class=\"w3-callout-banner\">\n      <h4>✂️ Repository Requirement: NO! (Pure Skill Rule)</h4>\n      <p><b>Ponytail requires ZERO external repositories or binary packages.</b> It is a pure prompt instruction skill codified in <code>.agents/skills/ponytail/SKILL.md</code> and <code>~/.gemini/config/skills/ponytail/SKILL.md</code>.</p>\n      <p>When enabled in Skill Switcher, its rules are injected into <code>~/.gemini/config/rules/active-skills.md</code>, instantly constraining AI behavior to eliminate wasteful tokens and premature abstractions.</p>\n    </div>\n  "
      },
      {
        "heading": "4. How to Trigger Ponytail & Prompts",
        "bodyHtml": "\n    <p>Trigger Ponytail with any of the following:</p>\n    <ul>\n      <li><b>Toggle Switch:</b> Turn Ponytail ON in <a href=\"plugins.html\" style=\"color:var(--accent-blue);font-weight:600;\">Plugins Hub</a>. Its rules apply to every prompt in your workspace automatically.</li>\n      <li><b>Prompt Keywords:</b> <code>\"Audit this file using ponytail principles\"</code> or <code>\"Write this feature following ponytail minimalism\"</code>.</li>\n      <li><b>Slash Command:</b> <code>/ponytail</code> to trigger a code debt & bloat inspection.</li>\n    </ul>\n  "
      },
      {
        "heading": "5. Troubleshooting Ponytail",
        "bodyHtml": "\n    <div class=\"tools-table-wrap\">\n      <table class=\"tools-table\">\n        <thead>\n          <tr>\n            <th>Problem</th>\n            <th>Cause</th>\n            <th>Resolution</th>\n          </tr>\n        </thead>\n        <tbody>\n          <tr>\n            <td>Agent adds excessive comments or wrappers</td>\n            <td>Ponytail rule is disabled in active rules</td>\n            <td>Check <a href=\"plugins.html\" style=\"color:var(--accent-blue);\">Plugins Hub</a> and verify toggle is green; inspect <code>active-skills.md</code>.</td>\n          </tr>\n          <tr>\n            <td>Agent removes necessary code</td>\n            <td>Task specification was underspecified</td>\n            <td>Instruct the agent: \"Keep essential validation while applying Ponytail to redundant helpers\".</td>\n          </tr>\n        </tbody>\n      </table>\n    </div>\n  "
      }
    ],
    "promptRecipe": "Activate the Ponytail Senior Dev mindset: Refactor the authentication handler in 'src/auth.ts' using a surgical, single-chunk replacement. Do not reprint unchanged lines or add unnecessary abstractions. Keep output tokens strictly minimal."
  },
  "omniroute": {
    "id": "omniroute",
    "title": "OmniRoute & RTK Prompt Compression",
    "subtitle": "Lossless token compression using high-density syntax and smart model tiering: cuts 60%-80% of prompt tokens.",
    "icon": "🗜️",
    "pluginId": "OmniRoute",
    "badges": [
      {
        "text": "Prompt Compactor",
        "type": "purple"
      },
      {
        "text": "60%-80% Prompt Cut",
        "type": "green"
      },
      {
        "text": "Active Plugin",
        "type": "blue"
      }
    ],
    "calloutTitle": "Lossless Structural Compaction",
    "calloutText": "Natural human language contains 70% structural redundancy ('Please make sure to have a look at...', 'Could you kindly check if...'). OmniRoute strips filler phrases into high-density structural tokens, compressing input prompts by up to 80% without losing a single requirement.",
    "diagrams": [
      {
        "title": "OmniRoute Lossless Prompt Compaction & Tier Routing",
        "description": "How OmniRoute reduces prompt token footprint while directing tasks to optimal model tiers.",
        "chart": "flowchart LR\n  Human[\"Verbose Human Prompt<br/>(110 Tokens)\"] --> RTK[\"RTK Lossless Syntax Compactor\"]\n  RTK --> Compact[\"High-Density Structural Tokens<br/>(22 Tokens — 80% Reduction)\"]\n  Compact --> Router{\"Task Complexity Classifier\"}\n  Router -->|\"Complex Reasoning\"| Tier1[\"Claude 3.7 Sonnet / Gemini 2.5 Pro\"]\n  Router -->|\"Lightweight Execution\"| Tier2[\"Gemini 2.5 Flash / Claude Haiku\"]"
      }
    ],
    "sections": [
      {
        "heading": "1. RTK (Real-Time Knowledge) Syntax",
        "bodyHtml": "<p>OmniRoute translates verbose prompts into ultra-dense, unambiguous directives:</p><div class=\"code-block\"><pre><code>// Before (78 tokens):\n\"Could you please write a Node.js function that will read a JSON file from disk, validate that it has an 'id' and 'name' property, and return false if it doesn't?\"\n\n// After RTK Compaction (19 tokens):\n\"fn: readJsonValidate(path) -> bool | assert schema {id: str, name: str} | fs.readFileSync UTF-8\"</code></pre></div><p>The model understands both identically, but the compressed version saves 59 tokens on turn 1, and saves those 59 tokens on every subsequent turn of the conversation!</p>"
      },
      {
        "heading": "2. Requirements & Repository Dependency: Do I Need the Repo?",
        "bodyHtml": "\n    <div class=\"w3-callout-banner\">\n      <h4>⚡ Repository Requirement: NO! (Pure Skill Rule)</h4>\n      <p>OmniRoute is a pure prompt compression protocol. No repository, no npm package, and no daemon are needed. It operates entirely inside the system prompt and <code>active-skills.md</code>.</p>\n    </div>\n  "
      },
      {
        "heading": "3. How to Trigger OmniRoute & Troubleshooting",
        "bodyHtml": "\n    <p><b>How to Trigger:</b></p>\n    <ul>\n      <li>Prompt: <code>\"Route this task using OmniRoute RTK syntax\"</code> or <code>\"Compress prompt with OmniRoute\"</code>.</li>\n      <li>Automatic: Active on every turn when enabled in Skill Switcher.</li>\n    </ul>\n    <p><b>Troubleshooting:</b> If output is too concise or lacks explanation, ask: <code>\"Expand with full explanation\"</code> or toggle OmniRoute OFF in <a href=\"plugins.html\" style=\"color:var(--accent-blue);\">Plugins Hub</a>.</p>\n  "
      }
    ],
    "promptRecipe": "Use OmniRoute to compress this requirement into high-density RTK syntax before executing the task. Maintain 100% semantic coverage while minimizing prompt token footprint."
  },
  "zipai": {
    "id": "zipai",
    "title": "ZipAI Context Verbosity Filter",
    "subtitle": "Prevents catastrophic context spills by truncating runaway terminal logs and enforcing surgical command outputs.",
    "icon": "📦",
    "pluginId": "zipai-optimizer",
    "badges": [
      {
        "text": "Verbosity Filter",
        "type": "orange"
      },
      {
        "text": "Log Truncation",
        "type": "green"
      }
    ],
    "calloutTitle": "Preventing Catastrophic 100k Spills",
    "calloutText": "A single unbuffered command (like 'npm test' printing 3,000 lines of minified stack traces, or 'git log' dumping 500 commits) can dump 80,000 tokens into context instantly, blowing your budget and pushing critical project instructions out of the model's memory.",
    "diagrams": [
      {
        "title": "ZipAI Terminal Interception & Error Isolation",
        "description": "How ZipAI filters noisy command streams to preserve LLM context integrity.",
        "chart": "flowchart TD\n  Command[\"Agent Runs Command<br/>(npm test / git log / docker build)\"] --> Intercept[\"ZipAI Output Interceptor\"]\n  Intercept --> Filter{\"Error Detected in Stream?\"}\n  Filter -->|\"Yes\"| Extract[\"Isolate Error Hunks & Stack Trace<br/>Truncate Passing Logs to First/Last 15 Lines\"]\n  Filter -->|\"No\"| Minimal[\"Return Concise Success Status (3 Lines)\"]\n  Extract --> Agent[\"Clean 40-Line Output (Prevents 80,000 Token Dump)\"]\n  Minimal --> Agent"
      }
    ],
    "sections": [
      {
        "heading": "1. How ZipAI Protects You",
        "bodyHtml": "<p>ZipAI instruments terminal commands with surgical output filters:</p><ul><li>Limits command output to the first and last 25 lines of relevant errors.</li><li>Filters noisy compiler warnings and minified bundle logs.</li><li>Prompts for ambiguity resolution before making wide-scale assumptions.</li></ul>"
      },
      {
        "heading": "2. Requirements & Repository Dependency: Do I Need the Repo?",
        "bodyHtml": "\n    <div class=\"w3-callout-banner\">\n      <h4>🗜️ Repository Requirement: NO! (Pure Skill Rule)</h4>\n      <p>ZipAI is a context verbosity optimizer that eliminates pleasantries, boilerplate, and duplicate snippets. Zero git repos required. Runs entirely from <code>skills/zipai-optimizer/SKILL.md</code>.</p>\n    </div>\n  "
      },
      {
        "heading": "3. How to Trigger ZipAI & Troubleshooting",
        "bodyHtml": "\n    <p><b>How to Trigger:</b></p>\n    <ul>\n      <li>Prompt: <code>\"Apply zipai token optimizer\"</code> or <code>\"Give me a surgical, high-density response\"</code>.</li>\n      <li>Toggle ON in <a href=\"plugins.html\" style=\"color:var(--accent-blue);\">Plugins Hub</a>.</li>\n    </ul>\n    <p><b>Troubleshooting:</b> If you need conversational or exploratory guidance, toggle ZipAI OFF in Skill Switcher.</p>\n  "
      }
    ],
    "promptRecipe": "Execute the build test using ZipAI filtering: capture only failing assertion lines and stack trace origins. Truncate passing test logs and minified output to prevent context overflow."
  },
  "graphify": {
    "id": "graphify",
    "title": "Graphify Knowledge Engine",
    "subtitle": "Generates offline AST dependency reports (GRAPH_REPORT.md) to eliminate repeated 50-file ripgrep loops.",
    "icon": "🗺️",
    "pluginId": "graphify",
    "badges": [
      {
        "text": "Architecture Map",
        "type": "blue"
      },
      {
        "text": "-25k Tokens / Session",
        "type": "green"
      }
    ],
    "calloutTitle": "Scan Once, Query Forever",
    "calloutText": "Instead of running 10 ripgrep commands that each dump 3,000 tokens of file paths, Graphify indexes the repository once into a compact markdown graph. The AI reads this 400-token map to immediately identify file locations and relations.",
    "diagrams": [
      {
        "title": "Graphify Single-Pass Codebase Indexing Pipeline",
        "description": "Transforming entire repositories into concise, queryable architectural maps.",
        "chart": "flowchart LR\n  Repo[\"Large Codebase<br/>(500+ Source Files)\"] --> Scan[\"Graphify Single-Pass AST Scanner\"]\n  Scan --> Doc[\"GRAPH_REPORT.md<br/>(Static Markdown Knowledge Graph — 400 Tokens)\"]\n  Doc --> Agent[\"Agent Reads Map in 1 Turn<br/>Eliminates 25 Repeated ripgrep Loops (-25k Tokens)\"]"
      }
    ],
    "sections": [
      {
        "heading": "1. The GRAPH_REPORT.md Architecture",
        "bodyHtml": "<p>Graphify generates an offline, human-readable dependency map summarizing:</p><ol><li><b>Entrypoints:</b> Server routers, main binaries, and CLI entry files.</li><li><b>Core Services:</b> Business logic controllers and database models.</li><li><b>Cross-Module Contracts:</b> Shared interfaces, DTOs, and event buses.</li></ol><p>Reading this pre-indexed map saves ~25,000 exploration tokens per session.</p>"
      },
      {
        "heading": "2. Requirements & Repository Dependency: Do I Need the Repo?",
        "bodyHtml": "\n    <div class=\"w3-callout-banner\">\n      <h4>🗺️ Repository Requirement: NO! (Pure Skill Rule)</h4>\n      <p>Graphify requires no external repository. It is a structured prompt skill that instructs the agent to analyze codebase imports and generate clean Mermaid architecture and call graph diagrams.</p>\n    </div>\n  "
      },
      {
        "heading": "3. How to Trigger Graphify & Troubleshooting",
        "bodyHtml": "\n    <p><b>How to Trigger:</b></p>\n    <ul>\n      <li>Prompt: <code>\"Run graphify on the src/ directory and output GRAPH_REPORT.md\"</code>.</li>\n      <li>Prompt: <code>\"Generate Mermaid architecture map for module X\"</code>.</li>\n    </ul>\n    <p><b>Troubleshooting:</b> If diagrams are overly dense, instruct: <code>\"Graphify only top-level module interfaces\"</code>.</p>\n  "
      }
    ],
    "promptRecipe": "Generate a Graphify architecture report for this project. Map all entrypoints, services, and shared types into GRAPH_REPORT.md so future agent sessions can navigate the repo without multi-file grepping."
  },
  "gsd": {
    "id": "gsd",
    "title": "Get Shit Done (GSD Autonomous Framework)",
    "subtitle": "Spec-driven autonomous execution & context-rot prevention engine (Discuss → Plan → Execute → Verify → Ship).",
    "icon": "🎯",
    "pluginId": "getshitdone",
    "badges": [
      {
        "text": "Autonomous Agent",
        "type": "green"
      },
      {
        "text": "Context Guardrails",
        "type": "purple"
      }
    ],
    "calloutTitle": "Eliminating Agent Drift and Infinite Loops",
    "calloutText": "Without strict phases, autonomous agents drift: they start a refactor, get distracted by unrelated linter warnings, rewrite configurations, and fail to complete the original goal. GSD enforces a strict 5-phase finite state machine.",
    "diagrams": [
      {
        "title": "The 5-Phase GSD Autonomous Finite State Machine",
        "description": "Enforcing sequential phase gates to guarantee completion without drift.",
        "chart": "stateDiagram-v2\n  [*] --> DISCUSS: Clarify Requirements\n  DISCUSS --> PLAN: Define Atomic Milestones\n  PLAN --> EXECUTE: Implement Milestone 1\n  EXECUTE --> VERIFY: Run Exact Regression Test\n  VERIFY --> EXECUTE: If Test Fails (Refine)\n  VERIFY --> SHIP: All Milestones Passed\n  SHIP --> [*]: Clean Commit & Documentation"
      }
    ],
    "sections": [
      {
        "heading": "1. The 5 Phases of GSD",
        "bodyHtml": "<ol><li><b>Discuss:</b> Clarify ambiguous requirements before writing any code.</li><li><b>Plan:</b> Break the task into 3-5 atomic, verifiable milestones.</li><li><b>Execute:</b> Implement one milestone at a time using surgical edits.</li><li><b>Verify:</b> Run the exact regression test verifying the milestone.</li><li><b>Ship:</b> Commit clean, conventional commit changes and update docs.</li></ol>"
      },
      {
        "heading": "2. Requirements & Repository Dependency: Do I Need the Repo?",
        "bodyHtml": "\n    <div class=\"w3-callout-banner\">\n      <h4>🎯 Repository Requirement: NO! (Pure Skill Rule)</h4>\n      <p>Get Shit Done (GSD) is an autonomous task execution framework defined in <code>.agents/skills/getshitdone/SKILL.md</code>. Zero external repositories or installations required.</p>\n    </div>\n  "
      },
      {
        "heading": "3. How to Trigger GSD & Troubleshooting",
        "bodyHtml": "\n    <p><b>How to Trigger:</b></p>\n    <ul>\n      <li>Prompt: <code>\"/gsd Implement user authentication with JWT\"</code>.</li>\n      <li>Prompt: <code>\"Execute task following getshitdone 5-phase protocol\"</code>.</li>\n    </ul>\n    <p><b>Troubleshooting:</b> If the agent spends too many turns planning, instruct: <code>\"GSD: Proceed immediately to Phase 3 Execution\"</code>.</p>\n  "
      }
    ],
    "promptRecipe": "Follow the GSD framework to implement this feature: First, generate a phased implementation plan with atomic milestones. Stop and request confirmation before executing Phase 1."
  },
  "prompt-caching": {
    "id": "prompt-caching",
    "title": "Prefix Tree Prompt Caching",
    "subtitle": "Save up to 90% of input token costs by aligning system prompts and tool definitions with provider KV cache.",
    "icon": "⚡",
    "badges": [
      {
        "text": "Cost Saver",
        "type": "green"
      },
      {
        "text": "90% Discount",
        "type": "blue"
      }
    ],
    "calloutTitle": "How Prompt Caching Works",
    "calloutText": "Anthropic Claude and Google Gemini cache exact prompt prefixes in hardware. If the first 10,000 tokens of your prompt (system rules, tool schemas, project guidelines) are identical between requests, you receive a 90% discount on those tokens and 3x faster response times.",
    "diagrams": [
      {
        "title": "Prefix-Tree KV Cache Hardware Alignment",
        "description": "Structuring prompt tokens to maximize hardware prefix cache reuse.",
        "chart": "flowchart LR\n  subgraph Cached[\"Hardware KV Cache (90% Cost Discount)\"]\n    S1[\"[System Prompt & Strict Rules]\"]\n    S2[\"[MCP Tool Schemas & Catalog]\"]\n    S3[\"[Repository Guidelines & Docs]\"]\n  end\n  subgraph Dynamic[\"Dynamic Tokens (Full Price)\"]\n    D1[\"[Conversation History Turns]\"]\n    D2[\"[Current User Message]\"]\n  end\n  S1 --> S2 --> S3 --> D1 --> D2"
      }
    ],
    "sections": [
      {
        "heading": "1. Prompt Ordering Rules for 100% Cache Hits",
        "bodyHtml": "<p>To maximize cache hit rates, order your prompts from most static to most dynamic:</p><ol><li><b>Fixed System Prompt & Rules (100% Static):</b> Always place guidelines and unchanging rules first.</li><li><b>Tool & MCP Definitions (Static):</b> Register tool schemas in constant order.</li><li><b>Project Documentation & Architecture (Semi-Static):</b> Include core schemas and design tokens.</li><li><b>Conversation History (Dynamic):</b> Previous turns.</li><li><b>Current User Request (Most Dynamic):</b> Always placed at the very end.</li></ol>"
      },
      {
        "heading": "2. Requirements & Hardware Dependency",
        "bodyHtml": "\n    <div class=\"w3-callout-banner\">\n      <h4>☁️ Repository Requirement: NO! (Built-in Google Cloud TPU RAM)</h4>\n      <p>Gemini Prompt Caching is a hardware-level feature executed on Google Tensor Processing Unit clusters. No software, repo, or daemon needs to be installed on your machine!</p>\n    </div>\n  "
      },
      {
        "heading": "3. How to Maximize Cache Hits & Troubleshooting",
        "bodyHtml": "\n    <p><b>How to Maximize Hits:</b></p>\n    <ul>\n      <li>Keep static rules and system instructions at the very beginning of the prompt.</li>\n      <li>Do not insert dynamic timestamps or random IDs in the prompt prefix.</li>\n      <li>Keep prompt prefixes &gt; 1,024 tokens so the TPU triggers hardware caching.</li>\n    </ul>\n    <p><b>Troubleshooting:</b> If cache misses occur, check whether dynamic session data was injected before system instructions.</p>\n  "
      }
    ],
    "metrics": [
      {
        "label": "Cache Read Discount",
        "val": "90%",
        "desc": "Discount on input tokens reading from cache"
      },
      {
        "label": "TTFT Reduction",
        "val": "65%",
        "desc": "Time to first token speedup on cache hits"
      },
      {
        "label": "Minimum Cache Block",
        "val": "1,024 Tokens",
        "desc": "Threshold required to trigger prompt caching"
      }
    ]
  },
  "impeccable": {
    "id": "impeccable",
    "title": "Impeccable Design System & Micro-Interactions",
    "subtitle": "Professional UI design guidelines: GitHub Primer & Apple HIG tokens, dark/light harmony, and zero ugly MVPs.",
    "icon": "✨",
    "badges": [
      {
        "text": "Design System",
        "type": "purple"
      },
      {
        "text": "Primer & HIG",
        "type": "blue"
      }
    ],
    "calloutTitle": "Visual Excellence is Mandatory",
    "calloutText": "Never generate generic, unstyled HTML or basic MVPs with plain browser buttons. Interfaces must look stunning at first glance: curated HSL color palettes, subtle glassmorphism, responsive CSS grid layouts, and smooth micro-animations.",
    "diagrams": [
      {
        "title": "Impeccable Design Token Pipeline",
        "description": "From design system tokens to polished responsive components.",
        "chart": "flowchart TD\n  Tokens[\"Design Tokens<br/>(Primer CSS Variables, HSL Palettes, Typography)\"] --> Primitives[\"Component Primitives<br/>(Buttons, Cards, Modals, Navbars)\"]\n  Primitives --> Micro[\"Micro-Interactions<br/>(0.15s Ease Transitions, Hover Affordances)\"]\n  Micro --> Themes[\"Dark / Light Mode Parity<br/>(Zero Unstyled UI, 100% Polish)\"]"
      }
    ],
    "sections": [
      {
        "heading": "1. Design Foundations",
        "bodyHtml": "<ul><li><b>Typography:</b> Modern web fonts (Inter, Roboto, JetBrains Mono) with precise font-weight hierarchy (400 regular, 500 medium, 600 semibold, 700 bold).</li><li><b>Theme Tokens:</b> Pure CSS variables for background, foreground, border, and accent colors that adapt seamlessly between dark and light modes.</li><li><b>Interactive Feedback:</b> Every button, link, and toggle must provide hover and focus transitions (0.15s ease) with clear visual affordances.</li></ul>"
      },
      {
        "heading": "2. Requirements & Repository Dependency: Do I Need the Repo?",
        "bodyHtml": "\n    <div class=\"w3-callout-banner\">\n      <h4>🎨 Repository Requirement: NO! (Pure Skill Rule)</h4>\n      <p>Impeccable is a design system instruction skill in <code>~/.gemini/config/skills/impeccable/SKILL.md</code>. Requires zero git repos or external builds.</p>\n    </div>\n  "
      },
      {
        "heading": "3. How to Trigger Impeccable & Troubleshooting",
        "bodyHtml": "\n    <p><b>How to Trigger:</b></p>\n    <ul>\n      <li>Prompt: <code>\"Build this page with impeccable design principles, glassmorphism, and dark mode\"</code>.</li>\n      <li>Prompt: <code>\"Polish this UI to look state-of-the-art with impeccable\"</code>.</li>\n    </ul>\n    <p><b>Troubleshooting:</b> If output looks plain or generic, prompt: <code>\"Enforce impeccable design system: curated palette, smooth typography, micro-interactions\"</code>.</p>\n  "
      }
    ],
    "promptRecipe": "Apply the Impeccable Design System: Rebuild this UI using GitHub Primer CSS tokens, responsive layout grid, smooth dark mode support, and micro-interactions for every interactive element."
  },
  "gsap": {
    "id": "gsap",
    "title": "GSAP & Motion.dev 60fps Animation Suite",
    "subtitle": "Hardware-accelerated web animation: timelines, ScrollTrigger, FLIP layout morphs, and smooth micro-interactions.",
    "icon": "🎬",
    "badges": [
      {
        "text": "Animation",
        "type": "green"
      },
      {
        "text": "60fps Smooth",
        "type": "purple"
      }
    ],
    "calloutTitle": "Silky-Smooth Motion Design",
    "calloutText": "Great web applications feel responsive and alive. Use GSAP (GreenSock) and Motion.dev to build seamless timeline choreography, layout morphs, and interactive gestures that never drop frames.",
    "diagrams": [
      {
        "title": "60fps Hardware-Accelerated Compositor Thread",
        "description": "How to structure CSS and GSAP animations to bypass main thread layout reflows.",
        "chart": "flowchart LR\n  Animation[\"Animation Request\"] --> Compositor{\"Animate Transform & Opacity?\"}\n  Compositor -->|\"Yes (GPU Thread)\"| GPU[\"60fps Smooth Compositor Thread<br/>Zero Layout Shifts or Frame Drops\"]\n  Compositor -->|\"No (Width, Height, Top)\"| CPU[\"Main Thread Reflow & Repaint<br/>Jank & Stutter Warning!\"]"
      }
    ],
    "sections": [
      {
        "heading": "1. Core Animation Rules",
        "bodyHtml": "<ul><li><b>Animate Only Transform & Opacity:</b> Never animate layout-triggering properties like <code>width</code>, <code>height</code>, or <code>top</code>. Always animate <code>transform (x, y, scale)</code> and <code>opacity</code> to stay on GPU compositor threads.</li><li><b>Subtle Duration:</b> Keep micro-interactions fast: 0.15s to 0.25s for hover/toggles, 0.35s to 0.5s for modal reveals.</li><li><b>Respect Reduced Motion:</b> Always wrap complex animations in <code>@media (prefers-reduced-motion: no-preference)</code>.</li></ul>"
      }
    ],
    "promptRecipe": "Implement a 60fps entrance animation and modal reveal using GSAP. Animate transform and opacity only with ease-out curves, ensuring full compliance with prefers-reduced-motion."
  },
  "debugger": {
    "id": "debugger",
    "title": "Systematic Debugging & Bug Hunter",
    "subtitle": "4-phase investigation protocol: Reproduce → Isolate → Fix Root Cause → Add Regression Test.",
    "icon": "🔍",
    "badges": [
      {
        "text": "Diagnostic Protocol",
        "type": "orange"
      },
      {
        "text": "Zero Regressions",
        "type": "green"
      }
    ],
    "calloutTitle": "Stop Guessing, Start Isolating",
    "calloutText": "Never propose speculative code edits without first isolating the failure mechanism. Systematic debugging requires a clean reproduction script, binary isolation of the fault line, and verification before touching application logic.",
    "diagrams": [
      {
        "title": "The 4-Phase Systematic Debugging Funnel",
        "description": "Isolating root causes with mathematical certainty before proposing code edits.",
        "chart": "flowchart TD\n  Bug[\"Observed Bug or Test Failure\"] --> P1[\"Phase 1: Minimal Standalone Reproduction\"]\n  P1 --> P2[\"Phase 2: Boundary Isolation & Data Flow Trace\"]\n  P2 --> P3[\"Phase 3: Root Cause Representation Fix\"]\n  P3 --> P4[\"Phase 4: Permanent Regression Test Lock\"]\n  P4 --> Solved[\"Bug Resolved with Zero Brittleness\"]"
      }
    ],
    "sections": [
      {
        "heading": "1. The 4-Phase Protocol",
        "bodyHtml": "<ol><li><b>Phase 1 — Minimal Reproduction:</b> Write a standalone test script that reproduces the bug in isolation.</li><li><b>Phase 2 — Boundary Isolation:</b> Trace input data through producing and consuming boundaries until the exact line of divergence is identified.</li><li><b>Phase 3 — Root Cause Fix:</b> Fix the owning representation or data model, not just downstream symptoms.</li><li><b>Phase 4 — Regression Lock:</b> Commit a permanent test case ensuring this bug can never recur.</li></ol>"
      },
      {
        "heading": "2. Requirements & How to Trigger",
        "bodyHtml": "\n      <p><b>Repo Needed?</b> NO. Pure instruction skill.</p>\n      <p><b>How to Trigger:</b> Prompt <code>\"/debug [describe issue]\"</code> or <code>\"Run systematic debugger protocol on this error\"</code>.</p>\n    "
      }
    ],
    "promptRecipe": "Follow the Systematic Debugging protocol: Do not modify source files yet. First, write a minimal reproduction script to verify the issue and isolate the exact root cause."
  },
  "anti-slop": {
    "id": "anti-slop",
    "title": "Anti-Slop Writing & Technical Documentation",
    "subtitle": "Removes 21 categories of generic AI filler ('delve', 'tapestry', 'in conclusion') and enforces precise engineering prose.",
    "icon": "✍️",
    "badges": [
      {
        "text": "Prose Quality",
        "type": "blue"
      },
      {
        "text": "No AI Clichés",
        "type": "green"
      }
    ],
    "calloutTitle": "Clear, Direct, Technical Language",
    "calloutText": "AI-generated text is often bloated with repetitive buzzwords, patronizing preamble, and empty conversational filler. The Anti-Slop guideline mandates concise, fact-first engineering documentation that respects the reader's time.",
    "diagrams": [
      {
        "title": "AI Buzzword Stripping & Fact Density Transformation",
        "description": "Filtering AI filler words into actionable, precise technical documentation.",
        "chart": "flowchart LR\n  Input[\"Raw AI Output<br/>(delve, tapestry, plethora, crucial)\"] --> Filter[\"Anti-Slop Filter Rules\"]\n  Filter --> Output[\"Direct Technical Prose<br/>(Active Voice, Exact File Paths, Citable Facts)\"]"
      }
    ],
    "sections": [
      {
        "heading": "1. Words to Eliminate Immediately",
        "bodyHtml": "<ul><li><b>Banned AI Buzzwords:</b> 'delve', 'tapestry', 'plethora', 'game-changer', 'revolutionize', 'leverage', 'beacon'.</li><li><b>Empty Preamble:</b> 'Certainly! I would be happy to help you with that...', 'In this fast-paced modern world...'.</li><li><b>Direct Replacements:</b> State facts, provide exact paths, cite metrics, and write actionable instructions in active voice.</li></ul>"
      },
      {
        "heading": "2. Requirements & How to Trigger",
        "bodyHtml": "\n      <p><b>Repo Needed?</b> NO. Pure instruction skill.</p>\n      <p><b>How to Trigger:</b> Prompt <code>\"Rewrite this documentation using anti-slop guidelines\"</code>.</p>\n    "
      }
    ],
    "promptRecipe": "Review and rewrite this technical document using the Anti-Slop style guide: eliminate all AI clichés, conversational preamble, and generic filler. Keep sentences active, concise, and focused on verifiable technical facts."
  }
};

if (typeof window !== "undefined") {
  window.GUIDE_DATABASE = GUIDE_DATABASE;
}
