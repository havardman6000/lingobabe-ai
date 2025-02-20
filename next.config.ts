import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
  },
  // Help with Netlify compatibility
  experimental: {
    serverComponentsExternalPackages: [],
  }
};

export default nextConfig;