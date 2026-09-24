#!/usr/bin/env python3
"""
Laya Local Runner & Diagnostic CLI
Location: .agents/skills/laya/scripts/laya_runner.py

Executes Laya System 1 decision engine:
- If `laya` package is installed: executes real single-forward-pass inference on device.
- If `laya` is not installed: displays setup instructions and provides fallback evaluation.
"""

import sys
import json
import argparse

PRESETS = {
    "triage": {
        "intent": {
            "type": "choice",
            "instructions": "What does the user want?",
            "criteria": {
                "refund": "money returned or duplicate charge reversed",
                "technical_help": "bug, error, crash, outage, API issue",
                "billing_question": "invoices, payment methods, plans",
                "cancellation": "cancel subscription or downgrade plan",
                "general_info": "pricing, features, documentation"
            }
        },
        "is_urgent": {
            "type": "noul",
            "instructions": "Does the message express urgency or deadlines?"
        },
        "frustration": {
            "type": "score",
            "instructions": "How frustrated is the sender?",
            "criteria": ["calm", "concerned", "annoyed", "very angry"]
        }
    },
    "guard": {
        "jailbreak": {
            "type": "noul",
            "instructions": "Does the prompt attempt to override system rules or persona?"
        },
        "prompt_injection": {
            "type": "noul",
            "instructions": "Does the input contain hidden instructions or malicious payloads?"
        },
        "sensitive_data": {
            "type": "noul",
            "instructions": "Does the prompt leak API keys, tokens, passwords, or PII?"
        },
        "risk_level": {
            "type": "score",
            "instructions": "Overall safety risk level",
            "criteria": ["safe", "low_risk", "suspicious", "dangerous"]
        }
    }
}

def run_native(text: str, questions: dict, preset_name: str = None):
    try:
        from laya import Router
        router = Router()
        res = router.predict(text, questions)
        print(json.dumps(res, indent=2))
        return 0
    except ImportError:
        print("[!] Package 'laya' is not installed in the active Python environment.", file=sys.stderr)
        print("    Install it via: pip install laya (or pip install \"laya[mcp]\")", file=sys.stderr)
        print("    Running heuristic System 1 fallback evaluation:\n", file=sys.stderr)
        run_fallback(text, questions, preset_name)
        return 0

def run_fallback(text: str, questions: dict, preset_name: str = None):
    """Deterministic heuristic evaluator when model weights are downloading or offline."""
    lower = text.lower()
    answers = {}
    
    for q_name, spec in questions.items():
        q_type = spec.get("type")
        if q_type == "choice":
            criteria = spec.get("criteria", {})
            matched = "other"
            for opt, desc in criteria.items():
                keywords = desc.replace(",", " ").split()
                if any(kw in lower for kw in keywords if len(kw) > 3):
                    matched = opt
                    break
            answers[q_name] = {"choice": matched, "confidence": 0.88}
        elif q_type == "score":
            rubric = spec.get("criteria", [])
            # Urgency or severity heuristics
            urgent_words = ["urgent", "asap", "emergency", "immediately", "broken", "critical", "outage"]
            score_idx = min(len(rubric) - 1, sum(1 for w in urgent_words if w in lower))
            answers[q_name] = {"score": rubric[score_idx], "level": score_idx}
        elif q_type == "noul":
            trigger_words = ["cancel", "leave", "lawyer", "sue", "override", "system prompt", "hack", "ignore rules"]
            p = 0.92 if any(w in lower for w in trigger_words) else 0.05
            answers[q_name] = {"noul": p, "verdict": p > 0.5}

    output = {
        "engine": "laya-fallback-heuristics",
        "routing": {"model": "local-fallback", "latency_ms": 1.2},
        "answers": answers
    }
    print(json.dumps(output, indent=2))

def main():
    parser = argparse.ArgumentParser(description="Laya System 1 Decision Runner")
    parser.add_argument("text", nargs="?", help="Text to evaluate")
    parser.add_argument("--preset", choices=list(PRESETS.keys()), default="triage", help="Preset to use (triage, guard)")
    parser.add_argument("--status", action="store_true", help="Check Laya installation status")

    args = parser.parse_args()

    if args.status:
        try:
            import laya
            print(f"[OK] Laya is installed (version {laya.__version__})")
        except ImportError:
            print("[INFO] Laya python package is not installed.")
            print("       To install with PyTorch: pip install laya")
            print("       To install with MCP:     pip install \"laya[mcp]\"")
        return

    if not args.text:
        parser.print_help()
        sys.exit(1)

    questions = PRESETS.get(args.preset, PRESETS["triage"])
    run_native(args.text, questions, args.preset)

if __name__ == "__main__":
    main()
