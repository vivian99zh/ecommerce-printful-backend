import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  JWT_SECRET: z
    .string()
    .min(64, 'JWT_SECRET must be at least 64 characters long')
    .default('your-super-secret-jwt-key-at-least-64-characters-long'),
  JWT_EXPIRES_IN: z.string().default('1h'),

  WOOCOMMERCE_URL: z.url(),
  WOOCOMMERCE_CONSUMER_KEY: z.string().default(''),
  WOOCOMMERCE_CONSUMER_SECRET: z.string().default(''),

  COOKIE_SECURE: z.coerce.boolean().default(false),
  COOKIE_SAME_SITE: z.enum(['lax', 'strict', 'none']).default('lax'),

  ALLOWED_ORIGINS: z.string().default('http://localhost:5173')
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    '❌ Invalid environment variables:\n',
    parsedEnv.error.issues.map(err => `  - ${err.path.join('.')}: ${err.message}`).join('\n')
  );
  process.exit(1);
}

export const {
  PORT,
  NODE_ENV,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  WOOCOMMERCE_URL,
  WOOCOMMERCE_CONSUMER_KEY,
  WOOCOMMERCE_CONSUMER_SECRET,
  COOKIE_SECURE,
  COOKIE_SAME_SITE,
  ALLOWED_ORIGINS
} = parsedEnv.data;

export default parsedEnv.data;
