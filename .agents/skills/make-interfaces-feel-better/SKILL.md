---
name: make-interfaces-feel-better
description: "Microscopic design engineering details that make AI-built interfaces feel polished and human-crafted. Concentric border radius, optical alignment, text-wrap balance, layered shadows, interruptible transitions, and tabular figures."
---

# Make Interfaces Feel Better

> Inspired by Jakub Krehel's design engineering system (`github.com/jakubkrehel/make-interfaces-feel-better`).

Small design details compound into interfaces that feel natural, tactile, and exceptionally polished rather than robotic or rough.

---

## 1. Concentric Border Radius Rule

When nesting rounded containers, never give the inner and outer elements identical border radii. Identical radii create awkward gaps at the corners.

**The Golden Formula**:
```css
outer_radius = inner_radius + padding
/* Or conversely */
inner_radius = outer_radius - padding
```

*Example*:
```css
.card {
  padding: 12px;
  border-radius: 16px;
}
.card-inner-badge {
  border-radius: 4px; /* 16px - 12px = 4px */
}
```
If `inner_radius` calculates to <= 0, use `border-radius: 0` or clamp to `2px`.

---

## 2. Typography Balance & Tabular Figures

### Balanced Headings
Avoid single-word orphan lines ("widows") on multi-line headings:
```css
h1, h2, h3, .heading-balanced {
  text-wrap: balance; /* Distributes words evenly across lines */
}
p {
  text-wrap: pretty;  /* Eliminates single trailing words */
}
```

### Tabular Numbers for Changing Data
Prevent jittering layouts when numbers count up, clock timers tick, or prices fluctuate:
```css
.counter, .timer, .metric-value, .price {
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum";
}
```

---

## 3. Optical vs Geometric Alignment

Mathematical centering frequently looks uncentered to human eyes:
1. **Play Icons inside Circles**: Triangular play buttons have their visual center of mass shifted toward the flat vertical edge. Shift the icon forward along the arrow direction by `8% - 12%` of its width.
2. **Icons with Asymmetric Weight**: Adjust baseline offsets with `translateY(-0.5px)` or `translateY(1px)` to optically align with adjacent text caps.
3. **Pills & Badges with Numbers**: Digits like `1` or `7` have uneven negative space. Check optical horizontal padding rather than relying purely on symmetric padding.

---

## 4. Layered Transparent Shadows vs Harsh Borders

Replace harsh `border: 1px solid #333` with layered subtle shadows that adapt smoothly across dark and light surfaces:
```css
/* Premium elevated card shadow */
box-shadow:
  0 1px 2px 0 rgba(0, 0, 0, 0.05),
  0 4px 6px -1px rgba(0, 0, 0, 0.08),
  inset 0 1px 0 0 rgba(255, 255, 255, 0.08); /* crisp top specular highlight */
```

---

## 5. Interruptible Transitions & Spring Physics

Never use stiff linear transitions. Use interruptible ease-out curves or physics:
```css
/* Natural tactile response */
transition: transform 160ms cubic-bezier(0.16, 1, 0.3, 1),
            opacity 120ms ease-out,
            box-shadow 160ms ease-out;

/* Active click depression */
button:active {
  transform: scale(0.975);
}
```
Ensure animations cancel or smoothly reverse mid-flight if the user moves their cursor or triggers a counter-action.
