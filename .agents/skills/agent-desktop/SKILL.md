---
name: agent-desktop
description: OS-level accessibility tree desktop automation where Jev evaluates native UI element trees to execute desktop clicks and typing.
---

# Agent-Desktop — Native Desktop UI Automation

## Overview
**agent-desktop** by lahfir provides native operating system automation. Rather than relying on computer vision screenshot inference (which is slow, fragile, and resolution-dependent), agent-desktop reads the native OS Accessibility Tree (UI Automation on Windows / AX on macOS) and calls Jev to select which UI element to focus, click, or type into.

## Key Capabilities
- **Accessibility-Driven Targeting**: Inspects element IDs, bounding boxes, and control types directly from the OS.
- **Fast Execution**: Operates at 3–5 actions per second.
- **Cross-App Workflows**: Automates native tools, desktop browsers, terminals, and IDE windows.

## How to Trigger
```markdown
/desktop-act "Open PowerShell, type git status, and copy the branch name."
```

## Activation Rules
When this skill is active:
1. Always parse native accessibility trees before falling back to pixel screenshot analysis.
2. Confirm focus state before sending keystrokes to prevent accidental input execution.
