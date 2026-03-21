import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

/**
 * Agent economics endpoint.
 *
 * Returns real-time economics data for the Dead Man's Proof agent,
 * including revenue, costs, and self-funding metrics.
 *
 * GET /api/agent/economics
 */
export async function GET() {
  return NextResponse.json({
    economics: store.getEconomics(),
    model: {
      description:
        'Self-funding attestation agent. Revenue from paid queries funds AI inference and onchain gas costs.',
      revenueSource:
        'Machine Payments Protocol (MPP) - 0.01 pathUSD per attestation query',
      costSources: [
        'Venice AI inference (llama-3.3-70b, privacy-preserving)',
        'Base Sepolia gas for onchain attestation publishing',
      ],
      currency: 'pathUSD (Tempo)',
    },
    agent: {
      wallet: '0x8c072C22B6aB61b163DC26AAA35c9da97f92E201',
      participantId: 'ec2fb5979a1b47a2a7bbfa18ab9a4bf2',
    },
  });
}
