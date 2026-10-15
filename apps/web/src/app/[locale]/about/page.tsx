import {getPage} from '@/lib/api';
import { getAboutContent } from '@/lib/content-data';
import {imageSource} from '@/lib/media';
import Image from '@/components/media-image';
import { notFound } from 'next/navigation';
import '../../public.css';
import { PublicPage, PageHero, ProjectBand } from '@/components/public-page';
import { Icon } from '@/components/icon';
import { publicCopy, publicMetadata } from '@/lib/public-content';
import { isLocale, locales } from '@/lib/locales';

type Props = { params: Promise<{ locale: string }> };
export function generateStaticParams() { return locales.map(locale => ({ locale })); }
export async function generateMetadata({params}:Props){const {locale}=await params;if(!isLocale(locale))notFound();const page=await getPage(locale,'about');return publicMetadata(locale,'about',typeof page.seo.title==='string'&&page.seo.title||page.title,typeof page.seo.description==='string'&&page.seo.description||page.description,typeof page.seo.image==='string'?page.seo.image:undefined,page.available_locales);}
export default async function AboutPage({ params }: Props) {
  const { locale } = await params; if (!isLocale(locale)) notFound(); const c = await getAboutContent(locale);
  return <PublicPage locale={locale} page="about"><PageHero locale={locale} image={c.heroImage} eyebrow={c.about} title={c.aboutTitle} description={c.aboutIntro} compact />
    {c.companyTitle&&<section className="container company-section" aria-labelledby="company-title"><div><p className="eyebrow">{c.company}</p><h2 id="company-title">{c.companyTitle}</h2><p>{c.companyText}</p><p>{c.companyDraft}</p><a className="button button-gold" href={`/${locale}/products`}>{c.products}<Icon name="arrow" className="direction-arrow" /></a></div><figure className="company-image"><Image src={c.storyImage} alt={c.galleryNames[0]} fill sizes="(max-width: 767px) 90vw, 32vw" /><figcaption className="image-credit">{c.illustrative}</figcaption></figure><ul className="company-values">{c.qualityTitles.map((title, i) => <li key={title}><Icon name={['diamond', 'cube', 'leaf', 'shield'][i]} /><div><h3>{title}</h3><p>{c.qualityTexts[i]}</p></div></li>)}</ul></section>}
    {c.qualityNote&&<aside className="quality-note"><div className="container"><Icon name="shield" /><p>{c.qualityNote}</p></div></aside>}
    {c.material.title&&<section id="quarry" className="container materials-editorial"><figure><Image src={imageSource(c.material.image)} alt="" fill sizes="(max-width: 767px) 90vw, 45vw" /><figcaption className="image-credit">{c.illustrative}</figcaption></figure><div><p className="eyebrow">{c.process}</p><h2>{c.material.title}</h2><p>{c.material.text}</p><a className="button text-link" href={`/${locale}/products`}>{c.products}<Icon name="arrow" className="direction-arrow" /></a></div></section>}
    {c.processTitle&&c.stages.length>0&&<section className="container quarry-process" aria-labelledby="process-title"><div className="process-intro"><p className="eyebrow">{c.process}</p><h2 id="process-title">{c.processTitle}</h2><p>{c.processIntro}</p></div><ol className="process-card-grid">{c.stages.map((stage, i) => <li key={stage.id}><figure><Image src={imageSource(stage.image)} alt="" fill sizes="(max-width: 639px) 45vw, 20vw" /><span className="process-index" dir="ltr">0{i + 1}</span></figure><div><h3>{stage.title}</h3><p>{stage.text}</p></div></li>)}</ol></section>}<ProjectBand locale={locale} contact />
  </PublicPage>;
}
