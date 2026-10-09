---
name: ralph-loop
description: "The persistent autonomous agent execution loop pattern (Ralph Wiggum Loop). Prevents context rot and degradation by restarting agent turns with fresh context, using the filesystem, Git history, and TODO files as persistent external memory."
---

# Ralph Loop: Autonomous Persistent Agent Execution

> Formulated by Geoffrey Huntley. Known as the Ralph Wiggum Loop methodology.

The **Ralph Loop** solves the universal weakness of long-running AI coding sessions: *context rot* (performance degradation, repetitive looping, hallucination, and early abandonment caused by saturated token windows).

---

## 1. Core Operating Philosophy

Instead of attempting to keep an infinite conversation alive across hundreds of turns:
1. **Fresh Context Every Turn**: The agent starts with zero conversational bloat on every iteration.
2. **Filesystem as Memory**: State is never stored in model chat history; it lives in `TODO.md`, git commits, test outputs, and disk artifacts.
3. **Persistent Re-execution**: A driver loop repeatedly executes the agent with a stable top-level objective until all verifiable criteria pass.
4. **Relentless Forward Progress**: The agent inspects `git status` and test logs to figure out what was done and what remains.

---

## 2. Minimal Driver Implementation

### Shell / Bash Driver
```bash
#!/usr/bin/env bash
set -e

# Loop continuously until all tests pass
while ! npm test; do
  echo "--- Running Ralph Loop iteration with fresh context ---"
  cat OBJECTIVE.md | claude --dangerously-skip-permissions
  git add .
  git commit -m "ralph: autonomous progress iteration" || true
done

echo "=== All tests green! Ralph Loop complete. ==="
```

### PowerShell Driver (Windows)
```powershell
$objective = Get-Content -Raw "OBJECTIVE.md"

while ($true) {
    # Check exit gate (e.g. test runner)
    & npm test
    if ($LASTEXITCODE -eq 0) {
        Write-Host "All criteria satisfied! Ralph Loop exiting successfully." -ForegroundColor Green
        break
    }
    
    Write-Host "Running next Ralph iteration..." -ForegroundColor Cyan
    # Execute agent CLI with objective prompt
    $objective | & agent-cli --non-interactive
    
    # Checkpoint progress to Git
    git add -A
    git commit -m "ralph: iteration step checkpoint" -q
}
```

---

## 3. Mandatory Agent Behavior Inside a Ralph Loop

When operating within a Ralph Loop, the agent must follow these rules:

1. **Orientation First**: At the start of the turn, immediately inspect the disk:
   - Check `git status` and `git log -n 3` to see what changed previously.
   - Run tests or check `TODO.md` to identify failures.
2. **Atomic Units of Work**: Pick the single highest-priority failing test or unfinished checklist item. Do not attempt to fix 10 things at once.
3. **Verify Locally**: Run the test runner or linter before finishing the turn.
4. **Document on Disk**: Update `TODO.md` or write a short note in `.ralph_log` so the next fresh iteration has unambiguous ground truth.
5. **Exit Cleanly**: End the turn promptly so the driver can checkpoint git and respawn the next fresh cycle.
