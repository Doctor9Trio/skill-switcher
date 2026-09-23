---
name: json-render
description: Vercel Labs generative UI framework emitting strictly validated JSON constrained to predefined component catalogs for zero-XSS, non-hallucinating UI generation.
---

# JSON-Render — Vercel Labs Generative UI Framework

## Overview
**json-render** solves the reliability and security problems of raw AI-generated JSX/HTML. Instead of allowing an LLM to generate arbitrary code (which causes syntax errors, CSS conflicts, and XSS vulnerabilities), json-render restricts the AI to emitting structured, typed JSON schema trees mapped directly to your design system's verified React/HTML components.

## Key Capabilities
- **Strict Catalog Conformance**: The agent only chooses component names and props defined in your schema.
- **Cross-Platform Rendering**: The same JSON tree can be rendered by React, Vue, Svelte, or native mobile views.
- **Zero XSS & Hallucinations**: Because no arbitrary scripts or unvetted tags are emitted, UI generation is 100% deterministic.

## How to Trigger
```markdown
/json-render
"Using the transit component catalog, generate a JSON-render spec for a live shuttle ETA status card."
```

## Activation Rules
When this skill is active:
1. Never emit raw HTML/JSX for dynamic cards; output validated JSON component trees conforming to the catalog schema.
2. Structure output as `{ component: "ComponentName", props: { ... }, children: [ ... ] }`.
3. Validate prop types against the catalog before finalizing output.
