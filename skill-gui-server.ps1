# =============================================================
#  EKA Skill Switcher - Local Web Server
#  Lives in:  tools/skill-switcher/skill-gui-server.ps1
# =============================================================
param([int]$Port = 7891)

# Dynamic paths - works from any machine
$TOOL_DIR     = $PSScriptRoot
$PROJECT_ROOT = Split-Path $TOOL_DIR -Parent
$GLOBAL_RULES = Join-Path $env:USERPROFILE ".gemini\config\rules\active-skills.md"
$GLOBAL_SKILLS= Join-Path $env:USERPROFILE ".gemini\config\skills"
$GUI_FILE     = Join-Path $TOOL_DIR "skill-gui.html"

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
Write-Host "   EKA Skill Switcher Server  |  Running on Port $actualPort"
Write-Host "  ============================================================="
Write-Host "   GUI URL  -> http://localhost:$actualPort"
Write-Host "   Static   -> $GUI_FILE"
Write-Host "   Root     -> $PROJECT_ROOT"
Write-Host "   Config   -> $GLOBAL_RULES"
Write-Host "  ============================================================="
Write-Host "   Press Ctrl+C to stop."
Write-Host ""

Start-Process "http://localhost:$actualPort"

while ($listener.IsListening) {
    try {
        $ctx    = $listener.GetContext()
        $req    = $ctx.Request
        $res    = $ctx.Response
        $path   = $req.Url.AbsolutePath
        $method = $req.HttpMethod

        if ($method -eq "GET" -and $path -eq "/") {
            $content = [System.IO.File]::ReadAllBytes($GUI_FILE)
            $res.ContentType = "text/html; charset=utf-8"
            $res.ContentLength64 = $content.Length
            $res.OutputStream.Write($content, 0, $content.Length)
        }
        elseif ($method -eq "GET" -and $path -eq "/verify-skills") {
            $skillsMap = @{}
            
            # Local .agents/skills check (checks both tool dir and parent workspace root)
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
            
            # Global skills check
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

            $respData = @{
                ok           = $true
                project_root = $PROJECT_ROOT
                total_found  = $skillsMap.Count
                skills       = $skillsMap
            }
            $json  = ConvertTo-Json $respData -Depth 4
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
            $res.ContentType = "application/json"
            $res.ContentLength64 = $bytes.Length
            $res.OutputStream.Write($bytes, 0, $bytes.Length)
        }
        elseif ($method -eq "GET" -and $path -eq "/status") {
            $active = "None"
            if (Test-Path $GLOBAL_RULES) {
                $txt = Get-Content $GLOBAL_RULES -Raw -ErrorAction SilentlyContinue
                if ($txt -match "Active: (.+)") { $active = $Matches[1] }
            }
            $json  = ConvertTo-Json @{ ok = $true; active = $active }
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
            $res.ContentType = "application/json"
            $res.ContentLength64 = $bytes.Length
            $res.OutputStream.Write($bytes, 0, $bytes.Length)
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
                $json = ConvertTo-Json @{ ok = $true; path = $GLOBAL_RULES }
            } catch {
                $json = ConvertTo-Json @{ ok = $false; error = $_.Exception.Message }
                Write-Host "  [ERROR] $($_.Exception.Message)"
            }
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
            $res.ContentType = "application/json"
            $res.ContentLength64 = $bytes.Length
            $res.OutputStream.Write($bytes, 0, $bytes.Length)
        }
        elseif ($method -eq "POST" -and $path -eq "/clear") {
            if (Test-Path $GLOBAL_RULES) { Remove-Item $GLOBAL_RULES -Force }
            $json  = ConvertTo-Json @{ ok = $true }
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
            $res.ContentType = "application/json"
            $res.ContentLength64 = $bytes.Length
            $res.OutputStream.Write($bytes, 0, $bytes.Length)
            $ts = (Get-Date).ToString("HH:mm:ss")
            Write-Host "  [$ts] Global skills cleared"
        }
        else {
            $res.StatusCode = 404
            $bytes = [System.Text.Encoding]::UTF8.GetBytes("Not found")
            $res.ContentLength64 = $bytes.Length
            $res.OutputStream.Write($bytes, 0, $bytes.Length)
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
