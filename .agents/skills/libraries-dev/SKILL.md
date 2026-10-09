---
name: libraries-dev
description: "AI interface reactive effects and micro-interaction skill. Equips agents to review code and apply 7 signature UI effects: Border beam, Thinking orbs, Bot avatars, Gooey liquid morphing, Voice audio glow, Metal reflections, and Image pixel-mosaic loaders."
---

# Libraries.dev: AI Reactive Interface Effects

> Inspired by the Libraries.dev agent skill catalog (`libraries.dev`).

Equips AI coding agents with ready-to-wire reactive UI effects and micro-interactions designed to make AI interfaces feel tactile, alive, and responsive.

---

## 1. The 7 Signature Component Patterns

1. **Border Beam**: A soft radiant light beam traveling along the border of cards, active modals, or focused inputs during inference or generation.
2. **Thinking Orbs**: Multi-layered luminous glowing spheres that gently pulse and breathe during background AI generation, replacing boring spinner wheels.
3. **Bot Avatars**: Expressive SVG/Canvas reactive avatars that track state (idle, listening, thinking, speaking, error).
4. **Gooey**: SVG matrix filter morphing fluid blobs together to represent merging data, clusters, or connected thoughts.
5. **Voice Glow**: Real-time microphone audio reactive aura expanding with voice volume input.
6. **Metal Reflections**: Specular sheen and chromatic metallic gradients on high-priority call-to-action buttons.
7. **Image Pixel-to-Mosaic Loader**: Staged image loader resolving coarse mosaic color blocks into high-res photography.

---

## 2. Agent Commands & Workflow

### Command: `libraries review`
The agent inspects the workspace UI components to identify high-impact locations for reactive enhancements:
- AI chat input bars $\rightarrow$ Border beam or Voice glow
- Agent reasoning containers $\rightarrow$ Thinking orbs
- Agent response avatars $\rightarrow$ Dynamic Bot avatar
- Media generation previews $\rightarrow$ Image pixel mosaic

### Command: `libraries apply [effect]`
The agent generates the self-contained CSS and SVG filter tokens and injects the reactive state binding directly into the target component.

---

## 3. Pure CSS / SVG Implementation Patterns

### Border Beam Effect (Zero Heavy Dependencies)
```css
.border-beam-container {
  position: relative;
  overflow: hidden;
  border-radius: inherit;
}

.border-beam-container::after {
  content: '';
  position: absolute;
  inset: -100%;
  background: conic-gradient(
    from 0deg,
    transparent 0deg,
    transparent 280deg,
    rgba(56, 189, 248, 0.8) 320deg,
    rgba(129, 140, 248, 0.8) 360deg
  );
  animation: border-beam-spin 4s linear infinite;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  padding: 1.5px;
  pointer-events: none;
}

@keyframes border-beam-spin {
  100% { transform: rotate(360deg); }
}
```

### SVG Gooey Filter
```html
<svg style="position: absolute; width: 0; height: 0;">
  <defs>
    <filter id="gooey-morph">
      <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
      <feColorMatrix in="blur" mode="matrix" values="
        1 0 0 0 0
        0 1 0 0 0
        0 0 1 0 0
        0 0 0 19 -9" result="goo" />
      <feComposite in="SourceGraphic" in2="goo" operator="atop" />
    </filter>
  </defs>
</svg>
```
Apply via CSS: `filter: url(#gooey-morph);`.
