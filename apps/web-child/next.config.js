const dotenv = require('dotenv');

dotenv.config({ path: '../../.env' });
dotenv.config({ path: '../../contract.env' });

const withTM = require('next-transpile-modules')(['@lib/ui', '@lib/contract']);

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
};

module.exports = withTM(nextConfig);
