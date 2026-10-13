import {getPage} from '@/lib/api';
import {getContactDetails,getPublicContent} from '@/lib/content-data';
import { notFound } from 'next/navigation';
import '../../public.css';
import { PublicPage, PageHero } from '@/components/public-page';
import { Icon } from '@/components/icon';
import { publicCopy, publicMetadata } from '@/lib/public-content';
import { isLocale, locales } from '@/lib/locales';

type Props = { params: Promise<{ locale: string }> };
export function generateStaticParams() { return locales.map(locale => ({ locale })); }
export async function generateMetadata({params}:Props){const {locale}=await params;if(!isLocale(locale))notFound();const page=await getPage(locale,'contact');return publicMetadata(locale,'contact',typeof page.seo.title==='string'&&page.seo.title||page.title,typeof page.seo.description==='string'&&page.seo.description||page.description,typeof page.seo.image==='string'?page.seo.image:undefined);}
export default async function ContactPage({ params }: Props) {
  const { locale } = await params; if (!isLocale(locale)) notFound(); const [{c,heroImage},details]=await Promise.all([getPublicContent(locale,'contact'),getContactDetails(locale)]);
  return <PublicPage locale={locale} page="contact"><PageHero locale={locale} image={heroImage} eyebrow={c.contact} title={c.contactPageTitle} description={c.contactPageIntro} compact />
    <div className="container contact-page-layout"><section aria-labelledby="channels-title"><p className="eyebrow">TIME STONE</p><h2 id="channels-title">{c.channels}</h2><dl className="contact-channels">{(['phone', 'whatsapp', 'email', 'location'] as const).map((key, i) => !details[key] ? null : <div key={key}><dt>{c.channelNames[i]}</dt><dd>{details[key] ? <bdi>{key==='location'?details[key]:<a href={key==='email'?`mailto:${details.email}`:key==='whatsapp'?`https://wa.me/${details.whatsapp.replace(/\D/g,'')}`:`tel:${details.phone.replace(/[^+0-9]/g,'')}`}>{details[key]}</a>}</bdi> : <span>{c.pending}</span>}</dd></div>)}</dl><p className="content-note">{c.contactNote}</p></section>
      <section className="enquiry-panel" aria-labelledby="enquiry-title"><Icon name="chat" /><p className="eyebrow">{c.demo}</p><h2 id="enquiry-title">{c.enquiry}</h2><p>{c.enquiryText}</p><a className="button button-gold" href={`/${locale}/quote`}>{c.enquiryAction}<Icon name="arrow" className="direction-arrow" /></a><p className="content-note">{c.demoText}</p></section></div>
  </PublicPage>;
}
