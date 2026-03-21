import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, 
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  allowedDevOrigins: ['192.168.100.3', 'localhost'],
};

export default nextConfig;