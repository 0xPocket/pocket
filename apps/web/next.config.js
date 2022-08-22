// @ts-check
/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const dotenv = require('dotenv');
const { withAxiom } = require('next-axiom');

dotenv.config({ path: '../../.env' });

require('./server/env');

// const withPlugins = require('next-compose-plugins');

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

module.exports = withTM(withBundleAnalyzer(withAxiom(nextConfig)));
