import type {Metadata} from 'next';
import {locales, type Locale} from './locales';

export function eligibleLocales(value: unknown): Locale[] {
  return Array.isArray(value) ? locales.filter(locale => value.includes(locale)) : [];
}

export function localizedMetadata(locale: Locale, path: string, title: string, description: string, image?: string, eligible: readonly Locale[] = locales): Metadata {
  const site = process.env.SITE_URL;
  const route = (lang: string) => `/${lang}${path ? '/'+path : ''}`;
  const languages = Object.fromEntries(eligible.map(lang => [lang, route(lang)]));
  if (eligible.includes('fr')) languages['x-default'] = route('fr');
  return {
    title, description, robots: {index: false, follow: false},
    ...(site ? {metadataBase: new URL(site), alternates: {canonical: route(locale), languages}} : {}),
    openGraph: {type: 'website', title, description, locale, alternateLocale: eligible.filter(lang => lang !== locale), ...(site ? {url: route(locale)} : {}), ...(image ? {images: [image]} : {})},
  };
}
