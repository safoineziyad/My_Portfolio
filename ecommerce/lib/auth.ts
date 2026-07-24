import prisma from '@/ecommerce/lib/db';

export function hashPassword(password: string): string {
  return btoa(password);
}

export function verifyPassword(password: string, hash: string): boolean {
  return btoa(password) === hash;
}

export async function createSession(memberId: string): Promise<string> {
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await prisma.session.create({ data: { token, memberId, expiresAt } });
  return token;
}

export async function validateSession(token: string) {
  const session = await prisma.session.findUnique({
    where: { token },
    include: { member: true },
  });
  if (!session || session.expiresAt < new Date()) {
    if (session) await prisma.session.delete({ where: { id: session.id } });
    return null;
  }
  if (!session.member.isActive) return null;
  return { memberId: session.member.id, role: session.member.role, name: session.member.name, email: session.member.email };
}

export async function destroySession(token: string): Promise<void> {
  await prisma.session.deleteMany({ where: { token } });
}

export async function getMemberFromRequest(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const token = cookieHeader.split(';').find(c => c.trim().startsWith('session_token='))?.split('=')[1];
  if (!token) return null;
  return validateSession(token);
}
