import {getApplication} from '@/lib/content-data';
import {getCatalogue} from '@/lib/catalogue-data';
import {imageSource} from '@/lib/media';
import { notFound } from 'next/navigation';
import '../../../public.css';
import Image from '@/components/media-image';
import { PublicPage, PageHero, ProjectBand } from '@/components/public-page';
import { IllustrationGallery } from '@/components/illustration-gallery';
import { publicCopy, publicMetadata } from '@/lib/public-content';
import { catalogueCopy, catalogueUrl, parseCatalogueQuery } from '@/lib/catalogue';
import { productUrl } from '@/lib/product';
import { isLocale, locales } from '@/lib/locales';

type Props = { params: Promise<{ locale: string; slug: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };
export async function generateMetadata({ params }: Props) { const { locale, slug } = await params; if (!isLocale(locale)) notFound(); const app = await getApplication(locale,slug); if (!app) notFound(); return publicMetadata(locale, `applications/${slug}`, app.title, app.description,undefined,app.available_locales||[]); }
export default async function ApplicationPage({ params, searchParams }: Props) {
  const { locale, slug } = await params; if (!isLocale(locale)) notFound(); const app = await getApplication(locale,slug); if (!app) notFound(); const c = publicCopy[locale]; const catalogue = catalogueCopy[locale];
  const values = await searchParams;
  const query = { ...app.catalogue, page: parseCatalogueQuery(values).page };
  const products = await getCatalogue(locale, query);
  return <PublicPage locale={locale} page="applications"><PageHero locale={locale} image={app.gallery[0]} eyebrow={c.applications} title={app.title} description={app.description} compact />
    <div className="container application-detail"><a className="button text-link" href={`/${locale}/applications`}>{c.back}</a><section className="application-detail-intro"><div><p className="eyebrow">{c.illustrative}</p><h2>{c.considerationsTitle}</h2><h3 className="stone-types-title">{catalogue.stone_type}</h3><p>{app.stone_types.map(type => catalogue.stoneNames[type === 'marble' ? 1 : 0]).join(' · ')}</p><p className="content-note">{c.relatedNote}</p></div><ul>{app.considerations.map(text => <li key={text}>{text}</li>)}</ul></section><section aria-labelledby="application-gallery-title"><h2 id="application-gallery-title">{c.gallery}</h2><p className="section-description">{c.galleryIntro}</p><IllustrationGallery c={c} images={app.gallery.map((image, i) => ({ id: `${app.slug}:${i}`, image, title: i === 0 ? app.title : c.galleryTitle, subtitle: c.illustrative }))} /></section>
      <section id="related" className="application-related" aria-labelledby="related-title"><div className="section-heading"><div><h2 id="related-title">{c.related}</h2><p className="section-description">{c.relatedNote}</p></div><a className="button button-border" href={catalogueUrl(locale, query)}>{catalogue.back}</a></div><div className="public-product-grid">{products.data.map(product => <a key={product.id} href={productUrl(locale, product.slug||product.id, query)}><div><Image src={imageSource(product.image)} alt="" fill sizes="(max-width: 639px) 90vw, (max-width: 1023px) 45vw, 28vw" /></div><h3>{product.name}</h3><p>{catalogue.sample} <span aria-hidden="true">{locale === 'ar' ? '←' : '→'}</span></p></a>)}</div>{products.meta.last_page > 1 && <nav className="application-pagination" aria-label={catalogue.page}>{Array.from({ length: products.meta.last_page }, (_, i) => <a className="button button-border" key={i} aria-current={products.meta.current_page === i + 1 ? 'page' : undefined} href={`/${locale}/applications/${slug}?page=${i + 1}#related`}>{catalogue.page} {i + 1}</a>)}</nav>}</section>
    </div><ProjectBand locale={locale} /></PublicPage>;
}
