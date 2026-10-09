---
name: better-icons
description: "Search, retrieve, and embed over 200,000+ SVG icons across 150+ collections directly into React, Vue, HTML, and SVG projects using CLI or MCP tooling."
---

# Better Icons: Icon Discovery & Delivery Skill

> Seamless access to 200,000+ icons from 150+ collections (Lucide, Heroicons, Material, Tabler, Phosphor, Remix, FontAwesome).

Empowers AI coding agents to find, audit, and inject consistent SVG icons into web and mobile projects without context bloat or missing icon placeholders.

---

## 1. Supported Icon Ecosystems

Better Icons indexes 150+ major icon collections:
- **Lucide**: Modern clean line icons (default choice for contemporary web apps).
- **Heroicons**: Tailwind CSS native companion icons (outline & solid).
- **Tabler Icons**: Highly customizable stroke icons with 5,000+ glyphs.
- **Phosphor Icons**: Flexible multi-weight icon system (thin, light, regular, bold, fill, duotone).
- **Remix Icon**: Open-source neutral-style icon system.
- **Material Symbols**: Google's modern adaptive iconography.

---

## 2. CLI & MCP Workflow

### Quick Terminal Lookup
```bash
# Search for icons by semantic query
npx better-icons search arrow --limit 10

# Export raw SVG code directly
npx better-icons get lucide:arrow-right > src/assets/arrow-right.svg

# Search across specific icon set
npx better-icons search "settings" --collection lucide
```

### Direct Component Insertion Patterns

#### React / JSX (Inline SVG)
```jsx
export const ArrowRightIcon = ({ size = 20, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);
```

#### Vanilla HTML / CSS
```html
<svg class="icon icon-star" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
  <!-- Optimized path coordinates -->
</svg>
```

---

## 3. Best Practices for Coding Agents

1. **Keep Single Visual Weight**: Never mix heavy filled icons with thin line icons within the same toolbar or navigation menu. Choose one collection and style variant consistently.
2. **CurrentColor Inheritance**: Always set `stroke="currentColor"` or `fill="currentColor"` so icons inherit text color dynamically across theme toggles (dark/light mode).
3. **Accessibility**: Set `aria-hidden="true"` on decorative icons, or provide `role="img" aria-label="..."` if the icon communicates standalone meaning.
