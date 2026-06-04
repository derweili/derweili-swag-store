import * as z from "zod/mini";

const serverEnvSchema = z.object({
  SWAG_STORE_WOOCOMMERCE_API_URL: z.url(),
  STORE_NAME: z._default(z.string(), "Swag Store"),
  STORE_DESCRIPTION: z._default(z.string(), "Your favorite swag store"),
  IS_DEVELOPMENT: z._default(z.boolean(), false),
});

export const serverEnv = serverEnvSchema.parse({
  IS_DEVELOPMENT: process.env.VERCEL_ENV === "development",
  SWAG_STORE_WOOCOMMERCE_API_URL: process.env.SWAG_STORE_WOOCOMMERCE_API_URL,
  STORE_NAME: process.env.STORE_NAME,
  STORE_DESCRIPTION: process.env.STORE_DESCRIPTION,
});
