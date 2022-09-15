import type { NextApiRequest, NextConfig } from 'next';
import config from '../next.config.js';
import { acceptLanguage } from 'next/dist/server/accept-header';
import { IncomingMessage } from 'http';

export function getCurrentLocale(
  req:
    | NextApiRequest
    | (IncomingMessage & {
        cookies: Partial<{
          [key: string]: string;
        }>;
      }),
): string {
  const { i18n } = config as NextConfig;
  if (!i18n) return '';
  const chosenLocale = i18n.locales.find(
    (locale) => locale == req.cookies.NEXT_LOCALE,
  );
  const detectedLocale =
    chosenLocale ??
    acceptLanguage(req.headers['accept-language'], i18n.locales);
  return detectedLocale || i18n.defaultLocale;
}
