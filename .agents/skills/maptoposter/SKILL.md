---
name: map-to-poster
description: Generate beautiful map-based poster art using OpenStreetMap data with 20+ themes. Use when creating geographic poster designs, city map art, or location-based print designs.
---

# Map To Poster Skill

## What It Does
Generate high-quality, print-ready map poster images from any city/location using OpenStreetMap data.
The tool is a Python CLI located at: `C:\Users\1000859\Downloads\Eka Shuttle\skill-switcher\.claude-skills\maptoposter\`

## How to Run
```powershell
cd "C:\Users\1000859\Downloads\Eka Shuttle\skill-switcher\.claude-skills\maptoposter"
pip install -r requirements.txt
python create_map_poster.py --city "Mumbai" --theme noir --output output.png
```

## Available Themes (20+)
autumn, blueprint, contrast_zones, copper_patina, emerald, forest, gradient_roads, japanese_ink, midnight_blue, monochrome_blue, neon_cyberpunk, noir, ocean, pastel_dream, sunset, terracotta, warm_beige

## Theme Examples
- **noir** — Black & white dark city map (Tokyo noir, London noir, New York noir)
- **ocean** — Deep blue tones (Amsterdam, Sydney)
- **warm_beige** — Earthy warm palette (Barcelona, Rome)
- **neon_cyberpunk** — Vivid neon on dark (Singapore)
- **japanese_ink** — Minimalist ink brushstroke style (Tokyo)
- **terracotta** — Desert warm earth tones (Marrakech)
- **blueprint** — Technical blueprint style (Venice)
- **midnight_blue** — Navy & silver (Dubai)
- **pastel_dream** — Soft pastels (Paris)

## Parameters
- `--city` — City name (e.g. "Mumbai", "Pune", "Delhi", "Chakan")
- `--theme` — One of the 20+ themes listed above
- `--output` — Output PNG file path
- `--size` — Poster size (default A2)

## Use Cases
- Fleet operation area maps (perfect for EKA Shuttle route posters)
- City identity posters
- Office decor maps
- Client presentation materials
