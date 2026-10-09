---
name: ai-engineer-roadmap
description: "Comprehensive 8-stage AI & ML engineering knowledge system and architectural reference roadmap. Covers Machine Learning, Deep Learning, GenAI/LLMs, RAG & Knowledge Systems, AI Agents & MCP, Fine-Tuning, Backend Engineering, and MLOps/LLMOps."
---

# AI & ML Engineering 8-Stage Roadmap

> Full architectural reference roadmap for modern AI Engineers and Agent Architects.

A structured roadmap covering theoretical foundations, production architectures, and deployment pipelines.

---

## 1. Machine Learning Foundations
- **Supervised Learning**: Classification, linear/logistic regression, decision trees, random forests, XGBoost/LightGBM.
- **Unsupervised Learning**: K-Means clustering, PCA, hierarchical clustering, anomaly detection.
- **Feature Engineering**: Imputation, scaling (Standard/MinMax), categorical encoding, feature selection.
- **Validation Discipline**: Train / validation / test splits, stratified K-Fold cross-validation, regularization (L1 Lasso, L2 Ridge).
- **Evaluation Metrics**: Precision, recall, F1-score, confusion matrix, ROC-AUC curve.

---

## 2. Deep Learning & Neural Architectures
- **Neural Fundamentals**: Perceptrons, backpropagation, gradient descent optimizers (AdamW, SGD, RMSprop).
- **Computer Vision**: CNNs, Residual Networks (ResNet), Vision Transformers (ViT).
- **Sequence Modeling**: RNNs, LSTMs, Transformers, Multi-Head Self-Attention mechanisms.
- **Representation Learning**: Dense embeddings, transfer learning, foundation model backbones.
- **Frameworks**: PyTorch, TorchScript, ONNX runtime, TensorFlow/Keras basics.

---

## 3. Generative AI & Large Language Models
- **Tokenization**: Byte-Pair Encoding (BPE), WordPiece, Tiktoken token counts.
- **Sampling Dynamics**: Temperature, Top-P (nucleus sampling), Top-K, presence and frequency penalties.
- **Tool / Function Calling**: JSON Schema tool definitions, parallel tool calls, typed structured outputs.
- **Optimization Techniques**: Quantization (4-bit AWQ, GPTQ, GGUF), knowledge distillation, speculative decoding.

---

## 4. RAG & Knowledge Systems
- **Document Ingestion**: Parsing PDFs, Markdown, HTML, and audio transcripts.
- **Chunking Strategies**: Recursive character splitting, semantic boundary chunking, parent-document chunking.
- **Retrieval Infrastructure**: Vector databases (Qdrant, Pinecone, Chroma, pgvector), dense embeddings.
- **Hybrid Search**: Combining dense vector similarity with sparse BM25 keyword matching via Reciprocal Rank Fusion (RRF).
- **Re-Ranking & Query Rewriting**: Cross-encoder re-rankers, HyDE (Hypothetical Document Embeddings), query expansion.
- **Advanced Graph RAG**: Knowledge graphs, entity extraction, and multi-hop associative retrieval.

---

## 5. AI Agents & Agentic Systems
- **Agent Architectures**: Single-agent ReAct (Reasoning + Acting), Plan-and-Solve, Reflexion.
- **Multi-Agent Orchestration**: Hierarchical supervisory networks, peer message-passing swarms.
- **Memory Systems**: Short-term buffer memory, long-term vector/summary memory, external filesystem memory.
- **Model Context Protocol (MCP)**: Tool registration, schema contracts, MCP client/server transport layers.
- **Safety & Guardrails**: Input/output moderation, refusal gates, deterministic schema validation.

---

## 6. Fine-Tuning & Model Adaptation
- **PEFT (Parameter-Efficient Fine-Tuning)**: LoRA (Low-Rank Adaptation), QLoRA (Quantized LoRA).
- **Alignment Methodologies**: RLHF (Reinforcement Learning from Human Feedback), DPO (Direct Preference Optimization), KTO.
- **Dataset Curation**: Data cleaning, deduplication, instruction formatting (ShareGPT / ChatML).
- **Model Merging**: Mergekit techniques (SLERP, DARE, TIES).

---

## 7. AI Engineering & Backend Development
- **API Frameworks**: FastAPI (async ASGI endpoints, Pydantic validation), Node.js/Hono.
- **Streaming & Concurrency**: Server-Sent Events (SSE) for token streaming, WebSockets.
- **Background Tasks & Caching**: Redis semantic cache, Celery/BullMQ job queues, BullMQ durable execution.
- **Databases**: PostgreSQL (relational + pgvector), MongoDB, Redis key-value storage.
- **Containerization**: Docker, multi-stage builds, non-root user security.

---

## 8. MLOps & LLMOps Lifecycle
- **Experiment Tracking**: MLflow, Weights & Biases, Trackio.
- **CI/CD for AI**: Automated model evaluation suites, prompt regression tests, synthetic benchmark datasets.
- **Telemetry & Tracing**: OpenTelemetry, Langfuse, Helicone, token consumption monitoring, latency p95/p99 metrics.
- **Model Deployment**: vLLM high-throughput inference engine, Ollama local deployment, Triton Inference Server.
- **Continuous Evaluation**: LLM-as-a-judge pipelines, drift detection, A/B canary routing.
