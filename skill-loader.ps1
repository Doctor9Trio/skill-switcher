# ============================================================
#  EKA Mobility — Skill Loader Interactive Terminal
#  Usage: .\skill-loader.ps1
# ============================================================

$HOST.UI.RawUI.WindowTitle = "EKA Skill Loader"
$root = Split-Path $PSScriptRoot -Parent

# --- ANSI Colors -------------------------------------------
$ESC = [char]27
function c($code, $text) { "$ESC[${code}m$text$ESC[0m" }
function Green($t)  { c "92" $t }
function Cyan($t)   { c "96" $t }
function Yellow($t) { c "93" $t }
function Magenta($t){ c "95" $t }
function Red($t)    { c "91" $t }
function Blue($t)   { c "94" $t }
function White($t)  { c "97" $t }
function Dim($t)    { c "2"  $t }
function Bold($t)   { c "1"  $t }
function BgBlue($t) { c "44;97" $t }

# --- Skill Definitions -------------------------------------
$SKILLS = @{
    "1" = @{
        Name  = "ANIMATION"
        Emoji = "[ANIM]"
        Color = "Cyan"
        Desc  = "Motion.dev + Emil Kowalski animation philosophy"
        Tags  = "motion, hover, transitions, spring physics, scroll reveal"
        Files = @(
            ".claude-skills/motion-dev-animations-skill/SKILL.md"
            ".claude-skills/emilkowalski-skills/skills/animate/SKILL.md"
            ".claude-skills/emilkowalski-skills/skills/improve-animations/SKILL.md"
            ".claude-skills/emilkowalski-skills/skills/find-animation-opportunities/SKILL.md"
            ".claude-skills/emilkowalski-skills/skills/animation-vocabulary/SKILL.md"
            ".claude-skills/gsap-skills/skills/gsap-core/SKILL.md"
        )
        Activation = @"
ANIMATION SKILLS LOADED
========================
Motion.dev v11+ expert mode active.
Emil Kowalski animation philosophy:
  - No ease-in on UI elements (use ease-out or custom curve)
  - Never scale(0) on entrance (use scale 0.95 + opacity 0)
  - No transition: all (name exact properties)
  - GPU-only: transform and opacity only
  - All UI animations under 300ms
  - Always include prefers-reduced-motion fallback
  - Gate every animation: Frequency > Purpose > Speed > Function
  - 60fps target, CLS = 0
Motion.dev patterns: whileHover, whileInView, AnimatePresence, useSpring
GSAP core patterns also loaded as fallback.
"@
    }
    "2" = @{
        Name  = "GSAP"
        Emoji = "[GSAP]"
        Color = "Green"
        Desc  = "Full GSAP suite: core, ScrollTrigger, React, Timeline"
        Tags  = "gsap, scrolltrigger, timeline, animations, webflow"
        Files = @(
            ".claude-skills/gsap-skills/skills/gsap-core/SKILL.md"
            ".claude-skills/gsap-skills/skills/gsap-scrolltrigger/SKILL.md"
            ".claude-skills/gsap-skills/skills/gsap-timeline/SKILL.md"
            ".claude-skills/gsap-skills/skills/gsap-react/SKILL.md"
            ".claude-skills/gsap-skills/skills/gsap-plugins/SKILL.md"
            ".claude-skills/gsap-skills/skills/gsap-performance/SKILL.md"
            ".claude-skills/gsap-skills/skills/gsap-utils/SKILL.md"
            ".claude-skills/gsap-skills/skills/gsap-frameworks/SKILL.md"
        )
        Activation = @"
GSAP SKILLS LOADED
===================
Full GSAP suite active (8 skill files loaded):
  gsap-core        - gsap.to(), from(), fromTo(), stagger, easing
  gsap-scrolltrigger - Scroll-linked animations, pinning, scrub
  gsap-timeline    - Sequencing, labels, callbacks, nesting
  gsap-react       - useGSAP() hook, @gsap/react, cleanup
  gsap-plugins     - Flip, Draggable, SplitText, MorphSVG
  gsap-performance - GPU, will-change, profiling, optimization
  gsap-utils       - clamp, mapRange, interpolate, unitize
  gsap-frameworks  - Vue, Svelte, Astro, vanilla JS patterns
Key patterns:
  - Use useGSAP() + @gsap/react in React (not useEffect)
  - Register plugins once: gsap.registerPlugin(ScrollTrigger)
  - FLIP for layout animations
  - gsap.matchMedia() for responsive + reduced-motion
"@
    }
    "3" = @{
        Name  = "UI DESIGN"
        Emoji = "[UI]"
        Color = "Magenta"
        Desc  = "Impeccable + taste + Apple design principles"
        Tags  = "ui, design, polish, components, visual quality"
        Files = @(
            ".claude-skills/impeccable/.agent/skills/impeccable/SKILL.md"
            ".claude-skills/taste-skill/skills/taste-skill/SKILL.md"
            ".claude-skills/taste-skill/skills/minimalist-skill/SKILL.md"
            ".claude-skills/emilkowalski-skills/skills/apple-design/SKILL.md"
            ".claude-skills/emilkowalski-skills/skills/emil-design-eng/SKILL.md"
            ".claude-skills/taste-skill/skills/redesign-skill/SKILL.md"
        )
        Activation = @"
UI DESIGN SKILLS LOADED
========================
Impeccable design commands active:
  craft, shape, init, document, extract,
  critique, audit, polish, bolder, quieter,
  distill, harden, animate, colorize, typeset,
  layout, delight, overdrive, clarify, adapt
Emil Kowalski taste philosophy:
  - Unseen details compound into something stunning
  - Beauty is leverage and a real differentiator
  - Taste is trained, not innate
Apple 8 design principles:
  Purpose, Agency, Responsibility, Familiarity,
  Flexibility, Simplicity, Craft, Delight
Minimalist premium UI:
  - Warm monochrome palette, editorial serifs
  - Generous whitespace, bento grid layouts
  - No generic AI patterns (no Inter, no pill shapes,
    no AI-purple gradient, no three equal card rows)
Redesign audit: typography, color, layout, component checks.
"@
    }
    "4" = @{
        Name  = "IMAGEGEN"
        Emoji = "[IMG]"
        Color = "Yellow"
        Desc  = "AWWWARDS-level frontend design image generation"
        Tags  = "imagegen, design reference, sections, mockups, frontend images"
        Files = @(
            ".claude-skills/taste-skill/skills/imagegen-frontend-web/SKILL.md"
            ".claude-skills/taste-skill/skills/imagegen-frontend-mobile/SKILL.md"
            ".claude-skills/taste-skill/skills/image-to-code-skill/SKILL.md"
        )
        Activation = @"
IMAGEGEN SKILLS LOADED
=======================
Elite frontend image art direction active.
HARD RULES:
  - ONE image per section, always, no exceptions
  - 6 sections requested = 6 separate images
  - Never compress multiple sections into one image
  - Avoid left-text/right-image hero (most overused AI pattern)
Hero composition alternatives: centered-over-bg, bottom-left,
  stacked-center, image-as-canvas, off-grid editorial, mini-minimalist
Quality target: AWWWARDS-level, implementation-faithful.
Image-to-code: match spacing, typography hierarchy, and component
  structure precisely so developers can rebuild from the reference.
"@
    }
    "5" = @{
        Name  = "BRUTALIST"
        Emoji = "[BRUT]"
        Color = "Red"
        Desc  = "Industrial + tactical telemetry UI aesthetic"
        Tags  = "brutalist, industrial, terminal, data-heavy, dashboard, CRT"
        Files = @(
            ".claude-skills/taste-skill/skills/brutalist-skill/SKILL.md"
        )
        Activation = @"
BRUTALIST UI SKILLS LOADED
===========================
Industrial Brutalism + Tactical Telemetry mode active.
Pick ONE archetype per project (never mix):
  Swiss Industrial Print:
    - High-contrast light mode, newsprint substrate
    - Monolithic heavy sans-serif typography
    - Visible structural grid lines
    - Aggressive asymmetric negative space
    - Heavy primary red as alert/accent
  Tactical Telemetry / CRT Terminal:
    - Dark mode only
    - High-density tabular data
    - Monospace typography dominance
    - ASCII framing devices, crosshairs
    - Phosphor glow, scanline simulation
Typography rules: fluid scale clamp(4rem, 10vw, 15rem),
  negative tracking -0.03em to -0.06em, 0.85-0.95 line-height.
BANNED: gradients, soft shadows, modern translucency, rounded pills.
"@
    }
    "6" = @{
        Name  = "VIDEO GEN"
        Emoji = "[VID]"
        Color = "Blue"
        Desc  = "Seedance 2.0 + Higgsfield AI video prompting"
        Tags  = "video, ai video, seedance, higgsfield, prompts, generation"
        Files = @(
            ".claude-skills/seedance2-skill/SKILL.md"
            ".claude-skills/higgsfield-ai-skills/higgsfield-generate/SKILL.md"
        )
        Activation = @"
VIDEO GEN SKILLS LOADED
========================
Seedance 2.0 expert prompt engineering active.
10 scenario types:
  1. Character consistency (face/body reference with @Image)
  2. Camera control (orbit, tracking, crane, handheld)
  3. Video extension (extend forward/backward with @Video)
  4. Long-take / one-take (no cuts, continuous tracking)
  5. Music beat-matching (sync visual rhythm to @Video audio)
  6. Dialogue + voice acting (character speech direction)
  7. Video editing (modify existing @Video elements)
  8. E-commerce product showcase (rotate, deconstruct, reassemble)
  9. Science/educational visualization
  10. Short drama (time-segmented action with dialogue)
Constraints: max 12 files, no real human faces, duration limits.
Higgsfield Generate CLI: GPT Image 2, Seedance 2.0, Nano Banana,
  Marketing Studio, Virality Predictor.
"@
    }
    "7" = @{
        Name  = "BRAND"
        Emoji = "[BRND]"
        Color = "Magenta"
        Desc  = "Full brand identity + Higgsfield brandbook pipeline"
        Tags  = "brand, identity, logo, brandbook, colors, visual system"
        Files = @(
            ".claude-skills/higgsfield-ai-skills/higgsfield-brandkit/SKILL.md"
            ".claude-skills/taste-skill/skills/brandkit/SKILL.md"
            ".claude-skills/higgsfield-ai-skills/higgsfield-soul-id/SKILL.md"
        )
        Activation = @"
BRAND SKILLS LOADED
====================
Higgsfield Brandkit pipeline active:
  palettes > SVG logo marks > typography > mockups
  > social graphics > packaging > signage > merchandise
  > posters > PPTX brandbooks > PDF brandbooks
Brand workflow stages:
  1. Brand audit (existing assets as fixed constraints)
  2. Palette generation + approval
  3. Logo mark generation (recraft_v4_1, seedream_v5_pro)
  4. Typography system selection
  5. Mockup + application generation
  6. Brandbook compilation (PPTX/PDF)
Soul ID: face/identity consistency across generated visuals.
State persisted in brandkit/state.json between sessions.
"@
    }
    "8" = @{
        Name  = "REVIEW"
        Emoji = "[REV]"
        Color = "Yellow"
        Desc  = "Animation audit + UI quality review specialist"
        Tags  = "review, audit, animation quality, code review, ux"
        Files = @(
            ".claude-skills/emilkowalski-skills/skills/improve-animations/SKILL.md"
            ".claude-skills/emilkowalski-skills/skills/find-animation-opportunities/SKILL.md"
            ".claude-skills/emilkowalski-skills/skills/emit-design-eng/SKILL.md"
        )
        Activation = @"
REVIEW SKILLS LOADED
=====================
Animation audit specialist active.
Audit workflow: Recon > Parallel audit > Vet > Prioritize > Plans
8 audit categories:
  1. Purpose + Frequency (keyboard actions must NEVER animate)
  2. Easing + Duration (no ease-in, UI under 300ms)
  3. Physicality + Origin (transform-origin at trigger, not center)
  4. Interruptibility (transitions not keyframes for rapid triggers)
  5. Performance (GPU-only: transform/opacity, no width/height)
  6. Accessibility (prefers-reduced-motion, pointer gating)
  7. Cohesion + Tokens (single easing vocabulary, no parallel systems)
  8. Missed Opportunities (state changes that teleport, no feedback)
Output format: findings table with file:line evidence + severity.
Severity: HIGH (feel-breaking) / MEDIUM (noticeably off) / LOW (polish).
Self-contained executor-ready plans in plans/ directory.
"@
    }
    "9" = @{
        Name  = "JEV DECISION"
        Emoji = "[JEV]"
        Color = "Green"
        Desc  = "System One rapid decision primitives, gating & Canny referee"
        Tags  = "system-one, gating, canny, compaction, telemetry-checks"
        Files = @(
            ".agents/skills/jev-decision/SKILL.md"
            ".agents/skills/typesafe-mcp/SKILL.md"
            ".agents/skills/fast-jev-compaction/SKILL.md"
            ".agents/skills/json-render/SKILL.md"
            ".agents/skills/canny-verifier/SKILL.md"
            ".agents/skills/jev-review/SKILL.md"
            ".agents/skills/winnow/SKILL.md"
            ".agents/skills/blink/SKILL.md"
            ".agents/skills/semdecide/SKILL.md"
            ".agents/skills/jev-codex-router/SKILL.md"
            ".agents/skills/jev-ultrafast/SKILL.md"
            ".agents/skills/killmyidea/SKILL.md"
            ".agents/skills/jev-mcp/SKILL.md"
            ".agents/skills/agent-desktop/SKILL.md"
            ".agents/skills/typesafe-mario/SKILL.md"
            ".agents/skills/jev-drone/SKILL.md"
            ".agents/skills/onevonejev/SKILL.md"
            ".agents/skills/jev-trader/SKILL.md"
            ".agents/skills/prism/SKILL.md"
            ".agents/skills/neo4jev/SKILL.md"
            ".agents/skills/jev-curate/SKILL.md"
            ".agents/skills/awesome-jev/SKILL.md"
            "docs/skills/JEV_AND_APLLAMA_SKILLS_REFERENCE.md"
        )
        Activation = @"
JEV SYSTEM ONE DECISION ACTIVE
===============================
System One decision primitives active:
  Gate(condition, rule) -> Binary pass/fail enforcement
  Choice(options, criteria) -> Deterministic selection
  Score(target, rubrics) -> Multi-criteria ranking
Canny Verifier:
  - Guardrail checking against read-only core apps
  - Zero sensitive telematics leakage (lat/lon only)
  - Diff verification before marking tasks complete
Fast compaction and telemetry noise filtering enabled.
"@
    }
    "10" = @{
        Name  = "APPLLAMA DESIGN"
        Emoji = "[APPL]"
        Color = "Magenta"
        Desc  = "Mobile UX intelligence based on 25k+ top apps (Finch, Lungy)"
        Tags  = "mobile-ux, finch-copy, lungy-pulse, bottom-sheets, transit"
        Files = @(
            ".agents/skills/appllama-design/SKILL.md"
            "design/DESIGN_SYSTEM.md"
        )
        Activation = @"
APPLLAMA MOBILE DESIGN ACTIVE
==============================
Consumer-grade transit mobile UX loaded:
  - Lungy-style organic breathing status pulse
  - Finch-style warm, anxiety-reducing commute notices
  - Tactile velocity-based bottom sheet (3 snap points)
  - High-contrast outdoor daylight legibility
  - Frictionless stop selection and route toggle
"@
    }
    "11" = @{
        Name  = "FULL STACK"
        Emoji = "[ALL]"
        Color = "Cyan"
        Desc  = "Load ALL skills - complete design, engineering & JEV suite"
        Tags  = "everything, all skills, full context"
        Files = @(
            ".claude-skills/motion-dev-animations-skill/SKILL.md"
            ".claude-skills/emilkowalski-skills/skills/animate/SKILL.md"
            ".claude-skills/emilkowalski-skills/skills/improve-animations/SKILL.md"
            ".claude-skills/emilkowalski-skills/skills/find-animation-opportunities/SKILL.md"
            ".claude-skills/emilkowalski-skills/skills/animation-vocabulary/SKILL.md"
            ".claude-skills/emilkowalski-skills/skills/apple-design/SKILL.md"
            ".claude-skills/emilkowalski-skills/skills/emil-design-eng/SKILL.md"
            ".claude-skills/gsap-skills/skills/gsap-core/SKILL.md"
            ".claude-skills/gsap-skills/skills/gsap-scrolltrigger/SKILL.md"
            ".claude-skills/gsap-skills/skills/gsap-timeline/SKILL.md"
            ".claude-skills/gsap-skills/skills/gsap-react/SKILL.md"
            ".claude-skills/gsap-skills/skills/gsap-plugins/SKILL.md"
            ".claude-skills/gsap-skills/skills/gsap-performance/SKILL.md"
            ".claude-skills/gsap-skills/skills/gsap-utils/SKILL.md"
            ".claude-skills/gsap-skills/skills/gsap-frameworks/SKILL.md"
            ".claude-skills/impeccable/.agent/skills/impeccable/SKILL.md"
            ".claude-skills/taste-skill/skills/taste-skill/SKILL.md"
            ".claude-skills/taste-skill/skills/minimalist-skill/SKILL.md"
            ".claude-skills/taste-skill/skills/redesign-skill/SKILL.md"
            ".claude-skills/taste-skill/skills/imagegen-frontend-web/SKILL.md"
            ".claude-skills/taste-skill/skills/imagegen-frontend-mobile/SKILL.md"
            ".claude-skills/taste-skill/skills/image-to-code-skill/SKILL.md"
            ".claude-skills/taste-skill/skills/brutalist-skill/SKILL.md"
            ".claude-skills/taste-skill/skills/brandkit/SKILL.md"
            ".claude-skills/seedance2-skill/SKILL.md"
            ".claude-skills/higgsfield-ai-skills/higgsfield-generate/SKILL.md"
            ".claude-skills/higgsfield-ai-skills/higgsfield-brandkit/SKILL.md"
            ".claude-skills/higgsfield-ai-skills/higgsfield-soul-id/SKILL.md"
            ".agents/skills/jev-decision/SKILL.md"
            ".agents/skills/canny-verifier/SKILL.md"
            ".agents/skills/appllama-design/SKILL.md"
        )
        Activation = @"
ALL SKILLS LOADED - FULL STACK SUITE
=====================================
Complete skill suite active across all 11 domains:
  [ANIM]  Animation    - Motion.dev + Emil Kowalski philosophy
  [GSAP]  GSAP Suite   - 8 skill files (core/scroll/timeline/react)
  [UI]    UI Design    - Impeccable + taste + Apple principles
  [IMG]   Imagegen     - AWWWARDS-level section image generation
  [BRUT]  Brutalist    - Industrial/CRT terminal UI
  [VID]   Video Gen    - Seedance 2.0 + Higgsfield
  [BRND]  Brand        - Full brand identity pipeline
  [REV]   Review       - 8-category animation audit
  [JEV]   JEV System 1 - Decision gating, Canny verifier
  [APPL]  Appllama     - Mobile UX (Finch/Lungy/Transit)
  [ALL]   Full Stack   - THIS IS THE ACTIVE MODE
Ready for production development across backend & frontend.
"@
    }
}

# --- Functions ---------------------------------------------
function Show-Header {
    Clear-Host
    Write-Host ""
    Write-Host (BgBlue "                                                              ")
    Write-Host (BgBlue "     EKA Mobility  --  Skill Context Loader  v2.0            ")
    Write-Host (BgBlue "                                                              ")
    Write-Host ""
    Write-Host (Dim "  Reads SKILL.md files and injects expertise context into AI")
    Write-Host (Dim "  Project: $root")
    Write-Host ""
}

function Show-Menu {
    param($activeSkills)
    Write-Host (Yellow "  +---------------------------------------------------------+")
    Write-Host (Yellow "  |  AVAILABLE SKILL PACKS                                  |")
    Write-Host (Yellow "  +---------------------------------------------------------+")
    Write-Host ""

    foreach ($key in ($SKILLS.Keys | Sort-Object { [int]$_ })) {
        $s = $SKILLS[$key]
        $active = if ($activeSkills -contains $key) { (Green " [ACTIVE]") } else { "" }
        $tag  = switch ($s.Color) {
            "Green"   { (Green   "  $key. $($s.Emoji) $($s.Name)") }
            "Cyan"    { (Cyan    "  $key. $($s.Emoji) $($s.Name)") }
            "Yellow"  { (Yellow  "  $key. $($s.Emoji) $($s.Name)") }
            "Magenta" { (Magenta "  $key. $($s.Emoji) $($s.Name)") }
            "Red"     { (Red     "  $key. $($s.Emoji) $($s.Name)") }
            "Blue"    { (Blue    "  $key. $($s.Emoji) $($s.Name)") }
        }
        Write-Host "$tag$active"
        Write-Host (Dim "     $($s.Desc)")
        Write-Host (Dim "     Tags: $($s.Tags)")
        Write-Host ""
    }

    Write-Host (Yellow "  ---------------------------------------------------------")
    Write-Host (White  "  A. Load ALL skills at once (Full Suite)")
    Write-Host (Green  "  J. Load All JEV Ecosystem skills (21 tools)")
    Write-Host (White  "  C. Combine multiple skills (e.g. 1,3,4,9,10)")
    Write-Host (White  "  V. View loaded skill files")
    Write-Host (White  "  X. Copy context prompt to clipboard")
    Write-Host (White  "  R. Reset / Clear all loaded skills")
    Write-Host (Red    "  Q. Quit")
    Write-Host (Yellow "  ---------------------------------------------------------")
    Write-Host ""
}

function Load-Skill {
    param($key, [ref]$context, [ref]$activeSkills, [ref]$loadedFiles)

    $s = $SKILLS[$key]
    if (-not $s) { return }

    Write-Host ""
    Write-Host (Cyan "  Loading: $($s.Name) ($($s.Files.Count) files)...")
    Write-Host ""

    $loaded = 0
    $failed = 0

    foreach ($f in $s.Files) {
        $fullPath = Join-Path $root $f
        if (Test-Path $fullPath) {
            $content = Get-Content $fullPath -Raw -Encoding UTF8
            if ($content -and $fullPath -notin $loadedFiles.Value) {
                $context.Value += "`n`n---`n# SKILL: $f`n---`n$content"
                $loadedFiles.Value += $fullPath
                $loaded++
                Write-Host (Green "    [OK] $f")
            } else {
                Write-Host (Dim  "    [SKIP] $f (already loaded)")
            }
        } else {
            $failed++
            Write-Host (Red  "    [MISS] $f (file not found)")
        }
    }

    if ($key -notin $activeSkills.Value) {
        $activeSkills.Value += $key
    }

    Write-Host ""
    Write-Host (Green "  [OK] Loaded $loaded files")
    if ($failed -gt 0) { Write-Host (Red "  ! $failed files not found") }
    Write-Host ""
    Write-Host (White "  === ACTIVATION ===========================================")
    $s.Activation.Trim() -split "`n" | ForEach-Object { Write-Host (Cyan "  $_") }
    Write-Host (White "  ===========================================================")
    Write-Host ""
}

function Build-ContextPrompt {
    param($context, $activeSkills)
    $names = ($activeSkills | ForEach-Object { $SKILLS[$_].Name }) -join " + "
    $prompt = @"
I am loading the following expert skill context for this session: $names

Please internalize all SKILL.md content below and operate as a specialist in these domains for the rest of this conversation. Apply the rules, patterns, and philosophy from each skill to every response.

================ SKILL CONTEXT START ================
$context
================ SKILL CONTEXT END ==================

Confirm you have loaded these skills and state what expertise is now active.
"@
    return $prompt
}

# --- Main Loop ---------------------------------------------
$globalContext  = ""
$activeSkills   = @()
$loadedFiles    = @()
$running        = $true

while ($running) {
    Show-Header

    if ($activeSkills.Count -gt 0) {
        $names = ($activeSkills | ForEach-Object { $SKILLS[$_].Name }) -join ", "
        Write-Host (Green "  Active Skills: $names")
        Write-Host (Dim  "  Files loaded: $($loadedFiles.Count) | Context size: $([math]::Round($globalContext.Length/1024,1)) KB")
        Write-Host ""
    }

    Show-Menu $activeSkills

    $input = Read-Host "  Select option"
    $input = $input.Trim().ToUpper()

    switch ($input) {
        "Q" {
            Write-Host (Yellow "`n  Goodbye!`n")
            $running = $false
        }
        "R" {
            $globalContext = ""
            $activeSkills  = @()
            $loadedFiles   = @()
            Write-Host (Yellow "`n  All skills cleared.`n")
            Start-Sleep -Seconds 1
        }
        "A" {
            Load-Skill "11" ([ref]$globalContext) ([ref]$activeSkills) ([ref]$loadedFiles)
            Write-Host (Dim "  Press Enter to continue..."); $null = Read-Host
        }
        "J" {
            Load-Skill "9" ([ref]$globalContext) ([ref]$activeSkills) ([ref]$loadedFiles)
            Write-Host (Dim "  Press Enter to continue..."); $null = Read-Host
        }
        "V" {
            Write-Host ""
            Write-Host (Cyan "  Loaded files:")
            if ($loadedFiles.Count -eq 0) {
                Write-Host (Dim "  (none yet)")
            } else {
                $loadedFiles | ForEach-Object {
                    Write-Host (Dim "    - $_")
                }
            }
            Write-Host ""
            Write-Host (Dim "  Press Enter to continue..."); $null = Read-Host
        }
        "X" {
            if ($globalContext -eq "") {
                Write-Host (Red "`n  No skills loaded yet. Select a skill first.`n")
                Start-Sleep -Seconds 1
            } else {
                $prompt = Build-ContextPrompt $globalContext $activeSkills
                $prompt | Set-Clipboard
                Write-Host (Green "`n  Context prompt copied to clipboard!")
                Write-Host (Dim  "  Paste it into your AI chat to activate all loaded skills.")
                Write-Host (Dim  "  Context size: $([math]::Round($prompt.Length/1024,1)) KB")
                Write-Host ""
                Write-Host (Dim "  Press Enter to continue..."); $null = Read-Host
            }
        }
        "C" {
            Write-Host ""
            Write-Host (Yellow "  Enter skill numbers separated by commas (e.g. 1,3,4):")
            $combo = Read-Host "  > "
            $keys = $combo -split "," | ForEach-Object { $_.Trim() }
            foreach ($k in $keys) {
                if ($SKILLS.ContainsKey($k)) {
                    Load-Skill $k ([ref]$globalContext) ([ref]$activeSkills) ([ref]$loadedFiles)
                } else {
                    Write-Host (Red "  Unknown skill: $k")
                }
            }
            Write-Host (Dim "  Press Enter to continue..."); $null = Read-Host
        }
        default {
            if ($SKILLS.ContainsKey($input)) {
                Load-Skill $input ([ref]$globalContext) ([ref]$activeSkills) ([ref]$loadedFiles)
                Write-Host ""
                if ($globalContext -ne "") {
                    $copy = Read-Host "  Copy context to clipboard now? (Y/N)"
                    if ($copy.ToUpper() -eq "Y") {
                        $prompt = Build-ContextPrompt $globalContext $activeSkills
                        $prompt | Set-Clipboard
                        Write-Host (Green "  Copied! Paste into your AI chat.")
                    }
                }
                Write-Host (Dim "  Press Enter to continue..."); $null = Read-Host
            } else {
                Write-Host (Red "`n  Invalid option. Try again.`n")
                Start-Sleep -Seconds 1
            }
        }
    }
}
