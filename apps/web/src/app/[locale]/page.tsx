import {localizedMetadata} from '@/lib/seo';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { HomePage } from '@/components/home-page';
import {HomeQuotation} from '@/components/home-quotation';
import {HomeLocation} from '@/components/home-location';
import {homepageAdditions} from '@/lib/magasin';
import {getQuotationCopy,countryCodes} from '@/lib/quotation';
import {productCopy} from '@/lib/product-copy';
import {geometryDefaults} from '@/lib/product';
import '../home-targeted.css';
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
  return {...localizedMetadata(locale,'',content.meta.title,content.meta.description,page.seo.image||undefined,page.available_locales),icons:{icon:siteSettings.favicon||'/icon.svg'}};
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const [{content,page},categories,featured,applications,site]=await Promise.all([getHome(locale),getCategoryDefinitions(locale),getCatalogue(locale,parseCatalogueQuery({}),3),getApplications(locale),getSite(locale)]);
  const additions=homepageAdditions[locale];
  const quotation=<HomeQuotation open={additions.openForm} loading={additions.loading} quotePage={additions.quotePage} formProps={{locale,products:[],initialProductId:'',initialConfiguration:{version:1,shape:'slab',finish:'honed',...geometryDefaults.slab,scale:1,rotation:0},query:parseCatalogueQuery({}),initialSelection:{quantity:'1',unit:'piece'},countryOptions:countryCodes.map(code=>({code,label:new Intl.DisplayNames([locale],{type:'region'}).of(code)??code})),c:getQuotationCopy(locale),stone:productCopy[locale]}}/>;
  const location=<HomeLocation locale={locale} address={site.contacts.location} url={site.contacts.maps_directions_url}/>;
  const website = process.env.SITE_URL && content.brand ? {'@context':'https://schema.org','@type':'WebSite',url:process.env.SITE_URL,name:content.brand,inLanguage:locale} : null;
  return <><HomePage locale={locale} content={content} sections={page.sections} categories={categories} products={featured.data} applications={applications} quotation={quotation} location={location}/>{website && <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(website).replaceAll('<','\\u003c')}}/>}</>;
}
