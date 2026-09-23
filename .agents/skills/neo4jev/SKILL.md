---
name: neo4jev
description: Semantic pathfinding agent for Neo4j knowledge graphs using Jev to score and choose outgoing relationship edges during graph traversal.
---

# Neo4Jev — Semantic Graph Pathfinding with JEV

## Overview
**neo4jev** by Michael Hunger (`jexp`) integrates Neo4j graph databases with Jev System One decision scoring. In complex knowledge graphs where nodes have dozens of outgoing relationships, traditional Dijkstra or A* algorithms struggle with semantic relevance. Neo4Jev calls Jev at each step to score which outgoing edge is most semantically relevant to a target inquiry, enabling intelligent graph exploration.

## Key Capabilities
- **Semantic Edge Gating**: Heuristically scores edge weights based on natural language intent.
- **Sub-Graph Pruning**: Prevents combinatorial explosion in dense multi-relational graphs.
- **Cypher Query Synthesis**: Emits targeted Cypher queries guided by Jev path scoring.

## How to Trigger
```markdown
/graph-traverse "Given start node 'TransitHub' and goal 'ElectricBusRouting', score outgoing relationships for traversal."
```

## Activation Rules
When this skill is active:
1. Model complex relational entities as directed graph nodes and typed edges.
2. Use discrete edge scoring rather than open-ended string matching when traversing relationships.
