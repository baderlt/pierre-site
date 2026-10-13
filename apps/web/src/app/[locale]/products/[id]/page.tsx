import {getProduct} from '@/lib/product-data';
import {getCatalogue,getDefinitions} from '@/lib/catalogue-data';
import {imageSource} from '@/lib/media';
import type { Metadata } from 'next';
import Image from '@/components/media-image';
import { notFound } from 'next/navigation';
import '../../../product.css';
import { SiteHeader } from '@/components/site-header';
import { Brand } from '@/components/brand';
import { ProductStudio } from '@/components/product-studio';
import { productConfigurationFromParams, configurationFromParams, productUrl } from '@/lib/product';
import { productCopy } from '@/lib/product-copy';
import { catalogueCopy, catalogueUrl, parseCatalogueQuery } from '@/lib/catalogue';
import { getShell } from '@/lib/content-data';
import { isLocale } from '@/lib/locales';

type Props = { params: Promise<{ locale: string; id: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();
  const product = await getProduct(locale, id);
  if (!product) notFound();
  const site = process.env.SITE_URL;
  return { ...(typeof product.seo?.image==='string'&&product.seo.image?{openGraph:{images:[product.seo.image]}}:{}),title: `${product.seo?.title||product.name} — TIME STONE`, description: typeof product.seo?.description==='string'&&product.seo.description||product.description||productCopy[locale].intro, robots: { index: false, follow: false }, ...(site ? { metadataBase: new URL(site), alternates: { canonical: `/${locale}/products/${id}`, languages: Object.fromEntries(['fr', 'en', 'ar'].map(lang => [lang, `/${lang}/products/${id}`])) } } : {}) };
}
export default async function ProductPage({ params, searchParams }: Props) {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();
  const [product,home,definitions,values] = await Promise.all([getProduct(locale,id),getShell(locale),getDefinitions(locale),searchParams]);
  if (!product) notFound();
  const c = productCopy[locale];
  const catalogue = catalogueCopy[locale];
  const query = parseCatalogueQuery(values);
  const relatedResponse=await getCatalogue(locale,parseCatalogueQuery({stone_type:product.stone_type}),4);
  const related=relatedResponse.data.filter(item=>item.id!==product.id).slice(0,3);
  return <div className="product-page"><a href="#main" className="skip-link">{home.skip}</a><div id="header-sentinel" aria-hidden="true" /><SiteHeader catalogue locale={locale} content={home} />
    <div className="product-header-art" aria-hidden="true"><Image src="/images/quarry.webp" alt="" fill sizes="100vw" /></div>
    <main id="main" tabIndex={-1} className="container product-main"><nav className="product-breadcrumb" aria-label={home.footer.navigation}><a className="product-back" href={catalogueUrl(locale, query)}><span aria-hidden="true">{locale === 'ar' ? '→' : '←'}</span> {c.back}</a><span aria-hidden="true">/</span><span>{product.name}</span></nav>
      <noscript><style>{'.studio-activate,.gallery-thumbnails,.finish-options,.product-configuration{display:none}'}</style><p className="product-note">{c.noScript}</p></noscript>
      <div className="product-layout"><ProductStudio product={product} c={c} locale={locale} query={query} initialConfig={productConfigurationFromParams(values,product)} initialFormatId={typeof values.format_id==='string'&&product.formats.some(f=>f.id===values.format_id)?values.format_id:undefined} information={<section className="product-information" aria-labelledby="product-title">{product.temporary&&<p className="eyebrow">{c.sample}</p>}<h1 id="product-title">{product.name}</h1><p className="product-intro">{product.description}</p><h2 className="sr-only">{c.information}</h2><dl className="material-facts"><div><dt>{c.type}</dt><dd>{definitions.materials.find(d=>d.slug===product.stone_type)?.name}</dd></div><div><dt>{c.tone}</dt><dd>{definitions.colors.find(d=>d.slug===product.color)?.name}</dd></div><div><dt>{c.origin}</dt><dd>{c.pending}</dd></div></dl><section className="product-specifications"><h2>{c.specifications}</h2>{product.verified_specifications.length?<dl>{product.verified_specifications.map(s=><div key={s.label}><dt>{s.label}</dt><dd>{s.value}</dd></div>)}</dl>:<p>{c.specNote}</p>}{product.temporary&&<p className="product-note">{c.temporary}</p>}</section></section>} applications={product.applications?.length||product.application?<section className="product-applications" aria-labelledby="product-applications-title"><h2 id="product-applications-title">{c.applications}</h2><div className="product-application-grid" tabIndex={0} role="region" aria-label={c.applications}>{definitions.applications.filter(a=>product.applications?.includes(a.slug)??a.slug===product.application).map(a=><figure key={a.slug}><div><a href={`/${locale}/applications/${a.slug}`}><Image src={a.image} alt={a.name} fill sizes="(max-width: 767px) 42vw, 12vw"/></a></div><figcaption><a href={`/${locale}/applications/${a.slug}`}>{a.name}</a></figcaption></figure>)}</div><p className="product-note">{c.applicationNote}</p></section>:null} />
      </div>
      <section className="product-related" aria-labelledby="product-related-title"><h2 id="product-related-title">{c.related}</h2><div>{related.map(item => <a key={item.id} href={productUrl(locale, item.slug||item.id, query)}><div className="related-image"><Image src={imageSource(item.image)} alt="" fill sizes="(max-width: 767px) 42vw, 28vw" /></div><h3>{item.name}</h3><span>{c.view} {locale === 'ar' ? '←' : '→'}</span></a>)}</div></section>
    </main><footer className="site-footer"><div className="container"><Brand name={home.brand} logo={home.logo}/>{product.temporary&&<p>{c.temporary}</p>}<a href={catalogueUrl(locale, query)} className="button button-outline">{c.back}</a></div></footer>
  </div>;
}
