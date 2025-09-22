import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // Increase as needed
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "rvsutvucekroxhwgobmu.supabase.co",
      },
    ],
  },
  eslint: {
    // 🚀 This skips ESLint errors during production builds (Vercel)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 🚀 This skips TypeScript errors during production builds
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
