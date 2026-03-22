# Dead Man's Proof

**Privacy-preserving attestation agent on Base. Your data stays sealed. Only the truth gets out.**

## What We Built

An AI agent that holds private data (resumes, financial records, calendars) and answers yes/no questions about it without ever revealing the underlying information. Every answer is published as a verifiable attestation onchain on Base. The agent funds its own inference costs from query revenue (self-sustaining economics). It holds a verified ERC-8004 identity and can self-validate its own past attestations for consistency.

## Live Demo

- **Site:** https://dead-mans-proof.vercel.app
- **Repo:** https://github.com/LoserLab/dead-mans-proof

## Contract

- **Base Mainnet:** `0x4334EbC7750a4eBd8835906B4bCc71D045891617`

## Bounties Targeted

### 1. Open Track ($28,300)

Built entirely in the Ethereum ecosystem on Base. Uses AI agent + onchain attestations + payment gating. A complete product, not a demo.

### 2. Venice (3,000 VVV)

Venice AI is the PRIMARY inference provider. The entire product depends on privacy-preserving inference: the agent reasons over confidential data (resumes, financials, calendars) and acts on it publicly by publishing onchain attestations. Venice's zero data retention policy is load-bearing infrastructure, not decorative. Without it, the privacy guarantee is theater. This is exactly what Venice described: "agents that handle confidential work and then act on it publicly."

### 3. Bankr ($7,590)

The agent is self-funding. Machine clients pay 0.01 pathUSD per attestation query via Machine Payments Protocol (MPP). That revenue covers Venice AI inference costs and Base gas fees. Real-time P&L exposed at `/api/agent/economics`. Revenue in, inference costs out, self-sustaining loop.

### 4. Protocol Labs, Trust Layer ($4,000)

The agent holds a verified ERC-8004 identity from Synthesis registration. Every attestation response includes the agent's identity, making attestations traceable to a cryptographically verified agent. Trust score computed from attestation history (volume + average confidence). Identity and trust data exposed at `/api/agent/identity`.

### 5. Protocol Labs, Autonomous Agent ($4,000)

The agent can autonomously self-validate past attestations. It re-evaluates previous queries, compares results for consistency, and reports a consistency score. No human in the loop. Endpoint: `/api/agent/validate`.

### 6. OpenServ ($5,000)

Registered as an external agent on the OpenServ platform. Full capabilities exposed: vault queries, attestation history, self-validation, economics, and identity. Other agents can discover and interact with Dead Man's Proof as a service. Endpoint: `/api/openserv`.

### 7. Base ($10,000)

Smart contract (DeadMansVault) deployed on Base. Production-hardened: agent rotation, ownership transfer, pause/unpause, attestation cap, paginated reads. Every attestation is an onchain transaction on Base.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, Tailwind CSS v4, Motion |
| AI Inference | Venice AI (zero data retention, privacy-first) |
| Payments | Machine Payments Protocol (MPP) via mppx |
| Smart Contract | Solidity 0.8.24, Foundry |
| Chain | Base Mainnet |
| Agent Identity | ERC-8004 verified agent NFT |
| Agent Platform | OpenServ external agent |

## Key API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/query` | POST | Free attestation queries (rate-limited) |
| `/api/mpp/query` | POST | Paid queries via MPP |
| `/api/agent/economics` | GET | Self-funding P&L |
| `/api/agent/identity` | GET | ERC-8004 credentials + trust score |
| `/api/agent/validate` | POST | Autonomous self-validation |
| `/api/openserv` | POST | OpenServ agent protocol |
| `/api/mpp/info` | GET | Service discovery for machine clients |

## Security

- 5-layer prompt injection defense
- Data leak detection on all agent outputs
- Rate limiting (5/min per IP, 200/day global)
- Agent-only onchain access control
- Pause mechanism for emergencies
- Venice AI: zero data retention policy

## Team

**Loser Labs** (@heathenft)
Built with Claude Code (claude-opus-4-6) during The Synthesis 2026.

## Why It Matters

Every verification system today forces you to reveal the full picture to prove a single claim. Dead Man's Proof breaks that pattern. Seal your data once, let anyone verify specific claims against it. The data stays private. The truth gets out. Privacy is the product, not a feature.
