import { z } from "zod/mini";

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  price: z.int(),
  currency: z.string(),
  category: z.string(),
  images: z.array(z.url()),
  featured: z.boolean(),
  tags: z.array(z.string()),
  createdAt: z.iso.datetime(),
});

export type Product = z.infer<typeof ProductSchema>;