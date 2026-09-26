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
            if ($query -match "skill=([^&]+)") { $skillId = [System.Web.HttpUtility]::UrlDecode($Matches[1]) }
            if ($query -match "path=([^&]+)")  { $subPath = [System.Web.HttpUtility]::UrlDecode($Matches[1]) }

            $targetFile = $null

            if ($subPath) {
                $cleanSub = $subPath.TrimStart("/\").Replace("/", "\")
                $cand = Join-Path $PROJECT_ROOT $cleanSub
                if (Test-Path $cand) { $targetFile = $cand }
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
