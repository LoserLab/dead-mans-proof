import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { evaluateQuery } from '@/lib/agent';
import { hashQuery, publishAttestationOnChain } from '@/lib/contracts';
import { mppx, mppEnabled, QUERY_PRICE, QUERY_DESCRIPTION } from '@/lib/mpp';
import type { QueryRequest, Attestation, AgentEvaluation } from '@/lib/types';
import type { Hex } from 'viem';

function getMockEvaluation(query: string): AgentEvaluation {
  return {
    answer: true,
    confidence: 75,
    reasoning: `[MOCK] Unable to evaluate query "${query}" without an AI provider. This is a placeholder response for testing.`,
  };
}

/**
 * MPP-gated attestation query endpoint.
 *
 * Machine clients pay per query via the Machine Payments Protocol.
 * Returns 402 with WWW-Authenticate: Payment challenge if no credential.
 * Returns attestation result with Payment-Receipt on successful payment.
 *
 * POST /api/mpp/query
 * Body: { commitmentId: string, query: string }
 */
export async function POST(request: NextRequest) {
  // If MPP is not configured, return a helpful error
  if (!mppEnabled || !mppx) {
    return NextResponse.json(
      {
        error: 'MPP payments not configured on this instance',
        hint: 'Set MPP_SECRET_KEY and MPP_RECIPIENT_ADDRESS environment variables',
        freeEndpoint: '/api/query',
      },
      { status: 503 }
    );
  }

  // --- MPP payment gate ---
  // Check for Authorization: Payment header and verify, or return 402 challenge
  const handler = (mppx as Record<string, unknown>)['tempo/charge'] as
    (opts: { amount: string; description: string }) =>
      (req: Request) => Promise<{ status: number; challenge: Response; withReceipt: (res: Response) => Response }>;

  const paymentResult = await handler({
    amount: QUERY_PRICE,
    description: QUERY_DESCRIPTION,
  })(request);

  if (paymentResult.status === 402) {
    // No valid payment credential — return the 402 challenge
    return paymentResult.challenge;
  }

  // Payment verified — process the attestation query
  try {
    const body = (await request.json()) as Partial<QueryRequest>;

    // --- Validate input ---
    if (!body.commitmentId || typeof body.commitmentId !== 'string') {
      return NextResponse.json(
        { error: 'commitmentId is required and must be a string' },
        { status: 400 }
      );
    }
    if (!body.query || typeof body.query !== 'string') {
      return NextResponse.json(
        { error: 'query is required and must be a string' },
        { status: 400 }
      );
    }
    if (body.query.length > 500) {
      return NextResponse.json(
        { error: 'Query exceeds maximum length of 500 characters' },
        { status: 400 }
      );
    }

    const { commitmentId, query } = body as QueryRequest;

    // --- Check commitment exists ---
    const commitment = store.getCommitment(commitmentId);
    if (!commitment) {
      return NextResponse.json(
        { error: 'Commitment not found' },
        { status: 404 }
      );
    }

    // --- Retrieve private data ---
    const privateData = store.getPrivateData(commitmentId);
    if (!privateData) {
      return NextResponse.json(
        { error: 'Private data not found for this commitment' },
        { status: 404 }
      );
    }

    // --- Evaluate query via AI (or mock) ---
    let evaluation: AgentEvaluation;

    if (process.env.VENICE_API_KEY || process.env.OPENAI_API_KEY) {
      try {
        evaluation = await evaluateQuery(
          commitment.schemaType,
          privateData,
          query
        );
      } catch (err) {
        console.error('Agent evaluation failed, falling back to mock:', err);
        evaluation = getMockEvaluation(query);
      }
    } else {
      console.warn('No AI provider configured, returning mock evaluation');
      evaluation = getMockEvaluation(query);
    }

    // --- Attempt onchain attestation ---
    const queryHash = hashQuery(query);
    let txHash: string | undefined;

    try {
      const hash = await publishAttestationOnChain(
        commitmentId as Hex,
        queryHash,
        evaluation.answer,
        evaluation.confidence,
        evaluation.reasoning
      );
      txHash = hash;
    } catch (err) {
      console.warn(
        'On-chain attestation failed (contract may not be deployed):',
        err instanceof Error ? err.message : err
      );
    }

    // --- Build and store attestation ---
    const attestation: Attestation = {
      commitmentId,
      queryHash,
      query,
      answer: evaluation.answer,
      confidence: evaluation.confidence,
      reasoning: evaluation.reasoning,
      timestamp: Date.now(),
      ...(txHash ? { txHash } : {}),
    };

    store.addAttestation(commitmentId, attestation);

    // --- Return result with MPP receipt ---
    const response = NextResponse.json({
      attestation: {
        answer: attestation.answer,
        confidence: attestation.confidence,
        reasoning: attestation.reasoning,
        txHash: attestation.txHash ?? null,
        queryHash: attestation.queryHash,
        timestamp: attestation.timestamp,
      },
      payment: {
        protocol: 'mpp',
        amount: QUERY_PRICE,
        status: 'settled',
      },
    });

    return paymentResult.withReceipt(response);
  } catch (err) {
    console.error('MPP query route error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
