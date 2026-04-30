import { z } from "zod/mini";

export const StoreConfig = z.object({
  currency: z.string(),
  features: z.record(z.string(), z.boolean()),
  seo: z.object({
    defaultDescription: z.string(),
    defaultTitle: z.string(),
    titleTemplate: z.string(),
  }),
  socialLinks: z.object({
    discord: z.string(),
    github: z.string(),
    twitter: z.string(),
  }),
});

export type Cart = z.infer<typeof StoreConfig>;
