---
name: controlled-english-ste
description: "ASD-STE100 Simplified Technical English specification for AI writing and documentation, popularized by Andrej Karpathy. Enforces heavy constraints on clean writing style, single-meaning verbs, short sentences, and zero marketing fluff."
---

# Controlled Technical English (ASD-STE100)

> "Ask your LLM to explain something in ASD-STE100, a controlled language specification originally developed for aerospace maintenance documentation. LLMs are well-versed in this language and it comes with heavy constraints on clean writing style that I often find a lot more readable." — **Andrej Karpathy**

ASD-STE100 eliminates ambiguity, rambling explanations, passive voice, and fluff from AI-generated technical manuals, API documentation, and architecture decision records.

---

## 1. Core Specification Constraints

1. **One Word, One Meaning**:
   - Each approved word has only one assigned part of speech and one specific meaning.
   - Example: *Close* is approved as a verb (*"Close the valve"*), never as an adverb (*"The sensor is near the valve"*, NOT *"The sensor is close"*).
2. **Short Sentences**:
   - Procedural instructions: Maximum 20 words per sentence.
   - Descriptive explanations: Maximum 25 words per sentence.
3. **Active Voice & Imperative Verbs**:
   - Always state who or what performs the action.
   - Use direct imperative verbs for steps: *"Click the button"*, NOT *"The button should be clicked by the user"*.
4. **Noun Clusters Limited to 3 Words**:
   - Avoid compounding strings of nouns (e.g., *"primary database replica failover timeout alert threshold"* $\rightarrow$ *"threshold for the failover timeout of the replica database"*).
5. **No Synonyms**:
   - Never alternate synonyms for stylistic variety. Pick one term and use it consistently across the entire document.

---

## 2. Practical Application for AI Agents

### Prompt Trigger Pattern
```text
Explain [complex system / architecture / bug / API protocol] adhering to ASD-STE100 (or 80% ASD-STE100).
Rules:
- Active voice only.
- One meaning per verb.
- Max 20 words per sentence.
- Zero decorative metaphors or AI conversational filler.
```

### Transformation Example

#### Before (Generic AI Output):
> *"In order to ensure maximum resilience and throughput across distributed nodes, it is generally recommended that developers seamlessly leverage optimistic concurrency control, which inherently mitigates contention without introducing cumbersome locking overhead."*

#### After (ASD-STE100 Engineered):
> *"Use optimistic concurrency control. This method prevents write conflicts between nodes. It does not lock records during read operations. Throughput remains high when write conflicts are rare."*

---

## 3. When to Invoke this Skill
- Writing developer documentation, CLI manuals, and user guides.
- Summarizing high-stakes debugging postmortems.
- Crafting system architecture decision records (ADRs).
- Formulating unambiguous requirements and test acceptance criteria.
