import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

const MESSAGES_FILE = join(process.cwd(), 'data', 'messages.json');

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  const apiKey = process.env.ADMIN_API_KEY;

  if (!token || token !== apiKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await readFile(MESSAGES_FILE, 'utf-8');
    const messages = JSON.parse(data);
    return NextResponse.json({ messages }, { status: 200 });
  } catch {
    return NextResponse.json({ messages: [] }, { status: 200 });
  }
}

export async function DELETE(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  const apiKey = process.env.ADMIN_API_KEY;

  if (!token || token !== apiKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await request.json();
    const data = await readFile(MESSAGES_FILE, 'utf-8');
    const messages = JSON.parse(data);
    const filtered = messages.filter((m: { id: string }) => m.id !== id);
    const { writeFile } = await import('fs/promises');
    await writeFile(MESSAGES_FILE, JSON.stringify(filtered, null, 2));
    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
  }
}
