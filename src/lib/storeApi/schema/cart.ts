import { z } from "zod/mini";
import { ProductSchema } from "./product";

export const CartItemWithProductSchema = z.object({
	productId: z.string(),
	quantity: z.int(),
	addedAt: z.iso.datetime(),
	product: ProductSchema,
	lineTotal: z.int(),
});

export const CartWithProductsSchema = z.object({
	token: z.uuid(),
	items: z.array(
		CartItemWithProductSchema
	),
	totalItems: z.int(),
	subtotal: z.int(),
	currency: z.string(),
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime(),
});

export type Cart = z.infer<typeof CartWithProductsSchema>;