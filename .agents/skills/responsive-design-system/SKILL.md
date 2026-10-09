---
name: responsive-design-system
description: Comprehensive responsive design system, typography tokens, component dimension matrix, and stacking context guidelines across all media query breakpoints (Desktop, Laptop, Tablet, Mobile).
---

# Responsive Design System & Typography Guidelines

This skill documents the enterprise responsive design system, typography tokens, component dimensions, and z-index hierarchy established for dashboard applications. Use this specification to maintain visual consistency, readable information density, and rock-solid stacking contexts across all screen sizes.

---

## 1. Breakpoint Hierarchy

| Breakpoint Tier | Media Query | Target Devices | Layout Behavior |
| :--- | :--- | :--- | :--- |
| **Desktop Ultra/Full** | `> 1440px` | 27"–32" 4K/QHD Monitors, Large Desktops | 2-column split layout, expansive KPI cards, full data tables |
| **Desktop Standard** | `max-width: 1440px` | 14"–16" Laptops, Standard 1080p Desktops | Snug 2-column layout, compact headers, single-line filters |
| **Tablet Landscape** | `max-width: 1280px` | iPad Pro 12.9" Landscape, Small Laptops | Flexible columns, horizontal scrolling KPI strips, condensed paddings |
| **Tablet Portrait** | `max-width: 1024px` | iPad / iPad Air / Tablets Portrait | Transition toward stacked order, inline map preview, condensed table |
| **Mobile Stacked** | `max-width: 768px` | iPhone, Android, Foldables (< 768px) | Fully vertical stacked column (`order: 1` through `order: 8`), micro tokens, modal bottom sheets |

---

## 2. Component Typography & Dimension Matrix

### A. Top Header & Fleet Status Counters

The fleet counters strip must never wrap or push controls to multiple lines; it uses pill badges with horizontal touch scrolling on mobile.

| Element | Desktop (`> 1440px`) | Laptop (`1280px–1440px`) | Tablet (`768px–1280px`) | Mobile (`<= 768px`) |
| :--- | :--- | :--- | :--- | :--- |
| **Dashboard Title** | `1.5rem` (24px) / Bold | `1.4rem` (22.4px) | `1.3rem` (20.8px) | `1.2rem` (19.2px) |
| **Pill Container Height** | `38px` | `36px` | `34px` | `32px` |
| **Status Label** | `12px` / 500 weight | `11px` / 500 weight | `10.5px` / 500 weight | `10px` / 500 weight |
| **Status Value (Number)** | `14px` / 700 weight | `13px` / 700 weight | `12px` / 700 weight | `11px` / 700 weight |
| **Status Indicator Dot** | `8px × 8px` | `7.5px × 7.5px` | `7px × 7px` | `6.5px × 6.5px` |
| **Pill Internal Padding** | `4px 10px` | `3px 8px` | `2.5px 7px` | `2px 6px` |

---

### B. Single-Line Search & Control Bar

On viewports $\le 768\text{px}$, controls are strictly contained on a single flex row (`flex-wrap: nowrap`, gap `6px`) to conserve vertical screen space.

| Element | Desktop (`> 1440px`) | Laptop (`1280px–1440px`) | Tablet (`768px–1280px`) | Mobile (`<= 768px`) |
| :--- | :--- | :--- | :--- | :--- |
| **Toggle (`Platform \| Fleet`) Height** | `38px` | `36px` | `34px` | `34px` |
| **Toggle Button Font Size** | `12px` / 600 weight | `11.5px` / 600 weight | `11px` / 600 weight | `11px` / 600 weight |
| **Search Input Height** | `38px` | `36px` | `34px` | `32px`–`34px` |
| **Search Placeholder / Font Size** | `13px` / Regular | `12.5px` | `12px` | `11.5px` |
| **Search Icon Size** | `19px` | `18px` | `17px` | `16px` |
| **Circular Action Buttons (Refresh/Filter)**| `38px × 38px` | `36px × 36px` | `34px × 34px` | `34px × 34px` |
| **Circular Action Button Icons** | `22px` | `20px` | `18px` | `17px` |

---

### C. Advanced Filters Popover & Dropdown Select

Floating dropdowns must never cover other sections due to stacking issues or take up unnecessary vertical height on small screens.

| Element | Desktop (`> 1440px`) | Laptop (`1280px–1440px`) | Mobile (`<= 768px`) |
| :--- | :--- | :--- | :--- |
| **Popover Width** | `320px` | `300px` | `min(270px, calc(100vw - 20px))` |
| **Popover Padding** | `16px` (spacing-md) | `12px` | `8px` |
| **Popover Gap** | `10px` | `8px` | `6px` |
| **Dropdown Trigger Button Height** | `34px` | `32px` | `28px` |
| **Dropdown Trigger Label Font** | `0.82rem` (13.1px) / 500 | `12px` / 600 | `11px` / 600 |
| **Dropdown Trigger Chevron** | `16px × 16px` | `14px × 14px` | `12px × 12px` |
| **Panel Actions (*Select all / Clear*)** | `0.75rem` (12px) / 600 | `11px` / 600 | `10px` / 600 |
| **Panel Search Input Height / Font** | `28px` / `0.85rem` (13.6px) | `26px` / `12px` | `22px` / `11px` |
| **Panel Item Row Height** | `36px` (`padding: 7px 12px`) | `32px` (`padding: 6px 10px`) | `25px` (`padding: 4px 8px`) |
| **Panel Item Label Font** | `0.8rem` (12.8px) | `12px` | `11px` |
| **Checkbox Square** | `14px × 14px` | `13px × 13px` | `12px × 12px` |
| **List Max Height** | `250px` | `200px` | `150px` |

---

### D. KPI Summary Cards

| Property | Desktop (`> 1440px`) | Tablet (`768px–1280px`) | Mobile (`<= 768px`) |
| :--- | :--- | :--- | :--- |
| **Card Height** | `96px`–`110px` | `84px` | `76px` |
| **Card Padding** | `16px` | `12px` | `10px 12px` |
| **KPI Primary Value** | `24px` / 800 weight | `20px` / 800 weight | `16px` / 800 weight |
| **KPI Label Title** | `13px` / 600 weight | `12px` / 500 weight | `11px` / 500 weight |
| **Delta / Trend Subtext** | `11px` | `10.5px` | Hidden (`display: none`) to prevent overflow |

---

### E. Vehicle by Type / Model Cards

| Property | Desktop (`> 1440px`) | Tablet (`768px–1280px`) | Mobile (`<= 768px`) |
| :--- | :--- | :--- | :--- |
| **Card Dimensions** | `210px × 150px` | `190px × 140px` | `178px × 134px` |
| **Model Count Number** | `28px` / 800 weight | `26px` / 800 weight | `24px` / 800 weight |
| **Model Subtitle Label** | `12px` / 500 weight | `11px` / 500 weight | `10.5px` / 500 weight |
| **Pill Badge Tag** | `12px` / 600 weight | `11.5px` | `11px` / 600 weight |

---

### F. Table & Pagination Footer

| Property | Desktop (`> 1440px`) | Tablet (`768px–1280px`) | Mobile (`<= 768px`) |
| :--- | :--- | :--- | :--- |
| **Header Cell Text (`th`)** | `13px` / 600 weight | `12px` / 600 weight | `11px` / 600 weight |
| **Body Cell Text (`td`)** | `13px` / Regular | `12px` / Regular | `11.5px` / Regular |
| **Pagination Footer Layout** | Single horizontal bar | Single horizontal bar | Stacked 2-line layout |
| **Pagination Button Size** | `32px × 32px` | `30px × 30px` | `28px × 28px` |
| **Pagination Numbers Font** | `13px` | `12px` | `11px` |
| **"Showing X of Y" Text** | `13px` | `12px` | `11px` |
| **Rows per Page Trigger** | `32px` height / `13px` font | `30px` height / `12px` font | `26px` height / `11px` font |

---

### G. Mobile Filter Sheet Modal

| Property | Value | Rationale |
| :--- | :--- | :--- |
| **Window Max Height** | `85vh` | Leaves top context visible; comfortable thumb reach |
| **Window Border Radius** | `20px 20px 0 0` | Native iOS/Android bottom-sheet affordance |
| **Modal Header Title** | `16px` / 700 weight | Clear hierarchy for the sheet |
| **Group Section Labels** | `12px` / 700 weight | Uppercase, muted, legible tracking |
| **Dropdown Select Inputs** | `38px` height / `13px` font | Easy touch targets, native `<select>` chevron |
| **Filter Status Chips** | `30px` height / `12px` font | Instant tap toggles with active contrast |
| **Footer Padding** | `14px 20px 60px` | **Crucial:** Clears device home navigation bars & swipe bars |

---

## 3. Z-Index & Stacking Context Rulebook

To prevent overlapping defects (such as tables or sticky cards painting over dropdowns):

```
┌─────────────────────────────────────────────────────────────┐
│ 100,000+: Fullscreen Map / Interactive Overlays             │
├─────────────────────────────────────────────────────────────┤
│ 99,999:  Portaled Dropdown Panels (document.body children)  │
├─────────────────────────────────────────────────────────────┤
│ 10,000:  Modal Sheets & Bottom Overlays                     │
├─────────────────────────────────────────────────────────────┤
│ 1,002:   Advanced Filters Popover Card                      │
├─────────────────────────────────────────────────────────────┤
│ 1,001:   Filter Action Button Container                     │
├─────────────────────────────────────────────────────────────┤
│ 1,000:   Layout Header Stacking Anchor                      │
├─────────────────────────────────────────────────────────────┤
│ 500:     Topnav Bar & Main Nav Controls                     │
├─────────────────────────────────────────────────────────────┤
│ 10:      Sticky Table Headers & Pagination Footers          │
├─────────────────────────────────────────────────────────────┤
│ 1:       Standard Grid Cards, KPI Containers, Table Roots   │
├─────────────────────────────────────────────────────────────┤
│ 0:       Base Background Layers                             │
└─────────────────────────────────────────────────────────────┘
```

### Golden Rule for Stacking Context
> **Always establish an explicit stacking context on parent headers.**
> An absolutely positioned popover with `z-index: 9999` will still be covered by a sibling table with `position: relative` if their shared parent container does not have an explicit `position: relative` and high `z-index`.

```css
/* CORRECT: Parent has explicit stacking anchor */
.layout-header {
  position: relative !important;
  z-index: 1000 !important;
}

.vsl-filter-popup-container {
  position: relative !important;
  z-index: 1001 !important;
}

.vsl-advanced-filters-popover {
  position: absolute !important;
  z-index: 1002 !important;
}

.layout-right-stats {
  position: relative !important;
  z-index: 1 !important;
}
```

---

## 4. Reusable Responsive CSS Snippet

```css
/* ==========================================================================
   MOBILE RESPONSIVE SYSTEM (<= 768px)
   ========================================================================== */

@media screen and (max-width: 768px) {
  /* 1. Header Anchor */
  .layout-header {
    position: relative !important;
    z-index: 1000 !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 10px !important;
    width: 100% !important;
  }

  /* 2. Top Fleet Counters */
  .header-fleet-counters {
    display: flex !important;
    overflow-x: auto !important;
    scrollbar-width: none !important;
    height: 32px !important;
  }
  .header-fleet-counters .status-label {
    font-size: 10px !important;
  }
  .header-fleet-counters .status-value {
    font-size: 11px !important;
    font-weight: 700 !important;
  }

  /* 3. Single-line Search & Controls */
  .vsl-single-line-controls {
    display: flex !important;
    flex-wrap: nowrap !important;
    align-items: center !important;
    gap: 6px !important;
    width: 100% !important;
  }
  .vsl-view-toggle { height: 34px !important; }
  .vsl-view-toggle-btn { font-size: 11px !important; padding: 0 7px !important; }
  .vsl-search-container { height: 34px !important; }
  .vsl-search-input { height: 32px !important; font-size: 11.5px !important; }
  .vsl-circular-filter-btn { width: 34px !important; height: 34px !important; }
  .vsl-circular-filter-btn svg { width: 17px !important; height: 17px !important; }

  /* 4. Filter Popover & Dropdowns */
  .vsl-filter-popup-container {
    position: relative !important;
    z-index: 1001 !important;
  }
  .vsl-advanced-filters-popover {
    position: absolute !important;
    z-index: 1002 !important;
    width: min(270px, calc(100vw - 20px)) !important;
    padding: 8px !important;
    gap: 6px !important;
    border-radius: 10px !important;
    right: 0 !important;
    max-height: 80vh !important;
    overflow-y: auto !important;
  }

  .custom-dropdown-trigger {
    min-height: 28px !important;
    height: 28px !important;
    padding: 3px 8px !important;
    font-size: 11px !important;
    border-radius: 6px !important;
  }
  .custom-dropdown-panel {
    z-index: 99999 !important;
    border-radius: 8px !important;
  }
  .custom-dropdown-item {
    padding: 4px 8px !important;
    font-size: 11px !important;
    min-height: 25px !important;
  }
  .custom-checkbox-box {
    width: 12px !important;
    height: 12px !important;
  }

  /* 5. Subordinate Table Stacking */
  .layout-right-stats {
    position: relative !important;
    z-index: 1 !important;
  }

  /* 6. Modal Footer Padding Safe Area */
  .mobile-filter-sheet-footer {
    padding: 14px 20px 60px !important;
  }
}
```
