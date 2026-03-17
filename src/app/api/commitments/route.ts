import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET() {
  const commitments = store.getAllCommitments();

  // Return only public info, never raw private data
  const publicCommitments = commitments.map((c) => ({
    id: c.id,
    dataHash: c.dataHash,
    schemaType: c.schemaType,
    timestamp: c.timestamp,
    active: c.active,
    attestationCount: store.getAttestations(c.id).length,
  }));

  // Sort newest first
  publicCommitments.sort((a, b) => b.timestamp - a.timestamp);

  return NextResponse.json({ commitments: publicCommitments });
}
