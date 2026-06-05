import { z } from "zod/mini";

export const CategorySchema = z.object({
  id: z.int(),
  name: z.string(),
  slug: z.string(),
  count: z.int(),
  link: z.string(),
});

export type Category = z.infer<typeof CategorySchema>;
