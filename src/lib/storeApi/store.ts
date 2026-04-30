import { fetchApi } from "./fetchApi";
import { StoreConfig } from "./schema/store";

export const fetchStoreConfig = async () => {
  const stock = await fetchApi(
    `/store/config`,
    {
      cache: "no-store",
    },
    StoreConfig,
  );
  return stock;
};
