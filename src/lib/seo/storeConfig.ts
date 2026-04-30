import { cacheLife, cacheTag } from "next/cache";
import { fetchStoreConfig } from "@/lib/storeApi/store";

export type StoreConfigData = Awaited<ReturnType<typeof fetchStoreConfig>>;

export async function fetchStoreConfigForSeo(): Promise<StoreConfigData> {
  "use cache";
  cacheLife("hours");
  cacheTag("store-config");
  return fetchStoreConfig();
}
