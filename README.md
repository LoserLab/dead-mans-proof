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

## What is it

An AI agent holds your private data and answers yes/no questions about it, without ever revealing the underlying information. Every answer is published as a verifiable attestation onchain.

Machine clients pay per query via the [Machine Payments Protocol (MPP)](https://mpp.dev) by Tempo and Stripe.

- **Seal** private data into the vault
- **Query** with natural language yes/no questions
- **Pay** per attestation via MPP
- **Verify** every answer is committed onchain

## How it works

1. Deposit private data (resume, financial, calendar). A hash commitment is published onchain.
2. Submit a yes/no question against the sealed data.
3. The agent evaluates and returns a boolean answer, confidence score, and privacy-safe reasoning.
4. The attestation is published onchain. The raw data never leaves the vault.

## MPP Payments

Attestation queries are gated by the Machine Payments Protocol (HTTP 402 challenge-response). Machine clients discover pricing at `/api/mpp/info` and pay per query at `/api/mpp/query`.

A free rate-limited demo endpoint is available at `/api/query`.

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, Tailwind CSS v4, Motion |
| Payments | MPP via mppx (Tempo + Stripe) |
| Smart Contract | Solidity, Foundry |
| Chain | Base Sepolia |

## Run locally

```bash
npm install
npm run dev
```

The app runs with demo data pre-loaded. Add your keys to `.env.local`:

```
VENICE_API_KEY=your-key-here
MPP_SECRET_KEY=your-random-hex-secret
MPP_RECIPIENT_ADDRESS=your-tempo-wallet-address
```

## Contract

Deployed on Base Sepolia at [`0x4334EbC7750a4eBd8835906B4bCc71D045891617`](https://sepolia.basescan.org/address/0x4334EbC7750a4eBd8835906B4bCc71D045891617).

```bash
cd contracts
forge build
forge test
```

## Built with

<a href="https://x.com/mirra">
  <img src="https://img.shields.io/badge/Built_in-Mirra-black?style=flat" alt="Built in Mirra" />
</a>

## Author

**Loser Labs** ([@heathenft](https://x.com/heathenft))

## License

[MIT](LICENSE)
