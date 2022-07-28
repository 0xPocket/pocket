const dotenv = require('dotenv');

dotenv.config({ path: '../../.env' });

const withTM = require('next-transpile-modules')([
  '@lib/ui',
  'pocket-contract',
]);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    images: { allowFutureImage: true },
  },
  images: {
    domains: ['logos.covalenthq.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api-nest/:path*',
        destination: 'http://localhost:5000/:path*', // The :path parameter is used here so will not be automatically passed in the query
      },
    ];
  },
};

module.exports = withTM(nextConfig);
