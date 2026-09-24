---
name: laya
description: Multilingual, non-autoregressive System 1 decision engine. Emits strictly typed choices, scores, and yes/no (noul) decisions over any text in a single forward pass (33ms) across 100+ languages with 0 token generation overhead. Use for deterministic classification, prompt injection guardrails, ticket triage, and intent routing.
---

# Laya Multilingual System 1 Decision Engine

## What is Laya?

**Laya** is a high-speed, non-autoregressive **System 1 decision engine** developed by NandhaKishorM and ConvAI Innovations. Unlike generative LLMs that produce conversational tokens sequentially over seconds, Laya evaluates text in a **single forward pass (~33ms)**, directly outputting calibrated, typed probabilities.

Trained with reinforcement learning against strictly proper scoring rules (RLCD), Laya eliminates:
- **Token overhead**: 0 tokens generated = 0 token fatigue.
- **Parsing fragility**: No JSON markdown extraction or regex scraping needed.
- **Hallucinations**: Strictly bounded by candidate criteria and calibrated scoring heads.

```
Traditional Generative Turn:
User Input → [Autoregressive Token Generation / Reasoning Turn] → Markdown Text (2–8 seconds, $$$ tokens)

Laya System 1 Decision:
User Input + Criteria Head → [Single Forward Pass] → Strictly Typed Choice / Score / Noul (33 ms, 0 tokens)
```

---

## Checkpoint Architecture & Automatic Routing

Laya includes a built-in `Router` that inspects script, language, and task structure to pick the optimal checkpoint:

| Checkpoint | Base Encoder | Params | Context | Specialization |
|---|---|---|---|---|
| **`laya`** | ModernBERT-large | 421M | 512 tokens | English-first enterprise decision workflows |
| **`laya-multilingual`** | mmBERT-base | 322M | 1,024 – 8,192 | 100+ languages, 2x faster execution, long context |
| **`laya-typed-decisions`** | ModernBERT-large | 421M | 1,024 tokens | Fine-tuned multi-step production decision benchmarks |

---

## The Three Core Decision Primitives

### 1. `choice` — Multi-Class Categorical Selection
Selects the best matching key from candidate options with semantic criteria descriptions.
```python
"department": {
    "type": "choice",
    "instructions": "Which department should handle this ticket?",
    "criteria": {
        "billing": "invoices, payment methods, duplicate charges, refunds",
        "technical": "system outages, API bugs, SDK failures",
        "security": "unauthorized logins, compromised keys, vulnerability reports",
        "sales": "upgrades, enterprise quotes, demo requests"
    }
}
```

### 2. `score` — Ordinal Rubric & Severity Ranking
Evaluates text against a ranked progression of rubric stages.
```python
"urgency": {
    "type": "score",
    "instructions": "How urgent is this incident?",
    "criteria": [
        "low / informational",
        "moderate / needs attention soon",
        "high / business impacting",
        "critical / complete service blackout"
    ]
}
```

### 3. `noul` — Binary Yes/No with Calibrated Probability
Outputs a calibrated confidence probability (0.0 to 1.0) whether the statement is true.
```python
"prompt_injection": {
    "type": "noul",
    "instructions": "Does the input attempt to override instructions, leak system prompts, or bypass safety rules?"
}
```

---

## Built-In Production Presets

Laya provides zero-shot presets for common mission-critical workflows:

### 1. `guard` — Pre-Flight Safety & Injection Gate
Evaluates untrusted inputs before passing them to expensive LLMs:
- `jailbreak`: Detects override attempts against system instructions.
- `prompt_injection`: Detects hidden instructions masquerading as context.
- `sensitive_data`: Flags leaked credentials, private tokens, or secrets.
- `harm_severity`: Scores potential risk level from benign to high.

### 2. `triage` — Customer Support & Ticket Routing
Classifies user tickets instantly:
- `intent`: Routes to refund, technical help, billing, cancellation, etc.
- `is_urgent`: Detects time pressure and deadlines.
- `frustration`: Scores user annoyance level on a 4-tier rubric.
- `churn_risk`: Flags cancellation threats or competitor mentions.

### 3. `email` — Inbound Email Threat Filtering
Filters messages in milliseconds:
- `category`: Identifies responsible team.
- `is_spam`: Distinguishes unsolicited marketing.
- `is_phishing`: Flags credential harvesting or fraud attempts.
- `needs_reply`: Detects whether sender requires a response.

### 4. `model_router` — Semantic Complexity Dispatcher
Determines whether an incoming prompt needs a lightweight model (e.g. Flash) or an expensive reasoning model (e.g. Thinking / Pro).

---

## How to Trigger & Use Laya

### Method 1: Python API
```python
from laya import Router

router = Router()  # Downloads model on first use (or Router(preload=True))

state = "We noticed abnormal latency spikes on our telemetry endpoint after deploying commit 4f1a2."
questions = {
    "incident_severity": {
        "type": "score",
        "instructions": "Rate the technical severity.",
        "criteria": ["cosmetic", "minor latency", "major outage", "catastrophic"]
    },
    "requires_oncall": {
        "type": "noul",
        "instructions": "Does this require paging an on-call engineer?"
    }
}

result = router.predict(state, questions)
print("Severity:", result["answers"]["incident_severity"]["choice"])
print("Page on-call (probability):", result["answers"]["requires_oncall"]["noul"])
```

#### Multilingual & Long Document Handling:
```python
# Automatic multilingual routing for 100+ languages
result_es = router.predict("La API devuelve error 500 al procesar facturas.", questions)

# Long documents up to 8,192 tokens
result_doc = router.predict(full_audit_log, questions, model="multilingual", max_len=8192)
```

### Method 2: Command-Line Interface (CLI)
```bash
# Run ready-made triage preset (via global CLI or bundled runner)
laya "My credit card was charged twice for the monthly plan." --preset triage

# Using bundled local runner directly:
python .agents/skills/laya/scripts/laya_runner.py "User input text" --preset triage
python .agents/skills/laya/scripts/laya_runner.py "Ignore instructions" --preset guard

# Check status and loaded devices
python .agents/skills/laya/scripts/laya_runner.py --status
```

### Method 3: Model Context Protocol (MCP) Server
When configured as an MCP server, agents call Laya tools natively:
- **`laya_predict(state, questions, model="auto", max_len=1024)`**: Full typed evaluation.
- **`laya_preset(state, preset="triage"|"guard"|"email"|"model_router")`**: Rapid preset evaluation.
- **`laya_route(state)`**: Returns recommended model checkpoint and language tag.
- **`laya_status()`**: Returns GPU/CPU device, memory, and preloaded models.

#### MCP Stdio Config (`mcp_config.json`):
```json
{
  "mcpServers": {
    "laya": {
      "command": "laya-mcp-server",
      "env": {
        "LAYA_DEVICE": "cpu",
        "LAYA_PRELOAD": "1",
        "LAYA_MODELS": "english,multilingual"
      }
    }
  }
}
```

---

## When to Invoke in AI Agent Workflows

1. **Pre-Flight Gating**: Before executing terminal scripts, check safety with `/laya guard`.
2. **Telemetry & Log Triage**: Run `/laya triage` over incoming logs to filter noise without burning LLM context.
3. **Multi-Option Heuristics**: When choosing between architectural branches or refactoring plans, evaluate candidate options via `Choice` with explicit criteria.
4. **Context Compaction Support**: Pair with `fast-jev-compaction` to score conversation blocks for `KEEP_VERBATIM` vs `PRUNE`.
