---
name: antislop
description: "Rules for AI coding agents to prevent the generation of generic slop, filler UI components, redundant boilerplate, and AI-shaped robotic copy. Enforces 38 rules across Hard Gates, Purpose Gates, and Quality Locks."
---

# Anti Slop: Rules for AI Coding Agents

> Inspired by the Anti-Slop specification (`github.com/miqdadbadjuber/antislop`).

A rulebook that stops an AI coding agent from shipping generic UI, filler copy, and AI-shaped code. Anti-Slop is a **filter, not a style guide**: it does not prescribe colors, fonts, or frameworks, but forces every choice to be purposeful, human, and grounded.

---

## The Three Gating Tiers

### Tier 1: Hard Gates (Non-Negotiable)
1. **No Robot Copy**: Never use cliches like *"In today's fast-paced world"*, *"It's not just a tool, it's a revolution"*, *"unlock endless possibilities"*, *"delve into"*, *"seamlessly integrated"*, or *"testament to"*.
2. **No Decor Without Function**: Do not add floating gradient orbs, arbitrary blurred radial backdrops, or spinning borders unless they directly communicate runtime state.
3. **No Unrequested Card Walls**: Avoid defaulting to 3-column generic cards with a centered icon, title, and 2-sentence filler description. Use tailored hierarchy (lists, tables, feeds, side-by-sides).
4. **No Placeholder Comments**: Never leave `// TODO: implement later`, `// Add logic here`, or repetitive comments that restate the code line (e.g. `// increment count: count++`).
5. **No AI Signature Layouts**: Avoid the generic purple/indigo gradient button on a dark background with centered hero text and 3 feature cards unless explicitly requested.

---

### Tier 2: Purpose Gates (Technique with Justification)
1. **Color Token Intent**: Every color must map to a semantic purpose (surface, text-primary, accent, danger, success).
2. **Animation Intent**: Animations must serve spatial continuity, loading state, or direct user feedback—never gratuitous loops.
3. **Typography Intent**: Headings must balance naturally (`text-wrap: balance`), tabular data must use monospace/tabular figures (`font-variant-numeric: tabular-nums`).
4. **Content Realism**: Never populate mockups with "Lorem Ipsum" or fake marketing hyperbole. Use realistic, domain-specific data matching the project's exact domain.

---

### Tier 3: Quality Locks & Delivery Gate
Before declaring any task or component complete, pass the **Delivery Audit**:

- [ ] **Prose Check**: Is the text natural, concise, and active? Would a senior engineer or domain specialist write this?
- [ ] **Interaction Check**: Are hover, focus-visible, active, disabled, and loading states fully styled and accessible?
- [ ] **Responsiveness Check**: Does the layout flex cleanly from 320px mobile up to ultrawide desktops without overflow or clipped text?
- [ ] **Code Hygiene**: Are unused imports, dead CSS classes, and duplicated utility wrappers removed?
