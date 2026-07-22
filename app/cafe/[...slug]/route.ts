import { readFileSync, existsSync, statSync } from 'fs';
import { join, extname } from 'path';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

export async function GET(
  _request: Request,
  { params }: { params: { slug: string[] } }
) {
  const slugPath = params.slug.join('/');
  const ext = extname(slugPath);

  const filePath = join(process.cwd(), 'public', 'cafe', slugPath);
  if (existsSync(filePath) && statSync(filePath).isFile()) {
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    if (ext === '.html' || !ext) {
      const html = readFileSync(filePath, 'utf-8');
      return new NextResponse(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    const buffer = readFileSync(filePath);
    return new NextResponse(buffer, {
      headers: { 'Content-Type': contentType },
    });
  }

  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}
