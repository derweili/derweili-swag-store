import * as z from "zod/mini";

/**
 * Server-side environment variables schema
 * These variables are available on the server (not prefixed with NEXT_PUBLIC_)
 */
const serverEnvSchema = z.object({
	SWAG_STORE_API_URL: z.url(),
	IS_DEVELOPMENT: z._default(z.boolean(), false),
});

export const serverEnv = serverEnvSchema.parse({
	IS_DEVELOPMENT: process.env.VERCEL_ENV === "development",
});