import type { NextConfig } from "next";
import { serverEnv } from "@/lib/env/serverEnv";

const cspHeader = `
  default-src 'self';
  script-src 'self'
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

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  cacheComponents: true,
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
