import type { NextConfig } from "next";
import { serverEnv } from "@/lib/env/serverEnv";

const IS_DEVELOPMENT = process.env.NODE_ENV === "development";

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' ${IS_DEVELOPMENT ? "'unsafe-eval'" : ""}
      https://*.vercel-scripts.com
      https://vercel.live
      https://*.vercel.live;
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https: ${serverEnv.IS_DEVELOPMENT ? "http:" : ""};
  media-src 'self' blob: data:;
  font-src 'self' data:;
  connect-src 'self';
  frame-src 'none';
  frame-ancestors 'none';
  worker-src 'self' blob:;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  ${serverEnv.IS_DEVELOPMENT ? "" : "upgrade-insecure-requests"};
`;

const storeHostname = (() => {
  try {
    return new URL(serverEnv.SWAG_STORE_WOOCOMMERCE_API_URL).hostname;
  } catch {
    return "";
  }
})();

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  cacheComponents: true,
  cacheLife: {
    "store-catalog": {
      stale: 3600, // 1 hour client router cache
      revalidate: 3600, // 1 hour server background revalidation
      expire: 86_400, // 1 day hard expiry
    },
  },
  images: {
    remotePatterns: [
      ...(storeHostname ? [{ protocol: "https" as const, hostname: storeHostname }] : []),
      { protocol: "https", hostname: "images.unsplash.com" },
      {
        protocol: "https",
        hostname: "i8qy5y6gxkdgdcv9.public.blob.vercel-storage.com",
      },
    ],
  },
  async headers() {
    return [
      {
        // Apply security and privacy headers globally
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: cspHeader.replace(/\s+/g, " ").trim(),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
