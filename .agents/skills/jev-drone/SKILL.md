---
name: jev-drone
description: Tactical flight decision controller in MuJoCo physics simulation operating at 2.5Hz while classical control systems handle high-speed quadcopter stability.
---

# JEV Drone — Tactical Decision Controller for Simulated Flight

## Overview
**jev-drone** by Roman Slack explores hierarchical autonomy in robotics. In a MuJoCo 3D physics simulator, a quadcopter drone must navigate unknown obstacle fields. High-frequency motor control and balance (100Hz) are handled by a classical PID / geometric controller, while Jev provides tactical judgment at 2.5Hz (choosing between `CLIMB`, `DECELERATE`, `ORBIT_LEFT`, or `HOLD_WAYPOINT`).

## Key Principles
- **Hierarchical Separation**: Never use AI for high-frequency low-level stabilization; use AI for strategic/tactical choices.
- **Sensor Distillation**: Lidar depth scans and obstacle vectors are reduced to a sparse distance matrix before Jev scoring.

## How to Trigger
```markdown
/drone-sim "Given obstacle telemetry at 5m bearing 045°, select tactical evasion vector."
```

## Activation Rules
When this skill is active:
1. Isolate high-speed physical control from low-frequency strategic decisions.
2. Structure navigation telemetry into bounded directional choices.
