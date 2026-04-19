import * as z from "zod/mini";

/**
 * Client-side environment variables schema
 * These variables are available in the browser (prefixed with NEXT_PUBLIC_)
 */
export const clientEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]),
});

export const clientEnv = clientEnvSchema.parse({
  ENV: process.env.NODE_ENV,
});
