'use client';

import { useRef, type ReactNode } from 'react';
import { trapDialogFocus } from './dialog-focus';

export function CatalogueFilters({ children, title, close, label }: { children: ReactNode; title: string; close: string; label: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  return <><button ref={opener} className="button button-gold filter-toggle" type="button" aria-haspopup="dialog" onClick={() => dialog.current?.showModal()}>{label}<span aria-hidden="true">☷</span></button><dialog className="catalogue-drawer" ref={dialog} aria-label={title} onKeyDown={trapDialogFocus} onClose={() => opener.current?.focus()} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}><div className="drawer-heading"><h2>{title}</h2><button className="icon-button" type="button" aria-label={close} onClick={() => dialog.current?.close()}>×</button></div>{children}</dialog></>;
}
