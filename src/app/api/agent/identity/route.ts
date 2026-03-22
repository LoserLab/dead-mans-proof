import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

/**
 * ERC-8004 agent identity endpoint.
 *
 * Returns verifiable identity metadata for the Dead Man's Proof agent,
 * including on-chain registration details, capabilities, and links.
 *
 * GET /api/agent/identity
 */
export async function GET() {
  // Compute trust/reputation score from live store data
  const commitments = store.getAllCommitments();
  const allAttestations = commitments.flatMap((c) => store.getAttestations(c.id));

  const totalAttestations = allAttestations.length;
  const totalCommitmentsServed = commitments.length;
  const averageConfidence =
    totalAttestations > 0
      ? allAttestations.reduce((sum, a) => sum + a.confidence, 0) / totalAttestations
      : 0;
  const attestationsPerCommitment =
    totalCommitmentsServed > 0 ? totalAttestations / totalCommitmentsServed : 0;

  // Simple 0-100 reputation score: blend of volume and confidence
  const reputationScore = Math.min(
    100,
    Math.round((Math.min(100, totalAttestations * 2) + averageConfidence) / 2),
  );

  return NextResponse.json(
    {
      agent: {
        name: "Dead Man's Proof",
        description: 'Privacy-preserving attestation agent on Base',
        version: '1.0.0',
        model: 'llama-3.3-70b',
        provider: 'Venice AI (privacy-first, no data retention)',
      },
      erc8004: {
        participantId: 'ec2fb5979a1b47a2a7bbfa18ab9a4bf2',
        teamId: '953613a031694fdca5aafb7203c69cf1',
        wallet: '0x8c072C22B6aB61b163DC26AAA35c9da97f92E201',
        registrationTx:
          '0xdc234410bacb110f90d07dae275e2de75a43d2546edcecc1476f77c4a3e60765',
        agentNftTransferTx:
          '0xf13e372914cd6e598d634285682d1d6e866626fa17123f75969e8218dab7d8b3',
        track: 'Track 4: Private Agents, Trusted Actions',
      },
      contract: {
        address: '0x4334EbC7750a4eBd8835906B4bCc71D045891617',
        chain: 'Base Mainnet',
        chainId: 8453,
        deployTx:
          '0xaa7697c8a9d94f0a968cf149a7c989dbd7959a371fac36d82edd9bbb19737ea8',
      },
      trustScore: {
        totalAttestations,
        totalCommitmentsServed,
        averageConfidence: Math.round(averageConfidence * 10) / 10,
        attestationsPerCommitment: Math.round(attestationsPerCommitment * 10) / 10,
        reputationScore,
      },
      capabilities: [
        'privacy-preserving-inference',
        'onchain-attestations',
        'payment-gated-queries',
        'prompt-injection-defense',
        'data-leak-detection',
      ],
      links: {
        site: 'https://dead-mans-proof.vercel.app',
        repo: 'https://github.com/LoserLab/dead-mans-proof',
        attestationContract:
          'https://basescan.org/address/0x4334EbC7750a4eBd8835906B4bCc71D045891617',
      },
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=3600',
      },
    },
  );
}
