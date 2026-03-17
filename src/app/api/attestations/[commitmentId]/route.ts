import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ commitmentId: string }> }
) {
  try {
    const { commitmentId } = await params;

    const commitment = store.getCommitment(commitmentId);

    if (!commitment) {
      return NextResponse.json(
        { error: `Commitment not found: ${commitmentId}` },
        { status: 404 }
      );
    }

    const attestations = store.getAttestations(commitmentId);

    return NextResponse.json({
      commitment: {
        id: commitment.id,
        dataHash: commitment.dataHash,
        depositor: commitment.depositor,
        timestamp: commitment.timestamp,
        schemaType: commitment.schemaType,
        active: commitment.active,
      },
      attestations,
    });
  } catch (err) {
    console.error('Attestations lookup error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
