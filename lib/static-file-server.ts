import { readFileSync, existsSync, statSync } from 'fs';
import { join, extname, resolve } from 'path';
import { NextResponse } from 'next/server';

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
  '.ttf': 'font/ttf',
  '.webp': 'image/webp',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.map': 'application/json',
};

export function serveStaticFile(publicDir: string, slug: string[]) {
  const slugPath = slug.join('/');
  const ext = extname(slugPath);
  const basePath = join(process.cwd(), 'public', publicDir);
  const filePath = resolve(join(basePath, slugPath));

  if (!filePath.startsWith(resolve(basePath))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (existsSync(filePath) && statSync(filePath).isFile()) {
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    if (ext === '.html' || !ext) {
      const html = readFileSync(filePath, 'utf-8');
      return new NextResponse(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }
    const buffer = readFileSync(filePath);
    return new NextResponse(buffer, { headers: { 'Content-Type': contentType } });
  }

  const indexPath = join(basePath, 'index.html');
  if (existsSync(indexPath)) {
    const html = readFileSync(indexPath, 'utf-8');
    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}
