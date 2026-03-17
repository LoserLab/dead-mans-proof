import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { evaluateQuery } from '@/lib/agent';
import { hashQuery, publishAttestationOnChain } from '@/lib/contracts';
import type { QueryRequest, Attestation, AgentEvaluation } from '@/lib/types';
import type { Hex } from 'viem';

// --- Rate limiting ---
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 5; // 5 queries per minute per IP
const GLOBAL_DAILY_LIMIT = 200; // total queries per day across all users

const ipRequests = new Map<string, number[]>();
let globalDailyCount = 0;
let globalDayStart = Date.now();

function isRateLimited(ip: string): { limited: boolean; message?: string } {
  const now = Date.now();

  // Reset global daily counter
  if (now - globalDayStart > 24 * 60 * 60 * 1000) {
    globalDailyCount = 0;
    globalDayStart = now;
  }

  if (globalDailyCount >= GLOBAL_DAILY_LIMIT) {
    return { limited: true, message: 'The oracle rests. Daily query limit reached. Return tomorrow.' };
  }

  // Per-IP rate limiting
  const timestamps = ipRequests.get(ip) || [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= RATE_LIMIT_MAX) {
    return { limited: true, message: 'Patience. The oracle cannot be rushed. Try again in a moment.' };
  }

  recent.push(now);
  ipRequests.set(ip, recent);
  globalDailyCount++;

  return { limited: false };
}

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

function getMockEvaluation(query: string): AgentEvaluation {
  return {
    answer: true,
    confidence: 75,
    reasoning: `[MOCK] Unable to evaluate query "${query}" without an AI provider. This is a placeholder response for testing.`,
  };
}

export async function POST(request: NextRequest) {
  try {
    // --- Rate limit check ---
    const ip = getClientIp(request);
    const rateCheck = isRateLimited(ip);
    if (rateCheck.limited) {
      return NextResponse.json(
        { error: rateCheck.message },
        { status: 429 }
      );
    }

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
      console.warn('On-chain attestation failed (contract may not be deployed):', err instanceof Error ? err.message : err);
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

    // --- Return result ---
    return NextResponse.json({
      attestation: {
        answer: attestation.answer,
        confidence: attestation.confidence,
        reasoning: attestation.reasoning,
        txHash: attestation.txHash ?? null,
        queryHash: attestation.queryHash,
        timestamp: attestation.timestamp,
      },
    });
  } catch (err) {
    console.error('Query route error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
