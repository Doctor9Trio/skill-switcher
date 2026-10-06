#!/usr/bin/env bash
# =============================================================
# Skill Switcher - Mac & Linux 1-Click Launcher
# =============================================================

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
PORT=7891

echo "=============================================================="
echo "  Doctor9Trio / Skill Switcher  |  Offline-First AI Tools   "
echo "=============================================================="
echo "  User home : $HOME"
echo "  Rules file: ${SKILL_SWITCHER_RULES_FILE:-${SKILL_SWITCHER_HOME:-$HOME/.gemini}/config/rules/active-skills.md}"
echo "=============================================================="

# Preferred: full API server (live Apply / Sync / Telemetry) via PowerShell 7+.
# All paths are resolved from the current user's $HOME automatically.
if command -v pwsh &>/dev/null; then
    echo "Starting full API server via pwsh..."
    exec pwsh -NoLogo -File "$DIR/skill-gui-server.ps1" -Port "$PORT"
fi

echo "  (pwsh not found -> static mode; 'Apply' will copy rules to clipboard."
echo "   Install PowerShell 7 for live disk sync: https://aka.ms/powershell)"
echo "  Target URL: http://localhost:$PORT/skill-gui.html"
echo "=============================================================="

if command -v python3 &>/dev/null; then
    echo "Starting local server on port $PORT..."
    python3 -m http.server $PORT --directory "$DIR" &
    SERVER_PID=$!
    sleep 1

    if command -v xdg-open &>/dev/null; then
        xdg-open "http://localhost:$PORT/skill-gui.html"
    elif command -v open &>/dev/null; then
        open "http://localhost:$PORT/skill-gui.html"
    else
        echo "Server running! Open http://localhost:$PORT/skill-gui.html in your browser."
    fi
    wait $SERVER_PID
elif command -v open &>/dev/null; then
    open "$DIR/skill-gui.html"
elif command -v xdg-open &>/dev/null; then
    xdg-open "$DIR/skill-gui.html"
else
    echo "Please open $DIR/skill-gui.html directly in your web browser."
fi
