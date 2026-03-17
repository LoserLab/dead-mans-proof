<p align="center">
  <img src="src/app/icon.svg" width="48" height="48" alt="Dead Man's Proof" />
</p>

<h1 align="center">Dead Man's Proof</h1>

<p align="center">
  Privacy-preserving attestation agent on Base.<br/>
  Your data stays sealed. Only the truth gets out.
</p>

<p align="center">
  <a href="https://dead-mans-proof.vercel.app">Live Demo</a> &middot;
  <a href="https://sepolia.basescan.org/address/0x4334EbC7750a4eBd8835906B4bCc71D045891617">Contract</a> &middot;
  <a href="https://x.com/heathenft">@heathenft</a>
</p>

---

## Overview

An AI agent that holds private data and answers yes/no questions about it without revealing the underlying information. Every attestation is committed onchain with a cryptographic hash of the original data.

- **Seal** private data into the vault
- **Query** the vault with natural language yes/no questions
- **Attest** the agent evaluates and publishes a verifiable attestation onchain

## How it works

1. User deposits private data (resume, financial, calendar). The agent stores it and publishes a `keccak256` hash commitment onchain.
2. Anyone can submit a yes/no question against the sealed data.
3. The agent evaluates the query using privacy-first inference (Venice AI, no data retention), then publishes the attestation onchain.
4. The raw data never leaves the vault. Only the boolean answer, confidence score, and privacy-safe reasoning are returned.

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, Tailwind CSS v4, Motion |
| AI Inference | Venice AI (no data retention) |
| Smart Contract | Solidity 0.8.24, Foundry |
| Chain | Base Sepolia |
| Onchain Interaction | viem |

## Contract

**DeadMansVault** is deployed on Base Sepolia:

| | |
|---|---|
| Address | [`0x4334EbC7750a4eBd8835906B4bCc71D045891617`](https://sepolia.basescan.org/address/0x4334EbC7750a4eBd8835906B4bCc71D045891617) |
| Network | Base Sepolia (Chain ID: 84532) |
| Tests | 9/9 passing |

```bash
cd contracts
forge build
forge test
```

## Run locally

```bash
npm install
npm run dev
```

The app runs with demo data pre-loaded. Add your Venice API key to `.env.local` for real AI evaluations:

```
VENICE_API_KEY=your-key-here
```

## Security

- 5-layer prompt injection defense (input sanitization, message isolation, hardened system prompt, leak detection, output truncation)
- Rate limiting (5 queries/min per IP, 200/day global)
- Input length validation (5,000 char deposit limit, 500 char query limit)
- Agent-only attestation access control onchain

## Built with

<a href="https://mirra.app">
  <img src="https://img.shields.io/badge/Built_in-Mirra-black?style=flat" alt="Built in Mirra" />
</a>

## Author

**Loser Labs** ([@heathenft](https://x.com/heathenft))

## License

[MIT](LICENSE)
