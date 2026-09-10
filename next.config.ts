import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'api.tanmiyatrealestate.com', port: '', pathname: '/uploads/**' },
      { protocol: 'http', hostname: 'localhost', port: '4000', pathname: '/uploads/**' },
    ],
  },
  output: 'standalone',
  async rewrites() {
    const backend = (
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.BACKEND_API_URL ||
      (process.env.NODE_ENV === 'production'
        ? 'https://api.tanmiyatrealestate.com/api'
        : 'http://localhost:4000/api')
    ).replace(/\/$/, '');
    return [{ source: '/api/:path*', destination: `${backend}/:path*` }];
  },
  transpilePackages: ['motion'],
  webpack: (config, { dev }) => {
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = { ignored: /.*/ };
    }
    return config;
  },
};

export default nextConfig;
