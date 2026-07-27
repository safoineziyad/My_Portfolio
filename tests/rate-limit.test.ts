describe('Rate Limiter', () => {
  const originalMap = Map.prototype;

  beforeEach(() => {
    jest.resetModules();
  });

  test('allows requests within limit', () => {
    const { checkRateLimit } = require('@/lib/rate-limit');
    const result = checkRateLimit('127.0.0.1', 'api');
    expect(result.allowed).toBe(true);
  });

  test('returns correct structure', () => {
    const { checkRateLimit } = require('@/lib/rate-limit');
    const result = checkRateLimit('test-ip', 'contact');
    expect(result).toHaveProperty('allowed');
    expect(typeof result.allowed).toBe('boolean');
  });
});

describe('Client IP Detection', () => {
  test('extracts IP from x-forwarded-for', () => {
    const { getClientIp } = require('@/lib/rate-limit');
    const request = {
      headers: {
        get: (name: string) => name === 'x-forwarded-for' ? '192.168.1.1, 10.0.0.1' : null,
      },
    };
    expect(getClientIp(request)).toBe('192.168.1.1');
  });

  test('falls back to x-real-ip', () => {
    const { getClientIp } = require('@/lib/rate-limit');
    const request = {
      headers: {
        get: (name: string) => name === 'x-real-ip' ? '10.0.0.1' : null,
      },
    };
    expect(getClientIp(request)).toBe('10.0.0.1');
  });

  test('returns unknown when no headers', () => {
    const { getClientIp } = require('@/lib/rate-limit');
    const request = {
      headers: {
        get: () => null,
      },
    };
    expect(getClientIp(request)).toBe('unknown');
  });
});
