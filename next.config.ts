import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Temporarily ignore type errors during build
    ignoreBuildErrors: true,
  },
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.imghippo.com',
        pathname: '/files/**',
      },
      {
        protocol: 'https',
        hostname: 'quickchart.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'fiodqhsjbxjxqvqywbkr.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
