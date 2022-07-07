const dotenv = require('dotenv');

dotenv.config({ path: '../../.env' });
dotenv.config({ path: '../../packages/pocket-contract/.env' });

const withTM = require('next-transpile-modules')([
  '@lib/ui',
  'pocket-contract',
]);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/:path*', // The :path parameter is used here so will not be automatically passed in the query
      },
    ];
  },
  images: { domains: ['tftw-nfts.fra1.digitaloceanspaces.com'] },
};

module.exports = withTM(nextConfig);
