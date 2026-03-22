import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { hashData, depositCommitmentOnChain } from '@/lib/contracts';
import type { DepositRequest, DataCommitment } from '@/lib/types';
import { randomUUID } from 'crypto';

const VALID_SCHEMA_TYPES = ['resume', 'financial', 'calendar'] as const;

// --- Rate limiting: 3 deposits per minute per IP, 50 total per day ---
const DEPOSIT_WINDOW_MS = 60 * 1000;
const DEPOSIT_MAX_PER_IP = 20;
const DEPOSIT_DAILY_LIMIT = 1000;

const depositIpRequests = new Map<string, number[]>();
let depositDailyCount = 0;
let depositDayStart = Date.now();

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit
    const now = Date.now();
    const ip = getClientIp(request);

    if (now - depositDayStart > 24 * 60 * 60 * 1000) {
      depositDailyCount = 0;
      depositDayStart = now;
    }
    if (depositDailyCount >= DEPOSIT_DAILY_LIMIT) {
      return NextResponse.json(
        { error: 'The vault is sealed for today. Return tomorrow.' },
        { status: 429 }
      );
    }

    const timestamps = depositIpRequests.get(ip) || [];
    const recent = timestamps.filter((t) => now - t < DEPOSIT_WINDOW_MS);
    if (recent.length >= DEPOSIT_MAX_PER_IP) {
      return NextResponse.json(
        { error: 'Too many bindings. Wait a moment before sealing again.' },
        { status: 429 }
      );
    }
    recent.push(now);
    depositIpRequests.set(ip, recent);
    depositDailyCount++;

    const body = (await request.json()) as DepositRequest;

    // Validate input
    if (!body.data || typeof body.data !== 'string' || body.data.trim().length === 0) {
      return NextResponse.json(
        { error: 'Missing or empty "data" field' },
        { status: 400 }
      );
    }

    if (body.data.length > 5000) {
      return NextResponse.json(
        { error: 'Data exceeds maximum length of 5,000 characters' },
        { status: 400 }
      );
    }

    if (!body.schemaType || !VALID_SCHEMA_TYPES.includes(body.schemaType)) {
      return NextResponse.json(
        { error: `Invalid schemaType. Must be one of: ${VALID_SCHEMA_TYPES.join(', ')}` },
        { status: 400 }
      );
    }

    // Hash the data
    const dataHash = hashData(body.data);
    const commitmentId = randomUUID();

    // Store locally
    const commitment: DataCommitment = {
      id: commitmentId,
      dataHash,
      depositor: 'local-agent',
      timestamp: Date.now(),
      schemaType: body.schemaType,
      active: true,
    };

    store.addCommitment(commitment, body.data);

    // Attempt onchain deposit (gracefully skip if not configured)
    let txHash: string | null = null;
    let onChainError: string | null = null;

    const hasContractConfig =
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS && process.env.AGENT_PRIVATE_KEY;

    if (hasContractConfig) {
      try {
        txHash = await depositCommitmentOnChain(dataHash, body.schemaType);
      } catch (err) {
        onChainError =
          err instanceof Error ? err.message : 'Unknown onchain error';
        console.warn('On-chain deposit failed (continuing with local store):', onChainError);
      }
    }

    return NextResponse.json({
      commitmentId,
      dataHash,
      stored: true,
      onChain: txHash !== null,
      txHash,
      ...(onChainError && { onChainError }),
      ...(!hasContractConfig && {
        onChainSkipped: 'Contract environment variables not configured',
      }),
    });
  } catch (err) {
    console.error('Deposit error:', err);

    if (err instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
