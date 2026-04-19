import { z } from "zod/mini";

export const CategorySchema = z.object({
  slug: z.string(),
  name: z.string(),
  productCount: z.int(),
});

export type Category = z.infer<typeof CategorySchema>;
