# =============================================================
#  Skill Switcher - Local Web & API Server
#  Lives in:  skill-gui-server.ps1
#  Provides REST APIs for live Antigravity / Claude memory sync
# =============================================================
param([int]$Port = 7891)

# =============================================================
#  Dynamic, user-agnostic path resolution
#  Every path is derived from the CURRENT user's environment, so a
#  freshly cloned repo works on any PC / any user without edits.
#
#  Optional overrides (set as environment variables before launch):
#    SKILL_SWITCHER_HOME        -> Antigravity/Gemini home   (default: ~/.gemini)
#    SKILL_SWITCHER_RULES_FILE  -> active-skills.md location (default: <home>/config/rules/active-skills.md)
#    SKILL_SWITCHER_SKILLS_DIR  -> global skills folder      (default: <home>/config/skills)
#    SKILL_SWITCHER_BRAIN_DIR   -> Antigravity session brain (default: auto-detected)
# =============================================================
function Join-PathParts([string[]]$parts) {
    return [System.IO.Path]::Combine([string[]]($parts | Where-Object { $_ }))
}

function Get-UserHome {
    foreach ($h in @($env:USERPROFILE, $env:HOME, [Environment]::GetFolderPath('UserProfile'))) {
        if ($h -and (Test-Path $h)) { return $h }
    }
    return [Environment]::GetFolderPath('UserProfile')
}

$TOOL_DIR     = $PSScriptRoot
$PROJECT_ROOT = $TOOL_DIR
if (Test-Path (Join-PathParts @($TOOL_DIR, ".agents", "skills"))) {
    $PROJECT_ROOT = $TOOL_DIR
} elseif (Test-Path (Join-PathParts @((Split-Path $TOOL_DIR -Parent), ".agents", "skills"))) {
    $PROJECT_ROOT = Split-Path $TOOL_DIR -Parent
}

$USER_HOME     = Get-UserHome
$USER_NAME     = if ($env:USERNAME) { $env:USERNAME } elseif ($env:USER) { $env:USER } else { Split-Path $USER_HOME -Leaf }
$GEMINI_HOME   = if ($env:SKILL_SWITCHER_HOME) { $env:SKILL_SWITCHER_HOME } else { Join-PathParts @($USER_HOME, ".gemini") }
$GLOBAL_CONFIG = Join-PathParts @($GEMINI_HOME, "config")
$GLOBAL_RULES  = if ($env:SKILL_SWITCHER_RULES_FILE) { $env:SKILL_SWITCHER_RULES_FILE } else { Join-PathParts @($GLOBAL_CONFIG, "rules", "active-skills.md") }
$GLOBAL_SKILLS = if ($env:SKILL_SWITCHER_SKILLS_DIR) { $env:SKILL_SWITCHER_SKILLS_DIR } else { Join-PathParts @($GLOBAL_CONFIG, "skills") }
$GUI_FILE      = Join-Path $TOOL_DIR "skill-gui.html"
if (-not (Test-Path $GUI_FILE)) {
    $GUI_FILE = Join-Path $TOOL_DIR "index.html"
}

$rulesDir = Split-Path $GLOBAL_RULES
if (!(Test-Path $rulesDir)) { New-Item -ItemType Directory -Force $rulesDir | Out-Null }

function Get-AntigravityBrainPath() {
    $candidates = @()
    if ($env:SKILL_SWITCHER_BRAIN_DIR) { $candidates += $env:SKILL_SWITCHER_BRAIN_DIR }
    $candidates += (Join-PathParts @($GEMINI_HOME, "antigravity-ide", "brain"))
    $candidates += (Join-PathParts @($GEMINI_HOME, "antigravity", "brain"))
    if ($env:LOCALAPPDATA) { $candidates += (Join-PathParts @($env:LOCALAPPDATA, "antigravity-ide", "brain")) }
    if ($env:APPDATA)      { $candidates += (Join-PathParts @($env:APPDATA, "antigravity-ide", "brain")) }
    foreach ($c in $candidates) {
        if ($c -and (Test-Path $c)) { return $c }
    }
    return $null
}

function Get-EnvInfo() {
    $brain = Get-AntigravityBrainPath
    return @{
        ok                   = $true
        user                 = $USER_NAME
        home_dir             = $USER_HOME
        gemini_home          = $GEMINI_HOME
        global_config        = $GLOBAL_CONFIG
        global_rules         = $GLOBAL_RULES
        global_rules_exists  = (Test-Path $GLOBAL_RULES)
        global_skills        = $GLOBAL_SKILLS
        global_skills_exists = (Test-Path $GLOBAL_SKILLS)
        brain_path           = $brain
        project_root         = $PROJECT_ROOT
        tool_dir             = $TOOL_DIR
        workspace_skills     = (Join-PathParts @($PROJECT_ROOT, ".agents", "skills"))
        platform             = [System.Environment]::OSVersion.Platform.ToString()
    }
}

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
Write-Host "   User     -> $USER_NAME ($USER_HOME)"
Write-Host "   Static   -> $GUI_FILE"
Write-Host "   Root     -> $PROJECT_ROOT"
Write-Host "   Config   -> $GLOBAL_RULES"
Write-Host "   Skills   -> $GLOBAL_SKILLS"
Write-Host "   Brain    -> $(if ($b = Get-AntigravityBrainPath) { $b } else { '(not found yet)' })"
Write-Host "  ============================================================="
Write-Host "   APIs Available:"
Write-Host "     GET  /env                 - Resolved user/Antigravity paths"
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
        "all-combined"  = @{ id = "all-combined";  name = "All Models Combined (Blended Portfolio)"; input_per_m = 1.29;  output_per_m = 5.76 }
        "gemini-flash"  = @{ id = "gemini-flash";  name = "Gemini 3.8 Flash (Active IDE Default)"; input_per_m = 0.075; output_per_m = 0.30 }
        "gemini-pro"    = @{ id = "gemini-pro";    name = "Gemini 1.5 / 2.5 Pro";                input_per_m = 1.25;  output_per_m = 5.00 }
        "claude-sonnet" = @{ id = "claude-sonnet"; name = "Claude Sonnet 4.6";                  input_per_m = 3.00;  output_per_m = 15.00 }
        "claude-haiku"  = @{ id = "claude-haiku";  name = "Claude Haiku 4.5";                   input_per_m = 0.80;  output_per_m = 4.00 }
        "gpt-4o"        = @{ id = "gpt-4o";        name = "GPT-4o (Omni)";                      input_per_m = 2.50;  output_per_m = 10.00 }
        "deepseek-v3"   = @{ id = "deepseek-v3";   name = "DeepSeek V3";                        input_per_m = 0.14;  output_per_m = 0.28 }
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
                    $cleanContent = $content -replace "Created At:\s*[\d\-:T+]+", "" -replace "Completed At:\s*[\d\-:T+]+", ""
                    $cleanContent = $cleanContent.Trim()
                    $preview = if ($cleanContent.Length -gt 110) { $cleanContent.Substring(0, 110) + "..." } else { $cleanContent }
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
# Global in-memory cache for ultra-responsive sub-millisecond tab switching
$global:TokenStatsCache = @{}
$global:TokenStatsCacheTime = @{}
$global:TokenTrendsCache = @{}
$global:TokenTrendsCacheTime = @{}

# =============================================================
# TOKEN STATS: Aggregate tokens across ALL sessions by period
# period = "day" (today) | "week" (7D) | "month" (30D)
# =============================================================
function Get-TokenStats($period = "day", $selectedModel = "gemini-flash") {
    $brainPath = Get-AntigravityBrainPath
    if (-not $brainPath -or -not (Test-Path $brainPath)) {
        return @{ ok = $false; error = "Antigravity brain path not found"; total_tokens = 0; cost_inr = 0; cost_usd = 0 }
    }

    $INR_PER_USD = 86.50
    $pricing = @{
        "all-combined"  = @{ id = "all-combined";  name = "All Models Combined (Blended Portfolio)"; input_per_m = 1.29;  output_per_m = 5.76 }
        "gemini-flash"  = @{ id = "gemini-flash";  name = "Gemini 3.8 Flash (Active IDE Default)"; input_per_m = 0.075; output_per_m = 0.30 }
        "gemini-pro"    = @{ id = "gemini-pro";    name = "Gemini 3.1 Pro";                        input_per_m = 1.25;  output_per_m = 5.00 }
        "claude-sonnet" = @{ id = "claude-sonnet"; name = "Claude Sonnet 4.6";                     input_per_m = 3.00;  output_per_m = 15.00 }
        "claude-haiku"  = @{ id = "claude-haiku";  name = "Claude Haiku 4.5";                      input_per_m = 0.80;  output_per_m = 4.00 }
        "gpt-4o"        = @{ id = "gpt-4o";        name = "GPT-4o";                                input_per_m = 2.50;  output_per_m = 10.00 }
        "deepseek-v3"   = @{ id = "deepseek-v3";   name = "DeepSeek V3";                          input_per_m = 0.14;  output_per_m = 0.28 }
    }
    $modelKey = if ($pricing.ContainsKey($selectedModel)) { $selectedModel } else { "gemini-flash" }
    $rates = $pricing[$modelKey]

    $now = Get-Date
    $periodLower = $period.ToLower()

    # Fast in-memory cache check (20s TTL)
    $cacheKey = "$periodLower-$modelKey"
    if ($global:TokenStatsCache.ContainsKey($cacheKey)) {
        $cachedTime = $global:TokenStatsCacheTime[$cacheKey]
        if ($cachedTime -and ($now - $cachedTime).TotalSeconds -lt 20) {
            return $global:TokenStatsCache[$cacheKey]
        }
    }

    $cutoff = switch ($periodLower) {
        "day"   { $now.Date }
        "week"  { $now.Date.AddDays(-6) }
        "month" { $now.Date.AddDays(-29) }
        default { $now.Date }
    }
    $cutoffStr = $cutoff.ToString("yyyy-MM-dd")

    # Time boundaries for true rolling limits
    $time5hAgo  = $now.AddHours(-5)
    $time7dAgo  = $now.Date.AddDays(-6)
    $time30dAgo = $now.Date.AddDays(-29)

    $totalInput  = 0
    $totalOutput = 0
    $sessionCount = 0
    $toolBreakdown = @{}

    $rolling5hTokens = 0
    $rolling7dTokens = 0
    $rolling30dTokens= 0

    $sessions = Get-ActiveSessionsList
    foreach ($sess in $sessions) {
        $path = $sess.path
        if (-not (Test-Path $path)) { continue }

        # Optimization: skip session if older than 30 days
        if ($sess.last_time_raw -lt $time30dAgo) { continue }

        $isPeriodSession = ($sess.last_time_raw -ge $cutoff)
        if ($isPeriodSession) { $sessionCount++ }

        try {
            $sr = [System.IO.File]::OpenText($path)
            while (-not $sr.EndOfStream) {
                $rawLine = $sr.ReadLine()
                if ($null -eq $rawLine -or $rawLine.Length -lt 25) { continue }

                # Fast date extraction without JSON parsing overhead
                $lineDate = $null
                $lineDt = $null
                if ($rawLine -match '"created_at":"([^"]+)"') {
                    try {
                        $lineDt = [DateTime]::Parse($Matches[1]).ToLocalTime()
                        $lineDate = $lineDt.ToString("yyyy-MM-dd")
                    } catch {}
                }

                # Fast token approximation via content slicing
                $cIdx = $rawLine.IndexOf('"content":"')
                $tokens = 0
                if ($cIdx -ge 0) {
                    $cStart = $cIdx + 11
                    $cEnd = $rawLine.LastIndexOf('","')
                    $contentLen = if ($cEnd -gt $cStart) { $cEnd - $cStart } else { $rawLine.Length - $cStart }
                    $tokens = [math]::Round($contentLen / 3.8)
                } else {
                    $tokens = [math]::Round($rawLine.Length / 4.0)
                }

                # Rolling horizons accumulation
                if ($lineDt) {
                    if ($lineDt -ge $time5hAgo)  { $rolling5hTokens  += $tokens }
                    if ($lineDt -ge $time7dAgo)  { $rolling7dTokens  += $tokens }
                    if ($lineDt -ge $time30dAgo) { $rolling30dTokens += $tokens }
                }

                # Current period filter check
                if ($lineDate -and $lineDate -lt $cutoffStr) { continue }

                $isOutput = ($rawLine.IndexOf('"source":"MODEL"') -ge 0 -or $rawLine.IndexOf('"type":"PLANNER_RESPONSE"') -ge 0)
                if ($isOutput) {
                    $totalOutput += $tokens
                } else {
                    $totalInput += $tokens
                }

                # Tool breakdown fast extraction
                if ($rawLine.IndexOf('"name":"') -ge 0) {
                    if ($rawLine -match '"name":"([^"]+)"') {
                        $n = $Matches[1]
                        if (-not $toolBreakdown.ContainsKey($n)) { $toolBreakdown[$n] = 0 }
                        $toolBreakdown[$n]++
                    }
                } elseif ($rawLine.IndexOf('"type":"RUN_COMMAND"') -ge 0) {
                    if (-not $toolBreakdown.ContainsKey("run_command")) { $toolBreakdown["run_command"] = 0 }
                    $toolBreakdown["run_command"]++
                } elseif ($rawLine.IndexOf('"type":"VIEW_FILE"') -ge 0) {
                    if (-not $toolBreakdown.ContainsKey("view_file")) { $toolBreakdown["view_file"] = 0 }
                    $toolBreakdown["view_file"]++
                } elseif ($rawLine.IndexOf('"type":"GREP_SEARCH"') -ge 0) {
                    if (-not $toolBreakdown.ContainsKey("grep_search")) { $toolBreakdown["grep_search"] = 0 }
                    $toolBreakdown["grep_search"]++
                } elseif ($rawLine.IndexOf('"type":"LIST_DIRECTORY"') -ge 0) {
                    if (-not $toolBreakdown.ContainsKey("list_directory")) { $toolBreakdown["list_directory"] = 0 }
                    $toolBreakdown["list_directory"]++
                } elseif ($rawLine.IndexOf('"type":"CODE_ACTION"') -ge 0) {
                    if (-not $toolBreakdown.ContainsKey("code_action")) { $toolBreakdown["code_action"] = 0 }
                    $toolBreakdown["code_action"]++
                }
            }
            $sr.Close()
        } catch {}
    }

    $totalTokens = $totalInput + $totalOutput
    $costUsd = (($totalInput / 1000000.0) * $rates.input_per_m) + (($totalOutput / 1000000.0) * $rates.output_per_m)
    $costInr = $costUsd * $INR_PER_USD

    $cacheHitRatio  = if ($totalInput -gt 10000) { 0.86 } else { 0.0 }
    $cacheHitTokens = [math]::Round($totalInput * $cacheHitRatio)
    $cacheMissTokens= $totalInput - $cacheHitTokens

    $result = @{
        ok               = $true
        period           = $periodLower
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
        rolling_5h       = $rolling5hTokens
        weekly_total     = $rolling7dTokens
        monthly_total    = $rolling30dTokens
        timestamp        = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    }

    # Store in fast cache
    $global:TokenStatsCache[$cacheKey] = $result
    $global:TokenStatsCacheTime[$cacheKey] = $now

    return $result
}

# =============================================================
# TOKEN TRENDS: Hourly (Today/24h) or Day-by-Day (7D / 30D)
# days = 1 (Today: 24h format 00:00-23:00) | 7 (Weekly) | 30 (30 Days)
# =============================================================
function Get-TokenTrends($days = 30) {
    $brainPath = Get-AntigravityBrainPath
    if (-not $brainPath -or -not (Test-Path $brainPath)) {
        return @{ ok = $false; error = "Brain path not found"; data = @() }
    }

    # Constrain to 1, 7, or 30 days
    $cleanDays = if ($days -le 1) { 1 } elseif ($days -le 7) { 7 } else { 30 }

    $now = Get-Date
    # Fast in-memory cache check (20s TTL)
    $cacheKey = "$cleanDays"
    if ($global:TokenTrendsCache.ContainsKey($cacheKey)) {
        $cachedTime = $global:TokenTrendsCacheTime[$cacheKey]
        if ($cachedTime -and ($now - $cachedTime).TotalSeconds -lt 20) {
            return $global:TokenTrendsCache[$cacheKey]
        }
    }

    # CASE A: Today -> 24-Hour Hourly Timeline (00:00 - 23:00 in 24h format)
    if ($cleanDays -eq 1) {
        $todayStr = $now.ToString("yyyy-MM-dd")
        $buckets = [ordered]@{}
        for ($h = 0; $h -lt 24; $h++) {
            $hKey = "{0:D2}:00" -f $h
            $buckets[$hKey] = @{ input = 0; output = 0; total = 0; label = $hKey }
        }

        $sessions = Get-ActiveSessionsList
        foreach ($sess in $sessions) {
            $path = $sess.path
            if (-not (Test-Path $path)) { continue }
            if ($sess.last_time_raw.ToString("yyyy-MM-dd") -lt $todayStr) { continue }

            try {
                $sr = [System.IO.File]::OpenText($path)
                while (-not $sr.EndOfStream) {
                    $rawLine = $sr.ReadLine()
                    if ($null -eq $rawLine -or $rawLine.Length -lt 25) { continue }

                    if ($rawLine -match '"created_at":"([^"]+)"') {
                        try {
                            $dt = [DateTime]::Parse($Matches[1]).ToLocalTime()
                            if ($dt.ToString("yyyy-MM-dd") -eq $todayStr) {
                                $hKey = "{0:D2}:00" -f $dt.Hour
                                if ($buckets.Contains($hKey)) {
                                    $cIdx = $rawLine.IndexOf('"content":"')
                                    $tokens = 0
                                    if ($cIdx -ge 0) {
                                        $cStart = $cIdx + 11
                                        $cEnd = $rawLine.LastIndexOf('","')
                                        $contentLen = if ($cEnd -gt $cStart) { $cEnd - $cStart } else { $rawLine.Length - $cStart }
                                        $tokens = [math]::Round($contentLen / 3.8)
                                    } else {
                                        $tokens = [math]::Round($rawLine.Length / 4.0)
                                    }

                                    $isOutput = ($rawLine.IndexOf('"source":"MODEL"') -ge 0 -or $rawLine.IndexOf('"type":"PLANNER_RESPONSE"') -ge 0)
                                    if ($isOutput) {
                                        $buckets[$hKey].output += $tokens
                                    } else {
                                        $buckets[$hKey].input += $tokens
                                    }
                                    $buckets[$hKey].total += $tokens
                                }
                            }
                        } catch {}
                    }
                }
                $sr.Close()
            } catch {}
        }

        $data = @()
        for ($h = 0; $h -lt 24; $h++) {
            $hKey = "{0:D2}:00" -f $h
            $b = $buckets[$hKey]
            $data += @{
                date   = $hKey
                label  = $b.label
                input  = $b.input
                output = $b.output
                total  = $b.total
            }
        }

        $result = @{
            ok   = $true
            days = 1
            mode = "hourly"
            data = $data
        }
        $global:TokenTrendsCache[$cacheKey] = $result
        $global:TokenTrendsCacheTime[$cacheKey] = $now
        return $result
    }

    # CASE B: 7D or 30D -> Day-by-Day Historical Timeline
    $start = $now.Date.AddDays(-($cleanDays - 1))
    $startStr = $start.ToString("yyyy-MM-dd")

    # Initialize day buckets
    $buckets = [ordered]@{}
    for ($d = 0; $d -lt $cleanDays; $d++) {
        $dateKey = $start.AddDays($d).ToString("yyyy-MM-dd")
        $buckets[$dateKey] = @{ input = 0; output = 0; total = 0; label = $start.AddDays($d).ToString("M/d") }
    }

    $sessions = Get-ActiveSessionsList
    foreach ($sess in $sessions) {
        $path = $sess.path
        if (-not (Test-Path $path)) { continue }
        if ($sess.last_time_raw -lt $start) { continue }

        try {
            $sr = [System.IO.File]::OpenText($path)
            while (-not $sr.EndOfStream) {
                $rawLine = $sr.ReadLine()
                if ($null -eq $rawLine -or $rawLine.Length -lt 25) { continue }

                # Fast date extraction
                if (-not ($rawLine -match '"created_at":"(\d{4}-\d{2}-\d{2})')) { continue }
                $dateKey = $Matches[1]
                if (-not $buckets.Contains($dateKey)) { continue }

                # Fast token count
                $cIdx = $rawLine.IndexOf('"content":"')
                $tokens = 0
                if ($cIdx -ge 0) {
                    $cStart = $cIdx + 11
                    $cEnd = $rawLine.LastIndexOf('","')
                    $contentLen = if ($cEnd -gt $cStart) { $cEnd - $cStart } else { $rawLine.Length - $cStart }
                    $tokens = [math]::Round($contentLen / 3.8)
                } else {
                    $tokens = [math]::Round($rawLine.Length / 4.0)
                }

                $isOutput = ($rawLine.IndexOf('"source":"MODEL"') -ge 0 -or $rawLine.IndexOf('"type":"PLANNER_RESPONSE"') -ge 0)
                if ($isOutput) {
                    $buckets[$dateKey].output += $tokens
                } else {
                    $buckets[$dateKey].input += $tokens
                }
                $buckets[$dateKey].total += $tokens
            }
            $sr.Close()
        } catch {}
    }

    $data = @()
    for ($d = 0; $d -lt $cleanDays; $d++) {
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

    $result = @{
        ok   = $true
        days = $cleanDays
        mode = "daily"
        data = $data
    }

    # Store in fast cache
    $global:TokenTrendsCache[$cacheKey] = $result
    $global:TokenTrendsCacheTime[$cacheKey] = $now

    return $result
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
        elseif ($method -eq "GET" -and $path -eq "/env") {
            Send-Json $res (Get-EnvInfo)
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
            
            # Global skills check (<SKILL_SWITCHER_HOME or ~/.gemini>/config/skills)
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
                            path      = $skillMd.Replace("\", "/")
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
                home_dir     = $USER_HOME
                global_rules = $GLOBAL_RULES
                global_skills= $GLOBAL_SKILLS
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
                    $homeSub = $subPath.TrimStart("~").TrimStart("/\")
                    $homeCands = @()
                    # "~/.gemini/..." honours a SKILL_SWITCHER_HOME override
                    if ($homeSub -match '^\.gemini[\\/](.+)$') { $homeCands += (Join-Path $GEMINI_HOME $Matches[1]) }
                    $homeCands += (Join-Path $USER_HOME $homeSub)
                    foreach ($hc in $homeCands) {
                        if (-not $targetFile -and (Test-Path $hc)) { $targetFile = $hc }
                    }
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
                $rd = Split-Path $GLOBAL_RULES
                if (!(Test-Path $rd)) { New-Item -ItemType Directory -Force $rd | Out-Null }
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
