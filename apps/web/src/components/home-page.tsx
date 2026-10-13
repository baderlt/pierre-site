import type {Definition} from '@/lib/catalogue-data';
import type {ProductCardDTO} from '@/lib/catalogue';
import type {ApplicationDTO} from '@/lib/public-content';
import {imageSource} from '@/lib/media';
import Image from './media-image';
import { Brand } from './brand';
import { Icon } from './icon';
import { MaterialPreview } from './material-preview';
import { SectionHeading } from './section-heading';
import { SiteHeader } from './site-header';
import { navigationTargets, type HomeContent } from '@/lib/home-content';
import { languageNames, locales, type Locale } from '@/lib/locales';

function ArrowLink({ href, children, className = '' }: { href: string; children: React.ReactNode; className?: string }) {
  return <a className={`button ${className}`} href={href}>{children}<Icon name="arrow" className="direction-arrow" /></a>;
}

export function HomePage({ locale, content: c,sections,categories,products,applications }: { locale: Locale; content: HomeContent; sections:{key:string;image:string;link:string;cta:string}[];categories:Definition[];products:ProductCardDTO[];applications:ApplicationDTO[] }) {
 const target=(key:string,fallback:string)=>sections.find(s=>s.key===key)?.link||fallback;
 const picture=(key:string)=>sections.find(s=>s.key===key)?.image||'';
  return <>
    <a href="#main" className="skip-link">{c.skip}</a>
    <div id="header-sentinel" aria-hidden="true" />
    <SiteHeader locale={locale} content={{ brand:c.brand,logo:c.logo,nav: c.nav, language: c.language, quote: c.quote, menu: c.menu, close: c.close, footer: { navigation: c.footer.navigation, note: c.footer.note } }} />
    <main id="main" tabIndex={-1}>
      {c.hero.title?<section id="home" className="hero" aria-labelledby="hero-title">
        <div className="hero-art" data-viewer-mode="static" data-integration="milestone-3"><Image src={picture('hero')} alt="" fill sizes="(max-width: 767px) 100vw, 70vw" preload fetchPriority="high" /></div>
        <div className="hero-scrim" />
        <nav className="story-rail" aria-label={c.footer.navigation}>{[0, 1, 2, 4, 3].map((index, order) => <a href={navigationTargets[index]} key={index}><span dir="ltr">0{order + 1}</span>{c.nav[index]}</a>)}</nav>
        <div className="hero-inner container">
          <div className="hero-copy"><p className="eyebrow">{c.hero.eyebrow}</p><h1 id="hero-title">{c.hero.title}</h1><p className="hero-description">{c.hero.description}</p><div className="hero-actions"><ArrowLink href={target('hero','#collection')} className="button-gold">{c.explore}</ArrowLink><MaterialPreview images={products.map(p=>p.image)} content={{ viewer: c.viewer, discover: c.discover, demo: c.demo, close: c.close, hero: { specimen: c.hero.specimen, specimenCopy: c.hero.specimenCopy, preview: c.hero.preview }, collection: { names: products.map(p=>p.name) } }} /></div></div>
        </div>
        <div className="hero-bottom container"><a href="#collection" className="scroll-cue"><span className="scroll-mouse" />{c.hero.scroll}</a><span className="image-credit">{c.temporaryShort}</span></div>
      </section>:<h1 className="container">{c.meta.title}</h1>}

      {c.qualities.length>0 && <section className="qualities" aria-label={c.hero.eyebrow}><div className="container qualities-grid">{c.qualities.map((quality, index) => <div className="quality-item" key={quality.title}><Icon name={['mountain', 'diamond', 'cube', 'leaf', 'shield', 'chat'][index]} /><div><h2>{quality.title}</h2><p>{quality.description}</p></div></div>)}</div></section>}

      {c.collection.title && categories.length>0 && <section id="collection" className="collection section-space container" aria-labelledby="collection-title">
        <div className="section-heading"><div><p className="eyebrow">{c.collection.eyebrow}</p><h2 id="collection-title">{c.collection.title}</h2><p className="section-description">{c.collection.description}</p></div><ArrowLink href="#materials" className="button-border">{c.collection.action}</ArrowLink></div>
        <div className="category-grid">{categories.map((category, index) => <a href={`/${locale}/products?category=${category.slug}`} className="category-card" key={category.id}><div className="category-image"><Image src={category.image} alt={category.name} fill sizes={`(max-width: 359px) 100vw, (max-width: 767px) ${index===categories.length-1?100:50}vw, (max-width: 1023px) 33vw, 20vw`} /></div><div className="category-caption"><div><h3>{category.name}</h3><p>{c.collection.sample}</p></div><span className="round-arrow"><Icon name="arrow" className="direction-arrow" /></span></div></a>)}</div>
      </section>}

      {c.quarry.title && <section id="quarry" className="quarry-section" aria-labelledby="quarry-title">
        <div className="quarry-photo"><Image src={picture('quarry')} alt={c.quarry.caption} fill sizes="(max-width: 767px) 100vw, 55vw" /><span className="image-credit">{c.quarry.caption}</span></div>
        <div className="quarry-copy"><p className="eyebrow">{c.quarry.eyebrow}</p><h2 id="quarry-title">{c.quarry.title}</h2><p>{c.quarry.description}</p><ArrowLink href={target('quarry','#craft')} className="button-gold">{c.quarry.action}</ArrowLink><div className="quarry-details">{c.craft.steps.slice(0, 3).map((step, index) => <span key={step}><Icon name={['mountain', 'cube', 'diamond'][index]} />{step}</span>)}</div></div>
      </section>}

      {c.introduction.title && <section id="about" className="introduction section-space container">
        <div className="introduction-copy"><p className="eyebrow">{c.introduction.eyebrow}</p><h2>{c.introduction.title}</h2><p className="section-description">{c.introduction.description}</p><ArrowLink href={target('introduction','#applications')} className="text-link">{c.introduction.action}</ArrowLink></div>
        <figure className="architecture-photo"><Image src={picture('introduction')} alt={c.applications.names[0]} fill sizes="(max-width: 767px) 100vw, 50vw" /><figcaption className="image-credit">{c.temporaryShort}</figcaption></figure>
      </section>}

      {c.featured.title && products.length>0 && <section id="materials" className="materials-section section-space"><div className="container">
        <SectionHeading {...c.featured} />
        <div className="material-card-grid">{products.map((product, index) => <article className="material-card" key={product.id}><div className="material-card-image"><Image src={product.image} alt={product.image_alt||product.name} fill sizes="(max-width: 767px) 90vw, 33vw" />{product.temporary&&<span className="sample-label">{c.demo}</span>}</div><div className="material-card-copy"><p className="eyebrow">{product.category}</p><h3><a href={`/${locale}/products/${product.slug}`}>{product.name}</a></h3></div></article>)}</div>
      </div></section>}

      {c.craft.title && <section id="craft" className="craft-section section-space container"><div className="craft-copy"><p className="eyebrow">{c.craft.eyebrow}</p><h2>{c.craft.title}</h2><p className="section-description">{c.craft.description}</p></div><ol className="process-steps">{c.craft.steps.map((step, index) => <li key={step}><span className="process-number" dir="ltr">0{index + 1}</span><h3>{step}</h3><Icon name="arrow" className="direction-arrow" /></li>)}</ol></section>}

      {c.applications.title && applications.length>0 && <section id="applications" className="applications-section section-space container"><SectionHeading {...c.applications} /><div className="application-grid">{applications.slice(0,4).map((application, index) => <a className="application-card" href={`/${locale}/applications/${application.slug}`} key={application.slug}><Image src={application.image} alt={application.title} fill sizes="(max-width: 359px) 100vw, (max-width: 767px) 50vw, 25vw" /><span>{application.title}<Icon name="arrow" className="direction-arrow" /></span></a>)}</div><p className="asset-note">{c.temporaryShort}</p></section>}

      {c.quality.title && <section className="quality-section"><div className="container quality-layout"><div><p className="eyebrow">{c.quality.eyebrow}</p><h2>{c.quality.title}</h2><p>{c.quality.description}</p></div><ul>{c.quality.points.map((point, index) => <li key={point}><span dir="ltr">0{index + 1}</span>{point}</li>)}</ul></div></section>}

      {c.contact.title && <section id="contact" className="contact-section section-space container" aria-labelledby="contact-title"><p className="eyebrow">{c.contact.eyebrow}</p><h2 id="contact-title">{c.contact.title}</h2><p className="contact-description">{c.contact.description}</p><div className="contact-status"><Icon name="chat" /><p>{c.contact.status}</p></div></section>}
    </main>
    <aside className="temporary-notice container" aria-label={c.demo}><Icon name="shield" /><p>{c.temporary}</p></aside>
    <footer className="site-footer"><div className="container footer-grid"><div className="footer-brand"><a href={`/${locale}`}><Brand name={c.brand} logo={c.logo}/></a><p>{c.footer.tagline}</p>{c.socials?.length?<nav aria-label="Social">{c.socials.map(s=><a key={s.label} href={s.url} rel="noopener noreferrer">{s.label}</a>)}</nav>:null}</div><div><h2>{c.footer.navigation}</h2><nav aria-label={c.footer.navigation}>{c.nav.map((label, index) => <a href={navigationTargets[index]} key={label}>{label}</a>)}</nav></div><div><h2>{c.footer.materials}</h2><nav aria-label={c.footer.materials}>{categories.map(d=><a key={d.id} href={`/${locale}/products?category=${d.slug}`}>{d.name}</a>)}</nav></div><div><h2>{c.footer.languages}</h2><nav aria-label={c.footer.languages}>{locales.map(item => <a href={`/${item}`} key={item} lang={item} aria-current={item === locale ? 'page' : undefined}>{languageNames[item]}</a>)}</nav></div></div><div className="container footer-bottom"><p>{c.footer.rights}</p><p>{c.footer.note}</p></div></footer>
  </>;
}
