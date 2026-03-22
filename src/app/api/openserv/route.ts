import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { evaluateQuery } from '@/lib/agent';
import { hashQuery, publishAttestationOnChain } from '@/lib/contracts';
import type { Attestation, AgentEvaluation } from '@/lib/types';
import type { Hex } from 'viem';

/**
 * OpenServ External Agent endpoint.
 * Receives task/chat actions from the OpenServ platform and routes them
 * to Dead Man's Proof capabilities.
 */

const AGENT_IDENTITY = {
  erc8004ParticipantId: 'ec2fb5979a1b47a2a7bbfa18ab9a4bf2',
  wallet: '0x8c072C22B6aB61b163DC26AAA35c9da97f92E201',
  model: 'llama-3.3-70b',
  provider: 'Venice AI',
};

function parseIntent(text: string): { action: string; commitmentId?: string; query?: string; schemaType?: string; data?: string } {
  const lower = text.toLowerCase().trim();

  // List vaults
  if (lower.includes('list') && (lower.includes('vault') || lower.includes('commitment'))) {
    return { action: 'list-vaults' };
  }

  // Check economics
  if (lower.includes('economics') || lower.includes('revenue') || lower.includes('cost') || lower.includes('p&l') || lower.includes('profit')) {
    return { action: 'economics' };
  }

  // Agent identity
  if (lower.includes('identity') || lower.includes('who are you') || lower.includes('erc-8004') || lower.includes('erc8004')) {
    return { action: 'identity' };
  }

  // Validate
  if (lower.includes('validate') || lower.includes('self-check') || lower.includes('consistency')) {
    const idMatch = text.match(/(?:commitment|vault)\s*(?:id\s*)?[:\s]*([a-f0-9x]+)/i);
    return { action: 'validate', commitmentId: idMatch?.[1] };
  }

  // Attestation history
  if (lower.includes('attestation') && (lower.includes('history') || lower.includes('list') || lower.includes('show'))) {
    const idMatch = text.match(/(?:commitment|vault)\s*(?:id\s*)?[:\s]*([a-f0-9x]+)/i);
    return { action: 'attestations', commitmentId: idMatch?.[1] };
  }

  // Query a vault (most common)
  if (lower.includes('query') || lower.includes('ask') || lower.includes('does') || lower.includes('is ') || lower.includes('has ') || lower.includes('can ')) {
    const idMatch = text.match(/(?:commitment|vault)\s*(?:id\s*)?[:\s]*(0x[a-f0-9]+)/i);
    return { action: 'query', commitmentId: idMatch?.[1], query: text };
  }

  // Default: treat as a query if we can find a commitment ID
  const idMatch = text.match(/(0x[a-f0-9]{64})/i);
  if (idMatch) {
    return { action: 'query', commitmentId: idMatch[1], query: text };
  }

  return { action: 'help' };
}

async function handleQuery(commitmentId: string, query: string): Promise<string> {
  const commitment = store.getCommitment(commitmentId);
  if (!commitment) return `Vault ${commitmentId} not found.`;

  const privateData = store.getPrivateData(commitmentId);
  if (!privateData) return `No sealed data found for vault ${commitmentId}.`;

  let evaluation: AgentEvaluation;
  try {
    evaluation = await evaluateQuery(commitment.schemaType, privateData, query);
  } catch {
    return 'Inference failed. The oracle is temporarily unavailable.';
  }

  const queryHash = hashQuery(query);
  let txHash: string | undefined;
  try {
    txHash = await publishAttestationOnChain(
      commitmentId as Hex, queryHash, evaluation.answer, evaluation.confidence, evaluation.reasoning
    );
  } catch {
    // onchain publish is best-effort
  }

  const attestation: Attestation = {
    commitmentId, queryHash, query,
    answer: evaluation.answer,
    confidence: evaluation.confidence,
    reasoning: evaluation.reasoning,
    timestamp: Date.now(),
    ...(txHash ? { txHash } : {}),
  };
  store.addAttestation(commitmentId, attestation);
  store.recordQuery(false);

  return JSON.stringify({
    verdict: evaluation.answer ? 'YES' : 'NO',
    confidence: evaluation.confidence,
    reasoning: evaluation.reasoning,
    txHash: txHash ?? null,
    commitmentId,
    agentIdentity: AGENT_IDENTITY,
  }, null, 2);
}

function handleListVaults(): string {
  const commitments = store.getAllCommitments();
  if (commitments.length === 0) return 'No vaults found.';

  const vaults = commitments.map((c) => ({
    id: c.id,
    schemaType: c.schemaType,
    attestationCount: store.getAttestations(c.id).length,
    active: c.active,
  }));
  return JSON.stringify({ vaults, total: vaults.length }, null, 2);
}

function handleEconomics(): string {
  return JSON.stringify({
    economics: store.getEconomics(),
    model: {
      description: 'Self-funding attestation agent. Revenue from paid queries funds AI inference and onchain gas costs.',
      revenueSource: 'Machine Payments Protocol (MPP), 0.01 pathUSD per query',
    },
    agentIdentity: AGENT_IDENTITY,
  }, null, 2);
}

function handleIdentity(): string {
  const commitments = store.getAllCommitments();
  const allAttestations = commitments.flatMap((c) => store.getAttestations(c.id));
  const avgConfidence = allAttestations.length > 0
    ? allAttestations.reduce((sum, a) => sum + a.confidence, 0) / allAttestations.length
    : 0;

  return JSON.stringify({
    agent: { name: 'Dead Man\'s Proof', version: '1.0.0', model: 'llama-3.3-70b', provider: 'Venice AI (privacy-first, no data retention)' },
    erc8004: {
      participantId: 'ec2fb5979a1b47a2a7bbfa18ab9a4bf2',
      teamId: '953613a031694fdca5aafb7203c69cf1',
      wallet: '0x8c072C22B6aB61b163DC26AAA35c9da97f92E201',
      registrationTx: '0xdc234410bacb110f90d07dae275e2de75a43d2546edcecc1476f77c4a3e60765',
    },
    trustScore: {
      totalAttestations: allAttestations.length,
      totalCommitmentsServed: commitments.length,
      averageConfidence: Math.round(avgConfidence * 10) / 10,
      reputationScore: Math.min(100, Math.round((Math.min(100, allAttestations.length * 2) + avgConfidence) / 2)),
    },
  }, null, 2);
}

async function handleValidate(commitmentId?: string): Promise<string> {
  const commitments = store.getAllCommitments();
  const withAttestations = commitments.filter((c) => store.getAttestations(c.id).length > 0);

  if (withAttestations.length === 0) return 'No attestations to validate.';

  const target = commitmentId
    ? withAttestations.find((c) => c.id === commitmentId)
    : withAttestations[Math.floor(Math.random() * withAttestations.length)];

  if (!target) return `Vault ${commitmentId} not found or has no attestations.`;

  const attestations = store.getAttestations(target.id);
  const original = attestations[Math.floor(Math.random() * attestations.length)];
  const privateData = store.getPrivateData(target.id);

  if (!privateData || !original.query) return 'Cannot validate: missing data.';

  let reeval: AgentEvaluation;
  try {
    reeval = await evaluateQuery(target.schemaType, privateData, original.query);
  } catch {
    return 'Validation inference failed.';
  }

  const consistent = reeval.answer === original.answer;
  const confidenceDelta = Math.abs(reeval.confidence - original.confidence);
  const consistencyScore = Math.max(0, 100 - (consistent ? 0 : 50) - Math.min(50, confidenceDelta));

  return JSON.stringify({
    validation: {
      commitmentId: target.id,
      originalAttestation: { query: original.query, answer: original.answer, confidence: original.confidence },
      revalidation: { answer: reeval.answer, confidence: reeval.confidence },
      consistent,
      confidenceDelta,
      consistencyScore,
    },
    agentIdentity: AGENT_IDENTITY,
  }, null, 2);
}

function handleHelp(): string {
  return `Dead Man's Proof: Privacy-preserving attestation agent on Base.

Available actions:
- "list vaults" : Show all sealed vaults
- "query vault <commitmentId> <yes/no question>" : Ask a question against sealed data
- "attestation history for <commitmentId>" : View past attestations
- "validate" : Self-check a random past attestation for consistency
- "economics" : View agent revenue, costs, and self-funding ratio
- "identity" : View ERC-8004 agent credentials and trust score

The agent holds private data and answers yes/no questions without revealing it. Every answer is published as a verifiable attestation onchain on Base.`;
}

export async function POST(request: NextRequest) {
  // Verify auth token
  const authHeader = request.headers.get('authorization');
  const expectedToken = process.env.OPENSERV_AUTH_TOKEN;
  if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    // OpenServ sends actions with type 'do-task' or 'respond-chat-message'
    const actionType = body?.type || body?.action?.type;
    let inputText = '';

    if (actionType === 'do-task') {
      inputText = body?.task?.body || body?.task?.description || body?.task?.input || '';
    } else if (actionType === 'respond-chat-message') {
      inputText = body?.message || body?.messages?.[body.messages.length - 1]?.content || '';
    } else {
      // Fallback: treat body as direct input
      inputText = body?.input || body?.query || body?.message || body?.text || JSON.stringify(body);
    }

    const intent = parseIntent(inputText);
    let result: string;

    switch (intent.action) {
      case 'list-vaults':
        result = handleListVaults();
        break;
      case 'economics':
        result = handleEconomics();
        break;
      case 'identity':
        result = handleIdentity();
        break;
      case 'validate':
        result = await handleValidate(intent.commitmentId);
        break;
      case 'attestations': {
        if (!intent.commitmentId) {
          result = 'Please provide a vault/commitment ID.';
        } else {
          const attestations = store.getAttestations(intent.commitmentId);
          result = attestations.length > 0
            ? JSON.stringify({ commitmentId: intent.commitmentId, attestations, total: attestations.length }, null, 2)
            : `No attestations found for vault ${intent.commitmentId}.`;
        }
        break;
      }
      case 'query': {
        if (!intent.commitmentId) {
          const vaults = store.getAllCommitments();
          result = `Please specify a vault ID to query. Available vaults:\n${vaults.map((v) => `- ${v.id} (${v.schemaType})`).join('\n')}`;
        } else {
          result = await handleQuery(intent.commitmentId, intent.query || inputText);
        }
        break;
      }
      default:
        result = handleHelp();
    }

    return NextResponse.json({ result });
  } catch (err) {
    console.error('OpenServ route error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    agent: 'Dead Man\'s Proof',
    description: 'Privacy-preserving attestation agent on Base. Accepts sealed private data and answers yes/no questions without revealing it.',
    capabilities: ['query-vault', 'list-vaults', 'view-attestations', 'validate-attestations', 'agent-economics', 'agent-identity'],
    protocol: 'openserv-external-agent',
    version: '1.0.0',
    agentIdentity: AGENT_IDENTITY,
  });
}
