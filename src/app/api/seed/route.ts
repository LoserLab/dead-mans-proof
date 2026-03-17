import { NextResponse } from 'next/server';

// Seed endpoint disabled in production. Demo data is auto-seeded via store constructor.
export async function POST() {
  return NextResponse.json({ error: 'Endpoint disabled' }, { status: 403 });
}
