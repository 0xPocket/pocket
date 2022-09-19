const dotenv = require('dotenv');

dotenv.config({ path: '../../.env' });

const withTM = require('next-transpile-modules')(['@lib/ui']);

if (
  !process.env.NEXT_PUBLIC_RECAPTCHA_PUBLIC_KEY ||
  !process.env.RECAPTCHA_SECRET_KEY
) {
  throw new Error('Missing reCAPTCHA keys');
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['en-US', 'fr'],
    defaultLocale: 'en-US',
  },
  reactStrictMode: true,
  images: {
    domains: ['pocket-eu.s3.eu-west-3.amazonaws.com'],
  },
  experimental: {
    images: { allowFutureImage: true },
  },
};

module.exports = withTM(nextConfig);
