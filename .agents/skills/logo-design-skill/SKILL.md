---
name: logo-design-skill
description: "Discipline identity designer for Claude and AI coding agents. Covers discovery briefs, mark types, geometric construction, optical corrections (overshoot, bone effect, irradiation), 16px pixel test, monochrome/reverse variants, competitor shelf tests, and production-ready SVG generation."
---

# Logo Design Skill for AI Agents

> Based on the disciplined identity design framework by Kaan Kiziltug (`github.com/kaankiziltug/logo-design-skill`).

Turn AI coding agents into disciplined identity designers, from the first brief to production-ready SVG files and brand guidelines. This skill replaces generic AI clip-art with rigorous graphic design discipline.

---

## 1. Core Principles & Design Process

### Phase 1: Discovery & Creative Brief
1. **Brand Essence & Industry Context**: Define brand personality (e.g., precise, playful, industrial, editorial, organic).
2. **Category Mapping**: Identify category conventions and visual cliches to intentionally break or refine them (never copy).
3. **Mark Type Selection**:
   - **Wordmark**: Typographic treatment of name (e.g., Google, Braun, Sony).
   - **Lettermark / Monogram**: Stylized initials (e.g., IBM, HP, Balenciaga).
   - **Pictorial Mark**: Literal recognizable symbol (e.g., Apple, Twitter bird).
   - **Abstract Mark**: Geometric or conceptual visual symbol (e.g., Nike swoosh, Airbnb Bézier).
   - **Mascot / Character**: Illustrated persona (e.g., Duolingo Owl, Mailchimp Freddie).
   - **Emblem**: Encapsulated crest or badge (e.g., Starbucks, Harley Davidson).
   - **Combination Mark**: Integrated symbol + typography.

---

## 2. Geometric Construction & Optical Corrections

Never rely on raw unadjusted geometric math. Human vision perceives shapes with optical illusions that require deliberate corrections:

1. **Overshoot**: Curved shapes (circles, arcs, O's, S's) and pointed shapes (triangles, A's, V's) must extend slightly beyond flat baseline/cap-height lines (typically 1.5% - 3%) to appear optically the same size as flat squares.
2. **The Bone Effect (Weight Distribution)**: Straight horizontal lines optically appear thicker than vertical lines of the exact same stroke width. Reduce horizontal bar stroke width by 5% - 10% relative to vertical stems.
3. **Irradiation (Light on Dark vs Dark on Light)**: White or bright shapes on dark backgrounds optically expand and bleed. When rendering inverted/monochrome reverse marks, reduce stroke weight by ~5% to maintain identical perceived weight.
4. **Optical Centering**: The geometric bounding box center rarely equals visual weight center (e.g., a play triangle inside a circle must be shifted rightwards by ~8-12% of its width).

---

## 3. Mandatory Stress Tests

Before presenting or exporting a mark, run the **Four Quality Locks**:

1. **The 16px Favicon / Squint Test**:
   - Render the mark at 16x16 pixels.
   - If internal counterspaces blur together or details become muddy, simplify geometry and open negative space.
2. **One-Colour Silhouette Test**:
   - Render purely in solid black (`#000000`) on white (`#FFFFFF`) with zero gradients, drop shadows, or color cues.
   - The mark must retain 100% of its recognizable identity.
3. **Reversed Contrast Test**:
   - Render in solid white on dark background. Verify irradiation compensation.
4. **Competitor Shelf Test**:
   - Place the proposed mark in a 3x3 grid alongside 8 leading category competitors.
   - Does it own a unique silhouette, or does it vanish into category conformity?

---

## 4. Production SVG Standards

All generated SVG logos must adhere to strict production constraints:
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none" width="100%" height="100%">
  <!-- Clean Bézier paths with minimal control points -->
  <!-- No inline raster images, no unexpanded text nodes -->
  <!-- Scalable stroke-width and explicit fill rules -->
</svg>
```
- **Vector Cleanliness**: All text elements converted to paths (`<path>`).
- **Precision Coordinates**: Round coordinates to 2 decimal places to minimize file size.
- **Aspect Ratio**: Standard square bounding box `viewBox="0 0 512 512"` or horizontal lockup `viewBox="0 0 800 240"`.
- **Export Formats**: SVG source, monochrome dark, monochrome light, favicon 16/32, apple-touch-icon 180x180, and web manifest assets.
