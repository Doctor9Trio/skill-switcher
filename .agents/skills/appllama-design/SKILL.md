---
name: appllama-design
description: Mobile UX intelligence and app design framework based on 25,000+ top-grossing iOS/Android flows (Finch, Lungy, Calm, Citymapper). Use when designing mobile PWAs, touch gestures, bottom sheets, joyful status states, and breathing micro-interactions for ekaShuttle.
---

# Appllama Mobile Design Skills — ekaShuttle PWA

## Overview

**Appllama** bridges top-tier consumer mobile product patterns with enterprise engineering. Traditional corporate employee apps feel clunky, sterile, and stressful. ekaShuttle uses Appllama's design intelligence to deliver a **consumer-grade, calming, and delightful commute experience**.

Drawing inspiration from award-winning mobile benchmarks:
- **Lungy**: Organic breathing rhythms, fluid physics, and calming micro-feedback.
- **Finch**: Warm, approachable microcopy, companion-like status cues, and zero-anxiety state transitions.
- **Citymapper & Uber**: High-glanceability transit cards, sticky stop progress bars, and tactile gesture-driven bottom sheets.

---

## The 5 Appllama Design Pillars for ekaShuttle

### 1. Organic "Breathing" Status Indicators (Lungy-Inspired)
Employees waiting for a bus feel anxious when a screen is static. Instead of a spinning spinner or blinking dot:
- Use an organic, breathing radial wave (CSS/SVG pulse) around the bus marker on the Leaflet map.
- Timing: Inhale (scale 1.0 to 1.15 over 3s, cubic-bezier(0.4, 0, 0.2, 1)), Exhale (scale 1.15 back to 1.0 over 3s).
- Gives immediate subconscious assurance that the live connection is healthy without consuming battery or CPU.

### 2. Warm, Humanized Transit Copy (Finch-Inspired)
Replace technical telemetry jargon with reassuring, friendly microcopy:
- ❌ *"Route PUNE_1 ETA: 08:42:15 IST (Speed: 38.2 km/h)"*
- ✅ *"Bus 04 is cruising smoothly on Pashan Highway — arriving in ~6 mins! 🚌"*
- ❌ *"Connection lost: Redis stream timeout"*
- ✅ *"Reconnecting to Bus 04... holding your stop in place."*

### 3. Gesture-First Sheet Architecture (Touch-First PWA)
- The bottom sheet contains the route stop timeline and estimated arrival countdowns.
- Supports 3 snap points:
  - **Collapsed (64px)**: Bus number, next stop name, minute countdown, quick toggle.
  - **Mid-Sheet (38vh)**: Active stop list with past stops dimmed and upcoming stops highlighted.
  - **Full-Sheet (85vh)**: Shift selector, route details, driver emergency contact, plant destination.
- Must use velocity-based spring physics (Motion.dev or Framer Motion), never linear CSS transitions.

### 4. Outdoor High-Contrast Daylight Legibility
Employees view ekaShuttle on phone screens in harsh sunlight at outdoor bus stops.
- Minimum WCAG AAA contrast for the countdown timer and bus route badge.
- Heavy typography (Geist or Inter Bold at 36px+ for ETA countdown).
- Solid, distinct route badge chips rather than low-contrast pastel outlines.

### 5. Zero-Friction Stop Selection
- Remembers the user's preferred stop in `localStorage`.
- One-tap toggle to invert direction (Morning Pickup vs. Evening Drop).
- Automatic stop snapping when the bus approaches within the 150m geofence.

---

## How to Trigger & Use Appllama Design Skills

### 1. Slash Command & Prompt Triggers
When prompting Antigravity or spawning subagents for mobile UI work, trigger Appllama like this:

```markdown
/goal Using Appllama MCP & App design skills, design an employee bus arrival card with flows like "Lungy" and friendly personality like "Finch".
```

Or for specific components:
```markdown
"Apply Appllama mobile patterns: build the draggable transit bottom sheet with 3 snap points and spring physics."
```

### 2. Integration with Appllama MCP Server
When the Appllama MCP server is configured in `~/.gemini/antigravity-ide/mcp/`:
- Call `appllama_search_flows` to find top-rated transit and onboarding flows.
- Call `appllama_get_screen_patterns` to extract token structures and layout trees.

---

## Code Recipes

### Breathing Pulse Animation (CSS / Vanilla)
```css
@keyframes lungyBreathe {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.18);
    opacity: 0.3;
  }
  100% {
    transform: scale(1);
    opacity: 0.8;
  }
}

.bus-live-pulse {
  animation: lungyBreathe 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  will-change: transform, opacity;
}
```

### Tactile Status Pill (React / Tailwind)
```tsx
export function FinchTransitStatus({ etaMinutes, busName, status }: TransitStatusProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-emerald-50/90 p-4 border border-emerald-200/60 shadow-sm backdrop-blur-md">
      <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold">
        <span>{etaMinutes}m</span>
        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 bus-live-pulse" />
      </div>
      <div>
        <p className="text-sm font-semibold text-emerald-950">{busName} is on time</p>
        <p className="text-xs text-emerald-700/80">{status}</p>
      </div>
    </div>
  );
}
```
