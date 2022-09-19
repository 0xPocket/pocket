// @ts-check
/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const dotenv = require('dotenv');
const { withAxiom } = require('next-axiom');

dotenv.config({ path: '../../.env' });

require('config/env/server');

// const withPlugins = require('next-compose-plugins');

const withTM = require('next-transpile-modules')([
  '@pocket/emails',
  'pocket-contract',
]);

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
	i18n :{
		locales: ['en-US', 'fr'],
    defaultLocale: 'en-US',
	},
  reactStrictMode: true,
  experimental: {
    images: { allowFutureImage: true },
  },
  images: {
    domains: ['logos.covalenthq.com'],
  },
  eslint: {
    dirs: ['pages', 'utils', 'components', 'server'], // Only run ESLint on the 'pages' and 'utils' directories during production builds (next build)
  },
};

module.exports = withTM(withBundleAnalyzer(withAxiom(nextConfig)));
