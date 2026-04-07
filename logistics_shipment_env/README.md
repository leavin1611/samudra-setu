---
title: Logistics Shipment Env
emoji: 🚛
colorFrom: blue
colorTo: green
sdk: docker
app_port: 7860
pinned: false
---
# 🚛 Logistics Shipment RL Environment

[![OpenEnv](https://img.shields.io/badge/OpenEnv-compatible-blue)](https://github.com/meta-pytorch/OpenEnv)
[![Hackathon](https://img.shields.io/badge/Meta%20PyTorch-OpenEnv%20Hackathon-orange)](https://www.scaler.com/school-of-technology/meta-pytorch-hackathon)
[![Python](https://img.shields.io/badge/python-3.10%2B-green)](https://python.org)

**An AI Logistics Coordinator reinforcement learning environment built on [OpenEnv](https://github.com/meta-pytorch/OpenEnv).**

The agent acts as a logistics AI managing real-world Indian supply chain disruptions — port congestion, carrier strikes, weather delays — across multi-turn episodes with 3 difficulty levels. Built using strict Pydantic-typed `openenv.core.env.Environment`.

---

## 🎯 Domain

Real-world Indian logistics network with active shipments under simultaneous disruptions. The AI must reroute shipments, communicate ETAs to customers, and maintain SLA compliance under pressure.

---

## 🗂️ Action Space

| Action | Arguments | Description |
|--------|-----------|-------------|
| `get_network_status` | none | Full shipment + disruption snapshot |
| `reroute_shipment` | `shipment_id`, `new_route`, `new_carrier`, `reason` | Re-assign shipment to alternate route |
| `set_priority` | `priority_ids` (list, max 3) | Fast-track critical shipments |
| `communicate_eta` | `shipment_id`, `message` | Graded customer-facing ETA update |
| `escalate` | `shipment_id`, `reason` | Flag for human dispatcher (-0.1 penalty) |
| `end_turn` | none | Commit all decisions → receive turn reward |

---

## 👁️ Observation Space

Each step returns a `LogisticsObservation` (Pydantic model):

| Field | Type | Description |
|-------|------|-------------|
| `task` | str | Active task ID (TASK-EASY/MEDIUM/HARD) |
| `turn` | int | Current turn number |
| `max_turns` | int | Turn limit for this task |
| `disruptions` | list[str] | Active disruption descriptions |
| `shipments` | list[dict] | All shipments with delay, SLA, status |
| `feedback` | str | Result of last action |
| `incremental_reward` | float | Step-level reward signal |
| `cumulative_reward` | float | Running total reward |
| `done` | bool | Whether episode is complete |

---

## 🏆 Reward Function

Incremental rewards are provided at **every step** (not just end of episode):

| Dimension | Weight | Signal |
|-----------|--------|--------|
| Delay Reduction | 40% | Hours saved vs. baseline |
| SLA Compliance | 30% | % shipments meeting deadline |
| Communication Quality | 20% | NLP scoring of ETA messages |
| Escalation Control | 10% | Penalty: -0.1 per escalation |

**Incremental rewards:**
- `reroute_shipment`: up to +0.15 per action based on congestion relief
- `communicate_eta`: up to +0.10 based on message quality (apology + ETA + reason)
- `set_priority`: +0.03 per correctly prioritized shipment
- `escalate`: -0.10 penalty

---

## 📊 Task Difficulties

| Task | Name | Shipments | Turns | Challenge |
|------|------|-----------|-------|-----------|
| `TASK-EASY` | Port Backlog Clearance | 2 | 3 | Single port disruption |
| `TASK-MEDIUM` | Mumbai Crisis Coordination | 4 | 5 | Port + accident + strike |
| `TASK-HARD` | Multi-Port Network Collapse | 7 | 7 | 3 simultaneous port failures |

---

## 📈 Baseline Scores

Scores achieved by `llama-3.1-8b-instant` via Groq:

| Task | Score |
|------|-------|
| TASK-EASY | 0.52 |
| TASK-MEDIUM | 0.41 |
| TASK-HARD | 0.28 |
| **Average** | **0.40** |

---

## 🚀 Setup & Running

### Requirements
- Python 3.10+
- `pip install openai pydantic python-dotenv`

### Run Inference

```bash
git clone https://github.com/meta-pytorch/OpenEnv
cd OpenEnv

# Set your API key (or use a .env file)
export OPENAI_API_KEY="your-groq-or-openai-key"
export API_BASE_URL="https://api.groq.com/openai/v1"   # free!
export MODEL_NAME="llama-3.1-8b-instant"

python inference.py
```

### Using .env File (Recommended)

Create a `.env` file in the OpenEnv root:
```
API_BASE_URL="https://api.groq.com/openai/v1"
MODEL_NAME="llama-3.1-8b-instant"
OPENAI_API_KEY="gsk_your_free_groq_key"
```

Then simply run:
```bash
python inference.py
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `OPENAI_API_KEY` | *(required)* | Your API key (Groq or OpenAI) |
| `API_BASE_URL` | `https://api.openai.com/v1` | LLM endpoint |
| `MODEL_NAME` | `gpt-4o-mini` | Model name |
| `TASK_ID` | `TASK-MEDIUM` | Which task to run |
| `MAX_TURNS` | `7` | Max turns per episode |

---

## 🐳 Docker / HuggingFace Spaces Deployment

The `server/Dockerfile` is ready for HuggingFace Spaces (port 7860):

```bash
# Build locally to test
docker build -t logistics-env ./envs/logistics_shipment_env/server
docker run -p 7860:7860 logistics-env
```

Deploy to HuggingFace:
1. Create a new **Docker Space** at [huggingface.co/new-space](https://huggingface.co/new-space)
2. Tag it with `openenv`
3. Upload the `envs/logistics_shipment_env/` directory contents

---

## 📁 Project Structure

```
envs/logistics_shipment_env/
├── __init__.py             # Package exports
├── client.py               # Environment client helper
├── openenv.yaml            # Environment manifest
├── pyproject.toml          # pip-installable package
├── README.md               # This file
└── server/
    ├── __init__.py
    ├── app.py              # FastAPI server
    ├── environment.py      # Strict Pydantic Environment class
    └── Dockerfile          # HuggingFace Spaces deployment
```

---

## 🔗 Links
- [OpenEnv Framework](https://github.com/meta-pytorch/OpenEnv)
- [Meta PyTorch Hackathon](https://www.scaler.com/school-of-technology/meta-pytorch-hackathon)
- [Get Free Groq API Key](https://console.groq.com/keys)
