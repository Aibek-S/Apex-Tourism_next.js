import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standard App Router configuration
  reactStrictMode: true,
  // Configure page extensions to include TypeScript files
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  // Configure TypeScript handling
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;