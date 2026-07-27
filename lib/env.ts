import { z } from 'zod';

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  ADMIN_API_KEY: z.string().min(16),
  CAFE_ADMIN_USER: z.string().min(1),
  CAFE_ADMIN_PASS_HASH: z.string().min(1),
  CAFE_API_KEY: z.string().min(16),
  NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  SENTRY_DSN: z.string().optional(),
});

const clientEnvSchema = z.object({
  NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY: z.string().optional(),
  NEXT_PUBLIC_ECOMMERCE_URL: z.string().url().optional(),
});

function validateServerEnv() {
  const parsed = serverEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const missing = parsed.error.issues.map(i => `  ${i.path.join('.')}: ${i.message}`).join('\n');
    throw new Error(`Missing or invalid environment variables:\n${missing}\n\nCopy .env.example to .env.local and fill in the values.`);
  }
  return parsed.data;
}

function validateClientEnv() {
  const parsed = clientEnvSchema.safeParse({
    NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY,
    NEXT_PUBLIC_ECOMMERCE_URL: process.env.NEXT_PUBLIC_ECOMMERCE_URL,
  });
  return parsed.data;
}

let _serverEnv: z.infer<typeof serverEnvSchema> | null = null;

export function getServerEnv() {
  if (!_serverEnv) {
    _serverEnv = validateServerEnv();
  }
  return _serverEnv;
}

export function getClientEnv() {
  return validateClientEnv();
}
