const dotenv = require('dotenv');

dotenv.config({ path: '../../.env' });

if (
  !process.env.NEXT_PUBLIC_RECAPTCHA_PUBLIC_KEY ||
  !process.env.RECAPTCHA_SECRET_KEY
) {
  throw new Error('Missing reCAPTCHA keys');
}

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['en-US', 'fr'],
    defaultLocale: 'en-US',
  },
  swcMinify: true,
  reactStrictMode: true,
  images: {
    domains: ['pocket-eu.s3.eu-west-3.amazonaws.com'],
  },
};

module.exports = withBundleAnalyzer(nextConfig);
