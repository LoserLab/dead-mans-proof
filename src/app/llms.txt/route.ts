export function GET() {
  const content = `# Dead Man's Proof

> Privacy-preserving attestation agent on Base. Your data stays sealed. Only the truth gets out.

Dead Man's Proof lets users seal private data into an onchain vault and allows anyone to verify claims against that data without ever seeing it. An AI agent evaluates yes/no questions and publishes cryptographic attestations on Base.

## Pages

- [Home](https://dead-mans-proof.vercel.app/): Overview and how it works
- [Deposit](https://dead-mans-proof.vercel.app/deposit): Seal private data into a vault
- [Browse](https://dead-mans-proof.vercel.app/browse): Explore sealed vaults and their attestation histories
- [Query](https://dead-mans-proof.vercel.app/query/{commitmentId}): Ask yes/no questions against a sealed vault
- [Attestations](https://dead-mans-proof.vercel.app/attestations/{commitmentId}): View attestation records for a vault

## How It Works

1. A user deposits private data (resume, financial records, calendar). The system stores it and publishes a keccak256 hash commitment onchain.
2. Anyone can submit a yes/no question against the sealed data.
3. An AI agent evaluates the query using privacy-first inference (no data retention), then publishes the attestation onchain.
4. The raw data never leaves the vault. Only the boolean answer, confidence score, and privacy-safe reasoning are returned.

## Supported Data Types

- Resume: employment history, skills, credentials
- Financial: balances, holdings, portfolio data
- Calendar: schedule, availability, commitments

## Built By

Loser Labs (@heathenft)
Built on Base Sepolia.

## Links

- Website: https://dead-mans-proof.vercel.app
- Contract: https://sepolia.basescan.org/address/0x4334EbC7750a4eBd8835906B4bCc71D045891617
- X: https://x.com/heathenft
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
