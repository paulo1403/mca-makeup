import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  env: {
    TZ: "America/Lima",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "marcelacorderomakeup.my.canva.site",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
