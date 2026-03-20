import { NextResponse } from 'next/server';
import { mppEnabled, QUERY_PRICE, QUERY_DESCRIPTION } from '@/lib/mpp';

/**
 * MPP service discovery endpoint.
 *
 * Returns information about this service's MPP-gated endpoints,
 * pricing, and accepted payment methods. Machine clients can
 * use this to discover what's available before making paid requests.
 *
 * GET /api/mpp/info
 */
export async function GET() {
  return NextResponse.json({
    service: 'Dead Man\'s Proof',
    description:
      'Privacy-preserving attestation service. An AI agent holds sealed private data ' +
      'and answers yes/no queries via on-chain attestations without revealing the underlying data.',
    protocol: 'mpp',
    enabled: mppEnabled,
    endpoints: {
      query: {
        method: 'POST',
        path: '/api/mpp/query',
        description: QUERY_DESCRIPTION,
        price: QUERY_PRICE,
        currency: 'pathUSD',
        body: {
          commitmentId: 'string — UUID of the sealed data commitment',
          query: 'string — yes/no question about the sealed data (max 500 chars)',
        },
        response: {
          attestation: {
            answer: 'boolean',
            confidence: 'number (0-100)',
            reasoning: 'string — privacy-safe explanation',
            txHash: 'string | null — on-chain attestation hash',
            queryHash: 'string — keccak256 of the query',
            timestamp: 'number — unix ms',
          },
        },
      },
    },
    freeEndpoints: {
      commitments: {
        method: 'GET',
        path: '/api/commitments',
        description: 'List all public sealed data commitments (no private data exposed)',
      },
      attestations: {
        method: 'GET',
        path: '/api/attestations/:commitmentId',
        description: 'View attestation history for a commitment',
      },
      deposit: {
        method: 'POST',
        path: '/api/deposit',
        description: 'Seal new private data into a commitment',
      },
    },
  });
}
