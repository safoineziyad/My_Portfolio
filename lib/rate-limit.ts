type HeaderLike = { get(name: string): string | null };

type RateLimitOptions = {
  limit?: number;
  windowMs?: number;
};

const buckets = new Map<string, { count: number; resetAt: number }>();

export function getClientIp(
  request: Request | { headers: HeaderLike }
): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp;
  return 'unknown';
}

export function checkRateLimit(
  key: string,
  options?: RateLimitOptions
): { allowed: boolean; retryAfter?: number } {
  const limit = options?.limit ?? 10;
  const windowMs = options?.windowMs ?? 60_000;
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (bucket.count >= limit) {
    const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
    return { allowed: false, retryAfter };
  }

  bucket.count += 1;
  return { allowed: true };
}
