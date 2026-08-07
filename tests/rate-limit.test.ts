describe('Rate Limiter', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('allows requests within limit', () => {
    const { checkRateLimit } = require('@/lib/rate-limit');
    const result = checkRateLimit('127.0.0.1', { limit: 5, windowMs: 60_000 });
    expect(result.allowed).toBe(true);
  });

  test('returns correct structure', () => {
    const { checkRateLimit } = require('@/lib/rate-limit');
    const result = checkRateLimit('test-ip', { limit: 5, windowMs: 60_000 });
    expect(result).toHaveProperty('allowed');
    expect(typeof result.allowed).toBe('boolean');
  });

  test('blocks requests over the limit', () => {
    const { checkRateLimit } = require('@/lib/rate-limit');
    const key = 'bursty-ip';
    for (let i = 0; i < 3; i++) {
      expect(checkRateLimit(key, { limit: 3, windowMs: 60_000 }).allowed).toBe(true);
    }
    const blocked = checkRateLimit(key, { limit: 3, windowMs: 60_000 });
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfter).toBeGreaterThan(0);
  });
});

describe('Client IP Detection', () => {
  const request = (headers: Record<string, string>) => ({
    headers: { get: (name: string) => headers[name] ?? null },
  });

  test('extracts IP from x-forwarded-for', () => {
    const { getClientIp } = require('@/lib/rate-limit');
    expect(getClientIp(request({ 'x-forwarded-for': '192.168.1.1, 10.0.0.1' }))).toBe('192.168.1.1');
  });

  test('falls back to x-real-ip', () => {
    const { getClientIp } = require('@/lib/rate-limit');
    expect(getClientIp(request({ 'x-real-ip': '10.0.0.1' }))).toBe('10.0.0.1');
  });

  test('returns unknown when no headers', () => {
    const { getClientIp } = require('@/lib/rate-limit');
    expect(getClientIp(request({}))).toBe('unknown');
  });
});
