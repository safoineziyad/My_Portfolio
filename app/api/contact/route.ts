import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import { v4 } from './uuid';
import { checkRateLimit } from '@/lib/rate-limit';
import { validateContactForm, sanitizeInput, type ContactFormData } from '@/lib/sanitize';

const MESSAGES_FILE = join(process.cwd(), 'data', 'messages.json');

async function getMessages() {
  try {
    const data = await readFile(MESSAGES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveMessages(messages: unknown[]) {
  await writeFile(MESSAGES_FILE, JSON.stringify(messages, null, 2));
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

  const rateLimitResult = checkRateLimit(ip);
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: `Too many requests. Please try again in ${rateLimitResult.retryAfter} seconds.` },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const formData: ContactFormData = {
      name: body.name || '',
      email: body.email || '',
      subject: body.subject || '',
      message: body.message || '',
      honeypot: body.honeypot || '',
    };

    const errors = validateContactForm(formData);
    if (errors.length > 0) {
      return NextResponse.json({ error: errors[0].message }, { status: 400 });
    }

    const messages = await getMessages();
    const newMessage = {
      id: v4(),
      name: sanitizeInput(formData.name),
      email: sanitizeInput(formData.email),
      subject: sanitizeInput(formData.subject),
      message: sanitizeInput(formData.message),
      timestamp: new Date().toISOString(),
      ip,
    };

    messages.push(newMessage);
    await saveMessages(messages);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }
}
