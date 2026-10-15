import {localizedMetadata} from '@/lib/seo';
import {imageSource} from '@/lib/media';
import type { Metadata } from 'next';
import '../../catalogue.css';
import Image from '@/components/media-image';
import { notFound,redirect } from 'next/navigation';
import { SiteHeader } from '@/components/site-header';
import { Brand } from '@/components/brand';
import { CatalogueFilters } from '@/components/catalogue-filters';
import { catalogueCopy, categories, facets, sorts, parseCatalogueQuery, catalogueUrl, type CatalogueQuery, type CatalogueCopy } from '@/lib/catalogue';
import { getShell } from '@/lib/content-data';
import { isLocale, type Locale } from '@/lib/locales';
import {getCatalogue,getDefinitions,type Definition} from '@/lib/catalogue-data';
import { productUrl } from '@/lib/product';

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return localizedMetadata(locale,'products',`${catalogueCopy[locale].title} — TIME STONE`,catalogueCopy[locale].intro);
}
function FilterForm({ locale, query, c, prefix,definitions }: { locale: Locale; query: CatalogueQuery; c: CatalogueCopy; prefix: string;definitions:Record<string,Definition[]> }) {
  return <form action={`/${locale}/products#results`} method="get" className="catalogue-filter-form">
    <input type="hidden" name="q" value={query.q} /><input type="hidden" name="sort" value={query.sort} />
    <label htmlFor={`${prefix}-category`}>{c.category}</label><select id={`${prefix}-category`} name="category" defaultValue={query.category}><option value="">{c.all}</option>{definitions.categories.map(d=><option key={d.id} value={d.slug}>{d.name}</option>)}</select>
    {Object.entries(facets).map(([key, values]) => <div className="filter-group" key={key}><label htmlFor={`${prefix}-${key}`}>{c[key as keyof CatalogueCopy] as string}</label><select id={`${prefix}-${key}`} name={key} defaultValue={query[key as keyof CatalogueQuery]}><option value="">{c.all}</option>{(definitions as Record<string,Definition[]>)[{stone_type:'materials',finish:'finishes',color:'colors',application:'applications'}[key]!].map(d=><option key={d.id} value={d.slug}>{d.name}</option>)}</select></div>)}
    <button className="button button-gold" type="submit">{c.apply}</button><a className="button button-border" href={`/${locale}/products#results`}>{c.clear}</a>
  </form>;
}
export default async function ProductsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const paramsValue = await searchParams;
  const query = parseCatalogueQuery(paramsValue);
  const [response,definitions,home] = await Promise.all([getCatalogue(locale, query),getDefinitions(locale),getShell(locale)]);
  const categoryOptions=definitions.categories;
  if(query.page>response.meta.last_page)redirect(catalogueUrl(locale,query,{page:response.meta.last_page}));
  query.page = response.meta.current_page;
  const c = catalogueCopy[locale];
  return <div className="catalogue-page"><a href="#main" className="skip-link">{home.skip}</a><div id="header-sentinel" aria-hidden="true" /><SiteHeader catalogue locale={locale} content={{ brand:home.brand,logo:home.logo,nav: home.nav, language: home.language, quote: home.quote, menu: home.menu, close: home.close, footer: { navigation: home.footer.navigation, note: home.footer.note } }} />
    <main id="main" tabIndex={-1}>
      <section className="catalogue-hero" aria-labelledby="catalogue-title"><Image src={home.banners.hero} alt="" fill sizes="100vw" mobileCrop="banner" preload fetchPriority="high" /><div className="container"><p className="eyebrow">{c.eyebrow}</p><h1 id="catalogue-title">{c.title}</h1><p>{c.intro}</p><span className="image-credit">{home.temporaryShort}</span></div></section>
      <div className="container catalogue-layout" id="results"><aside className="catalogue-sidebar" aria-label={c.filters}><h2>{c.category}</h2><nav aria-label={c.category}>{categoryOptions.map(d=><a key={d.id} href={catalogueUrl(locale,query,{category:d.slug,page:1})} aria-current={query.category===d.slug?'true':undefined}>{d.name}<span>{response.categories[d.slug]||0}</span></a>)}</nav><FilterForm locale={locale} query={query} c={c} prefix="desktop" definitions={definitions}/></aside>
        <section className="catalogue-results" aria-label={c.title}><div className="catalogue-toolbar"><form action={`/${locale}/products#results`} method="get" role="search"><label className="sr-only" htmlFor="catalogue-search">{c.search}</label><input id="catalogue-search" type="search" name="q" defaultValue={query.q} placeholder={c.placeholder} maxLength={100} />{Object.entries(query).filter(([key, value]) => !['q', 'page'].includes(key) && value).map(([key, value]) => <input key={key} type="hidden" name={key} value={value} />)}<button type="submit" aria-label={c.search}>⌕</button></form><CatalogueFilters title={c.filters} close={c.close} label={c.filters}><FilterForm locale={locale} query={query} c={c} prefix="mobile" definitions={definitions}/></CatalogueFilters></div>
          <nav className="catalogue-chips" aria-label={c.category}><a href={catalogueUrl(locale, query, { category: '', page: 1 })} aria-current={!query.category ? 'true' : undefined}>{c.all}</a>{categoryOptions.map(d=><a key={d.id} href={catalogueUrl(locale,query,{category:d.slug,page:1})} aria-current={query.category===d.slug?'true':undefined}>{d.name}</a>)}</nav>
          <div className="catalogue-sort"><p>{response.meta.total} {c.results}</p><form action={`/${locale}/products#results`} method="get">{Object.entries(query).filter(([key, value]) => !['sort', 'page'].includes(key) && value).map(([key, value]) => <input key={key} name={key} type="hidden" value={value} />)}<label htmlFor="catalogue-sort">{c.sort}</label><select id="catalogue-sort" name="sort" defaultValue={query.sort}>{sorts.map((key, index) => <option value={key} key={key}>{c.sorting[index]}</option>)}</select><button type="submit" className="button button-border">{c.apply}</button></form></div>
          <nav className="catalogue-active" aria-label={c.filters}>{Object.entries(facets).map(([key, values]) => { const selected = query[key as keyof CatalogueQuery] as string; if (!selected) return null; const labels = { stone_type: c.stoneNames, finish: c.finishNames, color: c.colorNames, application: c.applicationNames }; return <a className="button button-border" key={key} href={catalogueUrl(locale, query, { [key]: '', page: 1 })}>{(definitions as Record<string,Definition[]>)[{stone_type:'materials',finish:'finishes',color:'colors',application:'applications'}[key]!].find(d=>d.slug===selected)?.name||selected} <span aria-hidden="true">×</span><span className="sr-only">{c.clear}</span></a>; })}</nav>
          {response.data.some(p=>p.temporary)&&<p className="catalogue-notice">{c.temporary}</p>}
          {response.data.length ? <div className="catalogue-grid">{response.data.map(product => <article className="product-card" key={product.id}><a href={productUrl(locale, product.slug||product.id, query)} aria-label={`${c.view} : ${product.name}`}><div className="product-image"><Image defer src={imageSource(product.image)} alt={product.image_alt||product.name} fill sizes="(max-width: 359px) calc((100vw - 48px) / 2), (max-width: 767px) calc((100vw - 56px) / 2), (max-width: 1023px) calc((100vw - 90px) / 3), (max-width: 1099px) calc((100vw - 130px) / 3), (max-width: 1375px) calc((100vw - 410px) / 3), 322px" />{product.temporary&&<span>{c.sample}</span>}</div><div className="product-copy"><h2>{product.name}</h2><p>{categoryOptions.find(d=>d.slug===product.category)?.name}</p><span className="product-arrow" aria-hidden="true">{locale === 'ar' ? '←' : '→'}</span></div></a></article>)}</div> : <div className="catalogue-empty"><h2>{c.empty}</h2><a className="button button-gold" href={`/${locale}/products#results`}>{c.clear}</a></div>}
          <nav className="catalogue-pagination" aria-label={c.page}>{query.page > 1 && <a className="button button-border" rel="prev" href={catalogueUrl(locale, query, { page: query.page - 1 })}>{c.previous}</a>}<span>{c.page} <bdi dir="ltr">{query.page} / {response.meta.last_page}</bdi></span>{query.page < response.meta.last_page && <a className="button button-border" rel="next" href={catalogueUrl(locale, query, { page: query.page + 1 })}>{c.next}</a>}</nav>
          <noscript><details><summary>{c.filters}</summary><FilterForm locale={locale} query={query} c={c} prefix="noscript" definitions={definitions}/></details></noscript>
        </section>
      </div>
      <section className="catalogue-custom"><Image defer src={home.banners.cta} alt="" fill sizes="100vw" /><div className="container"><h2>{c.custom}</h2><p>{c.customText}</p><a className="button button-gold" href={`/${locale}/quote`}>{c.contact}<span aria-hidden="true">{locale === 'ar' ? '←' : '→'}</span></a></div></section>
      <div className="container catalogue-process">{['catalogue-blocks', 'catalogue-tiles', 'architecture'].map((image, index) => <figure key={image}><div><Image defer src={imageSource(image)} alt="" fill sizes="(max-width: 767px) 30vw, 33vw" /></div><figcaption>{c.process[index]}<small>{c.sample}</small></figcaption></figure>)}</div>
    </main><footer className="site-footer"><div className="container"><Brand name={home.brand} logo={home.logo}/>{response.data.some(p=>p.temporary)&&<p className="catalogue-notice">{c.temporary}</p>}<a className="button button-outline" href={`/${locale}`}>{home.nav[0]}</a></div></footer>
  </div>;
}
