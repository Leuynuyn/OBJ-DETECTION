import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
      {
        source: '/video_feed',
        destination: 'http://localhost:5000/video_feed',
      },
    ];
  },
};

export default nextConfig;
