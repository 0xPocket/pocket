const dotenv = require('dotenv');

dotenv.config({ path: '../../.env' });

const withPlugins = require('next-compose-plugins');

const withTM = require('next-transpile-modules')([
  '@lib/ui',
  'pocket-contract',
]);

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    images: { allowFutureImage: true },
  },
  images: {
    domains: ['logos.covalenthq.com'],
  },
};

module.exports = withPlugins([withTM, withBundleAnalyzer], nextConfig);
