import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { HomePage } from '@/components/home-page';
import { getHome } from '@/lib/content-data';
import { getSite } from '@/lib/api';
import { getCatalogue,getCategoryDefinitions } from '@/lib/catalogue-data';
import { getApplications } from '@/lib/content-data';
import {parseCatalogueQuery} from '@/lib/catalogue';
import { isLocale, locales } from '@/lib/locales';

export const dynamicParams = false;
export function generateStaticParams() { return locales.map(locale => ({ locale })); }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const {content,page} = await getHome(locale);
  const siteSettings=await getSite(locale);
  const siteUrl = process.env.SITE_URL;
  return {
    title: content.meta.title,
    description: content.meta.description,
    ...(typeof page.seo.image==='string'&&page.seo.image?{openGraph:{images:[page.seo.image]}}:{}),
    robots: { index: false, follow: false },
    icons: { icon: siteSettings.favicon || '/icon.svg' },
    ...(siteUrl ? { metadataBase: new URL(siteUrl), alternates: { canonical: `/${locale}`, languages: { fr: '/fr', en: '/en', ar: '/ar', 'x-default': '/fr' } } } : {})
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const [{content,page},categories,featured,applications]=await Promise.all([getHome(locale),getCategoryDefinitions(locale),getCatalogue(locale,parseCatalogueQuery({}),3),getApplications(locale)]);
  return <HomePage locale={locale} content={content} sections={page.sections} categories={categories} products={featured.data} applications={applications}/>;
}
