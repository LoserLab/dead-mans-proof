export function GET() {
  const content = `# Dead Man's Proof: Full Documentation

> Privacy-preserving attestation agent on Base. Your data stays sealed. Only the truth gets out.

## What Is Dead Man's Proof?

Dead Man's Proof is an AI-powered attestation system built on Base. Users seal private data into a cryptographic vault, and an AI agent answers yes/no questions about that data without ever exposing it. Every attestation is committed onchain with a hash of the original data, creating a verifiable, tamper-proof record.

The core idea: prove things about private data without revealing the data itself.

## The Problem

Verifying private claims today requires disclosure. Want to prove you have 5+ years of experience? Share your resume. Want to prove you hold a certain asset balance? Show your portfolio. Every verification leaks the full underlying data.

Dead Man's Proof breaks this pattern. Seal your data once, then let anyone verify specific claims against it. The data stays private. The truth gets out.

## How It Works

### Step 1: The Binding (Deposit)

A user submits private data to the vault. The system:
- Stores the raw data securely (never exposed)
- Computes a keccak256 hash of the data
- Publishes the hash commitment onchain to Base
- Returns a commitment ID for future queries

Supported data types:
- **Resume**: employment history, skills, credentials, education
- **Financial**: balances, holdings, portfolio positions, transaction history
- **Calendar**: schedule, availability, time commitments

### Step 2: The Inquiry (Query)

Anyone with a commitment ID can submit a natural language yes/no question against the sealed vault. Examples:
- "Does this person have 5+ years of engineering experience?"
- "Does the depositor hold more than 10 ETH?"
- "Is the person available on Tuesday afternoon?"

Questions are constrained to yes/no format to prevent data extraction through open-ended queries.

### Step 3: The Verdict (Attestation)

The AI agent evaluates the query against the sealed data using privacy-first inference (Venice AI with no data retention). The attestation includes:
- **Verdict**: YES or NO
- **Confidence**: 0-100% confidence score
- **Reasoning**: Privacy-safe explanation that does not leak underlying data
- **Onchain Record**: The attestation is published to Base with the commitment hash

## Architecture

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, Tailwind CSS v4, Motion |
| AI Inference | Venice AI (no data retention policy) |
| Smart Contract | Solidity 0.8.24 (DeadMansVault) |
| Chain | Base Sepolia |
| Onchain Interaction | viem |

## Smart Contract

The DeadMansVault contract is deployed on Base Sepolia at:
0x4334EbC7750a4eBd8835906B4bCc71D045891617

The contract stores:
- Data hash commitments (keccak256)
- Attestation records (query hash, verdict, confidence, timestamp)
- Agent-only access control for attestation publishing

## Security

- 5-layer prompt injection defense (input sanitization, message isolation, hardened system prompt, leak detection, output truncation)
- Rate limiting: 5 queries per minute per IP, 200 per day global
- Input length validation: 5,000 character deposit limit, 500 character query limit
- Agent-only attestation access control onchain
- Privacy-first AI inference with no data retention

## API Endpoints

- POST /api/deposit: Seal data into a new vault
- GET /api/commitments: List all sealed vaults
- POST /api/query: Submit a yes/no question against a vault
- GET /api/attestations/{commitmentId}: Get attestation history for a vault

## Use Cases

**Hiring Verification**: Candidates seal their resume. Recruiters verify specific claims ("Do they have 5+ years in React?") without accessing the full document.

**Financial Proof**: Users seal portfolio data. Counterparties verify holdings ("Do they hold more than $50k in stablecoins?") without seeing exact balances.

**Availability Checking**: Users seal their calendar. Others check availability ("Are they free Thursday 2-4pm?") without seeing the full schedule.

**Compliance Attestation**: Seal sensitive documents. Auditors verify compliance claims without accessing raw data.

## Pages

- Home (https://dead-mans-proof.vercel.app/): Product overview and how it works
- Deposit (https://dead-mans-proof.vercel.app/deposit): Seal private data into a vault
- Browse (https://dead-mans-proof.vercel.app/browse): Explore sealed vaults and attestation histories
- Query (https://dead-mans-proof.vercel.app/query/{commitmentId}): Ask yes/no questions against a sealed vault
- Attestations (https://dead-mans-proof.vercel.app/attestations/{commitmentId}): View full attestation records

## Links

- Website: https://dead-mans-proof.vercel.app
- Contract: https://sepolia.basescan.org/address/0x4334EbC7750a4eBd8835906B4bCc71D045891617
- X: https://x.com/heathenft
- Built by: Loser Labs (@heathenft)
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
