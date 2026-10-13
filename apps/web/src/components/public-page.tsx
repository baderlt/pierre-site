import {imageSource} from '@/lib/media';
import Image from './media-image';
import { Brand } from './brand';
import { Icon } from './icon';
import { SiteHeader } from './site-header';
import { getPage } from '@/lib/api';
import { getShell } from '@/lib/content-data';
import { languageNames, locales, type Locale } from '@/lib/locales';
import { publicCopy } from '@/lib/public-content';

export async function PublicPage({ locale, page, children }: { locale: Locale; page: 'applications' | 'about' | 'contact' | 'quote'; children: React.ReactNode }) {
  const home = await getShell(locale);
  const c = publicCopy[locale];
  return <div className={`public-page public-${page}`}><a href="#main" className="skip-link">{home.skip}</a><div id="header-sentinel" aria-hidden="true" /><SiteHeader locale={locale} content={home} page={page} />
    <main id="main" tabIndex={-1}>{children}</main>
    <aside className="temporary-notice container"><Icon name="shield" /><p>{c.notice}</p></aside>
    <footer className="site-footer"><div className="container footer-grid"><div className="footer-brand"><a href={`/${locale}`}><Brand name={home.brand} logo={home.logo}/></a><p>{home.footer.tagline}</p>{home.socials?.length?<nav aria-label="Réseaux sociaux">{home.socials.map(s=><a key={s.label} href={s.url} rel="noopener noreferrer">{s.label}</a>)}</nav>:null}</div><div><h2>{home.footer.navigation}</h2><nav aria-label={home.footer.navigation}>{['', '/products', '/applications', '/about', '/about#quarry', '/contact'].map((path, i) => <a key={path} href={`/${locale}${path}`}>{home.nav[i]}</a>)}</nav></div><div><h2>{c.bandAction}</h2><p>{home.footer.note}</p><a className="button button-gold" href={`/${locale}/quote`}>{c.bandAction}<Icon name="arrow" className="direction-arrow" /></a></div><div><h2>{home.footer.languages}</h2><nav aria-label={home.footer.languages}>{locales.map(lang => <a key={lang} href={`/${lang}/${page}`} lang={lang} aria-current={lang === locale ? 'page' : undefined}>{languageNames[lang]}</a>)}</nav></div></div><div className="container footer-bottom"><p>{home.footer.rights}</p><p>{home.footer.note}</p></div></footer>
  </div>;
}

export function PageHero({ locale, image, eyebrow, title, description, compact = false, children }: { locale: Locale; image: string; eyebrow: string; title: string; description: string; compact?: boolean; children?: React.ReactNode }) {
  return <section className={`page-hero ${compact ? 'page-hero-compact' : ''}`} aria-labelledby="page-title"><Image src={image ? imageSource(image) : ""} alt="" fill sizes="100vw" preload fetchPriority="high" /><div className="page-hero-shade" /><div className="container page-hero-inner"><p className="eyebrow">{eyebrow}</p><h1 id="page-title">{title}</h1><p>{description}</p>{children}</div><span className="image-credit">{publicCopy[locale].illustrative}</span></section>;
}

export async function ProjectBand({ locale, contact = false }: { locale: Locale; contact?: boolean }) {
  const c = {...publicCopy[locale]};const page=await getPage(locale,'shared');const section=page.sections.find(s=>s.key==='cta');if(!section)return null;c.contactTitle=section.title;c.bandTitle=section.title;c.contactIntro=section.body;c.contactAction=section.cta;c.bandAction=section.cta;
  return <section className="project-band"><Image src={section.image} alt="" fill sizes="100vw" /><div className="container"><div><p className="eyebrow">{c.contactEyebrow}</p><h2>{contact ? c.contactTitle : c.bandTitle}</h2><p>{c.contactIntro}</p></div><a className="button button-gold" href={section.link||`/${locale}/${contact ? 'contact' : 'quote'}`}>{contact ? c.contactAction : c.bandAction}<Icon name="arrow" className="direction-arrow" /></a></div></section>;
}
