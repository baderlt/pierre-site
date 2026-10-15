import {apiGet, list, record, str, number} from '@/lib/api';
import {configuredOrigin} from '@/lib/server-config';
import {eligibleLocales} from '@/lib/seo';

export const dynamic = 'force-dynamic';
const headers = {'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex, nofollow'};
const escape = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');

export async function GET() {
  try {
    const origin = configuredOrigin(process.env.SITE_URL);
    const entries: string[] = [];
    let last = 1;
    // XML sitemap limit is 50,000 URLs. API pages stay bounded to 48 records/type.
    for (let page = 1; page <= last; page++) {
      const response = record(await apiGet(`seo?page=${page}`));
      last = number(record(response.meta).last_page, 1, 175);
      for (const value of list(response.data)) {
        const item = record(value), path = str(item.path, 210);
        if (!/^(?:|about|contact|applications|products|(?:products|applications)\/[a-z0-9-]{1,100})$/.test(path)) throw new Error('Invalid sitemap path');
        const languages = eligibleLocales(item.locales);
        const url = (lang: string) => escape(`${origin}/${lang}${path ? '/'+path : ''}`);
        for (const locale of languages) {
          const alternates = languages.map(lang => `<xhtml:link rel="alternate" hreflang="${lang}" href="${url(lang)}"/>`).join('');
          entries.push(`<url><loc>${url(locale)}</loc>${alternates}${languages.includes('fr') ? `<xhtml:link rel="alternate" hreflang="x-default" href="${url('fr')}"/>` : ''}</url>`);
          if (entries.length > 50000) throw new Error('Sitemap limit exceeded');
        }
      }
    }
    return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${entries.join('')}</urlset>`, {headers});
  } catch {
    // An unavailable upstream must never masquerade as an empty successful sitemap.
    return new Response(null, {status: 503, headers});
  }
}
