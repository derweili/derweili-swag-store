import { serverEnv } from "@/lib/env/serverEnv";

export const fetchStoreConfig = () => ({
  currency: "USD",
  features: {} as Record<string, boolean>,
  seo: {
    defaultTitle: serverEnv.STORE_NAME,
    defaultDescription: serverEnv.STORE_DESCRIPTION,
    titleTemplate: `%s | ${serverEnv.STORE_NAME}`,
  },
  socialLinks: {
    discord: "",
    github: "",
    twitter: "",
  },
});
