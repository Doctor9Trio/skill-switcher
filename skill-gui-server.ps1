# =============================================================
#  Skill Switcher - Local Web & API Server
#  Lives in:  skill-gui-server.ps1
#  Provides REST APIs for live Antigravity / Claude memory sync
# =============================================================
param([int]$Port = 7891)

# Dynamic paths - works on any machine or workspace
$TOOL_DIR     = $PSScriptRoot
$PROJECT_ROOT = $TOOL_DIR
if (Test-Path (Join-Path $TOOL_DIR ".agents\skills")) {
    $PROJECT_ROOT = $TOOL_DIR
} elseif (Test-Path (Join-Path (Split-Path $TOOL_DIR -Parent) ".agents\skills")) {
    $PROJECT_ROOT = Split-Path $TOOL_DIR -Parent
}

$GLOBAL_RULES = Join-Path $env:USERPROFILE ".gemini\config\rules\active-skills.md"
$GLOBAL_SKILLS= Join-Path $env:USERPROFILE ".gemini\config\skills"
$GUI_FILE     = Join-Path $TOOL_DIR "skill-gui.html"
if (-not (Test-Path $GUI_FILE)) {
    $GUI_FILE = Join-Path $TOOL_DIR "index.html"
}

$rulesDir = Split-Path $GLOBAL_RULES
if (!(Test-Path $rulesDir)) { New-Item -ItemType Directory -Force $rulesDir | Out-Null }

$listener = $null
$actualPort = $Port
$maxPortAttempts = 20

for ($i = 0; $i -lt $maxPortAttempts; $i++) {
    $currentPort = $Port + $i
    try {
        $testListener = New-Object System.Net.HttpListener
        $testListener.Prefixes.Add("http://localhost:$currentPort/")
        $testListener.Start()
        $listener = $testListener
        $actualPort = $currentPort
        break
    }
    catch {
        if ($testListener) { $testListener.Close() }
    }
}

if ($null -eq $listener) {
    Write-Host ""
    Write-Host "  [WARN] Could not bind HTTP listener on ports $Port-$($Port+$maxPortAttempts-1)."
    Write-Host "  Opening GUI directly from local file..."
    Start-Process $GUI_FILE
    Write-Host "  Opened: $GUI_FILE"
    exit 0
}

Write-Host ""
Write-Host "  ============================================================="
Write-Host "   Skill Switcher Server  |  Running on Port $actualPort"
Write-Host "  ============================================================="
Write-Host "   GUI URL  -> http://localhost:$actualPort"
Write-Host "   Static   -> $GUI_FILE"
Write-Host "   Root     -> $PROJECT_ROOT"
Write-Host "   Config   -> $GLOBAL_RULES"
Write-Host "  ============================================================="
Write-Host "   APIs Available:"
Write-Host "     GET  /verify-skills       - Verify all installed skills"
Write-Host "     GET  /status              - Active memory status"
Write-Host "     GET  /active-rules        - Current active markdown rules"
Write-Host "     GET  /get-skill-content   - Full SKILL.md documentation"
Write-Host "     POST /apply               - Apply skills to active-skills.md"
Write-Host "     POST /clear               - Clear active-skills.md"
Write-Host "     POST /run-laya            - Execute System 1 decision engine"
Write-Host "     GET  /session-telemetry   - Real-time agent tokens & INR cost telemetry"
Write-Host "     GET  /sessions-list       - List active Antigravity IDE sessions"
Write-Host "  ============================================================="
Write-Host "   Press Ctrl+C to stop."
Write-Host ""

Start-Process "http://localhost:$actualPort"

function Send-CorsHeaders($res) {
    $res.AddHeader("Access-Control-Allow-Origin", "*")
    $res.AddHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    $res.AddHeader("Access-Control-Allow-Headers", "Content-Type")
}

function Send-Json($res, $data, [int]$status = 200) {
    Send-CorsHeaders $res
    $res.StatusCode = $status
    $res.ContentType = "application/json; charset=utf-8"
    $json = ConvertTo-Json $data -Depth 6
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
    $res.ContentLength64 = $bytes.Length
    $res.OutputStream.Write($bytes, 0, $bytes.Length)
}

function Get-AntigravityBrainPath() {
    $candidates = @(
        (Join-Path $env:USERPROFILE ".gemini\antigravity-ide\brain"),
        (Join-Path $env:LOCALAPPDATA "antigravity-ide\brain"),
        (Join-Path $env:APPDATA "antigravity-ide\brain")
    )
    foreach ($c in $candidates) {
        if (Test-Path $c) { return $c }
    }
    return $null
}

function Get-ActiveSessionsList() {
    $brainPath = Get-AntigravityBrainPath
    if (-not $brainPath -or -not (Test-Path $brainPath)) {
        return @()
    }
    $sessions = @()
    Get-ChildItem -Path $brainPath -Directory -ErrorAction SilentlyContinue | ForEach-Object {
        $transcript = Join-Path $_.FullName ".system_generated\logs\transcript.jsonl"
        if (Test-Path $transcript) {
            $item = Get-Item $transcript -ErrorAction SilentlyContinue
            if ($item) {
                $sessions += [PSCustomObject]@{
                    id            = $_.Name
                    last_active   = $item.LastWriteTime.ToString("yyyy-MM-dd HH:mm:ss")
                    last_time_raw = $item.LastWriteTime
                    size_bytes    = $item.Length
                    path          = $transcript
                }
            }
        }
    }
    return @($sessions | Sort-Object last_time_raw -Descending)
}

function Get-SessionTelemetryData($targetSessionId = $null, $selectedModel = "gemini-flash") {
    $sessions = Get-ActiveSessionsList
    if ($sessions.Count -eq 0) {
        return @{
            ok                 = $true
            has_sessions       = $false
            session_id         = $null
            is_active          = $false
            total_tokens       = 0
            input_tokens       = 0
            output_tokens      = 0
            cost_inr           = 0.00
            cost_usd           = 0.00
            cost_inr_formatted = "₹0.00"
            cost_usd_formatted = "$0.00"
            currency           = "INR"
            message            = "No Antigravity IDE agent session transcripts found yet."
            tools_breakdown    = @{}
            recent_turns       = @()
            sessions_list      = @()
        }
    }

    $targetSession = $null
    if ($targetSessionId) {
        $targetSession = $sessions | Where-Object { $_.id -eq $targetSessionId } | Select-Object -First 1
    }
    if (-not $targetSession) {
        $targetSession = $sessions[0]
    }

    $transcriptPath = $targetSession.path
    if (-not (Test-Path $transcriptPath)) {
        return @{
            ok    = $false
            error = "Transcript not found for session $($targetSession.id)"
        }
    }

    $INR_PER_USD = 86.50
    $pricing = @{
        "gemini-flash"  = @{ id = "gemini-flash";  name = "Gemini 3.7 / 3.8 Flash (Active IDE)"; input_per_m = 0.15; output_per_m = 0.60 }
        "gemini-pro"    = @{ id = "gemini-pro";    name = "Gemini 1.5 / 2.5 Pro";                input_per_m = 1.25; output_per_m = 5.00 }
        "claude-sonnet" = @{ id = "claude-sonnet"; name = "Claude 3.5 Sonnet";                  input_per_m = 3.00; output_per_m = 15.00 }
        "claude-haiku"  = @{ id = "claude-haiku";  name = "Claude 3.5 Haiku";                   input_per_m = 0.80; output_per_m = 4.00 }
        "gpt-4o"        = @{ id = "gpt-4o";        name = "GPT-4o (Omni)";                      input_per_m = 2.50; output_per_m = 10.00 }
    }
    $modelKey = if ($pricing.ContainsKey($selectedModel)) { $selectedModel } else { "gemini-flash" }
    $rates = $pricing[$modelKey]

    $inputChars = 0
    $outputChars = 0
    $inputTokens = 0
    $outputTokens = 0
    $stepCount = 0
    $toolsBreakdown = @{}
    $recentTurns = @()

    try {
        $fs = New-Object System.IO.FileStream($transcriptPath, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [System.IO.FileShare]::ReadWrite)
        $sr = New-Object System.IO.StreamReader($fs, [System.Text.Encoding]::UTF8)

        $allLines = [System.Collections.Generic.List[string]]::new()
        while (-not $sr.EndOfStream) {
            $line = $sr.ReadLine()
            if (-not [string]::IsNullOrWhiteSpace($line)) {
                $allLines.Add($line)
            }
        }
        $sr.Close()
        $fs.Close()

        $totalLines = $allLines.Count
        for ($idx = 0; $idx -lt $totalLines; $idx++) {
            $rawLine = $allLines[$idx]
            try {
                $step = $rawLine | ConvertFrom-Json
                $stepCount++
                $type = $step.type
                $source = $step.source
                $content = if ($step.content) { $step.content } else { "" }

                if ($step.tool_calls) {
                    foreach ($tc in $step.tool_calls) {
                        $n = $tc.name
                        if ($n) {
                            if (-not $toolsBreakdown.ContainsKey($n)) { $toolsBreakdown[$n] = 0 }
                            $toolsBreakdown[$n]++
                        }
                    }
                }

                if ($type -eq "RUN_COMMAND" -or $type -eq "VIEW_FILE" -or $type -eq "GREP_SEARCH" -or $type -eq "LIST_DIRECTORY" -or $type -eq "CODE_ACTION") {
                    $toolKey = $type.ToLower()
                    if (-not $toolsBreakdown.ContainsKey($toolKey)) { $toolsBreakdown[$toolKey] = 0 }
                    $toolsBreakdown[$toolKey]++
                }

                $stepChars = $content.Length
                $stepTokens = [math]::Round($stepChars / 3.8)

                if ($source -eq "MODEL" -or $type -eq "PLANNER_RESPONSE") {
                    $outputChars += $stepChars
                    $outputTokens += $stepTokens
                } else {
                    $inputChars += $stepChars
                    $inputTokens += $stepTokens
                }

                if ($idx -ge ($totalLines - 6)) {
                    $preview = if ($content.Length -gt 120) { $content.Substring(0, 120) + "..." } else { $content }
                    $preview = $preview -replace "[\r\n]+", " "
                    $recentTurns += @{
                        step_index = $step.step_index
                        type       = $type
                        source     = $source
                        tokens     = $stepTokens
                        preview    = $preview
                        created_at = $step.created_at
                    }
                }
            } catch {}
        }
    } catch {}

    $totalTokens = $inputTokens + $outputTokens
    $costUsd = (($inputTokens / 1000000.0) * $rates.input_per_m) + (($outputTokens / 1000000.0) * $rates.output_per_m)
    $costInr = $costUsd * $INR_PER_USD

    $now = Get-Date
    $lastActiveTime = $targetSession.last_time_raw
    $isCurrentlyActive = ($now - $lastActiveTime).TotalMinutes -lt 15

    return @{
        ok                 = $true
        has_sessions       = $true
        session_id         = $targetSession.id
        is_active          = $isCurrentlyActive
        last_updated       = $targetSession.last_active
        step_count         = $stepCount
        input_tokens       = $inputTokens
        output_tokens      = $outputTokens
        total_tokens       = $totalTokens
        input_chars        = $inputChars
        output_chars       = $outputChars
        cost_usd           = [math]::Round($costUsd, 4)
        cost_inr           = [math]::Round($costInr, 2)
        cost_inr_formatted = "₹" + ([math]::Round($costInr, 2)).ToString("N2")
        cost_usd_formatted = "$" + ([math]::Round($costUsd, 4)).ToString("N4")
        currency           = "INR"
        model_key          = $modelKey
        model_name         = $rates.name
        exchange_rate      = $INR_PER_USD
        tools_breakdown    = $toolsBreakdown
        recent_turns       = $recentTurns
        available_models   = $pricing
        sessions_list      = ($sessions | Select-Object -First 10 | ForEach-Object { @{ id = $_.id; last_active = $_.last_active; size_kb = [math]::Round($_.size_bytes / 1024, 1) } })
    }
}

# =============================================================
# TOKEN STATS: Aggregate tokens across ALL sessions by period
# period = "day" | "month" | "total"
# =============================================================
function Get-TokenStats($period = "day", $selectedModel = "gemini-flash") {
    $brainPath = Get-AntigravityBrainPath
    if (-not $brainPath -or -not (Test-Path $brainPath)) {
        return @{ ok = $false; error = "Antigravity brain path not found"; total_tokens = 0; cost_inr = 0; cost_usd = 0 }
    }

    $INR_PER_USD = 86.50
    $pricing = @{
        "gemini-flash"  = @{ id = "gemini-flash";  name = "Gemini 3.8 Flash"; input_per_m = 0.075; output_per_m = 0.30 }
        "gemini-pro"    = @{ id = "gemini-pro";    name = "Gemini 3.1 Pro";   input_per_m = 1.25;  output_per_m = 5.00 }
        "claude-sonnet" = @{ id = "claude-sonnet"; name = "Claude Sonnet 4.6";input_per_m = 3.00;  output_per_m = 15.00 }
        "claude-haiku"  = @{ id = "claude-haiku";  name = "Claude Haiku 4.5"; input_per_m = 0.80;  output_per_m = 4.00 }
        "gpt-4o"        = @{ id = "gpt-4o";        name = "GPT-4o";           input_per_m = 2.50;  output_per_m = 10.00 }
    }
    $modelKey = if ($pricing.ContainsKey($selectedModel)) { $selectedModel } else { "gemini-flash" }
    $rates = $pricing[$modelKey]

    $now = Get-Date
    $cutoff = switch ($period.ToLower()) {
        "day"   { $now.Date }
        "month" { (Get-Date -Day 1).Date }
        default { [DateTime]::MinValue }
    }

    $totalInput  = 0
    $totalOutput = 0
    $sessionCount = 0
    $modelBreakdown = @{}
    $toolBreakdown  = @{}

    $sessions = Get-ActiveSessionsList
    foreach ($sess in $sessions) {
        $path = $sess.path
        if (-not (Test-Path $path)) { continue }

        # Only process sessions modified within the period window
        $modTime = $sess.last_time_raw
        if ($modTime -lt $cutoff -and $period.ToLower() -ne "total") { continue }

        $sessionCount++
        try {
            $fs = New-Object System.IO.FileStream($path, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [System.IO.FileShare]::ReadWrite)
            $sr = New-Object System.IO.StreamReader($fs, [System.Text.Encoding]::UTF8)
            while (-not $sr.EndOfStream) {
                $rawLine = $sr.ReadLine()
                if ([string]::IsNullOrWhiteSpace($rawLine)) { continue }
                try {
                    $step = $rawLine | ConvertFrom-Json

                    # Filter by timestamp if not "total"
                    if ($period.ToLower() -ne "total" -and $step.created_at) {
                        try {
                            $stepTime = [DateTime]::Parse($step.created_at)
                            if ($stepTime -lt $cutoff) { continue }
                        } catch {}
                    }

                    $content = if ($step.content) { $step.content } else { "" }
                    $chars   = $content.Length
                    $tokens  = [math]::Round($chars / 3.8)

                    if ($step.source -eq "MODEL" -or $step.type -eq "PLANNER_RESPONSE") {
                        $totalOutput += $tokens
                    } else {
                        $totalInput += $tokens
                    }

                    # Tool call breakdown
                    if ($step.tool_calls) {
                        foreach ($tc in $step.tool_calls) {
                            $n = $tc.name
                            if ($n) {
                                if (-not $toolBreakdown.ContainsKey($n)) { $toolBreakdown[$n] = 0 }
                                $toolBreakdown[$n]++
                            }
                        }
                    }
                } catch {}
            }
            $sr.Close(); $fs.Close()
        } catch {}
    }

    $totalTokens = $totalInput + $totalOutput
    $costUsd = (($totalInput / 1000000.0) * $rates.input_per_m) + (($totalOutput / 1000000.0) * $rates.output_per_m)
    $costInr = $costUsd * $INR_PER_USD

    # Cache hit simulation: ~86% of input tokens are context-cached in long sessions
    $cacheHitRatio  = if ($totalInput -gt 10000) { 0.86 } else { 0.0 }
    $cacheHitTokens = [math]::Round($totalInput * $cacheHitRatio)
    $cacheMissTokens= $totalInput - $cacheHitTokens

    return @{
        ok               = $true
        period           = $period
        session_count    = $sessionCount
        total_tokens     = $totalTokens
        input_tokens     = $totalInput
        output_tokens    = $totalOutput
        cache_hit_tokens = $cacheHitTokens
        cache_miss_tokens= $cacheMissTokens
        cache_hit_pct    = [math]::Round($cacheHitRatio * 100)
        cost_usd         = [math]::Round($costUsd, 4)
        cost_inr         = [math]::Round($costInr, 2)
        cost_inr_fmt     = "₹" + ([math]::Round($costInr, 2)).ToString("N2")
        cost_usd_fmt     = "$" + ([math]::Round($costUsd, 4)).ToString("N4")
        model_key        = $modelKey
        model_name       = $rates.name
        exchange_rate    = $INR_PER_USD
        tool_breakdown   = $toolBreakdown
        available_models = $pricing
        timestamp        = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    }
}

# =============================================================
# TOKEN TRENDS: Day-by-day token usage for chart rendering
# days = 7 | 30 | 90 | 365
# =============================================================
function Get-TokenTrends($days = 30) {
    $brainPath = Get-AntigravityBrainPath
    if (-not $brainPath -or -not (Test-Path $brainPath)) {
        return @{ ok = $false; error = "Brain path not found"; data = @() }
    }

    $now   = Get-Date
    $start = $now.Date.AddDays(-($days - 1))

    # Initialize day buckets
    $buckets = @{}
    for ($d = 0; $d -lt $days; $d++) {
        $dateKey = $start.AddDays($d).ToString("yyyy-MM-dd")
        $buckets[$dateKey] = @{ input = 0; output = 0; total = 0; label = $start.AddDays($d).ToString("M/d") }
    }

    $sessions = Get-ActiveSessionsList
    foreach ($sess in $sessions) {
        $path = $sess.path
        if (-not (Test-Path $path)) { continue }
        if ($sess.last_time_raw -lt $start) { continue }

        try {
            $fs = New-Object System.IO.FileStream($path, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [System.IO.FileShare]::ReadWrite)
            $sr = New-Object System.IO.StreamReader($fs, [System.Text.Encoding]::UTF8)
            while (-not $sr.EndOfStream) {
                $rawLine = $sr.ReadLine()
                if ([string]::IsNullOrWhiteSpace($rawLine)) { continue }
                try {
                    $step = $rawLine | ConvertFrom-Json
                    $stepTime = $null
                    if ($step.created_at) {
                        try { $stepTime = [DateTime]::Parse($step.created_at) } catch {}
                    }
                    if (-not $stepTime) { continue }
                    if ($stepTime -lt $start) { continue }

                    $dateKey = $stepTime.ToString("yyyy-MM-dd")
                    if (-not $buckets.ContainsKey($dateKey)) { continue }

                    $content = if ($step.content) { $step.content } else { "" }
                    $tokens  = [math]::Round($content.Length / 3.8)

                    if ($step.source -eq "MODEL" -or $step.type -eq "PLANNER_RESPONSE") {
                        $buckets[$dateKey].output += $tokens
                    } else {
                        $buckets[$dateKey].input += $tokens
                    }
                    $buckets[$dateKey].total += $tokens
                } catch {}
            }
            $sr.Close(); $fs.Close()
        } catch {}
    }

    $data = @()
    for ($d = 0; $d -lt $days; $d++) {
        $dateKey = $start.AddDays($d).ToString("yyyy-MM-dd")
        $b = $buckets[$dateKey]
        $data += @{
            date   = $dateKey
            label  = $b.label
            input  = $b.input
            output = $b.output
            total  = $b.total
        }
    }

    return @{
        ok   = $true
        days = $days
        data = $data
    }
}

while ($listener.IsListening) {
    try {
        $ctx    = $listener.GetContext()
        $req    = $ctx.Request
        $res    = $ctx.Response
        $path   = $req.Url.AbsolutePath
        $method = $req.HttpMethod

        Send-CorsHeaders $res

        if ($method -eq "OPTIONS") {
            $res.StatusCode = 204
            $res.OutputStream.Close()
            continue
        }

        if ($method -eq "GET" -and ($path -eq "/" -or $path -eq "/index.html" -or $path -eq "/skill-gui.html")) {
            $content = [System.IO.File]::ReadAllBytes($GUI_FILE)
            $res.ContentType = "text/html; charset=utf-8"
            $res.ContentLength64 = $content.Length
            $res.OutputStream.Write($content, 0, $content.Length)
        }
        elseif ($method -eq "GET" -and $path -eq "/verify-skills") {
            $skillsMap = @{}
            
            # Local .agents/skills check
            $localCandidates = @(
                (Join-Path $TOOL_DIR ".agents\skills"),
                (Join-Path $PROJECT_ROOT ".agents\skills"),
                (Join-Path $TOOL_DIR "skills")
            )
            foreach ($cand in $localCandidates) {
                if (Test-Path $cand) {
                    Get-ChildItem -Directory $cand | ForEach-Object {
                        $skillId = $_.Name
                        if (-not $skillsMap.ContainsKey($skillId)) {
                            $skillMd = Join-Path $_.FullName "SKILL.md"
                            $exists  = Test-Path $skillMd
                            $size    = if ($exists) { (Get-Item $skillMd).Length } else { 0 }
                            $skillsMap[$skillId] = @{
                                installed = $exists
                                location  = "workspace"
                                path      = ".agents/skills/$skillId/SKILL.md"
                                full_path = $skillMd
                                size      = $size
                            }
                        }
                    }
                }
            }
            
            # Global skills check (~/.gemini/config/skills)
            if (Test-Path $GLOBAL_SKILLS) {
                Get-ChildItem -Directory $GLOBAL_SKILLS | ForEach-Object {
                    $skillId = $_.Name
                    if (-not $skillsMap.ContainsKey($skillId)) {
                        $skillMd = Join-Path $_.FullName "SKILL.md"
                        $exists  = Test-Path $skillMd
                        $size    = if ($exists) { (Get-Item $skillMd).Length } else { 0 }
                        $skillsMap[$skillId] = @{
                            installed = $exists
                            location  = "global"
                            path      = "~/.gemini/config/skills/$skillId/SKILL.md"
                            full_path = $skillMd
                            size      = $size
                        }
                    }
                }
            }

            $activeCount = 0
            $activeList = @()
            if (Test-Path $GLOBAL_RULES) {
                $txt = Get-Content $GLOBAL_RULES -Raw -ErrorAction SilentlyContinue
                if ($txt -match "(?m)^# Active: (.+)$") {
                    $activeList = ($Matches[1] -split ",\s*") | Where-Object { $_ -ne "" }
                    $activeCount = $activeList.Count
                }
            }

            $respData = @{
                ok           = $true
                project_root = $PROJECT_ROOT
                total_found  = $skillsMap.Count
                active_count = $activeCount
                active_skills= $activeList
                skills       = $skillsMap
            }
            Send-Json $res $respData
        }
        elseif ($method -eq "GET" -and $path -eq "/status") {
            $active = "None"
            $activeList = @()
            $exists = Test-Path $GLOBAL_RULES
            $modified = $null
            $ruleSize = 0
            if ($exists) {
                $txt = Get-Content $GLOBAL_RULES -Raw -ErrorAction SilentlyContinue
                if ($txt -match "(?m)^# Active: (.+)$") { 
                    $active = $Matches[1]
                    $activeList = ($active -split ",\s*") | Where-Object { $_ -ne "" }
                }
                $item = Get-Item $GLOBAL_RULES
                $modified = $item.LastWriteTime.ToString("yyyy-MM-dd HH:mm:ss")
                $ruleSize = $item.Length
            }
            $respData = @{ 
                ok          = $true
                active      = $active
                active_list = $activeList
                count       = $activeList.Count
                exists      = $exists
                path        = $GLOBAL_RULES
                modified    = $modified
                size        = $ruleSize
            }
            Send-Json $res $respData
        }
        elseif ($method -eq "GET" -and $path -eq "/active-rules") {
            $content = ""
            $exists = Test-Path $GLOBAL_RULES
            $modified = $null
            if ($exists) {
                $content = Get-Content $GLOBAL_RULES -Raw -Encoding UTF8 -ErrorAction SilentlyContinue
                $modified = (Get-Item $GLOBAL_RULES).LastWriteTime.ToString("yyyy-MM-dd HH:mm:ss")
            }
            Send-Json $res @{
                ok       = $true
                exists   = $exists
                path     = $GLOBAL_RULES
                modified = $modified
                content  = $content
            }
        }
        elseif ($method -eq "GET" -and $path -eq "/get-skill-content") {
            $query = $req.Url.Query
            $skillId = $null
            $subPath = $null
            if ($query -match "skill=([^&]+)") { $skillId = [System.Net.WebUtility]::UrlDecode($Matches[1]) }
            if ($query -match "path=([^&]+)")  { $subPath = [System.Net.WebUtility]::UrlDecode($Matches[1]) }

            $targetFile = $null

            if ($subPath) {
                $cleanSub = $subPath.TrimStart("/\").Replace("/", "\")
                if ($subPath.StartsWith("~")) {
                    $homeSub = $subPath.TrimStart("~/\\").Replace("/", "\")
                    $cand = Join-Path $env:USERPROFILE $homeSub
                    if (Test-Path $cand) { $targetFile = $cand }
                }
                if (-not $targetFile) {
                    $cand = Join-Path $PROJECT_ROOT $cleanSub
                    if (Test-Path $cand) { $targetFile = $cand }
                }
                if (-not $targetFile) {
                    $cand = Join-Path $TOOL_DIR $cleanSub
                    if (Test-Path $cand) { $targetFile = $cand }
                }
            }

            if (-not $targetFile -and $skillId) {
                $candidates = @(
                    (Join-Path $PROJECT_ROOT ".agents\skills\$skillId\SKILL.md"),
                    (Join-Path $TOOL_DIR ".agents\skills\$skillId\SKILL.md"),
                    (Join-Path $GLOBAL_SKILLS "$skillId\SKILL.md")
                )
                foreach ($c in $candidates) {
                    if (Test-Path $c) {
                        $targetFile = $c
                        break
                    }
                }

                # Fuzzy prefix/suffix matching if direct match not found
                if (-not $targetFile) {
                    $skillsDir = Join-Path $PROJECT_ROOT ".agents\skills"
                    if (Test-Path $skillsDir) {
                        $match = Get-ChildItem -Directory $skillsDir | Where-Object { 
                            $_.Name -eq $skillId -or $_.Name -like "*$skillId*" -or $skillId -like "*$($_.Name)*" 
                        } | Select-Object -First 1
                        if ($match) {
                            $candMd = Join-Path $match.FullName "SKILL.md"
                            if (Test-Path $candMd) { $targetFile = $candMd }
                        }
                    }
                }
            }

            if ($targetFile -and (Test-Path $targetFile)) {
                $content = Get-Content $targetFile -Raw -Encoding UTF8
                Send-Json $res @{
                    ok       = $true
                    skill    = $skillId
                    file     = (Split-Path $targetFile -Leaf)
                    path     = $targetFile
                    size     = (Get-Item $targetFile).Length
                    content  = $content
                }
            } else {
                Send-Json $res @{ ok = $false; error = "Skill file not found for '$skillId' / '$subPath'" } 404
            }
        }
        elseif ($method -eq "POST" -and $path -eq "/apply") {
            $reader  = New-Object System.IO.StreamReader($req.InputStream, [System.Text.Encoding]::UTF8)
            $body    = $reader.ReadToEnd()
            $reader.Close()
            try {
                $data    = $body | ConvertFrom-Json
                $content = $data.content
                Set-Content -Path $GLOBAL_RULES -Value $content -Encoding UTF8
                $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
                Write-Host "  [$ts] Skills applied -> $GLOBAL_RULES"
                Send-Json $res @{ 
                    ok        = $true
                    path      = $GLOBAL_RULES
                    timestamp = $ts
                }
            } catch {
                Write-Host "  [ERROR] $($_.Exception.Message)"
                Send-Json $res @{ ok = $false; error = $_.Exception.Message } 500
            }
        }
        elseif ($method -eq "POST" -and $path -eq "/clear") {
            if (Test-Path $GLOBAL_RULES) { 
                Remove-Item $GLOBAL_RULES -Force 
            }
            $ts = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
            Write-Host "  [$ts] Global active skills memory cleared"
            Send-Json $res @{ ok = $true; path = $GLOBAL_RULES; timestamp = $ts }
        }
        elseif ($method -eq "POST" -and $path -eq "/run-laya") {
            $reader  = New-Object System.IO.StreamReader($req.InputStream, [System.Text.Encoding]::UTF8)
            $body    = $reader.ReadToEnd()
            $reader.Close()
            try {
                $data   = $body | ConvertFrom-Json
                $text   = if ($data.text) { $data.text } else { "Hello" }
                $preset = if ($data.preset) { $data.preset } else { "triage" }

                $runnerScript = Join-Path $PROJECT_ROOT ".agents\skills\laya\scripts\laya_runner.py"
                if (Test-Path $runnerScript) {
                    $psi = New-Object System.Diagnostics.ProcessStartInfo
                    $psi.FileName = "python"
                    $psi.Arguments = "`"$runnerScript`" `"$text`" --preset `"$preset`""
                    $psi.RedirectStandardOutput = $true
                    $psi.RedirectStandardError = $true
                    $psi.UseShellExecute = $false
                    $psi.CreateNoWindow = $true

                    $proc = [System.Diagnostics.Process]::Start($psi)
                    $stdout = $proc.StandardOutput.ReadToEnd()
                    $stderr = $proc.StandardError.ReadToEnd()
                    $proc.WaitForExit()

                    # Extract JSON from stdout
                    $jsonMatch = [regex]::Match($stdout, "\{[\s\S]+\}")
                    if ($jsonMatch.Success) {
                        $parsed = $jsonMatch.Value | ConvertFrom-Json
                        Send-Json $res @{ ok = $true; result = $parsed; raw = $stdout }
                    } else {
                        Send-Json $res @{ ok = $true; output = $stdout; stderr = $stderr }
                    }
                } else {
                    Send-Json $res @{ ok = $false; error = "laya_runner.py not found" } 404
                }
            } catch {
                Send-Json $res @{ ok = $false; error = $_.Exception.Message } 500
            }
        }
        elseif ($method -eq "GET" -and $path -eq "/session-telemetry") {
            $query = $req.Url.Query
            $targetSid = $null
            $targetModel = "gemini-flash"
            if ($query -match "sessionId=([^&]+)") { $targetSid = [System.Net.WebUtility]::UrlDecode($Matches[1]) }
            if ($query -match "model=([^&]+)")     { $targetModel = [System.Net.WebUtility]::UrlDecode($Matches[1]) }
            $telemetry = Get-SessionTelemetryData $targetSid $targetModel
            Send-Json $res $telemetry
        }
        elseif ($method -eq "GET" -and $path -eq "/sessions-list") {
            $sessions = Get-ActiveSessionsList
            Send-Json $res @{
                ok       = $true
                count    = $sessions.Count
                sessions = ($sessions | ForEach-Object { @{ id = $_.id; last_active = $_.last_active; size_kb = [math]::Round($_.size_bytes / 1024, 1) } })
            }
        }
        elseif ($method -eq "GET" -and $path -eq "/token-stats") {
            $query = $req.Url.Query
            $period = "day"
            $model  = "gemini-flash"
            if ($query -match "period=([^&]+)") { $period = [System.Net.WebUtility]::UrlDecode($Matches[1]) }
            if ($query -match "model=([^&]+)")  { $model  = [System.Net.WebUtility]::UrlDecode($Matches[1]) }
            $stats = Get-TokenStats $period $model
            Send-Json $res $stats
        }
        elseif ($method -eq "GET" -and $path -eq "/token-trends") {
            $query = $req.Url.Query
            $days  = 30
            if ($query -match "days=([^&]+)") { 
                try { $days = [int][System.Net.WebUtility]::UrlDecode($Matches[1]) } catch {}
            }
            $trends = Get-TokenTrends $days
            Send-Json $res $trends
        }
        else {
            # Try serving static file if path matches
            $cleanPath = $path.TrimStart("/\").Replace("/", "\")
            $staticCand = Join-Path $TOOL_DIR $cleanPath
            if (Test-Path $staticCand -PathType Leaf) {
                $ext = [System.IO.Path]::GetExtension($staticCand).ToLower()
                $mime = switch ($ext) {
                    ".html" { "text/html; charset=utf-8" }
                    ".css"  { "text/css; charset=utf-8" }
                    ".js"   { "application/javascript; charset=utf-8" }
                    ".json" { "application/json; charset=utf-8" }
                    ".svg"  { "image/svg+xml" }
                    ".md"   { "text/markdown; charset=utf-8" }
                    default { "application/octet-stream" }
                }
                $content = [System.IO.File]::ReadAllBytes($staticCand)
                $res.ContentType = $mime
                $res.ContentLength64 = $content.Length
                $res.OutputStream.Write($content, 0, $content.Length)
            } else {
                $res.StatusCode = 404
                $bytes = [System.Text.Encoding]::UTF8.GetBytes("Not found")
                $res.ContentLength64 = $bytes.Length
                $res.OutputStream.Write($bytes, 0, $bytes.Length)
            }
        }

        if ($null -ne $res) {
            $res.OutputStream.Close()
        }
    }
    catch {
        if ($_.Exception.Message -notmatch "thread") {
            Write-Host "  [WARN] $($_.Exception.Message)"
        }
    }
}
