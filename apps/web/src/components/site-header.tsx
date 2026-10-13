'use client';

import { useEffect, useRef, useState } from 'react';
import { Brand } from './brand';
import { Icon } from './icon';
import { trapDialogFocus } from './dialog-focus';
import { languageNames, locales, localizedPath, type Locale } from '@/lib/locales';
import { type HomeContent } from '@/lib/home-content';

export type HeaderContent = Pick<HomeContent, 'nav' | 'language' | 'quote' | 'menu' | 'close'> & { brand?:string;logo?:string; footer: Pick<HomeContent['footer'], 'navigation' | 'note'> };

export function SiteHeader({ locale, content, catalogue = false, page }: { locale: Locale; content: HeaderContent; catalogue?: boolean; page?: 'applications' | 'about' | 'contact' | 'quote' }) {
  const targets = ['', '/products', '/applications', '/about', '/about#quarry', '/contact'].map(path => `/${locale}${path}`);
  const active = page ? { applications: 2, about: 3, contact: 5, quote: -1 }[page] : catalogue ? 1 : 0;
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const sentinel = document.getElementById('header-sentinel');
    if (!sentinel) return;
    const observer = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting));
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  function closeMenu() { dialog.current?.close(); }
  return <>
    <header className="site-header" data-scrolled={scrolled}>
      <div className="header-inner">
        <a href={`/${locale}`} className="brand-link"><Brand name={content.brand} logo={content.logo}/></a>
        <nav className="desktop-nav" aria-label={content.footer.navigation}>
          {content.nav.map((label, index) => <a key={label} href={targets[index]} aria-current={index === active ? 'page' : undefined}>{label}</a>)}
        </nav>
        <div className="header-actions">
          <label className="locale-picker"><Icon name="globe" /><span className="sr-only">{content.language}</span>
            <select aria-label={content.language} value={locale} onChange={event => {
              const next = event.target.value as Locale;
              window.location.assign(localizedPath(window.location.pathname, next, window.location.search, window.location.hash));
            }}>{locales.map(item => <option key={item} value={item} lang={item}>{languageNames[item]}</option>)}</select>
          </label>
          <a href={`/${locale}/quote`} className="button button-gold header-quote"><Icon name="chat" />{content.quote}</a>
          <button ref={opener} type="button" className="menu-toggle" aria-label={content.menu} aria-haspopup="dialog" aria-controls="mobile-menu" onClick={() => dialog.current?.showModal()}><Icon name="menu" /></button>
        </div>
      </div>
    </header>
    <dialog ref={dialog} id="mobile-menu" className="mobile-menu" aria-label={content.footer.navigation} onKeyDown={trapDialogFocus} onClose={() => opener.current?.focus()} onClick={event => { if (event.target === event.currentTarget) closeMenu(); }}>
      <div className="menu-sheet">
        <div className="menu-heading"><Brand name={content.brand} logo={content.logo}/><button type="button" className="icon-button" aria-label={content.close} onClick={closeMenu}><Icon name="close" /></button></div>
        <nav aria-label={content.footer.navigation}>{content.nav.map((label, index) => <a key={label} href={targets[index]} onClick={closeMenu}>{label}<Icon name="arrow" className="direction-arrow" /></a>)}</nav>
        <a href={`/${locale}/quote`} className="button button-gold" onClick={closeMenu}>{content.quote}<Icon name="arrow" className="direction-arrow" /></a>
        <p className="muted">{content.footer.note}</p>
      </div>
    </dialog>
    <noscript><nav className="no-script-nav">{locales.map(item => <a href={`/${item}${page ? `/${page}` : catalogue ? '/products' : ''}`} key={item} lang={item}>{languageNames[item]}</a>)}{content.nav.map((label, index) => <a key={label} href={targets[index]}>{label}</a>)}</nav></noscript>
  </>;
}
