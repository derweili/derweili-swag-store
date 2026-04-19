import { fetchApi } from "./fetchApi";
import { ProductSchema } from "./schema/product";

export const fetchProduct = async (id: string) => {
	const product = await fetchApi(`/products/${id}`, {
		cache: 'force-cache'
	}, ProductSchema);

	return product;
};