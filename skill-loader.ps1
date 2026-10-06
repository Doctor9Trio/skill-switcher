# ============================================================
#  Skill Switcher — Interactive Terminal CLI
#  Usage: .\skill-loader.ps1 (or double-click skill-loader.bat)
# ============================================================

$HOST.UI.RawUI.WindowTitle = "Skill Switcher CLI"
$root = $PSScriptRoot
if (-not (Test-Path (Join-Path $root ".agents\skills"))) {
    if (Test-Path (Join-Path (Split-Path $root -Parent) ".agents\skills")) {
        $root = Split-Path $root -Parent
    }
}

# Resolve paths for the CURRENT user (never hardcode a machine-specific path).
# Optional overrides: SKILL_SWITCHER_HOME (default ~/.gemini), SKILL_SWITCHER_RULES_FILE
$USER_HOME = @($env:USERPROFILE, $env:HOME, [Environment]::GetFolderPath('UserProfile')) |
    Where-Object { $_ -and (Test-Path $_) } | Select-Object -First 1
$GEMINI_HOME  = if ($env:SKILL_SWITCHER_HOME) { $env:SKILL_SWITCHER_HOME } else { [System.IO.Path]::Combine($USER_HOME, ".gemini") }
$GLOBAL_RULES = if ($env:SKILL_SWITCHER_RULES_FILE) { $env:SKILL_SWITCHER_RULES_FILE } else { [System.IO.Path]::Combine($GEMINI_HOME, "config", "rules", "active-skills.md") }
$rulesDir = Split-Path $GLOBAL_RULES
if (!(Test-Path $rulesDir)) { New-Item -ItemType Directory -Force $rulesDir | Out-Null }

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
function BgGreen($t){ c "42;30" $t }

# --- Skill Definitions -------------------------------------
$SKILLS = [ordered]@{
    "1" = @{
        Name  = "ANIMATION & MOTION"
        Emoji = "[ANIM]"
        Color = "Cyan"
        Desc  = "Motion.dev + Emil Kowalski animation philosophy"
        Tags  = "motion, hover, transitions, spring physics, scroll reveal"
        Files = @(
            ".agents/skills/motion-dev-animations-skill/SKILL.md",
            ".agents/skills/emilkowalski-skills-animate/SKILL.md",
            ".agents/skills/emilkowalski-skills-improve-animations/SKILL.md",
            ".agents/skills/emilkowalski-skills-find-animation-opportunities/SKILL.md",
            ".agents/skills/emilkowalski-skills-animation-vocabulary/SKILL.md",
            ".agents/skills/gsap-skills-gsap-core/SKILL.md"
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
        Name  = "GSAP SUITE"
        Emoji = "[GSAP]"
        Color = "Green"
        Desc  = "Full GSAP suite: core, ScrollTrigger, React, Timeline, Plugins"
        Tags  = "gsap, scrolltrigger, timeline, animations, webflow"
        Files = @(
            ".agents/skills/gsap-skills-gsap-core/SKILL.md",
            ".agents/skills/gsap-skills-gsap-scrolltrigger/SKILL.md",
            ".agents/skills/gsap-skills-gsap-timeline/SKILL.md",
            ".agents/skills/gsap-skills-gsap-react/SKILL.md",
            ".agents/skills/gsap-skills-gsap-plugins/SKILL.md",
            ".agents/skills/gsap-skills-gsap-performance/SKILL.md",
            ".agents/skills/gsap-skills-gsap-utils/SKILL.md",
            ".agents/skills/gsap-skills-gsap-frameworks/SKILL.md"
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
        Name  = "UI DESIGN & TASTE"
        Emoji = "[UI]"
        Color = "Magenta"
        Desc  = "Impeccable + taste + Apple HIG design principles"
        Tags  = "ui, design, polish, components, visual quality"
        Files = @(
            ".agents/skills/impeccable/SKILL.md",
            ".agents/skills/taste-skill/SKILL.md",
            ".agents/skills/taste-skill-minimalist-skill/SKILL.md",
            ".agents/skills/emilkowalski-skills-apple-design/SKILL.md",
            ".agents/skills/emilkowalski-skills-emil-design-eng/SKILL.md",
            ".agents/skills/taste-skill-redesign-skill/SKILL.md"
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
  - No generic AI patterns (no Inter, no pill shapes, no AI-purple gradient)
"@
    }
    "4" = @{
        Name  = "IMAGEGEN & DESIGN REFERENCE"
        Emoji = "[IMG]"
        Color = "Yellow"
        Desc  = "AWWWARDS-level frontend design image generation"
        Tags  = "imagegen, design reference, sections, mockups, frontend images"
        Files = @(
            ".agents/skills/taste-skill-imagegen-frontend-web/SKILL.md",
            ".agents/skills/taste-skill-imagegen-frontend-mobile/SKILL.md",
            ".agents/skills/taste-skill-image-to-code-skill/SKILL.md"
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
"@
    }
    "5" = @{
        Name  = "BRUTALIST & TELEMETRY UI"
        Emoji = "[BRUT]"
        Color = "Red"
        Desc  = "Industrial + tactical telemetry UI aesthetic"
        Tags  = "brutalist, industrial, terminal, data-heavy, dashboard, CRT"
        Files = @(
            ".agents/skills/taste-skill-brutalist-skill/SKILL.md"
        )
        Activation = @"
BRUTALIST UI SKILLS LOADED
===========================
Industrial Brutalism + Tactical Telemetry mode active.
Swiss Industrial Print:
  - High-contrast light mode, newsprint substrate
  - Monolithic heavy sans-serif typography, visible grid lines
  - Aggressive asymmetric negative space
Tactical Telemetry / CRT Terminal:
  - Dark mode only, high-density tabular data, monospace dominance
  - Phosphor glow, scanline simulation
"@
    }
    "6" = @{
        Name  = "VIDEO GEN & HIGGSFIELD"
        Emoji = "[VID]"
        Color = "Blue"
        Desc  = "Seedance 2.0 + Higgsfield AI video prompting"
        Tags  = "video, ai video, seedance, higgsfield, prompts, generation"
        Files = @(
            ".agents/skills/seedance2-skill/SKILL.md",
            ".agents/skills/higgsfield-skills-higgsfield-generate/SKILL.md"
        )
        Activation = @"
VIDEO GEN SKILLS LOADED
========================
Seedance 2.0 expert prompt engineering active:
  - Character consistency (face/body reference with @Image)
  - Camera control (orbit, tracking, crane, handheld)
  - Long-take / one-take (no cuts, continuous tracking)
Higgsfield Generate: GPT Image 2, Seedance 2.0, Virality Predictor.
"@
    }
    "7" = @{
        Name  = "BRAND & IDENTITY PIPELINE"
        Emoji = "[BRND]"
        Color = "Magenta"
        Desc  = "Full brand identity + Higgsfield brandbook pipeline"
        Tags  = "brand, identity, logo, brandbook, colors, visual system"
        Files = @(
            ".agents/skills/higgsfield-skills-higgsfield-brandkit/SKILL.md",
            ".agents/skills/taste-skill-brandkit/SKILL.md",
            ".agents/skills/higgsfield-skills-higgsfield-soul-id/SKILL.md"
        )
        Activation = @"
BRAND SKILLS LOADED
====================
Higgsfield Brandkit pipeline active:
  palettes > SVG logo marks > typography > mockups
  > social graphics > packaging > signage > posters > brandbooks
Soul ID: face/identity consistency across generated visuals.
"@
    }
    "8" = @{
        Name  = "CODE REVIEW & QUALITY GATE"
        Emoji = "[REV]"
        Color = "Yellow"
        Desc  = "Multi-agent review, Canny verifier & animation audit"
        Tags  = "review, audit, animation quality, code review, ux"
        Files = @(
            ".agents/skills/jev-review/SKILL.md",
            ".agents/skills/canny-verifier/SKILL.md",
            ".agents/skills/semdecide/SKILL.md",
            ".agents/skills/emilkowalski-skills-review-animations/SKILL.md"
        )
        Activation = @"
REVIEW SKILLS LOADED
=====================
Code review and verification specialist active:
  - JEV Review: Multi-agent diff review and security checklist
  - Canny Verifier: Guardrail checking against read-only apps
  - Semdecide: Semantic decision tree reviewer
  - Animation Audit: 8-category UX motion inspection
"@
    }
    "9" = @{
        Name  = "JEV & LAYA SYSTEM 1"
        Emoji = "[JEV]"
        Color = "Green"
        Desc  = "System One rapid decision primitives, Laya engine & DOM loop"
        Tags  = "system-one, laya, gating, canny, compaction, telemetry-checks"
        Files = @(
            ".agents/skills/laya/SKILL.md",
            ".agents/skills/jev-decision/SKILL.md",
            ".agents/skills/typesafe-mcp/SKILL.md",
            ".agents/skills/fast-jev-compaction/SKILL.md",
            ".agents/skills/json-render/SKILL.md",
            ".agents/skills/canny-verifier/SKILL.md",
            ".agents/skills/jev-review/SKILL.md",
            ".agents/skills/winnow/SKILL.md",
            ".agents/skills/blink/SKILL.md",
            ".agents/skills/semdecide/SKILL.md",
            ".agents/skills/jev-codex-router/SKILL.md",
            ".agents/skills/jev-ultrafast/SKILL.md",
            ".agents/skills/killmyidea/SKILL.md",
            ".agents/skills/jev-mcp/SKILL.md",
            ".agents/skills/agent-desktop/SKILL.md",
            ".agents/skills/typesafe-mario/SKILL.md",
            ".agents/skills/jev-drone/SKILL.md",
            ".agents/skills/onevonejev/SKILL.md",
            ".agents/skills/jev-trader/SKILL.md",
            ".agents/skills/prism/SKILL.md",
            ".agents/skills/neo4jev/SKILL.md",
            ".agents/skills/jev-curate/SKILL.md",
            ".agents/skills/awesome-jev/SKILL.md"
        )
        Activation = @"
JEV & LAYA SYSTEM ONE DECISION ACTIVE
=====================================
System One non-autoregressive decision primitives active:
  Laya: Choice, Score, Noul in 33ms (0 tokens, 100+ languages, presets: guard/triage/email)
  Jev: Gate(condition, rule), Choice(options, criteria), Score(target, rubrics)
Canny Verifier:
  - Guardrail checking against read-only core apps
  - Zero sensitive telematics leakage (lat/lon only)
  - Diff verification before marking tasks complete
Fast compaction and telemetry noise filtering enabled.
"@
    }
    "10" = @{
        Name  = "APPLLAMA MOBILE UX"
        Emoji = "[APPL]"
        Color = "Magenta"
        Desc  = "Mobile UX intelligence based on 25k+ top apps (Finch, Lungy)"
        Tags  = "mobile-ux, finch-copy, lungy-pulse, bottom-sheets, transit"
        Files = @(
            ".agents/skills/appllama-design/SKILL.md"
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
        Name  = "FULL STACK SUITE"
        Emoji = "[ALL]"
        Color = "Cyan"
        Desc  = "Complete suite across animation, design, review & JEV"
        Tags  = "everything, all skills, full context"
        Files = @(
            ".agents/skills/motion-dev-animations-skill/SKILL.md",
            ".agents/skills/emilkowalski-skills-animate/SKILL.md",
            ".agents/skills/emilkowalski-skills-apple-design/SKILL.md",
            ".agents/skills/gsap-skills-gsap-core/SKILL.md",
            ".agents/skills/gsap-skills-gsap-react/SKILL.md",
            ".agents/skills/impeccable/SKILL.md",
            ".agents/skills/taste-skill/SKILL.md",
            ".agents/skills/taste-skill-minimalist-skill/SKILL.md",
            ".agents/skills/laya/SKILL.md",
            ".agents/skills/jev-decision/SKILL.md",
            ".agents/skills/canny-verifier/SKILL.md",
            ".agents/skills/jev-review/SKILL.md",
            ".agents/skills/fast-jev-compaction/SKILL.md",
            ".agents/skills/appllama-design/SKILL.md"
        )
        Activation = @"
ALL RECOMMENDED SKILLS LOADED - FULL STACK SUITE
=================================================
Complete balanced skill suite active across all core domains.
Ready for production development across backend, frontend & AI pair-programming.
"@
    }
}

# --- Functions ---------------------------------------------
function Show-Header {
    Clear-Host
    Write-Host ""
    Write-Host (BgBlue "                                                              ")
    Write-Host (BgBlue "     Skill Switcher  --  Terminal Context Manager v3.0       ")
    Write-Host (BgBlue "                                                              ")
    Write-Host ""
    Write-Host (Dim "  Active Root : $root")
    Write-Host (Dim "  Agent Rules : $GLOBAL_RULES")
    
    # Check disk status
    if (Test-Path $GLOBAL_RULES) {
        $diskTxt = Get-Content $GLOBAL_RULES -Raw -ErrorAction SilentlyContinue
        if ($diskTxt -match "(?m)^# Active: (.+)$") {
            Write-Host (Green "  [Disk Memory Sync] Active on disk: $($Matches[1])")
        } else {
            Write-Host (Yellow "  [Disk Memory Sync] Rules file exists but no Active header found")
        }
    } else {
        Write-Host (Dim "  [Disk Memory Sync] No active rules on disk (clean slate)")
    }
    Write-Host ""
}

function Show-Menu {
    param($activeSkills)
    Write-Host (Yellow "  +---------------------------------------------------------+")
    Write-Host (Yellow "  |  AVAILABLE SKILL PACKS                                  |")
    Write-Host (Yellow "  +---------------------------------------------------------+")
    Write-Host ""

    foreach ($key in $SKILLS.Keys) {
        $s = $SKILLS[$key]
        $active = if ($activeSkills -contains $key) { (Green " [ACTIVE]") } else { "" }
        $tag = switch ($s.Color) {
            "Green"   { (Green   "  $key. $($s.Emoji) $($s.Name)") }
            "Cyan"    { (Cyan    "  $key. $($s.Emoji) $($s.Name)") }
            "Yellow"  { (Yellow  "  $key. $($s.Emoji) $($s.Name)") }
            "Magenta" { (Magenta "  $key. $($s.Emoji) $($s.Name)") }
            "Red"     { (Red     "  $key. $($s.Emoji) $($s.Name)") }
            "Blue"    { (Blue    "  $key. $($s.Emoji) $($s.Name)") }
            default   { (White   "  $key. $($s.Emoji) $($s.Name)") }
        }
        Write-Host "$tag$active"
        Write-Host (Dim "     $($s.Desc)")
        Write-Host ""
    }

    Write-Host (Yellow "  ---------------------------------------------------------")
    Write-Host (White  "  [1-11] Toggle skill pack on/off")
    Write-Host (Green  "  A. APPLY current selection to Antigravity Memory (DISK)")
    Write-Host (Cyan   "  C. Combine multiple packs (e.g. 1,3,9)")
    Write-Host (White  "  V. View loaded skill files & prompt preview")
    Write-Host (White  "  X. Copy context prompt to clipboard")
    Write-Host (Yellow "  S. Status of Antigravity memory on disk")
    Write-Host (Red    "  W. WIPE / Clear Antigravity memory from disk")
    Write-Host (Magenta"  T. Test Laya System 1 Decision Engine")
    Write-Host (Dim    "  R. Reset in-memory selection   |   Q. Quit")
    Write-Host (Yellow "  ---------------------------------------------------------")
    Write-Host ""
}

function Toggle-Skill {
    param($key, [ref]$context, [ref]$activeSkills, [ref]$loadedFiles)

    $s = $SKILLS[$key]
    if (-not $s) { return }

    if ($activeSkills.Value -contains $key) {
        $activeSkills.Value = @($activeSkills.Value | Where-Object { $_ -ne $key })
        # Rebuild context
        $context.Value = ""
        $loadedFiles.Value = @()
        foreach ($k in $activeSkills.Value) {
            Load-Skill-Silent $k ([ref]$context.Value) ([ref]$loadedFiles.Value)
        }
        Write-Host (Yellow "  Deactivated: $($s.Name)")
    } else {
        $activeSkills.Value += $key
        Load-Skill-Silent $key ([ref]$context.Value) ([ref]$loadedFiles.Value)
        Write-Host (Green "  Activated: $($s.Name) ($($s.Files.Count) files)")
    }
}

function Load-Skill-Silent {
    param($key, [ref]$context, [ref]$loadedFiles)
    $s = $SKILLS[$key]
    if (-not $s) { return }
    foreach ($f in $s.Files) {
        $fullPath = Join-Path $root $f
        if (Test-Path $fullPath) {
            if ($fullPath -notin $loadedFiles.Value) {
                $content = Get-Content $fullPath -Raw -Encoding UTF8
                $context.Value += "`n`n---`n# SKILL: $f`n---`n$content"
                $loadedFiles.Value += $fullPath
            }
        }
    }
}

function Build-RulesContent {
    param($activeSkills, $loadedFiles)
    $names = ($activeSkills | ForEach-Object { $SKILLS[$_].Name }) -join ", "
    $activations = ($activeSkills | ForEach-Object { $SKILLS[$_].Activation.Trim() }) -join "`n`n"
    $now = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    $centralVault = $root.Replace("\", "/")

    $fileLines = @()
    $i = 1
    foreach ($f in $loadedFiles) {
        $rel = $f.Substring($root.Length).TrimStart("\/").Replace("\", "/")
        $abs = "$centralVault/$rel"
        $fileLines += "$i. [$rel](file:///$abs) (Absolute: `$abs`)"
        $i++
    }
    $fileListStr = $fileLines -join "`n"

    $md = @"
# Active Skills — Doctor9Trio / Skill Switcher
# Generated: $now
# Active: $names

## Activation Rules
$activations

## Skill Files (Universal Pointers)
$fileListStr

## Session Instruction
Apply all skill rules above to every response. Use the absolute file links above whenever deep skill instructions are needed. At session start, confirm active skills in one line.
"@
    return $md
}

# --- Main Loop ---------------------------------------------
$globalContext = ""
$activeSkills  = @()
$loadedFiles   = @()
$running       = $true

while ($running) {
    Show-Header

    if ($activeSkills.Count -gt 0) {
        $names = ($activeSkills | ForEach-Object { $SKILLS[$_].Name }) -join " + "
        Write-Host (Green "  Active Selection: $names")
        $estTokens = [math]::Round($globalContext.Length / 4)
        Write-Host (Dim   "  Files loaded: $($loadedFiles.Count) | Context: $([math]::Round($globalContext.Length/1024,1)) KB (~$estTokens tokens)")
        Write-Host ""
    }

    Show-Menu $activeSkills

    $input = Read-Host "  Select option"
    $input = $input.Trim().ToUpper()

    if ($SKILLS.ContainsKey($input)) {
        Toggle-Skill $input ([ref]$globalContext) ([ref]$activeSkills) ([ref]$loadedFiles)
        Start-Sleep -Milliseconds 600
        continue
    }

    switch ($input) {
        "Q" {
            Write-Host (Yellow "`n  Goodbye!`n")
            $running = $false
        }
        "R" {
            $globalContext = ""
            $activeSkills  = @()
            $loadedFiles   = @()
            Write-Host (Yellow "`n  In-memory selection reset.`n")
            Start-Sleep -Milliseconds 800
        }
        "A" {
            # Apply directly to Antigravity Memory file
            if ($activeSkills.Count -eq 0) {
                Write-Host (Red "`n  Please select at least one skill first!`n")
                Start-Sleep -Seconds 1
                break
            }
            $rulesMd = Build-RulesContent $activeSkills $loadedFiles
            Set-Content -Path $GLOBAL_RULES -Value $rulesMd -Encoding UTF8
            Write-Host ""
            Write-Host (BgGreen "                                                              ")
            Write-Host (BgGreen "  [OK] Successfully Applied to Antigravity Memory!            ")
            Write-Host (BgGreen "  File: $GLOBAL_RULES                                         ")
            Write-Host (BgGreen "                                                              ")
            Write-Host ""
            Write-Host (Dim "  Press Enter to continue..."); $null = Read-Host
        }
        "W" {
            # Wipe / Clear Memory from Disk
            if (Test-Path $GLOBAL_RULES) {
                Remove-Item $GLOBAL_RULES -Force
                Write-Host (Yellow "`n  [OK] Cleared $GLOBAL_RULES from disk!`n")
            } else {
                Write-Host (Dim "`n  Rules file does not exist on disk.`n")
            }
            Start-Sleep -Seconds 1
        }
        "S" {
            # Status check
            Write-Host ""
            Write-Host (Cyan "  === Antigravity Disk Memory Status ===")
            if (Test-Path $GLOBAL_RULES) {
                $item = Get-Item $GLOBAL_RULES
                Write-Host (Green "  File exists: $($item.FullName)")
                Write-Host (Dim   "  Last updated: $($item.LastWriteTime)")
                Write-Host (Dim   "  Size: $($item.Length) bytes")
                Write-Host ""
                $lines = Get-Content $GLOBAL_RULES -Encoding UTF8 | Select-Object -First 15
                $lines | ForEach-Object { Write-Host (Dim "    $_") }
            } else {
                Write-Host (Yellow "  File does not exist: $GLOBAL_RULES (no skills currently loaded)")
            }
            Write-Host ""
            Write-Host (Dim "  Press Enter to continue..."); $null = Read-Host
        }
        "C" {
            $comb = Read-Host "  Enter numbers separated by comma (e.g. 1,3,9)"
            $nums = $comb -split ",\s*"
            $globalContext = ""
            $activeSkills  = @()
            $loadedFiles   = @()
            foreach ($n in $nums) {
                if ($SKILLS.ContainsKey($n)) {
                    $activeSkills += $n
                    Load-Skill-Silent $n ([ref]$globalContext) ([ref]$loadedFiles)
                }
            }
            Write-Host (Green "  Loaded $($activeSkills.Count) skill packs.")
            Start-Sleep -Milliseconds 800
        }
        "V" {
            Write-Host ""
            Write-Host (Cyan "  === Loaded Skill Files ($($loadedFiles.Count)) ===")
            foreach ($f in $loadedFiles) {
                $size = if (Test-Path $f) { (Get-Item $f).Length } else { 0 }
                $kb = [math]::Round($size / 1024, 1)
                Write-Host (Green "  [OK] $f ($kb KB)")
            }
            Write-Host ""
            Write-Host (Dim "  Press Enter to continue..."); $null = Read-Host
        }
        "X" {
            if ($activeSkills.Count -eq 0) {
                Write-Host (Red "  No skills selected to copy.")
                Start-Sleep -Seconds 1
                break
            }
            $prompt = Build-RulesContent $activeSkills $loadedFiles
            try {
                Set-Clipboard -Value $prompt
                Write-Host (Green "`n  [OK] Context rules copied to clipboard!`n")
            } catch {
                Write-Host (Red "  Could not access clipboard.")
            }
            Start-Sleep -Seconds 1
        }
        "T" {
            Write-Host ""
            Write-Host (Magenta "  === Test Laya System 1 Decision Engine ===")
            $sample = Read-Host "  Enter sample text (or press Enter for default refund test)"
            if (-not $sample) { $sample = "I want a refund immediately because the API crashed with error 500" }
            $layaScript = Join-Path $root ".agents\skills\laya\scripts\laya_runner.py"
            if (Test-Path $layaScript) {
                python "$layaScript" "$sample" --preset "triage"
            } else {
                Write-Host (Red "  Laya runner not found at: $layaScript")
            }
            Write-Host ""
            Write-Host (Dim "  Press Enter to continue..."); $null = Read-Host
        }
        default {
            Write-Host (Yellow "  Invalid option. Choose a number 1-11, A, C, V, X, S, W, T, R, or Q.")
            Start-Sleep -Milliseconds 700
        }
    }
}
