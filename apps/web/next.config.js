const dotenv = require('dotenv');

dotenv.config({ path: '../../.env' });

const { env } = require('config/env/server');
require('./lang/compareLang');

const plugins = [];

const withTM = require('next-transpile-modules')([
  '@pocket/emails',
  'pocket-contract',
]);

plugins.push(withTM);

if (env.ANALYZE === 'true') {
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: true,
  });
  plugins.push(withBundleAnalyzer);
}

const { withAxiom } = require('next-axiom');

plugins.push(withAxiom);

/**
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @param {import('next').NextConfig} config - A generic parameter that flows through to the return type
 */
function defineNextConfig(config) {
  return config;
}

const nextConfig = () =>
  plugins.reduce(
    (acc, next) => next(acc),
    defineNextConfig({
      i18n: {
        locales: ['en-US', 'fr'],
        defaultLocale: 'en-US',
      },
      reactStrictMode: true,
      swcMinify: true,
      images: {
        domains: ['logos.covalenthq.com', 'uxwing.com'],
      },
      eslint: {
        dirs: ['pages', 'utils', 'components', 'server', 'hooks'], // Only run ESLint on the 'pages' and 'utils' directories during production builds (next build)
      },
    }),
  );

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   i18n: {
//     locales: ['en-US', 'fr'],
//     defaultLocale: 'en-US',
//   },
//   reactStrictMode: true,
//   images: {
//     domains: ['logos.covalenthq.com'],
//   },
//   eslint: {
//     dirs: ['pages', 'utils', 'components', 'server'], // Only run ESLint on the 'pages' and 'utils' directories during production builds (next build)
//   },
// };

module.exports = nextConfig;
