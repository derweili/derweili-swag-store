import { z } from "zod/mini";

export const StockSchema = z.object({
  success: z.boolean(),
  data: z.object({
    productId: z.string(),
    stock: z.int(),
    inStock: z.boolean(),
    lowStock: z.boolean(),
  }),
});

export type Stock = z.infer<typeof StockSchema>;
