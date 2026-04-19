import { z } from "zod/mini";

export const PromotionSchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string(),
	discountPercent: z.int(),
	code: z.string(),
	validFrom: z.iso.datetime(),
	validUntil: z.iso.datetime(),
	active: z.boolean(),
});

export type Promotion = z.infer<typeof PromotionSchema>;