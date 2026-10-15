import {getPage} from '@/lib/api';
import {getApplications,getPublicContent} from '@/lib/content-data';
import {imageSource} from '@/lib/media';
import Image from '@/components/media-image';
import { notFound } from 'next/navigation';
import '../../public.css';
import { PublicPage, PageHero, ProjectBand } from '@/components/public-page';
import { IllustrationGallery } from '@/components/illustration-gallery';
import { Icon } from '@/components/icon';
import { publicCopy, publicMetadata } from '@/lib/public-content';
import { isLocale, locales } from '@/lib/locales';

type Props = { params: Promise<{ locale: string }> };
export function generateStaticParams() { return locales.map(locale => ({ locale })); }
export async function generateMetadata({params}:Props){const {locale}=await params;if(!isLocale(locale))notFound();const page=await getPage(locale,'applications');return publicMetadata(locale,'applications',typeof page.seo.title==='string'&&page.seo.title||page.title,typeof page.seo.description==='string'&&page.seo.description||page.description,typeof page.seo.image==='string'?page.seo.image:undefined,page.available_locales);}
export default async function ApplicationsPage({ params }: Props) {
  const { locale } = await params; if (!isLocale(locale)) notFound(); const [{c,heroImage},applications]=await Promise.all([getPublicContent(locale,'applications'),getApplications(locale)]);
  return <PublicPage locale={locale} page="applications"><PageHero locale={locale} image={heroImage} eyebrow={c.applications} title={c.applicationsTitle} description={c.applicationsIntro}><a className="button button-gold" href="#application-categories">{c.explore}<Icon name="arrow" className="direction-arrow" /></a></PageHero>
    <nav id="application-categories" className="application-categories public-wide" aria-label={c.applications}>{applications.map((application, i) => <a className="application-tile" key={application.slug} href={`/${locale}/applications/${application.slug}`}><Image src={imageSource(application.image)} alt="" fill sizes="(max-width: 639px) 45vw, (max-width: 1023px) 30vw, 17vw" /><div><h2>{application.title}</h2><p>{application.description}</p></div><Icon name="arrow" className="direction-arrow" /></a>)}</nav>
    <section className="public-wide inspiration-section" aria-labelledby="inspirations-title"><div className="section-heading"><div><p className="eyebrow">{c.inspirations}</p><h2 id="inspirations-title">{c.galleryTitle}</h2><p className="section-description">{c.galleryIntro}</p></div></div><IllustrationGallery c={c} images={applications.flatMap(a=>a.gallery.map((image,index)=>({id:`${a.slug}:${index}`,image,title:a.title,subtitle:a.temporary?c.illustrative:''}))).slice(0,8)} /></section>
    <section className="application-benefits"><div className="public-wide"><h2>{c.bandTitle}</h2><ul>{c.bandItems.map((item, i) => <li key={item}><Icon name={['diamond', 'cube', 'leaf', 'chat'][i]} /><span>{item}</span></li>)}</ul><a className="button button-gold" href={`/${locale}/quote`}>{c.bandAction}<Icon name="arrow" className="direction-arrow" /></a></div></section>
  </PublicPage>;
}
