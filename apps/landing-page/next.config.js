const dotenv = require('dotenv');

dotenv.config({ path: '../../.env' });

const withTM = require('next-transpile-modules')(['@lib/ui']);

/** @type {import('next').NextConfig} */
const nextConfig = {
	i18n :{
		locales: ['en-US', 'fr'],
    defaultLocale: 'en-US',
	},
  reactStrictMode: true,
};

module.exports = withTM(nextConfig);
