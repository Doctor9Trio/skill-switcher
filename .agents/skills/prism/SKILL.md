---
name: prism
description: DeFi liquidity stress and toxic order flow detection agent analyzing automated market maker (AMM) pools and swap distributions.
---

# Prism — DeFi Liquidity & Toxic Flow Intelligence Agent

## Overview
**Prism** (`prism-liquidity-agent`) by irfndi is a decentralized finance (DeFi) agent designed to monitor liquidity health across automated market maker (AMM) pools. It ingests swap tick data, price impact curves, and wallet clustering metrics to identify "toxic flow" (arbitrage/sandwich attacks) and scores liquidity stress on liquidity providers.

## Key Capabilities
- **Toxic Flow Scoring**: Distinguishes uninformed retail trade volume from predatory MEV arbitrage.
- **Liquidity Health Index**: Emits a 0–100 pool stability score used to trigger dynamic fee adjustments.
- **Doom-Loop Detection**: Identifies cascading liquidation triggers across interconnected lending pools.

## How to Trigger
```markdown
/prism-liquidity "Evaluate Uniswap v3 pool metrics for toxic flow indicators: slippage=1.4%, volume_spike=320%."
```

## Activation Rules
When this skill is active:
1. Distinguish between organic retail volume and latency-arbitrage flow.
2. Structure pool analysis into standardized liquidity risk dimensions.
