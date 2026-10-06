/* Skill Switcher — Repository Catalog & Global Vars */
/* Contains: global var declarations + REPOS array (62+ skill repos) */

/* ---------------------------------------------------------------
 * Runtime path detection — NEVER hardcode a user-specific path here.
 *  1) When served by skill-gui-server.ps1, /env and /verify-skills
 *     overwrite these with the real project root & home directory.
 *  2) When opened directly as file://, derive them from this page's
 *     own location so links still point at THIS machine.
 * --------------------------------------------------------------- */
var detectedProjectRoot = (function () {
  try {
    if (window.location.protocol === 'file:') {
      var p = decodeURIComponent(window.location.pathname).replace(/\\/g, '/');
      p = p.replace(/\/[^\/]*$/, '');          // strip the html file name
      p = p.replace(/\/pages$/, '');           // sub-pages live one level down
      if (/^\/[A-Za-z]:\//.test(p)) p = p.slice(1); // "/C:/..." -> "C:/..."
      return p;
    }
  } catch (e) {}
  return '';
})();
var detectedHomeDir = (function () {
  var m = (detectedProjectRoot || '').match(/^([A-Za-z]:\/Users\/[^\/]+|\/Users\/[^\/]+|\/home\/[^\/]+)/i);
  return m ? m[1] : '';
})();
var detectedEnv = null;        // full /env payload from the server
var verifiedSkillsMap = {};    // skillId -> { location, full_path, ... } from /verify-skills
var diskActiveSkills = [];
var currentSkillManualText = '';


const REPOS = [
  {
    "id": "repo-jev-ultrafast",
    "name": "browser-use/jev-ultrafast",
    "title": "Jev-Ultrafast Browser Automation",
    "repoUrl": "https://github.com/browser-use/jev-ultrafast",
    "desc": "Sub-second browser automation agent loop where DOM next-actions (click, type, scroll, navigate) are scored in 70-300ms, slashing token usage by 85-90%.",
    "lang": "Python",
    "langColor": "#3572A5",
    "stars": "1,420",
    "cat": "jev",
    "subskills": [
      {
        "id": "jev-ultrafast",
        "name": "JEV UltraFast DOM Loop",
        "cat": "jev",
        "desc": "Sub-second DOM evaluation emitting typed actions (Click, Type, Scroll, Done) without waiting for slow frontier LLM turns.",
        "purpose": "Automates browser verification for Web applications, map interactions, and auth testing in milliseconds.",
        "trigger": "/jev-browse [url] [action]",
        "example_prompt": "Run jev-ultrafast to verify that the bus map marker breathes with a 3-second cycle on http://localhost:7070/dashboard.",
        "files": [
          ".agents/skills/jev-ultrafast/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/browser-use/jev-ultrafast.git",
        "act": "JEV ULTRAFAST: Execute high-speed DOM automation loops with pruned interactive candidate elements and typed next-actions.",
        "repoName": "browser-use/jev-ultrafast",
        "repoUrl": "https://github.com/browser-use/jev-ultrafast",
        "lang": "Python",
        "langColor": "#3572A5",
        "requiresApiKey": false
      }
    ],
    "hasApiKey": false
  },
  {
    "id": "repo-fast-compaction",
    "name": "tamaratran/fast-jev-compaction",
    "title": "Fast JEV Context Compaction",
    "repoUrl": "https://github.com/tamaratran/fast-jev-compaction",
    "desc": "Token-efficient context compactor that prunes terminal logs and stale search traces while preserving verbatim code edits, line references, and active guardrails.",
    "lang": "Python",
    "langColor": "#3572A5",
    "stars": "490",
    "cat": "jev",
    "subskills": [
      {
        "id": "fast-jev-compaction",
        "name": "Fast Context Compaction",
        "cat": "jev",
        "desc": "Context compactor retaining verbatim file edits and active constraints while pruning terminal noise.",
        "purpose": "Prevents context window exhaustion during long full-stack pairing sessions without losing critical code details.",
        "trigger": "/compact",
        "example_prompt": "Run fast-jev-compaction to prune our recent terminal traces while keeping the Redis pub/sub handler intact.",
        "files": [
          ".agents/skills/fast-jev-compaction/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/tamaratran/fast-jev-compaction.git",
        "act": "FAST JEV COMPACTION: Prune conversational and terminal noise. Preserve active code edits, line anchors, and guardrails verbatim.",
        "repoName": "tamaratran/fast-jev-compaction",
        "repoUrl": "https://github.com/tamaratran/fast-jev-compaction",
        "lang": "Python",
        "langColor": "#3572A5",
        "requiresApiKey": false
      }
    ],
    "hasApiKey": false
  },
  {
    "id": "repo-laya",
    "name": "NandhaKishorM/laya",
    "title": "Laya System 1 Decision Engine",
    "repoUrl": "https://github.com/NandhaKishorM/laya",
    "desc": "Multilingual, non-autoregressive System 1 decision engine. Typed choice, score, and yes/no decisions over any text in a single forward pass (33ms) across 100+ languages.",
    "lang": "Python",
    "langColor": "#3572A5",
    "stars": "1,850",
    "cat": "jev",
    "subskills": [
      {
        "id": "laya",
        "name": "Laya Decision Engine",
        "cat": "jev",
        "desc": "Non-autoregressive System 1 decisions (Choice, Score, Noul) in 33ms with 0 token overhead and 100+ language support.",
        "purpose": "Executes low-latency, deterministic classifications, safety guardrails, ticket triage, and intent routing.",
        "trigger": "/laya [preset|predict] [text]",
        "example_prompt": "Run laya with triage preset on incoming customer message: 'We were charged twice for March, refund please.'",
        "files": [
          ".agents/skills/laya/SKILL.md",
          ".agents/skills/laya/scripts/laya_runner.py"
        ],
        "clone_cmd": "git clone https://github.com/NandhaKishorM/laya.git",
        "act": "LAYA DECISION ENGINE: Execute non-autoregressive System 1 typed decisions (Choice, Score, Noul) for deterministic classification, guardrails, and triage without token generation.",
        "repoName": "NandhaKishorM/laya",
        "repoUrl": "https://github.com/NandhaKishorM/laya",
        "lang": "Python",
        "langColor": "#3572A5",
        "requiresApiKey": false
      },
      {
        "id": "laya-mcp",
        "name": "Laya MCP Server",
        "cat": "mcp",
        "desc": "Exposes laya_predict, laya_route, laya_preset, and laya_status tools via Model Context Protocol stdio.",
        "purpose": "Provides agentic tool calling for instantaneous structured classification, safety gates, and model routing.",
        "trigger": "/laya-mcp [tool]",
        "example_prompt": "Use the laya_preset MCP tool with preset 'guard' to inspect user input for prompt injection or jailbreak.",
        "files": [
          ".agents/skills/laya/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/NandhaKishorM/laya.git",
        "act": "LAYA MCP: Call laya_predict or laya_preset tools for sub-50ms structured evaluations, guardrails, and model routing.",
        "repoName": "NandhaKishorM/laya",
        "repoUrl": "https://github.com/NandhaKishorM/laya",
        "lang": "Python",
        "langColor": "#3572A5",
        "requiresApiKey": false
      }
    ],
    "hasApiKey": false
  },
  {
    "id": "repo-json-render",
    "name": "vercel-labs/json-render",
    "title": "JSON Render Generative UI",
    "repoUrl": "https://github.com/vercel-labs/json-render",
    "desc": "Generative UI engine: transforms raw LLM JSON streams into strictly typed, accessible React components with zero dangerous code execution.",
    "lang": "TypeScript",
    "langColor": "#3178c6",
    "stars": "3,100",
    "cat": "data",
    "subskills": [
      {
        "id": "json-render",
        "name": "JSON Render Generative UI",
        "cat": "data",
        "desc": "Safely maps JSON payloads to pre-built React design system primitives with zero eval() or arbitrary script hazards.",
        "purpose": "Renders real-time shuttle arrival countdown cards, shift schedules, and alert banners dynamically from server data.",
        "trigger": "/render-ui [json]",
        "example_prompt": "Use json-render to output a typed arrival timeline component showing 4 upcoming shuttle stops.",
        "files": [
          ".agents/skills/json-render/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/vercel-labs/json-render.git",
        "act": "JSON RENDER: Convert telemetry and state JSON objects into typed UI primitives using pre-registered component catalogs.",
        "repoName": "vercel-labs/json-render",
        "repoUrl": "https://github.com/vercel-labs/json-render",
        "lang": "TypeScript",
        "langColor": "#3178c6",
        "requiresApiKey": false
      }
    ],
    "hasApiKey": false
  },
  {
    "id": "repo-typesafe-mcp",
    "name": "itsmostafa/typesafe-mcp",
    "title": "TypeSafe MCP & System One Core",
    "repoUrl": "https://github.com/itsmostafa/typesafe-mcp",
    "desc": "Model Context Protocol client/server SDK exposing Jev System One typed decision primitives (Choice, Score, Noul) directly to AI agents with zero runtime errors.",
    "lang": "TypeScript",
    "langColor": "#3178c6",
    "stars": "840",
    "cat": "mcp",
    "subskills": [
      {
        "id": "typesafe-mcp",
        "name": "TypeSafe MCP Server",
        "cat": "mcp",
        "desc": "Exposes Jev System One decision primitives (Choice, Score, Noul) via standard Model Context Protocol.",
        "purpose": "Enables Antigravity to make sub-second, typed telematics decisions without burning tokens on text generation.",
        "trigger": "tool: jev_score, jev_choose, jev_gate",
        "example_prompt": "Use typesafe-mcp jev_choose to pick the best geofence debounce strategy between EMA smoothing and sliding window.",
        "files": [
          ".agents/skills/typesafe-mcp/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/itsmostafa/typesafe-mcp.git",
        "act": "TYPESAFE MCP: Call Jev System One decision primitives (Choice, Score, Gate) via MCP instead of lengthy text generation.",
        "repoName": "itsmostafa/typesafe-mcp",
        "repoUrl": "https://github.com/itsmostafa/typesafe-mcp",
        "lang": "TypeScript",
        "langColor": "#3178c6",
        "requiresApiKey": false
      },
      {
        "id": "decision",
        "name": "JEV Decision Master",
        "cat": "mcp",
        "desc": "Primary System One decision engine orchestrating sub-second choices across tasks.",
        "purpose": "Evaluates architectural trade-offs (e.g. SSE vs WebSocket vs Redis polling) using deterministic scoring rubrics.",
        "trigger": "jev-decision: [problem]",
        "example_prompt": "JEV decision: evaluate Redis pub/sub vs Server-Sent Events vs WebSockets for mobile battery consumption.",
        "files": [
          ".agents/skills/typesafe-mcp/SKILL.md",
          ".agents/skills/canny-verifier/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/itsmostafa/typesafe-mcp.git",
        "act": "JEV DECISION MASTER: Activate full JEV System One fast scoring, deterministic verification, and decision primitives.",
        "repoName": "itsmostafa/typesafe-mcp",
        "repoUrl": "https://github.com/itsmostafa/typesafe-mcp",
        "lang": "TypeScript",
        "langColor": "#3178c6",
        "requiresApiKey": false
      }
    ],
    "hasApiKey": false
  },
  {
    "id": "repo-jev-mcp",
    "name": "jkudish/jev-mcp",
    "title": "JEV MCP Knowledge Server",
    "repoUrl": "https://github.com/jkudish/jev-mcp",
    "desc": "MCP server exposing JEV graph memory, decision trees, and associative context indexing for agentic workflows.",
    "lang": "TypeScript",
    "langColor": "#3178c6",
    "stars": "520",
    "cat": "mcp",
    "subskills": [
      {
        "id": "jev-mcp",
        "name": "JEV MCP Knowledge Store",
        "cat": "mcp",
        "desc": "Associative memory graph and decision tree provider for Claude and Antigravity IDE.",
        "purpose": "Maintains persistent cross-session knowledge of Agent workflows, memory graphs, and geofence nodes.",
        "trigger": "tool: jev_graph_query, jev_memory_store",
        "example_prompt": "Query jev-mcp for the topological graph connecting Chakan Plant 1 to Pune Station stops.",
        "files": [
          ".agents/skills/jev-mcp/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/jkudish/jev-mcp.git",
        "act": "JEV MCP: Query and store associative memory nodes and decision trees via MCP tool interfaces.",
        "repoName": "jkudish/jev-mcp",
        "repoUrl": "https://github.com/jkudish/jev-mcp",
        "lang": "TypeScript",
        "langColor": "#3178c6",
        "requiresApiKey": false
      }
    ],
    "hasApiKey": false
  },
  {
    "id": "repo-semdecide",
    "name": "sharziki/semdecide",
    "title": "SemDecide Semantic Router",
    "repoUrl": "https://github.com/sharziki/semdecide",
    "desc": "Unix pipe CLI utility and library bringing semantic classification and cosine similarity scoring into terminal logs and worker streams.",
    "lang": "Rust",
    "langColor": "#dea584",
    "stars": "380",
    "cat": "review",
    "subskills": [
      {
        "id": "semdecide",
        "name": "SemDecide CLI",
        "cat": "review",
        "desc": "Unix pipe CLI bringing semantic stream classification into terminal log inspection.",
        "purpose": "Pipes terminal output directly into fast semantic classification rules for alerting and worker log triage.",
        "trigger": "cat log | semdecide -m ...",
        "example_prompt": "Filter bus_broadcaster logs with semdecide to isolate Redis disconnection warnings.",
        "files": [
          ".agents/skills/semdecide/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/sharziki/semdecide.git",
        "act": "SEMDECIDE: Use semantic stream filtering in command-line scripts to triage logs and error outputs.",
        "repoName": "sharziki/semdecide",
        "repoUrl": "https://github.com/sharziki/semdecide",
        "lang": "Rust",
        "langColor": "#dea584",
        "requiresApiKey": false
      }
    ],
    "hasApiKey": false
  },
  {
    "id": "repo-jev-codex-router",
    "name": "0xNatoshi/jev-codex-router",
    "title": "JEV Codex Router",
    "repoUrl": "https://github.com/0xNatoshi/jev-codex-router",
    "desc": "Sub-100ms task complexity evaluator routing queries dynamically between fast and deep reasoning models.",
    "lang": "Python",
    "langColor": "#3572A5",
    "stars": "610",
    "cat": "jev",
    "subskills": [
      {
        "id": "jev-codex-router",
        "name": "JEV Codex Router",
        "cat": "jev",
        "desc": "Sub-100ms task complexity evaluator routing queries dynamically between fast and reasoning models.",
        "purpose": "Analyzes prompt intent in milliseconds to decide whether Flash or Pro reasoning is required for optimal speed.",
        "trigger": "/route-task [prompt]",
        "example_prompt": "Route this task: evaluate whether updating CSS color tokens requires Pro or Flash model.",
        "files": [
          ".agents/skills/jev-codex-router/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/0xNatoshi/jev-codex-router.git",
        "act": "JEV CODEX ROUTER: Classify task complexity into discrete tiers (0-30 Flash, 31-70 Standard, 71-100 Reasoning).",
        "repoName": "0xNatoshi/jev-codex-router",
        "repoUrl": "https://github.com/0xNatoshi/jev-codex-router",
        "lang": "Python",
        "langColor": "#3572A5",
        "requiresApiKey": false
      }
    ],
    "hasApiKey": false
  },
  {
    "id": "repo-winnow",
    "name": "GhalebDweikat/Winnow",
    "title": "Winnow Attention & Token Pruner",
    "repoUrl": "https://github.com/GhalebDweikat/Winnow",
    "desc": "LLM token attention filter and pruner that removes irrelevant conversational tokens while preserving code symbols and constraints.",
    "lang": "Python",
    "langColor": "#3572A5",
    "stars": "740",
    "cat": "review",
    "subskills": [
      {
        "id": "winnow",
        "name": "Winnow Token Pruner",
        "cat": "review",
        "desc": "Attention-driven token pruner maximizing context efficiency by stripping conversational filler.",
        "purpose": "Keeps prompt context strictly focused on telemetry models, Redis schemas, and API handlers.",
        "trigger": "/winnow [context]",
        "example_prompt": "Run Winnow to compress our fleet status prompt down to the core 100 essential tokens.",
        "files": [
          ".agents/skills/winnow/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/GhalebDweikat/Winnow.git",
        "act": "WINNOW: Strip non-essential conversational tokens and maintain high information density across LLM inputs.",
        "repoName": "GhalebDweikat/Winnow",
        "repoUrl": "https://github.com/GhalebDweikat/Winnow",
        "lang": "Python",
        "langColor": "#3572A5",
        "requiresApiKey": false
      }
    ],
    "hasApiKey": false
  },
  {
    "id": "repo-jev-review",
    "name": "devagrawal09/jev-review",
    "title": "JEV Automated Diff Review",
    "repoUrl": "https://github.com/devagrawal09/jev-review",
    "desc": "Pre-flight git diff reviewer scoring PRs and commits on security, secrets, architectural compliance, and test evidence.",
    "lang": "TypeScript",
    "langColor": "#3178c6",
    "stars": "510",
    "cat": "review",
    "subskills": [
      {
        "id": "jev-review",
        "name": "JEV Diff Review",
        "cat": "review",
        "desc": "Pre-flight git diff reviewer scoring PRs and commits on security, secrets, and architecture.",
        "purpose": "Pre-commit gatekeeper checking for exposed credentials, plaintext tokens, or core app edits in seconds.",
        "trigger": "/jev-review",
        "example_prompt": "Run jev-review on git diff HEAD~1 to check for CAN telemetry leaks and hardcoded HMAC keys.",
        "files": [
          ".agents/skills/jev-review/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/devagrawal09/jev-review.git",
        "act": "JEV REVIEW: Score diffs against security rubrics. Check for hardcoded secrets, leaks, and protected core modifications.",
        "repoName": "devagrawal09/jev-review",
        "repoUrl": "https://github.com/devagrawal09/jev-review",
        "lang": "TypeScript",
        "langColor": "#3178c6",
        "requiresApiKey": false
      }
    ],
    "hasApiKey": false
  },
  {
    "id": "repo-blink",
    "name": "ellipsis-dev/blink",
    "title": "Blink Instant Code Remediation",
    "repoUrl": "https://github.com/ellipsis-dev/blink",
    "desc": "Instant AI inline code fixes, automated lint remediation, and single-pass patch generation without round-trip re-prompting.",
    "lang": "TypeScript",
    "langColor": "#3178c6",
    "stars": "1,280",
    "cat": "review",
    "subskills": [
      {
        "id": "blink",
        "name": "Blink Instant Fixer",
        "cat": "review",
        "desc": "Generates direct unified diff patches for lint, syntax, and typing errors instantly.",
        "purpose": "Remediates TypeScript compiler and ESLint warnings in Frontend application components automatically.",
        "trigger": "/blink [file:line]",
        "example_prompt": "Use Blink to fix the missing type annotation on the SSE bus stream consumer hook.",
        "files": [
          ".agents/skills/blink/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/ellipsis-dev/blink.git",
        "act": "BLINK: Apply minimal, high-precision unified diffs to fix compile and lint issues in a single pass.",
        "repoName": "ellipsis-dev/blink",
        "repoUrl": "https://github.com/ellipsis-dev/blink",
        "lang": "TypeScript",
        "langColor": "#3178c6",
        "requiresApiKey": false
      }
    ],
    "hasApiKey": false
  },
  {
    "id": "repo-agent-desktop",
    "name": "lahfir/agent-desktop",
    "title": "Agent Desktop OS Automation",
    "repoUrl": "https://github.com/lahfir/agent-desktop",
    "desc": "Desktop orchestration agent with OS accessibility hooks, OCR, mouse, keyboard, and native application window control.",
    "lang": "Python",
    "langColor": "#3572A5",
    "stars": "920",
    "cat": "jev",
    "subskills": [
      {
        "id": "agent-desktop",
        "name": "Agent Desktop Controller",
        "cat": "jev",
        "desc": "Controls desktop windows, verifies UI states via OCR, and drives desktop apps via PowerShell CLI.",
        "purpose": "Enables Antigravity to run local tests across multiple browser windows, dev servers, and emulators automatically.",
        "trigger": "/desktop-act [action]",
        "example_prompt": "Run agent-desktop to launch the local dev server and position the browser alongside VS Code.",
        "files": [
          ".agents/skills/agent-desktop/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/lahfir/agent-desktop.git",
        "act": "AGENT DESKTOP: Automate local Windows desktop processes, window management, and terminal runner tasks.",
        "repoName": "lahfir/agent-desktop",
        "repoUrl": "https://github.com/lahfir/agent-desktop",
        "lang": "Python",
        "langColor": "#3572A5",
        "requiresApiKey": true,
        "apiKeyName": "COMPUTER_USE_KEY",
        "apiKeyHelp": "Enter Anthropic API key with computer-use beta enabled."
      }
    ],
    "hasApiKey": true
  },
  {
    "id": "repo-typesafe-mario",
    "name": "fhshaik/typesafe-mario",
    "title": "TypeSafe Mario State Engine",
    "repoUrl": "https://github.com/fhshaik/typesafe-mario",
    "desc": "Deterministic state machine patterns, typed collision detection, and zero-jitter game loops for vehicle simulation.",
    "lang": "TypeScript",
    "langColor": "#3178c6",
    "stars": "890",
    "cat": "jev",
    "subskills": [
      {
        "id": "typesafe-mario",
        "name": "TypeSafe State Machine",
        "cat": "jev",
        "desc": "Enforces deterministic, type-safe finite state transitions (IDLE -> MOVING -> APPROACHING -> ARRIVED -> DEPARTED).",
        "purpose": "Governs Application state progression, eliminating illegal telemetry transitions and arrival flickering.",
        "trigger": "state-machine: [entity]",
        "example_prompt": "Define a typesafe-mario state machine for shuttle stop arrivals with strict timeout transitions.",
        "files": [
          ".agents/skills/typesafe-mario/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/fhshaik/typesafe-mario.git",
        "act": "TYPESAFE MARIO: Implement zero-jitter deterministic state machines for vehicle position and stop arrival cycles.",
        "repoName": "fhshaik/typesafe-mario",
        "repoUrl": "https://github.com/fhshaik/typesafe-mario",
        "lang": "TypeScript",
        "langColor": "#3178c6",
        "requiresApiKey": false
      }
    ],
    "hasApiKey": false
  },
  {
    "id": "repo-jev-drone",
    "name": "RomanSlack/jev-drone",
    "title": "JEV Drone Spatial Routing & Geofencing",
    "repoUrl": "https://github.com/RomanSlack/jev-drone",
    "desc": "Autonomous spatial waypoint navigation, geofence radius calculation, and live telemetry vector stream decoders.",
    "lang": "Python",
    "langColor": "#3572A5",
    "stars": "430",
    "cat": "jev",
    "subskills": [
      {
        "id": "jev-drone",
        "name": "JEV Drone Spatial Engine",
        "cat": "jev",
        "desc": "Calculates geofence polygon intersections, bearing vectors, and polyline distance in real time.",
        "purpose": "Directly powers Geofence triggers and spatial heading rotation and bus heading rotation on the live map.",
        "trigger": "/geofence-calc [lat,lon]",
        "example_prompt": "Calculate whether Bus 04 coordinates (18.5645, 73.7268) intersect the 75m Hinjewadi stop polygon.",
        "files": [
          ".agents/skills/jev-drone/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/RomanSlack/jev-drone.git",
        "act": "JEV DRONE: Perform sub-millisecond geofencing and spatial vector calculations for bus location updates.",
        "repoName": "RomanSlack/jev-drone",
        "repoUrl": "https://github.com/RomanSlack/jev-drone",
        "lang": "Python",
        "langColor": "#3572A5",
        "requiresApiKey": false
      }
    ],
    "hasApiKey": false
  },
  {
    "id": "repo-onevonejev",
    "name": "emrickgarrett/OneVOneJev",
    "title": "OneVOneJev Adversarial Debate",
    "repoUrl": "https://github.com/emrickgarrett/OneVOneJev",
    "desc": "Adversarial multi-agent debate and validation protocol for evaluating competing architectural proposals and identifying edge-case failures.",
    "lang": "Python",
    "langColor": "#3572A5",
    "stars": "370",
    "cat": "jev",
    "subskills": [
      {
        "id": "onevonejev",
        "name": "OneVOne Debate Referee",
        "cat": "jev",
        "desc": "Pairs two adversarial agent personas (Proposer vs Critic) to uncover architectural flaws before code is committed.",
        "purpose": "Evaluates architectural trade-offs such as Redis Streams vs PubSub, or Polling vs SSE under low-bandwidth networks.",
        "trigger": "/debate [topic]",
        "example_prompt": "Run OneVOneJev debate on whether shuttle tokens should be stored in IndexedDB or localStorage.",
        "files": [
          ".agents/skills/onevonejev/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/emrickgarrett/OneVOneJev.git",
        "act": "ONEVONEJEV: Spawn adversary agents to rigorously challenge proposed designs before implementation.",
        "repoName": "emrickgarrett/OneVOneJev",
        "repoUrl": "https://github.com/emrickgarrett/OneVOneJev",
        "lang": "Python",
        "langColor": "#3572A5",
        "requiresApiKey": false
      }
    ],
    "hasApiKey": false
  },
  {
    "id": "repo-jev-trader",
    "name": "jarrodwatts/jev-trader",
    "title": "JEV Trader Event-Driven Engine",
    "repoUrl": "https://github.com/jarrodwatts/jev-trader",
    "desc": "High-frequency algorithmic event-driven trading state machine, order execution, and deterministic risk management bounds.",
    "lang": "TypeScript",
    "langColor": "#3178c6",
    "stars": "680",
    "cat": "jev",
    "subskills": [
      {
        "id": "jev-trader",
        "name": "Event-Driven Risk Bounds",
        "cat": "jev",
        "desc": "Applies high-throughput queue processing and circuit-breaker patterns to real-time telemetry streams.",
        "purpose": "Ensures the Real-time background workers and Redis connection pools never crashes or starves Redis connection pools under load.",
        "trigger": "circuit-breaker: [service]",
        "example_prompt": "Apply jev-trader circuit breaker logic to the EKA telemetry subscriber to handle network blips gracefully.",
        "files": [
          ".agents/skills/jev-trader/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/jarrodwatts/jev-trader.git",
        "act": "JEV TRADER: Enforce circuit breakers, rate limits, and idempotent queue processing on high-velocity data feeds.",
        "repoName": "jarrodwatts/jev-trader",
        "repoUrl": "https://github.com/jarrodwatts/jev-trader",
        "lang": "TypeScript",
        "langColor": "#3178c6",
        "requiresApiKey": true,
        "apiKeyName": "EXCHANGE_API_KEY",
        "apiKeyHelp": "Enter exchange read-only API Key for risk bounds simulation."
      }
    ],
    "hasApiKey": true
  },
  {
    "id": "repo-prism",
    "name": "irfndi/prism-liquidity-agent",
    "title": "Prism Tone & Persona Calibration",
    "repoUrl": "https://github.com/irfndi/prism-liquidity-agent",
    "desc": "Behavioral persona calibration, executive tone control, anti-slop prompt filters, and deterministic agent voice.",
    "lang": "TypeScript",
    "langColor": "#3178c6",
    "stars": "790",
    "cat": "data",
    "subskills": [
      {
        "id": "prism",
        "name": "Prism Persona Engine",
        "cat": "data",
        "desc": "Calibrates agent responses to senior engineering executive tone: concise, data-driven, zero buzzwords, highly actionable.",
        "purpose": "Ensures all Project code comments, API errors, and user documentation maintain exceptional professional clarity.",
        "trigger": "prism: [context]",
        "example_prompt": "Apply Prism persona rules to rewrite our backend error responses to be crystal clear and diagnostic.",
        "files": [
          ".agents/skills/prism/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/irfndi/prism-liquidity-agent.git",
        "act": "PRISM: Enforce executive technical tone: explain WHY not WHAT, eliminate fluff, and deliver production-grade code.",
        "repoName": "irfndi/prism-liquidity-agent",
        "repoUrl": "https://github.com/irfndi/prism-liquidity-agent",
        "lang": "TypeScript",
        "langColor": "#3178c6",
        "requiresApiKey": true,
        "apiKeyName": "DEFI_RPC_KEY",
        "apiKeyHelp": "Enter Ethereum/DeFi RPC URL or Infura/Alchemy API Key for swap tick feeds."
      }
    ],
    "hasApiKey": true
  },
  {
    "id": "repo-neo4jev",
    "name": "jexp/neo4jev",
    "title": "Neo4JEV Graph Database Connectors",
    "repoUrl": "https://github.com/jexp/neo4jev",
    "desc": "Connects JEV decision trees and memory graphs directly into Neo4j graph databases for multi-plant fleet topologies.",
    "lang": "Java",
    "langColor": "#b07219",
    "stars": "460",
    "cat": "data",
    "subskills": [
      {
        "id": "neo4jev",
        "name": "Neo4JEV Graph Connector",
        "cat": "data",
        "desc": "Models complex system networks (Nodes, Edges, Schemas, Dependencies) as graph nodes and relationships.",
        "purpose": "Powers multi-plant scaling and route overlap analysis across Pune, Chakan, and Pimpri manufacturing hubs.",
        "trigger": "cypher: [query]",
        "example_prompt": "Generate a Cypher query to identify all shuttle routes serving Chakan Plant 1 with overlapping stop windows.",
        "files": [
          ".agents/skills/neo4jev/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/jexp/neo4jev.git",
        "act": "NEO4JEV: Model graph schemas, nodes, and dependencies as property graphs with typed Cypher schemas.",
        "repoName": "jexp/neo4jev",
        "repoUrl": "https://github.com/jexp/neo4jev",
        "lang": "Java",
        "langColor": "#b07219",
        "requiresApiKey": true,
        "apiKeyName": "NEO4J_PASSWORD",
        "apiKeyHelp": "Enter Neo4j instance connection password for graph database operations."
      }
    ],
    "hasApiKey": true
  },
  {
    "id": "repo-jev-curate",
    "name": "AkashPriyadarshii/jev-curate",
    "title": "JEV Curate Dataset Synthesizer",
    "repoUrl": "https://github.com/AkashPriyadarshii/jev-curate",
    "desc": "Automated dataset curation, deduplication, synthetic telematics generation, and knowledge synthesis.",
    "lang": "Python",
    "langColor": "#3572A5",
    "stars": "350",
    "cat": "data",
    "subskills": [
      {
        "id": "jev-curate",
        "name": "JEV Curate Synthesizer",
        "cat": "data",
        "desc": "Synthesizes realistic GPS trails, mock device telemetry, and stop arrival timelines for automated load tests.",
        "purpose": "Generates realistic Realistic telemetry GPS data for simulation when live physical buses are parked in depots.",
        "trigger": "/generate-telemetry [route]",
        "example_prompt": "Generate 20 minutes of realistic synthetic GPS telemetry along Route 01 with realistic traffic speed variations.",
        "files": [
          ".agents/skills/jev-curate/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/AkashPriyadarshii/jev-curate.git",
        "act": "JEV CURATE: Generate synthetic GPS trails, validate dataset schemas, and curate telemetry benchmarks.",
        "repoName": "AkashPriyadarshii/jev-curate",
        "repoUrl": "https://github.com/AkashPriyadarshii/jev-curate",
        "lang": "Python",
        "langColor": "#3572A5",
        "requiresApiKey": false
      }
    ],
    "hasApiKey": false
  },
  {
    "id": "repo-canny",
    "name": "qkal/Canny",
    "title": "Canny Edge Detection & Verifier",
    "repoUrl": "https://github.com/qkal/Canny",
    "desc": "Impartial referee auditing git diffs, test executions, and non-negotiable guardrails to prevent hallucinated completion.",
    "lang": "Python",
    "langColor": "#3572A5",
    "stars": "620",
    "cat": "review",
    "subskills": [
      {
        "id": "canny-verifier",
        "name": "Canny Verifier",
        "cat": "review",
        "desc": "Objective referee verifying git diff evidence and test execution proof before approving tasks.",
        "purpose": "Enforces Architectural guardrails and critical constraints (no EKA core edits, no CAN data leaks, token auth check).",
        "trigger": "/verify",
        "example_prompt": "Run canny-verifier to audit our new SSE endpoint against system guardrails.",
        "files": [
          ".agents/skills/canny-verifier/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/qkal/Canny.git",
        "act": "CANNY VERIFIER: Impartial referee active. Verify git diff evidence and test execution proof before approving tasks.",
        "repoName": "qkal/Canny",
        "repoUrl": "https://github.com/qkal/Canny",
        "lang": "Python",
        "langColor": "#3572A5",
        "requiresApiKey": false
      }
    ],
    "hasApiKey": false
  },
  {
    "id": "repo-killmyidea",
    "name": "monteduro/killmyidea",
    "title": "KillMyIdea Red-Team Stress Tester",
    "repoUrl": "https://github.com/monteduro/killmyidea",
    "desc": "Brutal idea stress-tester classifying feature proposals as KILL, FIX, or SHIP with objective metrics, preventing scope creep.",
    "lang": "Python",
    "langColor": "#3572A5",
    "stars": "830",
    "cat": "review",
    "subskills": [
      {
        "id": "killmyidea",
        "name": "KillMyIdea Feature Gate",
        "cat": "review",
        "desc": "Subject proposed features to aggressive stress-testing. Return verdict (KILL / FIX / SHIP) with reasons.",
        "purpose": "Prevents product scope creep by evaluating new shuttle feature proposals against tech debt and maintenance cost.",
        "trigger": "killmyidea: [proposal]",
        "example_prompt": "Run killmyidea on adding peer-to-peer chat between shuttle passengers.",
        "files": [
          ".agents/skills/killmyidea/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/monteduro/killmyidea.git",
        "act": "KILLMYIDEA: Subject proposed features to aggressive stress-testing. Return verdict (KILL / FIX / SHIP) with reasons.",
        "repoName": "monteduro/killmyidea",
        "repoUrl": "https://github.com/monteduro/killmyidea",
        "lang": "Python",
        "langColor": "#3572A5",
        "requiresApiKey": false
      }
    ],
    "hasApiKey": false
  },
  {
    "id": "repo-awesome-jev",
    "name": "AnotiaWang/awesome-jev",
    "title": "Awesome JEV Community Directory",
    "repoUrl": "https://github.com/AnotiaWang/awesome-jev",
    "desc": "Curated index and repository directory of all JEV algorithms, open-source implementations, benchmarks, and research papers.",
    "lang": "Markdown",
    "langColor": "#083fa1",
    "stars": "2,850",
    "cat": "jev",
    "subskills": [
      {
        "id": "awesome-jev",
        "name": "Awesome JEV Directory",
        "cat": "jev",
        "desc": "Directory of papers, implementations, and verified reference architectures across the JEV ecosystem.",
        "purpose": "Quick reference for selecting the right JEV decision primitive for any engineering challenge.",
        "trigger": "awesome-jev: [topic]",
        "example_prompt": "Find the optimal JEV primitive for high-frequency geofence intersection testing.",
        "files": [
          ".agents/skills/awesome-jev/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/AnotiaWang/awesome-jev.git",
        "act": "AWESOME JEV: Access the comprehensive index of JEV algorithms, benchmarks, and architectural patterns.",
        "repoName": "AnotiaWang/awesome-jev",
        "repoUrl": "https://github.com/AnotiaWang/awesome-jev",
        "lang": "Markdown",
        "langColor": "#083fa1",
        "requiresApiKey": false
      }
    ],
    "hasApiKey": false
  },
  {
    "id": "repo-claudedesignskills",
    "name": "freshtechbro/claudedesignskills",
    "title": "Claude Design Skills (3D, WebGL & Motion Suite)",
    "repoUrl": "https://github.com/freshtechbro/claudedesignskills",
    "desc": "Comprehensive Claude design suite featuring 22 specialized frontend creative skills covering Three.js WebGL, React Three Fiber, Babylon.js, Spline, Lottie, Rive, Barba.js, and PixiJS.",
    "lang": "JavaScript",
    "langColor": "#f1e05a",
    "stars": "4,200",
    "cat": "media",
    "subskills": [
      {
        "id": "claudedesignskills-threejs-webgl",
        "name": "Three.js WebGL",
        "cat": "media",
        "desc": "Three.js scene rendering, camera controls, materials, and lighting.",
        "purpose": "3D bus vehicle visualization and fleet topology renders.",
        "trigger": "threejs: [scene]",
        "files": [
          ".agents/skills/claudedesignskills-threejs-webgl/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/freshtechbro/claudedesignskills.git",
        "act": "THREEJS WEBGL: Build GPU-accelerated 3D scenes with proper disposal and resize observers.",
        "repoName": "freshtechbro/claudedesignskills",
        "repoUrl": "https://github.com/freshtechbro/claudedesignskills",
        "lang": "JavaScript",
        "langColor": "#f1e05a",
        "requiresApiKey": false
      },
      {
        "id": "claudedesignskills-react-three-fiber",
        "name": "React Three Fiber",
        "cat": "media",
        "desc": "Declarative 3D scenes in React using R3F and Drei.",
        "purpose": "Interactive 3D vehicle status cards in React PWA.",
        "trigger": "r3f: [component]",
        "files": [
          ".agents/skills/claudedesignskills-react-three-fiber/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/freshtechbro/claudedesignskills.git",
        "act": "REACT THREE FIBER: Use declarative Three.js in React with fiber canvas hooks.",
        "repoName": "freshtechbro/claudedesignskills",
        "repoUrl": "https://github.com/freshtechbro/claudedesignskills",
        "lang": "JavaScript",
        "langColor": "#f1e05a",
        "requiresApiKey": false
      },
      {
        "id": "claudedesignskills-spline-interactive",
        "name": "Spline 3D Embeds",
        "cat": "media",
        "desc": "Embed interactive Spline 3D objects with event listeners.",
        "purpose": "Interactive 3D bus interior preview and battery telemetry models.",
        "trigger": "spline: [scene]",
        "files": [
          ".agents/skills/claudedesignskills-spline-interactive/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/freshtechbro/claudedesignskills.git",
        "act": "SPLINE INTERACTIVE: Integrate Spline runtime with mouse tracking and state triggers.",
        "repoName": "freshtechbro/claudedesignskills",
        "repoUrl": "https://github.com/freshtechbro/claudedesignskills",
        "lang": "JavaScript",
        "langColor": "#f1e05a",
        "requiresApiKey": false
      },
      {
        "id": "claudedesignskills-lottie-animations",
        "name": "Lottie Animations",
        "cat": "media",
        "desc": "Vector JSON animations for micro-interactions and loading states.",
        "purpose": "Delightful bus arrival celebrations and empty state animations.",
        "trigger": "lottie: [animation]",
        "files": [
          ".agents/skills/claudedesignskills-lottie-animations/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/freshtechbro/claudedesignskills.git",
        "act": "LOTTIE: Load vector JSON animations with player controls and reduced motion support.",
        "repoName": "freshtechbro/claudedesignskills",
        "repoUrl": "https://github.com/freshtechbro/claudedesignskills",
        "lang": "JavaScript",
        "langColor": "#f1e05a",
        "requiresApiKey": false
      },
      {
        "id": "claudedesignskills-rive-interactive",
        "name": "Rive State Machines",
        "cat": "media",
        "desc": "Interactive vector state machine graphics with inputs and triggers.",
        "purpose": "Live vehicle speedometer and dynamic battery status widgets.",
        "trigger": "rive: [graphic]",
        "files": [
          ".agents/skills/claudedesignskills-rive-interactive/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/freshtechbro/claudedesignskills.git",
        "act": "RIVE: Bind interactive state machine inputs to telemetry data streams.",
        "repoName": "freshtechbro/claudedesignskills",
        "repoUrl": "https://github.com/freshtechbro/claudedesignskills",
        "lang": "JavaScript",
        "langColor": "#f1e05a",
        "requiresApiKey": false
      },
      {
        "id": "claudedesignskills-babylonjs-engine",
        "name": "Babylon.js Engine",
        "cat": "media",
        "desc": "Enterprise WebGL game engine for complex spatial environments.",
        "purpose": "Factory depot 3D digital twins and parking bay allocations.",
        "trigger": "babylon: [scene]",
        "files": [
          ".agents/skills/claudedesignskills-babylonjs-engine/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/freshtechbro/claudedesignskills.git",
        "act": "BABYLONJS: Construct performant WebGL spatial environments with shadow cascades.",
        "repoName": "freshtechbro/claudedesignskills",
        "repoUrl": "https://github.com/freshtechbro/claudedesignskills",
        "lang": "JavaScript",
        "langColor": "#f1e05a",
        "requiresApiKey": false
      },
      {
        "id": "claudedesignskills-barba-js",
        "name": "Barba.js PJAX Transitions",
        "cat": "media",
        "desc": "Fluid page transitions without full page refreshes.",
        "purpose": "App-like smooth navigation between shuttle routes and station pages.",
        "trigger": "barba: [transition]",
        "files": [
          ".agents/skills/claudedesignskills-barba-js/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/freshtechbro/claudedesignskills.git",
        "act": "BARBA JS: Implement seamless container transitions with prefetching and sync mode.",
        "repoName": "freshtechbro/claudedesignskills",
        "repoUrl": "https://github.com/freshtechbro/claudedesignskills",
        "lang": "JavaScript",
        "langColor": "#f1e05a",
        "requiresApiKey": false
      },
      {
        "id": "claudedesignskills-animejs",
        "name": "Anime.js Staggers",
        "cat": "media",
        "desc": "Staggered micro-animations, SVG path morphs, and timelines.",
        "purpose": "Staggered stop countdown reveals and route line draws.",
        "trigger": "anime: [timeline]",
        "files": [
          ".agents/skills/claudedesignskills-animejs/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/freshtechbro/claudedesignskills.git",
        "act": "ANIMEJS: Create staggered timeline choreography with elastic easing curves.",
        "repoName": "freshtechbro/claudedesignskills",
        "repoUrl": "https://github.com/freshtechbro/claudedesignskills",
        "lang": "JavaScript",
        "langColor": "#f1e05a",
        "requiresApiKey": false
      },
      {
        "id": "claudedesignskills-pixijs-2d",
        "name": "PixiJS 2D Canvas",
        "cat": "media",
        "desc": "Hardware-accelerated 2D WebGL renderer for thousands of moving sprites.",
        "purpose": "High-density fleet telemetry maps with 500+ simultaneous bus markers.",
        "trigger": "pixijs: [canvas]",
        "files": [
          ".agents/skills/claudedesignskills-pixijs-2d/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/freshtechbro/claudedesignskills.git",
        "act": "PIXIJS: Render high-frequency sprite batches on GPU canvas with zero garbage collection lag.",
        "repoName": "freshtechbro/claudedesignskills",
        "repoUrl": "https://github.com/freshtechbro/claudedesignskills",
        "lang": "JavaScript",
        "langColor": "#f1e05a",
        "requiresApiKey": false
      },
      {
        "id": "claudedesignskills-react-spring-physics",
        "name": "React Spring Physics",
        "cat": "media",
        "desc": "Physics-based spring animations for fluid and natural UI elements.",
        "purpose": "Spring dynamics for interactive sheet handles.",
        "trigger": "spring: [motion]",
        "files": [
          ".agents/skills/claudedesignskills-react-spring-physics/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/freshtechbro/claudedesignskills.git",
        "act": "REACT SPRING: Implement damped harmonic oscillator physics for touch elements.",
        "repoName": "freshtechbro/claudedesignskills",
        "repoUrl": "https://github.com/freshtechbro/claudedesignskills",
        "lang": "JavaScript",
        "langColor": "#f1e05a",
        "requiresApiKey": false
      },
      {
        "id": "claudedesignskills-locomotive-scroll",
        "name": "Locomotive Scroll",
        "cat": "media",
        "desc": "Smooth virtual scrolling, parallax effects, and scroll position tracking.",
        "purpose": "Parallax timeline views for Interactive visual guides.",
        "trigger": "locomotive: [scroll]",
        "files": [
          ".agents/skills/claudedesignskills-locomotive-scroll/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/freshtechbro/claudedesignskills.git",
        "act": "LOCOMOTIVE SCROLL: Enable smooth virtual scrolling with parallax offsets.",
        "repoName": "freshtechbro/claudedesignskills",
        "repoUrl": "https://github.com/freshtechbro/claudedesignskills",
        "lang": "JavaScript",
        "langColor": "#f1e05a",
        "requiresApiKey": false
      },
      {
        "id": "claudedesignskills-playcanvas-engine",
        "name": "PlayCanvas Engine",
        "cat": "media",
        "desc": "Lightweight high-performance WebGL game and rendering engine.",
        "purpose": "Interactive depot 3D overview and fleet layout visualization.",
        "trigger": "playcanvas: [scene]",
        "files": [
          ".agents/skills/claudedesignskills-playcanvas-engine/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/freshtechbro/claudedesignskills.git",
        "act": "PLAYCANVAS: Render optimized 3D scenes on mobile devices.",
        "repoName": "freshtechbro/claudedesignskills",
        "repoUrl": "https://github.com/freshtechbro/claudedesignskills",
        "lang": "JavaScript",
        "langColor": "#f1e05a",
        "requiresApiKey": false
      },
      {
        "id": "claudedesignskills-substance-3d-texturing",
        "name": "Substance 3D Texturing",
        "cat": "media",
        "desc": "PBR material textures, metallic roughness maps, and realistic surface shaders.",
        "purpose": "Realistic vehicle chassis render and exterior paint visualization.",
        "trigger": "substance3d: [texture]",
        "files": [
          ".agents/skills/claudedesignskills-substance-3d-texturing/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/freshtechbro/claudedesignskills.git",
        "act": "SUBSTANCE 3D: Apply PBR roughness and metallic maps to 3D meshes.",
        "repoName": "freshtechbro/claudedesignskills",
        "repoUrl": "https://github.com/freshtechbro/claudedesignskills",
        "lang": "JavaScript",
        "langColor": "#f1e05a",
        "requiresApiKey": false
      },
      {
        "id": "claudedesignskills-motion-framer",
        "name": "Framer Motion Declarative",
        "cat": "media",
        "desc": "Declarative React animation library for gestures, drag, and component layoutId morphs.",
        "purpose": "Gesture-based mobile cards and modal transitions.",
        "trigger": "framer-motion: [component]",
        "files": [
          ".agents/skills/claudedesignskills-motion-framer/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/freshtechbro/claudedesignskills.git",
        "act": "FRAMER MOTION: Animate layout transitions with AnimatePresence and layoutId.",
        "repoName": "freshtechbro/claudedesignskills",
        "repoUrl": "https://github.com/freshtechbro/claudedesignskills",
        "lang": "JavaScript",
        "langColor": "#f1e05a",
        "requiresApiKey": false
      },
      {
        "id": "claudedesignskills-modern-web-design",
        "name": "Modern Web Design",
        "cat": "media",
        "desc": "Modern responsive typography, micro-states, dark mode palettes, and layout rhythm.",
        "purpose": "Ensures Enterprise user interfaces adhere to high modern aesthetic standards.",
        "trigger": "modern-web: [layout]",
        "files": [
          ".agents/skills/claudedesignskills-modern-web-design/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/freshtechbro/claudedesignskills.git",
        "act": "MODERN WEB: Structure layouts with CSS grid, fluid type, and semantic tokens.",
        "repoName": "freshtechbro/claudedesignskills",
        "repoUrl": "https://github.com/freshtechbro/claudedesignskills",
        "lang": "JavaScript",
        "langColor": "#f1e05a",
        "requiresApiKey": false
      }
    ],
    "hasApiKey": false
  },
  {
    "id": "repo-motion-dev",
    "name": "199-biotechnologies/motion-dev-animations-skill",
    "title": "Motion.dev v11 Animation Engine",
    "repoUrl": "https://github.com/199-biotechnologies/motion-dev-animations-skill",
    "desc": "Production guidelines for Motion.dev (Framer Motion v11): GPU-accelerated layout transforms, spring physics, exit/entry transitions, and reduced-motion fallbacks.",
    "lang": "TypeScript",
    "langColor": "#3178c6",
    "stars": "1,150",
    "cat": "design",
    "subskills": [
      {
        "id": "motion-dev-animations",
        "name": "Motion.dev v11 Core",
        "cat": "design",
        "desc": "GPU-only transform/opacity animations, spring physics, layoutId transitions, and accessible motion.",
        "purpose": "Powers silky smooth bottom sheets, drawer snaps, and live bus marker movement on maps.",
        "trigger": "motion: [component]",
        "example_prompt": "Build an interactive bottom sheet using Motion.dev spring transitions with 3 tactile snap heights.",
        "files": [
          ".agents/skills/motion-dev-animations-skill/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/199-biotechnologies/motion-dev-animations-skill.git",
        "act": "MOTION.DEV: Animate only transform/opacity on GPU. Use spring physics with stiffness 300, damping 30.",
        "repoName": "199-biotechnologies/motion-dev-animations-skill",
        "repoUrl": "https://github.com/199-biotechnologies/motion-dev-animations-skill",
        "lang": "TypeScript",
        "langColor": "#3178c6",
        "requiresApiKey": false
      }
    ],
    "hasApiKey": false
  },
  {
    "id": "repo-maptoposter",
    "name": "originalankur/maptoposter",
    "title": "MapToPoster OpenStreetMap Vector Art CLI",
    "repoUrl": "https://github.com/originalankur/maptoposter",
    "desc": "Generate high-resolution vector and print-ready map posters from OpenStreetMap data using 20+ curated themes (noir, ocean, blueprint, neon cyberpunk, terracotta).",
    "lang": "Python",
    "langColor": "#3572A5",
    "stars": "1,640",
    "cat": "media",
    "subskills": [
      {
        "id": "maptoposter",
        "name": "MapToPoster Vector CLI",
        "cat": "media",
        "desc": "OSM map poster generator with 20+ architectural palettes (noir, ocean, blueprint, neon cyberpunk, terracotta, warm beige).",
        "purpose": "Generates stunning print posters and digital route overviews for High-fidelity architectural presentations.",
        "trigger": "python create_map_poster.py --city [city] --theme [theme]",
        "example_prompt": "Generate an ocean-themed route map poster for Pune to Chakan Plant corridors.",
        "files": [
          ".agents/skills/maptoposter/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/originalankur/maptoposter.git",
        "act": "MAPTOPOSTER: Query OSM geographic boundary data and render thematic vector posters with custom route polylines.",
        "repoName": "originalankur/maptoposter",
        "repoUrl": "https://github.com/originalankur/maptoposter",
        "lang": "Python",
        "langColor": "#3572A5",
        "requiresApiKey": false
      }
    ],
    "hasApiKey": false
  },
  {
    "id": "repo-gsap-skills",
    "name": "greensock/gsap-skills",
    "title": "GSAP GreenSock Animation Suite",
    "repoUrl": "https://github.com/greensock/gsap-skills",
    "desc": "Comprehensive GreenSock animation platform suite covering Core tweens, React useGSAP hooks, ScrollTrigger, performance tuning, and official plugins.",
    "lang": "JavaScript",
    "langColor": "#f1e05a",
    "stars": "6,500",
    "cat": "design",
    "subskills": [
      {
        "id": "gsap-core",
        "name": "GSAP Core Engine",
        "cat": "design",
        "desc": "High-performance JavaScript animation engine for properties, SVG, and CSS.",
        "purpose": "Precision animation timing across the shuttle command center.",
        "trigger": "gsap: [tween]",
        "files": [
          ".agents/skills/gsap-skills-gsap-core/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/greensock/gsap-skills.git",
        "act": "GSAP CORE: Animate numeric properties with gsap.to/from, using ease and precision durations.",
        "repoName": "greensock/gsap-skills",
        "repoUrl": "https://github.com/greensock/gsap-skills",
        "lang": "JavaScript",
        "langColor": "#f1e05a",
        "requiresApiKey": false
      },
      {
        "id": "gsap-react",
        "name": "GSAP React & useGSAP",
        "cat": "design",
        "desc": "React integration hook managing scoping and automatic context cleanup.",
        "purpose": "Prevents memory leaks in React shuttle dashboards during frequent route updates.",
        "trigger": "useGSAP: [scope]",
        "files": [
          ".agents/skills/gsap-skills-gsap-react/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/greensock/gsap-skills.git",
        "act": "GSAP REACT: Use useGSAP hook with scope ref to auto-revert animations on component unmount.",
        "repoName": "greensock/gsap-skills",
        "repoUrl": "https://github.com/greensock/gsap-skills",
        "lang": "JavaScript",
        "langColor": "#f1e05a",
        "requiresApiKey": false
      },
      {
        "id": "gsap-scrolltrigger",
        "name": "GSAP ScrollTrigger",
        "cat": "design",
        "desc": "Scroll-driven animations, pinning, and scrubbed playback.",
        "purpose": "Drives the route overview scroll experience and milestone stop reveals.",
        "trigger": "scrollTrigger: [options]",
        "files": [
          ".agents/skills/gsap-skills-gsap-scrolltrigger/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/greensock/gsap-skills.git",
        "act": "GSAP SCROLLTRIGGER: Pin sections and link timeline progress directly to scroll position.",
        "repoName": "greensock/gsap-skills",
        "repoUrl": "https://github.com/greensock/gsap-skills",
        "lang": "JavaScript",
        "langColor": "#f1e05a",
        "requiresApiKey": false
      },
      {
        "id": "gsap-performance",
        "name": "GSAP Performance Tuning",
        "cat": "design",
        "desc": "60fps animation optimization, will-change management, and GPU compositing.",
        "purpose": "Ensures fluid animations on low-cost employee mobile devices.",
        "trigger": "gsap-perf: [audit]",
        "files": [
          ".agents/skills/gsap-skills-gsap-performance/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/greensock/gsap-skills.git",
        "act": "GSAP PERF: Audit layout thrashing, apply will-change selectively, and minimize layout recalculations.",
        "repoName": "greensock/gsap-skills",
        "repoUrl": "https://github.com/greensock/gsap-skills",
        "lang": "JavaScript",
        "langColor": "#f1e05a",
        "requiresApiKey": false
      },
      {
        "id": "gsap-frameworks",
        "name": "GSAP Frameworks",
        "cat": "design",
        "desc": "Integration patterns for Next.js App Router, Vite, and Nuxt SSR lifecycle.",
        "purpose": "Ensures zero hydration mismatch when animating in Next.js PWA.",
        "trigger": "gsap-fw: [setup]",
        "files": [
          ".agents/skills/gsap-skills-gsap-frameworks/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/greensock/gsap-skills.git",
        "act": "GSAP FRAMEWORKS: Bind animations safely across client-rendered and SSR routes.",
        "repoName": "greensock/gsap-skills",
        "repoUrl": "https://github.com/greensock/gsap-skills",
        "lang": "JavaScript",
        "langColor": "#f1e05a",
        "requiresApiKey": false
      },
      {
        "id": "gsap-timeline",
        "name": "GSAP Timeline Sequences",
        "cat": "design",
        "desc": "Multi-stage timeline sequencing with relative offsets, labels, and callbacks.",
        "purpose": "Choreographs complex multi-vehicle arrival state transitions.",
        "trigger": "gsap.timeline()",
        "files": [
          ".agents/skills/gsap-skills-gsap-timeline/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/greensock/gsap-skills.git",
        "act": "GSAP TIMELINE: Sequence animations with precise timing labels and callbacks.",
        "repoName": "greensock/gsap-skills",
        "repoUrl": "https://github.com/greensock/gsap-skills",
        "lang": "JavaScript",
        "langColor": "#f1e05a",
        "requiresApiKey": false
      },
      {
        "id": "gsap-utils",
        "name": "GSAP Utilities",
        "cat": "design",
        "desc": "Utility methods: mapRange, interpolate, snap, wrap, and normalize.",
        "purpose": "Mathematical interpolations for live GPS marker smoothing.",
        "trigger": "gsap.utils.interpolate()",
        "files": [
          ".agents/skills/gsap-skills-gsap-utils/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/greensock/gsap-skills.git",
        "act": "GSAP UTILS: Apply mathematical interpolation and snapping utilities to coordinates.",
        "repoName": "greensock/gsap-skills",
        "repoUrl": "https://github.com/greensock/gsap-skills",
        "lang": "JavaScript",
        "langColor": "#f1e05a",
        "requiresApiKey": false
      },
      {
        "id": "gsap-plugins",
        "name": "GSAP Plugins",
        "cat": "design",
        "desc": "Official plugins: Flip, Draggable, MotionPath, and TextPlugin.",
        "purpose": "Powers draggable route sheets and path-following vehicle icons.",
        "trigger": "gsap.registerPlugin(Flip, Draggable)",
        "files": [
          ".agents/skills/gsap-skills-gsap-plugins/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/greensock/gsap-skills.git",
        "act": "GSAP PLUGINS: Register and utilize Flip, Draggable, and MotionPath plugins.",
        "repoName": "greensock/gsap-skills",
        "repoUrl": "https://github.com/greensock/gsap-skills",
        "lang": "JavaScript",
        "langColor": "#f1e05a",
        "requiresApiKey": false
      }
    ],
    "hasApiKey": false
  },
  {
    "id": "repo-higgsfield-skills",
    "name": "higgsfield-ai/skills",
    "title": "Higgsfield AI Generative Media Suite",
    "repoUrl": "https://github.com/higgsfield-ai/skills",
    "desc": "Higgsfield generative media toolset for AI video explainers, brand kits, YouTube thumbnails, commercial product photoshoots, and character consistency.",
    "lang": "Python",
    "langColor": "#3572A5",
    "stars": "2,100",
    "cat": "media",
    "subskills": [
      {
        "id": "higgsfield-video-explainer",
        "name": "Higgsfield Video Explainer",
        "cat": "media",
        "desc": "AI video explainer generation and cinematic storyboard prompt engineering.",
        "purpose": "Creates employee onboarding explainer videos demonstrating how to track buses.",
        "trigger": "higgsfield-video: [script]",
        "files": [
          ".agents/skills/higgsfield-skills-higgsfield-video-explainer/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/higgsfield-ai/skills.git",
        "act": "HIGGSFIELD VIDEO: Design multi-scene cinematic video prompts with camera motion and lighting.",
        "repoName": "higgsfield-ai/skills",
        "repoUrl": "https://github.com/higgsfield-ai/skills",
        "lang": "Python",
        "langColor": "#3572A5",
        "requiresApiKey": false
      },
      {
        "id": "higgsfield-brandkit",
        "name": "Higgsfield Brandkit Pipeline",
        "cat": "media",
        "desc": "Extracts brand guidelines, generates harmonious color palettes, and outputs PPTX slides.",
        "purpose": "Ensures Executive presentation slides and posters adhere to EKA corporate brand standards.",
        "trigger": "brandkit: [brand]",
        "files": [
          ".agents/skills/higgsfield-skills-higgsfield-brandkit/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/higgsfield-ai/skills.git",
        "act": "HIGGSFIELD BRANDKIT: Synthesize design tokens, font scales, and export ready-to-present PPTX decks.",
        "repoName": "higgsfield-ai/skills",
        "repoUrl": "https://github.com/higgsfield-ai/skills",
        "lang": "Python",
        "langColor": "#3572A5",
        "requiresApiKey": true,
        "apiKeyName": "HIGGSFIELD_API_KEY",
        "apiKeyHelp": "Enter Higgsfield API key to run automated Brandkit pipeline."
      },
      {
        "id": "higgsfield-websites",
        "name": "Higgsfield Generative Web Media",
        "cat": "media",
        "desc": "Generative website hero backgrounds, motion video loops, and responsive assets.",
        "purpose": "Generates ambient video backdrops for the fleet operations wall display.",
        "trigger": "higgsfield-web: [asset]",
        "files": [
          ".agents/skills/higgsfield-skills-higgsfield-websites/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/higgsfield-ai/skills.git",
        "act": "HIGGSFIELD WEBSITES: Generate loopable ambient video assets tailored for responsive web backgrounds.",
        "repoName": "higgsfield-ai/skills",
        "repoUrl": "https://github.com/higgsfield-ai/skills",
        "lang": "Python",
        "langColor": "#3572A5",
        "requiresApiKey": false
      },
      {
        "id": "higgsfield-youtube-thumbnail",
        "name": "Higgsfield Thumbnails",
        "cat": "media",
        "desc": "High-CTR YouTube thumbnail prompt design with bold typography and contrast.",
        "purpose": "Creates compelling cover art for video training materials.",
        "trigger": "thumbnail: [topic]",
        "files": [
          ".agents/skills/higgsfield-skills-higgsfield-youtube-thumbnail/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/higgsfield-ai/skills.git",
        "act": "HIGGSFIELD THUMBNAILS: Generate high-impact thumbnail compositions with bold focal points.",
        "repoName": "higgsfield-ai/skills",
        "repoUrl": "https://github.com/higgsfield-ai/skills",
        "lang": "Python",
        "langColor": "#3572A5",
        "requiresApiKey": false
      },
      {
        "id": "higgsfield-marketplace-cards",
        "name": "Marketplace Cards",
        "cat": "media",
        "desc": "Commercial marketplace card layouts and asset scaling guidelines.",
        "purpose": "Clean layout cards for employee route selection.",
        "trigger": "market-card: [item]",
        "files": [
          ".agents/skills/higgsfield-skills-higgsfield-marketplace-cards/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/higgsfield-ai/skills.git",
        "act": "MARKETPLACE CARDS: Design responsive card layouts optimized for asset visibility.",
        "repoName": "higgsfield-ai/skills",
        "repoUrl": "https://github.com/higgsfield-ai/skills",
        "lang": "Python",
        "langColor": "#3572A5",
        "requiresApiKey": false
      },
      {
        "id": "higgsfield-product-photoshoot",
        "name": "Product Photoshoot",
        "cat": "media",
        "desc": "Photorealistic commercial vehicle photoshoot prompts with studio lighting.",
        "purpose": "Studio-grade commercial imagery of EKA electric buses.",
        "trigger": "photoshoot: [vehicle]",
        "files": [
          ".agents/skills/higgsfield-skills-higgsfield-product-photoshoot/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/higgsfield-ai/skills.git",
        "act": "PRODUCT PHOTOSHOOT: Render studio-lit commercial product photographs with reflections.",
        "repoName": "higgsfield-ai/skills",
        "repoUrl": "https://github.com/higgsfield-ai/skills",
        "lang": "Python",
        "langColor": "#3572A5",
        "requiresApiKey": false
      },
      {
        "id": "higgsfield-generate",
        "name": "Higgsfield CLI Generate",
        "cat": "media",
        "desc": "Command-line generate client for automated background media rendering.",
        "purpose": "Batch generation of route background assets via CLI scripts.",
        "trigger": "higgsfield generate --prompt [p]",
        "files": [
          ".agents/skills/higgsfield-skills-higgsfield-generate/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/higgsfield-ai/skills.git",
        "act": "HIGGSFIELD CLI: Invoke command-line video and image generation pipelines.",
        "repoName": "higgsfield-ai/skills",
        "repoUrl": "https://github.com/higgsfield-ai/skills",
        "lang": "Python",
        "langColor": "#3572A5",
        "requiresApiKey": true,
        "apiKeyName": "HIGGSFIELD_API_KEY",
        "apiKeyHelp": "Enter Higgsfield API key from your higgsfield.ai dashboard for CLI generation."
      },
      {
        "id": "higgsfield-soul-id",
        "name": "Soul ID Persona Consistency",
        "cat": "media",
        "desc": "Consistent character and persona seed generation across video frames.",
        "purpose": "Maintains a friendly, consistent virtual conductor guide in app tutorials.",
        "trigger": "soul-id: [character]",
        "files": [
          ".agents/skills/higgsfield-skills-higgsfield-soul-id/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/higgsfield-ai/skills.git",
        "act": "SOUL ID: Enforce visual identity consistency across multi-frame video outputs.",
        "repoName": "higgsfield-ai/skills",
        "repoUrl": "https://github.com/higgsfield-ai/skills",
        "lang": "Python",
        "langColor": "#3572A5",
        "requiresApiKey": false
      }
    ],
    "hasApiKey": true
  },
  {
    "id": "repo-seedance2",
    "name": "dexhunter/seedance2-skill",
    "title": "SeeDance 2.0 Cinematic Video Prompts",
    "repoUrl": "https://github.com/dexhunter/seedance2-skill",
    "desc": "SeeDance 2.0 AI video generation engine with 10 cinematic motion scenarios (camera tracking, aerial drone sweep, dynamic lighting, en/zh multi-lingual prompts).",
    "lang": "Markdown",
    "langColor": "#083fa1",
    "stars": "950",
    "cat": "media",
    "subskills": [
      {
        "id": "seedance2-skill",
        "name": "SeeDance 2.0 Cinematic Engine",
        "cat": "media",
        "desc": "Multi-shot cinematic camera movements (pan, tilt, crane, dolly) and volumetric lighting prompts.",
        "purpose": "Generates promotional video previews and plant aerial flythroughs for EKA mobility platforms.",
        "trigger": "seedance: [prompt]",
        "example_prompt": "Generate a SeeDance prompt for an aerial drone sweep following an electric bus approaching Chakan Plant.",
        "files": [
          ".agents/skills/seedance2-skill/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/dexhunter/seedance2-skill.git",
        "act": "SEEDANCE 2.0: Structure cinematic video generation prompts with camera focal length, motion path, and volumetric lighting.",
        "repoName": "dexhunter/seedance2-skill",
        "repoUrl": "https://github.com/dexhunter/seedance2-skill",
        "lang": "Markdown",
        "langColor": "#083fa1",
        "requiresApiKey": true,
        "apiKeyName": "SEEDANCE_API_KEY",
        "apiKeyHelp": "Enter SeeDance 2.0 API token for automated cinematic generation."
      }
    ],
    "hasApiKey": true
  },
  {
    "id": "repo-impeccable",
    "name": "pbakaus/impeccable",
    "title": "Impeccable Design Critique & Hierarchy",
    "repoUrl": "https://github.com/pbakaus/impeccable",
    "desc": "Elite design critique framework: anti-slop rules, typographic rhythm, contrast ratios, and polish checklists preventing generic AI aesthetics.",
    "lang": "Markdown",
    "langColor": "#083fa1",
    "stars": "3,400",
    "cat": "design",
    "subskills": [
      {
        "id": "impeccable",
        "name": "Impeccable Design Critique",
        "cat": "design",
        "desc": "Anti-slop rules, intentional typography scales, strict border hierarchies, and zero generic placeholders.",
        "purpose": "Guarantees web interfaces feel like a bespoke, premium engineering product rather than an AI boilerplate.",
        "trigger": "/critique [ui]",
        "example_prompt": "Audit the component status card with Impeccable guidelines to improve visual hierarchy and contrast.",
        "files": [
          ".agents/skills/impeccable/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/pbakaus/impeccable.git",
        "act": "IMPECCABLE: Enforce intentional typography, restrained palettes, crisp borders, and zero AI design cliches.",
        "repoName": "pbakaus/impeccable",
        "repoUrl": "https://github.com/pbakaus/impeccable",
        "lang": "Markdown",
        "langColor": "#083fa1",
        "requiresApiKey": false
      }
    ],
    "hasApiKey": false
  },
  {
    "id": "repo-taste-skill",
    "name": "leonxlnx/taste-skill",
    "title": "Design Taste & Editorial Bento Framework",
    "repoUrl": "https://github.com/leonxlnx/taste-skill",
    "desc": "Frontend taste framework covering editorial typography, gapless bento grids, brutalist UI, minimalist UI, and image-to-code translation.",
    "lang": "TypeScript",
    "langColor": "#3178c6",
    "stars": "2,900",
    "cat": "design",
    "subskills": [
      {
        "id": "taste-skill",
        "name": "Design Taste Core",
        "cat": "design",
        "desc": "Editorial typographic hierarchy, bento layouts, and premium aesthetic taste.",
        "purpose": "Elevates web dashboards with magazine-level visual polish.",
        "trigger": "taste: [component]",
        "files": [
          ".agents/skills/taste-skill/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/leonxlnx/taste-skill.git",
        "act": "DESIGN TASTE: Structure pages with tight typographic hierarchy, disciplined bento grids, and high-contrast accents.",
        "repoName": "leonxlnx/taste-skill",
        "repoUrl": "https://github.com/leonxlnx/taste-skill",
        "lang": "TypeScript",
        "langColor": "#3178c6",
        "requiresApiKey": false
      },
      {
        "id": "brutalist-skill",
        "name": "Industrial Brutalist UI",
        "cat": "design",
        "desc": "Monochrome, high-contrast borders, raw telemetry readouts, zero soft gradients.",
        "purpose": "Ideal for fleet maintenance screens and factory floor supervisor monitors.",
        "trigger": "brutalist: [screen]",
        "files": [
          ".agents/skills/taste-skill-brutalist-skill/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/leonxlnx/taste-skill.git",
        "act": "BRUTALIST UI: Use high-contrast borders, monospace telemetry counters, and stark utilitarian grids.",
        "repoName": "leonxlnx/taste-skill",
        "repoUrl": "https://github.com/leonxlnx/taste-skill",
        "lang": "TypeScript",
        "langColor": "#3178c6",
        "requiresApiKey": false
      },
      {
        "id": "minimalist-skill",
        "name": "Warm Minimalist UI",
        "cat": "design",
        "desc": "Generous breathing space, subtle warm grays, restrained typography.",
        "purpose": "Calming interface for employee passenger view.",
        "trigger": "minimalist: [screen]",
        "files": [
          ".agents/skills/taste-skill-minimalist-skill/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/leonxlnx/taste-skill.git",
        "act": "MINIMALIST UI: Remove non-essential dividers, maximize whitespace, and use restrained typography.",
        "repoName": "leonxlnx/taste-skill",
        "repoUrl": "https://github.com/leonxlnx/taste-skill",
        "lang": "TypeScript",
        "langColor": "#3178c6",
        "requiresApiKey": false
      },
      {
        "id": "image-to-code-skill",
        "name": "Image-to-Code Translation",
        "cat": "design",
        "desc": "Converts mockup screenshots directly to production HTML/Tailwind/Primer code.",
        "purpose": "Faithfully reproduces Figma design files into code without visual drift.",
        "trigger": "img2code: [image]",
        "files": [
          ".agents/skills/taste-skill-image-to-code-skill/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/leonxlnx/taste-skill.git",
        "act": "IMAGE TO CODE: Translate visual screenshot hierarchy into pixel-perfect semantic code components.",
        "repoName": "leonxlnx/taste-skill",
        "repoUrl": "https://github.com/leonxlnx/taste-skill",
        "lang": "TypeScript",
        "langColor": "#3178c6",
        "requiresApiKey": false
      },
      {
        "id": "taste-skill-v1",
        "name": "Editorial Taste v1",
        "cat": "design",
        "desc": "Editorial magazine-style layout rules, typography leading, and drop caps.",
        "purpose": "High-polish Project overview documentation and print releases.",
        "trigger": "taste-v1: [doc]",
        "files": [
          ".agents/skills/taste-skill-taste-skill-v1/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/leonxlnx/taste-skill.git",
        "act": "TASTE V1: Apply editorial print typography and disciplined layout leading.",
        "repoName": "leonxlnx/taste-skill",
        "repoUrl": "https://github.com/leonxlnx/taste-skill",
        "lang": "TypeScript",
        "langColor": "#3178c6",
        "requiresApiKey": false
      },
      {
        "id": "gpt-tasteskill",
        "name": "GPT Taste Landing",
        "cat": "design",
        "desc": "GSAP-heavy landing pages with strict AIDA structure and bento grids.",
        "purpose": "Corporate presentation portals for fleet operations.",
        "trigger": "gpt-taste: [page]",
        "files": [
          ".agents/skills/taste-skill-gpt-tasteskill/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/leonxlnx/taste-skill.git",
        "act": "GPT TASTE: Build wide hero typography and gapless bento grids with AIDA flow.",
        "repoName": "leonxlnx/taste-skill",
        "repoUrl": "https://github.com/leonxlnx/taste-skill",
        "lang": "TypeScript",
        "langColor": "#3178c6",
        "requiresApiKey": false
      },
      {
        "id": "soft-skill",
        "name": "Soft UI Design",
        "cat": "design",
        "desc": "Soft surfaces, gentle layered drop-shadows, rounded geometry, and calm accents.",
        "purpose": "Friendly, approachable Mobile status cards.",
        "trigger": "soft-ui: [card]",
        "files": [
          ".agents/skills/taste-skill-soft-skill/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/leonxlnx/taste-skill.git",
        "act": "SOFT UI: Layer soft box-shadows and calm pastel accents for friendly interfaces.",
        "repoName": "leonxlnx/taste-skill",
        "repoUrl": "https://github.com/leonxlnx/taste-skill",
        "lang": "TypeScript",
        "langColor": "#3178c6",
        "requiresApiKey": false
      },
      {
        "id": "stitch-skill",
        "name": "Stitch Design System",
        "cat": "design",
        "desc": "Semantic design system primitives and iterative design loops.",
        "purpose": "Maintains shared design token vocabulary across React and Django apps.",
        "trigger": "stitch: [token]",
        "files": [
          ".agents/skills/taste-skill-stitch-skill/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/leonxlnx/taste-skill.git",
        "act": "STITCH DESIGN: Synthesize semantic design tokens into strict CSS custom properties.",
        "repoName": "leonxlnx/taste-skill",
        "repoUrl": "https://github.com/leonxlnx/taste-skill",
        "lang": "TypeScript",
        "langColor": "#3178c6",
        "requiresApiKey": false
      },
      {
        "id": "brandkit",
        "name": "Dynamic Brandkit",
        "cat": "design",
        "desc": "Color palette harmony, contrast checkers, and typography token tables.",
        "purpose": "Ensures brand consistency across all fleet portal views.",
        "trigger": "brandkit: [theme]",
        "files": [
          ".agents/skills/taste-skill-brandkit/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/leonxlnx/taste-skill.git",
        "act": "BRANDKIT: Generate contrast-safe color ramps and typography hierarchies.",
        "repoName": "leonxlnx/taste-skill",
        "repoUrl": "https://github.com/leonxlnx/taste-skill",
        "lang": "TypeScript",
        "langColor": "#3178c6",
        "requiresApiKey": false
      },
      {
        "id": "imagegen-frontend-mobile",
        "name": "Mobile Section Art",
        "cat": "design",
        "desc": "AWWWARDS-level mobile section art direction without generic stock visuals.",
        "purpose": "Authentic, high-impact imagery for mobile splash and empty states.",
        "trigger": "imagegen-mobile: [section]",
        "files": [
          ".agents/skills/taste-skill-imagegen-frontend-mobile/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/leonxlnx/taste-skill.git",
        "act": "IMAGEGEN MOBILE: Direct bespoke section artwork tailored for vertical mobile viewports.",
        "repoName": "leonxlnx/taste-skill",
        "repoUrl": "https://github.com/leonxlnx/taste-skill",
        "lang": "TypeScript",
        "langColor": "#3178c6",
        "requiresApiKey": false
      },
      {
        "id": "imagegen-frontend-web",
        "name": "Web Section Art",
        "cat": "design",
        "desc": "Bespoke desktop web section imagery and art-directed illustrations.",
        "purpose": "Command center hero section artwork.",
        "trigger": "imagegen-web: [section]",
        "files": [
          ".agents/skills/taste-skill-imagegen-frontend-web/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/leonxlnx/taste-skill.git",
        "act": "IMAGEGEN WEB: Art-direct high-resolution section graphics with dramatic lighting.",
        "repoName": "leonxlnx/taste-skill",
        "repoUrl": "https://github.com/leonxlnx/taste-skill",
        "lang": "TypeScript",
        "langColor": "#3178c6",
        "requiresApiKey": false
      },
      {
        "id": "redesign-skill",
        "name": "Surgical UI Redesign",
        "cat": "design",
        "desc": "Refactors legacy, cluttered interfaces into sleek, modern components.",
        "purpose": "Modernizes legacy EKA Connect fleet screens into clean Primer layouts.",
        "trigger": "redesign: [view]",
        "files": [
          ".agents/skills/taste-skill-redesign-skill/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/leonxlnx/taste-skill.git",
        "act": "REDESIGN: Strip clutter, tighten padding, align grids, and modernize typography.",
        "repoName": "leonxlnx/taste-skill",
        "repoUrl": "https://github.com/leonxlnx/taste-skill",
        "lang": "TypeScript",
        "langColor": "#3178c6",
        "requiresApiKey": false
      },
      {
        "id": "output-skill",
        "name": "Full Output Enforcement",
        "cat": "design",
        "desc": "Strict rules requiring complete, non-truncated code outputs with zero placeholders.",
        "purpose": "Ensures Antigravity writes complete, copy-pasteable production files every time.",
        "trigger": "output-enforce",
        "files": [
          ".agents/skills/taste-skill-output-skill/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/leonxlnx/taste-skill.git",
        "act": "FULL OUTPUT: Never emit ellipsis comments (// ...) or placeholders; output complete code.",
        "repoName": "leonxlnx/taste-skill",
        "repoUrl": "https://github.com/leonxlnx/taste-skill",
        "lang": "TypeScript",
        "langColor": "#3178c6",
        "requiresApiKey": false
      }
    ],
    "hasApiKey": false
  },
  {
    "id": "repo-emilkowalski",
    "name": "emilkowalski/skills",
    "title": "Emil Kowalski Design Engineering Suite",
    "repoUrl": "https://github.com/emilkowalski/skills",
    "desc": "Emil Kowalski design engineering suite covering micro-animations, Apple HIG principles, Sonner toasts, animation reviews, and mobile-native patterns.",
    "lang": "TypeScript",
    "langColor": "#3178c6",
    "stars": "5,800",
    "cat": "design",
    "subskills": [
      {
        "id": "emil-design-eng",
        "name": "Design Engineering Core",
        "cat": "design",
        "desc": "60fps interaction engineering, spring damping, and tactile tactile micro-states.",
        "purpose": "Turns static shuttle cards into fluid, tactile interactive widgets.",
        "trigger": "design-eng: [widget]",
        "files": [
          ".agents/skills/emilkowalski-skills-emil-design-eng/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/emilkowalski/skills.git",
        "act": "DESIGN ENGINEERING: Implement fluid interaction physics, active pressed states, and spring curves.",
        "repoName": "emilkowalski/skills",
        "repoUrl": "https://github.com/emilkowalski/skills",
        "lang": "TypeScript",
        "langColor": "#3178c6",
        "requiresApiKey": false
      },
      {
        "id": "animate",
        "name": "Micro-Animations",
        "cat": "design",
        "desc": "Button clicks, modal entrances, layout morphs, and accordion reveals.",
        "purpose": "Delivers satisfying click-to-expand accordion transitions in the GUI.",
        "trigger": "animate: [interaction]",
        "files": [
          ".agents/skills/emilkowalski-skills-animate/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/emilkowalski/skills.git",
        "act": "MICRO ANIMATIONS: Add subtle transform scale(0.98) on click and smooth accordion height morphs.",
        "repoName": "emilkowalski/skills",
        "repoUrl": "https://github.com/emilkowalski/skills",
        "lang": "TypeScript",
        "langColor": "#3178c6",
        "requiresApiKey": false
      },
      {
        "id": "ask-sonner",
        "name": "Sonner Toast Notifications",
        "cat": "design",
        "desc": "Stacked toast notifications with swipe dismissal and action buttons.",
        "purpose": "Provides clear feedback when bus positions update or alerts trigger.",
        "trigger": "toast: [message]",
        "files": [
          ".agents/skills/emilkowalski-skills-ask-sonner/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/emilkowalski/skills.git",
        "act": "SONNER TOASTS: Render stacked, swipeable notification toasts with high contrast.",
        "repoName": "emilkowalski/skills",
        "repoUrl": "https://github.com/emilkowalski/skills",
        "lang": "TypeScript",
        "langColor": "#3178c6",
        "requiresApiKey": false
      },
      {
        "id": "apple-design",
        "name": "Apple HIG Principles",
        "cat": "design",
        "desc": "Continuous corner radii, fluid sheets, safe area insets, and iOS gestures.",
        "purpose": "Ensures the iOS PWA and mobile interfaces feels like an authentic native iOS application.",
        "trigger": "apple-hig: [view]",
        "files": [
          ".agents/skills/emilkowalski-skills-apple-design/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/emilkowalski/skills.git",
        "act": "APPLE DESIGN: Adhere to continuous rounded corners, safe-area insets, and iOS interaction guidelines.",
        "repoName": "emilkowalski/skills",
        "repoUrl": "https://github.com/emilkowalski/skills",
        "lang": "TypeScript",
        "langColor": "#3178c6",
        "requiresApiKey": false
      },
      {
        "id": "animate-expo",
        "name": "Animate Expo Mobile",
        "cat": "design",
        "desc": "React Native & Expo fluid animations with Reanimated 3 and gesture handlers.",
        "purpose": "Powers native mobile gestures in the Mobile applications.",
        "trigger": "animate-expo: [gesture]",
        "files": [
          ".agents/skills/emilkowalski-skills-animate-expo/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/emilkowalski/skills.git",
        "act": "ANIMATE EXPO: Build 60fps native gestures with react-native-reanimated worklets.",
        "repoName": "emilkowalski/skills",
        "repoUrl": "https://github.com/emilkowalski/skills",
        "lang": "TypeScript",
        "langColor": "#3178c6",
        "requiresApiKey": false
      },
      {
        "id": "find-animation-opportunities",
        "name": "Animation Audit",
        "cat": "design",
        "desc": "Systematic code audit identifying high-impact points for micro-animations.",
        "purpose": "Discovers opportunities to add subtle polish to Data dashboards.",
        "trigger": "audit-animations: [file]",
        "files": [
          ".agents/skills/emilkowalski-skills-find-animation-opportunities/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/emilkowalski/skills.git",
        "act": "FIND ANIMATIONS: Identify interactive elements lacking feedback and propose micro-motion.",
        "repoName": "emilkowalski/skills",
        "repoUrl": "https://github.com/emilkowalski/skills",
        "lang": "TypeScript",
        "langColor": "#3178c6",
        "requiresApiKey": false
      },
      {
        "id": "improve-animations",
        "name": "Tune Spring Physics",
        "cat": "design",
        "desc": "Fine-tunes stiffness, damping, mass, and timing curves to eliminate awkward bounces.",
        "purpose": "Calibrates bottom sheet snap physics to feel satisfying and weighted.",
        "trigger": "tune-spring: [params]",
        "files": [
          ".agents/skills/emilkowalski-skills-improve-animations/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/emilkowalski/skills.git",
        "act": "IMPROVE ANIMATIONS: Replace linear transitions with critically damped spring curves.",
        "repoName": "emilkowalski/skills",
        "repoUrl": "https://github.com/emilkowalski/skills",
        "lang": "TypeScript",
        "langColor": "#3178c6",
        "requiresApiKey": false
      },
      {
        "id": "review-animations",
        "name": "8-Category Motion Audit",
        "cat": "design",
        "desc": "Audits animations across 8 categories: FPS, GPU offloading, jank, layout thrash, and a11y.",
        "purpose": "Ensures zero frame drops on budget smartphones.",
        "trigger": "motion-audit: [component]",
        "files": [
          ".agents/skills/emilkowalski-skills-review-animations/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/emilkowalski/skills.git",
        "act": "REVIEW ANIMATIONS: Audit layout recalculations, force GPU layers, and verify prefers-reduced-motion.",
        "repoName": "emilkowalski/skills",
        "repoUrl": "https://github.com/emilkowalski/skills",
        "lang": "TypeScript",
        "langColor": "#3178c6",
        "requiresApiKey": false
      },
      {
        "id": "animation-vocabulary",
        "name": "Animation Vocabulary",
        "cat": "design",
        "desc": "Precise terms and mathematical formulas for motion: FLIP, layoutId, spring overshoot.",
        "purpose": "Enables clear, precise pair-programming communication about UI motion.",
        "trigger": "motion-vocab",
        "files": [
          ".agents/skills/emilkowalski-skills-animation-vocabulary/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/emilkowalski/skills.git",
        "act": "ANIMATION VOCAB: Use precise motion engineering terminology and velocity formulas.",
        "repoName": "emilkowalski/skills",
        "repoUrl": "https://github.com/emilkowalski/skills",
        "lang": "TypeScript",
        "langColor": "#3178c6",
        "requiresApiKey": false
      },
      {
        "id": "prototype",
        "name": "Rapid Code Prototyping",
        "cat": "design",
        "desc": "Builds interactive throwaway prototypes in code in minutes to test ideas with users.",
        "purpose": "Rapid validation of new shuttle tracking interaction patterns.",
        "trigger": "prototype: [feature]",
        "files": [
          ".agents/skills/emilkowalski-skills-prototype/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/emilkowalski/skills.git",
        "act": "PROTOTYPE: Build functional interactive prototypes directly in code for rapid user validation.",
        "repoName": "emilkowalski/skills",
        "repoUrl": "https://github.com/emilkowalski/skills",
        "lang": "TypeScript",
        "langColor": "#3178c6",
        "requiresApiKey": false
      },
      {
        "id": "mobile-native",
        "name": "Mobile Native UX",
        "cat": "design",
        "desc": "Edge-to-edge layouts, bottom navigation bars, native haptics, and safe-area insets.",
        "purpose": "Native touch ergonomics for factory floor workers using mobile phones.",
        "trigger": "mobile-native: [layout]",
        "files": [
          ".agents/skills/emilkowalski-skills-mobile-native/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/emilkowalski/skills.git",
        "act": "MOBILE NATIVE: Follow iOS/Android safe area, touch target (44px+), and haptic conventions.",
        "repoName": "emilkowalski/skills",
        "repoUrl": "https://github.com/emilkowalski/skills",
        "lang": "TypeScript",
        "langColor": "#3178c6",
        "requiresApiKey": false
      },
      {
        "id": "write-swift",
        "name": "SwiftUI Apple Patterns",
        "cat": "design",
        "desc": "Modern SwiftUI views, observation framework, sheets, and Liquid Glass styling.",
        "purpose": "Native iOS companion app for fleet managers.",
        "trigger": "swiftui: [view]",
        "files": [
          ".agents/skills/emilkowalski-skills-write-swift/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/emilkowalski/skills.git",
        "act": "WRITE SWIFT: Scaffold modern SwiftUI views with observation macros and navigation stacks.",
        "repoName": "emilkowalski/skills",
        "repoUrl": "https://github.com/emilkowalski/skills",
        "lang": "TypeScript",
        "langColor": "#3178c6",
        "requiresApiKey": false
      },
      {
        "id": "pick-ui-library",
        "name": "UI Library Selector",
        "cat": "design",
        "desc": "Objective decision rubric comparing Tailwind, Radix UI, Shadcn, and Mantine.",
        "purpose": "Guides clean component library choices for Data dashboards.",
        "trigger": "pick-ui: [criteria]",
        "files": [
          ".agents/skills/emilkowalski-skills-pick-ui-library/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/emilkowalski/skills.git",
        "act": "PICK UI: Evaluate component libraries based on bundle size, accessibility, and headless architecture.",
        "repoName": "emilkowalski/skills",
        "repoUrl": "https://github.com/emilkowalski/skills",
        "lang": "TypeScript",
        "langColor": "#3178c6",
        "requiresApiKey": false
      }
    ],
    "hasApiKey": false
  },
  {
    "id": "repo-appllama",
    "name": "Appllama/appllama-skills",
    "title": "Appllama MCP & Mobile App Design Suite",
    "repoUrl": "https://github.com/Appllama/appllama-skills",
    "desc": "Mobile UX intelligence based on 25,000+ top iOS/Android apps: Lungy organic breathing radial pulses, Finch calm reassuring microcopy, bottom sheets with snap points, and Appllama MCP tools.",
    "lang": "TypeScript",
    "langColor": "#3178c6",
    "stars": "1,890",
    "cat": "mobile",
    "subskills": [
      {
        "id": "appllama-design",
        "name": "Appllama Mobile UX (Lungy & Finch)",
        "cat": "mobile",
        "desc": "Mobile design intelligence: Lungy organic breathing pulses, Finch calming zero-anxiety microcopy, bottom sheets with velocity snaps.",
        "purpose": "Creates a stress-free, delightful commute tracking experience for factory and corporate employees.",
        "trigger": "/goal Using Appllama MCP & App design skills, create a breathing app with flows like 'Lungy' and design it like 'Finch'.",
        "example_prompt": "/goal Using Appllama MCP & App design skills, create a breathing app with flows like 'Lungy' and design it like 'Finch'.",
        "files": [
          ".agents/skills/appllama-design/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/Appllama/appllama-skills.git",
        "act": "APPLLAMA MOBILE DESIGN: Implement Lungy-inspired organic radial breathing pulses (3s in, 3s out) and Finch-inspired calming microcopy.",
        "repoName": "Appllama/appllama-skills",
        "repoUrl": "https://github.com/Appllama/appllama-skills",
        "lang": "TypeScript",
        "langColor": "#3178c6",
        "requiresApiKey": false
      },
      {
        "id": "appllama-mcp",
        "name": "Appllama MCP Server",
        "cat": "mobile",
        "desc": "Model Context Protocol tools connecting mobile component templates, touch gesture primitives, and flow scaffolds.",
        "purpose": "Allows Antigravity IDE to scaffold complete mobile screens and breathing flow mechanics in a single turn.",
        "trigger": "tool: appllama_scaffold_flow, appllama_mobile_component",
        "example_prompt": "Scaffold a mobile breathing flow with 3-step inhale-hold-exhale cycles using Appllama MCP.",
        "files": [
          ".agents/skills/appllama-design/SKILL.md"
        ],
        "clone_cmd": "git clone https://github.com/Appllama/appllama-skills.git",
        "act": "APPLLAMA MCP: Expose mobile component scaffolders and gesture-driven bottom sheet primitives directly to agent context.",
        "repoName": "Appllama/appllama-skills",
        "repoUrl": "https://github.com/Appllama/appllama-skills",
        "lang": "TypeScript",
        "langColor": "#3178c6",
        "requiresApiKey": true,
        "apiKeyName": "APPLAMA_TOKEN",
        "apiKeyHelp": "Enter Appllama auth token or Figma personal access token."
      }
    ],
    "hasApiKey": true
  }
];

// Flat array derived dynamically from REPOS (Zero duplication)
const ALL_SKILLS = REPOS.flatMap(r => r.subskills);

// Subcategory Hierarchical Definitions
const SUBCATEGORIES = {
  frontend: [
    { id: 'all', label: 'All Frontend & Design', getCount: (repos) => repos.filter(r => r.cat === 'design' || r.cat === 'mobile').length },
    { id: 'design', label: 'UI/UX & Motion', getCount: (repos) => repos.filter(r => r.cat === 'design').length },
    { id: 'mobile', label: 'Mobile Native & Appllama', getCount: (repos) => repos.filter(r => r.cat === 'mobile').length }
  ],
  data_media: [
    { id: 'all', label: 'All Data & Media', getCount: (repos) => repos.filter(r => r.cat === 'data' || r.cat === 'media').length },
    { id: 'data', label: 'Data & Knowledge Graphs', getCount: (repos) => repos.filter(r => r.cat === 'data').length },
    { id: 'media', label: 'Generative Media & 3D', getCount: (repos) => repos.filter(r => r.cat === 'media').length }
  ]
};