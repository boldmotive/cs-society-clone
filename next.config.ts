import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'app.base44.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      // SpreadConnect/SPOD image domains
      {
        protocol: 'https',
        hostname: 'image.spreadshirtmedia.com',
      },
      {
        protocol: 'https',
        hostname: 'image.spreadshirtmedia.net',
      },
      {
        protocol: 'https',
        hostname: '*.spreadshirtmedia.com',
      },
      {
        protocol: 'https',
        hostname: '*.spreadshirtmedia.net',
      },
      {
        protocol: 'https',
        hostname: 'spreadconnect.app',
      },
      {
        protocol: 'https',
        hostname: '*.spreadconnect.app',
      },
      {
        protocol: 'https',
        hostname: 'spod.com',
      },
      {
        protocol: 'https',
        hostname: '*.spod.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/llm.txt',
        destination: '/llms.txt',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/llms.txt',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600',
          },
        ],
      },
    ];
  }
};

export default nextConfig;
