import {getProduct} from '@/lib/product-data';
import {getPage} from '@/lib/api';
import {quotationOption,getQuotationCopy} from '@/lib/quotation';
import { notFound } from 'next/navigation';
import '../../public.css';
import { PublicPage, PageHero } from '@/components/public-page';
import { QuotationForm } from '@/components/quotation-form';
import { productCopy } from '@/lib/product-copy';
import { productConfigurationFromParams, configurationFromParams, geometryDefaults, type StoneConfiguration } from '@/lib/product';
import { parseCatalogueQuery } from '@/lib/catalogue';
import { publicCopy, publicMetadata } from '@/lib/public-content';
import { countryCodes, quotationCopy, quotationSelectionFromParams, type QuotationProductOption } from '@/lib/quotation';
import { isLocale } from '@/lib/locales';

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };
export async function generateMetadata({params}:Props){const {locale}=await params;if(!isLocale(locale))notFound();const page=await getPage(locale,'quote');return publicMetadata(locale,'quote',typeof page.seo.title==='string'&&page.seo.title||page.title,typeof page.seo.description==='string'&&page.seo.description||page.description,typeof page.seo.image==='string'?page.seo.image:undefined,page.available_locales);}
export default async function QuotePage({ params, searchParams }: Props) {
  const { locale } = await params; if (!isLocale(locale)) notFound(); const values = await searchParams;
  if (values.product !== undefined && typeof values.product !== 'string') notFound();
  const productId = typeof values.product === 'string' ? values.product : '';
  const product = productId ? await getProduct(locale, productId) : null;
  if (productId && !product) notFound();
  const products:QuotationProductOption[]=product?[quotationOption(product)]:[];
  const page=await getPage(locale,'quote');const hero=page.sections.find(s=>s.key==='hero');
  const fallback: StoneConfiguration = product?.saved_3d_configuration ?? { version: 1, shape: 'slab', finish: 'honed', ...geometryDefaults.slab, scale: 1, rotation: 0 };
  const c = {...getQuotationCopy(locale),title:hero?.title||getQuotationCopy(locale).title,intro:hero?.body||page.description}; const site = publicCopy[locale]; const stone = productCopy[locale];
  return <PublicPage locale={locale} page="quote"><PageHero locale={locale} image={hero?.image||''} eyebrow={site.enquiry} title={c.title} description={c.intro} compact /><div className="container quotation-main"><QuotationForm locale={locale} products={products} initialProductId={product?.id||''} initialConfiguration={product?productConfigurationFromParams(values,product):configurationFromParams(values,fallback)} query={parseCatalogueQuery(values)} initialFormatId={typeof values.format_id==='string'&&product?.formats.some(f=>f.id===values.format_id)?values.format_id:undefined} initialFinishId={typeof values.finish_id==='string'&&product?.finish_options?.some(f=>f.id===values.finish_id)?values.finish_id:undefined} initialSelection={quotationSelectionFromParams(values)} countryOptions={countryCodes.map(code => ({ code, label: new Intl.DisplayNames([locale], { type: 'region' }).of(code) ?? code }))} c={c} stone={stone} /></div></PublicPage>;
}
