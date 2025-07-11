import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'yxmrdhgsqpzknagfldgz.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/expert-documents/**',
      },
    ],
  },
};

export default nextConfig;
