import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { evaluateQuery } from '@/lib/agent';
import type { AgentEvaluation } from '@/lib/types';

const AGENT_WALLET = '0x8c072C22B6aB61b163DC26AAA35c9da97f92E201';
const AGENT_PARTICIPANT_ID = 'ec2fb5979a1b47a2a7bbfa18ab9a4bf2';

function getMockEvaluation(query: string): AgentEvaluation {
  return {
    answer: true,
    confidence: 75,
    reasoning: `[MOCK] Unable to re-evaluate query "${query}" without an AI provider. This is a placeholder response for testing.`,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    let { commitmentId } = body as { commitmentId?: string };

    // If no commitmentId provided, pick a random commitment that has attestations
    if (!commitmentId) {
      const allCommitments = store.getAllCommitments();
      const withAttestations = allCommitments.filter(
        (c) => store.getAttestations(c.id).length > 0
      );

      if (withAttestations.length === 0) {
        return NextResponse.json(
          { error: 'No commitments with attestations found to validate' },
          { status: 404 }
        );
      }

      const picked = withAttestations[Math.floor(Math.random() * withAttestations.length)];
      commitmentId = picked.id;
    }

    // Check commitment exists
    const commitment = store.getCommitment(commitmentId);
    if (!commitment) {
      return NextResponse.json(
        { error: 'Commitment not found' },
        { status: 404 }
      );
    }

    // Get existing attestations
    const attestations = store.getAttestations(commitmentId);
    if (attestations.length === 0) {
      return NextResponse.json(
        { error: 'No attestations found for this commitment' },
        { status: 404 }
      );
    }

    // Pick a random attestation to re-validate
    const original = attestations[Math.floor(Math.random() * attestations.length)];

    // Retrieve private data for re-evaluation
    const privateData = store.getPrivateData(commitmentId);
    if (!privateData) {
      return NextResponse.json(
        { error: 'Private data not found for this commitment' },
        { status: 404 }
      );
    }

    // Re-run the same query through evaluateQuery
    let revalidation: AgentEvaluation;

    if (process.env.VENICE_API_KEY || process.env.OPENAI_API_KEY) {
      try {
        revalidation = await evaluateQuery(
          commitment.schemaType,
          privateData,
          original.query
        );
      } catch (err) {
        console.error('Re-evaluation failed, falling back to mock:', err);
        revalidation = getMockEvaluation(original.query);
      }
    } else {
      console.warn('No AI provider configured, returning mock re-evaluation');
      revalidation = getMockEvaluation(original.query);
    }

    // Compare results
    const consistent = revalidation.answer === original.answer;
    const confidenceDelta = Math.abs(revalidation.confidence - original.confidence);

    // Consistency score: start at 100, penalize answer mismatch (-50) and confidence drift
    let consistencyScore = 100;
    if (!consistent) {
      consistencyScore -= 50;
    }
    consistencyScore -= Math.min(50, confidenceDelta);
    consistencyScore = Math.max(0, consistencyScore);

    return NextResponse.json({
      validation: {
        commitmentId,
        originalAttestation: {
          query: original.query,
          answer: original.answer,
          confidence: original.confidence,
        },
        revalidation: {
          answer: revalidation.answer,
          confidence: revalidation.confidence,
        },
        consistent,
        confidenceDelta,
        consistencyScore,
        validatedAt: new Date().toISOString(),
      },
      agentIdentity: {
        wallet: AGENT_WALLET,
        participantId: AGENT_PARTICIPANT_ID,
      },
    });
  } catch (err) {
    console.error('Validate route error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
