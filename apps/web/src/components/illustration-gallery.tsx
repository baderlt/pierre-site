'use client';
import {imageSource} from '@/lib/media';

import Image from './media-image';
import { useRef, useState } from 'react';
import { Icon } from './icon';
import { trapDialogFocus } from './dialog-focus';
import type { PublicCopy } from '@/lib/public-content';

export function IllustrationGallery({ images, c }: { images: { id: string; image: string; title: string; subtitle: string }[]; c: Pick<PublicCopy, 'open' | 'close' | 'next' | 'previous' | 'illustrative' | 'gallery'> }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLAnchorElement | null>(null);
  const [selected, setSelected] = useState(0);
  const current = images[selected];
  function change(delta: number) { setSelected(index => (index + delta + images.length) % images.length); }
  if(!current)return null;
  return <><div className="illustration-grid">{images.map((item, index) => <a key={item.id} className="illustration-card" href={imageSource(item.image)} aria-haspopup="dialog" onClick={event => { event.preventDefault(); opener.current = event.currentTarget; setSelected(index); dialog.current?.showModal(); }}><div className="illustration-image"><Image src={imageSource(item.image)} alt="" fill sizes="(max-width: 639px) 90vw, (max-width: 1023px) 45vw, 24vw" /></div><div className="illustration-caption"><div><h3>{item.title}</h3><p>{item.subtitle}</p><small>{c.illustrative}</small></div><span className="icon-button"><Icon name="expand" /><span className="sr-only">{c.open}</span></span></div></a>)}</div>
    <dialog className="illustration-dialog" ref={dialog} aria-labelledby="gallery-title" onKeyDown={trapDialogFocus} onClose={() => opener.current?.focus()} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}><div className="dialog-heading"><div><p className="eyebrow">{c.illustrative}</p><h2 id="gallery-title">{current.title}</h2></div><button className="icon-button" type="button" aria-label={c.close} onClick={() => dialog.current?.close()}><Icon name="close" /></button></div><div className="expanded-illustration"><Image src={imageSource(current.image)} alt={current.title} fill sizes="(max-width: 767px) 90vw, 850px" /></div><div className="gallery-navigation"><button className="button button-border" type="button" onClick={() => change(-1)}>{c.previous}</button><p aria-live="polite" aria-atomic="true">{c.gallery} <bdi>{selected + 1} / {images.length}</bdi></p><button className="button button-border" type="button" onClick={() => change(1)}>{c.next}</button></div></dialog>
  </>;
}
