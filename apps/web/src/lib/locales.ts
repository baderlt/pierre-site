export const locales = ['fr', 'en', 'ar'] as const;
export type Locale = (typeof locales)[number];
export const languageNames: Record<Locale, string> = { fr: 'Français', en: 'English', ar: 'العربية' };
export function isLocale(value: string): value is Locale {
  return locales.some(locale => locale === value);
}

/** Preserve the page, query string and fragment when changing a supported locale. */
export function localizedPath(pathname: string, locale: Locale, search = '', hash = '') {
  const parts = pathname.split('/');
  if (isLocale(parts[1] ?? '')) parts[1] = locale;
  else return `/${locale}${search}${hash}`;
  return `${parts.join('/')}${search}${hash}`;
}
