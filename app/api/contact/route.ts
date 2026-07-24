import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { error: 'This endpoint is no longer used. The contact form uses Web3Forms directly.' },
    { status: 410 }
  );
}
