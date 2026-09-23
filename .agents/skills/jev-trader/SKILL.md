---
name: jev-trader
description: Market-making and short-term directional decision bot on Monad testnet evaluating order book spreads and slippage.
---

# JEV Trader — High-Frequency Market-Making Decision Agent

## Overview
**jev-trader** by Jarrod Watts is an automated market-making experiment built on the high-throughput Monad testnet. It streams Level 2 order book data (bids, asks, liquidity depth, spread volatility) into a structured schema, and Jev outputs tactical trade choices (`WIDEN_SPREAD`, `POST_BID`, `CANCEL_ASK`, `HOLD`) while traditional execution smart contracts manage wallet safety and transaction signing.

## Key Principles
- **Execution Safety**: Jev never has custody of private keys; it outputs signed order parameter recommendations to an isolated execution contract.
- **Microsecond Awareness**: Operates on sub-second order book shifts.

## How to Trigger
```markdown
/jev-trade "Analyze L2 order book spread: bid_depth=45k, ask_depth=12k, volatility=0.08. Recommendation?"
```

## Activation Rules
When this skill is active:
1. Always enforce strict stop-loss and position limits in the execution layer.
2. Structure market metrics into normalized numerical arrays.
