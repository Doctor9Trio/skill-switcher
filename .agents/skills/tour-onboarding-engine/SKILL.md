---
name: tour-onboarding-engine
description: "Unified user onboarding and product tour engine pattern for AI agents. Bridges Intro.js (vanilla JS), Reactour (React), and Onborda (Next.js & Framer Motion) for step-by-step element spotlighting, interactive guides, and feature discovery."
---

# Tour & Onboarding Engine

> Unified product walkthrough patterns based on Intro.js (`introjs.com`), Reactour (`reactour.vercel.app`), and Onborda (`onborda.dev`).

Equips AI agents to build guided step-by-step product tours, element spotlights, and user onboarding walkthroughs with zero cognitive friction.

---

## 1. Engine Selector Matrix

| Library | Best For | Tech Stack | Bundle Size |
| :--- | :--- | :--- | :--- |
| **Intro.js** | Pure HTML/JS, server-rendered apps, dashboards | Vanilla JS / any framework | ~10 KB (gzipped) |
| **Reactour** | React Single-Page Applications | React / React-DOM | ~14 KB (gzipped) |
| **Onborda** | Modern Next.js apps with Framer Motion & Tailwind | Next.js 14/15, Tailwind, Framer Motion | ~8 KB (tree-shakeable) |

---

## 2. Implementation Blueprints

### Blueprint A: Next.js + Onborda + Framer Motion
```bash
pnpm add onborda framer-motion
```
```tsx
// tour-steps.ts
export const onboardingSteps = [
  {
    icon: "🚀",
    title: "Welcome to Skills Switcher",
    content: "Instantly switch active skill sets between production and development.",
    selector: "#skills-grid",
    side: "top",
    showControls: true,
  },
  {
    icon: "🔍",
    title: "The Shelf Discovery Library",
    content: "Search 500+ curated design systems, repos, and AI tools with deep notes.",
    selector: "#nav-shelf",
    side: "bottom",
  }
];
```

### Blueprint B: Reactour Component Walkthrough
```bash
npm install @reactour/tour
```
```tsx
import { TourProvider, useTour } from '@reactour/tour';

const steps = [
  {
    selector: '[data-tour="search-input"]',
    content: 'Filter skills and discoveries across all categories in real time.',
  },
  {
    selector: '[data-tour="preset-bar"]',
    content: 'One-click switch to curated agent bundles like Antislop, Frontend, or Fullstack.',
  }
];

export function AppTourWrapper({ children }) {
  return (
    <TourProvider steps={steps} badgeContent={({ currentStep, totalSteps }) => `${currentStep + 1}/${totalSteps}`}>
      {children}
    </TourProvider>
  );
}
```

### Blueprint C: Intro.js Lightweight Vanilla Tour
```bash
npm install intro.js
```
```javascript
import introJs from 'intro.js';
import 'intro.js/introjs.css';

export function startProductTour() {
  introJs()
    .setOptions({
      steps: [
        { element: document.querySelector('.repo-card'), intro: 'Click to toggle active skills in your agent.' },
        { element: document.querySelector('#export-btn'), intro: 'Export active skills configuration to disk.' }
      ],
      showProgress: true,
      showBullets: true,
      exitOnOverlayClick: true
    })
    .start();
}
```

---

## 3. Onboarding UX Best Practices

1. **Keep Tours Under 4 Steps**: Long multi-step tours have an 80%+ drop-off rate. Highlight only the core "Aha!" moments.
2. **Always Allow Dismissal**: Provide clear "Skip tour" / "Got it" actions at every single step.
3. **Persist Completion**: Save tour completion state to `localStorage` (`has_completed_tour_v1`) so users are never interrupted again unless they manually trigger the help guide.
