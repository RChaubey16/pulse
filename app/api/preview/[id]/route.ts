import { NextRequest, NextResponse } from 'next/server';

const GATEWAY = process.env.NEXT_PUBLIC_GATEWAY_URL ?? 'http://localhost:3000';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const upstream = await fetch(`${GATEWAY}/templates/${id}/preview`, {
    cache: 'no-store',
  });

  if (!upstream.ok) {
    return NextResponse.json(
      { error: `Gateway returned ${upstream.status}` },
      { status: upstream.status },
    );
  }

  const data = await upstream.json();
  return NextResponse.json(data);
}
